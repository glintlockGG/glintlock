---
description: "Roll dice for Torchlit"
argument-hint: "[dice-expression or skill-check]"
allowed-tools:
  - "mcp:glintlock-engine:roll_dice"
  - "Read"
  - "Glob"
---

Player-initiated dice roll. Parse the player's request and call `roll_dice`.

If the roll requires a stat modifier (e.g. "strength check", "initiative"), read the PC file from `world/characters/` to get the relevant stat.

Examples:
- "/glintlock:roll 2d6+3" → call roll_dice with expression "2d6+3"
- "/glintlock:roll strength check" → read PC file for STR mod, roll d20 + STR modifier
- "/glintlock:roll d20" → roll a plain d20
- "/glintlock:roll initiative" → read PC file for DEX mod, roll d20 + DEX modifier
- "/glintlock:roll damage longsword" → roll 1d8

Report the result clearly. If it's a check, state success or failure based on the relevant DC (ask the GM context or use the most recent DC if in combat).
