import { Box, Button } from "@mui/material";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { CheckCircleIcon } from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import ContentCard from "@/components/common/ContentCard";
import IdeTabs from "@/components/common/IdeTabs";
import TipTapEditorShell from "@/components/editor/TipTapEditorShell";
import type { TabDef } from "@/components/common/IdeTabs";
import { SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";
import { useState } from "react";

const TIMELINE_EVENTS = [
  { time: "Mon 9:15 AM", event: "Scope confirmed — 5 control domains, 41 controls across NIST CSF" },
  { time: "Mon 11:30 AM", event: "Risk-to-control mapping completed with enterprise risk register" },
  { time: "Tue 2:00 PM", event: "Full-population testing completed — 33 effective, 5 needs improvement, 3 ineffective" },
  { time: "Tue 4:45 PM", event: "3 findings documented — privileged access, vendor cert lapse, IR playbook" },
  { time: "Wed 10:00 AM", event: "Audit committee briefing sent to 4 recipients" },
  { time: "Wed 11:15 AM", event: "Management action items sent — 3 remediation owners assigned" },
  { time: "Wed 3:30 PM", event: "Remediation tracking initiated — 2 actions in progress, 3 open" },
  { time: "Thu 8:00 AM", event: "Final report generated — assurance opinion: Needs Improvement" },
];

function buildFinalReportHtml(): string {
  return `
<h3>Cybersecurity Control Assurance Report</h3>
<p><em>Prepared for the Audit Committee — April 2026</em></p>

<h3>1. Executive Summary</h3>

<p>Internal audit has completed a cybersecurity control posture assessment covering 41 controls across 5 NIST Cybersecurity Framework (CSF) domains. The assessment was requested by Thomas Chen, Audit Committee Chair, to evaluate cybersecurity control effectiveness and SEC disclosure readiness ahead of the quarterly Audit Committee meeting.</p>

<p><strong>Overall assurance opinion: Needs Improvement.</strong> 80% of controls (33 of 41) are operating effectively. Three controls were rated Ineffective, requiring management remediation within 30 days.</p>

<h3>2. Scope & Methodology</h3>

<ul>
<li><strong>Framework:</strong> NIST Cybersecurity Framework (CSF)</li>
<li><strong>Domains tested:</strong> Access management (PR.AC), Network security (PR.PT), Incident response (RS.RP), Data protection (PR.DS), Vendor risk management (ID.SC)</li>
<li><strong>Controls in scope:</strong> 41 controls across 3 regions (US, EU, APAC)</li>
<li><strong>Testing approach:</strong> Full-population sampling with AI analytics, supplemented by targeted walkthroughs for procedural controls</li>
<li><strong>Evidence:</strong> Captured in Diligent Audit workpapers with linkage to enterprise risk register</li>
<li><strong>Rating scale:</strong> Effective, Needs Improvement, Ineffective, Not Tested</li>
</ul>

<h3>3. Control Test Results</h3>

<table>
<thead>
<tr><th>Domain</th><th>Tested</th><th>Effective</th><th>Needs improvement</th><th>Ineffective</th></tr>
</thead>
<tbody>
<tr><td>Access management</td><td>12</td><td>9</td><td>2</td><td>1</td></tr>
<tr><td>Network security</td><td>8</td><td>7</td><td>1</td><td>0</td></tr>
<tr><td>Incident response</td><td>6</td><td>4</td><td>1</td><td>1</td></tr>
<tr><td>Data protection</td><td>10</td><td>10</td><td>0</td><td>0</td></tr>
<tr><td>Vendor risk management</td><td>5</td><td>3</td><td>1</td><td>1</td></tr>
<tr><td><strong>Total</strong></td><td><strong>41</strong></td><td><strong>33</strong></td><td><strong>5</strong></td><td><strong>3</strong></td></tr>
</tbody>
</table>

<h3>4. Key Findings</h3>

<p><strong>Finding 1 — Privileged access reviews overdue (Ineffective)</strong></p>
<p>3 of 12 privileged accounts have not undergone review in 180+ days. Two accounts belong to former contractors whose access was not revoked upon termination. Risk: unauthorized access to production financial systems.</p>

<p><strong>Finding 2 — Vendor SOC 2 certification lapse (Ineffective)</strong></p>
<p>2 tier-1 vendors have expired SOC 2 Type II certifications affecting 8 business processes. Renewal requests sent but no response received. Risk: supply chain exposure.</p>

<p><strong>Finding 3 — Incident response playbook untested (Ineffective)</strong></p>
<p>Last tabletop exercise conducted Q3 2025. Playbook does not include AI-driven threat scenarios or third-party cascade procedures. Risk: delayed incident detection and response.</p>

<h3>5. SEC Disclosure Readiness</h3>

<ul>
<li><strong>Material weakness:</strong> Not identified. Exceptions do not individually or in aggregate meet the material weakness threshold.</li>
<li><strong>Significant deficiency:</strong> Privileged access control exceptions constitute a significant deficiency for management representation letter.</li>
<li><strong>Recommendation:</strong> Disclose significant deficiency and remediation timeline in management representation letter.</li>
</ul>

<h3>6. Comparison to Prior Quarter</h3>

<p>Overall effectiveness improved from 76% to 80%. Two prior-quarter findings (network segmentation and data backup testing) have been fully remediated. Three new findings identified this quarter.</p>

<h3>7. Management Response & Remediation</h3>

<ul>
<li>Alex Thompson (CISO) — Privileged access remediation by April 18</li>
<li>Rachel Lee (Vendor Risk) — Vendor certification escalation by April 25</li>
<li>James Park (IR) — Tabletop exercise and playbook update by May 2</li>
</ul>

<h3>8. Conclusion</h3>

<p>The cybersecurity control environment is functioning with identified areas for improvement. Management has accepted all findings and committed to remediation within 30 days. Internal audit will perform follow-up testing upon remediation completion and report results to the Audit Committee.</p>

<p><em>Report prepared by Internal Audit with AI-assisted analysis. All test evidence is maintained in Diligent Audit workpapers.</em></p>
`;
}

interface FinalReportPanelProps {
  completed: boolean;
  onProceed: () => void;
}

export default function FinalReportPanel({ completed, onProceed }: FinalReportPanelProps) {
  const [tab, setTab] = useState(0);

  const tabs: TabDef[] = [
    { label: "Report editor", done: false },
    { label: "Engagement timeline", done: false },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <IdeTabs tabs={tabs} active={tab} onChange={setTab} />
      <Box sx={{ flex: 1, overflow: "auto", p: "24px" }}>
        {tab === 0 ? (
          <ReportEditorTab completed={completed} onProceed={onProceed} />
        ) : (
          <TimelineTab />
        )}
      </Box>
    </Box>
  );
}

function ReportEditorTab({ completed, onProceed }: { completed: boolean; onProceed: () => void }) {
  const { color, radius } = useTokens();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [3, 4] } }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Edit the report…" }),
    ],
    content: buildFinalReportHtml(),
    editable: !completed,
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "0", height: "100%" }}>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          border: `1px solid ${color.outline.fixed}`,
          borderRadius: radius.lg,
          overflow: "hidden",
        }}
      >
        {editor ? <TipTapEditorShell editor={editor} /> : null}
      </Box>

      {!completed && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "16px", flexShrink: 0 }}>
          <Button variant="contained" color="primary" onClick={onProceed} sx={{ textTransform: "none", ...semanticFontStyle(SF.textMdEmphasis) }}>
            Finalize report
          </Button>
        </Box>
      )}
    </Box>
  );
}

function TimelineTab() {
  const { color } = useTokens();

  return (
    <Box sx={{ maxWidth: 680, display: "flex", flexDirection: "column", gap: "20px" }}>
      <Box>
        <TradAtlasText semanticFont={SF.titleH4Emphasis} sx={{ color: color.type.default, mb: "8px" }}>
          Engagement timeline
        </TradAtlasText>
        <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
          Key milestones from scope definition through report finalization.
        </TradAtlasText>
      </Box>

      <ContentCard>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {TIMELINE_EVENTS.map((evt, i) => (
            <Box
              key={i}
              sx={{ display: "flex", alignItems: "flex-start", gap: "12px", py: "8px", position: "relative" }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: 18, flexShrink: 0 }}>
                <CheckCircleIcon sx={{ fontSize: 16, color: color.status.success.default }} />
                {i < TIMELINE_EVENTS.length - 1 && (
                  <Box sx={{ width: 1, flex: 1, minHeight: 16, background: color.outline.fixed, mt: "4px" }} />
                )}
              </Box>
              <Box sx={{ flex: 1, pb: "4px" }}>
                <TradAtlasText semanticFont={SF.textSmEmphasis} sx={{ color: color.type.muted }}>
                  {evt.time}
                </TradAtlasText>
                <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.default }}>
                  {evt.event}
                </TradAtlasText>
              </Box>
            </Box>
          ))}
        </Box>
      </ContentCard>
    </Box>
  );
}
