---
name: adventure-design
description: "This skill should be used when generating, seeding, or running adventures within a Glintlock campaign. It provides design principles, structural templates, and quality standards for creating adventures across multiple types: location-based, pointcrawl/wilderness, investigation, faction conflict, defense/siege, expedition, and heist/infiltration. Triggered by requests to create a new adventure, seed a sandbox with content, generate a dungeon or adventure site, or when the campaign state calls for new content to be placed in the world. Also use when evaluating or improving existing adventure content."
---

# Adventure Design Skill

## Purpose

This skill teaches how to design and generate tabletop RPG adventures that follow established OSR and indie design principles. Adventures generated using this skill are structurally sound, playable, and designed for AI-mediated solo play within the Glintlock system.

## When to Use

- Generating a new adventure to seed into a campaign sandbox
- Creating content for a specific doom escalation track (the doom's resolution site)
- Responding to player actions that require a new adventure site or scenario
- Building the starter adventure for a new campaign
- Evaluating whether generated content meets quality standards

## Core Design Philosophy

All adventures generated under this skill follow these principles regardless of type:

### 1. Player Agency Over Plot

Never design toward a predetermined outcome. Create situations, not stories. The adventure provides a charged environment — the story emerges from player decisions interacting with that environment.

### 2. Information as Treasure

Players make interesting decisions when they have (or can acquire) meaningful information. Every adventure should provide ways for observant, clever players to gain advantages. Foreshadow danger. Reward investigation. Let players who pay attention avoid traps, find shortcuts, and exploit weaknesses.

### 3. Multiple Solutions

Every obstacle should have at least two viable approaches. A locked door can be picked, broken, bypassed through a window, or the key found elsewhere. A guardian can be fought, bribed, snuck past, or distracted. If there's only one solution, it's a chokepoint, not a challenge.

### 4. Meaningful Choices with Consequences

Choices matter when they involve tradeoffs. "Do you take the safe path or the dangerous shortcut?" is a choice. "Do you open the door?" is not (unless opening it costs something). Every decision point should make the player weigh competing values: time vs. safety, reward vs. risk, one faction vs. another.

### 5. The World Moves Without the Player

Factions pursue goals. Clocks tick. Monsters patrol. Events escalate. The adventure site is not a museum waiting to be toured — it's an active environment where things happen whether the player engages or not. This creates urgency and makes timing matter.

### 6. Resource Pressure as Drama

Countdown dice, supply tracking, torch duration, HP attrition — these aren't bookkeeping, they're tension generators. Adventures should create situations where resources become decision points. "We can explore two more rooms before the torch dies. Which direction?"

### 7. Emergent Complexity from Simple Parts

Don't design elaborate set-pieces. Design simple, interacting elements and let complexity emerge. A room with goblins is simple. A room with goblins who are at war with the undead in the next room, guarding a bridge the player needs — that's emergent complexity from simple parts.

## Adventure Type Index

Consult `references/adventure-types.md` for detailed structural templates, design principles, and generation guidelines for each adventure type:

| Type | When to Use | Reference Section |
|---|---|---|
| **Location-Based** | Dungeons, ruins, lairs, buildings to explore room-by-room | §1 |
| **Pointcrawl / Wilderness** | Overland travel, hex exploration, connected sites | §2 |
| **Investigation / Mystery** | Clues to find, a truth to uncover, NPCs to question | §3 |
| **Faction Conflict** | Competing groups, shifting loyalties, political tension | §4 |
| **Defense / Siege** | Protect a location, prepare for an assault, hold the line | §5 |
| **Expedition** | Go there and back, resource pressure is the antagonist | §6 |
| **Heist / Infiltration** | A target, a plan, complications, extraction | §7 |

## Adventure Generation Workflow

### Step 1: Determine Type

Assess what the campaign state calls for. A doom reaching portent 4-6 probably needs a location-based resolution site. A faction clock filling might trigger a faction conflict scenario. A supply crisis calls for an expedition. Sometimes adventures combine types — an expedition to reach a location-based dungeon, or an investigation that reveals a heist opportunity.

### Step 2: Load Type Reference

Read the relevant section(s) from `references/adventure-types.md`. Follow the structural template and design checklist for that type.

### Step 3: Connect to Campaign State

Every adventure must connect to existing campaign elements:

- **At least one doom or clock** should be advanced, resolved, or complicated by this adventure
- **At least one NPC** from the home base should have a stake in the outcome
- **At least one resource pressure** should be present (supply cost, time pressure, corruption risk)
- **The hook** should emerge naturally from current campaign state (a rumor, an portent, a bounty, a desperate need)

### Step 4: Generate Content

Follow the type-specific template. For each element generated, apply the quality checklist:

- [ ] Does this present a meaningful choice?
- [ ] Can this be approached multiple ways?
- [ ] Does this connect to something else in the adventure?
- [ ] Would cutting this make the adventure worse? (If not, cut it)
- [ ] Is this something the AI can adjudicate cleanly during play?

### Step 5: Format for Play

Structure the output so the AI can reference it during play:

- **Overview** (2-3 sentences: what is this place, what's the situation, what's at stake)
- **Key information** (what the player can learn before entering)
- **Map/structure** (keyed locations, node connections, or phase descriptions)
- **Inhabitants** (stat blocks with behavior patterns — Zone + Priority format)
- **Treasure/rewards** (specific, interesting, sometimes useful beyond gold value)
- **Complications** (what changes, what goes wrong, what's on a timer)
- **Outcomes** (what happens to the campaign state based on player actions)

## Combining Adventure Types

Complex scenarios often layer two types:

| Primary | Secondary | Example |
|---|---|---|
| Location-based | Investigation | Explore a ruin while piecing together what happened here |
| Expedition | Location-based | Trek through wilderness to reach a dungeon |
| Investigation | Faction conflict | Uncover who's behind the sabotage — multiple suspects with agendas |
| Defense | Faction conflict | Hold the keep while negotiating which faction gets to help |
| Heist | Investigation | Case the target, gather intel, then execute the plan |
| Pointcrawl | Expedition | Navigate a wilderness region with a specific destination and deadline |

When combining types, one is primary (provides the core structure) and the other is secondary (provides texture and complications). Always load both type references.

## Solo Play Considerations

Adventures for AI-mediated solo play need additional design attention:

### Pacing Control
The AI must recognize when to compress time ("you spend an hour searching — here's what you find") and when to zoom in ("the door creaks open — what do you do?"). Adventure structure should signal pacing through **density markers**: rooms/nodes tagged as [EXPLORATION], [ENCOUNTER], [DISCOVERY], or [TRANSITION].

### Decision Framing
Since there's no table discussion, the AI must present choices clearly. Each decision point should offer 2-4 visible options while making clear that creative alternatives are welcome. Never railroad by only presenting one path forward.

### Tension Maintenance
Without other players to create social energy, tension comes from the game systems: countdown dice ticking, clocks advancing, portent tracks escalating. Every adventure should have at least one active timer creating background pressure.

### Character Spotlight
Solo play means one character handles everything. Adventures should provide moments for each stat to matter — not just combat (Vigor/Reflex) but also Wits (traps, perception), Resolve (fear, corruption), Presence (NPCs, morale), and Lore (mysteries, magic).
