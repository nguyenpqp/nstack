---
name: setup-nstack
description: Configure which models nstack uses per role and at what reasoning budget. Detects your available models and writes an always-applied rule that overrides the skill defaults. Use for /setup-nstack, "configure nstack models", "nstack budget", or changing nstack's model choices.
---

# Setup nstack

To run another nstack skill that this file names, read `../<name>/SKILL.md` next to this skill's folder and follow it. The Skill tool refuses nstack skills. When you tell the user to type one, write `/nstack:<name>`.

Write `~/.claude/rules/nstack-models.md`, the rule that sets nstack's model and effort per role. Claude Code loads every `.md` file in `~/.claude/rules/` into each new session, so the role lines are in context wherever a skill reads them.

## Steps

### 1. Detect available models

The detected models are the `model` values that the Agent tool schema lists, and the detected efforts are its `effort` values. That is the dependable source. A role value is `<model> <effort>`, such as `opus xhigh`, or a bare `<model>`, such as `haiku`, which omits `effort`. If the schema lists no `model` values, ask the user which of `opus`, `sonnet`, `haiku`, and `fable` they can use. Never write a model you have not confirmed is available. The aliases `inherit-parent` and `auto` are always valid even though they are not detected models.

### 2. Load current state

The default role-to-model mapping is the rule shape shown in step 5 below. If `~/.claude/rules/nstack-models.md` already exists, read it and treat its `# budget` line and its role values as the current choices. Otherwise start from those defaults. A line whose role is not in step 5, such as `how critics`, is from a retired role. Drop it. A line whose value names a model that is not one of the detected `model` values, such as one left from an older install, needs a choice in step 3.

### 3. Budget, map, and confirm

**(a) Ask for a budget.** Prefer AskUserQuestion over free text. Offer these four options with these exact labels, and name the current budget when the rule records one. With no rule, say that `large` matches the skill defaults.

- `unlimited — max reasoning`
- `large — xhigh reasoning`
- `medium — high reasoning`
- `small — medium reasoning`

**(b) Apply it.** Build the working table from the skill defaults, and on a re-run keep any role you changed by model, list, or alias (`inherit-parent`, `auto`). `unlimited`, `large`, `medium`, and `small` set the effort of every value that has one, panel entries included, to `max`, `xhigh`, `high`, or `medium`. The effort is the last token, on the ladder `max` > `xhigh` > `high` > `medium` > `low`. A bare model keeps no effort. If the target effort is not a detected effort, use the highest detected effort below it. `inherit-parent` and `auto` do not change. So `unlimited` turns `opus xhigh` into `opus max`, `large` keeps the defaults, and `small` turns them into `opus medium` and `sonnet medium`.

**(c) Show the roles and confirm.** Show every role with its value, marking any model not in the detected set as needing a choice. Also list each line step 2 dropped. Ask whether to accept as-is or change specific roles, offering the detected models plus `inherit-parent` and `auto` (both mean: this role runs on the parent chat model) as the options. Prefer AskUserQuestion over free text. For panel roles (arena runners, architect runners, interrogate reviewers) the value is a list, and one subagent runs per entry, alias entries included, so the list length sets the count. `arena cross-judge pool` is also a list, but Arena selects one value from it that differs from the parent's model when possible. `swarm workers` is the default model for every worker unless a race or comparison assigns another model per arm.

### 4. Validate

Every model written must be a detected `model` value, and every effort a detected `effort` value. `inherit-parent` and `auto` always pass. If a chosen value is not available, stop and ask again.

### 5. Write the rule

Write `~/.claude/rules/nstack-models.md` with no frontmatter: the comment lines, a `# budget` line with the chosen label and its target effort, and one line per role, using the same labels n-mode uses. Overwrite the whole file so re-runs stay idempotent. Never put the role lines in `CLAUDE.md` or `AGENTS.md`. Shape:

```
# nstack model configuration. One line per role. Delete a line to fall back to the skill default.
# A value `<model> <effort>`, such as `opus high`, means Agent `model: "opus"` and `effort: "high"`. A bare model, such as `haiku`, omits `effort`.
# `inherit-parent` or `auto` as a value: the role runs on the parent chat model (omit Agent `model`). Alias entries in a panel list still count toward its fan-out.
# budget: large (xhigh)
feature, refactoring: sonnet high
bug-fix: sonnet high
perf-issue: sonnet high
hillclimb: sonnet high
judgment and prose: opus xhigh
hardest tasks: opus xhigh
how explorer: sonnet high
how explainer: opus xhigh
why investigators: sonnet high
why synthesizer: opus xhigh
reflect tooling: sonnet high
reflect judgment, divergent, synthesizer: opus xhigh
arena runners: opus xhigh, sonnet high, haiku, fable
arena cross-judge pool: opus xhigh, sonnet high, haiku, fable
swarm workers: sonnet high
architect runners: opus xhigh, sonnet high, haiku, fable
interrogate reviewers: opus xhigh, sonnet high, haiku, fable
```

### 6. Confirm

Tell the user the rule was written and that it applies to new sessions. Re-running this skill updates it.

### 7. Offer a verification skill (optional)

Check whether the project has a way to drive the real app for proof (a `verify-*` skill, or an existing harness). If not, offer once: "want a project-local verification skill, so agents can drive the app the way a user does and prove changes work? I can generate one with /create-verification-skill." On yes, invoke `/create-verification-skill` (resolves wherever pstack is installed: workspace, user, or plugin). On no, move on without pushing.

### 8. Offer a formal verification skill (optional)

Check whether the project already has a formal verification skill (a project skill that runs a model checker, a proof, or another verifier against the code). If not, offer once: "want a formal verification skill, so agents can prove a key property of your code holds in every case in scope, not only the cases tests reach? I can generate one with /create-formal-verification-skill." On yes, invoke `/create-formal-verification-skill` (resolves wherever pstack is installed: workspace, user, or plugin). On no, move on without pushing.
