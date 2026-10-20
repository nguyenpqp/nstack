### Spec build

**You own the ticket graph and the spec branch, never a ticket's code.** For one spec that splits into several tickets with blocking edges, built in one session and landed as one PR. This playbook runs Matt Pocock's spec pipeline under n-mode's worktree, verification, and review rules.

**Before step 1.** The Interview round has confirmed the outcome. Open the spec branch worktree per the **Worktree** section of `SKILL.md`. The intent, the tickets, and every landed ticket live on that branch.

1. If the issue tracker is not configured for this repo, run the **setup-matt-pocock-skills** skill. The spec pipeline reads its config.
2. If no spec exists, run the **to-spec** skill over the confirmed intent. Do not interview again. The intent already holds the answers.
3. Run the **to-tickets** skill. Each ticket must also name the paths it may write and its exact verify command. Two tickets whose write paths overlap get a blocking edge, per **Separate Before Serializing Shared State**.
4. Run the **implement-spec** skill with the spec branch as its integration branch. Spawn implementers as `n-agent-high` with `isolation: "worktree"`. A ticket lands on the spec branch only after its verify command passes there.
5. When every ticket has landed, review the whole branch once. Run the **code-review** skill against the spec and the intent file, then the **interrogate** skill.
6. Run **Opening a PR** for the spec branch.

**Reply:** the ticket graph with what landed, each ticket's verify result, the review findings and what you did with each, and the PR link.
