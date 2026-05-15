import { useMemo, useState, type ReactNode } from "react";
import { Box } from "@mui/material";
import { Link as RouterLink } from "react-router";

import {
  AccountTreeOutlinedIcon,
  AssessmentOutlinedIcon,
  CheckIcon,
  DescriptionOutlinedIcon,
  EventOutlinedIcon,
  FactCheckOutlinedIcon,
  GavelOutlinedIcon,
  GroupsOutlinedIcon,
  HowToVoteOutlinedIcon,
  PersonAddOutlinedIcon,
  SummarizeOutlinedIcon,
  WarningAmberIcon,
} from "@/icons";
import PulsingStatusDot, {
  type PulsingStatusTone,
} from "@/components/common/PulsingStatusDot";
import TradAtlasText from "@/components/common/TradAtlasText";
import { SF } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

import CorpSecSideNavLayout from "./CorpSecSideNavLayout";
import SearchField from "./components/SearchField";

/* ── History data ────────────────────────────────────────────────── */

type WorkflowRunStatus =
  | "running"
  | "awaiting_review"
  | "completed"
  | "failed";

interface WorkflowRunSpec {
  id: string;
  title: string;
  agent: string;
  currentStep: string;
  status: WorkflowRunStatus;
  updated: string;
  icon: ReactNode;
  href?: string;
}

/**
 * Demo data — a mix of in-flight, blocked, completed, and failed runs across
 * the corp-sec workflow catalogue. Top three rows mirror the running items
 * also shown in the side rail; everything below is historical.
 */
const RUNS: WorkflowRunSpec[] = [
  {
    id: "wf-priya-nair",
    title: "Replace director David Chen at Pacific Polymer Logistics",
    agent: "Board appointment agent",
    currentStep: "Filing Form 45 with ACRA via BizFile+",
    status: "running",
    updated: "2 min ago",
    icon: <PersonAddOutlinedIcon sx={{ fontSize: 18 }} />,
    href: "/corpsec/appointment/conversation",
  },
  {
    id: "wf-pacific-disclosures",
    title: "Pacific Polymer Logistics — refresh director disclosures",
    agent: "Director disclosures agent",
    currentStep: "Awaiting permission to update Entities DB",
    status: "awaiting_review",
    updated: "12 min ago",
    icon: <FactCheckOutlinedIcon sx={{ fontSize: 18 }} />,
  },
  {
    id: "wf-entity-sync",
    title: "Entity records sync — Pacific Polymer Logistics UEN 201812345K",
    agent: "Entity sync agent",
    currentStep: "Reconciling Workday → Entities for 47 records",
    status: "running",
    updated: "21 min ago",
    icon: <AccountTreeOutlinedIcon sx={{ fontSize: 18 }} />,
  },
  {
    id: "wf-zenith-annual-return",
    title: "Annual return filing — Zenith Compliance Services (Ireland)",
    agent: "Filing deadline agent",
    currentStep: "Draft prepared — pending your review before CRO submission",
    status: "awaiting_review",
    updated: "1 hr ago",
    icon: <DescriptionOutlinedIcon sx={{ fontSize: 18 }} />,
  },
  {
    id: "wf-meridian-board-pack",
    title: "Q2 board pack assembly — Meridian Corp",
    agent: "Board meeting prep agent",
    currentStep: "Collecting committee reports from audit and risk chairs",
    status: "running",
    updated: "28 min ago",
    icon: <SummarizeOutlinedIcon sx={{ fontSize: 18 }} />,
  },
  {
    id: "wf-aether-vacancy",
    title: "Subsidiary director appointment — Aether Holdings Ltd",
    agent: "Board appointment agent",
    currentStep: "Eligibility screening: reviewing candidate qualifications",
    status: "running",
    updated: "12 min ago",
    icon: <PersonAddOutlinedIcon sx={{ fontSize: 18 }} />,
  },
  {
    id: "wf-novabridge-handelsregister",
    title: "Handelsregister filing — NovaBridge Capital GmbH",
    agent: "Filing deadline agent",
    currentStep: "Filing accepted and archived",
    status: "completed",
    updated: "3 hrs ago",
    icon: <DescriptionOutlinedIcon sx={{ fontSize: 18 }} />,
  },
  {
    id: "wf-q2-agm-meridian",
    title: "Q2 AGM preparation — Meridian Corp",
    agent: "AGM preparation agent",
    currentStep: "Notice of meeting and proxy materials issued",
    status: "completed",
    updated: "Yesterday",
    icon: <HowToVoteOutlinedIcon sx={{ fontSize: 18 }} />,
  },
  {
    id: "wf-conflict-decl-q1",
    title: "Q1 conflict-of-interest declarations cycle",
    agent: "COI declarations agent",
    currentStep: "All declarations collected and archived",
    status: "completed",
    updated: "2 days ago",
    icon: <GavelOutlinedIcon sx={{ fontSize: 18 }} />,
  },
  {
    id: "wf-march-board-minutes",
    title: "March board meeting minutes — Pacific Polymer",
    agent: "Minutes agent",
    currentStep: "Minutes signed off by chair and archived",
    status: "completed",
    updated: "5 days ago",
    icon: <DescriptionOutlinedIcon sx={{ fontSize: 18 }} />,
  },
  {
    id: "wf-onboarding-rebecca",
    title: "Director onboarding — Rebecca Tan (Pacific Polymer)",
    agent: "Onboarding agent",
    currentStep: "Provisioning failed — board portal access denied",
    status: "failed",
    updated: "6 days ago",
    icon: <GroupsOutlinedIcon sx={{ fontSize: 18 }} />,
  },
  {
    id: "wf-meridian-skills-matrix",
    title: "Skills matrix refresh — Meridian Corp",
    agent: "Skills matrix agent",
    currentStep: "Gap analysis published to nominations committee",
    status: "completed",
    updated: "Apr 22",
    icon: <AssessmentOutlinedIcon sx={{ fontSize: 18 }} />,
  },
  {
    id: "wf-aether-emergency-meeting",
    title: "Convene emergency board meeting — Aether Holdings",
    agent: "Emergency convening agent",
    currentStep: "Notice issued and quorum confirmed",
    status: "completed",
    updated: "Apr 18",
    icon: <WarningAmberIcon sx={{ fontSize: 18 }} />,
  },
  {
    id: "wf-policy-review-q1",
    title: "Q1 governance policy review",
    agent: "Policy review agent",
    currentStep: "Gap report delivered to governance committee",
    status: "completed",
    updated: "Apr 14",
    icon: <GavelOutlinedIcon sx={{ fontSize: 18 }} />,
  },
  {
    id: "wf-acra-march-filings",
    title: "ACRA March filings batch — Singapore entities",
    agent: "Filing deadline agent",
    currentStep: "Schema validation failed for 1 of 6 filings",
    status: "failed",
    updated: "Apr 10",
    icon: <EventOutlinedIcon sx={{ fontSize: 18 }} />,
  },
];

/**
 * Past-workflows archive. The destination for the side-nav "View past
 * workflows" footer link. Renders the corp-sec workflow runs as scannable
 * rows with a sticky search filter on top, mirroring the wireframe.
 */
export default function WorkflowHistoryPage() {
  const { color, weight, radius } = useTokens();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return RUNS;
    return RUNS.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.agent.toLowerCase().includes(q) ||
        r.currentStep.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <CorpSecSideNavLayout>
      <Box sx={{ width: "100%", maxWidth: 960, mx: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
        <Box>
          <TradAtlasText
            semanticFont={SF.titleH3Emphasis}
            sx={{ fontWeight: weight.semiBold, color: color.type.default }}
          >
            Workflow History
          </TradAtlasText>
          <TradAtlasText
            semanticFont={SF.textMd}
            sx={{ color: color.type.muted, mt: "4px" }}
          >
            Every agentic workflow that has run or is currently running. Search
            by name, agent, or current step.
          </TradAtlasText>
        </Box>

        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search workflows..."
        />

        <Box
          sx={{
            background: color.surface.default,
            border: `1px solid ${color.outline.fixed}`,
            borderRadius: radius.lg,
            overflow: "hidden",
          }}
        >
          {filtered.length === 0 ? (
            <Box sx={{ p: "32px", textAlign: "center" }}>
              <TradAtlasText
                semanticFont={SF.textMd}
                sx={{ color: color.type.muted }}
              >
                No workflows match "{query}".
              </TradAtlasText>
            </Box>
          ) : (
            filtered.map((r, i) => (
              <WorkflowRunRow
                key={r.id}
                run={r}
                lastInList={i === filtered.length - 1}
              />
            ))
          )}
        </Box>
      </Box>
    </CorpSecSideNavLayout>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────── */

function WorkflowRunRow({
  run,
  lastInList,
}: {
  run: WorkflowRunSpec;
  lastInList: boolean;
}) {
  const { color, weight, radius } = useTokens();

  const styles = {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    columnGap: "16px",
    rowGap: "4px",
    px: "20px",
    py: "16px",
    borderBottom: lastInList ? "none" : `1px solid ${color.outline.fixed}`,
    textDecoration: "none",
    color: "inherit",
    transition: "background-color 120ms ease",
    "&:hover": run.href ? { background: color.surface.subtle } : undefined,
  } as const;

  const inner = (
    <>
      {/* Leading icon block + status indicator stacked vertically. */}
      <Box
        sx={{
          gridColumn: "1",
          gridRow: "1 / span 2",
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
          minWidth: 0,
        }}
      >
        <Box
          aria-hidden
          sx={{
            width: 36,
            height: 36,
            borderRadius: radius.sm,
            background: color.surface.variant,
            color: color.type.muted,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {run.icon}
        </Box>
      </Box>

      {/* Title + status pill row. */}
      <Box
        sx={{
          gridColumn: "2",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          minWidth: 0,
        }}
      >
        <TradAtlasText
          semanticFont={SF.textMdEmphasis}
          sx={{
            color: color.type.default,
            fontWeight: weight.semiBold,
            letterSpacing: "-0.005em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            minWidth: 0,
          }}
        >
          {run.title}
        </TradAtlasText>
        <StatusPill status={run.status} />
      </Box>

      {/* Sub-line with agent and current step. */}
      <Box sx={{ gridColumn: "2", display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TradAtlasText
          semanticFont={SF.textSm}
          sx={{
            color: color.type.muted,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {run.agent} · {run.currentStep}
        </TradAtlasText>
      </Box>

      {/* Right-aligned timestamp. */}
      <Box
        sx={{
          gridColumn: "3",
          gridRow: "1 / span 2",
          display: "flex",
          alignItems: "center",
        }}
      >
        <TradAtlasText
          semanticFont={SF.textSm}
          sx={{
            color: color.type.muted,
            whiteSpace: "nowrap",
          }}
        >
          {run.updated}
        </TradAtlasText>
      </Box>
    </>
  );

  if (run.href) {
    return (
      <Box component={RouterLink} to={run.href} sx={styles}>
        {inner}
      </Box>
    );
  }
  return <Box sx={styles}>{inner}</Box>;
}

/**
 * Compact, color-aware status indicator. Running and awaiting-review states
 * use the pulsing dot to telegraph live work; completed and failed states
 * use static icons since the work is settled.
 */
function StatusPill({ status }: { status: WorkflowRunStatus }) {
  const { color, weight } = useTokens();

  const tone: PulsingStatusTone =
    status === "awaiting_review"
      ? "warning"
      : status === "running"
        ? "info"
        : "info";

  const config: Record<
    WorkflowRunStatus,
    { label: string; bg: string; fg: string; icon: ReactNode }
  > = {
    running: {
      label: "Running",
      bg: color.status.notification.background,
      fg: color.action.primary.default,
      icon: <PulsingStatusDot size="sm" tone={tone} />,
    },
    awaiting_review: {
      label: "Needs review",
      bg: color.status.warning.background,
      fg: color.status.warning.text,
      icon: <PulsingStatusDot size="sm" tone={tone} />,
    },
    completed: {
      label: "Completed",
      bg: color.status.success.background,
      fg: color.status.success.text,
      icon: <CheckIcon sx={{ fontSize: 12, color: color.status.success.text }} />,
    },
    failed: {
      label: "Failed",
      bg: color.status.error.background,
      fg: color.status.error.text,
      icon: (
        <WarningAmberIcon
          sx={{ fontSize: 12, color: color.status.error.text }}
        />
      ),
    },
  };
  const { label, bg, fg, icon } = config[status];

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        px: "8px",
        py: "3px",
        borderRadius: "6px",
        background: bg,
        color: fg,
        flexShrink: 0,
      }}
    >
      {icon}
      <TradAtlasText
        semanticFont={SF.textMicroEmphasis}
        sx={{
          color: "inherit",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontSize: "10px",
          fontWeight: weight.semiBold,
        }}
      >
        {label}
      </TradAtlasText>
    </Box>
  );
}
