# Decisions

Why nstack is the way it is, as of now. Each entry states a rule that holds today, why it holds, and where it lives. When a decision changes, edit its entry rather than adding a second one.

**(user)** marks the user's own call. Ask before you reverse one. Unmarked entries were made for them and can change with good evidence.

"Tabletop" means fresh agents given a scenario and the rule text, with the count of runs that did the expected thing. A tabletop shows how agents read a rule, not how a real run behaves, so several open questions wait on real runs.

The per-decision intent files that came before this page are in git history, under `docs/intents/`, up to commit `2fd9864`.

## What ships

- **`statechart` ships whole.** Upstream's TypeScript rewrite took it to 407 files and 4.2 MB, of which 376 files and 4.0 MB are its test corpus. pstack is the baseline, and the size costs no context. `pstack.exclude` can only drop the whole skill, so keeping the skill without its corpus would need a build change.
- **Vendor plus overlay, synced by hand.** (user) A hand port drifts, so one command pulls both upstreams and lists only what needs a human. The repo is its own marketplace with `dist/` committed. There is no scheduled sync.
- **Claude Code only.** (user) No Cursor or Codex build. `make-bot-ui` is excluded, since it serves a Cursor product. Patch `008`.
- **pstack wins every overlap.** Pocock's spec pipeline conflicted with n-mode: it merges in a way `merge.ff only` refuses, calls skills by names that resolve elsewhere, blocks on the user, and keeps a second copy of the requirements. `overlay/selection.json` records each pair.
- **Only `diagnosing-bugs` ships from Pocock.** (user) `domain-modeling` left because it writes files before the Interview opens a worktree. `grilling` left when its loop moved into the Interview playbook. Patches `060`, `065`.
- **The other Pocock skills stay out, as reviewed against the keep rule.** `retro`, `handoff`, `wait-what`, `pr`, and `writing-for-agents` overlap `reflect` and `correct`, Pause safely, `bro`, Opening a PR, and `technical-writing`. `research` writes into the repo, as `domain-modeling` did. `git-guardrails-claude-code` blocks `git push` and `reset --hard`, which n-mode's playbooks run. `to-questionnaire` writes to the current directory, which by the text would dirty the root and stop **Merging back**, though that is untested. `in-progress/` is beta by its author's word, and the rest of `misc/` is project setup or course tooling. (user) `wizard` passes the rule, and pstack has only the narrower HITL template of `diagnosing-bugs`, but the user declined it.
- **`diagnosing-bugs` starts only when typed**, matching every other routed skill, so "debug this" runs the Bug fix playbook rather than the skill alone. Patch `067`.
- **`typescript-best-practices` stays typed-only, as upstream ships it.** Upstream pairs `paths` with `disable-model-invocation`, so it never loads by itself, and its help promises that installing changes nothing until a skill is invoked. Removing the field was tested on `--plugin-dir` runs and dropped. Sonnet then loaded it on a `.ts` edit in 6 of 6 runs, against 0 of 4 with the field, but it did so with no `/n-mode` running, in any repo, and it carries opinionated rules such as object args and no `console.log` that a project did not ask for. `paths` does not gate a plugin skill, so its description would be listed in every session, and its first line names a principle the Skill tool refuses. n-mode already reaches the same rules: on a type-design task with the field in place, 2 of 2 `n-agent` runs read `principle-type-system-discipline` from the index and wrote a discriminated union, though neither opened this skill.
- **`ketchup-video` is excluded.** (user) Its reply embeds a video that a terminal cannot play. `/nstack:ketchup` still ships. Patch `009`.
- **The HITL script runs in the user's terminal.** The agent's shell has no keyboard input, so the script dies at its first prompt there. Patch `066`.
- **Entry points are renamed, nothing else.** (user) `poteto-mode` to `n-mode`, `poteto-agent` to `n-agent`, `setup-pstack` to `setup-nstack`, `poteto-help` to `nstack-help`. Patches `005`, `130`, `overlay/renames.json`.

## Claude Code adaptation

- **The adapter does not ship.** (user) Compaction dropped it from context, "once per session" stopped agents from rereading it, and subagents never read it. `dist/` holds Claude Code names only, and the check fails on a Cursor name that a sync brings back. Patches `100`, `110`, `120`, `130`.
- **One-to-one swaps go in `renames.json` `claudeCode`, and changes of meaning go in patches**, so most upstream edits need no patch repair.
- **A multi-phase plan names skills by the plugin's folder.** Upstream's `pstack/skills/...` paths resolve only in a repo that vendors pstack, so its `check-plan.mjs` command could not run on a plugin install. `git show origin/main:` stays for the control skill, which the project owns, and `check-plan.mjs` requires that marker. A tabletop agent found the script from the new path, and the checker still accepts the playbook's skeleton apart from its unfilled model placeholder. Ticks no longer re-read a playbook "from trunk", for the same reason. Patch `120`.
- **Cursor concepts map as follows.** A cloud agent is a subagent with `isolation: "worktree"`. A read-only agent is `subagent_type: "Explore"` with a brief that says not to edit. `/deslop` is the built-in `/simplify` plus the strip list. The control skill is the project's own under `.claude/skills/`. Orchestrate's Project tracker and store are `.nstack/orchestrate/<slug>/notes.md`. The agent store is `.nstack/plans/<slug>.md` for a multi-phase plan and `.nstack/autopilot/<slug>/` for Autopilot's trail, one file per owner. 2 of 2 tabletops placed both there. `create-skill` is `skill-creator`.
- **Orchestrate's sub-coordinators need no change.** The docs allow three layers of subagents below the main conversation by default, and its depth rule uses two. In a real run, a `general-purpose` subagent spawned a child and received its report. `n-agent` names no `tools`, so per the docs it inherits `Agent`, though that spawn itself was not tested.
- **Bugbot text stays.** It is a GitHub app that comments on PRs whatever editor opened them.
- **The check fails on frontmatter Claude Code does not read.** The old `is_background` field passed the check, because Claude Code ignores an unknown field and the check did not read frontmatter. Agents now set `background: true`.
- **`icon` and `color` left the `n-mode` frontmatter**, because the Claude Code skill docs list neither. One `claudeCode` row strips them.
- **n-mode's wall time stays as it is.** (user) A one-flag change took about 230s against 61s with no skill, spent on a worktree, intent, delegate, and review. Cutting the upstream text each delegate reads would break syncs more often.

## The n-mode workflow

- **Every task opens with an Interview sized by its playbook.** The user confirms a design before code exists and can opt out per request. A request that states the change asks only what is still open and would change the diff, because a diagnosed one-line bug once drew 6 questions. Process is never a question. An opt-out skips the round and the confirmation but not the intent file. `how` in step 1 finishes before the first round, and the todo list opens at step 9, after the confirmation. A tabletop agent had to guess all three on the old text, and 2 of 2 got all 6 questions right on the new text. A later playbook step that only repeats the round's `how` becomes a `skip`, which 2 of 2 tabletops had reasoned out alone and 2 of 2 followed once written. Patch `020`, `overlay/files/.../interview.md`.
- **Upstream's first-message rule stays word for word beside the Interview gate.** Its "Don't wait for confirmation" covers the goal statement, not code. A sentence that said so was tested and dropped, because tabletop agents held the gate in 2 of 2 runs with it and 2 of 2 without it. Both agents without it noted that a skim could misread the line, and neither did. Patch `020`.
- **A design doc in hand limits the Interview to its gaps.** `overlay/files/.../interview.md`.
- **Sticky mode is a rule in the skill, not a hook.** Claude Code has no frontmatter flag for it, and a session-start hook was ruled out. Patch `010`.
- **Spec build is self-contained.** (user) No issue tracker, tickets land fast-forward or by cherry-pick after their verify command passes, one review at the end, and nothing asks the user mid-run. A shape shared across a process boundary lands as its own blocking ticket. Patch `050`, `overlay/files/.../spec-build.md`.
- **Small stepped-away work stays in its playbook.** Only large or cross-cutting work routes to `figure-it-out`, because a one-flag change once got a bespoke playbook. Patch `075`.
- **Crossing a function boundary means a change a caller sees:** a signature, type, or module seam. An edit inside one function body does not count. Patch `085`.
- **A missing control skill is offered in the reply, not built**, because a one-flag change once grew a control-skill commit. `multi-phase-plan.md` told the plan's author to build one, so it now drives the surface through the project's runner. Patches `090`, `120`.
- **Review runs the built-in `/code-review`**, then the lead checks the diff against the intent's **Outcome** and **Out of scope**. (user) `interrogate` stays for contested designs. Patch `060`.
- **`/code-review` runs at `high`.** (user) With no level, the command reuses the level typed last, so review depth moved between runs. On the old text, 4 of 4 tabletops typed it with no level. `high` is a judgment, not a measured choice. On the new text, 2 of 2 Autopilot owners typed `high`. A plan delegate's run on the new text did not finish, because safeguards stopped it. Patch `300`, `overlay/files/.../spec-build.md`.
- **An Autopilot owner opens its PR early and runs `/code-review high` before its code-ready report.** (user) `autopilot-full.md` says to open early, and `SKILL.md` and `opening-a-pr.md` put the review first. On the old text, 2 of 2 tabletops named the conflict and followed the review-first lines, so CI and bots started later than upstream intends. On the new text, 2 of 2 opened the PR before `/no-comments` and `/code-review`, and ran each once before the report. They still split on whether a commit before the PR runs `/simplify`, and neither reran the passes after review fixes. Upstream's `/deslop` line has the same gap, so it gets no text. Patch `310`.
- **Autopilot's trail sentence says to push the branch.** (user) On the old text, 2 of 2 tabletops found "push" unclear for a trail that never reaches a commit. On the new text, 2 of 2 pushed the branch and wrote the trail locally. Patch `190`.
- **A bare `/simplify` gets no new text.** On a plan checklist that names only `/simplify`, 2 of 2 tabletops still did the manual strip from `SKILL.md`. A tabletop of a plain delegate opening a PR did not finish, because safeguards stopped it. 2 of 2 Autopilot owners did the strip with `opening-a-pr.md` in hand.
- **A delegate that opens a PR always runs `/code-review`, and runs `interrogate` only on a contested design or a sensitive branch.** (user) `opening-a-pr.md` used to tell every delegate to run it, which spent an `opus xhigh` and a `fable high` reviewer on a 6-line PR in 4 of 4 tabletops. Upstream has since dropped that line, and this rule stays for sensitive branches and `/code-review`. On the new text, 4 of 4 skipped it on that PR and 4 of 4 ran it on an auth change. Sensitive means security, auth, billing, persisted data, migrations, concurrency, or a subtle algorithm. Patch `220`.
- **Replies use the user's language.** Files keep the repo's language. Patch `160`.
- **Commits and PRs from an n-mode run credit no AI agent.** (user) The commit author stays the configured git user. A skill line can lose to a harness reminder, and only `"attribution": {"commit": "", "pr": ""}` in the user's settings turns the harness's line off. Patch `140`.

## Worktrees and run files

- **The rules live in a reference file, and `n-mode/SKILL.md` keeps what a delegate needs.** (user) A delegate works in the worktree its brief names, so it needs only the absolute-path rules. This took `SKILL.md` from 4742 to 4109 words. All 6 answers on the new text matched the old text's, and the chat opened the file unprompted. `references/worktree.md`, patch `030`.
- **The chat that runs n-mode stays at the root.** (user) The user coordinates from one place, and inside a worktree Claude Code treats the root, the backlog included, as outside the session. Nobody calls `EnterWorktree`. Everyone edits by absolute path and runs `git -C <worktree>`, and each delegate brief names its worktree and branch. Patches `030`, `100`.
- **A subagent gets its worktree from its brief or from `isolation: "worktree"`.** Upstream's "Subagents inherit it" is false here, because the chat stays at the root. Patch `030`.
- **A worker with no isolation still edits in a worktree.** Upstream's Orchestrate lets a worker share this checkout to use a dev server, but the root never holds feature work. Its brief names a worktree, and it starts its own copy when its edits must show. 2 of 2 tabletops placed the edits there. Patch `110`.
- **Worktrees live in `<root>/.claude/worktrees/`, ignored by a `.gitignore` inside that folder.** Nothing commits on `main`, and nothing writes under `.git/`, whose files Claude Code refuses as sensitive. Patch `030`.
- **The merge lock is released whether or not the merge landed, and taken again to retry.** On the old text, 1 of 2 tabletops held it through the rebase, which blocks other sessions for as long as the rebase runs. On the new text, 2 of 2 released it first. A lock already held or left stale gets no text, because 2 of 2 waited on one and cleared the other with a report. `references/worktree.md`.
- **A landing with no PR adds no text to Opening a PR.** That playbook has no no-PR path, but 2 of 2 tabletops kept its commit rules and landed through **Merging back**, so there was nothing to fix.
- **A run's own files live in `<root>/.nstack/`,** which holds its own `.gitignore`. (user) That covers the backlog and its archive, intents, tickets files, plans, and Autopilot's trail. A trail that the stakes call for committing is copied out first, because 2 of 2 tabletops saw that rule collide with "none of these files reaches a commit". Patch `190`.
- **Intents are never committed and are deleted once nothing open reads them.** (user) A committed intent grows the repo per task and goes stale. Opening a PR or merging back carries **Problem**, **Decisions**, and **Out of scope** into the PR body or last commit. A dropped row or an abandoned run keeps its intent for a pickup. Patch `190`. This covers target repos, and this repo records its own decisions on this page.

## Session backlog

- **Each mid-session ask becomes a row in `.nstack/backlog.md` before any other step.** (user) Only what the user types counts. The opening request goes through Interview, and work n-mode finds itself goes in the todo list. Patch `150`, `overlay/files/.../session-backlog.md`.
- **The rules live in a reference file.** An inline section cost every delegate 493 words it never used, and `SKILL.md` now keeps only the trigger, which took it from 4109 to 4021 words. The chat rereads the file for any message when it is no longer in context, so a compaction does not drop the turn's grep. All 6 answers on the new text matched the old text's.
- **Asks are sorted against the intent.** (user) Inside the **Outcome**, an ask folds in. One that contradicts the design amends the intent and redoes the step. One outside it is its own unit, and a larger one gets its own Interview.
- **n-mode confirms low-risk rows itself and restates them in the reply.** (user) A row waits on the user only for an open product or preference call or a high risk: undoing shipped work, overriding a user decision, clashing with another row, or an Always-pause action. Under full autonomy, only high risks wait. Startable rows go to background delegates before the question is asked, so work continues.
- **File order is the queue, and tags on the title line hold a row.** (user) `after R<n>`, `after <branch>`, `later`, `waiting: <question>`, and `discuss`. A shared path with a row in progress becomes `after R<n>`, so two delegates never meet in a merge.
- **Each turn reads only open title lines and the rows it touches.** (user) A reply reports only the rows that changed and those still waiting. The full list appears on request and at the end of a run.
- **A row is ticked only with evidence or a stated drop reason.** Row numbers are never reused, and cleanup moves rows to an archive and never deletes them.
- **Pause safely, Session pickup, and a dropped row need no more backlog text.** On the old text, 2 of 2 tabletops read the backlog through the `SKILL.md` trigger and put it in the resume note. For a dropped row in progress, both stopped its delegate first and left its worktree and branch. The reference file no longer cites a step of Session pickup that does not mention the backlog, and its example **Ask** now reads as a later message. On the new text, 2 of 2 reported no conflict with either.
- **A later row waits for the opening request's branch with `after <branch>`.** The opening request has no row, by the user's decision, so read literally the start rule let a later row run on the same files. On the old text all 6 tabletops named this, and 5 held the row anyway, but 2 invented tags with different spellings and no rule released them. On the new text, 2 of 2 got all 4 situations right: the same tag, its release when the branch lands, the hold in a new chat, and no hold on a row with other paths. Both applied the rule by analogy to a branch a pickup adopts.
- **The first version passed 39 of 40 scenario checks, and 40 of 40 after fixes.** Many rules in the reference file trace to those runs, so re-run the scenarios before you simplify it.

## Models and effort

`references/model-table.md` in `n-mode` is the source of truth for values. This section says why they are what they are.

- **The table lives in a reference file, and `n-mode/SKILL.md` keeps upstream's Subagents text, minus its model values, plus a pointer.** (user) "n-mode giữ đúng upstream, sau đó các phần thêm vào là tối thiểu và cần thiết." Every delegate reads `SKILL.md` in full, and one that spawns nothing never uses the table. This took `SKILL.md` from 5787 to 4742 words, a measured saving of 1045 words for such a delegate. One that spawns reads the 1146 words of the reference on top. On the new text, 30 of 30 tabletop values matched the table, across a chat, a delegate that spawns, and a Spec build chat, and all three opened the reference unprompted. A code delegate told to open only what its work needs opened only `n-agent.md` and `SKILL.md`, though an earlier one read the table out of curiosity, so the saving is not yet observed in a real run. (user) The Defaults paragraph kept upstream's values and hardest-change rule ahead of the pointer, and 3 of 3 agents said it pointed the wrong way, so it now names no value. That took `SKILL.md` to 4142 words on an upstream of 3424. On this text, 2 of 2 tabletops gave the right value on all 8 spawn questions, and neither reported a conflict with the paragraph. Only patches `110` and `290` touch the Subagents section. Patch `290`.

- **Every job names its model and effort outright.** (user) The chat never raises or lowers what the table gives, and picks an implementation tier from the change, not to save cost. A rule that raised effort one step for the hardest work turned `opus medium` into `opus high` on its own. Patch `100`, `references/model-table.md`.
- **Implementation tiers.** (user) `sonnet medium` for mechanical edits, `sonnet high` for implementation, `opus medium` for moderate work, `opus high` for hard work, and `opus xhigh` for the hardest. Patch `100`, `references/model-table.md`.
- **A bug that review finds gets a stronger fix than the code that held it.** (user) The first fix climbs one step on the ladder `sonnet medium`, `sonnet high`, `opus medium`, `opus high`, `opus xhigh`, and the second fix one more, so two at most, and `opus xhigh` is the top. A bug that survives the second fix goes to Attack the Premise and the user. A failed **Verify** with no review keeps the ticket's tier. `references/model-table.md`.
- **A mechanical edit is defined by the brief:** it names each file and the exact change and leaves no design choice. Two tabletop agents split on the old wording, and 2 of 2 agreed on the new. `references/model-table.md`.
- **Explore and search run at `sonnet medium`, and verify at `sonnet high`.** (user) Spawn labels on 2026-10-30 showed 549 `sonnet high` spawns and only 41 `sonnet medium`, against the stated tiers. Patch `100`, `references/model-table.md`.
- **Moderate and Hard split on whether the delegate still has a design decision to make.** (user) A settled approach runs at `opus medium`, and an open one at `opus high`. A costly mistake alone never lifts a job above Moderate, because review carries that risk. Payment code with a settled plan takes `opus medium`, even a small or mechanical change, unless a higher row names the work. The floor and its reach to mechanical payment edits are the chat's reading of the user's "thanh toán đã có plan rõ vẫn xuống opus medium". Real spawns since the five tiers shipped: 0 of 21 at `opus medium`, while the same table in a tabletop gave a planned payment change Hard in 3 of 3 for "a small mistake is costly". On the new text, 2 of 2 full runs and 2 of 2 single runs gave it Moderate. A fully listed payment deletion moved from `sonnet medium` to `opus medium`, and a refund with its design left open moved from `opus xhigh` to `opus high`. The other jobs kept their tiers. A draft without the floor sent that change to `sonnet high` in 2 of 2 single runs. Patch `100`, `references/model-table.md`.
- **Every spawn resolves to one row.** When two rows fit, the higher wins, except that the design-decision question alone splits Moderate from Hard. A helper that only reads, parses, or watches takes the Explore and search row, unless its skill names a role line. A conflicted merge or rebase takes the hard row, and a sub-coordinator `opus high`. The values are the chat's picks from existing rows. Rare cases stay out of the table on purpose: which model a third arena runner or race arm uses, and a role line that puts a verifier on its worker's family. `references/model-table.md`.
- **Reviews.** (user) Per-task diff review runs at `opus high`, and at `fable xhigh` for hardest implementation, for a different family's edge-case detection. An independent verdict that gates a landing runs at `opus high`, since "sonnet high hơi thấp" holds there too. The final branch review always runs at `opus xhigh`. A Feature run on a sensitive branch spawns that reviewer besides `/code-review`. Spec build drops its different-model requirement. Patch `060`, `references/model-table.md`.
- **Fable reviews and evaluates, and never writes code.** (user) "fable high seems to be less intelligent than opus xhigh, fable is only good for edge-case detection." The user's impression, not measured, and the user keeps a Fable advisor on. Fable's review rows read the `deep review` role, and the arena judge and the panels read their own lines. Arena runners, which can write code, run on `opus xhigh` and `sonnet xhigh`, and the `architect` and `interrogate` panels keep `fable high` since they design and review. Patch `100`, `references/model-table.md`.
- **Panels are `opus xhigh` and `fable high`.** (user) Sonnet and Haiku left every panel, since a Haiku seat could judge an arena. `interrogate` runs `arena`'s fan-out. (user) `arena`'s own default now matches its table row, `opus xhigh` and `sonnet xhigh`, so `interrogate` names its panel as its default. This changes two upstream skills on the user's request, so they match the table. Patch `100`, `overlay/renames.json`.
- **`arena` names its runners' type, `nstack:n-agent`,** and joins the routed skills that set their own type, so `architect` inherits it and the judge's `Explore` is not in question. 2 of 2 tabletops had inferred it, and 2 of 2 read it as stated once written. Patch `110`.
- **`interrogate` opens its adversaries' worktrees itself,** with `git worktree add --detach`, and removes them after Verify, because `isolation: "worktree"` starts from a clean checkout and cannot hold uncommitted changes. Tabletops split between the two mechanisms on the old text, and 2 of 2 agreed on the new text. Patch `110`.
- **The chat writes a multi-phase plan itself.** The `opus xhigh` row covers only plan writing that it delegates. The playbook's "You own the plan" and the row looked like a conflict, and 2 of 2 tabletops read it this way on the new text. `references/model-table.md`.
- **The arena judge never runs on the chat's own model.** Upstream keys this on vendor family, and every nstack seat is a Claude model, so family means model here. With no entry left to run, the chat skips the judge and says so. The default pool lists `fable high` first, because `opus xhigh` first gave a Sonnet chat a judge the table does not name. 2 of 2 tabletops chose the table's judge on Opus, Sonnet, and Fable chats. Patches `100`, `110`.
- **Upstream's fallback for a rejected model stays,** with `slug` written as `model`, since Claude Code's `model` field takes aliases. A rejected effort is omitted, not replaced, because the role's default can be the rejected value. Patch `290`.
- **`how` and `why` name the table's values as their defaults.** (user) Rows put explorers and investigators at `sonnet medium` and the explainer at `opus high`, and the skills now say the same, so a run with no rule file gets those values even outside n-mode. Tabletops followed the old value in 2 of 2 runs until the row existed, and the new value in 2 of 2 after. A row still replaces any default a routed skill names. Patch `100`.
- **The Orchestrate verifier stays on a different family from its worker.** (user) `opus high` for a Sonnet worker and `fable high` for an Opus worker, because "sonnet high hơi thấp". `references/model-table.md`.
- **Comment review runs at `sonnet medium`, and a `recall` slice on `haiku` in its own role.** (user) Patch `100`.
- **A `show-me-your-work` review reads the chat's model,** since the trail records the chat's decisions. A chat on Sonnet or Fable gets `opus high`. (user) A chat on Opus gets `sonnet xhigh`, because that reviewer reads the whole trail and transcript and `sonnet high` gave that read too little effort, and `automate-me` has no row for now. The chat's reason for staying on Sonnet where an Orchestrate verifier on Opus work gets `fable high`: this review only flags and gates no merge, and Sonnet costs a fifth of Fable per token. An Autopilot owner keeps its own trail, so "the chat" does not fit it, but the row gets no new text: with a Sonnet owner under an Opus root and an Opus owner under a Fable root, 4 of 4 tabletops read "the chat" as the owner, from the skill's "different model family from the one that did the work", and picked a reviewer on another model. All 4 named that reading as their own. On an Opus chat that kept the trail while Sonnet delegates wrote most of the code, 2 of 2 took `sonnet xhigh` and named the overlap with the delegates. `references/model-table.md`.
- **Spec build names its model and effort.** (user) It does so through a Tier per ticket. A ticket's first spawn, retry, and replay run on its Tier. The fix implementer runs on the highest Tier its findings touch, and the rebase agent on the hard implementation row, because it resolves conflicts across tickets. Before this, a bare `effort: "high"` left the model to inference. `overlay/files/.../spec-build.md`.
- **The budget moves every effort by the same steps.** (user) `unlimited` one up, `large` none, `medium` one down, `small` two down. An old budget that flattened every role to one effort erased the gap between implementation and review. A role line whose effort differs from what the budget gives was set by hand and wins for that role. Patch `180`.
- **The code role has no Haiku option.** (user) A seemingly mechanical edit can still need judgment.
- **Every spawn's description opens with its model and effort,** as in `opus xhigh: review diff`, because the CLI line shows neither. A job on an implementation row adds its tier, as in `opus medium (moderate): add channel`, because 0 of 6 real code-writing briefs named the tier when the table asked for it there, while all 21 labels followed the label rule. `references/model-table.md`.

## Writing for this repo

- **No new patch changes an upstream skill.** (user) "mục tiêu không change skill từ upstream." New behavior goes in `overlay/files/`, role values, `n-mode/SKILL.md`, or `setup-nstack/SKILL.md`. Existing patches to other skills stay.
- **Run a tabletop on the old text before a behavior patch.** See [maintaining.md](maintaining.md#changing-behavior).
- **No framework- or engine-specific content in the skills.**
- **No name or link to the source port** that the Interview and Spec build playbooks came from, in any public file.

## Open questions

Each one names what would settle it.

**Effort and model values**

- Does Opus at `medium` need more fix rounds than Sonnet at `high`? Fix-round counts from real runs.
- Does `opus high` resolve a spec rebase as well as `sonnet high` did? A rebase that needs a second attempt.
- Does `fable high` catch what `fable xhigh` caught on panels? A finding that only the Opus seat raises.
- Is `fable high` worth 2.5 times Opus's price per token as a verifier? Verdicts and cost from a run with dedicated verifiers.
- Do two panel seats give enough spread? A run where both agree on a wrong answer.
- Does `opus high` explain as well as `opus xhigh`? A `how` answer that misses a seam.
- Does `sonnet medium` catch the comments `opus high` caught? A comment that survives review.
- Does Haiku find the relevant chats in `recall`? A missed chat that a later search finds.
- Does `sonnet xhigh` stay independent and thorough on an Opus chat's trail, when Sonnet delegates did most of the code? A flag a later review catches.
- Does a mechanical edit stay at `sonnet medium` in real runs, and is that enough? A fix round on one.

**Do real runs behave like the tabletops?**

- Do real delegates limit `interrogate` as tabletop agents did? Spawn labels from runs that open a PR through a delegate.
- Do real runs follow the `how` and `why` rows? Spawn labels from the next runs.
- Does the chat sort changes between `hard tasks` and `hardest tasks` as the user expects? The next runs with a hard change.
- Do real runs pick `opus medium` now? Tabletops on the old table already gave docs written from code Moderate in 5 of 5, while the real run spawned the same kind of job at `opus high`, so tabletops overstate it. Spawn labels with the tier from the next runs.
- Does a real Autopilot owner read "the chat" in the trail review rows as itself? The spawn label on an owner's trail review when the owner and the root run on different models.

**Worktrees and run files**

- Does a Bash call starting `cd <worktree> &&` raise a permission prompt in some modes? Inferred, not observed. A real run that tests in a worktree.
- Does writing the backlog from inside a worktree prompt each time? Also inferred. A real run that does it.
- Two branches whose slugs match after the type is stripped write the same intent file, and nothing guards this.
- A pickup from another clone or machine finds no intent.
- The intent of a dropped row or an abandoned run stays until the user deletes it.
- Two sessions on one root checkout write the same backlog. Each row names its branch, which keeps them apart until that proves not to be enough.
- Does the PR body carry enough of the intent, now that reviewers and CI do not see the file? A review that misses a design decision.

## Patch index

Every file in `overlay/patches/`, and the concern it holds. Sync names a patch when it breaks, so start here.

| Patch | Concern |
| --- | --- |
| `005-identity` | Names n-mode and setup-nstack as nstack's |
| `008-drop-make-bot-ui` | Removes the links to the excluded skill |
| `009-drop-ketchup-video` | Removes the links to the excluded skill |
| `010-sticky-mode` | n-mode stays on for the conversation |
| `020-interview-gate` | Every task opens with a sized Interview |
| `030-worktree` | Points n-mode at `references/worktree.md`, states the rules a delegate needs, and says where a subagent's worktree comes from |
| `050-spec-build` | Routes parallel-ticket work to Spec build |
| `060-pocock-routing` | Routes to `diagnosing-bugs` and to the built-in `/code-review`, and adds the final reviewer of a sensitive Feature |
| `065-diagnosis-loop` | Bug fix runs `diagnosing-bugs` phases 1 to 4 |
| `066-hitl-terminal` | The user runs the HITL script |
| `067-diagnosis-explicit` | `diagnosing-bugs` starts only when typed |
| `075-stepped-away-routing` | Small stepped-away work keeps its playbook |
| `085-architect-trigger` | Defines crossing a function boundary |
| `090-verify-surface` | `/simplify` before commit, and the project's own control skill |
| `100-claude-code-models` | Claude Code model values, the `arena` and `interrogate` panels, `arena`'s judge, and the setup rule with its role lines |
| `110-claude-code-agents` | Agent fields, how cloud agents, read-only agents, and Orchestrate's store map, where a worker with no isolation edits, `arena`'s runner type, and `interrogate`'s worktrees |
| `120-claude-code-tools` | Cursor-only tools and paths, including a multi-phase plan's skill paths |
| `130-claude-code-help` | `nstack-help`, the guide pages, and the install commands for Claude Code |
| `140-no-ai-credit` | Commits and PRs credit no AI agent |
| `150-session-backlog` | Points n-mode at the backlog rules |
| `160-match-user-language` | Replies use the user's language |
| `180-effort-by-model` | A budget that moves every effort by the same steps |
| `190-nstack-dir` | Points n-mode and its playbooks at the `.nstack/` rules, including the plan file and Autopilot's trail |
| `220-delegate-interrogate` | Limits a delegate's `interrogate`, always `/code-review`, in `SKILL.md` and `opening-a-pr.md` |
| `270-setup-guide-budget` | The setup guide describes the relative budget and what `swarm workers` drives |
| `290-model-table` | Takes the model values out of the Subagents section and points it at `references/model-table.md` |
| `300-code-review-level` | Runs `/code-review` at `high` in `SKILL.md` and `opening-a-pr.md` |
| `310-autopilot-early-pr` | Lets an Autopilot owner open its PR before the review passes, and adds `/code-review` to code-ready |
