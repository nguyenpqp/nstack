# nstack

nstack is a Claude Code plugin built from two upstreams and one set of local changes:

- [pstack](https://github.com/cursor/plugins/tree/main/pstack) by Lauren Tan, taken from its generated Claude Code tree at `harness/pstack/claude-code`.
- [Matt Pocock's skills](https://github.com/mattpocock/skills): grilling, the spec pipeline, design vocabulary, diagnosing-bugs, and code-review.
- The nstack layer: an interview gate, worktree and merge rules, effort-tiered agents, sticky mode, and a four-model review panel.

The upstream text is never edited by hand. A script pulls both upstreams, applies the local changes, and tells you which change broke. That keeps nstack current with upstream at the cost of one command.

## Install

```bash
/plugin marketplace add nguyenpqp/nstack
/plugin install nstack@nstack
```

Then run `/nstack:setup-nstack` to pick models per role, and `/nstack:n-mode` to start a task.

To try a local checkout, run `/plugin marketplace add E:\workspace\n-stack`.

## Layout

| Path | What it holds | Who writes it |
| --- | --- | --- |
| `upstream.json` | The two upstream repos, refs, and the paths to vendor. | You |
| `UPSTREAM.lock` | The commit SHA of each vendored upstream. | `sync.mjs` |
| `upstream/pstack/`, `upstream/mattpocock/` | Untouched snapshots of each upstream. | `sync.mjs` only |
| `overlay/selection.json` | Which skills ship, which are declined, and who wins each overlap. `mattpocock.rename` ships an included skill under another name when its name collides with pstack's. | You |
| `overlay/renames.json` | Entry-point renames, applied to paths and text. URLs are left alone. | You |
| `overlay/agents.json` | The effort tiers generated from `n-agent`. | You |
| `overlay/files/` | Files that nstack adds, copied over the build. | You |
| `overlay/patches/` | Small patches to upstream text, applied in name order. | `mkpatch.mjs` |
| `overlay/check-allow.json` | Upstream example links that are not real files. | You |
| `dist/` | The plugin Claude Code installs. Committed so installs need no build. | `build.mjs` |

## Update from upstream

```bash
node scripts/sync.mjs
```

The script fetches both upstreams, rewrites `upstream/` and `UPSTREAM.lock`, rebuilds `dist/`, and runs the check. It prints only what needs you:

- **Overlay items that need a human.** A patch that no longer applies, or a rename whose source upstream removed. The build stops with exit code 1.
- **Upstream changed under the overlay.** An upstream file that a patch edits or an overlay playbook wraps has changed. The patch may still apply and say the wrong thing, so re-read it.
- **Overlap pairs whose upstream side changed.** Re-read both sides and confirm the winner in `overlay/selection.json`.
- **New Matt Pocock skills.** Add each one to `include` or `decline`.
- **pstack skills added or removed.** New pstack skills ship automatically.

Review `git diff upstream/` for what upstream changed, then commit. To pin an upstream, pass its SHA, as in `node scripts/sync.mjs pstack=<sha>`.

## Change nstack

1. Run `node scripts/mkpatch.mjs start <nn-name>`. It builds `dist/` with every patch that sorts before `<nn-name>`, then applies `<nn-name>` itself if it exists.
2. Edit the files under `dist/`.
3. Run `node scripts/mkpatch.mjs save <nn-name>`. It writes `overlay/patches/<nn-name>.patch` and rebuilds with every patch.

Keep one concern per patch, so a sync failure names the concern that broke. To repair a patch that no longer applies, run the same two commands. `start` applies what it can and leaves `.rej` files for the hunks that failed. Finish those by hand and delete the `.rej` files before `save`.

Put a whole new file in `overlay/files/`. The build refuses an overlay file that would replace an upstream file, because a replaced file never receives upstream fixes. When an overlay file wraps an upstream skill, add the pair to `wraps` in `overlay/selection.json`, so sync tells you when that skill changes.

`node scripts/check.mjs` fails on a dangling link, a missing skill or agent reference, or a name that the renames should have removed.

## Credits and license

pstack is MIT, copyright Lauren Tan. Matt Pocock's skills are MIT, copyright Matt Pocock. Both licenses ship in `dist/licenses/`.
