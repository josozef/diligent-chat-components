import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import { Link, Link as RouterLink } from "react-router";
import {
  CheckCircleOutlineIcon,
  FactCheckOutlinedIcon,
  AssessmentOutlinedIcon,
  SearchOutlinedIcon,
  BuildOutlinedIcon,
  TrendingUpOutlinedIcon,
  TrendingDownOutlinedIcon,
  AutoAwesomeOutlinedIcon,
  MoreHorizIcon,
  AppsIcon,
  HelpOutlineIcon,
  SettingsOutlinedIcon,
  AccountCircleOutlinedIcon,
  TaskAltOutlinedIcon,
  AccountTreeOutlinedIcon,
  SummarizeOutlinedIcon,
} from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import { DATA_SEMANTIC_FONT, SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { atlasFontFamilyMono } from "@/tokens/atlasLight";
import { useDemo } from "../../DemoContext";
import { useTokens } from "../../hooks/useTokens";
import { ChatPrompt } from "../../components/ai";
import ContentCard from "@/components/common/ContentCard";
import PulsingStatusDot from "@/components/common/PulsingStatusDot";
import type { PulsingStatusTone } from "@/components/common/PulsingStatusDot";
import DemoControlsFab from "../corpsec/DemoControlsFab";

/* ─── GlobalHeader (Audit variant) ─────────────────────────────────────────── */

function GlobalHeader() {
  const { color, radius, weight } = useTokens();
  const [appMenuAnchor, setAppMenuAnchor] = useState<HTMLElement | null>(null);

  return (
    <Box
      sx={{
        height: 56,
        px: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `1px solid ${color.outline.fixed}`,
        background: color.surface.default,
        flexShrink: 0,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          <Box
            {...{ [DATA_SEMANTIC_FONT]: SF.textMdEmphasis }}
            sx={{
              width: 32,
              height: 32,
              borderRadius: radius.sm,
              background: "#16a34a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              ...semanticFontStyle(SF.textMdEmphasis),
              fontWeight: weight.bold,
              boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            }}
          >
            A
          </Box>
        </Link>

        <Divider orientation="vertical" flexItem sx={{ borderColor: color.outline.fixed }} />

        <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default }}>
          Acme Co, Inc.
        </TradAtlasText>

        <Divider orientation="vertical" flexItem sx={{ borderColor: color.outline.fixed }} />

        <IconButton
          onClick={(e) => setAppMenuAnchor(e.currentTarget)}
          sx={{ color: color.type.default }}
          size="small"
        >
          <AppsIcon fontSize="small" />
        </IconButton>

        <Menu
          anchorEl={appMenuAnchor}
          open={Boolean(appMenuAnchor)}
          onClose={() => setAppMenuAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          slotProps={{
            paper: {
              sx: {
                background: color.surface.default,
                border: `1px solid ${color.outline.fixed}`,
                borderRadius: radius.md,
              },
            },
          }}
        >
          <MenuItem onClick={() => setAppMenuAnchor(null)}>
            <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
              Corporate secretary
            </TradAtlasText>
          </MenuItem>
          <MenuItem onClick={() => setAppMenuAnchor(null)}>
            <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
              CISO / IT Risk
            </TradAtlasText>
          </MenuItem>
          <MenuItem sx={{ gap: "8px" }}>
            <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default }}>
              Internal audit
            </TradAtlasText>
            <TradAtlasText semanticFont={SF.textMicroEmphasis} sx={{ color: color.action.primary.default }}>
              Current
            </TradAtlasText>
          </MenuItem>
          <MenuItem onClick={() => setAppMenuAnchor(null)}>
            <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
              Compliance
            </TradAtlasText>
          </MenuItem>
        </Menu>

        <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted, fontWeight: weight.medium }}>
          Internal Audit Command Center
        </TradAtlasText>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={0.5}>
        <IconButton size="small" sx={{ color: color.type.muted }}>
          <HelpOutlineIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" sx={{ color: color.type.muted }}>
          <SettingsOutlinedIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" sx={{ color: color.type.muted }}>
          <AccountCircleOutlinedIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  );
}

/* ─── IncidentTile ─────────────────────────────────────────────────────────── */

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
            semanticFont={SF.textMd}
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

      <TradAtlasText semanticFont={SF.labelMd} sx={{ color: color.type.muted, fontWeight: weight.medium }}>
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
            alignSelf: "flex-start",
            ...semanticFontStyle(SF.textMdEmphasis),
            textTransform: "none",
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}

/* ─── HeroBanner ───────────────────────────────────────────────────────────── */

function HeroBanner() {
  const { hasAlerts } = useDemo();
  const { color, radius, weight } = useTokens();

  if (hasAlerts) {
    return (
      <Box sx={{ display: "flex", gap: "16px", flexDirection: { xs: "column", md: "row" } }}>
        <IncidentTile
          icon={<FactCheckOutlinedIcon sx={{ color: color.action.primary.default, fontSize: 22 }} />}
          title="Stakeholder assurance report request"
          severity="ACTION"
          severityVariant="high"
          subtitle="Thomas Chen asked you to assess cybersecurity control posture and SEC disclosure readiness before Thursday's Audit Committee meeting."
          stats="Requested by Thomas Chen · Audit Committee · Thursday"
          actionLabel="Review"
          actionHref="/audit/assurance"
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
      <TradAtlasText semanticFont={SF.titleH4Emphasis} sx={{ fontWeight: weight.bold, color: color.type.default }}>
        All clear
      </TradAtlasText>
      <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted, maxWidth: 560 }}>
        All 24 planned audits on track, no overdue remediation items, and the audit committee pack for Q2 is on schedule.
      </TradAtlasText>
    </Box>
  );
}

/* ─── AuditPosture ─────────────────────────────────────────────────────────── */

function AuditPosture() {
  const { color, weight, radius } = useTokens();

  const stats = [
    { value: "24", label: "Planned audits", valueColor: color.action.primary.default },
    { value: "18", label: "Completed", valueColor: color.status.success.text },
    { value: "42", label: "Open issues", valueColor: color.status.warning.text },
    { value: "87%", label: "Remediation rate", valueColor: color.status.success.text },
    { value: "6", label: "Overdue items", valueColor: color.status.error.text },
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
          <FactCheckOutlinedIcon sx={{ fontSize: 20 }} />
        </Box>
        <Box>
          <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default }}>
            Audit program at a glance
          </TradAtlasText>
          <TradAtlasText semanticFont={SF.labelMdCompact} sx={{ color: color.type.muted }}>
            FY 2026 audit plan and issue summary
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
            <TradAtlasText semanticFont={SF.titleH2Emphasis} sx={{ fontWeight: weight.bold, color: s.valueColor }}>
              {s.value}
            </TradAtlasText>
            <TradAtlasText semanticFont={SF.textSmUppercase} sx={{ color: color.type.muted, mt: "4px" }}>
              {s.label}
            </TradAtlasText>
          </Box>
        ))}
      </Box>
    </ContentCard>
  );
}

/* ─── ChatSection ──────────────────────────────────────────────────────────── */

function ChatSection() {
  const [input, setInput] = useState("");
  const { color, weight } = useTokens();

  const suggestions = [
    {
      label: "Start control assessment",
      description: "Test controls against frameworks",
      icon: <FactCheckOutlinedIcon sx={{ fontSize: 20 }} />,
    },
    {
      label: "Draft committee report",
      description: "Audit committee pack preparation",
      icon: <SummarizeOutlinedIcon sx={{ fontSize: 20 }} />,
    },
    {
      label: "Run risk coverage analysis",
      description: "Map audits to enterprise risks",
      icon: <AssessmentOutlinedIcon sx={{ fontSize: 20 }} />,
    },
    {
      label: "Search audit workpapers",
      description: "Evidence and documentation lookup",
      icon: <SearchOutlinedIcon sx={{ fontSize: 20 }} />,
    },
    {
      label: "Track remediation status",
      description: "Issue resolution and validation",
      icon: <BuildOutlinedIcon sx={{ fontSize: 20 }} />,
    },
    {
      label: "Generate assurance map",
      description: "Lines of defense coverage view",
      icon: <AccountTreeOutlinedIcon sx={{ fontSize: 20 }} />,
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
        density="relaxed"
      />

      <TradAtlasText
        semanticFont={SF.textMdUppercase}
        sx={{ color: color.type.muted, mt: "16px", mb: "12px" }}
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
              semanticFont={SF.labelMd}
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

/* ─── ActiveAuditEngagements ─────────────────────────────────────────────────── */

function ActiveAuditEngagements() {
  const { color, weight, radius } = useTokens();

  const engagements = [
    {
      name: "IT general controls — access & change",
      linkedTo: "ERM-IT-014 · Top enterprise risk",
      status: "Fieldwork",
      statusColor: color.action.primary.default,
      openIssues: "4",
      scope: "3 regions",
    },
    {
      name: "Third-party vendor assurance",
      linkedTo: "Audit plan · Supply chain",
      status: "Fieldwork",
      statusColor: color.action.primary.default,
      openIssues: "1",
      scope: "8 vendors",
    },
    {
      name: "Revenue recognition — Q2 close",
      linkedTo: "FIN-RISK-08 · Financial reporting",
      status: "Reporting",
      statusColor: color.status.success.default,
      openIssues: "2",
      scope: "5 entities",
    },
    {
      name: "SOX IT controls testing",
      linkedTo: "SOX 404 program",
      status: "Fieldwork",
      statusColor: color.action.primary.default,
      openIssues: "0",
      scope: "12 applications",
    },
    {
      name: "Payroll & compensation controls",
      linkedTo: "HR-OPS-2025 · Process audit",
      status: "Planning",
      statusColor: color.type.muted,
      openIssues: "—",
      scope: "4 countries",
    },
  ];

  return (
    <ContentCard>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: "16px" }}>
        <TradAtlasText semanticFont={SF.titleH4Emphasis} sx={{ fontWeight: weight.semiBold, color: color.type.default }}>
          Active audit engagements
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
          View plan & engagement list →
        </Box>
      </Box>

      <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted, mb: "16px" }}>
        {engagements.length} engagements in flight — fieldwork, reporting, and planning tied to the risk-based audit plan
        and enterprise risks (workpaper review and stakeholder check-ins tracked per engagement).
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
            gridTemplateColumns: "1.5fr 1.2fr 1fr 0.85fr 1fr",
            px: "20px",
            py: "10px",
            borderBottom: `1px solid ${color.outline.fixed}`,
            background: color.surface.subtle,
          }}
        >
          {["Engagement", "Risk / plan link", "Status", "Open issues", "Scope"].map((h) => (
            <TradAtlasText key={h} semanticFont={SF.textSmUppercase} sx={{ color: color.type.muted }}>
              {h}
            </TradAtlasText>
          ))}
        </Box>

        {engagements.map((row, i) => (
          <Box
            key={row.name}
            sx={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1.2fr 1fr 0.85fr 1fr",
              px: "20px",
              py: "12px",
              borderBottom: i < engagements.length - 1 ? `1px solid ${color.outline.fixed}` : "none",
              alignItems: "center",
              "&:hover": { background: color.surface.subtle },
            }}
          >
            <TradAtlasText semanticFont={SF.textMd} sx={{ fontWeight: weight.medium, color: color.type.default }}>
              {row.name}
            </TradAtlasText>
            <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted, fontFamily: atlasFontFamilyMono }}>
              {row.linkedTo}
            </TradAtlasText>
            <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: row.statusColor, flexShrink: 0 }} />
              <TradAtlasText semanticFont={SF.labelMdCompact} sx={{ color: color.type.default }}>
                {row.status}
              </TradAtlasText>
            </Box>
            <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted, fontWeight: weight.semiBold }}>
              {row.openIssues}
            </TradAtlasText>
            <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
              {row.scope}
            </TradAtlasText>
          </Box>
        ))}
      </Box>
    </ContentCard>
  );
}

/* ─── AgentActivity ────────────────────────────────────────────────────────── */

function AgentActivity() {
  const { color, weight, radius } = useTokens();

  const activities = [
    {
      title: "IT general controls — access & change testing",
      agent: "Control testing agent",
      status: "In progress",
      statusColor: color.action.primary.default,
      progress: 40,
      step: "Full-population sample of access grants; reconciling to change tickets and workpaper sign-off",
      updated: "8 min ago",
    },
    {
      title: "Q2 audit committee report assembly",
      agent: "Report assembly agent",
      status: "In progress",
      statusColor: color.action.primary.default,
      progress: 68,
      step: "Compiling control testing results and remediation status summaries",
      updated: "35 min ago",
    },
    {
      title: "Remediation validation — IT general controls",
      agent: "Remediation tracking agent",
      status: "Awaiting review",
      statusColor: color.status.warning.default,
      progress: 92,
      step: "Management remediation evidence collected — pending auditor sign-off",
      updated: "1 hr ago",
    },
  ];

  return (
    <ContentCard>
      <TradAtlasText semanticFont={SF.titleH4Emphasis} sx={{ fontWeight: weight.semiBold, color: color.type.default, mb: "16px" }}>
        Agent activity
      </TradAtlasText>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {activities.map((a) => {
          const tone: PulsingStatusTone =
            a.statusColor === color.status.warning.default ? "warning" : "info";
          const statusTextColor =
            tone === "warning" ? color.status.warning.text : color.action.primary.default;
          return (
            <Box
              key={a.title}
              sx={{
                borderRadius: radius.md,
                border: `1px solid ${color.outline.fixed}`,
                background: color.surface.subtle,
                p: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <AutoAwesomeOutlinedIcon
                      sx={{ fontSize: 16, color: color.action.primary.default }}
                    />
                    <TradAtlasText
                      semanticFont={SF.textSm}
                      sx={{ color: color.type.muted, fontWeight: weight.medium }}
                    >
                      {a.agent}
                    </TradAtlasText>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <PulsingStatusDot
                      size="sm"
                      tone={tone}
                      aria-label={`${a.agent} — ${a.status}`}
                    />
                    <TradAtlasText
                      semanticFont={SF.textMicroEmphasis}
                      sx={{
                        color: statusTextColor,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {a.status}
                    </TradAtlasText>
                  </Box>
                </Box>
                <IconButton
                  size="small"
                  sx={{ color: color.type.muted, mt: "-4px", mr: "-4px" }}
                >
                  <MoreHorizIcon fontSize="small" />
                </IconButton>
              </Box>

              <TradAtlasText
                semanticFont={SF.textMdEmphasis}
                sx={{ color: color.type.default }}
              >
                {a.title}
              </TradAtlasText>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <TradAtlasText
                  semanticFont={SF.textSm}
                  sx={{ color: color.type.muted, flex: 1, minWidth: 0 }}
                >
                  {a.step}
                </TradAtlasText>
                <TradAtlasText
                  semanticFont={SF.textMicro}
                  sx={{ color: color.type.muted, flexShrink: 0 }}
                >
                  Updated {a.updated}
                </TradAtlasText>
              </Box>
            </Box>
          );
        })}
      </Box>
    </ContentCard>
  );
}

/* ─── ProactiveTasks ───────────────────────────────────────────────────────── */

function ProactiveTasks() {
  const { color, weight, radius } = useTokens();

  const tasks = [
    {
      title: "Annual audit plan refresh",
      description: "Review the risk-based audit plan against recent incidents, regulatory changes, and management requests. Reprioritize engagements using real-time risk data from the enterprise risk register.",
    },
    {
      title: "Continuous monitoring rule set review",
      description: "Evaluate automated control monitoring coverage across IT general controls and application controls. Identify gaps where AI-powered analytics could replace periodic sampling.",
    },
    {
      title: "Cross-functional assurance mapping",
      description: "Coordinate with Risk, Compliance, and IT Security on shared controls and testing coverage. Reduce duplication and close coverage gaps across the three lines of defense.",
    },
    {
      title: "Audit methodology template update",
      description: "Standardize work programs, rating scales, and issue classifications for global consistency. Update scoping templates to incorporate AI-assisted full-population testing.",
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
            <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default }}>
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

/* ─── OperationalTrends ────────────────────────────────────────────────────── */

function OperationalTrends() {
  const { color, weight, radius } = useTokens();

  const trends = [
    {
      label: "Plan completion",
      value: "75%",
      description: "Audits completed vs planned — FY 2026 year to date.",
      trend: "up" as const,
      trendLabel: "+8% vs prior quarter",
    },
    {
      label: "Issue closure rate",
      value: "87%",
      description: "Audit issues remediated within target window — rolling 90 days.",
      trend: "up" as const,
      trendLabel: "+5% vs prior quarter",
    },
    {
      label: "Mean days to close",
      value: "34",
      description: "Average remediation time for audit issues — rolling 90 days.",
      trend: "down" as const,
      trendLabel: "+6 days vs target",
    },
  ];

  const miniChart = (trend: "up" | "down") => {
    const points =
      trend === "up"
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
        Rolling audit program metrics across all engagements (demo data).
      </TradAtlasText>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: "12px" }}>
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
            <TradAtlasText semanticFont={SF.textSmUppercase} sx={{ color: color.type.muted }}>
              {t.label}
            </TradAtlasText>
            <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <TradAtlasText semanticFont={SF.titleH2Emphasis} sx={{ fontWeight: weight.bold, color: color.type.default }}>
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

/* ─── RecentActivity ───────────────────────────────────────────────────────── */

function RecentActivity() {
  const { color, weight, radius } = useTokens();

  const items = [
    { category: "Control testing", text: "Access management control tests completed for 12 applications", time: "2 hours ago", icon: <FactCheckOutlinedIcon sx={{ fontSize: 18 }} /> },
    { category: "Report", text: "Draft Q2 audit committee pack shared with CAE for review", time: "5 hours ago", icon: <SummarizeOutlinedIcon sx={{ fontSize: 18 }} /> },
    { category: "Issue management", text: "3 remediation items validated and closed this week", time: "1 day ago", icon: <TaskAltOutlinedIcon sx={{ fontSize: 18 }} /> },
    { category: "Engagement", text: "Payroll & compensation engagement — scope and criteria approved by CAE", time: "2 days ago", icon: <AssessmentOutlinedIcon sx={{ fontSize: 18 }} /> },
  ];

  return (
    <ContentCard sx={{ flex: 1, height: "100%", minHeight: 0 }}>
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
            <TradAtlasText semanticFont={SF.textSmUppercase} sx={{ color: color.type.default }}>
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

/* ─── SystemLog ────────────────────────────────────────────────────────────── */

function SystemLog() {
  const { color, weight, radius } = useTokens();

  const logs = [
    "Control testing agent: Access management control tests completed — 3 exceptions identified in privileged access reviews.",
    "Report assembly agent: Q2 audit committee report draft 68% complete — awaiting IT security control findings.",
    "Remediation tracker: Management evidence for ITGC-2024-012 received — validation in progress.",
    "Risk assessment agent: Annual audit plan coverage updated — 87% alignment with top enterprise risks.",
    "Continuous monitor: Automated SOX control testing detected 1 new exception in journal entry approval workflow.",
  ];

  return (
    <ContentCard
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <TradAtlasText semanticFont={SF.textMd} sx={{ fontWeight: weight.semiBold, color: color.type.default, mb: "4px", flexShrink: 0 }}>
        System log
      </TradAtlasText>
      <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted, mb: "12px", flexShrink: 0 }}>
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
          flex: 1,
          minHeight: 0,
          overflow: "auto",
        }}
      >
        {logs.map((log, i) => (
          <TradAtlasText key={i} semanticFont={SF.textSm} sx={{ fontFamily: atlasFontFamilyMono, color: color.type.muted }}>
            {log}
          </TradAtlasText>
        ))}
      </Box>
    </ContentCard>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function AuditCommandCenter() {
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
          <ChatSection />
          <AuditPosture />
          <ActiveAuditEngagements />
          <AgentActivity />
          <ProactiveTasks />
          <OperationalTrends />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: "24px",
              alignItems: "stretch",
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
