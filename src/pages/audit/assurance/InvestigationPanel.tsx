import { Box, Button, Divider } from "@mui/material";
import { AutoAwesomeOutlinedIcon } from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import ContentCard from "@/components/common/ContentCard";
import { SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "../../../hooks/useTokens";

interface InvestigationPanelProps {
  completed: boolean;
  onProceed: () => void;
}

export default function InvestigationPanel({ completed, onProceed }: InvestigationPanelProps) {
  const { color, weight } = useTokens();

  return (
    <>
      <Box>
        <TradAtlasText semanticFont={SF.titleH3Emphasis} sx={{ color: color.type.default, mb: "8px" }}>
          Investigation
        </TradAtlasText>
        <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
          Confirm the request and objectives before defining scope, evidence domains, and agent
          authorization for the cybersecurity assurance report.
        </TradAtlasText>
      </Box>

      <Divider sx={{ borderColor: color.outline.fixed }} />

      <ContentCard>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: "12px", mb: "16px" }}>
          <AutoAwesomeOutlinedIcon sx={{ fontSize: 18, color: color.action.primary.default, mt: "2px" }} />
          <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.default }}>
            <TradAtlasText component="span" semanticFont={SF.textMd} sx={{ fontWeight: weight.semiBold }}>
              Thomas Chen (Audit Committee)
            </TradAtlasText>{" "}
            requested a cybersecurity control posture assessment and SEC disclosure readiness review
            for the Thursday committee meeting. The engagement is aligned to the risk-based audit
            plan and enterprise IT risks (ERM-IT-014, ERM-TP-003).
          </TradAtlasText>
        </Box>
        <Divider sx={{ borderColor: color.outline.fixed, my: "12px" }} />
        <TradAtlasText semanticFont={SF.labelMd} sx={{ color: color.type.muted }}>
          Next: set clarifying parameters (scope, timeline, data domains) and pre-selected controls
          before authorizing agents to gather evidence packs.
        </TradAtlasText>
      </ContentCard>

      {!completed && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onProceed}
            sx={{ textTransform: "none", ...semanticFontStyle(SF.textMdEmphasis) }}
          >
            Proceed to scope
          </Button>
        </Box>
      )}
    </>
  );
}
