# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Glintlock is a Claude Code plugin that turns Claude into a solo TTRPG Game Master for Shadowdark RPG. Plugin components (agents, commands, skills, hooks) live at the repository root for auto-discovery. The MCP server (`engine/`) provides dice, oracle, TTS, sound effects, music, voice browsing, and session metadata tools.

## Development Commands

```bash
# Build the MCP server (must be done before the plugin can be used)
cd engine && npm install && npm run build

# Watch mode for development
cd engine && npm run dev

# Run the built MCP server directly (for testing)
node engine/dist/index.js
```

There are no tests yet. The MCP server is tested by installing the plugin in Claude Code and calling tools interactively.

## Architecture

### Two Halves

1. **Plugin shell** — Auto-discovered at plugin root. Agent identity (`agents/gm.md`), slash commands (`commands/`), game rules and templates (`skills/`), hooks (`hooks/`), and MCP config (`.mcp.json`). Manifest at `.claude-plugin/plugin.json`.

2. **MCP server** (`engine/`) — Lightweight. Node.js/TypeScript process spawned by Claude Code over stdio. Exposes 9 tools via `@modelcontextprotocol/sdk`: `roll_dice`, `roll_oracle`, `tts_narrate`, `generate_sfx`, `play_music`, `list_voices`, `get_session_metadata`, `render_audiobook`, `mix_audiobook`.

### Data Flow

```
Claude Code (claude --plugin-dir ./glintlock)
  ├── .claude-plugin/plugin.json  → manifest (name, version)
  ├── .mcp.json                   → MCP server config (portable paths)
  ├── agents/gm.md                → GM identity + rules
  ├── commands/                   → slash commands (/glintlock:*)
  ├── skills/                     → rules, templates, dashboard, story generation
  ├── hooks/hooks.json            → SessionStart hook
  ├── world/                      → markdown entity files (ground truth)
  │   ├── characters/             → PC files
  │   ├── npcs/                   → NPC files
  │   ├── locations/              → Location files
  │   ├── items/                  → Item files
  │   ├── factions/               → Faction files
  │   ├── quests.md               → Quest board
  │   ├── session-log.md          → Session events
  │   ├── campaign-context.md     → Campaign premise
  │   ├── expertise.yaml          → GM learning
  │   ├── dashboard.html          → Generated visual dashboard
  │   ├── chronicles/             → Generated story chapters
  │   └── audiobooks/             → Generated audiobook MP3s
  └── MCP (stdio) ──→ engine/dist/index.js
                        └── engine/data/oracle-tables.json
```

### State Management

Game state lives in `world/` as human-readable markdown files with YAML frontmatter. The agent reads and writes these files directly using the Read and Write tools. No database.

- **Characters:** `world/characters/{name}.md` — YAML frontmatter for stats/HP/inventory, markdown body for description/notes
- **NPCs:** `world/npcs/{name}.md` — disposition, location, combat stats if relevant
- **Locations:** `world/locations/{name}.md` — danger level, light, connections, contents
- **Items:** `world/items/{name}.md` — properties, owner, history
- **Factions:** `world/factions/{name}.md` — members, goals, disposition
- **Quests:** `world/quests.md` — Active / Developing / Completed sections
- **Session Log:** `world/session-log.md` — append-only tagged entries
- **Campaign Context:** `world/campaign-context.md` — premise, setting, tone

See `skills/state-management/SKILL.md` for file templates and conventions.

### MCP Server Modules

| File | Implements |
|------|-----------|
| `engine/src/index.ts` | MCP server entry, stdio transport, 9 tool registrations |
| `engine/src/tools/dice.ts` | `roll_dice` — NdS+M parser, `crypto.randomInt` RNG, advantage/disadvantage |
| `engine/src/tools/oracle.ts` | `roll_oracle` — loads oracle-tables.json, handles subtypes + range matching + multi-column rolls |
| `engine/src/tools/tts.ts` | `tts_narrate` — ElevenLabs TTS with voice settings (stability, similarity, style) |
| `engine/src/tools/sfx.ts` | `generate_sfx` — ElevenLabs sound generation, background playback |
| `engine/src/tools/music.ts` | `play_music` — ElevenLabs music generation, looping playback, single-track management |
| `engine/src/tools/voices.ts` | `list_voices` — ElevenLabs voice browsing with search/filter |
| `engine/src/tools/metadata.ts` | `get_session_metadata` — session count, dates, read/write JSON |
| `engine/src/tools/audiobook.ts` | `render_audiobook` — parses chapter markdown into audio manifest (segments, chunks, voice assignments) |
| `engine/src/tools/audiobook-mixer.ts` | `mix_audiobook` — ffmpeg-based mixing: speech spine + music bed + SFX → final MP3 |
| `engine/src/tools/audio-utils.ts` | Shared utilities: `getAudioDurationMs` (ffprobe), `generateSilence` (ffmpeg) |

### Oracle Tables

`engine/data/oracle-tables.json` has three table formats:
- **Flat array**: Index by dice roll (e.g. `background` — 1d20 maps to array index)
- **Range object**: Keys are ranges like `"2-4"`, `"5-6"` (e.g. `creature_activity`)
- **Multi-column**: Independent roll per column, results concatenated (e.g. `adventure_name` has `name_1`, `name_2`, `name_3`)
- **Subtypes**: `npc_name` has per-ancestry arrays selected by a `subtype` parameter

### Skills

| Skill | Purpose |
|-------|---------|
| `shadowdark-core` | Core rules, class/ancestry tables, gear lists |
| `shadowdark-monsters` | Monster stat blocks |
| `shadowdark-spells` | Spell lists and descriptions |
| `shadowdark-treasure` | Treasure tables and magic items |
| `shadowdark-adventure` | Adventure generation guidelines |
| `shadowdark-adventure-obsidian-keep` | Pre-built adventure: The Obsidian Keep |
| `state-management` | Entity file templates (PC, NPC, location, item, faction) |
| `dashboard-generation` | HTML dashboard template |
| `story-generation` | Chronicle/prose generation guidelines |
| `audiobook-generation` | Audiobook pipeline: voice assignment, SFX/music cues, rendering, mixing |

### Commands

| Command | Purpose |
|---------|---------|
| `/glintlock:new-session` | Start a new campaign with character creation |
| `/glintlock:continue-session` | Resume an existing campaign |
| `/glintlock:end-session` | End session with save, world-advance, expertise extraction |
| `/glintlock:status` | Show PC character sheet |
| `/glintlock:roll` | Player-initiated dice roll |
| `/glintlock:dashboard` | Generate visual HTML dashboard |
| `/glintlock:chronicle` | Generate a narrative story chapter from session events |
| `/glintlock:recap` | Deep audit of full campaign state |
| `/glintlock:audiobook` | Generate an audiobook from a chronicle chapter |

### Environment Variables

The MCP server reads env vars (set in `.mcp.json`):
- `GLINTLOCK_WORLD_DIR` — Path to world/ directory
- `GLINTLOCK_ORACLE_PATH` — Oracle tables JSON path
- `ELEVENLABS_API_KEY` — ElevenLabs API key for TTS, sound effects, music, and voice browsing (optional)

### Config Details

- ESM modules (`"type": "module"` in package.json)
- TypeScript target: ES2022
- Module resolution: node
- Strict mode enabled

## When Acting as GM

When the plugin is active during Shadowdark play:
- ALWAYS use `roll_dice` for ALL mechanical resolution — never simulate randomness
- ALWAYS use `roll_oracle` for random content instead of inventing it
- The world files (`world/`) are ground truth — Read before narrating, Write immediately after state changes
- Append significant events to `world/session-log.md` with tags
- Update `world/quests.md` when quests change
- Standard DCs: easy 9, normal 12, hard 15, extreme 18
- Only call for checks when: time pressure + consequences + requires skill
- Use `generate_sfx` for environmental and combat sounds at dramatic moments
- Use `play_music` to set mood when entering new areas or shifting tone; stop for tense silence
- Use `list_voices` when creating important NPCs — store `voice_id` in frontmatter, use it with `tts_narrate`
