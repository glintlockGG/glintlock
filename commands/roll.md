---
description: "Roll dice for Shadowdark RPG"
argument-hint: "[dice-expression or skill-check]"
allowed-tools:
  - "mcp:glintlock-engine:roll_dice"
  - "mcp:glintlock-engine:get_entity"
---

Player-initiated dice roll. Parse the player's request and call `roll_dice`.

Examples:
- "/glintlock:roll 2d6+3" → call roll_dice with expression "2d6+3"
- "/glintlock:roll strength check" → query PC stats, roll d20 + STR modifier
- "/glintlock:roll d20" → roll a plain d20
- "/glintlock:roll initiative" → roll d20 + DEX modifier
- "/glintlock:roll damage longsword" → roll 1d8

Report the result clearly. If it's a check, state success or failure based on the relevant DC (ask the GM context or use the most recent DC if in combat).
