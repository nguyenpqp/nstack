# How nstack is built

nstack never edits upstream text by hand. `upstream/` holds untouched snapshots, `overlay/` holds every local change, and `node scripts/build.mjs` combines them into `dist/`, the plugin Claude Code installs. The README's Layout table says what each path holds. This page says how the pieces fit, and why the order matters.

## The scripts

| Script | Job | Network |
| --- | --- | --- |
| `scripts/sync.mjs` | Fetch both upstreams, rewrite `upstream/` and `UPSTREAM.lock`, rebuild, and report what needs a human. | Yes |
| `scripts/build.mjs` | Assemble `dist/` from `upstream/` and `overlay/`, then run the check. | No |
| `scripts/mkpatch.mjs` | Make or repair one patch against the patches that sort before it. | No |
| `scripts/check.mjs` | Fail on what would break or mislead in `dist/`. | No |

CI rebuilds `dist/` on every push and pull request, and fails when the result differs from the commit or the check fails.

## Build order

`build.mjs` deletes `dist/`, then runs these steps in order:

1. **Copy pstack.** `skills/`, `agents/`, and `docs/`, minus `selection.json` `pstack.exclude` and minus `docs/harness`, upstream's Cursor-to-Claude-Code adapter.
2. **Copy Pocock's skills.** Each path in `mattpocock.include`, minus its `agents/` folder, which is Codex metadata. A name that collides with a pstack skill stops the build.
3. **Copy the licenses** to `dist/licenses/`.
4. **Apply `renames.paths`**, such as `skills/poteto-mode` to `skills/n-mode`.
5. **Apply `renames.text`** to every text file except the licenses.
6. **Copy `overlay/files/`.** A file that would replace an upstream file is a failure, because a replaced file never receives upstream fixes.
7. **Apply `overlay/patches/`** in name order with `git apply`.
8. **Apply `renames.claudeCode`** to every `.md` file. Only a full build runs this step.
9. **Copy `overlay/plugin.json`** to `dist/.claude-plugin/plugin.json`.
10. **Run `check.mjs`.**

The build gathers failures from steps 2, 4, 6, and 7 and prints them together, so one run names every patch that broke. Rewrites skip text inside URLs.

### Why the renames sit on both sides of the patches

Step 5 runs before the patches and step 8 runs after them, so a patch's context holds nstack's names (`n-mode`) and upstream's Cursor names (`Task`). Two things follow:

- An upstream edit to a line that `claudeCode` rewrites does not break a patch unless the patch anchors on that line.
- `mkpatch start` runs a partial build that stops before step 8, so `dist/` shows Cursor names while you edit. Edit them as they are, because that is the text the patch applies to.

`mkpatch` diffs each patch against a build of the patches that sort before it, so later patches never leak into its context. This makes patch order part of the design. A patch that rewrites lines next to another patch's anchor has to sort after it.

## Patch numbers

Patches sort as strings, so names keep three digits. The bands are a convention, and a later patch may sit in a higher band only because it has to apply last.

| Band | Holds |
| --- | --- |
| `00x` | Identity, install source, and dropped skills |
| `01x`–`09x` | The first nstack layer: sticky mode, interview, worktree, routing |
| `10x`–`13x` | Claude Code adaptation, one concern each |
| `14x`–`19x` | Later layer rules: no AI credit, backlog, language, effort budgets, the `.nstack` folder |
| `20x` and up | The role lines behind the model table, and the pointer to it |

The index in [decisions.md](decisions.md#patch-index) names each patch's concern.

## Where the nstack layer lives

| Surface | What it holds |
| --- | --- |
| `overlay/files/skills/n-mode/playbooks/interview.md` | The Interview playbook |
| `overlay/files/skills/n-mode/references/interview-axes.md` | What each playbook's round must cover, read one row at a time |
| `overlay/files/skills/n-mode/playbooks/spec-build.md` | The Spec build playbook |
| `overlay/files/skills/n-mode/references/session-backlog.md` | The backlog rules, read only by the chat that runs n-mode, so delegates do not pay for them |
| `overlay/files/skills/n-mode/references/model-table.md` | The model and effort of every job, read only by an agent that spawns |
| `overlay/files/skills/n-mode/references/worktree.md` | Run files, opening a worktree, and merging back, read only by the agent that does those |
| Patches to `skills/n-mode/SKILL.md` | Routing, sticky mode, the worktree rules a delegate needs, and pointers to the reference files |
| Patches to `skills/setup-nstack/SKILL.md` | The role lines and budget that write `~/.claude/rules/nstack-models.md` |

Every delegate reads `n-mode/SKILL.md` in full, so text there costs context on every spawn. Put a rule that only the chat needs in a reference file.

A user's `~/.claude/rules/nstack-models.md` overrides the plugin's role lines until they rerun `/nstack:setup-nstack`, so a change to a default reaches existing users only then.

## What sync watches

`sync.mjs` compares the old and new snapshots and reports only what touches the overlay:

- Upstream files that a patch edits, or that `selection.json` `wraps` lists.
- Overlap pairs in `selection.json` whose upstream side changed.
- Pocock skills that are neither included nor declined, and included ones upstream no longer lists.
- `wraps` and `overlaps` paths missing upstream.
- pstack skills added or removed.

`wraps` watches `docs/harness/claude-code.md` even though it does not ship, because a new row there names a Cursor name nstack must now rewrite.

## What the check does not cover

The check reads `dist/` for structure: links, skill and agent references, leftover names, frontmatter fields, and `claude plugin validate` when the CLI is on PATH. It cannot tell whether a patch still says something true. That is what the review steps in [maintaining.md](maintaining.md) are for. It also does not read this folder.
