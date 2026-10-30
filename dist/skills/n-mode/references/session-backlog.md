# Session backlog

The chat that runs n-mode owns the backlog. Delegates never write it.

## Where it lives

`<root>/.claude/worktrees/backlog.md`, where `<root>` is the root checkout, holds the open rows. Done rows move to `backlog-done.md` beside it, so the file read each turn stays small. Before the first write, apply the ignore-file rule of the **Worktree** section in `SKILL.md`, so neither file reaches a commit. Outside a git repository, keep the paths and skip that rule. One backlog spans every branch of the session.

## A row

```
- [ ] R3 Export order CSV (in progress, feat/export-csv)
  - Ask: "add a CSV export to the orders table"
  - Touches: src/orders/OrdersTable.tsx, src/lib/format.ts
  - Work: an Export button on OrdersTable downloads the filtered rows as UTF-8 CSV with a BOM, reusing the table's formatters.
  - Done when: on /orders in the dev server, Export downloads a file whose rows match the table.
- [ ] R6 Settle the other export formats (queued, after R3, discuss)
  - Ask: "once CSV is done, let's talk through the other export formats"
  - Touches: docs/intents/orders-export.md
  - Work: decide which formats come next and whether they share the CSV code path.
  - Done when: the user's answers are in the intent or split into new rows.
```

- The title line carries what a grep needs: the ID, the state (queued, in progress, or done), any tags, and the branch once there is one. Number rows past the highest number in both files and never reuse one. A confirmed row has a todo with the same ID.
- **Ask** quotes the user. **Touches** lists what the work will change, one path, glob, or module each, so an overlap is a grep. **Work** says concretely what will change and how, not the ask restated, and **Done when** names the check that proves it. Fill **Touches** during the check and the rest when the row is confirmed. Rewrite them when the work changes course.
- Past about three lines, **Work** keeps a one-line summary and points at the row's intent file, or else `<root>/.claude/worktrees/backlog/R<n>.md`.
- Tick `[x]` only with an **Evidence** line: a commit SHA, a verify result, or a PR link. A dropped row is ticked and done too, with `dropped: <reason>` as its **Evidence**, its todo closes, and the reply says so. Then move the row to `backlog-done.md` with only its title line, **Ask**, and **Evidence**. Undoing a drop makes a new row that quotes the archived **Ask**.

## Order and tags

The file order is the queue, and a new row goes below the other open rows. A row can start when it is queued, no tag holds it, and its **Touches** share no path with a row in progress. At the end of every turn and whenever a row closes, start each such row in file order, on its own branch, worktree, and delegate, alongside the work already running, so no free row sits idle. A started row follows its matched playbook, with the row as its answer sheet. A row in progress keeps going unless the user says to stop it, and a stopped row goes back to queued with its branch. When a row starts, rerun the backlog and in-flight parts of the check, since the code may have moved, and raise any new conflict before you brief its delegate.

Tags combine, and each one holds the row:

- `draft`: not checked yet. It never outlives the turn.
- `waiting: <question>`: waits on the user. Meanwhile prepare it read-only: find the code and sketch the plan for each answer, so it starts the moment they reply. Write no code for it until then.
- `after R<n>`: waits for R<n> to close. When you close a row, grep the open rows for `after R<n>`, drop the tag, and move those rows to the top of the queue, since "after R3" means right after it.
- `later`: waits until the user calls it. The run's final reply asks about each one.
- `discuss`: the work is a conversation, not code. **Work** lists the decisions to settle, and **Done when** is the answers recorded in the intent or split into new rows. When it comes up, run its Interview round with the user, even under a full-autonomy grant, since they asked to talk it through.

## What makes a row

Only a message the user types after the run's opening request, and only one that asks for a change or gives feedback. Work you find yourself never becomes a row: put it in the todo list, the reply, and any Pause safely resume note. A row waits on the user only for a question about their own words or a risk to work they already have, which only they can settle, so **Never Block on the Human** does not skip it. You confirm every other row yourself.

- A message that changes the work of a row still queued, with no branch or delegate on it, updates that row instead: add the quote to its **Ask**, tag it `draft`, and check it again. It keeps its number, place, todo, and file.
- A message that changes the work of a row in progress, or asks for other work, makes its own row.
- A message that only reorders, holds, frees, or drops rows, such as "do R5 first", "leave R4 for later", or "drop R2", makes no row and skips the check. Move, tag, or drop those rows at once and show the change at the end of the reply, so the user can undo it. Ask only when it names no row clearly.

## Check, then confirm

Right after the turn's grep, write each new ask as a row tagged `draft`, plus any tag the message implies, such as `after R3`, with its **Ask**. Work in flight keeps going.

1. **Check it.** Find where the work lands and fill **Touches**. Search the code yourself for a narrow ask, and send a broad one to an `Explore` subagent that returns only the files and the finding (the **principle-guard-the-context-window** skill). Then check it against:
   - the open rows: grep their **Touches** lines for each path, and read only the rows that match;
   - the archive: grep `backlog-done.md` for the ask's key terms, since a dropped ask asked again meets a decision already made;
   - the intent: its **Outcome**, **Out of scope**, and the user's **Decisions**;
   - work in flight: `git diff --stat` of each in-progress row's branch against its base, for the same paths;
   - shipped work: `git log --oneline -5 --` on each path, to see whether the ask undoes a recent commit.

   Pair each risk with the handling you recommend. A path shared with a row in progress becomes `after R<n>`, so the two never meet in a merge. A clash with a queued row asks which one wins and updates the loser in place. A wide ask splits into rows.
2. **Decide whether it needs the user.** It does when its words leave open a product or preference call that would change the **Work**, or when step 1 found a high risk: it undoes shipped work, overrides a decision the user made, clashes with another row so one must win, or hits the Always-pause list in **Autonomy** in `SKILL.md`. Under a full-autonomy grant, an open call the grant covers gets your default, reported in the reply, and only the high risks wait.
3. **When it does not, confirm it yourself.** Restate the row in the reply with its **Touches**, **Work**, **Done when**, tags, place in the queue, and each risk with its handling, or none. Drop `draft`, add or update its todo, and go on. A correction from the user later updates the row in place.
4. **When it does, ask without stalling.** Swap `draft` for `waiting: <question>`. First hand every row that can start to a background delegate, since `AskUserQuestion` holds this chat until the user answers while delegates keep working. Then ask per the Interview playbook (`../playbooks/interview.md`): the facts, the row as you would write it, the risk and its handling, and your recommended answer first. Every waiting row of the turn shares that call, one question per row and up to four, with more in a second call. On the answer, fill the row, drop `waiting`, and add its todo. A correction loops back to step 1.

## Sort each row against the intent

When the run keeps no intent file, sort against the design its reply confirmed.

- An ask inside the intent's **Outcome** folds into the current run, and every later delegate brief carries it.
- A confirmed ask that contradicts the design amends the intent in the next commit, stops the delegate on the affected step, and hands that step to a fresh delegate with consolidated scope per **Subagents** in `SKILL.md`.
- A confirmed row that extends what the intent records, such as a **Decisions** line it widens, amends that line in the row's own commit, so the intent never trails the code.
- An ask outside the **Outcome** is its own unit. A row whose **Work** fits in about three lines stands in for its intent and starts as soon as it can. A larger row gets its own Interview round and intent when it comes up, with the row as its answer sheet, asking only what the row leaves open, and those questions share the turn's one `AskUserQuestion` call.

## Show it

End a reply with the title lines of the rows that changed this turn, plus every row tagged `waiting`, so an unanswered question never drops out of sight. Skip the block when it would be empty. List every title line from both files when the user asks for progress and in the run's final reply. Orchestrate drain turns and the Multi-phase plan tick keep their own status rules instead.
