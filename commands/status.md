---
description: "Show the player character's current status"
allowed-tools:
  - "mcp:glintlock-engine:get_entity"
  - "mcp:glintlock-engine:query_entities"
---

Show the player character's current status without breaking narrative flow too much.

1. Query the player character entity from the ECS via `get_entity` (type "pc")
2. Present in a compact format:
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
3. Keep it brief. A quick character sheet glance, then back to the game.
