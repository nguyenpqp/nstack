# Effort by model intent

## Problem

The user saw that "hầu hết đều là high khi chạy thực tế" and asked for implementation at a lower effort, with planning and review higher, since "sonnet 5.5, opus 5.5 rất mạnh". Spawn labels across the user's transcripts on 2026-10-30 counted 549 `sonnet high`, 143 `opus high`, 41 `sonnet medium`, 34 `opus xhigh`, and 10 `fable xhigh`. Explore and verify spawns ran at `sonnet high` although the tier list in `n-mode/SKILL.md` puts them at `medium`. Three things caused it:

- **Match the model to the job** told the chat to start from the role's effort and lower it for routine work, which the chat rarely did. Its verification exception kept verify on `swarm workers` at `sonnet high`, against the tier list.
- Spec build pinned `effort: "high"` on every implementer, Opus tickets included.
- The `/setup-nstack` budget set every role to one effort. `large` turned `sonnet high` into `sonnet xhigh` while saying it kept the defaults, which erased the gap between implementation and review.

## Outcome

- Patch `180-effort-by-model` rewrites the tier list. Explore, search, verify, and step-by-step mechanical edits run at `medium`, verify on the `swarm workers` model. Implementation runs at `high` on Sonnet and `medium` on Opus. Per-task diff review runs on the `judgment and prose` model at `high`. An independent verdict that gates a landing runs on the `swarm workers` model at `high`, as Shipping's verifier did before. Planning, hard debugging, design, and the final branch review run on the `judgment and prose` model at `xhigh`, and the final branch review moves to the `hardest tasks` model when the branch touches security, auth, billing, persisted data, migrations, concurrency, or a subtle algorithm. Spec build's final review follows the same rule and no longer requires a model different from the implementers'.
- **Match the model to the job** takes the model from the role and the effort from the tiers. The verification exception and the "lower it for routine work" step are gone. A role line whose effort differs from what the budget gives its default was set by hand and wins for that role's job. A rule whose `# budget` line names one effort, as in `large (xhigh)`, was written by the old flattening budget, so its lines do not count as hand edits.
- The budget moves every effort from its default by the same steps: `unlimited` one up, `large` none, `medium` one down, `small` two down. The tiers move with it.
- Spec build ticket, replay, and fix implementers run at the implementation effort for their model.
- `node scripts/build.mjs` passes, the check included.

## Surfaces

- Every `/nstack:n-mode` spawn and every `/nstack:setup-nstack` run.
- Users with an existing `~/.claude/rules/nstack-models.md`, whose `# budget` line still names a target effort until they rerun `/nstack:setup-nstack`.

## Constraints

- The code role default stays `sonnet high`, so `overlay/renames.json` does not change.
- Upstream playbooks stay untouched.

## Out of scope

- Model choice per role, the panels, and the routed skills' own role lines.
- The Spec build rebase-conflict agent, which stays at `high`.
- `docs/guide/01-setup.md`, upstream text that still describes the old budget and names Grok.

## Decisions

The user's:

- Implementation on Sonnet at `high`, on Opus at `medium`.
- Verify at `medium`, with a verdict that gates a landing at `high`.
- Per-task diff review on Opus at `high`.
- The budget moves efforts relative to the defaults.
- The change ships as a plugin default, not a local rule.
- Hard debugging runs on Opus at `xhigh`.
- The final branch review runs on Opus, and on Fable only for a sensitive branch: Babysit's escalation list plus concurrency and subtle algorithms. Spec build drops its different-model requirement.

Made for them:

- The budget labels name the move, as in `large — the defaults`, since they no longer name one effort.

## Open questions

- Whether Opus at `medium` needs more fix rounds after review than Sonnet at `high`. Real runs settle it.
