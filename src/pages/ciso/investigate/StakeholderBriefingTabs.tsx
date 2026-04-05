import { useState } from "react";
import { Box, Button, Chip, Collapse, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import {
  CheckCircleIcon,
  RadioButtonUncheckedIcon,
  CloseIcon,
  ExpandMoreIcon,
  ExpandLessIcon,
  PersonOutlinedIcon,
  PersonAddOutlinedIcon,
  SendOutlinedIcon,
} from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import ContentCard from "@/components/common/ContentCard";
import SectionHeader from "@/components/common/SectionHeader";
import IdeTabs from "@/components/common/IdeTabs";
import TipTapEditorShell from "@/components/editor/TipTapEditorShell";
import type { TabDef } from "@/components/common/IdeTabs";
import { SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

/* ── Shared recipient data ─────────────────────── */

interface Recipient {
  id: string;
  name: string;
  email: string;
}

interface Team {
  name: string;
  members: Recipient[];
}

const SECURITY_RECIPIENTS: Recipient[] = [
  { id: "alex-thompson", name: "Alex Thompson", email: "athompson@acme.com" },
  { id: "rachel-lee", name: "Rachel Lee", email: "rlee@acme.com" },
  { id: "james-park", name: "James Park", email: "jpark@acme.com" },
  { id: "mike-rodriguez", name: "Mike Rodriguez", email: "mrodriguez@acme.com" },
  { id: "tom-nguyen", name: "Tom Nguyen", email: "tnguyen@acme.com" },
  { id: "lisa-martinez", name: "Lisa Martinez", email: "lmartinez@acme.com" },
];

const EXECUTIVE_RECIPIENTS: Recipient[] = [
  { id: "sarah-chen", name: "Sarah Chen", email: "schen@acme.com" },
  { id: "jennifer-walsh", name: "Jennifer Walsh", email: "jwalsh@acme.com" },
  { id: "robert-adams", name: "Robert Adams", email: "radams@acme.com" },
  { id: "catherine-wu", name: "Catherine Wu", email: "cwu@acme.com" },
];

const TEAMS: Team[] = [
  {
    name: "Security Operations",
    members: [
      { id: "sarah-chen", name: "Sarah Chen", email: "schen@acme.com" },
      { id: "alex-thompson", name: "Alex Thompson", email: "athompson@acme.com" },
      { id: "rachel-lee", name: "Rachel Lee", email: "rlee@acme.com" },
      { id: "james-park", name: "James Park", email: "jpark@acme.com" },
    ],
  },
  {
    name: "IT Infrastructure",
    members: [
      { id: "mike-rodriguez", name: "Mike Rodriguez", email: "mrodriguez@acme.com" },
      { id: "tom-nguyen", name: "Tom Nguyen", email: "tnguyen@acme.com" },
      { id: "lisa-martinez", name: "Lisa Martinez", email: "lmartinez@acme.com" },
    ],
  },
  {
    name: "Legal & Compliance",
    members: [
      { id: "jennifer-walsh", name: "Jennifer Walsh", email: "jwalsh@acme.com" },
      { id: "robert-adams", name: "Robert Adams", email: "radams@acme.com" },
      { id: "emily-foster", name: "Emily Foster", email: "efoster@acme.com" },
    ],
  },
  {
    name: "Executive Leadership",
    members: [
      { id: "catherine-wu", name: "Catherine Wu", email: "cwu@acme.com" },
      { id: "brian-patel", name: "Brian Patel", email: "bpatel@acme.com" },
      { id: "diana-ross", name: "Diana Ross", email: "dross@acme.com" },
      { id: "david-kim", name: "David Kim", email: "dkim@acme.com" },
    ],
  },
];

/* ── HTML builders for briefing content ─────────── */

function buildSecurityBriefingHtml(): string {
  return `
<h3>Security Team Briefing — CVE-2026-1847</h3>

<p>Team,</p>

<p>A critical vulnerability (<strong>CVE-2026-1847, CVSS 9.8</strong>) has been identified in <strong>CrowdStrike Falcon Sensor v7.x</strong> with active exploitation confirmed. This requires immediate action per our 24-hour critical remediation SLA.</p>

<h3>Risk Scoring</h3>

<ul>
<li><strong>Threat:</strong> Third-party vulnerability in CrowdStrike Falcon Sensor v7.x kernel driver</li>
<li><strong>Attack vector:</strong> Network-accessible, low complexity, no privileges required</li>
<li><strong>Assets in scope:</strong> 12 endpoints — 5 Financial Reporting, 4 HR Management, 3 Customer Portal (staging)</li>
<li><strong>Data at risk:</strong> Customer PII, employee PII, and confidential financial data across US, EU, and APAC regions</li>
<li><strong>Inherent risk:</strong> 9.2 / 10 &nbsp;|&nbsp; <strong>Current residual:</strong> 7.8 / 10</li>
</ul>

<h3>Control Gap Analysis</h3>

<ul>
<li><strong>AC-7 — Endpoint Protection:</strong> Falcon Sensor kernel driver unpatched for 72+ hrs (SLA: 24 hrs) — <em>Overdue</em></li>
<li><strong>RA-5 — Vulnerability Scanning:</strong> Detection delay exceeded 24-hour threshold (SLA: 12 hrs) — <em>Overdue</em></li>
<li><strong>SI-2 — Flaw Remediation:</strong> Emergency patch not applied within critical SLA (SLA: 24 hrs) — <em>Active</em></li>
<li><strong>SA-9 — External System Services:</strong> Vendor patch dependency — awaiting CrowdStrike advisory (SLA: 48 hrs) — <em>Active</em></li>
<li><strong>IR-4 — Incident Handling:</strong> Automated escalation triggered — IR playbook activated — <em>OK</em></li>
</ul>

<h3>Remediation Playbook</h3>

<ol>
<li><strong>Deploy emergency patch</strong> to all affected endpoints — Infrastructure — T+4 hrs (Critical)</li>
<li><strong>Activate compensating controls</strong> — network segmentation for affected VLANs — Security Ops — T+2 hrs (Critical)</li>
<li><strong>Increase EDR monitoring</strong> sensitivity and add IOC detection rules — Security Ops — T+1 hr (High)</li>
<li><strong>Verify patch deployment</strong> across all 12 assets via scan — Vulnerability Mgmt — T+6 hrs (High)</li>
<li><strong>Collect evidence:</strong> change tickets, scan results, config baselines — Compliance — T+8 hrs (Medium)</li>
<li><strong>Update ITSM tickets</strong> and close completed tasks — IT Service Mgmt — T+12 hrs (Medium)</li>
</ol>

<p>Please confirm receipt and begin executing your assigned tasks immediately. Updates will be coordinated via this thread.</p>
`;
}

function buildExecutiveBriefingHtml(): string {
  return `
<h3>Executive Briefing — CVE-2026-1847</h3>

<p>Leadership team,</p>

<p>A critical security vulnerability has been identified in endpoint protection software deployed across our infrastructure. The vulnerability is being actively exploited in the wild and requires immediate remediation. This briefing summarizes the business impact and recommended executive actions.</p>

<h3>Situation Summary</h3>

<ul>
<li><strong>Risk level:</strong> Critical</li>
<li><strong>Business systems affected:</strong> 3 of 47 systems</li>
<li><strong>Data at risk:</strong> Employee PII, Customer PII, Financial data</li>
<li><strong>Remediation timeline:</strong> Target 24 hours from detection</li>
<li><strong>Current residual risk:</strong> 7.8 / 10 (appetite threshold: 3.0 / 10 — <em>2.6x above tolerance</em>)</li>
</ul>

<h3>Business Impact</h3>

<p><strong>Financial reporting:</strong> 5 production systems supporting the financial close process are exposed. If exploited, the integrity of financial data could be compromised, potentially affecting quarterly reporting.</p>

<p><strong>Employee data:</strong> 4 HR systems containing employee PII (payroll, benefits, personal records) are at risk. A breach could trigger notification obligations under state privacy laws and GDPR for EU-based employees.</p>

<p><strong>Customer trust:</strong> 3 staging systems for the Customer Portal contain customer PII. While not yet in production, promotion of compromised code could expose customer data across US, EU, and APAC regions.</p>

<p><strong>Regulatory compliance:</strong> 4 compliance frameworks (SOC 2, ISO 27001, NIST CSF, PCI DSS) have control findings. The incident meets the materiality disclosure threshold and may require regulatory notification.</p>

<h3>Recommended Executive Actions</h3>

<ol>
<li>Approve emergency change window for patch deployment across all affected systems</li>
<li>Authorize disclosure review with General Counsel for regulatory notification assessment</li>
<li>Designate executive sponsor for vendor escalation with CrowdStrike</li>
<li>Schedule follow-up briefing in 24 hours for remediation status update</li>
</ol>

<p>The security team is executing the remediation playbook. A follow-up update will be sent once patch deployment is confirmed.</p>
`;
}

/* ── Main Component ────────────────────────────── */

interface StakeholderBriefingTabsProps {
  completed: boolean;
  onProceed: () => void;
}

export default function StakeholderBriefingTabs({ completed, onProceed }: StakeholderBriefingTabsProps) {
  const [tab, setTab] = useState(0);
  const [securitySent, setSecuritySent] = useState(false);
  const [executiveSent, setExecutiveSent] = useState(false);

  const tabs: TabDef[] = [
    { label: "Overview", done: securitySent && executiveSent },
    { label: "Security team briefing", done: securitySent },
    { label: "Executive briefing", done: executiveSent },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <IdeTabs tabs={tabs} active={tab} onChange={setTab} />
      <Box sx={{ flex: 1, overflow: "auto", p: "24px" }}>
        {tab === 0 ? (
          <OverviewTab
            securitySent={securitySent}
            executiveSent={executiveSent}
            onGoToSecurity={() => setTab(1)}
            onGoToExecutive={() => setTab(2)}
            completed={completed}
            onProceed={onProceed}
          />
        ) : tab === 1 ? (
          <BriefingComposeTab
            key="security"
            defaultRecipients={SECURITY_RECIPIENTS}
            defaultSubject="CRITICAL: CVE-2026-1847 — Security team action required"
            buildHtml={buildSecurityBriefingHtml}
            sent={securitySent}
            onSend={() => setSecuritySent(true)}
          />
        ) : (
          <BriefingComposeTab
            key="executive"
            defaultRecipients={EXECUTIVE_RECIPIENTS}
            defaultSubject="CRITICAL: CVE-2026-1847 — Executive briefing"
            buildHtml={buildExecutiveBriefingHtml}
            sent={executiveSent}
            onSend={() => setExecutiveSent(true)}
          />
        )}
      </Box>
    </Box>
  );
}

/* ── Tab 0: Overview ──────────────────────────── */

function OverviewTab({
  securitySent,
  executiveSent,
  onGoToSecurity,
  onGoToExecutive,
  completed,
  onProceed,
}: {
  securitySent: boolean;
  executiveSent: boolean;
  onGoToSecurity: () => void;
  onGoToExecutive: () => void;
  completed: boolean;
  onProceed: () => void;
}) {
  const { color, weight, radius } = useTokens();

  const allDone = securitySent && executiveSent;

  return (
    <Box sx={{ maxWidth: 680, display: "flex", flexDirection: "column", gap: "20px" }}>
      <SectionHeader
        title="Brief & notify stakeholders"
        subtitle="Two briefing communications have been prepared — one for the security team with full technical detail, and one for executive leadership with business context. Review, edit, and send each."
        statusLabel={allDone ? "SENT" : "IN PROGRESS"}
        statusVariant={allDone ? "completed" : "in_progress"}
      />

      <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Box
          sx={{
            p: "20px",
            borderRadius: radius.lg,
            border: `1px solid ${securitySent ? color.status.success.default : color.outline.fixed}`,
            background: color.surface.default,
            display: "flex",
            alignItems: "flex-start",
            gap: "14px",
          }}
        >
          {securitySent ? (
            <CheckCircleIcon sx={{ fontSize: 22, color: color.status.success.default, mt: "1px", flexShrink: 0 }} />
          ) : (
            <RadioButtonUncheckedIcon sx={{ fontSize: 22, color: color.outline.fixed, mt: "1px", flexShrink: 0 }} />
          )}
          <Box sx={{ flex: 1 }}>
            <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "4px" }}>
              Security team briefing
            </TradAtlasText>
            <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
              {securitySent
                ? `Sent to ${SECURITY_RECIPIENTS.length} recipients — Security Operations & IT Infrastructure teams.`
                : "Technical risk scoring, control gap analysis, and remediation playbook. Review and send to security and infrastructure teams."}
            </TradAtlasText>
            {!securitySent && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={onGoToSecurity}
                sx={{ mt: "12px", textTransform: "none", fontWeight: weight.semiBold, ...semanticFontStyle(SF.labelMd), borderRadius: radius.md }}
              >
                Compose & send
              </Button>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            p: "20px",
            borderRadius: radius.lg,
            border: `1px solid ${executiveSent ? color.status.success.default : color.outline.fixed}`,
            background: color.surface.default,
            display: "flex",
            alignItems: "flex-start",
            gap: "14px",
          }}
        >
          {executiveSent ? (
            <CheckCircleIcon sx={{ fontSize: 22, color: color.status.success.default, mt: "1px", flexShrink: 0 }} />
          ) : (
            <RadioButtonUncheckedIcon sx={{ fontSize: 22, color: color.outline.fixed, mt: "1px", flexShrink: 0 }} />
          )}
          <Box sx={{ flex: 1 }}>
            <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "4px" }}>
              Executive briefing
            </TradAtlasText>
            <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
              {executiveSent
                ? `Sent to ${EXECUTIVE_RECIPIENTS.length} recipients — CISO, General Counsel, and senior leadership.`
                : "Business-focused risk summary with impact analysis and recommended actions for executive leadership."}
            </TradAtlasText>
            {!executiveSent && (
              <Button
                variant={securitySent ? "contained" : "outlined"}
                color={securitySent ? "primary" : "inherit"}
                size="small"
                onClick={onGoToExecutive}
                sx={{
                  mt: "12px",
                  textTransform: "none",
                  fontWeight: weight.semiBold,
                  ...semanticFontStyle(SF.labelMd),
                  borderRadius: radius.md,
                  ...(securitySent ? {} : { borderColor: color.outline.fixed }),
                }}
              >
                Compose & send
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {/* Risk summary */}
      <ContentCard>
        <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "12px" }}>
          Risk score summary
        </TradAtlasText>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          {[
            { label: "Inherent risk", value: "9.2 / 10", color: color.status.error.text },
            { label: "Current residual", value: "7.8 / 10", color: color.status.warning.text },
            { label: "Target residual", value: "2.5 / 10", color: color.status.success.text },
          ].map((item) => (
            <Box key={item.label}>
              <TradAtlasText semanticFont={SF.textSmUppercase} sx={{ color: color.type.muted, mb: "4px" }}>
                {item.label}
              </TradAtlasText>
              <TradAtlasText semanticFont={SF.titleH4Emphasis} sx={{ color: item.color }}>
                {item.value}
              </TradAtlasText>
            </Box>
          ))}
        </Box>
      </ContentCard>

      {allDone && !completed && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onProceed}
            sx={{ textTransform: "none", ...semanticFontStyle(SF.textMdEmphasis) }}
          >
            Proceed to remediation
          </Button>
        </Box>
      )}
    </Box>
  );
}

/* ── Briefing compose tab (email-like) ──────────── */

function BriefingComposeTab({
  defaultRecipients,
  defaultSubject,
  buildHtml,
  sent,
  onSend,
}: {
  defaultRecipients: Recipient[];
  defaultSubject: string;
  buildHtml: () => string;
  sent: boolean;
  onSend: () => void;
}) {
  const { color, weight, radius } = useTokens();

  const [recipients, setRecipients] = useState<Recipient[]>(defaultRecipients);
  const [showTeamBrowser, setShowTeamBrowser] = useState(false);
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
  const [channel, setChannel] = useState<"email" | "teams">("email");

  const recipientIds = new Set(recipients.map((r) => r.id));

  const removeRecipient = (id: string) => {
    setRecipients((prev) => prev.filter((r) => r.id !== id));
  };

  const addRecipient = (member: Recipient) => {
    if (recipientIds.has(member.id)) return;
    setRecipients((prev) => [...prev, member]);
  };

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({ heading: { levels: [3, 4] } }),
        Underline,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        Placeholder.configure({ placeholder: "Edit the briefing…" }),
      ],
      content: buildHtml(),
      editable: !sent,
    },
    [],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "0", height: "100%" }}>
      {/* Email-like header */}
      <Box
        sx={{
          border: `1px solid ${color.outline.fixed}`,
          borderRadius: `${radius.lg} ${radius.lg} 0 0`,
          background: color.surface.default,
          overflow: "hidden",
        }}
      >
        {/* Channel toggle + subject */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px", px: "16px", py: "10px", borderBottom: `1px solid ${color.outline.fixed}` }}>
          <ToggleButtonGroup
            value={channel}
            exclusive
            onChange={(_, val) => { if (val) setChannel(val); }}
            size="small"
            disabled={sent}
            sx={{
              "& .MuiToggleButton-root": {
                textTransform: "none",
                ...semanticFontStyle(SF.textSm),
                fontWeight: weight.medium,
                px: "12px",
                py: "4px",
                borderColor: color.outline.fixed,
                color: color.type.muted,
                "&.Mui-selected": {
                  background: color.action.primary.default,
                  color: "#fff",
                  borderColor: color.action.primary.default,
                  "&:hover": { background: color.action.primary.default },
                },
              },
            }}
          >
            <ToggleButton value="email">Email</ToggleButton>
            <ToggleButton value="teams">Teams</ToggleButton>
          </ToggleButtonGroup>

          <Box sx={{ flex: 1 }}>
            <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
              {channel === "email" ? "Send as email" : "Create Teams chat with briefing as first message"}
            </TradAtlasText>
          </Box>
        </Box>

        {/* To row */}
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: "8px", px: "16px", py: "10px", borderBottom: `1px solid ${color.outline.fixed}` }}>
          <TradAtlasText semanticFont={SF.textSmEmphasis} sx={{ color: color.type.muted, mt: "4px", minWidth: 28 }}>
            To
          </TradAtlasText>
          <Box sx={{ flex: 1, display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
            {recipients.map((r) => (
              <Chip
                key={r.id}
                label={r.name}
                size="small"
                onDelete={sent ? undefined : () => removeRecipient(r.id)}
                deleteIcon={<CloseIcon sx={{ fontSize: 14 }} />}
                sx={{
                  ...semanticFontStyle(SF.textSm),
                  fontWeight: weight.medium,
                  backgroundColor: color.surface.variant,
                  borderRadius: "16px",
                  "& .MuiChip-deleteIcon": { color: color.type.muted, "&:hover": { color: color.action.destructive.default } },
                }}
              />
            ))}
            {!sent && (
              <Button
                variant="text"
                size="small"
                startIcon={<PersonAddOutlinedIcon sx={{ fontSize: 14 }} />}
                onClick={() => setShowTeamBrowser((v) => !v)}
                sx={{
                  textTransform: "none",
                  ...semanticFontStyle(SF.textSm),
                  color: color.action.primary.default,
                  fontWeight: weight.medium,
                  minWidth: "auto",
                  px: "8px",
                }}
              >
                Add
              </Button>
            )}
          </Box>
        </Box>

        {/* Team browser (collapsible) */}
        <Collapse in={showTeamBrowser && !sent} timeout={200}>
          <Box sx={{ px: "16px", py: "8px", borderBottom: `1px solid ${color.outline.fixed}`, background: color.surface.subtle }}>
            <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted, mb: "8px" }}>
              Select recipients from teams:
            </TradAtlasText>
            {TEAMS.map((team) => {
              const isOpen = expandedTeam === team.name;
              return (
                <Box key={team.name}>
                  <Box
                    component="button"
                    type="button"
                    onClick={() => setExpandedTeam(isOpen ? null : team.name)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      width: "100%",
                      py: "6px",
                      px: "0",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      "&:hover": { background: color.action.secondary.hoverFill },
                    }}
                  >
                    {isOpen ? <ExpandLessIcon sx={{ fontSize: 16, color: color.type.muted }} /> : <ExpandMoreIcon sx={{ fontSize: 16, color: color.type.muted }} />}
                    <TradAtlasText semanticFont={SF.labelMd} sx={{ color: color.type.default, flex: 1, textAlign: "left" }}>
                      {team.name}
                    </TradAtlasText>
                  </Box>
                  <Collapse in={isOpen} timeout={150}>
                    <Box sx={{ pl: "22px", py: "2px" }}>
                      {team.members.map((m) => {
                        const added = recipientIds.has(m.id);
                        return (
                          <Box key={m.id} sx={{ display: "flex", alignItems: "center", gap: "8px", py: "4px" }}>
                            <PersonOutlinedIcon sx={{ fontSize: 14, color: color.type.muted }} />
                            <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.default, flex: 1 }}>
                              {m.name}
                            </TradAtlasText>
                            {added ? (
                              <Chip
                                label="Added"
                                size="small"
                                sx={{
                                  ...semanticFontStyle(SF.textXs),
                                  height: 18,
                                  backgroundColor: color.status.success.background,
                                  color: color.status.success.text,
                                  fontWeight: weight.semiBold,
                                  border: `1px solid ${color.status.success.default}`,
                                }}
                              />
                            ) : (
                              <Button
                                variant="text"
                                size="small"
                                onClick={() => addRecipient(m)}
                                sx={{ textTransform: "none", ...semanticFontStyle(SF.textXs), color: color.action.primary.default, fontWeight: weight.medium, minWidth: "auto", px: "6px" }}
                              >
                                + Add
                              </Button>
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  </Collapse>
                </Box>
              );
            })}
          </Box>
        </Collapse>

        {/* Subject row */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px", px: "16px", py: "10px" }}>
          <TradAtlasText semanticFont={SF.textSmEmphasis} sx={{ color: color.type.muted, minWidth: 52 }}>
            Subject
          </TradAtlasText>
          <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.default, fontWeight: weight.medium, flex: 1 }}>
            {defaultSubject}
          </TradAtlasText>
        </Box>
      </Box>

      {/* Rich text editor body */}
      <Box sx={{ flex: 1, minHeight: 0, borderLeft: `1px solid ${color.outline.fixed}`, borderRight: `1px solid ${color.outline.fixed}`, borderBottom: `1px solid ${color.outline.fixed}`, borderRadius: `0 0 ${radius.lg} ${radius.lg}`, overflow: "hidden" }}>
        {editor ? <TipTapEditorShell editor={editor} /> : null}
      </Box>

      {/* Send action */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", flexShrink: 0, mt: "16px" }}>
        {sent ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <CheckCircleIcon sx={{ fontSize: 18, color: color.status.success.default }} />
            <TradAtlasText semanticFont={SF.textSmEmphasis} sx={{ color: color.status.success.text }}>
              {channel === "email"
                ? `Sent to ${recipients.length} recipients via email`
                : `Teams chat created with ${recipients.length} participants`}
            </TradAtlasText>
          </Box>
        ) : (
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<SendOutlinedIcon sx={{ fontSize: 18 }} />}
            disabled={recipients.length === 0}
            onClick={onSend}
            sx={{ textTransform: "none", fontWeight: weight.semiBold, ...semanticFontStyle(SF.labelMd), borderRadius: radius.md }}
          >
            {channel === "email"
              ? `Send to ${recipients.length} recipient${recipients.length !== 1 ? "s" : ""}`
              : `Create Teams chat with ${recipients.length} participant${recipients.length !== 1 ? "s" : ""}`}
          </Button>
        )}
      </Box>
    </Box>
  );
}
