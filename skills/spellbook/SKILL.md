---
name: spellbook
description: "Spell lists, casting rules, countdown dice durations, backlash, scrolls, wands, and talent tables for all spellcasting classes (Invoker, Seer, Surgeon, Warden). This skill should be used when casting spells, preparing remedies, resolving magical effects, rolling backlash, checking spells known, or rolling talents on level up."
---

# Spellcasting

## Casting a Spell

Each spellcasting class uses its own stat and trained skill for spell checks.

| Class | Stat | Trained Skill | Method |
|-------|------|---------------|--------|
| Invoker | Lore | Arcana | Arcane formulae and gestures |
| Seer | Resolve | Commune | Spirit communion and prayer |
| Surgeon | Lore | Medicine | Alchemical preparations and procedures |
| Warden | Resolve | Commune | Minor blessings and wards |

**Spell check:** Roll d20 >= Difficulty, where Difficulty = 20 - (Stat x 2) because casters are always trained in their casting skill.

**Example:** An Invoker with Lore 6 casts at Difficulty 20 - (6 x 2) = 8.

### Three Outcomes

- **Critical (beat Difficulty by 5+ or Natural 20):** Enhanced effect -- double one numerical effect (damage, healing, targets, etc.) or extend the duration countdown die by one step.
- **Pass:** Spell takes effect as described.
- **Fail:** Spell does not take effect. The spell slot is spent -- can't cast that spell again until rest.

### Natural 20 / Natural 1

- **Natural 20:** Always a critical. Enhanced effect as above.
- **Natural 1:** Always a failure. Invoker/Seer: roll on the Backlash table. Surgeon: preparation explodes or goes inert, wasted. Warden: blessing fizzles, patron expresses displeasure (no backlash table, but spell lost until rest).

## Spell Tiers

Spells are organized into three tiers based on power. Characters gain access to higher tiers as they level.

| Tier | Level Required | Description |
|------|---------------|-------------|
| Tier 1 | 1+ | Fundamental spells and cantrips |
| Tier 2 | 3+ | Potent magic with serious consequences |
| Tier 3 | 5+ | Reality-bending power, dangerous to wield |

## Countdown Dice for Spell Durations

Spell durations use countdown dice instead of fixed round counts. When a spell has a duration like "cd6 turns," roll the countdown die at the start of each of your turns. On a **1**, the die steps down (cd8 -> cd6 -> cd4 -> exhausted). When exhausted, the spell ends.

- **Instant:** One-time effect, no duration tracking.
- **cd4 turns:** Brief -- likely lasts 1-3 turns.
- **cd6 turns:** Short -- typically 2-5 turns.
- **cd8 turns:** Moderate -- often 3-7 turns.
- **Sustained:** Caster must maintain concentration. Each turn, make a spell check to sustain. Fail = spell ends (but spell is NOT lost). Taking damage while sustaining forces an immediate spell check.
- **Critical enhancement:** On a critical cast, step the duration die up one size (cd6 becomes cd8, etc.).

## Spells Known

### Invoker Spells Known

| Level | Tier 1 | Tier 2 | Tier 3 |
|-------|--------|--------|--------|
| 1 | 3 | -- | -- |
| 2 | 4 | -- | -- |
| 3 | 4 | 1 | -- |
| 4 | 4 | 2 | -- |
| 5 | 4 | 2 | 1 |

### Seer Spells Known

| Level | Tier 1 | Tier 2 | Tier 3 |
|-------|--------|--------|--------|
| 1 | 2 | -- | -- |
| 2 | 3 | -- | -- |
| 3 | 3 | 1 | -- |
| 4 | 3 | 2 | -- |
| 5 | 3 | 2 | 1 |

### Surgeon Preparations Known

Surgeons don't "cast" spells -- they prepare remedies during a rest. Preparations known are always available; the limit is ingredients and time.

| Level | Tier 1 | Tier 2 | Tier 3 |
|-------|--------|--------|--------|
| 1 | 3 | -- | -- |
| 2 | 4 | -- | -- |
| 3 | 4 | 1 | -- |
| 4 | 4 | 2 | -- |
| 5 | 4 | 2 | 1 |

**Preparation rules:** During a long rest, a Surgeon may prepare a number of remedies equal to their Lore stat. Each preparation consumes one use of the Surgeon's kit (cd6 supply die). Using a preparation in the field is an action (no check needed -- the check was made during preparation). A failed preparation check during rest wastes the ingredients.

### Warden Blessings Known

Wardens are not primary casters. They gain a limited number of minor blessings.

| Level | Tier 1 | Tier 2 |
|-------|--------|--------|
| 1 | 2 | -- |
| 2 | 2 | -- |
| 3 | 3 | 1 |
| 4 | 3 | 1 |
| 5 | 3 | 2 |

Wardens never gain Tier 3 spells. Their blessings are cast using Resolve (trained via Commune).

## Backlash Table (d12)

Roll when a spellcaster rolls a Natural 1 on a spell check (Invokers and Seers only).

| d12 | Effect |
|-----|--------|
| 1 | **Cascading Failure.** Roll twice more and apply both effects. |
| 2 | **Detonation.** Magical energy explodes outward. Take 1d8 damage. All creatures within close range take 1d4 damage. |
| 3 | **Refraction.** The spell targets you instead. If it can't target you, it targets your nearest ally. |
| 4 | **Wild Aim.** The spell targets a random ally within near range. If none, it targets a random creature. |
| 5 | **Severed Thread.** Lose this spell until you complete a long rest AND spend an exploration turn relearning it. |
| 6 | **Unraveling.** One random piece of gear on your person disintegrates permanently. |
| 7 | **Arcane Sickness.** Disadvantage on all spell checks until you pass a Vigor check (Difficulty 12) at the start of your turn. Resets after rest. |
| 8 | **Mind Fog.** Lose a random prepared spell until your next rest. |
| 9 | **Darkness Falls.** All light within near range is suppressed for cd8 turns, including sunlight and magical sources. |
| 10 | **Involuntary Utterance.** You scream in an unknown tongue for cd6 turns. You cannot whisper or stay silent. Triggers encounter checks. |
| 11 | **Marked.** You glow with visible arcane energy for cd8 turns. Enemies have advantage on attacks against you. |
| 12 | **Resonance Drain.** Disadvantage on all spell checks of the same tier for cd8 turns. |

## Scrolls and Wands

Spellcasters can use scrolls and wands if the spell appears on their class spell list, even if they don't currently know it.

**Scroll:** Single-use. Make a spell check as normal. Success or failure, the scroll is consumed. On a Natural 1, trigger the Backlash table.

**Wand:** Reusable. Make a spell check as normal. On failure, the wand stops working until your next rest. On a Natural 1, the wand shatters permanently and triggers the Backlash table.

**Surgeon's Kit Items:** Surgeons may find prepared remedies as loot. These can be used by anyone without a check -- they are already prepared. A Surgeon can identify unknown preparations with a Lore check (trained via Medicine).

## Talent Tables

Roll 2d6 when gaining a class talent (levels 3, 5, 7, 9).

### Invoker Talents (2d6)

| Roll | Effect |
|------|--------|
| 2 | **Artifice.** Craft one random magic item (GM determines). |
| 3-4 | +2 to Lore stat (max 10) |
| 5-7 | +1 to all Invoker spell checks |
| 8-9 | Advantage on checks to cast one specific known spell (choose) |
| 10-11 | Learn one additional Invoker spell of any tier you can cast |
| 12 | **Player's Choice.** Choose any talent from this table, or +2 to any stat. |

### Seer Talents (2d6)

| Roll | Effect |
|------|--------|
| 2 | **Prophet's Eye.** Once per session, ask the GM a question and receive a truthful two-word answer. |
| 3-4 | +2 to Resolve stat (max 10) |
| 5-7 | +1 to all Seer spell checks |
| 8-9 | Advantage on checks to cast one specific known spell (choose) |
| 10-11 | Learn one additional Seer spell of any tier you can cast |
| 12 | **Player's Choice.** Choose any talent from this table, or +2 to any stat. |

### Surgeon Talents (2d6)

| Roll | Effect |
|------|--------|
| 2 | **Master Chirurgeon.** Field Surgery restores 1d6+Lore HP instead of 1d6. |
| 3-4 | +2 to Lore stat (max 10) |
| 5-7 | +1 to all Surgeon preparation checks |
| 8-9 | Surgeon's Kit supply die steps up one size permanently (cd6 -> cd8, etc.) |
| 10-11 | Learn one additional Surgeon preparation of any tier you can prepare |
| 12 | **Player's Choice.** Choose any talent from this table, or +2 to any stat. |

### Warden Talents (2d6)

| Roll | Effect |
|------|--------|
| 2 | **Unyielding Bastion.** Shield Wall now grants +2 Armor to nearby allies instead of +1. |
| 3-4 | +1 to melee or ranged attack checks |
| 5-7 | +2 to Vigor or Resolve stat (max 10) |
| 8-9 | +1 to all Warden blessing checks |
| 10-11 | Learn one additional Warden blessing of any tier you can cast |
| 12 | **Player's Choice.** Choose any talent from this table, or +2 to any stat. |

### Scout Talents (2d6)

| Roll | Effect |
|------|--------|
| 2 | **Ghost Walk.** Advantage on all Stealth checks. Enemies need to beat your Stealth result to detect you. |
| 3-4 | +1 to ranged attack checks |
| 5-7 | +2 to Reflex or Wits stat (max 10) |
| 8-9 | Ambush damage increases by +1 die size (d6 -> d8, etc.) |
| 10-11 | Gain one additional trained skill from the Scout list |
| 12 | **Player's Choice.** Choose any talent from this table, or +2 to any stat. |

### Rogue Talents (2d6)

| Roll | Effect |
|------|--------|
| 2 | **Slippery Mind.** Advantage on Resolve checks against charm, fear, and compulsion. |
| 3-4 | +1 to melee attack checks |
| 5-7 | +2 to Reflex or Presence stat (max 10) |
| 8-9 | Exploit Weakness damage increases by +1d6 |
| 10-11 | Gain one additional trained skill from the Rogue list |
| 12 | **Player's Choice.** Choose any talent from this table, or +2 to any stat. |

## Spell Descriptions

Read `references/spell-list.md` for the full spell descriptions across all casting classes and tiers.

When a spell is cast, look up its entry in the reference file for range, duration, and effect details.

## Related Skills
- **core-rules** -- Resolution mechanics, stats, countdown dice, Natural 1/20 effects
- **bestiary** -- Monster resistances and vulnerabilities against spells
- **treasure** -- Scrolls, wands, and magical items found as loot
