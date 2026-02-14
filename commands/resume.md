---
description: "Return to your campaign"
allowed-tools:
  - "mcp:glintlock-engine:roll_dice"
  - "mcp:glintlock-engine:roll_oracle"
  - "mcp:glintlock-engine:oracle_yes_no"
  - "mcp:glintlock-engine:get_session_metadata"
  - "mcp:glintlock-engine:track_time"
  - "Skill"
  - "Read"
  - "Write"
  - "Glob"
---

Return to an active campaign.

**Step 1 — Check for campaign:**

Check that `world/` exists in the current project directory. If it does not exist, tell the player: "No campaign found. Run `/glintlock:start` to create one."

**Step 2 — Load context (hot-cache-first):**

Start with the hot cache, then drill into details. The SessionStart hook may have already injected some of this into context — don't re-read what's already there.

1. Load the `state-management` skill
2. Read `world/CLAUDE.md` — the campaign hot cache. This is your primary context: PC summary, play style, active threads, doom status, world state. If well-populated, this is enough to orient.
3. Read the PC file from `world/characters/` for mechanical state (stats, HP, inventory)
4. Read `world/calendar.md` — check time elapsed since last play
5. Read `world/gm-notes.md` if it exists — the prep buffer
6. Read `world/dooms.md` and `world/clocks.md`
7. Read `world/quests.md`
8. Read last ~50 lines of `world/session-log.md`

**Key difference from loading everything:** Don't read all NPC/faction/location files upfront. The hot cache has what you need. Drill into entity files only when the fiction requires it (e.g., about to narrate an NPC interaction → read that NPC's file).

**Step 3 — World advance (if time has passed):**

Check `world/calendar.md` metadata for `last_world_turn` and `last_played`. If significant real time has passed since last play (or if gm-notes feel stale), perform a lightweight world-advance:

9. Advance the in-game calendar — calculate elapsed in-game time based on real_time_ratio
10. Tick time-based clocks (seasonal, faction timers)
11. Check doom portents — use `oracle_yes_no` for ambiguous advancement decisions (e.g., "Has the Hollow King's influence spread during this time?" with odds based on current portent level)
12. Execute 1-3 NPC/faction moves — read relevant faction/NPC files, determine what they've been doing. Use `oracle_yes_no` for uncertain outcomes.
13. Generate 1-2 new secrets based on current world state — add to `world/gm-notes.md`
14. Refresh `world/gm-notes.md` — update strong starts, NPC moves, scenes based on new world state
15. Append `[world-advance]` entries to `world/session-log.md` with the calendar date
16. Update `world/calendar.md` with new date and `last_world_turn` timestamp
17. Update `world/CLAUDE.md` — refresh world state, active threads, doom status

If no significant time has passed, skip the world-advance. Just ensure gm-notes are current.

**Step 4 — Update metadata:**

18. Update session metadata via `get_session_metadata` (action: "update") — increment `sessions_played`, set `last_played` to today

**Step 5 — Present to player:**

19. If world-advance happened: deliver a "Since you were gone..." summary — 2-3 sentences covering what changed in the world while the PC was away. Frame it as in-world time passing, not mechanical updates.
20. Deliver a strong start from `world/gm-notes.md` — drop the PC into an immediate scene with tension, discovery, or a decision. This should feel like opening a novel mid-chapter, not a status report.
21. Wait for player input. The strong start should end with something the player naturally wants to react to.
