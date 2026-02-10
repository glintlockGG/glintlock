---
name: shadowdark-treasure
description: "Treasure tables, magic item generation, and loot rules. Load when generating treasure, rolling loot, or identifying magic items."
---

# Treasure

## Treasure Quality & XP

| Quality | XP Value | Examples |
|---|---|---|
| Poor | 0 | Rusty tools, worthless trinkets |
| Normal | 1 | Standard coins, common gems |
| Fabulous | 3 | Fine jewelry, rare materials |
| Legendary | 10 | Ancient artifacts, dragon hoards |

## Gold Per Encounter (Guidelines)

| PC Level | Approximate Value |
|---|---|
| 1-2 | ~20 gp |
| 4-6 | ~50 gp |
| 7-9 | ~80 gp |

## Magic Items

Magic items have these possible properties:
- **Bonus:** +1 to +3 to attacks, damage, AC, or spellcasting
- **Benefit:** Special ability or effect
- **Curse:** Negative effect (may not be immediately apparent)
- **Personality:** Sentient items with their own goals

### Identifying Magic Items
- **Detect Magic** reveals an item is magical and its school
- **Focus for 2 rounds** with Detect Magic to discern specific properties
- **Trial and error** — use the item and see what happens

### Magic Item Categories
- Weapons (swords, axes, bows, etc.)
- Armor and shields
- Potions (single use, drink to activate)
- Scrolls (single use, cast the spell written)
- Wands (reusable but can break on critical failure)
- Rings, amulets, cloaks, boots, etc.

## Treasure Tables

Use `roll_oracle` with table types `treasure_0_3` for level-appropriate random treasure. The oracle returns item, value, and quality rating.
