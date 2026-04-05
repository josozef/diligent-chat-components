import { useEffect, useState } from "react";
import { Box, Collapse } from "@mui/material";
import {
  ArrowForwardIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  RadioButtonUncheckedIcon,
  TuneIcon,
} from "@/icons";
import TradAtlasText from "../common/TradAtlasText";
import { SF } from "@/tokens/tradAtlasSemanticTypography";
import { atlasSemanticColor as color, atlasSemanticRadius as radius } from "../../tokens/atlasLight";
import type { ChatPresentationDensity } from "./chatPresentation";

export interface ThinkingStep {
  title: string;
  body: string;
}

interface ThinkingPanelProps {
  steps: ThinkingStep[];
  /** True while the system is still thinking (steps reveal progressively). */
  isThinking: boolean;
  /** 0-based index of the step currently being revealed. */
  activeStep: number;
  open: boolean;
  onToggle: () => void;
  /** Tighter layout in narrow workspace rails; general chat uses `relaxed`. */
  density?: ChatPresentationDensity;
}

function TaskStatusIcon({ status }: { status: "done" | "active" | "pending" }) {
  if (status === "done") {
    return <CheckCircleIcon sx={{ fontSize: 18, color: color.type.muted, flexShrink: 0 }} />;
  }
  if (status === "active") {
    return (
      <Box
        sx={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          border: `1px solid ${color.outline.default}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <ArrowForwardIcon sx={{ fontSize: 12, color: color.type.muted }} />
      </Box>
    );
  }
  return <RadioButtonUncheckedIcon sx={{ fontSize: 18, color: color.type.muted, flexShrink: 0 }} />;
}

export default function ThinkingPanel({
  steps,
  isThinking,
  activeStep,
  open,
  onToggle,
  density = "relaxed",
}: ThinkingPanelProps) {
  const isCompact = density === "compact";
  const stepsToShow = isThinking ? Math.min(activeStep + 1, steps.length) : steps.length;

  const [displaySec, setDisplaySec] = useState(0);
  const [frozenThoughtSec, setFrozenThoughtSec] = useState(0);

  useEffect(() => {
    if (!isThinking) return;
    const t0 = Date.now();
    setDisplaySec(0);
    const id = window.setInterval(() => {
      setDisplaySec(Math.floor((Date.now() - t0) / 1000));
    }, 250);
    return () => {
      window.clearInterval(id);
      setFrozenThoughtSec(Math.max(1, Math.floor((Date.now() - t0) / 1000)));
    };
  }, [isThinking]);

  const thoughtLabel = isThinking
    ? displaySec > 0
      ? `Thought for ${displaySec}s`
      : "Thinking…"
    : `Thought for ${Math.max(1, frozenThoughtSec)}s`;

  const doneCount = isThinking ? activeStep : steps.length;

  const stepStatus = (index: number): "done" | "active" | "pending" => {
    if (!isThinking) return "done";
    if (index < activeStep) return "done";
    if (index === activeStep) return "active";
    return "pending";
  };

  return (
    <Box
      data-atlas-component="ThinkingPanel"
      data-atlas-variant={isCompact ? "minimal - compact" : "minimal - relaxed"}
      sx={{ display: "flex", flexDirection: "column", gap: isCompact ? "8px" : "10px", width: "100%" }}
    >
      <Box
        component="button"
        type="button"
        onClick={onToggle}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          alignSelf: "flex-start",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: color.type.muted,
          p: 0,
          textAlign: "left",
          "&:hover": { color: color.type.default },
        }}
      >
        <TradAtlasText semanticFont={isCompact ? SF.textMicro : SF.textSm} sx={{ color: "inherit" }}>
          {thoughtLabel}
        </TradAtlasText>
        <ChevronRightIcon
          sx={{
            fontSize: isCompact ? 16 : 18,
            color: "inherit",
            transition: "transform 0.2s ease",
            transform: open ? "rotate(90deg)" : "none",
          }}
        />
      </Box>

      <Collapse in={open} timeout={280}>
        <Box
          sx={{
            background: color.surface.subtle,
            borderRadius: radius.lg,
            p: isCompact ? "12px" : "14px",
            display: "flex",
            flexDirection: "column",
            gap: isCompact ? "10px" : "12px",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <TuneIcon sx={{ fontSize: isCompact ? 16 : 18, color: color.type.muted }} />
            <TradAtlasText semanticFont={SF.textSmEmphasis} sx={{ color: color.type.default }}>
              {doneCount} of {steps.length} done
            </TradAtlasText>
          </Box>

          {steps.slice(0, stepsToShow).map((step, idx) => {
            const status = stepStatus(idx);
            const isActiveStep = isThinking && idx === stepsToShow - 1;
            return (
              <Box
                key={`${step.title}-${idx}`}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  opacity: isActiveStep ? 0.85 : 1,
                  transition: "opacity 0.3s ease",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <Box sx={{ mt: "2px" }}>
                    <TaskStatusIcon status={status} />
                  </Box>
                  <TradAtlasText
                    semanticFont={SF.textSmEmphasis}
                    sx={{
                      color: color.type.default,
                      textDecoration: status === "done" ? "line-through" : "none",
                      textDecorationColor: color.type.muted,
                    }}
                  >
                    {step.title}
                  </TradAtlasText>
                </Box>
                <TradAtlasText
                  semanticFont={SF.textSm}
                  sx={{
                    color: color.type.muted,
                    pl: "28px",
                  }}
                >
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
