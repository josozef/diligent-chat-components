# 04 — Workflow Engine & State Machine

This document describes the runtime workflow structure, state transitions, and simulation logic. It is independent of any particular UI framework.

---

## Workflow Data Model

### Selected Appointment (Intake Output)

Created at the end of data collection (after consent is answered):

```
selectedAppointment = {
  company:          { id, name, location, country, flag }
  director:         null | { id, name, title }       // non-null only for replacements
  appointee:        { id, name, title }
  isReplacement:    boolean                          // false for "add new director"
  hasConsentToAct:  boolean
  effectiveDate:    string (ISO date, e.g. "2026-03-06") | null
}
```

### Current Appointment (Runtime Snapshot)

Created when the workflow starts. Flat strings for display:

```
currentAppointment = {
  company:              string     // e.g. "Pacific Polymer Logistics Pte. Ltd."
  companyMeta:          string     // e.g. "Domiciled in Singapore, Singapore"
  resigningDirector:    string | null
  resigningDirectorTitle: string | null
  appointee:            string     // e.g. "Priya Nair"
  appointeeTitle:       string     // e.g. "Regional Finance Director, APAC"
  isReplacement:        boolean
  hasConsentToAct:      boolean
  effectiveDate:        string | null
}
```

### Workflow State

```
appointmentWorkflowState = {
  approversSelected:    boolean
  documentsReviewed:    boolean
  selectedApprovers:    [{ name, initials, role }]
  selectedCommittee:    string | null        // e.g. "Nomination Committee"
}
```

### Process Control

```
processRunning:   boolean    // true from start until completion or cancellation
processPaused:    boolean    // true when user pauses; simulation stops advancing
```

---

## Process Steps Structure

The workflow is modeled as three sequential steps, each with substeps:

### Step 1: Approval

```
{
  id: 'approval',
  name: 'Approval',
  status: 'pending' | 'in_progress' | 'completed',
  voteCount: null | string,     // e.g. "4/4 Approved"
  boardResolution: {
    id: 'board-resolution',
    name: 'Board Resolution',
    status: 'pending' | 'completed',
    docLink: null | 'board-resolution-signed'
  },
  substeps: [
    { id: 'approval-create',    name: 'Create Board Resolution',  status, time },
    { id: 'approval-send',      name: 'Send to board members',    status, time },
    { id: 'approval-responses', name: 'Approval Responses',       status, time,
      approvers: [
        { id, name, title, status: 'pending'|'completed', time: null|string, vote: null|'Approved' }
      ]
    }
  ]
}
```

### Step 2: Filing

```
{
  id: 'filing',
  name: 'Filing',
  status: 'pending' | 'in_progress' | 'completed',
  substeps: []    // no substeps; status is toggled directly
}
```

### Step 3: Update Entities

```
{
  id: 'entities',
  name: 'Update Entities',
  status: 'pending' | 'in_progress' | 'completed',
  substeps: [
    // Only if replacement:
    { id: 'entity-resign',  name: 'Record {director} resignation',  status, time },
    // Always:
    { id: 'entity-appoint', name: 'Record {appointee} appointment', status, time }
  ]
}
```

---

## State Transitions

### Overall Flow

```
[Intake Complete]
    → approval.status = 'in_progress'
    → approval-create = 'completed' (immediate)
    → approval-send = 'in_progress' → 'completed'
    → approval-responses = 'in_progress'
        → each approver: vote = 'Approved', time set
    → approval-responses = 'completed'
    → approval.status = 'completed', voteCount set
    → boardResolution.status = 'completed', docLink = 'board-resolution-signed'

[User Notified: "Resolution Approved"]
    → filing.status = 'in_progress'

[User Confirms Filing Complete]
    → filing.status = 'completed'
    → entities.status = 'in_progress'
        → each substep: 'pending' → 'in_progress' → 'completed' (with timestamp)
    → entities.status = 'completed'

[All Steps Complete]
    → processRunning = false
    → workflow archived
```

### Status Values

Each step and substep uses the same status enum: `'pending'` → `'in_progress'` → `'completed'`.

Approver-level statuses: `'pending'` → `'completed'` (with `vote` and `time` set simultaneously).

---

## Simulation Timing

The approval simulation runs automatically after the user starts the workflow. It uses sequential delays to create realistic-looking progress.

### Approval Phase Timing

| Event | Delay from Start |
|-------|-----------------|
| approval-send → completed | ~500ms |
| approval-responses → in_progress | ~500ms after send completes |
| First approver vote | ~1500ms after responses start |
| Each subsequent approver | ~1500ms apart |
| Approval step complete | ~300ms after last vote |
| Board Resolution signed | ~300ms after step complete |
| "Ready to file" notification | ~same time as signing |
| Filing step → in_progress | ~500ms after notification |

### Entity Update Timing (After User Confirms Filing)

| Event | Delay |
|-------|-------|
| entities → in_progress | ~500ms |
| First substep → in_progress | immediate |
| First substep → completed | ~800ms |
| Second substep → in_progress | ~300ms gap |
| Second substep → completed | ~800ms |
| entities → completed | ~500ms after last substep |
| Workflow complete | ~500ms after entities done |

### Approval Timestamps (Display Labels)

These are cosmetic labels shown in the UI — they don't correspond to real clock time:

- Create Board Resolution: `Jan 7, 9:00 AM`
- Send to board members: `Jan 7, 9:15 AM`
- Approver responses: shuffled from pool `[Jan 7 2:30 PM, Jan 8 10:15 AM, Jan 8 3:45 PM, Jan 8 4:30 PM, Jan 9 9:00 AM]`
- Entity update timestamps: real-time `toLocaleString()` at the moment of completion

---

## Pause / Resume / Cancel

- **Pause**: Stops the simulation timer. No further state transitions occur until resumed.
- **Resume**: Restarts the simulation from where it left off. Already-completed substeps are skipped.
- **Cancel**: Sets `processRunning = false`, clears workflow flag, notifies user.

---

## Approver ID Mapping

Board member names are mapped to stable IDs for use in the process steps:

```
Robert Johnson    → approval-johnson
Margaret Sullivan → approval-sullivan
James Davidson    → approval-davidson
Linda Williams    → approval-williams
David Martinez    → approval-martinez
Thomas Chen       → approval-chen
Sarah Patel       → approval-patel
Patricia Walsh    → approval-walsh
```

If a name is not in this map, the ID is generated by slugifying the name.
