# Interview axes

One row per execution playbook, read by the Interview playbook (`../playbooks/interview.md`). Pull only the row you need.

Every playbook has a row. Find the one you named in step 2 and cover its frontier column before you stop asking.

*Build and change*

| Playbook | Frontier must cover | Dispatch, never ask | Confirmation must name |
|---|---|---|---|
| Feature | User-visible behavior and its edges (empty, max, concurrent, offline). Which existing flow this extends, replaces, or sits beside. The data shape and its organizing structure per **principle-model-the-domain**. The interface and who calls it. Failure modes. Migration for existing data and callers. | Call sites of the flow being changed. How this repo already does this kind of thing. Existing coverage over the surface. | The behavior, the data shape, and what is out of scope. |
| Spec build | The outcome of the whole spec. The tickets as vertical slices, each demoable alone and sized to one fresh context. The blocking edges, each one a real gate rather than a preferred order. Files or names two tickets would both touch. Each ticket's verify command, and which checks need local state a worktree lacks. | How the repo already splits similar work. Shared hot spots (registries, catalogues, shared types). The test and typecheck commands. | The ticket graph with its blocking edges and each ticket's write scope, which step 1 writes to `<root>/.nstack/intents/<slug>-tickets.md` and the intent names by path, and what is out of scope. |
| Bug fix | The exact reproduction, with input, environment, expected, observed. Blast radius, who and since when and how often. Root cause versus symptom, and whether the fix belongs at the reported site or upstream. Whether sibling call sites carry the same defect. Urgency, hotfix or backport or next release. | `git log` over the implicated files. Existing coverage. Whether a similar bug was filed before. | The reproduction, the fix site, and the regression test that proves it. |
| Refactoring | The behavior contract held invariant, stated checkably. The call-site inventory including tests, docs, and dynamic references. One sweep or incremental steps, and where the intermediate states are safe. Public API breakage. What is deliberately left alone. | Every call site, including string-based and reflective ones. Coverage over the surface being moved. Whether the symbol is exported or internal. | The invariant, the evidence that behavior is unchanged, and what is left alone. |
| Perf issue | Which metric, on which surface, under which workload. What counts as fast enough. Whether the slow work can be deleted instead of optimized. Which regressions elsewhere are acceptable in trade. | The baseline trace and current numbers. Where the hot path lives. Whether a control skill can capture the surface. | The metric, the target, and the surface the trace comes from. |
| Hillclimb | The one metric and the direction that counts as better. The stop predicate, pairing a target with a floor on attempts. The realistic workload that reproduces the complaint. The regression gate that must stay green. The run's budget. | The current baseline. Any existing harness. Whether a case reproduces the complaint at all. | The metric, the stop predicate, the frozen harness command, and the regression gate. |
| Visual parity | Which implementation is the baseline, and whether it is authoritative. Which states and viewports count. The diff tolerance. Component order, and what is excluded. | The component inventory. Any existing screenshot harness. Which primitives are shared. | The baseline source, the state matrix, the tolerance, and the anti-shortcut clauses. |
| Prototype | The single decision this sketch exists to settle. Which variants differ meaningfully. What observation decides between them. What "enough" looks like so the sketch stops. Where the throwaway lives. | Prior art for this interaction, inside the repo and out. The lightest stack that renders the question honestly. | The decision, the variants, the deciding observation, and the throwaway location. |
| Authoring a skill | What decision the skill must change, and for whom. New skill or an edit to one that exists. Model-invocable or explicit-only. What it must refuse to do. Where it lives. | Skills that already overlap. This repo's SKILL.md conventions. Whether the workflow is covered somewhere already. | The decision it changes, its trigger words, and its scope boundary. |

*Read-only and diagnosis*

| Playbook | Frontier must cover | Dispatch, never ask | Confirmation must name |
|---|---|---|---|
| Investigation | What decision the answer feeds, and who makes it. What evidence would settle it. The confidence bar, a quick read or something you would bet a release on. Whether they want a recommendation or only findings. | Nearly everything. Code paths, git history, docs, issue history, runtime behavior. | The question restated, the evidence bar, and whether you owe a judgment. |
| Runtime forensics | The symptom in observable terms. Which surface and which process. How it gets triggered. Whether a fix follows, or the diagnosis is the whole deliverable. | How to launch and instrument that surface. Prior reports of the same symptom. | The symptom, the capture plan, and that the deliverable is a diagnosis. |
| Trace forensics | Which artifact, and the question it must answer. Whether a paired before-and-after capture exists. Whether symbols are expected to resolve. What happens once the cause is known. | The artifact's format and size. The tooling that reads it. | The artifact path, the question, and whether a paired capture can confirm it. |
| Eval | Which variant is under test, and what behavior counts as success. How many candidates, on which models. What promoting the winner would mean. | The current variant's text. Existing eval scaffolding. Which models are available. | The variant, the rubric, the candidate count, and the blinding rules. |

*Plans and long-running programs*

| Playbook | Frontier must cover | Dispatch, never ask | Confirmation must name |
|---|---|---|---|
| Multi-phase plan | The phase boundaries, and what each phase proves. Which phases block the rest. Who runs the plan afterwards. What stays out entirely. | The current architecture. Prior plans in the repo. Whether the change is small enough that no plan is warranted. | The phases in order, the gate closing each one, and what is out of scope. |
| Autonomous run | The exit predicate, stated checkably. What authority the run holds while the user is away. What it must stop for anyway. Budget, and the wake mechanism. | The current state of the work. Whether an event (CI, a merge, a ref) can be watched. | The predicate, the stop lines, and the wake mechanism. |
| Orchestrate | The program's outcome, and how it is measured. Decomposition into units. Check-in cadence. Merge authority. The budget ceiling. | The repo's landing process. Current stack state. Whether a queue already exists. | The outcome, the units, the cadence, the authority limits, and the ceiling. |
| Autopilot-full | The queue's items. Which items stay the operator's own. What merge authority each owner holds. The stop signal, and what it means mid-flight. | PR state per item. The CI shape. Which surface verification runs against. | The item list, the operator-held items, the merge authority, and the stop signal. |
| Autopilot-stack | The queue and its order. Whether the chain must stay linear. The operator's gates. The stop signal. | Current stack topology. PR state per item. | The order of the chain, the gates, and that nothing ships without the operator. |
| Session pickup | Which trail is authoritative when several exist. How much of the prior design is still binding. What changed underneath since the handoff. | The transcript, the branch, the PR state, the diff since the handoff. | The resume point, what you inherit unchanged, and what you are re-deciding. |

*Operations*

These four are usually settled by one question or none. Ask what the row names and get on with it. Do not manufacture a round.

| Playbook | Frontier must cover | Dispatch, never ask | Confirmation must name |
|---|---|---|---|
| Babysit | Which mode, per that playbook's step 1. Which PR or stack. Where the human's line begins. | PR and CI state. Open review threads. | The mode, the target, and the stop line. |
| Shipping | Which stack. What evidence counts as verified. The ceiling above which nothing lands. | Per-PR state. Any verdicts already recorded. | The stack root, the verification surface, and the ceiling. |
| Pause safely | Almost nothing. Whether anything in flight must finish before the stop. | What is uncommitted, and what is mid-flight. | The resume point. |
| Worktree cleanup | How aggressive to be. Whether worktrees holding uncommitted work may go. Which repos are in scope. | The audit script's output. Merge state, age, and which chats still touch each worktree. | The buckets to delete, and what is spared. |

**Opening a PR** runs at the end of another playbook and inherits that playbook's confirmed design, so it has no axes of its own. **figure-it-out** designs a bespoke playbook; interview against the axes of whatever the work most resembles, and say which row you borrowed.

The frontier is small on purpose for Investigation and for the operations rows. Almost everything there is a fact, and facts are yours.
