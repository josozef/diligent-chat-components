import { useRef, useState } from "react";
import {
  Box,
  Fab,
  IconButton,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useDemo } from "../../DemoContext";
import { useTokens } from "../../hooks/useTokens";

interface SelectableCardProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
  swatches: string[];
}

function SwatchRow({ colors }: { colors: string[] }) {
  const { color } = useTokens();
  return (
    <Stack direction="row" spacing={0.5}>
      {colors.map((c, i) => (
        <Box
          key={i}
          sx={{
            width: 16,
            height: 16,
            borderRadius: "4px",
            background: c,
            border: `1px solid ${color.outline.fixed}`,
          }}
        />
      ))}
    </Stack>
  );
}

function SelectableCard({ selected, onClick, title, description, swatches }: SelectableCardProps) {
  const { color, radius, weight } = useTokens();

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      sx={{
        p: 1.5,
        borderRadius: radius.md,
        cursor: "pointer",
        border: `2px solid ${selected ? color.action.primary.default : color.outline.fixed}`,
        background: color.surface.default,
        transition: "border-color 0.15s, box-shadow 0.15s",
        "&:hover": {
          borderColor: selected ? color.action.primary.default : color.outline.hover,
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <SwatchRow colors={swatches} />
          <Typography
            sx={{ fontSize: "13px", fontWeight: weight.semiBold, color: color.type.default, mt: "8px" }}
          >
            {title}
          </Typography>
          <Typography sx={{ fontSize: "12px", color: color.type.muted, mt: "2px" }}>
            {description}
          </Typography>
        </Box>
        {selected ? (
          <CheckCircleIcon sx={{ fontSize: 20, color: color.action.primary.default, flexShrink: 0 }} />
        ) : (
          <RadioButtonUncheckedIcon sx={{ fontSize: 20, color: color.outline.fixed, flexShrink: 0 }} />
        )}
      </Stack>
    </Box>
  );
}

const FAB_EMERALD_LIGHT = {
  bg: "#d1fae5",
  border: "rgba(52, 211, 153, 0.6)",
  fg: "#064e3b",
  hoverBg: "rgba(167, 243, 208, 0.9)",
  hoverBorder: "rgba(16, 185, 129, 0.8)",
} as const;

const FAB_EMERALD_DARK = {
  bg: "#022c22",
  border: "rgba(5, 150, 105, 0.85)",
  fg: "#ecfdf5",
  hoverBg: "#064e3b",
  hoverBorder: "#10b981",
} as const;

export default function DemoControlsFab() {
  const { color, radius, weight, isDark } = useTokens();
  const { hasAlerts, setHasAlerts, themeMode, setThemeMode } = useDemo();
  const fabRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const fab = isDark ? FAB_EMERALD_DARK : FAB_EMERALD_LIGHT;

  return (
    <>
      <Fab
        ref={fabRef}
        size="medium"
        onClick={() => setOpen((v) => !v)}
        sx={{
          position: "fixed",
          right: 24,
          bottom: 24,
          zIndex: (t) => t.zIndex.modal + 2,
          backgroundColor: fab.bg,
          color: fab.fg,
          border: `2px solid ${fab.border}`,
          boxShadow: 8,
          "&:hover": {
            backgroundColor: fab.hoverBg,
            borderColor: fab.hoverBorder,
          },
        }}
      >
        <LightbulbOutlinedIcon />
      </Fab>

      <Popover
        open={open}
        anchorEl={fabRef.current}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{ zIndex: (t) => t.zIndex.modal + 3 }}
        slotProps={{
          paper: {
            elevation: 8,
            sx: {
              width: 320,
              maxWidth: "calc(100vw - 32px)",
              borderRadius: radius.lg,
              overflow: "hidden",
              border: `1px solid ${color.outline.fixed}`,
              background: color.surface.default,
            },
          },
        }}
      >
        <Box sx={{ p: "16px" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: "16px" }}>
            <Typography sx={{ fontSize: "14px", fontWeight: weight.semiBold, color: color.type.default }}>
              Demo settings
            </Typography>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: color.type.muted }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Typography sx={{ fontSize: "12px", fontWeight: weight.semiBold, color: color.type.muted, mb: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Scenario
          </Typography>
          <Stack spacing={1} sx={{ mb: "20px" }}>
            <SelectableCard
              selected={hasAlerts}
              onClick={() => setHasAlerts(true)}
              swatches={[color.type.default, color.surface.subtle, color.status.error.default]}
              title="Action required"
              description="Command center shows critical items and action-required state."
            />
            <SelectableCard
              selected={!hasAlerts}
              onClick={() => setHasAlerts(false)}
              swatches={[color.surface.default, color.status.success.background, color.status.success.default]}
              title="All clear"
              description="Positive posture banner and no open alert queue."
            />
          </Stack>

          <Typography sx={{ fontSize: "12px", fontWeight: weight.semiBold, color: color.type.muted, mb: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Theme
          </Typography>
          <Stack spacing={1}>
            <SelectableCard
              selected={themeMode === "atlas-light"}
              onClick={() => setThemeMode("atlas-light")}
              swatches={[color.surface.default, color.surface.default, color.action.primary.default]}
              title="Light"
              description="Atlas light — bright surfaces and high contrast type."
            />
            <SelectableCard
              selected={themeMode === "atlas-dark"}
              onClick={() => setThemeMode("atlas-dark")}
              swatches={["#0f1113", "#1c1e22", color.action.primary.default]}
              title="Dark"
              description="Atlas dark — reduced glare for extended review."
            />
          </Stack>
        </Box>
      </Popover>
    </>
  );
}
