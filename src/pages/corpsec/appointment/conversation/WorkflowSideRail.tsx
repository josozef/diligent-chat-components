import type { ReactNode } from "react";
import { Box } from "@mui/material";
import { Link as RouterLink } from "react-router";

import {
  CheckIcon,
  DashboardOutlinedIcon,
  DescriptionOutlinedIcon,
  PersonOutlinedIcon,
  GroupsOutlinedIcon,
  RadioButtonUncheckedIcon,
} from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import PulsingStatusDot from "@/components/common/PulsingStatusDot";
import { SF } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

import { useWorkflowConversation } from "./WorkflowConversationContext";
import type { AssetId, WorkflowStep, WorkflowSubTask, WorkflowStepId } from "./types";

const SIDE_RAIL_WIDTH = 296;

export interface WorkflowSideRailProps {
  /**
   * Where the "Command Center" back-link points. The conversational workflow
   * ships from the side-nav variant of the command center, so we default to
   * `?nav=side` to round-trip the user there.
   */
  commandCenterHref?: string;
}

export default function WorkflowSideRail({
  commandCenterHref = "/corpsec?nav=side",
}: WorkflowSideRailProps) {
  const { color, radius } = useTokens();

  return (
    <Box
      component="nav"
      aria-label="Appointment workflow sidebar"
      sx={{
        width: SIDE_RAIL_WIDTH,
        flexShrink: 0,
        background: color.surface.default,
        border: `1px solid ${color.outline.fixed}`,
        borderRadius: radius.lg,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        py: "8px",
      }}
    >
      {/* Primary destination — Command Center back-link */}
      <Box sx={{ px: "12px", pt: "8px", pb: "12px" }}>
        <CommandCenterRow href={commandCenterHref} />
      </Box>

      <WorkflowSection />
      <SectionDivider />
      <AssetsSection />
    </Box>
  );
}

/**
 * Visible separator between the Workflow steps section and the Assets list
 * section. Emphasizes the conceptual split between "the journey" and "the
 * artifacts the journey produces", and gives the rail more breathing room
 * now that the asset surface no longer lives in a dedicated right column.
 */
function SectionDivider() {
  const { color } = useTokens();
  return (
    <Box aria-hidden sx={{ pt: "20px", pb: "16px", px: "20px" }}>
      <Box sx={{ height: "1px", background: color.outline.fixed }} />
    </Box>
  );
}

/* ── Sub-components ────────────────────────────────────────── */

function CommandCenterRow({ href }: { href: string }) {
  const { color, radius, weight } = useTokens();

  return (
    <Box
      component={RouterLink}
      to={href}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        px: "14px",
        py: "10px",
        borderRadius: radius.md,
        color: color.type.default,
        textDecoration: "none",
        transition: "background-color 120ms ease",
        "&:hover": { background: color.surface.subtle },
      }}
    >
      <DashboardOutlinedIcon sx={{ fontSize: 20 }} />
      <TradAtlasText
        semanticFont={SF.textMd}
        sx={{
          fontWeight: weight.medium,
          color: "inherit",
          letterSpacing: "-0.005em",
        }}
      >
        Command Center
      </TradAtlasText>
    </Box>
  );
}

function SectionHeader({ label }: { label: string }) {
  const { color, weight } = useTokens();
  return (
    <Box sx={{ display: "flex", alignItems: "center", px: "20px", pt: "12px", pb: "8px" }}>
      <TradAtlasText
        semanticFont={SF.textMicroEmphasis}
        sx={{
          color: color.type.muted,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontWeight: weight.semiBold,
          fontSize: "11px",
        }}
      >
        {label}
      </TradAtlasText>
    </Box>
  );
}

function WorkflowSection() {
  const { color, radius, weight } = useTokens();
  const { state, scrollToStep, cardAnchorId } = useWorkflowConversation();

  return (
    <>
      <SectionHeader label="Workflow" />
      <Box sx={{ display: "flex", flexDirection: "column", gap: "2px", px: "8px" }}>
        {state.steps.map((step) => {
          const completed = step.status === "completed";
          const inProgress = step.status === "in_progress";

          return (
            <Box key={step.id}>
              <Box
                role="button"
                tabIndex={0}
                aria-current={inProgress ? "step" : undefined}
                onClick={() => scrollToStep(step.id as WorkflowStepId)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    scrollToStep(step.id as WorkflowStepId);
                  }
                }}
                data-anchor-target={cardAnchorId(step.id as WorkflowStepId)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  px: "12px",
                  py: "8px",
                  borderRadius: radius.md,
                  cursor: "pointer",
                  background: inProgress ? color.status.notification.background : "transparent",
                  transition: "background-color 120ms ease",
                  "&:hover": {
                    background: inProgress
                      ? color.status.notification.background
                      : color.surface.subtle,
                  },
                }}
              >
                <Box
                  aria-hidden
                  sx={{
                    width: 18,
                    height: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {completed ? (
                    <CheckIcon sx={{ fontSize: 18, color: color.type.muted }} />
                  ) : inProgress ? (
                    <PulsingStatusDot size="sm" tone="info" />
                  ) : (
                    <RadioButtonUncheckedIcon
                      sx={{ fontSize: 16, color: color.type.disabled }}
                    />
                  )}
                </Box>

                <TradAtlasText
                  semanticFont={SF.textSm}
                  sx={{
                    flex: 1,
                    color: completed
                      ? color.type.muted
                      : inProgress
                        ? color.action.primary.default
                        : color.type.default,
                    fontWeight: inProgress ? weight.semiBold : weight.regular,
                    letterSpacing: "-0.005em",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {step.name}
                </TradAtlasText>
              </Box>
              <StepSubTasks step={step} />
            </Box>
          );
        })}
      </Box>
    </>
  );
}

function StepSubTasks({ step }: { step: WorkflowStep }) {
  const subTasks = step.subTasks ?? [];
  if (subTasks.length === 0) return null;
  const stepCompleted = step.status === "completed";
  return (
    <Box sx={{ pl: "42px", pr: "10px", pb: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
      {subTasks.map((subTask) => (
        <SubTaskRow
          key={subTask.id}
          subTask={subTask}
          stepCompleted={stepCompleted}
        />
      ))}
    </Box>
  );
}

function SubTaskRow({
  subTask,
  stepCompleted,
}: {
  subTask: WorkflowSubTask;
  stepCompleted: boolean;
}) {
  const { color, weight } = useTokens();
  // When the parent workflow step is completed, every subtask is implicitly
  // resolved — checkpoints can't still be blocking once the step itself is
  // closed. We override `isDone` here so the visual treatment matches without
  // needing the underlying state to be perfectly hand-managed.
  const isDone = stepCompleted || subTask.status === "completed";
  const isRunning = !stepCompleted && subTask.status === "in_progress";
  // HITL emphasis only applies while the task is still blocking — once it's
  // closed out, we drop the warning treatment entirely and mute the row to
  // match how completed parent steps render (matches the workflow screenshot).
  const isHitl =
    !isDone && (subTask.owner === "human" || subTask.status === "awaiting_hitl");

  const labelColor = isDone
    ? color.type.muted
    : isHitl
      ? color.status.warning.text
      : isRunning
        ? color.type.default
        : color.type.muted;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        minHeight: "24px",
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: 16,
          height: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: isHitl ? color.status.warning.text : color.type.muted,
          borderRadius: isHitl ? "999px" : undefined,
          background: isHitl ? color.status.warning.background : "transparent",
        }}
      >
        {isDone ? (
          <CheckIcon sx={{ fontSize: 14, color: color.type.muted }} />
        ) : isHitl ? (
          <PersonOutlinedIcon sx={{ fontSize: 14 }} />
        ) : isRunning ? (
          <PulsingStatusDot size="sm" tone="info" />
        ) : (
          <RadioButtonUncheckedIcon sx={{ fontSize: 12, color: color.type.disabled }} />
        )}
      </Box>
      <TradAtlasText
        semanticFont={SF.textSm}
        sx={{
          color: labelColor,
          fontWeight: isHitl ? weight.medium : weight.regular,
          letterSpacing: "-0.003em",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {subTask.label}
      </TradAtlasText>
    </Box>
  );
}

function AssetsSection() {
  const { color } = useTokens();
  const { hasAsset } = useWorkflowConversation();

  const items: { id: AssetId; label: string; icon: ReactNode }[] = [
    {
      id: "candidate-shortlist",
      label: "Candidate shortlist",
      icon: <GroupsOutlinedIcon sx={{ fontSize: 16 }} />,
    },
    {
      id: "consent-to-act",
      label: "Consent to Act (Form 45)",
      icon: <DescriptionOutlinedIcon sx={{ fontSize: 16 }} />,
    },
    {
      id: "approver-list",
      label: "Approver list",
      icon: <GroupsOutlinedIcon sx={{ fontSize: 16 }} />,
    },
    {
      id: "board-resolution",
      label: "Board Resolution",
      icon: <DescriptionOutlinedIcon sx={{ fontSize: 16 }} />,
    },
    {
      id: "form45-notification",
      label: "Form 45 — Notification",
      icon: <DescriptionOutlinedIcon sx={{ fontSize: 16 }} />,
    },
  ];

  const visible = items.filter((i) => hasAsset(i.id));
  if (visible.length === 0) {
    return null;
  }

  return (
    <>
      <SectionHeader label="Assets" />
      <Box sx={{ display: "flex", flexDirection: "column", gap: "2px", px: "8px" }}>
        {visible.map((item) => (
          <AssetRow key={item.id} id={item.id} label={item.label} icon={item.icon} />
        ))}
      </Box>
      {/* Fade-in hint when items first appear; not strictly needed but pleasant. */}
      <Box aria-hidden sx={{ height: "8px", opacity: visible.length === 1 ? 1 : 0 }}>
        <TradAtlasText
          semanticFont={SF.textXs}
          sx={{
            color: color.type.muted,
            fontSize: "10px",
            px: "20px",
            display: "block",
          }}
        >
          New asset available
        </TradAtlasText>
      </Box>
    </>
  );
}

function AssetRow({ id, label, icon }: { id: AssetId; label: string; icon: ReactNode }) {
  const { color, radius, weight } = useTokens();
  const { state, openAsset } = useWorkflowConversation();
  const isOpen = state.rightPanel.open === id;

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={() => openAsset(id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openAsset(id);
        }
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        px: "12px",
        py: "8px",
        borderRadius: radius.md,
        cursor: "pointer",
        background: isOpen ? color.status.notification.background : "transparent",
        color: isOpen ? color.action.primary.default : color.type.default,
        transition: "background-color 120ms ease, color 120ms ease",
        "&:hover": isOpen ? undefined : { background: color.surface.subtle },
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: 18,
          height: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "inherit",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <TradAtlasText
        semanticFont={SF.textSm}
        sx={{
          flex: 1,
          color: "inherit",
          fontWeight: isOpen ? weight.semiBold : weight.regular,
          letterSpacing: "-0.005em",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </TradAtlasText>
    </Box>
  );
}
