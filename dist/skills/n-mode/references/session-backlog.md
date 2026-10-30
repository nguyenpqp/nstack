# Session backlog

The chat that runs n-mode owns the backlog. Delegates never write it.

## Where it lives

`<root>/.claude/worktrees/backlog.md`, where `<root>` is the root checkout. Before the first write, make sure the ignore file that the **Worktree** section of `SKILL.md` names exists, so the backlog never reaches a commit. Outside a git repository, keep the path and skip the ignore file. One backlog spans every branch of the session.

## A row

```
- [ ] R3 Export order CSV (in progress, feat/export-csv)
  - Ask: "add a CSV export to the orders table"
  - Work: an Export button on OrdersTable downloads the filtered rows as UTF-8 CSV with a BOM, reusing the table's formatters.
  - Done when: on /orders in the dev server, Export downloads a file whose rows match the table.
```

- The state is queued, in progress, or done. Number rows in order and never reuse a number. Add the branch once the row has one. A confirmed row has a todo with the same ID.
- **Ask** quotes the user. **Work** says concretely what will change: the behavior, the files or surfaces it touches, and the approach. It is not the ask restated. **Done when** names the check that proves it.
- Fill **Work** and **Done when** when the user confirms the row, before it moves to in progress. Rewrite them when the work changes course.
- When **Work** needs more than about three lines, keep a one-line summary and point at a file that holds the rest: the row's intent file when it has one, else `<root>/.claude/worktrees/backlog/R<n>.md`.
- A row waiting on the user adds a **Waiting on** line with the question. A draft waits on `confirm` while queued, and a row in progress stays in progress.
- Mark a row done and tick `[x]` only with an **Evidence** line that holds a commit SHA, a verify result, or a PR link. A dropped row is done with `dropped: <reason>` as its **Evidence**, and the reply says so.

## What makes a row

Only a message the user types after the run's opening request. A message that asks for no change, such as "looks good", makes none. Work you find yourself never becomes a row. Put it in the todo list, name it in the reply, and list it in any Pause safely resume note. Confirming a row asks the user what they meant by their own words, which only they can settle, so **Never Block on the Human** does not skip it.

## Confirm before it becomes a task

Write each new ask at once as a draft row: the title line, its **Ask**, the state queued, and `Waiting on: confirm`. Work already in flight keeps going.

1. **Ask what is unclear.** When the ask leaves open a decision that would change the **Work**, ask it in one quick round per the Interview playbook (`../playbooks/interview.md`), facts looked up and your recommended answer first. A clear ask skips this step.
2. **Restate it with what it sets off.** Show the row as you would write it, with its **Work**, its **Done when**, and how it sorts below. Name each issue it creates (a conflict with the intent or another row, work it would undo, a risk to what is in flight, a cost), or say none. Ask for confirmation through `AskUserQuestion`, with the row as the recommended option. A correction loops back to step 1.
3. **On confirmation, it becomes a task.** Fill the row, drop `Waiting on`, add its todo, and sort it.

Under a full-autonomy grant, do step 2 in the reply without waiting, confirm the row yourself, and go on. The user corrects it later.

## Sort each row against the intent

When the run keeps no intent file, sort against the design its reply confirmed.

- An ask inside the intent's **Outcome** folds into the current run, and every later delegate brief carries it.
- An ask that contradicts the confirmed design amends the intent in the next commit, stops the delegate on the affected step, and hands that step to a fresh delegate with consolidated scope per **Subagents** in `SKILL.md`.
- An ask outside the **Outcome** is queued. When the current verifiable unit ends, the queued row gets its own Interview round, sized by its playbook and with the confirmed row as its answer sheet, and its own intent. That round asks only what the row leaves open.

## Show it

End a reply with the title lines of the rows whose state changed this turn: drafted, confirmed, started, or closed. When none changed, skip the block. List every title line when the user asks for progress and in the run's final reply. The full rows stay in the file. Orchestrate drain turns and the Multi-phase plan tick keep their own status rules instead.
