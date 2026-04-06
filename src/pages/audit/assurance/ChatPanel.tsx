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

const THINKING_STEPS: ThinkingStep[] = [
  {
    title: "Map controls to enterprise risk register",
    body: "Cross-referencing NIST CSF controls with the IT risk register and ERM entries to identify coverage gaps.",
  },
  {
    title: "Analyze prior audit findings",
    body: "Reviewing historical exceptions across access management, change management, and vendor risk domains.",
  },
  {
    title: "Generate testing summary",
    body: "Aggregating control test results, exception rates, and remediation timelines for the assurance opinion.",
  },
];

const AI_INTRO =
  "I've reviewed Thomas Chen's request and the seven-step workflow (investigation through approval). After you authorize agents in Evidence, I can help interpret packs, synthesis, and committee expectations. Want a quick read on testing priorities?";

const USER_Q1 = "Yes — what are the highest-risk areas?";

const AI_RISK =
  "Based on the risk register and prior audit history, three areas stand out:\n\n- **Access management** (PR.AC) — 3 prior exceptions, privileged access reviews overdue\n- **Vendor risk management** (ID.SC) — 2 tier-1 vendors with lapsed certifications\n- **Incident response** (RS.RP) — playbooks haven't been tested since Q3 2025\n\nI'd recommend prioritizing full-population testing on access management and targeted reviews on the other two.";

const USER_Q2 = "What does the committee expect in the report?";

const AI_REPORT =
  "Based on prior committee packs and Thomas Chen's request, the report should include:\n\n1. **Assurance opinion** on cybersecurity control posture\n2. **SEC disclosure readiness** assessment (material weakness evaluation)\n3. **Control test results** with exception details and remediation status\n4. **Risk-to-control mapping** showing coverage across NIST CSF\n5. **Comparison** to prior quarter findings and trend analysis\n\nI've pre-populated the final report template with these sections.";

const USER_REDACT = "Remove all individual names from the report. Replace them with role titles only.";

const REDACT_THINKING: ThinkingStep[] = [
  {
    title: "Scanning report for personal identifiers",
    body: "Parsing the full report to locate every instance of individual names, including finding owners, sign-off lines, and inline references.",
  },
  {
    title: "Mapping names to role titles",
    body: "Cross-referencing identified names against the org chart and engagement roster to determine the correct role title for each individual.",
  },
  {
    title: "Applying redactions as tracked changes",
    body: "Replacing 4 name occurrences across sections 3 and 6 with role titles. Changes are shown as tracked edits so you can review each one.",
  },
];

const AI_REDACT =
  "Done — I've redacted **4 individual names** from the report and replaced them with role titles. All changes are shown as tracked edits:\n\n- **F-01** owner: ~~Priya Ramaswamy, Data Science~~ → Data Science Lead\n- **F-03** owner: ~~Marcus Williams, GRC Platform~~ → GRC Platform Lead\n- **F-05** owner: ~~James Thornton, IT Security~~ → IT Security Lead\n- **Sign-off**: ~~Alexandra Chen~~ → [Head of Internal Audit]\n\nPlease review the tracked changes in the editor. You can undo any individual redaction if needed.";

export default function ChatPanel() {
  const { color } = useTokens();
  const [thinkingOpen, setThinkingOpen] = useState(false);
  const [redactThinkingOpen, setRedactThinkingOpen] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const threadItems: ChatConversationItem[] = useMemo(
    () => [
      { type: "assistant", content: AI_INTRO },
      { type: "user", content: USER_Q1 },
      {
        type: "thinking",
        steps: THINKING_STEPS,
        open: thinkingOpen,
        onToggle: () => setThinkingOpen((o) => !o),
      },
      { type: "assistant", content: AI_RISK },
      { type: "user", content: USER_Q2 },
      { type: "assistant", content: AI_REPORT },
      { type: "user", content: USER_REDACT },
      {
        type: "thinking",
        steps: REDACT_THINKING,
        open: redactThinkingOpen,
        onToggle: () => setRedactThinkingOpen((o) => !o),
      },
      { type: "assistant", content: AI_REDACT },
    ],
    [thinkingOpen, redactThinkingOpen],
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [thinkingOpen, redactThinkingOpen, threadItems.length]);

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
        title="AI Audit Assistant"
        subtitle="Context for this engagement"
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
