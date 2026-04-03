import { Box, Typography } from "@mui/material";
import { AiSparkle, ChatPrompt } from "../../components/ai";
import { SuggestionChip } from "../../components/common";
import ChatThread from "../../components/ai/ChatThread";
import useChatSimulation from "../../hooks/useChatSimulation";
import { GOVERNANCE_THINKING_STEPS } from "./thinkingSteps";
import { GOVERNANCE_RESPONSE_SECTIONS } from "./responseSections";
import {
  atlasSemanticColor as color,
  atlasFontWeight as weight,
} from "../../tokens/atlasLight";

const CHAT_WIDTH = 640;

const DEMO_PROMPT =
  "Summarize the legal requirements of appointing a subsidiary board member in the UK";

const SUGGESTION_PROMPTS = [
  "Help write prompt",
  "Summarize article",
  "Analyze data",
];

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
              gap: "16px",
              px: "24px",
              py: "48px",
            }}
          >
            <AiSparkle size="2xl" />
            <Typography
              sx={{
                fontSize: "24px",
                lineHeight: "32px",
                fontWeight: weight.semiBold,
                letterSpacing: "-0.2px",
                color: color.type.default,
                textAlign: "center",
              }}
            >
              How can I help you today?
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "0.2px",
                color: color.type.muted,
                textAlign: "center",
                maxWidth: 480,
              }}
            >
              Ask a question, draft a document, or explore legal requirements — I&apos;m here to assist.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ px: "24px" }}>
            <ChatThread
              phase={sim.phase}
              userMessage={DEMO_PROMPT}
              thinkingSteps={GOVERNANCE_THINKING_STEPS}
              activeThinkingStep={sim.activeThinkingStep}
              thinkingOpen={sim.thinkingOpen}
              onToggleThinking={() => sim.setThinkingOpen((o) => !o)}
              responseSections={GOVERNANCE_RESPONSE_SECTIONS}
              visibleSections={sim.visibleSections}
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
          maxWidth={CHAT_WIDTH}
        />

        {sim.phase === "idle" && (
          <Box
            sx={{
              display: "flex",
              gap: "8px",
              alignItems: "start",
              maxWidth: CHAT_WIDTH,
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
