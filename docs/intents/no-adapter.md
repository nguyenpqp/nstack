# No adapter intent

## Problem

Every nstack skill told the agent to read the Claude Code adapter once per session, and about 150 lines across the skills still named Cursor things: cloud agents, `readonly`, `environment: "cloud"`, `cursor-team-kit` control skills, `/deslop`, `create-skill`, Cursor transcript paths, and Cursor model slugs. In a long session, compaction drops the adapter from context, "once per session" stops the agent from reading it again, and from then on the agent reads Cursor names with no mapping. Subagents never read it at all. The `n-agent` copy-selection rule also pointed at a `.cursor-plugin/plugin.json` that nstack does not ship.

## Outcome

- `dist/` holds no Cursor name and no Cursor-only Agent field. `check.mjs` fails on any that a sync brings back, unless `overlay/cursor-allow.json` allows that text for that file.
- Upstream's `docs/harness/claude-code.md` no longer ships. Sync still watches it through `selection.json` `wraps`.
- The pointer sentence at the top of each skill becomes the one rule the adapter held that every skill needs: read another nstack skill's `SKILL.md` directly, because the Skill tool refuses them.
- Model values are Claude Code values (`opus xhigh`, `sonnet high`, `haiku`, `fable`). Panels default to those four entries, and the `setup-nstack` rule says how a value maps to `model` and `effort`.
- `poteto-help` ships as `nstack-help`.

## Constraints

- Patch context stays upstream text. Meaning changes live in four patches, one concern each: `100-claude-code-models`, `110-claude-code-agents`, `120-claude-code-tools`, `130-claude-code-help`.
- One-to-one swaps stay in `renames.json` `claudeCode`, so most upstream edits still need no patch repair.

## Out of scope

- Bugbot. It is a GitHub app that comments on PRs whatever editor opened them, so its triage text stays.
- Whether nested subagents work as `orchestrate` describes. The playbook keeps its depth rule.

## Decisions

The user's:

- Remove the adapter rather than reload it after compaction.
- Keep `poteto-help` and rename it `nstack-help`.

Made for them:

- A Cursor cloud agent maps to a subagent with `isolation: "worktree"`, and a read-only one to `subagent_type: "Explore"` with a brief that says not to edit files.
- `/deslop` maps to the built-in `/simplify` plus the strip list, the control skill to the project's own skill under `.claude/skills/`, and `create-skill` to `skill-creator`.
- Guide pages that told the user to install or run things in Cursor are rewritten for Claude Code. The Cursor automation pack section now says nstack ships no automations.
