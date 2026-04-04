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
import { AppsIcon, HelpOutlineIcon, SettingsOutlinedIcon, AccountCircleOutlinedIcon } from "@/icons";
import TradAtlasText from "../../components/common/TradAtlasText";
import { DATA_SEMANTIC_FONT, SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "../../hooks/useTokens";

export default function GlobalHeader() {
  const { color, radius, weight } = useTokens();
  const [appMenuAnchor, setAppMenuAnchor] = useState<HTMLElement | null>(null);

  return (
    <Box
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
      {/* Left: Logo + app name */}
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
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
          <MenuItem sx={{ gap: "8px" }}>
            <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: color.type.default }}>
              Corporate secretary
            </TradAtlasText>
            <TradAtlasText semanticFont={SF.textMicroEmphasis} sx={{ color: color.action.primary.default }}>
              Current
            </TradAtlasText>
          </MenuItem>
          <MenuItem onClick={() => setAppMenuAnchor(null)}>
            <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
              Board & leadership
            </TradAtlasText>
          </MenuItem>
          <MenuItem onClick={() => setAppMenuAnchor(null)}>
            <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
              Compliance
            </TradAtlasText>
          </MenuItem>
          <MenuItem onClick={() => setAppMenuAnchor(null)}>
            <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
              Entities
            </TradAtlasText>
          </MenuItem>
        </Menu>

        <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted, fontWeight: weight.medium }}>
          Corporate Secretary Command Center
        </TradAtlasText>
      </Stack>

      {/* Right: utilities */}
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <IconButton size="small" sx={{ color: color.type.muted }}>
          <HelpOutlineIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" sx={{ color: color.type.muted }}>
          <SettingsOutlinedIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" sx={{ color: color.type.muted }}>
          <AccountCircleOutlinedIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  );
}
