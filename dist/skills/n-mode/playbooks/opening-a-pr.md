### Opening a PR

Invoked at the end of every other playbook.

Work from a git worktree off trunk, and keep unrelated work out of it. Rebase into small, landable commits. Commits and PR descriptions credit no AI agent, so add no `Co-Authored-By` trailer that names an agent and no "Generated with" or "Authored by" line. Before commit, run Claude Code's built-in `/simplify` over the diff, then remove what it leaves of narrating comments, unsupported guards, dead compatibility paths, and unrelated edits.

Title: `type(scope): subject`, naming a real symbol when one carries the change. Body: a one-minute briefing under 40 lines with these `##` headings in order, dropping empty ones: `## Why`, `## What changed`, `## Scope`, `## Tradeoffs` (only rejected alternatives a reviewer would otherwise ask about), `## Blast Radius`, `## Verification`. When the run has an intent at `<root>/.nstack/intents/<slug>.md`, the PR body is where it outlives the run, because the file never reaches a commit and the merge-back deletes it. `## Why` carries its **Problem**, `## Scope` its **Out of scope**, and `## Tradeoffs` the **Decisions** a reviewer would ask about.

Stack follow-ups by base branch. Open PRs ready, through the run's PR tool with `draft: false`. Without one, use `gh pr create` without `--draft`, or `origin pr create --status open` when Origin's CLI resolves the repository. Opening a PR does not start a babysit.
