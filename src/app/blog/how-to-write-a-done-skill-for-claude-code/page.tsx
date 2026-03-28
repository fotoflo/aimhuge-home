import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "How to Write a /done Skill for Claude Code — AimHuge",
  description:
    "A step-by-step guide to building a /done skill that wraps up your Claude Code sessions with architecture docs, lint fixes, commits, and productivity reports.",
  openGraph: {
    title: "How to Write a /done Skill for Claude Code — AimHuge",
    description:
      "A step-by-step guide to building a /done skill that wraps up your Claude Code sessions with architecture docs, lint fixes, commits, and productivity reports.",
    images: [{ url: "/images/blog/done-skill-cover.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Write a /done Skill for Claude Code — AimHuge",
    description:
      "A step-by-step guide to building a /done skill that wraps up your Claude Code sessions with architecture docs, lint fixes, commits, and productivity reports.",
    images: ["/images/blog/done-skill-cover.png"],
  },
};

const skillExample = `---
name: done
description: Wrap up a coding session — update docs, lint, then commit.
argument-hint: "[optional commit message]"
---

Wrap up the current coding session.

## Timing & Stats

At the start of EACH phase, run \`date +%s\` to capture a timestamp.
At the end of each phase, capture another timestamp and compute the
elapsed time.

After all phases complete, output a summary table like this:

\`\`\`
/done summary
───────────────────────────────────────
Phase                   Time     Count
───────────────────────────────────────
Architecture docs       12s      2 updated, 1 created
Lint fix                18s      3 errors fixed, 0 remaining
File sizes              5s       42 files, 1 over 500 lines
Tests + coverage        8s       12 passed, 0 failed, 42% lines
Commit                  3s       1 commit, 14 files staged
Report                  1s       session complete
───────────────────────────────────────
Total                   47s
\`\`\``;

const sessionFilesExample = `## Determining Session Files

Multiple Claude Code sessions may run concurrently on the same
branch, so git history (e.g., \`HEAD~3\`) is NOT a reliable way to
determine which files this session changed.

**Use your own memory of the conversation.** You know every file
you read, edited, created, or wrote during this session. Compile
that list directly — it's the only reliable source.

To get the list:
1. Review the conversation history for all Read, Edit, Write,
   Bash tool calls that modified files
2. Compile the deduplicated list of file paths
3. For line counts, run \`git diff --stat\` on only uncommitted
   files`;

const phaseExample = `### Phase 1: Update Architecture Docs

1. Gather session changes — compile the list of files YOU touched
2. Identify affected areas (pages, components, styles, etc.)
3. Read the changed code to understand the current state
4. Check existing docs in \`docs/architecture/\`
5. Write/update docs covering: Overview, Key files, Data flow,
   Important patterns

### Phase 2: Lint Fix

Run your linter and fix errors ONLY in session files.
Do NOT fix pre-existing errors in untouched files.

### Phase 3: File Sizes

Scan all source files and build a distribution table by
line-count bucket and file type. Compare to previous snapshot.

### Phase 4: Tests + Coverage

Run tests if a runner is configured. Generate a short coverage
summary. Skip gracefully if no test runner exists.

### Phase 5: Commit

Stage all changed files and commit using conventional commits.
Include a session productivity summary in the commit body.

### Phase 6: Report

Output timing table, productivity stats, ASCII art of what was
built, and a dramatic goodbye message.`;

const fileSizeExample = `File sizes by type
──────────────────────────────────────────────────────────
Lines           .tsx   .ts   .css   .md   .json   Total
──────────────────────────────────────────────────────────
≤ 50              3     1      0     4      2      10
51–150            5     0      1     2      1       9
151–300           4     1      0     1      0       6
301–500           2     0      0     0      0       2
501–1000          1     0      1     0      0       2
1001–2000         0     0      0     0      0       0
2000+             0     0      0     0      0       0
──────────────────────────────────────────────────────────
Total            15     2      2     7      3      29
Largest: page.tsx (491 lines)`;

const coverageExample = `Test coverage
──────────────────────────────────────
Stmts: 45%  Branch: 30%  Funcs: 38%  Lines: 42%
Tests: 12 passed, 0 failed
──────────────────────────────────────`;

const rulesExample = `## Rules

- Only fix lint errors in files you changed this session
- NEVER use --no-verify, --amend, or force push
- NEVER commit .env, secrets, or credential files
- Do NOT push unless the user explicitly asks`;

const commitExample = `feat: add workshop scheduling page

Session summary:
- Duration: 1h 23m
- User prompts: 8
- Files modified: 14, created: 3
- Lines: +187 / -42
- Lint: 3 errors fixed, 0 remaining in session files
- File sizes: 29 files, largest 491 lines
- Tests: 12 passed, 0 failed
- Coverage: Stmts 45% | Lines 42%
- Docs: 2 updated, 1 created
- Areas: src/app/workshop, src/app/page.tsx

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>`;

export default function BlogPostDoneSkill() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-16">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-accent uppercase tracking-wider mb-4">
            Blog
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            How to Write a <code className="font-mono text-accent">/done</code>{" "}
            Skill for Claude Code
          </h1>
          <p className="text-muted leading-relaxed text-lg mb-4">
            Every coding session with Claude Code ends the same way: you&apos;ve
            built something, files are scattered across your working tree, and
            you need to wrap up cleanly. A{" "}
            <code className="font-mono text-accent">/done</code> skill
            automates that entire process — updating docs, fixing lint, committing
            with a meaningful message, and generating a productivity report.
          </p>
          <p className="text-sm text-muted mb-8">
            March 2026 &middot; Alex Miller
          </p>
        </div>
        <Image
          src="/images/blog/done-skill-cover.png"
          alt="Terminal showing /done skill summary output with phase timing"
          width={1200}
          height={630}
          className="rounded-xl border border-card-border w-full max-w-3xl"
          priority
        />
      </section>

      {/* What is a skill */}
      <section className="bg-card-bg border-y border-card-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-6">
              What Are Claude Code Skills?
            </h2>
            <div className="space-y-4 text-muted leading-relaxed">
              <p>
                Skills are markdown files that live in your project at{" "}
                <code className="font-mono text-sm text-foreground bg-surface px-2 py-0.5 rounded">
                  .claude/skills/&lt;name&gt;/SKILL.md
                </code>
                . When you type{" "}
                <code className="font-mono text-sm text-foreground bg-surface px-2 py-0.5 rounded">
                  /&lt;name&gt;
                </code>{" "}
                in a Claude Code session, the skill&apos;s content gets injected
                as a prompt. Think of them as reusable, project-specific
                instructions that Claude follows step by step.
              </p>
              <p>
                Skills can accept arguments, reference other skills, and use any
                tool Claude Code has access to — reading files, running shell
                commands, editing code, and more. They&apos;re checked into your
                repo so every team member gets the same workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why a done skill */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">Why Build a /done Skill?</h2>
          <div className="space-y-4 text-muted leading-relaxed">
            <p>
              Without a structured wrap-up process, sessions tend to end with
              uncommitted changes, missing docs, and lint warnings that pile up.
              A <code className="font-mono text-accent">/done</code> skill
              solves this by enforcing a consistent end-of-session checklist:
            </p>
          </div>
          <Image
            src="/images/blog/done-skill-before-after.png"
            alt="Before and after comparison: messy git status vs clean /done output"
            width={1200}
            height={630}
            className="rounded-xl border border-card-border w-full mt-8 mb-4"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {[
              {
                title: "Architecture docs stay current",
                desc: "Every session updates the relevant docs in docs/architecture/, so the next person (or Claude session) has context.",
              },
              {
                title: "Lint stays clean",
                desc: "Errors get fixed before they compound. Only session files are touched — no surprise diffs in unrelated code.",
              },
              {
                title: "Commits are meaningful",
                desc: "Conventional commits with productivity stats in the body. You can see duration, files changed, and areas touched at a glance.",
              },
              {
                title: "File sizes stay under control",
                desc: "A per-session file size report shows how many files are in each line-count bucket, broken down by type. Spot bloated files before they become a problem.",
              },
              {
                title: "Test coverage is tracked",
                desc: "If you have a test runner, coverage stats are included in every commit. If not, the skill notes it and moves on — no broken builds.",
              },
              {
                title: "You get a productivity report",
                desc: "Session duration, prompt count, lines changed — all computed automatically so you can track how you work.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-card-border p-6"
              >
                <h3 className="font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Anatomy */}
      <section className="bg-card-bg border-y border-card-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-6">
              Anatomy of a /done Skill
            </h2>
            <div className="space-y-4 text-muted leading-relaxed">
              <p>
                The skill file lives at{" "}
                <code className="font-mono text-sm text-foreground bg-surface px-2 py-0.5 rounded">
                  .claude/skills/done/SKILL.md
                </code>
                . It starts with YAML frontmatter for metadata, then contains
                the full instructions in markdown. Here&apos;s the structure:
              </p>
            </div>

            <Image
              src="/images/blog/done-skill-pipeline.png"
              alt="Six-phase pipeline: Docs, Lint, File Sizes, Tests, Commit, Report"
              width={1200}
              height={630}
              className="rounded-xl border border-card-border w-full mt-8 mb-4"
            />

            <div className="mt-8 space-y-8">
              {/* Frontmatter + timing */}
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  1. Frontmatter &amp; Timing
                </h3>
                <p className="text-muted text-sm mb-4">
                  The frontmatter tells Claude Code when to suggest this skill
                  and what arguments it accepts. The timing section ensures every
                  phase is benchmarked.
                </p>
                <pre className="bg-surface border border-card-border rounded-xl p-6 overflow-x-auto text-sm font-mono text-foreground">
                  {skillExample}
                </pre>
              </div>

              {/* Session files */}
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  2. Session File Detection
                </h3>
                <p className="text-muted text-sm mb-4">
                  This is the most important design decision. You can&apos;t
                  rely on{" "}
                  <code className="font-mono text-foreground bg-surface px-1.5 py-0.5 rounded">
                    git diff HEAD~N
                  </code>{" "}
                  because multiple Claude Code sessions might be running on the
                  same branch. Instead, the skill tells Claude to use its own
                  conversation memory.
                </p>
                <pre className="bg-surface border border-card-border rounded-xl p-6 overflow-x-auto text-sm font-mono text-foreground">
                  {sessionFilesExample}
                </pre>
              </div>

              {/* Phases */}
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  3. The Phases
                </h3>
                <p className="text-muted text-sm mb-4">
                  Break the wrap-up into discrete phases. Each project will have
                  different needs — a project with tests might include a testing
                  phase, while a static site might skip it. Here&apos;s a
                  6-phase setup that covers most projects:
                </p>
                <pre className="bg-surface border border-card-border rounded-xl p-6 overflow-x-auto text-sm font-mono text-foreground">
                  {phaseExample}
                </pre>
              </div>

              {/* Rules */}
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  4. Safety Rules
                </h3>
                <p className="text-muted text-sm mb-4">
                  Guardrails prevent the skill from doing anything destructive.
                  These are non-negotiable.
                </p>
                <pre className="bg-surface border border-card-border rounded-xl p-6 overflow-x-auto text-sm font-mono text-foreground">
                  {rulesExample}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* In Action — screenshots */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">
            What It Looks Like in Action
          </h2>
          <p className="text-muted leading-relaxed mb-8">
            Here&apos;s real output from running{" "}
            <code className="font-mono text-accent">/done</code> at the end of
            a session where we built this very blog post:
          </p>

          <div className="space-y-8">
            <div>
              <p className="text-sm font-medium text-foreground mb-3">
                The summary table and productivity report
              </p>
              <Image
                src="/images/blog/done-summary-output.png"
                alt="Claude Code /done skill output showing phase timing table and session productivity report"
                width={800}
                height={400}
                className="rounded-xl border border-card-border w-full"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-3">
                ASCII art and the dramatic goodbye
              </p>
              <Image
                src="/images/blog/done-ascii-art.png"
                alt="Claude Code /done skill output showing ASCII art of the blog page and a goodbye message"
                width={800}
                height={600}
                className="rounded-xl border border-card-border w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* File sizes & coverage */}
      <section className="bg-card-bg border-y border-card-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-6">
              Tracking File Sizes &amp; Test Coverage
            </h2>
            <div className="space-y-4 text-muted leading-relaxed">
              <p>
                Two optional phases that pay dividends over time. The file size
                report gives you a birds-eye view of your codebase health —
                how many files are small and focused vs. bloated and overdue for
                a refactor. The test coverage report keeps you honest.
              </p>
            </div>

            <div className="mt-8 space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  File Size Distribution
                </h3>
                <p className="text-muted text-sm mb-4">
                  The skill scans all source files, groups them by line count
                  and file type, and outputs a table. It also saves a snapshot
                  to Claude Code&apos;s memory so the next session can show a
                  trend comparison — are your files getting smaller or bigger?
                </p>
                <pre className="bg-surface border border-card-border rounded-xl p-6 overflow-x-auto text-sm font-mono text-foreground">
                  {fileSizeExample}
                </pre>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">
                  Test Coverage Summary
                </h3>
                <p className="text-muted text-sm mb-4">
                  If your project has a test runner configured, the skill runs
                  your test suite and generates a coverage summary. If not, it
                  gracefully notes &quot;no test runner configured&quot; and
                  moves on — no broken builds, no skipped commits.
                </p>
                <pre className="bg-surface border border-card-border rounded-xl p-6 overflow-x-auto text-sm font-mono text-foreground">
                  {coverageExample}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customizing for your project */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">
            Customizing for Your Project
          </h2>
          <div className="space-y-4 text-muted leading-relaxed">
            <p>
              The beauty of a <code className="font-mono text-accent">/done</code>{" "}
              skill is that it adapts to your stack. Here are the knobs you
              should tune:
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="rounded-xl border border-card-border p-6">
              <h3 className="font-semibold text-foreground mb-2">
                Add or remove phases
              </h3>
              <p className="text-sm text-muted">
                A React Native app might add a &quot;Write Tests&quot; phase
                that extracts pure logic from components into{" "}
                <code className="font-mono text-foreground bg-surface px-1.5 py-0.5 rounded">
                  utils/
                </code>{" "}
                and writes unit tests. A static site might skip testing
                entirely. A monorepo might add a &quot;Type Check&quot; phase
                with{" "}
                <code className="font-mono text-foreground bg-surface px-1.5 py-0.5 rounded">
                  tsc --noEmit
                </code>
                .
              </p>
            </div>

            <div className="rounded-xl border border-card-border p-6">
              <h3 className="font-semibold text-foreground mb-2">
                Add coverage and file size tracking
              </h3>
              <p className="text-sm text-muted">
                For projects with tests, add phases that run coverage reports
                and compare against previous sessions. You can save snapshots
                to Claude Code&apos;s memory directory and show trend lines
                over time — watch your coverage climb session by session.
              </p>
            </div>

            <div className="rounded-xl border border-card-border p-6">
              <h3 className="font-semibold text-foreground mb-2">
                Compose with other skills
              </h3>
              <p className="text-sm text-muted">
                Instead of inlining lint logic, create a separate{" "}
                <code className="font-mono text-foreground bg-surface px-1.5 py-0.5 rounded">
                  /lint-fix
                </code>{" "}
                skill and call it from{" "}
                <code className="font-mono text-foreground bg-surface px-1.5 py-0.5 rounded">
                  /done
                </code>
                . Same for{" "}
                <code className="font-mono text-foreground bg-surface px-1.5 py-0.5 rounded">
                  /rename
                </code>{" "}
                (to name the session) or{" "}
                <code className="font-mono text-foreground bg-surface px-1.5 py-0.5 rounded">
                  /simplify
                </code>{" "}
                (to review for code quality before committing).
              </p>
            </div>

            <div className="rounded-xl border border-card-border p-6">
              <h3 className="font-semibold text-foreground mb-2">
                Tune the commit format
              </h3>
              <p className="text-sm text-muted">
                The commit body is where the session summary lives. Customize
                what metrics matter to your team. Here&apos;s what ours looks
                like:
              </p>
              <pre className="bg-surface border border-card-border rounded-lg p-4 mt-3 overflow-x-auto text-xs font-mono text-foreground">
                {commitExample}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Getting started */}
      <section className="bg-card-bg border-y border-card-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-6">Getting Started</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Create the skill file
                  </h3>
                  <p className="text-sm text-muted">
                    Make a directory at{" "}
                    <code className="font-mono text-foreground bg-surface px-1.5 py-0.5 rounded">
                      .claude/skills/done/
                    </code>{" "}
                    and add a{" "}
                    <code className="font-mono text-foreground bg-surface px-1.5 py-0.5 rounded">
                      SKILL.md
                    </code>{" "}
                    file with the frontmatter, phases, and rules shown above.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Adapt the phases to your stack
                  </h3>
                  <p className="text-sm text-muted">
                    Add test phases if you have a test runner. Remove
                    architecture docs if you don&apos;t want them. The phases
                    are just markdown sections — add or remove as needed.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Commit it to your repo
                  </h3>
                  <p className="text-sm text-muted">
                    Check the skill into version control so every team member
                    and every Claude Code session gets the same workflow.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold">
                  4
                </span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Type /done at the end of your session
                  </h3>
                  <p className="text-sm text-muted">
                    That&apos;s it. Claude handles the rest — docs, lint,
                    commit, and a productivity report with ASCII art.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Want help setting up Claude Code for your team?
        </h2>
        <p className="text-muted mb-8 max-w-xl mx-auto">
          I run AI workshops that cover Claude Code skills, workflows, and
          getting the most out of AI-assisted development.
        </p>
        <a
          href="https://calendly.com/fotoflo/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-accent px-8 py-3 font-medium text-white hover:bg-accent-hover transition-colors inline-block"
        >
          Book a 30-Minute Call
        </a>
      </section>
    </>
  );
}
