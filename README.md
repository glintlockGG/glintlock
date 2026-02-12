# Glintlock

A [Claude Code plugin](https://docs.anthropic.com/en/docs/claude-code) that turns Claude into a solo TTRPG Game Master for [Shadowdark RPG](https://www.thearcanelibrary.com/pages/shadowdark). It runs persistent campaigns with real dice, curated random tables, voice-acted NPCs, atmospheric audio, and full audiobook generation — all in the terminal.

## Quick Start

### Prerequisites

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI
- Node.js 18+
- [ElevenLabs API key](https://elevenlabs.io/) (optional — enables voice narration, sound effects, music, and audiobooks)
- `ffmpeg` and `ffprobe` on your PATH (optional — required for audiobook mixing)

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
> /glintlock:new-session        # Create a character and start playing
> /glintlock:continue-session   # Resume where you left off
```

## How It Works

You talk. Claude runs the game. Describe what your character does in natural language. Claude narrates the world, voices NPCs, rolls dice, tracks your inventory, manages quests, and plays atmospheric audio — all in the terminal. Game state is saved automatically to markdown files as you play, so you can pick up exactly where you left off.

## Features

### Gameplay

- **Real dice** — All rolls use cryptographic randomness (`crypto.randomInt`) via the `roll_dice` tool. Standard NdS+M notation with advantage and disadvantage.
- **18 oracle tables** — Curated Shadowdark random tables for NPC names (6 ancestries: dwarf, elf, goblin, halfling, half-orc, human), random encounters, treasure, traps, rumors, hazards, creature behavior, backgrounds, gear, adventure names, and magic item names. The GM rolls on these instead of inventing content, keeping results surprising for both player and AI.
- **Full Shadowdark rules** — 4 classes (Fighter, Priest, Thief, Wizard), 6 ancestries, 52 monster stat blocks (LV 0–8+), 36 spells (Priest and Wizard, Tiers 1–2), complete combat, death and dying, light and darkness, gear, encumbrance, and talent tables. All encoded as skills that load on demand.
- **Persistent world state** — Characters, NPCs, locations, items, factions, quests, and a session log are stored as human-readable markdown files with YAML frontmatter. No database. Files are version-controllable and editable by hand.
- **GM learning** — The plugin tracks play style preferences, rulings precedents, narrative patterns, and active threads across sessions in a campaign memory file (`world/CLAUDE.md`). It remembers that you prefer exploration over combat, or that swimming in armor gives disadvantage, without being told twice.

### Audio

Requires an [ElevenLabs](https://elevenlabs.io/) API key. All audio plays in the background without blocking gameplay.

- **Voice narration** — Text-to-speech via ElevenLabs v3. The GM narrates dramatic moments, reads item descriptions, and speaks as NPCs.
- **Per-NPC voice casting** — Browse the ElevenLabs voice library with `list_voices` to find a fitting voice for important NPCs. Voice IDs are stored in NPC frontmatter and used consistently across sessions.
- **Voice settings** — Control stability, similarity boost, style exaggeration, and speech speed per utterance.
- **Multilingual narration** — The `language_code` parameter (ISO 639-3) enables narration in any supported language using the same voices.
- **Sound effects** — AI-generated environmental and combat sounds (door creaks, sword clashes, thunder, monster roars) at dramatic moments.
- **Background music** — AI-generated mood music that loops automatically. One track at a time — new music crossfades with the previous track. The GM shifts music when you enter new areas or the tone changes, and stops it for tense silence.

### Story & Output

- **Chronicles** — `/glintlock:chronicle` transforms the session log into a 2,000–4,000 word prose chapter. An agent resolves dialogue attribution (which NPC said what) and produces narrative fiction from the raw event log.
- **Dashboard** — `/glintlock:dashboard` generates an HTML campaign dashboard you can open in any browser. Character sheet, quest board, NPC roster, location map, session journal — all in a single file using pure CSS tabs (no JavaScript framework).
- **Audiobooks** — `/glintlock:audiobook` runs a full production pipeline in the background:
  1. Read a chronicle chapter
  2. Assign ElevenLabs voices to each speaker
  3. Annotate the chapter with speaker/narration segments
  4. Call `render_audiobook` to produce a structured audio manifest (scenes → segments → chunks)
  5. Add SFX cues (1–2 per scene) and music cues (1 per scene)
  6. Generate TTS for each chunk with `tts_narrate` (narrator voice + character voices)
  7. Generate sound effects with `generate_sfx`
  8. Generate music tracks with `play_music`
  9. Update the manifest with actual file paths and durations
  10. Call `mix_audiobook` to combine everything into a final MP3 via ffmpeg

  Multilingual audiobooks are supported — SFX and music are generated once and shared across language variants.

## Commands

| Command | Description |
|---------|-------------|
| `/glintlock:new-session` | Start a new campaign with character creation |
| `/glintlock:continue-session` | Resume an existing campaign |
| `/glintlock:end-session` | End session with save, world-advance, and campaign memory update |
| `/glintlock:status` | Show your character sheet |
| `/glintlock:roll` | Player-initiated dice roll |
| `/glintlock:dashboard` | Generate a visual HTML campaign dashboard |
| `/glintlock:chronicle` | Turn session events into a narrative story chapter |
| `/glintlock:recap` | Deep audit of full campaign state |
| `/glintlock:audiobook` | Generate an audiobook from a chronicle chapter (runs in background) |

## Architecture

The plugin has two halves:

### Plugin Shell

Markdown files at the repository root, auto-discovered by Claude Code. These define the GM's identity, available commands, game rules, and automation hooks.

```
agents/gm.md              — GM identity and behavioral rules
commands/                  — 9 slash commands
skills/                    — 10 skills (rules, templates, generation pipelines)
hooks/hooks.json           — SessionStart hook (loads campaign context)
.claude-plugin/plugin.json — Plugin manifest
.mcp.json                  — MCP server configuration
```

### MCP Server

A lightweight Node.js/TypeScript process (`engine/`) spawned by Claude Code over stdio. Provides 9 tools:

| Tool | What it does |
|------|-------------|
| `roll_dice` | Parse NdS+M expressions, cryptographic RNG, advantage/disadvantage |
| `roll_oracle` | Roll on 18 curated Shadowdark random tables with subtype and range matching |
| `tts_narrate` | ElevenLabs v3 text-to-speech with per-character voice settings and multilingual support |
| `generate_sfx` | AI sound effect generation with background playback |
| `play_music` | AI music generation with looping playback, single-track management |
| `list_voices` | Browse ElevenLabs voice library with search and category filtering |
| `get_session_metadata` | Track session count and campaign dates |
| `render_audiobook` | Parse a story chapter into a structured audio manifest (scenes → segments → chunks) |
| `mix_audiobook` | Mix narration + music + SFX into a final MP3 via ffmpeg |

### Skills

Skills are bundles of rules and templates that load on demand when the GM needs them:

| Skill | Content |
|-------|---------|
| `shadowdark-core` | Core rules: 4 classes, 6 ancestries, combat, death, light/darkness, gear, talent tables |
| `shadowdark-monsters` | 52 monster stat blocks with AC, HP, attacks, abilities, and level |
| `shadowdark-spells` | 36 spells (Priest + Wizard, Tiers 1–2), spellcasting, mishaps, scrolls, wands |
| `shadowdark-treasure` | Treasure tables, magic item generation, loot rules |
| `shadowdark-adventure` | Adventure generation guidelines |
| `shadowdark-adventure-obsidian-keep` | Pre-built adventure module: Raiding the Obsidian Keep |
| `state-management` | Entity file templates (PC, NPC, location, item, faction) and conventions |
| `dashboard-generation` | HTML dashboard template with pure CSS tabs |
| `story-generation` | Guidelines for transforming session logs into prose chapters |
| `audiobook-generation` | Full audiobook pipeline: voice assignment, SFX/music cues, rendering, mixing |

### State Management

All game state lives in `world/` as human-readable markdown with YAML frontmatter. No database.

```
world/
  characters/          # Player character sheets
  npcs/                # NPC files with disposition, stats, voice_id
  locations/           # Explored areas with connections and contents
  items/               # Notable items and artifacts
  factions/            # Groups and their goals
  quests.md            # Active / Developing / Completed quest board
  session-log.md       # Append-only tagged event log
  campaign-context.md  # Campaign premise and setting
  CLAUDE.md            # Campaign memory (play style, rulings, active threads)
  dashboard.html       # Generated campaign dashboard
  chronicles/          # Generated prose story chapters
  audiobooks/          # Generated audiobook MP3s
```

### Data Flow

```
Claude Code (claude --plugin-dir ./glintlock)
  ├── Plugin shell (agents, commands, skills, hooks)
  ├── world/ (markdown entity files — ground truth)
  └── MCP (stdio) ──→ engine/dist/index.js
                        ├── Dice + oracle tools (local)
                        └── Audio tools (ElevenLabs API)
```

## Development

```bash
cd engine

# Build
npm run build

# Watch mode
npm run dev
```

There are no automated tests yet. The MCP server is tested by installing the plugin in Claude Code and calling tools interactively.

### Environment Variables

Set in your shell before launching Claude Code. The plugin passes them to the MCP server via `.mcp.json`:

| Variable | Required | Description |
|----------|----------|-------------|
| `ELEVENLABS_API_KEY` | No | Enables voice narration, sound effects, music, and audiobook generation |

The following are configured automatically by the plugin and do not need to be set manually:

| Variable | Description |
|----------|-------------|
| `GLINTLOCK_WORLD_DIR` | Path to `world/` directory (set via `${CLAUDE_PLUGIN_ROOT}`) |
| `GLINTLOCK_ORACLE_PATH` | Path to oracle tables JSON (set via `${CLAUDE_PLUGIN_ROOT}`) |

`ffmpeg` and `ffprobe` must be on your PATH for audiobook mixing.

## License

MIT
