import { Box, Stack } from "@mui/material";
import { NorthEastIcon } from "@/icons";
import TradAtlasText from "../common/TradAtlasText";
import { SF } from "@/tokens/tradAtlasSemanticTypography";
import ThinkingPanel from "./ThinkingPanel";
import MessageBubble from "./MessageBubble";
import FeedbackBar from "./FeedbackBar";
import RevealSection from "./RevealSection";
import { atlasSemanticColor as color } from "../../tokens/atlasLight";

export type ChatPhase = "idle" | "thinking" | "responding" | "done";

export interface ThinkingStepData {
  title: string;
  body: string;
}

function SuggestionChipFooter({ label }: { label: string }) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        height: "36px",
        border: `1px solid ${color.outline.static}`,
        borderRadius: "6px",
        px: "8px",
        background: color.background.base,
        cursor: "pointer",
        "&:hover": { background: color.surface.variant },
      }}
    >
      <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ px: "8px" }}>
        {label}
      </TradAtlasText>
      <NorthEastIcon sx={{ fontSize: 16, color: color.type.default }} />
    </Box>
  );
}

interface ChatThreadProps {
  phase: ChatPhase;
  userMessage: string;
  thinkingSteps: ThinkingStepData[];
  activeThinkingStep: number;
  thinkingOpen: boolean;
  onToggleThinking: () => void;
  /** Response sections as ReactNode array — rendered in order via RevealSection. */
  responseSections: React.ReactNode[];
  /** Number of sections currently visible (0 = none). */
  visibleSections: number;
  /** Suggested follow-up actions shown in the footer. */
  suggestedActions?: string[];
}

export default function ChatThread({
  phase,
  userMessage,
  thinkingSteps,
  activeThinkingStep,
  thinkingOpen,
  onToggleThinking,
  responseSections,
  visibleSections,
  suggestedActions = ["Get started on next step", "Summarize article", "Analyze data"],
}: ChatThreadProps) {
  const showThread = phase !== "idle";
  if (!showThread) return null;

  const isThinking = phase === "thinking";

  return (
    <Box
      sx={{
        maxWidth: 640,
        width: "100%",
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        py: "24px",
      }}
    >
      <MessageBubble>{userMessage}</MessageBubble>

      <ThinkingPanel
        steps={thinkingSteps}
        isThinking={isThinking}
        activeStep={activeThinkingStep}
        open={thinkingOpen}
        onToggle={onToggleThinking}
      />

      {(phase === "responding" || phase === "done") && (
        <Stack spacing="24px" sx={{ width: "100%" }}>
          {responseSections.map((section, idx) =>
            visibleSections >= idx + 1 ? (
              <RevealSection key={idx}>{section}</RevealSection>
            ) : null,
          )}

          {/* Footer with feedback + suggestions */}
          {visibleSections >= responseSections.length + 1 && (
            <RevealSection>
              <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", pt: "8px" }}>
                <FeedbackBar />
                <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
                    Suggested actions
                  </TradAtlasText>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {suggestedActions.map((label) => (
                      <SuggestionChipFooter key={label} label={label} />
                    ))}
                  </Box>
                </Box>
              </Box>
            </RevealSection>
          )}
        </Stack>
      )}
    </Box>
  );
}
