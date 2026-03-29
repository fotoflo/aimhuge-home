# Claude Code Skills & Configuration

## Overview

The `.claude/` directory contains reusable Claude Code skills, hooks, and statusline configuration.

## Key Files

| File | Purpose |
|------|---------|
| `.claude/skills/done/SKILL.md` | Session wrap-up skill — updates docs, runs lint, commits, and reports |
| `.claude/skills/watch-dev/` | Dev server watcher skill |
| `.claude/skills/migrate/SKILL.md` | Supabase migration runner — creates timestamped SQL, pushes to remote |
| `.claude/settings.json` | Global settings: statusline, hooks, plugins |
| `.claude/settings.local.json` | Project-level permissions for Claude Code tools and MCP servers |
| `.claude/statusline-command.sh` | Statusline script — shows task label, git branch, context % |
| `.claude/stop-hook-label.sh` | Stop hook — extracts task label from last message for statusline |

## Statusline

The statusline displays: `task label | branch | Model [style]`

- Task label is extracted from the last assistant message by the Stop hook
- Written to `/tmp/claude-task-label.txt` and read by the statusline script
- Model shows short name only (e.g. "Opus", "Sonnet") — version numbers stripped
- Output style (e.g. "Extended Thinking") shown in brackets only when non-default

## Hooks

- **Stop hook**: Fires after each Claude response; runs `stop-hook-label.sh` async to update the task label file without blocking

## Skills

- Skills live at `.claude/skills/<name>/SKILL.md` with YAML frontmatter (`name`, `description`, `argument-hint`)
- The `/done` skill runs 6 phases: Architecture Docs, Lint Fix, File Sizes, Tests + Coverage, Commit, Report
- The `/migrate` skill creates a timestamped migration file via `supabase migration new`, writes SQL, and pushes with `supabase db push`
- Session file detection uses conversation memory, not `git diff HEAD~N`, to handle concurrent sessions
- Commits follow conventional commit format with session productivity stats in the body
- Safety rules: no `--no-verify`, no force push, no secrets, no push without explicit request
