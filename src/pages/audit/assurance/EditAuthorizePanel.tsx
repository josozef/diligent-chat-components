import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TradAtlasText from "@/components/common/TradAtlasText";
import TipTapEditorShell from "@/components/editor/TipTapEditorShell";
import { SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";
import { TrackInsert, TrackDelete } from "./editAuthorizeTrackMarks";

function buildBoardReportHtml(): string {
  return `
<p><strong>Diligent · Internal Audit · Confidential · Q1 2026</strong></p>
<h2>Cybersecurity Risk — Situational Overview</h2>
<p><strong>Scope:</strong> SEC Peer Incident Response &nbsp;·&nbsp; <strong>Created on:</strong> Feb 24, 2026 &nbsp;·&nbsp; <strong>Audience:</strong> Audit Committee</p>
<hr />
<h3>1. Executive summary</h3>
<p>GlobalTech Financial Services faces <del>isolated IT control weaknesses</del> <ins>material cybersecurity control exposure</ins> in the period under review. Access management control failures, critical vendor cyber risk, and <ins>SEC disclosure readiness gaps</ins> warrant Audit Committee attention. This overview synthesizes evidence from synthesis and is intended for board consumption.</p>
<h3>2. Audit scope</h3>
<p>The following AI systems and processes were in scope:</p>
<ul>
<li>Automated risk scoring model (v2.4.1)</li>
<li>Document classification and extraction pipeline (NLP-based)</li>
<li>Compliance monitoring alert system and escalation workflows</li>
<li>Vendor risk assessment AI assistants — 3 active third-party integrations</li>
</ul>
<p><strong>Exclusions:</strong> Customer-facing features, experimental models in staging, and third-party managed components are out of scope.</p>
<h3>3. Key findings</h3>
<p><strong>F-01 — Risk scoring explainability</strong> (High) · Owner: <del>Priya Ramaswamy, Data Science</del> <ins>Data Science Lead</ins> · Due: 30 Apr<br />
The risk scoring model <del>lacks adequate documentation</del> <ins>lacks a documented explainability framework</ins> for Tier 1 production decisions.</p>
<p><strong>F-03 — Human-in-the-loop</strong> (High) · Owner: <del>Marcus Williams, GRC Platform</del> <ins>GRC Platform Lead</ins> · Due: 15 Apr<br />
Absence of human-in-the-loop controls for auto-escalation workflow.</p>
<p><strong>F-05 — Vendor AI logs</strong> (Medium) · Owner: <del>James Thornton, IT Security</del> <ins>IT Security Lead</ins> · Due: 1 Jun<br />
Vendor AI integration audit logs retained for <del>fewer than 30 days</del> <ins>fewer than 90 days</ins>.</p>
<h3>4. SEC disclosure &amp; materiality (Section C)</h3>
<p><strong>Updated</strong> — The <del>8-K materiality determination process has a documented gap relative to current SEC expectations.</del> <ins>The materiality determination process is being assessed for alignment with current SEC requirements — management is expected to confirm status within 72 hours.</ins> Tagged <strong>ASSUMPTION</strong> for board visibility where not yet confirmed.</p>
<h3>5. Recommendations</h3>
<ul>
<li>Establish a formal AI governance policy covering model risk and third-party AI.</li>
<li>Implement an explainability layer for Tier 1 production models.</li>
<li>Update data retention schedules for vendor AI integration logs.</li>
<li>Define bias and fairness testing as a mandatory deployment gate.</li>
<li>Configure human review checkpoints for high-priority AI escalations.</li>
</ul>
<h3>6. Approval &amp; sign-off</h3>
<p>This report has been reviewed by the <del>Alexandra Chen,</del> Head of Internal Audit and is pending authorization from the Chief Audit Executive for distribution.</p>
<p><strong>Head of Internal Audit:</strong> <del>Alexandra Chen</del> <ins>[Head of Internal Audit]</ins> — 12 Apr 2026 — Signed</p>
<p><strong>Chief Audit Executive:</strong> <em>Pending authorization</em></p>
`;
}

interface EditAuthorizePanelProps {
  completed: boolean;
  onProceed: () => void;
}

export default function EditAuthorizePanel({ completed, onProceed }: EditAuthorizePanelProps) {
  const { color, weight, radius } = useTokens();
  const [confirmedReady, setConfirmedReady] = useState(false);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          heading: { levels: [2, 3, 4] },
          strike: false,
        }),
        Underline,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        Placeholder.configure({ placeholder: "Edit the board report…" }),
        TrackInsert,
        TrackDelete,
      ],
      content: buildBoardReportHtml(),
      editable: !completed,
    },
    [completed],
  );

  const canApprove = confirmedReady && !completed;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", minHeight: 0 }}>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          p: "16px",
          gap: "12px",
          overflow: "auto",
        }}
      >
        <Box sx={{ flexShrink: 0 }}>
          <TradAtlasText semanticFont={SF.titleH4Emphasis} sx={{ color: color.type.default, mb: "4px" }}>
            Board report (edit & authorize)
          </TradAtlasText>
          <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
            Insertions appear in{" "}
            <Box component="span" sx={{ color: color.status.success.text, fontWeight: weight.semiBold }}>
              green
            </Box>
            ; removals use{" "}
            <Box
              component="span"
              sx={{ color: color.status.error.text, fontWeight: weight.semiBold, textDecoration: "line-through" }}
            >
              red strikethrough
            </Box>
            . Use the <strong>AI Audit Assistant</strong> on the right to request edits, or change the
            document directly here.
          </TradAtlasText>
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            "& .tiptap ins.track-insert, & .tiptap ins": {
              backgroundColor: color.status.success.background,
              color: color.status.success.text,
              textDecoration: "none",
              padding: "0 2px",
              borderRadius: "2px",
            },
            "& .tiptap del.track-delete, & .tiptap del": {
              color: color.status.error.text,
              backgroundColor: color.status.error.background,
              textDecoration: "line-through",
              padding: "0 2px",
              borderRadius: "2px",
            },
          }}
        >
          {editor ? <TipTapEditorShell editor={editor} /> : null}
        </Box>
      </Box>

      <Box
        sx={{
          flexShrink: 0,
          borderTop: `1px solid ${color.outline.fixed}`,
          background: color.surface.default,
          px: "20px",
          py: "14px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={confirmedReady}
              onChange={(_, v) => setConfirmedReady(v)}
              disabled={completed}
              size="small"
            />
          }
          label={
            <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.default }}>
              I confirm this report is accurate for Audit Committee and board distribution
            </TradAtlasText>
          }
        />
        <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            size="small"
            disabled={completed}
            onClick={() => editor?.chain().focus().undo().run()}
            sx={{ textTransform: "none", ...semanticFontStyle(SF.labelMd) }}
          >
            Undo last edit
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!canApprove}
            onClick={onProceed}
            sx={{ textTransform: "none", fontWeight: weight.semiBold, ...semanticFontStyle(SF.labelMd), borderRadius: radius.md }}
          >
            Approve and authorize final report
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
