# nstack folder intent

## Problem

A run wrote its backlog under `<root>/.claude/worktrees/` and committed its intent to `docs/intents/<slug>.md` in the target repo. The user wants "các file intents và backlog chứa hết vào thư mục `.nstack`", with a gitignore file inside that folder. A committed intent also grows the repo by one file per task and goes stale once later changes move the code.

## Outcome

- Patch `190-nstack-dir` adds an **nstack folder** section before **Worktree** in `n-mode/SKILL.md`, so a playbook that skips the worktree still reads it. The run's own files live in `<root>/.nstack/`: `backlog.md`, `backlog-done.md`, `backlog/R<n>.md`, `intents/<slug>.md`, and `intents/<slug>-tickets.md`. Before the first write there, the chat writes `<root>/.nstack/.gitignore` holding `*`, unless the folder is already ignored. A coordinator that names no branch names the slug from the task.
- No intent or tickets file reaches a commit. The order before step 1 is the Interview round, then the intent file, then the worktree. The branch is named before the intent, since the slug comes from it.
- **Opening a PR** carries the intent's **Problem**, **Decisions**, and **Out of scope** into the PR body. A merge-back with no PR first amends the branch's last commit to carry them, because a fast-forward makes no merge commit.
- An intent and its tickets file are deleted once nothing open reads them: when the branch lands, or for a coordinator's shared intent, when its last unit lands. **Merging back** and **Shipping** point at that rule. **Worktree cleanup** deletes them for a merged branch it prunes, which catches a PR merged outside Shipping.
- `node scripts/build.mjs` passes, the check included.

## Surfaces

- Anyone running `/nstack:n-mode`.
- Delegates and reviewers, which now read the intent by its absolute path at the root.

## Constraints

- `<root>/.nstack/` sits inside the session's directory, so writes there need no prompt.
- The intent stays readable for a pickup until the branch merges.

## Out of scope

- The `docs/intents/` folder of this repo. Each file there explains why a patch exists, and maintainers read it at every upstream sync.
- Moving an existing project's `docs/intents/` or `.claude/worktrees/backlog.md`.

## Decisions

The user's:

- The intents and the backlog live in `<root>/.nstack/`, which holds its own gitignore file. The backlog sits at its top level, and the intents go in `intents/`.
- The intent is no longer committed.
- `backlog-done.md`, `backlog/R<n>.md`, and the tickets file move to `.nstack/` too.

Made for them, confirmed by the user:

- Delete the intent at merge rather than keep it, because after the merge it goes stale and the PR body and commits keep what outlives the run.
- A dropped row or an abandoned run keeps its intent, since a pickup still reads it.

## Open questions

- The PR reviewer and CI no longer see the full intent, only what the PR body carries. A review that misses a design decision settles whether the body needs more of it.
- Two branches whose slugs match after the type is stripped write the same intent file. Nothing guards this yet.
- A pickup from another clone or machine finds no intent.
- The intent of a dropped row or an abandoned run stays until the user deletes it, since Worktree cleanup deletes only those of merged branches.
