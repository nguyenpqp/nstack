# Delegate interrogate intent

## Problem

`n-mode/SKILL.md` runs `interrogate` for a contested design, but `opening-a-pr.md` has every subagent that opens a PR run it. Agents followed the second line because it names their role. In a tabletop on the old text, a delegate opening a 6-line uncontested PR ran `interrogate` in 4 of 4 runs, which spends an `opus xhigh` and a `fable high` reviewer. Both final branch review and the user's "fable rất tốn" keep Fable for sensitive work.

## Outcome

- Patch `220-delegate-interrogate` limits this run of `interrogate` to a contested design or a branch that touches security, auth, billing, persisted data, migrations, concurrency, or a subtle algorithm. A delegate that skips it says so.
- Either way, the delegate runs `/code-review` over the branch before it opens the PR, so an ordinary PR keeps one automated review besides the parent's.
- A tabletop on the new text skipped `interrogate` on the uncontested 6-line PR in 4 of 4 runs and ran it on an auth change in 4 of 4 runs. With the `/code-review` sentence, all 4 runs ran `/code-review`.
- `node scripts/build.mjs` passes, the check included.

## Surfaces

- Every subagent that opens a PR in a `/nstack:n-mode` run, Autopilot owners included.

## Constraints

- `opening-a-pr.md` stays as upstream wrote it. The rule lives in `n-mode/SKILL.md`, which every delegate reads in full.

## Out of scope

- When the chat itself runs `interrogate`, which stays on a contested design.
- The `/deslop` name in `opening-a-pr.md`, which ships in no nstack skill. Delegates use `unslop` in its place.

## Decisions

The user's:

- A delegate still runs `interrogate` on a sensitive branch, even when nobody contests the design.
- No new patch changes an upstream skill.
- A delegate that opens a PR always runs `/code-review`.

Made for them:

- The sensitive list is the one on the final branch review row.

## Open questions

- Whether real delegates follow this as tabletop agents did. Spawn labels from the next runs that open a PR through a delegate settle it.
