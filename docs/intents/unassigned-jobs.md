# Unassigned jobs intent

## Problem

Three spawns had no row in the **Match the model to the job** table, so the chat chose for itself. A tabletop on the old text gave the Comment Sicko agent `opus high` in 3 runs and the session's model in 1. `recall/SKILL.md` asks for "a fast, cheap model" that no role names. `orchestrate.md` requires a verifier on a different model family from its worker, while the table gives every verify job `sonnet high`, so a Sonnet worker left the two rules in conflict. Tabletop agents resolved that by inference.

## Outcome

- Patch `240-unassigned-jobs` adds rows for the dedicated Orchestrate verifier, `no-comments` comment review, and a `recall` transcript slice.
- The verifier runs on `opus high` when the worker runs on Sonnet, and on `sonnet high` when it runs on another family.
- Comment review runs on `sonnet medium`, on the `swarm workers` role.
- A `recall` slice runs on `haiku`, on a new `recall workers` role that the `setup-nstack` rule shape writes.
- A tabletop on the new text gave these values in 2 of 2 runs, including a worker on Opus, which the old text was never tried on.
- `node scripts/build.mjs` passes, the check included.

## Surfaces

- Orchestrate verifiers, `/nstack:no-comments`, and `/nstack:recall` in an n-mode run.
- Users with an existing `~/.claude/rules/nstack-models.md`, which has no `recall workers` line and so uses the default until they rerun `/nstack:setup-nstack`.

## Constraints

- No upstream skill changes. `orchestrate.md`, `no-comments/SKILL.md`, and `recall/SKILL.md` stay as they are.

## Out of scope

- Other spawns with no row, such as the `show-me-your-work` cross-model review and `automate-me` history mining.
- The `spec-build.md` spawns that name an effort and no model.

## Decisions

The user's:

- Keep the different-family rule for Orchestrate verifiers and give it table rows.
- Comment review runs on `sonnet medium`.
- `recall` runs on Haiku.

Made for them:

- Comment review uses the `swarm workers` role, since it is a rule-based read of the diff.
- `recall` gets its own role, so a user can change it without touching `swarm workers`.

## Open questions

- Whether `sonnet medium` catches the comments `opus high` caught. A comment that survives review settles it.
- Whether Haiku finds the relevant chats in a `recall` run. A missed chat that a later search finds settles it.
