# Model table

The model and effort of every spawn. Read this before your first Agent spawn, and again when it is no longer in your context. A delegate that spawns nothing never needs it, so it sits outside `SKILL.md`, which every delegate reads.

A role value `<model> <effort>`, such as `opus xhigh`, means Agent `model: "opus"` and `effort: "xhigh"`. A value with no effort, such as `haiku`, omits `effort`. With no `effort`, the agent runs at the session's effort.

## Jobs

| Job | Role | Model and effort |
|---|---|---|
| Mechanical edit: the brief names each file and the exact change, and leaves no design choice | the code playbook's line | `sonnet medium` |
| Implementation: an ordinary change, such as a CRUD endpoint or a small feature that follows an existing pattern | the code playbook's line | `sonnet high` |
| Moderate implementation: the brief or plan settles the approach and leaves the delegate no design decision, but the change is broad, such as a change wired through several layers, a large edit, or docs written from code after a sample passed | `hard tasks` | `opus medium` |
| Hard implementation: the delegate still has a design decision to make, or the change is a new background worker or a migration of the user's saved config or data | `hard tasks` | `opus high` |
| Hardest implementation: cross-cutting design, gnarly concurrency, a subtle algorithm, whether the intent is vague or the steps are exact | `hardest tasks` | `opus xhigh` |
| Explore and search, and any helper that only reads, parses, or watches, unless its skill names a role line | `swarm workers` | `sonnet medium` |
| Explorer in `how` | `how explorer` | `sonnet medium` |
| Explainer in `how` | `how explainer` | `opus high` |
| Investigator in `why` | `why investigators` | `sonnet medium` |
| Verify: run the checks and report the results | `swarm workers` | `sonnet high` |
| Conflicted merge or rebase, except a Spec build replay, which stays on the ticket's **Tier** | `hard tasks` | `opus high` |
| Clean chain rebase or merge with no conflict | the code playbook's line | `sonnet medium` |
| Bug investigation that runs or instruments code | the code playbook's line | `sonnet high` |
| Orchestrate sub-coordinator | `judgment and prose` | `opus high` |
| Independent verdict that gates a landing, such as a Shipping verifier's or a swarm verifier lane | `judgment and prose` | `opus high` |
| Orchestrate verifier when the worker runs on Sonnet | `judgment and prose` | `opus high` |
| Orchestrate verifier when the worker runs on Opus | `deep review` | `fable high` |
| Cross-model review of a `show-me-your-work` trail when the chat runs on Sonnet or Fable | `judgment and prose` | `opus high` |
| Cross-model review of a `show-me-your-work` trail when the chat runs on Opus | `swarm workers` | `sonnet xhigh` |
| Comment review in `no-comments` | `swarm workers` | `sonnet medium` |
| Transcript slice in `recall` | `recall workers` | `haiku` |
| Per-task diff review | `judgment and prose` | `opus high` |
| Per-task diff review of hardest implementation | `deep review` | `fable xhigh` |
| Plan writing that you delegate, finding the cause of a bug that a first investigation did not explain, testing a premise under **Attack the Premise**, design decisions | `judgment and prose` | `opus xhigh` |
| Final branch review | `judgment and prose` | `opus xhigh` |
| Arena runners | `arena runners` | `opus xhigh` and `sonnet xhigh` |
| Arena or eval judge | `arena cross-judge pool` | `fable high`, or `opus xhigh` when the chat runs on Fable |
| Panel runners and reviewers (architect, interrogate) | `architect runners` or `interrogate reviewers` | `opus xhigh` and `fable high` |

## Picking a row

Pick an implementation tier from the change, not to save cost, and name it in the spawn label. The implementation rows name the only models that implement, so never pick another one between them. Moderate and Hard split on one question: does the delegate still have a design decision to make? A costly mistake alone never lifts a job above Moderate, because the review rows carry that risk. Payment code whose brief or plan settles the approach takes Moderate even when the change is small or mechanical, unless a higher row names the work. Otherwise, when two rows fit a job, take the higher one, with the implementation rows running lowest to highest. A helper that also writes code, such as a babysitter that pushes fixes, takes the tier of the code it writes. A playbook's "configured model (default `sonnet high`)" is the Implementation row, so a change at another tier takes that tier's row.

Fable reviews and evaluates and never writes code, so no implementation or fix row names it. A `swarm` worker that writes code takes that change's tier, unless a race assigns a model per arm. An Orchestrate retry on a different model after a tool error takes `opus high` for a worker on Sonnet and `sonnet high` for a worker on Opus.

## Fix of a bug that review found

Take the fix from the tier the code ran on. A Sonnet value reads the code playbook's line, and an Opus value reads `hard tasks`. A fix climbs at most two steps and stops at `opus xhigh`. A bug that survives the second fix goes to **Attack the Premise** and then to the user, never to a third fix. A failure that no review found, such as a red **Verify** or a failing test, stays on the code's tier, and a fix that fails this way stays on its fix's row.

| Code tier | First fix | Second fix |
|---|---|---|
| Mechanical edit | `sonnet high` | `opus medium` |
| Implementation | `opus medium` | `opus high` |
| Moderate | `opus high` | `opus xhigh` |
| Hard | `opus xhigh` | `opus xhigh` |
| Hardest | `opus xhigh` | `opus xhigh` |

## Budgets and role lines

These pairs hold at the `large` budget. The code playbook's line is `feature, refactoring`, `bug-fix`, `perf-issue`, or `hillclimb`. Another budget moves every effort in the table by the steps it moves the role lines. A row replaces the default that a routed skill names for the same role. A role line replaces the model in every row of its role, and a role with no line keeps the row's value. A role line whose effort differs from what the rule's budget gives its default was set by hand, and its effort replaces the effort in those rows too. A rule whose `# budget` line names one effort, as in `large (xhigh)`, predates budgets that move efforts, so none of its role lines counts as set by hand. Never raise or lower an effort the table and the role lines give.

## Label every spawn

The CLI line shows only the type and the `description`, and a `general-purpose` type reads `Agent`. So open the description with the model and effort, then two or three words for the task, as in `opus xhigh: review diff`. A job on an implementation row adds its tier in parentheses, as in `opus medium (moderate): add channel`. Write the `model` you pass, or `inherit` when you omit it. Write the `effort` you pass, else the session's. Spawns that routed skills make carry the label too.
