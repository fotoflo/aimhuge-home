---
name: slide
description: "Create or update a slide in the Priyoshop exec deck via the local REST API. Manages fetching slide content, writing correctly structured MDX with Tailwind styling following strict presentation rules, and upserting the updated slide data via API. Use when the user says \"slide\", \"update slide\", or describes slide content changes."
argument-hint: "<slide_order or title> <description of changes>"
---

> This workflow delegates to the Claude skill for a single source of truth.

**IMPORTANT INSTRUCTION:**
You MUST use your file-reading tools to read `.claude/skills/slide/SKILL.md` immediately. Once you have read it, you must rigidly follow all instructions, steps, and commands defined in that file as if they were written here.
