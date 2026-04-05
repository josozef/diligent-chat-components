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
}

function ProjectCard({ title, description, icon, href, comingSoon, openInNewTab }: ProjectCardProps) {
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
        border: `1px solid ${color.outline.fixed}`,
        borderRadius: radius.lg,
        background: color.surface.default,
        textAlign: "left",
        cursor: comingSoon ? "default" : "pointer",
        opacity: comingSoon ? 0.55 : 1,
        transition: "box-shadow 0.2s ease, border-color 0.2s ease",
        ...(!comingSoon && {
          "&:hover": {
            borderColor: color.outline.hover,
            boxShadow: "0 2px 8px rgba(36, 38, 40, 0.08)",
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
            background: color.surface.subtle,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: color.type.default,
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
}

function Section({ title, subtitle, children }: SectionProps) {
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
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
          gap: "16px",
        }}
      >
        {children}
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
          subtitle="Persona-based dashboards surfacing timely information and agentic workflow status."
        >
          <ProjectCard
            title="CISO"
            description="Security posture overview, threat monitoring, and vulnerability workflow status for the Chief Information Security Officer."
            icon={<SecurityOutlinedIcon sx={{ fontSize: 22 }} />}
            href="/ciso"
            openInNewTab
          />
          <ProjectCard
            title="Corporate secretary"
            description="Board meeting prep, filing deadlines, and entity management for the corporate secretary."
            icon={<DashboardOutlinedIcon sx={{ fontSize: 22 }} />}
            href="/corpsec"
            openInNewTab
          />
          <ProjectCard
            title="Board"
            description="Board-level reporting, resolution tracking, and upcoming meeting agendas."
            icon={<GroupsOutlinedIcon sx={{ fontSize: 22 }} />}
            comingSoon
          />
          <ProjectCard
            title="General counsel"
            description="Legal risk dashboard, contract review status, and regulatory change tracking."
            icon={<GavelOutlinedIcon sx={{ fontSize: 22 }} />}
            comingSoon
          />
          <ProjectCard
            title="Audit and compliance"
            description="Compliance monitoring, audit readiness scores, and remediation tracking."
            icon={<FactCheckOutlinedIcon sx={{ fontSize: 22 }} />}
            comingSoon
          />
        </Section>

        {/* Agentic workspaces */}
        <Section
          title="Agentic workspaces"
          subtitle="Task-oriented workflows driven by AI agents through multi-step processes."
        >
          <ProjectCard
            title="Security vulnerability resolution"
            description="Guided triage, impact assessment, and remediation planning for security vulnerabilities."
            icon={<SecurityOutlinedIcon sx={{ fontSize: 22 }} />}
            href="/ciso/investigate"
            openInNewTab
          />
          <ProjectCard
            title="Board member appointment"
            description="End-to-end workflow for appointing a subsidiary board member, from eligibility to Companies House filing."
            icon={<GroupsOutlinedIcon sx={{ fontSize: 22 }} />}
            comingSoon
          />
          <ProjectCard
            title="Board meeting preparation"
            description="Agenda creation, document assembly, and stakeholder coordination for upcoming board meetings."
            icon={<AccountTreeOutlinedIcon sx={{ fontSize: 22 }} />}
            comingSoon
          />
          <ProjectCard
            title="Regulatory audit response"
            description="Evidence collection, gap analysis, and response drafting for regulatory audits."
            icon={<FactCheckOutlinedIcon sx={{ fontSize: 22 }} />}
            comingSoon
          />
        </Section>
      </Box>
    </Box>
  );
}
