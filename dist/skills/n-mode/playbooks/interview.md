### Interview

**The confirmed design is the deliverable here, not code.** This playbook runs the **grilling** skill with three additions: the round goes through `AskUserQuestion`, the matched playbook sizes it, and the confirmed design lands in a file.

**When this runs.** Before step 1 of every other playbook. Match the execution playbook first, then interview. The user opts out per request by saying so ("just pick and go"). Never opt out for them. **Never Block on the Human** governs the middle of a run. This is its start, where the requirements are the human's to state.

**Hard gate.** No code, no scaffolding, and no delegate that writes files until the user confirms the design. Answered questions are not a confirmed design.

1. Read `../../grilling/SKILL.md` and follow it. Run the **how** skill over the affected subsystem first, so your questions rest on what the repo already does.
2. Size the round by the execution playbook.
   - Babysit, Shipping, Pause safely, and Worktree cleanup get one question or none.
   - Investigation, Runtime forensics, and Trace forensics get the questions that set the evidence bar and the deliverable. Almost everything else there is a fact, and facts are yours.
   - Every other playbook gets the full frontier.
   - An explicit ask ("interview me", "grill me", "phỏng vấn") upgrades any row to the full frontier.
3. Deliver each round with `AskUserQuestion` from the main session. A question raised inside a subagent never reaches the user. Put your recommended answer first, with `(Recommended)` on its label and the tradeoff in its description. Never write an "Other" option, because the tool adds one. When the frontier is larger than one call allows, send the calls one after another in the same turn.
4. Ask in plain markdown only when a question has no two to four enumerable answers ("paste the error"). Number those questions and give your recommended answer for each.
5. When the frontier is empty, write the design summary and ask the user to confirm it. The summary has these sections.
   - **Problem.** What is wrong today, in the user's words.
   - **Outcome.** What counts as done, stated so someone else could check it.
   - **Surfaces.** The users, callers, and systems this touches.
   - **Constraints.** What the design may not break, spend, or depend on.
   - **Out of scope.** What the round ruled out on purpose.
   - **Decisions.** Two lists, the user's and yours. Keep yours separate, because they are the ones most likely to be wrong.
   - **Open questions.** What is still unsettled, and what would settle each one.
6. On confirmation, match the execution playbook again, because the answers can move a task from one type to another. Copy its steps into the todo list.
7. Write the summary to `docs/intents/<slug>.md` and commit it as the first commit on the task's branch, inside the worktree that the **Worktree** section of `SKILL.md` opens. A design that lives only in the chat dies at the next compaction, handoff, or review. Read-only playbooks keep the summary in the reply and write no file.

**Amending it.** When execution finds a better shape, amend the intent file in the same change and say what moved. **Opening a PR** reads the final diff against it.

**Reply:** the confirmed design, the decisions the user made and the ones you made for them, what is out of scope, the intent file path, and the execution playbook you hand it to.
