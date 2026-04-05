import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import { Link, Link as RouterLink } from "react-router";
import {
  WarningAmberIcon,
  BoltOutlinedIcon,
  CheckCircleOutlineIcon,
  SecurityOutlinedIcon,
  ShieldOutlinedIcon,
  BugReportOutlinedIcon,
  VerifiedUserOutlinedIcon,
  DescriptionOutlinedIcon,
  TrendingUpOutlinedIcon,
  TrendingDownOutlinedIcon,
  AutoAwesomeOutlinedIcon,
  AssessmentOutlinedIcon,
  PolicyOutlinedIcon,
  SearchOutlinedIcon,
  BuildOutlinedIcon,
  MoreHorizIcon,
  AppsIcon,
  HelpOutlineIcon,
  SettingsOutlinedIcon,
  AccountCircleOutlinedIcon,
} from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import { DATA_SEMANTIC_FONT, SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { atlasFontFamilyMono } from "@/tokens/atlasLight";
import { useDemo } from "../../DemoContext";
import { useTokens } from "../../hooks/useTokens";
import { ChatPrompt } from "../../components/ai";
import ContentCard from "@/components/common/ContentCard";
import DemoControlsFab from "../corpsec/DemoControlsFab";

/* ─── GlobalHeader (CISO variant) ──────────────────────────────────────────── */

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
          <MenuItem sx={{ gap: "8px" }}>
            <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default }}>
              CISO / IT Risk
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
          <MenuItem onClick={() => setAppMenuAnchor(null)}>
            <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
              Entities
            </TradAtlasText>
          </MenuItem>
        </Menu>

        <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted, fontWeight: weight.medium }}>
          IT Risk Command Center
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
          icon={<WarningAmberIcon sx={{ color: color.status.error.default, fontSize: 22 }} />}
          title="Critical vulnerability detected"
          severity="CRITICAL"
          severityVariant="critical"
          subtitle="CVE-2026-1847 (CVSS 9.8) has been detected across 12 IT assets in 3 business-critical systems. Security monitoring agents flagged active exploit activity."
          stats="CVSS 9.8 · 12 assets · Active exploit · Detected 23 min ago"
          actionLabel="Investigate"
          actionHref="/ciso/investigate"
        />
        <IncidentTile
          icon={<BoltOutlinedIcon sx={{ color: color.status.warning.text, fontSize: 22 }} />}
          title="Vendor compliance gap requires action"
          severity="HIGH"
          severityVariant="high"
          subtitle="Acme Cloud Services' SOC 2 Type II certification expired 3 days ago. 8 business processes and 14 IT assets depend on this vendor."
          stats="SOC 2 expired · 8 processes affected · Vendor tier 1"
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
        IT security posture is in good shape. All systems are patched, monitoring agents active, and compliance
        frameworks current.
      </TradAtlasText>
    </Box>
  );
}

/* ─── SecurityPosture ──────────────────────────────────────────────────────── */

function SecurityPosture() {
  const { color, weight, radius } = useTokens();

  const stats = [
    { value: "847", label: "Monitored assets", valueColor: color.action.primary.default },
    { value: "3", label: "Critical vulns", valueColor: color.status.error.text },
    { value: "94%", label: "Compliance score", valueColor: color.status.success.text },
    { value: "12", label: "Vendor risks", valueColor: color.status.warning.text },
    { value: "4.2h", label: "Mean time to remediate", valueColor: color.action.primary.default },
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
          <ShieldOutlinedIcon sx={{ fontSize: 20 }} />
        </Box>
        <Box>
          <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default }}>
            Security posture at a glance
          </TradAtlasText>
          <TradAtlasText semanticFont={SF.labelMdCompact} sx={{ color: color.type.muted }}>
            Your IT risk and security summary
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
      label: "Start response workflow",
      description: "Triage incidents end to end",
      icon: <SecurityOutlinedIcon sx={{ fontSize: 20 }} />,
    },
    {
      label: "Draft security briefing",
      description: "Board and executive summaries",
      icon: <DescriptionOutlinedIcon sx={{ fontSize: 20 }} />,
    },
    {
      label: "Run exposure report",
      description: "CVE trends and heat maps",
      icon: <AssessmentOutlinedIcon sx={{ fontSize: 20 }} />,
    },
    {
      label: "Search intelligence",
      description: "Policies, assets, and logs",
      icon: <SearchOutlinedIcon sx={{ fontSize: 20 }} />,
    },
    {
      label: "Open remediation ticket",
      description: "Track patches and owners",
      icon: <BuildOutlinedIcon sx={{ fontSize: 20 }} />,
    },
    {
      label: "Review compliance scope",
      description: "Controls and attestations",
      icon: <PolicyOutlinedIcon sx={{ fontSize: 20 }} />,
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

/* ─── VulnerabilitySummary ─────────────────────────────────────────────────── */

function VulnerabilitySummary() {
  const { color, weight, radius } = useTokens();

  const vulns = [
    { cve: "CVE-2026-1847", title: "CrowdStrike Falcon Sensor RCE", severity: "Critical", severityColor: color.status.error.default, cvss: "9.8", assets: "12" },
    { cve: "CVE-2026-0923", title: "OpenSSL Certificate Validation Bypass", severity: "High", severityColor: color.status.warning.default, cvss: "8.1", assets: "7" },
    { cve: "CVE-2026-1102", title: "Apache Struts Path Traversal", severity: "High", severityColor: color.status.warning.default, cvss: "7.5", assets: "4" },
  ];

  return (
    <ContentCard>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: "16px" }}>
        <TradAtlasText semanticFont={SF.titleH4Emphasis} sx={{ fontWeight: weight.semiBold, color: color.type.default }}>
          Pending vulnerabilities
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
          View full registry →
        </Box>
      </Box>

      <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted, mb: "16px" }}>
        {vulns.length} vulnerabilities require remediation — 44 resolved this quarter.
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
            gridTemplateColumns: "1fr 2fr 0.8fr 0.6fr 0.6fr",
            px: "20px",
            py: "10px",
            borderBottom: `1px solid ${color.outline.fixed}`,
            background: color.surface.subtle,
          }}
        >
          {["CVE", "Title", "Severity", "CVSS", "Assets"].map((h) => (
            <TradAtlasText key={h} semanticFont={SF.textSmUppercase} sx={{ color: color.type.muted }}>
              {h}
            </TradAtlasText>
          ))}
        </Box>

        {vulns.map((v, i) => (
          <Box
            key={v.cve}
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr 0.8fr 0.6fr 0.6fr",
              px: "20px",
              py: "12px",
              borderBottom: i < vulns.length - 1 ? `1px solid ${color.outline.fixed}` : "none",
              alignItems: "center",
              "&:hover": { background: color.surface.subtle },
            }}
          >
            <TradAtlasText semanticFont={SF.textMd} sx={{ fontWeight: weight.medium, color: color.type.default, fontFamily: atlasFontFamilyMono }}>
              {v.cve}
            </TradAtlasText>
            <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
              {v.title}
            </TradAtlasText>
            <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: v.severityColor, flexShrink: 0 }} />
              <TradAtlasText semanticFont={SF.labelMdCompact} sx={{ color: color.type.default }}>
                {v.severity}
              </TradAtlasText>
            </Box>
            <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted, fontWeight: weight.semiBold }}>
              {v.cvss}
            </TradAtlasText>
            <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
              {v.assets}
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
      title: "CVE-2026-1847 — Third-party vulnerability triage",
      agent: "Vulnerability triage agent",
      status: "In progress",
      statusColor: color.action.primary.default,
      progress: 45,
      step: "Mapping impact: identifying affected assets and compliance frameworks",
      updated: "8 min ago",
    },
    {
      title: "SOC 2 Type II re-certification — Acme Cloud Services",
      agent: "Compliance monitoring agent",
      status: "Awaiting review",
      statusColor: color.status.warning.default,
      progress: 85,
      step: "Vendor attestation request sent — awaiting SOC 2 report from vendor",
      updated: "45 min ago",
    },
    {
      title: "Quarterly IT risk register refresh",
      agent: "Risk assessment agent",
      status: "In progress",
      statusColor: color.action.primary.default,
      progress: 62,
      step: "Updating residual risk scores based on latest control test results",
      updated: "2 hr ago",
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
                <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default }}>
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
                  "& .MuiLinearProgress-bar": { backgroundColor: a.statusColor, borderRadius: 2 },
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

/* ─── ProactiveTasks ───────────────────────────────────────────────────────── */

function ProactiveTasks() {
  const { color, weight, radius } = useTokens();

  const tasks = [
    {
      title: "Third-party risk program review",
      description: "Evaluate vendor segmentation, due diligence criteria, and continuous monitoring thresholds. Update questionnaires and minimum security requirements based on recent incident patterns.",
    },
    {
      title: "Board cyber briefing preparation",
      description: "Prepare quarterly cyber risk report with standardized dashboards, trend lines, top risks, incidents, third-party exposure, and planned mitigations for the board and audit committee.",
    },
    {
      title: "IT compliance framework alignment",
      description: "Review IT compliance status against key frameworks (ISO 27001, SOC 2, NIST CSF, DORA). Map controls, track attestations, and identify gaps for the next audit cycle.",
    },
    {
      title: "Incident response playbook update",
      description: "Refresh IR playbooks to include AI-driven threat scenarios and third-party cascade failures. Update RACI matrix across CISO, GC, operations, and business owners.",
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
      label: "Failed sign-in attempts",
      value: "1,247",
      description: "Blocked authentication attempts — rolling 14 days.",
      trend: "down" as const,
      trendLabel: "-18% vs prior period",
    },
    {
      label: "Critical vulnerabilities",
      value: "3",
      description: "Unpatched critical-severity CVEs in production environments.",
      trend: "up" as const,
      trendLabel: "+1 since last week",
    },
    {
      label: "MTTA (P1 incidents)",
      value: "4.2h",
      description: "Mean time to acknowledge priority-1 incidents — rolling 90 days.",
      trend: "up" as const,
      trendLabel: "-1.8h vs prior quarter",
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
        Rolling performance metrics across security operations (demo data).
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
    { category: "Incident response", text: "CVE-2026-1847 triage report auto-generated and routed for review", time: "23 min ago", icon: <WarningAmberIcon sx={{ fontSize: 18 }} /> },
    { category: "Vendor risk", text: "Acme Cloud Services SOC 2 renewal request sent to vendor contact", time: "3 hours ago", icon: <BugReportOutlinedIcon sx={{ fontSize: 18 }} /> },
    { category: "Compliance", text: "ISO 27001 internal audit evidence package assembled and uploaded", time: "1 day ago", icon: <VerifiedUserOutlinedIcon sx={{ fontSize: 18 }} /> },
    { category: "Risk register", text: "Q2 IT risk register updated — 3 risks re-scored after control testing", time: "2 days ago", icon: <AssessmentOutlinedIcon sx={{ fontSize: 18 }} /> },
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
    "Vulnerability scanner: CVE-2026-1847 detected in CrowdStrike Falcon Sensor v7.x — 12 assets flagged for emergency patching.",
    "Threat intelligence: Active exploit code published for CVE-2026-1847 — elevated risk level to Critical.",
    "Compliance monitor: SOC 2 Type II certification lapsed for Acme Cloud Services — remediation workflow initiated.",
    "Vendor risk agent: Bitsight score for Acme Cloud Services dropped 15 points — continuous monitoring alert triggered.",
    "Risk assessment agent: Q2 IT risk register refresh 62% complete — 8 of 14 risk entries re-scored.",
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
          <TradAtlasText key={i} semanticFont={SF.textSm} sx={{ fontFamily: atlasFontFamilyMono, color: color.type.muted }}>
            {log}
          </TradAtlasText>
        ))}
      </Box>
    </ContentCard>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function CisoCommandCenter() {
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
          <SecurityPosture />
          <ChatSection />
          <VulnerabilitySummary />
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
