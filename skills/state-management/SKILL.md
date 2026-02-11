---
description: "Entity file templates and state management conventions for Glintlock world files"
---

# State Management — Markdown Entity Files

All game state lives in `world/` as human-readable markdown files with YAML frontmatter. The frontmatter contains structured data (stats, HP, inventory counts). The markdown body contains narrative descriptions, notes, and freeform content.

## File Conventions

- **Filenames:** lowercase-kebab-case (e.g. `kael.md`, `merchant-vela.md`, `obsidian-keep-level-1.md`)
- **Directories:** `world/characters/`, `world/npcs/`, `world/locations/`, `world/items/`, `world/factions/`
- **Global files:** `world/quests.md`, `world/session-log.md`, `world/campaign-context.md`
- **Create:** Use the Write tool with the appropriate template below
- **Read:** Use the Read tool to load a file before narrating or making decisions
- **Update:** Read the file first, modify the relevant sections, Write the full updated file back
- **Delete:** Mark as "deceased", "destroyed", or "disbanded" in the file's frontmatter (`status: deceased`). Don't delete files — history matters

## Player Character Template

```markdown
---
type: pc
name: Kael
ancestry: Human
class: Fighter
level: 1
alignment: Neutral
title: ""
background: Urchin
xp: 0
hp: { current: 8, max: 8 }
ac: 14
stats: { str: 16, dex: 12, con: 14, int: 8, wis: 10, cha: 11 }
hit_die: d8
talents: ["Weapon Mastery (+1 to melee damage)"]
languages: ["Common", "Dwarvish"]
class_features: ["Hauler (+2 gear slots)", "Weapon Mastery (+1 melee/ranged damage)"]
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
*(None — Fighter)*

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

## Quest Board (`world/quests.md`)

```markdown
# Quest Board

## Active
- **The Missing Caravans** — Merchant Guild hired you to find out why supply caravans vanish on the Thornwood road. Reward: 50 gp. *Lead: goblin tracks at the keep entrance.*
- **The Brass Key** — Found a locked door on the east wall of the keep. Grukk carried a brass key.

## Developing
- **Vela's Debt** — Merchant Vela owes money to the thieves' guild. She hasn't asked for help yet, but it could become a problem.

## Completed
- **Rat Cellar** — Cleared rats from Vela's cellar. Earned a 10% discount.
```

## Session Log (`world/session-log.md`)

Append entries chronologically. Use tags in brackets for categorization.

```markdown
# Session Log

## Session 1 — 2026-02-11

- [event] Kael arrived in Millhaven and took the caravan investigation job from the Merchant Guild
- [discovery] Found goblin tracks at the Obsidian Keep entrance
- [event] Defeated 3 goblins in the first chamber — took 4 damage (8→4 HP)
- [ruling] Ruled that searching rubble is DC 12 INT, takes 1 exploration turn
- [thread] Locked door on east wall — need the brass key from Grukk
- [world-advance] The thieves' guild has noticed the PC poking around the keep
- [world-advance] A merchant caravan is 2 days overdue — tensions rising in town
```

## Campaign Context (`world/campaign-context.md`)

Written once during `/glintlock:new-session`. Updated only if the campaign premise fundamentally changes.

```markdown
# Campaign Context

**Setting:** The frontier town of Millhaven, on the edge of the Thornwood.
**Premise:** Caravans have been disappearing on the trade road. The Merchant Guild is desperate for answers. Something stirs in the ruins of the Obsidian Keep.
**Tone:** Grim frontier survival. Resources are scarce, allies are few, and the darkness is hungry.
**Language:** eng
**Starting Date:** Day 1 of the Harvest Moon.
```

## State Update Rules

1. **Read before you act.** Always Read the relevant entity file before narrating consequences that depend on its data.
2. **Update immediately.** After any state change (HP loss, item gained, NPC killed, quest progressed), Read the file, modify it, and Write it back. Don't batch updates. Don't defer.
3. **Session log is append-only.** Never edit past entries. Only append new ones.
4. **Quests move between sections.** Active → Completed when resolved. Developing → Active when the PC engages. New quests go to Active or Developing depending on player awareness.
5. **Dead NPCs stay.** Set `status: deceased` in frontmatter. Add a note about how they died. Don't delete the file.
