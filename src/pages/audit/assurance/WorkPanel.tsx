import { Fragment } from "react";
import { Box, Chip, Divider } from "@mui/material";
import {
  AutoAwesomeOutlinedIcon,
  CheckCircleOutlineIcon,
  RadioButtonUncheckedIcon,
  WarningAmberIcon,
  FactCheckOutlinedIcon,
  EventOutlinedIcon,
  AssessmentOutlinedIcon,
  AccountTreeOutlinedIcon,
} from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import ContentCard from "@/components/common/ContentCard";
import DetailRow from "@/components/common/DetailRow";
import { DATA_SEMANTIC_FONT, SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "../../../hooks/useTokens";
import type { AssuranceStep, AssuranceStepId } from "./AssuranceReportWorkspace";
import InvestigationPanel from "./InvestigationPanel";
import ScopeClarifyingPanel from "./ScopeClarifyingPanel";
import EvidenceGatheringPanel from "./EvidenceGatheringPanel";
import SynthesisPanel from "./SynthesisPanel";
import EditAuthorizePanel from "./EditAuthorizePanel";
import RemediationTrackingPanel from "./RemediationTrackingPanel";
import FinalReportPanel from "./FinalReportPanel";

interface WorkPanelProps {
  activeStepId: AssuranceStepId | null;
  currentStepId: AssuranceStepId;
  steps: AssuranceStep[];
  onAdvance: (fromStepId: AssuranceStepId) => void;
}

export default function WorkPanel({
  activeStepId,
  currentStepId,
  steps,
  onAdvance,
}: WorkPanelProps) {
  const { color } = useTokens();

  const viewStepId = activeStepId ?? currentStepId;
  const currentStep = steps.find((s) => s.id === viewStepId) ?? steps[0];
  const isCompleted = currentStep?.status === "completed";

  const usesIdeTabs = viewStepId === "edit-authorize" || viewStepId === "approve";

  const centerContent = usesIdeTabs ? (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0, background: color.surface.subtle }}>
      {viewStepId === "edit-authorize" && (
        <EditAuthorizePanel completed={isCompleted} onProceed={() => onAdvance("edit-authorize")} />
      )}
      {viewStepId === "approve" && (
        <FinalReportPanel completed={isCompleted} onProceed={() => onAdvance("approve")} />
      )}
    </Box>
  ) : (
    <Box sx={{ flex: 1, overflow: "auto", background: color.surface.subtle, display: "flex", flexDirection: "column", minHeight: 0 }}>
      <Box sx={{ maxWidth: 800, width: "100%", mx: "auto", py: "28px", px: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
        {activeStepId === null ? (
          <OverviewContent steps={steps} />
        ) : viewStepId === "investigation" ? (
          <InvestigationPanel completed={isCompleted} onProceed={() => onAdvance("investigation")} />
        ) : viewStepId === "scope" ? (
          <ScopeClarifyingPanel completed={isCompleted} onProceed={() => onAdvance("scope")} />
        ) : viewStepId === "evidence" ? (
          <EvidenceGatheringPanel completed={isCompleted} onProceed={() => onAdvance("evidence")} />
        ) : viewStepId === "synthesis" ? (
          <SynthesisPanel completed={isCompleted} onProceed={() => onAdvance("synthesis")} />
        ) : viewStepId === "veracity-scoring" ? (
          <RemediationTrackingPanel completed={isCompleted} onProceed={() => onAdvance("veracity-scoring")} />
        ) : null}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>
      {centerContent}
    </Box>
  );
}

function OverviewContent({ steps }: { steps: AssuranceStep[] }) {
  const { color, weight, radius } = useTokens();

  return (
    <Box sx={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: "24px" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <TradAtlasText semanticFont={SF.titleH4Emphasis} sx={{ fontWeight: weight.semiBold, color: color.type.default }}>
          Cybersecurity assurance report
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

      <ContentCard>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: "12px", mb: "16px" }}>
          <AutoAwesomeOutlinedIcon sx={{ fontSize: 18, color: color.action.primary.default, mt: "2px" }} />
          <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.default }}>
            Use the <strong>left panel</strong> to move through investigation, scope, evidence
            collection, synthesis, stakeholder authorization, veracity scoring, and final approval.
            Progress and the current step are tracked there.
          </TradAtlasText>
        </Box>
        <Divider sx={{ borderColor: color.outline.fixed, my: "12px" }} />
        <TradAtlasText semanticFont={SF.labelMd} sx={{ color: color.type.muted }}>
          Thomas Chen requested a cybersecurity control posture assessment and SEC readiness review
          for the Audit Committee. Select Overview or a step in the left panel to continue.
        </TradAtlasText>
      </ContentCard>

      <ContentCard>
        <TradAtlasText semanticFont={SF.textMd} sx={{ fontWeight: weight.semiBold, color: color.type.default, mb: "16px" }}>
          Engagement details
        </TradAtlasText>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <DetailRow icon={<FactCheckOutlinedIcon sx={{ fontSize: 16 }} />} label="Framework" value="NIST CSF — 5 domains" />
          <DetailRow icon={<EventOutlinedIcon sx={{ fontSize: 16 }} />} label="Deadline" value="Thursday — Audit Committee" />
          <DetailRow icon={<AssessmentOutlinedIcon sx={{ fontSize: 16 }} />} label="Controls" value="41 controls, 3 regions" />
          <DetailRow icon={<AccountTreeOutlinedIcon sx={{ fontSize: 16 }} />} label="Requested by" value="Thomas Chen" />
          <DetailRow icon={<FactCheckOutlinedIcon sx={{ fontSize: 16 }} />} label="Report type" value="Assurance + SEC readiness" />
          <DetailRow icon={<AssessmentOutlinedIcon sx={{ fontSize: 16 }} />} label="Evidence" value="Multi-domain agent collection" />
        </Box>
      </ContentCard>

      <ContentCard>
        <TradAtlasText semanticFont={SF.textMd} sx={{ fontWeight: weight.semiBold, color: color.type.default, mb: "16px" }}>
          Workflow progress
        </TradAtlasText>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {steps.map((step) => (
            <Fragment key={step.id}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px", py: "6px", px: "8px", borderRadius: radius.sm }}>
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
                  {step.status === "completed" ? "Complete" : step.status === "in_progress" ? "In progress" : "Not started"}
                </TradAtlasText>
              </Box>
            </Fragment>
          ))}
        </Box>
      </ContentCard>
    </Box>
  );
}
