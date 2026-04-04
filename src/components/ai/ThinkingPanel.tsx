import { Box, Collapse } from "@mui/material";
import { ArrowDropUpIcon, ArrowDropDownIcon } from "@/icons";
import TradAtlasText from "../common/TradAtlasText";
import { SF } from "@/tokens/tradAtlasSemanticTypography";
import AiSparkle from "./AiSparkle";
import { atlasSemanticColor as color, atlasSemanticRadius as radius } from "../../tokens/atlasLight";

export interface ThinkingStep {
  title: string;
  body: string;
}

interface ThinkingPanelProps {
  steps: ThinkingStep[];
  /** True while the system is still thinking (sparkle animates, steps reveal progressively). */
  isThinking: boolean;
  /** 0-based index of the step currently being revealed. */
  activeStep: number;
  open: boolean;
  onToggle: () => void;
}

export default function ThinkingPanel({ steps, isThinking, activeStep, open, onToggle }: ThinkingPanelProps) {
  const toggleLabel = isThinking
    ? steps[Math.max(0, activeStep)]?.title ?? "Thinking..."
    : open
      ? "Hide thinking"
      : "Show thinking";

  const stepsToShow = isThinking ? Math.min(activeStep + 1, steps.length) : steps.length;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
      {/* Header row */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Box sx={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <AiSparkle size="lg" animate={isThinking} />
        </Box>

        <Box
          component="button"
          type="button"
          onClick={onToggle}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            border: "none",
            borderRadius: "10px",
            px: "12px",
            py: "4px",
            background: "transparent",
            cursor: "pointer",
            color: color.type.default,
            "&:hover": { background: color.action.secondary.hoverFill },
          }}
        >
          <TradAtlasText
            semanticFont={SF.textMdEmphasis}
            sx={{
              letterSpacing: "0.14px",
              color: isThinking ? color.type.muted : color.type.default,
              transition: "color 0.3s ease",
            }}
          >
            {toggleLabel}
          </TradAtlasText>
          {open ? (
            <ArrowDropUpIcon sx={{ fontSize: 24, color: isThinking ? color.type.muted : color.type.default }} />
          ) : (
            <ArrowDropDownIcon sx={{ fontSize: 24, color: isThinking ? color.type.muted : color.type.default }} />
          )}
        </Box>
      </Box>

      {/* Steps panel */}
      <Collapse in={open} timeout={280}>
        <Box
          sx={{
            background: color.surface.subtle,
            borderRadius: radius.lg,
            p: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            width: "100%",
          }}
        >
          {steps.slice(0, stepsToShow).map((step, idx) => {
            const isActiveStep = isThinking && idx === stepsToShow - 1;
            return (
              <Box
                key={step.title}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  opacity: isActiveStep ? 0.75 : 1,
                  transition: "opacity 0.3s ease",
                }}
              >
                <TradAtlasText semanticFont={SF.textSmEmphasis} sx={{ color: color.type.default }}>
                  {step.title}
                </TradAtlasText>
                <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.default }}>
                  {step.body}
                  {isActiveStep && (
                    <Box
                      component="span"
                      sx={{
                        display: "inline-block",
                        width: "1px",
                        height: "12px",
                        background: color.type.muted,
                        ml: "2px",
                        verticalAlign: "middle",
                        animation: "blink-cursor 1s step-end infinite",
                        "@keyframes blink-cursor": {
                          "0%, 100%": { opacity: 1 },
                          "50%": { opacity: 0 },
                        },
                      }}
                    />
                  )}
                </TradAtlasText>
              </Box>
            );
          })}
        </Box>
      </Collapse>
    </Box>
  );
}
