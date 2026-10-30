# Session backlog

The chat that runs n-mode owns the backlog. Delegates never write it.

## Where it lives

`<root>/.claude/worktrees/backlog.md`, where `<root>` is the root checkout. Before the first write, make sure the ignore file that the **Worktree** section of `SKILL.md` names exists, so the backlog never reaches a commit. Outside a git repository, keep the path and skip the ignore file. One backlog spans every branch of the session.

Done rows move to `<root>/.claude/worktrees/backlog-done.md`, so `backlog.md` holds only open work and stays cheap to read each turn.

## A row

```
- [ ] R3 Export order CSV (in progress, feat/export-csv)
  - Ask: "add a CSV export to the orders table"
  - Touches: src/orders/OrdersTable.tsx, src/lib/format.ts
  - Work: an Export button on OrdersTable downloads the filtered rows as UTF-8 CSV with a BOM, reusing the table's formatters.
  - Done when: on /orders in the dev server, Export downloads a file whose rows match the table.
- [ ] R6 Settle the other export formats (queued, after R3, discuss)
  - Ask: "once CSV is done, let's talk through the other export formats"
  - Work: decide which formats come next and whether they share the CSV code path.
  - Done when: the user's answers are in the intent or split into new rows.
```

- The title line carries everything a grep needs: the ID, the state (queued, in progress, or done), then any tags, then the branch once the row has one. Number rows in order, past the highest number in both files, and never reuse a number. A confirmed row has a todo with the same ID.
- **Ask** quotes the user. **Touches** lists the files or modules the work will change, one path or glob each, so an overlap with another row is a grep. **Work** says concretely what will change: the behavior, the files or surfaces it touches, and the approach. It is not the ask restated. **Done when** names the check that proves it.
- Fill **Touches** in the check below, and **Work** and **Done when** when the user confirms the row, before it moves to in progress. Rewrite them when the work changes course.
- When **Work** needs more than about three lines, keep a one-line summary and point at a file that holds the rest: the row's intent file when it has one, else `<root>/.claude/worktrees/backlog/R<n>.md`.
- Mark a row done and tick `[x]` only with an **Evidence** line that holds a commit SHA, a verify result, or a PR link. A dropped row is done with `dropped: <reason>` as its **Evidence**, and the reply says so. Then move the row to `backlog-done.md` with only its title line, **Ask**, and **Evidence**.

## Order and tags

The file order is the queue. A new row goes below the other open rows, and the next row to start is the topmost queued row with no `draft`, `after`, `later`, or `waiting` tag. Priority picks only which queued row starts next. A row in progress keeps going unless the user says to stop it, and a stopped row goes back to queued with its branch. When a row starts, rerun the backlog and in-flight parts of the check below, since the code may have moved since it was confirmed, and raise any new conflict before you brief its delegate.

- `draft` marks a row you have not checked yet. It never outlives the turn: the check either confirms the row or turns the tag into `waiting`.
- `waiting: <question>` means the row waits on the user. Other rows go on meanwhile, and you prepare this one read-only: find the code it touches and sketch the plan for each answer, so it starts the moment the user replies. Write no code for it until then.
- `after R<n>` holds the row until R<n> closes. When you close a row, grep the open rows for `after R<n>`, drop that tag from each, and move them to the top of the queued rows, since "after R3" means right after it.
- `later` holds the row until the user calls it. The run's final reply asks about each `later` row.
- `discuss` makes the work a conversation, not code. **Work** lists the decisions to settle, and **Done when** is the user's answers recorded in the intent or split into new rows. When it comes up, run its Interview round with the user, even under a full-autonomy grant, since the user asked to talk it through.

## What makes a row

Only a message the user types after the run's opening request. A message that asks for no change, such as "looks good", makes none. Work you find yourself never becomes a row. Put it in the todo list, name it in the reply, and list it in any Pause safely resume note. A row waits on the user only for a question about their own words or a risk to work they already have, which only they can settle, so **Never Block on the Human** does not skip it. Every other row you confirm yourself.

A message that changes or extends the work of a row still queued, with no branch or delegate on it yet, makes no new row. Update that row at once: add the new quote to its **Ask**, tag it `draft`, and run the check and confirm round below again. It keeps its number, its place, its todo, and its file. A message about other work, or about a row already in progress, makes its own row.

A message that only reorders, holds, frees, or drops rows, such as "do R5 first", "leave R4 for later", or "drop R2", makes no row and skips the check and confirm round. Move or tag those rows at once and show the change at the end of the reply, so the user can undo it. Ask only when the message names no row clearly.

## Check, then confirm

Write each new ask at once as a draft row: the title line with the state queued, `draft`, and any tag the message implies, such as `after R3`, then its **Ask**. Work already in flight keeps going.

1. **Check it before you ask anything.** Find where the work lands and fill **Touches**. Look in the code yourself for a narrow ask, and send a broad one to an `Explore` subagent that returns only the files and the finding, so the search stays out of this chat (the **principle-guard-the-context-window** skill). Then check it against:
   - the backlog: grep the other open rows' **Touches** lines for each path, and read only the rows that match;
   - the intent: its **Outcome**, **Out of scope**, and the user's **Decisions**;
   - work in flight: `git diff --stat` of each in-progress row's branch against its base, for the same paths;
   - shipped work: `git log --oneline -5 --` on each path, to see whether the ask undoes a recent commit.

   Pair each risk you find with the handling you recommend. A shared path with a row in progress becomes `after R<n>`, so the two never meet in a merge. A clash with a queued row asks which one wins and updates the loser in place. Undoing shipped work or a user's decision is named as that. A wide ask splits into rows.
2. **Decide whether it needs the user.** It does when its words leave open a product or preference call that would change the **Work**, or when step 1 found a high risk: it undoes shipped work, overrides a decision the user made, clashes with another row so one must win, or hits the Always-pause list in **Autonomy** in `SKILL.md`. Under a full-autonomy grant, an open call the grant covers gets your default instead, reported in the reply, and only the high risks wait.
3. **Confirm it yourself when it does not.** Restate the row in the reply with its **Touches**, **Work**, **Done when**, tags, how it sorts below, and each risk with its handling, or none. Then drop `draft`, add or update its todo, sort it, and go on. The user corrects it later, and a correction updates the row in place.
4. **Otherwise ask without stalling.** Swap `draft` for `waiting: <question>`. First hand every row that can start to a background delegate, since `AskUserQuestion` holds this chat until the user answers and the delegates keep working meanwhile. Then ask one round per the Interview playbook (`../playbooks/interview.md`): facts looked up, the row as you would write it, the risk and its handling, and your recommended answer first. Put every waiting row of the turn in that one call, one question per row and up to four, and more in a second call. On the answer, fill the row, drop `waiting`, add its todo, and sort it. A correction loops back to step 1.

## Sort each row against the intent

When the run keeps no intent file, sort against the design its reply confirmed.

- An ask inside the intent's **Outcome** folds into the current run, and every later delegate brief carries it.
- An ask that contradicts the confirmed design amends the intent in the next commit, stops the delegate on the affected step, and hands that step to a fresh delegate with consolidated scope per **Subagents** in `SKILL.md`.
- An ask outside the **Outcome** is queued. When it is the next row to start and the current verifiable unit has ended, it gets its own Interview round, sized by its playbook and with the confirmed row as its answer sheet, and its own intent. That round asks only what the row leaves open.

## Show it

End a reply with the title lines of the rows that changed this turn: drafted, updated, confirmed, moved, tagged, started, or closed, plus every row still tagged `waiting`, so a question the user has not answered never drops out of sight. When the block would be empty, skip it. List every title line from both files when the user asks for progress and in the run's final reply. The full rows stay in the files. Orchestrate drain turns and the Multi-phase plan tick keep their own status rules instead.
