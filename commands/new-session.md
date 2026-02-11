---
description: "Start a new Shadowdark RPG campaign"
allowed-tools:
  - "mcp:glintlock-engine:roll_dice"
  - "mcp:glintlock-engine:roll_oracle"
  - "mcp:glintlock-engine:get_session_metadata"
  - "Skill"
  - "Read"
  - "Write"
---

Start a new Shadowdark campaign. Load the `state-management` skill first — it contains the entity file templates you'll use throughout.

**Character Creation:**

1. Ask the player: What is your character's name? (or offer to roll randomly using `roll_oracle` with table "npc_name")
2. Roll or let player choose: ancestry (d12 table: 1-4 Human, 5-6 Elf, 7-8 Dwarf, 9-10 Halfling, 11 Half-orc, 12 Goblin), class (d4: 1 Fighter, 2 Priest, 3 Thief, 4 Wizard), alignment (d6: 1-3 Lawful, 4-5 Neutral, 6 Chaotic)
3. Roll stats: 3d6 in order for STR, DEX, CON, INT, WIS, CHA. If none are 14+, offer to reroll.
4. Roll starting gold: 2d6 × 5 gp
5. Apply ancestry traits and class features. Roll one class talent. Load `shadowdark-core` skill for class/ancestry tables.
6. Roll HP: class hit die + CON modifier (minimum 1). Fighter=d8, Priest=d6, Thief=d4, Wizard=d4.
7. Help the player buy gear with starting gold (load `shadowdark-core` skill for gear tables)
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
