import { useState } from "react";
import { Box, Button, Chip } from "@mui/material";
import { CheckCircleIcon, WarningAmberIcon } from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import SectionHeader from "@/components/common/SectionHeader";
import IdeTabs from "@/components/common/IdeTabs";
import type { TabDef } from "@/components/common/IdeTabs";
import { AtlasFormField } from "@/components/form";
import { SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";
import ConsentToActEditor from "./ConsentToActEditor";
import type { WorkflowStep } from "./AppointmentWorkspace";

export default function CollectAppointmentDataTabs({
  steps,
  selectedCandidate,
  entitiesComplete,
  consentComplete,
  appointmentNric,
  appointmentEffectiveDate,
  onEntitiesComplete,
  onConsentComplete,
  onReplaceConsentDocument,
}: {
  steps: WorkflowStep[];
  selectedCandidate: string | null;
  entitiesComplete: boolean;
  consentComplete: boolean;
  appointmentNric: string | null;
  appointmentEffectiveDate: string | null;
  onEntitiesComplete: (payload: { nric: string; effectiveDate: string }) => void;
  onConsentComplete: () => void;
  onReplaceConsentDocument: (file: File) => void;
}) {
  const [tab, setTab] = useState(0);

  const tabs: TabDef[] = [
    { label: "Appointee details", done: entitiesComplete },
    { label: "Consent to act", done: consentComplete },
  ];

  const appointee = selectedCandidate ?? "";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <IdeTabs tabs={tabs} active={tab} onChange={setTab} />
      <Box sx={{ flex: 1, overflow: "auto", p: "24px" }}>
        {tab === 0 ? (
          <AppointeeDetailsTab
            steps={steps}
            appointee={appointee}
            entitiesComplete={entitiesComplete}
            appointmentNric={appointmentNric}
            appointmentEffectiveDate={appointmentEffectiveDate}
            onEntitiesComplete={onEntitiesComplete}
          />
        ) : appointee ? (
          <ConsentToActEditor
            appointeeName={appointee}
            appointeeNric={appointmentNric}
            effectiveDate={appointmentEffectiveDate}
            onReplaceDocument={onReplaceConsentDocument}
            onSendForSignature={onConsentComplete}
            signatureSent={consentComplete}
          />
        ) : (
          <TradAtlasText semanticFont={SF.labelMd} sx={{ color: "text.secondary" }}>
            Select an appointee first.
          </TradAtlasText>
        )}
      </Box>
    </Box>
  );
}

function AppointeeDetailsTab({
  steps,
  appointee,
  entitiesComplete,
  appointmentNric,
  appointmentEffectiveDate,
  onEntitiesComplete,
}: {
  steps: WorkflowStep[];
  appointee: string;
  entitiesComplete: boolean;
  appointmentNric: string | null;
  appointmentEffectiveDate: string | null;
  onEntitiesComplete: (payload: { nric: string; effectiveDate: string }) => void;
}) {
  const { color, weight, radius } = useTokens();
  const [nric, setNric] = useState(appointmentNric ?? "");
  const [effectiveDate, setEffectiveDate] = useState(appointmentEffectiveDate ?? "");
  const [nricError, setNricError] = useState<string | null>(null);

  const handleSave = () => {
    if (!nric.trim()) {
      setNricError("NRIC is required.");
      return;
    }
    setNricError(null);
    onEntitiesComplete({ nric: nric.trim(), effectiveDate: effectiveDate || "TBC" });
  };

  const step = steps.find((s) => s.id === "collect-data");
  const statusLabel =
    step?.status === "completed" ? "COMPLETE" : step?.status === "in_progress" ? "IN PROGRESS" : "NOT STARTED";

  return (
    <Box sx={{ maxWidth: 640, display: "flex", flexDirection: "column", gap: "24px" }}>
      <SectionHeader
        title={appointee || "Appointee"}
        subtitle="Confirm the appointee's personal data for the Entities system. Fields sourced from Workday are pre-filled."
        statusLabel={statusLabel}
        statusVariant={step?.status === "completed" ? "completed" : step?.status === "in_progress" ? "in_progress" : "not_started"}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          p: "20px",
          borderRadius: radius.lg,
          border: `1px solid ${color.outline.fixed}`,
          background: color.surface.default,
        }}
      >
        <TradAtlasText
          semanticFont={SF.textMdEmphasis}
          sx={{ gridColumn: "1 / -1", color: color.type.default, mb: "-4px" }}
        >
          Personal information
        </TradAtlasText>

        <AtlasFormField
          label="Full name"
          value={appointee}
          hint="From Workday"
          readOnly
          disabled={entitiesComplete}
        />
        <AtlasFormField
          label="Position / title"
          value="Regional Finance Director, APAC"
          hint="From Workday"
          readOnly
          disabled={entitiesComplete}
        />
        <AtlasFormField
          label="Email address"
          value="priya.nair@pacificpolymer.sg"
          hint="From Workday"
          readOnly
          disabled={entitiesComplete}
        />
        <AtlasFormField
          label="Phone"
          value="+65 9123 4567"
          hint="From Workday"
          readOnly
          disabled={entitiesComplete}
        />
        <AtlasFormField
          label="Date of birth"
          value="12 March 1984"
          hint="From Workday"
          readOnly
          disabled={entitiesComplete}
        />
        <AtlasFormField
          label="Nationality"
          value="Singaporean"
          hint="From Workday"
          readOnly
          disabled={entitiesComplete}
        />
        <AtlasFormField
          label="Residential address"
          value="14 Nassim Road, #08-02, Singapore 258395"
          hint="From Workday"
          readOnly
          disabled={entitiesComplete}
        />
        <AtlasFormField
          label="Residency status"
          value="Ordinarily resident in Singapore"
          hint="From Workday"
          readOnly
          disabled={entitiesComplete}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          p: "20px",
          borderRadius: radius.lg,
          border: `1px solid ${nricError ? color.status.error.default : color.status.warning.default}`,
          background: entitiesComplete ? color.surface.default : color.status.warning.background,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {entitiesComplete ? (
            <CheckCircleIcon sx={{ fontSize: 18, color: color.status.success.default }} />
          ) : (
            <WarningAmberIcon sx={{ fontSize: 18, color: color.status.warning.text }} />
          )}
          <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default }}>
            {entitiesComplete ? "NRIC captured" : "Action required — NRIC not in Workday"}
          </TradAtlasText>
        </Box>
        {!entitiesComplete ? (
          <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
            Workday does not hold the National Registration Identity Card (NRIC) number.
            This is required by ACRA for Form 45 and the Entities appointment record.
          </TradAtlasText>
        ) : null}

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <AtlasFormField
            label="NRIC"
            placeholder="e.g. S1234567D"
            value={nric}
            onChange={(v) => {
              setNric(v);
              setNricError(null);
            }}
            error={Boolean(nricError)}
            helperText={nricError ?? undefined}
            disabled={entitiesComplete}
            statusBadge={
              !entitiesComplete ? (
                <Chip
                  label="Required"
                  size="small"
                  sx={{
                    ...semanticFontStyle(SF.textXs),
                    height: 18,
                    backgroundColor: color.status.warning.default,
                    color: "#fff",
                    fontWeight: weight.semiBold,
                  }}
                />
              ) : undefined
            }
          />
          <AtlasFormField
            label="Effective date of appointment"
            type="date"
            value={effectiveDate}
            onChange={setEffectiveDate}
            disabled={entitiesComplete}
          />
        </Box>

        {!entitiesComplete ? (
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{
                textTransform: "none",
                fontWeight: weight.semiBold,
                borderRadius: radius.md,
                ...semanticFontStyle(SF.labelMd),
              }}
            >
              Save appointee data
            </Button>
          </Box>
        ) : (
          <TradAtlasText semanticFont={SF.textSmEmphasis} sx={{ color: color.status.success.text }}>
            Saved — Entities appointment record is ready.
          </TradAtlasText>
        )}
      </Box>
    </Box>
  );
}
