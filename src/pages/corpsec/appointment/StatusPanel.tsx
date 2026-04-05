import { Box, Button, LinearProgress } from "@mui/material";
import { ArrowForwardIcon, CheckCircleIcon, RadioButtonUncheckedIcon } from "@/icons";
import TradAtlasText from "../../../components/common/TradAtlasText";
import StatusSubstepRow from "@/components/common/StatusSubstepRow";
import { SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "../../../hooks/useTokens";
import type { WorkflowStep, WorkflowStepId, AgenticProcessState } from "./AppointmentWorkspace";
import type { CollectDataTabStatus } from "./WorkPanel";
import type { ApproverTabStatus } from "./ConfigureApproversTabs";

interface NextAction {
  stepId: WorkflowStepId;
  label: string;
  description: string;
}

function deriveNextAction(
  steps: WorkflowStep[],
  collectDataTabStatus: CollectDataTabStatus,
  approverTabStatus: ApproverTabStatus,
  agenticState: AgenticProcessState,
): NextAction | null {
  if (agenticState.processComplete) return null;

  const inProgress = steps.find((s) => s.status === "in_progress");
  if (!inProgress) {
    const firstNotStarted = steps.find((s) => s.status === "not_started");
    if (!firstNotStarted) return null;
    return {
      stepId: firstNotStarted.id,
      label: firstNotStarted.name,
      description: "This step hasn't been started yet.",
    };
  }

  switch (inProgress.id) {
    case "identify-candidate":
      return {
        stepId: "identify-candidate",
        label: "Select a candidate",
        description: "Review the shortlisted candidates and select a replacement director.",
      };
    case "collect-data":
      if (!collectDataTabStatus.entities) {
        return {
          stepId: "collect-data",
          label: "Provide appointee details",
          description: "The system needs the appointee's NRIC number to proceed.",
        };
      }
      return {
        stepId: "collect-data",
        label: "Send consent form",
        description: "Review and send the Consent to Act document for signature.",
      };
    case "select-approvers":
      if (!approverTabStatus.approversConfirmed) {
        return {
          stepId: "select-approvers",
          label: "Confirm approvers",
          description: "Review the pre-selected board members and confirm the approval list.",
        };
      }
      return {
        stepId: "select-approvers",
        label: "Approve board resolution",
        description: "Review the Board Resolution document and send it for signature.",
      };
    case "board-approval": {
      const approved = agenticState.votes.filter((v) => v.status === "approved").length;
      return {
        stepId: "board-approval",
        label: `Tracking approvals`,
        description: `${approved} of ${agenticState.votes.length} board members have approved the resolution.`,
      };
    }
    case "filing": {
      const done = agenticState.filingSubsteps.filter((s) => s.status === "completed").length;
      return {
        stepId: "filing",
        label: "Filing in progress",
        description: `${done} of ${agenticState.filingSubsteps.length} filing tasks complete. Documents are being submitted to ACRA.`,
      };
    }
    case "update-entities": {
      const done = agenticState.entitySubsteps.filter((s) => s.status === "completed").length;
      return {
        stepId: "update-entities",
        label: "Updating records",
        description: `${done} of ${agenticState.entitySubsteps.length} entity records updated.`,
      };
    }
    default:
      return null;
  }
}

interface StatusPanelProps {
  steps: WorkflowStep[];
  completedCount: number;
  totalCount: number;
  activeStepId: WorkflowStepId | null;
  onStepClick: (id: WorkflowStepId | null) => void;
  collectDataTabStatus: CollectDataTabStatus;
  approverTabStatus: ApproverTabStatus;
  agenticState: AgenticProcessState;
}

export default function StatusPanel({
  steps,
  completedCount,
  totalCount,
  activeStepId,
  onStepClick,
  collectDataTabStatus,
  approverTabStatus,
  agenticState,
}: StatusPanelProps) {
  const { color, weight, radius } = useTokens();
  const isOverview = activeStepId === null;

  const nextAction = deriveNextAction(steps, collectDataTabStatus, approverTabStatus, agenticState);
  const isAlreadyOnNext = nextAction && activeStepId === nextAction.stepId;

  return (
    <Box
      sx={{
        width: 280,
        flexShrink: 0,
        borderRight: `1px solid ${color.outline.fixed}`,
        background: color.surface.default,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Clickable header — returns to overview */}
      <Box
        component="button"
        onClick={() => onStepClick(null)}
        sx={{
          p: "20px",
          borderBottom: `1px solid ${color.outline.fixed}`,
          background: isOverview ? color.surface.variant : "transparent",
          borderLeft: isOverview
            ? `3px solid ${color.action.primary.default}`
            : "3px solid transparent",
          border: "none",
          borderRight: "none",
          borderTop: "none",
          borderBottomStyle: "solid",
          borderBottomWidth: 1,
          borderBottomColor: color.outline.fixed,
          borderLeftStyle: "solid",
          borderLeftWidth: 3,
          borderLeftColor: isOverview ? color.action.primary.default : "transparent",
          cursor: "pointer",
          textAlign: "left",
          width: "100%",
          "&:hover": {
            background: isOverview ? color.surface.variant : color.surface.subtle,
          },
        }}
      >
        <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "4px" }}>
          Appointment workflow
        </TradAtlasText>
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <LinearProgress
            variant="determinate"
            value={(completedCount / totalCount) * 100}
            sx={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              backgroundColor: color.outline.fixed,
              "& .MuiLinearProgress-bar": {
                backgroundColor: color.action.primary.default,
                borderRadius: 2,
              },
            }}
          />
          <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted, fontWeight: weight.medium }}>
            {completedCount}/{totalCount}
          </TradAtlasText>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflow: "auto", py: "8px" }}>
        {steps.map((step) => {
          const isActive = activeStepId === step.id;
          const isInProgress = step.status === "in_progress";
          const isCompleted = step.status === "completed";

          return (
            <Box key={step.id}>
              <Box
                component="button"
                onClick={() => onStepClick(step.id)}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  width: "100%",
                  px: "20px",
                  py: "10px",
                  border: "none",
                  background: isActive ? color.surface.variant : "transparent",
                  borderLeft: isActive
                    ? `3px solid ${color.action.primary.default}`
                    : "3px solid transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  "&:hover": {
                    background: isActive ? color.surface.variant : color.surface.subtle,
                  },
                }}
              >
                <Box sx={{ mt: "2px", flexShrink: 0 }}>
                  {isCompleted ? (
                    <CheckCircleIcon sx={{ fontSize: 18, color: color.status.success.default }} />
                  ) : isInProgress ? (
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        border: `2px solid ${color.action.primary.default}`,
                        background: "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: color.action.primary.default,
                        }}
                      />
                    </Box>
                  ) : (
                    <RadioButtonUncheckedIcon sx={{ fontSize: 18, color: color.outline.fixed }} />
                  )}
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <TradAtlasText
                    semanticFont={SF.labelMd}
                    sx={{
                      fontWeight: isActive || isInProgress ? weight.semiBold : weight.regular,
                      color: step.status === "not_started" ? color.type.muted : color.type.default,
                    }}
                  >
                    {step.name}
                  </TradAtlasText>
                  {isInProgress && !isActive && (
                    <TradAtlasText
                      semanticFont={SF.textMicroEmphasis}
                      sx={{
                        color: color.action.primary.default,
                        fontWeight: weight.medium,
                        mt: "2px",
                      }}
                    >
                      In progress
                    </TradAtlasText>
                  )}
                  {isActive && step.substeps && (
                    <Box sx={{ mt: "6px", display: "flex", flexDirection: "column", gap: "6px" }}>
                      {step.id === "collect-data" || step.id === "select-approvers"
                        ? step.substeps.map((sub, i) => {
                            let done = false;
                            if (step.id === "collect-data") {
                              done = i === 0 ? collectDataTabStatus.entities : i === 1 ? collectDataTabStatus.consent : false;
                            } else if (step.id === "select-approvers") {
                              done = i === 0 ? approverTabStatus.approversConfirmed : i === 1 ? approverTabStatus.resolutionSent : false;
                            }
                            return (
                              <StatusSubstepRow key={sub} status={done ? "completed" : "pending"} label={sub} size="sm" />
                            );
                          })
                        : step.id === "board-approval" && agenticState.active
                          ? agenticState.votes.map((v) => (
                              <StatusSubstepRow
                                key={v.id}
                                status={v.status === "approved" ? "completed" : "in_progress"}
                                label={`${v.name}${v.status === "approved" ? " — approved" : ""}`}
                                size="sm"
                              />
                            ))
                          : step.id === "filing" && agenticState.active
                            ? agenticState.filingSubsteps.map((s) => (
                                <StatusSubstepRow key={s.name} status={s.status} label={s.name} size="sm" />
                              ))
                            : step.id === "update-entities" && agenticState.active
                              ? agenticState.entitySubsteps.map((s) => (
                                  <StatusSubstepRow key={s.name} status={s.status} label={s.name} size="sm" />
                                ))
                              : step.substeps.map((sub) => (
                                  <TradAtlasText
                                    key={sub}
                                    semanticFont={SF.textMicro}
                                    sx={{
                                      color: color.type.muted,
                                      pl: "4px",
                                    }}
                                  >
                                    {sub}
                                  </TradAtlasText>
                                ))}
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      {agenticState.processComplete ? (
        <Box
          sx={{
            flexShrink: 0,
            borderTop: `1px solid ${color.outline.fixed}`,
            p: "16px",
          }}
        >
          <Box
            sx={{
              p: "14px",
              borderRadius: radius.lg,
              background: color.status.success.background,
              border: `1px solid ${color.status.success.default}`,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckCircleIcon sx={{ fontSize: 16, color: color.status.success.default }} />
              <TradAtlasText semanticFont={SF.textSmEmphasis} sx={{ color: color.status.success.text }}>
                Workflow complete
              </TradAtlasText>
            </Box>
            <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
              All steps have been completed. The appointment has been filed with ACRA and entity records are up to date.
            </TradAtlasText>
          </Box>
        </Box>
      ) : nextAction ? (
        <Box
          sx={{
            flexShrink: 0,
            borderTop: `1px solid ${color.outline.fixed}`,
            p: "16px",
          }}
        >
          <Box
            sx={{
              p: "14px",
              borderRadius: radius.lg,
              background: isAlreadyOnNext ? color.action.primary.default + "0a" : color.surface.subtle,
              border: `1px solid ${isAlreadyOnNext ? color.action.primary.default : color.outline.fixed}`,
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <TradAtlasText semanticFont={SF.textMicroEmphasis} sx={{ color: color.type.muted, letterSpacing: "0.5px", textTransform: "uppercase" }}>
              {agenticState.active ? "Processing" : "Up next"}
            </TradAtlasText>
            <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
              {nextAction.description}
            </TradAtlasText>
            {agenticState.active ? (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                onClick={() => onStepClick(nextAction.stepId)}
                sx={{
                  textTransform: "none",
                  fontWeight: weight.semiBold,
                  ...semanticFontStyle(SF.labelMd),
                  borderRadius: radius.md,
                  alignSelf: "flex-start",
                  borderColor: color.action.primary.default,
                }}
              >
                {nextAction.label}
              </Button>
            ) : (
              <Button
                variant={isAlreadyOnNext ? "outlined" : "contained"}
                color="primary"
                size="small"
                endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                onClick={() => onStepClick(nextAction.stepId)}
                sx={{
                  textTransform: "none",
                  fontWeight: weight.semiBold,
                  ...semanticFontStyle(SF.labelMd),
                  borderRadius: radius.md,
                  alignSelf: "flex-start",
                  ...(isAlreadyOnNext ? { borderColor: color.action.primary.default } : {}),
                }}
              >
                {nextAction.label}
              </Button>
            )}
          </Box>
        </Box>
      ) : null}
    </Box>
  );
}
