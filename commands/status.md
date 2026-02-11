---
description: "Show the player character's current status"
allowed-tools:
  - "Read"
  - "Glob"
---

Show the player character's current status without breaking narrative flow too much.

1. Find the PC file in `world/characters/` (glob for `*.md` files)
2. Read the PC file
3. Present in a compact format:
   - Name, Ancestry, Class, Level, Title, Alignment
   - HP: current/max
   - AC
   - Stats: STR, DEX, CON, INT, WIS, CHA (with modifiers)
   - Inventory (list items with gold/silver/copper)
   - Gear slots: used/max
   - Current location
   - XP: current / needed for next level
   - Known spells (if spellcaster)
   - Active conditions or effects
4. Keep it brief. A quick character sheet glance, then back to the game.
5. Suggest `/glintlock:dashboard` for a full visual overview.
