import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";

import type {
  AgenticSubstep,
  AppointmentConversationState,
  ApproverVote,
  AssetId,
  Candidate,
  WorkflowStepId,
  WorkflowSubTaskStatus,
} from "./types";
import { buildInitialState } from "./fixtures";

/* ── Reducer ────────────────────────────────────────────────── */

type Action =
  | { type: "START_WORKFLOW" }
  | { type: "SELECT_CANDIDATE"; candidate: Candidate }
  | { type: "SUBMIT_APPOINTMENT_DATA"; nric: string; effectiveDate: string }
  | { type: "SEND_CONSENT" }
  | { type: "SIGN_CONSENT" }
  | { type: "CONFIRM_APPROVERS" }
  | { type: "SET_APPROVERS"; approvers: AppointmentConversationState["approvers"]["selected"] }
  | { type: "SEND_RESOLUTION" }
  | { type: "CAST_VOTE"; approverId: string; vote: "approved" | "declined"; atTime?: string }
  | { type: "PROGRESS_FILING"; index: number; status: AgenticSubstep["status"] }
  | { type: "PROGRESS_ENTITY"; index: number; status: AgenticSubstep["status"] }
  | { type: "ADVANCE_STEP"; completed: WorkflowStepId; next: WorkflowStepId | null }
  | { type: "COMPLETE_PROCESS" }
  | { type: "OPEN_ASSET"; asset: AssetId | null | "list" }
  | { type: "SET_FOCUS"; focus: "chat" | "assets" }
  | {
      type: "SET_SUBTASK_STATUS";
      stepId: WorkflowStepId;
      subTaskId: string;
      status: WorkflowSubTaskStatus;
    }
  | { type: "RESET_CANDIDATE" }
  | { type: "RESET_DATA" }
  | { type: "RESET_CONSENT" }
  | { type: "RESET_APPROVERS" };

const formatTime = () =>
  new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

function setStep(
  state: AppointmentConversationState,
  id: WorkflowStepId,
  status: AppointmentConversationState["steps"][number]["status"],
): AppointmentConversationState {
  return {
    ...state,
    updatedAt: new Date().toISOString(),
    steps: state.steps.map((s) => (s.id === id ? { ...s, status } : s)),
  };
}

/**
 * Update a single subtask's status in-place. No-op if the step or subtask isn't
 * found, or if the status is already the target value.
 */
function setSubTaskStatus(
  state: AppointmentConversationState,
  stepId: WorkflowStepId,
  subTaskId: string,
  status: WorkflowSubTaskStatus,
): AppointmentConversationState {
  return {
    ...state,
    updatedAt: new Date().toISOString(),
    steps: state.steps.map((s) =>
      s.id !== stepId
        ? s
        : {
            ...s,
            subTasks: s.subTasks?.map((t) =>
              t.id === subTaskId && t.status !== status
                ? { ...t, status }
                : t,
            ),
          },
    ),
  };
}

/**
 * Cascade: when a parent step closes, its remaining subtasks should be marked
 * completed too — the work is done, the checkpoints are no longer blocking.
 * Defensive against any subtask that wasn't explicitly transitioned.
 */
function completeAllSubTasks(
  state: AppointmentConversationState,
  stepId: WorkflowStepId,
): AppointmentConversationState {
  return {
    ...state,
    steps: state.steps.map((s) =>
      s.id !== stepId
        ? s
        : {
            ...s,
            subTasks: s.subTasks?.map((t) =>
              t.status === "completed" ? t : { ...t, status: "completed" as const },
            ),
          },
    ),
  };
}

function reducer(
  state: AppointmentConversationState,
  action: Action,
): AppointmentConversationState {
  switch (action.type) {
    case "START_WORKFLOW": {
      if (state.triggerAcknowledged) return state;
      return {
        ...state,
        updatedAt: new Date().toISOString(),
        triggerAcknowledged: true,
      };
    }

    case "SELECT_CANDIDATE": {
      let next = setStep(
        setStep(state, "identify-candidate", "completed"),
        "collect-data",
        "in_progress",
      );
      // Collect-data now active — the first checkpoint asks the user to
      // confirm candidate information. Drafting the consent waits on that.
      next = setSubTaskStatus(
        next,
        "collect-data",
        "collect-data-confirm-info",
        "awaiting_hitl",
      );
      return {
        ...next,
        selectedCandidate: action.candidate,
        agentic: {
          ...next.agentic,
          entitySubsteps: next.agentic.entitySubsteps.map((s, i) =>
            i === 1 ? { ...s, name: `Record appointment — ${action.candidate.name}` } : s,
          ),
        },
        // The candidate shortlist becomes the first available asset — it shows
        // up in the side-rail Assets section automatically via `hasAsset()`.
        // No right-panel auto-open here; the panel only opens on user click.
      };
    }

    case "RESET_CANDIDATE": {
      // Roll the workflow back to the identify-candidate step so the user can re-pick.
      // Downstream data is left intact — the user can re-confirm if they want a fresh draft.
      return {
        ...state,
        updatedAt: new Date().toISOString(),
        selectedCandidate: null,
        steps: state.steps.map((s) =>
          s.id === "identify-candidate" ? { ...s, status: "in_progress" as const } : s,
        ),
      };
    }

    case "SUBMIT_APPOINTMENT_DATA": {
      let next = setSubTaskStatus(
        state,
        "collect-data",
        "collect-data-confirm-info",
        "completed",
      );
      // The agent now has what it needs — start drafting the Consent to Act.
      // The async simulator will mark this as completed shortly after.
      next = setSubTaskStatus(
        next,
        "collect-data",
        "collect-data-draft-consent",
        "in_progress",
      );
      return {
        ...next,
        updatedAt: new Date().toISOString(),
        appointmentNric: action.nric,
        appointmentEffectiveDate: action.effectiveDate,
      };
    }

    case "RESET_DATA": {
      // Roll the collect-data subtasks back to their pre-confirmation state.
      let next = setSubTaskStatus(
        state,
        "collect-data",
        "collect-data-confirm-info",
        "awaiting_hitl",
      );
      next = setSubTaskStatus(
        next,
        "collect-data",
        "collect-data-draft-consent",
        "pending",
      );
      return {
        ...next,
        updatedAt: new Date().toISOString(),
        appointmentNric: null,
        appointmentEffectiveDate: null,
      };
    }

    case "SEND_CONSENT": {
      return {
        ...state,
        updatedAt: new Date().toISOString(),
        consentDocument: {
          ...state.consentDocument,
          sent: true,
          sentAt: new Date().toISOString(),
        },
      };
    }

    case "SIGN_CONSENT": {
      let after = setStep(
        setStep(state, "collect-data", "completed"),
        "select-approvers",
        "in_progress",
      );
      // Defensive cascade — anything still mid-flight in collect-data is now
      // closed (the parent is done).
      after = completeAllSubTasks(after, "collect-data");
      // Select-approvers becomes the active step. The first checkpoint is
      // the user confirming the approver list; the agent can begin drafting
      // the resolution in parallel.
      after = setSubTaskStatus(
        after,
        "select-approvers",
        "select-approvers-hitl-configure",
        "awaiting_hitl",
      );
      after = setSubTaskStatus(
        after,
        "select-approvers",
        "select-approvers-draft-resolution",
        "in_progress",
      );
      // Background agent prep for the regulatory filing kicks off here as
      // well — runs async until the filing step actually executes.
      after = setSubTaskStatus(
        after,
        "filing",
        "filing-prepare-packet",
        "in_progress",
      );
      return {
        ...after,
        consentDocument: {
          ...after.consentDocument,
          signedAt: new Date().toISOString(),
        },
      };
    }

    case "RESET_CONSENT": {
      return {
        ...state,
        updatedAt: new Date().toISOString(),
        consentDocument: { sent: false, sentAt: null, signedAt: null },
      };
    }

    case "CONFIRM_APPROVERS": {
      let next = {
        ...state,
        updatedAt: new Date().toISOString(),
        approvers: { ...state.approvers, confirmed: true },
      };
      next = setSubTaskStatus(
        next,
        "select-approvers",
        "select-approvers-hitl-configure",
        "completed",
      );
      // Approving the resolution is the next blocking checkpoint.
      next = setSubTaskStatus(
        next,
        "select-approvers",
        "select-approvers-hitl-send-resolution",
        "awaiting_hitl",
      );
      return next;
    }

    case "RESET_APPROVERS": {
      return {
        ...state,
        updatedAt: new Date().toISOString(),
        approvers: { ...state.approvers, confirmed: false },
        boardResolution: { sent: false, sentAt: null },
      };
    }

    case "SET_APPROVERS": {
      const priorVotesById = new Map(state.agentic.votes.map((v) => [v.id, v]));
      const nextVotes: ApproverVote[] = action.approvers.map((a) => {
        const prior = priorVotesById.get(a.id);
        return (
          prior ?? {
            id: a.id,
            name: a.name,
            title: a.title,
            status: "pending" as const,
            time: null,
          }
        );
      });
      return {
        ...state,
        updatedAt: new Date().toISOString(),
        approvers: { ...state.approvers, selected: action.approvers, confirmed: false },
        agentic: { ...state.agentic, votes: nextVotes },
      };
    }

    case "SEND_RESOLUTION": {
      let after = setStep(
        setStep(state, "select-approvers", "completed"),
        "board-approval",
        "in_progress",
      );
      after = completeAllSubTasks(after, "select-approvers");
      return {
        ...after,
        boardResolution: {
          ...after.boardResolution,
          sent: true,
          sentAt: new Date().toISOString(),
        },
        agentic: { ...after.agentic, active: true },
      };
    }

    case "CAST_VOTE": {
      const votes: ApproverVote[] = state.agentic.votes.map((v) =>
        v.id === action.approverId
          ? { ...v, status: action.vote, time: action.atTime ?? formatTime() }
          : v,
      );
      return {
        ...state,
        updatedAt: new Date().toISOString(),
        agentic: { ...state.agentic, votes },
      };
    }

    case "PROGRESS_FILING": {
      return {
        ...state,
        updatedAt: new Date().toISOString(),
        agentic: {
          ...state.agentic,
          filingSubsteps: state.agentic.filingSubsteps.map((s, i) =>
            i === action.index
              ? {
                  ...s,
                  status: action.status,
                  time: action.status === "completed" ? formatTime() : s.time,
                }
              : s,
          ),
        },
      };
    }

    case "PROGRESS_ENTITY": {
      return {
        ...state,
        updatedAt: new Date().toISOString(),
        agentic: {
          ...state.agentic,
          entitySubsteps: state.agentic.entitySubsteps.map((s, i) =>
            i === action.index
              ? {
                  ...s,
                  status: action.status,
                  time: action.status === "completed" ? formatTime() : s.time,
                }
              : s,
          ),
        },
      };
    }

    case "ADVANCE_STEP": {
      let next = setStep(state, action.completed, "completed");
      next = completeAllSubTasks(next, action.completed);
      if (action.next) next = setStep(next, action.next, "in_progress");
      // Filing kicks off — the pre-assembled packet is now consumed.
      if (action.next === "filing") {
        next = setSubTaskStatus(
          next,
          "filing",
          "filing-prepare-packet",
          "completed",
        );
      }
      return next;
    }

    case "SET_SUBTASK_STATUS": {
      return setSubTaskStatus(state, action.stepId, action.subTaskId, action.status);
    }

    case "COMPLETE_PROCESS": {
      return {
        ...state,
        status: "complete",
        updatedAt: new Date().toISOString(),
        agentic: { ...state.agentic, processComplete: true },
      };
    }

    case "OPEN_ASSET": {
      // Opening an actual document expands the right rail — switch focus to
      // assets so the user gets the wider editing surface immediately.
      // Going back to the list collapses focus back to chat.
      const isDocument = action.asset !== null && action.asset !== "list";
      return {
        ...state,
        rightPanel: { open: action.asset },
        focus: isDocument ? "assets" : "chat",
      };
    }

    case "SET_FOCUS": {
      if (state.focus === action.focus) return state;
      return { ...state, focus: action.focus };
    }

    default:
      return state;
  }
}

/* ── Context surface ─────────────────────────────────────────── */

interface WorkflowConversationContextValue {
  state: AppointmentConversationState;

  // Step actions
  startWorkflow: () => void;
  selectCandidate: (candidate: Candidate) => void;
  resetCandidate: () => void;
  submitAppointmentData: (nric: string, effectiveDate: string) => void;
  resetAppointmentData: () => void;
  sendConsent: () => void;
  signConsent: () => void;
  resetConsent: () => void;
  confirmApprovers: () => void;
  setApprovers: (approvers: AppointmentConversationState["approvers"]["selected"]) => void;
  resetApprovers: () => void;
  sendResolution: () => void;

  // Right panel
  openAsset: (asset: AssetId | "list" | null) => void;
  setFocus: (focus: "chat" | "assets") => void;

  // Whether a given asset has yet been "produced" by the workflow (and so should
  // appear in the right rail's list view).
  hasAsset: (asset: AssetId) => boolean;

  // Anchor IDs used by the chat thread to make individual cards scrollable from
  // the workflow side rail.
  cardAnchorId: (step: WorkflowStepId) => string;
  scrollToStep: (step: WorkflowStepId) => void;
}

const WorkflowConversationContext = createContext<WorkflowConversationContextValue | null>(
  null,
);

const ROBERT_VOTE_AUTOMATION_DELAY_MS = 600;
const REMAINING_VOTES_INTERVAL_MS = 1100;
const FILING_STEP_INTERVAL_MS = 1400;
const ENTITY_STEP_INTERVAL_MS = 1400;

export function WorkflowConversationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitialState);

  /* Step actions ──────────────────────────────────────────── */

  const startWorkflow = useCallback(() => dispatch({ type: "START_WORKFLOW" }), []);
  const selectCandidate = useCallback(
    (candidate: Candidate) => dispatch({ type: "SELECT_CANDIDATE", candidate }),
    [],
  );
  const resetCandidate = useCallback(() => dispatch({ type: "RESET_CANDIDATE" }), []);
  const submitAppointmentData = useCallback(
    (nric: string, effectiveDate: string) =>
      dispatch({ type: "SUBMIT_APPOINTMENT_DATA", nric, effectiveDate }),
    [],
  );
  const resetAppointmentData = useCallback(() => dispatch({ type: "RESET_DATA" }), []);
  const sendConsent = useCallback(() => dispatch({ type: "SEND_CONSENT" }), []);
  const signConsent = useCallback(() => dispatch({ type: "SIGN_CONSENT" }), []);
  const resetConsent = useCallback(() => dispatch({ type: "RESET_CONSENT" }), []);
  const confirmApprovers = useCallback(() => dispatch({ type: "CONFIRM_APPROVERS" }), []);
  const setApprovers = useCallback(
    (approvers: AppointmentConversationState["approvers"]["selected"]) =>
      dispatch({ type: "SET_APPROVERS", approvers }),
    [],
  );
  const resetApprovers = useCallback(() => dispatch({ type: "RESET_APPROVERS" }), []);
  const sendResolution = useCallback(() => dispatch({ type: "SEND_RESOLUTION" }), []);
  const openAsset = useCallback(
    (asset: AssetId | "list" | null) => dispatch({ type: "OPEN_ASSET", asset }),
    [],
  );
  const setFocus = useCallback(
    (focus: "chat" | "assets") => dispatch({ type: "SET_FOCUS", focus }),
    [],
  );

  /* Async agent drafting — simulate the small delay between an agent
   * starting a draft and finishing it. Two independent timers because the
   * two drafts are produced by independent steps and can run concurrently
   * with whatever else the user is doing. */

  const draftConsentStatus = state.steps
    .find((s) => s.id === "collect-data")
    ?.subTasks?.find((t) => t.id === "collect-data-draft-consent")?.status;

  useEffect(() => {
    if (draftConsentStatus !== "in_progress") return;
    const t = setTimeout(() => {
      dispatch({
        type: "SET_SUBTASK_STATUS",
        stepId: "collect-data",
        subTaskId: "collect-data-draft-consent",
        status: "completed",
      });
    }, 1200);
    return () => clearTimeout(t);
  }, [draftConsentStatus]);

  const draftResolutionStatus = state.steps
    .find((s) => s.id === "select-approvers")
    ?.subTasks?.find((t) => t.id === "select-approvers-draft-resolution")?.status;

  useEffect(() => {
    if (draftResolutionStatus !== "in_progress") return;
    const t = setTimeout(() => {
      dispatch({
        type: "SET_SUBTASK_STATUS",
        stepId: "select-approvers",
        subTaskId: "select-approvers-draft-resolution",
        status: "completed",
      });
    }, 1400);
    return () => clearTimeout(t);
  }, [draftResolutionStatus]);

  /* Auto-advance simulation — board-approval → filing → entities ── */

  const automationStartedRef = useRef(false);
  const votesRef = useRef(state.agentic.votes);
  useEffect(() => {
    votesRef.current = state.agentic.votes;
  }, [state.agentic.votes]);

  const leadApproverId = state.approvers.selected[0]?.id ?? null;
  const leadApproved = leadApproverId
    ? state.agentic.votes.find((v) => v.id === leadApproverId)?.status === "approved"
    : false;

  // After the resolution is sent, the lead approver auto-approves shortly
  // after — this kicks off the rest of the autonomous segment.
  const leadAutoApproveStartedRef = useRef(false);
  useEffect(() => {
    if (!state.agentic.active) return;
    if (leadAutoApproveStartedRef.current) return;
    if (!leadApproverId) return;
    leadAutoApproveStartedRef.current = true;
    const t = setTimeout(() => {
      dispatch({ type: "CAST_VOTE", approverId: leadApproverId, vote: "approved" });
    }, ROBERT_VOTE_AUTOMATION_DELAY_MS);
    return () => clearTimeout(t);
  }, [state.agentic.active, leadApproverId]);

  useEffect(() => {
    if (!state.agentic.active || automationStartedRef.current) return;
    if (!leadApproved || !leadApproverId) return;
    automationStartedRef.current = true;

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timeouts.push(setTimeout(fn, ms));

    const remaining = votesRef.current.filter(
      (v) => v.id !== leadApproverId && v.status === "pending",
    );

    remaining.forEach((v, idx) => {
      at(idx * REMAINING_VOTES_INTERVAL_MS, () =>
        dispatch({ type: "CAST_VOTE", approverId: v.id, vote: "approved" }),
      );
    });

    const lastVoteAt = Math.max(0, remaining.length - 1) * REMAINING_VOTES_INTERVAL_MS;

    at(lastVoteAt + 1200, () => {
      dispatch({ type: "ADVANCE_STEP", completed: "board-approval", next: "filing" });
      dispatch({ type: "PROGRESS_FILING", index: 0, status: "in_progress" });
    });
    at(lastVoteAt + 1200 + FILING_STEP_INTERVAL_MS, () => {
      dispatch({ type: "PROGRESS_FILING", index: 0, status: "completed" });
      dispatch({ type: "PROGRESS_FILING", index: 1, status: "in_progress" });
    });
    at(lastVoteAt + 1200 + FILING_STEP_INTERVAL_MS * 2, () => {
      dispatch({ type: "PROGRESS_FILING", index: 1, status: "completed" });
      dispatch({ type: "PROGRESS_FILING", index: 2, status: "in_progress" });
    });
    at(lastVoteAt + 1200 + FILING_STEP_INTERVAL_MS * 3, () => {
      dispatch({ type: "PROGRESS_FILING", index: 2, status: "completed" });
      dispatch({ type: "ADVANCE_STEP", completed: "filing", next: "update-entities" });
      dispatch({ type: "PROGRESS_ENTITY", index: 0, status: "in_progress" });
    });
    at(lastVoteAt + 1200 + FILING_STEP_INTERVAL_MS * 3 + ENTITY_STEP_INTERVAL_MS, () => {
      dispatch({ type: "PROGRESS_ENTITY", index: 0, status: "completed" });
      dispatch({ type: "PROGRESS_ENTITY", index: 1, status: "in_progress" });
    });
    at(
      lastVoteAt + 1200 + FILING_STEP_INTERVAL_MS * 3 + ENTITY_STEP_INTERVAL_MS * 2,
      () => {
        dispatch({ type: "PROGRESS_ENTITY", index: 1, status: "completed" });
        dispatch({ type: "ADVANCE_STEP", completed: "update-entities", next: null });
        dispatch({ type: "COMPLETE_PROCESS" });
      },
    );

    return () => timeouts.forEach(clearTimeout);
  }, [state.agentic.active, leadApproved, leadApproverId]);

  /* Asset visibility ──────────────────────────────────────── */

  const hasAsset = useCallback(
    (asset: AssetId): boolean => {
      switch (asset) {
        case "candidate-shortlist":
          return state.triggerAcknowledged;
        case "consent-to-act":
          // Available as a draft as soon as we have NRIC + effective date.
          return state.appointmentNric != null && state.appointmentEffectiveDate != null;
        case "approver-list":
          return state.steps.find((s) => s.id === "select-approvers")?.status !== "not_started";
        case "board-resolution":
          return state.steps.find((s) => s.id === "select-approvers")?.status !== "not_started";
        case "form45-notification":
          return state.steps.find((s) => s.id === "filing")?.status !== "not_started";
      }
    },
    [
      state.triggerAcknowledged,
      state.appointmentNric,
      state.appointmentEffectiveDate,
      state.steps,
    ],
  );

  /* Card anchors / scroll-to ───────────────────────────────── */

  const cardAnchorId = useCallback(
    (step: WorkflowStepId) => `appt-conv-card-${step}`,
    [],
  );

  const scrollToStep = useCallback(
    (step: WorkflowStepId) => {
      const id = `appt-conv-card-${step}`;
      const el = document.getElementById(id);
      if (el)
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    },
    [],
  );

  const value = useMemo<WorkflowConversationContextValue>(
    () => ({
      state,
      startWorkflow,
      selectCandidate,
      resetCandidate,
      submitAppointmentData,
      resetAppointmentData,
      sendConsent,
      signConsent,
      resetConsent,
      confirmApprovers,
      setApprovers,
      resetApprovers,
      sendResolution,
      openAsset,
      setFocus,
      hasAsset,
      cardAnchorId,
      scrollToStep,
    }),
    [
      state,
      startWorkflow,
      selectCandidate,
      resetCandidate,
      submitAppointmentData,
      resetAppointmentData,
      sendConsent,
      signConsent,
      resetConsent,
      confirmApprovers,
      setApprovers,
      resetApprovers,
      sendResolution,
      openAsset,
      setFocus,
      hasAsset,
      cardAnchorId,
      scrollToStep,
    ],
  );

  return (
    <WorkflowConversationContext.Provider value={value}>
      {children}
    </WorkflowConversationContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWorkflowConversation() {
  const ctx = useContext(WorkflowConversationContext);
  if (!ctx) {
    throw new Error(
      "useWorkflowConversation must be used inside <WorkflowConversationProvider>",
    );
  }
  return ctx;
}
