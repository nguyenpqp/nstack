# Worktrees and run files

Read this before the first write under `<root>/.nstack/`, before you open a worktree, and before you merge one back. A delegate that works in the worktree its brief names never needs it, so it sits outside `SKILL.md`, which every delegate reads.

## nstack folder

The run's own files live in `<root>/.nstack/`, where `<root>` is the root checkout: `backlog.md`, `backlog-done.md`, `backlog-archive/YYYY-MM.md`, `backlog/R<n>.md`, `intents/<slug>.md`, `intents/<slug>-tickets.md`, and `orchestrate/<slug>/notes.md`. `<slug>` is the branch name with its Conventional Commits type stripped, and a coordinator that names no branch names the slug from the task. Every playbook uses these paths, including those that open no worktree. Before the first write there, write `<root>/.nstack/.gitignore` holding the one line `*` with the Write tool, unless `git -C <root> check-ignore -q .nstack/x` already passes. None of these files reaches a commit, so the repo gains no file per task and no intent goes stale on the integration branch. The PR body and the commit bodies keep what outlives the run. Delete an intent and its tickets file once nothing open still reads them: when its branch lands, or for a coordinator's shared intent, when its last unit lands. Keep them while a pickup could still resume the work. Outside a git repository, keep the paths and skip the ignore file.

## Opening a worktree

**Every playbook that writes files to the repo opens a worktree before its first edit.** Create it at `<root>/.claude/worktrees/<branch>` with `git worktree add`, and name the branch per Conventional Commits from the task. Every worktree then sits inside the root, so the chat that runs n-mode reaches all of them from there. Before the first worktree exists, write `<root>/.claude/worktrees/.gitignore` holding the one line `*` with the Write tool, unless `git -C <root> check-ignore -q .claude/worktrees/x` already passes. That file ignores the folder and itself, so no worktree reaches a commit and the root checkout gets no commit. It also keeps the run out of `.git/`, where Claude Code asks permission for every edit. The root checkout stays on the integration branch and never holds feature work.

**The chat that runs n-mode stays at the root.** It coordinates every row and worktree from one place, and from inside a worktree Claude Code would treat the root, the backlog included, as outside the session and ask before each write there. The rules for working by absolute path are in the **Worktree** section of `SKILL.md`.

**Who skips it.** Read-only playbooks, Babysit, Pause safely, Worktree cleanup, Prototype (its sketch lives in a scratch dir), Eval, and Shipping. Session pickup adopts the prior worktree instead of opening one. Coordinators that only write briefs (Orchestrate, Autopilot-full, Autopilot-stack, Multi-phase plan) skip it, and their workers carry `isolation: "worktree"`. Spec build is the exception. Its coordinator edits no code either, but it opens the spec branch worktree, because the spec branch and every landed ticket live there.

**Outside a git repository, skip this section.** If `git rev-parse --is-inside-work-tree` fails, edit in place and do not run `git init`. Run delegates that could write the same files one at a time.

## Merging back

Merge from the root. If this session is inside a worktree anyway, leave it with `ExitWorktree` and `action: "keep"` first. When the branch lands with no PR, amend its last commit in the worktree so the body carries the intent's **Problem**, **Decisions**, and **Out of scope**, because a fast-forward makes no merge commit. Confirm `git merge-base --is-ancestor <integration> <branch>` and an empty `git -C <root> status --porcelain`. Take the lock with `mkdir <root>/.claude/worktrees/merge.lock`, run `git -C <root> merge --ff-only <branch>`, then `rmdir` the lock. A refused fast-forward means another session moved the base, so rebase in your own worktree and retry. Never force. Set `git -C <root> config merge.ff only` once so the root enforces this itself. If the root command is still refused, work down this ladder and stop at the first rung that lands.

1. Run `git -C <root> config receive.denyCurrentBranch updateInstead` once, then `git -C <worktree> push . HEAD:<integration>`. Git refuses the push when the root is dirty or the update is not a fast-forward, which keeps the same guarantee.
2. Hand the operator the exact command with the reason in one sentence. They run it from the prompt with a leading `!`.

Never move the branch with `git update-ref` or a bare `git push` into the root. Both advance the ref without touching the root working tree, which leaves every merged file looking deleted there.

After the merge lands, remove the worktree with `git -C <root> worktree remove <path>`, delete the branch, and delete its intent files per the **nstack folder** section.
