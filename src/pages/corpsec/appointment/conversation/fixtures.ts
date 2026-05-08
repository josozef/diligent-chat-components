import type {
  AppointmentConversationState,
  Approver,
  Candidate,
  EntityRef,
  PersonRef,
} from "./types";

export const PACIFIC_POLYMER: EntityRef = {
  id: "ent-pacific-polymer",
  name: "Pacific Polymer Logistics Pte. Ltd.",
  uen: "201812345K",
  location: "Singapore",
  country: "Singapore",
  jurisdiction: "SG",
};

export const DEPARTING_DIRECTOR: PersonRef = {
  id: "per-david-chen",
  name: "David Chen",
  title: "Director",
  employer: PACIFIC_POLYMER,
};

export const CANDIDATE_POOL: Candidate[] = [
  {
    id: "cand-priya-nair",
    name: "Priya Nair",
    title: "Regional Finance Director, APAC",
    matchPct: 94,
    resident: true,
    notes: "Singapore resident · No disqualifications · Strong finance background",
    recommended: true,
  },
  {
    id: "cand-lim-pei-shan",
    name: "Lim Pei Shan",
    title: "Director of Risk Management",
    matchPct: 87,
    resident: true,
    notes: "Singapore resident · Compliance & risk specialist",
  },
  {
    id: "cand-kenji-tanaka",
    name: "Kenji Tanaka",
    title: "Head of Digital Transformation",
    matchPct: 72,
    resident: false,
    notes: "Non-resident — would not satisfy the local director requirement on its own",
  },
];

const PRIMARY_BOARD_MEMBERS: Approver[] = [
  {
    id: "robert-johnson",
    name: "Robert Johnson",
    initials: "RJ",
    title: "Committee Chair, Nominating & Governance",
    email: "robert.johnson@acme.example",
    fromCommittee: "Nominating & Governance",
  },
  {
    id: "margaret-sullivan",
    name: "Margaret Sullivan",
    initials: "MS",
    title: "Chief Executive Officer",
    email: "margaret.sullivan@acme.example",
    fromCommittee: "Executive",
  },
  {
    id: "linda-williams",
    name: "Linda Williams",
    initials: "LW",
    title: "Independent Director",
    email: "linda.williams@acme.example",
    fromCommittee: "Audit",
  },
  {
    id: "david-martinez",
    name: "David Martinez",
    initials: "DM",
    title: "Independent Director",
    email: "david.martinez@acme.example",
    fromCommittee: "Audit",
  },
];

const formatTime = () =>
  new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

void formatTime; // referenced from context for runtime timing

export function buildInitialState(): AppointmentConversationState {
  const now = new Date().toISOString();
  return {
    id: "appt-conv-pacific-polymer",
    status: "active",
    createdAt: now,
    updatedAt: now,

    trigger: {
      source: "workday.resignation",
      detectedAt: now,
      framing:
        "Workday flagged David Chen's resignation 14 days before his last working day. Pacific Polymer must keep at least one Singapore-resident director on file at all times — Form 45 needs to be lodged with ACRA within 14 days of the change.",
      filingDeadline: "2026-05-01",
      lastWorkingDay: "2026-05-17",
    },
    triggerAcknowledged: false,
    entity: PACIFIC_POLYMER,
    isReplacement: true,
    departingDirector: DEPARTING_DIRECTOR,

    selectedCandidate: null,
    candidatePool: CANDIDATE_POOL,

    appointmentNric: null,
    appointmentEffectiveDate: null,

    consentDocument: { sent: false, sentAt: null, signedAt: null },
    approvers: {
      confirmed: false,
      primaryBoardMembers: PRIMARY_BOARD_MEMBERS,
      selected: PRIMARY_BOARD_MEMBERS,
    },
    boardResolution: { sent: false, sentAt: null },

    steps: [
      {
        id: "identify-candidate",
        name: "Identify replacement candidate",
        status: "in_progress",
      },
      {
        id: "collect-data",
        name: "Collect appointment data",
        status: "not_started",
        subTasks: [
          {
            id: "collect-data-confirm-info",
            label: "Confirm candidate information",
            owner: "human",
            status: "pending",
          },
          {
            id: "collect-data-draft-consent",
            label: "Draft Consent to Act document",
            owner: "agent",
            status: "pending",
            async: true,
          },
        ],
      },
      {
        id: "select-approvers",
        name: "Configure approvers",
        status: "not_started",
        subTasks: [
          {
            id: "select-approvers-hitl-configure",
            label: "Configure approvers",
            owner: "human",
            status: "pending",
          },
          {
            id: "select-approvers-draft-resolution",
            label: "Draft board resolution document",
            owner: "agent",
            status: "pending",
            async: true,
          },
          {
            id: "select-approvers-hitl-send-resolution",
            label: "Approve board resolution document",
            owner: "human",
            status: "pending",
          },
        ],
      },
      { id: "board-approval", name: "Board approval", status: "not_started" },
      {
        id: "filing",
        name: "Regulatory filing",
        status: "not_started",
        subTasks: [
          {
            id: "filing-prepare-packet",
            label: "Pre-assemble filing packet",
            owner: "agent",
            status: "pending",
            async: true,
          },
        ],
      },
      { id: "update-entities", name: "Update entity records", status: "not_started" },
    ],

    agentic: {
      active: false,
      votes: PRIMARY_BOARD_MEMBERS.map((m) => ({
        id: m.id,
        name: m.name,
        title: m.title,
        status: "pending" as const,
        time: null,
      })),
      filingSubsteps: [
        { name: "Download signed documents",    status: "pending", time: null },
        { name: "e-File with ACRA via BizFile+", status: "pending", time: null },
        { name: "Confirm filing acceptance",    status: "pending", time: null },
      ],
      entitySubsteps: [
        { name: "Record resignation — David Chen",        status: "pending", time: null },
        { name: "Record appointment — [Appointee Name]",  status: "pending", time: null },
      ],
      processComplete: false,
    },

    rightPanel: { open: null },
    focus: "chat",
  };
}
