import { useState } from "react";
import { useNavigate } from "react-router";
import { Box, Typography, Chip, LinearProgress, IconButton, Divider } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import TrendingDownOutlinedIcon from "@mui/icons-material/TrendingDownOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DomainOutlinedIcon from "@mui/icons-material/DomainOutlined";
import { useDemo } from "../../DemoContext";
import { useTokens } from "../../hooks/useTokens";
import { ChatPrompt } from "../../components/ai";
import GlobalHeader from "./GlobalHeader";
import DemoControlsFab from "./DemoControlsFab";

function ContentCard({ children, sx }: { children: React.ReactNode; sx?: object }) {
  const { color, radius } = useTokens();
  return (
    <Box
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
  const navigate = useNavigate();
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
          <Typography
            sx={{
              fontSize: "15px",
              lineHeight: "22px",
              fontWeight: weight.bold,
              color: color.type.default,
            }}
          >
            {title}
          </Typography>
        </Box>
        <Chip
          label={severity}
          size="small"
          sx={{
            ...severityStyles,
            fontWeight: weight.semiBold,
            fontSize: "11px",
            height: 22,
            flexShrink: 0,
          }}
        />
      </Box>

      <Typography
        sx={{
          fontSize: "14px",
          lineHeight: "20px",
          color: color.type.muted,
        }}
      >
        {subtitle}
      </Typography>

      <Typography
        sx={{
          fontSize: "13px",
          lineHeight: "18px",
          color: color.type.muted,
          fontWeight: weight.medium,
        }}
      >
        {stats}
      </Typography>

      {actionLabel && (
        <Box>
          <Box
            component="button"
            onClick={actionHref ? () => navigate(actionHref) : undefined}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              px: "16px",
              py: "8px",
              borderRadius: radius.lg,
              border: "none",
              background: color.action.primary.default,
              color: color.action.primary.onPrimary,
              fontSize: "14px",
              fontWeight: weight.semiBold,
              cursor: "pointer",
              "&:hover": { background: color.action.primary.hover },
            }}
          >
            {actionLabel}
          </Box>
        </Box>
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
      <Typography
        sx={{
          fontSize: "20px",
          lineHeight: "28px",
          fontWeight: weight.bold,
          color: color.type.default,
        }}
      >
        All clear
      </Typography>
      <Typography
        sx={{
          fontSize: "14px",
          lineHeight: "22px",
          color: color.type.muted,
          maxWidth: 560,
        }}
      >
        All 47 entities in good standing, 3 filings due this month (all prepared), and 2 KYC requests in progress.
      </Typography>
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
          <Typography
            sx={{
              fontSize: "15px",
              lineHeight: "22px",
              fontWeight: weight.semiBold,
              color: color.type.default,
            }}
          >
            Entity portfolio at a glance
          </Typography>
          <Typography sx={{ fontSize: "13px", lineHeight: "16px", color: color.type.muted }}>
            Your corporate structure summary
          </Typography>
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
            <Typography
              sx={{
                fontSize: "28px",
                lineHeight: "36px",
                fontWeight: weight.bold,
                color: s.valueColor,
              }}
            >
              {s.value}
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                lineHeight: "16px",
                color: color.type.muted,
                fontWeight: weight.medium,
                mt: "4px",
              }}
            >
              {s.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </ContentCard>
  );
}

function ChatSection() {
  const [input, setInput] = useState("");
  const { color, weight, radius } = useTokens();

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
        <Typography
          sx={{
            fontSize: "18px",
            lineHeight: "28px",
            fontWeight: weight.semiBold,
            color: color.type.default,
          }}
        >
          What do you need to do?
        </Typography>
        <Chip
          icon={<Box sx={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a", ml: "8px !important" }} />}
          label="Demo"
          size="small"
          variant="outlined"
          sx={{
            borderColor: color.outline.fixed,
            color: color.type.default,
            fontWeight: weight.semiBold,
            fontSize: "12px",
          }}
        />
      </Box>
      <Typography
        sx={{
          fontSize: "14px",
          lineHeight: "20px",
          color: color.type.muted,
          mb: "16px",
        }}
      >
        Ask questions or choose an action below. Work entirely within Diligent.
      </Typography>

      <ChatPrompt
        value={input}
        onChange={setInput}
        onSend={() => setInput("")}
        canSend={input.trim().length > 0}
        placeholder="Ask a question or describe what you need..."
        maxWidth={9999}
      />

      <Typography
        sx={{
          fontSize: "13px",
          lineHeight: "16px",
          fontWeight: weight.semiBold,
          color: color.type.muted,
          mt: "16px",
          mb: "12px",
        }}
      >
        Or start with
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
          gap: "12px",
        }}
      >
        {suggestions.map((s) => (
          <Box
            key={s.label}
            component="button"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              p: "16px",
              borderRadius: radius.md,
              border: `1px solid ${color.outline.fixed}`,
              background: color.surface.subtle,
              cursor: "pointer",
              textAlign: "center",
              transition: "border-color 0.15s, box-shadow 0.15s",
              "&:hover": {
                borderColor: color.outline.hover,
                boxShadow: `0 1px 4px ${color.background.backdrop}`,
              },
            }}
          >
            <Box sx={{ color: color.type.muted }}>{s.icon}</Box>
            <Typography
              sx={{
                fontSize: "13px",
                lineHeight: "18px",
                fontWeight: weight.semiBold,
                color: color.type.default,
              }}
            >
              {s.label}
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                lineHeight: "16px",
                color: color.type.muted,
              }}
            >
              {s.description}
            </Typography>
          </Box>
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
        <Typography
          sx={{
            fontSize: "18px",
            lineHeight: "28px",
            fontWeight: weight.semiBold,
            color: color.type.default,
          }}
        >
          Entities requiring attention
        </Typography>
        <Typography
          sx={{
            fontSize: "13px",
            lineHeight: "16px",
            color: color.action.link.default,
            cursor: "pointer",
            fontWeight: weight.medium,
            "&:hover": { textDecoration: "underline" },
          }}
        >
          View all 47 entities →
        </Typography>
      </Box>

      <Typography sx={{ fontSize: "14px", lineHeight: "20px", color: color.type.muted, mb: "16px" }}>
        {flaggedEntities.length} entities flagged — 45 entities in good standing are not shown.
      </Typography>

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
            <Typography
              key={h}
              sx={{
                fontSize: "12px",
                lineHeight: "16px",
                fontWeight: weight.semiBold,
                color: color.type.muted,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {h}
            </Typography>
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
            <Typography
              sx={{
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: weight.medium,
                color: color.type.default,
              }}
            >
              {e.name}
            </Typography>
            <Typography sx={{ fontSize: "14px", lineHeight: "20px", color: color.type.muted }}>
              {e.jurisdiction}
            </Typography>
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
              <Typography sx={{ fontSize: "13px", lineHeight: "16px", color: color.type.default }}>
                {e.status}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: "13px", lineHeight: "18px", color: color.type.muted }}>
              {e.issue}
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                lineHeight: "20px",
                color: e.nextDeadline === "Overdue" ? color.status.error.text : color.type.muted,
                fontWeight: e.nextDeadline === "Overdue" ? weight.semiBold : weight.regular,
              }}
            >
              {e.nextDeadline}
            </Typography>
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
      <Typography
        sx={{
          fontSize: "18px",
          lineHeight: "28px",
          fontWeight: weight.semiBold,
          color: color.type.default,
          mb: "16px",
        }}
      >
        Agent activity
      </Typography>

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
                  <Typography sx={{ fontSize: "12px", color: color.type.muted, fontWeight: weight.medium }}>
                    {a.agent}
                  </Typography>
                  <Chip
                    label={a.status}
                    size="small"
                    sx={{
                      backgroundColor: a.statusColor,
                      color: "#fff",
                      fontWeight: weight.semiBold,
                      fontSize: "11px",
                      height: 20,
                    }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontSize: "15px",
                    lineHeight: "22px",
                    fontWeight: weight.semiBold,
                    color: color.type.default,
                  }}
                >
                  {a.title}
                </Typography>
              </Box>
              <IconButton size="small" sx={{ color: color.type.muted }}>
                <MoreHorizIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: "6px" }}>
                <Typography sx={{ fontSize: "13px", color: color.type.muted }}>
                  {a.step}
                </Typography>
                <Typography sx={{ fontSize: "12px", color: color.type.muted, fontWeight: weight.semiBold, flexShrink: 0, ml: "16px" }}>
                  {a.progress}%
                </Typography>
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

            <Typography sx={{ fontSize: "12px", color: color.type.muted }}>
              Updated {a.updated}
            </Typography>
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
        <Typography
          sx={{
            fontSize: "18px",
            lineHeight: "28px",
            fontWeight: weight.semiBold,
            color: color.type.default,
          }}
        >
          Proactive tasks
        </Typography>
        <Typography
          sx={{
            fontSize: "14px",
            lineHeight: "20px",
            color: color.type.muted,
            mt: "4px",
          }}
        >
          Optional work you can start when you're ready — nothing here is in progress.
        </Typography>
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
            <Typography
              sx={{
                fontSize: "15px",
                lineHeight: "22px",
                fontWeight: weight.semiBold,
                color: color.type.default,
              }}
            >
              {t.title}
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                lineHeight: "20px",
                color: color.type.muted,
              }}
            >
              {t.description}
            </Typography>
            <Box sx={{ display: "flex", gap: "8px", mt: "4px" }}>
              <Box
                component="button"
                sx={{
                  px: "14px",
                  py: "6px",
                  borderRadius: radius.md,
                  border: `1px solid ${color.outline.fixed}`,
                  background: color.surface.default,
                  color: color.type.default,
                  fontSize: "13px",
                  fontWeight: weight.semiBold,
                  cursor: "pointer",
                  "&:hover": { borderColor: color.outline.hover },
                }}
              >
                Learn more
              </Box>
              <Box
                component="button"
                sx={{
                  px: "14px",
                  py: "6px",
                  borderRadius: radius.md,
                  border: "none",
                  background: "transparent",
                  color: color.type.muted,
                  fontSize: "13px",
                  fontWeight: weight.medium,
                  cursor: "pointer",
                  "&:hover": { color: color.type.default },
                }}
              >
                Not now
              </Box>
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
      <Typography
        sx={{
          fontSize: "18px",
          lineHeight: "28px",
          fontWeight: weight.semiBold,
          color: color.type.default,
          mb: "16px",
        }}
      >
        Recent activity
      </Typography>

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
            <Typography sx={{ fontSize: "12px", fontWeight: weight.semiBold, color: color.type.default }}>
              {item.category}
            </Typography>
            <Typography sx={{ fontSize: "14px", lineHeight: "20px", color: color.type.muted, mt: "2px" }}>
              {item.text}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: "12px", color: color.type.muted, whiteSpace: "nowrap", flexShrink: 0 }}>
            {item.time}
          </Typography>
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
      <Typography
        sx={{
          fontSize: "18px",
          lineHeight: "28px",
          fontWeight: weight.semiBold,
          color: color.type.default,
          mb: "4px",
        }}
      >
        Key operational trends
      </Typography>
      <Typography
        sx={{
          fontSize: "14px",
          lineHeight: "20px",
          color: color.type.muted,
          mb: "16px",
        }}
      >
        Rolling 90-day view of governance operations across all entities (demo data).
      </Typography>

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
            <Typography
              sx={{
                fontSize: "13px",
                lineHeight: "16px",
                fontWeight: weight.semiBold,
                color: color.type.muted,
              }}
            >
              {t.label}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <Typography
                sx={{
                  fontSize: "28px",
                  lineHeight: "32px",
                  fontWeight: weight.bold,
                  color: color.type.default,
                }}
              >
                {t.value}
              </Typography>
              {miniChart(t.trend)}
            </Box>
            <Typography sx={{ fontSize: "12px", color: color.type.muted }}>
              {t.description}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {t.trend === "up" ? (
                <TrendingUpOutlinedIcon sx={{ fontSize: 16, color: color.status.success.default }} />
              ) : (
                <TrendingDownOutlinedIcon sx={{ fontSize: 16, color: color.status.error.default }} />
              )}
              <Typography
                sx={{
                  fontSize: "12px",
                  color: t.trend === "up" ? color.status.success.text : color.status.error.text,
                  fontWeight: weight.medium,
                }}
              >
                {t.trendLabel}
              </Typography>
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
      <Typography
        sx={{
          fontSize: "14px",
          lineHeight: "20px",
          fontWeight: weight.semiBold,
          color: color.type.default,
          mb: "4px",
        }}
      >
        System log
      </Typography>
      <Typography sx={{ fontSize: "12px", color: color.type.muted, mb: "12px" }}>
        Recent agent activity (last 24 hours)
      </Typography>
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
          fontFamily: '"SF Mono", "Fira Code", "Fira Mono", "Roboto Mono", monospace',
        }}
      >
        {logs.map((log, i) => (
          <Typography
            key={i}
            sx={{
              fontSize: "12px",
              lineHeight: "18px",
              color: color.type.muted,
              fontFamily: "inherit",
            }}
          >
            {log}
          </Typography>
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
