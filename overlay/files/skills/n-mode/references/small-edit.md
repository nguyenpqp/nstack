# Small edits

Read this before the chat that runs n-mode edits the repo itself. A delegate makes the edits its brief names and never needs it, so it sits outside `SKILL.md`.

## Which edit the chat makes

The chat edits the repo itself only when the diff would be shorter than the brief a delegate needs to make it, such as a typo, a value the user gave, or a fix whose exact lines are already known. Say in the reply that you made it yourself. Any other edit goes to a delegate, under any playbook or none, even one that never says to delegate.

A playbook line that says to delegate still leaves the chat this small edit. That covers Bug fix's "Delegate investigation and the fix" and Feature's step 4, whose delegation is "Mandatory" and which Laziness Protocol does not override.

## What it skips

Such an edit skips `/simplify`, `no-comments`, and `/code-review high`, whether it lands through **Merging back** or a PR, unless it touches the sensitive list in `SKILL.md`. That holds over the Non-negotiables in `SKILL.md` and over `opening-a-pr.md`'s "Before commit, run Claude Code's built-in `/simplify`".

It still gets a manual strip of narrating comments, unsupported guards, dead compatibility paths, and unrelated edits. It keeps its worktree and, on **Merging back**, its `--ff-only` merge.
