import { Box, Button, Chip, Divider, LinearProgress } from "@mui/material";
import TradAtlasText from "@/components/common/TradAtlasText";
import ContentCard from "@/components/common/ContentCard";
import { SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { atlasFontFamilyMono } from "@/tokens/atlasLight";
import { useTokens } from "../../../hooks/useTokens";

const ISSUES = [
  { id: "FIND-001", title: "Privileged access reviews overdue", owner: "Alex Thompson", dueDate: "Apr 18", status: "In progress" as const, priority: "High" as const },
  { id: "FIND-002", title: "Vendor SOC 2 re-certification gap", owner: "Rachel Lee", dueDate: "Apr 25", status: "Open" as const, priority: "High" as const },
  { id: "FIND-003", title: "Incident response playbook untested", owner: "James Park", dueDate: "May 2", status: "Open" as const, priority: "Medium" as const },
  { id: "FIND-004", title: "Network segmentation rule drift", owner: "Mike Rodriguez", dueDate: "Apr 30", status: "In progress" as const, priority: "Medium" as const },
  { id: "FIND-005", title: "Data classification gaps in staging", owner: "Tom Nguyen", dueDate: "May 9", status: "Open" as const, priority: "Low" as const },
];

interface RemediationTrackingPanelProps {
  completed: boolean;
  onProceed: () => void;
}

export default function RemediationTrackingPanel({ completed, onProceed }: RemediationTrackingPanelProps) {
  const { color, weight, radius } = useTokens();

  const inProgress = ISSUES.filter((i) => i.status === "In progress").length;
  const open = ISSUES.filter((i) => i.status === "Open").length;

  return (
    <>
      <Box>
        <TradAtlasText semanticFont={SF.titleH3Emphasis} sx={{ color: color.type.default, mb: "8px" }}>
          Veracity scoring
        </TradAtlasText>
        <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
          Validate finding quality, remediation plans, and residual risk scores before final
          approval. Track owners and due dates for management responses tied to the assurance
          opinion.
        </TradAtlasText>
      </Box>

      <Divider sx={{ borderColor: color.outline.fixed }} />

      <ContentCard>
        <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "16px" }}>
          Remediation summary
        </TradAtlasText>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px", mb: "16px" }}>
          {[
            { label: "Total findings", value: String(ISSUES.length), valueColor: color.type.default },
            { label: "In progress", value: String(inProgress), valueColor: color.action.primary.default },
            { label: "Open", value: String(open), valueColor: color.status.warning.text },
            { label: "Closed", value: "0", valueColor: color.status.success.text },
          ].map((d) => (
            <Box key={d.label}>
              <TradAtlasText semanticFont={SF.textSmUppercase} sx={{ color: color.type.muted, mb: "4px" }}>
                {d.label}
              </TradAtlasText>
              <TradAtlasText semanticFont={SF.titleH4Emphasis} sx={{ color: d.valueColor }}>
                {d.value}
              </TradAtlasText>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <LinearProgress
            variant="determinate"
            value={(inProgress / ISSUES.length) * 100}
            sx={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              backgroundColor: color.outline.fixed,
              "& .MuiLinearProgress-bar": { backgroundColor: color.action.primary.default, borderRadius: 2 },
            }}
          />
          <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
            {Math.round((inProgress / ISSUES.length) * 100)}% in progress
          </TradAtlasText>
        </Box>
      </ContentCard>

      <ContentCard>
        <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "16px" }}>
          Findings & action plans
        </TradAtlasText>
        <Box sx={{ borderRadius: radius.md, border: `1px solid ${color.outline.fixed}`, overflow: "hidden" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "0.7fr 2fr 1fr 0.7fr 0.8fr 0.8fr",
              px: "16px",
              py: "8px",
              background: color.surface.subtle,
              borderBottom: `1px solid ${color.outline.fixed}`,
            }}
          >
            {["ID", "Finding", "Owner", "Due", "Status", "Priority"].map((h) => (
              <TradAtlasText key={h} semanticFont={SF.textSmUppercase} sx={{ color: color.type.muted }}>
                {h}
              </TradAtlasText>
            ))}
          </Box>
          {ISSUES.map((row, i) => (
            <Box
              key={row.id}
              sx={{
                display: "grid",
                gridTemplateColumns: "0.7fr 2fr 1fr 0.7fr 0.8fr 0.8fr",
                px: "16px",
                py: "10px",
                borderBottom: i < ISSUES.length - 1 ? `1px solid ${color.outline.fixed}` : "none",
                alignItems: "center",
              }}
            >
              <TradAtlasText semanticFont={SF.textSm} sx={{ fontFamily: atlasFontFamilyMono, color: color.type.muted }}>{row.id}</TradAtlasText>
              <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.default, fontWeight: weight.medium }}>{row.title}</TradAtlasText>
              <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>{row.owner}</TradAtlasText>
              <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>{row.dueDate}</TradAtlasText>
              <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: row.status === "In progress" ? color.action.primary.default : color.status.warning.default,
                    flexShrink: 0,
                  }}
                />
                <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.default }}>{row.status}</TradAtlasText>
              </Box>
              <Chip
                label={row.priority}
                size="small"
                color={row.priority === "High" ? "warning" : row.priority === "Medium" ? "default" : "success"}
                sx={{ fontWeight: weight.semiBold, ...semanticFontStyle(SF.textMicro), width: "fit-content" }}
              />
            </Box>
          ))}
        </Box>
      </ContentCard>

      {!completed && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onProceed}
            sx={{ textTransform: "none", ...semanticFontStyle(SF.textMdEmphasis) }}
          >
            Proceed to approve
          </Button>
        </Box>
      )}
    </>
  );
}
