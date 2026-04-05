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
    title: "Correlate CVE advisory with asset inventory",
    body: "Cross-referencing CVE-2026-1847 against ITRM asset catalog and vendor product mappings.",
  },
  {
    title: "Assess compliance framework impact",
    body: "Checking affected controls across SOC 2, ISO 27001, NIST CSF, and PCI DSS.",
  },
  {
    title: "Generate impact summary",
    body: "Aggregating affected systems, business processes, data flows, and customer exposure.",
  },
];

const AI_INTRO =
  "I've completed the initial impact assessment of CVE-2026-1847. 12 assets are affected across 3 business-critical systems. Shall I walk you through the compliance impact?";

const USER_Q1 = "Yes, what frameworks are affected?";

const AI_FRAMEWORKS =
  "Four compliance frameworks have potential impact:\n\n- **SOC 2 Type II** (CC7.1 — System Operations)\n- **ISO 27001** (A.12.6 — Technical Vulnerability Management)\n- **NIST CSF** (ID.RA-1 — Asset Vulnerabilities)\n- **PCI DSS** (Req 6.2 — Security Patches)\n\nI've flagged these in the impact assessment.";

const USER_Q2 = "What's the remediation timeline?";

const AI_TIMELINE =
  "Based on the CVSS 9.8 score and your policy framework, the required remediation window is **24 hours** for critical assets. I've drafted 5 ITSM tickets and an emergency change request. The patch is available from CrowdStrike — estimated deployment time is 4–6 hours with your current automation.";

export default function ChatPanel() {
  const { color } = useTokens();
  const [thinkingOpen, setThinkingOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const threadItems: ChatConversationItem[] = useMemo(
    () => [
      { type: "assistant", content: AI_INTRO },
      { type: "user", content: USER_Q1 },
      {
        type: "thinking",
        steps: WORKSPACE_THINKING_STEPS,
        open: thinkingOpen,
        onToggle: () => setThinkingOpen((o) => !o),
      },
      { type: "assistant", content: AI_FRAMEWORKS },
      { type: "user", content: USER_Q2 },
      { type: "assistant", content: AI_TIMELINE },
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
        title="AI Security Assistant"
        subtitle="Context for this incident"
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
