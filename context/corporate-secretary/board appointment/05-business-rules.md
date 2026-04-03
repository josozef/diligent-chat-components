# 05 — Business Rules & Edge Cases

This document captures the jurisdiction-specific logic, validation rules, and behavioral edge cases that any implementation must handle.

---

## Jurisdiction Rules

### Singapore (company.location === 'Singapore')

- **Regulatory body**: ACRA (Accounting and Corporate Regulatory Authority)
- **Consent form**: Called **Form 45 — Consent to Act as Director** (elsewhere it's the generic "Consent to Act as Director")
- **Regulatory filing form**: Called **Form 45 — Notification of Change of Director** (elsewhere: "Regulatory Filing Form")
- **Filing instructions**: Reference ACRA e-Filing system
- **Document filenames**: Use `Form_45_{CompanyShort}.pdf` instead of `Regulatory_Filing_{CompanyShort}.pdf`

### USA (Delaware, Texas, Michigan)

- Regulatory body varies by state (Delaware Division of Corporations, etc.)
- Documents use generic "Regulatory Filing Form" naming
- No special consent form naming

### Ireland / Netherlands

- Generic "regulatory body" reference
- Standard document naming

### Rule: How Jurisdiction Is Determined

The company's `location` field is checked. If it equals `'Singapore'`, Singapore-specific rules apply. All other values fall through to generic behavior.

---

## Approver Rules

### Committee Selection
- Exactly **one committee** must be selected per appointment
- The four committees are: Nomination, Audit, Compensation, Governance
- Members shown are specific to the selected committee

### Member Availability
- Some board members are flagged as **disabled** with a reason string
- Currently: **James Davidson** is disabled on the Nomination and Governance committees with reason: "Missing a saved signature template"
- Disabled members cannot be selected as approvers
- The disabled state and reason should be displayed to the user

### Minimum Approvers
- At least **one** enabled member must be selected to proceed
- There is no maximum — all enabled members can be selected

### Duplicate Members Across Committees
- The same person can appear on multiple committees (e.g. David Martinez on Nomination, Audit, and Compensation)
- This is expected — the user picks a committee and then selects from that committee's roster

### Vote Behavior (Prototype)
- All votes resolve as **"Approved"** — there is no reject or abstain path
- Votes arrive sequentially with simulated timestamps
- Vote order is randomized each run (timestamps are shuffled)
- Progress is displayed as a running tally: `{approved}/{total} Approved`

---

## Document Rules

### Generation Timing
- **Board Resolution** and **Form 45 / Consent to Act** are generated when approvers are confirmed (Step 5)
- They become available for Download and Review at that point
- The Board Resolution becomes "signed" after all approvers have voted

### Consent to Act Status
- The `hasConsentToAct` flag (from Step 3) does **not** block the workflow
- It is displayed in the preview and completion summaries
- When `false`, the Document section shows "No" — this is informational, not blocking

### Filing
- Filing is **always manual** in the current prototype (no automated e-filing)
- The user must explicitly confirm filing is complete
- The system does not validate that filing actually occurred — it trusts the user's confirmation

---

## Add New Person Rules

### Required Fields
All fields except Address Line 2 are marked as required:
- First Name, Last Name, Job Title, Passport/Government ID, Date of Birth
- Address: Line 1, City, State/Province/Region, Country, Postal Code

### Prototype Shortcut
- **No field validation is performed** — the form always succeeds
- The "new person" always resolves to **Priya Nair (ID: p2)** regardless of input
- In a production implementation, this would create a real entity record and return the new person's data

### Return Flow
After adding a person, the user is returned to the main form with:
- Company selection preserved (if previously chosen)
- Appointee pre-filled with the new person
- Effective Date still requiring confirmation
- The user can still dismiss either chip and change their selection

---

## Replacement vs. New Appointment

| Aspect | New Appointment | Replacement |
|--------|----------------|-------------|
| `isReplacement` | `false` | `true` |
| Director field | `null` | `{ id, name, title }` of departing director |
| Entity substeps | 1: Record appointment | 2: Record resignation + Record appointment |
| Label in preview | "New Director" | "Appointee" (with "Replacing" showing the outgoing director) |
| Workflow timeline text | "new appointment" | "director change" |

The current prototype's primary path is **New Appointment** only. The replacement flow exists but is a secondary/legacy code path.

---

## Effective Date

- Defaults to **today** when the form is first rendered
- Stored as an ISO date string: `YYYY-MM-DD`
- Displayed in a human-friendly format (e.g. "Mar 6, 2026")
- Required — the Continue button stays disabled without it
- No validation on whether the date is in the past or future

---

## Workflow State Rules

### Start Conditions
The "Start Approval Process" button appears only when:
1. Approvers have been selected and confirmed (`approversSelected === true`)
2. Documents have been reviewed (`documentsReviewed === true` — set automatically when approvers are confirmed)

### Completion Conditions
The workflow is complete when all three steps have `status === 'completed'`:
1. Approval: all approvers voted
2. Filing: user confirmed
3. Entities: all substeps completed

### Idempotency
- Starting the workflow a second time is prevented — the button is disabled after click
- All prior interactive elements (buttons, checkboxes, selects) in earlier steps are disabled after the workflow starts
- This creates a clear, linear audit trail

---

## Default Values & Fallbacks

| Field | Default |
|-------|---------|
| Effective Date | Today's date |
| Consent to Act | No default — user must explicitly choose Yes or No |
| `hasConsentToAct` in runtime | Falls back to `true` if missing (`?? true`) |
| Appointment type | `isReplacement: false` (new appointment) |
| Filing method | Always `'manual'` |
