# Interview axes

One row per execution playbook, read one row at a time by `../playbooks/interview.md`.

*Build and change*

| Playbook | Frontier must cover | Dispatch, never ask | Confirmation must name |
|---|---|---|---|
| Feature | User-visible behavior and its edges (empty, max, concurrent, offline). Which flow it extends, replaces, or sits beside. The data shape per **principle-model-the-domain**. The interface and its callers. Failure modes. Migration of existing data and callers. | Call sites of the flow. How the repo does this already. Existing coverage. | The behavior, the data shape, what is out of scope. |
| Spec build | The spec's outcome. Tickets as vertical slices, each demoable and sized to one fresh context. Blocking edges that are real gates. Files two tickets both touch. Each ticket's verify command, and checks a worktree cannot run. | How the repo splits similar work. Shared hot spots. Test and typecheck commands. | The ticket graph with blocking edges and write scopes, which step 1 writes to `<root>/.nstack/intents/<slug>-tickets.md` and the intent names by path, and what is out of scope. |
| Bug fix | The reproduction: input, environment, expected, observed. Blast radius. Root cause versus symptom, and the fix site. Sibling call sites with the same defect. Urgency. | `git log` over the implicated files. Existing coverage. Prior reports. | The reproduction, the fix site, the regression test. |
| Refactoring | The behavior held invariant, checkably. Call sites including tests, docs, and dynamic references. One sweep or safe incremental steps. Public API breakage. What is left alone. | Every call site, string-based and reflective included. Coverage. Exported or internal. | The invariant, the evidence it holds, what is left alone. |
| Perf issue | Metric, surface, workload. What is fast enough. Whether the slow work can be deleted. Acceptable regressions elsewhere. | The baseline trace and numbers. The hot path. Whether a control skill captures the surface. | The metric, the target, the trace's surface. |
| Hillclimb | One metric and its direction. A stop predicate pairing a target with a floor on attempts. A workload that reproduces the complaint. The regression gate. The budget. | The baseline. Any harness. Whether a case reproduces the complaint. | The metric, the stop predicate, the frozen harness command, the regression gate. |
| Visual parity | The baseline and whether it is authoritative. Which states and viewports. Diff tolerance. Component order and exclusions. | The component inventory. Any screenshot harness. Shared primitives. | The baseline, the state matrix, the tolerance, the anti-shortcut clauses. |
| Prototype | The one decision the sketch settles. Variants that differ meaningfully. The deciding observation. When it is enough. Where the throwaway lives. | Prior art in and out of the repo. The lightest honest stack. | The decision, the variants, the deciding observation, the throwaway location. |
| Authoring a skill | The decision it changes, for whom. New or an edit. Model-invocable or explicit-only. What it refuses. Where it lives. | Overlapping skills. The repo's SKILL.md conventions. Existing coverage of the workflow. | The decision it changes, its trigger words, its scope boundary. |

*Read-only and diagnosis*

| Playbook | Frontier must cover | Dispatch, never ask | Confirmation must name |
|---|---|---|---|
| Investigation | The decision the answer feeds, and who makes it. What evidence settles it. The confidence bar. Recommendation or findings only. | Nearly everything: code, history, docs, issues, runtime. | The question, the evidence bar, whether you owe a judgment. |
| Runtime forensics | The symptom, observably. Surface and process. The trigger. Whether a fix follows. | How to launch and instrument the surface. Prior reports. | The symptom, the capture plan, that the deliverable is a diagnosis. |
| Trace forensics | The artifact and its question. Whether a paired capture exists. Whether symbols should resolve. What follows the cause. | The artifact's format and size. Tooling that reads it. | The artifact path, the question, whether a paired capture confirms it. |
| Eval | The variant under test and what success is. Candidate count and models. What promoting the winner means. | The variant's text. Eval scaffolding. Available models. | The variant, the rubric, the candidate count, the blinding rules. |

*Plans and long-running programs*

| Playbook | Frontier must cover | Dispatch, never ask | Confirmation must name |
|---|---|---|---|
| Multi-phase plan | Phase boundaries and what each proves. Which phases block. Who runs it after. What stays out. | The architecture. Prior plans. Whether a plan is warranted at all. | The phases in order, each closing gate, what is out of scope. |
| Autonomous run | A checkable exit predicate. Authority while the user is away. What it stops for anyway. Budget and wake mechanism. | The state of the work. Whether an event can be watched. | The predicate, the stop lines, the wake mechanism. |
| Autopilot-full | The queue. Items the operator keeps. Each owner's merge authority. The stop signal mid-flight. | PR state per item. CI shape. The verification surface. | The items, the operator-held items, the merge authority, the stop signal. |
| Autopilot-stack | The queue and its order. Whether the chain stays linear. The operator's gates. The stop signal. | Stack topology. PR state per item. | The chain order, the gates, that nothing ships without the operator. |
| Session pickup | Which trail is authoritative. How much prior design still binds. What changed since the handoff. | Transcript, branch, PR state, diff since the handoff. | The resume point, what you inherit, what you re-decide. |

*Operations*, settled by one question or none.

| Playbook | Frontier must cover | Dispatch, never ask | Confirmation must name |
|---|---|---|---|
| Babysit | Which mode, per its first rule. Which PR or stack. Where the human's line begins. | PR and CI state. Open threads. | The mode, the target, the stop line. |
| Shipping | Which stack. What counts as verified. The ceiling. | Per-PR state. Recorded verdicts. | The stack root, the verification surface, the ceiling. |
| Pause safely | Whether anything in flight must finish first. | What is uncommitted or mid-flight. | The resume point. |
| Worktree cleanup | How aggressive. Whether worktrees with uncommitted work may go. Which repos. | The audit output. Merge state, age, which chats touch each. | The buckets to delete, what is spared. |
