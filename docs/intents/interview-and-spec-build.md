# Interview and Spec build intent

## Problem

nstack's Interview playbook is six sizing bullets around Pocock's `grilling`. It does not say what each playbook's round must cover, what to look up instead of asking, or where the intent file lands for coordinators, Session pickup, or read-only work. nstack also has no playbook for a spec that splits into parallel tickets, since Pocock's pipeline was dropped for its conflicts with n-mode.

An earlier Claude Code port of pstack, which the operator supplied, already solves both with playbooks of its own.

## Outcome

- `interview.md` carries the port's per-playbook axes table, its red flags, and its rules for where the intent file lands. It keeps nstack's rules for a full-autonomy grant and for a design doc already in hand.
- `grilling` no longer ships. The playbook holds its loop: a design tree, the frontier asked in rounds, facts looked up rather than asked.
- Spec build returns as the port's self-contained playbook: no issue tracker, tickets landed fast-forward or by cherry-pick after their verify command passes, one review at the end.
- `node scripts/check.mjs` passes on 57 skills.

## Surfaces

- Anyone running `/nstack:n-mode`.
- `overlay/files/skills/n-mode/playbooks/`, patches `020`, `030`, and a new `050`.

## Constraints

- No name or link to the source port in public files.
- Spec build runs under `merge.ff only` and asks the user nothing mid-run.

## Out of scope

- The port's delegate consent gate, its FINISHED banner, its Codex runtime, and its `how` Critique mode.

## Decisions

The user's:

- Port the interview playbook and drop `grilling`.
- Restore Spec build from the port, adapted to nstack.
- Skip Critique mode.

Made for them:

- Spec build uses `nstack:n-agent-*`, reviews with `interrogate` and the intent file instead of `/code-review`, and drops the sentence that routes a declined delegation to Feature.
- Spec build implementers write the failing test first per **principle-test-behavior-not-implementation**, not pstack's bug-fix `tdd`.
- Spec build explore notes go to a directory outside the repo that the brief names.
- Outside a git repository, the intent file is written but not committed.
