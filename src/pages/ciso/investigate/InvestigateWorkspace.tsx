import { useCallback, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useTokens } from "../../../hooks/useTokens";
import WorkspaceHeader from "./WorkspaceHeader";
import StatusPanel from "./StatusPanel";
import WorkPanel from "./WorkPanel";
import ChatPanel from "./ChatPanel";

export type InvestigationStepId =
  | "impact"
  | "brief-notify"
  | "remediation"
  | "validate"
  | "board-briefing";

export interface InvestigationStep {
  id: InvestigationStepId;
  name: string;
  status: "not_started" | "in_progress" | "completed";
  substeps?: string[];
}

const INITIAL_STEPS: InvestigationStep[] = [
  {
    id: "impact",
    name: "Impact assessment",
    status: "in_progress",
    substeps: ["Affected assets", "Compliance impact", "Risk register"],
  },
  {
    id: "brief-notify",
    name: "Brief & notify",
    status: "not_started",
    substeps: ["Security team briefing", "Executive briefing", "Send notifications"],
  },
  {
    id: "remediation",
    name: "Remediation",
    status: "not_started",
    substeps: ["Control gaps", "ITSM tickets", "Patch deployment"],
  },
  {
    id: "validate",
    name: "Validation & closure",
    status: "not_started",
    substeps: ["Evidence pack", "Vendor confirmation", "Risk re-scoring"],
  },
  {
    id: "board-briefing",
    name: "Board briefing",
    status: "not_started",
    substeps: ["Board memo", "Timeline", "Residual risk"],
  },
];

const STORAGE_KEY = "ciso-investigation-state";

interface PersistedState {
  currentStepId: InvestigationStepId;
  completedSteps: InvestigationStepId[];
}

function loadState(): PersistedState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as PersistedState;
  } catch {
    /* ignore */
  }
  return null;
}

function saveState(state: PersistedState) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function rebuildSteps(persisted: PersistedState): InvestigationStep[] {
  return INITIAL_STEPS.map((s) => {
    if (persisted.completedSteps.includes(s.id)) return { ...s, status: "completed" as const };
    if (s.id === persisted.currentStepId) return { ...s, status: "in_progress" as const };
    return { ...s, status: "not_started" as const };
  });
}

export default function InvestigateWorkspace() {
  const { color } = useTokens();

  const persisted = loadState();
  const [steps, setSteps] = useState<InvestigationStep[]>(
    persisted ? rebuildSteps(persisted) : INITIAL_STEPS,
  );
  const [currentStepId, setCurrentStepId] = useState<InvestigationStepId>(
    persisted?.currentStepId ?? "impact",
  );
  const [activeStepId, setActiveStepId] = useState<InvestigationStepId | null>(null);
  const [completedSteps, setCompletedSteps] = useState<InvestigationStepId[]>(
    persisted?.completedSteps ?? [],
  );

  useEffect(() => {
    saveState({ currentStepId, completedSteps });
  }, [currentStepId, completedSteps]);

  const completedCount = steps.filter((s) => s.status === "completed").length;

  const advanceStep = useCallback(
    (fromStepId: InvestigationStepId) => {
      setCompletedSteps((prev) => (prev.includes(fromStepId) ? prev : [...prev, fromStepId]));

      const stepOrder: InvestigationStepId[] = INITIAL_STEPS.map((s) => s.id);
      const idx = stepOrder.indexOf(fromStepId);
      const nextId = idx < stepOrder.length - 1 ? stepOrder[idx + 1] : null;

      setSteps((prev) =>
        prev.map((s) => {
          if (s.id === fromStepId) return { ...s, status: "completed" as const };
          if (nextId && s.id === nextId) return { ...s, status: "in_progress" as const };
          return s;
        }),
      );

      if (nextId) {
        setCurrentStepId(nextId);
        setActiveStepId(nextId);
      }
    },
    [],
  );

  const handleReset = useCallback(() => {
    setSteps(INITIAL_STEPS);
    setCurrentStepId("impact");
    setActiveStepId(null);
    setCompletedSteps([]);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const allComplete = completedCount === steps.length;

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
      <WorkspaceHeader onReset={handleReset} />

      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <StatusPanel
          steps={steps}
          completedCount={completedCount}
          totalCount={steps.length}
          activeStepId={activeStepId}
          onStepClick={setActiveStepId}
          onOverviewClick={() => setActiveStepId(null)}
          allComplete={allComplete}
        />
        <WorkPanel
          activeStepId={activeStepId}
          steps={steps}
          onAdvance={advanceStep}
        />
        <ChatPanel />
      </Box>
    </Box>
  );
}
