# Session backlog intent

## Problem

The user "thường hay add feature và feedback liên tục trong phiên" and wants n-mode to make sure "mọi việc không bị bỏ sót, nhất quán và user nắm được tiến độ dễ dàng hơn". Sticky mode only says to match each new turn to a playbook. Nothing tells n-mode to record a mid-run ask, to check it against the confirmed design, or to report what is still open. A new session that picks up the work starts with no todo list, so an ask that lives only there or in the chat can be dropped.

## Outcome

- Patch `150-session-backlog` adds a short **Session backlog** section after **Sticky mode** in `n-mode/SKILL.md`. The rules live in `references/session-backlog.md`, which only the chat that runs n-mode reads, so delegates do not pay for them.
- Every message the user types after the run's opening request that asks for a change or gives feedback becomes a numbered checkbox row in `<root>/.claude/worktrees/backlog.md` before any other step, and a todo once confirmed. The opening request goes through Interview. Each new turn with an open row first greps the open title lines and reads in full only the rows it touches and their intents.
- Session pickup reads the backlog as open work, and the Pause safely resume note points at it. The **Session backlog** section says so, so a pickup with no new message still finds it.
- An ask inside the intent's **Outcome** folds in. One that contradicts the confirmed design amends the intent and restarts the affected step on a fresh delegate. One outside the **Outcome** is queued for its own Interview round and intent.
- Each ask is written as a draft row at once, then checked against the code, the open rows' **Touches**, the in-flight branches, recent commits on those paths, and the intent. A low-risk row n-mode confirms itself and restates in the reply. A row with an open call or a high risk waits on the user, asked after the startable rows go to background delegates, and is prepared read-only meanwhile. A row is checked again, more cheaply, when it starts.
- A row is ticked only with evidence or a stated drop reason. A reply ends with the title lines of the rows that changed that turn and of every row still tagged `waiting`, and lists every title line when the user asks for progress and at the end of the run, from both files. A done row moves to `<root>/.claude/worktrees/backlog-done.md` with its title line, **Ask**, and **Evidence**, so `backlog.md` holds only open work.
- The file order is the queue. Title-line tags hold a row (`after R<n>`, `later`), mark it as waiting on the user (`waiting: <question>`), or make it a conversation (`discuss`). A message that only reorders, holds, or drops rows edits them at once. A new run names any open rows left from an earlier one in its first reply.
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

Scope:

- Record each ask in the todo list and in a backlog markdown file at `.claude/worktrees/backlog.md`, and amend the intent only when needed.
- The backlog records only what the user types mid-session. Work n-mode finds itself never becomes a row. It goes in the todo list, the reply, and any Pause safely resume note.
- Fold an ask in when it fits the intent, else queue it. A correction to the confirmed design amends the intent and redoes the step.

The row:

- A row has three states: queued, in progress, and done.
- Each row states the work itself, not a one-line restatement of the ask. A complex ask points at a file instead of growing the row.
- Each row lists **Touches**, so an overlap is a grep.
- Feedback on the same work as a row still queued, with no agent on it yet, updates that row in place, so the backlog holds one current row per piece of work. Feedback on other work, or on a row in progress, makes its own row.

Checking and confirming:

- Check a new row for conflicts early, and weigh its risk against the current code and the open backlog. A row reruns the backlog and in-flight checks when it starts.
- "đừng chờ, làm auto nhiều nhất có thể". n-mode confirms a low-risk row itself and restates it in the reply. Only a row with an open product or preference call, or a high risk, waits on the user. Under full autonomy, only the high risks wait. This replaces the earlier rule that the user confirms every row.
- High risk means undoing shipped work, overriding a decision the user made, clashing with another row so that one must win, or an Always-pause action.
- Before asking, hand every row that can start to a background delegate, then ask through `AskUserQuestion`, so work goes on while the user answers. The waiting rows of one turn share one call.
- While a row waits, prepare it read-only: find the code and sketch the plan for each answer. Write no code for it until the user answers.
- Write each ask as a draft row at once, so an ask is not lost before it is checked.

Order and flexibility:

- The backlog must be efficient, cheap on context, hard to miss, and flexible enough for priority, deferral, and "thảo luận kĩ hơn sau khi hoàn thành task X".
- Priority is the order of rows in the file, not a priority field.
- Deferral and "after R<n>" are tags on the title line, not a separate section.
- A message that only reorders, holds, or drops rows edits them at once and is reported in the reply, with no check and no question.
- `waiting` goes on the title line, and a new run names open rows left from an earlier one.

Context:

- A growing backlog must not cost context each turn. Each turn reads only the open title lines and the rows it touches, and done rows move to an archive file that keeps the **Ask**.
- The full progress list need not end every reply.

Made for them:

- A row carries **Ask** in the user's words, **Work** with the behavior, files or surfaces, and approach, **Done when** with the check, and **Evidence** once done.
- **Work** moves to a file past about three lines. That file is the row's intent when it has one, else `.claude/worktrees/backlog/R<n>.md`, so a design never lives in two places.
- A row waiting on the user names the question on its title line, and a row in progress stays in progress while it waits. An unchecked row carries `draft`, which never outlives the turn. A dropped row is done with its reason in place of the evidence.
- Checkbox rows numbered `R<n>`, since the user asked whether Claude supports checkbox lists.
- Put the pickup and pause pointers in the `SKILL.md` section rather than patching those playbooks, so the concern stays in one patch and a pickup that has not read the reference still finds the backlog.
- Number the patch `150`, after every other patch.
- Report only the rows that changed in a turn, plus the rows still waiting on the user, since the file always holds the full list.
- Move the rules out of `SKILL.md` after the user asked whether it had grown too long. The inline section was 493 words, about a tenth of the file, and every `n-agent` read it without using it. The section is now about 250 words.
- A run with no intent file sorts rows against the design its reply confirmed.
- A queued row's later Interview round asks only what the confirmed row leaves open.
- "No agent on it yet" means queued with no branch or delegate. An updated row keeps its number, so its place in the queue, its todo, its file, and the IDs earlier replies named stay valid. A new row that replaced the old one would have moved the work to the back of the queue.
- The backlog stays a checkbox list, not a table. A table cell holds no line break for **Work**, renders no checkbox, and is read whole like a list, while the title line already carries the ID and state for grep.
- Row numbers run past the highest in both files, so an archived number is never reused.
- A row in progress keeps going when another row is moved above it, unless the user says to stop it.
- A `discuss` row runs its Interview with the user even under full autonomy, since the user asked to talk it through.
- `later` rows come up in the run's final reply, so a held row is not forgotten.
- A queued row outside the **Outcome** gets its Interview round when it is the next to start, not as soon as the current unit ends, so a held row is not interviewed early.
- The check runs before any question, so its risks join the same question round instead of opening a second one. A broad code search goes to an `Explore` subagent that returns only the finding.
- Shipped work is found with `git log` on the touched paths, so the archive stays small.
- A shared path with a row in progress is handled as `after R<n>`, so two delegates never meet in a merge.
- The round has four steps: check, decide whether it needs the user, confirm it yourself, or ask without stalling. Its risks and open calls share one question, so the user answers once.

## Open questions

- Two sessions sharing one root checkout write the same backlog. Each row names its branch, which keeps them apart until that proves not to be enough.
- Writing the backlog from inside a worktree may raise a permission prompt each time, since the **Worktree** section says Claude Code treats the root as outside the session there. This is inferred, not observed. A real n-mode run that writes a row from inside a worktree settles it.
