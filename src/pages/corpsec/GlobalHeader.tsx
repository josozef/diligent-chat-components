import { useState } from "react";
import {
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router";
import AppsIcon from "@mui/icons-material/Apps";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
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
            sx={{
              width: 32,
              height: 32,
              borderRadius: radius.sm,
              background: "#16a34a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "14px",
              fontWeight: weight.bold,
              boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            }}
          >
            A
          </Box>
        </Link>

        <Divider orientation="vertical" flexItem sx={{ borderColor: color.outline.fixed }} />

        <Typography
          sx={{
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: weight.semiBold,
            color: color.type.default,
          }}
        >
          Acme Co, Inc.
        </Typography>

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
            <Typography sx={{ fontSize: "14px", fontWeight: weight.semiBold, color: color.type.default }}>
              Corporate secretary
            </Typography>
            <Typography sx={{ fontSize: "11px", color: color.action.primary.default, fontWeight: weight.semiBold }}>
              Current
            </Typography>
          </MenuItem>
          <MenuItem onClick={() => setAppMenuAnchor(null)}>
            <Typography sx={{ fontSize: "14px", color: color.type.muted }}>Board & leadership</Typography>
          </MenuItem>
          <MenuItem onClick={() => setAppMenuAnchor(null)}>
            <Typography sx={{ fontSize: "14px", color: color.type.muted }}>Compliance</Typography>
          </MenuItem>
          <MenuItem onClick={() => setAppMenuAnchor(null)}>
            <Typography sx={{ fontSize: "14px", color: color.type.muted }}>Entities</Typography>
          </MenuItem>
        </Menu>

        <Typography
          sx={{
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: weight.medium,
            color: color.type.muted,
          }}
        >
          Corporate Secretary Command Center
        </Typography>
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
