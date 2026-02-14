---
description: "Create a character and start a new campaign"
allowed-tools:
  - "mcp:glintlock-engine:roll_dice"
  - "mcp:glintlock-engine:roll_oracle"
  - "mcp:glintlock-engine:oracle_yes_no"
  - "mcp:glintlock-engine:get_session_metadata"
  - "mcp:glintlock-engine:track_time"
  - "Skill"
  - "Read"
  - "Write"
---

Start a new campaign.

**World Directory Setup:**

Before anything else, ensure the `world/` directory structure exists in the current project directory. Create the following directories and files if they don't exist:

```
world/
  characters/
  npcs/
  locations/
  items/
  factions/
  chronicles/
  audiobooks/
  adventures/
```

Also create `world/.gitignore` with the following content so campaign data doesn't pollute the user's git repo:

```
# Glintlock campaign data — generated during play
*
!.gitignore
!chronicles/.gitkeep
```

And create `world/chronicles/.gitkeep` (empty file) so the chronicles directory is tracked.

Load the `state-management` skill — it contains the entity file templates you'll use throughout.

**Character Creation:**

Walk the player through each step conversationally — this should feel like collaborative character creation, not a form to fill out.

1. **Name:** Ask the player for a character name (or offer to roll randomly using `roll_oracle` with table "npc_name" and a subtype matching their ancestry choice)

2. **Ancestry (5 choices):** Let the player choose or roll d10 (1-4 Human, 5-6 Eldren, 7-8 Dwerrow, 9 Goblin, 10 Beastkin). Briefly describe each ancestry's innate ability. If Beastkin, also choose a beast aspect (Wolf/Hawk/Bear/Cat).

3. **Class (6 choices):** Let the player choose or roll d6 (1 Warden, 2 Scout, 3 Invoker, 4 Surgeon, 5 Rogue, 6 Seer). Briefly describe each class's identity and ability. Load `core-rules` skill for full class details.

4. **Background (6 choices):** Let the player choose or roll d6 (1 Refugee, 2 Deserter, 3 Prospector, 4 Pilgrim, 5 Exile, 6 Scholar). Ask the player to answer their background's hook question — this seeds the character's story.

5. **Stats:** Roll or assign. Option A: Roll 3d6 six times, assign to Vigor/Reflex/Wits/Resolve/Presence/Lore. If no stat is 7+, offer to reroll. Option B: Use the array [8, 7, 6, 5, 4, 3] and assign freely.

6. **Training:** Compile the character's trained skills from class (3 skills) + background (1 skill) + ancestry (Human gets 1 extra). List them for the player.

7. **HP:** Roll the class HP die (Warden d10, Scout/Surgeon/Rogue/Seer d6, Invoker d4). Apply Dwerrow +2 bonus if applicable. Minimum 1.

8. **Starting Gear:** Class starting gear + background bonus gear. Help the player spend any remaining gold (Prospector/Exile/Refugee get bonus gp). Show the gear tables from `core-rules` if they want to shop.

9. **Countdown Dice:** Set up starting countdown dice via `track_time`:
   - Torches from gear (quantity → die size per core-rules table)
   - Rations from gear
   - Ammunition if ranged class

**Campaign Setup:**

Before world setup, ask the player:

> **How would you like to start?**
> 1. **The Pale Reach** (Recommended) — A dark frontier sandbox ready to play. Thornwall keep, five escalating dooms, hex map with six terrains, and a starter adventure.
> 2. **Session Zero** — Build a custom campaign from scratch. Choose setting truths, design a home base, create dooms and factions.

### Path A: The Pale Reach (Press Play)

Load the `pale-reach` skill. Write the world files:

10. Write PC file to `world/characters/{name}.md`
11. Write `world/campaign-context.md`:
    - Setting: The Pale Reach — a dark frontier at the edge of civilization
    - Home base: Thornwall — a fortified waystation clinging to survival
    - Premise: Generated from the character's background hook + the region's threats
    - Tone: Grim frontier survival, doomic horror, resource scarcity
12. Write `world/dooms.md` with the five Pale Reach dooms at portent level 0 (from pale-reach skill)
13. Write `world/clocks.md` with starting progress clocks (from pale-reach skill)
14. Write `world/quests.md` with initial quest hooks
15. Write `world/session-log.md` with first entry
16. Write `world/calendar.md`:
    ```markdown
    # Calendar

    ## Current Date
    Day 1 of the Harvest Moon, Year 1

    ## Season
    Late autumn. The air carries the smell of damp earth and dying leaves. Frost rimes the walls at dawn.

    ## Time of Day
    Morning — roughly 8 hours of daylight remaining.

    ## Notable Upcoming Events
    - Winter solstice in ~60 days — deep winter begins
    - Caravan from the south expected within the week (if the road holds)

    ## Recent Weather
    Overcast skies, cold wind from the north. Threat of rain.

    ## Metadata
    last_played: {today ISO 8601}
    last_world_turn: {today ISO 8601}
    real_time_ratio: 1:1
    campaign_start_real: {today ISO 8601}
    campaign_start_game: Day 1, Harvest Moon, Year 1
    ```
17. Initialize session metadata via `get_session_metadata` (action: "update") with `campaign_created` set to today, `sessions_played: 1`, `last_played` set to today
18. Write `world/gm-notes.md` — initial GM prep. Read the `gm-notes-template` from `skills/state-management/references/gm-notes-template.md`. Populate with:
    - 2-3 strong starts based on the PC's background hook and the Pale Reach opening situation
    - 3-5 initial secrets drawn from the Pale Reach content (doom clues, faction secrets, NPC motivations)
    - NPC moves for initial Thornwall NPCs
    - 3-5 potential scenes for early play
    - 2-3 encounter setups using the pale-reach encounter tables
    - 2-3 treasure items
19. Write `world/CLAUDE.md` — the campaign hot cache. Use the Campaign Memory template from `state-management`. Populate it with the PC's starting stats, location, empty play-style/narrative tables (first game — nothing observed yet), doom portent levels at 0, and a World State paragraph describing the opening situation.
20. Set the opening scene in Thornwall

### Path B: Session Zero (Custom Campaign)

A guided worldbuilding conversation using collaborative truth-selection. Each choice constrains the next. Present 3-4 options for each step, always allowing custom input. Use `roll_oracle` and `roll_dice` throughout to surprise both player and GM.

10. **Setting Concept** — Ask: What kind of world? Options:
    - Dark frontier (civilization's edge, encroaching wilderness)
    - Fallen empire (ruins of greatness, power vacuums)
    - Besieged haven (surrounded, cut off, holding the line)
    - Custom
    Record the player's choice. This shapes all subsequent options.

11. **Setting Truths** (5 questions) — For each, offer 3 options + custom:
    - What is the nature of magic? (Volatile/Forbidden/Fading/Custom)
    - What threatens civilization? (Monsters/Nature/Corruption/Custom)
    - What do people believe? (Old gods/Pragmatic atheism/Spirits/Custom)
    - How does death work? (Final/Lingering/Claimed/Custom)
    - What is the land like? (Scarred/Wild/Haunted/Custom)

12. **Home Base** — Generate collaboratively:
    - Type: Fortified town / Trading post / Monastery / Camp / Custom
    - Name: Offer 3 generated options or player names it
    - 4-5 key locations (function + NPC for each)
    - Starting crisis: What immediate problem faces the base?
    Write `world/campaign-context.md` from accumulated choices.

13. **Regional Map** — Generate hex map with player:
    - 3-5 terrain types based on setting truths
    - Scale and shape (small tight map vs sprawling frontier)
    - 2-3 known landmarks, rest mysterious
    Include the map description in campaign-context.md.

14. **Dooms (3-5)** — Generate escalating threats:
    - Each doom connected to a terrain/region
    - 6-level portent track with escalating consequences
    - Resolution requires confronting the doom at its source
    - Use `roll_oracle` for inspiration, refine with player
    Write `world/dooms.md`.

15. **Factions (3-5)** — Generate competing groups:
    - Each faction has a goal, strength, weakness, and attitude toward PC
    - At least 2 factions should be in tension with each other
    - At least 1 faction should want something from the PC
    Write initial faction files to `world/factions/`.

16. **Starting Clocks (3-5)** — Generate situation timers:
    - At least 1 environmental/seasonal clock
    - At least 1 faction-driven clock
    - At least 1 tied to a doom
    Write `world/clocks.md`.

17. Write PC file, quests, session-log, initialize metadata (same as Path A)

18. Write `world/calendar.md` — adapted to the custom setting:
    - Current date using the campaign's calendar system
    - Season and weather appropriate to the setting
    - Notable upcoming events from the worldbuilding
    - Metadata with real_time_ratio, timestamps

19. Write `world/gm-notes.md` — initial GM prep based on the custom campaign content. Follow the template from `skills/state-management/references/gm-notes-template.md`.

20. Write `world/CLAUDE.md` — the campaign hot cache. Use the Campaign Memory template from `state-management`. Populate it with the PC's starting stats, location, empty play-style/narrative tables (first game — nothing observed yet), doom portent levels, faction names, and a World State paragraph summarizing the custom campaign's opening situation.

21. **Opening Scene** — Set the opening at the home base. Use the starting crisis. End with something that invites action.

**Session Zero Note:** Session zero IS play. The worldbuilding is collaborative and should feel like a conversation, not a questionnaire. Use `roll_oracle` and `roll_dice` throughout to surprise both player and GM. Each session zero produces a unique sandbox.

Use `roll_dice` for every roll. Use `roll_oracle` for random names if needed.

**Closing:** The game has begun. When you return, just run `/glintlock:resume` or simply start talking.
