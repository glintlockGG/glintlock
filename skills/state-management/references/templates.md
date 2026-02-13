# Entity Templates

## Player Character Template

```markdown
---
type: pc
name: Kael
ancestry: Human
class: Sellsword
level: 1
alignment: Neutral
title: ""
background: Urchin
xp: 0
hp: { current: 8, max: 8 }
ac: 14
stats: { str: 16, dex: 12, con: 14, int: 8, wis: 10, cha: 11 }
hit_die: d8
talents: ["Blade Mastery (+1 to melee damage)"]
languages: ["Common", "Ironspeak"]
class_features: ["Pack Mule (+2 gear slots)", "Blade Mastery (+1 melee/ranged damage)"]
ancestry_traits: ["Ambitious (advantage on one roll per session)"]
weapon_proficiencies: ["All weapons"]
armor_proficiencies: ["All armor", "Shields"]
current_location: obsidian-keep-entrance
---
# Kael

## Description
A weathered sellsword with a scar across his left cheek and calloused hands that speak of years gripping a blade.

## Inventory
- Bastard sword (1 slot)
- Leather armor (1 slot)
- Torch ×3 (1 slot)
- Rope, 60ft (1 slot)
- Rations ×3 (1 slot)

**Gold:** 12 gp | **Silver:** 5 sp | **Copper:** 0 cp
**Gear Slots:** 5/10

## Spells
*(None — Sellsword)*

## Notes
- Hired by the merchant guild to investigate disappearances near the ruins
- Distrusts magic users after an incident in his past
```

## NPC Template

```markdown
---
type: npc
name: Merchant Vela
status: alive
location: market-square
disposition: friendly
voice_id: ""
voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0 }
---
# Merchant Vela

## Description
A sharp-eyed halfling woman who runs a provisions stall. Missing her left ring finger. Speaks quickly, laughs easily.

## Combat Stats
*(Non-combatant — flees if threatened)*

## Notes
- Offered the party a 10% discount after they cleared rats from her cellar
- Knows rumors about the old keep — will share if asked
- Owes a debt to the thieves' guild
```

For combat-relevant NPCs, include full stats in the frontmatter:

```markdown
---
type: npc
name: Grukk
status: alive
location: obsidian-keep-level-1
disposition: hostile
voice_id: ""
voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0 }
hp: { current: 9, max: 9 }
ac: 11
stats: { str: 14, dex: 10, con: 12, int: 6, wis: 8, cha: 6 }
attacks: ["Rusty axe +2 (1d6+1)"]
movement: close
morale: 7
is_undead: false
---
# Grukk

## Description
A scarred goblin boss with a crown made of bent copper coins. Barks orders at his underlings.

## Notes
- Commands 4 goblins in the first chamber
- Carries a brass key to the locked door on the east wall
```

## Location Template

```markdown
---
type: location
name: Obsidian Keep — Entrance
danger_level: unsafe
light: dark
connections: ["market-road", "obsidian-keep-level-1"]
---
# Obsidian Keep — Entrance

## Description
A crumbling stone archway leads into darkness. The air smells of damp earth and old iron. Claw marks score the walls at waist height. A toppled statue of a knight lies across the threshold, its head missing.

## Contents
- Toppled statue (searchable — DC 12 INT to find a silver ring worth 5 sp in the rubble)
- Torch sconces (empty)
- Faded mural on east wall depicting a battle

## Notes
- Goblin tracks lead deeper inside (DC 9 WIS to notice)
- Wind occasionally gusts from within — suggests openings deeper in
```

## Item Template

```markdown
---
type: item
name: Moonstone Amulet
owner: kael
magical: true
---
# Moonstone Amulet

## Description
A pale blue stone set in tarnished silver on a fine chain. Glows faintly in total darkness (5ft dim light).

## Properties
- Provides 5ft dim light in total darkness
- Once per day: reroll a failed WIS check
- Cursed: cannot be voluntarily removed (DC 15 INT check or Remove Curse spell)

## History
- Found in the ossuary beneath the Obsidian Keep
- Previously belonged to the keep's chaplain
```

## Faction Template

```markdown
---
type: faction
name: The Merchant Guild
disposition_to_pc: friendly
---
# The Merchant Guild

## Description
A coalition of traders and shopkeepers in Millhaven. They control the market square and maintain the town's only warehouse.

## Members
- **Alderman Foss** — Guild leader, pompous but fair
- **Merchant Vela** — Provisions dealer, guild member in good standing
- **Darrow the Smith** — Arms dealer, reluctant member

## Goals
- Reopen the trade road through the Thornwood
- Investigate disappearances affecting their supply caravans
- Keep the thieves' guild from gaining more influence

## Notes
- Hired the PC to investigate the ruins
- Will pay 50 gp for proof of what's causing the disappearances
```

## Campaign Memory (`world/CLAUDE.md`)

A curated hot cache of the most important campaign state, loaded at the start of every session by the SessionStart hook. Uses markdown tables for compact, scannable content. Updated at the end of each session.

```markdown
# Campaign Memory

## Character
{Name}, {Ancestry} {Class}, Level {N}. {current}/{max} HP. Currently in {location}.
→ Full sheet: world/characters/{name}.md

## Play Style
| Preference | Detail |
|-----------|--------|
| Tone | {tone preferences} |
| Pacing | {pacing preferences} |
| Likes | {what the player enjoys} |
| Dislikes | {what the player dislikes} |

## Player Character
| Trait | Detail |
|-------|--------|
| Personality | {personality observations} |
| Social | {social behavior patterns} |
| Combat | {combat preferences and tactics} |

## Narrative Patterns
| What Works | What to Avoid |
|-----------|---------------|
| {effective pattern} | {pattern to avoid} |

## Rulings
| Situation | Ruling |
|-----------|--------|
| {situation} | {ruling} |

## Active Threads
| Thread | Status |
|--------|--------|
| {thread name} | {current status} |

## World State
{1-3 sentence summary of where the campaign stands}

→ Quests: world/quests.md
→ NPCs: world/npcs/
→ Locations: world/locations/
→ Session history: world/session-log.md
```

**Update rules:**
- Updated at the end of each session (see `/glintlock:end-session`)
- Keep total length under ~80 lines
- Tables are additive — add new rows for new observations, remove rows only when they're wrong or outdated
- The World State paragraph should be rewritten each session to reflect the current state
- Active Threads should be kept current — remove resolved threads, add new ones, update status
