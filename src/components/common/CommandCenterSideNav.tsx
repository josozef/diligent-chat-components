import type { ReactNode } from "react";
import { Box, IconButton } from "@mui/material";
import { Link as RouterLink } from "react-router";

import {
  AddIcon,
  ChevronRightIcon,
  DashboardOutlinedIcon,
} from "@/icons";
import TradAtlasText from "./TradAtlasText";
import PulsingStatusDot, { type PulsingStatusTone } from "./PulsingStatusDot";
import { SF } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "../../hooks/useTokens";

/**
 * Persistent left rail rendered alongside the command center's main content
 * when the page is opened in `nav=side` mode. Mirrors the wireframe in the
 * "AI consistency / AI agentic playground" Figma file:
 *
 *   - A single primary destination (Command Center, always active)
 *   - WORKFLOWS — running agentic tasks with per-task status pulse
 *   - CHATS — recent governance Q&A threads
 *
 * Visual language follows established commercial AI sidebars (ChatGPT,
 * Claude, Linear): generous row padding, ghosted icon buttons, soft hover
 * fills, single-line truncation, and whitespace-led section separation
 * rather than hard horizontal rules.
 */

export interface SideNavWorkflowItem {
  id: string;
  title: string;
  /** Single-line subtitle under the title, typically the agent's current state. */
  status: string;
  /**
   * Tone of the status pulse next to the title.
   *  - `info` (default) — running normally
   *  - `warning` — needs the user's attention before progressing
   *  - `success` — settled-but-watching (rare here)
   */
  tone?: PulsingStatusTone;
  /** Optional href; renders the row as a router link when provided. */
  href?: string;
  /** When true, the warning copy is rendered in the warning text color. */
  emphasizeStatus?: boolean;
}

export interface SideNavChatItem {
  id: string;
  title: string;
  href?: string;
}

export interface CommandCenterSideNavProps {
  /** App slug; used by the brand pill (mirrors the GlobalHeader app context). */
  appLabel?: ReactNode;
  /** Active row in the primary nav. Today there's only one entry. */
  active?: "command-center";
  workflows: SideNavWorkflowItem[];
  chats: SideNavChatItem[];
  /** Optional click target for the workflows "+" affordance. */
  onAddWorkflow?: () => void;
  /** Optional click target for the chats "+" affordance. */
  onAddChat?: () => void;
  /** Optional href for the "View past workflows" footer link. */
  pastWorkflowsHref?: string;
  /** Optional href for the "View all chats" footer link. */
  allChatsHref?: string;
  /** Override the default 296px rail width. */
  width?: number | string;
}

const DEFAULT_WIDTH = 296;

export default function CommandCenterSideNav({
  appLabel,
  active = "command-center",
  workflows,
  chats,
  onAddWorkflow,
  onAddChat,
  pastWorkflowsHref,
  allChatsHref,
  width = DEFAULT_WIDTH,
}: CommandCenterSideNavProps) {
  const { color, radius, weight } = useTokens();

  return (
    <Box
      component="nav"
      aria-label="Command center sidebar"
      sx={{
        width,
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
      {appLabel ? (
        <Box
          sx={{
            px: "20px",
            py: "12px",
            mb: "4px",
            borderBottom: `1px solid ${color.outline.fixed}`,
          }}
        >
          <TradAtlasText
            semanticFont={SF.textSm}
            sx={{
              color: color.type.muted,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontWeight: weight.semiBold,
            }}
          >
            {appLabel}
          </TradAtlasText>
        </Box>
      ) : null}

      {/* Primary destination — Command Center pill */}
      <Box sx={{ px: "12px", pt: "8px", pb: "12px" }}>
        <NavRowCommandCenter active={active === "command-center"} />
      </Box>

      {/* WORKFLOWS */}
      <SectionHeader
        label="Workflows"
        onAdd={onAddWorkflow}
        addLabel="Start a new workflow"
      />
      <Box sx={{ display: "flex", flexDirection: "column", gap: "2px", px: "8px" }}>
        {workflows.map((w) => (
          <WorkflowRow key={w.id} workflow={w} />
        ))}
      </Box>
      <FooterLink label="View past workflows" href={pastWorkflowsHref} />

      <Box sx={{ height: "16px" }} />

      {/* CHATS */}
      <SectionHeader label="Chats" onAdd={onAddChat} addLabel="Start a new chat" />
      <Box sx={{ display: "flex", flexDirection: "column", gap: "2px", px: "8px" }}>
        {chats.map((c) => (
          <ChatRow key={c.id} chat={c} />
        ))}
      </Box>
      <FooterLink label="View all" href={allChatsHref} />
    </Box>
  );
}

/* ── Sub-components ────────────────────────────────────────────── */

function NavRowCommandCenter({ active }: { active: boolean }) {
  const { color, radius, weight } = useTokens();

  return (
    <Box
      role="link"
      aria-current={active ? "page" : undefined}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        px: "14px",
        py: "10px",
        borderRadius: radius.md,
        cursor: active ? "default" : "pointer",
        background: active ? color.status.notification.background : "transparent",
        color: active ? color.action.primary.default : color.type.default,
        position: "relative",
        "&::before": active
          ? {
              content: '""',
              position: "absolute",
              left: -4,
              top: 8,
              bottom: 8,
              width: 3,
              borderRadius: 2,
              background: color.action.primary.default,
            }
          : undefined,
        "&:hover": active ? undefined : { background: color.surface.subtle },
      }}
    >
      <DashboardOutlinedIcon sx={{ fontSize: 20 }} />
      <TradAtlasText
        semanticFont={SF.textMd}
        sx={{
          fontWeight: active ? weight.semiBold : weight.medium,
          color: "inherit",
          letterSpacing: "-0.005em",
        }}
      >
        Command Center
      </TradAtlasText>
    </Box>
  );
}

function SectionHeader({
  label,
  onAdd,
  addLabel,
}: {
  label: string;
  onAdd?: () => void;
  addLabel: string;
}) {
  const { color, weight } = useTokens();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: "20px",
        pt: "12px",
        pb: "8px",
      }}
    >
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
      <IconButton
        size="small"
        onClick={onAdd}
        aria-label={addLabel}
        sx={{
          width: 26,
          height: 26,
          color: color.type.muted,
          borderRadius: "8px",
          transition: "background-color 120ms ease, color 120ms ease",
          "&:hover": {
            color: color.type.default,
            background: color.surface.subtle,
          },
        }}
      >
        <AddIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  );
}

function WorkflowRow({ workflow }: { workflow: SideNavWorkflowItem }) {
  const { color, radius, weight } = useTokens();
  const tone = workflow.tone ?? "info";

  const statusColor =
    tone === "warning"
      ? color.status.warning.text
      : tone === "error"
        ? color.status.error.text
        : color.type.muted;

  const inner = (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "3px",
        px: "12px",
        py: "10px",
        pr: "32px", // reserve space for the status dot on the right
        borderRadius: radius.md,
        cursor: workflow.href ? "pointer" : "default",
        textDecoration: "none",
        color: "inherit",
        transition: "background-color 120ms ease",
        "&:hover": { background: color.surface.subtle },
      }}
    >
      <TradAtlasText
        semanticFont={SF.textSm}
        sx={{
          color: color.type.default,
          fontWeight: weight.semiBold,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          letterSpacing: "-0.005em",
        }}
      >
        {workflow.title}
      </TradAtlasText>
      <TradAtlasText
        semanticFont={SF.textXs}
        sx={{
          color: workflow.emphasizeStatus ? statusColor : color.type.muted,
          fontWeight: workflow.emphasizeStatus ? weight.medium : weight.regular,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontSize: "12px",
          lineHeight: 1.4,
        }}
      >
        {workflow.status}
      </TradAtlasText>

      {/* Pulsing status dot, vertically centered on the row */}
      <Box
        sx={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <PulsingStatusDot
          size="sm"
          tone={tone}
          aria-label={`${workflow.title} — ${workflow.status}`}
        />
      </Box>
    </Box>
  );

  if (!workflow.href) return inner;
  return (
    <RouterLink
      to={workflow.href}
      style={{ textDecoration: "none", color: "inherit" }}
      aria-label={`${workflow.title} — ${workflow.status}`}
    >
      {inner}
    </RouterLink>
  );
}

function ChatRow({ chat }: { chat: SideNavChatItem }) {
  const { color, radius } = useTokens();

  const inner = (
    <Box
      sx={{
        px: "12px",
        py: "9px",
        borderRadius: radius.md,
        cursor: chat.href ? "pointer" : "default",
        textDecoration: "none",
        color: "inherit",
        transition: "background-color 120ms ease",
        "&:hover": { background: color.surface.subtle },
      }}
    >
      <TradAtlasText
        semanticFont={SF.textSm}
        sx={{
          color: color.type.default,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          letterSpacing: "-0.005em",
        }}
      >
        {chat.title}
      </TradAtlasText>
    </Box>
  );

  if (!chat.href) return inner;
  return (
    <RouterLink to={chat.href} style={{ textDecoration: "none", color: "inherit" }}>
      {inner}
    </RouterLink>
  );
}

function FooterLink({ label, href }: { label: string; href?: string }) {
  const { color, weight } = useTokens();

  const styles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    mx: "8px",
    mt: "4px",
    px: "12px",
    py: "10px",
    borderRadius: "8px",
    color: color.type.muted,
    textDecoration: "none",
    cursor: href ? "pointer" : "default",
    transition: "background-color 120ms ease, color 120ms ease",
    "&:hover": href
      ? { background: color.surface.subtle, color: color.type.default }
      : undefined,
  } as const;

  const content = (
    <>
      <TradAtlasText
        semanticFont={SF.textSm}
        sx={{ color: "inherit", fontWeight: weight.medium }}
      >
        {label}
      </TradAtlasText>
      <ChevronRightIcon sx={{ fontSize: 16, color: "inherit", opacity: 0.7 }} />
    </>
  );

  if (!href) {
    return <Box sx={styles}>{content}</Box>;
  }
  return (
    <Box component={RouterLink} to={href} sx={styles}>
      {content}
    </Box>
  );
}
