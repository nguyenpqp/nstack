# Fable high intent

## Problem

Fable ran at `xhigh` in every panel (arena runners, arena cross-judge pool, architect runners, interrogate reviewers) and in the final review of a sensitive branch. The user said "fable cho hardest task mới dùng xhigh, còn lại dùng high thôi, fable rất tốn".

## Outcome

- Patch `210-fable-high` sets every Fable panel default to `fable high`, in the `setup-nstack` rule shape and in the interrogate table.
- `overlay/renames.json` maps the arena and architect fallback to `opus xhigh` and `fable high`.
- The table that patch `200-hard-tier` adds to `n-mode/SKILL.md` runs Fable at `xhigh` only for the hardest implementation, and at `high` in every other row.
- `node scripts/build.mjs` passes, the check included.

## Surfaces

- Anyone running `/nstack:n-mode` or a panel skill.
- Users with an existing `~/.claude/rules/nstack-models.md`, whose panel lines keep `fable xhigh` until they rerun `/nstack:setup-nstack`.

## Constraints

- The budget still moves every Fable value by the same steps.

## Out of scope

- The Opus entries of the panels.

## Decisions

The user's:

- `hardest tasks` stays at `fable xhigh`. Every other Fable use runs at `high`.

Made for them:

- The final review of a sensitive branch counts as "the rest", so it runs at `high`.

## Open questions

- Whether `fable high` catches what `fable xhigh` caught in panel reviews. A review that misses a finding the Opus entry raises settles it.
