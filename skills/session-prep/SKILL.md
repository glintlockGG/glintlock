---
name: session-prep
description: "Lazy GM-style session preparation framework. This skill should be used during /glintlock:continue-session to generate session prep, or mid-session to refresh prep notes when the player takes an unexpected direction."
---

# Session Prep — Lazy GM Framework

Session prep is a structured thinking phase before play begins. It produces `world/session-prep.md` — the GM's private working document for the session. The player never sees this file directly; it shapes how the GM opens and runs the session.

## Philosophy

Prep is a scaffold, not a script. You are preparing **situations**, not **plots**. The player will go where they go. Your job is to have interesting material ready so that wherever they go, something compelling happens.

The six elements below are adapted from the Lazy GM method. Each one takes existing campaign state (world files, session log, quest board) and transforms it into actionable GM notes. Use `roll_oracle` and `roll_dice` to ground prep in randomness rather than invention.

## The Six Prep Elements

### 1. Strong Start

A designed opening scene — not a recap, not "you wake up at the inn." The strong start drops the PC into something immediate: action, tension, discovery, or a decision they didn't expect.

**Guidelines:**
- 2-4 sentences of vivid, sensory prose
- Starts in medias res or with an interrupting event
- Ends at a natural decision point — the player should want to react
- Connects to an active thread, quest, or world-advance consequence
- Can be a scene the PC walks into, or a scene that walks into the PC

**Examples of strong starts:**
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

### 3. Secrets and Clues (3-5)

Pieces of information the PC could discover during the session. Secrets are the most important prep element because they are **not tied to locations or NPCs** — they migrate freely between discovery paths.

**Each secret has:**
- **Label:** A short name for the information
- **Content:** The actual information (1-2 sentences)
- **Discovery paths (2+):** Different ways the PC could learn this. At least two paths per secret.
- **Thread:** Which campaign thread this advances

**Guidelines:**
- A secret about the cult's hideout can be learned from: a captured cultist, a tavern rumor, a map in the library, tracks in the forest, an NPC's slip of the tongue
- When the PC investigates *anything*, check your secrets list. Can one of these be delivered through what they're doing right now?
- Secrets that go undelivered carry forward to next session
- Mix scales: world-shaking revelations alongside small useful details

### 4. NPC Moves (2-4)

What active NPCs are doing *right now*, independent of the PC. NPCs have goals and they pursue them whether or not the PC is watching.

**Each NPC move has:**
- **Name:** The NPC
- **Doing:** What they're actively doing this session
- **Wants:** Their current goal or need
- **Attitude:** How they feel about the PC right now
- **Hook:** A line of dialogue or action they'd use if encountered

**Guidelines:**
- Read NPC and faction files before writing moves
- At least one NPC should be doing something that affects the PC indirectly
- At least one NPC should want something from the PC
- Unused NPC moves become off-screen events at end-session (the NPC still acted)

### 5. Encounter Prep (2-3)

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

## Template for `world/session-prep.md`

```markdown
# Session Prep
*Session {N} — {date}*
*Last session: {1-sentence summary}*

## Strong Start
{2-4 sentences: concrete, sensory, immediate, ends with decision point}

## Potential Scenes
### {Title}
- **Situation:** ...
- **Trigger:** ...
- **Complication:** ...
- **Thread:** ...

## Secrets and Clues
1. **{Label}** — {information}
   - *Discovery:* {path 1} | {path 2}
   - *Thread:* {connection}

## NPC Moves
### {Name}
- **Doing:** ... | **Wants:** ... | **Attitude:** ... | **Hook:** ...

## Encounters
### {Name}
- **Monsters:** {type, count, bestiary ref}
- **Environment:** {terrain, lighting, hazards}
- **Morale:** {break condition} | **Reward:** {loot}

## Treasure
- **{Item}** — {description, value}. *Context:* {placement}

## Notes
{Pacing notes, music ideas, callbacks to earlier sessions}
```

## During Play — Using Your Prep

Consult `world/session-prep.md` as a living reference throughout the session:

- **PC enters a new situation** — check Potential Scenes for a match
- **PC investigates or talks to NPCs** — check Secrets and Clues for information to reveal. Deliver secrets through whatever the PC is doing right now.
- **An NPC appears** — check NPC Moves for their current state, goals, and a ready line of dialogue
- **Combat starts** — check Encounters for pre-built setups with environment and morale
- **PC earns a reward** — check Treasure before improvising

**Secrets migrate.** If the PC doesn't go to the library where you planned to reveal the cult's location, deliver that secret through the next NPC conversation, environmental clue, or overheard rumor instead.

**Improvisation trumps adherence.** If the player goes somewhere unexpected, don't force the prep. The prep serves the GM; the GM doesn't serve the prep. Undelivered secrets carry forward. Unused NPC moves become off-screen events. Unused scenes evolve or expire.

**Update as you go.** When you deliver a secret, mentally note it as used. When a scene plays out differently than prepped, that's fine — the prep got you started, the player took it somewhere better.

## Prep Seeds (End-Session)

At end-session, unused prep elements are recycled into **prep seeds** — carried-forward material that the next session's prep will develop:

- Unused secrets carry forward verbatim
- Unused NPC moves become world-advance entries (the NPC acted off-screen)
- Unused scenes may evolve or expire depending on time passing
- Player signals (what interested them, what they avoided) shape next session's emphasis
- 2-3 suggested strong start ideas based on where the session ended

## Related Skills
- **pale-reach** — Hex map, dungeon content, and encounter tables for prepping scenes (or active adventure skill for custom campaigns)
- **bestiary** — Monster stat blocks for encounter prep
- **treasure** — Pre-rolled loot for session rewards
