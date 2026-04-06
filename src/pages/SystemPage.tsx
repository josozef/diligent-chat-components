import {
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

import { atlasFontFamily, atlasFontFamilyMono, atlasSemanticRadius } from "../tokens/atlasLight";
import TradAtlasText from "../components/common/TradAtlasText";
import {
  DATA_SEMANTIC_FONT,
  SF,
  semanticFontStyle,
  TYPOGRAPHY_PRIMITIVE,
} from "../tokens/tradAtlasSemanticTypography";

/* ────────────────────────────────────────────────────────────
 * Atlas Light tokens (from Atlas MCP — atlas-light theme)
 * ──────────────────────────────────────────────────────────── */

const ATLAS_LIGHT = {
  action: {
    primary: {
      default: { start: "#1c4ee4", end: "#0040d5" },
      hover: { start: "#4069fe", end: "#1c4ee4" },
      active: { start: "#002585", end: "#001c6c" },
      disabled: "#e2e2e5",
      onPrimary: "#ffffff",
      onPrimaryDisabled: "#aaabae",
    },
    secondary: {
      outline: "#76777a",
      disabledOutline: "#e2e2e5",
      hoverFill: "#f0f0f3",
      activeFill: "#8f9193",
      onSecondary: "#242628",
      onSecondaryDisabled: "#aaabae",
    },
    destructive: {
      default: { start: "#be0c1e", end: "#a90016" },
      hover: { start: "#e22e33", end: "#be0c1e" },
      active: { start: "#68000a", end: "#540006" },
      disabled: "#e2e2e5",
      onDestructive: "#ffffff",
      onDestructiveDisabled: "#aaabae",
    },
    secondaryDestructive: {
      default: "#a90016",
      hover: "#e22e33",
      active: "#410004",
      onSecondaryDisabled: "#aaabae",
      outlineDisabled: "#e2e2e5",
    },
  },
  status: {
    error: { background: "#ffedeb" },
  },
} as const;

/* Trad Atlas button radii — same values as atlasSemanticRadius (tiny / sm / smmd / md) */
const TRAD_RADIUS = {
  "Extra small": { value: atlasSemanticRadius.tiny, token: "radius/tiny" },
  Small: { value: atlasSemanticRadius.sm, token: "radius/sm" },
  Medium: { value: atlasSemanticRadius.smmd, token: "radius/smmd" },
  Large: { value: atlasSemanticRadius.md, token: "radius/md" },
} as const;

type TradSize = keyof typeof TRAD_RADIUS;
type TradType = "Primary" | "Secondary" | "Tertiary";
type TradState = "Default" | "Hover" | "Active" | "Disabled" | "Processing";

const SIZES: TradSize[] = ["Extra small", "Small", "Medium", "Large"];
const TYPES: TradType[] = ["Primary", "Secondary", "Tertiary"];
const STATES: TradState[] = ["Default", "Hover", "Active", "Disabled", "Processing"];

/* Exact Figma padding per size (from Trad Atlas Figma code output) */
type TextMetrics = { fontSize: string; lineHeight: string; letterSpacing: string };

function sizeMetrics(size: TradSize) {
  const textLg = TYPOGRAPHY_PRIMITIVE["Typography/Text/Lg"] as TextMetrics;
  const textSm = TYPOGRAPHY_PRIMITIVE["Typography/Text/Sm"] as TextMetrics;
  const body = {
    fontSize: textLg.fontSize,
    lineHeight: textLg.lineHeight,
    letterSpacing: textLg.letterSpacing,
    progressSize: 16 as number,
  };
  switch (size) {
    case "Extra small":
      return {
        pt: "6px",
        pb: "4px",
        px: "8px",
        fontSize: textSm.fontSize,
        lineHeight: textSm.lineHeight,
        letterSpacing: textSm.letterSpacing,
        gap: "4px",
        progressSize: 12,
      };
    case "Small":
      return { pt: "6px", pb: "4px", px: "12px", gap: "8px", ...body };
    case "Medium":
      return { pt: "8px", pb: "8px", px: "12px", gap: "8px", ...body };
    case "Large":
      return { pt: "12px", pb: "12px", px: "12px", gap: "8px", ...body };
    default:
      return { pt: "8px", pb: "8px", px: "12px", gap: "8px", ...body };
  }
}

function gradient(start: string, end: string) {
  return `linear-gradient(to bottom, ${start}, ${end})`;
}

function getButtonSx(p: {
  type: TradType;
  destructive: boolean;
  state: TradState;
  size: TradSize;
}): SxProps<Theme> {
  const { type, destructive, state, size } = p;
  const m = sizeMetrics(size);
  const r = TRAD_RADIUS[size].value;
  const base: Record<string, unknown> = {
    borderRadius: r,
    paddingTop: m.pt,
    paddingBottom: m.pb,
    paddingLeft: m.px,
    paddingRight: m.px,
    fontSize: m.fontSize,
    lineHeight: m.lineHeight,
    letterSpacing: m.letterSpacing,
    fontWeight: 600,
    fontFamily: atlasFontFamily,
    textTransform: "none",
    minWidth: "auto",
    boxSizing: "border-box",
    border: "none",
  };

  const pri = ATLAS_LIGHT.action.primary;
  const sec = ATLAS_LIGHT.action.secondary;
  const des = ATLAS_LIGHT.action.destructive;
  const sd = ATLAS_LIGHT.action.secondaryDestructive;

  if (type === "Primary") {
    const src = destructive ? des : pri;
    if (state === "Disabled")
      return { ...base, background: src.disabled, color: destructive ? des.onDestructiveDisabled : pri.onPrimaryDisabled, pointerEvents: "none" };
    const grad =
      state === "Hover" ? gradient(src.hover.start, src.hover.end) :
      state === "Active" ? gradient(src.active.start, src.active.end) :
      gradient(src.default.start, src.default.end);
    return { ...base, background: grad, color: destructive ? des.onDestructive : pri.onPrimary, pointerEvents: state === "Processing" ? "none" : "auto" };
  }

  if (type === "Secondary") {
    const label = destructive ? sd.default : sec.onSecondary;
    const outline = destructive ? sd.default : sec.outline;
    if (state === "Disabled")
      return { ...base, background: "transparent", color: destructive ? sd.onSecondaryDisabled : sec.onSecondaryDisabled, border: `1px solid ${destructive ? sd.outlineDisabled : sec.disabledOutline}`, pointerEvents: "none" };
    let bg = "transparent";
    if (state === "Hover") bg = destructive ? ATLAS_LIGHT.status.error.background : sec.hoverFill;
    if (state === "Active") bg = destructive ? sd.active : sec.activeFill;
    return { ...base, background: bg, color: state === "Hover" && destructive ? sd.hover : label, border: `1px solid ${outline}`, pointerEvents: state === "Processing" ? "none" : "auto" };
  }

  // Tertiary
  const label = destructive ? sd.default : sec.onSecondary;
  if (state === "Disabled")
    return { ...base, background: "transparent", color: destructive ? sd.onSecondaryDisabled : sec.onSecondaryDisabled, pointerEvents: "none" };
  let bg = "transparent";
  if (state === "Hover") bg = destructive ? ATLAS_LIGHT.status.error.background : sec.hoverFill;
  if (state === "Active") bg = destructive ? sd.active : sec.activeFill;
  return { ...base, background: bg, color: state === "Hover" && destructive ? sd.hover : label, pointerEvents: state === "Processing" ? "none" : "auto" };
}

function describeStyle(p: {
  type: TradType;
  destructive: boolean;
  state: TradState;
  size: TradSize;
}): string {
  const { type, destructive, state, size } = p;
  const m = sizeMetrics(size);
  const r = TRAD_RADIUS[size];
  const parts: string[] = [`border-radius: ${r.value} (${r.token})`];

  const pri = ATLAS_LIGHT.action.primary;
  const sec = ATLAS_LIGHT.action.secondary;
  const des = ATLAS_LIGHT.action.destructive;
  const sd = ATLAS_LIGHT.action.secondaryDestructive;

  if (type === "Primary") {
    const src = destructive ? des : pri;
    if (state === "Disabled") {
      parts.push(`background: ${src.disabled}`, `color: ${destructive ? des.onDestructiveDisabled : pri.onPrimaryDisabled}`, "border: none");
    } else {
      const g = state === "Hover" ? src.hover : state === "Active" ? src.active : src.default;
      parts.push(`background: gradient(${g.start} → ${g.end})`, `color: ${destructive ? des.onDestructive : pri.onPrimary}`, "border: none");
      if (state === "Processing") parts.push("+ spinner");
    }
  } else if (type === "Secondary") {
    const outline = destructive ? sd.default : sec.outline;
    if (state === "Disabled") {
      parts.push(`border: 1px solid ${destructive ? sd.outlineDisabled : sec.disabledOutline}`, `color: ${destructive ? sd.onSecondaryDisabled : sec.onSecondaryDisabled}`, "background: transparent");
    } else {
      parts.push(`border: 1px solid ${outline}`);
      const label = destructive ? sd.default : sec.onSecondary;
      if (state === "Default") parts.push(`color: ${label}`, "background: transparent");
      if (state === "Hover") parts.push(`color: ${destructive ? sd.hover : label}`, `background: ${destructive ? ATLAS_LIGHT.status.error.background : sec.hoverFill}`);
      if (state === "Active") parts.push(`color: ${label}`, `background: ${destructive ? sd.active : sec.activeFill}`);
      if (state === "Processing") parts.push(`color: ${label}`, "background: transparent", "+ spinner");
    }
  } else {
    const label = destructive ? sd.default : sec.onSecondary;
    parts.push("border: none");
    if (state === "Disabled") parts.push(`color: ${destructive ? sd.onSecondaryDisabled : sec.onSecondaryDisabled}`, "background: transparent");
    else if (state === "Default") parts.push(`color: ${label}`, "background: transparent");
    else if (state === "Hover") parts.push(`color: ${destructive ? sd.hover : label}`, `background: ${destructive ? ATLAS_LIGHT.status.error.background : sec.hoverFill}`);
    else if (state === "Active") parts.push(`color: ${label}`, `background: ${destructive ? sd.active : sec.activeFill}`);
    else if (state === "Processing") parts.push(`color: ${label}`, "background: transparent", "+ spinner");
  }

  const padDesc = m.pt === m.pb ? `${m.pt} ${m.px}` : `${m.pt} ${m.px} ${m.pb}`;
  parts.push(`font: Inter 600 ${m.fontSize}/${m.lineHeight}`, `padding: ${padDesc}`, `letter-spacing: ${m.letterSpacing}`);
  return parts.join("; ");
}

/* ────────────────────────────────────────────────────────────
 * App button preview — renders a real MUI <Button> with
 * the same sx overrides we apply throughout the app
 * ──────────────────────────────────────────────────────────── */

function mapVariant(type: TradType): "contained" | "outlined" | "text" {
  if (type === "Primary") return "contained";
  if (type === "Secondary") return "outlined";
  return "text";
}

function mapColor(type: TradType, destructive: boolean): "primary" | "error" | "inherit" {
  if (destructive) return "error";
  if (type === "Primary") return "primary";
  return "inherit";
}

function mapSize(size: TradSize): "small" | "medium" | "large" {
  if (size === "Extra small" || size === "Small") return "small";
  if (size === "Large") return "large";
  return "medium";
}

function AppButtonPreview(props: {
  type: TradType;
  destructive: boolean;
  state: TradState;
  size: TradSize;
}) {
  const { type, destructive, state, size } = props;
  const variant = mapVariant(type);
  const color = mapColor(type, destructive);
  const muiSize = mapSize(size);
  const isDisabled = state === "Disabled";
  const isProcessing = state === "Processing";

  return (
    <Stack direction="column" spacing={0.5} alignItems="flex-start" sx={{ minWidth: 0 }}>
      <TradAtlasText semanticFont={SF.textXs} sx={{ color: "text.secondary", lineHeight: 1.2 }}>
        {size}
      </TradAtlasText>
      <Button
        variant={variant}
        color={color}
        size={muiSize}
        disabled={isDisabled}
        startIcon={isProcessing ? <CircularProgress size={14} thickness={4} color="inherit" /> : undefined}
        sx={{
          textTransform: "none",
          fontWeight: 600,
          ...semanticFontStyle(SF.labelMd),
          borderRadius: atlasSemanticRadius.md,
          pointerEvents: "none",
          ...(type === "Secondary" && !destructive && !isDisabled
            ? { borderColor: "#76777a" }
            : {}),
        }}
      >
        {"{Button}"}
      </Button>
    </Stack>
  );
}

/* ────────────────────────────────────────────────────────────
 * Chip component previews
 *
 * Atlas Chip spec (Trad Atlas Figma):
 *   Type: Outline | Filled
 *   Size: X Small (16px) | Small (24px) | Large (36px)
 *   State: Default | Hover | Active | Error | Inactive
 *   Selected: Yes | No
 *   Colors: monochrome only — no color/intent variants
 *     Outline unselected: border #282e37, text #282e37, bg transparent
 *     Filled unselected:  bg #e6e6e6, text #282e37
 *     Selected (both):    bg #d7f6ff, border #282e37, text #282e37
 *   Radius: radius/full (9999px)
 *   Font: Inter Regular 12/16 tracking 0.3px (Label/Sm)
 * ──────────────────────────────────────────────────────────── */

type AtlasChipType = "Outline" | "Filled";
type AtlasChipSize = "X Small" | "Small" | "Large";
type AtlasChipState = "Default" | "Hover" | "Active" | "Error" | "Inactive";

const ATLAS_CHIP_TYPES: AtlasChipType[] = ["Outline", "Filled"];
const ATLAS_CHIP_SIZES: AtlasChipSize[] = ["X Small", "Small", "Large"];
const ATLAS_CHIP_STATES: AtlasChipState[] = ["Default", "Hover", "Active", "Error", "Inactive"];

const ATLAS_CHIP_TOKENS = {
  outline: { border: "#282e37", bg: "transparent", text: "#282e37" },
  filled: { border: "transparent", bg: "#e6e6e6", text: "#282e37" },
  selected: { border: "#282e37", bg: "#d7f6ff", text: "#282e37" },
  hover: { outlineBg: "#f0f0f3", filledBg: "#d6d6d6" },
  active: { outlineBg: "#e2e2e5", filledBg: "#c8c8c8" },
  error: { border: "#be0c1e", text: "#be0c1e" },
  inactive: { border: "#aaabae", bg: "transparent", text: "#aaabae" },
};

function atlasChipHeight(size: AtlasChipSize) {
  return size === "X Small" ? 16 : size === "Small" ? 24 : 36;
}
function atlasChipFontSize(size: AtlasChipSize) {
  return size === "X Small" ? "10px" : "12px";
}

function AtlasChipPreview(props: {
  type: AtlasChipType;
  size: AtlasChipSize;
  state: AtlasChipState;
  selected: boolean;
}) {
  const { type, size, state, selected } = props;
  const t = ATLAS_CHIP_TOKENS;
  const base = selected ? t.selected : type === "Outline" ? t.outline : t.filled;
  let bg = base.bg;
  let border = base.border;
  let fg = base.text;

  if (state === "Hover") bg = type === "Outline" ? t.hover.outlineBg : t.hover.filledBg;
  if (state === "Active") bg = type === "Outline" ? t.active.outlineBg : t.active.filledBg;
  if (state === "Error") { border = t.error.border; fg = t.error.text; }
  if (state === "Inactive") { border = t.inactive.border; fg = t.inactive.text; bg = t.inactive.bg; }

  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        height: atlasChipHeight(size),
        borderRadius: "9999px",
        border: type === "Outline" || selected ? `1px solid ${border}` : "1px solid transparent",
        backgroundColor: bg,
        color: fg,
        fontFamily: atlasFontFamily,
        fontWeight: 400,
        fontSize: atlasChipFontSize(size),
        lineHeight: "16px",
        letterSpacing: "0.3px",
        px: size === "X Small" ? "6px" : "10px",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      Chip
    </Box>
  );
}

function ModifiedAtlasChipPreview(props: {
  type: AtlasChipType;
  size: AtlasChipSize;
  state: AtlasChipState;
  selected: boolean;
}) {
  const { type, state } = props;
  const isOutlined = type === "Outline";
  return (
    <Chip
      label="Chip"
      size="small"
      variant={isOutlined ? "outlined" : "filled"}
      disabled={state === "Inactive"}
      sx={{
        borderRadius: "9999px",
        ...(isOutlined ? { borderColor: "#76777a" } : {}),
      }}
    />
  );
}

/* Extended color chips — NOT part of Atlas design system */

type ExtChipColor = "primary" | "success" | "warning" | "error" | "default" | "neutral";

const EXT_CHIP_ROWS: {
  label: string;
  color: ExtChipColor;
  usage: string;
  deletable: boolean;
}[] = [
  { label: "In progress", color: "primary", usage: "Status — active workflow", deletable: false },
  { label: "Approved", color: "success", usage: "Status — positive outcome", deletable: false },
  { label: "Awaiting", color: "warning", usage: "Status — pending action", deletable: false },
  { label: "Critical", color: "error", usage: "Severity / status — critical", deletable: false },
  { label: "Not started", color: "neutral", usage: "Status — inactive", deletable: false },
  { label: "High", color: "warning", usage: "Severity — high", deletable: false },
  { label: "Medium", color: "default", usage: "Severity — medium", deletable: false },
  { label: "Recommended", color: "success", usage: "Label — AI suggestion", deletable: false },
  { label: "Selected", color: "primary", usage: "Label — user selection", deletable: false },
  { label: "Required", color: "neutral", usage: "Label — mandatory field", deletable: false },
  { label: "Added", color: "success", usage: "Label — recently added (removable)", deletable: true },
];

const EXT_CHIP_COLORS: Record<ExtChipColor, { bg: string; fg: string; border?: string }> = {
  primary: { bg: "#0040d5", fg: "#ffffff" },
  success: { bg: "#c2ffd2", fg: "#005f35", border: "#2ec377" },
  warning: { bg: "#fff2aa", fg: "#5d5300" },
  error: { bg: "#be0c1e", fg: "#ffffff" },
  default: { bg: "#f0f0f3", fg: "#242628" },
  neutral: { bg: "#f9f9fc", fg: "#5d5e61" },
};

function ExtChipPreview({ label, color: c, deletable }: typeof EXT_CHIP_ROWS[number]) {
  const palette = EXT_CHIP_COLORS[c];
  return (
    <Chip
      label={label}
      size="small"
      onDelete={deletable ? () => {} : undefined}
      sx={{
        ...semanticFontStyle(SF.textMicro),
        backgroundColor: palette.bg,
        color: palette.fg,
        border: palette.border ? `1px solid ${palette.border}` : undefined,
        fontWeight: 600,
        height: 20,
      }}
    />
  );
}

/* ────────────────────────────────────────────────────────────
 * Status Indicator previews
 * ──────────────────────────────────────────────────────────── */

type StatusType = "success" | "warning" | "error" | "info" | "neutral";

const STATUS_ROWS: {
  type: StatusType;
  label: string;
}[] = [
  { type: "success", label: "Healthy" },
  { type: "warning", label: "At risk" },
  { type: "error", label: "Critical" },
  { type: "info", label: "In progress" },
  { type: "neutral", label: "Inactive" },
];

const STATUS_DOT_COLORS: Record<StatusType, string> = {
  success: "#2ec377",
  warning: "#fee400",
  error: "#be0c1e",
  info: ATLAS_LIGHT.action.primary.default.start,
  neutral: "#8f9193",
};

function AtlasStatusIndicator({ type, label }: { type: StatusType; label: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: STATUS_DOT_COLORS[type],
          flexShrink: 0,
        }}
      />
      <TradAtlasText semanticFont={SF.textSm} sx={{ color: "#242628" }}>
        {label}
      </TradAtlasText>
    </Box>
  );
}

function ModifiedStatusIndicator({ type, label }: { type: StatusType; label: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: STATUS_DOT_COLORS[type],
          flexShrink: 0,
        }}
      />
      <TradAtlasText
        semanticFont={SF.labelMdCompact}
        sx={{ color: "#242628" }}
      >
        {label}
      </TradAtlasText>
    </Box>
  );
}

/* Extended status indicator patterns — NOT in Atlas */

import {
  CheckCircleIcon,
  CheckCircleOutlineIcon,
  RadioButtonUncheckedIcon,
  WarningAmberIcon,
} from "@/icons";
function ExtPatternPreview({ id }: { id: string }) {
  switch (id) {
    case "ring-dot":
      return (
        <Box sx={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid #0040d5", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#0040d5" }} />
        </Box>
      );
    case "check-icons":
      return (
        <Box sx={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <CheckCircleIcon sx={{ fontSize: 18, color: "#2ec377" }} />
          <RadioButtonUncheckedIcon sx={{ fontSize: 18, color: "#8f9193" }} />
          <CheckCircleOutlineIcon sx={{ fontSize: 18, color: "#2ec377" }} />
        </Box>
      );
    case "warning-icon":
      return <WarningAmberIcon sx={{ fontSize: 18, color: "#e8a500" }} />;
    case "dot-standalone":
      return (
        <Box sx={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#be0c1e" }} />
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#fee400" }} />
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#2ec377" }} />
        </Box>
      );
    case "bullet":
      return <Box sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#8f9193" }} />;
    case "progress-bar":
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "4px", width: 100 }}>
          <LinearProgress variant="determinate" value={65} sx={{ height: 4, borderRadius: 2, backgroundColor: "#e2e2e5", "& .MuiLinearProgress-bar": { backgroundColor: "#0040d5", borderRadius: 2 } }} />
          <LinearProgress variant="determinate" value={85} sx={{ height: 4, borderRadius: 2, backgroundColor: "#e2e2e5", "& .MuiLinearProgress-bar": { backgroundColor: "#fee400", borderRadius: 2 } }} />
        </Box>
      );
    case "left-border":
      return (
        <Box sx={{ borderLeft: "3px solid #0040d5", height: 28, width: 60, backgroundColor: "#f9f9fc", display: "flex", alignItems: "center", pl: "8px" }}>
          <TradAtlasText semanticFont={SF.textXs} sx={{ color: "#242628" }}>Active</TradAtlasText>
        </Box>
      );
    case "card-borders":
      return (
        <Box sx={{ display: "flex", gap: "4px" }}>
          <Box sx={{ width: 32, height: 20, border: "1px solid #2ec377", borderRadius: "4px", backgroundColor: "#fff" }} />
          <Box sx={{ width: 32, height: 20, border: "1px solid #fee400", borderRadius: "4px", backgroundColor: "#fff" }} />
          <Box sx={{ width: 32, height: 20, border: "1px solid #be0c1e", borderRadius: "4px", backgroundColor: "#fff" }} />
        </Box>
      );
    case "sparkline":
      return (
        <svg width="80" height="20" viewBox="0 0 80 20" fill="none">
          <polyline points="0,16 12,12 24,14 36,8 48,10 60,4 72,2 80,6" stroke="#2ec377" strokeWidth="1.5" fill="none" />
        </svg>
      );
    case "spinner":
      return <CircularProgress size={16} thickness={4} sx={{ color: "#8f9193" }} />;
    case "blink-caret":
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <TradAtlasText semanticFont={SF.textXs} sx={{ color: "#5d5e61" }}>text</TradAtlasText>
          <Box sx={{ width: 1, height: 12, backgroundColor: "#0040d5", "@keyframes blink": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0 } }, animation: "blink 1s step-end infinite" }} />
        </Box>
      );
    case "ai-sparkle":
      return (
        <Box sx={{ fontSize: 18, "@keyframes sparkle": { "0%,100%": { transform: "scale(1)", filter: "brightness(1)" }, "50%": { transform: "scale(1.2) rotate(15deg)", filter: "brightness(1.3)" } }, animation: "sparkle 2s ease-in-out infinite" }}>
          ✦
        </Box>
      );
    default:
      return null;
  }
}

const EXT_STATUS_PATTERNS: {
  id: string;
  pattern: string;
  visual: string;
  locations: string;
}[] = [
  {
    id: "ring-dot",
    pattern: "Ring + inner dot (step progress)",
    visual: "18px hollow ring with 8px filled primary dot — marks in-progress step",
    locations: "StatusPanel (CISO + CorpSec)",
  },
  {
    id: "check-icons",
    pattern: "CheckCircle / RadioButtonUnchecked icons",
    visual: "Green filled check or gray empty circle — binary complete/incomplete",
    locations: "StatusPanel, WorkPanel, IdeTabs, ConfigureApproversTabs, StakeholderBriefingTabs, ThinkingPanel",
  },
  {
    id: "warning-icon",
    pattern: "WarningAmber icon",
    visual: "Amber/orange warning triangle — attention required",
    locations: "WorkPanel, CollectAppointmentDataTabs, CisoCommandCenter",
  },
  {
    id: "dot-standalone",
    pattern: "8px dot without label (standalone)",
    visual: "Colored dot alone, color carries all meaning (severity, entity status)",
    locations: "CisoCommandCenter, CorpSecCommandCenter",
  },
  {
    id: "bullet",
    pattern: "6px muted bullet",
    visual: "Small gray dot as list bullet — layout, not semantic status",
    locations: "WorkPanel (both)",
  },
  {
    id: "progress-bar",
    pattern: "LinearProgress with custom statusColor",
    visual: "Thin bar (4–6px) with bar color set per-item (primary, warning, success)",
    locations: "StatusPanel, command centers, RemediationPanel, WorkPanel",
  },
  {
    id: "left-border",
    pattern: "Colored left-border accent (3px)",
    visual: "Primary left border on active step/overview row — no dot or icon",
    locations: "StatusPanel (both — active step highlight)",
  },
  {
    id: "card-borders",
    pattern: "Status-colored card borders",
    visual: "1px border changes color: success/warning/error based on state",
    locations: "StakeholderBriefingTabs, ConfigureApproversTabs, CollectAppointmentDataTabs, WorkPanel",
  },
  {
    id: "sparkline",
    pattern: "SVG sparkline (polyline)",
    visual: "120×24px mini line chart — green stroke trending up, red trending down",
    locations: "CisoCommandCenter + CorpSecCommandCenter",
  },
  {
    id: "spinner",
    pattern: "CircularProgress (in-progress spinner)",
    visual: "14–18px spinner for loading/in-progress substep rows",
    locations: "StatusSubstepRow, WorkPanel",
  },
  {
    id: "blink-caret",
    pattern: "Blinking text caret",
    visual: "1×12px vertical bar with blink animation — typing indicator",
    locations: "ThinkingPanel",
  },
  {
    id: "ai-sparkle",
    pattern: "AiSparkle animation",
    visual: "Scale/rotate/brightness keyframes on sparkle icon — AI affordance",
    locations: "AiSparkle component",
  },
];

/* ────────────────────────────────────────────────────────────
 * Badge previews
 * ──────────────────────────────────────────────────────────── */

type BadgeVariant = "count" | "dot";
type BadgeColor = "primary" | "error" | "warning" | "success";

const BADGE_ROWS: {
  variant: BadgeVariant;
  color: BadgeColor;
  content: number | undefined;
  label: string;
}[] = [
  { variant: "count", color: "error", content: 3, label: "Error count" },
  { variant: "count", color: "primary", content: 12, label: "Primary count" },
  { variant: "count", color: "warning", content: 5, label: "Warning count" },
  { variant: "count", color: "success", content: 1, label: "Success count" },
  { variant: "dot", color: "error", content: undefined, label: "Error dot" },
  { variant: "dot", color: "primary", content: undefined, label: "Primary dot" },
  { variant: "dot", color: "warning", content: undefined, label: "Warning dot" },
  { variant: "dot", color: "success", content: undefined, label: "Success dot" },
];

const BADGE_COLOR_MAP: Record<BadgeColor, string> = {
  primary: ATLAS_LIGHT.action.primary.default.start,
  error: "#be0c1e",
  warning: "#fee400",
  success: "#2ec377",
};

function BadgeAnchor() {
  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: "6px",
        backgroundColor: "#f0f0f3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TradAtlasText semanticFont={SF.textXs} sx={{ color: "#5d5e61" }}>
        ▢
      </TradAtlasText>
    </Box>
  );
}

function AtlasBadgePreview({ variant, color: c, content }: typeof BADGE_ROWS[number]) {
  return (
    <Badge
      badgeContent={variant === "count" ? content : undefined}
      variant={variant === "dot" ? "dot" : "standard"}
      sx={{
        "& .MuiBadge-badge": {
          backgroundColor: BADGE_COLOR_MAP[c],
          color: c === "warning" ? "#5d5300" : "#ffffff",
          fontWeight: 600,
          fontSize: "0.65rem",
          minWidth: variant === "dot" ? 8 : 18,
          height: variant === "dot" ? 8 : 18,
          borderRadius: variant === "dot" ? "50%" : "9px",
        },
      }}
    >
      <BadgeAnchor />
    </Badge>
  );
}

function ModifiedBadgePreview({ variant, color: c, content }: typeof BADGE_ROWS[number]) {
  return (
    <Badge
      badgeContent={variant === "count" ? content : undefined}
      variant={variant === "dot" ? "dot" : "standard"}
      color={c === "primary" ? "primary" : c === "error" ? "error" : c === "warning" ? "warning" : "success"}
    >
      <BadgeAnchor />
    </Badge>
  );
}

function VariantPreview(props: {
  type: TradType;
  destructive: boolean;
  state: TradState;
  size: TradSize;
}) {
  const { type, destructive, state, size } = props;
  const sx = getButtonSx(props);
  const m = sizeMetrics(size);

  return (
    <Stack direction="column" spacing={0.5} alignItems="flex-start" sx={{ minWidth: 0 }}>
      <TradAtlasText semanticFont={SF.textXs} sx={{ color: "text.secondary", lineHeight: 1.2 }}>
        {size}
      </TradAtlasText>
      <Box
        component="span"
        data-trad-size={size}
        sx={{
          ...sx,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: m.gap,
          cursor: state === "Disabled" || state === "Processing" ? "default" : "pointer",
        }}
      >
      {state === "Processing" && (
        <CircularProgress
          size={m.progressSize}
          thickness={4}
          sx={{
            color:
              type === "Primary"
                ? (destructive ? ATLAS_LIGHT.action.destructive.onDestructive : ATLAS_LIGHT.action.primary.onPrimary)
                : (destructive ? ATLAS_LIGHT.action.secondaryDestructive.default : ATLAS_LIGHT.action.secondary.onSecondary),
          }}
        />
      )}
      {"{Button}"}
      </Box>
    </Stack>
  );
}

/* ────────────────────────────────────────────────────────────
 * Token reference table
 * ──────────────────────────────────────────────────────────── */
const TOKEN_SECTIONS: { heading: string; rows: [string, string][] }[] = [
  {
    heading: "Action — Primary",
    rows: [
      ["action.primary.default (gradient)", "#1c4ee4 → #0040d5"],
      ["action.primary.hover (gradient)", "#4069fe → #1c4ee4"],
      ["action.primary.active (gradient)", "#002585 → #001c6c"],
      ["action.primary.disabled", "#e2e2e5"],
      ["action.primary.on-primary", "#ffffff"],
      ["action.primary.on-primary-disabled", "#aaabae"],
    ],
  },
  {
    heading: "Action — Secondary",
    rows: [
      ["action.secondary.outline", "#76777a"],
      ["action.secondary.disabled-outline", "#e2e2e5"],
      ["action.secondary.hover-fill", "#f0f0f3"],
      ["action.secondary.active-fill", "#8f9193"],
      ["action.secondary.on-secondary", "#242628"],
      ["action.secondary.on-secondary-disabled", "#aaabae"],
    ],
  },
  {
    heading: "Action — Destructive",
    rows: [
      ["action.destructive.default (gradient)", "#be0c1e → #a90016"],
      ["action.destructive.hover (gradient)", "#e22e33 → #be0c1e"],
      ["action.destructive.active (gradient)", "#68000a → #540006"],
      ["action.destructive.disabled", "#e2e2e5"],
      ["action.destructive.on-destructive", "#ffffff"],
      ["action.destructive.on-destructive-disabled", "#aaabae"],
    ],
  },
  {
    heading: "Action — Secondary destructive",
    rows: [
      ["action.secondary-destructive.default", "#a90016"],
      ["action.secondary-destructive.hover", "#e22e33"],
      ["action.secondary-destructive.active", "#410004"],
      ["action.secondary-destructive.on-secondary-disabled", "#aaabae"],
      ["action.secondary-destructive.outline-disabled", "#e2e2e5"],
    ],
  },
  {
    heading: "Status — Error",
    rows: [
      ["status.error.default", "#be0c1e"],
      ["status.error.text", "#a90016"],
      ["status.error.background", "#ffedeb"],
    ],
  },
  {
    heading: "Type",
    rows: [
      ["type.default", "#242628"],
      ["type.muted", "#5d5e61"],
      ["type.disabled", "#aaabae"],
    ],
  },
  {
    heading: "Outline",
    rows: [
      ["outline.default", "#8f9193"],
      ["outline.hover", "#515255"],
      ["outline.active", "#0f1113"],
      ["outline.disabled", "#e2e2e5"],
      ["outline.fixed", "#e2e2e5"],
      ["outline.static (Trad chip borders)", "#dadada"],
    ],
  },
  {
    heading: "Radius (Atlas Light)",
    rows: [
      ["radius.none", "0px"],
      ["radius.sm", "4px"],
      ["radius.md", "8px"],
      ["radius.lg", "12px"],
      ["radius.xl", "24px"],
      ["radius.2xl", "36px"],
      ["radius.full", "9999px"],
    ],
  },
  {
    heading: "Radius (Trad Atlas overrides)",
    rows: [
      ["radius/tiny (XS button)", "2px"],
      ["radius/sm (S button)", "4px"],
      ["radius/smmd (M button)", "6px"],
      ["radius/md (L button)", "8px"],
    ],
  },
];

function Swatch({ color }: { color: string }) {
  const isGradient = color.includes("→");
  const parts = color.split("→").map((s) => s.trim());
  return (
    <Box
      sx={{
        width: 20,
        height: 20,
        borderRadius: "4px",
        border: "1px solid",
        borderColor: "divider",
        flexShrink: 0,
        background: isGradient
          ? `linear-gradient(to bottom, ${parts[0]}, ${parts[1]})`
          : color,
      }}
    />
  );
}

export default function SystemPage() {
  const rows: {
    type: TradType;
    destructive: boolean;
    state: TradState;
    size: TradSize;
  }[] = [];

  for (const type of TYPES) {
    for (const destructive of [false, true] as const) {
      for (const state of STATES) {
        for (const size of SIZES) {
          rows.push({ type, destructive, state, size });
        }
      }
    }
  }

  return (
    <Box sx={{ py: "32px", px: "24px", maxWidth: 1400, mx: "auto" }}>
      <TradAtlasText component="h1" semanticFont={SF.titleH4Emphasis} sx={{ mb: "8px" }}>
        Design system reference
      </TradAtlasText>
      <TradAtlasText semanticFont={SF.textMd} sx={{ color: "text.secondary", mb: "24px" }}>
        Colors resolved from the <strong>Atlas Light</strong> theme. Radii from{" "}
        <strong>Trad Atlas</strong> (2 / 4 / 6 / 8 px). Focus variants omitted.
      </TradAtlasText>

      {/* ── Token reference ── */}
      <TradAtlasText semanticFont={SF.titleH5Emphasis} sx={{ mb: "12px" }}>
        Atlas Light design tokens
      </TradAtlasText>

      <Stack spacing="24px" sx={{ mb: "40px" }}>
        {TOKEN_SECTIONS.map((section) => (
          <Box key={section.heading}>
            <TradAtlasText semanticFont={SF.textSmEmphasis} sx={{ mb: "4px" }}>
              {section.heading}
            </TradAtlasText>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableBody>
                  {section.rows.map(([token, value]) => (
                    <TableRow key={token}>
                      <TableCell
                        {...{ [DATA_SEMANTIC_FONT]: SF.textSm }}
                        sx={{ ...semanticFontStyle(SF.textSm), fontFamily: atlasFontFamilyMono, py: "4px", width: "50%" }}
                      >
                        {token}
                      </TableCell>
                      <TableCell sx={{ py: "4px" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {!value.endsWith("px") && <Swatch color={value} />}
                          <TradAtlasText semanticFont={SF.textSm} sx={{ fontFamily: atlasFontFamilyMono }}>{value}</TradAtlasText>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}
      </Stack>

      <Divider sx={{ mb: "32px" }} />

      {/* ── Button component grid ── */}
      <TradAtlasText semanticFont={SF.titleH5Emphasis} sx={{ mb: "4px" }}>
        Button
      </TradAtlasText>
      <TradAtlasText semanticFont={SF.textMd} sx={{ color: "text.secondary", mb: "12px" }}>
        Trad Atlas — Components. Border radii: XS 2px, S 4px, M 6px, L 8px.
      </TradAtlasText>

      <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: "70vh" }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, minWidth: 160 }}>Atlas</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 160 }}>Modified</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 280 }}>Variant</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Style attributes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const key = `${row.type}-${row.destructive}-${row.state}-${row.size}`;
              const variantLabel = `Type=${row.type}, Destructive=${row.destructive}, State=${row.state}, Size=${row.size}, Icon only=No`;
              return (
                <TableRow key={key} hover>
                  <TableCell sx={{ py: "8px" }}>
                    <AppButtonPreview
                      type={row.type}
                      destructive={row.destructive}
                      state={row.state}
                      size={row.size}
                    />
                  </TableCell>
                  <TableCell sx={{ py: "8px" }}>
                    <VariantPreview
                      type={row.type}
                      destructive={row.destructive}
                      state={row.state}
                      size={row.size}
                    />
                  </TableCell>
                  <TableCell>
                    <TradAtlasText semanticFont={SF.textSm} sx={{ fontFamily: atlasFontFamilyMono }}>{variantLabel}</TradAtlasText>
                  </TableCell>
                  <TableCell>
                    <TradAtlasText semanticFont={SF.textSm} sx={{ fontFamily: atlasFontFamilyMono, color: "text.secondary" }}>
                      {describeStyle(row)}
                    </TradAtlasText>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: "32px" }} />

      {/* ── Chip component grid ── */}
      <TradAtlasText semanticFont={SF.titleH5Emphasis} sx={{ mb: "4px" }}>
        Chip
      </TradAtlasText>
      <TradAtlasText semanticFont={SF.textMd} sx={{ color: "text.secondary", mb: "12px" }}>
        Atlas chips are monochrome (Outline / Filled) with sizes, states, and a selected toggle.
        Radius: full pill (9999px). Font: Inter 400 12/16 tracking 0.3px.
      </TradAtlasText>

      <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: "50vh", mb: "8px" }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Atlas</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Modified</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 260 }}>Variant</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Style attributes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ATLAS_CHIP_TYPES.flatMap((type) =>
              [false, true].flatMap((selected) =>
                ATLAS_CHIP_STATES.flatMap((state) =>
                  ATLAS_CHIP_SIZES.map((size) => {
                    const key = `${type}-${selected}-${state}-${size}`;
                    const variantLabel = `Type=${type}, Size=${size}, State=${state}, Selected=${selected ? "Yes" : "No"}`;
                    const t = ATLAS_CHIP_TOKENS;
                    const base = selected ? t.selected : type === "Outline" ? t.outline : t.filled;
                    const attrs = [
                      `bg: ${base.bg}`,
                      `border: ${base.border}`,
                      `text: ${base.text}`,
                      `height: ${atlasChipHeight(size)}px`,
                      `font: Inter 400 ${atlasChipFontSize(size)}/16px tracking 0.3px`,
                      "radius: 9999px",
                    ];
                    return (
                      <TableRow key={key} hover>
                        <TableCell sx={{ py: "8px" }}>
                          <AtlasChipPreview type={type} size={size} state={state} selected={selected} />
                        </TableCell>
                        <TableCell sx={{ py: "8px" }}>
                          <ModifiedAtlasChipPreview type={type} size={size} state={state} selected={selected} />
                        </TableCell>
                        <TableCell>
                          <TradAtlasText semanticFont={SF.textSm} sx={{ fontFamily: atlasFontFamilyMono }}>{variantLabel}</TradAtlasText>
                        </TableCell>
                        <TableCell>
                          <TradAtlasText semanticFont={SF.textSm} sx={{ fontFamily: atlasFontFamilyMono, color: "text.secondary" }}>
                            {attrs.join("; ")}
                          </TradAtlasText>
                        </TableCell>
                      </TableRow>
                    );
                  }),
                ),
              ),
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ── Extended color chips — NOT in Atlas ── */}
      <Paper variant="outlined" sx={{ p: "16px", mt: "24px", mb: "8px", bgcolor: "#fff8e1", borderColor: "#ffe082" }}>
        <TradAtlasText semanticFont={SF.textSmEmphasis} sx={{ mb: "4px", display: "block" }}>
          Extended color variants (not in Atlas)
        </TradAtlasText>
        <TradAtlasText semanticFont={SF.textSm} sx={{ color: "text.secondary" }}>
          These color-coded chips are used throughout the app for status, severity, and labeling
          but do not exist in the Atlas design system. They are custom extensions that would need
          to be proposed as additions or reconciled with Atlas patterns.
        </TradAtlasText>
      </Paper>

      <TableContainer component={Paper} variant="outlined" sx={{ mb: "8px" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Extended variant</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Nearest Atlas</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 200 }}>Usage</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Style attributes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {EXT_CHIP_ROWS.map((row) => {
              const key = `ext-${row.color}-${row.label}`;
              const palette = EXT_CHIP_COLORS[row.color];
              const attrs = [
                `bg: ${palette.bg}`,
                `fg: ${palette.fg}`,
                palette.border ? `border: 1px solid ${palette.border}` : null,
                "height: 20px",
                "font: SF.textMicro, weight 600",
              ].filter(Boolean).join("; ");
              return (
                <TableRow key={key} hover>
                  <TableCell sx={{ py: "8px" }}>
                    <ExtChipPreview {...row} />
                  </TableCell>
                  <TableCell sx={{ py: "8px" }}>
                    <AtlasChipPreview type="Filled" size="Small" state="Default" selected={false} />
                  </TableCell>
                  <TableCell>
                    <TradAtlasText semanticFont={SF.textSm} sx={{ fontFamily: atlasFontFamilyMono }}>
                      {row.usage}
                    </TradAtlasText>
                  </TableCell>
                  <TableCell>
                    <TradAtlasText semanticFont={SF.textSm} sx={{ fontFamily: atlasFontFamilyMono, color: "text.secondary" }}>
                      {attrs}
                    </TradAtlasText>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: "32px" }} />

      {/* ── Status Indicator grid ── */}
      <TradAtlasText semanticFont={SF.titleH5Emphasis} sx={{ mb: "4px" }}>
        Status indicator
      </TradAtlasText>

      <Paper variant="outlined" sx={{ p: "16px", mb: "16px", bgcolor: "#fff8e1", borderColor: "#ffe082" }}>
        <TradAtlasText semanticFont={SF.textSmEmphasis} sx={{ mb: "4px", display: "block" }}>
          No status indicator component in Atlas
        </TradAtlasText>
        <TradAtlasText semanticFont={SF.textSm} sx={{ color: "text.secondary" }}>
          Trad Atlas provides status <strong>color tokens</strong> (success, warning, error, notification)
          but no dedicated status indicator component. Every dot + label pattern below is a custom
          construction. Atlas would need a proposed Status Indicator component to cover these use cases.
        </TradAtlasText>
      </Paper>

      <TradAtlasText semanticFont={SF.textMd} sx={{ color: "text.secondary", mb: "12px" }}>
        Dot + label pairs used in entity tables, agent status rows, and vulnerability summaries.
        The "Atlas" column shows our best-guess rendering using Atlas tokens; the "Modified" column
        shows how the app actually renders them.
      </TradAtlasText>

      <TableContainer component={Paper} variant="outlined" sx={{ mb: "8px" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, minWidth: 160 }}>Atlas (proposed)</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 160 }}>Modified</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Style attributes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {STATUS_ROWS.map((row) => {
              const dotColor = STATUS_DOT_COLORS[row.type];
              const attrs = [
                `dot: ${dotColor}`,
                "proposed dot: 10×10px",
                "modified dot: 8×8px",
                "proposed font: SF.textSm",
                "modified font: SF.labelMdCompact",
              ];
              return (
                <TableRow key={row.type} hover>
                  <TableCell sx={{ py: "10px" }}>
                    <AtlasStatusIndicator {...row} />
                  </TableCell>
                  <TableCell sx={{ py: "10px" }}>
                    <ModifiedStatusIndicator {...row} />
                  </TableCell>
                  <TableCell>
                    <TradAtlasText semanticFont={SF.textSm} sx={{ fontFamily: atlasFontFamilyMono }}>
                      {row.type}
                    </TradAtlasText>
                  </TableCell>
                  <TableCell>
                    <TradAtlasText semanticFont={SF.textSm} sx={{ fontFamily: atlasFontFamilyMono, color: "text.secondary" }}>
                      {attrs.join("; ")}
                    </TradAtlasText>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ── Extended status patterns ── */}
      <TradAtlasText semanticFont={SF.textSmEmphasis} sx={{ mt: "24px", mb: "8px", display: "block" }}>
        Additional visual status patterns used in the app
      </TradAtlasText>

      <TableContainer component={Paper} variant="outlined" sx={{ mb: "8px" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, minWidth: 110 }}>Preview</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 220 }}>Pattern</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 280 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Used in</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {EXT_STATUS_PATTERNS.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell sx={{ py: "10px" }}>
                  <ExtPatternPreview id={row.id} />
                </TableCell>
                <TableCell>
                  <TradAtlasText semanticFont={SF.textSm} sx={{ fontWeight: 600 }}>
                    {row.pattern}
                  </TradAtlasText>
                </TableCell>
                <TableCell>
                  <TradAtlasText semanticFont={SF.textSm} sx={{ color: "text.secondary" }}>
                    {row.visual}
                  </TradAtlasText>
                </TableCell>
                <TableCell>
                  <TradAtlasText semanticFont={SF.textSm} sx={{ fontFamily: atlasFontFamilyMono, color: "text.secondary" }}>
                    {row.locations}
                  </TradAtlasText>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: "32px" }} />

      {/* ── Badge grid ── */}
      <TradAtlasText semanticFont={SF.titleH5Emphasis} sx={{ mb: "4px" }}>
        Badge
      </TradAtlasText>

      <Paper variant="outlined" sx={{ p: "16px", mb: "16px", bgcolor: "#fff8e1", borderColor: "#ffe082" }}>
        <TradAtlasText semanticFont={SF.textSmEmphasis} sx={{ mb: "4px", display: "block" }}>
          No Badge component in Trad Atlas
        </TradAtlasText>
        <TradAtlasText semanticFont={SF.textSm} sx={{ color: "text.secondary" }}>
          A Badge component exists in <strong>Atlas Horizon (Boards Private Cloud UI Library)</strong> but
          is not part of the core Trad Atlas component library. The app uses MUI Badge directly.
          These would need to be reconciled with the Horizon Badge or proposed as a Trad Atlas addition.
        </TradAtlasText>
      </Paper>

      <TradAtlasText semanticFont={SF.textMd} sx={{ color: "text.secondary", mb: "12px" }}>
        Count and dot badge variants anchored to a placeholder element. The "Atlas" column shows
        a proposed rendering using Atlas status tokens; the "Modified" column shows MUI default badge styling.
      </TradAtlasText>

      <TableContainer component={Paper} variant="outlined" sx={{ mb: "8px" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Atlas (proposed)</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Modified</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 160 }}>Variant</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Style attributes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {BADGE_ROWS.map((row) => {
              const badgeColor = BADGE_COLOR_MAP[row.color];
              const attrs = [
                `variant: ${row.variant}`,
                `color: ${badgeColor}`,
              ];
              if (row.variant === "count") {
                attrs.push("proposed: custom bg/fg, 18px pill, font 0.65rem 600");
                attrs.push("modified: MUI default badge styling");
              } else {
                attrs.push("proposed: custom bg, 8px dot");
                attrs.push("modified: MUI default dot variant");
              }
              return (
                <TableRow key={`${row.variant}-${row.color}`} hover>
                  <TableCell sx={{ py: "12px" }}>
                    <AtlasBadgePreview {...row} />
                  </TableCell>
                  <TableCell sx={{ py: "12px" }}>
                    <ModifiedBadgePreview {...row} />
                  </TableCell>
                  <TableCell>
                    <TradAtlasText semanticFont={SF.textSm} sx={{ fontFamily: atlasFontFamilyMono }}>
                      {row.variant} / {row.color}
                    </TradAtlasText>
                  </TableCell>
                  <TableCell>
                    <TradAtlasText semanticFont={SF.textSm} sx={{ fontFamily: atlasFontFamilyMono, color: "text.secondary" }}>
                      {attrs.join("; ")}
                    </TradAtlasText>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
