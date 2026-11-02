# Spec build tiers intent

## Problem

`spec-build.md` gave Spec build spawns an effort and no model, or "the implementation effort", which depends on a model it left open. A tabletop on the old text reached the first spawn of each ticket from the table, but inferred the model for a retry, a replay, and the fix implementer in 2 of 2 runs. The rebase agent came out `sonnet high` in 2 of 2 runs, from a bare `effort: "high"`.

## Outcome

- Each ticket in the tickets file names a **Tier** from the implementation rows of the table.
- A ticket's first spawn, retry, and replay run on its **Tier**. The fix implementer runs on the highest **Tier** among the tickets its findings touch.
- The explore agent runs on the Explore and search row, and the rebase agent on the hard implementation row.
- A tabletop on the new text gave the same values in 2 of 2 runs, and stated the retry, replay, fix, and rebase values rather than inferring them. One run still placed a plain CRUD ticket on the Implementation row by elimination, with the same result.
- `node scripts/build.mjs` passes, the check included.

## Surfaces

- Every spawn in a Spec build run.

## Constraints

- No upstream skill changes. `spec-build.md` is an nstack file.
- The model and effort stay in the table, so the playbook names rows and tiers, never values.

## Out of scope

- Reading a line of `/setup-nstack` differently. A ticket's **Tier** still resolves through the role lines.
- The boundary between implementation, hard, and hardest tiers.

## Decisions

The user's:

- Spec build names its model and effort.

Made for them:

- The tier is written per ticket, so the chat picks it once, when it writes the tickets file.
- The fix implementer takes the highest tier its findings touch, since it works across tickets.
- The rebase agent moves from `high` on the code model to the hard implementation row, because it resolves conflicts across tickets in the spec worktree.

## Open questions

- Whether `opus medium` resolves a spec rebase as well as `sonnet high` did. A rebase that needs a second attempt settles it.
