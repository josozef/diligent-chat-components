import { Box, Button } from "@mui/material";

import TradAtlasText from "@/components/common/TradAtlasText";
import { SF } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

import AdaptiveCard from "./AdaptiveCard";
import { useWorkflowConversation } from "../WorkflowConversationContext";

export default function TriggerCard() {
  const { color, weight } = useTokens();
  const { state, startWorkflow, cardAnchorId } = useWorkflowConversation();
  const started = state.triggerAcknowledged;

  return (
    <AdaptiveCard
      title="Director resignation detected"
      subtitle={`Workday · ${state.entity.name}`}
      status={started ? "resolved" : "awaiting"}
      statusLabel={started ? "Workflow started" : "Action needed"}
      anchorId={cardAnchorId("identify-candidate")}
      body={
        <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.default }}>
            {state.trigger.framing}
          </TradAtlasText>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "140px 1fr",
              rowGap: "6px",
              columnGap: "12px",
            }}
          >
            <Fact label="Departing">
              {state.departingDirector?.name} · {state.departingDirector?.title}
            </Fact>
            <Fact label="Last working day">May 17, 2026</Fact>
            <Fact label="Filing deadline">
              {state.trigger.filingDeadline} · ACRA Form 45
            </Fact>
            <Fact label="Jurisdiction">
              Singapore · Companies Act, Cap. 50 · local-director rule applies
            </Fact>
          </Box>
        </Box>
      }
      footer={
        started ? (
          <Button
            variant="text"
            size="small"
            disabled
            sx={{
              textTransform: "none",
              fontWeight: weight.semiBold,
              color: color.type.muted,
            }}
          >
            Workflow in progress
          </Button>
        ) : (
          <>
            <Button
              variant="text"
              size="small"
              sx={{
                textTransform: "none",
                color: color.type.muted,
                fontWeight: weight.medium,
              }}
            >
              Snooze 24h
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={startWorkflow}
              sx={{ textTransform: "none", fontWeight: weight.semiBold }}
            >
              Start the appointment
            </Button>
          </>
        )
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
