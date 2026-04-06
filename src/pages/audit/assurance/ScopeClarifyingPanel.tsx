import { useState } from "react";
import { Box, Button, Chip, Divider, LinearProgress, Switch, ToggleButton, ToggleButtonGroup } from "@mui/material";
import TradAtlasText from "@/components/common/TradAtlasText";
import ContentCard from "@/components/common/ContentCard";
import { SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "../../../hooks/useTokens";

type HistoricalRange = "12" | "24" | "36";

interface DomainToggle {
  id: string;
  title: string;
  description: string;
  recommended: boolean;
}

const DOMAINS: DomainToggle[] = [
  { id: "projects", title: "Projects", description: "Findings, walkthroughs, remediation", recommended: true },
  { id: "frameworks", title: "Frameworks", description: "Risk control matrix, test plans", recommended: true },
  { id: "erm", title: "ERM", description: "Risk register, appetite, velocity", recommended: true },
  { id: "ai-risk", title: "AI Risk Essentials", description: "AI risk scores, peer benchmarks", recommended: true },
  { id: "compliance", title: "Compliance Maps", description: "Obligations, gaps, SEC requirements", recommended: true },
  { id: "third-risk", title: "3rd Risk", description: "Vendor cyber scores, questionnaires", recommended: true },
  { id: "vault", title: "Vault", description: "Speak-up themes only — no PII", recommended: false },
];

interface ScopeClarifyingPanelProps {
  completed: boolean;
  onProceed: () => void;
}

export default function ScopeClarifyingPanel({ completed, onProceed }: ScopeClarifyingPanelProps) {
  const { color, weight, radius } = useTokens();

  const [vendorCyber, setVendorCyber] = useState(true);
  const [speakUpVault, setSpeakUpVault] = useState(true);
  const [historicalRange, setHistoricalRange] = useState<HistoricalRange>("24");
  const [domains, setDomains] = useState<Record<string, boolean>>(() => {
    const o: Record<string, boolean> = {};
    DOMAINS.forEach((d) => {
      o[d.id] = d.id !== "vault";
    });
    return o;
  });

  const toggleDomain = (id: string) => {
    setDomains((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedCount = Object.values(domains).filter(Boolean).length;

  return (
    <>
      <Box>
        <TradAtlasText semanticFont={SF.titleH3Emphasis} sx={{ color: color.type.default, mb: "8px" }}>
          Clarifying options
        </TradAtlasText>
        <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
          Set parameters before investigation begins — scope, timeline, and which data domains agents
          may query. Recommended controls are pre-selected; you can toggle investigative avenues
          off.
        </TradAtlasText>
      </Box>

      <Divider sx={{ borderColor: color.outline.fixed }} />

      <ContentCard>
        <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "16px" }}>
          Scope parameters
        </TradAtlasText>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.default, fontWeight: weight.medium }}>
                Include third-party vendor cyber risks?
              </TradAtlasText>
              <Chip label="Recommended" size="small" sx={{ ml: "8px", height: 20, ...semanticFontStyle(SF.textXs) }} />
            </Box>
            <Switch checked={vendorCyber} onChange={(_, v) => setVendorCyber(v)} disabled={completed} color="primary" />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.default, fontWeight: weight.medium }}>
                Include speak-up / Vault data (themes only, no PII)?
              </TradAtlasText>
              <Chip label="Recommended" size="small" sx={{ ml: "8px", height: 20, ...semanticFontStyle(SF.textXs) }} />
            </Box>
            <Switch checked={speakUpVault} onChange={(_, v) => setSpeakUpVault(v)} disabled={completed} color="primary" />
          </Box>

          <Box>
            <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.default, fontWeight: weight.medium, mb: "16px" }}>
              Historical range
            </TradAtlasText>
            <ToggleButtonGroup
              value={historicalRange}
              exclusive
              disabled={completed}
              onChange={(_, v) => {
                if (v) setHistoricalRange(v);
              }}
              size="small"
              sx={{
                "& .MuiToggleButton-root": {
                  textTransform: "none",
                  ...semanticFontStyle(SF.labelMd),
                  px: "16px",
                  borderRadius: `${radius.md}px`,
                  borderColor: color.outline.fixed,
                  "&.Mui-selected": {
                    background: color.action.primary.default,
                    color: "#fff",
                    borderColor: color.action.primary.default,
                  },
                },
              }}
            >
              <ToggleButton value="12">12 months</ToggleButton>
              <ToggleButton value="24">24 months</ToggleButton>
              <ToggleButton value="36">36 months</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
      </ContentCard>

      <ContentCard>
        <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "4px" }}>
          Data domains to query
        </TradAtlasText>
        <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted, mb: "16px" }}>
          All recommended domains are pre-selected. Vault is optional — speak-up themes only; no PII
          ever exposed.
        </TradAtlasText>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: "12px",
          }}
        >
          {DOMAINS.map((d) => {
            const fullWidth = d.id === "vault";
            const on = domains[d.id] ?? false;
            return (
              <Box
                key={d.id}
                sx={{
                  p: "14px",
                  borderRadius: radius.md,
                  border: `1px solid ${color.outline.fixed}`,
                  background: color.surface.default,
                  gridColumn: fullWidth ? { sm: "1 / -1" } : undefined,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <TradAtlasText semanticFont={SF.titleH4Emphasis} sx={{ color: color.type.default, mb: "4px" }}>
                    {d.title}
                  </TradAtlasText>
                  <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
                    {d.description}
                  </TradAtlasText>
                  <Chip
                    label={d.recommended ? "Recommended" : "Optional"}
                    size="small"
                    sx={{ mt: "8px", height: 20, ...semanticFontStyle(SF.textXs) }}
                  />
                </Box>
                <Switch
                  checked={on}
                  onChange={() => toggleDomain(d.id)}
                  disabled={completed}
                  color="primary"
                />
              </Box>
            );
          })}
        </Box>

        <Box sx={{ mt: "12px" }}>
          <LinearProgress
            variant="determinate"
            value={(selectedCount / DOMAINS.length) * 100}
            sx={{
              height: 4,
              borderRadius: 2,
              backgroundColor: color.outline.fixed,
              "& .MuiLinearProgress-bar": { backgroundColor: color.action.primary.default, borderRadius: 2 },
            }}
          />
          <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted, mt: "8px" }}>
            {selectedCount} of {DOMAINS.length} domains enabled · {historicalRange} months historical lookback
          </TradAtlasText>
        </Box>
      </ContentCard>

      <ContentCard>
        <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "8px" }}>
          Pre-selected controls (NIST CSF)
        </TradAtlasText>
        <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
          41 controls across PR.AC, PR.PT, RS.RP, PR.DS, and ID.SC are mapped to the risk register and
          locked for this engagement unless you change scope in Diligent Audit. Toggle domains
          above to include or exclude evidence sources for each control family.
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
            Confirm scope & continue to evidence
          </Button>
        </Box>
      )}
    </>
  );
}
