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

Game state lives in `world/` inside the **user's project directory** (not inside the plugin repo). See README.md for the full file listing and `skills/state-management/SKILL.md` for templates and conventions.

### Oracle Tables

`engine/data/oracle-tables.json` has four table formats:
- **Flat array**: Index by dice roll (e.g. `background` — 1d6 maps to array index)
- **Range object**: Keys are ranges like `"2-4"`, `"5-6"` (e.g. `creature_activity`)
- **Multi-column**: Independent roll per column, results concatenated (e.g. `adventure_name` has `name_1`, `name_2`, `name_3`)
- **Subtypes**: `npc_name` has per-ancestry arrays selected by a `subtype` parameter

### Config Details

- ESM modules (`"type": "module"` in package.json)
- TypeScript target: ES2022
- Module resolution: node
- Strict mode enabled

## Plugin Component Conventions

- **Agents** need `name` in frontmatter
- **Skills** need `name` and a third-person `description` in frontmatter
- **Hooks** need `matcher: {}` in their entry in `hooks/hooks.json`
- **MCP servers** are configured in `.mcp.json` at the project root — NOT in `.claude/settings.json`
- Plugin author uses object format: `{"name": "Glintlock"}` (not a plain string)

## Developer Gotchas

1. **ESM import extensions** — All local imports in `engine/src/` must use `.js` extensions, even for `.ts` source files. TypeScript compiles but doesn't rewrite extensions.
2. **`engine/dist/` is committed** — Pre-built for plugin distribution. Always rebuild (`cd engine && npm run build`) before committing MCP server changes.
3. **Oracle tables cached at startup** — After editing `engine/data/oracle-tables.json`, you must restart Claude Code for changes to take effect.
4. **macOS `afplay` has no `--loops` flag** — Looping audio uses a bash `while` loop, not an `afplay` flag.
5. **ElevenLabs `stability` param** — Only accepts `0.0`, `0.5`, or `1.0`. Arbitrary floats will error.
6. **`output_path` on audio tools** — When set, saves audio to file and skips playback. Returns `duration_ms` instead of playing.
7. **`world/` lives in the user's project** — Created by `/glintlock:start` in the user's working directory, not inside the plugin repo. It is fully gitignored in the plugin repo.
8. **`npm cache` permissions** — If you hit permissions errors, use `--cache /tmp/npm-cache` as a workaround.

## Key Files by Task

| Task | Key files |
|------|-----------|
| Modifying game rules | `skills/core-rules/`, `skills/bestiary/`, `skills/spellbook/`, `skills/treasure/` |
| Modifying MCP tools | `engine/src/tools/*.ts`, `engine/src/index.ts` (tool registration) |
| Modifying GM behavior | `agents/gm.md`, `SOUL.md`, `skills/gm-prep/SKILL.md` |
| Modifying state templates | `skills/state-management/SKILL.md` + `references/` |
| Modifying dashboard | `skills/dashboard-generation/SKILL.md` + `references/dashboard-template.html` |
| Modifying oracle tables | `engine/data/oracle-tables.json` (restart after editing) |
| Modifying slash commands | `commands/*.md` |
| Modifying hooks | `hooks/hooks.json` |
| Modifying the starter sandbox | `skills/pale-reach/` |
| Modifying audiobook pipeline | `skills/audiobook-generation/SKILL.md`, `engine/src/tools/audiobook.ts`, `engine/src/tools/audiobook-mixer.ts` |

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
