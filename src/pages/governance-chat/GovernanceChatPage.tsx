import { Box } from "@mui/material";
import { ChatPrompt } from "../../components/ai";
import { SuggestionChip } from "../../components/common";
import ChatThread from "../../components/ai/ChatThread";
import useChatSimulation from "../../hooks/useChatSimulation";
import { GOVERNANCE_THINKING_STEPS } from "./thinkingSteps";
import { GOVERNANCE_RESPONSE_SECTIONS } from "./responseSections";
import TradAtlasText from "../../components/common/TradAtlasText";
import { SF } from "../../tokens/tradAtlasSemanticTypography";
import { atlasSemanticColor as color } from "../../tokens/atlasLight";

const DEMO_PROMPT =
  "Summarize the legal requirements of appointing a subsidiary board member in the UK";

const SUGGESTION_PROMPTS = ["Help write prompt", "Summarize article", "Analyze data"];

const SECTION_COUNT = GOVERNANCE_RESPONSE_SECTIONS.length + 1;

export default function GovernanceChatPage() {
  const sim = useChatSimulation({
    thinkingSteps: GOVERNANCE_THINKING_STEPS,
    sectionCount: SECTION_COUNT,
  });

  return (
    <Box
      sx={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: color.background.base,
      }}
    >
      {/* Scrollable thread area */}
      <Box
        ref={sim.scrollRef}
        sx={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}
      >
        {sim.phase === "idle" ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              px: "24px",
              py: "48px",
            }}
          >
            <TradAtlasText
              semanticFont={SF.titleH3Emphasis}
              sx={{
                letterSpacing: "-0.2px",
                color: color.type.default,
                textAlign: "center",
              }}
            >
              How can I help you today?
            </TradAtlasText>
            <TradAtlasText
              semanticFont={SF.textLg}
              sx={{
                color: color.type.muted,
                textAlign: "center",
                maxWidth: 480,
              }}
            >
              Ask a question, draft a document, or explore legal requirements — I&apos;m here to assist.
            </TradAtlasText>
          </Box>
        ) : (
          <Box sx={{ px: "24px", width: "100%", boxSizing: "border-box" }}>
            <ChatThread
              phase={sim.phase}
              userMessage={DEMO_PROMPT}
              thinkingSteps={GOVERNANCE_THINKING_STEPS}
              activeThinkingStep={sim.activeThinkingStep}
              thinkingOpen={sim.thinkingOpen}
              onToggleThinking={() => sim.setThinkingOpen((o) => !o)}
              responseSections={GOVERNANCE_RESPONSE_SECTIONS}
              visibleSections={sim.visibleSections}
              density="relaxed"
              userMessageFullWidth
              onRerunPrompt={sim.handleRerun}
            />
          </Box>
        )}
      </Box>

      {/* Pinned prompt area */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: "24px",
          pb: "24px",
          pt: "8px",
          gap: "12px",
          flexShrink: 0,
        }}
      >
        <ChatPrompt
          value={sim.input}
          onChange={sim.setInput}
          onSend={sim.handleSend}
          disabled={sim.phase !== "idle"}
          canSend={sim.canSend}
          density="relaxed"
        />

        {sim.phase === "idle" && (
          <Box
            sx={{
              display: "flex",
              gap: "8px",
              alignItems: "start",
              maxWidth: 640,
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            {SUGGESTION_PROMPTS.map((label) => (
              <SuggestionChip
                key={label}
                label={label}
                onClick={() => sim.setInput(label === "Summarize article" ? DEMO_PROMPT : label)}
              />
            ))}
            <SuggestionChip label="..." />
          </Box>
        )}
      </Box>
    </Box>
  );
}
