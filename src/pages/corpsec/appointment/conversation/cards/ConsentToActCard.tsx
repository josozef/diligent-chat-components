import { Box, Button } from "@mui/material";

import {
  CheckCircleIcon,
  SendOutlinedIcon,
  VisibilityOutlinedIcon,
} from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import { SF } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

import AdaptiveCard, { type AdaptiveCardStatus } from "./AdaptiveCard";
import { useWorkflowConversation } from "../WorkflowConversationContext";
import FileChip from "./FileChip";

export default function ConsentToActCard() {
  const { color, weight } = useTokens();
  const { state, sendConsent, signConsent, openAsset } = useWorkflowConversation();

  const sent = state.consentDocument.sent;
  const signed = state.consentDocument.signedAt !== null;

  let status: AdaptiveCardStatus = "awaiting";
  let statusLabel = "Ready to send";
  if (signed) {
    status = "resolved";
    statusLabel = "Signed";
  } else if (sent) {
    status = "running";
    statusLabel = "Sent · awaiting signature";
  }

  const appointee = state.selectedCandidate;

  return (
    <AdaptiveCard
      title="Consent to Act as Director"
      subtitle="Companies Act s.145(5) · Singapore"
      status={status}
      statusLabel={statusLabel}
      body={
        <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              fontSize: "12px",
              color: color.type.muted,
            }}
          >
            <Meta label="Appointee" value={appointee?.name ?? "—"} />
            <Meta label="NRIC" value={state.appointmentNric ?? "—"} />
            <Meta label="Effective" value={state.appointmentEffectiveDate ?? "—"} />
          </Box>

          <FileChip
            label={`Consent to Act — ${appointee?.name ?? "Appointee"}.docx`}
            metaLine="Form 45 · Singapore Companies Act"
            onClick={() => openAsset("consent-to-act")}
          />

          {signed ? (
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: color.status.success.text,
                background: color.status.success.background,
                padding: "6px 10px",
                borderRadius: "6px",
                width: "fit-content",
                fontWeight: weight.semiBold,
                fontSize: "13px",
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 16 }} />
              Signed and returned ·{" "}
              {new Date(state.consentDocument.signedAt!).toLocaleString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                month: "short",
                day: "numeric",
              })}
            </Box>
          ) : null}
        </Box>
      }
      footer={
        signed ? (
          <Button
            variant="text"
            size="small"
            startIcon={<VisibilityOutlinedIcon sx={{ fontSize: 16 }} />}
            onClick={() => openAsset("consent-to-act")}
            sx={{
              textTransform: "none",
              color: color.type.muted,
              fontWeight: weight.medium,
            }}
          >
            View signed copy
          </Button>
        ) : sent ? (
          <>
            <Button
              variant="text"
              size="small"
              startIcon={<VisibilityOutlinedIcon sx={{ fontSize: 16 }} />}
              onClick={() => openAsset("consent-to-act")}
              sx={{
                textTransform: "none",
                color: color.type.muted,
                fontWeight: weight.medium,
              }}
            >
              Open document
            </Button>
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<CheckCircleIcon sx={{ fontSize: 18 }} />}
              onClick={signConsent}
              sx={{ textTransform: "none", fontWeight: weight.semiBold }}
            >
              Simulate signature
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outlined"
              size="small"
              startIcon={<VisibilityOutlinedIcon sx={{ fontSize: 16 }} />}
              onClick={() => openAsset("consent-to-act")}
              sx={{
                textTransform: "none",
                fontWeight: weight.semiBold,
                borderColor: color.outline.fixed,
              }}
            >
              Review document
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<SendOutlinedIcon sx={{ fontSize: 18 }} />}
              onClick={sendConsent}
              sx={{ textTransform: "none", fontWeight: weight.semiBold }}
            >
              Send to {appointee?.name?.split(" ")[0] ?? "appointee"}
            </Button>
          </>
        )
      }
    />
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  const { color, weight } = useTokens();
  return (
    <TradAtlasText semanticFont={SF.textXs} sx={{ color: color.type.muted }}>
      {label}:{" "}
      <Box component="strong" sx={{ color: color.type.default, fontWeight: weight.semiBold }}>
        {value}
      </Box>
    </TradAtlasText>
  );
}
