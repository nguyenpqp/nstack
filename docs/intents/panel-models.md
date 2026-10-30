# Panel models intent

## Problem

The user asked "sao lại xếp sonnet và haiku ngang hàng với opus xhigh, fable mới ngang hàng chứ". Upstream used `grok-4.7-xhigh-fast` for two jobs: the code model, and the second-vendor peer beside Opus in every panel. `renames.json` mapped it to `sonnet high` everywhere, and patch `100-claude-code-models` then filled the panels to `opus xhigh, sonnet high, haiku, fable`. So a Haiku seat could judge an arena, and `fable`, the strongest seat, ran at the session's effort because it had none. Anthropic lists Claude Fable 5.1 as its most capable widely released model, above Claude Opus 5.5, at $10 / $50 per MTok against $4 / $20.

## Outcome

- `arena runners`, `arena cross-judge pool`, `architect runners`, and `interrogate reviewers` default to `opus xhigh, fable xhigh`, in the `setup-nstack` rule shape, the arena and architect prose, and the interrogate table.
- `hardest tasks` defaults to `fable xhigh`, and n-mode names it as the strongest judgment model.
- Code roles stay on `sonnet high`, and every other judgment role stays on `opus xhigh`.
- `node scripts/build.mjs` passes, the check included.

## Surfaces

- Anyone who runs `arena`, `architect`, or `interrogate`, or whose run reaches a hardest-task delegate.
- Users with an existing `~/.claude/rules/nstack-models.md`. It overrides the defaults until they rerun `/nstack:setup-nstack`.

## Constraints

- The `grok-4.7-xhigh-fast` to `sonnet high` rename stays for the code roles. The panel pair changes through its own `renames.json` entry and patch `100`.

## Out of scope

- Moving `judgment and prose`, `how explainer`, `why synthesizer`, or the `reflect` judgment roles to Fable.
- Rewriting the user's own rule file. The user reruns `/nstack:setup-nstack`.

## Decisions

The user's:

- Panels are `opus xhigh, fable xhigh`. Sonnet and Haiku leave every panel.
- `hardest tasks` moves to `fable xhigh`.
- The user updates their own rule file through `/nstack:setup-nstack`.

Made for them:

- `fable` carries an explicit `xhigh`, since Fable takes `effort` from `low` to `max`.
- Patch `110-claude-code-agents` was repaired because it rewrites the paragraph that names the hardest-task model.
- This intent supersedes the four-entry panel in `n-stack.md` and `no-adapter.md`.

## Open questions

- Two seats give a narrower spread than four. A run where both seats agree on a wrong answer would show whether a third seat earns its cost.
