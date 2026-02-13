---
description: "Resume an existing campaign"
allowed-tools:
  - "mcp:glintlock-engine:roll_dice"
  - "mcp:glintlock-engine:roll_oracle"
  - "mcp:glintlock-engine:get_session_metadata"
  - "Skill"
  - "Read"
  - "Write"
  - "Glob"
---

Continue an existing campaign from where the player left off.

First, check that `world/` exists in the current project directory. If it does not exist, tell the player: "No campaign found in this project. Run `/glintlock:new-session` to start a new campaign."

Load the `state-management` skill first.

**Load Campaign State:**

1. Read `world/campaign-context.md` for the campaign premise and setting
2. Read the PC file from `world/characters/` (there should be one PC file)
3. Read `world/quests.md` for active quests and threads
4. Read the last ~50 lines of `world/session-log.md` for recent events (including world-advance entries)
5. Read `world/CLAUDE.md` if it exists (the SessionStart hook may have already injected this)
6. Read the PC's current location file from `world/locations/`
7. Glob and read all NPC files from `world/npcs/*.md`
8. Glob and read all faction files from `world/factions/*.md` (if any exist)
9. Read `world/session-prep.md` if it exists (previous session's prep seeds — note what carried over)
10. Update session metadata via `get_session_metadata` (action: "update") — increment `sessions_played`, set `last_played` to today

**Session Prep:**

11. Load the `session-prep` skill
12. Generate session prep following the framework. Use `roll_oracle` and `roll_dice` for encounter and treasure prep. Write the result to `world/session-prep.md`. If previous prep seeds existed (from last end-session), develop them — carry forward unused secrets, evolve unresolved hooks. The player does NOT see the prep file.

**Present to Player:**

13. Provide a "Last time on..." recap — 2-3 sentences covering the most recent events and the current situation
14. Deliver the **strong start** from your session prep — drop the PC into the prepared opening scene. This should feel like picking up a novel mid-chapter, not a status report.
15. Wait for the player's response. The strong start should end with something the player naturally wants to react to.
