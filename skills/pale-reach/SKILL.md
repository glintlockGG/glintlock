---
name: pale-reach
description: "The Pale Reach — default starter sandbox for [SYSTEM]. Contains home base (Thornwall), hex map with 6 terrain types, 5 myth-site dungeons, encounter tables, factions, and First Watch starter adventure. This skill should be used when running exploration, entering dungeons, checking encounter tables, looking up hex terrain, or referencing sandbox NPCs and factions in the Pale Reach setting."
---

# The Pale Reach — Starter Sandbox

The Pale Reach is the default press-play sandbox for [SYSTEM]. For custom campaigns, use the `adventure-design` skill to generate adventures during session zero or mid-campaign.

A frontier sandbox designed for level 1-10 characters in a West Marches-style campaign where the player chooses where to go and what to do. Five myths threaten the land, progress clocks track the region's fate, and countdown dice ensure every expedition is a gamble against time and resources.

## Regional Overview

The Pale Reach is a dark frontier at the edge of civilization — a stretch of contested wilderness where old things stir beneath barrow mounds, ancient forests hunger, and the land itself remembers injuries done to it centuries ago. Thornwall, the last fortified waystation, clings to survival at the center of a region that wants to swallow it.

**Theme:** Civilization is fragile. The land has memory and intent. Five myths — sleeping powers woven into the geography — are waking. Each has an adventure site at its heart. The player must decide which threats to confront, which to ignore, and how to keep Thornwall alive through winter.

**Tone:** Grim frontier survival meets mythic horror. Resources are scarce. Allies are few. The darkness is hungry. But there are treasures in the old places, secrets worth uncovering, and a community worth saving — if you can hold the line long enough.

**The Five Myths:** Each myth is a dormant power tied to a specific terrain. As omens advance (tracked in `world/myths.md`), the myth's influence spreads — corrupting wildlife, warping weather, emboldening servants. At omen level 6, the myth manifests catastrophically. The player can push back by confronting the myth at its source (adventure site).

**Current Situation:** Thornwall is undermanned and undersupplied. The garrison is shrinking. Supply caravans have stopped arriving reliably. The surrounding lands grow stranger by the week. Commander Vess needs scouts, investigators, and anyone willing to venture beyond the walls. The bounty board at Warden's Hall has work — and the Pale Reach has secrets worth dying for.

---

## Hex Map Reference

The Pale Reach is mapped as a 7×5 grid of 6-mile hexes. Columns run 01-07 (west to east), rows run 01-05 (north to south). Thornwall sits at center (hex 0403).

### Terrain Types

| Terrain | Description |
|---------|-------------|
| **Thornwood** | Dense, ancient forest. Dark canopy, tangled undergrowth, the Green Maw's domain. |
| **The Wolds** | Rolling grassland dotted with barrow mounds. Open sky, cold winds, the Hollow King's domain. |
| **Ashfall Crags** | Volcanic ridges and abandoned mines. Steam vents, unstable ground, the Iron Seam's domain. |
| **The Fenway** | Marshland and bog. Fog, sucking mud, disease, the Pale Shepherd's domain. |
| **Greenmere Valley** | Lush valley with overgrown ruins. Unsettlingly beautiful, the Antler Court's domain. |
| **The Bleach** | Salt flats and wasteland. Howling wind, no cover, no life. Where all myths converge. |

### Travel Times

| Terrain | Time per Hex | Notes |
|---------|-------------|-------|
| Road | 4 hours | Well-maintained route |
| Wolds | 6 hours | Open terrain, good visibility |
| Thornwood | 8 hours | Dense canopy, limited sightlines |
| Ashfall Crags | 10 hours | Steep, unstable, altitude |
| Fenway | 10 hours | Waterlogged, sucking mud |
| Greenmere Valley | 6 hours | Easy terrain but disorienting |
| The Bleach | 8 hours | Exposed, no shelter, no water |

**Forced march:** Halve travel time but make a Vigor (Endurance) check (Difficulty 12). Failure = exhaustion (disadvantage on all checks until long rest).
**Night travel:** Double travel time. Random encounter checks every 2 hours instead of every 4. Countdown dice for light sources tick twice as fast.

### Hex Map Table

| Hex | Terrain | Danger | Feature |
|------|-----------|----------|--------------------------------------|
| 0101 | Ashfall Crags | Deadly | Volcanic vent field |
| 0201 | Ashfall Crags | Risky | **The Iron Seam** (myth-site dungeon) |
| 0301 | Ashfall Crags | Risky | Collapsed watchtower |
| 0401 | Wolds | Unsafe | Northern barrow field |
| 0501 | Wolds | Risky | **Hollow King's Barrow** (myth-site dungeon) |
| 0601 | Wolds | Unsafe | Shepherd's ruins |
| 0701 | Fenway | Risky | Deep marsh (impassable without guide) |
| 0102 | Ashfall Crags | Risky | Abandoned prospector camps |
| 0202 | Thornwood | Risky | Old logging road (overgrown) |
| 0302 | Thornwood | Unsafe | Forest edge — patrol route |
| 0402 | Wolds | Unsafe | Road to Thornwall (maintained) |
| 0502 | Wolds | Unsafe | Crossroads waystone |
| 0602 | Fenway | Risky | **Pale Shepherd's Domain** (myth-site dungeon) |
| 0702 | Fenway | Deadly | Poison gas flats |
| 0103 | Thornwood | Risky | Hermit's cabin (sage) |
| 0203 | Thornwood | Risky | **Heart of the Green Maw** (myth-site dungeon) |
| 0303 | Thornwood | Unsafe | Western approach to Thornwall |
| 0403 | Wolds | Safe | **Thornwall** (home base) |
| 0503 | Greenmere Valley | Unsafe | Valley entrance — standing stones |
| 0603 | Greenmere Valley | Risky | **Antler Court Ruins** (myth-site dungeon) |
| 0703 | Greenmere Valley | Risky | Eldren settlement ruins |
| 0104 | Thornwood | Deadly | Deep forest — the canopy closes |
| 0204 | Thornwood | Risky | Goblin encampment |
| 0304 | Wolds | Unsafe | Southern barrow field |
| 0404 | Wolds | Unsafe | Open plains — caravan route |
| 0504 | Greenmere Valley | Unsafe | Meadowland — wildflowers |
| 0604 | Fenway | Risky | Marsh crossing — old bridge |
| 0704 | The Bleach | Deadly | Salt flats — no shelter |
| 0105 | Ashfall Crags | Deadly | Deep mine shafts |
| 0205 | Thornwood | Risky | Bandit hideout |
| 0305 | Wolds | Unsafe | Southern road |
| 0405 | Fenway | Unsafe | Fenway edge — reeds and fog |
| 0505 | Greenmere Valley | Risky | Ruined waystation |
| 0605 | The Bleach | Deadly | Monolith field |
| 0705 | The Bleach | Deadly | Edge of the known world |

### Danger Levels

| Level | Encounter Frequency | Typical Threat |
|-------|-------------------|----------------|
| Safe | 1-in-12 per 4 hours | Wildlife, travelers |
| Unsafe | 1-in-8 per 4 hours | Patrols, predators, minor threats |
| Risky | 1-in-6 per 4 hours | Monsters, hostile factions, traps |
| Deadly | 1-in-4 per 4 hours | Boss creatures, overwhelming numbers, myth servants |

---

## Adventure Content

For detailed adventure content, load the appropriate reference file:

### Home Base
- **Thornwall** — `references/thornwall.md` — Fortified waystation, 5 locations, 5 key NPCs, bounty board, services

### Starter Adventure
- **First Watch** — `references/first-watch.md` — 3-act tutorial adventure introducing resource pressure, myth omens, and sandbox exploration

### Myth-Site Dungeons (5)
Each myth has an adventure site — a dungeon at the heart of the threat. Confronting and resolving the myth at its source reduces or resets the omen track.

- **The Hollow King's Barrow** — `references/myth-hollow-king.md` — Undead lord's tomb in the Wolds (hex 0501)
- **The Heart of the Green Maw** — `references/myth-green-maw.md` — Living heart-tree deep in Thornwood (hex 0203)
- **The Pale Shepherd's Domain** — `references/myth-pale-shepherd.md` — Death shrine in the Fenway marshes (hex 0602)
- **The Iron Seam** — `references/myth-iron-seam.md` — Abandoned mine with living metal in Ashfall Crags (hex 0201)
- **The Antler Court** — `references/myth-antler-court.md` — Fey court ruins in Greenmere Valley (hex 0603)

### Encounter Tables
Use `roll_oracle` with terrain-specific encounter tables:
- `encounter_thornwood` — Forest encounters
- `encounter_wolds` — Grassland/barrow encounters
- `encounter_ashfall` — Mountain/mine encounters
- `encounter_fenway` — Marsh encounters
- `encounter_greenmere` — Valley/fey encounters
- `encounter_bleach` — Wasteland encounters

Higher omen levels unlock more dangerous entries on each table (noted in parentheses).

### Factions
- **Faction summary** — `references/factions-summary.md` — 5 factions operating in the Pale Reach

## Related Skills
- **core-rules** — Encounter resolution, Difficulty formula, combat mechanics
- **bestiary** — Creature stat blocks for encounter tables
- **treasure** — Dungeon loot and hoard generation
