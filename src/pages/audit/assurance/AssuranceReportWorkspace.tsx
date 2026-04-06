import { useCallback, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useTokens } from "../../../hooks/useTokens";
import WorkspaceHeader from "./WorkspaceHeader";
import StatusPanel from "./StatusPanel";
import WorkPanel from "./WorkPanel";
import ChatPanel from "./ChatPanel";

export type AssuranceStepId =
  | "investigation"
  | "scope"
  | "evidence"
  | "synthesis"
  | "edit-authorize"
  | "veracity-scoring"
  | "approve";

export interface AssuranceStep {
  id: AssuranceStepId;
  name: string;
  status: "not_started" | "in_progress" | "completed";
  substeps?: string[];
}

const INITIAL_STEPS: AssuranceStep[] = [
  {
    id: "investigation",
    name: "Investigation",
    status: "in_progress",
    substeps: ["Request & objectives", "Audit plan alignment"],
  },
  {
    id: "scope",
    name: "Scope",
    status: "not_started",
    substeps: ["Parameters & timeline", "Data domains", "Pre-selected controls"],
  },
  {
    id: "evidence",
    name: "Evidence",
    status: "not_started",
    substeps: ["Authorize agents", "Collection status", "Evidence packs"],
  },
  {
    id: "synthesis",
    name: "Synthesis",
    status: "not_started",
    substeps: ["Cross-domain chains", "Materiality filter", "Risk taxonomy", "SEC comparison"],
  },
  {
    id: "edit-authorize",
    name: "Edit & Authorize",
    status: "not_started",
    substeps: ["Board report", "Track changes", "Authorization"],
  },
  {
    id: "veracity-scoring",
    name: "Veracity scoring",
    status: "not_started",
    substeps: ["Findings validation", "Remediation & scores"],
  },
  {
    id: "approve",
    name: "Approve",
    status: "not_started",
    substeps: ["Final report", "Committee-ready pack"],
  },
];

const STORAGE_KEY = "audit-assurance-state-v2";

interface PersistedState {
  currentStepId: AssuranceStepId;
  completedSteps: AssuranceStepId[];
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

function rebuildSteps(persisted: PersistedState): AssuranceStep[] {
  return INITIAL_STEPS.map((s) => {
    if (persisted.completedSteps.includes(s.id)) return { ...s, status: "completed" as const };
    if (s.id === persisted.currentStepId) return { ...s, status: "in_progress" as const };
    return { ...s, status: "not_started" as const };
  });
}

export default function AssuranceReportWorkspace() {
  const { color } = useTokens();

  const persisted = loadState();
  const [steps, setSteps] = useState<AssuranceStep[]>(
    persisted ? rebuildSteps(persisted) : INITIAL_STEPS,
  );
  const [currentStepId, setCurrentStepId] = useState<AssuranceStepId>(
    persisted?.currentStepId ?? "investigation",
  );
  const [activeStepId, setActiveStepId] = useState<AssuranceStepId | null>(null);
  const [completedSteps, setCompletedSteps] = useState<AssuranceStepId[]>(
    persisted?.completedSteps ?? [],
  );

  useEffect(() => {
    saveState({ currentStepId, completedSteps });
  }, [currentStepId, completedSteps]);

  const completedCount = steps.filter((s) => s.status === "completed").length;

  const advanceStep = useCallback(
    (fromStepId: AssuranceStepId) => {
      setCompletedSteps((prev) => (prev.includes(fromStepId) ? prev : [...prev, fromStepId]));

      const stepOrder: AssuranceStepId[] = INITIAL_STEPS.map((s) => s.id);
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
    setCurrentStepId("investigation");
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

      <Box sx={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
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
          currentStepId={currentStepId}
          steps={steps}
          onAdvance={advanceStep}
        />
        <ChatPanel />
      </Box>
    </Box>
  );
}
