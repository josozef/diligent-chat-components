# 03 — User Journey

This document describes the logical steps a user takes to appoint a director, from initiation to completion. It is **interface-agnostic** — it describes *what* happens at each step, not *how* it's rendered.

---

## Journey Overview

```
Initiate → Collect Data → Consent → Preview → Select Approvers → Start Workflow → Monitor → File → Complete
```

---

## Phase 1: Data Collection

### Step 1 — Initiate

The user signals their intent to appoint a director. The system responds with a brief explanation of the three-phase process (Approval → Filing → Update Entities) and the four data points it will need: **Company**, **Appointee**, **Consent to Act**, and **Effective Date**.

### Step 2 — Select Company & Appointee + Effective Date

The user is presented with a form containing three fields:

1. **Company** (required) — Search-and-select from the entity list. Searchable by name, location, and country.
2. **Appointee** (required) — Search-and-select from the people list. Searchable by name and title. Also offers an **"Add New Person"** escape hatch (see Step 2a).
3. **Effective Date** (required) — Date picker, defaults to today.

**Continue** is disabled until all three fields have values.

**After selection**: Both company and appointee appear as dismissible **chips** (removable tags that show the selected value and let the user clear/re-pick). The user can remove a chip to change their selection before continuing.

### Step 2a — Add New Person (Sub-flow)

If the appointee doesn't exist in the system, the user can create one. This collects:

| Field | Required |
|-------|----------|
| First Name | Yes |
| Last Name | Yes |
| Job Title | Yes |
| Passport / Government ID | Yes (masked input with show/hide toggle) |
| Date of Birth | Yes |
| Address Line 1 | Yes |
| Address Line 2 | No |
| City | Yes |
| State / Province / Region | Yes |
| Country | Yes (dropdown) |
| Postal Code | Yes |

**After submit**: The new person is added to the entity system. The user is returned to the main form (Step 2) with:
- **Company** still selected (as a chip) if it was chosen before the detour
- **Appointee** now pre-filled with the newly created person (as a chip)
- **Effective Date** still needs confirmation

This is the "re-present with accumulated state" pattern — the user never loses context.

### Step 3 — Consent to Act

After submitting the company/appointee/date form, the system asks a standalone yes/no question:

> Do you have a **Consent to Act** on file for **{appointee name}**?

Options: **Yes** or **No**.

This is a separate step (not part of the main form) to give it appropriate weight — it determines whether the system flags a missing legal document.

---

## Phase 2: Preview & Configuration

### Step 4 — Preview Workflow

After consent is answered, the system assembles all collected data and shows a **workflow preview**. This is a summary view containing:

- **Company**: name, location, country
- **Appointee**: name, title
- **Effective Date**
- **Consent to Act**: Yes/No status
- **Approvers**: initially "Pending selection"
- **Documents**: initially "Pending review"
- **Workflow outline**: the three phases (Approval → Filing → Update Entities) with brief descriptions

This preview remains visible and updates as the user completes the next steps.

### Step 5 — Select Approvers

The user configures who will approve the appointment:

1. **Choose a committee** — Select one of: Nomination, Audit, Compensation, or Governance.
2. **Select members** — Checkboxes for each committee member. Some members may be **disabled** with a reason (e.g. "Missing a saved signature template"). At least one member must be selected.
3. **Confirm** — Locks in the approver list.

**After confirmation**:
- The approver list updates in the preview
- Documents are auto-generated: **Board Resolution** and **Form 45 / Consent to Act as Director**
- The documents appear in the preview with Download and Review actions
- A **Start Approval Process** action becomes available

### Step 6 — Start Workflow

The user triggers the approval process. This is a deliberate, explicit action — the user must confirm they're ready. Once started:
- All prior configuration controls become read-only
- The view transitions from "preview" to "in-progress monitoring"

---

## Phase 3: Execution & Monitoring

### Step 7 — Approval (Automated)

The system sends the Board Resolution to each selected approver and collects their votes. In the prototype this is simulated with realistic timing:

- Each approver responds sequentially over simulated hours/days
- All votes are "Approved" (no reject/abstain path in the prototype)
- A running tally shows progress: e.g. "2/4 Approved"

**When all approvers have responded**:
- The Board Resolution is marked as signed
- The approval step is marked complete
- The user is notified that documents are ready for filing

### Step 8 — Filing (User-Driven)

Filing is **manual** — the user must confirm they've completed the filing. The system:

1. Provides download links for the signed Board Resolution and regulatory form (Form 45 for Singapore)
2. Instructs the user to file these documents with the appropriate regulatory body
3. Waits for the user to click **Complete Workflow** / confirm filing is done

The system marks the filing step complete only when the user explicitly confirms.

### Step 9 — Update Entities (Automated)

After filing is confirmed, the system automatically updates entity records:

- If this is a **replacement**: first records the outgoing director's resignation
- Then records the new appointee's appointment
- Each substep shows a real-time timestamp when completed

### Step 10 — Completion

When all three phases are done:

- The workflow is marked **complete**
- A completion summary shows all details: company, appointee, consent status, effective date, approval results, filing status, entity updates
- The user can review but not modify anything

---

## Cancellation

At any point before the workflow starts (Steps 1–6), the user can cancel. This abandons the workflow and resets state.

During execution (Steps 7–9), the workflow can also be cancelled, which stops the simulation and marks the workflow as cancelled.

There is also a **pause/resume** capability during the automated approval phase.

---

## Data Flow Summary

```
Step 2:  company, appointee, effectiveDate  →  stored as pending
Step 3:  hasConsentToAct (boolean)          →  combined with pending data
Step 4:  selectedAppointment = { company, appointee, effectiveDate, hasConsentToAct, isReplacement: false }
Step 5:  selectedApprovers[], selectedCommittee  →  stored in workflow state
Step 6:  triggers processSteps creation from selectedAppointment + approvers
Step 7–9: processSteps mutated in place (status, timestamps, votes)
Step 10: processRunning = false, workflow archived
```
