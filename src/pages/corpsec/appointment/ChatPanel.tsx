import { useState, useRef, useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import { AutoAwesomeOutlinedIcon } from "@/icons";
import {
  ChatConversation,
  ChatPrompt,
  type ChatConversationItem,
  type ThinkingStep,
} from "@/components/ai";
import WorkspaceRailHeader from "@/components/common/WorkspaceRailHeader";
import { useTokens } from "../../../hooks/useTokens";

const WORKSPACE_THINKING_STEPS: ThinkingStep[] = [
  {
    title: "Query Workday for eligible directors",
    body: "Filtering by Singapore residency and disqualification status for Pacific Polymer Logistics.",
  },
  {
    title: "Apply Companies Act criteria",
    body: "Cross-checking local director requirement and role fit against the shortlist.",
  },
  {
    title: "Rank and summarize",
    body: "Scoring candidates and drafting the numbered list with match percentages.",
  },
];

const ASSISTANT_INTRO =
  "I've reviewed the Workday notification about David Chen's resignation from Pacific Polymer Logistics Pte. Ltd. His last day is April 17, 2026 — 14 days from now.\n\nI've pulled the Singapore Companies Act requirements for director appointments. Since Pacific Polymer must maintain at least one locally resident director, I've cross-referenced eligible internal candidates from Workday who meet the residency and eligibility criteria.\n\nThe first step is to identify and select a replacement candidate. Shall I walk you through the shortlisted candidates?";

const USER_FOLLOW_UP = "Yes, what candidates are available?";

const ASSISTANT_CANDIDATES =
  "Based on Workday data and Singapore Companies Act requirements, I've identified three candidates:\n\n1. **Priya Nair** — Regional Finance Director, APAC (94% match). Singapore resident, no disqualifications, strong finance background.\n\n2. **Lim Pei Shan** — Director of Risk Management (87% match). Singapore resident, compliance expertise.\n\n3. **Kenji Tanaka** — Head of Digital Transformation (72% match). Note: non-resident — may not satisfy the local director requirement without additional arrangements.\n\nPriya Nair is the recommended candidate given her residency status and role seniority. Would you like to proceed with her, or review the other candidates in more detail?";

/** Workspace rail — same chat components as general-purpose chat, `compact` density. */
export default function ChatPanel() {
  const { color } = useTokens();
  const [thinkingOpen, setThinkingOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const threadItems: ChatConversationItem[] = useMemo(
    () => [
      { type: "assistant", content: ASSISTANT_INTRO },
      { type: "user", content: USER_FOLLOW_UP },
      {
        type: "thinking",
        steps: WORKSPACE_THINKING_STEPS,
        open: thinkingOpen,
        onToggle: () => setThinkingOpen((o) => !o),
      },
      { type: "assistant", content: ASSISTANT_CANDIDATES },
    ],
    [thinkingOpen],
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [thinkingOpen, threadItems.length]);

  return (
    <Box
      sx={{
        width: 340,
        flexShrink: 0,
        borderLeft: `1px solid ${color.outline.fixed}`,
        background: color.surface.default,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <WorkspaceRailHeader
        icon={<AutoAwesomeOutlinedIcon sx={{ fontSize: 18, color: color.action.primary.default }} />}
        title="AI Governance Assistant"
        subtitle="Context for this appointment"
      />

      <Box ref={scrollRef} sx={{ flex: 1, overflow: "auto", px: "16px", py: "16px" }}>
        <ChatConversation
          items={threadItems}
          density="compact"
          onRerunUser={() => undefined}
        />
      </Box>

      <Box
        sx={{
          px: "12px",
          py: "12px",
          borderTop: `1px solid ${color.outline.fixed}`,
        }}
      >
        <ChatPrompt
          value={inputValue}
          onChange={setInputValue}
          onSend={() => setInputValue("")}
          canSend={inputValue.trim().length > 0}
          placeholder="Ask a question..."
          density="compact"
          fullWidth
        />
      </Box>
    </Box>
  );
}
