import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Box } from "@mui/material";

import {
  MessageBubble,
  ThinkingPanel,
  type ThinkingStep,
} from "@/components/ai";
import {
  DATA_SEMANTIC_FONT,
  SF,
  semanticFontStyle,
} from "@/tokens/tradAtlasSemanticTypography";
import { atlasFontWeight } from "@/tokens/atlasLight";
import { useTokens } from "@/hooks/useTokens";

import { useWorkflowConversation } from "./WorkflowConversationContext";

import TriggerCard from "./cards/TriggerCard";
import CandidateShortlistCard from "./cards/CandidateShortlistCard";
import CollectDataCard from "./cards/CollectDataCard";
import ConsentToActCard from "./cards/ConsentToActCard";
import ApproverConfigCard from "./cards/ApproverConfigCard";
import VoteCard from "./cards/VoteCard";
import AgenticProgressCard from "./cards/AgenticProgressCard";
import SummaryCard from "./cards/SummaryCard";

/* ── Inference-chain steps ────────────────────────────────────
 * The agent's reasoning before the candidate shortlist appears. Mirrors the
 * thinking steps shown in the non-conversational workspace's ChatPanel so the
 * two flows feel consistent.
 */
const SHORTLIST_THINKING_STEPS: ThinkingStep[] = [
  {
    title: "Query Workday for eligible directors",
    body:
      "Filtering Pacific Polymer's APAC roster by Singapore residency, role seniority, and disqualification status.",
  },
  {
    title: "Apply Companies Act criteria",
    body:
      "Cross-checking the local-resident director rule (s.145(1)) and director-fit-and-proper criteria against each candidate.",
  },
  {
    title: "Rank and summarize",
    body:
      "Scoring candidates against the role rubric and drafting a shortlist with match percentages.",
  },
];

interface MessageBlock {
  key: string;
  kind: "user" | "assistant" | "thinking" | "card";
  /** For `assistant` and `user` — the text body. ReactNode allowed (rich content). */
  body?: ReactNode;
  /** For `card` — the rendered card. */
  card?: ReactNode;
  /** For `thinking` — props are static, the toggle/open state is handled here. */
}

function buildBlocks(
  state: ReturnType<typeof useWorkflowConversation>["state"],
): MessageBlock[] {
  const out: MessageBlock[] = [];
  const stepStatus = (id: string) =>
    state.steps.find((s) => s.id === id)?.status ?? "not_started";

  const triggerAcked = state.triggerAcknowledged;
  const candidateChosen = state.selectedCandidate !== null;
  const dataSubmitted = state.appointmentNric !== null;
  const consentSent = state.consentDocument.sent;
  const consentSigned = state.consentDocument.signedAt !== null;
  const approversConfirmed = state.approvers.confirmed;
  const resolutionSent = state.boardResolution.sent;
  const filingStarted = stepStatus("filing") !== "not_started";
  const filingDone = stepStatus("filing") === "completed";
  const entityStarted = stepStatus("update-entities") !== "not_started";
  const allDone = state.agentic.processComplete;

  // ── Step 0: Trigger ───────────────────────────────────────
  out.push({
    key: "greeting",
    kind: "assistant",
    body: (
      <>
        Good morning, Sarah. I'm the Diligent Governance Agent. Workday just
        flagged a director resignation that needs corporate-secretary
        attention — taking the lead so you can review and decide.
      </>
    ),
  });
  out.push({ key: "trigger-card", kind: "card", card: <TriggerCard /> });
  if (!triggerAcked) return out;

  out.push({
    key: "user-start",
    kind: "user",
    body: <>Yes, let's get started.</>,
  });

  // ── Step 1: Candidate shortlist ───────────────────────────
  out.push({ key: "candidates-thinking", kind: "thinking" });
  out.push({
    key: "candidates-msg",
    kind: "assistant",
    body: (
      <>
        I queried Workday for eligible directors and ran them through the
        Singapore Companies Act criteria — the local-resident rule applies for
        Pacific Polymer. Three candidates passed; <strong>Priya Nair</strong> is
        the strongest match.
      </>
    ),
  });
  out.push({
    key: "candidates-card",
    kind: "card",
    card: <CandidateShortlistCard />,
  });
  if (!candidateChosen) return out;

  out.push({
    key: "user-candidate",
    kind: "user",
    body: <>Let's go with {state.selectedCandidate?.name}.</>,
  });

  // ── Step 2a: Collect appointment data ─────────────────────
  out.push({
    key: "collect-msg",
    kind: "assistant",
    body: (
      <>
        Great. To prepare the Consent to Act and the ACRA Form 45, I need
        NRIC and the effective date. I've prefilled what we have on file —
        confirm or correct.
      </>
    ),
  });
  out.push({ key: "collect-card", kind: "card", card: <CollectDataCard /> });
  if (!dataSubmitted) return out;

  out.push({ key: "user-collect", kind: "user", body: <>Confirmed.</> });

  // ── Step 2b: Consent to Act ───────────────────────────────
  out.push({
    key: "consent-msg",
    kind: "assistant",
    body: (
      <>
        Here's the draft <strong>Consent to Act</strong>. Review on the right,
        and I'll send it to{" "}
        <strong>{state.selectedCandidate?.name?.split(" ")[0]}</strong> for
        signature.
      </>
    ),
  });
  out.push({ key: "consent-card", kind: "card", card: <ConsentToActCard /> });

  if (consentSent && !consentSigned) {
    out.push({ key: "user-consent-send", kind: "user", body: <>Send it.</> });
    out.push({
      key: "consent-waiting",
      kind: "assistant",
      body: (
        <>
          Sent to {state.selectedCandidate?.name?.split(" ")[0]}. I'll ping you
          the moment it's signed and returned.
        </>
      ),
    });
  }
  if (consentSigned) {
    out.push({ key: "user-consent-send", kind: "user", body: <>Send it.</> });
    out.push({
      key: "consent-signed",
      kind: "assistant",
      body: (
        <>
          {state.selectedCandidate?.name?.split(" ")[0]} just signed the Consent
          to Act. Moving on to approvers.
        </>
      ),
    });
  }
  if (!consentSigned) return out;

  // ── Step 3: Approvers + resolution ────────────────────────
  out.push({
    key: "approvers-msg",
    kind: "assistant",
    body: (
      <>
        I pre-populated the Nominating &amp; Governance committee plus our
        sitting CEO and two independents — that meets the bylaw quorum for an
        APAC director appointment. Confirm the list and I'll send the
        resolution.
      </>
    ),
  });
  out.push({
    key: "approvers-card",
    kind: "card",
    card: <ApproverConfigCard />,
  });

  if (approversConfirmed && !resolutionSent) {
    out.push({
      key: "user-approvers-confirmed",
      kind: "user",
      body: <>Approver list looks right.</>,
    });
  }
  if (!resolutionSent) return out;

  out.push({
    key: "user-resolution-send",
    kind: "user",
    body: <>Confirmed — send it.</>,
  });

  // ── Step 4: Board approval — vote tally ───────────────────
  out.push({
    key: "vote-msg",
    kind: "assistant",
    body: (
      <>
        Resolution dispatched to the four approvers. I'll surface each vote
        here as it comes in — the tally below updates live.
      </>
    ),
  });
  out.push({ key: "vote-card", kind: "card", card: <VoteCard /> });

  // ── Step 5: Filing ────────────────────────────────────────
  if (filingStarted) {
    out.push({
      key: "filing-msg",
      kind: "assistant",
      body: (
        <>
          Resolution approved unanimously. Filing the regulatory documents with
          ACRA via BizFile+ now — no further input needed from you.
        </>
      ),
    });
    out.push({
      key: "filing-card",
      kind: "card",
      card: <AgenticProgressCard kind="filing" />,
    });
  }

  // ── Step 6: Entity records ────────────────────────────────
  if (entityStarted) {
    out.push({
      key: "entity-msg",
      kind: "assistant",
      body: (
        <>
          Filing accepted by ACRA. Updating the entity register so downstream
          systems see the change.
        </>
      ),
    });
    out.push({
      key: "entity-card",
      kind: "card",
      card: <AgenticProgressCard kind="entity" />,
    });
  }

  if (allDone) {
    void filingDone;
    out.push({
      key: "summary-msg",
      kind: "assistant",
      body: (
        <>
          {state.selectedCandidate?.name} is now the director of record at{" "}
          {state.entity.name}. Full audit trail attached.
        </>
      ),
    });
    out.push({ key: "summary-card", kind: "card", card: <SummaryCard /> });
  }

  return out;
}

/**
 * Plain-canvas assistant text — mirrors `ChatAssistantResponse` from the
 * design system, but accepts `ReactNode` instead of an HTML string so we can
 * pass interpolated workflow state.
 */
function AssistantText({ children }: { children: ReactNode }) {
  const { color } = useTokens();
  return (
    <Box
      data-atlas-component="ChatAssistantResponse"
      data-atlas-variant="conversational - relaxed"
      {...{ [DATA_SEMANTIC_FONT]: SF.textLg }}
      sx={{
        width: "100%",
        ...semanticFontStyle(SF.textLg),
        color: color.type.default,
        "& strong": { fontWeight: atlasFontWeight.semiBold },
      }}
    >
      {children}
    </Box>
  );
}

interface ChatThreadProps {
  /**
   * Extra top padding inside the scroll container — used by the workspace to
   * leave clearance for an overlay (e.g. the floating workflow title) so that
   * messages scroll behind the overlay instead of being permanently hidden by
   * it on initial render.
   */
  topInset?: number;
}

export default function ChatThread({ topInset = 0 }: ChatThreadProps = {}) {
  const { color } = useTokens();
  const { state } = useWorkflowConversation();
  const ref = useRef<HTMLDivElement>(null);
  const blocks = useMemo(() => buildBlocks(state), [state]);

  const [thinkingOpen, setThinkingOpen] = useState(false);

  // Auto-scroll to bottom whenever the block count changes.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [blocks.length]);

  return (
    <Box
      ref={ref}
      sx={{
        flex: 1,
        overflowY: "auto",
        minHeight: 0,
        background: color.surface.subtle,
        px: "24px",
        // When an overlay is present the caller is responsible for the entire
        // top inset — the chat itself adds no extra padding, so messages slide
        // exactly under the title's opaque background instead of stacking
        // their own gap on top.
        pt: topInset > 0 ? `${topInset}px` : "24px",
        pb: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "32px",
      }}
    >
      {blocks.map((b) => {
        if (b.kind === "user") {
          return (
            <MessageBubble
              key={b.key}
              messageRole="prompt"
              density="relaxed"
              fullWidth
              raised
            >
              {b.body}
            </MessageBubble>
          );
        }

        if (b.kind === "assistant") {
          return <AssistantText key={b.key}>{b.body}</AssistantText>;
        }

        if (b.kind === "thinking") {
          return (
            <ThinkingPanel
              key={b.key}
              steps={SHORTLIST_THINKING_STEPS}
              isThinking={false}
              activeStep={SHORTLIST_THINKING_STEPS.length}
              open={thinkingOpen}
              onToggle={() => setThinkingOpen((o) => !o)}
              density="relaxed"
              raised
            />
          );
        }

        // card
        return (
          <Box key={b.key} sx={{ width: "100%" }}>
            {b.card}
          </Box>
        );
      })}

      {/* Trailing scroll anchor */}
      <Box aria-hidden sx={{ height: "8px" }} />
    </Box>
  );
}
