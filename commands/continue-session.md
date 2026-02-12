---
description: "Resume an existing Shadowdark campaign"
allowed-tools:
  - "mcp:glintlock-engine:roll_dice"
  - "mcp:glintlock-engine:roll_oracle"
  - "mcp:glintlock-engine:get_session_metadata"
  - "Skill"
  - "Read"
  - "Write"
---

Continue an existing campaign from where the player left off. Load the `state-management` skill first.

1. Read `world/campaign-context.md` for the campaign premise and setting
2. Read the PC file from `world/characters/` (there should be one PC file)
3. Read `world/quests.md` for active quests and threads
4. Read the last ~30 lines of `world/session-log.md` for recent events
5. Read `world/CLAUDE.md` if it exists (the SessionStart hook may have already injected this)
6. Read the PC's current location file from `world/locations/`
7. Update session metadata via `get_session_metadata` (action: "update") — increment `sessions_played`, set `last_played` to today
8. Provide a "Last time on..." recap — 2-3 sentences covering the most recent events and the current situation
9. Re-establish the scene: where the character is, what they perceive, what's at stake
10. Ask what the player does
