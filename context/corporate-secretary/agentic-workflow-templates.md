# Corporate Secretary — Agentic Workflow Templates

Derived from `jobs-to-be-done.md`. This catalogue inventories 30 agentic workflows the Diligent Governance Agent can run on behalf of a Corporate Secretary, classified by activation mode:

- **Proactive** workflows are agent-initiated. The agent watches schedules, data, or external signals and starts the work itself, often surfacing to the corp sec only at human-in-the-loop (HITL) checkpoints.
- **Reactive** workflows are user- or event-initiated. A trigger fires (a resignation arrives in Workday, a regulator letter lands, a board chair asks for something) and the workflow kicks off in response.

Both modes follow the same channel-agnostic contract: every template has clearly-named inputs, outputs, and HITL checkpoints so it can run inside chat, a guided UI, a teams sidebar, or a back-office automation indistinguishably.

Each template references the source JTBD section (e.g. `§2A`) so the link back to role responsibilities stays traceable.

---

## Proactive workflows

Agent-initiated. The agent watches data, calendars, or external feeds and opens the workflow on its own. The corp sec is brought in for approvals and judgment calls.

### 1. Filing-deadline radar

- **Mode**: Proactive
- **JTBD**: §2B Statutory and regulatory filings
- **Trigger**: Scheduled — runs continuously against the entity-level compliance calendar; auto-opens 14 days before any statutory deadline (jurisdiction-aware: ACRA Form 45, UK CS01, US 10-K, IE B1, AU 484, etc.).
- **Description**: Drafts the filing, validates against schema, attaches supporting evidence pulled from the entity register, and routes to the corp sec for review before lodgement.
- **Inputs**: entity register, compliance calendar, last-cycle filing, director-of-record data, financial close data (where applicable).
- **Outputs**: jurisdiction-formatted filing, pre-flight validation report, audit-trail entry.
- **HITL checkpoints**: review filing accuracy → approve to lodge → confirm receipt acknowledgement.
- **Cadence**: rolling — fires per deadline per entity.

### 2. Director-eligibility sentinel

- **Mode**: Proactive
- **JTBD**: §1B Entity management
- **Trigger**: Detected — listens for changes in director composition (new resignations, term expiries, residency changes, disqualifications) that could push an entity out of statutory compliance (local-director rules, independence quorums, gender-balance rules, etc.).
- **Description**: Models the post-change compliance picture for each affected entity, identifies which rules will be breached and by when, and proposes the right reactive workflow to kick off (board appointment, residency cure, committee rebalance).
- **Inputs**: entity register with statutory rules, director-of-record feed (Workday/HR), articles & bylaws.
- **Outputs**: breach forecast, recommended remediation workflow, draft notification to GC.
- **HITL checkpoints**: confirm remediation path → trigger downstream workflow.
- **Cadence**: real-time on event; weekly sanity sweep.

### 3. Entity register sync

- **Mode**: Proactive
- **JTBD**: §3B Record-keeping and entity data hygiene
- **Trigger**: Scheduled — nightly reconciliation across Workday, the entity management system, the board portal, and where APIs allow statutory registries (ACRA BizFile+, Companies House, CRO).
- **Description**: Detects drift between systems, classifies it (cosmetic, material, statutory), auto-resolves cosmetic drift, and surfaces material drift for corp-sec review.
- **Inputs**: Workday director feed, EMS canonical record, board portal director list, registry filings.
- **Outputs**: reconciliation report, drift log, approved corrections.
- **HITL checkpoints**: approve material corrections → authorize update to registry where filings are required.
- **Cadence**: nightly + on-demand.

### 4. Board calendar maintainer

- **Mode**: Proactive
- **JTBD**: §2A Board and committee meeting cycle
- **Trigger**: Scheduled — annual rollover plus ad-hoc adjustments when charters change.
- **Description**: Builds and maintains the annual board and committee calendar from charters, statutory recurring agenda items, and fiscal-year anchors. Detects scheduling conflicts and proposes resolutions.
- **Inputs**: committee charters, fiscal calendar, prior-year calendar, director availability hints.
- **Outputs**: published calendar, conflict log, change proposals.
- **HITL checkpoints**: chair approves cadence → director confirmations for individual meetings.
- **Cadence**: annual + on-event.

### 5. Policy-drift detector

- **Mode**: Proactive
- **JTBD**: §2C Governance program upkeep
- **Trigger**: Detected — subscribes to regulator and code-setter feeds (SEC, FRC, MAS, ACRA, SGX, ASIC, ESMA, IFC corporate governance bulletins) and flags issues that conflict with current policies.
- **Description**: Cross-checks new guidance against the current governance policy stack (board governance, COI, code of conduct, ESG oversight, etc.) and produces a gap report with proposed redlines.
- **Inputs**: regulator/code feeds, current policy library, prior redline history.
- **Outputs**: gap report, redline proposals, suggested governance- committee paper.
- **HITL checkpoints**: governance committee reviews proposals → board approves material policy changes.
- **Cadence**: daily monitor; reports emit on detected change.

### 6. Skills-matrix watcher

- **Mode**: Proactive
- **JTBD**: §1C Board and director capability
- **Trigger**: Detected — fires when directors approach term limits, evaluation results land, or board strategy materially shifts.
- **Description**: Compares the live skills matrix against the forward-looking rubric (sector, regulatory, ESG, cyber, finance, governance), surfaces gaps, and seeds candidate searches for the nominations committee.
- **Inputs**: director CVs/biographies, skills rubric, term-limit calendar, evaluation outputs.
- **Outputs**: gap report, candidate sourcing brief, succession options.
- **HITL checkpoints**: nominations committee reviews findings → chair approves search brief.
- **Cadence**: quarterly + on-event.

### 7. Board-pack pre-assembler

- **Mode**: Proactive
- **JTBD**: §2A Board and committee meeting cycle
- **Trigger**: Scheduled — kicks off 14 calendar days before each board or committee meeting.
- **Description**: Solicits committee reports and management updates, applies the meeting template, QA-checks materials for completeness and conflicts of interest, and stages the pack for chair review.
- **Inputs**: meeting agenda, prior-cycle materials, contributor list, pack template.
- **Outputs**: assembled board pack, contributor status log, QA report.
- **HITL checkpoints**: chair signs off pack → publish to board portal.
- **Cadence**: per-meeting.

### 8. Minutes drafter

- **Mode**: Proactive
- **JTBD**: §2A Board and committee meeting cycle (post-meeting)
- **Trigger**: Detected — fires within hours of a board or committee meeting completion event (recording uploaded, observer notes saved).
- **Description**: Drafts minutes against the corporate-record template, attributes decisions and votes, captures action items, and routes for review.
- **Inputs**: meeting recording or transcript, agenda, resolutions considered, prior-cycle minutes.
- **Outputs**: draft minutes, action-item register, resolutions log.
- **HITL checkpoints**: chair + GC review → archive to corporate record.
- **Cadence**: per-meeting.

### 9. Action-item chaser

- **Mode**: Proactive
- **JTBD**: §2A Board and committee meeting cycle
- **Trigger**: Scheduled — daily sweep against the action-item register.
- **Description**: Nudges owners as deadlines approach, escalates aged items, and rolls open items into the next-meeting agenda.
- **Inputs**: action-item register, owner directory, meeting cadence.
- **Outputs**: owner nudges, escalation summary, agenda roll-forward.
- **HITL checkpoints**: corp sec confirms escalation path for chronic items.
- **Cadence**: daily.

### 10. Director-disclosure refresh cycle

- **Mode**: Proactive
- **JTBD**: §1C Board capability + §2C Governance program upkeep
- **Trigger**: Scheduled — annual (full refresh) plus event-driven partial refresh on new appointments, related-party transactions, or policy changes.
- **Description**: Issues disclosure questionnaires (independence, COI, related-party, gift register, outside roles), collects attestations, flags changes for the governance committee.
- **Inputs**: director directory, disclosure templates, prior-cycle responses.
- **Outputs**: completed attestations, change log, COI flags.
- **HITL checkpoints**: director attests → governance committee reviews changes.
- **Cadence**: annual + event-driven partial.

### 11. Entity-portfolio housekeeping

- **Mode**: Proactive
- **JTBD**: §1B Entity management and corporate structure
- **Trigger**: Scheduled — quarterly scan for dormant, redundant, or high-cost entities (zero revenue, zero employees, expired purpose).
- **Description**: Produces a simplification dossier per candidate entity covering tax impact, regulatory steps, board approvals needed, and timing for dissolution or merger.
- **Inputs**: entity register, finance data, prior simplification plans, tax counsel input.
- **Outputs**: simplification dossier, cost-benefit summary, regulatory step plan.
- **HITL checkpoints**: leadership/treasurer reviews → board approves material structural changes.
- **Cadence**: quarterly.

### 12. Regulatory horizon scan

- **Mode**: Proactive
- **JTBD**: §3A Continuous board support and information flow
- **Trigger**: Scheduled — daily digest plus real-time alerts on high-severity items.
- **Description**: Monitors governance/regulatory/market news against the entity portfolio, filters for relevance, drafts a digest tailored to each director's interests, and identifies items the chair may want to escalate.
- **Inputs**: regulator/news/activism feeds, entity portfolio profile, director topic preferences.
- **Outputs**: daily digest, escalation candidates, board-portal briefing items.
- **HITL checkpoints**: corp sec selects what is distributed to the board.
- **Cadence**: daily.

### 13. Director-education tracker

- **Mode**: Proactive
- **JTBD**: §1C Board capability + §3C Director lifecycle
- **Trigger**: Scheduled — monitors required-training calendars and fires when a regulatory change introduces a new training requirement.
- **Description**: Tracks completion, schedules makeup sessions, distributes materials, and reports readiness to the chair.
- **Inputs**: training catalog, attendance log, regulatory training requirements.
- **Outputs**: readiness report, scheduled sessions, distributed materials.
- **HITL checkpoints**: director confirms completion → chair signs off readiness.
- **Cadence**: continuous; cycles by training type.

### 14. Service-provider review

- **Mode**: Proactive
- **JTBD**: §2C Governance program upkeep
- **Trigger**: Scheduled — annual cycle, plus event-driven on SLA breach or security incident at a provider.
- **Description**: Runs the annual review of governance service providers (board portal, entity management, registered agents, shareholder services). Pulls usage stats, SLA evidence, security attestations; produces a renew/replace recommendation.
- **Inputs**: vendor contracts, SLAs, incident log, alternatives benchmark.
- **Outputs**: review pack, renew/replace recommendation, procurement brief.
- **HITL checkpoints**: corp sec + procurement + GC review → board approval for material changes.
- **Cadence**: annual + event-driven.

---

## Reactive workflows

User- or event-initiated. The trigger comes from outside the agent: a resignation, a regulator letter, a chair request, a transaction kickoff. The agent orchestrates the multi-step response once the trigger fires.

### 15. Board appointment

- **Mode**: Reactive (often triggered by the **Director-eligibility sentinel** above)
- **JTBD**: §4C Board and leadership disruptions + §1C Board capability
- **Trigger**: Resignation event in Workday/board portal, OR explicit user request ("appoint a director to entity X"), OR vacancy detected by the eligibility sentinel.
- **Description**: End-to-end appointment workflow — eligibility screening, candidate shortlist, candidate-data collection, Consent to Act (Form 45 §145(5) in SG; equivalent elsewhere), approver configuration, board approval, statutory filing, entity-records update.
- **Inputs**: vacancy details, candidate pool, statutory rules per jurisdiction, board approval matrix.
- **Outputs**: signed Consent to Act, board resolution, statutory filing, updated entity register.
- **HITL checkpoints**: candidate selection → candidate info confirmation → approver list confirmation → board vote → final filing approval.
- **Cadence**: per-vacancy.

### 16. Director resignation handler

- **Mode**: Reactive
- **JTBD**: §4C Board and leadership disruptions
- **Trigger**: Resignation notice received (planned or unplanned), OR death/incapacity event.
- **Description**: Processes the resignation operationally: final compensation, equity vesting, asset return, board-portal access removal, statutory notifications, archival of the director's record, handoff brief for successor. Triggers the **Board appointment** workflow where a replacement is required.
- **Inputs**: resignation letter, director's roles and committee memberships, equity records, asset register.
- **Outputs**: departure pack, statutory notifications, access termination log, successor brief.
- **HITL checkpoints**: confirm severance terms → GC sign-off on notifications → close director record.
- **Cadence**: per-event.

### 17. Convene emergency board meeting

- **Mode**: Reactive
- **JTBD**: §4A/§4B Regulatory or operational incidents
- **Trigger**: User request, OR incident agent escalation (cyber breach, fraud detection, regulator action, safety incident).
- **Description**: Notices, agenda, quorum, secure logistics for an emergency board or committee meeting. Validates notice-period requirements per bylaws.
- **Inputs**: bylaws (notice rules), director directory, incident brief, prior emergency meeting templates.
- **Outputs**: formal notice, draft agenda, attendance confirmation, pre-meeting brief.
- **HITL checkpoints**: chair confirms scope → quorum confirmation → meeting convened.
- **Cadence**: per-event.

### 18. Filing compliance-gap remediation

- **Mode**: Reactive (often triggered by the **Filing-deadline radar** detecting an overdue filing)
- **JTBD**: §4A Regulatory incidents
- **Trigger**: Overdue filing detected, OR regulator late-filing notice received.
- **Description**: Sequences catch-up filings deadline-aware, prepares the late-fee/penalty calculation, drafts the filings, and prepares the regulator communication.
- **Inputs**: overdue items list, regulator correspondence, fee schedule, historical late-filing playbooks.
- **Outputs**: catch-up filings, penalty memo, regulator response letter.
- **HITL checkpoints**: GC reviews regulator letter → corp sec approves filing lodgement.
- **Cadence**: per-event.

### 19. Whistleblower / regulator response

- **Mode**: Reactive
- **JTBD**: §4A Regulatory or legal incidents
- **Trigger**: Regulator letter or subpoena received, OR whistleblower hotline report, OR investigation kick-off by GC/audit chair.
- **Description**: Coordinates the governance response — convening relevant committees, controlling access to records, evidencing fiduciary duty compliance through meeting minutes and decision logs. Partners closely with GC, Compliance, and Internal Audit.
- **Inputs**: incident brief, records-access scope, GC/external-counsel guidance, related entities.
- **Outputs**: governance response plan, decision log, records-access audit trail, board update.
- **HITL checkpoints**: GC confirms scope → records released under privilege rules → audit committee briefed.
- **Cadence**: per-event.

### 20. M&A governance coordinator

- **Mode**: Reactive
- **JTBD**: §1D Major corporate events
- **Trigger**: Transaction kickoff signaled by CEO/CFO/GC.
- **Description**: Sequences governance steps for an M&A or carve-out transaction: signing/approval matrix, board and committee approvals, due-diligence data-room governance, integration committee setup, disclosure timing.
- **Inputs**: deal thesis, transaction documents, approval matrix, board calendar.
- **Outputs**: approval roadmap, board resolutions, disclosure timeline, data-room governance policy.
- **HITL checkpoints**: GC reviews approval matrix → board approves at each gate → disclosure released per timeline.
- **Cadence**: per-transaction.

### 21. IPO governance coordinator

- **Mode**: Reactive
- **JTBD**: §1D Major corporate events
- **Trigger**: IPO process kickoff signaled by CEO/CFO/GC.
- **Description**: Manages governance readiness for IPO: board composition vs listing rules, committee charters, governance policy refresh, S-1/IPO-prospectus governance disclosures, post-listing governance calendar.
- **Inputs**: target listing venue rules, current governance stack, underwriter checklist.
- **Outputs**: governance readiness assessment, charter updates, disclosure drafts, post-listing calendar.
- **HITL checkpoints**: board approves governance updates → GC and underwriters sign off on disclosures.
- **Cadence**: per-event (multi-month).

### 22. Conflict-of-interest declaration cycle

- **Mode**: Reactive (also runs proactively as part of the **Director- disclosure refresh cycle**)
- **JTBD**: §4C Board disruptions + §2C Governance program upkeep
- **Trigger**: New director appointment, OR material related-party transaction, OR ad-hoc request by GC/audit chair.
- **Description**: Issues targeted COI declarations, validates against the prior-cycle position, surfaces conflicts requiring recusal, and documents the disposition.
- **Inputs**: COI template, prior declarations, related-party register, transaction details.
- **Outputs**: completed COI declarations, recusal log, disposition memo.
- **HITL checkpoints**: director attests → GC reviews → board notes disposition.
- **Cadence**: per-trigger.

### 23. AGM preparation

- **Mode**: Reactive (calendar-anchored — fires as the AGM countdown enters its window)
- **JTBD**: §1D Major events + §2A Board cycle
- **Trigger**: ~90 days before AGM, OR explicit corp-sec kickoff.
- **Description**: Assembles notice of meeting, proxy materials, voting items, governance statements, ESG disclosures, and proxy-advisor briefings. Coordinates with IR and external counsel.
- **Inputs**: AGM agenda, last-year materials, proxy-advisor coverage, shareholder register, disclosure rules.
- **Outputs**: notice of meeting, proxy materials, AGM minutes, vote results.
- **HITL checkpoints**: board approves resolutions → chair signs notice → vote results validated.
- **Cadence**: annual.

### 24. Director onboarding

- **Mode**: Reactive
- **JTBD**: §1C Board capability + §3C Director lifecycle
- **Trigger**: Completion of a **Board appointment** workflow (new director confirmed).
- **Description**: Provisions board-portal access, distributes orientation materials, schedules onboarding sessions (governance, strategy, risk, finance, ESG), records statutory acknowledgements (D&O insurance, COI policy, code of conduct).
- **Inputs**: director profile, onboarding template, governance policy pack.
- **Outputs**: provisioned access, orientation schedule, completed acknowledgements.
- **HITL checkpoints**: director confirms receipt of materials → corp sec signs off readiness.
- **Cadence**: per-appointment.

### 25. Quarterly governance policy review

- **Mode**: Reactive (also runs proactively via **Policy-drift detector** when external triggers appear)
- **JTBD**: §2C Governance program upkeep
- **Trigger**: Quarterly cadence, OR explicit kickoff from governance committee.
- **Description**: Compares current policies against latest regulatory guidance and benchmarks; produces a gap analysis and redline proposals.
- **Inputs**: current policy library, benchmark dataset, regulator guidance.
- **Outputs**: gap report, redline proposals, governance-committee paper.
- **HITL checkpoints**: governance committee reviews → board approves changes.
- **Cadence**: quarterly.

### 26. Board pack assembly (on-demand)

- **Mode**: Reactive (the **Board-pack pre-assembler** is the proactive variant)
- **JTBD**: §2A Board and committee meeting cycle
- **Trigger**: User-initiated for ad-hoc/off-cycle meetings, OR when pre-assembler stalls because contributors are late.
- **Description**: Same as the proactive pre-assembler but kicked off on demand with explicit scope from the corp sec.
- **Inputs**: meeting agenda, contributor list, deadline override.
- **Outputs**: assembled pack, QA report, published artifact.
- **HITL checkpoints**: chair signs off → publish.
- **Cadence**: per-meeting (ad-hoc).

### 27. Draft board minutes (on-demand)

- **Mode**: Reactive (the **Minutes drafter** is the proactive variant)
- **JTBD**: §2A Board cycle (post-meeting)
- **Trigger**: User request to re-draft minutes (e.g., after a special meeting where recording isn't automatically captured).
- **Description**: Same artifact as the proactive variant, kicked off with explicit source material provided by the corp sec.
- **Inputs**: user-supplied notes/transcripts, agenda, resolutions.
- **Outputs**: draft minutes, action-item register, resolutions log.
- **HITL checkpoints**: chair + GC review → archive.
- **Cadence**: per-meeting (ad-hoc).

### 28. Shareholder activism response

- **Mode**: Reactive
- **JTBD**: §4D Shareholder and stakeholder pressure
- **Trigger**: Activist 13D/13G filing detected, OR public letter received, OR proxy contest signaled.
- **Description**: Coordinates the board's governance response: extra meetings, information packs, IR/legal/comms alignment, disclosure cadence, defensive document review.
- **Inputs**: activist filing/letter, prior-engagement history, shareholder register, defensive playbook.
- **Outputs**: response plan, board briefings, disclosure timeline, meeting cadence.
- **HITL checkpoints**: chair and GC approve strategy → each disclosure reviewed before release.
- **Cadence**: per-event (multi-week).

### 29. Skills-matrix & succession review (cycle)

- **Mode**: Reactive (the **Skills-matrix watcher** is the proactive variant)
- **JTBD**: §1C Board capability
- **Trigger**: Annual review cycle, OR nominations-committee request following an evaluation.
- **Description**: Full review of board composition against the rubric, surfaces gaps, and produces succession options including external candidate sourcing brief.
- **Inputs**: director profiles, skills rubric, evaluation outputs, forward strategy.
- **Outputs**: composition report, succession options, sourcing brief.
- **HITL checkpoints**: nominations committee reviews → chair approves next steps.
- **Cadence**: annual + on-event.

### 30. Convene scheduled committee meeting

- **Mode**: Reactive
- **JTBD**: §2A Board and committee meeting cycle
- **Trigger**: Calendar-driven, OR committee chair request.
- **Description**: Lighter-weight sibling of the emergency-meeting workflow for routine committee convenings — agenda assembly, materials publication, attendance, minutes hand-off into the **Minutes drafter** workflow.
- **Inputs**: committee charter, recurring agenda template, last-meeting minutes, action-item register.
- **Outputs**: meeting notice, agenda, materials, action handoff.
- **HITL checkpoints**: committee chair signs off agenda → publish.
- **Cadence**: per-committee, per-meeting.

---

## Cross-references

- Several templates intentionally come in **proactive/reactive pairs** so the same artifact can be produced either by an agent watching the data or by a user-initiated request. These pairs share fixtures and artifacts and should be implemented against a shared workflow engine:
  - #4 Board calendar maintainer ↔ #30 Convene scheduled committee meeting
  - #5 Policy-drift detector ↔ #25 Quarterly governance policy review
  - #6 Skills-matrix watcher ↔ #29 Skills-matrix & succession review
  - #7 Board-pack pre-assembler ↔ #26 Board pack assembly (on-demand)
  - #8 Minutes drafter ↔ #27 Draft board minutes (on-demand)
  - #10 Director-disclosure refresh ↔ #22 Conflict-of-interest cycle
  - #1 Filing-deadline radar ↔ #18 Filing compliance-gap remediation
  - #2 Director-eligibility sentinel ↔ #15 Board appointment / #16 Director resignation handler

- A **single resignation event** can fan out through #2 (sentinel detects the gap) → #16 (resignation handler) → #15 (board appointment) → #24 (director onboarding) → and ultimately update artifacts maintained by #3 (entity register sync) and #4 (board calendar).

- A **regulator letter** can fan out through #19 (whistleblower / regulator response) → #17 (convene emergency board meeting) → #25 (policy review) where systemic remediation is required.

Use these pairings to keep agentic implementations DRY: the agent underneath the proactive variant should expose the same `run(input)` contract as the reactive variant.
