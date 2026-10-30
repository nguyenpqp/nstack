# Root coordinator intent

## Problem

The session backlog lets several rows run at once, each on its own worktree and delegate. The **Worktree** section still told the chat that runs n-mode to `EnterWorktree` the worktree it opened. From inside a worktree Claude Code treats the root as outside the session and asks before each write there, so every backlog write would prompt, and a chat inside one worktree cannot coordinate the others. Scenario runs of the backlog had every simulated main chat stay at the root on its own, against what the section said. The user wants "main chat luôn ở root, tôi muốn điều phối từ 1 chỗ thôi".

## Outcome

- Patch `170-root-coordinator` rewrites the **Worktree** section of `n-mode/SKILL.md`. The chat that runs n-mode stays at the root for the whole run. Nobody in the run calls `EnterWorktree`. This chat and its delegates edit by absolute path under the worktree, run git as `git -C <worktree>`, and run a command that needs the worktree as its working directory as `cd <worktree> && ...` in one Bash call. Each delegate brief names its worktree path and branch.
- **Merging back** starts at the root. A session that is inside a worktree anyway, because the user asked or a step slipped, leaves it with `ExitWorktree` first.
- The `/setup-nstack` rule line names this instead of `EnterWorktree`.
- `node scripts/build.mjs` passes, the check included.

## Surfaces

- Anyone running `/nstack:n-mode`.
- Users with an existing `~/.claude/rules/nstack-models.md`, whose old line still says to enter a worktree until they rerun `/nstack:setup-nstack`.

## Constraints

- Worktrees stay under `<root>/.claude/worktrees/`, inside the session's directory, so writes there need no prompt.

## Out of scope

- Coordinators whose workers carry `isolation: "worktree"`. Their workers keep the harness worktree.

## Decisions

The user's:

- The chat that runs n-mode always stays at the root, a run with one row included, so the user coordinates from one place.

Made for them:

- The rule lives in the **Worktree** section rather than the backlog reference, because it holds for a run with no backlog too.
- A delegate brief names the worktree path and branch, since a delegate no longer inherits a working directory inside the worktree.

## Open questions

- A Bash call that starts with `cd <worktree> &&` may raise a permission prompt in some permission modes. This is inferred, not observed. A real run that runs a test command in a worktree settles it, and `git -C` or a tool's own directory flag avoids it where one exists.
- `docs/intents/claude-code-workflow.md` recorded that `EnterWorktree` enters a path under `.claude/worktrees/` with no prompt. That stays true but is no longer used.
