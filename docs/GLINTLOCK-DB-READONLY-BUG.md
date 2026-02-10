# Glintlock Engine: Persistent "readonly database" Error in Cowork Mode

## Summary

The glintlock-engine MCP server consistently fails to write to its SQLite database when running inside Claude Cowork sessions. Every `create_entity`, `update_entity`, and `add_note` call returns `"attempt to write a readonly database"`. Read operations (`get_entity`, `query_entities`, `roll_dice`, `roll_oracle`, `get_session_summary`) work fine.

This is **not a Docker issue**. It is a file-ownership mismatch caused by how Cowork's sandboxed VM handles plugin filesystem mounts and process identity.

---

## Root Cause

There are two cascading failures in the database path resolution.

### Failure 1: The configured path is on a read-only mount

The plugin's `.mcp.json` sets:

```json
"env": {
  "GLINTLOCK_DB_PATH": "${CLAUDE_PLUGIN_ROOT}/world/state.db"
}
```

But in Cowork, the entire plugin directory is mounted **read-only** via bindfs:

```
bindfs on /sessions/.../glintlock type fuse.bindfs (ro,nosuid,nodev,relatime,...)
```

The `db.js` write-probe correctly detects this and falls back to the hardcoded path `/tmp/glintlock/world/state.db`.

### Failure 2: The fallback path has the wrong owner

The `/tmp` fallback directory and database files are created by a process running as `nobody:nogroup` (UID 65534). But the Node MCP server process runs as the session user `gallant-confident-noether` (UID 1012):

```
/tmp/glintlock/world/state.db    -rw-r--r--  nobody:nogroup  4096
/tmp/glintlock/world/state.db-shm -rw-r--r--  nobody:nogroup  32768
/tmp/glintlock/world/state.db-wal -rw-r--r--  nobody:nogroup  350232
```

File permissions are `644` — owner can read/write, everyone else can only read. Since the Node process is not `nobody`, SQLite opens the file read-only. Confirmed by `lsof`:

```
node  18  gallant-confident-noether  21rr  REG  259,2  4096  /tmp/glintlock/world/state.db
```

The `rr` file descriptor mode means **read-only**. That's the direct cause of the SQLite error.

### Why the ownership mismatch exists

Something in the Cowork VM lifecycle creates the `/tmp/glintlock/` directory tree before the MCP server starts — possibly during plugin installation, a warm-up phase, or an init script running as root/nobody. By the time the actual MCP server process starts (as the session user), the directory and files already exist with `nobody` ownership, and the session user cannot write to them or change their permissions:

```
chmod: changing permissions of '/tmp/glintlock/world/state.db': Operation not permitted
```

---

## Diagnostic Evidence

| Check | Result |
|-------|--------|
| Node process user | `gallant-confident-noether` (UID 1012) |
| DB file owner | `nobody` (UID 65534) |
| DB file permissions | `-rw-r--r--` (644) |
| DB directory permissions | `drwxr-xr-x` (755), owned by `nobody` |
| lsof FD mode | `rr` (read-only) |
| Plugin mount | `bindfs (ro)` — read-only |
| `.mcpb-cache` mount | `bindfs (rw)` — read-write, but unused by engine |
| `/tmp` writable? | Yes, for session user |
| Can chown DB files? | No — Operation not permitted |
| Session user groups | Only own group (1012), not in `nogroup` (65534) |

### Timeline reconstruction

1. Cowork VM starts, mounts plugin directory read-only
2. Something (init? warmup?) runs as `nobody` and triggers the engine, which creates `/tmp/glintlock/world/state.db` owned by `nobody`
3. Actual game session starts, MCP server process runs as `gallant-confident-noether`
4. `db.js` write-probe fails on the plugin path (read-only mount) — falls back to `/tmp`
5. `/tmp/glintlock/world/` already exists, owned by `nobody`
6. SQLite opens `state.db` — can read (world-readable) but cannot write (not owner)
7. All write operations fail with "attempt to write a readonly database"

---

## The Unused Writable Path

Cowork provisions a **writable cache directory** specifically for plugin data:

```
bindfs on .../glintlock/.mcpb-cache type fuse.bindfs (rw,...)
```

This directory is empty and writable by the session user. The engine's `db.js` does not know about it. If the database were placed here, the ownership mismatch would not occur.

---

## Proposed Fixes

### Fix 1: Use `.mcpb-cache` as the database path (recommended)

Update `.mcp.json` to point the DB at the writable cache directory:

```json
"env": {
  "GLINTLOCK_DB_PATH": "${CLAUDE_PLUGIN_ROOT}/.mcpb-cache/state.db"
}
```

This is the path Cowork has explicitly provisioned for mutable plugin data. It is mounted read-write and owned by the session user.

### Fix 2: Improve the fallback logic in `db.js`

The current fallback chain is:

1. `$GLINTLOCK_DB_PATH` (or `./world/state.db`) → fails because plugin dir is read-only
2. `/tmp/glintlock/world/state.db` → fails because of ownership mismatch

Add a third fallback that creates a **user-namespaced** temp directory:

```javascript
function resolveWritableDbPath() {
    const configured = path.resolve(process.env.GLINTLOCK_DB_PATH ?? "./world/state.db");
    const fallback = "/tmp/glintlock/world/state.db";
    const userFallback = path.join(os.homedir?.() || `/tmp/glintlock-${process.getuid?.() || 'default'}`, "world/state.db");

    for (const candidate of [configured, fallback, userFallback]) {
        try {
            const dir = path.dirname(candidate);
            mkdirSync(dir, { recursive: true });
            const probe = path.join(dir, ".glintlock-write-probe");
            writeFileSync(probe, "");
            unlinkSync(probe);
            return candidate;
        } catch {
            console.error(`[glintlock] DB path not writable: ${candidate}`);
        }
    }
    throw new Error("[glintlock] FATAL: No writable database path found");
}
```

### Fix 3: Fix the write-probe to also test an existing DB file

The current write-probe only tests whether the *directory* is writable (can create a new file). It does not test whether an *existing* `state.db` file is writable. Add a check:

```javascript
// After directory probe succeeds, also check if existing DB is writable
const dbFile = path.join(dir, "state.db");
if (existsSync(dbFile)) {
    accessSync(dbFile, constants.W_OK); // throws if not writable
}
```

This would catch the case where the directory was writable when the DB was first created, but the DB file itself is now owned by a different user.

---

## What This Is NOT

- **Not a Docker issue.** The MCP server runs as a native Node process inside the Cowork VM, not in a Docker container. The `mcp-docker` system in Cowork is unrelated to this plugin's MCP server.
- **Not a SQLite bug.** SQLite correctly reports that the file descriptor is read-only.
- **Not a code bug in the engine.** The `db.js` fallback logic is reasonable; it just doesn't account for the specific way Cowork handles process identity across VM lifecycle phases.
- **Not a permissions issue the user can fix at runtime.** The session user cannot `chown` or `chmod` files owned by `nobody`.

---

## Environment Details

- **Platform:** Claude Cowork (lightweight Linux VM, Ubuntu 22)
- **Session user:** `gallant-confident-noether` (UID 1012)
- **Node version:** (using `--experimental-sqlite` flag)
- **Plugin path:** `/sessions/.../mnt/.local-plugins/marketplaces/local-desktop-app-uploads/glintlock/`
- **Database path (actual):** `/tmp/glintlock/world/state.db`
- **Filesystem:** ext4 on /dev/nvme0n1p1
- **MCP SDK:** @modelcontextprotocol/sdk ^1.12.1

---

## Reproduction

1. Install the glintlock plugin in Claude Desktop
2. Start a Cowork session with the plugin enabled
3. Call any write operation: `create_entity`, `update_entity`, or `add_note`
4. Observe: `"attempt to write a readonly database"`
5. Confirm: `get_session_summary` and `roll_dice` work (reads succeed, writes fail)

The issue appears on every fresh Cowork session. The database from a prior session may show stale data via read operations (as we observed — a character named "Hesta" from an earlier session was readable but no new data could be written).
