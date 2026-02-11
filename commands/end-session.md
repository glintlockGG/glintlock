---
description: "End the current play session with recap and save"
allowed-tools:
  - "mcp:glintlock-engine:*"
  - "Skill"
  - "Read"
  - "Write"
---

End the current play session gracefully. Load the `state-management` skill first.

**Narrative Closing:**

1. Find a natural narrative stopping point — a moment of rest, a door about to be opened, a cliffhanger
2. Provide a brief closing narration

**State Persistence:**

3. Read the PC file from `world/characters/` and write back any pending state changes (current HP, inventory, location, XP)
4. Append a session summary to `world/session-log.md` with key events tagged appropriately:
   - `[event]` — significant encounters, combat, discoveries
   - `[ruling]` — rule interpretations that set precedent
   - `[thread]` — unresolved plot hooks
   - `[discovery]` — lore, secrets, or locations found
5. Update `world/quests.md` — move completed quests, add new ones, update progress notes

**World Advance:**

6. Generate 3-5 world-advance entries — things that happen in the background while the PC rests. These are off-screen developments that create future hooks. Append them to `world/session-log.md` tagged `[world-advance]`. Examples:
   - A faction makes a move
   - An NPC reacts to the PC's actions
   - A threat escalates
   - Weather or seasonal changes
   - Rumors spread

**Expertise Extraction:**

7. Analyze the full session and extract observations about:
   - **play_style**: tone preferences, pacing, what the player enjoys
   - **narrative_patterns**: what worked (effective), what fell flat
   - **rulings**: precedent-setting rule interpretations
   - **player_character**: personality notes, combat style, decision patterns
   - **unresolved_threads**: open plot hooks for future sessions
8. Read `world/expertise.yaml`, merge observations (append to arrays, don't overwrite existing entries), increment `sessions_played`, set `last_updated` to today's date, and Write the updated file back

**Session Metadata:**

9. Update session metadata via `get_session_metadata` (action: "update") — set `last_played` to today

**Wrap Up:**

10. Present a brief summary to the player: key events, current status, active quests
11. Tell the player they can resume with `/glintlock:continue-session`
12. Suggest running `/glintlock:dashboard` for a visual overview or `/glintlock:chronicle` to generate a story chapter
