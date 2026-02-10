---
name: shadowdark-adventure
description: "The Lost Citadel of the Scarlet Minotaur adventure module. Load when running this adventure. Contains factions, environment rules, random encounters, and all room descriptions."
---

# Lost Citadel of the Scarlet Minotaur

A 1st-3rd level adventure for Shadowdark RPG.

## Background

Long ago, a mighty enclave of warriors lived inside a citadel carved into the bedrock of a remote highland. Their leader, a fearsome minotaur champion, wore scarlet-dyed armor and wielded a massive greataxe. When the enclave fell to infighting and dark magic, the citadel was sealed and forgotten. Now, beastmen and ettercaps have moved in, drawn by the lingering power — and the Scarlet Minotaur itself still stalks the deepest halls, twisted by centuries of undeath.

## Factions

### Beastmen
- Occupy the upper levels (Areas 1-14 roughly)
- Led by the strongest among them; loose hierarchy
- Territorial but not organized — they fight in small groups
- Use the beastman_npc oracle table for names/appearance/behavior
- Stat block: Beastman (LV 1) — see shadowdark-monsters skill

### Ettercaps
- Occupy the lower/eastern sections
- More cunning than beastmen; set web traps
- Hostile to beastmen (territorial conflict)
- Use the ettercap_npc oracle table for names/appearance/behavior
- Stat block: Ettercap (LV 3) — see shadowdark-monsters skill

### The Scarlet Minotaur
- Wanders the entire citadel
- Appears in random encounters with cumulative modifier
- Ancient undead champion — extremely dangerous for low-level characters
- Stat block: Minotaur (LV 7) — see shadowdark-monsters skill
- Wears corroded scarlet-dyed chainmail, wields a massive greataxe

## Environment

- **Danger Level:** Risky (random encounter check every 2 crawling rounds)
- **Light:** Total darkness throughout unless specifically noted
- **Doors:** Heavy stone, 1-in-6 chance stuck. Unlocked unless noted.
- **Ceilings:** 10 feet high in corridors, 15-20 feet in chambers
- **Walls:** Rough-hewn stone, damp in lower levels
- **Air:** Stale, faintly metallic. Smells of mold and animal musk.

## Random Encounters (1d8)

Roll 1d8 with a cumulative -2 modifier each time a random encounter is rolled (tracked via session_meta key "scarlet_minotaur_modifier"). When the modified result is 0 or below, the Scarlet Minotaur appears.

| d8 (modified) | Encounter |
|---|---|
| ≤0 | The Scarlet Minotaur (reset modifier to 0 after encounter) |
| 1 | 1d4 beastmen (patrolling) |
| 2 | 1d3 ettercaps (hunting) |
| 3 | 1d6 giant rats (scavenging) |
| 4 | 1 giant spider (lurking on ceiling) |
| 5 | 2d4 goblins (lost, frightened) |
| 6 | 1 darkmantle (drops from above) |
| 7 | Signs of passage (tracks, scratches, webbing) — no combat |
| 8 | Distant sounds (roaring, skittering, chanting) — no combat |

## Room Key

> **NOTE:** The full room-by-room descriptions should be extracted from the GM Quickstart Guide PDF. Each room entry should include: room number/name, dimensions, description (what the PCs see/hear/smell), creatures present, treasure, traps/hazards, secrets/hidden things, and connections to other rooms.
>
> When Claude Code builds this plugin, provide the GM Quickstart Guide PDF and ask it to extract all 27 room descriptions into this file.

### Area 1: Entrance
*Placeholder — extract from GM Quickstart Guide*

### Area 2-27: Remaining Rooms
*Placeholder — extract from GM Quickstart Guide*
