# Claude Code only intent

## Problem

nstack ships pstack's Claude Code tree, which keeps Cursor names (`Task`, `AskQuestion`, `.cursor/skills/`, `~/.cursor/rules/*.mdc`) and asks the agent to map each one through the adapter. The team uses Claude Code only, so every mapped name is a lookup the agent can get wrong, and `make-bot-ui` serves a Cursor product that Claude Code cannot reach.

## Outcome

- `make-bot-ui` no longer ships. Patch `008-drop-make-bot-ui` removes the two links to it.
- The build rewrites the common Cursor names to Claude Code names in every `.md` file except the adapter, through `renames.json` `claudeCode`. The check fails on a leftover.
- `node scripts/build.mjs` passes on 56 skills.

## Surfaces

- Anyone running nstack skills in Claude Code.
- The maintainer running `sync.mjs` and `mkpatch.mjs`.

## Constraints

- No new patch on pstack text for the rewrite, so sync stays cheap.
- Patch context stays upstream text. The rewrite runs after the patches and only on a full build.

## Out of scope

- Rewriting pstack prose for Claude Code by hand.
- Model slugs. The adapter keeps mapping them, because a rewrite would break the four-model panel row and the `setup-nstack` budget ladder.
- Transcript paths, subagent fields, and Cursor-only features, which need the adapter's explanations.

## Decisions

The user's:

- Claude Code only. Take the cheap route: rewrite names at build time, drop `make-bot-ui`, keep the adapter.

Made for them:

- `automate-me` and `poteto-help` stay. Both run only when the user types them, and both work through the adapter.
- The rewrite list covers names that map one to one. Anything that needs judgment stays in the adapter.
