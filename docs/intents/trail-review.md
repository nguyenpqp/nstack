# Trail review intent

## Problem

`show-me-your-work/SKILL.md` asks for a cross-model review of the trail on a different model family, and sends the effort to n-mode's table, which had no row for it. A tabletop on the old text left agents choosing in 2 of 2 runs. They agreed on `fable high` for a chat on Opus, and split on a chat on Sonnet or Fable, between `fable high`, `opus high`, and `opus xhigh`. Long and autonomous runs all keep a trail, so the choice recurs on a read of the whole transcript.

## Outcome

- Patch `260-trail-review` adds two rows. A chat on Sonnet or Fable gets an `opus high` reviewer, and a chat on Opus gets a `sonnet high` reviewer.
- A tabletop on the new text gave these values as stated in 2 of 2 runs, for all three chat models.
- `node scripts/build.mjs` passes, the check included.

## Surfaces

- The cross-model review in every `/nstack:n-mode` run that keeps a trail.

## Constraints

- No upstream skill changes. `show-me-your-work/SKILL.md` stays as it is.

## Out of scope

- `automate-me` history mining, which runs only when the user calls it and which no n-mode playbook routes to.

## Decisions

The user's:

- A chat on Opus gets `sonnet high`, not `fable high`.
- `automate-me` gets no row for now.

Made for them:

- The rows read the chat's model, since the trail records the chat's decisions. A chat that delegates to another family may share a family with some of the work it has reviewed.
- The `opus high` row uses the `judgment and prose` role, and the `sonnet high` row uses `swarm workers`.

## Open questions

- Whether an Opus chat's Sonnet reviewer stays independent enough when Sonnet delegates did most of the code. A flag that a later review catches and this one missed settles it.
- Whether `sonnet high` finds what matters in a long trail. The same missed flag settles it.
