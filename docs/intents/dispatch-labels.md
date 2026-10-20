# Dispatch labels intent

## Problem

The Claude Code CLI shows each subagent spawn as `<type>(<description>)`, and a `general-purpose` type reads `Agent`. The line never shows the model or the effort. The routed skills (`how`, `why`, `swarm`, `interrogate`, `reflect`) require `generalPurpose` by design, so their spawns show no type, model, or effort. `nstack:n-agent-*` spawns show the effort in the type name but not the model.

## Outcome

Every Agent call in an n-mode run opens its `description` with the model and effort, as in `opus xhigh: review diff`. The model is the `model` passed, or `inherit`. The effort is the `effort` passed, else the `n-agent` variant's, else the session's.

## Surfaces

- The operator, who reads the CLI spawn lines.
- `skills/n-mode/SKILL.md`, through `overlay/patches/080-dispatch-labels.patch`.

## Out of scope

- The `subagent_type` that routed skills prescribe.
- Worktree rules. A fetch-before-branch rule and a declare-write-paths rule were tried and dropped. The first conflicts with Merging back, and the second repeats "one writer per worktree or branch".
