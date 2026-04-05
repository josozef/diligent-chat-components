import { Box, Button, Chip, Divider, LinearProgress } from "@mui/material";
import TradAtlasText from "@/components/common/TradAtlasText";
import ContentCard from "@/components/common/ContentCard";
import { SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { atlasFontFamilyMono } from "@/tokens/atlasLight";
import { useTokens } from "../../../hooks/useTokens";

const FAILED_CONTROLS = [
  { id: "AC-7", name: "Endpoint Protection", finding: "Unpatched kernel driver" },
  { id: "RA-5", name: "Vulnerability Scanning", finding: "Detection delay > 24hrs" },
  { id: "SI-2", name: "Flaw Remediation", finding: "Patch not applied within SLA" },
  { id: "SA-9", name: "External System Services", finding: "Vendor patch dependency" },
];

const ITSM_TICKETS = [
  { id: "INC-2847", title: "Emergency patch deployment", priority: "Critical" as const, status: "In Progress" },
  { id: "INC-2848", title: "Asset isolation review", priority: "High" as const, status: "Open" },
  { id: "INC-2849", title: "Compensating controls", priority: "High" as const, status: "Open" },
  { id: "CHG-1923", title: "Emergency change request", priority: "Critical" as const, status: "Approved" },
  { id: "PRB-0847", title: "Root cause analysis", priority: "Medium" as const, status: "Open" },
];

interface RemediationPanelProps {
  completed: boolean;
  onProceed: () => void;
}

export default function RemediationPanel({ completed, onProceed }: RemediationPanelProps) {
  const { color, weight, radius } = useTokens();
  const ticketsCreated = 2;

  return (
    <>
      <Box>
        <TradAtlasText semanticFont={SF.titleH3Emphasis} sx={{ color: color.type.default, mb: "8px" }}>
          Remediation plan
        </TradAtlasText>
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <LinearProgress
            variant="determinate"
            value={(ticketsCreated / ITSM_TICKETS.length) * 100}
            sx={{
              flex: 1,
              maxWidth: 200,
              height: 4,
              borderRadius: 2,
              backgroundColor: color.outline.fixed,
              "& .MuiLinearProgress-bar": { backgroundColor: color.action.primary.default, borderRadius: 2 },
            }}
          />
          <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
            {ticketsCreated} of {ITSM_TICKETS.length} tickets created
          </TradAtlasText>
        </Box>
      </Box>

      <Divider sx={{ borderColor: color.outline.fixed }} />

      {/* Failed controls */}
      <ContentCard>
        <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "12px" }}>
          Failed controls linked
        </TradAtlasText>
        {FAILED_CONTROLS.map((control) => (
          <Box
            key={control.id}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: "10px",
              borderBottom: `1px solid ${color.outline.fixed}`,
              "&:last-child": { borderBottom: "none" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <TradAtlasText
                semanticFont={SF.textSm}
                sx={{ color: color.type.muted, fontFamily: atlasFontFamilyMono, minWidth: 48 }}
              >
                {control.id}
              </TradAtlasText>
              <TradAtlasText semanticFont={SF.textMd} sx={{ fontWeight: weight.medium, color: color.type.default }}>
                {control.name}
              </TradAtlasText>
            </Box>
            <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
              {control.finding}
            </TradAtlasText>
          </Box>
        ))}
      </ContentCard>

      {/* ITSM tickets */}
      <ContentCard>
        <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "12px" }}>
          ITSM tickets
        </TradAtlasText>
        <Box sx={{ borderRadius: radius.md, border: `1px solid ${color.outline.fixed}`, overflow: "hidden" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 2.5fr 0.8fr 0.8fr",
              px: "16px",
              py: "8px",
              background: color.surface.subtle,
              borderBottom: `1px solid ${color.outline.fixed}`,
            }}
          >
            {["ID", "Title", "Priority", "Status"].map((h) => (
              <TradAtlasText key={h} semanticFont={SF.textSmUppercase} sx={{ color: color.type.muted }}>
                {h}
              </TradAtlasText>
            ))}
          </Box>
          {ITSM_TICKETS.map((ticket, i) => (
            <Box
              key={ticket.id}
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 2.5fr 0.8fr 0.8fr",
                px: "16px",
                py: "10px",
                borderBottom: i < ITSM_TICKETS.length - 1 ? `1px solid ${color.outline.fixed}` : "none",
                alignItems: "center",
              }}
            >
              <TradAtlasText semanticFont={SF.textSm} sx={{ fontFamily: atlasFontFamilyMono, color: color.type.muted }}>
                {ticket.id}
              </TradAtlasText>
              <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.default }}>
                {ticket.title}
              </TradAtlasText>
              <Chip
                label={ticket.priority}
                size="small"
                color={ticket.priority === "Critical" ? "error" : ticket.priority === "High" ? "warning" : "default"}
                sx={{ fontWeight: weight.semiBold, ...semanticFontStyle(SF.textMicro), height: 22 }}
              />
              <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
                {ticket.status}
              </TradAtlasText>
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
            Continue to validation
          </Button>
        </Box>
      )}
    </>
  );
}
