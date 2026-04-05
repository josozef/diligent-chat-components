import { Fragment } from "react";
import { Box, Chip, Divider } from "@mui/material";
import {
  AutoAwesomeOutlinedIcon,
  CheckCircleOutlineIcon,
  RadioButtonUncheckedIcon,
  WarningAmberIcon,
  BugReportOutlinedIcon,
  ShieldOutlinedIcon,
  StorageOutlinedIcon,
  EventOutlinedIcon,
} from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import ContentCard from "@/components/common/ContentCard";
import DetailRow from "@/components/common/DetailRow";
import { DATA_SEMANTIC_FONT, SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "../../../hooks/useTokens";
import type { InvestigationStep, InvestigationStepId } from "./InvestigateWorkspace";
import ImpactAssessmentPanel from "./ImpactAssessmentPanel";
import StakeholderBriefingTabs from "./StakeholderBriefingTabs";
import RemediationPanel from "./RemediationPanel";
import ResolutionPanel from "./ResolutionPanel";
import BoardBriefingPanel from "./BoardBriefingPanel";

interface WorkPanelProps {
  activeStepId: InvestigationStepId | null;
  steps: InvestigationStep[];
  onAdvance: (fromStepId: InvestigationStepId) => void;
}

export default function WorkPanel({ activeStepId, steps, onAdvance }: WorkPanelProps) {
  const { color } = useTokens();

  const isBriefNotify = activeStepId === "brief-notify";

  const currentStep = activeStepId ? steps.find((s) => s.id === activeStepId) : null;
  const isCompleted = currentStep?.status === "completed";

  if (isBriefNotify) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: color.surface.subtle,
        }}
      >
        <StakeholderBriefingTabs
          completed={isCompleted}
          onProceed={() => onAdvance("brief-notify")}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        overflow: "auto",
        background: color.surface.subtle,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          maxWidth: 720,
          width: "100%",
          mx: "auto",
          py: "32px",
          px: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {activeStepId === null ? (
          <OverviewContent steps={steps} />
        ) : activeStepId === "impact" ? (
          <ImpactAssessmentPanel completed={isCompleted} onProceed={() => onAdvance("impact")} />
        ) : activeStepId === "remediation" ? (
          <RemediationPanel completed={isCompleted} onProceed={() => onAdvance("remediation")} />
        ) : activeStepId === "validate" ? (
          <ResolutionPanel completed={isCompleted} onProceed={() => onAdvance("validate")} />
        ) : activeStepId === "board-briefing" ? (
          <BoardBriefingPanel completed={isCompleted} onProceed={() => onAdvance("board-briefing")} />
        ) : null}
      </Box>
    </Box>
  );
}

/* ── Overview (no step selected) ───────────────────────────────── */

function OverviewContent({ steps }: { steps: InvestigationStep[] }) {
  const { color, weight, radius } = useTokens();

  return (
    <Box sx={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: "24px" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <TradAtlasText
          semanticFont={SF.titleH4Emphasis}
          sx={{
            fontWeight: weight.semiBold,
            color: color.type.default,
          }}
        >
          Security incident overview
        </TradAtlasText>
        <Chip
          label="IN PROGRESS"
          size="small"
          {...{ [DATA_SEMANTIC_FONT]: SF.textXs }}
          sx={{
            ...semanticFontStyle(SF.textXs),
            backgroundColor: color.action.primary.default,
            color: "#fff",
            fontWeight: weight.semiBold,
            height: 20,
            letterSpacing: "0.5px",
          }}
        />
      </Box>

      {/* AI summary */}
      <ContentCard>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: "12px", mb: "16px" }}>
          <AutoAwesomeOutlinedIcon
            sx={{ fontSize: 18, color: color.action.primary.default, mt: "2px" }}
          />
          <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.default }}>
            <TradAtlasText component="span" semanticFont={SF.textMd} sx={{ fontWeight: weight.semiBold }}>
              Threat intelligence has detected
            </TradAtlasText>{" "}
            a critical vulnerability (CVE-2026-1847, CVSS 9.8) in CrowdStrike Falcon Sensor v7.x
            with active exploitation in the wild. The vulnerability affects{" "}
            <TradAtlasText component="span" semanticFont={SF.textMd} sx={{ fontWeight: weight.semiBold }}>
              12 IT assets
            </TradAtlasText>{" "}
            across 3 business-critical systems in production and staging environments. Immediate
            remediation is required per the 24-hour SLA for critical vulnerabilities.
          </TradAtlasText>
        </Box>
        <Divider sx={{ borderColor: color.outline.fixed, my: "12px" }} />
        <TradAtlasText semanticFont={SF.labelMd} sx={{ color: color.type.muted }}>
          This workspace will guide you through impact assessment, risk analysis, stakeholder
          notification, remediation orchestration, validation, and board reporting. The AI assistant
          on the right can answer questions at any step.
        </TradAtlasText>
      </ContentCard>

      {/* Incident details */}
      <ContentCard>
        <TradAtlasText
          semanticFont={SF.textMd}
          sx={{ fontWeight: weight.semiBold, color: color.type.default, mb: "16px" }}
        >
          Incident details
        </TradAtlasText>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <DetailRow
            icon={<BugReportOutlinedIcon sx={{ fontSize: 16 }} />}
            label="Vulnerability"
            value="CVE-2026-1847 (CVSS 9.8)"
          />
          <DetailRow
            icon={<ShieldOutlinedIcon sx={{ fontSize: 16 }} />}
            label="Severity"
            value="Critical — Active exploit"
          />
          <DetailRow
            icon={<StorageOutlinedIcon sx={{ fontSize: 16 }} />}
            label="Affected systems"
            value="12 assets across 3 systems"
          />
          <DetailRow
            icon={<EventOutlinedIcon sx={{ fontSize: 16 }} />}
            label="SLA deadline"
            value="24 hours from detection"
          />
          <DetailRow
            icon={<ShieldOutlinedIcon sx={{ fontSize: 16 }} />}
            label="Product"
            value="CrowdStrike Falcon Sensor v7.x"
          />
          <DetailRow
            icon={<BugReportOutlinedIcon sx={{ fontSize: 16 }} />}
            label="Compliance impact"
            value="SOC 2, ISO 27001, NIST CSF, PCI DSS"
          />
        </Box>
      </ContentCard>

      {/* Initial impact summary */}
      <ContentCard>
        <TradAtlasText
          semanticFont={SF.textMd}
          sx={{ fontWeight: weight.semiBold, color: color.type.default, mb: "12px" }}
        >
          Initial impact summary
        </TradAtlasText>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            "Financial Reporting Platform — 5 production assets exposed, potential for data exfiltration",
            "HR Management System — 4 production assets, employee PII at risk",
            "Customer Portal — 3 staging assets, customer data exposure possible if promoted",
            "4 compliance frameworks at risk of control failure documentation",
            "Materiality threshold met — disclosure review initiated",
          ].map((item) => (
            <Box key={item} sx={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: color.type.muted,
                  flexShrink: 0,
                  mt: "7px",
                }}
              />
              <TradAtlasText semanticFont={SF.labelMd} sx={{ color: color.type.muted }}>
                {item}
              </TradAtlasText>
            </Box>
          ))}
        </Box>
      </ContentCard>

      {/* Workflow progress */}
      <ContentCard>
        <TradAtlasText
          semanticFont={SF.textMd}
          sx={{ fontWeight: weight.semiBold, color: color.type.default, mb: "16px" }}
        >
          Workflow progress
        </TradAtlasText>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {steps.map((step) => (
            <Fragment key={step.id}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  py: "6px",
                  px: "8px",
                  borderRadius: radius.sm,
                }}
              >
                {step.status === "completed" ? (
                  <CheckCircleOutlineIcon sx={{ fontSize: 18, color: color.status.success.default }} />
                ) : step.status === "in_progress" ? (
                  <WarningAmberIcon sx={{ fontSize: 18, color: color.action.primary.default }} />
                ) : (
                  <RadioButtonUncheckedIcon sx={{ fontSize: 18, color: color.outline.fixed }} />
                )}
                <TradAtlasText
                  semanticFont={SF.labelMd}
                  sx={{
                    color: step.status === "not_started" ? color.type.muted : color.type.default,
                    fontWeight: step.status === "in_progress" ? weight.semiBold : weight.regular,
                    flex: 1,
                  }}
                >
                  {step.name}
                </TradAtlasText>
                <TradAtlasText
                  semanticFont={SF.textMicro}
                  sx={{
                    color:
                      step.status === "completed"
                        ? color.status.success.text
                        : step.status === "in_progress"
                          ? color.action.primary.default
                          : color.type.disabled,
                    fontWeight: weight.medium,
                  }}
                >
                  {step.status === "completed"
                    ? "Complete"
                    : step.status === "in_progress"
                      ? "In progress"
                      : "Not started"}
                </TradAtlasText>
              </Box>
            </Fragment>
          ))}
        </Box>
      </ContentCard>
    </Box>
  );
}
