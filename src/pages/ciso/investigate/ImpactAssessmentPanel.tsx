import { Box, Button, Chip, Divider } from "@mui/material";
import TradAtlasText from "@/components/common/TradAtlasText";
import ContentCard from "@/components/common/ContentCard";
import { SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { atlasFontFamilyMono } from "@/tokens/atlasLight";
import { useTokens } from "../../../hooks/useTokens";

const AFFECTED_ASSETS = [
  { system: "Financial Reporting Platform", assets: 5, environment: "Production", dataClassification: "Confidential", businessProcess: "Financial close & reporting" },
  { system: "HR Management System", assets: 4, environment: "Production", dataClassification: "PII — Restricted", businessProcess: "Employee lifecycle" },
  { system: "Customer Portal", assets: 3, environment: "Staging", dataClassification: "Customer PII", businessProcess: "Customer engagement" },
];

const DATA_FLOWS = [
  { source: "Financial Reporting Platform", target: "General Ledger (SAP)", classification: "Confidential", regions: "US, EU" },
  { source: "HR Management System", target: "Payroll (ADP)", classification: "PII — Restricted", regions: "US, APAC" },
  { source: "Customer Portal", target: "CRM (Salesforce)", classification: "Customer PII", regions: "US, EU, APAC" },
];

const COMPLIANCE_FRAMEWORKS = [
  { framework: "SOC 2 Type II", controls: 3, status: "At Risk" as const },
  { framework: "ISO 27001", controls: 2, status: "At Risk" as const },
  { framework: "NIST CSF", controls: 4, status: "At Risk" as const },
  { framework: "PCI DSS", controls: 2, status: "At Risk" as const },
];

const RISK_ENTRIES = [
  { id: "R-2024-089", name: "Third-Party Software Risk", severity: "High" as const, inherent: "9.2", residual: "7.8" },
  { id: "R-2024-112", name: "Endpoint Protection Gap", severity: "Medium" as const, inherent: "7.5", residual: "6.2" },
  { id: "R-2024-156", name: "Data Exfiltration Risk", severity: "High" as const, inherent: "8.8", residual: "7.5" },
];

interface ImpactAssessmentPanelProps {
  completed: boolean;
  onProceed: () => void;
}

export default function ImpactAssessmentPanel({ completed, onProceed }: ImpactAssessmentPanelProps) {
  const { color, weight, radius } = useTokens();

  return (
    <>
      <Box>
        <TradAtlasText semanticFont={SF.titleH3Emphasis} sx={{ color: color.type.default, mb: "8px" }}>
          Impact assessment
        </TradAtlasText>
        <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
          CVE-2026-1847 has been mapped across the asset inventory, data flows, and compliance
          frameworks. Review the full impact below.
        </TradAtlasText>
      </Box>

      <Divider sx={{ borderColor: color.outline.fixed }} />

      {/* CVE headline */}
      <ContentCard>
        <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "16px" }}>
          Vulnerability details
        </TradAtlasText>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px" }}>
          {[
            { label: "CVE ID", value: "CVE-2026-1847" },
            { label: "CVSS Score", value: "9.8", valueColor: color.status.error.text },
            { label: "Severity", value: "Critical", valueColor: color.status.error.text },
            { label: "Status", value: "Active exploit" },
          ].map((d) => (
            <Box key={d.label}>
              <TradAtlasText semanticFont={SF.textSmUppercase} sx={{ color: color.type.muted, mb: "4px" }}>
                {d.label}
              </TradAtlasText>
              <TradAtlasText
                semanticFont={SF.textMdEmphasis}
                sx={{ color: d.valueColor ?? color.type.default, fontFamily: d.label === "CVE ID" ? atlasFontFamilyMono : undefined }}
              >
                {d.value}
              </TradAtlasText>
            </Box>
          ))}
        </Box>
      </ContentCard>

      {/* Affected assets */}
      <ContentCard>
        <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "16px" }}>
          Affected systems & assets
        </TradAtlasText>
        <Box sx={{ borderRadius: radius.md, border: `1px solid ${color.outline.fixed}`, overflow: "hidden" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1.8fr 0.6fr 0.8fr 1fr 1.5fr",
              px: "16px",
              py: "8px",
              background: color.surface.subtle,
              borderBottom: `1px solid ${color.outline.fixed}`,
            }}
          >
            {["System", "Assets", "Environment", "Classification", "Business process"].map((h) => (
              <TradAtlasText key={h} semanticFont={SF.textSmUppercase} sx={{ color: color.type.muted }}>
                {h}
              </TradAtlasText>
            ))}
          </Box>
          {AFFECTED_ASSETS.map((row, i) => (
            <Box
              key={row.system}
              sx={{
                display: "grid",
                gridTemplateColumns: "1.8fr 0.6fr 0.8fr 1fr 1.5fr",
                px: "16px",
                py: "10px",
                borderBottom: i < AFFECTED_ASSETS.length - 1 ? `1px solid ${color.outline.fixed}` : "none",
                alignItems: "center",
              }}
            >
              <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.default }}>{row.system}</TradAtlasText>
              <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>{row.assets}</TradAtlasText>
              <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>{row.environment}</TradAtlasText>
              <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>{row.dataClassification}</TradAtlasText>
              <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>{row.businessProcess}</TradAtlasText>
            </Box>
          ))}
        </Box>
        <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted, mt: "8px" }}>
          12 total assets affected across 3 business-critical systems
        </TradAtlasText>
      </ContentCard>

      {/* Data flows */}
      <ContentCard>
        <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "16px" }}>
          Data flows at risk
        </TradAtlasText>
        <Box sx={{ borderRadius: radius.md, border: `1px solid ${color.outline.fixed}`, overflow: "hidden" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1.5fr 1fr 0.8fr",
              px: "16px",
              py: "8px",
              background: color.surface.subtle,
              borderBottom: `1px solid ${color.outline.fixed}`,
            }}
          >
            {["Source system", "Target system", "Classification", "Regions"].map((h) => (
              <TradAtlasText key={h} semanticFont={SF.textSmUppercase} sx={{ color: color.type.muted }}>
                {h}
              </TradAtlasText>
            ))}
          </Box>
          {DATA_FLOWS.map((flow, i) => (
            <Box
              key={flow.source}
              sx={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1.5fr 1fr 0.8fr",
                px: "16px",
                py: "10px",
                borderBottom: i < DATA_FLOWS.length - 1 ? `1px solid ${color.outline.fixed}` : "none",
                alignItems: "center",
              }}
            >
              <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.default }}>{flow.source}</TradAtlasText>
              <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>{flow.target}</TradAtlasText>
              <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>{flow.classification}</TradAtlasText>
              <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>{flow.regions}</TradAtlasText>
            </Box>
          ))}
        </Box>
      </ContentCard>

      {/* Compliance impact */}
      <ContentCard>
        <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "16px" }}>
          Compliance framework impact
        </TradAtlasText>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {COMPLIANCE_FRAMEWORKS.map((fw) => (
            <Box
              key={fw.framework}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: "10px",
                borderBottom: `1px solid ${color.outline.fixed}`,
                "&:last-child": { borderBottom: "none" },
              }}
            >
              <Box>
                <TradAtlasText semanticFont={SF.textMd} sx={{ fontWeight: weight.medium, color: color.type.default }}>
                  {fw.framework}
                </TradAtlasText>
                <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
                  {fw.controls} controls affected
                </TradAtlasText>
              </Box>
              <Chip
                label={fw.status}
                size="small"
                color="warning"
                sx={{ fontWeight: weight.semiBold, ...semanticFontStyle(SF.textMicro) }}
              />
            </Box>
          ))}
        </Box>
      </ContentCard>

      {/* Risk register */}
      <ContentCard>
        <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "16px" }}>
          Risk register entries
        </TradAtlasText>
        <Box sx={{ borderRadius: radius.md, border: `1px solid ${color.outline.fixed}`, overflow: "hidden" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "0.8fr 2fr 0.7fr 0.7fr 0.7fr",
              px: "16px",
              py: "8px",
              background: color.surface.subtle,
              borderBottom: `1px solid ${color.outline.fixed}`,
            }}
          >
            {["ID", "Risk", "Severity", "Inherent", "Residual"].map((h) => (
              <TradAtlasText key={h} semanticFont={SF.textSmUppercase} sx={{ color: color.type.muted }}>
                {h}
              </TradAtlasText>
            ))}
          </Box>
          {RISK_ENTRIES.map((entry, i) => (
            <Box
              key={entry.id}
              sx={{
                display: "grid",
                gridTemplateColumns: "0.8fr 2fr 0.7fr 0.7fr 0.7fr",
                px: "16px",
                py: "10px",
                borderBottom: i < RISK_ENTRIES.length - 1 ? `1px solid ${color.outline.fixed}` : "none",
                alignItems: "center",
              }}
            >
              <TradAtlasText semanticFont={SF.textSm} sx={{ fontFamily: atlasFontFamilyMono, color: color.type.muted }}>
                {entry.id}
              </TradAtlasText>
              <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.default, fontWeight: weight.medium }}>
                {entry.name}
              </TradAtlasText>
              <Chip
                label={entry.severity}
                size="small"
                color={entry.severity === "High" ? "warning" : "default"}
                sx={{ fontWeight: weight.semiBold, ...semanticFontStyle(SF.textMicro), width: "fit-content" }}
              />
              <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>{entry.inherent}</TradAtlasText>
              <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>{entry.residual}</TradAtlasText>
            </Box>
          ))}
        </Box>
      </ContentCard>

      {/* Materiality */}
      <ContentCard>
        <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "8px" }}>
          Materiality assessment
        </TradAtlasText>
        <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
          Based on the scope of affected assets, data classification levels, and compliance
          frameworks impacted, this incident meets the threshold for material disclosure
          consideration. Customer PII across multiple regions (US, EU, APAC) elevates regulatory
          reporting requirements under GDPR and state privacy laws.
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
            Proceed to briefings
          </Button>
        </Box>
      )}
    </>
  );
}
