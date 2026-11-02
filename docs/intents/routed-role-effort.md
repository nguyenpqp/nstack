# Routed role effort intent

## Problem

The **Match the model to the job** table runs explore and search at `sonnet medium`, but `how` and `why` kept `sonnet high` for the same kind of work, and `how` ran its explainer at `opus xhigh`. Interview step 1 runs `how` on most tasks. A tabletop on the old text gave `sonnet high` in 2 of 2 runs. Both named the cause: the table had no `how explorer` row, and `how/SKILL.md` names that role outright. The same scenario for `swarm`, whose role the table does name, followed the table in 2 of 2 runs.

The user wants this settled without changing skills that come from upstream: "mục tiêu không change skill từ upstream".

## Outcome

- Patch `230-routed-role-effort` adds rows for `how explorer` and `why investigators` at `sonnet medium`, and `how explainer` at `opus high`.
- A row now replaces the default that a routed skill names for the same role.
- The `setup-nstack` rule shape writes the same three values.
- A tabletop on the new text gave `sonnet medium` and `opus high` in 2 of 2 runs.
- `node scripts/build.mjs` passes, the check included.

## Surfaces

- Every `how` and `why` spawn in a `/nstack:n-mode` run.
- Users with an existing `~/.claude/rules/nstack-models.md`. Its old values read as set by hand until they rerun `/nstack:setup-nstack`.

## Constraints

- `how/SKILL.md` and `why/SKILL.md` stay as upstream wrote them, so their own defaults still name the old values.

## Out of scope

- `/how` or `/why` run outside n-mode, which keep the defaults in those skills.
- Reusing a `how` result within one run.

## Decisions

The user's:

- Explorers and investigators run at `sonnet medium`.
- The explainer runs at `opus high`.
- No new patch changes an upstream skill.

Made for them:

- The fix is a table row and one precedence sentence, not a general rule that n-mode beats every upstream skill. The tabletop showed the missing row was the cause.

## Open questions

- Whether real runs follow the row as the tabletop did. Spawn labels from the next runs settle it.
- Whether `opus high` explains as well as `opus xhigh`. A `how` answer that misses a seam settles it.
