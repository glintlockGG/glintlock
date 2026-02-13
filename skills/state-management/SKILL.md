---
name: state-management
description: "Entity file templates and state management conventions for world files. This skill should be used when creating characters, NPCs, locations, items, or factions, updating entity files, writing to the session log or quest board, or formatting campaign memory."
---

# State Management — Markdown Entity Files

All game state lives in `world/` as human-readable markdown files with YAML frontmatter. The frontmatter contains structured data (stats, HP, inventory counts). The markdown body contains narrative descriptions, notes, and freeform content.

## File Conventions

- **Filenames:** lowercase-kebab-case (e.g. `kael.md`, `merchant-vela.md`, `obsidian-keep-level-1.md`)
- **Directories:** `world/characters/`, `world/npcs/`, `world/locations/`, `world/items/`, `world/factions/`
- **Global files:** `world/quests.md`, `world/session-log.md`, `world/campaign-context.md`
- **Create:** Use the Write tool with the appropriate template (see `references/templates.md`)
- **Read:** Use the Read tool to load a file before narrating or making decisions
- **Update:** Read the file first, modify the relevant sections, Write the full updated file back
- **Delete:** Mark as "deceased", "destroyed", or "disbanded" in the file's frontmatter (`status: deceased`). Don't delete files — history matters

## Entity Templates

Read `references/templates.md` for the full templates for all entity types:
- **Player Character** — stats, inventory, spells, notes
- **NPC** — description, combat stats (if relevant), voice settings
- **Location** — danger level, light, connections, contents
- **Item** — properties, owner, history
- **Faction** — members, goals, disposition
- **Campaign Memory** (`world/CLAUDE.md`) — compact markdown tables, updated each session

## Quest Board (`world/quests.md`)

```markdown
# Quest Board

## Active
- **The Missing Caravans** — Merchant Guild hired you to find out why supply caravans vanish on the Thornwood road. Reward: 50 gp. *Lead: goblin tracks at the keep entrance.*
- **The Brass Key** — Found a locked door on the east wall of the keep. Grukk carried a brass key.

## Developing
- **Vela's Debt** — Merchant Vela owes money to the thieves' guild. She hasn't asked for help yet, but it could become a problem.

## Completed
- **Rat Cellar** — Cleared rats from Vela's cellar. Earned a 10% discount.
```

## Session Log (`world/session-log.md`)

Append entries chronologically. Use tags in brackets for categorization.

```markdown
# Session Log

## Session 1 — 2026-02-11

- [event] Kael arrived in Millhaven and took the caravan investigation job from the Merchant Guild
- [discovery] Found goblin tracks at the Obsidian Keep entrance
- [event] Defeated 3 goblins in the first chamber — took 4 damage (8→4 HP)
- [ruling] Ruled that searching rubble is DC 12 INT, takes 1 exploration turn
- [thread] Locked door on east wall — need the brass key from Grukk
- [world-advance] The thieves' guild has noticed the PC poking around the keep
- [world-advance] A merchant caravan is 2 days overdue — tensions rising in town
```

## Campaign Context (`world/campaign-context.md`)

Written once during `/glintlock:new-session`. Updated only if the campaign premise fundamentally changes.

```markdown
# Campaign Context

**Setting:** The frontier town of Millhaven, on the edge of the Thornwood.
**Premise:** Caravans have been disappearing on the trade road. The Merchant Guild is desperate for answers. Something stirs in the ruins of the Obsidian Keep.
**Tone:** Grim frontier survival. Resources are scarce, allies are few, and the darkness is hungry.
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
- **core-rules** — Character creation rules, stat modifiers, gear slots
- **dashboard-generation** — Reads entity file formats for visual display
