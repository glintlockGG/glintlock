# Glintlock MCP Engine: Cowork Mode Diagnostic Report

**Date:** February 10, 2026
**Environment:** Cowork mode (Linux VM sandbox, Ubuntu 22)
**Node.js:** v22.22.0 | npm 10.9.4
**Plugin version:** 0.1.0

---

## Executive Summary

The Glintlock MCP engine (`roll_dice`, `create_entity`, `roll_oracle`, and all other tools) **works correctly** when it can start. The code, the tool schemas, the SQLite database, the oracle tables, and the dice logic are all sound.

The tools are unreachable in Cowork mode because the MCP server **never starts**. The startup script fails immediately due to a read-only filesystem. This is a deployment packaging issue, not a code bug.

---

## Root Cause

The plugin directory is mounted **read-only** in Cowork mode:

```
dr-x------ glintlock/           # permissions: 500 (r-x------)
dr-x------ glintlock/engine/    # same
```

The startup script `engine/scripts/start-engine.sh` attempts to run `npm install` inside the plugin directory to install `@modelcontextprotocol/sdk` and `zod`. This fails because the filesystem is read-only:

```
scripts/start-engine.sh: line 9: install.log: Read-only file system
npm install failed, check .../engine/install.log
```

The server process exits with code 1. The MCP tools are never registered with the host environment.

---

## Failure Chain

```
1. Cowork launches plugin
2. .mcp.json tells Cowork to spawn: bash start-engine.sh
3. start-engine.sh checks for node_modules/ → missing
4. Runs npm install → FAILS (read-only FS, can't mkdir node_modules/)
5. Can't even write install.log → FAILS
6. Script exits 1
7. MCP server never starts
8. Tools (roll_dice, create_entity, etc.) never register
9. glintlock:gm agent spawns with allowedTools: ["mcp:glintlock-engine:*"]
10. No matching tools exist → agent has no dice/ECS tools
11. Agent hallucinates dice results or reports tools unavailable
```

**Secondary issue:** Even if `npm install` succeeded, the `world/` directory for `state.db` doesn't exist and can't be created in the read-only filesystem. The `db.ts` module calls `mkdirSync(path.dirname(dbPath), { recursive: true })` which would also fail.

---

## Proof: Engine Works When Dependencies Are Available

I manually copied the engine to a writable location, installed dependencies, and tested the MCP server over stdin. All tools responded correctly:

**roll_dice:**
```json
// Request: {"expression": "3d6", "purpose": "test STR"}
// Response:
{"expression":"3d6","rolls":[6,1,5],"modifier":0,"total":12,"purpose":"test STR"}
```

**roll_oracle:**
```json
// Request: {"table": "npc_name", "subtype": "human"}
// Response:
{"table":"npc_name","roll":9,"result":"Hariko","subtype":"human"}
```

The MCP server initializes cleanly, reports its capabilities, and all 8 tools execute without error when given a writable working directory.

---

## What Needs to Change

### Option A: Pre-bundle node_modules (Recommended)

Ship `node_modules/` inside the plugin package. Remove the `npm install` step from `start-engine.sh` entirely.

```bash
# In start-engine.sh, replace the npm install block with:
#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENGINE_DIR="$(dirname "$SCRIPT_DIR")"
cd "$ENGINE_DIR"
exec node --experimental-sqlite dist/index.js
```

**Why this is the best fix:**

- `node_modules/` for this project is ~91 packages, mostly small. Reasonable to bundle.
- No runtime filesystem writes needed in the plugin directory.
- The plugin already ships compiled `dist/` files, so shipping `node_modules/` is consistent.
- Eliminates the `npm install` failure mode entirely.

**Build step to add to your release process:**
```bash
cd engine && npm ci --ignore-scripts && npm run build
# Then package the entire plugin directory including node_modules/
```

### Option B: Copy engine to writable temp directory at startup

Modify `start-engine.sh` to copy the engine to a writable location before running:

```bash
#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENGINE_DIR="$(dirname "$SCRIPT_DIR")"
WORK_DIR="${TMPDIR:-/tmp}/glintlock-engine-$$"

mkdir -p "$WORK_DIR"
cp -r "$ENGINE_DIR/dist" "$ENGINE_DIR/data" "$ENGINE_DIR/package.json" "$ENGINE_DIR/package-lock.json" "$WORK_DIR/"

cd "$WORK_DIR"
npm install --ignore-scripts >"install.log" 2>&1
if [ $? -ne 0 ]; then
  echo "npm install failed" >&2
  exit 1
fi

exec node --experimental-sqlite dist/index.js
```

**Downsides:** Adds ~4 seconds of startup latency for `npm install`. Requires network access. More fragile.

### Database Path: Must Also Be Writable

Regardless of which option you choose, the `GLINTLOCK_DB_PATH` in `.mcp.json` must point to a writable location. In Cowork mode, the plugin root is read-only, so `${CLAUDE_PLUGIN_ROOT}/world/state.db` will fail.

**Options for the DB path:**

1. Use the user's mounted workspace: `${CLAUDE_PLUGIN_ROOT}/../../glintlock-plugin-campaing-playtest/world/state.db` (fragile, depends on mount structure)
2. Use a temp directory: `/tmp/glintlock/state.db` (works but doesn't persist between sessions)
3. Use an environment variable that Cowork sets to a writable data directory (if such a convention exists)
4. Have `start-engine.sh` detect the writable workspace and set `GLINTLOCK_DB_PATH` dynamically

The `.mcp.json` currently sets:
```json
"GLINTLOCK_DB_PATH": "${CLAUDE_PLUGIN_ROOT}/world/state.db"
```

This path will fail in Cowork. You need a strategy for where persistent game state lives when the plugin directory is read-only.

---

## Additional Observations

### The glintlock:gm Agent Subtype

The `agents/gm.md` file specifies `allowedTools: ["mcp:glintlock-engine:*"]`. When the MCP server doesn't start, the Task tool spawns an agent with those permissions but no matching tools are available. The agent then either reports the tools are unavailable or fabricates dice results, which defeats the plugin's core design principle of using `crypto.randomInt` for true randomness.

### The SessionStart Hook

`hooks/scripts/session-start.sh` reads `${CLAUDE_PLUGIN_ROOT}/world/expertise.yaml`. This file doesn't exist (expected — it would be generated after sessions), so the hook silently does nothing. This is fine, but worth noting that the `world/` directory is referenced in multiple places.

### Engine Code Quality

The engine code is clean and well-structured. Key observations:

- `dice.ts` uses `crypto.randomInt` for cryptographically strong randomness. This is overkill for a TTRPG but ensures unbiased results.
- `oracle.ts` handles flat arrays, range objects, multi-column tables, and subtypes correctly.
- `db.ts` uses WAL mode and foreign key constraints. The schema is comprehensive.
- All 8 tools have proper error handling with try/catch returning `isError: true`.
- The MCP SDK integration is correct (tool registration, stdio transport).

### Zod v4 Dependency

The plugin uses `zod: "^4.3.6"`. Zod v4 is relatively new. If you encounter schema validation issues with older MCP SDK versions, this could be a compatibility concern. The MCP SDK `^1.12.1` should support Zod v4, but it's worth verifying if you see unexpected schema errors.

---

## Recommended Fix Priority

1. **Pre-bundle `node_modules/`** in the plugin package (eliminates the startup failure)
2. **Resolve the writable DB path** (so SQLite persistence works)
3. **Simplify `start-engine.sh`** to just `exec node --experimental-sqlite dist/index.js`
4. **Test in Cowork mode** end-to-end after changes

---

## Files Referenced

| File | Purpose |
|------|---------|
| `.mcp.json` | MCP server config — spawns `start-engine.sh` |
| `engine/scripts/start-engine.sh` | Startup script — fails on read-only FS |
| `engine/package.json` | Dependencies: `@modelcontextprotocol/sdk`, `zod` |
| `engine/dist/index.js` | MCP server entry — registers all 8 tools |
| `engine/dist/tools/dice.js` | `roll_dice` implementation — works correctly |
| `engine/dist/tools/oracle.js` | `roll_oracle` implementation — works correctly |
| `engine/dist/tools/ecs.js` | Entity CRUD — works correctly |
| `engine/dist/db.js` | SQLite init — needs writable path |
| `agents/gm.md` | GM agent — references `mcp:glintlock-engine:*` tools |
| `hooks/hooks.json` | SessionStart hook config |
