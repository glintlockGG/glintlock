---
name: gm-prep
description: "Continuous GM preparation methodology. This skill should be used when refreshing world/gm-notes.md during /glintlock:resume, /glintlock:world-turn, or at narrative pauses during play."
---

# GM Prep — Continuous Preparation

GM prep is a persistent, evolving process — not a one-time phase before play. The GM maintains `world/gm-notes.md` as a living prep buffer that is refreshed during `/glintlock:resume`, `/glintlock:world-turn`, and at narrative pauses during play. The player never sees this file directly; it shapes how the GM runs the game.

## Philosophy

Prep is a scaffold, not a script. You are preparing **situations**, not **plots**. The player will go where they go. Your job is to have interesting material ready so that wherever they go, something compelling happens.

The prep elements below are adapted from structured prep methodology and the Ironsworn oracle discipline. Each takes existing campaign state (world files, session log, quest board) and transforms it into actionable GM notes. Use `roll_oracle`, `roll_dice`, and `oracle_yes_no` to ground prep in randomness rather than invention.

## Oracle-First Principle

**Roll first, interpret second.** When generating content — NPCs, encounters, scenes, secrets, treasure — roll on oracle tables before inventing. Interpret the random result through the lens of the current fiction. This creates genuine surprise for both player and GM.

- Use `roll_oracle` for procedural content (names, encounters, treasure, reactions)
- Use `oracle_yes_no` for uncertain outcomes (does the faction discover the sabotage? does the weather shift?)
- Don't always choose the most dramatic option. Let randomness produce quiet moments, odd coincidences, and unexpected mercy alongside the danger.

## Just-In-Time Content Generation

Not everything needs to be prepped in advance. When the player goes somewhere unexpected:

1. **Check gm-notes first** — is there a scene, secret, or encounter that fits?
2. **Roll oracle tables** — use terrain encounter tables, creature activity, NPC reactions to generate on the fly
3. **Load relevant skills** — `bestiary` for monster stats, `treasure` for loot, `adventure-design` for dungeon structure
4. **Interpret through fiction** — connect the random result to active threads, dooms, or faction goals
5. **Update gm-notes** — add the new content so it persists

The GM is never caught flat-footed. Oracle tables + skills + fiction = infinite content.

## The Six Prep Elements

### 1. Strong Starts (2-3)

Designed opening scenes for `/glintlock:resume`. Not a recap, not "you wake up at the inn." The strong start drops the PC into something immediate: action, tension, discovery, or a decision they didn't expect.

**Guidelines:**
- 2-4 sentences of vivid, sensory prose
- Starts in medias res or with an interrupting event
- Ends at a natural decision point — the player should want to react
- Connects to an active thread, quest, or world-advance consequence
- Can be a scene the PC walks into, or a scene that walks into the PC
- Prepare 2-3 options so you can choose the best fit when play resumes

**Examples:**
- The PC's camp is approached by a wounded messenger carrying a sealed letter
- The tavern door splinters inward — the bounty hunters found you
- The merchant who sold you that map is hanging from the town gate
- A tremor shakes the dungeon and the corridor behind you collapses

### 2. Potential Scenes (3-5)

Loose situations that might come up during play. Not a sequence — not scene 1, then scene 2. These are modular chunks you can deploy when the fiction calls for them.

**Each scene has:**
- **Situation:** What's happening. A paragraph at most.
- **Trigger:** What would bring the PC into this scene (arriving at a place, asking about a topic, time passing).
- **Complication:** What makes this scene interesting beyond its surface. A twist, a cost, a competing interest.
- **Thread:** Which quest or campaign thread this connects to.

**Guidelines:**
- Draw from active quests, NPC goals, world-advance entries, and player signals
- Include at least one scene the player would never expect
- Include at least one scene driven by NPC initiative (not player action)
- Scenes can be combined, split, or discarded freely during play

### 3. Active Secrets (3-5)

Pieces of information the PC could discover. Secrets are the most important prep element because they are **not tied to locations or NPCs** — they migrate freely between discovery paths.

**Each secret has:**
- **Label:** A short name for the information
- **Information:** The actual secret (1-2 sentences)
- **Discovery paths (2+):** Different ways the PC could learn this. At least two paths per secret.
- **Thread:** Which campaign thread this advances
- **Planted:** When the secret was created

**Secrets discipline during play:**
- When the PC investigates *anything*, check your secrets list. Can one of these be delivered through what they're doing right now?
- A secret about the cult's hideout can be learned from: a captured cultist, a tavern rumor, a map in the library, tracks in the forest, an NPC's slip of the tongue
- Secrets that go undelivered persist in gm-notes until delivered or made obsolete
- When delivered, move to the Discovered section with method and date
- Mix scales: world-shaking revelations alongside small useful details

### 4. NPC Moves (2-4)

What active NPCs are doing *right now*, independent of the PC. NPCs have goals and they pursue them whether or not the PC is watching.

**Each NPC move has:**
- **Name:** The NPC
- **Doing:** What they're actively doing
- **Wants:** Their current goal or need
- **Attitude:** How they feel about the PC right now
- **Hook:** A line of dialogue or action they'd use if encountered

**Guidelines:**
- Read NPC and faction files before writing moves
- At least one NPC should be doing something that affects the PC indirectly
- At least one NPC should want something from the PC
- Unused NPC moves don't expire — the NPC continues acting off-screen. Update their file when the fiction catches up.

### 5. Encounter Setups (2-3)

Pre-selected combat or tense encounters with mechanical details ready to go. Use `roll_oracle` with terrain-specific encounter tables (`encounter_thornwood`, `encounter_wolds`, `encounter_ashfall`, `encounter_fenway`, `encounter_greenmere`, `encounter_bleach`) and the `bestiary` skill to build these.

**Each encounter has:**
- **Monsters:** Type, count, reference to bestiary stats
- **Environment:** Terrain, lighting, hazards, distances
- **Morale:** When they break and run (specific trigger)
- **Reward:** Loot or information gained from victory

**Guidelines:**
- Use `roll_dice` for encounter quantities and `roll_oracle` for creature types
- Include at least one encounter that can be avoided or resolved without combat
- Note environmental features the PC could exploit
- Have morale conditions ready — most creatures don't fight to the death

### 6. Treasure (2-3)

Pre-rolled rewards with placement context. Use `roll_oracle` and the `treasure` skill to generate these.

**Each treasure has:**
- **Item:** What it is (with mechanical properties if magical)
- **Value:** Gold value or treasure tier
- **Context:** Where/how it would be found. Not fixed — treasure migrates like secrets.

**Guidelines:**
- Use `roll_oracle` and `roll_dice` to generate, not invention
- Include a mix of mundane valuables and interesting items
- At least one reward should connect to an active thread
- Context is a suggestion — place treasure wherever the fiction leads

## World-Turn Prep

During `/glintlock:world-turn`, the entire `world/gm-notes.md` is regenerated from current world state. This is the most thorough refresh — all six elements are rebuilt from scratch using the current state of dooms, clocks, factions, NPCs, and quests.

See `skills/state-management/references/gm-notes-template.md` for the file template.

## During Play — Using Your Prep

Consult `world/gm-notes.md` as a living reference throughout play:

- **PC enters a new situation** — check Potential Scenes for a match
- **PC investigates or talks to NPCs** — check Active Secrets for information to reveal. Deliver secrets through whatever the PC is doing right now.
- **An NPC appears** — check NPC Moves for their current state, goals, and a ready line of dialogue
- **Combat starts** — check Encounter Setups for pre-built setups with environment and morale
- **PC earns a reward** — check Treasure before improvising

**Secrets migrate.** If the PC doesn't go to the library where you planned to reveal the cult's location, deliver that secret through the next NPC conversation, environmental clue, or overheard rumor instead.

**Improvisation over adherence.** If the player goes somewhere unexpected, don't force the prep. The prep serves the GM; the GM doesn't serve the prep. Undelivered secrets persist. Unused NPC moves continue off-screen. Unused scenes evolve or expire.

**Update as you go.** When you deliver a secret, move it to Discovered. When a scene plays out differently than prepped, that's fine — the prep got you started, the player took it somewhere better.

## Narrative Pause Refresh

At natural pauses in play (rest, travel, scene breaks), do a mini-refresh of gm-notes:

- Add 1-2 new secrets based on recent events
- Update NPC moves to reflect what just happened
- Swap out used scenes for new ones
- Check if any clocks or dooms need attention
- Update `world/CLAUDE.md` with current state

This keeps the prep buffer fresh without requiring a full world-turn.

## Related Skills
- **pale-reach** — Hex map, dungeon content, and encounter tables for prepping scenes (or active adventure skill for custom campaigns)
- **bestiary** — Monster stat blocks for encounter prep
- **treasure** — Pre-rolled loot for rewards
- **adventure-design** — Structural templates for generating adventure content on demand
