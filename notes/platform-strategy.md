# Glintlock Platform Strategy — Discussion Notes

*Braindump captured 2026-02-12. To be discussed in a separate Claude session.*

## The Question

Glintlock currently runs as a **Claude Code plugin**. It works well. But what's the best path to turn it into a standalone, polished product — and what's the right architecture for that?

## Three Possible Paths

### Path A: Port plugin to OpenCode, fork OpenWork as frontend

```
Glintlock Plugin (Claude Code)
        ↓ port to
OpenCode (open-source Claude Code alternative)
        ↓ fork
OpenWork (OpenCode's web frontend) → customize for Glintlock
```

**OpenCode** is an open-source CLI tool similar to Claude Code. It supports plugins/extensions and can talk to multiple LLM providers.

**OpenWork** is a web frontend for OpenCode (similar to how Claude CoWork is a web frontend for Claude Code).

**The idea:** Port the Glintlock plugin from Claude Code format to OpenCode format, then fork OpenWork and customize it into a dedicated Glintlock web app — purpose-built for solo TTRPG play instead of general-purpose coding.

**Pros:**
- Reuses existing battle-tested infrastructure (terminal, tool execution, MCP)
- OpenCode/OpenWork are open-source — full control over customization
- Frontend already handles streaming, tool calls, conversation management
- Faster time-to-market than building from scratch

**Cons:**
- Still inherits the "coding tool" DNA — may need heavy UI customization for a game experience
- Dependency on OpenCode's architecture decisions and update cycle
- Two layers of abstraction (your plugin → OpenCode → OpenWork)

### Path B: Build a custom agent with Anthropic Agent SDK (or open-source equivalent)

```
Custom Glintlock Agent (Agent SDK)
        ↓
Custom Frontend (React/Next.js)
```

**Anthropic Agent SDK** lets you build autonomous agents with tool use, multi-turn conversations, and custom system prompts — the same primitives Claude Code uses, but as a library you control entirely.

**Open-source equivalents** exist (e.g., the relationship between Claude Code and OpenCode — there are OSS agent SDKs that mirror what Anthropic's SDK provides).

**The idea:** Build Glintlock as a standalone agent application from the ground up. The agent handles game logic, state management, and tool orchestration. Then build a custom frontend specifically designed for the game experience.

**Pros:**
- Total control over architecture — no inheriting coding-tool assumptions
- Purpose-built UI: character sheets, maps, dice animations, audio controls, campaign management
- No abstraction layers — your agent talks directly to the LLM API
- Can optimize for the game experience (not a CLI with game features bolted on)
- Can ship as a standalone app (Electron, Tauri, or web)

**Cons:**
- More work upfront — you're building the agent runtime, tool execution, streaming, error handling
- Need to reimplement what Claude Code / OpenCode gives you for free (conversation management, tool approval, context window management)
- The Agent SDK is lower-level — more power but more responsibility

### Path C: Hybrid — Agent SDK backend, fork a frontend

```
Custom Glintlock Agent (Agent SDK)
        ↓
Forked OpenWork / CoWork frontend → customize for Glintlock
```

**The idea:** Build the agent with the SDK for full control, but fork an existing web frontend to save time on the UI layer. Customize the frontend for game-specific features while leveraging the existing conversation/streaming infrastructure.

## Key Decision Factors

| Factor | Path A (OpenCode + OpenWork) | Path B (Custom Agent + Custom Frontend) | Path C (Hybrid) |
|--------|-----|-----|-----|
| Time to v1 | Fastest | Slowest | Medium |
| UI customization | Limited by fork | Unlimited | Good (fork + customize) |
| Architecture control | Low | Full | Full backend, medium frontend |
| Maintenance burden | Low (upstream updates) | High (own everything) | Medium |
| Game-specific UX | Constrained | Purpose-built | Good |
| Dependency risk | OpenCode/OpenWork project health | Anthropic SDK stability | Mixed |

## What You're Really Asking

1. **Is the plugin format the right long-term home?** — Probably not for a polished product. Plugins are great for prototyping and personal use, but a standalone app gives you control over the full experience.

2. **Build on top of someone else's tool (OpenCode) or build your own agent?** — This is the core tradeoff: speed vs control.

3. **How much frontend work are you willing to do?** — Forking OpenWork saves months of streaming/conversation UI work. Building custom lets you design the perfect game interface.

## Recommended Discussion Points

When you pick this up in another session, consider exploring:

- **What does the ideal Glintlock UX look like?** If it's "a chat window with some game panels," forking a frontend works. If it's "an immersive game interface with maps, character sheets, dice, and audio controls as first-class citizens," you probably want custom.

- **Multi-provider support?** OpenCode supports multiple LLM providers. Agent SDK ties you to Anthropic (or you use an OSS equivalent for provider flexibility).

- **Distribution model?** Web app (SaaS), desktop app (Electron/Tauri), or CLI? This affects which path makes sense.

- **What does the Glintlock MCP server become?** In all paths, the MCP server (dice, oracle, TTS, SFX, music) likely stays as-is — it's already a clean, standalone service.

- **What are the open-source Agent SDK alternatives worth evaluating?** (e.g., LangGraph, CrewAI, or the OSS Claude Code equivalents)

---

## Dual-Instance Automated Testing

*Added 2026-02-12*

### The Idea

Run two Claude Code instances simultaneously:
1. **Instance A (GM):** Runs the Glintlock plugin normally — acts as Game Master
2. **Instance B (Player):** A second Claude Code instance with a "player agent" prompt — makes decisions, explores, fights, interacts with NPCs

Instance B reads from Instance A's output (via a shared terminal, pipe, or file-based communication channel) and responds as a player would. This creates a fully automated play loop.

### Why This Is Valuable

- **Rapid iteration:** Run 10 sessions overnight, review transcripts in the morning for bugs, pacing issues, rule misapplications
- **Regression testing:** After changing the agent prompt or skills, run a batch of automated sessions to verify nothing broke
- **Edge case discovery:** An AI player will try things a human might not — exposing gaps in the GM agent's handling
- **Stress testing:** Push the state management system through dozens of combats, level-ups, NPC interactions, quest completions
- **Audiobook pipeline testing:** Automated sessions generate session logs → chronicles → audiobooks without human intervention
- **Demo generation:** Produce compelling example sessions for marketing/documentation

### Implementation Sketch

```
Terminal 1:  claude --plugin-dir ./glintlock  (GM instance, interactive mode)
Terminal 2:  claude --system-prompt player.md  (Player instance, reads GM output, writes player input)
```

**Communication options:**
- **Named pipe / FIFO:** GM writes to stdout, player reads it, player writes responses that GM reads as stdin
- **File-based:** GM appends to `session-transcript.md`, player watches the file, appends its responses
- **WebSocket bridge:** Both instances connect to a lightweight relay server
- **tmux scripting:** Both in a tmux session, use `tmux send-keys` to relay between panes

**Player agent prompt needs:**
- A character personality (e.g., "cautious explorer," "reckless treasure hunter," "paranoid survivalist")
- Decision-making heuristics (explore vs. fight vs. flee vs. negotiate)
- Basic Shadowdark knowledge (what dice to expect, how to manage inventory)
- Instruction to type natural-language responses like a real player

### Considerations

- Player agent should have **varied personalities** across test runs to cover different playstyles
- Need a **session length limit** (e.g., 30 turns) to prevent infinite loops
- Should **save full transcripts** for human review
- Could score sessions on metrics: rules consistency, narrative quality, state file integrity, pacing
- This is essentially a **self-play evaluation framework** — similar to how game AI is tested
