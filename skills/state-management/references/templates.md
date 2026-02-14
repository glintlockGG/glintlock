# Entity Templates

## Player Character Template

```markdown
---
type: pc
name: Kael
ancestry: Human
class: Warden
level: 1
background: Deserter
hp: { current: 8, max: 8 }
armor: 3
stats: { vigor: 7, reflex: 5, wits: 4, resolve: 6, presence: 3, lore: 4 }
hp_die: d10
training: ["Athletics", "Endurance", "Fortitude", "Athletics"]
languages: ["Common", "Dwerrow"]
class_features: ["Shield Wall (+1 Armor to close allies, auto-pass Vigor/Resolve 1/rest)"]
ancestry_traits: ["Adaptable (1 extra trained skill, 1 reroll/session)"]
beast_aspect: ""
background_hook: "Deserted from the Thornwall garrison six months ago. Commander Vess remembers."
current_location: thornwall
countdown_dice: { torches: "cd8", rations: "cd8" }
---
# Kael

## Description
A broad-shouldered man with cropped hair and a pale scar across his throat. His boots are military-issue — the only thing he kept.

## Inventory
- Longsword (1 slot)
- Shield (1 slot)
- Chainmail (2 slots)
- Torch ×2 (1 slot)
- Rations ×3 (1 slot)
- Rope, 60ft (1 slot)
- Military-issue boots
- Forged papers

**Gold:** 8 gp | **Silver:** 0 sp | **Copper:** 0 cp
**Gear Slots:** 7/12

## Spells
*(None — Warden)*

## Notes
- Arrived in Thornwall seeking a fresh start
- Background hook: deserted his post, Commander Vess may recognize him
```

## NPC Template

```markdown
---
type: npc
name: Corvin Half-Tooth
status: alive
location: mended-flask
disposition: neutral
current_goal: ""
current_action: ""
voice_id: ""
voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0 }
---
# Corvin Half-Tooth

## Description
A wiry man with a missing front tooth and a knowing grin. Runs the Mended Flask tavern. Speaks in half-finished sentences, always implying he knows more than he says.

## Combat Stats
*(Non-combatant — runs if threatened)*

## Notes
- Hears everything that happens in Thornwall
- Will trade information for coin or favors
```

For combat-relevant NPCs, include full stats in the frontmatter:

```markdown
---
type: npc
name: Grukk
status: alive
location: thornwood-edge
disposition: hostile
current_goal: "raid Thornwall supply wagons"
current_action: "scouting the road south of Thornwall"
voice_id: ""
voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0 }
hp: { current: 5, max: 5 }
armor: 0
attack_die: d4
attack_description: "crude spear"
zone: melee
priority: nearest
weakness: fire
morale: 12
is_undead: false
---
# Grukk

## Description
A scarred goblin raider with a necklace of finger bones. Chatters to himself constantly.

## Notes
- Part of a raiding party from the Thornwood
- Carries a crude map scratched on bark
```

## Location Template

```markdown
---
type: location
name: Thornwall — Warden's Hall
danger_level: safe
light: bright
connections: ["mended-flask", "the-stacks", "root-cellar", "main-gate"]
---
# Thornwall — Warden's Hall

## Description
A squat stone building at the center of Thornwall, its walls thick enough to withstand a siege. A fire burns in a wide hearth. Maps and reports cover a long table. The air smells of woodsmoke and old ink.

## Contents
- Commander Alara Vess's desk (locked — Tinker check Difficulty 10 to pick)
- Regional map on the wall (shows known hex locations)
- Bounty board with three postings

## Notes
- Commander Vess is here during daylight hours
- The bounty board is the main quest source
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
- Once per day: reroll a failed Resolve check
- Cursed: cannot be voluntarily removed (Lore check Difficulty 8 or Remove Curse)

## History
- Found in the barrow beneath the Wolds
- Previously belonged to a forgotten priest
```

## Faction Template

```markdown
---
type: faction
name: Thornwall Garrison
disposition_to_pc: neutral
---
# Thornwall Garrison

## Description
The beleaguered defenders of Thornwall. Undermanned, undersupplied, and losing hope. They hold the walls and patrol the nearest roads.

## Members
- **Commander Alara Vess** — Garrison commander, pragmatic and exhausted
- **Sergeant Brenn** — Veteran wall guard, loyal to Vess
- **The Watch** — 12 remaining soldiers, some barely trained

## Goals
- Maintain the perimeter against increasing threats
- Secure the caravan route to restore supply lines
- Investigate the disturbances coming from the Wolds

## Notes
- Morale is fragile — tracked by the Garrison Morale progress clock
- Will hire the PC for scouting and investigation work
```

## Dooms Template (`world/dooms.md`)

Campaigns have 3-6 dooms. The Pale Reach starter has 5. Custom campaigns define their own during session zero.

```markdown
# Campaign Dooms

## {Doom Name}
- **Location:** {region or terrain}
- **Portent Level:** 0/6
- **Current Portent:** Dormant. {initial atmospheric detail}
- **Advances when:** {trigger conditions}
- **At level 6:** {catastrophic manifestation}
```

### Pale Reach Default Dooms

For the Pale Reach starter sandbox, use these five dooms:

- **The Hollow King** — The Wolds (barrow complex). Advances when the dead are disturbed, graves are looted. At 6: undead army marches on Thornwall.
- **The Green Maw** — Thornwood (deep forest). Advances when trees are felled, forest entered carelessly. At 6: forest expands aggressively, swallowing roads.
- **The Pale Shepherd** — The Fenway (marshlands). Advances when people die near marshes, bodies left unburied. At 6: death-procession heads for Thornwall.
- **The Iron Seam** — Ashfall Crags (abandoned mine). Advances when the mine is disturbed, metal taken. At 6: living metal erupts, tools corrode.
- **The Antler Court** — Greenmere Valley (overgrown ruins). Advances when bargains are broken, fey insulted. At 6: fey claim the valley, mortals hunted for sport.

## Progress Clocks Template (`world/clocks.md`)

```markdown
# Progress Clocks

## {Clock Name}
- **Segments:** 0/{4|6|8}
- **Trigger:** {what ticks this clock}
- **Completes:** {consequence when filled}
```

### Pale Reach Default Clocks

For the Pale Reach starter sandbox, use these starting clocks:

- **Winter Approaches** (0/8) — Ticks at each world-turn or narrative pause. Completes: deep winter, starvation risk.
- **Garrison Morale** (0/6) — Ticks when Thornwall suffers losses or bad news. Completes: garrison breaks, desertion.
- **Caravan Route** (0/4) — Ticks when PC secures road segments. Completes: trade restored (positive).
- **The Undercroft** (0/6) — Ticks when something stirs beneath Thornwall. Completes: dungeon opens below the keep.

## Calendar (`world/calendar.md`)

Tracks in-game time, season, weather, and real-time synchronization metadata.

```markdown
# Calendar

## Current Date
Day 1 of the Harvest Moon, Year 1

## Season
Late autumn. The air carries the smell of damp earth and dying leaves. Frost rimes the walls at dawn.

## Time of Day
Morning — roughly 8 hours of daylight remaining.

## Notable Upcoming Events
- Winter solstice in ~60 days — deep winter begins
- Caravan from the south expected within the week (if the road holds)

## Recent Weather
Overcast skies, cold wind from the north. Threat of rain.

## Metadata
last_played: 2026-02-14T10:00:00
last_world_turn: 2026-02-14T10:00:00
real_time_ratio: 1:1
campaign_start_real: 2026-02-14T10:00:00
campaign_start_game: Day 1, Harvest Moon, Year 1
```

**Update rules:**
- Update `last_played` each time play resumes
- Update `last_world_turn` after each world-advance
- Advance the in-game date during world-turns based on `real_time_ratio`
- Update season description when the season changes
- Update weather at narrative transitions (use `oracle_yes_no` for weather shifts)

## GM Notes (`world/gm-notes.md`)

The GM's persistent prep buffer. See `references/gm-notes-template.md` for the full template. Refreshed during `/glintlock:resume`, `/glintlock:world-turn`, and at narrative pauses during play.

## Campaign Memory (`world/CLAUDE.md`)

A curated hot cache of the most important campaign state, loaded at the start of every conversation by the SessionStart hook. Uses markdown tables for compact, scannable content. Updated periodically during play and at narrative pauses.

```markdown
# Campaign Memory

## Character
{Name}, {Ancestry} {Class}, Level {N}. {current}/{max} HP. Armor {N}. Currently in {location}.
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

## Doom Status
| Doom | Portent | Notes |
|------|------|-------|
| {Doom 1} | 0/6 | {status} |
| {Doom 2} | 0/6 | {status} |
| {Doom 3} | 0/6 | {status} |

## World State
{1-3 sentence summary of where the campaign stands}

→ Quests: world/quests.md
→ NPCs: world/npcs/
→ Locations: world/locations/
→ Dooms: world/dooms.md
→ Clocks: world/clocks.md
→ Session history: world/session-log.md
```

**Update rules:**
- Updated periodically during play (at narrative pauses) and when resuming via `/glintlock:resume`
- Keep total length under ~80 lines
- Tables are additive — add new rows for new observations, remove rows only when they're wrong or outdated
- The World State paragraph should be rewritten to reflect the current state after significant changes
- Active Threads should be kept current — remove resolved threads, add new ones, update status
- Doom Status should always reflect current portent levels
