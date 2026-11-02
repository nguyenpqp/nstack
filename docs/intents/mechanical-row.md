# Mechanical row intent

## Problem

The table's mechanical row read "already specified step by step". In a tabletop on the old text, two agents given the same one-line edit split: one chose `sonnet medium` because the brief named the file, function, constant, and line, and the other chose `sonnet high` because the design gave an outcome and a site rather than steps.

## Outcome

- Patch `250-mechanical-row` defines the row by what the brief holds: it names each file and the exact change, and leaves no design choice.
- A tabletop on the new text gave `sonnet medium` for that edit in 2 of 2 runs.
- `node scripts/build.mjs` passes, the check included.

## Surfaces

- The tier choice for every code delegate in a `/nstack:n-mode` run.

## Constraints

- The row's model and effort do not change.

## Out of scope

- The boundary between implementation, hard, and hardest tiers.

## Decisions

The user's:

- Tighten the boundary of the mechanical row.

Made for them:

- The wording tests the brief, since that is what the chat holds when it picks a tier.

## Open questions

- Whether this edit stays on `sonnet medium` in real runs, and whether `medium` is enough for it. A fix round on a mechanical edit settles it.
