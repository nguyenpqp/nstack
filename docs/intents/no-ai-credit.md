# No AI credit intent

## Problem

Claude Code ends every commit message with a `Co-Authored-By: Claude ...` trailer and every PR description with a "Generated with Claude Code" line. The user asked "thêm rule commit không credit AI agent, ví dụ "Author by ..."" and then made clear the rule belongs in the nstack plugin.

## Outcome

- Patch `140-no-ai-credit` adds the rule in two places. `n-mode/SKILL.md` gets a trigger line that every run and every `n-agent` reads. `playbooks/opening-a-pr.md` gets one sentence in **Commits.**, where commit and PR style lives.
- `node scripts/build.mjs` passes, the check included.

## Surfaces

- Anyone who commits or opens a PR through an n-mode run. Their commits and PRs carry no AI credit.
- The maintainer running `sync.mjs`, who now carries one more patch.

## Constraints

- Upstream text stays untouched. The rule lives in `overlay/` only.
- The commit author stays the configured git user.

## Out of scope

- Commits made outside n-mode, such as through other nstack skills or plain sessions.
- Turning off the harness attribution itself. Only `"attribution": {"commit": "", "pr": ""}` in the user's `settings.json` does that. A skill line can lose to the harness reminder.
- Rewriting existing commits that carry the trailer.

## Decisions

The user's:

- Put the rule in the nstack plugin.

Made for them:

- Number the patch `140`, after every other patch. Patch `120-claude-code-tools` rewrites the lines next to the new text, so an earlier number breaks it.
- Ban the `Co-Authored-By` trailer, "Generated with", "Authored by", and 🤖 lines by name, since those are the forms the harness and agents use.

## Open questions

- None.
