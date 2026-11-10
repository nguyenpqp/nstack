# Model table

The model and effort of every spawn. Read this before your first Agent spawn, and again when it is no longer in your context. A delegate that spawns nothing never needs it, so it sits outside `SKILL.md`, which every delegate reads.

A role value `<model> <effort>`, such as `opus xhigh`, means Agent `model: "opus"` and `effort: "xhigh"`. A value with no effort, such as `haiku`, omits `effort`. With no `effort`, the agent runs at the session's effort.

## Jobs

| Job | Role | Model and effort |
|---|---|---|
| Mechanical edit: the brief names each file and the exact change, and leaves no design choice | the code playbook's line | `sonnet medium` |
| Implementation: an ordinary change, such as a CRUD endpoint or a small feature that follows an existing pattern | the code playbook's line | `sonnet high` |
| Moderate implementation: the brief or plan settles the approach and leaves the delegate no design decision, but the change is broad, such as a change wired through several layers, a large edit, or docs written from code after a sample passed | `hard tasks` | `opus medium` |
| Hard implementation: the delegate still has a design decision to make, or the change is a migration of the user's saved config or data | `hard tasks` | `opus high` |
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
| Independent verdict that gates a landing, such as a Shipping verifier's or a swarm verifier lane, when Sonnet wrote all the code | `judgment and prose` | `opus high` |
| Independent verdict that gates a landing, when Opus wrote any of the code | `deep review` | `fable high` |
| Orchestrate verifier when the worker runs on Sonnet | `judgment and prose` | `opus high` |
| Orchestrate verifier when the worker runs on Opus | `deep review` | `fable high` |
| Cross-model review of a `show-me-your-work` trail when the chat runs on Sonnet or Fable | `judgment and prose` | `opus high` |
| Cross-model review of a `show-me-your-work` trail when the chat runs on Opus | `deep review` | `fable medium` |
| Comment review in `no-comments` | `swarm workers` | `sonnet medium` |
| Transcript slice in `recall` | `recall workers` | `haiku` |
| Read-only review lane that audits existing code against a question, in an investigation or an audit, rather than a diff a delegate just wrote, and writes only its report | `judgment and prose` | `opus medium` |
| Check of a review lane's claims, by re-reading or re-running the evidence for each claim before anyone acts on it, unless the check gates a landing | `judgment and prose` | `opus medium` |
| Per-task diff review | `judgment and prose` | `opus high` |
| Per-task diff review of hardest implementation | `deep review` | `fable high` |
| Plan writing that you delegate, design decisions | `deep review` | `fable high` |
| Finding the cause of a bug that a first investigation did not explain, testing a premise under **Attack the Premise** | `judgment and prose` | `opus xhigh` |
| Final branch review | `deep review` | `fable high` |
| Arena runners | `arena runners` | `opus high` and `sonnet xhigh` |
| Arena or eval judge | `arena cross-judge pool` | `fable high`, or `opus xhigh` when the chat runs on Fable |
| Panel runners and reviewers (architect, interrogate) | `architect runners` or `interrogate reviewers` | `opus xhigh` and `fable high` |

## Picking a row

Pick an implementation tier from the change, not to save cost, and name it in the spawn label. The implementation rows name the only models that implement, so never pick another one between them. Moderate and Hard split on one question: does the delegate still have a design decision to make? Code on Opus starts at Moderate. Take Hard only when you can name the design decision the brief leaves open, or when the work is a migration of saved data, and write that reason in the label. A brief that calls its design decided, or that gives a precedent to copy, leaves no open decision, however much it stresses risk. A costly mistake alone never lifts a job above Moderate, because the review rows carry that risk. Payment code whose brief or plan settles the approach takes Moderate even when the change is small or mechanical, unless a higher row names the work. Otherwise, when two rows fit a job, a row that names the job, such as Final branch review or an Orchestrate verifier, wins over a general row. Among the implementation rows, take the higher one, since they run lowest to highest. A helper that also writes code, such as a babysitter that pushes fixes, takes the tier of the code it writes. A playbook's "configured model (default `sonnet high`)" is the Implementation row, so a change at another tier takes that tier's row.

Fable reviews, evaluates, plans, and decides designs, and never writes code, so no implementation or fix row names it. A `swarm` worker that writes code takes that change's tier, unless a race assigns a model per arm. An Orchestrate retry on a different model after a tool error takes `opus high` for a worker on Sonnet and `sonnet high` for a worker on Opus.

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

These pairs hold at the `large` budget, which also applies when no rule file exists. The code playbook's line is `feature, refactoring`, `bug-fix`, `perf-issue`, or `hillclimb`. Another budget moves every effort in the table by the steps it moves the role lines. A row replaces the default that a routed skill names for the same role. A role line replaces the model in every row of its role, and a role with no line keeps the row's value. A role line whose effort differs from what the rule's budget gives its default was set by hand, and its effort replaces the effort in those rows too. A rule whose `# budget` line names one effort, as in `large (xhigh)`, predates budgets that move efforts, so none of its role lines counts as set by hand. A `deep review` line that names a model other than `fable` raises the effort of each `deep review` row one step, since `fable high` does the work of `opus xhigh`. The default line is `deep review: fable high`, so `deep review: opus high` runs a `fable high` row on `opus xhigh` and a `fable medium` row on `opus high`. An effort set by hand, such as `deep review: opus max`, still wins. Never raise or lower an effort the table and the role lines give.

## Label every spawn

The CLI line shows only the type and the `description`, and a `general-purpose` type reads `Agent`. So open the description with the model and effort, then two or three words for the task, as in `opus xhigh: review diff`. A job on an implementation row adds its tier in parentheses, as in `opus medium (moderate): add channel`. A Hard job adds its reason after the tier, as in `opus high (hard: refund ledger shape): add refunds` or `opus high (hard: migration): settings v2`. Write the `model` you pass, or `inherit` when you omit it. Write the `effort` you pass, else the session's. Spawns that routed skills make carry the label too.
