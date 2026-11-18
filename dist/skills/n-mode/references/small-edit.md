# Small edits

Read this before the chat that runs n-mode edits the repo itself. A delegate never needs it.

## Which edit the chat makes

A small edit is one such as a typo, a value the user gave, or a fix whose exact lines are already known. Say in the reply that you made it yourself. Bug fix's "Delegate investigation and the fix" and Feature's mandatory delegation in step 4 still leave the chat this edit.

## What it skips

Such an edit skips `/simplify`, `no-comments`, and `/code-review high`, whether it lands through **Merging back** or a PR, unless it touches the sensitive list in `SKILL.md`. That covers the `/simplify` line in `opening-a-pr.md` too.

It still gets the manual strip that the **Before commit** Non-negotiable runs after `/simplify`. It keeps its worktree and, on **Merging back**, its `--ff-only` merge.
