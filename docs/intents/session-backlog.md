# Session backlog intent

## Problem

The user "thường hay add feature và feedback liên tục trong phiên" and wants n-mode to make sure "mọi việc không bị bỏ sót, nhất quán và user nắm được tiến độ dễ dàng hơn". Sticky mode only says to match each new turn to a playbook. Nothing tells n-mode to record a mid-run ask, to check it against the confirmed design, or to report what is still open. The todo list can be lost to compaction or a pickup, so an ask that lives only there or in the chat can be dropped.

## Outcome

- Patch `150-session-backlog` adds a **Session backlog** section after **Sticky mode** in `n-mode/SKILL.md`.
- Every mid-session ask becomes a numbered checkbox row in `<root>/.claude/worktrees/backlog.md` and a todo before any other step. Each new turn with an open row reads the backlog and the intent first.
- An ask inside the intent's **Outcome** folds in. One that contradicts the confirmed design amends the intent and restarts the affected step on a fresh delegate. One outside the **Outcome** is queued for its own Interview round and intent.
- A row is ticked only with evidence or a stated drop reason. While a row is open, every reply ends with the open rows and the ones closed that turn.
- `node scripts/build.mjs` passes, the check included.

## Surfaces

- Anyone in a sticky `/nstack:n-mode` session who adds asks mid-run. They can open the backlog file at any time.
- Pause safely and Session pickup, which point at and read the backlog.
- The maintainer running `sync.mjs`, who now carries one more patch.

## Constraints

- Upstream text stays untouched. The rule lives in `overlay/` only.
- The backlog never reaches a commit. The root checkout holds no feature work.

## Out of scope

- A hook or script that writes the backlog.
- A `Requests` section in the intent file. The intent changes only when an ask changes the design.
- Locking the backlog between concurrent sessions on one root checkout.

## Decisions

The user's:

- Record each ask in the todo list and in a backlog markdown file, and amend the intent only when needed.
- Fold an ask in when it fits the intent, else queue it.
- A correction to the confirmed design amends the intent and redoes the step.
- The backlog lives at `.claude/worktrees/backlog.md`.
- A row has three states: queued, in progress, and done.

Made for them:

- A row waiting on the user stays in progress and names the question. A dropped row is done with its reason in place of the evidence.

- Checkbox rows numbered `R<n>`, since the user asked whether Claude supports checkbox lists.
- Show the open rows and the rows closed that turn at the end of each reply, and every row only in the final reply, so long sessions stay short.
- Put the pickup and pause pointers in the new section rather than patching those playbooks, so the concern stays in one patch.
- Number the patch `150`, after every other patch.

## Open questions

- Two sessions sharing one root checkout write the same backlog. Each row names its branch, which keeps them apart until that proves not to be enough.
