# nstack intent

## Problem

A hand port of a pstack snapshot drifts behind upstream. Every upstream update then needs a manual diff.

## Outcome

nstack is a Claude Code native plugin built from pstack, Matt Pocock's skills, and the nstack layer. One command, `node scripts/sync.mjs`, pulls both upstreams, rebuilds the plugin, and lists only what needs a human: patches that no longer apply, and overlap pairs whose upstream side changed.

## Surfaces

- The operator, who installs nstack through `/plugin marketplace add` and runs sync by hand.
- Claude Code, which loads `dist/` as the plugin `nstack`.
- Upstream `cursor/plugins` at `harness/pstack/claude-code`, and upstream `mattpocock/skills`.

## Constraints

- `upstream/` is never edited by hand. Only `scripts/sync.mjs` writes it.
- Every nstack change lives in `overlay/`: new files, small anchored patches, `renames.json`, `selection.json`.
- The build fails and names the patch when a patch does not apply.
- Both upstream licenses (MIT, Lauren Tan and Matt Pocock) ship in `dist/` and the README credits both.

## Out of scope

- Codex and Cursor builds.
- A session-start routing hook.
- A delegation consent gate, the FINISHED banner, and the `how` Critique mode.
- A scheduled GitHub Action.
- Pocock's deprecated and in-progress skills.

## Decisions

Theirs:

- Vendor plus overlay. Manual sync.
- pstack base is upstream's `harness/pstack/claude-code` tree.
- Pocock groups: interview (grilling, grill-me), spec pipeline (to-spec, to-tickets, implement-spec), design vocabulary (domain-modeling, codebase-design, improve-codebase-architecture), debug and review (diagnosing-bugs, code-review). Superseded by `pstack-baseline.md`, which ships only grilling and diagnosing-bugs. `interview-and-spec-build.md` drops grilling too.
- Overlaps resolve per pair with pstack as default. `pstack-baseline.md` makes pstack win every overlap.
- Rename entry points only: `poteto-mode` to `n-mode`, `poteto-agent` to `n-agent`, `setup-pstack` to `setup-nstack`.
- nstack layer: interview gate, worktree and merge rules, effort-tiered agents, sticky mode, 4-model review panel.
- Models: `sonnet` for code, `opus` for judgment and prose, panel `opus`, `sonnet`, `haiku`, `fable`.
- Distribution: a GitHub repo acting as its own marketplace, `dist/` committed.
- Location: any local checkout, added with `/plugin marketplace add ./`.

Made for them:

- The interview playbook wraps Pocock's `grilling` instead of a copied interview playbook, so grilling updates flow in on sync. Replaced by a self-contained playbook in `interview-and-spec-build.md`.
- The spec build playbook wraps `to-spec`, `to-tickets`, and `implement-spec` plus the worktree rules. Dropped by `pstack-baseline.md` with the pipeline, and restored without Pocock by `interview-and-spec-build.md`.
- Pocock's `code-review` stays as `nstack:code-review`. Dropped by `pstack-baseline.md`. `interrogate` reviews against the intent file instead.
- `setup-matt-pocock-skills` ships, because the spec pipeline and code-review need its issue-tracker config. Dropped by `pstack-baseline.md` with both.
- Tooling is Node `.mjs`, matching upstream's generator.

## Open questions

- The GitHub owner for the marketplace repo. Resolved: `nguyenpqp`.
