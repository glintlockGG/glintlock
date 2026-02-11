---
description: "Generate an audiobook from a chronicle chapter"
allowed-tools:
  - "Read"
  - "Glob"
  - "Task"
---

Generate an audiobook from a chronicle chapter using the background audiobook-producer agent.

1. Glob `world/chronicles/chapter-*.md` to find available chapters
2. If multiple chapters exist, ask which one to generate (default: most recent)
3. Ask the player which languages to generate (default: campaign language from `world/campaign-context.md`, or `eng` if not set). Accept comma-separated ISO 639-3 codes (e.g. `eng,fra,jpn`). ElevenLabs v3 supports 70+ languages — same voices work across all of them.
4. Launch the `audiobook-producer` agent in the background with the chapter path and `languages: {codes}` in the prompt
5. Tell the player the audiobook is being generated in the background and they'll be notified when it's ready
6. Continue the conversation — don't block
