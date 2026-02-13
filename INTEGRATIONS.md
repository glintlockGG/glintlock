# Integrations

Glintlock works in three tiers. Each tier adds capabilities but is never required — the plugin degrades gracefully.

## Tier 1 — Core (Required)

- **Claude Code CLI** — The plugin runs inside Claude Code. No other runtime needed.
- Provides: GM narration, state management (Read/Write), session flow, all skill content, slash commands

## Tier 2 — MCP Engine (Recommended)

- **Node.js 18+** — Required to run the MCP server
- Setup:
  ```bash
  cd engine && npm install && npm run build
  ```
- Provides: `roll_dice`, `roll_oracle`, `track_time`, `get_session_metadata`
- The `.mcp.json` at the plugin root configures the server automatically

## Tier 3 — Audio (Optional)

### ElevenLabs

- Set `ELEVENLABS_API_KEY` in `.mcp.json` under the `glintlock-engine` server env
- Required API key permissions: `text_to_speech`, `sound_generation`, `music_generation`, `voices_read`
- Provides: `tts_narrate`, `generate_sfx`, `play_music`, `list_voices`

### Audiobook Mixing

- **ffmpeg** and **ffprobe** must be on PATH
- Provides: `render_audiobook`, `mix_audiobook`
- Required in addition to ElevenLabs — the audiobook pipeline uses TTS for narration and ffmpeg for mixing

## What Works Without Each Layer

| Without | Behavior |
|---------|----------|
| MCP Engine | Text-only GM. Player rolls physical dice. Oracle content improvised from skill files. |
| ElevenLabs | Full mechanical GM with dice and oracles, no audio. Text narration only. |
| ffmpeg | Full GM + live audio (TTS, SFX, music), but no audiobook mixing. |
