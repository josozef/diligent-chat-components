import { Box, Chip, Divider, Typography } from "@mui/material";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import HowToVoteOutlinedIcon from "@mui/icons-material/HowToVoteOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useTokens } from "../../../hooks/useTokens";
import type { WorkflowStep, WorkflowStepId } from "./AppointmentWorkspace";

interface WorkPanelProps {
  activeStepId: WorkflowStepId | null;
  steps: WorkflowStep[];
  selectedCandidate: string | null;
  onSelectCandidate: (name: string) => void;
}

export default function WorkPanel({
  activeStepId,
  steps,
  selectedCandidate,
  onSelectCandidate,
}: WorkPanelProps) {
  const { color } = useTokens();

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
      <Box sx={{ flex: 1, overflow: "auto", p: "24px" }}>
        {activeStepId === null ? (
          <OverviewContent steps={steps} selectedCandidate={selectedCandidate} />
        ) : activeStepId === "identify-candidate" ? (
          <IdentifyCandidateStep
            selectedCandidate={selectedCandidate}
            onSelectCandidate={onSelectCandidate}
          />
        ) : activeStepId === "collect-data" ? (
          <CollectDataStep selectedCandidate={selectedCandidate} />
        ) : activeStepId === "select-approvers" ? (
          <ConfigureApproversStep />
        ) : activeStepId === "board-approval" ? (
          <BoardApprovalStep />
        ) : activeStepId === "filing" ? (
          <RegulatoryFilingStep />
        ) : activeStepId === "update-entities" ? (
          <UpdateEntitiesStep selectedCandidate={selectedCandidate} />
        ) : null}
      </Box>
    </Box>
  );
}

/* ── Shared ─────────────────────────────────────────────────────── */

function SummaryCard({ children, sx }: { children: React.ReactNode; sx?: object }) {
  const { color, radius } = useTokens();
  return (
    <Box
      sx={{
        borderRadius: radius.lg,
        border: `1px solid ${color.outline.fixed}`,
        background: color.surface.default,
        p: "20px",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

function StepHeader({
  title,
  subtitle,
  statusLabel,
  statusVariant,
}: {
  title: string;
  subtitle: string;
  statusLabel: string;
  statusVariant: "in_progress" | "not_started" | "completed";
}) {
  const { color, weight } = useTokens();
  const chipColor =
    statusVariant === "completed"
      ? color.status.success.default
      : statusVariant === "in_progress"
        ? color.action.primary.default
        : color.type.disabled;

  return (
    <Box sx={{ mb: "20px" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: "4px" }}>
        <Typography
          sx={{
            fontSize: "18px",
            lineHeight: "28px",
            fontWeight: weight.semiBold,
            color: color.type.default,
          }}
        >
          {title}
        </Typography>
        <Chip
          label={statusLabel}
          size="small"
          sx={{
            backgroundColor: chipColor,
            color: "#fff",
            fontWeight: weight.semiBold,
            fontSize: "10px",
            height: 20,
            letterSpacing: "0.5px",
          }}
        />
      </Box>
      <Typography sx={{ fontSize: "14px", lineHeight: "20px", color: color.type.muted }}>
        {subtitle}
      </Typography>
    </Box>
  );
}

function DetailRow({
  icon,
  label,
  value,
  muted,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  muted?: boolean;
}) {
  const { color, weight } = useTokens();
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
      <Box sx={{ color: color.type.muted, mt: "2px" }}>{icon}</Box>
      <Box>
        <Typography
          sx={{ fontSize: "11px", lineHeight: "16px", color: color.type.muted, fontWeight: weight.medium }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: "13px",
            lineHeight: "20px",
            color: muted ? color.type.disabled : color.type.default,
            fontWeight: weight.medium,
            fontStyle: muted ? "italic" : "normal",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

/* ── Global overview (no step selected) ─────────────────────────── */

function OverviewContent({
  steps,
  selectedCandidate,
}: {
  steps: WorkflowStep[];
  selectedCandidate: string | null;
}) {
  const { color, weight, radius } = useTokens();

  return (
    <Box sx={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: "24px" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Typography
          sx={{
            fontSize: "18px",
            lineHeight: "28px",
            fontWeight: weight.semiBold,
            color: color.type.default,
          }}
        >
          Board appointment overview
        </Typography>
        <Chip
          label="IN PROGRESS"
          size="small"
          sx={{
            backgroundColor: color.action.primary.default,
            color: "#fff",
            fontWeight: weight.semiBold,
            fontSize: "10px",
            height: 20,
            letterSpacing: "0.5px",
          }}
        />
      </Box>

      {/* AI summary */}
      <SummaryCard>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: "12px", mb: "16px" }}>
          <AutoAwesomeOutlinedIcon
            sx={{ fontSize: 18, color: color.action.primary.default, mt: "2px" }}
          />
          <Typography sx={{ fontSize: "14px", lineHeight: "22px", color: color.type.default }}>
            <Box component="span" sx={{ fontWeight: weight.semiBold }}>
              Workday has reported
            </Box>{" "}
            that Wei "David" Chen, Vice President of Commercial Operations (APAC), has submitted his
            resignation from Pacific Polymer Logistics Pte. Ltd. His last working day is{" "}
            <Box component="span" sx={{ fontWeight: weight.semiBold }}>
              April 17, 2026
            </Box>{" "}
            — 14 days from now. The board will need to appoint a replacement director to maintain
            governance compliance with ACRA requirements in Singapore.
          </Typography>
        </Box>
        <Divider sx={{ borderColor: color.outline.fixed, my: "12px" }} />
        <Typography sx={{ fontSize: "13px", lineHeight: "20px", color: color.type.muted }}>
          This workspace will guide you through identifying a qualified replacement candidate,
          collecting appointment data, routing the board resolution for approval, filing with ACRA,
          and updating entity records. The AI assistant on the right can answer questions at any step.
        </Typography>
      </SummaryCard>

      {/* Key details */}
      <SummaryCard>
        <Typography
          sx={{
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: weight.semiBold,
            color: color.type.default,
            mb: "16px",
          }}
        >
          Appointment details
        </Typography>
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
      </SummaryCard>

      {/* Jurisdictional requirements */}
      <SummaryCard>
        <Typography
          sx={{
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: weight.semiBold,
            color: color.type.default,
            mb: "12px",
          }}
        >
          Singapore jurisdictional requirements
        </Typography>
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
              <Typography sx={{ fontSize: "13px", lineHeight: "20px", color: color.type.muted }}>
                {req}
              </Typography>
            </Box>
          ))}
        </Box>
      </SummaryCard>

      {/* Workflow status */}
      <SummaryCard>
        <Typography
          sx={{
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: weight.semiBold,
            color: color.type.default,
            mb: "16px",
          }}
        >
          Workflow progress
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {steps.map((step) => (
            <Box
              key={step.id}
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
              <Typography
                sx={{
                  fontSize: "13px",
                  lineHeight: "18px",
                  color: step.status === "not_started" ? color.type.muted : color.type.default,
                  fontWeight: step.status === "in_progress" ? weight.semiBold : weight.regular,
                  flex: 1,
                }}
              >
                {step.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: "11px",
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
              </Typography>
            </Box>
          ))}
        </Box>
      </SummaryCard>
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
      <StepHeader
        title="Identify replacement candidate"
        subtitle="Source candidates from Workday and screen against Singapore Companies Act requirements. The system ranks candidates by jurisdictional eligibility and role suitability."
        statusLabel="IN PROGRESS"
        statusVariant="in_progress"
      />

      {/* Workday source card */}
      <SummaryCard>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <SearchOutlinedIcon
            sx={{ fontSize: 18, color: color.action.primary.default, mt: "2px" }}
          />
          <Box>
            <Typography
              sx={{
                fontSize: "14px",
                lineHeight: "22px",
                color: color.type.default,
                fontWeight: weight.semiBold,
                mb: "4px",
              }}
            >
              Workday integration
            </Typography>
            <Typography sx={{ fontSize: "13px", lineHeight: "20px", color: color.type.muted }}>
              Connected to Acme, Inc. Workday tenant. Queried employees associated with Pacific
              Polymer Logistics Pte. Ltd. who hold eligible titles and meet minimum tenure
              requirements. Results filtered against Singapore Companies Act director eligibility
              criteria.
            </Typography>
          </Box>
        </Box>
      </SummaryCard>

      {/* Candidate cards */}
      {candidates.map((c) => {
        const isSelected = selectedCandidate === c.name;
        return (
          <SummaryCard
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
                  <Typography
                    sx={{
                      fontSize: "15px",
                      lineHeight: "22px",
                      fontWeight: weight.semiBold,
                      color: color.type.default,
                    }}
                  >
                    {c.name}
                  </Typography>
                  {c.recommended && (
                    <Chip
                      label="Recommended"
                      size="small"
                      sx={{
                        backgroundColor: color.status.success.background,
                        color: color.status.success.text,
                        fontWeight: weight.semiBold,
                        fontSize: "11px",
                        height: 20,
                        border: `1px solid ${color.status.success.default}`,
                      }}
                    />
                  )}
                  {isSelected && (
                    <Chip
                      label="Selected"
                      size="small"
                      sx={{
                        backgroundColor: color.action.primary.default,
                        color: "#fff",
                        fontWeight: weight.semiBold,
                        fontSize: "11px",
                        height: 20,
                      }}
                    />
                  )}
                </Box>
                <Typography sx={{ fontSize: "13px", color: color.type.muted, mt: "2px" }}>
                  {c.title} · {c.company}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  sx={{
                    fontSize: "20px",
                    lineHeight: "24px",
                    fontWeight: weight.bold,
                    color:
                      c.match >= 90
                        ? color.status.success.text
                        : c.match >= 80
                          ? color.action.primary.default
                          : color.status.warning.text,
                  }}
                >
                  {c.match}%
                </Typography>
                <Typography sx={{ fontSize: "11px", color: color.type.muted }}>match</Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {c.flags.map((flag) => {
                const isWarning =
                  flag.toLowerCase().includes("non-resident") ||
                  flag.toLowerCase().includes("may not");
                return (
                  <Typography
                    key={flag}
                    sx={{
                      fontSize: "12px",
                      lineHeight: "16px",
                      px: "8px",
                      py: "3px",
                      borderRadius: radius.sm,
                      border: `1px solid ${isWarning ? color.status.warning.default : color.outline.fixed}`,
                      background: isWarning
                        ? color.status.warning.background
                        : color.surface.subtle,
                      color: isWarning ? color.status.warning.text : color.type.muted,
                      fontWeight: weight.medium,
                    }}
                  >
                    {flag}
                  </Typography>
                );
              })}
            </Box>

            <Box sx={{ mt: "12px" }}>
              <Box
                component="button"
                onClick={() => onSelectCandidate(c.name)}
                sx={{
                  px: "14px",
                  py: "6px",
                  borderRadius: radius.lg,
                  border:
                    c.recommended && !isSelected
                      ? "none"
                      : `1px solid ${isSelected ? color.action.primary.default : color.outline.fixed}`,
                  background: isSelected
                    ? color.surface.default
                    : c.recommended
                      ? color.action.primary.default
                      : color.surface.default,
                  color: isSelected
                    ? color.action.primary.default
                    : c.recommended
                      ? color.action.primary.onPrimary
                      : color.type.default,
                  fontSize: "13px",
                  fontWeight: weight.semiBold,
                  cursor: "pointer",
                  "&:hover": {
                    background: isSelected
                      ? color.surface.subtle
                      : c.recommended
                        ? color.action.primary.hover
                        : color.surface.variant,
                  },
                }}
              >
                {isSelected ? "Selected" : c.recommended ? "Select candidate" : "Select"}
              </Box>
            </Box>
          </SummaryCard>
        );
      })}
    </Box>
  );
}

/* ── Step 2: Collect appointment data ───────────────────────────── */

function CollectDataStep({ selectedCandidate }: { selectedCandidate: string | null }) {
  const { color, weight } = useTokens();

  return (
    <Box sx={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: "20px" }}>
      <StepHeader
        title="Collect appointment data"
        subtitle="Confirm the entity, appointee, effective date, and consent to act status for this appointment."
        statusLabel="NOT STARTED"
        statusVariant="not_started"
      />

      <SummaryCard>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <DetailRow
            icon={<BusinessOutlinedIcon sx={{ fontSize: 16 }} />}
            label="Company"
            value="Pacific Polymer Logistics Pte. Ltd."
          />
          <DetailRow
            icon={<PersonOutlinedIcon sx={{ fontSize: 16 }} />}
            label="Appointee"
            value={selectedCandidate ?? "Pending — select a candidate first"}
            muted={!selectedCandidate}
          />
          <DetailRow
            icon={<EventOutlinedIcon sx={{ fontSize: 16 }} />}
            label="Effective date"
            value="To be confirmed"
            muted
          />
          <DetailRow
            icon={<GavelOutlinedIcon sx={{ fontSize: 16 }} />}
            label="Consent to act"
            value="Pending"
            muted
          />
        </Box>
      </SummaryCard>

      <SummaryCard>
        <Typography
          sx={{
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: weight.semiBold,
            color: color.type.default,
            mb: "8px",
          }}
        >
          What happens at this step
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {[
            "Confirm the company and appointee selections",
            "Set the effective date for the appointment",
            "Confirm whether a Consent to Act form is on file for the appointee",
            "Data will be used to generate the board resolution and regulatory filings",
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
              <Typography sx={{ fontSize: "13px", lineHeight: "20px", color: color.type.muted }}>
                {item}
              </Typography>
            </Box>
          ))}
        </Box>
      </SummaryCard>
    </Box>
  );
}

/* ── Step 3: Configure approvers ────────────────────────────────── */

function ConfigureApproversStep() {
  const { color, weight } = useTokens();

  return (
    <Box sx={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: "20px" }}>
      <StepHeader
        title="Configure approvers"
        subtitle="Select a board committee and choose which members will approve this appointment."
        statusLabel="NOT STARTED"
        statusVariant="not_started"
      />

      <SummaryCard>
        <Typography
          sx={{
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: weight.semiBold,
            color: color.type.default,
            mb: "8px",
          }}
        >
          What happens at this step
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {[
            "Select one of four committees: Nomination, Audit, Compensation, or Governance",
            "Choose which committee members will approve the appointment",
            "Members with missing signature templates will be disabled",
            "Documents (Board Resolution, Form 45) are auto-generated after confirmation",
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
              <Typography sx={{ fontSize: "13px", lineHeight: "20px", color: color.type.muted }}>
                {item}
              </Typography>
            </Box>
          ))}
        </Box>
      </SummaryCard>
    </Box>
  );
}

/* ── Step 4: Board approval ─────────────────────────────────────── */

function BoardApprovalStep() {
  const { color, weight } = useTokens();

  return (
    <Box sx={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: "20px" }}>
      <StepHeader
        title="Board approval"
        subtitle="The board resolution is sent to selected approvers for electronic signature. Progress is tracked in real time."
        statusLabel="NOT STARTED"
        statusVariant="not_started"
      />

      <SummaryCard>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <HowToVoteOutlinedIcon
            sx={{ fontSize: 18, color: color.type.muted, mt: "2px" }}
          />
          <Box>
            <Typography
              sx={{
                fontSize: "14px",
                lineHeight: "22px",
                color: color.type.default,
                fontWeight: weight.semiBold,
                mb: "4px",
              }}
            >
              Automated approval process
            </Typography>
            <Typography sx={{ fontSize: "13px", lineHeight: "20px", color: color.type.muted }}>
              Once started, the system sends the Board Resolution to each selected approver and
              collects their votes. A running tally tracks progress (e.g. "2/4 Approved"). When all
              approvers respond, the resolution is marked as signed and documents become available
              for filing.
            </Typography>
          </Box>
        </Box>
      </SummaryCard>
    </Box>
  );
}

/* ── Step 5: Regulatory filing ──────────────────────────────────── */

function RegulatoryFilingStep() {
  const { color, weight } = useTokens();

  return (
    <Box sx={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: "20px" }}>
      <StepHeader
        title="Regulatory filing"
        subtitle="Download signed documents and file them with ACRA. This step requires manual confirmation."
        statusLabel="NOT STARTED"
        statusVariant="not_started"
      />

      <SummaryCard>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <UploadFileOutlinedIcon
            sx={{ fontSize: 18, color: color.type.muted, mt: "2px" }}
          />
          <Box>
            <Typography
              sx={{
                fontSize: "14px",
                lineHeight: "22px",
                color: color.type.default,
                fontWeight: weight.semiBold,
                mb: "4px",
              }}
            >
              Manual filing with ACRA
            </Typography>
            <Typography sx={{ fontSize: "13px", lineHeight: "20px", color: color.type.muted }}>
              After the board resolution is signed, you will need to download the signed Board
              Resolution and Form 45 — Notification of Change of Director. File these documents with
              ACRA via their e-Filing system. Once complete, confirm the filing here to proceed.
            </Typography>
          </Box>
        </Box>
      </SummaryCard>

      <SummaryCard>
        <Typography
          sx={{
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: weight.semiBold,
            color: color.type.default,
            mb: "8px",
          }}
        >
          Documents required
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {[
            "Board Resolution (Signed) — Board_Resolution_PacificPolymer.pdf",
            "Form 45 — Consent to Act as Director — Consent_to_Act.pdf",
            "Form 45 — Notification of Change of Director — Form_45_PacificPolymer.pdf",
          ].map((doc) => (
            <Box key={doc} sx={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
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
              <Typography sx={{ fontSize: "13px", lineHeight: "20px", color: color.type.muted }}>
                {doc}
              </Typography>
            </Box>
          ))}
        </Box>
      </SummaryCard>
    </Box>
  );
}

/* ── Step 6: Update entity records ──────────────────────────────── */

function UpdateEntitiesStep({
  selectedCandidate,
}: {
  selectedCandidate: string | null;
}) {
  const { color, weight } = useTokens();

  return (
    <Box sx={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: "20px" }}>
      <StepHeader
        title="Update entity records"
        subtitle="Automatically record the resignation and new appointment in the entity management system."
        statusLabel="NOT STARTED"
        statusVariant="not_started"
      />

      <SummaryCard>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <StorageOutlinedIcon
            sx={{ fontSize: 18, color: color.type.muted, mt: "2px" }}
          />
          <Box>
            <Typography
              sx={{
                fontSize: "14px",
                lineHeight: "22px",
                color: color.type.default,
                fontWeight: weight.semiBold,
                mb: "4px",
              }}
            >
              Automated entity updates
            </Typography>
            <Typography sx={{ fontSize: "13px", lineHeight: "20px", color: color.type.muted }}>
              After filing is confirmed, the system will automatically update Pacific Polymer
              Logistics Pte. Ltd.'s entity records. First, it will record David Chen's resignation.
              Then it will record{" "}
              {selectedCandidate ? `${selectedCandidate}'s` : "the new appointee's"} appointment as
              director. Each substep shows a timestamp when completed.
            </Typography>
          </Box>
        </Box>
      </SummaryCard>
    </Box>
  );
}
