# Adventure Types Reference

Detailed structural templates, design principles, and generation guidelines for each adventure type. Each section provides the theory, a structural template, a generation checklist, and common pitfalls.

---

## §1: Location-Based Adventures

The foundational OSR adventure type. A physical space with keyed locations that the player explores at their own pace and in their own order.

### Design Principles

**Jaquaying the Dungeon** (after Jennell Jaquays, designer of Dark Tower and Caverns of Thracia): The single most important principle in location-based design. A well-designed site has:

- **Multiple entrances/exits.** Never one way in. A front gate, a collapsed wall, a sewer grate, a window. This gives the player their first meaningful choice before they even enter.
- **Loops.** Paths that reconnect. The player can go left, explore three rooms, and end up back near where they started via a different corridor. This prevents the "follow the hallway" problem and creates tactical options (flanking, retreat routes).
- **Vertical connections.** Stairs, pits, shafts, balconies, collapsed floors. Levels that connect in multiple places, not just one staircase.
- **Shortcuts and secrets.** Hidden passages, locked doors with keys found elsewhere, one-way doors. Reward for exploration and cleverness.

**Faction Ecosystem.** The best dungeons aren't monster zoos — they're political ecosystems. Multiple groups inhabit the space with competing goals. The goblins hate the undead. The cultists are using the goblins. The thing in the deep level predates everyone. This creates opportunities for diplomacy, manipulation, information gathering, and playing groups against each other.

**Room Design: The Three-Part Test.** Every keyed room should have at least two of these three:

1. **Something to interact with** (a mechanism, a feature, an NPC, an environmental element)
2. **Something to discover** (information, treasure, a clue, a secret)
3. **Something dangerous** (a monster, a trap, a hazard, a cost)

Rooms with all three are the best rooms. Rooms with only one are filler — cut them or combine them.

**Treasure as Objective.** In OSR play, treasure IS the objective, not a byproduct of fighting. Place treasure deliberately:
- Some is visible and guarded (the obvious play: fight or sneak)
- Some is hidden and rewards investigation (secret compartments, buried, behind puzzles)
- Some is carried by NPCs who can be traded with, not just killed
- Some is bulky or cursed — creating interesting transport/decision problems
- Treasure should sometimes be *useful* beyond gold value: a map, a key, information, a tool

**Encounter Density.** Not every room has a monster. A good ratio is roughly: 1/3 empty or atmospheric, 1/3 interactive (puzzle, trap, NPC, feature), 1/3 combat-capable encounters. "Empty" rooms still have descriptive details that build atmosphere and may contain hidden elements.

### Structural Template

```
ADVENTURE: [Name]
TYPE: Location-based
OVERVIEW: [2-3 sentences: what is this place, who's here, what's the situation]

HOOK: [How the player learns about this place and why they'd go]
STAKES: [What happens if the player succeeds / fails / ignores it]
CONNECTIONS: [Which dooms, clocks, or NPCs tie to this adventure]

ENTRANCES:
- [Primary entrance — obvious, possibly guarded]
- [Secondary entrance — hidden, harder, or requires information]
- [Optional: tertiary entrance — dangerous, unconventional]

FACTIONS:
- [Faction A]: [Goal, attitude toward player, strength]
- [Faction B]: [Goal, attitude toward player, strength]
- [Relationship between factions]

MAP NOTES:
- [Number of rooms/areas: 8-15 for a one-session site, 20-30 for a major dungeon]
- [Loop connections: which rooms connect non-linearly]
- [Vertical connections: level changes]
- [Chokepoints to avoid or justify]

KEYED LOCATIONS:
[For each room/area:]
## [Number]. [Room Name]
**Senses:** [What the player perceives immediately — sound, smell, light, temperature]
**Contains:** [What's here — interactive elements, creatures, features]
**Hidden:** [What requires investigation to find — DC if applicable]
**Exits:** [Where do paths lead — including secret passages]
**Tags:** [EXPLORATION] [ENCOUNTER] [DISCOVERY] [TRANSITION]

WANDERING ENCOUNTERS: [d6 table — what moves through this space]
1. [Faction A patrol / activity]
2. [Faction B patrol / activity]
3. [Environmental event — collapse, flooding, gas, etc.]
4. [Signs / traces — tracks, sounds, smell, evidence of activity]
5. [NPC — lost, hiding, scouting, neutral party]
6. [Escalation — something gets worse, a clock ticks]

TREASURE:
- [Major treasure: location, guardian, value]
- [Minor treasures: scattered, hidden, carried]
- [Useful items: maps, keys, tools, information]

COMPLICATIONS:
- [What changes after the player enters — alarms, reinforcements, timers]
- [Environmental hazards that develop over time]
- [Clock: something that ticks during exploration]
```

### Generation Checklist

- [ ] At least 2 entrances
- [ ] At least 1 loop in the map
- [ ] At least 2 factions or competing interests
- [ ] Every room passes the two-of-three test (interact, discover, danger)
- [ ] Treasure placed deliberately with varied access methods
- [ ] At least 1 secret or hidden element rewards investigation
- [ ] At least 1 NPC who can be talked to (not just fought)
- [ ] A wandering encounter table that reflects the living space
- [ ] A complication or timer creating urgency
- [ ] Multiple viable approaches to the main objective

### Common Pitfalls

- **The railroad dungeon:** Linear room-to-room with no branching. Fix: add loops and vertical connections.
- **The monster zoo:** Each room has a different unrelated creature. Fix: factions with relationships and territory.
- **The empty maze:** Lots of rooms, nothing interesting. Fix: fewer rooms, more content per room.
- **Treasure as afterthought:** Gold scattered randomly. Fix: treasure placed as deliberately as monsters, with guardians and decisions attached.
- **The locked door problem:** Progress blocked by a single key/solution with no alternatives. Fix: always provide at least two ways through any obstacle.

---

## §2: Pointcrawl / Wilderness Adventures

A network of connected locations with travel between them. The structure is a graph (nodes and edges), not a grid. Used for overland exploration, hex content, and multi-site adventures.

### Design Principles

**Nodes, Not Hexes.** While the campaign map may use hexes, a pointcrawl adventure focuses on named locations connected by paths. Each node is a site of interest — not every hex is a node. Think of it as the interesting parts of a journey connected by the travel between them.

**Travel as Gameplay.** The paths between nodes aren't just transitions — they're where resource pressure happens. Track rations, torch life, weather, and random encounters during travel. The journey IS the adventure, not just the destination.

**Visible and Hidden Nodes.** Some locations are obvious (the ruined tower on the hill, the bridge over the river). Others require information, exploration, or lucky rolls to discover (the hidden cave behind the waterfall, the fairy ring only visible at dusk). This rewards player investigation and NPC interrogation.

**Branching Paths.** From any node, the player should have at least 2 directions to go. Dead ends are fine if the node itself is interesting enough to justify the trip, but the network should never funnel into a single mandatory path.

**Landmark Navigation.** Each node should be identifiable by a distinct landmark or feature — players navigate by description, not coordinates. "The split oak," "the black creek crossing," "the standing stones." This creates a shared vocabulary between player and AI.

### Structural Template

```
ADVENTURE: [Name]
TYPE: Pointcrawl / Wilderness
OVERVIEW: [The region, its character, what's happening here]

HOOK: [Why explore this area — rumor, mission, necessity]
STAKES: [What's at risk in this region — an escalating doom, a resource, a lost person]
CONNECTIONS: [Campaign elements tied to this region]

NODE MAP:
[List of nodes with connections. Format:]

[A] The Split Oak → connects to [B], [C]
[B] Black Creek Crossing → connects to [A], [D], [E]
[C] The Standing Stones → connects to [A], [F] (hidden path)
...

TRAVEL TABLE:
[For each path between nodes:]
[A→B]: [Distance in hours/days], [Terrain type], [Hazard if any]

NODES:
## [Letter]. [Node Name]
**Landmark:** [What makes this identifiable from a distance]
**Terrain:** [Local environment]
**Contains:** [What's here — site, encounter, resource, NPC]
**Discover:** [What can be learned or found with investigation]
**Hidden connections:** [Paths revealed by exploration or information]
**Tags:** [EXPLORATION] [ENCOUNTER] [DISCOVERY] [TRANSITION] [REST]

TRAVEL ENCOUNTERS: [d6 table per terrain type]
1-2. [Environmental — weather, terrain hazard, natural obstacle]
3-4. [Creature — wildlife, monster, territorial beast]
5. [Sign — tracks, abandoned camp, old marker, portent]
6. [NPC — traveler, refugee, patrol, hermit]

WEATHER/SEASON: [How conditions affect travel and nodes]

RESOURCE PRESSURE:
- [Rations: how many days of food the journey requires]
- [Light: relevant in forests, caves, night travel]
- [Special: cold, water, climbing gear, etc.]
```

### Generation Checklist

- [ ] At least 6 nodes for a meaningful pointcrawl
- [ ] No node has only 1 connection (except deliberate dead-ends with strong payoff)
- [ ] At least 1 hidden node requiring discovery
- [ ] Travel between nodes has meaningful resource cost
- [ ] Each node has a distinct landmark for navigation
- [ ] At least 1 safe/rest node where the player can resupply or recover
- [ ] Environmental variety across the network
- [ ] At least 1 node contains a location-based sub-adventure (a small dungeon, ruin, or lair)
- [ ] Travel encounters reflect the region's character and current threats

### Common Pitfalls

- **The shopping list:** Nodes are disconnected objectives to check off. Fix: nodes should relate to each other — information at one reveals secrets at another.
- **Empty travel:** "You walk for three hours, nothing happens." Fix: travel encounters, resource ticks, environmental description, and discovered signs.
- **All combat nodes:** Every location is a fight. Fix: vary node types — rest sites, information sources, environmental puzzles, NPC encounters.

---

## §3: Investigation / Mystery Adventures

A truth to uncover. The player gathers clues, questions NPCs, examines evidence, and pieces together what happened (or what's happening). The structure is a node-based clue network, not a linear trail.

### Design Principles

**The Three Clue Rule** (from Justin Alexander): For any conclusion the player needs to reach, provide at least three independent clues pointing to that conclusion. If the player needs to figure out that Baron Aldric is the traitor, there should be three different ways to discover this — not one critical clue that can be missed. Assume any given clue has a chance of being missed, misunderstood, or ignored. Three independent paths to the same truth ensures the investigation keeps moving.

**Node-Based Design.** Structure the mystery as a network of scenes/locations/NPCs, each containing clues that point to other nodes. The player can enter the network from multiple starting points and traverse it in any order. Don't plan a sequence — plan a web.

**Clue Types:**
- **Testimony:** What NPCs tell you (may be true, partial, or deliberately misleading)
- **Evidence:** Physical things that can be examined (documents, objects, traces, forensics)
- **Observation:** Things noticed by paying attention (behavior patterns, timing, who's nervous)
- **Deduction:** Conclusions drawn from combining multiple clues (the AI helps the player connect dots when they have enough pieces)

**The Conspiracy Diagram.** Before generating the mystery, establish the actual truth — who did what, when, why, and how. Then scatter evidence of this truth across the investigation nodes. The AI knows the truth; the player discovers it. This prevents the common improv problem of making up the answer as you go.

**Red Herrings (Use Sparingly).** False leads are frustrating in solo play because there's no table of players to debate them. Use them only when the red herring itself is interesting (it leads somewhere worthwhile even if it's not the answer) or when it reveals character/faction information. Never use a pure dead-end red herring.

**Escalation While Investigating.** The mystery shouldn't wait patiently for the player to solve it. If the murderer isn't caught, they kill again. If the conspiracy isn't exposed, it advances. Use clocks to track the antagonist's timeline. This creates urgency without railroading — the player chooses how to spend their time, but time passes regardless.

### Structural Template

```
ADVENTURE: [Name]
TYPE: Investigation / Mystery
OVERVIEW: [The inciting incident, the apparent situation, and the hidden truth]

THE TRUTH: [What actually happened / is happening — full answer, not revealed to player]
THE ANTAGONIST: [Who's behind it, what they want, what they'll do if not stopped]
TIMELINE: [Clock — what happens as time passes if the player doesn't intervene]

HOOK: [How the player gets involved — discovery, commission, personal stake]
STAKES: [What happens if the truth is uncovered vs. if it isn't]
CONNECTIONS: [Campaign dooms, NPCs, and clocks involved]

INVESTIGATION NODES:
[Each node is a scene, location, or NPC that contains clues]

## [Node Name]
**Type:** [Location / NPC / Event / Document]
**Access:** [How the player reaches this node — freely available, requires introduction, requires clue from another node]
**Clues found here:**
- [Clue 1]: [What it is, what it points to] → leads to [Node X]
- [Clue 2]: [What it is, what it points to] → leads to [Node Y]
**Other content:** [What else happens here — NPC interaction, danger, atmosphere]
**If pressed/investigated deeply:** [Additional information available through persistent or creative play]

CLUE MATRIX:
[For each key conclusion, list all clues that point to it:]

Conclusion: "[The butler did it]"
- Clue A (from Node 1): [description]
- Clue B (from Node 3): [description]  
- Clue C (from Node 5): [description]

[Verify: every required conclusion has ≥3 independent clues]

ANTAGONIST CLOCK: [Segments and triggers]
- Segment 1: [What the antagonist does next if not stopped]
- Segment 2: [Escalation]
- ...
- Final: [The antagonist succeeds — consequences for campaign]

RESOLUTION PATHS:
- [Expose publicly — consequences]
- [Confront privately — consequences]
- [Use information as leverage — consequences]
- [Fail to solve — consequences]
```

### Generation Checklist

- [ ] The full truth is established before clue placement
- [ ] Every required conclusion has ≥3 independent clues
- [ ] Investigation nodes can be accessed in any order
- [ ] At least 1 NPC who lies or withholds information (with detectable tells)
- [ ] At least 1 NPC who wants to help but has incomplete information
- [ ] An antagonist clock creates urgency
- [ ] Multiple resolution paths (not just "find the answer")
- [ ] Red herrings (if any) lead somewhere interesting regardless
- [ ] Physical evidence AND testimony AND observation clues — variety of clue types

### Common Pitfalls

- **The pixel hunt:** One critical clue hidden behind one specific action. Fix: three-clue rule, always.
- **The interrogation parade:** Player talks to NPC after NPC with no other gameplay. Fix: mix locations, evidence examination, and danger into the investigation.
- **The obvious answer:** "Mystery" solvable in the first scene. Fix: layer the truth — the first answer is incomplete, the deeper truth is more complex.
- **GM-dependent revelations:** Clues that only work if the GM (AI) decides to reveal them. Fix: clues should be findable through player action, not AI narration.

---

## §4: Faction Conflict Adventures

Multiple groups with competing goals. The player navigates between them, choosing sides, playing groups against each other, or forging their own path. The structure is a relationship map with tension points.

### Design Principles

**Every Faction Wants Something.** And they can't all have it. The conflict should be genuine — not good vs. evil, but competing legitimate (or at least understandable) interests. "The miners need the ore, the druids protect the forest, the lord needs revenue, and the bandits just want to survive." Every faction's goal makes sense from their perspective.

**The Player Is the Variable.** The factions are in a stalemate or slow-boil conflict. The player's involvement tips the balance. Design the situation so that player action (or inaction) changes outcomes. They're not spectators — they're catalysts.

**Relationship Map.** Draw the factions and their relationships: allied, rival, neutral, hostile, dependent, exploitative. The player can traverse these relationships. Helping Faction A earns their trust but may antagonize Faction B. Information from Faction C reveals that Faction A is lying.

**Escalation Without the Player.** Use clocks for each faction's plan. They advance whether or not the player engages. This creates natural urgency and rewards paying attention to which faction is closest to achieving their goal.

**Reputation and Consequence.** The player's choices have lasting effects. Siding with one faction changes how others treat them. Betrayals are remembered. Favors create obligations. Track faction disposition (Hostile / Suspicious / Neutral / Friendly / Allied) and shift it based on player actions.

### Structural Template

```
ADVENTURE: [Name]
TYPE: Faction Conflict
OVERVIEW: [The situation, the factions, what they're fighting over]

THE CONTESTED RESOURCE/GOAL: [What everyone wants or what's at stake]

FACTIONS:
## [Faction Name]
**Leader:** [Name, personality, what they're like to deal with]
**Goal:** [What they want and why]
**Strength:** [What resources/power they have]
**Weakness:** [What they lack or fear]
**Disposition toward player:** [Starting attitude]
**Clock:** [Their plan, in segments — what happens as it fills]
**What they offer the player:** [Reward for alliance]
**What they ask of the player:** [The price of their support]
**Secret:** [Something they're hiding]

RELATIONSHIP MAP:
- [Faction A] ←hostile→ [Faction B]: [why]
- [Faction A] ←dependent→ [Faction C]: [why]
- [Faction B] ←allied→ [Faction D]: [why]
...

TENSION POINTS: [Specific situations where conflict surfaces]
- [Tension 1]: [Two factions clash over specific issue — player is present or drawn in]
- [Tension 2]: [A betrayal, revelation, or escalation changes dynamics]
- [Tension 3]: [A deadline forces action]

RESOLUTION PATHS:
- [Side with Faction A — consequences for campaign]
- [Side with Faction B — consequences for campaign]
- [Broker peace — what it costs, whether it holds]
- [Play factions against each other — risks and rewards]
- [Destroy/remove the contested resource — consequences]
- [Ignore the conflict — what happens without player intervention]
```

### Generation Checklist

- [ ] At least 3 factions (2 creates binary choice, 3+ creates genuine complexity)
- [ ] Every faction has an understandable motive (no pure evil)
- [ ] Every faction has something to offer and something to hide
- [ ] A relationship map with at least one non-obvious connection
- [ ] Faction clocks that advance independently
- [ ] At least 3 distinct resolution paths
- [ ] Player action meaningfully changes outcomes
- [ ] Reputation consequences tracked and referenced

### Common Pitfalls

- **Good vs. evil cosplay:** One faction is clearly right. Fix: give every faction legitimate grievances and moral costs.
- **The info dump:** Player has to sit through faction lore before making choices. Fix: reveal faction dynamics through action and conflict, not exposition.
- **The locked faction:** Player commits early and never has reason to reconsider. Fix: revelations that complicate initial loyalties (the "good" faction has a dark secret).

---

## §5: Defense / Siege Adventures

Something is coming. The player must prepare, fortify, recruit, and then hold against an assault. The structure is a preparation phase followed by an execution phase.

### Design Principles

**Preparation IS the Adventure.** The defense itself is the climax, but the real gameplay is in preparation. What defenses do you build? Who do you recruit? What resources do you spend? Which approaches do you fortify and which do you sacrifice? Every preparation decision should involve a tradeoff.

**Limited Resources, Multiple Needs.** Give the player a resource budget (time, materials, people) that's not enough to do everything. They must prioritize. Fortify the east wall OR repair the gate — not both. Station guards at the bridge OR send scouts to track the enemy — not both.

**Multiple Attack Vectors.** The threat should come from more than one direction or in more than one form. A frontal assault AND saboteurs inside the walls. Siege engines AND a flanking force through the forest. This prevents the player from over-investing in one defense.

**The Ticking Clock.** The enemy arrives in X days/hours. Each preparation action costs time. The player must decide when to stop preparing and start defending — or whether to take a risk and do one more thing.

**Holdable, Not Invincible.** The defense should be possible to win, but not guaranteed. The outcome should depend on preparation quality. A well-prepared defense can succeed with resources to spare. A poorly prepared one becomes desperate. Retreat should always be an option — sometimes the right call is to abandon the position and save what you can.

### Structural Template

```
ADVENTURE: [Name]
TYPE: Defense / Siege
OVERVIEW: [What's coming, where they're defending, why they can't just leave]

THE THREAT: [Who/what is attacking, their strength, their timeline]
THE POSITION: [What's being defended — layout, strengths, weaknesses]
THE STAKES: [What happens if the defense holds vs. falls]

PREPARATION PHASE:
**Time budget:** [How many "turns" of preparation before the threat arrives]
**Resource budget:** [What materials, people, and tools are available]

PREPARATION OPTIONS: [Each costs time and/or resources]
- [Fortification A]: [Effect on defense, cost]
- [Fortification B]: [Effect on defense, cost]
- [Recruitment]: [Who can be convinced to help, at what cost]
- [Intelligence]: [Scouting, interrogation — learn about the threat's plan]
- [Sabotage]: [Preemptive strikes, traps on approach routes]
- [Evacuation]: [Save civilians/valuables, but costs defenders]
- [Alliance]: [Faction that could help — but at what price]

DEFENSE PHASE:
**Waves:** [The assault comes in phases]
- Wave 1: [Probing attack — tests weaknesses]
- Wave 2: [Main assault — hits the prepared defenses]
- Wave 3: [Complication — something unexpected: fire, treachery, second force]

**Defense checks:** [How player decisions and preparations map to rolls]
- Each fortification provides advantage or negates a specific threat
- Unprepared vectors require desperate checks at disadvantage
- NPC allies have their own behavior patterns and may break

AFTERMATH:
- [Defense holds: consequences, rewards, reputation]
- [Defense holds but costly: consequences, losses, hard choices]
- [Defense fails: retreat options, what's lost, campaign consequences]
- [Player abandons defense: consequences for reputation and campaign]
```

### Generation Checklist

- [ ] Preparation phase has more options than time/resources allow (forces tradeoffs)
- [ ] At least 2 attack vectors the player must account for
- [ ] At least 1 unexpected complication during the defense
- [ ] Intelligence-gathering is possible (player can learn about the threat's plan)
- [ ] Retreat is a viable option with its own consequences
- [ ] NPC allies are useful but not reliable (may break, may have agendas)
- [ ] Outcome scales with preparation quality — not binary win/lose

---

## §6: Expedition Adventures

Go somewhere, achieve an objective, and come back. The journey itself is the challenge. Resource management is the primary antagonist.

### Design Principles

**The Supply Line Problem.** Every day of travel forward is a day of travel back. The player must balance ambition against supplies. Push too far and you can't make it home. Turn back too early and you miss the objective. This creates a natural tension curve without any plot.

**Point of No Return.** The expedition should have a moment where the player must decide: commit fully (burn the boats) or turn back while they can. This is the climax of the resource tension — after this point, the only way out is through.

**Environmental Antagonist.** The terrain, weather, and conditions are the enemy. Not every expedition needs combat encounters — exhaustion, exposure, navigation failures, equipment breakage, and supply depletion are all threats. The environment should have personality and escalating hostility.

**Discoveries Along the Way.** The route should be studded with discoveries: ruins, strange features, caches, signs of others who came before. These serve as motivation, resource relief, and worldbuilding. Some discoveries should tempt the player to deviate from the objective.

**The Return.** Don't skip the trip back. It should be different — the player has new information, fewer resources, possibly injured, possibly pursued. Changed conditions (weather turned, a bridge collapsed, something followed them) make the return route a different experience.

### Structural Template

```
ADVENTURE: [Name]
TYPE: Expedition
OVERVIEW: [Where they're going, why, what they expect to find]

THE OBJECTIVE: [What's at the destination — and is it what they expected?]
THE ROUTE: [Path structure — pointcrawl nodes from base to destination]
THE CONSTRAINT: [Resource budget — supplies for X days, objective is Y days away]

OUTBOUND JOURNEY: [Nodes in order, with travel costs]
## Leg [N]: [From] → [To]
**Distance:** [Time in days/hours]
**Terrain:** [Type and difficulty]
**Resource cost:** [Rations, light, special equipment consumed]
**Encounter/Discovery:** [What happens along this leg]
**Choice:** [Optional deviation, shortcut, or risk]

DESTINATION:
**What's actually here:** [May differ from expectations]
**Objective completion:** [What the player needs to do]
**Complications:** [What makes the objective harder than expected]
**Discovery:** [Unexpected finding — changes campaign state]

RETURN JOURNEY:
**Changed conditions:** [What's different now — weather, pursuit, injury, revelation]
**Resource state:** [What the player likely has left — is it enough?]
**Complications:** [New obstacles on the return]
**Shortcut option:** [Faster but more dangerous return route]

EXPEDITION TRACKER:
- Days of rations remaining: [countdown]
- Torch/light supply: [cd die]
- Special equipment condition: [cd die]
- PC condition: [wounds, exhaustion, corruption]
- Days until [complication]: [clock]
```

---

## §7: Heist / Infiltration Adventures

A target. A plan. Complications. The player must gather information, make a plan, infiltrate a secured location, achieve an objective, and extract — ideally without anyone knowing they were there. The structure is three phases: planning, execution, and extraction.

### Design Principles

**The Target Is a Puzzle.** The secured location should have visible security measures the player can observe, study, and plan around. Guards with patrol patterns. Locked doors with key-holders. Magic wards with identifiable weaknesses. The player's job during planning is to study the puzzle and find the gaps.

**Planning Rewards Investigation.** The more the player scouts, questions, and investigates before attempting the heist, the better their chances. Information about guard schedules, building layouts, secret entrances, and target location should be discoverable through play. Don't just hand the player a blueprint — make them earn it.

**Flashback Mechanics.** Inspired by Blades in the Dark: during execution, the player can declare "I planned for this" and flash back to a preparation scene. This prevents the frustration of not being able to predict everything. The AI sets a check difficulty based on how reasonable the preparation would be.

**Complications, Not Failures.** When things go wrong during a heist, they don't end the adventure — they escalate it. A guard spots you → you must deal with the guard, not reload. An alarm sounds → you're now on a timer, not game over. Layer complications to create escalating tension without hard failure states.

**The Extraction Problem.** Getting in is half the job. Getting out is the other half — and it should be harder. The player now has the objective (which may be bulky, alive, fragile, or incriminating), security is potentially alerted, and the exit route may be compromised.

### Structural Template

```
ADVENTURE: [Name]
TYPE: Heist / Infiltration
OVERVIEW: [The target, the objective, why it's guarded]

THE TARGET: [Location — layout, security, inhabitants]
THE OBJECTIVE: [What the player needs to steal/achieve/reach]
THE CLIENT: [Who wants this done and why — may have hidden agenda]
THE DEADLINE: [Why it has to be now — window of opportunity]

PLANNING PHASE:
**Available intelligence sources:**
- [Source 1]: [What it reveals, how to access it]
- [Source 2]: [What it reveals, how to access it]  
- [Source 3]: [What it reveals, how to access it]

**Observable security:**
- [Guard patrols]: [Pattern, gaps, shift changes]
- [Physical barriers]: [Walls, locks, doors — and their weaknesses]
- [Magical/technical security]: [Wards, alarms, mechanisms]
- [Social security]: [Who has access, who can be bribed/persuaded/impersonated]

**Infiltration routes:**
- [Route A]: [Through the front — social engineering]
- [Route B]: [Through the side — stealth]
- [Route C]: [Through below/above — unconventional]

EXECUTION PHASE:
**Complication table:** [Roll or trigger when things deviate from plan]
1. [Guard in unexpected location]
2. [Lock/ward is different than expected]
3. [An NPC recognizes the player]
4. [The objective isn't where it should be]
5. [Another group is attempting the same heist]
6. [A timer starts — alarm, patrol return, magical event]

**Flashback rules:** When the player encounters an obstacle they couldn't have predicted, allow a flashback to a preparation scene. Set check difficulty based on reasonableness:
- Obvious preparation (bought rope for a building with balconies): DC easy
- Reasonable preparation (bribed a specific guard): DC moderate
- Stretch preparation (planted a disguise inside the vault): DC hard

EXTRACTION PHASE:
**Changed conditions:** [What's different now — alerted guards, locked exits, pursuit]
**The objective complication:** [How carrying/escorting the objective creates new problems]
**Escape routes:** [Pre-planned and improvised options]
**Chase/pursuit mechanics:** [If detected — how pursuit works]

OUTCOMES:
- [Clean success: no one knows — maximum reward, no heat]
- [Messy success: objective achieved but detected — reward with consequences]
- [Partial success: got something but not everything — partial reward, complications]
- [Failure with escape: didn't get it, but got out — reputation hit, can try again]
- [Failure with capture: worst case — rescue scenario, campaign consequences]
```

### Generation Checklist

- [ ] The target is a readable puzzle with observable security
- [ ] At least 3 infiltration routes with different skill requirements
- [ ] Planning rewards investigation (more scouting = better chances)
- [ ] Complications escalate rather than end the adventure
- [ ] Extraction is a distinct challenge, not a formality
- [ ] At least 1 unexpected element inside the target (the objective isn't what they expected, someone else is here, the layout has changed)
- [ ] Flashback mechanic available for reasonable preparations
- [ ] Multiple outcome tiers (not binary success/failure)

---

## Appendix: Adventure Sizing

### One-Session Adventures (2-4 hours of play)

- **Location-based:** 8-12 keyed rooms, 1-2 factions, 1 main objective
- **Pointcrawl:** 5-8 nodes, 1-2 major encounters, 1 destination
- **Investigation:** 4-6 investigation nodes, 1 core truth, 1 antagonist clock
- **Faction conflict:** 3 factions, 1 contested issue, 2-3 tension points
- **Defense:** 3-5 preparation options, 2-3 assault waves
- **Expedition:** 3-4 legs each way, 1 major destination encounter
- **Heist:** 1 target with 3-4 security layers, planning + execution + extraction

### Multi-Session Adventures (campaign arcs)

Scale up by adding layers, not just more rooms/nodes:
- Additional factions with new relationships
- Deeper dungeon levels with escalating danger
- Complications that change the nature of the objective
- Sub-adventures nested inside the main adventure type

### Adventure Density by Campaign Phase

- **Early campaign:** Shorter adventures, clearer objectives, fewer factions. Build the player's understanding of the world.
- **Mid campaign:** Full-sized adventures, faction complexity, doom intersections. The sandbox is alive and pressing.
- **Late campaign:** Multi-session arcs, combined adventure types, high-stakes consequences. Every action reshapes the campaign.
