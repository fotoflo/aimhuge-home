# Claude Code Skills

## Overview

The `.claude/skills/` directory contains reusable Claude Code skills — markdown-based prompts that Claude follows step by step when invoked with `/<name>` in a session.

## Key Files

| File | Purpose |
|------|---------|
| `.claude/skills/done/SKILL.md` | Session wrap-up skill — updates docs, runs lint, commits, and reports |
| `.claude/settings.local.json` | Project-level permissions for Claude Code tools and MCP servers |

## Important Patterns

- Skills live at `.claude/skills/<name>/SKILL.md` with YAML frontmatter (`name`, `description`, `argument-hint`)
- The `/done` skill runs 4 phases: Architecture Docs, Lint Fix, Commit, Report
- Session file detection uses conversation memory, not `git diff HEAD~N`, to handle concurrent sessions
- Commits follow conventional commit format with session productivity stats in the body
- Safety rules: no `--no-verify`, no force push, no secrets, no push without explicit request
