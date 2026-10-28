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

- The state is queued, in progress, or done. Number rows in order and never reuse a number. Add the branch once the row has one. Each row has a todo with the same ID.
- **Ask** quotes the user. **Work** says concretely what will change: the behavior, the files or surfaces it touches, and the approach. It is not the ask restated. **Done when** names the check that proves it.
- Fill **Work** and **Done when** as you sort the row, before it moves to in progress. Rewrite them when the work changes course.
- When **Work** needs more than about three lines, keep a one-line summary and point at a file that holds the rest: the row's intent file when it has one, else `<root>/.claude/worktrees/backlog/R<n>.md`.
- A row waiting on the user stays in progress and adds a **Waiting on** line with the question.
- Mark a row done and tick `[x]` only with an **Evidence** line that holds a commit SHA, a verify result, or a PR link. A dropped row is done with `dropped: <reason>` as its **Evidence**, and the reply says so.

## Sort each row against the intent

- An ask inside the intent's **Outcome** folds into the current run, and every later delegate brief carries it.
- An ask that contradicts the confirmed design amends the intent in the next commit, stops the delegate on the affected step, and hands that step to a fresh delegate with consolidated scope per **Subagents** in `SKILL.md`.
- An ask outside the **Outcome** is queued. When the current verifiable unit ends, the queued row gets its own Interview round, sized by its playbook, and its own intent.

## Show it

While any row is open, end every reply with the title line of each open row and of each row closed this turn. The full rows stay in the file. The run's final reply lists every title line. Orchestrate drain turns and the Multi-phase plan tick keep their own status rules instead.

## Hand it over

Pause safely points its resume note at the backlog, and Session pickup reads it as the list of open work.
