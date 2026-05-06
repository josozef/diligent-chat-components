import { useState } from "react";
import {
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import { Link } from "react-router";

import {
  AppsIcon,
  HelpOutlineIcon,
  SettingsOutlinedIcon,
  AccountCircleOutlinedIcon,
} from "@/icons";
import TradAtlasText from "./TradAtlasText";
import { DATA_SEMANTIC_FONT, SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "../../hooks/useTokens";

/**
 * Identifier for the app the user is currently inside. Drives the "Current"
 * highlight in the app switcher menu and the default page title.
 */
export type GlobalHeaderApp = "corpsec" | "ciso" | "audit" | "compliance" | "boards" | "entities";

interface GlobalHeaderApp_ {
  id: GlobalHeaderApp;
  label: string;
  /** Default trailing label when no `pageTitle` override is supplied. */
  commandCenterLabel: string;
}

const APP_REGISTRY: GlobalHeaderApp_[] = [
  { id: "corpsec",    label: "Corporate secretary", commandCenterLabel: "Corporate Secretary Command Center" },
  { id: "ciso",       label: "CISO / IT Risk",      commandCenterLabel: "IT Risk Command Center" },
  { id: "audit",      label: "Internal audit",      commandCenterLabel: "Internal Audit Command Center" },
  { id: "boards",     label: "Board & leadership",  commandCenterLabel: "Board & Leadership Command Center" },
  { id: "compliance", label: "Compliance",          commandCenterLabel: "Compliance Command Center" },
  { id: "entities",   label: "Entities",            commandCenterLabel: "Entities Command Center" },
];

/** Order the menu by primary apps first. Apps without entries are still rendered in declaration order. */
const APP_MENU_ORDER: GlobalHeaderApp[] = ["corpsec", "ciso", "audit", "boards", "compliance", "entities"];

export interface GlobalHeaderProps {
  /** App context. Drives the menu's "Current" badge and the default trailing title. */
  currentApp: GlobalHeaderApp;
  /**
   * Optional override for the trailing page title. If omitted, the parent
   * command-center label for the current app is shown so workflow views read
   * as part of the same surface.
   */
  pageTitle?: string;
}

/**
 * Persistent primary header used on every command-center surface and the
 * workflow views that descend from them. Renders:
 *
 *   [Atlas tile] | Tenant | [Apps menu] | Current page title          [help · settings · account]
 *
 * The header is non-scrolling — render it once at the top of the page shell
 * with `flexShrink: 0`. It does not take any responsibility for the back /
 * contextual sub-header that workflows render directly below it.
 */
export default function GlobalHeader({ currentApp, pageTitle }: GlobalHeaderProps) {
  const { color, radius, weight } = useTokens();
  const [appMenuAnchor, setAppMenuAnchor] = useState<HTMLElement | null>(null);

  const current = APP_REGISTRY.find((a) => a.id === currentApp);
  const trailingTitle = pageTitle ?? current?.commandCenterLabel ?? "";

  const orderedApps: GlobalHeaderApp_[] = APP_MENU_ORDER.map((id) =>
    APP_REGISTRY.find((a) => a.id === id),
  ).filter((a): a is GlobalHeaderApp_ => Boolean(a));

  return (
    <Box
      component="header"
      role="banner"
      sx={{
        height: 56,
        px: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `1px solid ${color.outline.fixed}`,
        background: color.surface.default,
        flexShrink: 0,
      }}
    >
      {/* Left: logo + tenant + app switcher + page title */}
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }} aria-label="Atlas home">
          <Box
            {...{ [DATA_SEMANTIC_FONT]: SF.textMdEmphasis }}
            sx={{
              width: 32,
              height: 32,
              borderRadius: radius.sm,
              background: "#16a34a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              ...semanticFontStyle(SF.textMdEmphasis),
              fontWeight: weight.bold,
              boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            }}
          >
            A
          </Box>
        </Link>

        <Divider orientation="vertical" flexItem sx={{ borderColor: color.outline.fixed }} />

        <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default }}>
          Acme Co, Inc.
        </TradAtlasText>

        <Divider orientation="vertical" flexItem sx={{ borderColor: color.outline.fixed }} />

        <IconButton
          onClick={(e) => setAppMenuAnchor(e.currentTarget)}
          sx={{ color: color.type.default }}
          size="small"
          aria-label="Switch app"
          aria-haspopup="menu"
          aria-expanded={Boolean(appMenuAnchor) || undefined}
        >
          <AppsIcon fontSize="small" />
        </IconButton>

        <Menu
          anchorEl={appMenuAnchor}
          open={Boolean(appMenuAnchor)}
          onClose={() => setAppMenuAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          slotProps={{
            paper: {
              sx: {
                background: color.surface.default,
                border: `1px solid ${color.outline.fixed}`,
                borderRadius: radius.md,
              },
            },
          }}
        >
          {orderedApps.map((app) => {
            const isCurrent = app.id === currentApp;
            return (
              <MenuItem
                key={app.id}
                onClick={isCurrent ? undefined : () => setAppMenuAnchor(null)}
                sx={isCurrent ? { gap: "8px" } : undefined}
                aria-current={isCurrent ? "true" : undefined}
              >
                <TradAtlasText
                  semanticFont={isCurrent ? SF.textMdEmphasis : SF.textMd}
                  sx={{ color: isCurrent ? color.type.default : color.type.muted }}
                >
                  {app.label}
                </TradAtlasText>
                {isCurrent ? (
                  <TradAtlasText
                    semanticFont={SF.textMicroEmphasis}
                    sx={{ color: color.action.primary.default }}
                  >
                    Current
                  </TradAtlasText>
                ) : null}
              </MenuItem>
            );
          })}
        </Menu>

        {trailingTitle ? (
          <TradAtlasText
            semanticFont={SF.textMd}
            sx={{ color: color.type.muted, fontWeight: weight.medium }}
          >
            {trailingTitle}
          </TradAtlasText>
        ) : null}
      </Stack>

      {/* Right: utilities */}
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <IconButton size="small" sx={{ color: color.type.muted }} aria-label="Help">
          <HelpOutlineIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" sx={{ color: color.type.muted }} aria-label="Settings">
          <SettingsOutlinedIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" sx={{ color: color.type.muted }} aria-label="Account">
          <AccountCircleOutlinedIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  );
}
