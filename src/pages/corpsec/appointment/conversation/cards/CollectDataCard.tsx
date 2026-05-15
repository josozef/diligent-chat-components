import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";

import { CheckCircleIcon, EditOutlinedIcon } from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import { SF } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

import AdaptiveCard from "./AdaptiveCard";
import { useWorkflowConversation } from "../WorkflowConversationContext";

const NRIC_PREFILL = "S8412934J";
const EFFECTIVE_PREFILL = "2026-05-18";

export default function CollectDataCard() {
  const { color, weight } = useTokens();
  const {
    state,
    submitAppointmentData,
    resetAppointmentData,
    cardAnchorId,
  } = useWorkflowConversation();
  const submitted = state.appointmentNric !== null;

  const [editing, setEditing] = useState(false);
  const [nric, setNric] = useState(state.appointmentNric ?? NRIC_PREFILL);
  const [effective, setEffective] = useState(
    state.appointmentEffectiveDate ?? EFFECTIVE_PREFILL,
  );

  const showForm = !submitted || editing;

  const onConfirm = () => {
    submitAppointmentData(nric.trim() || NRIC_PREFILL, effective || EFFECTIVE_PREFILL);
    setEditing(false);
  };

  return (
    <AdaptiveCard
      title="Appointment particulars"
      subtitle="Required for Form 45 + Consent to Act"
      status={submitted && !editing ? "resolved" : "awaiting"}
      statusLabel={submitted && !editing ? "Confirmed" : "Confirm & continue"}
      anchorId={cardAnchorId("collect-data")}
      body={
        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {showForm ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              <TextField
                size="small"
                label="NRIC"
                value={nric}
                onChange={(e) => setNric(e.target.value)}
                fullWidth
              />
              <TextField
                size="small"
                label="Effective date"
                type="date"
                value={effective}
                onChange={(e) => setEffective(e.target.value)}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <Box
                sx={{
                  gridColumn: "1 / -1",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                <TradAtlasText
                  semanticFont={SF.textXs}
                  sx={{ color: color.type.muted }}
                >
                  Appointee:{" "}
                  <Box component="strong" sx={{ color: color.type.default }}>
                    {state.selectedCandidate?.name ?? "—"}
                  </Box>
                </TradAtlasText>
                <TradAtlasText
                  semanticFont={SF.textXs}
                  sx={{ color: color.type.muted }}
                >
                  We pre-filled the NRIC from Workday's gap-filled record. Edit
                  if you need to override before sending the consent.
                </TradAtlasText>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "120px 1fr",
                rowGap: "6px",
                columnGap: "12px",
              }}
            >
              <Fact label="Appointee">{state.selectedCandidate?.name ?? "—"}</Fact>
              <Fact label="NRIC">{state.appointmentNric}</Fact>
              <Fact label="Effective date">{state.appointmentEffectiveDate}</Fact>
            </Box>
          )}
        </Box>
      }
      footer={
        showForm ? (
          <>
            {submitted ? (
              <Button
                variant="text"
                size="small"
                onClick={() => setEditing(false)}
                sx={{
                  textTransform: "none",
                  color: color.type.muted,
                  fontWeight: weight.medium,
                }}
              >
                Cancel
              </Button>
            ) : null}
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<CheckCircleIcon sx={{ fontSize: 18 }} />}
              onClick={onConfirm}
              sx={{ textTransform: "none", fontWeight: weight.semiBold }}
            >
              Confirm
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="text"
              size="small"
              startIcon={<EditOutlinedIcon sx={{ fontSize: 16 }} />}
              onClick={() => {
                setNric(state.appointmentNric ?? NRIC_PREFILL);
                setEffective(state.appointmentEffectiveDate ?? EFFECTIVE_PREFILL);
                resetAppointmentData();
                setEditing(true);
              }}
              sx={{
                textTransform: "none",
                color: color.type.muted,
                fontWeight: weight.medium,
              }}
            >
              Edit
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
