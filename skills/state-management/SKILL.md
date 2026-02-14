---
name: state-management
description: "Entity file templates and state management conventions for world files. This skill should be used when creating characters, NPCs, locations, items, or factions, updating entity files, writing to the session log or quest board, or formatting campaign memory."
---

# State Management — Markdown Entity Files

All game state lives in `world/` as human-readable markdown files with YAML frontmatter. The frontmatter contains structured data (stats, HP, inventory counts). The markdown body contains narrative descriptions, notes, and freeform content.

## File Conventions

- **Filenames:** lowercase-kebab-case (e.g. `kael.md`, `corvin-half-tooth.md`, `wardens-hall.md`)
- **Directories:** `world/characters/`, `world/npcs/`, `world/locations/`, `world/items/`, `world/factions/`
- **Global files:** `world/quests.md`, `world/session-log.md`, `world/campaign-context.md`, `world/myths.md`, `world/clocks.md`
- **Create:** Use the Write tool with the appropriate template (see `references/templates.md`)
- **Read:** Use the Read tool to load a file before narrating or making decisions
- **Update:** Read the file first, modify the relevant sections, Write the full updated file back
- **Delete:** Mark as "deceased", "destroyed", or "disbanded" in the file's frontmatter (`status: deceased`). Don't delete files — history matters

## Entity Templates

Read `references/templates.md` for the full templates for all entity types:
- **Player Character** — stats (1-10), training, armor (DR), countdown dice, inventory, spells, notes
- **NPC** — description, combat stats (armor, attack_die, zone, priority, weakness), voice settings
- **Location** — danger level, light, connections, contents
- **Item** — properties, owner, history
- **Faction** — members, goals, disposition
- **Myths** (`world/myths.md`) — five myths with omen levels 0-6
- **Progress Clocks** (`world/clocks.md`) — segmented progress clocks
- **Campaign Memory** (`world/CLAUDE.md`) — compact markdown tables, updated each session

## Quest Board (`world/quests.md`)

```markdown
# Quest Board

## Active
- **Secure the Road** — Commander Vess needs the southern road cleared for supply caravans. Reward: 30 gp + garrison standing. *Lead: goblin raiding party reported near the Thornwood edge.*
- **Strange Sounds** — Something scrapes beneath the Undercroft at night. Investigate.

## Developing
- **The Shepherd's Fog** — Fog from the Fenway is rolling closer to Thornwall each morning. No one's talking about it yet.

## Completed
- **Arrival** — Reached Thornwall safely. Met Commander Vess and Corvin Half-Tooth.
```

## Session Log (`world/session-log.md`)

Append entries chronologically. Use tags in brackets for categorization.

```markdown
# Session Log

## Session 1 — 2026-02-14

- [event] Kael arrived in Thornwall and reported to Commander Vess at the Warden's Hall
- [discovery] Bounty board has three postings — road patrol, strange sounds, missing shepherd
- [event] Met Corvin Half-Tooth at the Mended Flask — traded a coin for a rumor about the Wolds
- [ruling] Ruled that listening for sounds under the Undercroft is Wits (Awareness), Difficulty 12
- [thread] Strange scraping sounds beneath the Undercroft at night
- [world-advance] The Hollow King's omen advances to 1 — cold winds from the Wolds
- [world-advance] Winter Approaches clock ticks 1 — first frost on the walls
```

## Campaign Context (`world/campaign-context.md`)

Written once during `/glintlock:new-session`. Updated only if the campaign premise fundamentally changes.

```markdown
# Campaign Context

**Setting:** The Pale Reach — a dark frontier at the edge of civilization. Home base: Thornwall.
**Premise:** Five myths stir in the surrounding lands. Thornwall is the last waystation, undermanned and undersupplied, fighting to survive until spring.
**Tone:** Grim frontier survival, mythic horror. Resources are scarce, allies are few, and the land itself remembers.
**Language:** eng
**Starting Date:** Day 1 of the Harvest Moon.
```

## State Update Rules

1. **Read before you act.** Always Read the relevant entity file before narrating consequences that depend on its data.
2. **Update immediately.** After any state change (HP loss, item gained, NPC killed, quest progressed), Read the file, modify it, and Write it back. Don't batch updates. Don't defer.
3. **Session log is append-only.** Never edit past entries. Only append new ones.
4. **Quests move between sections.** Active → Completed when resolved. Developing → Active when the PC engages. New quests go to Active or Developing depending on player awareness.
5. **Dead NPCs stay.** Set `status: deceased` in frontmatter. Add a note about how they died. Don't delete the file.

## Related Skills
- **core-rules** — Character creation rules, stats (1-10), gear slots, countdown dice
- **dashboard-generation** — Reads entity file formats for visual display
