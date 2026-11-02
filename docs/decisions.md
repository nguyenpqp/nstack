# Decisions

Why nstack is the way it is, as of now. Each entry states a rule that holds today, why it holds, and where it lives. When a decision changes, edit its entry rather than adding a second one.

**(user)** marks the user's own call. Ask before you reverse one. Unmarked entries were made for them and can change with good evidence.

"Tabletop" means fresh agents given a scenario and the rule text, with the count of runs that did the expected thing. A tabletop shows how agents read a rule, not how a real run behaves, so several open questions wait on real runs.

The per-decision intent files that came before this page are in git history, under `docs/intents/`, up to commit `2fd9864`.

## What ships

- **Vendor plus overlay, synced by hand.** (user) A hand port drifts, so one command pulls both upstreams and lists only what needs a human. The repo is its own marketplace with `dist/` committed. There is no scheduled sync.
- **Claude Code only.** (user) No Cursor or Codex build. `make-bot-ui` is excluded, since it serves a Cursor product. Patch `008`.
- **pstack wins every overlap.** Pocock's spec pipeline conflicted with n-mode: it merges in a way `merge.ff only` refuses, calls skills by names that resolve elsewhere, blocks on the user, and keeps a second copy of the requirements. `overlay/selection.json` records each pair.
- **Only `diagnosing-bugs` ships from Pocock.** (user) `domain-modeling` left because it writes files before the Interview opens a worktree. `grilling` left when its loop moved into the Interview playbook. Patches `060`, `065`.
- **`diagnosing-bugs` starts only when typed**, matching every other routed skill, so "debug this" runs the Bug fix playbook rather than the skill alone. Patch `067`.
- **`ketchup-video` is excluded.** (user) Its reply embeds a video that a terminal cannot play. `/nstack:ketchup` still ships. Patch `009`.
- **The HITL script runs in the user's terminal.** The agent's shell has no keyboard input, so the script dies at its first prompt there. Patch `066`.
- **Entry points are renamed, nothing else.** (user) `poteto-mode` to `n-mode`, `poteto-agent` to `n-agent`, `setup-pstack` to `setup-nstack`, `poteto-help` to `nstack-help`. Patches `005`, `006`, `overlay/renames.json`.

## Claude Code adaptation

- **The adapter does not ship.** (user) Compaction dropped it from context, "once per session" stopped agents from rereading it, and subagents never read it. `dist/` holds Claude Code names only, and the check fails on a Cursor name that a sync brings back. Patches `100`, `110`, `120`, `130`.
- **One-to-one swaps go in `renames.json` `claudeCode`, and changes of meaning go in patches**, so most upstream edits need no patch repair.
- **Cursor concepts map as follows.** A cloud agent is a subagent with `isolation: "worktree"`. A read-only agent is `subagent_type: "Explore"` with a brief that says not to edit. `/deslop` is the built-in `/simplify` plus the strip list. The control skill is the project's own under `.claude/skills/`. `create-skill` is `skill-creator`.
- **Bugbot text stays.** It is a GitHub app that comments on PRs whatever editor opened them.
- **The check fails on frontmatter Claude Code does not read.** The old `is_background` field passed the check, because Claude Code ignores an unknown field and the check did not read frontmatter. Agents now set `background: true`.
- **`icon` and `color` left the `n-mode` frontmatter**, because the Claude Code skill docs list neither. One `claudeCode` row strips them.
- **n-mode's wall time stays as it is.** (user) A one-flag change took about 230s against 61s with no skill, spent on a worktree, intent, delegate, and review. Cutting the upstream text each delegate reads would break syncs more often.

## The n-mode workflow

- **Every task opens with an Interview sized by its playbook.** The user confirms a design before code exists and can opt out per request. A request that states the change asks only what is still open and would change the diff, because a diagnosed one-line bug once drew 6 questions. Process is never a question. Patch `020`, `overlay/files/.../interview.md`.
- **A design doc in hand limits the Interview to its gaps.** `overlay/files/.../interview.md`.
- **Sticky mode is a rule in the skill, not a hook.** Claude Code has no frontmatter flag for it, and a session-start hook was ruled out. Patch `010`.
- **Spec build is self-contained.** (user) No issue tracker, tickets land fast-forward or by cherry-pick after their verify command passes, one review at the end, and nothing asks the user mid-run. A shape shared across a process boundary lands as its own blocking ticket. Patch `050`, `overlay/files/.../spec-build.md`.
- **Small stepped-away work stays in its playbook.** Only large or cross-cutting work routes to `figure-it-out`, because a one-flag change once got a bespoke playbook. Patch `075`.
- **Crossing a function boundary means a change a caller sees:** a signature, type, or module seam. An edit inside one function body does not count. Patch `085`.
- **A missing control skill is offered in the reply, not built**, because a one-flag change once grew a control-skill commit. Patch `090`.
- **Review runs the built-in `/code-review`**, then the lead checks the diff against the intent's **Outcome** and **Out of scope**. (user) `interrogate` stays for contested designs. Patch `060`.
- **A delegate that opens a PR always runs `/code-review`, and runs `interrogate` only on a contested design or a sensitive branch.** (user) `opening-a-pr.md` told every delegate to run it, which spent an `opus xhigh` and a `fable high` reviewer on a 6-line PR in 4 of 4 tabletops. On the new text, 4 of 4 skipped it on that PR and 4 of 4 ran it on an auth change. Sensitive means security, auth, billing, persisted data, migrations, concurrency, or a subtle algorithm. Patch `220`.
- **Replies use the user's language.** Files keep the repo's language. Patch `160`.
- **Commits and PRs from an n-mode run credit no AI agent.** (user) The commit author stays the configured git user. A skill line can lose to a harness reminder, and only `"attribution": {"commit": "", "pr": ""}` in the user's settings turns the harness's line off. Patch `140`.

## Worktrees and run files

- **The chat that runs n-mode stays at the root.** (user) The user coordinates from one place, and inside a worktree Claude Code treats the root, the backlog included, as outside the session. Nobody calls `EnterWorktree`. Everyone edits by absolute path and runs `git -C <worktree>`, and each delegate brief names its worktree and branch. Patch `170`.
- **Worktrees live in `<root>/.claude/worktrees/`, ignored by a `.gitignore` inside that folder.** Nothing commits on `main`, and nothing writes under `.git/`, whose files Claude Code refuses as sensitive. Patch `030`.
- **A run's own files live in `<root>/.nstack/`,** which holds its own `.gitignore`. (user) That covers the backlog and its archive, intents, and tickets files. Patch `190`.
- **Intents are never committed and are deleted once nothing open reads them.** (user) A committed intent grows the repo per task and goes stale. Opening a PR or merging back carries **Problem**, **Decisions**, and **Out of scope** into the PR body or last commit. A dropped row or an abandoned run keeps its intent for a pickup. Patch `190`. This covers target repos, and this repo records its own decisions on this page.

## Session backlog

- **Each mid-session ask becomes a row in `.nstack/backlog.md` before any other step.** (user) Only what the user types counts. The opening request goes through Interview, and work n-mode finds itself goes in the todo list. Patch `150`, `overlay/files/.../session-backlog.md`.
- **The rules live in a reference file.** An inline section cost every delegate 493 words it never used.
- **Asks are sorted against the intent.** (user) Inside the **Outcome**, an ask folds in. One that contradicts the design amends the intent and redoes the step. One outside it is its own unit, and a larger one gets its own Interview.
- **n-mode confirms low-risk rows itself and restates them in the reply.** (user) A row waits on the user only for an open product or preference call or a high risk: undoing shipped work, overriding a user decision, clashing with another row, or an Always-pause action. Under full autonomy, only high risks wait. Startable rows go to background delegates before the question is asked, so work continues.
- **File order is the queue, and tags on the title line hold a row.** (user) `after R<n>`, `later`, `waiting: <question>`, and `discuss`. A shared path with a row in progress becomes `after R<n>`, so two delegates never meet in a merge.
- **Each turn reads only open title lines and the rows it touches.** (user) A reply reports only the rows that changed and those still waiting. The full list appears on request and at the end of a run.
- **A row is ticked only with evidence or a stated drop reason.** Row numbers are never reused, and cleanup moves rows to an archive and never deletes them.
- **The first version passed 39 of 40 scenario checks, and 40 of 40 after fixes.** Many rules in the reference file trace to those runs, so re-run the scenarios before you simplify it.

## Models and effort

The table under **Match the model to the job** in `n-mode/SKILL.md` is the source of truth for values. This section says why they are what they are.

- **Every job names its model and effort outright.** (user) The chat never raises or lowers what the table gives, and picks an implementation tier from the change, not to save cost. A rule that raised effort one step for the hardest work turned `opus medium` into `opus high` on its own. Patch `200`.
- **Implementation tiers.** (user) `sonnet medium` for mechanical edits, `sonnet high` for implementation, `opus medium` for hard work, and `fable xhigh` for the hardest. Patches `180`, `200`.
- **A mechanical edit is defined by the brief:** it names each file and the exact change and leaves no design choice. Two tabletop agents split on the old wording, and 2 of 2 agreed on the new. Patch `250`.
- **Explore and search run at `sonnet medium`, and verify at `sonnet high`.** (user) Spawn labels on 2026-10-30 showed 549 `sonnet high` spawns and only 41 `sonnet medium`, against the stated tiers. Patches `180`, `200`.
- **Reviews.** (user) Per-task diff review runs at `opus high`. The final branch review runs at `opus xhigh`, and at `fable high` only on a sensitive branch. Spec build drops its different-model requirement. Patch `180`.
- **Fable is scarce.** (user) "fable rất tốn." `hardest tasks` stays `fable xhigh`, and every other Fable use runs at `high`. Patch `210`.
- **Panels are `opus xhigh` and `fable high`.** (user) Sonnet and Haiku left every panel, since a Haiku seat could judge an arena. Patches `100`, `210`, `overlay/renames.json`.
- **A table row replaces the default a routed skill names for the same role.** `how` and `why` keep their upstream defaults. (user) Rows put explorers and investigators at `sonnet medium` and the explainer at `opus high`. Tabletops followed the old value in 2 of 2 runs until the row existed, and the new value in 2 of 2 after. Patch `230`.
- **The Orchestrate verifier stays on a different family from its worker.** (user) `fable high` for a Sonnet or Opus worker, because "sonnet high hơi thấp", and `opus high` for a Fable worker. Patch `240`.
- **Comment review runs at `sonnet medium`, and a `recall` slice on `haiku` in its own role.** (user) Patch `240`.
- **A `show-me-your-work` review reads the chat's model,** since the trail records the chat's decisions. A chat on Sonnet or Fable gets `opus high`. (user) A chat on Opus gets `sonnet high`, and `automate-me` has no row for now. Patch `260`.
- **Spec build names its model and effort.** (user) It does so through a Tier per ticket. A ticket's first spawn, retry, and replay run on its Tier. The fix implementer runs on the highest Tier its findings touch, and the rebase agent on the hard implementation row, because it resolves conflicts across tickets. Before this, a bare `effort: "high"` left the model to inference. `overlay/files/.../spec-build.md`.
- **The budget moves every effort by the same steps.** (user) `unlimited` one up, `large` none, `medium` one down, `small` two down. An old budget that flattened every role to one effort erased the gap between implementation and review. A role line whose effort differs from what the budget gives was set by hand and wins for that role. Patch `180`.
- **The code role has no Haiku option.** (user) A seemingly mechanical edit can still need judgment.
- **Every spawn's description opens with its model and effort,** as in `opus xhigh: review diff`, because the CLI line shows neither. Patch `080`.

## Writing for this repo

- **No new patch changes an upstream skill.** (user) "mục tiêu không change skill từ upstream." New behavior goes in `overlay/files/`, role values, `n-mode/SKILL.md`, or `setup-nstack/SKILL.md`. Existing patches to other skills stay.
- **Run a tabletop on the old text before a behavior patch.** See [maintaining.md](maintaining.md#changing-behavior).
- **No framework- or engine-specific content in the skills.**
- **No name or link to the source port** that the Interview and Spec build playbooks came from, in any public file.

## Open questions

Each one names what would settle it.

**Effort and model values**

- Does Opus at `medium` need more fix rounds than Sonnet at `high`? Fix-round counts from real runs.
- Does `opus medium` resolve a spec rebase as well as `sonnet high` did? A rebase that needs a second attempt.
- Does `fable high` catch what `fable xhigh` caught on panels? A finding that only the Opus seat raises.
- Is `fable high` worth 2.5 times Opus's price per token as a verifier? Verdicts and cost from a run with dedicated verifiers.
- Do two panel seats give enough spread? A run where both agree on a wrong answer.
- Does `opus high` explain as well as `opus xhigh`? A `how` answer that misses a seam.
- Does `sonnet medium` catch the comments `opus high` caught? A comment that survives review.
- Does Haiku find the relevant chats in `recall`? A missed chat that a later search finds.
- Does `sonnet high` stay independent and thorough on an Opus chat's trail, when Sonnet delegates did most of the code? A flag a later review catches.
- Does a mechanical edit stay at `sonnet medium` in real runs, and is that enough? A fix round on one.

**Do real runs behave like the tabletops?**

- Do real delegates limit `interrogate` as tabletop agents did? Spawn labels from runs that open a PR through a delegate.
- Do real runs follow the `how` and `why` rows? Spawn labels from the next runs.
- Does the chat sort changes between `hard tasks` and `hardest tasks` as the user expects? The next runs with a hard change.

**Worktrees and run files**

- Does a Bash call starting `cd <worktree> &&` raise a permission prompt in some modes? Inferred, not observed. A real run that tests in a worktree.
- Does writing the backlog from inside a worktree prompt each time? Also inferred. A real run that does it.
- Two branches whose slugs match after the type is stripped write the same intent file, and nothing guards this.
- A pickup from another clone or machine finds no intent.
- The intent of a dropped row or an abandoned run stays until the user deletes it.
- Two sessions on one root checkout write the same backlog. Each row names its branch, which keeps them apart until that proves not to be enough.
- Does the PR body carry enough of the intent, now that reviewers and CI do not see the file? A review that misses a design decision.

**Known gaps**

- `dist/docs/guide/01-setup.md` is upstream text that still describes the old budget and names Grok.
- `typescript-best-practices` pairs `paths` with `disable-model-invocation`, and the docs do not say how the two combine.
- Whether nested subagents work as `orchestrate` describes. The playbook keeps its depth rule.

## Patch index

Every file in `overlay/patches/`, and the concern it holds. Sync names a patch when it breaks, so start here.

| Patch | Concern |
| --- | --- |
| `005-identity` | Names n-mode and setup-nstack as nstack's |
| `006-install-source` | Install commands point at this repo |
| `008-drop-make-bot-ui` | Removes the links to the excluded skill |
| `009-drop-ketchup-video` | Removes the links to the excluded skill |
| `010-sticky-mode` | n-mode stays on for the conversation |
| `020-interview-gate` | Every task opens with a sized Interview |
| `030-worktree` | Worktree location, ignore file, and merge lock |
| `040-effort-tiers` | Per-job effort in place of agent tiers |
| `050-spec-build` | Routes parallel-ticket work to Spec build |
| `060-pocock-routing` | Routes to `diagnosing-bugs` and to the built-in `/code-review` |
| `065-diagnosis-loop` | Bug fix runs `diagnosing-bugs` phases 1 to 4 |
| `066-hitl-terminal` | The user runs the HITL script |
| `067-diagnosis-explicit` | `diagnosing-bugs` starts only when typed |
| `075-stepped-away-routing` | Small stepped-away work keeps its playbook |
| `080-dispatch-labels` | Spawn descriptions open with model and effort |
| `085-architect-trigger` | Defines crossing a function boundary |
| `090-verify-surface` | `/simplify` before commit, and the project's own control skill |
| `100-claude-code-models` | Claude Code model values, panels, and the setup rule |
| `110-claude-code-agents` | Agent fields, and how cloud and read-only agents map |
| `120-claude-code-tools` | Cursor-only tools and paths |
| `130-claude-code-help` | `nstack-help` and the guide pages for Claude Code |
| `140-no-ai-credit` | Commits and PRs credit no AI agent |
| `150-session-backlog` | Points n-mode at the backlog rules |
| `160-match-user-language` | Replies use the user's language |
| `170-root-coordinator` | The chat stays at the root |
| `180-effort-by-model` | Efforts by job, and a budget that moves them relatively |
| `190-nstack-dir` | Run files in `.nstack/`, intents uncommitted |
| `200-hard-tier` | The `hard tasks` role and the one table of jobs |
| `210-fable-high` | Fable at `high` outside the hardest work |
| `220-delegate-interrogate` | Limits a delegate's `interrogate`, always `/code-review` |
| `230-routed-role-effort` | Rows for `how` and `why` roles |
| `240-unassigned-jobs` | Rows for the Orchestrate verifier, comment review, and `recall` |
| `250-mechanical-row` | Defines the mechanical row by the brief |
| `260-trail-review` | Rows for the `show-me-your-work` review |
