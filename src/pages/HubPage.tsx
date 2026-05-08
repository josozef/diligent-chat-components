import { useNavigate } from "react-router";
import { Box } from "@mui/material";
import {
  ChatBubbleOutlineIcon,
  DashboardOutlinedIcon,
  AccountTreeOutlinedIcon,
  PaletteOutlinedIcon,
  SecurityOutlinedIcon,
  GroupsOutlinedIcon,
  GavelOutlinedIcon,
  FactCheckOutlinedIcon,
  NorthEastIcon,
  PersonAddOutlinedIcon,
  EventOutlinedIcon,
} from "@/icons";
import { atlasSemanticColor as color, atlasSemanticRadius as radius } from "../tokens/atlasLight";
import TradAtlasText from "../components/common/TradAtlasText";
import { SF } from "../tokens/tradAtlasSemanticTypography";

interface ProjectCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
  comingSoon?: boolean;
  openInNewTab?: boolean;
  /** Emphasize the tile (primary border and soft tint) — use for newly available prototypes. */
  highlight?: boolean;
}

function ProjectCard({ title, description, icon, href, comingSoon, openInNewTab, highlight }: ProjectCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (comingSoon || !href) return;
    if (openInNewTab) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      navigate(href);
    }
  };

  return (
    <Box
      component={comingSoon ? "div" : "button"}
      type={comingSoon ? undefined : "button"}
      onClick={comingSoon ? undefined : handleClick}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        p: "24px",
        border: `1px solid ${highlight && !comingSoon ? color.action.primary.default : color.outline.fixed}`,
        borderRadius: radius.lg,
        background:
          highlight && !comingSoon ? color.status.notification.background : color.surface.default,
        textAlign: "left",
        cursor: comingSoon ? "default" : "pointer",
        opacity: comingSoon ? 0.55 : 1,
        transition: "box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease",
        ...(!comingSoon &&
          !highlight && {
            "&:hover": {
              borderColor: color.outline.hover,
              boxShadow: "0 2px 8px rgba(36, 38, 40, 0.08)",
            },
          }),
        ...(highlight &&
          !comingSoon && {
            "&:hover": {
              borderColor: color.action.primary.hover,
              boxShadow: "0 4px 14px rgba(0, 64, 213, 0.14)",
            },
          }),
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: radius.md,
            background: highlight && !comingSoon ? "#ffffff" : color.surface.subtle,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: highlight && !comingSoon ? color.action.primary.default : color.type.default,
          }}
        >
          {icon}
        </Box>
        {comingSoon ? (
          <TradAtlasText
            semanticFont={SF.textSmEmphasis}
            sx={{
              letterSpacing: "0.3px",
              color: color.type.muted,
              textTransform: "uppercase",
            }}
          >
            Coming soon
          </TradAtlasText>
        ) : (
          <NorthEastIcon sx={{ fontSize: 16, color: color.type.muted }} />
        )}
      </Box>
      <Box>
        <TradAtlasText semanticFont={SF.textLgEmphasis} sx={{ color: color.type.default, mb: "4px" }}>
          {title}
        </TradAtlasText>
        <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
          {description}
        </TradAtlasText>
      </Box>
    </Box>
  );
}

interface SectionProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  /** "grid" (default) renders children in a 3-column responsive grid;
   *  "stack" renders them as a vertical column (used for workflow rows that own their own internal grid). */
  layout?: "grid" | "stack";
}

function Section({ title, subtitle, children, layout = "grid" }: SectionProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Box>
        <TradAtlasText
          semanticFont={SF.titleH4Emphasis}
          sx={{
            letterSpacing: "-0.1px",
            color: color.type.default,
            mb: "4px",
          }}
        >
          {title}
        </TradAtlasText>
        <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
          {subtitle}
        </TradAtlasText>
      </Box>
      <Box
        sx={
          layout === "grid"
            ? {
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                gap: "16px",
              }
            : { display: "flex", flexDirection: "column", gap: "16px" }
        }
      >
        {children}
      </Box>
    </Box>
  );
}

/* ── Agentic workspace: workflow row with 3 channel variants ──── */

interface VariantTileProps {
  label: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
  comingSoon?: boolean;
  openInNewTab?: boolean;
  /** Emphasize the tile (primary border + soft tint). Use for working in-project prototypes. */
  highlight?: boolean;
}

function VariantTile({ label, description, icon, href, comingSoon, openInNewTab, highlight }: VariantTileProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (comingSoon || !href) return;
    if (openInNewTab) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      navigate(href);
    }
  };

  const isActive = !comingSoon && Boolean(href);

  return (
    <Box
      component={comingSoon ? "div" : "button"}
      type={comingSoon ? undefined : "button"}
      onClick={comingSoon ? undefined : handleClick}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        p: "16px",
        border: `1px solid ${highlight && isActive ? color.action.primary.default : color.outline.fixed}`,
        borderRadius: radius.md,
        background:
          highlight && isActive ? color.status.notification.background : color.surface.default,
        textAlign: "left",
        cursor: isActive ? "pointer" : "default",
        opacity: comingSoon ? 0.6 : 1,
        transition: "box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease",
        ...(isActive &&
          !highlight && {
            "&:hover": {
              borderColor: color.outline.hover,
              boxShadow: "0 2px 6px rgba(36, 38, 40, 0.08)",
            },
          }),
        ...(highlight &&
          isActive && {
            "&:hover": {
              borderColor: color.action.primary.hover,
              boxShadow: "0 4px 12px rgba(0, 64, 213, 0.14)",
            },
          }),
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: radius.sm,
            background: highlight && isActive ? "#ffffff" : color.surface.subtle,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: highlight && isActive ? color.action.primary.default : color.type.muted,
          }}
        >
          {icon}
        </Box>
        {comingSoon ? (
          <TradAtlasText
            semanticFont={SF.textSmEmphasis}
            sx={{
              letterSpacing: "0.3px",
              color: color.type.muted,
              textTransform: "uppercase",
              fontSize: "11px",
            }}
          >
            Coming soon
          </TradAtlasText>
        ) : (
          <NorthEastIcon
            sx={{
              fontSize: 14,
              color: highlight ? color.action.primary.default : color.type.muted,
            }}
          />
        )}
      </Box>
      <Box>
        <TradAtlasText
          semanticFont={SF.textMdEmphasis}
          sx={{
            color: highlight && isActive ? color.action.primary.default : color.type.default,
            mb: "2px",
          }}
        >
          {label}
        </TradAtlasText>
        <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
          {description}
        </TradAtlasText>
      </Box>
    </Box>
  );
}

interface WorkflowRowProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  /** 1–4 variant tiles. Layout grid auto-sizes to the count. */
  variants: VariantTileProps[];
}

function WorkflowRow({ title, description, icon, variants }: WorkflowRowProps) {
  // Auto-size the variant grid: 2 → halves, 3+ → thirds, 1 → full width.
  const responsiveColumns =
    variants.length === 2
      ? { xs: "1fr", sm: "1fr 1fr" }
      : variants.length === 1
        ? { xs: "1fr" }
        : { xs: "1fr", sm: "1fr 1fr 1fr" };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        p: "20px",
        border: `1px solid ${color.outline.fixed}`,
        borderRadius: radius.lg,
        background: color.surface.default,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: radius.md,
            background: color.surface.subtle,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: color.type.default,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box>
          <TradAtlasText
            semanticFont={SF.textLgEmphasis}
            sx={{ color: color.type.default, mb: "2px" }}
          >
            {title}
          </TradAtlasText>
          <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
            {description}
          </TradAtlasText>
        </Box>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: responsiveColumns,
          gap: "12px",
        }}
      >
        {variants.map((v) => (
          <VariantTile key={v.label} {...v} />
        ))}
      </Box>
    </Box>
  );
}

export default function HubPage() {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        background: color.background.base,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: "24px",
        py: "48px",
      }}
    >
      <Box sx={{ maxWidth: 960, width: "100%", display: "flex", flexDirection: "column", gap: "48px" }}>
        {/* Header */}
        <Box>
          <TradAtlasText
            semanticFont={SF.titleH1Emphasis}
            sx={{
              letterSpacing: "-0.3px",
              color: color.type.default,
              mb: "8px",
            }}
          >
            Atlas AI
          </TradAtlasText>
          <TradAtlasText semanticFont={SF.textLg} sx={{ color: color.type.muted, maxWidth: 600 }}>
            A creation studio for functional use-case prototypes built on the Atlas design system. Explore AI-powered
            governance tools, persona dashboards, and agentic workflows.
          </TradAtlasText>
        </Box>

        {/* Use cases */}
        <Section
          title="Use cases"
          subtitle="Functional prototypes exploring AI-assisted governance scenarios."
        >
          <ProjectCard
            title="Governance chat"
            description="General-purpose chat assistant for corporate governance questions, powered by Diligent product and best-practice context."
            icon={<ChatBubbleOutlineIcon sx={{ fontSize: 22 }} />}
            href="/governance-chat"
          />
          <ProjectCard
            title="Design system reference"
            description="Atlas Light tokens, component variants, and Trad Atlas overrides in a browsable reference."
            icon={<PaletteOutlinedIcon sx={{ fontSize: 22 }} />}
            href="/system"
          />
        </Section>

        {/* Command centers */}
        <Section
          title="Command centers"
          subtitle="Persona-based dashboards surfacing timely information and agentic workflow status. Each command center ships in two layout variants — a centered single-column view and a layout with a persistent left-rail navigation for workflows and chats."
          layout="stack"
        >
          <WorkflowRow
            title="Corporate secretary"
            description="Board meeting prep, filing deadlines, and entity management for the corporate secretary."
            icon={<DashboardOutlinedIcon sx={{ fontSize: 20 }} />}
            variants={[
              {
                label: "No left nav",
                description: "Centered single-column layout.",
                icon: <DashboardOutlinedIcon sx={{ fontSize: 18 }} />,
                href: "/corpsec",
                openInNewTab: true,
                highlight: true,
              },
              {
                label: "Left nav",
                description: "Persistent rail with workflows + chats.",
                icon: <AccountTreeOutlinedIcon sx={{ fontSize: 18 }} />,
                href: "/corpsec?nav=side",
                openInNewTab: true,
                highlight: true,
              },
            ]}
          />

          <WorkflowRow
            title="CISO"
            description="Security posture overview, threat monitoring, and vulnerability workflow status for the Chief Information Security Officer."
            icon={<SecurityOutlinedIcon sx={{ fontSize: 20 }} />}
            variants={[
              {
                label: "No left nav",
                description: "Centered single-column layout.",
                icon: <DashboardOutlinedIcon sx={{ fontSize: 18 }} />,
                href: "/ciso",
                openInNewTab: true,
                highlight: true,
              },
              {
                label: "Left nav",
                description: "Persistent rail with workflows + chats.",
                icon: <AccountTreeOutlinedIcon sx={{ fontSize: 18 }} />,
                comingSoon: true,
              },
            ]}
          />

          <WorkflowRow
            title="Audit and compliance"
            description="Internal audit command center — control assessments, committee reporting, and remediation oversight for board assurance."
            icon={<FactCheckOutlinedIcon sx={{ fontSize: 20 }} />}
            variants={[
              {
                label: "No left nav",
                description: "Centered single-column layout.",
                icon: <DashboardOutlinedIcon sx={{ fontSize: 18 }} />,
                href: "/audit",
                openInNewTab: true,
                highlight: true,
              },
              {
                label: "Left nav",
                description: "Persistent rail with workflows + chats.",
                icon: <AccountTreeOutlinedIcon sx={{ fontSize: 18 }} />,
                comingSoon: true,
              },
            ]}
          />

          <WorkflowRow
            title="Board"
            description="Board-level reporting, resolution tracking, and upcoming meeting agendas."
            icon={<GroupsOutlinedIcon sx={{ fontSize: 20 }} />}
            variants={[
              {
                label: "No left nav",
                description: "Centered single-column layout.",
                icon: <DashboardOutlinedIcon sx={{ fontSize: 18 }} />,
                comingSoon: true,
              },
              {
                label: "Left nav",
                description: "Persistent rail with workflows + chats.",
                icon: <AccountTreeOutlinedIcon sx={{ fontSize: 18 }} />,
                comingSoon: true,
              },
            ]}
          />

          <WorkflowRow
            title="General counsel"
            description="Legal risk dashboard, contract review status, and regulatory change tracking."
            icon={<GavelOutlinedIcon sx={{ fontSize: 20 }} />}
            variants={[
              {
                label: "No left nav",
                description: "Centered single-column layout.",
                icon: <DashboardOutlinedIcon sx={{ fontSize: 18 }} />,
                comingSoon: true,
              },
              {
                label: "Left nav",
                description: "Persistent rail with workflows + chats.",
                icon: <AccountTreeOutlinedIcon sx={{ fontSize: 18 }} />,
                comingSoon: true,
              },
            ]}
          />
        </Section>

        {/* Agentic workspaces */}
        <Section
          title="Agentic workspaces"
          subtitle="Task-oriented workflows driven by AI agents. Each workflow ships in three channel variants — a guided non-conversational workspace, a conversational chat assistant, and an in-Microsoft Teams experience."
          layout="stack"
        >
          <WorkflowRow
            title="Security vulnerability resolution"
            description="Guided triage, impact assessment, and remediation planning for security vulnerabilities."
            icon={<SecurityOutlinedIcon sx={{ fontSize: 20 }} />}
            variants={[
              {
                label: "Non-conversational",
                description: "Guided multi-step workspace.",
                icon: <AccountTreeOutlinedIcon sx={{ fontSize: 18 }} />,
                href: "/ciso/investigate",
                openInNewTab: true,
                highlight: true,
              },
              {
                label: "Conversational",
                description: "Chat-driven AI assistant.",
                icon: <ChatBubbleOutlineIcon sx={{ fontSize: 18 }} />,
                comingSoon: true,
              },
              {
                label: "Teams",
                description: "Inside Microsoft Teams.",
                icon: <GroupsOutlinedIcon sx={{ fontSize: 18 }} />,
                comingSoon: true,
              },
            ]}
          />

          <WorkflowRow
            title="Board member appointment"
            description="End-to-end workflow for appointing a subsidiary board member, from eligibility to regulatory filing."
            icon={<PersonAddOutlinedIcon sx={{ fontSize: 20 }} />}
            variants={[
              {
                label: "Non-conversational",
                description: "Guided multi-step workspace.",
                icon: <AccountTreeOutlinedIcon sx={{ fontSize: 18 }} />,
                href: "/corpsec/appointment",
                openInNewTab: true,
                highlight: true,
              },
              {
                label: "Conversational",
                description: "Chat-driven AI assistant.",
                icon: <ChatBubbleOutlineIcon sx={{ fontSize: 18 }} />,
                href: "/corpsec/appointment/conversation",
                openInNewTab: true,
                highlight: true,
              },
              {
                label: "Teams",
                description: "Inside Microsoft Teams.",
                icon: <GroupsOutlinedIcon sx={{ fontSize: 18 }} />,
                href: "https://board-appointment-teams.vercel.app/",
                openInNewTab: true,
                highlight: true,
              },
            ]}
          />

          <WorkflowRow
            title="Board meeting preparation"
            description="Agenda creation, document assembly, and stakeholder coordination for upcoming board meetings."
            icon={<EventOutlinedIcon sx={{ fontSize: 20 }} />}
            variants={[
              {
                label: "Non-conversational",
                description: "Guided multi-step workspace.",
                icon: <AccountTreeOutlinedIcon sx={{ fontSize: 18 }} />,
                comingSoon: true,
              },
              {
                label: "Conversational",
                description: "Chat-driven AI assistant.",
                icon: <ChatBubbleOutlineIcon sx={{ fontSize: 18 }} />,
                comingSoon: true,
              },
              {
                label: "Teams",
                description: "Inside Microsoft Teams.",
                icon: <GroupsOutlinedIcon sx={{ fontSize: 18 }} />,
                comingSoon: true,
              },
            ]}
          />

          <WorkflowRow
            title="Regulatory audit response"
            description="Evidence collection, gap analysis, and response drafting for regulatory audits."
            icon={<FactCheckOutlinedIcon sx={{ fontSize: 20 }} />}
            variants={[
              {
                label: "Non-conversational",
                description: "Guided multi-step workspace.",
                icon: <AccountTreeOutlinedIcon sx={{ fontSize: 18 }} />,
                href: "/audit/assurance",
                openInNewTab: true,
                highlight: true,
              },
              {
                label: "Conversational",
                description: "Chat-driven AI assistant.",
                icon: <ChatBubbleOutlineIcon sx={{ fontSize: 18 }} />,
                comingSoon: true,
              },
              {
                label: "Teams",
                description: "Inside Microsoft Teams.",
                icon: <GroupsOutlinedIcon sx={{ fontSize: 18 }} />,
                comingSoon: true,
              },
            ]}
          />
        </Section>
      </Box>
    </Box>
  );
}
