# First Watch — Starter Adventure

A 3-act tutorial adventure that introduces the core systems: resource pressure (countdown dice), doom portents, combat, and sandbox exploration. Designed for a level 1 character arriving at Thornwall for the first time.

**Hook:** The player arrives at Thornwall just as things are getting worse. Commander Vess needs help immediately — the garrison is stretched thin. First Watch introduces the world, the mechanics, and the threats, then opens the sandbox.

---

## Act 1: The Supply Problem

**Trigger:** Commander Vess assigns the player to investigate why a supply wagon hasn't arrived. It was due yesterday from the south road (hex 0305 → 0404 → 0403).

### Scene 1: Briefing
*Vess leans over the map table. "Wagon left the lowlands two days ago. Should have been here yesterday. I can't spare soldiers. Find it. Bring back what you can."*

- Vess provides: a rough map showing the road south, 2 torches, 3 rations
- **Tutorial moment:** Set up countdown dice for torches and rations via `track_time`

### Scene 2: The Road South
Travel from Thornwall (0403) to the southern road (0305 via 0404). Takes ~12 hours round trip.

- **Travel:** Tick rations countdown die for a day of travel. Roll for random encounters (Unsafe territory, 1-in-8 per 4 hours).
- **Discovery (hex 0404):** The wagon tracks veer off the road. Something dragged the wagon east, toward the Wolds.

### Scene 3: The Wreck
*The wagon lies on its side in a shallow ditch, one wheel shattered. Crates are scattered. The horse is dead — throat torn. Claw marks score the wood. Some crates have been pried open and looted. Others are intact.*

- **Loot:** 3 intact supply crates (rations, oil flasks, rope — worth 15 gp to Thornwall)
- **Investigation:** Wits (Awareness) check — the claw marks are goblin. Tracks lead northeast toward the Thornwood (hex 0204).
- **Choice:** Return the supplies to Thornwall now (complete the mission), or follow the tracks (escalate to a combat encounter).
- **Tutorial moment:** If the player follows the tracks, run a combat encounter: 3 goblin raiders at their camp. Use this to teach the attack/defense/damage flow.

### Reward
Vess pays 10 gp for the recovered supplies. If the player dealt with the goblins, +5 gp bonus and the garrison's respect. Garrison Morale clock does NOT tick.

---

## Act 2: The First Portent

**Trigger:** The night after Act 1, something happens. The player is woken by shouting from the walls.

### Scene 1: Night Watch
*Sergeant Brenn is on the wall platform, staring east. The Wolds are visible in moonlight — rolling grassland, barrow mounds like dark humps. One of the barrows is glowing. A faint, cold blue light pulses from within.*

- Brenn: "That's been dark as long as anyone remembers. Started glowing an hour ago. Soldiers won't go near it."
- **Tutorial moment:** Advance the Hollow King's portent from 0 to 1. Update `world/dooms.md`.

### Scene 2: Investigation (Optional)
If the player wants to investigate the nearest barrow (hex 0401):

- **Travel:** 6 hours to reach the northern barrow field.
- **Discovery:** The barrow's stone seal has cracked. Cold air seeps out. Inside, a small chamber with old bones — but the bones have been recently disturbed. Scratch marks on the inside of the seal.
- **Encounter:** 2 skeletons animate if the player enters. Easy combat — teaches the concept of undead (immune to morale, mindless).
- **Loot:** Tarnished silver ring (5 gp), old sword (functional longsword), a stone tablet with worn runes (Maren Sable will pay 10 gp for this).

### Scene 3: Report Back
Whether the player investigates or not, reporting to Vess triggers a conversation about the dooms:

*Vess folds her arms. "Maren says there are five of these... things. Old powers. Tied to the land. She calls them dooms." A pause. "I call them threats. And they're waking up."*

- Vess explains: the bounty board now includes doom-related jobs alongside standard work
- Maren offers to explain the dooms in detail (loads pale-reach doom-site references)

---

## Act 3: The Sandbox Opens

**Trigger:** The morning after Act 2. The player wakes to find the bounty board updated.

### The Bounty Board

Three categories of work:

**Standing Bounties:**
- Road patrol (south or east) — 5 gp/day, roll encounter table
- Hex scouting (reveal undiscovered hexes) — 10 gp per new hex mapped
- Threat elimination — varies by target

**Doom Investigation:**
- Investigate the glowing barrows (Hollow King) — 20 gp
- Scout the Thornwood for signs of the Green Maw — 15 gp
- Check the old mine in Ashfall Crags for activity — 15 gp
- Map a safe path through the Fenway — 20 gp
- Investigate strange lights in Greenmere Valley — 15 gp

**Community Needs:**
- Gather herbs from the Fenway for Sister Efa — 5 gp per bundle
- Find old-world texts for Maren Sable — 10 gp per item
- Escort a prospector to Ashfall Crags — 10 gp

### Tutorial Complete

At this point, the player has:
- Used countdown dice for resource management
- Experienced combat
- Seen an portent advance
- Met the key NPCs
- Understood the progress clocks
- Seen the bounty board / quest system

The sandbox is now fully open. The player chooses where to go and what to do. The dooms advance whether they're addressed or not.
