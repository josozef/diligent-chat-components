import { useEffect, useState } from "react";
import { Box, Button, Chip, Divider, LinearProgress } from "@mui/material";
import {
  CheckCircleIcon,
  AutoAwesomeOutlinedIcon,
  FileDownloadOutlinedIcon,
  WarningAmberIcon,
} from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import ContentCard from "@/components/common/ContentCard";
import { SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "../../../hooks/useTokens";

interface AgentRow {
  id: string;
  label: string;
  status: "idle" | "running" | "complete" | "error";
  progress: number;
}

const INITIAL_AGENTS: AgentRow[] = [
  { id: "a1", label: "Projects — findings & controls", status: "idle", progress: 0 },
  { id: "a2", label: "Frameworks — risk control matrix", status: "idle", progress: 0 },
  { id: "a3", label: "ERM — risk register & appetite", status: "idle", progress: 0 },
  { id: "a4", label: "AI Risk Essentials — alerts", status: "idle", progress: 0 },
  { id: "a5", label: "Compliance Maps — SEC obligations", status: "idle", progress: 0 },
  { id: "a6", label: "3rd Risk — vendor assessments", status: "idle", progress: 0 },
  { id: "a7", label: "Vault — speak-up themes", status: "idle", progress: 0 },
  { id: "a8", label: "External Intel — peer enforcement", status: "idle", progress: 0 },
];

interface EvidenceSourceRow {
  source: string;
  detail: string;
  records: string;
  freshness: "Current" | "Recent";
}

const EVIDENCE_SOURCES: EvidenceSourceRow[] = [
  { source: "Projects — Findings & Controls", detail: "47 findings, 180 controls", records: "227", freshness: "Current" },
  { source: "Frameworks — Risk Control Matrix", detail: "180 controls, 8 ineffective", records: "188", freshness: "Current" },
  { source: "ERM — Risk Register & Appetite", detail: "22 risks, 3 above appetite", records: "25", freshness: "Current" },
  { source: "AI Risk Essentials — Alerts", detail: "15 AI alerts, peer benchmarks", records: "18", freshness: "Current" },
  { source: "Compliance Maps — SEC Obligations", detail: "12 obligations, 3 gaps", records: "15", freshness: "Current" },
  { source: "3rd Risk — Vendor Assessments", detail: "8 vendors, 3 high-risk", records: "11", freshness: "Recent" },
  { source: "Vault — Speak-up Themes", detail: "4 themes, anonymized", records: "4", freshness: "Current" },
  { source: "External Intel — Peer Enforcement", detail: "6 enforcement actions", records: "6", freshness: "Current" },
];

interface EvidenceGatheringPanelProps {
  completed: boolean;
  onProceed: () => void;
}

export default function EvidenceGatheringPanel({ completed, onProceed }: EvidenceGatheringPanelProps) {
  const { color, weight, radius } = useTokens();

  const [authorized, setAuthorized] = useState(() => completed);
  const [gatheringDone, setGatheringDone] = useState(() => completed);
  const [agents, setAgents] = useState<AgentRow[]>(() =>
    completed
      ? INITIAL_AGENTS.map((a) => ({ ...a, status: "complete" as const, progress: 100 }))
      : INITIAL_AGENTS,
  );

  useEffect(() => {
    if (!authorized || completed) return;

    setAgents(INITIAL_AGENTS.map((a) => ({ ...a, status: "running" as const, progress: 0 })));

    const interval = setInterval(() => {
      setAgents((prev) => {
        const next = prev.map((a) => {
          if (a.status !== "running") return a;
          const progress = Math.min(100, a.progress + 14);
          return { ...a, progress, status: progress >= 100 ? ("complete" as const) : ("running" as const) };
        });
        if (next.every((a) => a.status === "complete")) {
          clearInterval(interval);
          setGatheringDone(true);
        }
        return next;
      });
    }, 280);

    return () => clearInterval(interval);
  }, [authorized, completed]);

  const showPack = completed || gatheringDone;

  return (
    <>
      <Box>
        <TradAtlasText semanticFont={SF.titleH3Emphasis} sx={{ color: color.type.default, mb: "8px" }}>
          Evidence pack collection
        </TradAtlasText>
        <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
          Authorize agents to query selected domains, monitor collection status, then review and
          download evidence packs before synthesis.
        </TradAtlasText>
      </Box>

      <Divider sx={{ borderColor: color.outline.fixed }} />

      {!authorized && !completed && (
        <ContentCard>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: "12px", mb: "16px" }}>
            <AutoAwesomeOutlinedIcon sx={{ fontSize: 22, color: color.action.primary.default }} />
            <Box>
              <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "8px" }}>
                Authorize collection agents
              </TradAtlasText>
              <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
                Agents will pull from Projects, Frameworks, ERM, AI Risk, Compliance Maps, 3rd Risk,
                optional Vault themes, and External Intel — using your scope settings and historical
                range. No agents run until you authorize.
              </TradAtlasText>
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setAuthorized(true)}
              sx={{ textTransform: "none", ...semanticFontStyle(SF.textMdEmphasis) }}
            >
              Authorize agents & begin gathering
            </Button>
          </Box>
        </ContentCard>
      )}

      {(authorized || completed) && !showPack && (
        <ContentCard>
          <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "16px" }}>
            Agent status
          </TradAtlasText>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {agents.map((a) => (
              <Box key={a.id}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "4px" }}>
                  <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.default, fontWeight: weight.medium }}>
                    {a.label}
                  </TradAtlasText>
                  <Chip
                    label={a.status === "complete" ? "Complete" : "Running"}
                    size="small"
                    color={a.status === "complete" ? "success" : "primary"}
                    sx={{ ...semanticFontStyle(SF.textXs), height: 22 }}
                  />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={a.progress}
                  sx={{
                    height: 6,
                    borderRadius: 2,
                    backgroundColor: color.outline.fixed,
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 2,
                      backgroundColor: a.status === "complete" ? color.status.success.default : color.action.primary.default,
                    },
                  }}
                />
              </Box>
            ))}
          </Box>
        </ContentCard>
      )}

      {showPack && (
        <>
          <ContentCard
            sx={{
              borderColor: color.status.success.default,
              background: color.status.success.background,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <CheckCircleIcon sx={{ fontSize: 22, color: color.status.success.default, flexShrink: 0 }} />
              <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.default }}>
                <strong>Evidence pack assembled</strong> — 8 of 8 sources complete. All sources
                returned data. The pack has been saved to Boards as a supporting document. Review
                the summary below and confirm before synthesis begins.
              </TradAtlasText>
            </Box>
          </ContentCard>

          <ContentCard>
            <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "12px" }}>
              General progress
            </TradAtlasText>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px", mb: "16px" }}>
              {[
                { label: "Findings", current: 120, total: 120 },
                { label: "Controls", current: 400, total: 400 },
                { label: "Obligations", current: 30, total: 30 },
              ].map((row) => (
                <Box key={row.label}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: "4px" }}>
                    <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
                      {row.label}
                    </TradAtlasText>
                    <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.default, fontWeight: weight.medium }}>
                      {row.current}/{row.total}
                    </TradAtlasText>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(row.current / row.total) * 100}
                    sx={{
                      height: 6,
                      borderRadius: 2,
                      backgroundColor: color.outline.fixed,
                      "& .MuiLinearProgress-bar": { backgroundColor: color.status.success.default, borderRadius: 2 },
                    }}
                  />
                </Box>
              ))}
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              {[
                { label: "Data points", value: "312 total" },
                { label: "Sources completed", value: "8 of 8" },
                { label: "Data freshness", value: "7 current, 1 recent" },
              ].map((t) => (
                <Box key={t.label} sx={{ p: "12px", borderRadius: radius.sm, background: color.surface.subtle }}>
                  <TradAtlasText semanticFont={SF.textSmUppercase} sx={{ color: color.type.muted, mb: "4px" }}>
                    {t.label}
                  </TradAtlasText>
                  <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default }}>
                    {t.value}
                  </TradAtlasText>
                </Box>
              ))}
            </Box>
          </ContentCard>

          <ContentCard>
            <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "12px" }}>
              Evidence sources & downloads
            </TradAtlasText>
            <Box sx={{ borderRadius: radius.md, border: `1px solid ${color.outline.fixed}`, overflow: "hidden" }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 0.9fr 1fr",
                  px: "16px",
                  py: "8px",
                  background: color.surface.subtle,
                  borderBottom: `1px solid ${color.outline.fixed}`,
                }}
              >
                {["Source", "Records", "Freshness", ""].map((h) => (
                  <TradAtlasText key={h || "dl"} semanticFont={SF.textSmUppercase} sx={{ color: color.type.muted }}>
                    {h}
                  </TradAtlasText>
                ))}
              </Box>
              {EVIDENCE_SOURCES.map((row, i) => (
                <Box
                  key={row.source}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 0.9fr 1fr",
                    px: "16px",
                    py: "10px",
                    alignItems: "center",
                    borderBottom: i < EVIDENCE_SOURCES.length - 1 ? `1px solid ${color.outline.fixed}` : "none",
                    "&:hover": { background: color.surface.subtle },
                  }}
                >
                  <Box>
                    <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.default, fontWeight: weight.medium }}>
                      {row.source}
                    </TradAtlasText>
                    <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
                      {row.detail}
                    </TradAtlasText>
                  </Box>
                  <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
                    {row.records}
                  </TradAtlasText>
                  <Chip
                    label={row.freshness}
                    size="small"
                    color={row.freshness === "Recent" ? "warning" : "success"}
                    sx={{ width: "fit-content", ...semanticFontStyle(SF.textXs) }}
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />}
                    sx={{ textTransform: "none", justifySelf: "end" }}
                  >
                    Download pack
                  </Button>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "12px" }}>
              <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
                Packs total: 8
              </TradAtlasText>
              <Button size="small" variant="text" startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />} sx={{ textTransform: "none" }}>
                Download all
              </Button>
            </Box>
          </ContentCard>

          <Box
            sx={{
              p: "12px 16px",
              borderRadius: radius.md,
              border: `1px solid ${color.status.warning.default}`,
              background: color.status.warning.background,
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
            }}
          >
            <WarningAmberIcon sx={{ fontSize: 20, color: color.status.warning.text, flexShrink: 0 }} />
            <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.default }}>
              <strong>HITL gate 1 of 3</strong> — Confirm the evidence base before synthesis begins.
            </TradAtlasText>
          </Box>

          <ContentCard sx={{ background: color.status.success.background, borderColor: color.status.success.default }}>
            <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.default }}>
              <strong>Saved to Boards</strong> — Evidence Pack · Cybersecurity Assurance Report. Available as
              supporting material for committee review (view rights).
            </TradAtlasText>
          </ContentCard>

          {!completed && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "12px", flexWrap: "wrap" }}>
              <Button variant="outlined" sx={{ textTransform: "none" }}>
                Re-run a source
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={onProceed}
                sx={{ textTransform: "none", ...semanticFontStyle(SF.textMdEmphasis) }}
              >
                Confirm evidence pack
              </Button>
            </Box>
          )}
        </>
      )}
    </>
  );
}
