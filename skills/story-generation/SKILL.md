---
name: story-generation
description: "Transform gameplay session logs into narrative prose chronicle chapters. This skill should be used when the player requests a chronicle, runs /glintlock:chronicle, or asks to turn session events into a story."
---

# Story Generation — Chronicles

Transform raw gameplay events into polished narrative prose. Each session becomes a chapter in an ongoing story.

## Voice and Style

- **Perspective:** Third person, past tense. Shift from gameplay's second-person present.
- **Tone:** Match the campaign's tone — dark fantasy, gritty, atmospheric. Preserve the GM's voice without the mechanical scaffolding.
- **Prose quality:** Publishable fiction. Tight sentences, evocative imagery, earned emotional beats. No purple prose.
- **Dialogue:** Preserve NPC dialogue from the session. Give characters consistent voices drawn from their NPC files.
- **Pacing:** Not every dice roll needs a paragraph. Compress routine exploration. Expand critical moments — the natural 20 that saved a life, the trap that nearly ended everything, the NPC conversation that changed the quest's direction.

## What to Include

- **Player decisions as character choices.** The player chose to spare the goblin — write it as a character moment with motivation and internal weight.
- **Combat as choreography.** Don't list attack rolls. Write the fight as a scene — the clash of steel, the smell of blood, the moment fear creeps in.
- **Discoveries as revelations.** Finding a hidden room isn't "the PC rolled 14 on perception." It's the character's fingers finding the groove in the stone, the grinding of ancient machinery.
- **NPC interactions as dialogue scenes.** Use the NPC's personality from their file. Give them distinct speech patterns.
- **Environmental atmosphere.** The darkness, the cold, the sounds. [SYSTEM] is about the oppressive weight of the unknown.

## What to Exclude

- Mechanical resolution language ("roll a d20", "DC 12", "takes 5 damage")
- Meta-game references ("the player decides", "you can choose to")
- Tool call results or system output
- Exact HP numbers (describe wounds and fatigue instead)

## Chapter Structure

```markdown
# Chapter {NN}: {Title}

*{One-line italicized epigraph or atmospheric hook}*

---

{Scene 1 — opening, re-establish setting and character}

{Scene 2 — rising action, encounters, exploration}

{Scene 3 — climax or key event of the session}

{Scene 4 — aftermath, reflection, or cliffhanger}

---

*{Closing line — ominous, reflective, or forward-looking}*
```

- **Length:** 2,000–4,000 words per chapter.
- **Scene breaks:** Use `---` between scenes. Don't label scenes.
- **Chapter titles:** Evocative, specific. "The Descent" not "Chapter 3." Reference the key event or theme.

## Series Metadata

On first chronicle generation, create `world/chronicles/_series-meta.md`:

```markdown
---
title: "{Campaign name or generated series title}"
protagonist: "{PC name}"
tone: "{Campaign tone from campaign-context.md}"
pov: "third person limited"
tense: "past"
---

# Series Notes

## Character Voice
- {PC name}: {Brief description of how they think, speak, act in prose}

## NPC Voices
- {NPC name}: {Speech patterns, verbal tics, personality in dialogue}

## Recurring Imagery
- {Motifs that have emerged — darkness, fire, etc.}

## Continuity Notes
- {Important details to maintain across chapters}
```

Update `_series-meta.md` after each chapter with new NPCs, continuity notes, and emerging motifs.

## Audiobook Generation

For audiobook generation, use the `/glintlock:audiobook` command after writing the chapter. It uses the dedicated audiobook pipeline with voice assignment, SFX, background music, and ffmpeg mixing.

## Related Skills
- **audiobook-generation** — Chronicle chapters are the source material for audiobooks
