Below is an ideal, high-level agentic workflow for remediating a third-party vulnerability using Diligent’s security stack (IT Risk Management, IT Compliance, IT Vendor Risk Management, ERM, Boards / board reporting, etc.). I’ll focus on: trigger → blast radius → orchestration → assurance → board notification.

0. Trigger & Normalization
Trigger

External intelligence, vendor advisory, or continuous third-party monitoring flags a new high-risk vulnerability in a widely-used vendor product (e.g., via Diligent IT Vendor Risk Management and integrated sources like Bitsight/SecurityScorecard). 
Agent actions

Ingest advisory (CVE, vendor notice, threat intel) and normalize:

Vendor name, product/service, versions.
CVE/severity, exploitability, known PoC.
Recommended fixes / patch timelines.
Create or update a “Cyber Event / Vulnerability” object in IT Risk Management (ITRM) tagged as “third-party / supply-chain.” 

1. Identify Exposure & Blast Radius
Data sources used

IT Vendor Risk Management: vendor inventory, relationships, criticality, regions, vendor risk scores and workflows. 
ITRM & IT Compliance: asset catalog, control/asset mappings, data classifications, related controls and owners. 
ERM: business processes and top risks linked to IT/cyber risks. 
Agent actions

Match vendor & product

Query Vendor Risk: find all active vendors that match the advisory (exact vendor, subsidiaries, product lines). 
Map to internal systems & data

For each vendor/product, pull linked:
Internal applications/services using it.
Data flows and data classification (is customer data involved? which regions?). 
Control sets and policies (e.g., patch mgmt, vendor mgmt, vuln mgmt) mapped in IT Compliance. 
Derive blast radius

Aggregate a view of:
Affected systems and environments.
Business capabilities / ERM risks those systems support.
Customers/regions potentially exposed if exploited. 
Output: a structured exposure summary object the rest of the workflow can use.

2. Rapid Risk Assessment & Plan
Data sources used

ITRM risk libraries, scoring templates, scenarios. 
IT Compliance control mappings and obligations (frameworks, regulations). 
Agent actions

Risk scoring

Update or create an IT risk entry:
Threat: third-party vuln in product X.
Assets: list from blast-radius step.
Impact: tied to customer data exposure and business disruption.
Apply standard scoring templates to quantify inherent and current residual risk. 
Control gap check

Pull mapped controls from IT Compliance (e.g., patch SLAs, vendor security requirements).
Detect gaps: overdue patches, missing monitoring, weak vendor assurances, missing segmentation, etc. 
Generate remediation plan

Based on templates and policy:
Required: vendor patch / mitigation steps.
Compensating: temporary network controls, logging, access restrictions.
Validation: scans or checks to confirm remediation.
Convert into a structured remediation playbook instance for this incident (steps, owners, deadlines, dependencies).
3. Orchestrate Tasks Across Owners
Data sources used

Ownership metadata (control owners, system owners, vendor managers) stored in ITRM / IT Compliance / Vendor Risk. 
Task/workflow capabilities in Diligent’s IT compliance / risk modules (“AI maps controls, tracks deadlines”). 
Agent actions

For each affected vendor/system:

Create and route tasks

Examples:

Vendor management
Task: obtain vendor patch details, timelines, and official advisory; ensure vendor commits to SLA.
Infra / app owners
Task: apply patches or mitigations in defined test and production scopes; include due dates derived from policy SLAs.
Security operations
Task: increase monitoring and alerting for relevant IOCs; add tailored detection rules.
Compliance / audit
Task: capture evidence (screenshots, logs, change tickets) to prove remediation and compliance for later audits.
Agent auto-assigns owners and deadlines based on existing ownership mappings and control SLAs, logging tasks in Diligent’s workflows (and, where integrated, mirroring to ticketing systems). 

Prioritize & sequence

Prioritize tasks based on:
Data sensitivity.
Internet exposure.
Business criticality (via ERM links). 
Continuous status ingest

Poll task status and any connected tools.
Update a live remediation dashboard in ITRM/IT Compliance: per-vendor and per-system completion % and at-risk items.
4. Validate Remediation & Re-Score Risk
Data sources used

IT Compliance / ITRM evidence store and test results. 
Vendor Risk monitoring (score changes, updated findings, attestations). 
Agent actions

Technical validation

Confirm patches or mitigations are applied:
Evidence from change records, config baselines, or scan outputs attached to the relevant controls in IT Compliance. 
Vendor confirmation

Ingest vendor attestation / updated advisory.
Check external risk scores for improvement or removal of the issue (Bitsight/SecurityScorecard via Vendor Risk). 
Risk re-assessment

Recalculate residual risk in ITRM for:
Each affected asset/vendor.
The aggregated “third-party vuln” risk entry.
Update ERM entries where this risk is linked, ensuring it now reflects post-remediation status. 
Close tasks

Auto-close tasks where validation passes; escalate any overdue or failed items to owners and, if needed, to leadership.
5. Reporting to Executives & Board
Data sources used

ITRM risk timelines and metrics. 
IT Compliance evidence and control status. 
Vendor Risk exposure view (vendors impacted, remediation status). 
Board-reporting templates for IT risk and cyber (Diligent Board Reporting for IT Risk, cyber playbooks and guides). 
Agent actions

During the incident (operational view)

Maintain an executive dashboard:
Vendors/products affected.
Systems and customer data at risk.
Patch/mitigation progress vs SLA.
Current residual risk vs appetite.
Board-ready reporting after remediation

Auto-generate a board packet / slide deck using the IT risk board-reporting solution: 
Brief description of the vulnerability and affected vendor(s).
Business impact analysis (what could have happened, including customer data risk).
Timeline: detection → containment → remediation → validation.
Governance view: how controls, third-party risk program and incident response functioned; any gaps.
Residual risk, follow-up program changes, and any regulatory/customer communications.
Governance and traceability

Link all supporting risk, compliance, and vendor-risk records behind the board summary so that any board question (“how did you get this number?”) is traceable back to detailed data in the platform. 
6. Programmatic Follow-Up
Agent actions

Improve third-party program

Propose updates to:
Vendor questionnaires.
Minimum security requirements.
Continuous monitoring thresholds and playbooks. 
Tighten controls & policies

Suggest changes to IT Compliance content:
Patch SLAs for high-risk third-party components.
Additional monitoring or segmentation requirements for similar vendors. 
Refine board cyber reporting

Update board templates to include:
New metrics (e.g., “time-to-remediate critical third-party vulns,” “coverage of continuous third-party monitoring”). 
This gives you a full agentic loop: detect → map → plan → orchestrate → verify → report → improve, leveraging Diligent’s vendor, IT risk, IT compliance, ERM, and board-reporting capabilities as shared data and action surfaces.