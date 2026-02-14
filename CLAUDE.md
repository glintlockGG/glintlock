# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Glintlock is a Claude Code plugin that turns Claude into an always-on solo TTRPG campaign engine. A campaign is a folder + a thread — play is continuous, state is persistent, and the world advances between sessions. Run the included Pale Reach starter sandbox or generate unique custom campaigns through session-zero worldbuilding and on-demand adventure generation. Plugin components (agents, commands, skills, hooks) live at the repository root for auto-discovery. The MCP server (`engine/`) provides dice, oracle, TTS, sound effects, music, voice browsing, and session metadata tools.

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

2. **MCP server** (`engine/`) — Lightweight. Node.js/TypeScript process spawned by Claude Code over stdio. Exposes 11 tools via `@modelcontextprotocol/sdk`: `roll_dice`, `roll_oracle`, `oracle_yes_no`, `tts_narrate`, `generate_sfx`, `play_music`, `list_voices`, `get_session_metadata`, `render_audiobook`, `mix_audiobook`, `track_time`.

### Data Flow

```
Claude Code (claude --plugin-dir ./glintlock)
  ├── .claude-plugin/plugin.json  → manifest (name, version)
  ├── .mcp.json                   → MCP server config (portable paths)
  ├── SOUL.md                     → philosophical foundation (identity, values, voice, pact)
  ├── agents/gm.md                → GM operating manual (mechanics, tools, state, session flow)
  ├── commands/                   → slash commands (/glintlock:*)
  ├── skills/                     → rules, templates, dashboard, story generation
  ├── hooks/hooks.json            → SessionStart hook
  └── MCP (stdio) ──→ engine/dist/index.js
                        └── engine/data/oracle-tables.json
```

### State Management

Game state lives in `world/` inside the **user's project directory** (not inside the plugin repo). The `world/` directory is created by `/glintlock:start` and contains human-readable markdown files with YAML frontmatter. The agent reads and writes these files directly using the Read and Write tools. No database. State is continuously persisted during play.

- **Characters:** `world/characters/{name}.md` — YAML frontmatter for stats/HP/inventory, markdown body for description/notes
- **NPCs:** `world/npcs/{name}.md` — disposition, location, combat stats, current_goal, current_action
- **Locations:** `world/locations/{name}.md` — danger level, light, connections, contents
- **Items:** `world/items/{name}.md` — properties, owner, history
- **Factions:** `world/factions/{name}.md` — members, goals, disposition
- **Quests:** `world/quests.md` — Active / Developing / Completed sections
- **Session Log:** `world/session-log.md` — append-only tagged entries
- **GM Notes:** `world/gm-notes.md` — persistent prep buffer (strong starts, secrets, NPC moves, scenes, encounters, treasure). Refreshed by `/glintlock:resume`, `/glintlock:world-turn`, and at narrative pauses.
- **Calendar:** `world/calendar.md` — in-game date, season, weather, real-time sync metadata
- **Adventures:** `world/adventures/{name}.md` — Generated adventure content
- **Dooms:** `world/dooms.md` — Doom portent tracks (0-6 per doom, 3-6 dooms per campaign)
- **Clocks:** `world/clocks.md` — Progress clocks (segmented, BitD-style)
- **Countdown Dice:** `world/countdown.json` — Active countdown dice (cd12→cd4→exhausted)
- **Campaign Context:** `world/campaign-context.md` — premise, setting, tone
- **Campaign Memory:** `world/CLAUDE.md` — hot cache of campaign state (PC summary, play style, active threads, doom status, world state). Created at `/glintlock:start`, updated periodically during play and when resuming. The GM's primary quick-reference — loaded first by the SessionStart hook.

See `skills/state-management/SKILL.md` for file templates and conventions.

### MCP Server Modules

| File | Implements |
|------|-----------|
| `engine/src/index.ts` | MCP server entry, stdio transport, 11 tool registrations |
| `engine/src/tools/dice.ts` | `roll_dice` — NdS+M parser, `crypto.randomInt` RNG, advantage/disadvantage |
| `engine/src/tools/oracle.ts` | `roll_oracle` + `oracle_yes_no` — loads oracle-tables.json, handles subtypes + range matching + multi-column rolls + Ironsworn-style yes/no oracle |
| `engine/src/tools/tts.ts` | `tts_narrate` — ElevenLabs TTS with voice settings (stability, similarity, style) |
| `engine/src/tools/sfx.ts` | `generate_sfx` — ElevenLabs sound generation, background playback |
| `engine/src/tools/music.ts` | `play_music` — ElevenLabs music generation, looping playback, single-track management |
| `engine/src/tools/voices.ts` | `list_voices` — ElevenLabs voice browsing with search/filter |
| `engine/src/tools/metadata.ts` | `get_session_metadata` — session count, dates, read/write JSON |
| `engine/src/tools/audiobook.ts` | `render_audiobook` — parses chapter markdown into audio manifest (segments, chunks, voice assignments) |
| `engine/src/tools/audiobook-mixer.ts` | `mix_audiobook` — ffmpeg-based mixing: speech spine + music bed + SFX → final MP3 |
| `engine/src/tools/audio-utils.ts` | Shared utilities: `getAudioDurationMs` (ffprobe), `generateSilence` (ffmpeg) |
| `engine/src/tools/timer.ts` | `track_time` — countdown dice manager (add/tick/remove/reset/status), persists to world/countdown.json |

### Oracle Tables

`engine/data/oracle-tables.json` has three table formats:
- **Flat array**: Index by dice roll (e.g. `background` — 1d6 maps to array index)
- **Range object**: Keys are ranges like `"2-4"`, `"5-6"` (e.g. `creature_activity`)
- **Multi-column**: Independent roll per column, results concatenated (e.g. `adventure_name` has `name_1`, `name_2`, `name_3`)
- **Subtypes**: `npc_name` has per-ancestry arrays selected by a `subtype` parameter

### Skills

| Skill | Purpose |
|-------|---------|
| `core-rules` | Core rules: 6 classes (Warden, Scout, Invoker, Surgeon, Rogue, Seer), 5 ancestries, d20 roll-over resolution, countdown dice, gear, combat |
| `bestiary` | Monster stat blocks |
| `spellbook` | Spell lists and descriptions |
| `treasure` | Treasure tables and magic items |
| `adventure-design` | Adventure design principles, 7 structural templates (location-based, pointcrawl, investigation, faction conflict, defense/siege, expedition, heist), generation workflow |
| `pale-reach` | The Pale Reach starter sandbox: Thornwall home base, 7x5 hex map, 5 doom-site dungeons, First Watch starter adventure, encounter tables |
| `state-management` | Entity file templates (PC, NPC, location, item, faction) |
| `dashboard-generation` | HTML dashboard template |
| `story-generation` | Chronicle/prose generation guidelines |
| `audiobook-generation` | Audiobook pipeline: voice assignment, SFX/music cues, rendering, mixing |
| `gm-prep` | Continuous GM preparation: oracle-first methodology, just-in-time content generation, strong starts, secrets, NPC moves, encounters, treasure |

### Commands

| Command | Purpose |
|---------|---------|
| `/glintlock:start` | Create a character and start a new campaign (Pale Reach press-play or session-zero custom) |
| `/glintlock:resume` | Return to your campaign (hot-cache-first, world-advance if needed, strong start) |
| `/glintlock:world-turn` | Advance the living world (tick clocks, advance dooms, execute NPC/faction moves, refresh prep) |
| `/glintlock:feedback` | Signal your preferences to the GM |
| `/glintlock:status` | Show PC character sheet |
| `/glintlock:roll` | Player-initiated dice roll |
| `/glintlock:dashboard` | Generate visual HTML dashboard |
| `/glintlock:chronicle` | Generate a narrative story chapter from session events |
| `/glintlock:recap` | Deep audit of full campaign state |
| `/glintlock:audiobook` | Generate an audiobook from a chronicle chapter |
| `/glintlock:generate-adventure` | Generate and seed a new adventure into the campaign |

### Environment Variables

The MCP server reads env vars (set in `.mcp.json`):
- `GLINTLOCK_WORLD_DIR` — Path to world/ directory (resolves to `./world` in the user's project)
- `GLINTLOCK_ORACLE_PATH` — Oracle tables JSON path
- `ELEVENLABS_API_KEY` — ElevenLabs API key for TTS, sound effects, music, and voice browsing (optional)

### Config Details

- ESM modules (`"type": "module"` in package.json)
- TypeScript target: ES2022
- Module resolution: node
- Strict mode enabled

## When Acting as GM

When the plugin is active during play:
- SOUL.md defines your identity, values, and voice — loaded at conversation start via hook
- Play is continuous — a campaign is a folder + a thread. No session ceremony needed.
- ALWAYS use `roll_dice` for ALL mechanical resolution — never simulate randomness
- ALWAYS use `roll_oracle` for random content instead of inventing it
- Use `oracle_yes_no` for ambiguous decisions — roll first, interpret second (oracle discipline)
- The world files (`world/`) are ground truth — Read before narrating, Write immediately after state changes
- Consult `world/gm-notes.md` during play — check secrets when PC investigates, scenes when entering new situations, NPC moves when NPCs appear
- Append significant events to `world/session-log.md` with tags
- Update `world/quests.md` when quests change
- Update `world/calendar.md` when time passes
- Resolution: d20 ≥ Difficulty. Difficulty = 20 − Stat (untrained) or 20 − Stat×2 (trained). Critical = beat by 5+.
- Only call for checks when: time pressure + consequences + requires skill
- Countdown dice track resources (torches, rations, ammo, spells). Roll on trigger, step down on 1.
- Doom portents (0-6) advance through neglect or triggers. Update `world/dooms.md`.
- Progress clocks tick when fiction dictates. Update `world/clocks.md`.
- At narrative pauses (rest, travel, scene breaks): mini world-advance, refresh gm-notes, update CLAUDE.md
- Use `generate_sfx` for environmental and combat sounds at dramatic moments
- Use `play_music` to set mood when entering new areas or shifting tone; stop for tense silence
- Use `list_voices` when creating important NPCs — store `voice_id` in frontmatter, use it with `tts_narrate`
