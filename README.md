# Glintlock

A [Claude Code plugin](https://docs.anthropic.com/en/docs/claude-code) that turns Claude into a solo TTRPG Game Master for [Shadowdark RPG](https://www.thearcanelibrary.com/pages/shadowdark).

Glintlock runs persistent campaigns with real dice, curated random tables, voice-acted NPCs, background music, sound effects, and full audiobook generation from your session logs.

## Quick Start

### Prerequisites

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI
- Node.js 18+
- [ElevenLabs API key](https://elevenlabs.io/) (optional, for voice/audio features)
- `ffmpeg` and `ffprobe` (optional, for audiobook mixing)

### Install

```bash
# Clone the plugin
git clone https://github.com/dakeobac/glintlock.git

# Build the MCP server
cd glintlock/engine && npm install && npm run build && cd ..

# Set your ElevenLabs API key (optional)
export ELEVENLABS_API_KEY=your-key-here

# Launch Claude Code with the plugin
claude --plugin-dir ./glintlock
```

### Play

```
> /glintlock:new-session     # Create a character and start playing
> /glintlock:continue-session # Resume where you left off
```

## What It Does

**You talk. Claude runs the game.** Describe what your character does. Claude narrates the world, voices NPCs, rolls dice, tracks your inventory, and plays atmospheric audio — all in the terminal.

### During Play

- Dice rolls use cryptographic randomness via the `roll_dice` MCP tool
- NPCs, encounters, and treasure come from curated Shadowdark random tables
- Game state is saved automatically to markdown files as you play
- Background music shifts as you explore new areas
- Important NPCs get persistent ElevenLabs voices

### After a Session

- `/glintlock:chronicle` transforms your session log into a prose story chapter
- `/glintlock:audiobook` generates a full audiobook from that chapter (narration, character voices, SFX, music) in the background while you keep playing
- `/glintlock:dashboard` builds an HTML campaign dashboard you can open in a browser

## Architecture

The plugin has two halves:

**Plugin shell** — Markdown files auto-discovered by Claude Code at the repository root. Agent identity, slash commands, game rules, templates, and hooks.

**MCP server** (`engine/`) — A lightweight Node.js/TypeScript process that provides 9 tools over stdio:

| Tool | What it does |
|------|-------------|
| `roll_dice` | Parse NdS+M expressions, cryptographic RNG, advantage/disadvantage |
| `roll_oracle` | Roll on curated Shadowdark random tables (NPCs, encounters, treasure, rumors) |
| `tts_narrate` | ElevenLabs text-to-speech with per-character voice settings |
| `generate_sfx` | ElevenLabs sound effect generation (doors, swords, thunder, monsters) |
| `play_music` | ElevenLabs music generation with looping background playback |
| `list_voices` | Browse ElevenLabs voice library to cast NPC voices |
| `get_session_metadata` | Track session count and campaign dates |
| `render_audiobook` | Parse a story chapter into an audio production manifest |
| `mix_audiobook` | Mix narration + music + SFX into a final MP3 via ffmpeg |

### State Management

All game state lives in `world/` as human-readable markdown with YAML frontmatter. No database.

```
world/
  characters/       # Player character sheets
  npcs/             # NPC files with disposition, stats, voice_id
  locations/        # Explored areas with connections and contents
  items/            # Notable items and artifacts
  factions/         # Groups and their goals
  quests.md         # Active / Developing / Completed quest board
  session-log.md    # Append-only tagged event log
  campaign-context.md
  dashboard.html    # Generated campaign dashboard
  chronicles/       # Generated prose story chapters
  audiobooks/       # Generated audiobook MP3s
```

## Commands

| Command | Description |
|---------|-------------|
| `/glintlock:new-session` | Start a new campaign with character creation |
| `/glintlock:continue-session` | Resume an existing campaign |
| `/glintlock:end-session` | End session with save, world-advance, and GM learning |
| `/glintlock:status` | Show your character sheet |
| `/glintlock:roll` | Player-initiated dice roll |
| `/glintlock:dashboard` | Generate a visual HTML campaign dashboard |
| `/glintlock:chronicle` | Turn session events into a narrative story chapter |
| `/glintlock:recap` | Deep audit of full campaign state |
| `/glintlock:audiobook` | Generate an audiobook from a chronicle chapter (runs in background) |

## Development

```bash
cd engine

# Build
npm run build

# Watch mode
npm run dev
```

There are no automated tests yet. The MCP server is tested by installing the plugin in Claude Code and calling tools interactively.

## Environment Variables

Set in your shell or in a `.env` file. The plugin reads them via `.mcp.json`:

| Variable | Required | Description |
|----------|----------|-------------|
| `ELEVENLABS_API_KEY` | No | Enables voice narration, sound effects, music, and audiobook generation |

`ffmpeg` and `ffprobe` must be on your PATH for audiobook mixing.

## License

MIT
