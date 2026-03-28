---
name: done
description: Wrap up a coding session — update docs, lint, then commit. Use when the user says "done", "wrap up", or "finish".
argument-hint: "[optional commit message]"
---

Wrap up the current coding session.

## Timing & Stats

At the start of EACH phase, run `date +%s` to capture a timestamp. At the end of each phase, capture another timestamp and compute the elapsed time.

After all phases complete, output a summary table like this:

```
/done summary
───────────────────────────────────────
Phase                   Time     Count
───────────────────────────────────────
Architecture docs       12s      2 updated, 1 created
Lint fix                18s      3 errors fixed, 0 remaining
Commit                  3s       1 commit, 14 files staged
Report                  1s       session complete
───────────────────────────────────────
Total                   34s
```

Adjust the "Count" column to reflect what actually happened in each phase. Be specific with numbers.

## Determining Session Files

Multiple Claude Code sessions may run concurrently on the same branch, so git history (e.g., `HEAD~3`) is NOT a reliable way to determine which files this session changed.

**Use your own memory of the conversation.** You know every file you read, edited, created, or wrote during this session. Compile that list directly — it's the only reliable source.

To get the list:
1. Review the conversation history for all `Read`, `Edit`, `Write`, `Bash` tool calls that modified files
2. Compile the deduplicated list of file paths — these are your "session files"
3. For line counts, run `git diff --stat` on only uncommitted files, plus check any commits YOU made this session

Do NOT use `HEAD~N` or broad `git diff` ranges — other sessions may have committed in between.

## Productivity Summary

After the phase summary, generate a session productivity report.

Use your session file list to get modification timestamps:
```
stat -f "%m %N" <file1> <file2> ... 2>/dev/null | sort -n
```

Output:

```
Session productivity
───────────────────────────────────────
Session duration:     1h 23m (first change 2:15pm → last change 3:38pm)
User prompts:         8
Files modified:       14
Files created:        3
Lines changed:        +187 / -42
Areas touched:        src/app/workshop, src/app/page.tsx
───────────────────────────────────────
```

For line counts, run `wc -l` on diffs of only your session files. For session duration, use the earliest and latest modification timestamps from your session files.

To count user prompts: count the number of distinct user messages in the current conversation (excluding system messages and tool results).

## Steps

### Phase 1: Update Architecture Docs

1. **Gather session changes** — compile the list of files YOU touched this session from your conversation history (see "Determining Session Files" above). Then run:
   - `git diff --stat` to see uncommitted changes
   - `ls docs/architecture/` to see existing architecture docs (create the directory if it doesn't exist)

2. **Identify affected areas** — based on the changed files, determine which feature areas were modified (e.g., pages, layout, workshop content, styles).

3. **Read the changed code** — read the key files that were modified to understand the current state.

4. **Check existing docs** — for each affected area, check if a doc already exists in `docs/architecture/`:
   - If yes, read it and update it to reflect the new state
   - If no, **always create a new doc** following the pattern of existing ones — don't skip this even for small changes. If you touched files in an area that has no doc, create one.

5. **Write/update the docs** — each architecture doc should include:
   - **Overview**: What this feature/area does
   - **Key files**: File paths and their roles
   - **Data flow**: How data moves through the system (if applicable)
   - **Important patterns**: Conventions, gotchas, or design decisions

### Phase 2: Lint Fix

6. Run `pnpm lint` to find ESLint violations.
   - Fix lint errors **only in session files** (from your conversation history, NOT `git diff HEAD~N`)
   - Re-run `pnpm lint` to confirm fixes
   - Do NOT fix pre-existing errors in untouched files

### Phase 3: Commit

7. Stage all relevant changed files (including docs and lint fixes) and commit using conventional commits.
   - If $ARGUMENTS is provided, use it as the first line of the commit message
   - Otherwise, draft a summary of the session's changes as the first line
   - Append the session productivity summary to the commit body
   - Use a HEREDOC for the commit message, formatted like:
     ```
     feat: summary of changes

     Session summary:
     - Duration: 1h 23m
     - User prompts: 8
     - Files modified: 14, created: 3
     - Lines: +187 / -42
     - Lint: 3 errors fixed, 0 remaining in session files
     - Docs: 2 updated, 1 created
     - Areas: src/app/workshop, src/app/page.tsx

     Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
     ```

8. Run `git status` to confirm everything is clean.

### Phase 4: Report

9. Output the `/done summary` table and `Session productivity` block (see Timing & Stats above).

10. **ASCII art** — draw a simple ASCII art representation of the main page or UI that was built/changed this session. Include key elements like layout, sections, or content that reflect what was worked on. Keep it fun and recognizable.

11. **Goodbye message** — end with a dramatic, fun goodbye message wrapped in `***#$(*#$)` and `($#*)$#***` markers. Include 3-4 lines celebrating what was accomplished in the session, referencing specific technical wins or funny moments from the work. End with "done."

## Rules

- Focus on documenting the CURRENT state, not the history of changes
- Keep docs concise — aim for quick reference, not exhaustive documentation
- Don't document trivial changes (typo fixes, formatting)
- Match the style of existing docs in `docs/architecture/`
- Only fix lint errors in files you changed this session — don't go on a codebase-wide cleanup
- NEVER use `--no-verify`, `--amend`, or force push
- NEVER commit `.env`, secrets, or credential files
- Do NOT push unless the user explicitly asks
