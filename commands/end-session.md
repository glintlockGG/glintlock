---
description: "End the current play session with recap and save"
allowed-tools:
  - "mcp:glintlock-engine:*"
  - "Read"
  - "Write"
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
7. Call `query_notes` with tag "ruling" to gather all rulings from this session
8. Analyze the full session and extract observations:
   - **play_style**: tone, pacing, preferences, dislikes
   - **narrative_patterns**: what worked (effective), what to avoid
   - **rulings**: any precedent-setting rule interpretations
   - **player_character**: personality notes, combat style
   - **unresolved_threads**: open plot hooks
9. Read `world/expertise.yaml`, merge observations (append to arrays, don't overwrite
   existing entries), increment `sessions_played`, set `last_updated` to today's date,
   and write the updated file back with the Write tool.
