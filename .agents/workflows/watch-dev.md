---
name: watch-dev
description: "Start the Next.js dev server and launch a background bash watcher to monitor logs for errors/warnings. Plugs into a cheap polling loop to detect issues, beeping and providing a terse, copyable bug summary when an error occurs. Use when the user says \"watch dev\", \"monitor dev\", or \"start dev and watch\"."
model: haiku
allowed-tools: Bash, Read, AskUserQuestion
---

> This workflow delegates to the Claude skill for a single source of truth.

**IMPORTANT INSTRUCTION:**
You MUST use your file-reading tools to read `.claude/skills/watch-dev/SKILL.md` immediately. Once you have read it, you must rigidly follow all instructions, steps, and commands defined in that file as if they were written here.
