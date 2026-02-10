# Glintlock — Claude Code Plugin Specification

**Version:** 0.1.0 (MVP)
**Date:** 2026-02-10
**System:** Shadowdark RPG (Quickstart)
**Runtime:** Claude Code (headless) in E2B sandbox
**Model:** Claude Opus 4.6 (single agent)

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│  Glintlock Backend (your server)                         │
│  - User auth, campaign CRUD                              │
│  - R2 storage (state.db, expertise.yaml, transcripts)    │
│  - E2B sandbox lifecycle (spin up, tear down)            │
│  - Post-session Haiku agent (async expertise updates)    │
└──────────────┬───────────────────────────────────────────┘
               │ WebSocket / HTTP
               ▼
┌──────────────────────────────────────────────────────────┐
│  E2B Sandbox (per session, ephemeral)                    │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  Claude Code (headless, Opus 4.6)                   │ │
│  │  + Glintlock Plugin (.claude-plugin/)               │ │
│  └────────────┬────────────────────────────────────────┘ │
│               │ MCP protocol (stdio)                     │
│               ▼                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  glintlock-engine (MCP server, Node.js)             │ │
│  │  - ECS tools (get/update/create/query entity)       │ │
│  │  - roll_dice, roll_oracle, add_note                 │ │
│  │  - get_session_summary                              │ │
│  │  └─→ world/state.db (SQLite)                        │ │
│  │  └─→ data/oracle-tables.json                        │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  world/expertise.yaml  (GM self-improvement state)       │
│  world/sessions/       (session logs)                    │
└──────────────────────────────────────────────────────────┘
```

---

## Plugin File Structure

```
glintlock/
├── .claude-plugin/
│   ├── plugin.json                 # Plugin manifest
│   │
│   ├── agents/
│   │   └── gm.md                   # GM agent prompt (primary identity)
│   │
│   ├── skills/
│   │   ├── shadowdark-core/
│   │   │   └── SKILL.md            # Core rules: checks, DCs, combat, death, rest, light
│   │   ├── shadowdark-spells/
│   │   │   └── SKILL.md            # Spell lists, spellcasting rules, mishaps
│   │   ├── shadowdark-monsters/
│   │   │   └── SKILL.md            # Monster stat blocks and attributes
│   │   ├── shadowdark-treasure/
│   │   │   └── SKILL.md            # Treasure tables, magic items, XP values
│   │   └── shadowdark-adventure/
│   │       └── SKILL.md            # Lost Citadel adventure module (factions, rooms, NPCs)
│   │
│   ├── commands/
│   │   ├── new-session.md          # /glintlock:new-session
│   │   ├── continue-session.md     # /glintlock:continue-session
│   │   ├── end-session.md          # /glintlock:end-session
│   │   ├── status.md               # /glintlock:status (show PC state)
│   │   └── roll.md                 # /glintlock:roll (player-initiated dice roll)
│   │
│   └── hooks/
│       └── session-start.sh        # SessionStart: inject expertise + world summary
│
├── engine/                          # MCP server source
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── index.ts                # MCP server entry point
│   │   ├── db.ts                   # SQLite connection + schema init
│   │   ├── tools/
│   │   │   ├── ecs.ts              # get_entity, update_entity, create_entity, query_entities
│   │   │   ├── dice.ts             # roll_dice
│   │   │   ├── oracle.ts           # roll_oracle
│   │   │   ├── notes.ts            # add_note
│   │   │   └── session.ts          # get_session_summary
│   │   └── data/
│   │       └── oracle-tables.json  # All Shadowdark random tables
│   └── dist/                       # Compiled output
│
├── world/                           # Game state (persisted to R2 between sessions)
│   ├── state.db                    # SQLite ECS database
│   ├── expertise.yaml              # GM self-improvement file
│   └── sessions/                   # Session transcripts/summaries
│
└── scripts/
    ├── init-world.sh               # Initialize fresh campaign (create DB, seed data)
    └── import-state.sh             # Import state bundle from R2 on sandbox start
```

---

## Plugin Manifest (`.claude-plugin/plugin.json`)

```json
{
  "name": "glintlock",
  "version": "0.1.0",
  "description": "Solo TTRPG Game Master for Shadowdark RPG",
  "mcpServers": {
    "glintlock-engine": {
      "command": "node",
      "args": ["./engine/dist/index.js"],
      "env": {
        "GLINTLOCK_DB_PATH": "./world/state.db",
        "GLINTLOCK_ORACLE_PATH": "./engine/data/oracle-tables.json"
      }
    }
  },
  "hooks": {
    "SessionStart": [
      {
        "type": "command",
        "command": "bash .claude-plugin/hooks/session-start.sh"
      }
    ]
  }
}
```

---

## GM Agent Prompt (`.claude-plugin/agents/gm.md`)

```markdown
---
description: "Glintlock Game Master — solo TTRPG play using Shadowdark RPG"
allowedTools:
  - "mcp:glintlock-engine:*"
  - "Read"
---

# Identity

You are the Game Master. You run solo Shadowdark RPG sessions for one player.

You are the world — every NPC, every creaking door, every arrow in the dark. You
narrate scenes, voice characters, adjudicate rules, and respond to whatever the
player throws at you.

You hold ultimate power, yet you want only one thing: to see the player triumph
against terrible odds.

# Voice and Style

- Second person, present tense. "You step into the torchlight..."
- Short paragraphs. Punchy prose. Evocative but tight.
- Sensory details: what they see, hear, smell, feel. Not what they think.
- End scene descriptions with something the player can act on — a sound, a
  choice, a detail that invites action.
- Let silence and ambiguity do work. Don't over-explain.
- NPC dialogue is distinct. Give each NPC a verbal tic, speech pattern, or
  mannerism. Use dialogue tags sparingly.
- Dark, atmospheric tone. Moments of gallows humor are welcome. Sentimentality
  is not.

# Core Principles (from Shadowdark)

**Time** is the most important resource. It must haunt every decision. Torches
burn in real time. Random encounters escalate. Lingering is punished.

**Darkness** is the true foe. Respect it. Nothing makes light sources obsolete.

**Gear** is precious and limited. Every item matters.

**Information** flows freely. If the player searches where a trap is, they find
it. If they listen at a door, they hear what's there. Don't gate information
behind rolls unless there's time pressure.

**Checks** only happen when: there's a negative consequence for failure, the
task requires skill, and there's time pressure. Characters automatically succeed
at what they're trained to do.

**Distance** is loose: close (~5ft), near (~30ft), far (within sight). Nobody
misses a dragon shot over 5 feet.

**Danger** is real. Combat is fast and unfair. Magic is volatile. Monsters are
insidious. Death is permanent.

**Rules vs. Rulings.** You have infinite power with a handful of rules. Stat
checks and standard DCs (easy 9, normal 12, hard 15, extreme 18) can resolve
anything. Make a ruling, roll the dice, keep going.

# Mechanical Resolution

ALWAYS use the `roll_dice` tool for any mechanical resolution. NEVER simulate
or narrate dice results without calling the tool. This is non-negotiable.

**Flow:**
1. Player describes action
2. Determine if a check is needed (see Core Principles above)
3. If yes: announce the check type and DC, call `roll_dice`, narrate the result
4. If no: narrate the outcome freely
5. Call `update_entity` or `create_entity` to persist any state changes
6. Describe what the character newly perceives
7. Wait for player input

**Combat flow:**
1. Determine surprise (if applicable — surprised creatures act after initiative)
2. Call `roll_dice` for initiative (d20 + DEX mod for player, d20 + highest
   enemy DEX mod for GM)
3. On each turn: player declares action → resolve with `roll_dice` → narrate
   → update ECS → describe result
4. On GM turn: monster actions → resolve → narrate → update ECS
5. Check morale when enemies hit half numbers/HP (DC 15 WIS check)

**Random encounters:** In dangerous environments, roll 1d6 at the cadence
matching the danger level. Encounter on a 1.
- Unsafe: every 3 rounds
- Risky: every 2 rounds
- Deadly: every round

**Death:** At 0 HP, character is dying. Death timer = 1d4 + CON mod rounds
(min 1). Each turn roll d20 — natural 20 = rise with 1 HP. Stabilize: DC 15
INT check at close range.

# Tool Discipline

**`roll_dice`** — ALL dice rolls. Attack rolls, damage, checks, initiative, random
encounters, death timers. Always. No exceptions.

**`roll_oracle`** — Random tables. NPC names, encounters, treasure, reactions,
activities, rumors, Something Happens events. Use these to ground fiction in
curated Shadowdark content rather than hallucinating.

**`get_entity` / `query_entities`** — Check world state BEFORE narrating
consequences. Don't guess at HP, inventory, or location. Query first.

**`update_entity` / `create_entity`** — Persist changes IMMEDIATELY after they
happen in the narrative. Don't batch updates. Don't defer. If the goblin takes
5 damage, update the goblin's health NOW, then continue narrating.

**`add_note`** — Record significant events, NPC promises, unresolved threads,
player decisions that matter for continuity. These survive context compaction.

**`get_session_summary`** — Use at session start for recap context.

# Session Management

**Starting a session:** The SessionStart hook automatically loads expertise and
world state. Use this context to provide a brief "Last time..." recap (2-3
sentences). Then set the scene and ask what the player does.

**During play:** Narrate, resolve, update state. Maintain pacing. Don't let
mechanical resolution slow the fiction — roll and narrate in one fluid motion.

**Ending a session:** When the player signals they're done, provide a narrative
closing beat — a cliffhanger, a moment of rest, an ominous portent. Summarize
key events briefly. The post-session system handles the rest.

# What You Do NOT Do

- Do not explain game mechanics unless the player asks
- Do not show raw tool call results to the player
- Do not narrate the player's emotions or inner thoughts
- Do not ask "what do you do?" after every single beat — vary your prompts
- Do not break character to discuss rules unless directly asked
- Do not fudge dice — the roll_dice tool returns real randomness, and you
  honor whatever comes up
- Do not contradict the ECS — if state.db says the player has 3 HP, they have
  3 HP, even if you narrated 5 earlier. The database is ground truth.
```

---

## Commands

### `/glintlock:new-session` (`.claude-plugin/commands/new-session.md`)

```markdown
Start a new Shadowdark campaign.

1. Ask the player: What is your character's name? (or offer to roll randomly)
2. Roll ancestry (d12), class (d4), alignment (d6) — or let the player choose
3. Roll stats: 3d6 in order for STR, DEX, CON, INT, WIS, CHA
4. Roll starting gold: 2d6 × 5 gp
5. Apply ancestry traits, class features, and one talent roll
6. Roll HP: class hit die + CON modifier (minimum 1)
7. Help the player buy gear with starting gold
8. Create all entities in the ECS:
   - The player character (with health, stats, inventory, position components)
   - The starting location
9. Roll or choose a background (d20)
10. Set the opening scene. Describe where the character is and what they perceive.
    Ask what they do.

Use `roll_dice` for every roll. Use `create_entity` to persist the character
and starting location. Use `roll_oracle` for random names if needed.
```

### `/glintlock:continue-session` (`.claude-plugin/commands/continue-session.md`)

```markdown
Continue an existing campaign from where the player left off.

1. Call `get_session_summary` to load current campaign state
2. The SessionStart hook has already loaded expertise context
3. Query the player character's current state (HP, inventory, location)
4. Query the current location and any NPCs present
5. Provide a "Last time on..." recap — 2-3 sentences covering the most recent
   events and the current situation
6. Re-establish the scene: where the character is, what they perceive, what's
   at stake
7. Ask what the player does
```

### `/glintlock:end-session` (`.claude-plugin/commands/end-session.md`)

```markdown
End the current play session gracefully.

1. Find a natural narrative stopping point — a moment of rest, a door about to
   be opened, a cliffhanger
2. Provide a brief closing narration
3. Summarize key events from this session (3-5 bullet points):
   - Significant encounters
   - Items gained or lost
   - NPCs met or killed
   - Locations discovered
   - Unresolved threads
4. Call `add_note` with a session summary tagged to the current session
5. Report the player character's current status (HP, key inventory, location)
6. Tell the player their progress has been saved
```

### `/glintlock:status` (`.claude-plugin/commands/status.md`)

```markdown
Show the player character's current status without breaking narrative flow.

1. Query the player character entity from the ECS
2. Present in a compact format:
   - Name, Ancestry, Class, Level, Title, Alignment
   - HP: current/max
   - Stats: STR, DEX, CON, INT, WIS, CHA (with modifiers)
   - AC, current gear/armor
   - Inventory (list items)
   - Current location
   - XP: current / needed for next level
   - Active conditions or effects
   - Known spells (if spellcaster)
3. Keep it brief and in-character where possible
```

### `/glintlock:roll` (`.claude-plugin/commands/roll.md`)

```markdown
Player-initiated dice roll. Parse the player's request and call `roll_dice`.

Examples:
- "/glintlock:roll 2d6+3" → roll 2d6+3
- "/glintlock:roll strength check" → roll d20 + STR modifier (query PC stats)
- "/glintlock:roll d20" → roll a plain d20

Report the result clearly. If it's a check, announce success or failure based
on the relevant DC.
```

---

## SessionStart Hook (`.claude-plugin/hooks/session-start.sh`)

```bash
#!/bin/bash
# Fires on every session start. Injects expertise + world state summary
# into the GM's initial context.

EXPERTISE_FILE="./world/expertise.yaml"
OUTPUT=""

# Load expertise if it exists
if [ -f "$EXPERTISE_FILE" ]; then
  OUTPUT+="<gm_expertise>"$'\n'
  OUTPUT+="$(cat "$EXPERTISE_FILE")"$'\n'
  OUTPUT+="</gm_expertise>"$'\n'$'\n'
fi

# Note: get_session_summary is called by the GM via MCP tool at session start.
# This hook provides the expertise context. The GM agent prompt instructs it
# to call get_session_summary as its first action.

if [ -n "$OUTPUT" ]; then
  echo "$OUTPUT"
fi
```

---

## MCP Server Tool Schemas

### `get_entity`

```typescript
{
  name: "get_entity",
  description: "Read an entity and all its components from the world state. Query by ID, name, or type. Returns the entity with all attached component data.",
  inputSchema: {
    type: "object",
    properties: {
      entity_id: { type: "string", description: "Exact entity ID (e.g. 'pc_torbin', 'npc_grukk')" },
      name: { type: "string", description: "Entity name to search for (case-insensitive partial match)" },
      entity_type: { type: "string", enum: ["pc", "npc", "location", "item", "faction"], description: "Filter by entity type" }
    },
    // At least one parameter required
  }
}
// Returns: { entity: { id, type, name, created_at, updated_at }, components: { health?: {...}, stats?: {...}, position?: {...}, inventory?: {...}, description?: {...}, ... } }
```

### `update_entity`

```typescript
{
  name: "update_entity",
  description: "Modify a component on an existing entity. Supports set (replace value), delta (add/subtract number), push (add to array), and remove (delete from array) operations.",
  inputSchema: {
    type: "object",
    properties: {
      entity_id: { type: "string", description: "Entity ID to update" },
      component: { type: "string", description: "Component name (e.g. 'health', 'inventory', 'position', 'stats', 'description')" },
      operation: { type: "string", enum: ["set", "delta", "push", "remove"], description: "set: replace field value. delta: add number to field. push: append to JSON array field. remove: delete from JSON array field." },
      field: { type: "string", description: "Field within the component (e.g. 'current' in health, 'items' in inventory)" },
      value: { description: "The value to set, delta, push, or remove. Type depends on operation." }
    },
    required: ["entity_id", "component", "operation", "field", "value"]
  }
}
// Returns: { success: true, entity_id, component, field, old_value, new_value }
```

### `create_entity`

```typescript
{
  name: "create_entity",
  description: "Create a new entity with initial components. The entity ID is auto-generated from type and name (e.g. 'npc_merchant_vela'). Provide any initial component data.",
  inputSchema: {
    type: "object",
    properties: {
      entity_type: { type: "string", enum: ["pc", "npc", "location", "item", "faction"] },
      name: { type: "string", description: "Display name for the entity" },
      components: {
        type: "object",
        description: "Initial component data. Keys are component names, values are objects with the component fields.",
        additionalProperties: true
      }
    },
    required: ["entity_type", "name"]
  }
}
// Returns: { success: true, entity_id, entity: {...}, components: {...} }
```

### `query_entities`

```typescript
{
  name: "query_entities",
  description: "Query entities by type, location, or component values. Returns matching entities with all their components.",
  inputSchema: {
    type: "object",
    properties: {
      entity_type: { type: "string", enum: ["pc", "npc", "location", "item", "faction"] },
      location_id: { type: "string", description: "Filter to entities at this location" },
      filters: {
        type: "object",
        description: "Component field filters. Keys use dot notation: 'component.field'. Values are the expected value. Example: { 'health.current': 0 } finds dead entities.",
        additionalProperties: true
      },
      limit: { type: "number", description: "Max results (default 20)" }
    }
  }
}
// Returns: { count: number, entities: Array<{ entity: {...}, components: {...} }> }
```

### `roll_dice`

```typescript
{
  name: "roll_dice",
  description: "Roll dice using standard notation. Returns individual die results and total. Use for ALL mechanical resolution — attacks, damage, checks, initiative, random encounters, death timers. NEVER simulate dice results.",
  inputSchema: {
    type: "object",
    properties: {
      expression: {
        type: "string",
        description: "Dice expression. Examples: '1d20', '2d6+3', '1d8-1', '3d6', '1d100', '1d20+4'. Supports NdS+M format."
      },
      purpose: {
        type: "string",
        description: "What this roll is for. Logged for session history. Examples: 'Attack roll vs goblin', 'STR check to force door', 'Random encounter check'"
      },
      advantage: {
        type: "boolean",
        description: "If true, roll twice and take the higher result"
      },
      disadvantage: {
        type: "boolean",
        description: "If true, roll twice and take the lower result"
      }
    },
    required: ["expression"]
  }
}
// Returns: { expression, rolls: number[], modifier: number, total: number, advantage?: { rolls: [number[], number[]], chosen: "first"|"second" }, purpose?: string }
```

### `roll_oracle`

```typescript
{
  name: "roll_oracle",
  description: "Roll on a random oracle table from the Shadowdark RPG system. Returns a real random result from curated content. Use instead of inventing NPCs, encounters, treasure, etc.",
  inputSchema: {
    type: "object",
    properties: {
      table: {
        type: "string",
        enum: [
          "npc_name",
          "random_encounter_ruins",
          "something_happens",
          "rumors",
          "treasure_0_3",
          "creature_activity",
          "creature_reaction",
          "starting_distance",
          "trap",
          "hazard_movement",
          "hazard_damage",
          "hazard_weaken",
          "adventure_name",
          "magic_item_name",
          "beastman_npc",
          "ettercap_npc",
          "background",
          "random_gear"
        ],
        description: "Which oracle table to roll on"
      },
      subtype: {
        type: "string",
        description: "Subtype filter. For npc_name: ancestry ('dwarf','elf','goblin','halfling','half_orc','human'). For creature_reaction: CHA modifier as string (e.g. '+2', '-1')."
      }
    },
    required: ["table"]
  }
}
// Returns: { table, roll: number, result: string | object, subtype?: string }
```

### `add_note`

```typescript
{
  name: "add_note",
  description: "Record a freeform text note. Can be global (campaign-level) or attached to a specific entity. Use for: session events, NPC promises, unresolved plot threads, player decisions, rulings made. Notes survive context compaction.",
  inputSchema: {
    type: "object",
    properties: {
      text: { type: "string", description: "The note content" },
      entity_id: { type: "string", description: "Attach note to this entity (optional — omit for global notes)" },
      tag: { type: "string", description: "Optional category tag: 'event', 'ruling', 'thread', 'promise', 'discovery'" }
    },
    required: ["text"]
  }
}
// Returns: { success: true, note_id: number, entity_id?: string, tag?: string }
```

### `get_session_summary`

```typescript
{
  name: "get_session_summary",
  description: "Get a comprehensive summary of the current campaign state for cold starts and session recaps. Returns PC status, current location, recent events, active threads, and key NPCs.",
  inputSchema: {
    type: "object",
    properties: {
      detail_level: { type: "string", enum: ["brief", "full"], description: "brief: PC status + location + last 3 notes. full: everything including all NPCs, items, locations." }
    }
  }
}
// Returns: { pc: {...}, current_location: {...}, npcs_present: [...], recent_notes: [...], session_count: number, ... }
```

---

## SQLite Schema (`engine/src/db.ts`)

```sql
-- Core entity table
CREATE TABLE IF NOT EXISTS entities (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK(type IN ('pc','npc','location','item','faction')),
    name TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Shadowdark stats (ability scores)
CREATE TABLE IF NOT EXISTS stats (
    entity_id TEXT PRIMARY KEY REFERENCES entities(id) ON DELETE CASCADE,
    str INTEGER NOT NULL DEFAULT 10,
    dex INTEGER NOT NULL DEFAULT 10,
    con INTEGER NOT NULL DEFAULT 10,
    int INTEGER NOT NULL DEFAULT 10,
    wis INTEGER NOT NULL DEFAULT 10,
    cha INTEGER NOT NULL DEFAULT 10
);

-- Health tracking
CREATE TABLE IF NOT EXISTS health (
    entity_id TEXT PRIMARY KEY REFERENCES entities(id) ON DELETE CASCADE,
    current INTEGER NOT NULL,
    max INTEGER NOT NULL
);

-- Character class/level info
CREATE TABLE IF NOT EXISTS character_info (
    entity_id TEXT PRIMARY KEY REFERENCES entities(id) ON DELETE CASCADE,
    ancestry TEXT,              -- human, dwarf, elf, goblin, halfling, half_orc
    class TEXT,                 -- fighter, priest, thief, wizard
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    alignment TEXT,             -- lawful, neutral, chaotic
    title TEXT,                 -- current title based on level/class/alignment
    background TEXT,            -- background from d20 table
    ac INTEGER DEFAULT 10,
    languages TEXT DEFAULT '["Common"]'  -- JSON array
);

-- Spellcasting (for priests and wizards)
CREATE TABLE IF NOT EXISTS spells (
    entity_id TEXT PRIMARY KEY REFERENCES entities(id) ON DELETE CASCADE,
    known TEXT DEFAULT '[]',         -- JSON array of spell names
    lost TEXT DEFAULT '[]',          -- JSON array of spells lost until rest
    penance TEXT DEFAULT '[]'        -- JSON array of spells requiring penance (priests)
);

-- Position / location tracking
CREATE TABLE IF NOT EXISTS position (
    entity_id TEXT PRIMARY KEY REFERENCES entities(id) ON DELETE CASCADE,
    location_id TEXT REFERENCES entities(id),
    sub_location TEXT             -- e.g. "behind the southeast bowl", "on the ceiling"
);

-- Inventory
CREATE TABLE IF NOT EXISTS inventory (
    entity_id TEXT PRIMARY KEY REFERENCES entities(id) ON DELETE CASCADE,
    items TEXT NOT NULL DEFAULT '[]',   -- JSON array of item entity IDs
    gold INTEGER DEFAULT 0,
    silver INTEGER DEFAULT 0,
    copper INTEGER DEFAULT 0,
    gear_slots_used INTEGER DEFAULT 0,
    gear_slots_max INTEGER DEFAULT 10
);

-- Description (for any entity)
CREATE TABLE IF NOT EXISTS description (
    entity_id TEXT PRIMARY KEY REFERENCES entities(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    discovered INTEGER DEFAULT 0       -- 0 = unknown to player, 1 = discovered
);

-- Location-specific data
CREATE TABLE IF NOT EXISTS location_data (
    entity_id TEXT PRIMARY KEY REFERENCES entities(id) ON DELETE CASCADE,
    danger_level TEXT DEFAULT 'unsafe' CHECK(danger_level IN ('safe','unsafe','risky','deadly')),
    light TEXT DEFAULT 'dark' CHECK(light IN ('bright','dim','dark')),
    connections TEXT DEFAULT '[]'       -- JSON array of { location_id, direction, description }
);

-- Monster/NPC combat data
CREATE TABLE IF NOT EXISTS combat_data (
    entity_id TEXT PRIMARY KEY REFERENCES entities(id) ON DELETE CASCADE,
    ac INTEGER NOT NULL,
    attacks TEXT NOT NULL DEFAULT '[]', -- JSON array of { name, bonus, damage, range }
    movement TEXT DEFAULT 'near',
    special TEXT DEFAULT '[]',          -- JSON array of special abilities
    morale_broken INTEGER DEFAULT 0,
    is_undead INTEGER DEFAULT 0
);

-- Freeform notes (global or entity-attached)
CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_id TEXT REFERENCES entities(id) ON DELETE CASCADE,  -- NULL for global
    text TEXT NOT NULL,
    tag TEXT,                           -- event, ruling, thread, promise, discovery
    created_at TEXT DEFAULT (datetime('now'))
);

-- Session metadata
CREATE TABLE IF NOT EXISTS session_meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);
-- Expected keys: turn_count, current_scene, campaign_name, sessions_played,
--                danger_level, last_encounter_check, scarlet_minotaur_modifier

-- Indexes
CREATE INDEX IF NOT EXISTS idx_entities_type ON entities(type);
CREATE INDEX IF NOT EXISTS idx_entities_name ON entities(name);
CREATE INDEX IF NOT EXISTS idx_position_location ON position(location_id);
CREATE INDEX IF NOT EXISTS idx_notes_entity ON notes(entity_id);
CREATE INDEX IF NOT EXISTS idx_notes_tag ON notes(tag);
```

---

## Expertise File Structure (`world/expertise.yaml`)

```yaml
# Glintlock GM Expertise — auto-updated by post-session agent
# Do not edit manually during play

last_updated: null
sessions_played: 0

play_style:
  tone: []              # e.g. ["dark", "gritty", "dry humor"]
  pacing: []            # e.g. ["fast combat", "lingers on exploration"]
  preferences: []       # e.g. ["prefers social encounters", "dislikes inventory bookkeeping"]
  dislikes: []          # e.g. ["long descriptions", "meta-game talk"]

narrative_patterns:
  effective: []         # What produced good player engagement
  avoid: []             # What fell flat or annoyed the player

rulings:
  precedents: []        # e.g. ["torches last 6 crawling rounds", "flanking gives advantage"]

player_character:
  name: null
  personality_notes: [] # e.g. ["cautious", "always checks for traps", "talks to every NPC"]
  combat_style: []      # e.g. ["prefers ranged", "rushes in", "tactical"]

world_state_summary: "" # High-level narrative recap for cold starts

unresolved_threads: []  # Active plot hooks, NPC promises, pending quests
```

---

## Oracle Tables Data Structure (`engine/data/oracle-tables.json`)

```json
{
  "npc_name": {
    "dice": "1d20",
    "subtypes": {
      "dwarf": ["Hera","Torin","Ginny","Gant","Olga","Dendor","Ygrid","Pike","Sarda","Brigg","Zorli","Yorin","Jorgena","Trogin","Riga","Barton","Katrina","Egrim","Elsa","Orgo"],
      "elf": ["Sarenia","Ravos","Imeria","Farond","Isolden","Kieren","Mirenel","Riarden","Allindra","Arlomas","Sylara","Tyr","Rinariel","Saramir","Vedana","Elindos","Ophelia","Cydaros","Tiramel","Varond"],
      "goblin": ["Kog","Dibbs","Fronk","Irv","Squag","Mort","Vig","Sticks","Gorb","Yogg","Plok","Zrak","Dent","Krik","Mizzo","Bort","Nabo","Hink","Bree","Kreeb"],
      "halfling": ["Myrtle","Robby","Nora","Percy","Daisy","Jolly","Evelyn","Horace","Willie","Gertie","Peri","Carlsby","Nyx","Kellan","Fern","Harlow","Moira","Sage","Reenie","Wendry"],
      "half_orc": ["Troga","Boraal","Urgana","Zoraal","Scalga","Krell","Voraga","Morak","Draga","Sorak","Varga","Ulgar","Jala","Kresh","Zana","Torvash","Rokara","Gartak","Iskana","Ziraak"],
      "human": ["Hesta","Matteo","Rosalin","Endric","Kiara","Yao","Corina","Rowan","Hariko","Ikam","Mariel","Jin","Hana","Lios","Indra","Remy","Nura","Vakesh","Una","Nabilo"]
    }
  },
  "creature_activity": {
    "dice": "2d6",
    "entries": {
      "2-4": "Hunting",
      "5-6": "Eating",
      "7-8": "Building/nesting",
      "9-10": "Socializing/playing",
      "11": "Guarding",
      "12": "Sleeping"
    }
  },
  "creature_reaction": {
    "dice": "2d6",
    "note": "Add CHA modifier of interacting character",
    "entries": {
      "0-6": "Hostile",
      "7-8": "Suspicious",
      "9": "Neutral",
      "10-11": "Curious",
      "12+": "Friendly"
    }
  },
  "starting_distance": {
    "dice": "1d6",
    "entries": {
      "1": "Close",
      "2-4": "Near",
      "5-6": "Far"
    }
  },
  "background": {
    "dice": "1d20",
    "entries": [
      "Urchin", "Wanted", "Cult Initiate", "Thieves' Guild", "Banished",
      "Orphaned", "Wizard's Apprentice", "Jeweler", "Herbalist", "Barbarian",
      "Mercenary", "Sailor", "Acolyte", "Soldier", "Ranger",
      "Scout", "Minstrel", "Scholar", "Noble", "Chirurgeon"
    ]
  },
  "treasure_0_3": {
    "dice": "1d100",
    "entries": {
      "01": { "item": "Bent tin fork", "value": "1 cp", "quality": "poor" },
      "02-03": { "item": "Muddy torch", "value": "2 cp", "quality": "poor" },
      "...": "// Full d100 table from GM Quickstart Guide"
    }
  },
  "something_happens": {
    "dice": "1d100",
    "entries": {
      "01": "The ground shakes violently and a massive fissure opens",
      "02-03": "An unseen foe leaps out of hiding at close range",
      "...": "// Full d100 table from GM Quickstart Guide"
    }
  },
  "rumors": {
    "dice": "1d100",
    "entries": {
      "01": "An armored beast the size of a ship is rampaging nearby",
      "...": "// Full d100 table from GM Quickstart Guide"
    }
  },
  "random_encounter_ruins": {
    "dice": "1d100",
    "entries": {
      "01": "A mutated cave brute explodes through a crumbling wall",
      "...": "// Full d100 table from GM Quickstart Guide"
    }
  },
  "trap": {
    "dice": "1d12",
    "entries": [
      { "trap": "Crossbow", "trigger": "Tripwire", "damage": "1d6" },
      { "trap": "Hail of needles", "trigger": "Pressure plate", "damage": "1d6/sleep" },
      { "trap": "Toxic gas", "trigger": "Opening a door", "damage": "1d6/paralyze" },
      { "trap": "Barbed net", "trigger": "Switch or button", "damage": "1d6/blind" },
      { "trap": "Rolling boulder", "trigger": "False step on stairs", "damage": "2d6" },
      { "trap": "Slicing blade", "trigger": "Closing a door", "damage": "2d8/sleep" },
      { "trap": "Spiked pit", "trigger": "Breaking a light beam", "damage": "2d8/paralyze" },
      { "trap": "Javelin", "trigger": "Pulling a lever", "damage": "2d8/confuse" },
      { "trap": "Magical glyph", "trigger": "A word is spoken", "damage": "3d6" },
      { "trap": "Blast of fire", "trigger": "Hook on a thread", "damage": "3d10/paralyze" },
      { "trap": "Falling block", "trigger": "Removing an object", "damage": "3d10/unconscious" },
      { "trap": "Cursed statue", "trigger": "Casting a spell", "damage": "3d10/petrify" }
    ]
  },
  "hazard_movement": {
    "dice": "1d12",
    "entries": ["Quicksand","Caltrops","Loose debris","Tar field","Grasping vines","Steep incline","Slippery ice","Rushing water","Sticky webs","Gale force wind","Greased floor","Illusory terrain"]
  },
  "hazard_damage": {
    "dice": "1d12",
    "entries": ["Acid pools","Exploding rocks","Icy water","Lava","Pummeling hail","Steam vents","Toxic mold","Falling debris","Acid rain","Curtain of fire","Electrified field","Gravity flux"]
  },
  "hazard_weaken": {
    "dice": "1d12",
    "entries": ["Blinding smoke","Magnetic field","Exhausting runes","Antimagic zone","Snuffs light sources","Disorienting sound","Magical silence","Numbing cold","Sickening smell","Sleep-inducing spores","Confusing reflections","Memory-stealing"]
  },
  "adventure_name": {
    "dice": "1d20",
    "columns": {
      "name_1": ["Mines","Abbey","Tower","Caves","Barrow","Warrens","Crypt","Monastery","Ruin","Tunnels","Citadel","Tomb","Castle","Temple","Fortress","Isle","Keep","Dungeon","Necropolis","Shrine"],
      "name_2": ["of the Cursed","of the Whispering","of the Bleeding","of the Shrouded","of the Lost","of the Dead","of the Deepwood","of the Fallen","of the Revenant","of the Frozen","of the Shimmering","of the Chaos","of the Abandoned","of the Blighted","of the Forgotten","of the Slumbering","of the Savage","of the Unholy","of the Enchanted","of the Immortal"],
      "name_3": ["Flame","Ghost","Darkness","Peak","Borderlands","King","Twilight","Depths","Jewel","God","Lands","Storm","Swamp","Ravine","Valley","Horde","Skull","Queen","Wastes","Hero"]
    }
  },
  "magic_item_name": {
    "dice": "1d20",
    "columns": {
      "name_1": ["The Crimson","The Ashen","Ortival's","The Doom","The Twilight","The Astral","Krull's","The Vicious","Memnon's","The Blessed","The Infernal","Madeera's","The Whispering","The Unholy","Shune's","The Lost","Ord's","The Righteous","The Demonic","The Primordial"],
      "name_2": ["Blade","Poultice","Rite","Axe","Hammer","Wand","Cape","Tome","Litany","Staff","Scroll","Skull","Bow","Sword","Shield","Dagger","Armor","Orb","Eye","Elixir"],
      "name_3": ["of Thundering Death","of Ages","of the Archmage","of Destruction","of Brak","of Power","of the Covenant","of the Wilds","of the Horde","of Blood","of Time","of the Lich Queen","of the Elders","of Madness","of Withering","of Annihilation","of the Dragon","of the Risen","of Elemental Fury","of the Spirits"]
    }
  },
  "beastman_npc": {
    "dice": "1d10",
    "columns": {
      "name": ["Rat/Gobbo","Barto/Hule","Egor/Ralk","Dent/Borvin","Nila/Bugg","Tail/Ludo","Skred/Billo","Halda/Yarv","Crag/Dorel","Lorga/Mouse"],
      "appearance": ["Patchy/Sickly","Scarred/Fat","Broken jaw or nose","Stooped/Short","Elderly/Stout","Missing ear or tooth","Braided hair/Bald","White fur/Skinny","Clean/Blank stare","Wild eyes/Lanky"],
      "behavior": ["Glares/Lurks","Whispers/Burps","Scratches/Snorts","Picks nose/Growls","Creeps/Rushes","Yawns/Drools","Limps/Sulks","Paces/Chews nails","Polite/Complains","Curses/Silent"]
    }
  },
  "ettercap_npc": {
    "dice": "1d10",
    "columns": {
      "name": ["Skalt/Trisk","Kreel/Bisky","Slivin/Slaask","Tiri/Vilis","Chiska/Liss","Jarla/Miri","Char/Squill","Fisk/Yeek","Chirr/Vim","Rask/Miska"],
      "appearance": ["Groomed/Rotund","Singed fur/Gangly","Blue eyes/Spotted","Pained/Hunched","Springy/Withered","Sickly/Molting","Missing limb/Tall","Scarred/Lumpish","Filthy/Hulking","Jewelry/Clothing"],
      "behavior": ["Preening/Haughty","Twitches/Cowers","Bossy/Skeptical","Delicate/Squeamish","Hasty/Alarmist","Distracted/Mutters","Clicks claws/Hisses","Nosy/Gossips","Critical/Sarcastic","Rude/Surly"]
    }
  },
  "random_gear": {
    "dice": "1d12",
    "entries": ["Torch","Dagger","Pole","Rations (3)","Rope, 60'","Oil, flask","Crowbar","Iron spikes (10)","Flint and steel","Grappling hook","Shield","Caltrops (one bag)"]
  },
  "xp_treasure_quality": {
    "entries": {
      "poor": { "xp": 0, "examples": "Bag of silver, used dagger, knucklebone dice" },
      "normal": { "xp": 1, "examples": "Bag of gold, gem, fine armor, magic scroll" },
      "fabulous": { "xp": 3, "examples": "Magic sword, giant diamond, mithral chainmail" },
      "legendary": { "xp": 10, "examples": "The Staff of Ord, a djinni's wish, a dragon hoard" }
    }
  }
}
```

Note: Entries marked `"..."` need to be filled with the complete table data from the quickstart guides. The structure is defined; the data extraction is mechanical.

---

## Skill Files

### `shadowdark-core/SKILL.md` (excerpt — key rules)

```markdown
---
name: shadowdark-core
description: "Core Shadowdark RPG rules. Load when resolving checks, combat,
movement, death, resting, light, or any mechanical ruling."
---

# Shadowdark RPG Core Rules

## Checks
Roll d20 + stat modifier. Meet or beat the DC to succeed.
- Easy: DC 9
- Normal: DC 12
- Hard: DC 15
- Extreme: DC 18

Only roll checks when: negative consequences for failure, requires skill,
AND time pressure. Characters auto-succeed at trained tasks.

## Advantage / Disadvantage
- Advantage: roll twice, take higher
- Disadvantage: roll twice, take lower
- If both apply, they cancel out

## Natural 20 / Natural 1
- Nat 20: maximum success. Attacks auto-hit + critical (double weapon damage
  dice). Spellcasting: double one numerical effect.
- Nat 1: maximum failure. Attacks auto-miss. Spellcasting: lose spell until
  rest + wizard mishap / priest penance.

## Combat
**Initiative:** Everyone rolls d20 + DEX mod. Highest goes first, then clockwise.
**Turn:** One action + move near. Skip action to move near again.
**Melee attack:** d20 + STR mod + bonuses vs target AC
**Ranged attack:** d20 + DEX mod + bonuses vs target AC
**Damage:** Weapon damage die + bonuses. Critical hit: double weapon damage dice.
**Terrain:** Half cover = disadvantage on attacks. Full cover = can't target.

## Morale
Enemies at half numbers (or half HP for solo) flee on failed DC 15 WIS check.

## Death & Dying
- 0 HP = unconscious, dying
- Death timer: 1d4 + CON mod rounds (minimum 1)
- Each turn roll d20. Natural 20 = rise with 1 HP.
- Stabilize: DC 15 INT check, close range. Stops dying, still unconscious.

## Distance
- Close: ~5 feet
- Near: ~30 feet
- Far: within sight

## Movement
- Climb: STR or DEX check, half speed. Fall if fail by 5+.
- Fall: 1d6 per 10 feet
- Swim: half speed. Hold breath CON mod rounds (min 1). Then CON check/round
  or 1d6 damage.

## Light
Torches: near distance, 1 hour real time. Lanterns: double near, 1 hour
(requires oil). Total darkness: disadvantage on most tasks. Check for random
encounter every crawling round in darkness.

## Resting
Sleep 8 hours + consume ration. Regain all HP, recover stat damage, regain
lost spells. Stressful interruption: DC 12 CON or no benefit.

## Gear Slots
Carry items = STR stat or 10 (whichever higher). All gear = 1 slot unless noted.
Coins: 100 per slot (first 100 free). Arrows/bolts: 20 per slot.

## XP & Leveling
Level up at current level × 10 XP. XP resets to 0 on level up.
Talent roll at levels 1, 3, 5, 7, 9. Roll class hit die + add to max HP.
```

### `shadowdark-monsters/SKILL.md` (structure)

```markdown
---
name: shadowdark-monsters
description: "Monster stat blocks and attributes. Load when spawning monsters,
running combat, or checking monster abilities."
---

# Monster Attributes
- AC, HP (LV × d8 + CON mod, min 1), ATK (attacks per turn), MV (movement)
- Stats: S, D, C, I, W, Ch (modifiers, not scores)
- AL: alignment. LV: level.
- Dark-adapted: all non-humanoid monsters. Ignore darkness penalties.

# Monster Stat Blocks

## Goblin (LV 1)
AC 11, HP 5, ATK 1 club +0 (1d4) or 1 shortbow (far) +1 (1d4), MV near
S +0, D +1, C +1, I -1, W -1, Ch -2, AL C
**Keen Senses.** Can't be surprised.

[... all monster blocks from the GM Quickstart Guide ...]
```

### `shadowdark-adventure/SKILL.md` (Lost Citadel module)

```markdown
---
name: shadowdark-adventure
description: "The Lost Citadel of the Scarlet Minotaur. Load when running this
adventure module. Contains all room descriptions, factions, NPCs, and secrets."
---

# Lost Citadel of the Scarlet Minotaur
A 1st-3rd level adventure for Shadowdark RPG.

## Background
Long ago, a mighty enclave of warriors lived inside the Lost Citadel...
[Full adventure content from GM Quickstart Guide]

## Factions
### Beastmen
[Full faction details, order of battle, NPC generators]

### Ettercaps
[Full faction details]

### The Scarlet Minotaur
[Full details including cumulative -2 encounter modifier]

## Environment
- Danger Level: Risky (check every 2 crawling rounds)
- Light: Total darkness unless noted
- Doors: Stone, 1:6 stuck, unlocked unless noted

## Random Encounters (d8)
[Full table with cumulative Scarlet Minotaur modifier]

## Room Key
[All 27 areas with descriptions, encounters, treasure, traps, secrets]
```

---

## Post-Session Agent (runs on backend, not in sandbox)

```yaml
# Haiku 4.5 prompt for post-session expertise extraction
model: claude-haiku-4-5-20251001
max_tokens: 2000

system: |
  You analyze solo TTRPG session transcripts and update a GM expertise file.
  You receive the full transcript and the current expertise.yaml.
  
  Extract and update:
  
  1. play_style: Did the player show preferences for combat vs exploration vs
     social? Pacing preferences? Things they seem to enjoy or avoid?
  
  2. narrative_patterns: What GM descriptions or narrative techniques produced
     engagement (player typed longer responses, asked follow-up questions,
     expressed excitement)? What fell flat (player seemed to skip or ignore)?
  
  3. rulings: Were any ambiguous rules resolved with a specific ruling? Record
     these as precedents for consistency.
  
  4. player_character.personality_notes: How does the player play their
     character? Cautious? Reckless? Talkative? Strategic?
  
  5. world_state_summary: Write a 2-3 sentence narrative summary of where the
     campaign stands right now.
  
  6. unresolved_threads: List any open plot hooks, NPC promises, or pending
     quests.
  
  Output the complete updated expertise.yaml. Preserve existing entries that
  are still relevant. Remove entries that have been resolved. Keep entries
  concise — single sentences, not paragraphs.
```

---

## Persistence Lifecycle (Production — R2)

```
┌─────────────────────────────────────────────────┐
│ User clicks "Play" in frontend                  │
└────────────┬────────────────────────────────────┘
             ▼
┌─────────────────────────────────────────────────┐
│ Backend: Download from R2                       │
│   /{user_id}/{campaign_id}/state.db             │
│   /{user_id}/{campaign_id}/expertise.yaml       │
│   /{user_id}/{campaign_id}/metadata.json        │
└────────────┬────────────────────────────────────┘
             ▼
┌─────────────────────────────────────────────────┐
│ Backend: Spin E2B sandbox                       │
│   - Install glintlock plugin                    │
│   - Copy state.db + expertise.yaml into sandbox │
│   - Start Claude Code headless + MCP server     │
│   - Return WebSocket URL to frontend            │
└────────────┬────────────────────────────────────┘
             ▼
┌─────────────────────────────────────────────────┐
│ Player plays (messages stream via WebSocket)    │
│   - Backend buffers transcript                  │
│   - Frontend renders messages as chat           │
└────────────┬────────────────────────────────────┘
             ▼ (user ends session OR disconnect)
┌─────────────────────────────────────────────────┐
│ Backend: Export from sandbox before destroy      │
│   - Pull state.db, expertise.yaml               │
│   - Save session transcript                     │
│   - Destroy E2B sandbox                         │
└────────────┬────────────────────────────────────┘
             ▼
┌─────────────────────────────────────────────────┐
│ Backend: Upload to R2                           │
│   state.db, expertise.yaml, transcript.jsonl    │
│   Update metadata.json (last_played, session#)  │
└────────────┬────────────────────────────────────┘
             ▼
┌─────────────────────────────────────────────────┐
│ Async: Post-session Haiku agent                 │
│   - Read transcript + current expertise.yaml    │
│   - Extract patterns, update expertise          │
│   - Upload updated expertise.yaml to R2         │
└─────────────────────────────────────────────────┘
```

---

## Build Order

### Phase 1: MCP Server (game engine)
- [ ] `engine/` — Node.js MCP server with better-sqlite3
- [ ] SQLite schema initialization
- [ ] ECS tools: get_entity, update_entity, create_entity, query_entities
- [ ] roll_dice tool with proper RNG
- [ ] roll_oracle tool with oracle-tables.json data
- [ ] add_note and get_session_summary tools
- [ ] Test: can Claude call all tools and get structured responses?

### Phase 2: Plugin Shell
- [ ] plugin.json manifest with MCP server config
- [ ] GM agent prompt (gm.md)
- [ ] SessionStart hook
- [ ] Commands: new-session, continue-session, end-session, status, roll
- [ ] Test: install plugin in Claude Code, run /glintlock:new-session

### Phase 3: Skill Files
- [ ] shadowdark-core (rules reference)
- [ ] shadowdark-spells (spell lists + casting rules)
- [ ] shadowdark-monsters (stat blocks)
- [ ] shadowdark-treasure (loot tables + magic items)
- [ ] shadowdark-adventure (Lost Citadel module)
- [ ] Test: does the GM correctly reference rules during play?

### Phase 4: Oracle Data
- [ ] Complete all oracle table entries from quickstart guides
- [ ] Validate roll ranges match dice expressions
- [ ] Test: roll_oracle returns correct, varied results

### Phase 5: Persistence & Backend
- [ ] R2 bucket setup (or local filesystem for MVP)
- [ ] Import/export scripts
- [ ] E2B sandbox template with Claude Code + plugin pre-installed
- [ ] Post-session Haiku agent
- [ ] Test: play session → end → resume next day → state is correct

### Phase 6: Frontend
- [ ] WebSocket connection to E2B sandbox
- [ ] Chat interface (message display + input)
- [ ] Campaign management (new, continue, list)
- [ ] Character sheet sidebar (reads from ECS via API)
- [ ] Session history browser
