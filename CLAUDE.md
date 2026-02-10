# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Glintlock is a Claude Code plugin that turns Claude into a solo TTRPG Game Master for Shadowdark RPG. Plugin components (agents, commands, skills, hooks) live at the repository root for auto-discovery. The MCP server (`engine/`) provides the game engine tools.

## Development Commands

```bash
# Build the MCP server (must be done before the plugin can be used)
cd engine && npm install && npm run build

# Watch mode for development
cd engine && npm run dev

# Run the built MCP server directly (for testing)
node engine/dist/index.js
```

There are no tests yet. The MCP server is tested by installing the plugin in Claude Code and calling tools interactively.

## Current Build Status

The MCP server is fully built (Phase 1 complete). The plugin shell (agent prompt, commands, skills, hooks) is complete and structured for auto-discovery at the plugin root.

## Architecture

### Two Halves

1. **Plugin shell** — Auto-discovered at plugin root. Agent identity (`agents/gm.md`), slash commands (`commands/`), Shadowdark rules reference (`skills/`), hooks (`hooks/`), and MCP config (`.mcp.json`). Manifest at `.claude-plugin/plugin.json`.

2. **MCP server** (`engine/`) — Fully built. Node.js/TypeScript process spawned by Claude Code over stdio. Exposes 8 tools via `@modelcontextprotocol/sdk`. Uses `better-sqlite3` for game state persistence.

### Data Flow

```
Claude Code (claude --plugin-dir ./glintlock)
  ├── .claude-plugin/plugin.json  → manifest (name, version)
  ├── .mcp.json                   → MCP server config (portable paths)
  ├── agents/gm.md                → GM identity + rules
  ├── commands/                   → slash commands (/glintlock:*)
  ├── skills/                     → Shadowdark rules reference
  ├── hooks/hooks.json            → SessionStart hook
  └── MCP (stdio) ──→ engine/dist/index.js
                        ├── world/state.db          (SQLite ECS)
                        └── engine/data/oracle-tables.json
```

### MCP Server Modules

| File | Implements |
|------|-----------|
| `engine/src/index.ts` | MCP server entry, stdio transport, tool registration |
| `engine/src/db.ts` | SQLite connection, schema initialization, WAL mode |
| `engine/src/tools/ecs.ts` | `get_entity`, `update_entity`, `create_entity`, `query_entities` |
| `engine/src/tools/dice.ts` | `roll_dice` — NdS+M parser, `crypto.randomInt` RNG, advantage/disadvantage |
| `engine/src/tools/oracle.ts` | `roll_oracle` — loads oracle-tables.json, handles subtypes + range matching + multi-column rolls |
| `engine/src/tools/notes.ts` | `add_note` — freeform notes, global or entity-attached |
| `engine/src/tools/session.ts` | `get_session_summary` — PC status, location, recent notes for cold starts |

### ECS Database Pattern

Game state lives in `world/state.db` (SQLite). Entities have a type (`pc`, `npc`, `location`, `item`, `faction`) and components spread across dedicated tables: `stats`, `health`, `character_info`, `spells`, `position`, `inventory`, `description`, `location_data`, `combat_data`. Notes and session metadata have their own tables.

Entity IDs are auto-generated from type + name (e.g. `npc_merchant_vela`). The `update_entity` tool supports four operations: `set` (replace), `delta` (add/subtract), `push` (append to JSON array), `remove` (delete from JSON array). JSON arrays in SQLite columns store things like inventory items, known spells, and location connections.

### Oracle Tables

`engine/data/oracle-tables.json` has three table formats:
- **Flat array**: Index by dice roll (e.g. `background` — 1d20 maps to array index)
- **Range object**: Keys are ranges like `"2-4"`, `"5-6"` (e.g. `creature_activity`)
- **Multi-column**: Independent roll per column, results concatenated (e.g. `adventure_name` has `name_1`, `name_2`, `name_3`)
- **Subtypes**: `npc_name` has per-ancestry arrays selected by a `subtype` parameter

Four d100 tables (`treasure_0_3`, `something_happens`, `rumors`, `random_encounter_ruins`) are fully populated.

### Environment Variables

The MCP server reads two env vars (set in `.mcp.json`):
- `GLINTLOCK_DB_PATH` — SQLite database path (default: `./world/state.db`)
- `GLINTLOCK_ORACLE_PATH` — Oracle tables JSON path (default: `./engine/data/oracle-tables.json`)

### Config Details

- ESM modules (`"type": "module"` in package.json)
- TypeScript target: ES2022
- Module resolution: node
- Strict mode enabled

## Key Spec Reference

`glintlock-plugin-spec.md` is the authoritative source for:
- All 8 MCP tool input/output schemas
- Complete SQLite schema (12 tables + indexes)
- GM agent prompt and behavior rules
- Oracle table data structures
- Post-session expertise extraction design
- Production persistence lifecycle (E2B + R2)

Read this file before implementing any engine code.

## When Acting as GM

When the plugin is active during Shadowdark play:
- ALWAYS use `roll_dice` for ALL mechanical resolution — never simulate randomness
- ALWAYS use `roll_oracle` for random content instead of inventing it
- The ECS (`world/state.db`) is ground truth — query before narrating, update immediately after
- Use `add_note` for significant events, rulings, and plot threads
- Standard DCs: easy 9, normal 12, hard 15, extreme 18
- Only call for checks when: time pressure + consequences + requires skill
