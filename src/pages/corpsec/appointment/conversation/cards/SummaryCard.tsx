import { Box, Button } from "@mui/material";

import { CheckCircleIcon, FactCheckOutlinedIcon } from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import { SF } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

import AdaptiveCard from "./AdaptiveCard";
import { useWorkflowConversation } from "../WorkflowConversationContext";

export default function SummaryCard() {
  const { color, weight } = useTokens();
  const { state, openAsset } = useWorkflowConversation();

  return (
    <AdaptiveCard
      title="Appointment complete"
      subtitle={`${state.entity.name} · ACRA filing accepted`}
      status="resolved"
      statusLabel="Done"
      body={
        <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "140px 1fr",
              rowGap: "6px",
              columnGap: "12px",
            }}
          >
            <Fact label="Director of record">
              {state.selectedCandidate?.name} ({state.selectedCandidate?.title})
            </Fact>
            <Fact label="Effective from">{state.appointmentEffectiveDate}</Fact>
            <Fact label="Filing">
              ACRA Form 45 lodged via BizFile+
            </Fact>
            <Fact label="Entity register">Updated — Acme group records in sync</Fact>
            <Fact label="Approvals">
              {state.agentic.votes.length}/{state.agentic.votes.length} board
              members approved
            </Fact>
          </Box>
          <Box
            sx={{
              padding: "10px 12px",
              background: color.status.success.background,
              border: `1px solid ${color.status.success.default}`,
              borderRadius: "6px",
              color: color.status.success.text,
              fontWeight: weight.semiBold,
              fontSize: "13px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 16 }} />
            Audit trail attached — every step, signature, and timestamp
            captured.
          </Box>
        </Box>
      }
      footer={
        <Button
          variant="outlined"
          size="small"
          startIcon={<FactCheckOutlinedIcon sx={{ fontSize: 16 }} />}
          onClick={() => openAsset("form45-notification")}
          sx={{
            textTransform: "none",
            fontWeight: weight.semiBold,
            borderColor: color.outline.fixed,
          }}
        >
          View Form 45 (filed)
        </Button>
      }
    />
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  const { color, weight } = useTokens();
  return (
    <>
      <TradAtlasText
        semanticFont={SF.textSm}
        sx={{ color: color.type.muted, fontWeight: weight.semiBold }}
      >
        {label}
      </TradAtlasText>
      <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.default }}>
        {children}
      </TradAtlasText>
    </>
  );
}
