import { useState } from "react";
import { Box } from "@mui/material";
import { useTokens } from "../../../hooks/useTokens";
import WorkspaceHeader from "./WorkspaceHeader";
import StatusPanel from "./StatusPanel";
import WorkPanel from "./WorkPanel";
import ChatPanel from "./ChatPanel";
import DemoControlsFab from "../DemoControlsFab";

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
    substeps: ["Company & appointee", "Effective date", "Consent to act"],
  },
  {
    id: "select-approvers",
    name: "Configure approvers",
    status: "not_started",
    substeps: ["Select committee", "Choose members", "Generate documents"],
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
  const [steps] = useState<WorkflowStep[]>(INITIAL_STEPS);
  const [activeStepId, setActiveStepId] = useState<WorkflowStepId | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);

  const completedCount = steps.filter((s) => s.status === "completed").length;

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
        />
        <WorkPanel
          activeStepId={activeStepId}
          steps={steps}
          selectedCandidate={selectedCandidate}
          onSelectCandidate={setSelectedCandidate}
        />
        <ChatPanel />
      </Box>

      <DemoControlsFab />
    </Box>
  );
}
