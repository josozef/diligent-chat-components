/**
 * Canonical workflow types for the Conversational Board Appointment workflow.
 *
 * The shape is intentionally close to the Teams reference implementation
 * (board-appointment-teams) so the same workflow semantics back both
 * channels — only the rendering surface differs.
 */

export type Jurisdiction = "SG" | "US-DE" | "IE" | "NL";

export interface EntityRef {
  id: string;
  name: string;
  uen: string;
  location: string;
  country: string;
  jurisdiction: Jurisdiction;
}

export interface PersonRef {
  id: string;
  name: string;
  title: string;
  employer?: EntityRef;
}

export interface Candidate extends PersonRef {
  matchPct: number;
  resident: boolean;
  notes: string;
  recommended?: boolean;
}

export interface Approver {
  id: string;
  name: string;
  initials: string;
  title: string;
  email: string;
  fromCommittee: string;
}

export interface Trigger {
  source:
    | "workday.resignation"
    | "workday.new-seat"
    | "human-request"
    | "scheduled-review";
  detectedAt: string;
  framing: string;
  filingDeadline: string;
  lastWorkingDay: string;
}

export type WorkflowStepId =
  | "identify-candidate"
  | "collect-data"
  | "select-approvers"
  | "board-approval"
  | "filing"
  | "update-entities";

export type WorkflowSubTaskStatus =
  | "pending"
  | "in_progress"
  | "awaiting_hitl"
  | "completed"
  | "blocked"
  | "failed";

export interface WorkflowSubTask {
  id: string;
  label: string;
  /**
   * `human` marks HITL checkpoints that require a user decision/approval.
   * `agent` is autonomous work that can run asynchronously.
   */
  owner: "human" | "agent";
  status: WorkflowSubTaskStatus;
  /**
   * Indicates work that can continue in parallel with other step activity.
   * Useful for background drafting/preparation before the parent step is active.
   */
  async?: boolean;
}

export interface WorkflowStep {
  id: WorkflowStepId;
  name: string;
  status: "not_started" | "in_progress" | "completed";
  subTasks?: WorkflowSubTask[];
}

export interface ApproverVote {
  id: string;
  name: string;
  title: string;
  status: "pending" | "approved" | "declined";
  time: string | null;
}

export interface AgenticSubstep {
  name: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  time: string | null;
}

export interface ConsentDocument {
  sent: boolean;
  sentAt: string | null;
  signedAt: string | null;
}

export interface BoardResolution {
  sent: boolean;
  sentAt: string | null;
}

/**
 * Identifier for any item that can be inspected in the right-hand asset rail.
 * Mixes documents (which open the TipTap editor) with people lists (which open
 * a structured detail view).
 */
export type AssetId =
  | "candidate-shortlist"
  | "consent-to-act"
  | "approver-list"
  | "board-resolution"
  | "form45-notification";

export interface AppointmentConversationState {
  id: string;
  status: "active" | "paused" | "cancelled" | "complete";
  createdAt: string;
  updatedAt: string;

  trigger: Trigger;
  triggerAcknowledged: boolean;
  entity: EntityRef;
  isReplacement: boolean;
  departingDirector: PersonRef | null;

  selectedCandidate: Candidate | null;
  candidatePool: Candidate[];

  appointmentNric: string | null;
  appointmentEffectiveDate: string | null;

  consentDocument: ConsentDocument;
  approvers: {
    confirmed: boolean;
    primaryBoardMembers: Approver[];
    selected: Approver[];
  };
  boardResolution: BoardResolution;

  steps: WorkflowStep[];

  agentic: {
    active: boolean;
    votes: ApproverVote[];
    filingSubsteps: AgenticSubstep[];
    entitySubsteps: AgenticSubstep[];
    processComplete: boolean;
  };

  rightPanel: {
    /**
     * `null` while no asset has been generated yet (rail is hidden).
     * `'list'` once at least one asset exists (rail visible, list view).
     * Otherwise an `AssetId` and the rail is expanded with that item open.
     */
    open: null | "list" | AssetId;
  };

  /**
   * Which panel currently owns the "extra" horizontal space.
   * - `chat` — chat is wider, asset rail is compact (default).
   * - `assets` — asset rail is wider, chat is narrower (better for reading /
   *   editing a document in the right rail).
   *
   * Only meaningful when the asset rail is showing an expanded asset; with
   * the rail hidden or in list mode, the layout falls back to its default.
   */
  focus: "chat" | "assets";
}
