import { Box, Button, Chip, Divider } from "@mui/material";
import { CheckCircleIcon } from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import ContentCard from "@/components/common/ContentCard";
import { SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "../../../hooks/useTokens";

const EVIDENCE_ITEMS = [
  { label: "Change records", detail: "5 tickets closed with evidence", status: "complete" },
  { label: "Patch verification scans", detail: "All 12 assets confirmed patched", status: "complete" },
  { label: "Vendor attestation", detail: "CrowdStrike advisory update received", status: "complete" },
  { label: "Compensating controls log", detail: "Network segmentation rules active", status: "complete" },
];

const VENDOR_CONFIRMATIONS = [
  { vendor: "CrowdStrike", product: "Falcon Sensor v7.x", confirmation: "Official patch released and verified", scoreChange: "+15 pts", status: "Resolved" as const },
  { vendor: "Acme Cloud Services", product: "Infrastructure (IaaS)", confirmation: "No downstream exposure confirmed", scoreChange: "—", status: "Clear" as const },
];

const RISK_RESCORING = [
  { entry: "R-2024-089 — Third-Party Software Risk", before: "High", after: "Low" },
  { entry: "R-2024-112 — Endpoint Protection Gap", before: "Medium", after: "Low" },
  { entry: "R-2024-156 — Data Exfiltration Risk", before: "High", after: "Low" },
];

interface ResolutionPanelProps {
  completed: boolean;
  onProceed: () => void;
}

export default function ResolutionPanel({ completed, onProceed }: ResolutionPanelProps) {
  const { color, weight, radius } = useTokens();

  return (
    <>
      <Box>
        <TradAtlasText semanticFont={SF.titleH3Emphasis} sx={{ color: color.type.default, mb: "8px" }}>
          Validation & closure
        </TradAtlasText>
        <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
          All remediation tasks have been validated. Evidence has been collected, vendor confirmations received, and risk entries re-scored.
        </TradAtlasText>
      </Box>

      <Divider sx={{ borderColor: color.outline.fixed }} />

      {/* Evidence pack */}
      <ContentCard>
        <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "16px" }}>
          Evidence pack
        </TradAtlasText>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {EVIDENCE_ITEMS.map((item) => (
            <Box
              key={item.label}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                p: "12px",
                borderRadius: radius.md,
                border: `1px solid ${color.outline.fixed}`,
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 18, color: color.status.success.default, flexShrink: 0 }} />
              <Box sx={{ flex: 1 }}>
                <TradAtlasText semanticFont={SF.textMd} sx={{ fontWeight: weight.medium, color: color.type.default }}>
                  {item.label}
                </TradAtlasText>
                <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
                  {item.detail}
                </TradAtlasText>
              </Box>
            </Box>
          ))}
        </Box>
      </ContentCard>

      {/* Vendor confirmations */}
      <ContentCard>
        <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "16px" }}>
          Vendor confirmations
        </TradAtlasText>
        {VENDOR_CONFIRMATIONS.map((vendor) => (
          <Box
            key={vendor.vendor}
            sx={{
              p: "16px",
              borderRadius: radius.md,
              border: `1px solid ${color.outline.fixed}`,
              mb: "12px",
              "&:last-child": { mb: 0 },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: "8px" }}>
              <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default }}>
                {vendor.vendor}
              </TradAtlasText>
              <Chip
                label={vendor.status}
                size="small"
                color="success"
                sx={{ fontWeight: weight.semiBold, ...semanticFontStyle(SF.textMicro) }}
              />
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
              {[
                { label: "Product", value: vendor.product },
                { label: "Confirmation", value: vendor.confirmation },
                { label: "Score change", value: vendor.scoreChange },
              ].map((d) => (
                <Box key={d.label}>
                  <TradAtlasText semanticFont={SF.textSmUppercase} sx={{ color: color.type.muted, mb: "2px" }}>
                    {d.label}
                  </TradAtlasText>
                  <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.default }}>
                    {d.value}
                  </TradAtlasText>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </ContentCard>

      {/* Risk re-scoring */}
      <ContentCard>
        <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "12px" }}>
          Risk re-scoring
        </TradAtlasText>
        <Box sx={{ borderRadius: radius.md, border: `1px solid ${color.outline.fixed}`, overflow: "hidden" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "3fr 1fr 1fr",
              px: "16px",
              py: "8px",
              background: color.surface.subtle,
              borderBottom: `1px solid ${color.outline.fixed}`,
            }}
          >
            {["Risk entry", "Before", "After"].map((h) => (
              <TradAtlasText key={h} semanticFont={SF.textSmUppercase} sx={{ color: color.type.muted }}>
                {h}
              </TradAtlasText>
            ))}
          </Box>
          {RISK_RESCORING.map((r, i) => (
            <Box
              key={r.entry}
              sx={{
                display: "grid",
                gridTemplateColumns: "3fr 1fr 1fr",
                px: "16px",
                py: "10px",
                borderBottom: i < RISK_RESCORING.length - 1 ? `1px solid ${color.outline.fixed}` : "none",
                alignItems: "center",
              }}
            >
              <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.default }}>{r.entry}</TradAtlasText>
              <Chip
                label={r.before}
                size="small"
                color={r.before === "High" ? "warning" : "default"}
                sx={{ fontWeight: weight.semiBold, ...semanticFontStyle(SF.textMicro), width: "fit-content" }}
              />
              <Chip
                label={r.after}
                size="small"
                color="success"
                sx={{ fontWeight: weight.semiBold, ...semanticFontStyle(SF.textMicro), width: "fit-content" }}
              />
            </Box>
          ))}
        </Box>
      </ContentCard>

      {/* Closure summary */}
      <ContentCard>
        <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "8px" }}>
          Closure summary
        </TradAtlasText>
        <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
          All affected assets have been patched, compensating controls verified, vendor attestations
          received, and risk entries re-scored to Low. The incident meets closure criteria per the
          IR playbook. Overdue tasks: 0. The third-party risk program has been updated to reflect
          the vendor remediation status.
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
            Continue to board briefing
          </Button>
        </Box>
      )}
    </>
  );
}
