---
name: youtube-to-deck
description: "Execute the local youtube-to-deck.ts script to automatically generate a slide deck from a YouTube video URL or ID using the Gemini API. Script downloads video, extracts transcript, processes via multimodal File API, and appends the new MDX slides to a specified deck presentation."
argument-hint: "<YOUTUBE_URL_OR_ID> [DECK_SLUG]"
---

> This workflow delegates to the Claude skill for a single source of truth.

**IMPORTANT INSTRUCTION:**
You MUST use your file-reading tools to read `.claude/skills/youtube-to-deck/SKILL.md` immediately. Once you have read it, you must rigidly follow all instructions, steps, and commands defined in that file as if they were written here.
