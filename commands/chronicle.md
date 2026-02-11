---
description: "Generate a narrative story chapter from the most recent session"
allowed-tools:
  - "mcp:glintlock-engine:tts_narrate"
  - "Read"
  - "Write"
  - "Glob"
  - "Skill"
---

Generate a prose chapter from the most recent session's events. Load the `story-generation` skill first.

1. Read `world/session-log.md` to identify the most recent session's events
2. Read the PC file from `world/characters/` for character details
3. Read relevant NPC files from `world/npcs/` mentioned in the session events
4. Read relevant location files from `world/locations/`
5. Read `world/campaign-context.md` for tone and setting
6. Check if `world/chronicles/_series-meta.md` exists:
   - If yes: read it for voice/continuity notes, read the most recent chapter for continuity
   - If no: create it based on the campaign context and character
7. Transform the session events into narrative prose following the story-generation skill guidelines
8. Determine the chapter number (count existing chapter files + 1) and a fitting title
9. Write the chapter to `world/chronicles/chapter-{NN}-{kebab-title}.md`
10. Update `world/chronicles/_series-meta.md` with any new NPCs, continuity notes, or motifs

Ask the player if they'd also like an audiobook version (uses TTS, experimental).
