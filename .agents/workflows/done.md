---
name: done
description: "Wrap up a coding session — generates a productivity summary, updates architecture and bug-fix docs, lints session files, checks file size changes, runs tests, and creates a conventional commit with the session stats. Use when the user says \"done\", \"wrap up\", or \"finish\"."
argument-hint: "[optional commit message]"
---

> This workflow delegates to the Claude skill for a single source of truth.

**IMPORTANT INSTRUCTION:**
You MUST use your file-reading tools to read `.claude/skills/done/SKILL.md` immediately. Once you have read it, you must rigidly follow all instructions, steps, and commands defined in that file as if they were written here.
