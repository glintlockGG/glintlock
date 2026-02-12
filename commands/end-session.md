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

**Update Campaign Memory:**

7. Read `world/CLAUDE.md`. Update each section based on this session:
   - **Character**: Update HP, location, level, any major status changes
   - **Play Style**: Add new preferences observed (if any). Remove if player's taste has changed.
   - **Player Character**: Add new personality or combat observations
   - **Narrative Patterns**: Add patterns that worked or fell flat this session
   - **Rulings**: Add any new precedent-setting rulings from this session
   - **Active Threads**: Add new threads, update status of existing ones, remove resolved ones
   - **World State**: Rewrite the summary paragraph to reflect current state
8. Write the updated `world/CLAUDE.md` back

**Session Log Rotation:**

9. If `world/session-log.md` exceeds ~150 lines:
   - Identify session boundaries (lines starting with `## Session`)
   - Keep the most recent 2 sessions in `world/session-log.md`
   - Prepend the older sessions to `world/session-log-archive.md` (create if needed)

**Session Metadata:**

10. Update session metadata via `get_session_metadata` (action: "update") — set `last_played` to today

**Wrap Up:**

11. Present a brief summary to the player: key events, current status, active quests
12. Tell the player they can resume with `/glintlock:continue-session`
13. Suggest running `/glintlock:dashboard` for a visual overview or `/glintlock:chronicle` to generate a story chapter
