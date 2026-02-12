---
description: "Start a new Torchlit campaign"
allowed-tools:
  - "mcp:glintlock-engine:roll_dice"
  - "mcp:glintlock-engine:roll_oracle"
  - "mcp:glintlock-engine:get_session_metadata"
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

1. Ask the player: What is your character's name? (or offer to roll randomly using `roll_oracle` with table "npc_name")
2. Roll or let player choose: ancestry (d12 table: 1-4 Human, 5-6 Faekin, 7-8 Ironborn, 9-10 Duskfolk, 11 Brute, 12 Gremlin), class (d4: 1 Sellsword, 2 Warden, 3 Shade, 4 Arcanist), alignment (d6: 1-3 Lawful, 4-5 Neutral, 6 Chaotic)
3. Roll stats: 3d6 in order for STR, DEX, CON, INT, WIS, CHA. If none are 14+, offer to reroll.
4. Roll starting gold: 2d6 × 5 gp
5. Apply ancestry traits and class features. Roll one class talent. Load `core-rules` skill for class/ancestry tables.
6. Roll HP: class hit die + CON modifier (minimum 1). Sellsword=d8, Warden=d6, Shade=d4, Arcanist=d4.
7. Help the player buy gear with starting gold (load `core-rules` skill for gear tables)
8. Roll or choose background (d20 table)

**World Setup:**

9. Write the player character file to `world/characters/{name}.md` using the PC template from the state-management skill
10. Write the starting location to `world/locations/{name}.md` using the location template
11. Write `world/campaign-context.md` with setting, premise, and tone
12. Write `world/quests.md` with the initial quest hook
13. Write `world/session-log.md` with the first entry
14. Initialize session metadata via `get_session_metadata` (action: "update") with `campaign_created` set to today, `sessions_played: 1`, `last_played` set to today

**Begin Play:**

15. Set the opening scene. Describe where the character is and what they perceive. Ask what they do.

Use `roll_dice` for every roll. Use `roll_oracle` for random names if needed. Walk the player through each step conversationally — this should feel like collaborative character creation, not a form to fill out.
