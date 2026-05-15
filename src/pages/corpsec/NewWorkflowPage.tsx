import { useMemo, useState, type ReactNode } from "react";
import { Box } from "@mui/material";
import { Link as RouterLink } from "react-router";

import {
  AccountTreeOutlinedIcon,
  AssessmentOutlinedIcon,
  DescriptionOutlinedIcon,
  EventOutlinedIcon,
  FactCheckOutlinedIcon,
  GavelOutlinedIcon,
  GroupsOutlinedIcon,
  HandshakeOutlinedIcon,
  HowToVoteOutlinedIcon,
  PersonAddOutlinedIcon,
  PolicyOutlinedIcon,
  ShieldOutlinedIcon,
  StorageOutlinedIcon,
  SummarizeOutlinedIcon,
  WarningAmberIcon,
} from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import { SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

import CorpSecSideNavLayout from "./CorpSecSideNavLayout";
import SearchField from "./components/SearchField";

/* ── Workflow catalogue ─────────────────────────────────────────── */

type Cadence = "Strategic" | "Cyclical" | "Operational" | "Incident";

interface WorkflowTileSpec {
  id: string;
  title: string;
  description: string;
  cadence: Cadence;
  icon: ReactNode;
  /** When set, the tile becomes a router link to a working prototype. */
  href?: string;
}

/**
 * Catalogue of agentic workflows a corporate secretary can run. Drawn from
 * the corp-sec jobs-to-be-done catalogue
 * (`context/corporate-secretary/jobs-to-be-done.md`) so the picker mirrors
 * the work the role actually owns. Tiles without `href` are mocked — the
 * agent isn't built yet but the entry point is reserved.
 */
const WORKFLOWS: WorkflowTileSpec[] = [
  {
    id: "board-appointment",
    title: "Board appointment",
    description:
      "Replace, add, or transition a director — eligibility, consent, board approval, and ACRA filing end-to-end.",
    cadence: "Incident",
    icon: <PersonAddOutlinedIcon sx={{ fontSize: 22 }} />,
    href: "/corpsec/appointment/conversation",
  },
  {
    id: "emergency-board-meeting",
    title: "Convene emergency board meeting",
    description:
      "Notice, agenda, materials, and quorum confirmation when an incident demands board-level attention.",
    cadence: "Incident",
    icon: <WarningAmberIcon sx={{ fontSize: 22 }} />,
  },
  {
    id: "director-disclosures",
    title: "Refresh director disclosures",
    description:
      "Re-collect declarations across the board, reconcile against last cycle, and archive the audit trail.",
    cadence: "Cyclical",
    icon: <FactCheckOutlinedIcon sx={{ fontSize: 22 }} />,
  },
  {
    id: "annual-return",
    title: "Annual return filing",
    description:
      "Prepare and lodge statutory annual returns across entities, jurisdiction by jurisdiction.",
    cadence: "Cyclical",
    icon: <DescriptionOutlinedIcon sx={{ fontSize: 22 }} />,
  },
  {
    id: "board-pack",
    title: "Board pack assembly",
    description:
      "Collect and QA management and committee reports, route through chair review, publish to the portal.",
    cadence: "Cyclical",
    icon: <SummarizeOutlinedIcon sx={{ fontSize: 22 }} />,
  },
  {
    id: "board-minutes",
    title: "Draft board minutes",
    description:
      "Capture deliberations, decisions, and action items — formatted to your minute-book conventions.",
    cadence: "Cyclical",
    icon: <DescriptionOutlinedIcon sx={{ fontSize: 22 }} />,
  },
  {
    id: "policy-review",
    title: "Quarterly governance policy review",
    description:
      "Compare current policies against latest regulatory guidance and flag gaps for the governance committee.",
    cadence: "Cyclical",
    icon: <GavelOutlinedIcon sx={{ fontSize: 22 }} />,
  },
  {
    id: "director-onboarding",
    title: "Director onboarding & training",
    description:
      "Provision access, distribute orientation materials, and track training completion for new directors.",
    cadence: "Cyclical",
    icon: <GroupsOutlinedIcon sx={{ fontSize: 22 }} />,
  },
  {
    id: "skills-matrix",
    title: "Skills matrix & succession review",
    description:
      "Evaluate current board composition against the skills rubric, surface gaps, draft succession options.",
    cadence: "Strategic",
    icon: <AssessmentOutlinedIcon sx={{ fontSize: 22 }} />,
  },
  {
    id: "agm-preparation",
    title: "AGM preparation",
    description:
      "Notices, proxies, voting items, and disclosures — assembled and routed for board approval.",
    cadence: "Cyclical",
    icon: <HowToVoteOutlinedIcon sx={{ fontSize: 22 }} />,
  },
  {
    id: "conflict-of-interest",
    title: "Conflict-of-interest declarations",
    description:
      "Issue, collect, and archive director declarations with template checks and recusal tracking.",
    cadence: "Cyclical",
    icon: <PolicyOutlinedIcon sx={{ fontSize: 22 }} />,
  },
  {
    id: "entity-sync",
    title: "Entity register sync",
    description:
      "Reconcile entity data across Workday, Entities DB, board portal, and statutory registries.",
    cadence: "Operational",
    icon: <StorageOutlinedIcon sx={{ fontSize: 22 }} />,
  },
  {
    id: "filing-gap",
    title: "Filing compliance gap remediation",
    description:
      "Catch up on overdue or missed filings across the entity portfolio, with deadline-aware sequencing.",
    cadence: "Incident",
    icon: <EventOutlinedIcon sx={{ fontSize: 22 }} />,
  },
  {
    id: "structure-simplification",
    title: "Subsidiary structure simplification",
    description:
      "Identify dormant or redundant subsidiaries; prepare cost-benefit and regulatory impact for leadership.",
    cadence: "Strategic",
    icon: <AccountTreeOutlinedIcon sx={{ fontSize: 22 }} />,
  },
  {
    id: "ma-governance",
    title: "Coordinate M&A governance",
    description:
      "Sequence approvals, documentation, due-diligence data, and disclosures for a transaction or carve-out.",
    cadence: "Strategic",
    icon: <HandshakeOutlinedIcon sx={{ fontSize: 22 }} />,
  },
  {
    id: "regulator-response",
    title: "Whistleblower / regulator response",
    description:
      "Coordinate convening, records access, and minute-trail evidence for an investigation or urgent request.",
    cadence: "Incident",
    icon: <ShieldOutlinedIcon sx={{ fontSize: 22 }} />,
  },
];

/**
 * The destination for the side-nav `+ workflow` affordance. Presents the
 * full agentic-workflow catalogue as a 4-column tile grid with a sticky
 * search filter on top, mirroring the Figma wireframe for "Select a
 * Workflow".
 */
export default function NewWorkflowPage() {
  const { color, weight } = useTokens();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return WORKFLOWS;
    return WORKFLOWS.filter(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q) ||
        w.cadence.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <CorpSecSideNavLayout>
      <Box sx={{ width: "100%", maxWidth: 1100, mx: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
        <Box>
          <TradAtlasText
            semanticFont={SF.titleH3Emphasis}
            sx={{ fontWeight: weight.semiBold, color: color.type.default }}
          >
            Select a Workflow
          </TradAtlasText>
          <TradAtlasText
            semanticFont={SF.textMd}
            sx={{ color: color.type.muted, mt: "4px" }}
          >
            Pick an agentic workflow to start. Each one collaborates with you
            through a guided journey — confirm decisions, review documents,
            and Diligent handles the rest.
          </TradAtlasText>
        </Box>

        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search workflows..."
        />

        {filtered.length === 0 ? (
          <Box
            sx={{
              p: "40px",
              textAlign: "center",
              border: `1px solid ${color.outline.fixed}`,
              borderRadius: "12px",
              background: color.surface.default,
            }}
          >
            <TradAtlasText
              semanticFont={SF.textMd}
              sx={{ color: color.type.muted }}
            >
              No workflows match "{query}".
            </TradAtlasText>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr",
                lg: "1fr 1fr 1fr 1fr",
              },
              gap: "16px",
            }}
          >
            {filtered.map((w) => (
              <WorkflowTile key={w.id} workflow={w} />
            ))}
          </Box>
        )}
      </Box>
    </CorpSecSideNavLayout>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────── */

function WorkflowTile({ workflow }: { workflow: WorkflowTileSpec }) {
  const { color, weight, radius } = useTokens();
  const available = Boolean(workflow.href);

  const cadenceColor =
    workflow.cadence === "Incident"
      ? color.status.error.text
      : workflow.cadence === "Strategic"
        ? color.action.primary.default
        : workflow.cadence === "Cyclical"
          ? color.status.success.text
          : color.type.muted;

  const tileSx = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    p: "20px",
    borderRadius: radius.lg,
    border: `1px solid ${color.outline.fixed}`,
    background: color.surface.default,
    textDecoration: "none",
    color: "inherit",
    cursor: available ? "pointer" : "default",
    transition:
      "border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease",
    "&:hover": available
      ? {
          borderColor: color.outline.hover,
          boxShadow: `0 1px 6px ${color.background.backdrop}`,
          transform: "translateY(-1px)",
        }
      : undefined,
  } as const;

  const inner = (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <Box
          aria-hidden
          sx={{
            width: 40,
            height: 40,
            borderRadius: radius.md,
            background: color.surface.variant,
            color: color.action.primary.default,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {workflow.icon}
        </Box>
        {available ? (
          <Box
            sx={{
              ...semanticFontStyle(SF.textMicroEmphasis),
              px: "8px",
              py: "3px",
              borderRadius: "6px",
              background: color.status.success.background,
              color: color.status.success.text,
              fontWeight: weight.semiBold,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontSize: "10px",
              flexShrink: 0,
            }}
          >
            Available
          </Box>
        ) : (
          <TradAtlasText
            semanticFont={SF.textMicroEmphasis}
            sx={{
              color: color.type.muted,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontSize: "10px",
              fontWeight: weight.semiBold,
            }}
          >
            Coming soon
          </TradAtlasText>
        )}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
        <TradAtlasText
          semanticFont={SF.textMdEmphasis}
          sx={{
            color: color.type.default,
            fontWeight: weight.semiBold,
            letterSpacing: "-0.005em",
          }}
        >
          {workflow.title}
        </TradAtlasText>
        <TradAtlasText
          semanticFont={SF.textSm}
          sx={{ color: color.type.muted, lineHeight: 1.45 }}
        >
          {workflow.description}
        </TradAtlasText>
      </Box>

      <TradAtlasText
        semanticFont={SF.textMicroEmphasis}
        sx={{
          color: cadenceColor,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontSize: "10px",
          fontWeight: weight.semiBold,
        }}
      >
        {workflow.cadence}
      </TradAtlasText>
    </>
  );

  if (available && workflow.href) {
    return (
      <Box component={RouterLink} to={workflow.href} sx={tileSx}>
        {inner}
      </Box>
    );
  }
  return (
    <Box
      role="button"
      aria-disabled
      sx={{ ...tileSx, opacity: 0.85 }}
      title="Coming soon"
    >
      {inner}
    </Box>
  );
}
