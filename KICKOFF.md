# Glintlock — Claude Code Kickoff

## Setup

```bash
cd ~/glintlock
claude
```

Then run `/init` to let Claude Code discover the project structure.

## Phase 1 Prompt — Build the MCP Server

Paste this into Claude Code:

---

Read `glintlock-plugin-spec.md` — it's the complete architecture spec for this project.

Build Phase 1: the MCP server in `engine/`. The scaffolding is already in place — `package.json`, `tsconfig.json`, placeholder source files. You need to:

1. **`engine/src/db.ts`** — SQLite connection using better-sqlite3. Read `GLINTLOCK_DB_PATH` env var (default `./world/state.db`). Initialize all tables from the schema in the spec (entities, stats, health, character_info, spells, position, inventory, description, location_data, combat_data, notes, session_meta). Enable WAL mode and foreign keys.

2. **`engine/src/tools/ecs.ts`** — Four ECS tools:
   - `get_entity`: Query by ID, name, or type. Returns entity + all components.
   - `update_entity`: Modify a component field. Operations: set, delta, push, remove.
   - `create_entity`: Create entity with auto-generated ID from type+name. Insert into entities table + any provided component tables.
   - `query_entities`: Filter by type, location, component values (dot notation filters).

3. **`engine/src/tools/dice.ts`** — `roll_dice`: Parse NdS+M expressions, use crypto.randomInt for real RNG. Support advantage/disadvantage (roll twice, pick higher/lower). Return individual rolls, modifier, total.

4. **`engine/src/tools/oracle.ts`** — `roll_oracle`: Load oracle-tables.json from `GLINTLOCK_ORACLE_PATH`. Roll on named tables. Handle subtypes (npc_name by ancestry), range matching (2d6 tables with "2-4", "5-6" ranges), and multi-column tables (adventure_name, magic_item_name — roll independently per column).

5. **`engine/src/tools/notes.ts`** — `add_note`: Insert into notes table, optionally attached to entity_id, with optional tag.

6. **`engine/src/tools/session.ts`** — `get_session_summary`: Query PC entity + components, current location, NPCs at same location, recent notes. Support "brief" and "full" detail levels.

7. **`engine/src/index.ts`** — MCP server entry point using @modelcontextprotocol/sdk with StdioServerTransport. Register all 8 tools with their schemas from the spec. Wire each tool handler to the implementation modules.

Run `npm install` then `npm run build`. Fix any TypeScript errors. Then test by running `node dist/index.js` and sending a few JSON-RPC calls to verify the tools work.

The tool schemas are in the spec under "MCP Server Tool Schemas". The SQLite schema is under "SQLite Schema". Follow them precisely.

---

## Phase 2 Prompt — Test the Plugin

After Phase 1 builds successfully:

---

The MCP server builds and runs. Now the plugin shell is already in `.claude-plugin/` — the agent prompt, commands, hooks, and skills are all written. 

Restart yourself in this directory and verify:
1. The MCP server starts (check that `glintlock-engine` appears in your MCP server list)
2. You can call `roll_dice` with expression "3d6"
3. You can call `create_entity` to make a test PC
4. You can call `get_entity` to read it back
5. You can call `roll_oracle` with table "npc_name" and subtype "dwarf"

If all tools respond correctly, try running `/glintlock:new-session` and go through character creation.

---

## Phase 3 Prompt — Complete Oracle Data

After playtesting, upload the Shadowdark GM Quickstart Guide PDF and paste:

---

I've uploaded the Shadowdark GM Quickstart Guide. Extract the complete data for these d100 oracle tables and update `engine/data/oracle-tables.json`:

1. **treasure_0_3** (d100) — each entry has item name, value, and quality (poor/normal/fabulous/legendary)
2. **something_happens** (d100) — event descriptions  
3. **rumors** (d100) — rumor text
4. **random_encounter_ruins** (d100) — encounter descriptions

Also extract all room descriptions from "The Lost Citadel of the Scarlet Minotaur" adventure and update `.claude-plugin/skills/shadowdark-adventure/SKILL.md` with the full room key (all 27 areas).

---

## Notes

- The plugin shell (agents, commands, skills, hooks) is already complete and ready to use
- Only the MCP server TypeScript needs to be built
- Oracle tables: small tables are complete, d100 tables need PDF extraction
- Adventure module: room descriptions need PDF extraction
- `world/state.db` is auto-created on first MCP server run
- `world/expertise.yaml` is a template, will be populated after play sessions
- No Docker, no E2B, no backend needed — this is all local Claude Code
