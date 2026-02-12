---
description: "Deep audit of the full campaign state"
allowed-tools:
  - "mcp:glintlock-engine:get_session_metadata"
  - "Read"
  - "Glob"
  - "Skill"
---

Perform a comprehensive audit of the entire campaign state. Read ALL world files and cross-reference for consistency.

1. Read the PC file from `world/characters/`
2. Glob and read ALL files from `world/npcs/`, `world/locations/`, `world/items/`, `world/factions/`
3. Read `world/quests.md`
4. Read `world/session-log.md` (full file)
5. Read `world/campaign-context.md`
6. Read `world/CLAUDE.md` if it exists
7. Read session metadata via `get_session_metadata`

Present a structured audit report:

### Character Status
- Full character sheet summary
- Current HP, inventory, gold, location, XP progress

### Active Quests
- All active quests with current progress and known leads

### Open Threads
- Unresolved plot hooks from session log (`[thread]` entries)
- Developing quests that haven't activated yet
- NPC promises or debts outstanding

### World State
- Known locations and their current status
- Living NPCs and their dispositions
- Faction standings

### Timeline
- Key events in chronological order from the session log

### Anomalies
- Any inconsistencies found (e.g. PC location doesn't match last session log entry, dead NPC still referenced as alive in quests, items in inventory that don't match session events)

### Suggestions
- Plot threads that could be developed next session
- NPCs who haven't been revisited
- Quest deadlines approaching
- Narrative opportunities based on campaign memory patterns
