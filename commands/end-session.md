---
description: "End the current play session with recap and save"
allowed-tools:
  - "mcp:glintlock-engine:*"
---

End the current play session gracefully.

1. Find a natural narrative stopping point — a moment of rest, a door about to be opened, a cliffhanger
2. Provide a brief closing narration
3. Summarize key events from this session (3-5 points):
   - Significant encounters
   - Items gained or lost
   - NPCs met or killed
   - Locations discovered
   - Unresolved threads
4. Call `add_note` with a session summary tagged "event"
5. Report the player character's current status (HP, key inventory, location) via `get_entity`
6. Tell the player their progress has been saved and they can resume with /glintlock:continue-session
