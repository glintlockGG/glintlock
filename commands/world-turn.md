---
description: "Advance the living world"
allowed-tools:
  - "mcp:glintlock-engine:*"
  - "Skill"
  - "Read"
  - "Write"
  - "Glob"
---

Advance the living world. This command moves time forward, ticks clocks, advances doom portents, executes NPC/faction moves, generates new secrets, and refreshes the GM's prep buffer. Can be run manually during play or automated on a schedule.

**Step 1 — Load world state:**

1. Load the `state-management` skill
2. Read `world/CLAUDE.md` — campaign hot cache
3. Read `world/calendar.md` — current date, last world turn, real_time_ratio
4. Read `world/dooms.md` — current portent levels
5. Read `world/clocks.md` — active progress clocks
6. Read `world/quests.md` — active quests and threads
7. Glob and read all faction files from `world/factions/*.md`
8. Glob and read active NPC files from `world/npcs/*.md` (skip deceased)

**Step 2 — Determine time elapsed:**

9. Calculate time since last world turn using `last_world_turn` from calendar metadata
10. Determine in-game time elapsed based on `real_time_ratio`

**Step 3 — Advance calendar:**

11. Step the in-game date forward by the elapsed time
12. Update season description if the season has changed
13. Update weather — use `oracle_yes_no` (odds: likely) to determine if weather shifts
14. Update time of day if relevant

**Step 4 — Tick clocks:**

15. Evaluate each progress clock against its trigger conditions
16. Tick segments where triggers have been met (time passing, faction actions, environmental changes)
17. If any clock completes: note the consequence for narration. Remove or replace completed clocks.

**Step 5 — Advance doom portents:**

18. For each doom, evaluate whether conditions for portent advancement have been met:
    - Time-based advancement: use `oracle_yes_no` with odds based on current portent level (portent 0-1: unlikely, 2-3: even, 4-5: likely)
    - Trigger-based: check if any world events or NPC actions feed the doom
19. Advance portents where appropriate. Describe the atmospheric effects of each advancement.
20. If any doom reaches portent 6: note the catastrophic manifestation for immediate narration.

**Step 6 — Execute NPC/faction moves:**

21. For each active faction, determine their current action based on goals and world state
22. For key NPCs, determine what they've been doing — use `oracle_yes_no` for uncertain outcomes
23. Use `roll_oracle` for procedural content where appropriate (encounter types, NPC names, rumors)
24. Update NPC and faction files with new states, locations, dispositions

**Step 7 — Generate secrets:**

25. Based on the new world state, generate 3-5 new secrets:
    - Each with 2-3 discovery paths
    - Connected to quests, dooms, or faction conflicts
    - Mix of scales: world-shaking and small useful details
    - At least one should be a direct consequence of recent events

**Step 8 — Refresh prep buffer:**

26. Write `world/gm-notes.md` with fully refreshed content:
    - **Strong starts (2-3):** Ready-to-deploy opening hooks based on current world state
    - **Active secrets:** New secrets from step 7 + any undelivered secrets from previous notes
    - **NPC moves:** Updated from step 6
    - **Potential scenes (3-5):** New situations arising from world changes
    - **Encounter setups (2-3):** Pre-built combat encounters using `roll_oracle` with terrain tables + `bestiary` skill
    - **Treasure (2-3):** Pre-rolled rewards using `roll_oracle` + `treasure` skill
    - **Notes:** Pacing ideas, music cues, callbacks

**Step 9 — Update hot cache:**

27. Rewrite `world/CLAUDE.md` — refresh world state paragraph, active threads, doom status, any new rulings or play-style observations

**Step 10 — Log and timestamp:**

28. Append all world-advance entries to `world/session-log.md` tagged `[world-advance]` with the current calendar date
29. Update `world/calendar.md` with `last_world_turn` set to current real timestamp and the new in-game date

**Cron scheduling:**

This command can be automated to run on a schedule, keeping the world alive between play:

```bash
# Run every 6 hours
0 */6 * * * cd /path/to/campaign && claude --plugin-dir /path/to/glintlock -p "/glintlock:world-turn" --no-interactive
```
