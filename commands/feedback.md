---
description: "Signal your preferences to the GM"
allowed-tools:
  - "Read"
  - "Write"
---

The player wants to tell the GM about their preferences — what they enjoy, what they'd like more or less of, or how they want the game to feel.

**Flow:**

1. Parse the player's feedback text
2. Read `world/CLAUDE.md`
3. Categorize the feedback into the appropriate table:
   - **Play Style** — tone, pacing, likes, dislikes (e.g. "more exploration, less combat", "darker tone", "I like resource pressure")
   - **Narrative Patterns** — what works, what to avoid (e.g. "the NPC dialogue was great", "the dungeon felt too linear")
   - **Player Character** — personality, social behavior, combat preferences (e.g. "my character would never betray an ally", "I prefer ranged tactics")
4. Update the relevant table in `world/CLAUDE.md` — add new rows, modify existing ones if the preference has changed
5. Write back `world/CLAUDE.md`
6. Acknowledge briefly: "Noted. I'll lean into that." or similar. Don't over-explain — just confirm the GM heard them and will adapt.
