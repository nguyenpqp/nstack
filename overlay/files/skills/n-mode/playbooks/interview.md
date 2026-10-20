### Interview

**The confirmed design is the deliverable here, not code.** Interview the user until the frontier is empty, then hand the design to the execution playbook.

**When this runs.** Every task. Match the execution playbook first, then run this against its row in the axes below, before that playbook's step 1. The row sizes the round, so the Operations rows stay at one question or none. An explicit ask ("interview me", "grill me", "phỏng vấn") upgrades any row to a full frontier. The user opts out per request by saying so ("just pick and go"). Never opt out for them. A fork inside the round that an experiment could settle is not a question. Sketch it per **Prototype** and let the result answer it.

**What shrinks the round.** A full-autonomy grant ("going to bed", "run until done", "be fully autonomous") asks nothing. Write the intent from the request, with every decision in your list, and go on. A spec or design doc already in hand (a game design doc, a PRD, a ticket with acceptance criteria) is the answer sheet. Read it first. Ask only about its gaps, its contradictions, and what it leaves to engineering, and cite the section each question comes from.

**principle-never-block-on-the-human does not suppress this round, and neither does the trigger in `SKILL.md` that classifies an ask before it is made.** Both govern the middle of a run, where reversible work belongs off the human's queue. This is the start of the run, where the requirements are the human's to state. Both take full effect the moment the design is confirmed and execution starts. Say out loud that you are in Interview, so the round is announced rather than silent.

**Hard gate.** No code, no scaffolding, no delegate that writes files, until the user has confirmed the design. Answered questions are not a confirmed design.

**Before step 1.** No code exists until the design is confirmed, so this playbook opens no worktree per the **Worktree** section of `SKILL.md`. Run every round from the main session. An `AskUserQuestion` raised inside a subagent never reaches the user, so a delegated interview is a silent no-op.

1. Read the project context first. Run `how` over the affected subsystem before the first round, so your questions rest on what the repo already does.
2. Name the execution playbook this task will land in, and open its row in the axes below. Every playbook has one. Two fit? Pick the primary, name the second out loud, and fold its axes in with a stated reason.
3. Build the design tree. Every decision branches into the decisions that hang off it. The **frontier** is every decision whose prerequisites are already settled.
4. Ask the whole frontier in one round, then stop and wait. A question whose answer depends on another question still open belongs to a later round. Each round of answers pushes the frontier outward. Recompute and ask again.
5. Deliver each round with `AskUserQuestion`. Your recommended answer is the first option, with `(Recommended)` appended to its label and the tradeoff in its description. Never author an "Other" option; the tool adds one. Frontier bigger than the tool's per-call limit? Issue the calls sequentially with nothing in between until the frontier is drained. That is still one round.
6. Fall back to markdown only for a question with no two-to-four enumerable answers, the open-ended kind ("walk me through the current billing flow", "paste the error"). Number those and give your recommended answer for each. A round may mix both.
7. Facts are yours. Decisions are theirs. Anything observable by reading or running something gets a subagent, never a question. Do not block on the subagent. Only the questions downstream of it wait; ask the rest of the frontier now.
8. Frontier empty means every branch visited and nothing silently assumed. Write the design summary carrying the sections the axes name, then ask the user to confirm it.
9. On confirmation, re-match the execution playbook against the design as confirmed, since the answers can move a task from one type to another. Copy its steps into the todo list verbatim, then stop before running them.
10. Commit the intent, then start step 1. A confirmed design that lives only in the chat dies at the next compaction, handoff, or reviewer. The worktree opens per the **Worktree** section of `SKILL.md`, and the intent file lands there alone as the run's first commit. Never-block and the AskUserQuestion trigger take full effect once that step 1 begins. Write the file to `docs/intents/<slug>.md`, where `<slug>` is the branch name with its Conventional Commits type stripped. Carry these sections and nothing else.
    - **Problem.** What is wrong today, in the user's own words. Quote them where the wording carries the point.
    - **Outcome.** What counts as done, stated so someone else could check it.
    - **Surfaces.** The users, callers, and systems this touches.
    - **Constraints.** What the design may not break, spend, or depend on.
    - **Out of scope.** What the round ruled out on purpose.
    - **Decisions.** Two lists, theirs and yours. The ones you made for them are the ones most likely to be wrong, so keep them separate.
    - **Open questions.** What is still unsettled, and what would settle each one.

    The axes row you interviewed against supplies the specifics. Its confirmation column names what this file must say for that playbook, so answer the row rather than restating it.

**Who writes the file.** Every row under *Build and change* except **Prototype**, whose sketch lives in a throwaway scratch dir and whose design belongs in the reply. Read-only rows open no worktree and produce no diff, so their intent stays in the reply too, and the four *Operations* rows skip the file outright. A run that never reaches a PR still keeps the file, because it is the first thing a pickup reads. Outside a git repository, write the file but do not commit it, and say so once in the reply.

**Where it lands when no worktree is yours.** The coordinator rows (**Multi-phase plan**, **Orchestrate**, **Autopilot-full**, **Autopilot-stack**) author briefs and open no worktree, so the intent rides the first unit's worktree and lands in that unit's PR. Never commit it on the root checkout, which stays on the integration branch and holds no feature work. **Session pickup** inherits the file the prior run already committed, so amend that one rather than opening a second.

**Amending it.** The intent is the design as confirmed, not a prediction that must come true. When execution finds a better shape, amend the file in the same PR that changes course and say what moved. The **interrogate** skill takes it as the intent when it reviews the final diff, so an intent left describing the old design is the failure, not the change of course itself.

**Axes by execution playbook**

Every playbook has a row. Find the one you named in step 2 and cover its frontier column before you stop asking.

*Build and change*

| Playbook | Frontier must cover | Dispatch, never ask | Confirmation must name |
|---|---|---|---|
| Feature | User-visible behavior and its edges (empty, max, concurrent, offline). Which existing flow this extends, replaces, or sits beside. The data shape and its organizing structure per **principle-model-the-domain**. The interface and who calls it. Failure modes. Migration for existing data and callers. | Call sites of the flow being changed. How this repo already does this kind of thing. Existing coverage over the surface. | The behavior, the data shape, and what is out of scope. |
| Spec build | The outcome of the whole spec. The tickets as vertical slices, each demoable alone and sized to one fresh context. The blocking edges, each one a real gate rather than a preferred order. Files or names two tickets would both touch. Each ticket's verify command, and which checks need local state a worktree lacks. | How the repo already splits similar work. Shared hot spots (registries, catalogues, shared types). The test and typecheck commands. | The ticket graph with its blocking edges and each ticket's write scope, which step 1 writes to `docs/intents/<slug>-tickets.md` and the intent names by path, and what is out of scope. |
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

**Red flags. Stop and recompute the frontier.**

| Thought | Reality |
|---|---|
| "I'll ask one question first" | One at a time is the slow path. Ask the whole frontier in one round. |
| "I'll ask everything at once" | A question downstream of an open one belongs to a later round. |
| "Markdown is faster than the tool" | Enumerable answers go through `AskUserQuestion`. Speed is not the predicate. |
| "Only four fit, the rest can wait" | Batch sequential calls. Leftover frontier is not a next round. |
| "Let me ask where that file lives" | Facts are yours. Dispatch a subagent. |
| "The subagent is still running, I'll wait" | Only the downstream questions wait. Ask the rest now. |
| "Frontier looks empty enough" | Empty means empty. Name every remaining branch first. |
| "They answered the last round, I can start" | The gate needs a confirmed design, not answered questions. |
| "Never-block says just decide it myself" | Never-block governs the middle of a run. This is its start. |
| "This task is too small to interview" | The axes row sizes the round, not your read of the task. Ops rows are one question or none. Every other row is a full frontier. |
| "I'll have the subagent ask them" | A subagent's question never reaches the user. Ask from the main session. |
| "The design is confirmed in the chat, that's enough" | Chat does not survive compaction, a handoff, or a reviewer. Commit `docs/intents/<slug>.md`. |
| "The build outgrew the intent, I'll explain it in the PR" | Amend the intent in the same PR. A file describing the old design teaches the next reader the wrong thing. |

**Reply:** the confirmed design, the decisions the user made and the ones you made for them, what is explicitly out of scope, the intent file path, and the execution playbook you are handing it to.
