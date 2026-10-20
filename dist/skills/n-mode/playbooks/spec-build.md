### Spec build

**You own the ticket graph and the spec branch, never a ticket's code.** For one spec that splits into several tickets with blocking edges, built in one session and landed as one PR. Matt Pocock's spec pipeline does the work. This playbook names what it owns and what n-mode changes about it.

**Before step 1.** The Interview round has confirmed the outcome. Open the spec branch worktree per the **Worktree** section of `SKILL.md`. The intent and every landed ticket live on that branch.

1. If the issue tracker is not configured for this repo, run the **setup-matt-pocock-skills** skill. The pipeline reads its config.
2. If no spec exists, run the **to-spec** skill over the confirmed intent. Do not interview again. The intent already holds the answers.
3. Run the **to-tickets** skill as written. Its tickets stay free of file paths.
4. Write a write-scope table to `docs/intents/<slug>-tickets.md` and commit it. One row per ticket, with the paths it may write and its exact verify command. Two tickets whose write paths overlap get a blocking edge, per **Separate Before Serializing Shared State**. This table is the coordinator's, not the tracker's.
5. Run the **implement-spec** skill with the spec branch as its integration branch. It owns the implementer worktrees, its own code-review step, and the draft PR. n-mode changes three things in it.
   - Spawn each implementer with `subagent_type: "nstack:n-agent-high"` and `isolation: "worktree"`, and give it the ticket's row from the table.
   - Tell each implementer to read `../../tdd/SKILL.md` and follow it, instead of calling the `Skill` tool with `tdd`. pstack's tdd is explicit-only, so the `Skill` call fails.
   - A ticket lands on the spec branch only after its verify command passes there.
6. When implement-spec finishes, run the **interrogate** skill over the whole spec branch. This is the multi-model pass that implement-spec does not run.
7. Run **Opening a PR** on the draft PR that implement-spec opened. Mark it ready there. Do not open a second PR.

**Reply:** the ticket graph with what landed, each ticket's verify result, the review findings and what you did with each, and the PR link.
