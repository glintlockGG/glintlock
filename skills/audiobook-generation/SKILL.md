---
description: "Audiobook generation pipeline — voice assignment, SFX/music cues, rendering, and mixing"
---

# Audiobook Generation

Transform a chronicle chapter into a rich audiobook with narration, character voices, sound effects, and background music.

## Pipeline Overview

```
1. Read chapter markdown
2. Assign voices to speakers without voice_ids
3. Agent annotates chapter → produces annotated_scenes JSON
4. Call render_audiobook with annotated_scenes → get AudioManifest
5. Annotate manifest with SFX cues (1-2 per scene) and music cues (1 per scene)
6. Iterate chunks: call tts_narrate with output_path for each
7. Generate SFX: call generate_sfx with output_path for each cue
8. Generate music: call play_music with output_path for each scene
9. Update manifest with actual file paths and durations
10. Call mix_audiobook → final MP3
```

## Chapter Annotation (Step 3)

The agent reads the chapter prose and produces a structured `annotated_scenes` array that tells `render_audiobook` exactly what is narration, dialogue, or epigraph — and who is speaking each line of dialogue.

### Why Agent Annotation?

Regex-based dialogue parsing misses ~60% of dialogue in literary prose:
- Standalone quotes without attribution: `"Don't move."`
- Pronoun speakers: `"I'll do it," he said` — regex can't resolve "he" to the character
- Attribution-first patterns: `Viola whispered, "Come closer."`
- Multi-sentence dialogue split across lines

The agent understands narrative context, can track who is speaking across paragraphs, and resolves pronouns naturally.

### Annotation Format

```json
[
  {
    "segments": [
      { "type": "epigraph", "text": "The darkness remembers what the light forgets." },
      { "type": "narration", "text": "The corridor stretched into blackness, water pooling around Elindos's boots." },
      { "type": "dialogue", "text": "You shouldn't be here.", "speaker": "Viola" },
      { "type": "narration", "text": "Viola's glass-like skin caught the torchlight, refracting it into crimson shards." },
      { "type": "dialogue", "text": "I go where the treasure is.", "speaker": "Elindos" },
      { "type": "narration", "text": "She smiled — if the stretching of translucent lips over too-sharp teeth could be called a smile." }
    ]
  },
  {
    "segments": [
      { "type": "narration", "text": "The banquet hall had once been magnificent..." }
    ]
  }
]
```

### Annotation Rules

1. **One scene per `---` separator** in the chapter markdown. Each scene becomes one entry in the array.
2. **Segments are ordered** — they must appear in the same order as the source text.
3. **Strip quote marks** from dialogue text. The TTS engine should speak the words, not the punctuation.
4. **Include attribution narration** as separate narration segments: `"Come," Viola whispered, her fingers trailing frost on the stone.` becomes:
   - dialogue: "Come." (speaker: Viola)
   - narration: "Viola whispered, her fingers trailing frost on the stone."
5. **Resolve all pronouns** to character names. Never use "he", "she", "they" as a speaker value.
6. **Epigraphs** are italicized standalone paragraphs at the start or end of a chapter/scene. Mark them as `type: "epigraph"`.
7. **Don't split narration unnecessarily.** Consecutive narration paragraphs can be combined into one segment, but keep segments under ~500 characters for natural TTS pacing.
8. **Every line of dialogue must have a speaker.** If truly ambiguous, use the most recent named speaker from context.

## Voice Assignment Protocol

1. **Check NPC files** — Read each speaker's NPC file from `world/npcs/`. If `voice_id` is set in frontmatter, use it.
2. **Assign new voices** — For speakers without a voice_id:
   - Use `list_voices` with a search term matching the character (e.g. "old man gruff" for Silvio, "cold aristocratic woman" for Viola)
   - Pick the best match from results
   - Write the voice_id back to the NPC's frontmatter so it persists across chapters
3. **PC voice** — The player character gets a distinct voice too. Check `world/characters/*.md` for `voice_id` in frontmatter.
4. **Narrator** — Default narrator voice: `w8SDQBLZWRZYxv1YDGss`. Don't change unless the player requests it.

### Voice Settings by Emotion

| Emotion | stability | similarity_boost | style |
|---------|-----------|-------------------|-------|
| Calm narration | 0.5 | 0.75 | 0.0 |
| Tense/urgent | 0.3 | 0.75 | 0.3 |
| Whispered | 0.4 | 0.8 | 0.2 |
| Shouting | 0.3 | 0.6 | 0.5 |
| Cold/aristocratic | 0.7 | 0.8 | 0.1 |
| Fearful | 0.2 | 0.7 | 0.4 |

Store per-NPC voice_settings in frontmatter for consistent rendering:

```yaml
voice_id: "abc123"
voice_settings: { stability: 0.7, similarity_boost: 0.8, style: 0.1 }
```

## SFX Cue Guidelines

- **Max 1-2 SFX per scene.** Less is more. Only at moments of physical action or environmental shift.
- **Good cues:** sword clash, door creaking open, footsteps in water, distant thunder, glass shattering, fire crackling
- **Bad cues:** "character thinking," "tension building," abstract emotions
- **Duration:** 2-5 seconds for most SFX. Use `duration_seconds` parameter.
- **Placement:** Attach to the segment where the action occurs. The mixer positions it at the segment's start time.

## Music Cue Guidelines

- **One music cue per scene.** Defines the scene's overall mood.
- **Always instrumental** — `force_instrumental: true`
- **Duration:** 30-60 seconds. The mixer loops it to fill the scene.
- **Volume:** Mixed at 0.15 by the mixer (low bed under narration).
- **Good prompts:** "dark ambient dungeon with distant dripping and low drones", "tense orchestral strings building slowly", "melancholic piano with rain"
- **Bad prompts:** "epic battle music for the most amazing fight ever" (too vague/hype)

## File Structure

```
world/audiobooks/
  chapter-01-the-living-marble.mp3    <- final output
  .build/                              <- intermediate (gitignored)
    chapter-01/
      manifest.json                    <- annotated manifest
      seg-001-chunk-001.mp3            <- TTS segments
      seg-001-chunk-002.mp3
      sfx-seg-005.mp3                  <- SFX files
      music-scene-00.mp3               <- Music files
      spine.mp3                        <- Concatenated speech
```

## Cost Awareness

ElevenLabs charges by character for TTS and by generation for SFX/music:
- **TTS:** ~$0.30 per 1,000 characters. A 3,000-word chapter ~ 18,000 chars ~ **$5.40**
- **SFX:** ~$0.10 per generation. 5-8 SFX per chapter ~ **$0.50-0.80**
- **Music:** ~$0.20 per generation. 5-6 scenes ~ **$1.00-1.20**
- **Total estimate:** **$2-7 per chapter** depending on length and ElevenLabs plan

Inform the player of the estimated cost before generating.

## Iterating Chunks

When calling `tts_narrate` for each chunk:

1. Use the chunk's `voice_id` from the manifest
2. Set `output_path` to `{build_dir}/seg-{segId}-chunk-{chunkId}.mp3`
3. Apply voice_settings from the NPC frontmatter if available
4. After the call returns, update the chunk's `file_path` and `actual_duration_ms` in the manifest

Process chunks sequentially to avoid overwhelming the API. Report progress every 10 chunks.

## After Mixing

1. Write the final annotated manifest to `{build_dir}/manifest.json` for debugging
2. Report: final MP3 path, total duration (formatted as MM:SS), estimated cost
3. Offer to play a preview (call `tts_narrate` without output_path on the first paragraph)
