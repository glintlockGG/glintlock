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
   - Name, Ancestry, Class, Level, Background
   - HP: current/max
   - Armor (DR)
   - Stats: VIG, REF, WIT, RES, PRE, LOR (with Difficulty shown — e.g. "VIG 7 → Diff 13/6")
   - Training: list of trained skills
   - Inventory (list items with gold/silver/copper)
   - Gear slots: used/max (Vigor + 5)
   - Current location
   - Countdown dice status (torches, rations, ammo, etc.)
   - Known spells (if spellcaster)
   - Active conditions or effects
4. Keep it brief. A quick character sheet glance, then back to the game.
5. Suggest `/glintlock:dashboard` for a full visual overview.
