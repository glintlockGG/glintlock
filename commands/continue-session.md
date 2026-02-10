---
description: "Resume an existing Shadowdark campaign"
allowed-tools:
  - "mcp:glintlock-engine:*"
  - "Skill"
---

Continue an existing campaign from where the player left off.

1. Call `get_session_summary` with detail_level "full" to load current campaign state
2. The SessionStart hook has already loaded expertise context
3. Query the player character's current state (HP, inventory, location) via `get_entity`
4. Query the current location and any NPCs present via `query_entities`
5. Provide a "Last time on..." recap — 2-3 sentences covering the most recent events and the current situation
6. Re-establish the scene: where the character is, what they perceive, what's at stake
7. Ask what the player does
