import { Box, Button, Divider } from "@mui/material";
import { CheckCircleIcon } from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import ContentCard from "@/components/common/ContentCard";
import { SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "../../../hooks/useTokens";

const TIMELINE_EVENTS = [
  { time: "2:10 PM", event: "CVE-2026-1847 detected by vulnerability scanner" },
  { time: "2:14 PM", event: "Impact assessment completed — affected systems mapped" },
  { time: "2:18 PM", event: "Stakeholder notifications sent to 4 recipients" },
  { time: "2:25 PM", event: "5 ITSM tickets created, emergency change approved" },
  { time: "3:45 PM", event: "Third-party review completed — CrowdStrike patch verified" },
  { time: "6:10 PM", event: "All 12 assets patched — evidence pack assembled" },
  { time: "6:30 PM", event: "Risk entries re-scored — residual risk: Low" },
];

const MEMO_SECTIONS = [
  { heading: "Incident summary", body: "A critical vulnerability (CVE-2026-1847, CVSS 9.8) was detected in CrowdStrike Falcon Sensor v7.x affecting 12 IT assets across Financial Reporting, HR Management, and Customer Portal systems." },
  { heading: "Business impact", body: "No data breach confirmed. 3 production systems and 4 compliance frameworks (SOC 2, ISO 27001, NIST CSF, PCI DSS) were at risk. The incident met the materiality disclosure threshold." },
  { heading: "Response timeline", body: "Detection to full remediation: 4 hours 20 minutes. All SLA targets met. Stakeholders were notified within 8 minutes of detection." },
  { heading: "Governance assessment", body: "Controls, third-party risk program, and incident response functioned as designed. Two control gaps identified (detection delay, vendor patch dependency) have been addressed through updated SLAs." },
  { heading: "Residual risk", body: "Post-remediation residual risk has been re-scored to Low across all affected entries. No outstanding remediation tasks remain." },
];

interface BoardBriefingPanelProps {
  completed: boolean;
  onProceed: () => void;
}

export default function BoardBriefingPanel({ completed, onProceed }: BoardBriefingPanelProps) {
  const { color } = useTokens();

  return (
    <>
      <Box>
        <TradAtlasText semanticFont={SF.titleH3Emphasis} sx={{ color: color.type.default, mb: "8px" }}>
          Board briefing
        </TradAtlasText>
        <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
          A board-ready memo has been auto-generated from the incident data. All supporting records are linked for traceability.
        </TradAtlasText>
      </Box>

      <Divider sx={{ borderColor: color.outline.fixed }} />

      {/* Memo */}
      <ContentCard>
        <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "16px" }}>
          Board memo — CVE-2026-1847
        </TradAtlasText>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {MEMO_SECTIONS.map((section) => (
            <Box key={section.heading}>
              <TradAtlasText semanticFont={SF.textSmEmphasis} sx={{ color: color.type.default, mb: "4px" }}>
                {section.heading}
              </TradAtlasText>
              <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
                {section.body}
              </TradAtlasText>
            </Box>
          ))}
        </Box>
      </ContentCard>

      {/* Timeline */}
      <ContentCard>
        <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "16px" }}>
          Incident timeline
        </TradAtlasText>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {TIMELINE_EVENTS.map((evt, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                py: "8px",
                position: "relative",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: 18, flexShrink: 0 }}>
                <CheckCircleIcon sx={{ fontSize: 16, color: color.status.success.default }} />
                {i < TIMELINE_EVENTS.length - 1 && (
                  <Box
                    sx={{
                      width: 1,
                      flex: 1,
                      minHeight: 16,
                      background: color.outline.fixed,
                      mt: "4px",
                    }}
                  />
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

      {!completed && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onProceed}
            sx={{ textTransform: "none", ...semanticFontStyle(SF.textMdEmphasis) }}
          >
            Complete investigation
          </Button>
        </Box>
      )}
    </>
  );
}
