# Generic workflow fixes

## Problem

nstack sends feature tickets to a TDD skill scoped to bug fixes. It re-interviews when a design doc already answers the questions. It routes verification and cleanup to three Cursor-only skills that never ship in Claude Code, and `check.mjs` misses that.

## Outcome

Five commits on `fix/generic-workflow`, fast-forwarded to `main`. `node scripts/check.mjs` passes, and fails on a build that lacks the new adapter rows.

1. Pocock's `tdd` ships as `tdd-feature` through `mattpocock.rename`. Spec build points implementers at it. pstack's `tdd` stays for Bug fix.
2. The interview asks only a design doc's gaps when one is in hand, and matches Spec build for multi-ticket work.
3. The control skill is the project's own, made by `create-verification-skill`. `/deslop` maps to `/simplify`.
4. `check.mjs` fails on prose naming a skill that does not ship, has no adapter row, and is not allowed for that file.
5. Spec build lands a shape shared across a process boundary as its own blocking ticket.

## Surfaces

- Anyone running `/nstack:n-mode` on any stack.
- The maintainer running `sync.mjs`, `build.mjs`, and `check.mjs`.

## Constraints

- No framework- or engine-specific content.
- `upstream/` untouched. pstack text changes go in as one-concern patches.

## Out of scope

- Excluding any pstack skill.
- Godot or Java material.
- Pushing to the remote.

## Decisions

The user's:

- Scope is items 1 to 5. Exclude nothing. Contract rule lives in spec build. Local ff-merge to `main`.

Made for them:

- The name `tdd-feature`.
- Implementers take the spec's seams as confirmed, because `to-spec` checked them with the user.
- `/simplify` stands in for `/deslop`.
- Cursor names are mapped once in the adapter instead of patched at each of about ten call sites.
- `create-skill` gets an adapter row. `triage` and `skill-creator` are allowed per file.

## Open questions

- The lint matches "the **x** skill" phrasing only. Backticked names without the word "skill", like the old `control-cli` line, still pass.
