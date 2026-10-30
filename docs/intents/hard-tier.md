# Hard tier intent

## Problem

Code delegates had three tiers: the code model with its effort lowered for trivial edits, the code model for the rest, and `hardest tasks` for cross-cutting design, gnarly concurrency, and subtle algorithms. A real run judged a new network worker and a config migration harder than Sonnet but short of Fable, and spawned `opus high` on its own, which no rule named. The user wants "opus medium như tier trên của sonnet high".

## Outcome

- Patch `200-hard-tier` adds a `hard tasks` role, default `opus medium`, in the **Subagents** section of `n-mode/SKILL.md` and in the `setup-nstack` rule shape. It takes hard changes short of the hardest: a new background worker, a change wired through several layers, or a migration of the user's saved config or data.
- **Match the model to the job** gives one table that names the model and effort of every job, so no sentence leaves an effort to the chat. Mechanical edits run on `sonnet medium`, implementation on `sonnet high`, hard implementation on `opus medium`, and the hardest on `fable xhigh`. Explore and search run on `swarm workers` at `sonnet medium`, and verify at `sonnet high`.
- The rule that raised the effort one step for the hardest work in a tier is gone, since it turned `opus medium` into `opus high`. The chat never raises or lowers an effort that the table and the role lines give.
- The implementation rows name the only models that implement. The chat picks the tier from the change, not to save cost, and names it in the brief.
- `node scripts/build.mjs` passes, the check included.

## Surfaces

- Anyone running `/nstack:n-mode`.
- Users with an existing `~/.claude/rules/nstack-models.md`, which has no `hard tasks` line and so uses the default until they rerun `/nstack:setup-nstack`.

## Constraints

- The budget moves `hard tasks` like every other role, so it stays between the code model and `hardest tasks`.

## Out of scope

- Which roles the routed skills read, apart from the panels.

## Decisions

The user's:

- The tier above `sonnet high` is `opus medium`.
- Every job names its model and effort outright, not a general effort rule.
- Verify runs on `sonnet high`.

Made for them:

- It is a configurable role named `hard tasks`, beside `hardest tasks`, rather than a fixed value.
- The examples of a hard change come from the run that raised this: a network worker and a config migration.
- Explore and search run on the `swarm workers` role, since they had no role before.

## Open questions

- Whether the chat sorts changes between `hard tasks` and `hardest tasks` the way the user expects. The next runs with a hard change settle it.
