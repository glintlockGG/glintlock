---
name: treasure
description: "Treasure quality tiers, gold-per-encounter guidelines, magic item categories, and sample items. This skill should be used when generating treasure rewards, determining loot quality, identifying magic items, or pricing treasure."
---

# Treasure

## Treasure Quality

| Quality | Rarity | Examples |
|---------|--------|----------|
| Poor | Common | Rusty tools, worthless trinkets, copper coins |
| Normal | Standard | Silver and gold coins, common gems, serviceable gear |
| Fabulous | Rare | Fine jewelry, rare materials, art objects, minor magic |
| Legendary | Very rare | Ancient artifacts, major magic items, dragon hoards |

## Gold Per Encounter (Guidelines)

| PC Level | Approximate Value |
|----------|-------------------|
| 1-2 | ~20 gp |
| 3-5 | ~50 gp |
| 6-8 | ~80 gp |
| 9-10 | ~120 gp |

## Magic Items

Magic items have these possible properties:
- **Bonus:** +1 to +3 to attacks, damage, Armor, or spellcasting
- **Benefit:** Special ability or effect
- **Curse:** Negative effect (may not be immediately apparent)
- **Personality:** Sentient items with their own goals

### Identifying Magic Items
- **Arcana check (Lore, trained):** Examine for 1 exploration turn to identify properties. Difficulty based on item rarity (Normal: 12, Fabulous: 15, Legendary: 18).
- **Trial and error** — Use the item and see what happens
- **Consult a scholar** — NPCs with Arcana training (like Maren Sable in Thornwall) can identify items for a fee

### Magic Item Categories
- Weapons (swords, axes, bows, etc.)
- Armor and shields
- Potions (single use, drink to activate)
- Scrolls (single use, cast the spell written — requires Arcana training)
- Wands (reusable but can break on Natural 1)
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

4. **Milestone connection** — Treasure can be tied to milestones. Recovering a legendary artifact from a myth-site counts as a milestone toward leveling up.

## Sample Magic Items

### Weapons
- **Embertongue** (shortsword, +1 damage) — Blade glows faintly orange. On a critical hit, the target catches fire (1d4/round until extinguished). *Fabulous.*
- **Griefmaker** (warhammer, +1 damage) — Head carved from a single black diamond. Deals double damage to constructs and objects. Hums when undead are within near distance. *Fabulous.*
- **Whisper** (dagger, +1 damage) — Translucent blade, nearly invisible. Attacks from hiding deal +1d6 damage. Cannot be detected by magic. *Fabulous.*

### Armor
- **Duskmail** (chainmail, Armor 3 instead of 2) — Forged from nechrome alloy. Weighs half as much as normal chainmail. No Stealth disadvantage. *Legendary.*
- **Rootshield** (shield, Armor +2 instead of +1) — Living wood that slowly regenerates. Once per day, sprout thorny vines to entangle one enemy within close range (Vigor check Difficulty 12 to escape). *Fabulous.*

### Wondrous Items
- **Lantern of True Seeing** — When lit, reveals invisible creatures, hidden doors, and illusions within its light radius. Burns normal oil. *Legendary.*
- **Cloak of Embers** — Ash-gray wool that smolders at the edges. Grants immunity to natural cold. Once per day, burst into flame (1d6 to all within close range, extinguishes immediately). *Fabulous.*
- **Ring of the Pale Hand** — Bone ring. Wearer can touch a corpse dead less than 1 hour and ask it one yes-or-no question. Works once per corpse. *Fabulous.*
- **Boots of the Delver** — Iron-shod leather. Wearer leaves no tracks underground and can sense structural instability within close range. *Normal.*
- **Amulet of Last Breath** — When the wearer drops to 0 HP, the amulet shatters and restores 1d8 HP. Single use — must find a new one. *Fabulous.*

## Treasure Tables

Use `roll_oracle` with table `treasure_0_3` for level-appropriate random treasure. The oracle returns item, value, and quality rating. Use `magic_item_name` for evocative names when generating unique magic items.

## Related Skills
- **bestiary** — Monster treasure chances and encounter loot
- **core-rules** — Magic item identification via Arcana, milestone advancement
