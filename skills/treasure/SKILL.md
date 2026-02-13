---
name: treasure
description: "Treasure quality tiers, XP values, gold-per-encounter guidelines, and magic item categories. This skill should be used when generating treasure rewards, determining loot quality, identifying magic items, or pricing treasure."
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

## Treasure Hoard Procedure

When the party defeats a significant enemy or discovers a cache:

1. **Determine quality** — Roll 1d6 or choose based on encounter difficulty:
   - 1-2: Poor (trash, copper coins, broken gear)
   - 3-4: Normal (silver and gold coins, common gems)
   - 5: Fabulous (jewelry, rare materials, art objects)
   - 6: Legendary (ancient artifacts, major magic items)

2. **Roll coins** — Use the gold-per-encounter guideline above, adjusted by quality (Poor: ×0.25, Normal: ×1, Fabulous: ×3, Legendary: ×10).

3. **Roll specific items** — Use `roll_oracle` with table `treasure_0_3` for random items. For magic items, also roll on `magic_item_name` for evocative names.

4. **Award XP** — Each treasure item awards XP based on its quality tier (see table above). XP is awarded when treasure is returned to civilization, not when found.

## Sample Magic Items

### Weapons
- **Embertongue** (short sword, +1) — Blade glows faintly orange. On a critical hit, the target catches fire (1d4/round until extinguished). *Fabulous.*
- **Griefmaker** (war hammer, +1) — Head carved from a single black diamond. Deals double damage to constructs and objects. Hums when undead are within 30'. *Fabulous.*
- **Whisper** (dagger, +1) — Translucent blade, nearly invisible. Attacks from hiding deal +1d6 damage. Cannot be detected by Detect Magic. *Fabulous.*

### Armor
- **Duskmail** (chainmail, +1 AC) — Forged from nechrome alloy. Weighs half as much as normal chainmail. Does not impose disadvantage on stealth. *Legendary.*
- **Rootshield** (shield, +1 AC) — Living wood that slowly regenerates. Once per day, sprout thorny vines to entangle one adjacent enemy (save to resist, lasts 1d4 rounds). *Fabulous.*

### Wondrous Items
- **Lantern of True Seeing** — When lit, reveals invisible creatures, hidden doors, and illusions within its light radius. Burns normal oil. *Legendary.*
- **Cloak of Embers** — Ash-gray wool that smolders at the edges. Grants immunity to natural cold. Once per day, burst into flame (1d6 to all within 5', extinguishes immediately). *Fabulous.*
- **Ring of the Pale Hand** — Bone ring. Wearer can touch a corpse dead less than 1 hour and ask it one yes-or-no question. Works once per corpse. *Fabulous.*
- **Boots of the Delver** — Iron-shod leather. Wearer leaves no tracks underground and can sense structural instability within 10'. *Normal.*
- **Amulet of Last Breath** — When the wearer drops to 0 HP, the amulet shatters and restores 1d8 HP. Single use — must find a new one. *Fabulous.*

## Treasure Tables

Use `roll_oracle` with table `treasure_0_3` for level-appropriate random treasure. The oracle returns item, value, and quality rating. Use `magic_item_name` for evocative names when generating unique magic items.

## Related Skills
- **bestiary** — Monster treasure chances and encounter loot
- **core-rules** — Magic item identification via Detect Magic, XP leveling
