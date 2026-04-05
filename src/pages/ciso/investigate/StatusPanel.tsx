import { Box, Button, LinearProgress } from "@mui/material";
import { ArrowForwardIcon, CheckCircleIcon, RadioButtonUncheckedIcon, DescriptionOutlinedIcon } from "@/icons";
import TradAtlasText from "../../../components/common/TradAtlasText";
import { SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "../../../hooks/useTokens";
import type { InvestigationStep, InvestigationStepId } from "./InvestigateWorkspace";

interface StatusPanelProps {
  steps: InvestigationStep[];
  completedCount: number;
  totalCount: number;
  activeStepId: InvestigationStepId | null;
  onStepClick: (id: InvestigationStepId) => void;
  onOverviewClick: () => void;
  allComplete: boolean;
}

export default function StatusPanel({
  steps,
  completedCount,
  totalCount,
  activeStepId,
  onStepClick,
  onOverviewClick,
  allComplete,
}: StatusPanelProps) {
  const { color, weight, radius } = useTokens();

  const nextStep = steps.find((s) => s.status === "in_progress");

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
      {/* Progress header (non-interactive) */}
      <Box
        sx={{
          p: "20px",
          borderBottom: `1px solid ${color.outline.fixed}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <LinearProgress
            variant="determinate"
            value={(completedCount / totalCount) * 100}
            sx={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              backgroundColor: color.outline.fixed,
              "& .MuiLinearProgress-bar": { backgroundColor: color.action.primary.default, borderRadius: 2 },
            }}
          />
          <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted, fontWeight: weight.medium }}>
            {completedCount}/{totalCount}
          </TradAtlasText>
        </Box>
      </Box>

      {/* Overview link */}
      <Box
        component="button"
        onClick={onOverviewClick}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          width: "100%",
          px: "20px",
          py: "12px",
          border: "none",
          background: activeStepId === null ? color.surface.variant : "transparent",
          borderLeft: activeStepId === null
            ? `3px solid ${color.action.primary.default}`
            : "3px solid transparent",
          borderBottom: `1px solid ${color.outline.fixed}`,
          cursor: "pointer",
          textAlign: "left",
          "&:hover": {
            background: activeStepId === null ? color.surface.variant : color.surface.subtle,
          },
        }}
      >
        <DescriptionOutlinedIcon sx={{ fontSize: 18, color: activeStepId === null ? color.action.primary.default : color.type.muted }} />
        <TradAtlasText
          semanticFont={SF.labelMd}
          sx={{
            fontWeight: activeStepId === null ? weight.semiBold : weight.regular,
            color: color.type.default,
          }}
        >
          Overview
        </TradAtlasText>
      </Box>

      {/* Step list */}
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
                      sx={{ color: color.action.primary.default, fontWeight: weight.medium, mt: "2px" }}
                    >
                      In progress
                    </TradAtlasText>
                  )}
                  {isActive && step.substeps && (
                    <Box sx={{ mt: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
                      {step.substeps.map((sub) => (
                        <Box key={sub} sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <DescriptionOutlinedIcon sx={{ fontSize: 12, color: color.type.muted }} />
                          <TradAtlasText semanticFont={SF.textMicro} sx={{ color: color.type.muted }}>
                            {sub}
                          </TradAtlasText>
                        </Box>
                      ))}
                    </Box>
                  )}
                  {isCompleted && (
                    <TradAtlasText
                      semanticFont={SF.textMicro}
                      sx={{ color: color.type.muted, mt: "2px" }}
                    >
                      Completed
                    </TradAtlasText>
                  )}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Bottom action */}
      {allComplete ? (
        <Box sx={{ flexShrink: 0, borderTop: `1px solid ${color.outline.fixed}`, p: "16px" }}>
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
                Investigation complete
              </TradAtlasText>
            </Box>
            <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
              All steps have been completed. The board briefing has been generated and the incident is ready for closure.
            </TradAtlasText>
          </Box>
        </Box>
      ) : nextStep ? (
        <Box sx={{ flexShrink: 0, borderTop: `1px solid ${color.outline.fixed}`, p: "16px" }}>
          <Box
            sx={{
              p: "14px",
              borderRadius: radius.lg,
              background: activeStepId === nextStep.id ? color.action.primary.default + "0a" : color.surface.subtle,
              border: `1px solid ${activeStepId === nextStep.id ? color.action.primary.default : color.outline.fixed}`,
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <TradAtlasText semanticFont={SF.textMicroEmphasis} sx={{ color: color.type.muted, letterSpacing: "0.5px", textTransform: "uppercase" }}>
              Current step
            </TradAtlasText>
            <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
              {nextStep.name}
            </TradAtlasText>
            <Button
              variant={activeStepId === nextStep.id ? "outlined" : "contained"}
              color="primary"
              size="small"
              endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
              onClick={() => onStepClick(nextStep.id)}
              sx={{
                textTransform: "none",
                fontWeight: weight.semiBold,
                ...semanticFontStyle(SF.labelMd),
                borderRadius: radius.md,
                alignSelf: "flex-start",
                ...(activeStepId === nextStep.id ? { borderColor: color.action.primary.default } : {}),
              }}
            >
              Go to step
            </Button>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
}
