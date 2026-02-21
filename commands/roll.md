---
description: "Roll dice"
argument-hint: "[dice-expression or skill-check]"
allowed-tools:
  - "mcp:glintlock-engine:roll_dice"
  - "Read"
  - "Glob"
---

Player-initiated dice roll. Parse the player's request and call `roll_dice`.

If the roll requires a stat (e.g. "vigor check", "initiative"), read the PC file from `world/characters/` to get the relevant stat. Use the resolution formula from the `core-rules` skill to calculate Difficulty.

Examples:
- "/glintlock:roll 2d6+3" → call roll_dice with expression "2d6+3"
- "/glintlock:roll vigor check" → read PC file for VIG, roll d20, compare to Difficulty
- "/glintlock:roll d20" → roll a plain d20
- "/glintlock:roll initiative" → read PC file for REF, roll d20 + Reflex
- "/glintlock:roll damage longsword" → roll 1d8
- "/glintlock:roll stealth" → read PC file for REF + check if trained in Stealth, roll d20, compare to Difficulty

Report the result clearly. State the Difficulty, whether it's trained or untrained, and the outcome (Critical/Pass/Fail).
