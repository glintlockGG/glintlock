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
3. Launch the `audiobook-producer` agent in the background with the chapter path
4. Tell the player the audiobook is being generated in the background and they'll be notified when it's ready
5. Continue the conversation — don't block
