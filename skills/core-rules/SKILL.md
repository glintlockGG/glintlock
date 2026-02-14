---
name: core-rules
description: "Core rules: resolution, stats, training, classes, ancestries, backgrounds, combat, countdown dice, pressure systems, death and dying, distance, light, resting, gear, and character creation. This skill should be used when resolving checks, running combat, handling death, managing resources, equipping gear, creating characters, or making any mechanical ruling."
---

# Core Rules Reference

## Resolution

All rolls are player-facing. The GM never rolls dice.

**Check:** Roll d20 ≥ Difficulty = success.

- **Untrained:** Difficulty = 20 − Stat
- **Trained:** Difficulty = 20 − (Stat × 2)

A stat of 5 means Difficulty 15 untrained, or Difficulty 10 trained.

**Three outcomes:**
- **Critical (beat Difficulty by 5+):** Exceptional success — extra effect, bonus information, or stylish execution
- **Pass:** Success as intended
- **Fail:** Negative consequence — damage, lost time, complication, or worse

**When to roll:** Only when there is a negative consequence for failure, the task requires skill, AND there is time pressure. Trained characters automatically succeed at routine applications of their skills.

**Contested checks:** Both sides roll. Highest result wins. Ties go to the defender (or reroll if no clear defender).

## Advantage / Disadvantage

- **Advantage:** Roll d20 twice, take the higher result
- **Disadvantage:** Roll d20 twice, take the lower result
- If both apply, they cancel out

## Natural 20 / Natural 1

- **Natural 20:** Always a critical success regardless of Difficulty. Attacks deal maximum damage. Spells gain an enhanced effect.
- **Natural 1:** Always a failure regardless of Difficulty. Attacks miss completely. Spells trigger backlash.

## Stats

Six stats, scored 1–10. Stats ARE the numbers — no separate modifier table.

- **Vigor (VIG)** — Strength, toughness, endurance. Smash, lift, resist poison, hold breath.
- **Reflex (REF)** — Speed, agility, coordination. Dodge, tumble, pick locks, aim.
- **Wits (WIT)** — Perception, cunning, instinct. Spot ambushes, find traps, read body language, navigate.
- **Resolve (RES)** — Willpower, courage, faith. Resist fear, maintain concentration, commune with spirits.
- **Presence (PRE)** — Force of personality, leadership, deception. Persuade, intimidate, perform, lie.
- **Lore (LOR)** — Knowledge, education, arcane understanding. Recall history, identify magic, treat wounds, decipher scripts.

### Stat Generation

Choose one method:

1. **Roll:** Roll 3d6 six times. Assign each result to a stat. If no stat is 7+, discard and reroll all six.
2. **Array:** Assign the values [8, 7, 6, 5, 4, 3] to stats in any order.

## Training & Skills

Characters are **trained** in specific skills based on their class, background, and ancestry. Training doubles the stat used for Difficulty calculation.

### Skill List

Each skill has a primary stat. Other stats may apply at GM discretion.

| Skill | Primary Stat | Examples |
|-------|-------------|----------|
| Athletics | Vigor | Climb, swim, jump, grapple |
| Endurance | Vigor | Forced march, resist exhaustion, hold breath |
| Acrobatics | Reflex | Tumble, balance, escape bonds |
| Stealth | Reflex | Sneak, hide, shadow someone |
| Sleight | Reflex | Pick pockets, palm objects, plant evidence |
| Awareness | Wits | Spot ambush, detect lies, notice hidden things |
| Survival | Wits | Track, forage, navigate, predict weather |
| Tinker | Wits | Pick locks, disable traps, jury-rig devices |
| Fortitude | Resolve | Resist fear, hold concentration, endure pain |
| Commune | Resolve | Pray, sense spirits, channel divine power |
| Persuasion | Presence | Negotiate, charm, inspire, rally |
| Deception | Presence | Lie, disguise, bluff, feint in combat |
| Arcana | Lore | Cast spells, identify magic, read scrolls |
| Medicine | Lore | Treat wounds, diagnose illness, craft remedies |
| History | Lore | Recall lore, identify artifacts, decipher scripts |

**Example:** A Scout (trained in Stealth) with Reflex 6 rolls Stealth at Difficulty 20 − (6 × 2) = 8. An untrained character with Reflex 6 rolls at Difficulty 20 − 6 = 14.

## Classes

### Warden
- **HP Die:** d10 | **Armor Training:** All armor, shields
- **Weapon Training:** All melee weapons, crossbows
- **Trained Skills:** Athletics, Endurance, Fortitude
- **Identity:** Protector and frontline fighter. Wardens hold the line.
- **Ability — Shield Wall:** When wielding a shield, allies within close range gain +1 Armor. Once per rest, brace to automatically pass a Vigor or Resolve check.
- **Starting Gear:** Longsword, shield, chainmail, crawling kit

### Scout
- **HP Die:** d6 | **Armor Training:** Light armor
- **Weapon Training:** All ranged weapons, light melee weapons
- **Trained Skills:** Stealth, Survival, Awareness
- **Identity:** Pathfinder and ambusher. Scouts move unseen.
- **Ability — Ambush:** When attacking an unaware target, roll damage twice and take the higher result. Advantage on initiative rolls.
- **Starting Gear:** Longbow, 20 arrows, shortsword, leather armor, crawling kit

### Invoker
- **HP Die:** d4 | **Armor Training:** None
- **Weapon Training:** Daggers, staves
- **Trained Skills:** Arcana, History, Lore-based skill of choice
- **Identity:** Arcane scholar. Invokers wield dangerous, volatile magic.
- **Ability — Arcane Focus:** Can cast Invoker spells (see Spellbook). Starts with 3 Tier 1 spells known. Spell check = Lore (trained via Arcana). On Natural 1, roll Backlash table.
- **Starting Gear:** Staff, spell components pouch, 2 scrolls (random Tier 1), crawling kit

### Surgeon
- **HP Die:** d6 | **Armor Training:** Light armor
- **Weapon Training:** Light melee weapons, crossbows
- **Trained Skills:** Medicine, Tinker, Awareness
- **Identity:** Battlefield medic and alchemist. Surgeons keep people alive.
- **Ability — Field Surgery:** Spend 1 exploration turn to restore 1d6 HP to a creature (Lore check, trained via Medicine). Can stabilize dying creatures without a check. Once per rest, craft a poultice (heals 1d4 HP, usable as an action).
- **Starting Gear:** Crossbow, 20 bolts, dagger, leather armor, surgeon's kit (3 uses), crawling kit

### Rogue
- **HP Die:** d6 | **Armor Training:** Light armor
- **Weapon Training:** Light melee weapons, hand crossbows, shortbows
- **Trained Skills:** Stealth, Sleight, Tinker
- **Identity:** Thief, con artist, and infiltrator. Rogues solve problems others can't.
- **Ability — Exploit Weakness:** When attacking a target that is unaware, flanked, or otherwise compromised, deal +1d6 damage. Advantage on checks to pick locks, disable traps, and find hidden things.
- **Starting Gear:** Shortsword, dagger, hand crossbow, 20 bolts, leather armor, thieves' tools, crawling kit

### Seer
- **HP Die:** d6 | **Armor Training:** Light armor
- **Weapon Training:** Light melee weapons, staves
- **Trained Skills:** Commune, Fortitude, Awareness
- **Identity:** Prophet and spirit-speaker. Seers perceive what others cannot.
- **Ability — Second Sight:** Can cast Seer spells (see Spellbook). Starts with 2 Tier 1 spells known. Spell check = Resolve (trained via Commune). Once per rest, ask the GM one yes-or-no question about a person, place, or object within sight — the GM answers truthfully.
- **Starting Gear:** Staff, holy symbol, incense (3 uses), leather armor, crawling kit

## Ancestries

### Human
- **Innate — Adaptable:** Choose one additional trained skill at character creation. Once per session, reroll any one check (must use new result).
- **Languages:** Common + one additional

### Eldren
- **Innate — Twilight Sense:** See in dim light as if bright. Advantage on Awareness checks in darkness or twilight. Resistant to magical sleep and charm effects.
- **Languages:** Common, Eldren

### Dwerrow
- **Innate — Stoneblood:** +2 maximum HP. Advantage on Endurance checks. Can sense structural integrity of stonework within close range.
- **Languages:** Common, Dwerrow

### Goblin
- **Innate — Slippery:** Can never be surprised. Can move through enemy-occupied spaces. Advantage on Acrobatics checks to escape grapples or bonds.
- **Languages:** Common, Goblin

### Beastkin
- **Innate — Feral Instinct:** Choose a beast aspect at character creation (Wolf: advantage on Survival tracking; Hawk: advantage on ranged attacks at far range; Bear: +1 melee damage; Cat: advantage on Stealth in dim light). Natural weapon (claws/fangs) dealing 1d4 damage.
- **Languages:** Common, Beast-tongue

## Backgrounds

Each background grants one trained skill, a narrative hook, and starting gear beyond the class kit.

### Refugee
- **Trained Skill:** Survival
- **Hook:** You fled something. What was it? It may still be looking for you.
- **Starting Gear:** Worn traveling cloak, hidden coin pouch (2d6 gp extra), a keepsake from your old life

### Deserter
- **Trained Skill:** Athletics
- **Hook:** You abandoned your post. Your former commander remembers your face.
- **Starting Gear:** Military-issue boots (never wear out), a stolen weapon (upgrade starting weapon one die size), forged papers

### Prospector
- **Trained Skill:** Tinker
- **Hook:** You came to the frontier seeking fortune. You know rock and ore — and what things are worth.
- **Starting Gear:** Pickaxe (d6 weapon, doubles as tool), magnifying lens, assayer's kit, 1d6 gp

### Pilgrim
- **Trained Skill:** Commune
- **Hook:** You follow a path of devotion. What do you seek at the end of it?
- **Starting Gear:** Prayer beads or holy text, pilgrim's staff (d4 weapon), healing herbs (3 uses, restore 1 HP each), alms bowl

### Exile
- **Trained Skill:** Deception
- **Hook:** You were cast out — by family, guild, or homeland. What did you do? Or what were you accused of?
- **Starting Gear:** Disguise kit, a false identity with papers, lockpicks, 1d6 gp in mixed foreign coins

### Scholar
- **Trained Skill:** History
- **Hook:** You study the past. Somewhere out here is the answer to the question that consumed you. What is it?
- **Starting Gear:** Research journal (contains 1d4 useful lore entries about the region), ink and quills, reading spectacles, a letter of introduction from an academy

## Combat

All combat rolls are player-facing. The GM narrates monster actions; the player rolls to attack and to defend.

### Initiative

Everyone rolls d20 + Reflex. GM uses the highest Reflex among the monsters. Highest goes first; turns proceed in order.

### Player Turn

1. Tick any countdown dice that trigger on your turn
2. Take one **action** + move up to **near**. Forgo your action to move near again.
3. GM describes results

### Actions

- **Melee Attack:** Roll d20 ≥ Difficulty (using Vigor, trained in Athletics or weapon skill if applicable). On hit, roll weapon damage die. Target's Armor reduces damage taken.
- **Ranged Attack:** Roll d20 ≥ Difficulty (using Reflex, trained if applicable). On hit, roll weapon damage die. Target's Armor reduces damage taken.
- **Cast a Spell:** See Spellbook skill
- **Defend:** Until your next turn, enemies have disadvantage on attacks against you
- **Improvise:** Shove, disarm, grapple, etc. GM determines stat and Difficulty.
- **Free actions:** Speak briefly, drop an item, stand up from prone. Don't cost an action.

### Monster Turns (GM-facing)

Monsters don't roll — their attacks are resolved by the player rolling to **defend**.

**Player Defense Roll:** d20 ≥ Difficulty (using appropriate stat — Reflex to dodge, Vigor to block with a shield). Failure means the monster deals its listed damage minus the player's Armor.

**Monster Behavior Patterns:**
Every monster has a **Zone** (preferred range) and **Priority** (target selection):
- **Zone:** Melee, Near, Far — the monster tries to stay at this range
- **Priority:** Nearest, Weakest, Spellcaster, Random, Leader — who the monster targets
- **Weakness:** A vulnerability the player can exploit (type, element, tactic)

### Damage & Armor

- **Weapon damage** = the weapon's die (d4–d12)
- **Armor** = damage reduction (subtracted from each hit). Shields add +1 Armor.
- **Minimum damage** = 1 (a hit always deals at least 1 damage after Armor)
- **Critical hit (Natural 20):** Maximum damage (ignore Armor)

### Morale

Enemies reduced to half their number (or half HP for a solo enemy) must make a morale check. Roll d20 ≥ 15 or they flee/surrender. Mindless creatures and fanatics are immune.

## Countdown Dice

Countdown dice (cd) track depleting resources. A countdown die starts at a size (cd12, cd10, cd8, cd6, cd4) and steps down toward exhaustion.

**Trigger:** When a countdown die is triggered (by GM call, event, or rule), roll it. On a **1**, the die steps down one size: cd12 → cd10 → cd8 → cd6 → cd4 → **exhausted** (resource depleted).

**Common countdown dice:**
- **Torch (cd6):** Triggered each exploration turn in a dungeon. Exhausted = darkness.
- **Rations (cd8):** Triggered each day of travel. Exhausted = starving.
- **Ammunition (cd8):** Triggered after each combat where ranged weapons were used. Exhausted = out of arrows.
- **Spell Components (cd6):** Triggered each time a spell is cast. Exhausted = can't cast component-requiring spells.
- **Morale (cd8):** For hirelings. Triggered on frightening events. Exhausted = they flee.

**Multiple units:** Carrying 3 torches? Start at cd10 instead of cd6. Extra supplies push the starting die higher.

| Quantity | Starting Die |
|----------|-------------|
| 1 | cd4 |
| 2 | cd6 |
| 3 | cd8 |
| 4–5 | cd10 |
| 6+ | cd12 |

## Pressure Systems

### Doom Escalation (Portent Tracks)

Campaign dooms each have an **portent level** (0–6). Portents advance when:
- The party ignores a doom-related event
- Time passes (some dooms advance during world-turns or narrative pauses)
- The party's actions inadvertently feed the doom

At each portent level, the doom's influence on the world grows — strange events, corrupted terrain, emboldened servants. At portent level 6, the doom **manifests** — a catastrophic event that reshapes the region.

Portents can be reduced by confronting the doom at its source (adventure site). See the active adventure skill (e.g. `pale-reach`) for doom details.

### Progress Clocks

Progress clocks track slow-burn situations with a set number of segments (4, 6, or 8).

- **Tick** a segment when a triggering event occurs (defined per clock)
- When all segments are filled, the clock **completes** — something happens
- Clocks can be positive (building toward a goal) or negative (impending doom)

Examples: "Winter Approaches" (8 segments — environment worsens), "Faction Morale" (6 segments — the home base's defenders weaken), "Trade Route" (4 segments — supply line secured).

## Death & Dying

- **0 HP** = unconscious and dying
- **Death Clock:** Start a 4-segment progress clock labeled "{Name}'s Death." Tick one segment at the start of each of your turns.
- **Natural 20:** If you roll a natural 20 on any check while dying (including defense rolls), stabilize at 1 HP
- **Stabilize:** An ally within close range can attempt a Medicine check (Lore, trained) to stabilize you. Stops the death clock. You remain unconscious with 1 HP until healed or rested.
- **Clock fills:** Dead. The character is retired from play.
- **Massive damage:** If a single hit deals damage equal to or exceeding your maximum HP, you die instantly.

## Distance

- **Close:** ~5 feet — melee range, whisper distance
- **Near:** ~30 feet — a thrown weapon, a short dash
- **Far:** Within sight — bowshot, across a clearing

## Light & Darkness

Light is tracked with countdown dice instead of real time.

- **Torch (cd6):** Illuminates near distance. Triggered each exploration turn.
- **Lantern (cd8):** Illuminates far distance. Requires oil flask. Triggered each exploration turn.
- **Light spell:** Illuminates near distance. Uses spell duration countdown die.
- **Campfire:** 3 torches = campfire. Illuminates near distance. Lasts until the party moves on (no countdown).
- **Total darkness:** Disadvantage on all checks requiring sight. Monsters with darkvision gain advantage against you.

## Resting

**Short Rest (1 exploration turn):** Catch your breath. Spend a use of a healing item (potion, poultice, surgeon's kit). No HP recovery otherwise.

**Long Rest (8 hours sleep + consume ration):** Recover all HP. Regain all class abilities. Reset spell slots. Remove exhaustion.

**Interruption:** Each stressful interruption requires a Resolve check (Difficulty 12). Fail = consume ration but gain no benefit.

**Resting in dungeons:** Random encounter checks at exploration cadence:
- Unsafe: every 3 exploration turns
- Risky: every 2 exploration turns
- Deadly: every exploration turn

## Gear & Inventory

### Carry Capacity

Carry items equal to your **Vigor + 5** in slots. All gear = 1 slot unless noted. Coins: 100 per slot (first 100 free). Arrows/bolts: 20 per slot. Backpack: first one is free.

### Basic Gear

| Item | Cost | Notes |
|------|------|-------|
| Arrows (20) | 1 gp | — |
| Backpack | 2 gp | First free |
| Caltrops (bag) | 5 sp | Covers close area |
| Crossbow bolts (20) | 1 gp | — |
| Crowbar | 5 sp | Advantage on Vigor checks to pry |
| Flask/bottle | 3 sp | — |
| Flint & steel | 5 sp | — |
| Grappling hook | 1 gp | — |
| Healing herbs (3 uses) | 3 gp | Restore 1 HP per use |
| Iron spikes (10) | 1 gp | — |
| Lantern | 5 gp | cd8 light, far distance |
| Mirror | 10 gp | — |
| Oil flask | 5 sp | Fuel for lantern |
| Pole (10') | 5 sp | — |
| Rations (3) | 5 sp | cd8 for 3 |
| Rope, 60' | 1 gp | — |
| Surgeon's kit (3 uses) | 10 gp | Required for Field Surgery |
| Torch | 5 sp | cd6 light, near distance |

### Crawling Kit (7 gp, 7 slots)

Backpack, flint & steel, 2 torches, 3 rations, 10 iron spikes, grappling hook, 60' rope.

### Armor

| Armor | Cost | Slots | Armor (DR) | Notes |
|-------|------|-------|-----------|-------|
| Leather | 10 gp | 1 | 1 | — |
| Chainmail | 60 gp | 2 | 2 | Disadvantage on Stealth, Acrobatics |
| Plate | 130 gp | 3 | 3 | Disadvantage on Stealth, Acrobatics. Cannot swim. |
| Shield | 10 gp | 1 | +1 | One hand occupied |

### Weapons

| Weapon | Cost | Damage | Range | Properties |
|--------|------|--------|-------|------------|
| Club | 5 cp | d4 | Close | — |
| Dagger | 1 gp | d4 | Close/Near | Finesse, Thrown |
| Shortsword | 7 gp | d6 | Close | Finesse |
| Longsword | 9 gp | d8 | Close | — |
| Greatsword | 12 gp | d12 | Close | Two-handed, 2 slots |
| Greataxe | 10 gp | d10 | Close | Two-handed, 2 slots |
| Spear | 5 sp | d6 | Close/Near | Thrown, Versatile (d8 two-handed) |
| Mace | 5 gp | d6 | Close | — |
| Warhammer | 10 gp | d10 | Close | Two-handed |
| Shortbow | 6 gp | d4 | Far | Two-handed |
| Longbow | 8 gp | d8 | Far | Two-handed |
| Crossbow | 8 gp | d6 | Far | Two-handed, Loading |
| Hand crossbow | 12 gp | d4 | Near | Loading |

**Properties:** Finesse (use Vigor or Reflex), Loading (forgo moving to reload), Thrown (ranged using Vigor), Two-handed, Versatile (higher damage with two hands).

## Advancement

Characters advance by earning **Milestones** — concrete achievements rather than abstract XP.

**Level up after completing a milestone:**
- Survive a doom-site adventure (reach the heart and escape alive)
- Resolve a major progress clock (positive or negative)
- Complete a significant quest arc
- Make a meaningful sacrifice for the community

**On level up:**
1. Roll your class HP die and add the result to your maximum HP
2. Increase one stat by 1 (max 10)
3. Gain one new trained skill from your class or background list
4. At levels 3, 5, 7, and 9: gain a **class talent** (roll or choose from class talent table)

**Maximum level:** 10. The frontier doesn't make heroes — it makes survivors.

## Random Encounters

GM rolls 1d6 based on danger level cadence. Encounter on a **1**.
- **Unsafe:** Every 3 exploration turns
- **Risky:** Every 2 exploration turns
- **Deadly:** Every exploration turn

Also check after loud disturbances. For overland travel, use hours instead of turns.

## Currency

1 gp = 10 sp = 100 cp

## Related Skills
- **bestiary** — Monster stat blocks for combat encounters
- **spellbook** — Spell resolution, backlash, talent tables
- **treasure** — Loot tables, magic item identification
