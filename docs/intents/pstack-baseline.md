# pstack baseline intent

## Problem

nstack ships 12 of Matt Pocock's skills beside pstack. Most of them duplicate a pstack skill or playbook, and the spec pipeline (`to-spec`, `to-tickets`, `implement-spec`, `setup-matt-pocock-skills`) conflicts with n-mode. It merges in a way that `merge.ff only` refuses, it calls skills by names that resolve to other skills, it blocks on the user where n-mode has none, and it keeps a second copy of the requirements beside the intent file.

## Outcome

pstack is the baseline and wins every overlap. A Pocock skill ships only when pstack has no equivalent, it runs without an issue tracker, and every skill it calls also ships. `node scripts/check.mjs` passes on 58 skills.

Two Pocock skills ship:

- `grilling`, the base of the Interview playbook.
- `diagnosing-bugs`, whose phases 1 to 4 run across Bug fix steps 1 and 2.

## Surfaces

- Anyone running `/nstack:n-mode`.
- The maintainer running `sync.mjs`, who now sees changes to 2 Pocock skills instead of 12.

## Constraints

- `upstream/` untouched. One concern per patch.
- The nstack layer stays: interview gate, worktree rules, effort tiers, sticky mode, dispatch labels.

## Out of scope

- Pocock's `in-progress/` and `misc/` skills, which are outside his plugin manifest.
- Removing the `mattpocock.rename` support from the build. No skill uses it now.

## Decisions

The user's:

- Keep the nstack layer as is.
- Ship only `grilling` and `diagnosing-bugs`. Decline the rest, `code-review`, `improve-codebase-architecture`, `codebase-design`, `tdd`, `wizard`, `writing-for-agents`, and `to-questionnaire` included.
- Drop `domain-modeling`, which first shipped with this intent. It writes `GLOSSARY.md` and ADRs inline, before the Interview round has opened a worktree and inside read-only playbooks, and in nstack only `diagnosing-bugs` reads the glossary. pstack's `why` still reads any `docs/adr/` a repo keeps.

Made for them:

- The Spec build playbook goes with the pipeline. Multi-ticket work matches pstack's Multi-phase or multi-PR plan.
- Review before a PR runs `interrogate` with the intent file as its intent, in place of Pocock's `code-review`.
- Bug fix step 2 runs `diagnosing-bugs` phases 1 to 4 across steps 1 and 2, in its own patch, `065-diagnosis-loop`.
- This intent supersedes the Pocock groups decision in `n-stack.md`.
