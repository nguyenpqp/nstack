# Claude Code workflow intent

## Problem

The user asked to "hoàn thiện bộ skill để có workflow hoàn thiện, hiệu quả cho claude code đồng thời update dễ dàng từ upstream". A review and a first eval round against a small fixture repo found five gaps.

- The `n-agent` files set `is_background`, a Cursor field that Claude Code ignores. The check did not read frontmatter, so it passed.
- The three effort tiers repeated the base description, 361 words in every session's agent list, nstack or not.
- The Interview treated a request that already states the change like an open one. A diagnosed one-line bug drew 6 questions, a rename drew 2, and both runs stopped where the baseline had already finished (169s and 145s against 33s and 27s). Two of the bug's questions asked about delivery and verification, which the playbooks decide.
- The worktree rule committed `.gitignore` on `main`, which the same section says holds no feature work.
- The verify trigger built a control skill inside an unrelated task. A one-flag change grew a `.claude/skills/verify-tasklist/` commit.

`diagnosing-bugs` was also the only routed skill Claude could start on its own, so "debug this" ran it outside the Bug fix playbook.

## Outcome

- `node scripts/build.mjs` passes, and `check.mjs` fails on any frontmatter field that the Claude Code skill or subagent docs do not list. It also runs `claude plugin validate` when the CLI is on PATH.
- Agents set `background: true`. One `n-agent` replaces the three effort tiers, and n-mode sets the Agent `effort` per job.
- A request that states the change asks only what is still open and would change the diff. When nothing is, the round is one confirm-or-correct message. Process is never a question.
- Worktrees are ignored through `.worktrees/.gitignore`, and the merge lock is `.worktrees/merge.lock`, so nothing commits on `main` and nothing writes under `.git/`. A missing control skill is offered in the reply, not built.
- `diagnosing-bugs` is explicit-only.

## Surfaces

- Anyone running `/nstack:n-mode`.
- The maintainer running `sync.mjs` and `check.mjs`.
- Patches `030`, `040`, `080`, `090`, `100`, `110`, `120`, a new `067`, `overlay/files/.../interview.md` and `spec-build.md`, `renames.json` `claudeCode`, `build.mjs`, `check.mjs`. `overlay/agents.json` is gone.

## Constraints

- `upstream/` untouched. One-to-one swaps in `claudeCode`, so most upstream edits need no patch repair.
- The Interview gate holds. The user still confirms a design before code.

## Out of scope

- A session hook for sticky mode, still out per `n-stack.md`.
- Trimming upstream text such as the 4,200-word `n-mode` SKILL.md each delegate reads.
- `typescript-best-practices` pairing `paths` with `disable-model-invocation`. The docs do not say how they combine.

## Decisions

The user's:

- Make the workflow complete and efficient on Claude Code while upstream updates stay easy.
- Fold the effort tiers into one `n-agent`. n-mode already asked for both the tier and the Agent `effort` param, and the dispatch label shows the effort.
- One commit per concern.

Made for them:

- `background: true` rather than dropping the field, since n-mode wants every delegate in the background.
- `diagnosing-bugs` goes explicit-only, matching every other routed pstack skill. `/nstack:diagnosing-bugs` still runs it.
- The confirm-or-correct round for a stated change, rather than no stop at all.
- The intent file stays the place for decisions on process.
- `icon` and `color` leave the `n-mode` frontmatter, because the Claude Code skill docs list neither. One `claudeCode` row brings them back.

## Open questions

- Whether a user approves the `EnterWorktree` prompt in an interactive run. The tool asks every time, even when allowlisted, because it moves the session's working directory. Approved (`--permission-mode bypassPermissions`), it entered `.worktrees/a` by `path`, left with `action: "keep"`, and entered `.worktrees/b` next. Both headless runs, where no one could approve, fell back to `git -C` with absolute paths and still kept the work in the worktree. A user who installed before this change gets the rule line only after rerunning `/setup-nstack`.
- Whether n-mode's wall time is worth it. The no-skill baseline finished a one-flag change in about 61s with no worktree, intent, delegate, or review. n-mode took about 230s doing all four. The cuts left are in upstream text each delegate reads, which is out of scope.

## Follow-up

- A sync to pstack `8b3326d` ran on top of these commits. Every patch applied unchanged, and the new `statechart` skill shipped without an overlay change.
- `EnterWorktree` guards itself to calls the user, CLAUDE.md, or memory asks for. The `/setup-nstack` rule now names the Worktree section as that instruction, and the section exits a worktree before it enters the next one.
- A third eval round on the autonomy case, after the tier merge, scored 6 of 6. Its code delegate was `subagent_type: "nstack:n-agent"` with `effort: "high"`, and no tier name appeared. Wall time rose to 537s from 426s on one run each, so time is still unsolved.
- Round 4, two runs per case. `interview.md` reads one axes row through `grep`, which cuts it from 3,180 to 1,748 words. Stepped-away work that one playbook covers stays out of figure-it-out. Autonomy scored 6 of 6 twice, at 265s and 428s (mean 346s, against 426s, 436s, and 537s before). Bug runs stopped at one confirm question each, at 195s and 166s, about level with 182s, because their time goes to reproducing and reading principle leaves.
- Two real headless runs (`claude -p --plugin-dir`, one feature with full autonomy, each on a fresh fixture repo).
  - Run 1: 117s, $1.89, success. Its writes to `.git/info/exclude` and `.git/merge.lock` were refused as sensitive files. Patch `030` now keeps both under `.worktrees/`.
  - Run 2, after that fix: about 230s, $1.84, success, no sensitive-file refusal. It wrote `.worktrees/.gitignore`, committed the intent then the feature in the worktree, delegated to `nstack:n-agent` at `effort: high`, fast-forwarded `main`, removed the worktree, and left 6 of 6 tests passing.
- Patch `085` defines crossing a function boundary as a change a caller sees, after an eval run sent a one-body edit to the architect.
