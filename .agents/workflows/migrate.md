---
name: migrate
description: "Create and run a Supabase SQL migration against the remote database. Uses the Supabase CLI to create a local migration file, write idempotent SQL schema changes, and push them to the linked remote project. Use when the user says \"migrate\", \"migration\", \"run migration\", or needs schema changes."
argument-hint: "<migration_name> <description of schema changes>"
---

> This workflow delegates to the Claude skill for a single source of truth.

**IMPORTANT INSTRUCTION:**
You MUST use your file-reading tools to read `.claude/skills/migrate/SKILL.md` immediately. Once you have read it, you must rigidly follow all instructions, steps, and commands defined in that file as if they were written here.
