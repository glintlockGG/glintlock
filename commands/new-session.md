---
description: "Start a new Shadowdark RPG campaign"
allowed-tools:
  - "mcp:glintlock-engine:*"
  - "Skill"
---

Start a new Shadowdark campaign.

1. Ask the player: What is your character's name? (or offer to roll randomly using `roll_oracle` with table "npc_name")
2. Roll or let player choose: ancestry (d12 table: 1-4 Human, 5-6 Elf, 7-8 Dwarf, 9-10 Halfling, 11 Half-orc, 12 Goblin), class (d4: 1 Fighter, 2 Priest, 3 Thief, 4 Wizard), alignment (d6: 1-3 Lawful, 4-5 Neutral, 6 Chaotic)
3. Roll stats: 3d6 in order for STR, DEX, CON, INT, WIS, CHA. If none are 14+, offer to reroll.
4. Roll starting gold: 2d6 × 5 gp
5. Apply ancestry traits and class features. Roll one class talent.
6. Roll HP: class hit die + CON modifier (minimum 1). Fighter=d8, Priest=d6, Thief=d4, Wizard=d4.
7. Help the player buy gear with starting gold (load shadowdark-core skill for gear tables)
8. Roll or choose background (d20 table)
9. Create all entities in the ECS using `create_entity`:
   - The player character (with health, stats, inventory, position, character_info, description components)
   - The starting location
10. Set the opening scene. Describe where the character is and what they perceive. Ask what they do.

Use `roll_dice` for every roll. Use `create_entity` to persist the character and starting location. Use `roll_oracle` for random names if needed. Walk the player through each step conversationally — this should feel like collaborative character creation, not a form to fill out.
