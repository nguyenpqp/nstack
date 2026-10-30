# Session backlog intent

## Problem

The user "thường hay add feature và feedback liên tục trong phiên" and wants n-mode to make sure "mọi việc không bị bỏ sót, nhất quán và user nắm được tiến độ dễ dàng hơn". Sticky mode only says to match each new turn to a playbook. Nothing tells n-mode to record a mid-run ask, to check it against the confirmed design, or to report what is still open. A new session that picks up the work starts with no todo list, so an ask that lives only there or in the chat can be dropped.

## Outcome

- Patch `150-session-backlog` adds a short **Session backlog** section after **Sticky mode** in `n-mode/SKILL.md`. The rules live in `references/session-backlog.md`, which only the chat that runs n-mode reads, so delegates do not pay for them.
- Every message the user types after the run's opening request that asks for a change or gives feedback becomes a numbered checkbox row in `<root>/.claude/worktrees/backlog.md` before any other step, and a todo once confirmed. The opening request goes through Interview. Each new turn with an open row reads the backlog and the row's intent, when it has one, first.
- Session pickup reads the backlog as open work, and the Pause safely resume note points at it. The **Session backlog** section says so, so a pickup with no new message still finds it.
- An ask inside the intent's **Outcome** folds in. One that contradicts the confirmed design amends the intent and restarts the affected step on a fresh delegate. One outside the **Outcome** is queued for its own Interview round and intent.
- Each ask is written as a draft row at once and becomes a task only after the user confirms it. Before that, n-mode asks a quick round on what is unclear, names the issues the ask sets off, and restates the row concretely.
- A row is ticked only with evidence or a stated drop reason. A reply ends with the title lines of the rows whose state changed that turn, and lists every title line when the user asks for progress and at the end of the run. The full rows stay in the file.
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
- Each row states the work itself, not a one-line restatement of the ask.
- A complex ask points at a file instead of growing the row.
- On feedback, interview quickly when it is unclear, raise the issues it sets off, and restate it concretely for the user to confirm before it becomes a task.
- Write the ask as a draft row while it waits for confirmation, so an unconfirmed ask is not lost.
- Under a full-autonomy grant, restate it and raise the issues in the reply, then go on without waiting.
- Progress need not end every reply.
- The backlog records only what the user types mid-session. Confirming a row asks about the user's own words, so it does not conflict with **Never Block on the Human**.
- Work n-mode finds itself never becomes a row. It goes in the todo list, the reply, and any Pause safely resume note.
- Every row is confirmed, a small clear correction included.

Made for them:

- A row carries **Ask** in the user's words, **Work** with the behavior, files or surfaces, and approach, **Done when** with the check, and **Evidence** once done.
- **Work** moves to a file past about three lines. That file is the row's intent when it has one, else `.claude/worktrees/backlog/R<n>.md`, so a design never lives in two places.
- A row waiting on the user names the question. A draft waits on `confirm` while queued, and a row in progress stays in progress. A dropped row is done with its reason in place of the evidence.
- Checkbox rows numbered `R<n>`, since the user asked whether Claude supports checkbox lists.
- Put the pickup and pause pointers in the `SKILL.md` section rather than patching those playbooks, so the concern stays in one patch and a pickup that has not read the reference still finds the backlog.
- Number the patch `150`, after every other patch.
- Report only the rows that changed state in a turn, since the file always holds the full list.
- Move the rules out of `SKILL.md` after the user asked whether it had grown too long. The inline section was 493 words, about a tenth of the file, and every `n-agent` read it without using it. The section is now about 150 words.
- A run with no intent file sorts rows against the design its reply confirmed.
- A queued row's later Interview round asks only what the confirmed row leaves open.
- The confirm round has three steps. Raising the issues an ask sets off joined the restatement, so the user sees both in one question.

## Open questions

- Two sessions sharing one root checkout write the same backlog. Each row names its branch, which keeps them apart until that proves not to be enough.
- Writing the backlog from inside a worktree may raise a permission prompt each time, since the **Worktree** section says Claude Code treats the root as outside the session there. This is inferred, not observed. A real n-mode run that writes a row from inside a worktree settles it.
