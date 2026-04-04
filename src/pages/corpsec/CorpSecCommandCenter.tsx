import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  LinearProgress,
  IconButton,
  Divider,
} from "@mui/material";
import { Link as RouterLink } from "react-router";
import {
  WarningAmberIcon,
  BoltOutlinedIcon,
  CheckCircleOutlineIcon,
  GroupsOutlinedIcon,
  BusinessOutlinedIcon,
  GavelOutlinedIcon,
  DescriptionOutlinedIcon,
  EventOutlinedIcon,
  TrendingUpOutlinedIcon,
  TrendingDownOutlinedIcon,
  AutoAwesomeOutlinedIcon,
  AccountTreeOutlinedIcon,
  MoreHorizIcon,
  DomainOutlinedIcon,
} from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import { DATA_SEMANTIC_FONT, SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useDemo } from "../../DemoContext";
import { useTokens } from "../../hooks/useTokens";
import { ChatPrompt } from "../../components/ai";
import GlobalHeader from "./GlobalHeader";
import DemoControlsFab from "./DemoControlsFab";

function ContentCard({ children, sx }: { children: React.ReactNode; sx?: object }) {
  const { color, radius } = useTokens();
  return (
    <Box
      data-atlas-component="ContentCard"
      data-atlas-variant="surface - card - lg"
      sx={{
        borderRadius: radius.lg,
        border: `1px solid ${color.outline.fixed}`,
        background: color.surface.default,
        p: "24px",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

function IncidentTile({
  icon,
  title,
  severity,
  severityVariant,
  subtitle,
  stats,
  actionLabel,
  actionHref,
}: {
  icon: React.ReactNode;
  title: string;
  severity: string;
  severityVariant: "critical" | "high";
  subtitle: string;
  stats: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  const { color, weight, radius } = useTokens();

  const severityStyles =
    severityVariant === "critical"
      ? {
          backgroundColor: color.status.error.default,
          color: "#fff",
          border: "none",
        }
      : {
          backgroundColor: "transparent",
          color: color.type.default,
          border: `1px solid ${color.outline.default}`,
        };

  return (
    <Box
      data-atlas-component="IncidentTile"
      data-atlas-variant={`surface - incident - ${severityVariant}`}
      sx={{
        flex: 1,
        minWidth: 0,
        borderRadius: radius.lg,
        border: `1px solid ${color.outline.fixed}`,
        background: color.surface.default,
        p: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
          {icon}
          <TradAtlasText
            semanticFont={SF.bodyLead}
            sx={{ fontWeight: weight.bold, color: color.type.default }}
          >
            {title}
          </TradAtlasText>
        </Box>
        <Chip
          label={severity}
          size="small"
          slotProps={{ label: { [DATA_SEMANTIC_FONT]: SF.textMicro } as React.HTMLAttributes<HTMLSpanElement> }}
          sx={{
            ...severityStyles,
            fontWeight: weight.semiBold,
            height: 22,
            flexShrink: 0,
            ...semanticFontStyle(SF.textMicro),
          }}
        />
      </Box>

      <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
        {subtitle}
      </TradAtlasText>

      <TradAtlasText semanticFont={SF.labelMdRelaxed} sx={{ color: color.type.muted, fontWeight: weight.medium }}>
        {stats}
      </TradAtlasText>

      {actionLabel && actionHref && (
        <Button
          variant="contained"
          color="primary"
          size="medium"
          component={RouterLink}
          to={actionHref}
          data-atlas-component="Button"
          data-atlas-variant="primary - md"
          sx={{
            ...semanticFontStyle(SF.actionLabelPrimary),
            textTransform: "none",
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}

function HeroBanner() {
  const { hasAlerts } = useDemo();
  const { color, radius, weight } = useTokens();

  if (hasAlerts) {
    return (
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <IncidentTile
          icon={<WarningAmberIcon sx={{ color: color.status.error.default, fontSize: 22 }} />}
          title="Subsidiary director resignation"
          severity="CRITICAL"
          severityVariant="critical"
          subtitle="Workday alert — David Chen has resigned from Pacific Polymer Logistics Pte. Ltd. (Singapore). Last day in 14 days."
          stats="ACRA filing required · Replacement needed · Board approval required"
          actionLabel="Investigate"
          actionHref="/corpsec/appointment"
        />
        <IncidentTile
          icon={<BoltOutlinedIcon sx={{ color: color.status.warning.text, fontSize: 22 }} />}
          title="Filing compliance gap"
          severity="HIGH"
          severityVariant="high"
          subtitle="Zenith Compliance Services (Ireland) annual return past due"
          stats="2 days overdue    Penalty risk    CRO filing"
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        border: `1px solid ${color.outline.fixed}`,
        borderRadius: radius.lg,
        background: color.surface.default,
        py: "48px",
        px: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "12px",
      }}
    >
      <CheckCircleOutlineIcon sx={{ color: color.type.disabled, fontSize: 48 }} />
      <TradAtlasText semanticFont={SF.titleMdEmphasis} sx={{ fontWeight: weight.bold, color: color.type.default }}>
        All clear
      </TradAtlasText>
      <TradAtlasText semanticFont={SF.textMdLoose} sx={{ color: color.type.muted, maxWidth: 560 }}>
        All 47 entities in good standing, 3 filings due this month (all prepared), and 2 KYC requests in progress.
      </TradAtlasText>
    </Box>
  );
}


function EntityPortfolio() {
  const { color, weight, radius } = useTokens();

  const stats = [
    { value: "47", label: "Total entities", valueColor: color.action.primary.default },
    { value: "12", label: "Jurisdictions", valueColor: color.action.primary.default },
    { value: "3", label: "Filings due", valueColor: color.status.success.text },
    { value: "47", label: "Good standing", valueColor: color.status.success.text },
    { value: "2", label: "Updates needed", valueColor: color.status.error.text },
  ];

  return (
    <ContentCard>
      <Box sx={{ display: "flex", alignItems: "center", gap: "12px", mb: "20px" }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: radius.md,
            background: color.surface.variant,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: color.action.primary.default,
          }}
        >
          <DomainOutlinedIcon sx={{ fontSize: 20 }} />
        </Box>
        <Box>
          <TradAtlasText semanticFont={SF.bodyLeadEmphasis} sx={{ color: color.type.default }}>
            Entity portfolio at a glance
          </TradAtlasText>
          <TradAtlasText semanticFont={SF.labelMdCompact} sx={{ color: color.type.muted }}>
            Your corporate structure summary
          </TradAtlasText>
        </Box>
      </Box>

      <Divider sx={{ borderColor: color.outline.fixed, mb: "20px" }} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "16px",
          textAlign: "center",
        }}
      >
        {stats.map((s) => (
          <Box key={s.label}>
            <TradAtlasText semanticFont={SF.titleStatEmphasis} sx={{ fontWeight: weight.bold, color: s.valueColor }}>
              {s.value}
            </TradAtlasText>
            <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted, fontWeight: weight.medium, mt: "4px" }}>
              {s.label}
            </TradAtlasText>
          </Box>
        ))}
      </Box>
    </ContentCard>
  );
}

function ChatSection() {
  const [input, setInput] = useState("");
  const { color, weight } = useTokens();

  const suggestions = [
    {
      label: "Start board appointment workflow",
      description: "Appoint a subsidiary director end to end",
      icon: <GroupsOutlinedIcon sx={{ fontSize: 20 }} />,
    },
    {
      label: "Draft board briefing",
      description: "Board and committee meeting summaries",
      icon: <DescriptionOutlinedIcon sx={{ fontSize: 20 }} />,
    },
    {
      label: "Run entity compliance check",
      description: "Filings, licenses, and director requirements",
      icon: <BusinessOutlinedIcon sx={{ fontSize: 20 }} />,
    },
    {
      label: "Prepare board pack",
      description: "Assemble and review meeting materials",
      icon: <AccountTreeOutlinedIcon sx={{ fontSize: 20 }} />,
    },
    {
      label: "Review governance policies",
      description: "Policy refresh and gap analysis",
      icon: <GavelOutlinedIcon sx={{ fontSize: 20 }} />,
    },
    {
      label: "Search corporate records",
      description: "Minutes, resolutions, and charters",
      icon: <DescriptionOutlinedIcon sx={{ fontSize: 20 }} />,
    },
  ];

  return (
    <ContentCard>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: "4px" }}>
        <TradAtlasText semanticFont={SF.titleH4Emphasis} sx={{ fontWeight: weight.semiBold, color: color.type.default }}>
          What do you need to do?
        </TradAtlasText>
        <Chip
          icon={<Box sx={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a", ml: "8px !important" }} />}
          label="Demo"
          size="small"
          variant="outlined"
          slotProps={{ label: { [DATA_SEMANTIC_FONT]: SF.textSm } as React.HTMLAttributes<HTMLSpanElement> }}
          sx={{
            borderColor: color.outline.fixed,
            color: color.type.default,
            fontWeight: weight.semiBold,
            ...semanticFontStyle(SF.textSm),
          }}
        />
      </Box>
      <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted, mb: "16px" }}>
        Ask questions or choose an action below. Work entirely within Diligent.
      </TradAtlasText>

      <ChatPrompt
        value={input}
        onChange={setInput}
        onSend={() => setInput("")}
        canSend={input.trim().length > 0}
        placeholder="Ask a question or describe what you need..."
        maxWidth={9999}
      />

      <TradAtlasText
        semanticFont={SF.labelMdCompact}
        sx={{ fontWeight: weight.semiBold, color: color.type.muted, mt: "16px", mb: "12px" }}
      >
        Or start with
      </TradAtlasText>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
          gap: "12px",
        }}
      >
        {suggestions.map((s) => (
          <Button
            key={s.label}
            variant="outlined"
            color="inherit"
            size="large"
            data-atlas-component="Button"
            data-atlas-variant="outlined - secondary - lg"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              p: "16px",
              height: "auto",
              textAlign: "center",
              textTransform: "none",
              borderColor: color.outline.fixed,
              background: color.surface.subtle,
              transition: "border-color 0.15s, box-shadow 0.15s",
              "&:hover": {
                borderColor: color.outline.hover,
                boxShadow: `0 1px 4px ${color.background.backdrop}`,
                background: color.surface.subtle,
              },
            }}
          >
            <Box sx={{ color: color.type.muted }}>{s.icon}</Box>
            <TradAtlasText
              component="span"
              semanticFont={SF.labelMdRelaxed}
              sx={{ fontWeight: weight.semiBold, color: color.type.default }}
            >
              {s.label}
            </TradAtlasText>
            <TradAtlasText component="span" semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
              {s.description}
            </TradAtlasText>
          </Button>
        ))}
      </Box>
    </ContentCard>
  );
}

function EntityStatusSummary() {
  const { color, weight, radius } = useTokens();

  const flaggedEntities = [
    { name: "Aether Holdings Ltd", jurisdiction: "England & Wales", status: "Action required", statusColor: color.status.error.default, issue: "Director vacancy — appointment overdue", nextDeadline: "Apr 8" },
    { name: "Zenith Compliance Services", jurisdiction: "Ireland", status: "Filing overdue", statusColor: color.status.error.default, issue: "Annual return past due by 2 days", nextDeadline: "Overdue" },
  ];

  return (
    <ContentCard>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: "16px" }}>
        <TradAtlasText semanticFont={SF.titleH4Emphasis} sx={{ fontWeight: weight.semiBold, color: color.type.default }}>
          Entities requiring attention
        </TradAtlasText>
        <Box
          component="span"
          {...{ [DATA_SEMANTIC_FONT]: SF.labelMdCompact }}
          sx={{
            ...semanticFontStyle(SF.labelMdCompact),
            color: color.action.link.default,
            cursor: "pointer",
            fontWeight: weight.medium,
            "&:hover": { textDecoration: "underline" },
          }}
        >
          View all 47 entities →
        </Box>
      </Box>

      <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted, mb: "16px" }}>
        {flaggedEntities.length} entities flagged — 45 entities in good standing are not shown.
      </TradAtlasText>

      <Box
        sx={{
          borderRadius: radius.md,
          border: `1px solid ${color.outline.fixed}`,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1.8fr 1.2fr 1.2fr 1.5fr 0.8fr",
            px: "20px",
            py: "10px",
            borderBottom: `1px solid ${color.outline.fixed}`,
            background: color.surface.subtle,
          }}
        >
          {["Entity", "Jurisdiction", "Status", "Issue", "Deadline"].map((h) => (
            <TradAtlasText
              key={h}
              semanticFont={SF.textMicroEmphasis}
              sx={{
                fontWeight: weight.semiBold,
                color: color.type.muted,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {h}
            </TradAtlasText>
          ))}
        </Box>

        {flaggedEntities.map((e, i) => (
          <Box
            key={e.name}
            sx={{
              display: "grid",
              gridTemplateColumns: "1.8fr 1.2fr 1.2fr 1.5fr 0.8fr",
              px: "20px",
              py: "12px",
              borderBottom: i < flaggedEntities.length - 1 ? `1px solid ${color.outline.fixed}` : "none",
              alignItems: "center",
              "&:hover": { background: color.surface.subtle },
            }}
          >
            <TradAtlasText semanticFont={SF.textMd} sx={{ fontWeight: weight.medium, color: color.type.default }}>
              {e.name}
            </TradAtlasText>
            <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
              {e.jurisdiction}
            </TradAtlasText>
            <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: e.statusColor,
                  flexShrink: 0,
                }}
              />
              <TradAtlasText semanticFont={SF.labelMdCompact} sx={{ color: color.type.default }}>
                {e.status}
              </TradAtlasText>
            </Box>
            <TradAtlasText semanticFont={SF.labelMdRelaxed} sx={{ color: color.type.muted }}>
              {e.issue}
            </TradAtlasText>
            <TradAtlasText
              semanticFont={SF.textMd}
              sx={{
                color: e.nextDeadline === "Overdue" ? color.status.error.text : color.type.muted,
                fontWeight: e.nextDeadline === "Overdue" ? weight.semiBold : weight.regular,
              }}
            >
              {e.nextDeadline}
            </TradAtlasText>
          </Box>
        ))}
      </Box>
    </ContentCard>
  );
}

function AgentActivity() {
  const { color, weight, radius } = useTokens();

  const activities = [
    {
      title: "Subsidiary director appointment — Aether Holdings Ltd",
      agent: "Board appointment agent",
      status: "In progress",
      statusColor: color.action.primary.default,
      progress: 35,
      step: "Eligibility screening: reviewing candidate qualifications and conflict-of-interest declarations",
      updated: "12 min ago",
    },
    {
      title: "Q2 board pack assembly — Meridian Corp",
      agent: "Board meeting prep agent",
      status: "In progress",
      statusColor: color.action.primary.default,
      progress: 72,
      step: "Collecting committee reports from audit and risk chairs",
      updated: "28 min ago",
    },
    {
      title: "Annual return filing — Zenith Compliance Services",
      agent: "Filing deadline agent",
      status: "Awaiting review",
      statusColor: color.status.warning.default,
      progress: 90,
      step: "Draft filing prepared — pending your review before submission to CRO",
      updated: "1 hr ago",
    },
  ];

  return (
    <ContentCard>
      <TradAtlasText semanticFont={SF.titleH4Emphasis} sx={{ fontWeight: weight.semiBold, color: color.type.default, mb: "16px" }}>
        Agent activity
      </TradAtlasText>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {activities.map((a) => (
          <Box
            key={a.title}
            sx={{
              borderRadius: radius.md,
              border: `1px solid ${color.outline.fixed}`,
              background: color.surface.subtle,
              p: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "4px" }}>
                  <AutoAwesomeOutlinedIcon sx={{ fontSize: 16, color: color.action.primary.default }} />
                  <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted, fontWeight: weight.medium }}>
                    {a.agent}
                  </TradAtlasText>
                  <Chip
                    label={a.status}
                    size="small"
                    slotProps={{ label: { [DATA_SEMANTIC_FONT]: SF.textMicro } as React.HTMLAttributes<HTMLSpanElement> }}
                    sx={{
                      backgroundColor: a.statusColor,
                      color: "#fff",
                      fontWeight: weight.semiBold,
                      height: 20,
                      ...semanticFontStyle(SF.textMicro),
                    }}
                  />
                </Box>
                <TradAtlasText semanticFont={SF.bodyLeadEmphasis} sx={{ color: color.type.default }}>
                  {a.title}
                </TradAtlasText>
              </Box>
              <IconButton size="small" sx={{ color: color.type.muted }}>
                <MoreHorizIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: "6px" }}>
                <TradAtlasText semanticFont={SF.labelMd} sx={{ color: color.type.muted }}>
                  {a.step}
                </TradAtlasText>
                <TradAtlasText
                  semanticFont={SF.textSm}
                  sx={{ color: color.type.muted, fontWeight: weight.semiBold, flexShrink: 0, ml: "16px" }}
                >
                  {a.progress}%
                </TradAtlasText>
              </Box>
              <LinearProgress
                variant="determinate"
                value={a.progress}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: color.outline.fixed,
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: a.statusColor,
                    borderRadius: 2,
                  },
                }}
              />
            </Box>

            <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
              Updated {a.updated}
            </TradAtlasText>
          </Box>
        ))}
      </Box>
    </ContentCard>
  );
}

function ProactiveTasks() {
  const { color, weight, radius } = useTokens();

  const tasks = [
    {
      title: "Prepare for subsidiary board appointments",
      description: "Review the skills matrix and succession plan for Aether Holdings Ltd. Identify qualified candidates, verify eligibility against articles of association, and prepare appointment documentation for the nominations committee.",
    },
    {
      title: "Quarterly governance policy review",
      description: "Compare current board governance policy, code of conduct, and delegation of authority documents against recent regulatory guidance and industry best practices. Flag any gaps for the governance committee.",
    },
    {
      title: "Board evaluation follow-up",
      description: "Compile outstanding action items from the most recent board and committee self-assessments. Draft a progress summary for the chair and identify any items at risk of slipping.",
    },
    {
      title: "Entity structure simplification review",
      description: "Analyse the group structure for dormant or redundant subsidiaries that could be dissolved or merged. Prepare a cost-benefit summary and regulatory impact assessment for leadership review.",
    },
  ];

  return (
    <ContentCard>
      <Box sx={{ mb: "16px" }}>
        <TradAtlasText semanticFont={SF.titleH4Emphasis} sx={{ fontWeight: weight.semiBold, color: color.type.default }}>
          Proactive tasks
        </TradAtlasText>
        <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted, mt: "4px" }}>
          Optional work you can start when you're ready — nothing here is in progress.
        </TradAtlasText>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: "12px" }}>
        {tasks.map((t) => (
          <Box
            key={t.title}
            sx={{
              borderRadius: radius.md,
              border: `1px solid ${color.outline.fixed}`,
              background: color.surface.subtle,
              p: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <TradAtlasText semanticFont={SF.bodyLeadEmphasis} sx={{ color: color.type.default }}>
              {t.title}
            </TradAtlasText>
            <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
              {t.description}
            </TradAtlasText>
            <Box sx={{ display: "flex", gap: "8px", mt: "4px" }}>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                data-atlas-component="Button"
                data-atlas-variant="outlined - secondary - sm"
                sx={{
                  ...semanticFontStyle(SF.labelMd),
                  px: "14px",
                  py: "6px",
                  textTransform: "none",
                  borderColor: color.outline.fixed,
                  fontWeight: weight.semiBold,
                  "&:hover": { borderColor: color.outline.hover },
                }}
              >
                Learn more
              </Button>
              <Button
                variant="text"
                color="inherit"
                size="small"
                data-atlas-component="Button"
                data-atlas-variant="text - tertiary - sm"
                sx={{
                  ...semanticFontStyle(SF.labelMd),
                  px: "14px",
                  py: "6px",
                  textTransform: "none",
                  color: color.type.muted,
                  fontWeight: weight.medium,
                  "&:hover": { color: color.type.default },
                }}
              >
                Not now
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </ContentCard>
  );
}

function RecentActivity() {
  const { color, weight, radius } = useTokens();

  const items = [
    { category: "Board meeting", text: "Q2 board meeting agenda approved by chair", time: "2 hours ago", icon: <EventOutlinedIcon sx={{ fontSize: 18 }} /> },
    { category: "Entity management", text: "Meridian Asia Pacific Pte annual return filed with ACRA", time: "5 hours ago", icon: <BusinessOutlinedIcon sx={{ fontSize: 18 }} /> },
    { category: "Governance", text: "Updated delegation of authority policy uploaded for board review", time: "1 day ago", icon: <GavelOutlinedIcon sx={{ fontSize: 18 }} /> },
    { category: "Board appointment", text: "Director candidate shortlist reviewed by nominations committee", time: "2 days ago", icon: <GroupsOutlinedIcon sx={{ fontSize: 18 }} /> },
  ];

  return (
    <ContentCard sx={{ flex: 1 }}>
      <TradAtlasText semanticFont={SF.titleH4Emphasis} sx={{ fontWeight: weight.semiBold, color: color.type.default, mb: "16px" }}>
        Recent activity
      </TradAtlasText>

      {items.map((item, i) => (
        <Box
          key={item.text}
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            py: "12px",
            borderBottom: i < items.length - 1 ? `1px solid ${color.outline.fixed}` : "none",
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: radius.sm,
              background: color.surface.variant,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: color.type.muted,
              flexShrink: 0,
              mt: "2px",
            }}
          >
            {item.icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <TradAtlasText semanticFont={SF.textSm} sx={{ fontWeight: weight.semiBold, color: color.type.default }}>
              {item.category}
            </TradAtlasText>
            <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted, mt: "2px" }}>
              {item.text}
            </TradAtlasText>
          </Box>
          <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted, whiteSpace: "nowrap", flexShrink: 0 }}>
            {item.time}
          </TradAtlasText>
        </Box>
      ))}
    </ContentCard>
  );
}

function OperationalTrends() {
  const { color, weight, radius } = useTokens();

  const trends = [
    {
      label: "Filings on time",
      value: "96%",
      description: "Entity filings submitted before deadline — rolling 90 days.",
      trend: "up" as const,
      trendLabel: "+4% vs prior quarter",
    },
    {
      label: "Board pack completion",
      value: "87%",
      description: "Percentage of board packs fully assembled 5+ days before meeting.",
      trend: "down" as const,
      trendLabel: "-3% vs prior quarter",
    },
    {
      label: "Open action items",
      value: "12",
      description: "Outstanding board and committee action items awaiting resolution.",
      trend: "down" as const,
      trendLabel: "+2 since last meeting",
    },
  ];

  const miniChart = (trend: "up" | "down") => {
    const points = trend === "up"
      ? "0,20 15,18 30,15 45,16 60,12 75,8 90,5 105,3 120,2"
      : "0,5 15,4 30,8 45,6 60,10 75,14 90,16 105,15 120,18";
    const lineColor = trend === "up" ? color.status.success.default : color.status.error.default;

    return (
      <svg width="120" height="24" viewBox="0 0 120 24" fill="none">
        <polyline
          points={points}
          fill="none"
          stroke={lineColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <ContentCard>
      <TradAtlasText semanticFont={SF.titleH4Emphasis} sx={{ fontWeight: weight.semiBold, color: color.type.default, mb: "4px" }}>
        Key operational trends
      </TradAtlasText>
      <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted, mb: "16px" }}>
        Rolling 90-day view of governance operations across all entities (demo data).
      </TradAtlasText>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          gap: "12px",
        }}
      >
        {trends.map((t) => (
          <Box
            key={t.label}
            sx={{
              borderRadius: radius.md,
              border: `1px solid ${color.outline.fixed}`,
              background: color.surface.subtle,
              p: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <TradAtlasText semanticFont={SF.labelMdCompact} sx={{ fontWeight: weight.semiBold, color: color.type.muted }}>
              {t.label}
            </TradAtlasText>
            <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <TradAtlasText semanticFont={SF.titleStatTightEmphasis} sx={{ fontWeight: weight.bold, color: color.type.default }}>
                {t.value}
              </TradAtlasText>
              {miniChart(t.trend)}
            </Box>
            <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
              {t.description}
            </TradAtlasText>
            <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {t.trend === "up" ? (
                <TrendingUpOutlinedIcon sx={{ fontSize: 16, color: color.status.success.default }} />
              ) : (
                <TrendingDownOutlinedIcon sx={{ fontSize: 16, color: color.status.error.default }} />
              )}
              <TradAtlasText
                semanticFont={SF.textSm}
                sx={{
                  color: t.trend === "up" ? color.status.success.text : color.status.error.text,
                  fontWeight: weight.medium,
                }}
              >
                {t.trendLabel}
              </TradAtlasText>
            </Box>
          </Box>
        ))}
      </Box>
    </ContentCard>
  );
}

function SystemLog() {
  const { color, weight, radius } = useTokens();

  const logs = [
    "Entity compliance monitor: Quarterly compliance scan completed — 2 entities flagged for follow-up, 12 entities current.",
    "Board calendar tracker: Confirmed quorum availability for Q2 Meridian Corp board meeting on April 18.",
    "Filing deadline scanner: Zenith Compliance Services (Ireland) annual return draft prepared and staged for review.",
    "Board appointment agent: Skills matrix comparison complete for Aether Holdings Ltd director vacancy — 3 candidates meet criteria.",
    "Entity compliance monitor: NovaBridge Capital GmbH Handelsregister filing verified and archived.",
  ];

  return (
    <ContentCard>
      <TradAtlasText semanticFont={SF.textMd} sx={{ fontWeight: weight.semiBold, color: color.type.default, mb: "4px" }}>
        System log
      </TradAtlasText>
      <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted, mb: "12px" }}>
        Recent agent activity (last 24 hours)
      </TradAtlasText>
      <Box
        sx={{
          borderRadius: radius.md,
          border: `1px solid ${color.outline.fixed}`,
          background: color.surface.subtle,
          p: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          maxHeight: 200,
          overflow: "auto",
        }}
      >
        {logs.map((log, i) => (
          <TradAtlasText key={i} semanticFont={SF.codeSm} sx={{ color: color.type.muted }}>
            {log}
          </TradAtlasText>
        ))}
      </Box>
    </ContentCard>
  );
}

export default function CorpSecCommandCenter() {
  const { color } = useTokens();

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        background: color.surface.variant,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <GlobalHeader />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: "24px",
          py: "32px",
        }}
      >
        <Box
          sx={{
            maxWidth: 960,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <HeroBanner />
          <EntityPortfolio />
          <ChatSection />
          <EntityStatusSummary />
          <AgentActivity />
          <ProactiveTasks />
          <OperationalTrends />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: "24px",
            }}
          >
            <RecentActivity />
            <SystemLog />
          </Box>
        </Box>
      </Box>

      <DemoControlsFab />
    </Box>
  );
}
