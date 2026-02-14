# GM Notes Template

Use this template for `world/gm-notes.md`. This is the GM's persistent prep buffer — refreshed during `/glintlock:world-turn`, `/glintlock:resume`, and at narrative pauses during play.

```markdown
# GM Notes
*Last refreshed: {calendar date} — {real date}*

## Strong Starts (2-3)
### {Title}
{2-4 sentences: concrete, sensory, immediate, ends with decision point. Connects to an active thread.}

## Active Secrets (3-5)
### {Label}
- **Information:** {1-2 sentences — the actual secret}
- **Discovery paths:** {path 1} | {path 2} | {path 3}
- **Thread:** {quest/doom connection}
- **Planted:** {calendar date when created}

### Discovered
- **{Label}** — via {method}. {date}

## NPC Moves
### {Name}
- **Doing:** {current action} | **Wants:** {goal} | **Attitude:** {toward PC} | **Hook:** {ready dialogue or action}

## Potential Scenes (3-5)
### {Title}
- **Situation:** {what's happening}
- **Trigger:** {what brings PC here}
- **Complication:** {twist/cost}
- **Thread:** {connection}

## Encounter Setups (2-3)
### {Name}
- **Monsters:** {type, count, bestiary ref}
- **Environment:** {terrain, lighting, hazards}
- **Morale:** {break condition} | **Reward:** {loot}

## Treasure (2-3)
- **{Item}** — {description, value}. *Context:* {placement}

## Notes
{Pacing ideas, music cues, callbacks to earlier events, player signals to act on}
```

## Usage

- **Secrets migrate.** If the PC doesn't go where a secret was planned, deliver it through whatever they're doing now. Secrets are information, not locations.
- **Mark used elements.** When you deliver a secret, use a scene, or deploy an encounter, note it as used. Move discovered secrets to the Discovered section.
- **Refresh at narrative pauses.** When the PC rests, travels, or a scene ends — check if gm-notes need refreshing. Add new secrets based on recent events, update NPC moves, swap out used scenes.
- **World-turn rewrites.** During `/glintlock:world-turn`, the entire file is regenerated from current world state.
