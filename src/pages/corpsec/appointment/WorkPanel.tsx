import { Fragment } from "react";
import { Box, Button, Chip, CircularProgress, Divider, LinearProgress } from "@mui/material";
import CollectAppointmentDataTabs from "./CollectAppointmentDataTabs";
import ConfigureApproversTabs from "./ConfigureApproversTabs";
import type { ApproverTabStatus } from "./ConfigureApproversTabs";
import type { SxProps, Theme } from "@mui/material/styles";
import {
  AutoAwesomeOutlinedIcon,
  CheckCircleOutlineIcon,
  CheckCircleIcon,
  RadioButtonUncheckedIcon,
  WarningAmberIcon,
  PersonOutlinedIcon,
  BusinessOutlinedIcon,
  PublicOutlinedIcon,
  EventOutlinedIcon,
  HowToVoteOutlinedIcon,
  UploadFileOutlinedIcon,
  StorageOutlinedIcon,
  SearchOutlinedIcon,
} from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import ContentCard from "@/components/common/ContentCard";
import SectionHeader from "@/components/common/SectionHeader";
import DetailRow from "@/components/common/DetailRow";
import StatusSubstepRow from "@/components/common/StatusSubstepRow";
import { DATA_SEMANTIC_FONT, SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "../../../hooks/useTokens";
import type { WorkflowStep, WorkflowStepId, AgenticProcessState } from "./AppointmentWorkspace";

export interface CollectDataTabStatus {
  entities: boolean;
  consent: boolean;
}

interface WorkPanelProps {
  activeStepId: WorkflowStepId | null;
  steps: WorkflowStep[];
  selectedCandidate: string | null;
  onSelectCandidate: (name: string) => void;
  collectDataTabStatus: CollectDataTabStatus;
  appointmentNric: string | null;
  appointmentEffectiveDate: string | null;
  onCollectDataEntitiesComplete: (payload: { nric: string; effectiveDate: string }) => void;
  onCollectDataConsentComplete: () => void;
  onReplaceConsentDocument: (file: File) => void;
  approverTabStatus: ApproverTabStatus;
  onApproversConfirmed: () => void;
  onResolutionSent: () => void;
  agenticState: AgenticProcessState;
}

export default function WorkPanel({
  activeStepId,
  steps,
  selectedCandidate,
  onSelectCandidate,
  collectDataTabStatus,
  appointmentNric,
  appointmentEffectiveDate,
  onCollectDataEntitiesComplete,
  onCollectDataConsentComplete,
  onReplaceConsentDocument,
  approverTabStatus,
  onApproversConfirmed,
  onResolutionSent,
  agenticState,
}: WorkPanelProps) {
  const { color } = useTokens();

  const isCollectData = activeStepId === "collect-data";
  const isSelectApprovers = activeStepId === "select-approvers";

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
      {isCollectData ? (
        <CollectDataStep
          steps={steps}
          selectedCandidate={selectedCandidate}
          collectDataTabStatus={collectDataTabStatus}
          appointmentNric={appointmentNric}
          appointmentEffectiveDate={appointmentEffectiveDate}
          onEntitiesComplete={onCollectDataEntitiesComplete}
          onConsentComplete={onCollectDataConsentComplete}
          onReplaceConsentDocument={onReplaceConsentDocument}
        />
      ) : isSelectApprovers ? (
        <ConfigureApproversTabs
          tabStatus={approverTabStatus}
          onApproversConfirmed={onApproversConfirmed}
          onResolutionSent={onResolutionSent}
        />
      ) : (
        <Box sx={{ flex: 1, overflow: "auto", p: "24px" }}>
          {activeStepId === null ? (
            <OverviewContent
              steps={steps}
              selectedCandidate={selectedCandidate}
              collectDataTabStatus={collectDataTabStatus}
              approverTabStatus={approverTabStatus}
            />
          ) : activeStepId === "identify-candidate" ? (
            <IdentifyCandidateStep
              selectedCandidate={selectedCandidate}
              onSelectCandidate={onSelectCandidate}
            />
          ) : activeStepId === "board-approval" ? (
            <BoardApprovalStep agenticState={agenticState} />
          ) : activeStepId === "filing" ? (
            <RegulatoryFilingStep agenticState={agenticState} />
          ) : activeStepId === "update-entities" ? (
            <UpdateEntitiesStep selectedCandidate={selectedCandidate} agenticState={agenticState} />
          ) : null}
        </Box>
      )}
    </Box>
  );
}

/* ── Shared ─────────────────────────────────────────────────────── */




/* ── Global overview (no step selected) ─────────────────────────── */

function OverviewContent({
  steps,
  selectedCandidate,
  collectDataTabStatus,
  approverTabStatus,
}: {
  steps: WorkflowStep[];
  selectedCandidate: string | null;
  collectDataTabStatus: CollectDataTabStatus;
  approverTabStatus: ApproverTabStatus;
}) {
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
          Board appointment overview
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
              Workday has reported
            </TradAtlasText>{" "}
            that Wei "David" Chen, Vice President of Commercial Operations (APAC), has submitted his
            resignation from Pacific Polymer Logistics Pte. Ltd. His last working day is{" "}
            <TradAtlasText component="span" semanticFont={SF.textMd} sx={{ fontWeight: weight.semiBold }}>
              April 17, 2026
            </TradAtlasText>{" "}
            — 14 days from now. The board will need to appoint a replacement director to maintain
            governance compliance with ACRA requirements in Singapore.
          </TradAtlasText>
        </Box>
        <Divider sx={{ borderColor: color.outline.fixed, my: "12px" }} />
        <TradAtlasText semanticFont={SF.labelMd} sx={{ color: color.type.muted }}>
          This workspace will guide you through identifying a qualified replacement candidate,
          collecting appointment data, routing the board resolution for approval, filing with ACRA,
          and updating entity records. The AI assistant on the right can answer questions at any step.
        </TradAtlasText>
      </ContentCard>

      {/* Key details */}
      <ContentCard>
        <TradAtlasText
          semanticFont={SF.textMd}
          sx={{
            fontWeight: weight.semiBold,
            color: color.type.default,
            mb: "16px",
          }}
        >
          Appointment details
        </TradAtlasText>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <DetailRow
            icon={<BusinessOutlinedIcon sx={{ fontSize: 16 }} />}
            label="Entity"
            value="Pacific Polymer Logistics Pte. Ltd."
          />
          <DetailRow
            icon={<PublicOutlinedIcon sx={{ fontSize: 16 }} />}
            label="Jurisdiction"
            value="Singapore (ACRA)"
          />
          <DetailRow
            icon={<PersonOutlinedIcon sx={{ fontSize: 16 }} />}
            label="Departing director"
            value='Wei "David" Chen — VP, Commercial Operations (APAC)'
          />
          <DetailRow
            icon={<EventOutlinedIcon sx={{ fontSize: 16 }} />}
            label="Last working day"
            value="April 17, 2026 (14 days)"
          />
          <DetailRow
            icon={<PersonOutlinedIcon sx={{ fontSize: 16 }} />}
            label="Replacement candidate"
            value={selectedCandidate ?? "Pending identification"}
            muted={!selectedCandidate}
          />
          <DetailRow
            icon={<EventOutlinedIcon sx={{ fontSize: 16 }} />}
            label="Effective date"
            value="Pending"
            muted
          />
        </Box>
      </ContentCard>

      {/* Jurisdictional requirements */}
      <ContentCard>
        <TradAtlasText
          semanticFont={SF.textMd}
          sx={{
            fontWeight: weight.semiBold,
            color: color.type.default,
            mb: "12px",
          }}
        >
          Singapore jurisdictional requirements
        </TradAtlasText>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            "Director must be a natural person, at least 18 years of age",
            "At least one director must be ordinarily resident in Singapore",
            "Director must not be disqualified under the Companies Act",
            "Form 45 — Consent to Act as Director must be filed with ACRA",
            "Form 45 — Notification of Change of Director must be filed within 14 days of appointment",
            "Board resolution required to approve the appointment",
          ].map((req) => (
            <Box key={req} sx={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
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
                {req}
              </TradAtlasText>
            </Box>
          ))}
        </Box>
      </ContentCard>

      {/* Workflow status */}
      <ContentCard>
        <TradAtlasText
          semanticFont={SF.textMd}
          sx={{
            fontWeight: weight.semiBold,
            color: color.type.default,
            mb: "16px",
          }}
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
              {step.id === "collect-data" && step.status !== "not_started" && (
                <Box sx={{ pl: "28px", display: "flex", flexDirection: "column", gap: "4px", mt: "-4px", mb: "4px" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {collectDataTabStatus.entities ? (
                      <CheckCircleOutlineIcon sx={{ fontSize: 14, color: color.status.success.default }} />
                    ) : (
                      <RadioButtonUncheckedIcon sx={{ fontSize: 14, color: color.outline.fixed }} />
                    )}
                    <TradAtlasText semanticFont={SF.textMicro} sx={{ color: color.type.muted }}>
                      Entities & appointment
                      {collectDataTabStatus.entities ? " — saved" : ""}
                    </TradAtlasText>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {collectDataTabStatus.consent ? (
                      <CheckCircleOutlineIcon sx={{ fontSize: 14, color: color.status.success.default }} />
                    ) : (
                      <RadioButtonUncheckedIcon sx={{ fontSize: 14, color: color.outline.fixed }} />
                    )}
                    <TradAtlasText semanticFont={SF.textMicro} sx={{ color: color.type.muted }}>
                      Consent to act document
                      {collectDataTabStatus.consent ? " — sent for signature" : ""}
                    </TradAtlasText>
                  </Box>
                </Box>
              )}
              {step.id === "select-approvers" && step.status !== "not_started" && (
                <Box sx={{ pl: "28px", display: "flex", flexDirection: "column", gap: "4px", mt: "-4px", mb: "4px" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {approverTabStatus.approversConfirmed ? (
                      <CheckCircleOutlineIcon sx={{ fontSize: 14, color: color.status.success.default }} />
                    ) : (
                      <RadioButtonUncheckedIcon sx={{ fontSize: 14, color: color.outline.fixed }} />
                    )}
                    <TradAtlasText semanticFont={SF.textMicro} sx={{ color: color.type.muted }}>
                      Select approvers
                      {approverTabStatus.approversConfirmed ? " — confirmed" : ""}
                    </TradAtlasText>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {approverTabStatus.resolutionSent ? (
                      <CheckCircleOutlineIcon sx={{ fontSize: 14, color: color.status.success.default }} />
                    ) : (
                      <RadioButtonUncheckedIcon sx={{ fontSize: 14, color: color.outline.fixed }} />
                    )}
                    <TradAtlasText semanticFont={SF.textMicro} sx={{ color: color.type.muted }}>
                      Board resolution
                      {approverTabStatus.resolutionSent ? " — sent for signature" : ""}
                    </TradAtlasText>
                  </Box>
                </Box>
              )}
            </Fragment>
          ))}
        </Box>
      </ContentCard>
    </Box>
  );
}

/* ── Step 1: Identify replacement candidate ─────────────────────── */

function IdentifyCandidateStep({
  selectedCandidate,
  onSelectCandidate,
}: {
  selectedCandidate: string | null;
  onSelectCandidate: (name: string) => void;
}) {
  const { color, weight, radius } = useTokens();

  const candidates = [
    {
      name: "Priya Nair",
      title: "Regional Finance Director, APAC",
      company: "Pacific Polymer Logistics Pte. Ltd.",
      match: 94,
      flags: ["Singapore resident", "No disqualifications", "Finance background"],
      recommended: true,
    },
    {
      name: "Lim Pei Shan",
      title: "Director of Risk Management & Trade Compliance",
      company: "Pacific Polymer Logistics Pte. Ltd.",
      match: 87,
      flags: ["Singapore resident", "No disqualifications", "Risk & compliance expertise"],
      recommended: false,
    },
    {
      name: "Kenji Tanaka",
      title: "Head of Digital Transformation, APAC",
      company: "Pacific Polymer Logistics Pte. Ltd.",
      match: 72,
      flags: [
        "Non-resident — may not satisfy local director requirement",
        "No disqualifications",
      ],
      recommended: false,
    },
  ];

  return (
    <Box sx={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: "20px" }}>
      <SectionHeader
        title="Identify replacement candidate"
        subtitle="Source candidates from Workday and screen against Singapore Companies Act requirements. The system ranks candidates by jurisdictional eligibility and role suitability."
        statusLabel="IN PROGRESS"
        statusVariant="in_progress"
      />

      {/* Workday source card */}
      <ContentCard>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <SearchOutlinedIcon
            sx={{ fontSize: 18, color: color.action.primary.default, mt: "2px" }}
          />
          <Box>
            <TradAtlasText
              semanticFont={SF.textMd}
              sx={{
                color: color.type.default,
                fontWeight: weight.semiBold,
                mb: "4px",
              }}
            >
              Workday integration
            </TradAtlasText>
            <TradAtlasText semanticFont={SF.labelMd} sx={{ color: color.type.muted }}>
              Connected to Acme, Inc. Workday tenant. Queried employees associated with Pacific
              Polymer Logistics Pte. Ltd. who hold eligible titles and meet minimum tenure
              requirements. Results filtered against Singapore Companies Act director eligibility
              criteria.
            </TradAtlasText>
          </Box>
        </Box>
      </ContentCard>

      {/* Candidate cards */}
      {candidates.map((c) => {
        const isSelected = selectedCandidate === c.name;
        return (
          <ContentCard
            key={c.name}
            sx={
              isSelected
                ? { border: `2px solid ${color.action.primary.default}` }
                : undefined
            }
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                mb: "12px",
              }}
            >
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default }}>
                    {c.name}
                  </TradAtlasText>
                  {c.recommended && (
                    <Chip
                      label="Recommended"
                      size="small"
                      {...{ [DATA_SEMANTIC_FONT]: SF.textMicro }}
                      sx={{
                        ...semanticFontStyle(SF.textMicro),
                        backgroundColor: color.status.success.background,
                        color: color.status.success.text,
                        fontWeight: weight.semiBold,
                        height: 20,
                        border: `1px solid ${color.status.success.default}`,
                      }}
                    />
                  )}
                  {isSelected && (
                    <Chip
                      label="Selected"
                      size="small"
                      {...{ [DATA_SEMANTIC_FONT]: SF.textMicro }}
                      sx={{
                        ...semanticFontStyle(SF.textMicro),
                        backgroundColor: color.action.primary.default,
                        color: "#fff",
                        fontWeight: weight.semiBold,
                        height: 20,
                      }}
                    />
                  )}
                </Box>
                <TradAtlasText semanticFont={SF.labelMd} sx={{ color: color.type.muted, mt: "2px" }}>
                  {c.title} · {c.company}
                </TradAtlasText>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <TradAtlasText
                  semanticFont={SF.titleH4Emphasis}
                  sx={{
                    color:
                      c.match >= 90
                        ? color.status.success.text
                        : c.match >= 80
                          ? color.action.primary.default
                          : color.status.warning.text,
                  }}
                >
                  {c.match}%
                </TradAtlasText>
                <TradAtlasText semanticFont={SF.textMicro} sx={{ color: color.type.muted }}>
                  match
                </TradAtlasText>
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {c.flags.map((flag) => {
                const isWarning =
                  flag.toLowerCase().includes("non-resident") ||
                  flag.toLowerCase().includes("may not");
                return (
                  <TradAtlasText
                    key={flag}
                    semanticFont={SF.textSmEmphasis}
                    sx={{
                      px: "8px",
                      py: "3px",
                      borderRadius: radius.sm,
                      border: `1px solid ${isWarning ? color.status.warning.default : color.outline.fixed}`,
                      background: isWarning
                        ? color.status.warning.background
                        : color.surface.subtle,
                      color: isWarning ? color.status.warning.text : color.type.muted,
                    }}
                  >
                    {flag}
                  </TradAtlasText>
                );
              })}
            </Box>

            <Box sx={{ mt: "12px" }}>
              <Button
                onClick={() => onSelectCandidate(c.name)}
                variant={isSelected ? "outlined" : c.recommended ? "contained" : "outlined"}
                color={isSelected || c.recommended ? "primary" : "inherit"}
                size="small"
                data-atlas-component="Button"
                {...{ [DATA_SEMANTIC_FONT]: SF.labelMd }}
                data-atlas-variant={
                  isSelected
                    ? "outlined - primary - sm - selected"
                    : c.recommended
                      ? "contained - primary - sm"
                      : "outlined - secondary - sm"
                }
                sx={
                  [
                    semanticFontStyle(SF.labelMd),
                    {
                      px: "14px",
                      py: "6px",
                      textTransform: "none",
                      fontWeight: weight.semiBold,
                      ...(isSelected
                        ? {}
                        : c.recommended
                          ? {}
                          : {
                              borderColor: color.outline.fixed,
                              color: color.type.default,
                              "&:hover": { background: color.surface.variant },
                            }),
                    },
                  ] as SxProps<Theme>
                }
              >
                {isSelected ? "Selected" : c.recommended ? "Select candidate" : "Select"}
              </Button>
            </Box>
          </ContentCard>
        );
      })}
    </Box>
  );
}

/* ── Step 2: Collect appointment data (full-bleed IDE-style tabs) ── */

function CollectDataStep({
  steps,
  selectedCandidate,
  collectDataTabStatus,
  appointmentNric,
  appointmentEffectiveDate,
  onEntitiesComplete,
  onConsentComplete,
  onReplaceConsentDocument,
}: {
  steps: WorkflowStep[];
  selectedCandidate: string | null;
  collectDataTabStatus: CollectDataTabStatus;
  appointmentNric: string | null;
  appointmentEffectiveDate: string | null;
  onEntitiesComplete: (payload: { nric: string; effectiveDate: string }) => void;
  onConsentComplete: () => void;
  onReplaceConsentDocument: (file: File) => void;
}) {
  return (
    <CollectAppointmentDataTabs
      steps={steps}
      selectedCandidate={selectedCandidate}
      entitiesComplete={collectDataTabStatus.entities}
      consentComplete={collectDataTabStatus.consent}
      appointmentNric={appointmentNric}
      appointmentEffectiveDate={appointmentEffectiveDate}
      onEntitiesComplete={onEntitiesComplete}
      onConsentComplete={onConsentComplete}
      onReplaceConsentDocument={onReplaceConsentDocument}
    />
  );
}

/* ── Step 4: Board approval ─────────────────────────────────────── */

function BoardApprovalStep({ agenticState }: { agenticState: AgenticProcessState }) {
  const { color, weight } = useTokens();

  const approvedCount = agenticState.votes.filter((v) => v.status === "approved").length;
  const totalVotes = agenticState.votes.length;
  const allApproved = approvedCount === totalVotes;

  return (
    <Box sx={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: "20px" }}>
      <SectionHeader
        title="Board approval"
        subtitle="The board resolution has been sent to selected approvers for electronic signature. Progress is tracked in real time."
        statusLabel={allApproved ? "COMPLETE" : "IN PROGRESS"}
        statusVariant={allApproved ? "completed" : "in_progress"}
      />

      {/* Progress bar */}
      <ContentCard>
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px", mb: "16px" }}>
          <HowToVoteOutlinedIcon sx={{ fontSize: 18, color: allApproved ? color.status.success.default : color.action.primary.default }} />
          <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default }}>
            {allApproved
              ? "All approvals received — resolution is signed"
              : `${approvedCount} of ${totalVotes} approvals received`}
          </TradAtlasText>
        </Box>
        <LinearProgress
          variant="determinate"
          value={(approvedCount / totalVotes) * 100}
          sx={{
            height: 6,
            borderRadius: 3,
            mb: "20px",
            backgroundColor: color.outline.fixed,
            "& .MuiLinearProgress-bar": {
              backgroundColor: allApproved ? color.status.success.default : color.action.primary.default,
              borderRadius: 3,
              transition: "transform 0.6s ease",
            },
          }}
        />

        {/* Voter rows */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {agenticState.votes.map((v) => (
            <Box
              key={v.id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                py: "10px",
                px: "4px",
                borderBottom: `1px solid ${color.outline.fixed}`,
                "&:last-child": { borderBottom: "none" },
              }}
            >
              {v.status === "approved" ? (
                <CheckCircleIcon sx={{ fontSize: 20, color: color.status.success.default, flexShrink: 0 }} />
              ) : (
                <CircularProgress size={18} thickness={5} sx={{ color: color.outline.fixed, flexShrink: 0, ml: "1px", mr: "1px" }} />
              )}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <TradAtlasText semanticFont={SF.labelMd} sx={{ color: color.type.default }}>
                  {v.name}
                </TradAtlasText>
                <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
                  {v.title}
                </TradAtlasText>
              </Box>
              {v.status === "approved" ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                  <Chip
                    label="Approved"
                    size="small"
                    sx={{
                      ...semanticFontStyle(SF.textXs),
                      height: 20,
                      backgroundColor: color.status.success.background,
                      color: color.status.success.text,
                      fontWeight: weight.semiBold,
                      border: `1px solid ${color.status.success.default}`,
                    }}
                  />
                  <TradAtlasText semanticFont={SF.textMicro} sx={{ color: color.type.muted }}>
                    {v.time}
                  </TradAtlasText>
                </Box>
              ) : (
                <Chip
                  label="Awaiting"
                  size="small"
                  sx={{
                    ...semanticFontStyle(SF.textXs),
                    height: 20,
                    backgroundColor: color.surface.subtle,
                    color: color.type.muted,
                    fontWeight: weight.medium,
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      </ContentCard>

      {allApproved && (
        <ContentCard>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 18, color: color.status.success.default, mt: "2px" }} />
            <Box>
              <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.default, fontWeight: weight.semiBold, mb: "4px" }}>
                Resolution signed
              </TradAtlasText>
              <TradAtlasText semanticFont={SF.labelMd} sx={{ color: color.type.muted }}>
                All {totalVotes} board members have approved the Board Resolution for the appointment of
                Priya Nair as director of Pacific Polymer Logistics Pte. Ltd. The signed document is now
                available for regulatory filing.
              </TradAtlasText>
            </Box>
          </Box>
        </ContentCard>
      )}
    </Box>
  );
}

/* ── Step 5: Regulatory filing ──────────────────────────────────── */

function RegulatoryFilingStep({ agenticState }: { agenticState: AgenticProcessState }) {
  const { color, weight } = useTokens();

  const completedCount = agenticState.filingSubsteps.filter((s) => s.status === "completed").length;
  const allDone = completedCount === agenticState.filingSubsteps.length;

  return (
    <Box sx={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: "20px" }}>
      <SectionHeader
        title="Regulatory filing"
        subtitle="The system is automatically preparing and filing documents with ACRA on behalf of Pacific Polymer Logistics Pte. Ltd."
        statusLabel={allDone ? "COMPLETE" : "IN PROGRESS"}
        statusVariant={allDone ? "completed" : "in_progress"}
      />

      <ContentCard>
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px", mb: "16px" }}>
          <UploadFileOutlinedIcon sx={{ fontSize: 18, color: allDone ? color.status.success.default : color.action.primary.default }} />
          <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default }}>
            {allDone
              ? "Filing complete — all documents submitted to ACRA"
              : `${completedCount} of ${agenticState.filingSubsteps.length} filing tasks complete`}
          </TradAtlasText>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {agenticState.filingSubsteps.map((sub) => (
            <StatusSubstepRow key={sub.name} status={sub.status} label={sub.name} time={sub.time} />
          ))}
        </Box>
      </ContentCard>

      <ContentCard>
        <TradAtlasText semanticFont={SF.textMd} sx={{ fontWeight: weight.semiBold, color: color.type.default, mb: "8px" }}>
          Documents filed
        </TradAtlasText>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {[
            "Board Resolution (Signed) — Board_Resolution_PacificPolymer.pdf",
            "Form 45 — Consent to Act as Director — Consent_to_Act.pdf",
            "Form 45 — Notification of Change of Director — Form_45_PacificPolymer.pdf",
          ].map((doc) => (
            <Box key={doc} sx={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              {allDone ? (
                <CheckCircleIcon sx={{ fontSize: 14, color: color.status.success.default, flexShrink: 0, mt: "3px" }} />
              ) : (
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
              )}
              <TradAtlasText semanticFont={SF.labelMd} sx={{ color: color.type.muted }}>
                {doc}
              </TradAtlasText>
            </Box>
          ))}
        </Box>
      </ContentCard>
    </Box>
  );
}

/* ── Step 6: Update entity records ──────────────────────────────── */

function UpdateEntitiesStep({
  selectedCandidate,
  agenticState,
}: {
  selectedCandidate: string | null;
  agenticState: AgenticProcessState;
}) {
  const { color, weight } = useTokens();

  const completedCount = agenticState.entitySubsteps.filter((s) => s.status === "completed").length;
  const allDone = completedCount === agenticState.entitySubsteps.length;

  return (
    <Box sx={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: "20px" }}>
      <SectionHeader
        title="Update entity records"
        subtitle="The system is automatically recording the resignation and new appointment in the entity management system."
        statusLabel={allDone ? "COMPLETE" : "IN PROGRESS"}
        statusVariant={allDone ? "completed" : "in_progress"}
      />

      <ContentCard>
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px", mb: "16px" }}>
          <StorageOutlinedIcon sx={{ fontSize: 18, color: allDone ? color.status.success.default : color.action.primary.default }} />
          <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default }}>
            {allDone
              ? "Entity records updated — workflow complete"
              : `${completedCount} of ${agenticState.entitySubsteps.length} records updated`}
          </TradAtlasText>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {agenticState.entitySubsteps.map((sub) => (
            <StatusSubstepRow key={sub.name} status={sub.status} label={sub.name} time={sub.time} />
          ))}
        </Box>
      </ContentCard>

      {allDone && (
        <ContentCard sx={{ border: `1px solid ${color.status.success.default}`, background: color.status.success.background }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 20, color: color.status.success.default, mt: "2px" }} />
            <Box>
              <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.default, fontWeight: weight.semiBold, mb: "4px" }}>
                Appointment workflow complete
              </TradAtlasText>
              <TradAtlasText semanticFont={SF.labelMd} sx={{ color: color.type.muted }}>
                David Chen's resignation has been recorded and{" "}
                {selectedCandidate ? `${selectedCandidate}` : "the new appointee"} has been appointed as
                director of Pacific Polymer Logistics Pte. Ltd. All regulatory filings have been
                submitted to ACRA, entity records are updated, and the board resolution has been signed
                by all approvers.
              </TradAtlasText>
            </Box>
          </Box>
        </ContentCard>
      )}
    </Box>
  );
}
