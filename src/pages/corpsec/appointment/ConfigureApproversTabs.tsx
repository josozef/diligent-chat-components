import { useState } from "react";
import { Box, Button, Chip, Collapse, IconButton } from "@mui/material";
import {
  CheckCircleIcon,
  CloseIcon,
  ExpandMoreIcon,
  ExpandLessIcon,
  PersonOutlinedIcon,
  PersonAddOutlinedIcon,
  GroupsOutlinedIcon,
  HowToVoteOutlinedIcon,
  RadioButtonUncheckedIcon,
} from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import SectionHeader from "@/components/common/SectionHeader";
import IdeTabs from "@/components/common/IdeTabs";
import type { TabDef } from "@/components/common/IdeTabs";
import { SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";
import BoardResolutionEditor from "./BoardResolutionEditor";

/* ── Shared ────────────────────────────────── */

interface Approver {
  id: string;
  name: string;
  initials: string;
  title: string;
  email: string;
  status: "pending" | "approved" | "declined";
}

interface CommitteeMember {
  id: string;
  name: string;
  initials: string;
  title: string;
  email: string;
  disabled?: boolean;
  disabledReason?: string;
}

interface Committee {
  name: string;
  members: CommitteeMember[];
}

const INITIAL_APPROVERS: Approver[] = [
  { id: "robert-johnson", name: "Robert Johnson", initials: "RJ", title: "Committee Chair", email: "rjohnson@acme.com", status: "pending" },
  { id: "margaret-sullivan", name: "Margaret Sullivan", initials: "MS", title: "Chief Executive Officer", email: "msullivan@acme.com", status: "pending" },
  { id: "linda-williams", name: "Linda Williams", initials: "LW", title: "Independent Director", email: "lwilliams@acme.com", status: "pending" },
  { id: "david-martinez", name: "David Martinez", initials: "DM", title: "Independent Director", email: "dmartinez@acme.com", status: "pending" },
];

const COMMITTEES: Committee[] = [
  {
    name: "Nomination Committee",
    members: [
      { id: "robert-johnson", name: "Robert Johnson", initials: "RJ", title: "Committee Chair", email: "rjohnson@acme.com" },
      { id: "margaret-sullivan", name: "Margaret Sullivan", initials: "MS", title: "Chief Executive Officer", email: "msullivan@acme.com" },
      { id: "linda-williams", name: "Linda Williams", initials: "LW", title: "Independent Director", email: "lwilliams@acme.com" },
      { id: "david-martinez", name: "David Martinez", initials: "DM", title: "Independent Director", email: "dmartinez@acme.com" },
      { id: "james-davidson", name: "James Davidson", initials: "JD", title: "Lead Independent Director", email: "jdavidson@acme.com", disabled: true, disabledReason: "Missing a saved signature template" },
    ],
  },
  {
    name: "Audit Committee",
    members: [
      { id: "linda-williams", name: "Linda Williams", initials: "LW", title: "Committee Chair", email: "lwilliams@acme.com" },
      { id: "thomas-chen", name: "Thomas Chen", initials: "TC", title: "Independent Director", email: "tchen@acme.com" },
      { id: "sarah-patel", name: "Sarah Patel", initials: "SP", title: "Independent Director", email: "spatel@acme.com" },
      { id: "david-martinez", name: "David Martinez", initials: "DM", title: "Independent Director", email: "dmartinez@acme.com" },
    ],
  },
  {
    name: "Compensation Committee",
    members: [
      { id: "david-martinez", name: "David Martinez", initials: "DM", title: "Committee Chair", email: "dmartinez@acme.com" },
      { id: "robert-johnson", name: "Robert Johnson", initials: "RJ", title: "Board Chair", email: "rjohnson@acme.com" },
      { id: "patricia-walsh", name: "Patricia Walsh", initials: "PW", title: "Independent Director", email: "pwalsh@acme.com" },
      { id: "sarah-patel", name: "Sarah Patel", initials: "SP", title: "Independent Director", email: "spatel@acme.com" },
      { id: "margaret-sullivan", name: "Margaret Sullivan", initials: "MS", title: "Chief Executive Officer", email: "msullivan@acme.com" },
    ],
  },
  {
    name: "Governance Committee",
    members: [
      { id: "margaret-sullivan", name: "Margaret Sullivan", initials: "MS", title: "Committee Chair", email: "msullivan@acme.com" },
      { id: "robert-johnson", name: "Robert Johnson", initials: "RJ", title: "Board Chair", email: "rjohnson@acme.com" },
      { id: "thomas-chen", name: "Thomas Chen", initials: "TC", title: "Independent Director", email: "tchen@acme.com" },
      { id: "patricia-walsh", name: "Patricia Walsh", initials: "PW", title: "Independent Director", email: "pwalsh@acme.com" },
      { id: "linda-williams", name: "Linda Williams", initials: "LW", title: "Independent Director", email: "lwilliams@acme.com" },
      { id: "james-davidson", name: "James Davidson", initials: "JD", title: "Lead Independent Director", email: "jdavidson@acme.com", disabled: true, disabledReason: "Missing a saved signature template" },
    ],
  },
];

/* ── Main Component ────────────────────────── */

export interface ApproverTabStatus {
  approversConfirmed: boolean;
  resolutionSent: boolean;
}

export default function ConfigureApproversTabs({
  tabStatus,
  onApproversConfirmed,
  onResolutionSent,
}: {
  tabStatus: ApproverTabStatus;
  onApproversConfirmed: () => void;
  onResolutionSent: () => void;
}) {
  const [tab, setTab] = useState(0);

  const tabs: TabDef[] = [
    { label: "Overview", done: tabStatus.approversConfirmed && tabStatus.resolutionSent },
    { label: "Select approvers", done: tabStatus.approversConfirmed },
    { label: "Board resolution", done: tabStatus.resolutionSent },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <IdeTabs tabs={tabs} active={tab} onChange={setTab} />
      <Box sx={{ flex: 1, overflow: "auto", p: "24px" }}>
        {tab === 0 ? (
          <OverviewTab
            tabStatus={tabStatus}
            onGoToApprovers={() => setTab(1)}
            onGoToResolution={() => setTab(2)}
          />
        ) : tab === 1 ? (
          <SelectApproversTab
            confirmed={tabStatus.approversConfirmed}
            onConfirm={onApproversConfirmed}
          />
        ) : (
          <BoardResolutionTab
            sent={tabStatus.resolutionSent}
            onSend={onResolutionSent}
          />
        )}
      </Box>
    </Box>
  );
}

/* ── Tab 0: Overview ───────────────────────── */

function OverviewTab({
  tabStatus,
  onGoToApprovers,
  onGoToResolution,
}: {
  tabStatus: ApproverTabStatus;
  onGoToApprovers: () => void;
  onGoToResolution: () => void;
}) {
  const { color, weight, radius } = useTokens();

  const allDone = tabStatus.approversConfirmed && tabStatus.resolutionSent;

  return (
    <Box sx={{ maxWidth: 680, display: "flex", flexDirection: "column", gap: "20px" }}>
      <SectionHeader
        title="Configure approvers"
        subtitle="Select the board members who will approve this appointment and review the Board Resolution document before sending it for signature."
        statusLabel={allDone ? "COMPLETE" : "IN PROGRESS"}
        statusVariant={allDone ? "completed" : "in_progress"}
      />

      {/* Checklist cards */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {/* Select Approvers task */}
        <Box
          sx={{
            p: "20px",
            borderRadius: radius.lg,
            border: `1px solid ${tabStatus.approversConfirmed ? color.status.success.default : color.outline.fixed}`,
            background: color.surface.default,
            display: "flex",
            alignItems: "flex-start",
            gap: "14px",
          }}
        >
          {tabStatus.approversConfirmed ? (
            <CheckCircleIcon sx={{ fontSize: 22, color: color.status.success.default, mt: "1px", flexShrink: 0 }} />
          ) : (
            <RadioButtonUncheckedIcon sx={{ fontSize: 22, color: color.outline.fixed, mt: "1px", flexShrink: 0 }} />
          )}
          <Box sx={{ flex: 1 }}>
            <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "4px" }}>
              Select approvers
            </TradAtlasText>
            <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
              {tabStatus.approversConfirmed
                ? "4 approvers confirmed. Approval routing is ready."
                : "Choose which board members will approve this appointment. A suggested set of 4 has been pre-selected based on previous appointments."}
            </TradAtlasText>
            {!tabStatus.approversConfirmed ? (
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={onGoToApprovers}
                sx={{ mt: "12px", textTransform: "none", fontWeight: weight.semiBold, ...semanticFontStyle(SF.labelMd), borderRadius: radius.md }}
              >
                Review & confirm approvers
              </Button>
            ) : null}
          </Box>
        </Box>

        {/* Board Resolution task */}
        <Box
          sx={{
            p: "20px",
            borderRadius: radius.lg,
            border: `1px solid ${tabStatus.resolutionSent ? color.status.success.default : color.outline.fixed}`,
            background: color.surface.default,
            display: "flex",
            alignItems: "flex-start",
            gap: "14px",
          }}
        >
          {tabStatus.resolutionSent ? (
            <CheckCircleIcon sx={{ fontSize: 22, color: color.status.success.default, mt: "1px", flexShrink: 0 }} />
          ) : (
            <RadioButtonUncheckedIcon sx={{ fontSize: 22, color: color.outline.fixed, mt: "1px", flexShrink: 0 }} />
          )}
          <Box sx={{ flex: 1 }}>
            <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default, mb: "4px" }}>
              Approve board resolution
            </TradAtlasText>
            <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
              {tabStatus.resolutionSent
                ? "Board Resolution has been approved and sent to the selected approvers for signature."
                : "Review the auto-generated Board Resolution document. You can edit any section before approving and sending it for board signature."}
            </TradAtlasText>
            {!tabStatus.resolutionSent ? (
              <Button
                variant={tabStatus.approversConfirmed ? "contained" : "outlined"}
                color={tabStatus.approversConfirmed ? "primary" : "inherit"}
                size="small"
                onClick={onGoToResolution}
                sx={{ mt: "12px", textTransform: "none", fontWeight: weight.semiBold, ...semanticFontStyle(SF.labelMd), borderRadius: radius.md, ...(tabStatus.approversConfirmed ? {} : { borderColor: color.outline.fixed }) }}
              >
                Review board resolution
              </Button>
            ) : null}
          </Box>
        </Box>
      </Box>

      {/* Approval status tracker */}
      <Box
        sx={{
          p: "20px",
          borderRadius: radius.lg,
          border: `1px solid ${color.outline.fixed}`,
          background: color.surface.default,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "16px" }}>
          <HowToVoteOutlinedIcon sx={{ fontSize: 18, color: color.action.primary.default }} />
          <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default }}>
            Approval status
          </TradAtlasText>
        </Box>
        {allDone ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {INITIAL_APPROVERS.map((a) => (
              <Box key={a.id} sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <RadioButtonUncheckedIcon sx={{ fontSize: 16, color: color.outline.fixed }} />
                <TradAtlasText semanticFont={SF.labelMd} sx={{ color: color.type.default, flex: 1 }}>
                  {a.name}
                </TradAtlasText>
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
              </Box>
            ))}
            <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted, mt: "8px" }}>
              0 of 4 approvals received. The resolution has been sent — votes will update here in real time.
            </TradAtlasText>
          </Box>
        ) : (
          <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
            Complete both tasks above to send the resolution for approval. Once sent, individual approval status will appear here in real time.
          </TradAtlasText>
        )}
      </Box>
    </Box>
  );
}

/* ── Tab 1: Select Approvers ───────────────── */

function SelectApproversTab({
  confirmed,
  onConfirm,
}: {
  confirmed: boolean;
  onConfirm: () => void;
}) {
  const { color, weight, radius } = useTokens();
  const [approvers, setApprovers] = useState<Approver[]>(INITIAL_APPROVERS);
  const [expandedCommittee, setExpandedCommittee] = useState<string | null>(null);

  const removeApprover = (id: string) => {
    setApprovers((prev) => prev.filter((a) => a.id !== id));
  };

  const addApprover = (member: CommitteeMember) => {
    if (member.disabled || approvers.some((a) => a.id === member.id)) return;
    setApprovers((prev) => [
      ...prev,
      { id: member.id, name: member.name, initials: member.initials, title: member.title, email: member.email, status: "pending" as const },
    ]);
  };

  const approverIds = new Set(approvers.map((a) => a.id));

  return (
    <Box sx={{ maxWidth: 680, display: "flex", flexDirection: "column", gap: "20px" }}>
      <SectionHeader
        title="Select approvers"
        subtitle="Based on previous appointment approvals at Acme, Inc., the following board members from the Nomination Committee have been pre-selected. You can remove or add approvers from any committee below."
        statusLabel={`${approvers.length} selected`}
        statusVariant="in_progress"
      />

      {/* Selected approvers */}
      <Box
        sx={{
          p: "20px",
          borderRadius: radius.lg,
          border: `1px solid ${color.outline.fixed}`,
          background: color.surface.default,
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "12px" }}>
          <GroupsOutlinedIcon sx={{ fontSize: 18, color: color.action.primary.default }} />
          <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default }}>
            Selected approvers
          </TradAtlasText>
        </Box>

        {approvers.map((a) => (
          <Box
            key={a.id}
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
            <PersonOutlinedIcon sx={{ fontSize: 20, color: color.type.muted, flexShrink: 0 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <TradAtlasText semanticFont={SF.labelMd} sx={{ color: color.type.default }}>
                {a.name}
              </TradAtlasText>
              <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
                {a.title}
              </TradAtlasText>
            </Box>
            <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted, flexShrink: 0 }}>
              {a.email}
            </TradAtlasText>
            {!confirmed ? (
              <IconButton
                size="small"
                aria-label={`Remove ${a.name}`}
                onClick={() => removeApprover(a.id)}
                sx={{ color: color.type.muted, "&:hover": { color: color.action.destructive.default } }}
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            ) : null}
          </Box>
        ))}

        {!confirmed ? (
          <Box sx={{ mt: "12px" }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              disabled={approvers.length === 0}
              onClick={onConfirm}
              sx={{ textTransform: "none", fontWeight: weight.semiBold, ...semanticFontStyle(SF.labelMd), borderRadius: radius.md }}
            >
              Confirm {approvers.length} approver{approvers.length !== 1 ? "s" : ""}
            </Button>
          </Box>
        ) : (
          <Box sx={{ mt: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
            <CheckCircleIcon sx={{ fontSize: 16, color: color.status.success.default }} />
            <TradAtlasText semanticFont={SF.textSmEmphasis} sx={{ color: color.status.success.text }}>
              Approvers confirmed — routing is ready.
            </TradAtlasText>
          </Box>
        )}
      </Box>

      {/* Committee browser */}
      {!confirmed ? (
        <Box
          sx={{
            p: "20px",
            borderRadius: radius.lg,
            border: `1px solid ${color.outline.fixed}`,
            background: color.surface.default,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "4px" }}>
            <PersonAddOutlinedIcon sx={{ fontSize: 18, color: color.action.primary.default }} />
            <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default }}>
              Add from committee
            </TradAtlasText>
          </Box>
          <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted, mb: "12px" }}>
            Expand a committee to see its members and add them to the approval list.
          </TradAtlasText>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "0px" }}>
            {COMMITTEES.map((c) => {
              const isOpen = expandedCommittee === c.name;
              return (
                <Box key={c.name}>
                  <Box
                    component="button"
                    type="button"
                    onClick={() => setExpandedCommittee(isOpen ? null : c.name)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      width: "100%",
                      py: "10px",
                      px: "4px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      borderBottom: `1px solid ${color.outline.fixed}`,
                      "&:hover": { background: color.action.secondary.hoverFill },
                    }}
                  >
                    {isOpen ? (
                      <ExpandLessIcon sx={{ fontSize: 20, color: color.type.muted }} />
                    ) : (
                      <ExpandMoreIcon sx={{ fontSize: 20, color: color.type.muted }} />
                    )}
                    <TradAtlasText semanticFont={SF.labelMd} sx={{ color: color.type.default, flex: 1, textAlign: "left" }}>
                      {c.name}
                    </TradAtlasText>
                    <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
                      {c.members.length} members
                    </TradAtlasText>
                  </Box>
                  <Collapse in={isOpen} timeout={200}>
                    <Box sx={{ pl: "28px", py: "4px" }}>
                      {c.members.map((m) => {
                        const alreadyAdded = approverIds.has(m.id);
                        const isDisabled = Boolean(m.disabled);
                        return (
                          <Box
                            key={m.id}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              py: "8px",
                              px: "4px",
                              opacity: isDisabled ? 0.55 : 1,
                            }}
                          >
                            <PersonOutlinedIcon sx={{ fontSize: 18, color: color.type.muted }} />
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <TradAtlasText semanticFont={SF.labelMd} sx={{ color: isDisabled ? color.type.disabled : color.type.default }}>
                                {m.name}
                              </TradAtlasText>
                              <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
                                {m.title}
                              </TradAtlasText>
                              {isDisabled && m.disabledReason ? (
                                <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.status.warning.text, fontStyle: "italic" }}>
                                  {m.disabledReason}
                                </TradAtlasText>
                              ) : null}
                            </Box>
                            {isDisabled ? (
                              <Chip
                                label="Unavailable"
                                size="small"
                                sx={{
                                  ...semanticFontStyle(SF.textXs),
                                  height: 20,
                                  backgroundColor: color.surface.subtle,
                                  color: color.type.disabled,
                                  fontWeight: weight.medium,
                                }}
                              />
                            ) : alreadyAdded ? (
                              <Chip
                                label="Added"
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
                            ) : (
                              <Button
                                variant="outlined"
                                color="inherit"
                                size="small"
                                startIcon={<PersonAddOutlinedIcon sx={{ fontSize: 16 }} />}
                                onClick={() => addApprover(m)}
                                sx={{ textTransform: "none", ...semanticFontStyle(SF.textSm), borderColor: color.outline.fixed, fontWeight: weight.medium }}
                              >
                                Add
                              </Button>
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  </Collapse>
                </Box>
              );
            })}
          </Box>
        </Box>
      ) : null}
    </Box>
  );
}

/* ── Tab 2: Board Resolution ───────────────── */

function BoardResolutionTab({
  sent,
  onSend,
}: {
  sent: boolean;
  onSend: () => void;
}) {
  return (
    <BoardResolutionEditor
      companyName="Pacific Polymer Logistics Pte. Ltd."
      companyUen="201812345K"
      appointeeName="Priya Nair"
      appointeeNric="S1234567D"
      appointeeAddress="14 Nassim Road, #08-02, Singapore 258395"
      effectiveDate="2026-04-20"
      departingDirector='Wei "David" Chen'
      onApproveAndSend={onSend}
      approved={sent}
    />
  );
}
