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
- Worktrees are ignored through `.git/info/exclude`. A missing control skill is offered in the reply, not built.
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

- Whether `EnterWorktree` accepts a call that only a skill asks for. Its tool text names the user, CLAUDE.md and memory. The eval runs recorded the call instead of making it, so one real `/nstack:n-mode` run settles it.
