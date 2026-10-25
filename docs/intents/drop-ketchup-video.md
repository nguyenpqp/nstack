# Drop ketchup-video intent

## Problem

pstack `99b609a` adds `ketchup-video`, which catches the user up like `/ketchup` but as a short silent video of slides. Its reply embeds the video, which a Claude Code terminal cannot play. The user asked "ketup-video là skill gì vậy, có dành cho code không" and, once told it is a catch-up report rather than a code tool, chose to drop it.

## Outcome

- `ketchup-video` no longer ships. `overlay/selection.json` lists it in `pstack.exclude`.
- Patch `009-drop-ketchup-video` removes the two links to it, in `nstack-help` and `docs/guide/10-recipes-and-pitfalls.md`.
- `node scripts/build.mjs` passes, the check included.

## Surfaces

- Anyone running nstack skills in Claude Code, who loses `/nstack:ketchup-video`. `/nstack:ketchup` still ships.
- The maintainer running `sync.mjs`, who now carries one more patch.

## Constraints

- Upstream text stays untouched. The removal lives in `overlay/` only.

## Out of scope

- `/ketchup` and every other change in the `99b609a` bump.
- Adapting `ketchup-video` to Claude Code, such as giving the video's path in place of embedding it.

## Decisions

The user's:

- Exclude `ketchup-video` rather than ship it as-is or patch it to give the video's path.

Made for them:

- Number the patch `009`, next to `008-drop-make-bot-ui`, since both drop a pstack skill.

## Open questions

- None.
