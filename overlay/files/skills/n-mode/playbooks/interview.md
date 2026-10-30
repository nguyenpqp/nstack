### Interview

**The confirmed design is the deliverable here, not code.** Interview the user until the frontier is empty, then hand the design to the execution playbook.

**When this runs.** Every task. Match the execution playbook first, then run this against its row (see **Axes by execution playbook**), before that playbook's step 1. The row sizes the round, so the Operations rows stay at one question or none. An explicit ask ("interview me", "grill me", "phỏng vấn") upgrades any row to a full frontier. The user opts out per request by saying so ("just pick and go"). Never opt out for them. A fork inside the round that an experiment could settle is not a question. Sketch it per **Prototype** and let the result answer it.

**What shrinks the round.** A full-autonomy grant ("going to bed", "run until done", "be fully autonomous") asks nothing. Write the intent from the request, with every decision in your list, and go on. A spec or design doc already in hand (a game design doc, a PRD, a ticket with acceptance criteria) is the answer sheet. Read it first. Ask only about its gaps, its contradictions, and what it leaves to engineering, and cite the section each question comes from. A request that already states the change, its site, and its cause (a diagnosed bug, a mechanical rename, one flag on one command) answers most of its row the same way. Check the row's frontier against the request and the repo, and ask only what is still open and would change the diff. When nothing is, skip to step 8. The design summary and its confirmation are the whole round.

**Process is not a question.** The playbooks already decide the worktree and branch, how the work lands, the verification surface, the review passes, and whether to build tooling such as a control skill. Those calls are yours. Put them in your decisions list, never in a round.

**principle-never-block-on-the-human does not suppress this round, and neither does the trigger in `SKILL.md` that classifies an ask before it is made.** Both govern the middle of a run, where reversible work belongs off the human's queue. This is the start of the run, where the requirements are the human's to state. Both take full effect the moment the design is confirmed and execution starts. Say out loud that you are in Interview, so the round is announced rather than silent.

**Hard gate.** No code, no scaffolding, no delegate that writes files, until the user has confirmed the design. Answered questions are not a confirmed design.

**Before step 1.** No code exists until the design is confirmed, so this playbook opens no worktree per the **Worktree** section of `SKILL.md`. Run every round from the main session. An `AskUserQuestion` raised inside a subagent never reaches the user, so a delegated interview is a silent no-op.

1. Read the project context first. Run `how` over the affected subsystem before the first round, so your questions rest on what the repo already does.
2. Name the execution playbook this task will land in, and pull its row per **Axes by execution playbook** below. Every playbook has one. Two fit? Pick the primary, name the second out loud, and fold its axes in with a stated reason.
3. Build the design tree. Every decision branches into the decisions that hang off it. The **frontier** is every decision whose prerequisites are already settled.
4. Ask the whole frontier in one round, then stop and wait. A question whose answer depends on another question still open belongs to a later round. Each round of answers pushes the frontier outward. Recompute and ask again.
5. Deliver each round with `AskUserQuestion`. Your recommended answer is the first option, with `(Recommended)` appended to its label and the tradeoff in its description. Never author an "Other" option; the tool adds one. Frontier bigger than the tool's per-call limit? Issue the calls sequentially with nothing in between until the frontier is drained. That is still one round.
6. Fall back to markdown only for a question with no two-to-four enumerable answers, the open-ended kind ("walk me through the current billing flow", "paste the error"). Number those and give your recommended answer for each. A round may mix both.
7. Facts are yours. Decisions are theirs. Anything observable by reading or running something gets a subagent, never a question. Do not block on the subagent. Only the questions downstream of it wait; ask the rest of the frontier now.
8. Frontier empty means every branch visited and nothing silently assumed. Write the design summary carrying the sections the axes name, then ask the user to confirm it.
9. On confirmation, re-match the execution playbook against the design as confirmed, since the answers can move a task from one type to another. Copy its steps into the todo list verbatim, then stop before running them.
10. Write the intent, then start step 1. A confirmed design that lives only in the chat dies at the next compaction, handoff, or reviewer. Name the branch first, since the slug comes from it. Write the file to `<root>/.nstack/intents/<slug>.md`, where `<root>` is the root checkout and `<slug>` is the branch name with its Conventional Commits type stripped, per the **nstack folder** section of `SKILL.md`. The file never reaches a commit. The worktree then opens per the **Worktree** section of `SKILL.md`. Never-block and the AskUserQuestion trigger take full effect once that step 1 begins. Carry these sections and nothing else.
    - **Problem.** What is wrong today, in the user's own words. Quote them where the wording carries the point.
    - **Outcome.** What counts as done, stated so someone else could check it.
    - **Surfaces.** The users, callers, and systems this touches.
    - **Constraints.** What the design may not break, spend, or depend on.
    - **Out of scope.** What the round ruled out on purpose.
    - **Decisions.** Two lists, theirs and yours. The ones you made for them are the ones most likely to be wrong, so keep them separate.
    - **Open questions.** What is still unsettled, and what would settle each one.

    The axes row you interviewed against supplies the specifics. Its confirmation column names what this file must say for that playbook, so answer the row rather than restating it.

**Who writes the file.** Every row under *Build and change* except **Prototype**, whose sketch lives in a throwaway scratch dir and whose design belongs in the reply. Read-only rows open no worktree and produce no diff, so their intent stays in the reply too, and the four *Operations* rows skip the file outright. A run that stops before its merge still keeps the file, because it is the first thing a pickup reads.

**Who reads it.** The file sits at the root, outside every worktree, so each brief names its absolute path. The coordinator rows (**Multi-phase plan**, **Orchestrate**, **Autopilot-full**, **Autopilot-stack**) open no worktree and name no branch, so they write it there under a slug named from the task, and every unit's brief points at that one file. **Session pickup** inherits the file the prior run wrote, so amend that one rather than opening a second. **Opening a PR** carries its **Problem**, **Decisions**, and **Out of scope** into the PR body, and the file is deleted once its work lands, per the **nstack folder** section of `SKILL.md`, so the PR and the commits keep what outlives the run.

**Amending it.** The intent is the design as confirmed, not a prediction that must come true. When execution finds a better shape, amend the file when the course changes and say what moved. Later reviews and sessions read it as the design, so an intent left describing the old design is the failure, not the change of course itself.

**Axes by execution playbook.** Every playbook has a row in `../references/interview-axes.md`. Pull only yours with `grep '^| <Playbook> |' <n-mode dir>/references/interview-axes.md`, as in `grep '^| Bug fix |'`, plus any row step 2 folds in. A row has three cells. *Frontier must cover* is what the round must settle. *Dispatch, never ask* is what you look up instead. *Confirmation must name* is what the design summary must say. The Operations rows (Babysit, Shipping, Pause safely, Worktree cleanup) are usually settled by one question or none, so do not manufacture a round. **Opening a PR** has no row, because it inherits the design of the playbook it ends. **figure-it-out** borrows the row of whatever the work most resembles, and says which.

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
| "This task is too small to interview" | The gate never shrinks. The user confirms the design before code. The round does: count what the request and the repo leave open, not the row's length. A full-autonomy grant asks nothing, and a design doc or a stated change asks only its gaps. |
| "I'll ask how they want it delivered or verified" | Process is the playbook's. Decide it and list it. |
| "I'll have the subagent ask them" | A subagent's question never reaches the user. Ask from the main session. |
| "The design is confirmed in the chat, that's enough" | Chat does not survive compaction, a handoff, or a reviewer. Write `<root>/.nstack/intents/<slug>.md`. |
| "The build outgrew the intent, I'll explain it in the PR" | Amend the intent when the course changes. A file describing the old design teaches the next reader the wrong thing. |

**Reply:** the confirmed design, the decisions the user made and the ones you made for them, what is explicitly out of scope, the intent file path, and the execution playbook you are handing it to.
