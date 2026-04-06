import { useState } from "react";
import { Box, Button, Chip, Divider, TextField } from "@mui/material";
import {
  SearchOutlinedIcon,
  TrendingDownOutlinedIcon,
  DashboardOutlinedIcon,
  ChatBubbleOutlineIcon,
} from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import ContentCard from "@/components/common/ContentCard";
import { SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

const CHAINS = [
  {
    title: "Access Control chain",
    flow:
      'Audit finding AC-2 (Projects) → ERM risk "Unauthorized Access" → 3 vendor assessments → 2 speak-up reports',
  },
  {
    title: "SEC Disclosure chain",
    flow:
      '8-K materiality process gap → no documented cyber risk management disclosure → peer enforcement action',
  },
  {
    title: "Vendor Concentration chain",
    flow:
      "3 critical vendors share architecture → linked to AC-2 finding → no compensating control documented",
  },
];

const TAXONOMY_ROWS = [
  { category: "Compliance", count: 7 },
  { category: "Operational", count: 5 },
  { category: "Reputational", count: 4 },
  { category: "Financial", count: 2 },
  { category: "Strategic", count: 0 },
];

const SEC_ROWS = [
  { label: "8-K materiality determination process", status: "Gap" as const },
  { label: "Risk management disclosure documentation", status: "Partial" as const },
  { label: "Governance oversight structure", status: "Covered" as const },
];

interface SynthesisPanelProps {
  completed: boolean;
  onProceed: () => void;
}

export default function SynthesisPanel({ completed, onProceed }: SynthesisPanelProps) {
  const { color, weight, radius } = useTokens();
  const [comments, setComments] = useState("");

  const secChip = (status: "Gap" | "Partial" | "Covered") => {
    const map = {
      Gap: { bg: color.status.error.background, fg: color.status.error.text, border: color.status.error.default },
      Partial: { bg: color.status.warning.background, fg: color.status.warning.text, border: color.status.warning.default },
      Covered: { bg: color.status.success.background, fg: color.status.success.text, border: color.status.success.default },
    }[status];
    return (
      <Chip
        label={status}
        size="small"
        sx={{
          ...semanticFontStyle(SF.labelMdCompact),
          fontWeight: weight.semiBold,
          backgroundColor: map.bg,
          color: map.fg,
          border: `1px solid ${map.border}`,
        }}
      />
    );
  };

  return (
    <>
      <Box>
        <TradAtlasText semanticFont={SF.titleH3Emphasis} sx={{ color: color.type.default, mb: "8px" }}>
          Synthesis
        </TradAtlasText>
        <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
          AI has correlated evidence across domains, applied materiality filters, mapped findings to
          the company risk taxonomy, and compared posture to SEC disclosure expectations. Review the
          four sections below, add comments, then approve to continue.
        </TradAtlasText>
      </Box>

      <Divider sx={{ borderColor: color.outline.fixed }} />

      {/* 1/4 */}
      <Box>
        <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "4px" }}>
          1/4 — Correlating signals across domains
        </TradAtlasText>
        <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted, mb: "12px" }}>
          Mapping relationships between findings across all 8 sources. Cross-domain chains identified.
        </TradAtlasText>
        <ContentCard>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {CHAINS.map((c, i) => (
              <Box
                key={c.title}
                sx={{
                  py: "14px",
                  borderBottom: i < CHAINS.length - 1 ? `1px solid ${color.outline.fixed}` : "none",
                }}
              >
                <TradAtlasText semanticFont={SF.textSmEmphasis} sx={{ color: color.type.default, mb: "6px" }}>
                  {c.title}
                </TradAtlasText>
                <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted, lineHeight: 1.65 }}>
                  {c.flow}
                </TradAtlasText>
              </Box>
            ))}
          </Box>
        </ContentCard>
      </Box>

      {/* 2/4 */}
      <Box>
        <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "4px" }}>
          2/4 — Filtering by materiality and relevance
        </TradAtlasText>
        <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted, mb: "12px" }}>
          Applying thresholds across 312 data points. Low-relevance items deprioritised but not excluded
          — available on request.
        </TradAtlasText>
        <ContentCard>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: "20px" }}>
            {[
              {
                icon: <SearchOutlinedIcon sx={{ fontSize: 28, color: color.action.primary.default }} />,
                value: "18",
                label: "Priority findings",
                sub: ">$500K or regulatory",
              },
              {
                icon: <TrendingDownOutlinedIcon sx={{ fontSize: 28, color: color.type.muted }} />,
                value: "43",
                label: "Deprioritised",
                sub: "below threshold",
              },
              {
                icon: <DashboardOutlinedIcon sx={{ fontSize: 28, color: color.type.muted }} />,
                value: "251",
                label: "Context only",
                sub: "retained, not surfaced",
              },
            ].map((col) => (
              <Box key={col.label} sx={{ textAlign: "center", p: "8px" }}>
                <Box sx={{ mb: "8px", display: "flex", justifyContent: "center" }}>{col.icon}</Box>
                <TradAtlasText semanticFont={SF.titleH2Emphasis} sx={{ color: color.type.default, display: "block" }}>
                  {col.value}
                </TradAtlasText>
                <TradAtlasText semanticFont={SF.textSmEmphasis} sx={{ color: color.type.default, display: "block", mt: "4px" }}>
                  {col.label}
                </TradAtlasText>
                <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
                  {col.sub}
                </TradAtlasText>
              </Box>
            ))}
          </Box>
        </ContentCard>
      </Box>

      {/* 3/4 */}
      <Box>
        <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "4px" }}>
          3/4 — Categorising against company risk taxonomy
        </TradAtlasText>
        <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted, mb: "12px" }}>
          Cross-category exposure flagged — Access Control weakness appears in Compliance, Operational,
          and Reputational simultaneously.
        </TradAtlasText>
        <ContentCard>
          <Box sx={{ borderRadius: radius.md, border: `1px solid ${color.outline.fixed}`, overflow: "hidden" }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                px: "16px",
                py: "8px",
                background: color.surface.subtle,
                borderBottom: `1px solid ${color.outline.fixed}`,
              }}
            >
              {["Category", "Number of findings"].map((h) => (
                <TradAtlasText key={h} semanticFont={SF.textSmUppercase} sx={{ color: color.type.muted }}>
                  {h}
                </TradAtlasText>
              ))}
            </Box>
            {TAXONOMY_ROWS.map((row, i) => (
              <Box
                key={row.category}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  px: "16px",
                  py: "10px",
                  borderBottom: i < TAXONOMY_ROWS.length - 1 ? `1px solid ${color.outline.fixed}` : "none",
                  alignItems: "center",
                }}
              >
                <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.default }}>
                  {row.category}
                </TradAtlasText>
                <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted, fontWeight: weight.semiBold }}>
                  {row.count}
                </TradAtlasText>
              </Box>
            ))}
          </Box>
        </ContentCard>
      </Box>

      {/* 4/4 */}
      <Box>
        <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "4px" }}>
          4/4 — Comparing posture against SEC disclosure requirements
        </TradAtlasText>
        <ContentCard>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {SEC_ROWS.map((row, i) => (
              <Box
                key={row.label}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  py: "12px",
                  borderBottom: i < SEC_ROWS.length - 1 ? `1px solid ${color.outline.fixed}` : "none",
                }}
              >
                <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.default }}>
                  {row.label}
                </TradAtlasText>
                {secChip(row.status)}
              </Box>
            ))}
          </Box>
        </ContentCard>
      </Box>

      {/* Reviewer comments */}
      <ContentCard>
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "12px" }}>
          <ChatBubbleOutlineIcon sx={{ fontSize: 18, color: color.action.primary.default }} />
          <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default }}>
            Reviewer comments & edits
          </TradAtlasText>
        </Box>
        <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted, mb: "12px" }}>
          Capture questions, caveats, or edits for the workpaper file. This does not block approval.
        </TradAtlasText>
        <TextField
          multiline
          minRows={4}
          fullWidth
          disabled={completed}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Add comments for the audit file…"
          variant="outlined"
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              ...semanticFontStyle(SF.textMd),
            },
          }}
        />
      </ContentCard>

      {!completed && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onProceed}
            sx={{ textTransform: "none", ...semanticFontStyle(SF.textMdEmphasis) }}
          >
            Approve synthesis & continue
          </Button>
        </Box>
      )}
    </>
  );
}
