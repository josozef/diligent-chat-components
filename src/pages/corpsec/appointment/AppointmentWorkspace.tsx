import { useCallback, useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { useTokens } from "../../../hooks/useTokens";
import WorkspaceHeader from "./WorkspaceHeader";
import StatusPanel from "./StatusPanel";
import WorkPanel from "./WorkPanel";
import ChatPanel from "./ChatPanel";
import type { CollectDataTabStatus } from "./WorkPanel";
import type { ApproverTabStatus } from "./ConfigureApproversTabs";

export type WorkflowStepId =
  | "identify-candidate"
  | "collect-data"
  | "select-approvers"
  | "board-approval"
  | "filing"
  | "update-entities";

export interface WorkflowStep {
  id: WorkflowStepId;
  name: string;
  status: "not_started" | "in_progress" | "completed";
  substeps?: string[];
}

export interface ApproverVote {
  id: string;
  name: string;
  title: string;
  status: "pending" | "approved";
  time: string | null;
}

export interface AgenticSubstep {
  name: string;
  status: "pending" | "in_progress" | "completed";
  time: string | null;
}

export interface AgenticProcessState {
  active: boolean;
  votes: ApproverVote[];
  filingSubsteps: AgenticSubstep[];
  entitySubsteps: AgenticSubstep[];
  processComplete: boolean;
}

const INITIAL_AGENTIC_STATE: AgenticProcessState = {
  active: false,
  votes: [
    { id: "robert-johnson", name: "Robert Johnson", title: "Committee Chair", status: "pending", time: null },
    { id: "margaret-sullivan", name: "Margaret Sullivan", title: "Chief Executive Officer", status: "pending", time: null },
    { id: "linda-williams", name: "Linda Williams", title: "Independent Director", status: "pending", time: null },
    { id: "david-martinez", name: "David Martinez", title: "Independent Director", status: "pending", time: null },
  ],
  filingSubsteps: [
    { name: "Download signed documents", status: "pending", time: null },
    { name: "e-File with ACRA", status: "pending", time: null },
    { name: "Confirm filing", status: "pending", time: null },
  ],
  entitySubsteps: [
    { name: "Record resignation — David Chen", status: "pending", time: null },
    { name: "Record appointment — Priya Nair", status: "pending", time: null },
  ],
  processComplete: false,
};

const formatTime = () =>
  new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" });

const INITIAL_STEPS: WorkflowStep[] = [
  {
    id: "identify-candidate",
    name: "Identify replacement candidate",
    status: "in_progress",
    substeps: ["Workday integration", "Jurisdictional screening", "Candidate shortlist"],
  },
  {
    id: "collect-data",
    name: "Collect appointment data",
    status: "not_started",
    substeps: ["Entities & appointment", "Consent to act document"],
  },
  {
    id: "select-approvers",
    name: "Configure approvers",
    status: "not_started",
    substeps: ["Select approvers", "Board resolution"],
  },
  {
    id: "board-approval",
    name: "Board approval",
    status: "not_started",
    substeps: ["Send resolution", "Collect votes"],
  },
  {
    id: "filing",
    name: "Regulatory filing",
    status: "not_started",
    substeps: ["Download documents", "File with ACRA", "Confirm filing"],
  },
  {
    id: "update-entities",
    name: "Update entity records",
    status: "not_started",
    substeps: ["Record resignation", "Record appointment"],
  },
];

export default function AppointmentWorkspace() {
  const { color } = useTokens();
  const [steps, setSteps] = useState<WorkflowStep[]>(INITIAL_STEPS);
  const [activeStepId, setActiveStepId] = useState<WorkflowStepId | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [collectDataTabStatus, setCollectDataTabStatus] = useState<CollectDataTabStatus>({
    entities: false,
    consent: false,
  });
  const [appointmentNric, setAppointmentNric] = useState<string | null>(null);
  const [appointmentEffectiveDate, setAppointmentEffectiveDate] = useState<string | null>(null);
  const [approverTabStatus, setApproverTabStatus] = useState<ApproverTabStatus>({
    approversConfirmed: false,
    resolutionSent: false,
  });
  const [agenticState, setAgenticState] = useState<AgenticProcessState>(INITIAL_AGENTIC_STATE);

  const collectDataAdvanceRef = useRef(false);
  const approverAdvanceRef = useRef(false);
  const simulationStartedRef = useRef(false);

  const completedCount = steps.filter((s) => s.status === "completed").length;

  const handleSelectCandidate = (name: string) => {
    setSelectedCandidate(name);
    setSteps((prev) =>
      prev.map((s) => {
        if (s.id === "identify-candidate") return { ...s, status: "completed" as const };
        if (s.id === "collect-data") return { ...s, status: "in_progress" as const };
        return s;
      }),
    );
    setActiveStepId("collect-data");
  };

  const handleCollectDataEntitiesComplete = (payload: { nric: string; effectiveDate: string }) => {
    setAppointmentNric(payload.nric);
    setAppointmentEffectiveDate(payload.effectiveDate);
    setCollectDataTabStatus((p) => ({ ...p, entities: true }));
  };

  const handleCollectDataConsentComplete = () => {
    setCollectDataTabStatus((p) => ({ ...p, consent: true }));
  };

  const handleReplaceConsentDocument = (_file: File) => {
    /* Demo: file handled in ConsentToActEditor for text/html; binary types show a note in-editor */
  };

  const handleApproversConfirmed = () => {
    setApproverTabStatus((p) => ({ ...p, approversConfirmed: true }));
  };

  const handleResolutionSent = () => {
    setApproverTabStatus((p) => ({ ...p, resolutionSent: true }));
  };

  useEffect(() => {
    if (
      approverTabStatus.approversConfirmed &&
      approverTabStatus.resolutionSent &&
      !approverAdvanceRef.current
    ) {
      approverAdvanceRef.current = true;
      setSteps((prev) =>
        prev.map((s) => {
          if (s.id === "select-approvers") return { ...s, status: "completed" as const };
          if (s.id === "board-approval") return { ...s, status: "in_progress" as const };
          return s;
        }),
      );
      setActiveStepId("board-approval");
      setAgenticState((prev) => ({ ...prev, active: true }));
    }
  }, [approverTabStatus.approversConfirmed, approverTabStatus.resolutionSent]);

  /* ── 8-second agentic simulation ──────────────────────────────── */
  useEffect(() => {
    if (!agenticState.active || simulationStartedRef.current) return;
    simulationStartedRef.current = true;

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timeouts.push(setTimeout(fn, ms));

    const approveVoter = (voterId: string) =>
      setAgenticState((p) => ({
        ...p,
        votes: p.votes.map((v) =>
          v.id === voterId ? { ...v, status: "approved" as const, time: formatTime() } : v,
        ),
      }));

    const setFilingSub = (idx: number, status: AgenticSubstep["status"]) =>
      setAgenticState((p) => ({
        ...p,
        filingSubsteps: p.filingSubsteps.map((s, i) =>
          i === idx ? { ...s, status, time: status === "completed" ? formatTime() : s.time } : s,
        ),
      }));

    const setEntitySub = (idx: number, status: AgenticSubstep["status"]) =>
      setAgenticState((p) => ({
        ...p,
        entitySubsteps: p.entitySubsteps.map((s, i) =>
          i === idx ? { ...s, status, time: status === "completed" ? formatTime() : s.time } : s,
        ),
      }));

    const advanceStep = (completedId: WorkflowStepId, nextId: WorkflowStepId) => {
      setSteps((prev) =>
        prev.map((s) => {
          if (s.id === completedId) return { ...s, status: "completed" as const };
          if (s.id === nextId) return { ...s, status: "in_progress" as const };
          return s;
        }),
      );
      setActiveStepId(nextId);
    };

    const completeStep = (id: WorkflowStepId) =>
      setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, status: "completed" as const } : s)));

    // Votes trickle in
    at(800, () => approveVoter("robert-johnson"));
    at(1800, () => approveVoter("margaret-sullivan"));
    at(3000, () => approveVoter("linda-williams"));
    at(4000, () => approveVoter("david-martinez"));

    // Board approval complete → filing starts
    at(4500, () => {
      advanceStep("board-approval", "filing");
      setFilingSub(0, "in_progress");
    });

    // Filing substeps
    at(5200, () => {
      setFilingSub(0, "completed");
      setFilingSub(1, "in_progress");
    });
    at(5900, () => {
      setFilingSub(1, "completed");
      setFilingSub(2, "in_progress");
    });
    at(6500, () => {
      setFilingSub(2, "completed");
      advanceStep("filing", "update-entities");
      setEntitySub(0, "in_progress");
    });

    // Entity substeps
    at(7200, () => {
      setEntitySub(0, "completed");
      setEntitySub(1, "in_progress");
    });
    at(7800, () => {
      setEntitySub(1, "completed");
      completeStep("update-entities");
      setAgenticState((p) => ({ ...p, processComplete: true }));
    });

    return () => timeouts.forEach(clearTimeout);
  }, [agenticState.active]);

  useEffect(() => {
    if (
      collectDataTabStatus.entities &&
      collectDataTabStatus.consent &&
      !collectDataAdvanceRef.current
    ) {
      collectDataAdvanceRef.current = true;
      setSteps((prev) =>
        prev.map((s) => {
          if (s.id === "collect-data") return { ...s, status: "completed" as const };
          if (s.id === "select-approvers") return { ...s, status: "in_progress" as const };
          return s;
        }),
      );
      setActiveStepId("select-approvers");
    }
  }, [collectDataTabStatus.entities, collectDataTabStatus.consent]);

  return (
    <Box
      sx={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: color.background.base,
        overflow: "hidden",
      }}
    >
      <WorkspaceHeader selectedCandidate={selectedCandidate} />

      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <StatusPanel
          steps={steps}
          completedCount={completedCount}
          totalCount={steps.length}
          activeStepId={activeStepId}
          onStepClick={setActiveStepId}
          collectDataTabStatus={collectDataTabStatus}
          approverTabStatus={approverTabStatus}
          agenticState={agenticState}
        />
        <WorkPanel
          activeStepId={activeStepId}
          steps={steps}
          selectedCandidate={selectedCandidate}
          onSelectCandidate={handleSelectCandidate}
          collectDataTabStatus={collectDataTabStatus}
          appointmentNric={appointmentNric}
          appointmentEffectiveDate={appointmentEffectiveDate}
          onCollectDataEntitiesComplete={handleCollectDataEntitiesComplete}
          onCollectDataConsentComplete={handleCollectDataConsentComplete}
          onReplaceConsentDocument={handleReplaceConsentDocument}
          approverTabStatus={approverTabStatus}
          onApproversConfirmed={handleApproversConfirmed}
          onResolutionSent={handleResolutionSent}
          agenticState={agenticState}
        />
        <ChatPanel />
      </Box>
    </Box>
  );
}
