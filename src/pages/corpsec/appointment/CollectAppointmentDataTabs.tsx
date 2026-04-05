import { useState } from "react";
import { Box, Button, Chip } from "@mui/material";
import { CheckCircleIcon, WarningAmberIcon } from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import { AtlasFormField } from "@/components/form";
import { SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";
import ConsentToActEditor from "./ConsentToActEditor";
import type { WorkflowStep } from "./AppointmentWorkspace";

interface TabDef {
  label: string;
  done: boolean;
}

function AtlasTabButton({
  label,
  selected,
  done,
  onClick,
}: {
  label: string;
  selected: boolean;
  done: boolean;
  onClick: () => void;
}) {
  const { color, radius, weight } = useTokens();
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      data-atlas-component="TabButton"
      data-atlas-variant={`small - label${done ? " + badge" : ""} - ${selected ? "selected" : "default"}`}
      sx={{
        position: "relative",
        ...semanticFontStyle(SF.textMdEmphasis),
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        px: "16px",
        py: "6px",
        border: "none",
        borderTopLeftRadius: radius.md,
        borderTopRightRadius: radius.md,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        background: selected ? color.surface.default : "transparent",
        cursor: "pointer",
        color: selected ? color.action.secondary.onSecondary : color.type.muted,
        fontWeight: selected ? weight.semiBold : weight.regular,
        whiteSpace: "nowrap",
        transition: "background 0.12s ease, color 0.12s ease",
        overflow: "clip",
        "&:hover": {
          background: selected ? color.surface.default : color.action.secondary.hoverFill,
          color: color.action.secondary.onSecondary,
        },
        "&:active": {
          background: selected ? color.surface.default : "#e6e6e6",
        },
      }}
    >
      {label}
      {done ? (
        <CheckCircleIcon sx={{ fontSize: 15, color: color.status.success.default }} />
      ) : null}
      {selected ? (
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            borderTopLeftRadius: "2px",
            borderTopRightRadius: "2px",
            background: color.action.primary.default,
          }}
        />
      ) : null}
    </Box>
  );
}

function IdeTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: TabDef[];
  active: number;
  onChange: (i: number) => void;
}) {
  const { color } = useTokens();
  return (
    <Box
      data-atlas-component="TabBar"
      data-atlas-variant="horizontal - small"
      sx={{
        display: "flex",
        borderBottom: `1px solid ${color.outline.fixed}`,
        background: color.surface.subtle,
        flexShrink: 0,
      }}
    >
      {tabs.map((t, i) => (
        <AtlasTabButton
          key={t.label}
          label={t.label}
          selected={i === active}
          done={t.done}
          onClick={() => onChange(i)}
        />
      ))}
    </Box>
  );
}

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
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: "4px" }}>
          <TradAtlasText semanticFont={SF.titleH4Emphasis} sx={{ fontWeight: weight.semiBold, color: color.type.default }}>
            {appointee || "Appointee"}
          </TradAtlasText>
          <Chip
            label={statusLabel}
            size="small"
            sx={{
              ...semanticFontStyle(SF.textXs),
              backgroundColor: step?.status === "completed" ? color.status.success.default : color.action.primary.default,
              color: "#fff",
              fontWeight: weight.semiBold,
              height: 20,
              letterSpacing: "0.5px",
            }}
          />
        </Box>
        <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
          Confirm the appointee's personal data for the Entities system. Fields sourced from Workday are pre-filled.
        </TradAtlasText>
      </Box>

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
