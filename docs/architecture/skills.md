# Claude Code Skills & Configuration

## Overview

The `.claude/` directory contains reusable Claude Code skills, hooks, statusline configuration, and persistent data. Skills use standalone shell scripts for each phase rather than inline bash commands, making them easier to test and maintain independently.

## Key Files

| File | Purpose |
|------|---------|
| `.claude/skills/done/SKILL.md` | Session wrap-up skill — orchestrates phases via shell scripts |
| `.claude/skills/done/gather-context.sh` | Phase 0: collects git diff stats, lists existing docs and uncommitted files |
| `.claude/skills/done/lint.sh` | Phase 2: runs `pnpm lint` and reports exit code |
| `.claude/skills/done/file-sizes.sh` | Phase 3: scans source files, builds size distribution by bucket |
| `.claude/skills/done/tests.sh` | Phase 4: runs `pnpm test` and reports exit code |
| `.claude/skills/done/session-stats.sh` | Productivity: computes session duration, file counts, and line changes from file list |
| `.claude/skills/done/commit.sh` | Phase 5: stages listed files and commits with a given message |
| `.claude/skills/watch-dev/` | Dev server watcher skill |
| `.claude/skills/migrate/SKILL.md` | Supabase migration runner — creates timestamped SQL, pushes to remote |
| `.claude/settings.json` | Global settings: statusline, hooks, plugins |
| `.claude/settings.local.json` | Project-level permissions — includes per-script `Bash()` allow rules |
| `.claude/statusline-command.sh` | Statusline script — shows task label, git branch, context % |
| `.claude/stop-hook-label.sh` | Stop hook — extracts task label from last message for statusline |
| `.claude/data/file-sizes.md` | Persistent file-size snapshot (project-level, committed to repo) |

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
- The `/migrate` skill creates a timestamped migration file via `supabase migration new`, writes SQL, and pushes with `supabase db push`

### `/done` Skill

The `/done` skill wraps up a coding session in 6 phases: Architecture Docs, Lint Fix, File Sizes, Tests + Coverage, Commit, Report. Each operational phase delegates to a standalone shell script in `.claude/skills/done/`.

**Data flow:**

1. `gather-context.sh` runs first to collect git state (diff stats, uncommitted files, existing docs)
2. SKILL.md instructs Claude to compile session files from conversation memory (not git history) to handle concurrent sessions
3. Phases 1-4 launch as parallel subagents, each calling its respective `.sh` script
4. `session-stats.sh <file1> <file2> ...` computes productivity metrics (duration from file mtimes, line changes from `git diff`)
5. `commit.sh "message" file1 file2 ...` stages and commits after all agents complete
6. File-size snapshots are saved to `.claude/data/file-sizes.md` (project-level, version-controlled) — previously stored in `~/.claude/` (user-level, not shared)

**Important patterns:**

- **Extracted scripts over inline commands** — each phase's bash logic lives in its own `.sh` file, not embedded in SKILL.md. This makes scripts independently runnable and testable.
- **Per-script permissions** — `settings.local.json` includes explicit `Bash(.claude/skills/done/<script>.sh*)` allow rules for each script, rather than a blanket bash permission.
- **Project-level data** — persistent data (like file-size snapshots) lives in `.claude/data/` within the repo, so it is committed and shared across machines. This replaced the earlier pattern of writing to `~/.claude/` which was user-local and not version-controlled.
- **Session file detection** uses conversation memory, not `git diff HEAD~N`, to handle concurrent sessions on the same branch.
- **Parallel agents** — Phases 1-4 (docs, lint, file sizes, tests) run concurrently as subagents; Phase 5 (commit) runs sequentially after all complete.
- **Safety rules**: no `--no-verify`, no force push, no secrets, no push without explicit request.
- Commits follow conventional commit format with session productivity stats in the body.
