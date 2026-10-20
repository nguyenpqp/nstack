---
name: maintain-nstack
description: Pull new pstack and Matt Pocock upstream changes into nstack and resolve what they break or change. Use for "sync nstack", "update nstack from upstream", or periodic nstack maintenance.
---

# Maintain nstack

nstack is pstack plus three Matt Pocock skills plus a thin overlay. Your job is to keep it current with both upstreams while every overlay change still says something true. The scripts do the mechanics, and the README's "Update from upstream" and "Change nstack" sections explain them. This skill covers the judgment.

## Invariants

- **pstack is the baseline and wins every overlap.** A Pocock skill ships only when pstack has no equivalent skill, playbook, or principle, it runs without an issue tracker, and every skill it calls through the Skill tool also ships. The reasoning lives in `docs/intents/pstack-baseline.md`.
- **The nstack layer stays**: the interview gate, worktree rules, effort tiers, sticky mode, and dispatch labels. Keep it working on top of whatever upstream changes.
- **`upstream/` and `dist/` are generated.** Every change goes in `overlay/`: patches through `mkpatch`, whole new files in `overlay/files/`, ship decisions in `overlay/selection.json`.
- **One concern per patch and per commit.** Every commit builds and passes the check.

## Loop

1. Run `node scripts/sync.mjs`. If it reports no upstream change and `git status` is clean, say so and stop. A dirty `dist/` with no upstream change means someone edited `overlay/` without rebuilding, so commit that rebuild first.
2. Work through each item the report lists. Treat it as a starting list, not the whole truth.
   - **A patch no longer applies.** Repair it with `mkpatch start` and `save`, keeping what the patch was for. If upstream now does what the patch did, delete the patch. A repair can shift the context that a later patch anchors on. The rebuild after `save` names that patch, so repair it next.
   - **Upstream changed under a patch or a wrapping overlay file.** Read the upstream diff beside the patch. A patch that applies cleanly can still be wrong or unneeded.
   - **An overlap pair changed.** Re-read both sides. pstack keeps the slot unless it lost the capability.
   - **A new Pocock skill, or an included one that moved or vanished.** Apply the keep rule. When in doubt, decline it.
   - **A new pstack skill.** It ships automatically. Check that it does not collide with a kept Pocock skill or with the nstack layer by name, trigger, or routing.
   - **A removed pstack skill, or a `selection.json` path that is gone.** Find what in `overlay/` still points at it and fix that.
3. Read `git diff upstream/` yourself for drift that the report cannot see:
   - Cursor-only names that need a row in `docs/harness/claude-code.md`.
   - New or renamed model slugs, which patch `070-models` maps.
   - Edits to pstack's mode skill (`n-mode` in `dist/`, `poteto-mode` upstream) that contradict the nstack layer.
   - Renamed entry points, which `overlay/renames.json` must follow.
4. Rebuild until `node scripts/build.mjs` passes, the check included. Fix a check failure at its cause. Use `overlay/check-allow.json` only for upstream example links and names that are not meant to resolve.
5. Record any decision that changes what ships or how the nstack layer behaves as an intent in `docs/intents/`, in the shape the existing ones use. A routine repair needs only a commit body that says why.
6. Commit with Conventional Commits. Put the upstream bump (`upstream/`, `UPSTREAM.lock`, `dist/`) and the repairs it forces in one commit, so it builds. Give each separable decision its own commit after that. CI fails when the committed `dist/` differs from a fresh build.

## Ask the human before you

- ship or drop a Pocock skill against the keep rule, or change the nstack layer;
- accept an upstream license change;
- delete a patch whose purpose you cannot confirm;
- push. The user pushes.

## Done

The build and the check pass, `git status` is clean, and your reply covers:

- each upstream's old and new SHA;
- what changed upstream that matters to nstack;
- every decision, split into the ones you made and the ones waiting on the user;
- anything still open.
