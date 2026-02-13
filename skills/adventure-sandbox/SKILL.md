---
name: adventure-sandbox
description: "West Marches sandbox adventure set in The Dimmark. Contains home base (The Wick), hex map, encounter tables, and two dungeons (Ashfall Mine and The Obsidian Keep). This skill should be used when running exploration, entering dungeons, checking encounter tables, looking up hex terrain, or referencing sandbox NPCs and factions."
---

# The Dimmark — West Marches Sandbox

A frontier sandbox adventure for Torchlit. Designed for level 1-4 characters in a West Marches-style campaign where the party chooses where to go and what to do. Emphasizes exploration, resource scarcity, and the ever-present threat of darkness.

## Regional Overview

The Dimmark is a stretch of untamed wilderness at the ragged edge of civilization, where the ruins of older worlds press up against the living dark. To the north, volcanic ridges smolder beneath perpetual storm clouds. To the east, the land slopes down toward the Sunless Sea, a vast subterranean ocean whose black shores swallow the light. To the south and west, forests and swamps choke the lowlands, ancient and hostile.

**Theme:** Gothic horror meets treasure hunt. The darkness itself is the real enemy — torches gutter, lanterns fail, and what lives in the black spaces between the ruins is older than memory. Every expedition is a gamble: push deeper for greater rewards, or turn back before the light runs out.

**Tone:** Resource scarcity defines life here. Torches are currency. Iron is precious. Food spoils. The frontier settlement of The Wick survives because it controls the last reliable light source for miles — a decommissioned beacon tower whose glow keeps the worst of the dark at bay. Beyond its circle, anything goes.

**The Old World:** Ruins dot the Dimmark — shattered keeps, flooded mines, crumbling shrines to forgotten gods. Something catastrophic happened here long ago. The land remembers it in the form of warped stone, cursed ground, and things that should not still be moving. Scholars call it the Unraveling. Nobody agrees on what caused it.

**The Living Dark:** Darkness in the Dimmark is not merely the absence of light. It has weight. It has hunger. Torches burn faster underground. Lantern oil thickens. Magical light attracts attention. The creatures that thrive here have adapted: echolocation, thermal vision, bioluminescence used as lure. Light is survival. Darkness is death.

**Current Situation:** Adventurers have been arriving at The Wick in increasing numbers, drawn by rumors of treasure in the ruins and bounties posted by the Reeve. The settlement needs trade routes secured, threats eliminated, and the surrounding hexes mapped. The Wick pays for information, pays more for proof of cleared dangers, and pays most for recovered artifacts from the old world.

---

## Hex Map Reference

The Dimmark is mapped as a 7x5 grid of 6-mile hexes. Columns run 01-07 (west to east), rows run 01-05 (north to south).

### Travel Times

| Terrain | Time per Hex | Notes |
|---------|-------------|-------|
| Road | 4 hours | Well-maintained trade path |
| Grassland | 6 hours | Open terrain, good visibility |
| Forest | 8 hours | Dense canopy, limited sightlines |
| Hills | 8 hours | Elevation gain, rocky terrain |
| Swamp | 10 hours | Waterlogged, sucking mud, disease risk |
| Mountains | 12 hours | Steep, exposed, altitude sickness possible |
| Ruins | 8 hours | Unstable ground, structural hazards |

**Forced march:** Halve travel time but make a CON check on arrival. Failure = 1 level of exhaustion.
**Night travel:** Double travel time. Random encounter checks every 2 hours instead of every 4.

### Fog of War

Hexes start **undiscovered**. Terrain type is unknown until revealed by:
- Traveling into or through the hex
- Observing from high ground (reveals terrain type of adjacent hexes, not features)
- NPC rumors (may reveal terrain type and/or feature, reliability varies)
- Found maps (rare, often incomplete or outdated)

### Hex Map Table

| Hex | Terrain | Danger | Feature |
|------|-----------|----------|--------------------------------------|
| 0101 | Mountains | Deadly | Stormcradle Peak (perpetual lightning) |
| 0201 | Hills | Risky | Ashfall Mine (quickstart dungeon) |
| 0301 | Grassland | Unsafe | The Wick (home base) |
| 0401 | Forest | Unsafe | Old trade road (overgrown) |
| 0501 | Forest | Risky | Thornwall (fey grove, Faekin enclave) |
| 0601 | Swamp | Risky | Bogwitch's Dwelling |
| 0701 | Swamp | Deadly | The Mire Pit (sinkhole labyrinth) |
| 0102 | Mountains | Risky | Goat herder camps (seasonal) |
| 0202 | Hills | Unsafe | Bandit lookout tower |
| 0302 | Grassland | Safe | Road to The Wick (patrol route) |
| 0402 | Forest | Risky | Hermit's Tower (sage) |
| 0502 | Ruins | Risky | Collapsed shrine (old faith) |
| 0602 | Swamp | Risky | Stranded merchant camp |
| 0702 | Hills | Unsafe | Ironborn prospector claim |
| 0103 | Mountains | Deadly | Bloodwing roost (volcanic caves) |
| 0203 | Hills | Risky | Abandoned watchtower |
| 0303 | Grassland | Unsafe | Crossroads (ruined waystation) |
| 0403 | Forest | Unsafe | Wolf den |
| 0503 | Ruins | Deadly | The Sunless Shore (beach access) |
| 0603 | Ruins | Deadly | Isla Cineria (via boat from 0503) |
| 0703 | Mountains | Deadly | Deep stair entrance (sealed) |
| 0104 | Hills | Risky | Tunnel Hulk territory |
| 0204 | Forest | Unsafe | Logging camp (abandoned) |
| 0304 | Grassland | Unsafe | Merchant caravan route |
| 0404 | Swamp | Risky | Sunken ruin (partially flooded) |
| 0504 | Ruins | Deadly | The Obsidian Keep (major dungeon) |
| 0604 | Forest | Risky | Rockfang nest |
| 0704 | Hills | Risky | Cave system (unexplored) |
| 0105 | Mountains | Deadly | Volcanic vent field |
| 0205 | Hills | Unsafe | Bandit camp (main hideout) |
| 0305 | Forest | Risky | Webspinner colony |
| 0405 | Swamp | Deadly | Poisonous gas flats |
| 0505 | Ruins | Risky | Ruined village (scavengers) |
| 0605 | Grassland | Unsafe | Open plains (good hunting) |
| 0705 | Forest | Unsafe | Abandoned shrine (intact) |

### Danger Levels

| Level | Encounter Frequency | Typical Threat |
|-------|-------------------|----------------|
| Safe | 1-in-12 per 4 hours | Wildlife, travelers |
| Unsafe | 1-in-8 per 4 hours | Patrols, predators, minor undead |
| Risky | 1-in-6 per 4 hours | Monsters, hostile factions, traps |
| Deadly | 1-in-4 per 4 hours | Boss creatures, overwhelming numbers |

---

## Adventure Content

For detailed adventure content, load the appropriate reference file:

### Home Base
- **The Wick** — `references/the-wick.md` — Frontier settlement, 6 NPC locations, services, bounty board

### Dungeons
- **Ashfall Mine** — `references/ashfall-mine.md` — Quickstart dungeon (10 rooms), level 1, hex 0201
- **The Obsidian Keep** — Multi-level dungeon complex on Isla Cineria, hex 0504:
  - Overview, factions, rumors — `references/obsidian-keep-overview.md`
  - Harbor (rooms 1-11) — `references/obsidian-keep-harbor.md`
  - Beach (rooms 1-15) — `references/obsidian-keep-beach.md`
  - Keep Grounds (rooms 1-13) + monster stat blocks — `references/obsidian-keep-grounds.md`
  - Cellar (rooms 1-14) — `references/obsidian-keep-cellar.md`
  - Level 1 (rooms 15-29) — `references/obsidian-keep-level-1.md`
  - Level 2 (rooms 30-48) — `references/obsidian-keep-level-2.md`
  - Level 3 (rooms 49-55) + key magic items — `references/obsidian-keep-level-3.md`
  - Ending — `references/obsidian-keep-ending.md`

### Encounter Tables
- **Overworld encounters** — `references/overworld-encounters.md` — 5 terrain tables (road, forest, hills, swamp, ruins)

### Factions
- **Faction summary** — `references/factions-summary.md` — 6 faction descriptions

## Related Skills
- **core-rules** — Encounter resolution, check DCs, combat mechanics
- **bestiary** — Creature stat blocks for encounter tables
- **treasure** — Dungeon loot and hoard generation
