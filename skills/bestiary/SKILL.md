---
name: bestiary
description: "Monster stat blocks with HP, Armor (DR), attack dice, zone, priority, weakness, and special abilities. This skill should be used when spawning monsters, running combat, looking up creature stats, or generating encounters."
---

# Bestiary Reference

## Stat Block Format

All monsters use the following compact format:

```
## Monster Name
HP X, Armor Y, Attack dZ (weapon/attack name)
Zone: Melee/Near/Far | Priority: Nearest/Weakest/Spellcaster/Random/Leader | Weakness: type
- **Ability Name:** Description
- **Behavior:** Description
```

### Fields

- **HP** — Hit Points. How much damage a creature can absorb before it drops. Ranges from 1 (trivial) to 30 (boss).
- **Armor** — Damage Reduction. Subtracted from every hit the creature takes. Ranges 0-3. Shields add +1 Armor on top of natural/worn armor.
- **Attack** — The damage die rolled when the creature hits. Players roll to defend; monsters never roll to attack. The die listed (d4-d12) is applied on a failed defense roll.
- **Zone** — The creature's preferred combat range: Melee (grappling distance), Near (a room's width), or Far (bowshot). Creatures try to stay in their preferred zone.
- **Priority** — Who the monster targets: Nearest, Weakest (lowest HP), Spellcaster, Random, or Leader (whoever is giving orders).
- **Weakness** — An exploitable vulnerability. Attacks using this type deal double damage or bypass a special defense.

### Player-Facing Rolls

Monsters do NOT roll. When a monster attacks, the targeted player rolls to defend:

- **Defense check:** d20 ≥ Difficulty (based on the player's stat and training)
- **Fail:** The player takes the monster's attack die in damage, reduced by the player's Armor
- **Pass:** The player avoids or blocks the attack

When a player attacks a monster, they roll an attack check. On success, they deal their weapon damage minus the monster's Armor.

### Morale

When a monster group is reduced to half HP or half numbers, roll d20. On 15+, the group fights on. Below 15, they flee, surrender, or bargain. **Mindless creatures** (undead, constructs, oozes) are immune to morale and always fight to destruction.

### Dark-Adapted

All non-humanoid monsters are dark-adapted and ignore darkness penalties. Blinding or deafening effects still hinder them. Humanoid monsters (bandits, cultists, etc.) require light like players unless noted otherwise.

### Treasure

Wandering monsters have a 50% chance of carrying treasure. Lair encounters always have treasure appropriate to the creature's threat level.

## Stat Blocks

Read `references/monsters.md` for the full alphabetical stat block reference (~50 monsters). This includes standard fantasy creatures and setting-specific doom creatures. Custom campaigns will have their own doom creatures defined in their adventure files.

When you need a specific monster's stats during combat or encounter setup, load the reference file and find the entry by name. All stat blocks follow the format above.

### Pale Reach Doom Creatures

The following creatures are specific to The Pale Reach starter sandbox. Custom campaigns will have their own doom creatures defined in their adventure files.

| Doom | Theme | Creatures |
|------|-------|-----------|
| Hollow King | Undead, barrows | Barrow Wight, Hollow Knight, Bone Shepherd |
| Green Maw | Forest, plant horror | Thornling, Root Horror, Maw Tendril |
| Pale Shepherd | Death, fog | Fog Wraith, Lost Pilgrim, Shepherd's Herald |
| Iron Seam | Metal, constructs | Ore Crawler, Iron Husk, Seam Guardian |
| Antler Court | Fey, wild hunts | Thorn Sprite, Antler Knight, Court Herald |

Each doom has two standard creatures and one mini-boss. Mini-bosses are significantly tougher and should anchor encounters, not appear in groups.

## Related Skills
- **core-rules** — Combat mechanics, check DCs, death and dying
- **treasure** — Loot tables after defeating monsters
- **pale-reach** — Encounter tables by terrain type
