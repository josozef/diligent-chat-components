import { Box, LinearProgress } from "@mui/material";
import { CheckCircleIcon, RadioButtonUncheckedIcon } from "@/icons";
import TradAtlasText from "../../../components/common/TradAtlasText";
import { SF } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "../../../hooks/useTokens";
import type { WorkflowStep, WorkflowStepId } from "./AppointmentWorkspace";

interface StatusPanelProps {
  steps: WorkflowStep[];
  completedCount: number;
  totalCount: number;
  activeStepId: WorkflowStepId | null;
  onStepClick: (id: WorkflowStepId | null) => void;
}

export default function StatusPanel({
  steps,
  completedCount,
  totalCount,
  activeStepId,
  onStepClick,
}: StatusPanelProps) {
  const { color, weight } = useTokens();
  const isOverview = activeStepId === null;

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
                    semanticFont={SF.labelMdRelaxed}
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
                    <Box sx={{ mt: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
                      {step.substeps.map((sub) => (
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
    </Box>
  );
}
