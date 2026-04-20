import {
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  LinearProgress,
  Link,
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

import {
  atlasFontFamily,
  atlasFontFamilyMono,
  atlasSemanticColor,
  atlasSemanticRadius,
} from "../tokens/atlasLight";
import { useTokens } from "../hooks/useTokens";
import TradAtlasText from "../components/common/TradAtlasText";
import {
  DATA_SEMANTIC_FONT,
  SF,
  semanticFontStyle,
  TYPOGRAPHY_PRIMITIVE,
} from "../tokens/tradAtlasSemanticTypography";

/** Design system tables: no outer Paper frame; horizontal rules come from `TableCell` borders in the theme. */
const SYSTEM_DOC_TABLE_CONTAINER_SX = { border: "none", boxShadow: "none" } as const;

const SYSTEM_PAGE_SCROLL_MARGIN = "24px";

const SYSTEM_PAGE_TOC: { id: string; label: string }[] = [
  { id: "system-design-tokens", label: "Design tokens" },
  { id: "system-table", label: "Table" },
  { id: "system-button", label: "Button" },
  { id: "system-chip", label: "Chip" },
  { id: "system-progress", label: "Loading indicator" },
  { id: "system-extended-chips", label: "Extended chips" },
  { id: "system-status-indicator", label: "Status indicator" },
  { id: "system-status-patterns", label: "Status patterns" },
  { id: "system-badge", label: "Badge" },
  { id: "system-ai", label: "AI components" },
];

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
    const result: Record<string, unknown> = { ...base, background: grad, color: destructive ? des.onDestructive : pri.onPrimary, pointerEvents: state === "Processing" ? "none" : "auto" };
    if (state === "Default") {
      result.transition = "background 0.15s, box-shadow 0.15s";
      result["&:hover"] = { background: gradient(src.hover.start, src.hover.end) };
      result["&:active"] = { background: gradient(src.active.start, src.active.end) };
      result["&:focus-visible"] = { outline: `2px solid ${pri.default.start}`, outlineOffset: "2px" };
    }
    return result;
  }

  if (type === "Secondary") {
    const label = destructive ? sd.default : sec.onSecondary;
    const outline = destructive ? sd.default : sec.outline;
    if (state === "Disabled")
      return { ...base, background: "transparent", color: destructive ? sd.onSecondaryDisabled : sec.onSecondaryDisabled, border: `1px solid ${destructive ? sd.outlineDisabled : sec.disabledOutline}`, pointerEvents: "none" };
    let bg = "transparent";
    if (state === "Hover") bg = destructive ? ATLAS_LIGHT.status.error.background : sec.hoverFill;
    if (state === "Active") bg = destructive ? sd.active : sec.activeFill;
    const result: Record<string, unknown> = { ...base, background: bg, color: state === "Hover" && destructive ? sd.hover : label, border: `1px solid ${outline}`, pointerEvents: state === "Processing" ? "none" : "auto" };
    if (state === "Default") {
      result.transition = "background 0.15s, color 0.15s, box-shadow 0.15s";
      result["&:hover"] = { background: destructive ? ATLAS_LIGHT.status.error.background : sec.hoverFill, color: destructive ? sd.hover : label };
      result["&:active"] = { background: destructive ? sd.active : sec.activeFill };
      result["&:focus-visible"] = { outline: `2px solid ${pri.default.start}`, outlineOffset: "2px" };
    }
    return result;
  }

  // Tertiary
  const label = destructive ? sd.default : sec.onSecondary;
  if (state === "Disabled")
    return { ...base, background: "transparent", color: destructive ? sd.onSecondaryDisabled : sec.onSecondaryDisabled, pointerEvents: "none" };
  let bg = "transparent";
  if (state === "Hover") bg = destructive ? ATLAS_LIGHT.status.error.background : sec.hoverFill;
  if (state === "Active") bg = destructive ? sd.active : sec.activeFill;
  const result: Record<string, unknown> = { ...base, background: bg, color: state === "Hover" && destructive ? sd.hover : label, pointerEvents: state === "Processing" ? "none" : "auto" };
  if (state === "Default") {
    result.transition = "background 0.15s, color 0.15s, box-shadow 0.15s";
    result["&:hover"] = { background: destructive ? ATLAS_LIGHT.status.error.background : sec.hoverFill, color: destructive ? sd.hover : label };
    result["&:active"] = { background: destructive ? sd.active : sec.activeFill };
    result["&:focus-visible"] = { outline: `2px solid ${pri.default.start}`, outlineOffset: "2px" };
  }
  return result;
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
  const isDefault = state === "Default";

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
          pointerEvents: isDefault ? "auto" : "none",
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

  const isDefault = state === "Default";
  const hoverBg = type === "Outline" ? t.hover.outlineBg : t.hover.filledBg;
  const activeBg = type === "Outline" ? t.active.outlineBg : t.active.filledBg;

  return (
    <Box
      component="span"
      tabIndex={isDefault ? 0 : undefined}
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
        cursor: isDefault ? "pointer" : "default",
        ...(isDefault && {
          transition: "background-color 0.15s",
          "&:hover": { backgroundColor: hoverBg },
          "&:active": { backgroundColor: activeBg },
          "&:focus-visible": { outline: `2px solid ${ATLAS_LIGHT.action.primary.default.start}`, outlineOffset: "2px" },
        }),
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
  const isDefault = state === "Default";
  return (
    <Chip
      label="Chip"
      size="small"
      variant={isOutlined ? "outlined" : "filled"}
      disabled={state === "Inactive"}
      clickable={isDefault}
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
  ArrowUpwardIcon,
  AssessmentOutlinedIcon,
  AttachFileIcon,
  AutoAwesomeOutlinedIcon,
  CheckCircleIcon,
  CheckCircleOutlineIcon,
  ContentCopyIcon,
  DescriptionOutlinedIcon,
  ExpandMoreIcon,
  MicIcon,
  RadioButtonUncheckedIcon,
  ReplayIcon,
  SearchOutlinedIcon,
  ShareOutlinedIcon,
  ThumbDownOutlinedIcon,
  ThumbUpOutlinedIcon,
  TuneIcon,
  WarningAmberIcon,
} from "@/icons";
import ChatPromptComponent from "../components/ai/ChatPrompt";
import MessageBubble from "../components/ai/MessageBubble";
import ChatAssistantResponse from "../components/ai/ChatAssistantResponse";
import ThinkingPanelComponent from "../components/ai/ThinkingPanel";
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
    locations: "StatusPanel, WorkPanel, IdeTabs, ConfigureApproversTabs, StakeholderBriefingTabs (CISO), EditAuthorizePanel (Audit), ThinkingPanel",
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
    locations: "StakeholderBriefingTabs (CISO), EditAuthorizePanel (Audit), ConfigureApproversTabs, CollectAppointmentDataTabs, WorkPanel",
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
  const isInteractive = state === "Default";

  return (
    <Stack direction="column" spacing={0.5} alignItems="flex-start" sx={{ minWidth: 0 }}>
      <TradAtlasText semanticFont={SF.textXs} sx={{ color: "text.secondary", lineHeight: 1.2 }}>
        {size}
      </TradAtlasText>
      <Box
        component="span"
        data-trad-size={size}
        tabIndex={isInteractive ? 0 : undefined}
        role={isInteractive ? "button" : undefined}
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

const TABLE_COMPARISON_ROWS: {
  name: string;
  jurisdiction: string;
  status: string;
  statusCritical: boolean;
  issue: string;
  deadline: string;
}[] = [
  {
    name: "Aether Holdings Ltd",
    jurisdiction: "England & Wales",
    status: "Action required",
    statusCritical: true,
    issue: "Director vacancy — appointment overdue",
    deadline: "Apr 8",
  },
  {
    name: "Zenith Compliance Services",
    jurisdiction: "Ireland",
    status: "Filing overdue",
    statusCritical: true,
    issue: "Annual return past due by 2 days",
    deadline: "Overdue",
  },
];

function CommandCenterTableSample() {
  const { color, weight, radius } = useTokens();
  return (
    <Box
      sx={{
        borderRadius: radius.md,
        border: `1px solid ${color.outline.fixed}`,
        overflow: "hidden",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1.8fr 1.2fr 1.2fr 1.5fr 0.8fr",
          px: "20px",
          py: "10px",
          borderBottom: `1px solid ${color.outline.fixed}`,
          background: color.surface.subtle,
        }}
      >
        {["Entity", "Jurisdiction", "Status", "Issue", "Deadline"].map((h) => (
          <TradAtlasText key={h} semanticFont={SF.textSmUppercase} sx={{ color: color.type.muted }}>
            {h}
          </TradAtlasText>
        ))}
      </Box>
      {TABLE_COMPARISON_ROWS.map((e, i) => (
        <Box
          key={e.name}
          sx={{
            display: "grid",
            gridTemplateColumns: "1.8fr 1.2fr 1.2fr 1.5fr 0.8fr",
            px: "20px",
            py: "12px",
            borderBottom: i < TABLE_COMPARISON_ROWS.length - 1 ? `1px solid ${color.outline.fixed}` : "none",
            alignItems: "center",
            "&:hover": { background: color.surface.subtle },
          }}
        >
          <TradAtlasText semanticFont={SF.textMd} sx={{ fontWeight: weight.medium, color: color.type.default }}>
            {e.name}
          </TradAtlasText>
          <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
            {e.jurisdiction}
          </TradAtlasText>
          <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: e.statusCritical ? color.status.error.default : color.status.success.default,
                flexShrink: 0,
              }}
            />
            <TradAtlasText semanticFont={SF.labelMdCompact} sx={{ color: color.type.default }}>
              {e.status}
            </TradAtlasText>
          </Box>
          <TradAtlasText semanticFont={SF.labelMd} sx={{ color: color.type.muted }}>
            {e.issue}
          </TradAtlasText>
          <TradAtlasText
            semanticFont={SF.textMd}
            sx={{
              color: e.deadline === "Overdue" ? color.status.error.text : color.type.muted,
              fontWeight: e.deadline === "Overdue" ? weight.semiBold : weight.regular,
            }}
          >
            {e.deadline}
          </TradAtlasText>
        </Box>
      ))}
    </Box>
  );
}

function AtlasLightMuiTableSample() {
  const { color, weight } = useTokens();
  return (
    <TableContainer component={Paper} elevation={0} sx={{ width: "100%", ...SYSTEM_DOC_TABLE_CONTAINER_SX }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {["Entity", "Jurisdiction", "Status", "Issue", "Deadline"].map((h) => (
              <TableCell key={h} sx={{ fontWeight: 600 }}>
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {TABLE_COMPARISON_ROWS.map((row) => (
            <TableRow key={row.name} hover>
              <TableCell sx={{ py: "12px" }}>
                <TradAtlasText semanticFont={SF.textMd} sx={{ fontWeight: weight.medium }}>
                  {row.name}
                </TradAtlasText>
              </TableCell>
              <TableCell sx={{ py: "12px" }}>
                <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
                  {row.jurisdiction}
                </TradAtlasText>
              </TableCell>
              <TableCell sx={{ py: "12px" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: row.statusCritical ? color.status.error.default : color.status.success.default,
                      flexShrink: 0,
                    }}
                  />
                  <TradAtlasText semanticFont={SF.labelMdCompact}>{row.status}</TradAtlasText>
                </Box>
              </TableCell>
              <TableCell sx={{ py: "12px" }}>
                <TradAtlasText semanticFont={SF.labelMd} sx={{ color: color.type.muted }}>
                  {row.issue}
                </TradAtlasText>
              </TableCell>
              <TableCell
                sx={{
                  py: "12px",
                  color: row.deadline === "Overdue" ? color.status.error.text : color.type.muted,
                  fontWeight: row.deadline === "Overdue" ? weight.semiBold : weight.regular,
                }}
              >
                <TradAtlasText
                  semanticFont={SF.textMd}
                  sx={{
                    color: row.deadline === "Overdue" ? color.status.error.text : color.type.muted,
                    fontWeight: row.deadline === "Overdue" ? weight.semiBold : weight.regular,
                  }}
                >
                  {row.deadline}
                </TradAtlasText>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

/*
 * ── Atlas Loading Indicator ──
 *
 * The Atlas design system uses a "Loading Indicator" component (not "Progress bar").
 * It comes in three forms:
 *   1. Linear  — pill-shaped track with outlined border and internal bar
 *   2. Circular — ring track with animated value arc
 *   3. AI      — sparkle icon + "Thinking" label in a pill surface
 *
 * The MUI `LinearProgress` / `CircularProgress` are the closest MUI equivalents.
 * The table below shows how the Atlas Loading Indicator differs from default MUI.
 */

/** Atlas Loading Indicator — Linear (determinate)
 *  Figma spec: total height 12px (border-box), border 1px solid outline/default (#6f7377),
 *  border-radius 9999px, 4px padding on all sides inside the border,
 *  inner bar 4px tall, border-radius 9999px, gradient action.primary.default.
 *  Built as a custom Box layout because MUI LinearProgress stretches its bar to fill
 *  the full track height — it cannot produce a 4px bar inside a 12px track. */
function AtlasLinearDeterminate({ value }: { value: number }) {
  const { color } = useTokens();
  return (
    <Box sx={{ width: 240, maxWidth: "100%" }}>
      {/* Track */}
      <Box
        sx={{
          height: 12,
          borderRadius: "9999px",
          border: `1px solid ${color.outline.default}`,
          display: "flex",
          alignItems: "center",
          px: "4px",
          boxSizing: "border-box",
        }}
      >
        {/* Bar */}
        <Box
          sx={{
            height: 4,
            width: `${value}%`,
            borderRadius: "9999px",
            background: color.action.primary.default,
          }}
        />
      </Box>
    </Box>
  );
}

/** Atlas Loading Indicator — Linear (indeterminate)
 *  Same track chrome; bar animates back and forth with overflow clipped.
 *  Uses a CSS keyframe to slide a fixed-width bar across the track. */
function AtlasLinearIndeterminate() {
  const { color } = useTokens();
  return (
    <Box sx={{ width: 240, maxWidth: "100%" }}>
      <Box
        sx={{
          height: 12,
          borderRadius: "9999px",
          border: `1px solid ${color.outline.default}`,
          display: "flex",
          alignItems: "center",
          px: "4px",
          boxSizing: "border-box",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          sx={{
            height: 4,
            width: "40%",
            borderRadius: "9999px",
            background: color.action.primary.default,
            position: "absolute",
            "@keyframes atlasSlide": {
              "0%": { left: "4px", right: "auto" },
              "50%": { left: "calc(60% - 4px)", right: "auto" },
              "100%": { left: "4px", right: "auto" },
            },
            animation: "atlasSlide 1.8s ease-in-out infinite",
          }}
        />
      </Box>
    </Box>
  );
}

/** Atlas Loading Indicator — Circular
 *  Figma spec: ring track 2px stroke outline/default, value arc 2px stroke action.primary.
 *  Sizes: Small 20px, Medium 32px, Large 56px. */
function AtlasCircular({ size = 32 }: { size?: number }) {
  const { color } = useTokens();
  return (
    <Box sx={{ position: "relative", width: size, height: size }}>
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={size <= 20 ? 3 : 2.5}
        sx={{ color: color.outline.default, position: "absolute", top: 0, left: 0 }}
      />
      <CircularProgress
        size={size}
        thickness={size <= 20 ? 3 : 2.5}
        sx={{ color: color.action.primary.default, position: "absolute", top: 0, left: 0 }}
      />
    </Box>
  );
}

/** Default MUI LinearProgress for comparison. */
function MuiDefaultLinearDeterminate({ value, muiColor = "primary" }: { value: number; muiColor?: "primary" | "warning" | "success" }) {
  return (
    <Box sx={{ width: 240, maxWidth: "100%" }}>
      <LinearProgress variant="determinate" value={value} color={muiColor} />
    </Box>
  );
}

function MuiDefaultLinearIndeterminate() {
  return (
    <Box sx={{ width: 240, maxWidth: "100%" }}>
      <LinearProgress color="primary" />
    </Box>
  );
}

function MuiDefaultCircular() {
  return <CircularProgress color="primary" size={32} />;
}

const LOADING_INDICATOR_DOC_ROWS: {
  key: string;
  variant: string;
  attrs: string;
}[] = [
  {
    key: "lin-det",
    variant: "Linear — determinate",
    attrs:
      "Atlas: 12px track (border-box), 1px border outline/default (#6f7377), radius 9999px, 4px inner padding, 4px bar height, bar action.primary.default, bar radius 9999px. MUI: 4px solid track, no border/padding, bar fills full height.",
  },
  {
    key: "lin-indet",
    variant: "Linear — indeterminate",
    attrs:
      "Atlas: same track chrome as determinate, bar animates within clipped overflow. MUI default: thin bar with slide + shrink keyframes.",
  },
  {
    key: "circular",
    variant: "Circular — spinner",
    attrs:
      "Atlas: ring track (outline/default), spinning value arc (action.primary), sizes 20/32/56px. MUI default: single arc, no visible track ring.",
  },
];

/* ────────────────────────────────────────────────────────────
 * AI components — Atlas reference vs. project-modified
 *
 * These helpers render the Atlas design system reference variants
 * from the **Components — Atlas Lens** Figma file (AI chatbox
 * node 44787:3280; AI content area node 44063:5584 / desktop
 * example 44063:5755). They are recreated here with resolved
 * Atlas Light semantic tokens so the canonical Atlas UI can be
 * shown side-by-side with the project-modified components in
 * `src/components/ai/`.
 *
 * Tokens used from `atlasLight.ts`:
 *   surface/default, surface/variant        →  white / #f0f0f3 chrome
 *   outline/default, outline/static         →  chatbox border / divider
 *   outline/active                          →  focused/active card border
 *   type/default, type/muted                →  body copy / supporting copy
 *   action/link/default                     →  "Learn more." link
 *   action/secondary/onSecondary            →  toolbar button ink
 *   action/secondary/outline (disabled)     →  send-button outline
 *   radius.lg / radius.full / radius.md     →  12px / pill / 8px
 *
 * Gradient specs come straight from Figma ("AI glow" / "AI Stroke" /
 * "AI gradient highlight" styles) and are inlined as rgba literals
 * because they reference primitive color variables that are not in
 * the Atlas Light semantic surface scale.
 * ──────────────────────────────────────────────────────────── */

/** AI glow — large ambient gradient halo above the chat input. Figma style
 *  "AI gradient highlight": 40px blur, 66px tall, horizontal left→right
 *  white → red/50 → purple/50 → indigo/50 → white at 30% alpha. */
const ATLAS_AI_GLOW_GRADIENT =
  "linear-gradient(90deg, rgba(255, 255, 255, 0.3) 0.9%, rgba(226, 46, 51, 0.3) 15.77%, rgba(171, 72, 218, 0.3) 50.45%, rgba(64, 105, 254, 0.3) 84.28%, rgba(255, 255, 255, 0.3) 100%)";

/** AI Stroke — 1px gradient top/bottom accent on the chat card.
 *  transparent → red/40 → purple/50 → indigo/50 → transparent. */
const ATLAS_AI_STROKE_GRADIENT =
  "linear-gradient(90deg, rgba(226, 226, 229, 0) 0%, rgb(190, 12, 30) 15%, rgb(171, 72, 218) 50%, rgb(64, 105, 254) 85%, rgba(226, 226, 229, 0) 100%)";

/** Primitive tints used by AI-native chrome (Figma core palette — red/40,
 *  purple/50, indigo/50). Not in the Atlas Light semantic scale, so inlined
 *  here alongside the gradients that reference them. */
const ATLAS_AI_PRIMITIVE = {
  red40: "rgb(190, 12, 30)",
  purple50: "#ab48da",
  indigo50: "rgb(64, 105, 254)",
} as const;

/** Diligent agent mark (the red "D" used for AI agent avatars in the Components —
 *  Atlas Lens file). Approximated from the Diligent brand glyph: a rounded
 *  D-shape in status.error.default with a small white notch on the left. */
function DiligentAgentMark({ size = 20 }: { size?: number }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      aria-hidden
      role="img"
      sx={{
        width: size,
        height: size,
        display: "block",
        overflow: "visible",
      }}
    >
      <path
        d="M2 2 H11 C17.5228 2 22 7 22 12 C22 17 17.5228 22 11 22 H2 Z"
        fill={atlasSemanticColor.action.destructive.default}
      />
      <path
        d="M2 7 L9 12 L2 17 Z"
        fill={atlasSemanticColor.surface.default}
      />
    </Box>
  );
}

/** Date separator row — "┈┈ 11 August 2025 ┈┈". Used between day-boundaries
 *  in a chat thread. Per Components — Atlas Lens: a divider on each side with
 *  10px horizontal padding around a label/xs muted date label. */
function AtlasReferenceDateSeparator({ date }: { date: string }) {
  return (
    <Box
      data-atlas-component="AIContentAreaDateSeparator"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        width: "100%",
      }}
    >
      <Box sx={{ flex: "1 1 auto", height: "1px", background: atlasSemanticColor.outline.fixed }} />
      <TradAtlasText semanticFont={SF.textMicro} sx={{ color: atlasSemanticColor.type.muted }}>
        {date}
      </TradAtlasText>
      <Box sx={{ flex: "1 1 auto", height: "1px", background: atlasSemanticColor.outline.fixed }} />
    </Box>
  );
}

/** AI "Thinking" pill — compact loading indicator that renders under the agent
 *  timestamp while the assistant is reasoning. Surface/variant background,
 *  3-sparkle cluster (indigo / red / purple — the AI gradient primitives)
 *  followed by a label/sm-emphasis "Thinking" label. */
function AtlasReferenceThinkingPill({ label = "Thinking" }: { label?: string }) {
  return (
    <Box
      data-atlas-component="AIThinkingPill"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        height: 24,
        px: "10px",
        borderRadius: atlasSemanticRadius.full,
        background: atlasSemanticColor.surface.variant,
        color: atlasSemanticColor.type.default,
        width: "fit-content",
      }}
    >
      <Box sx={{ display: "inline-flex", alignItems: "center", gap: "1px" }}>
        <AutoAwesomeOutlinedIcon sx={{ fontSize: 12, color: ATLAS_AI_PRIMITIVE.purple50 }} />
        <AutoAwesomeOutlinedIcon sx={{ fontSize: 9, color: ATLAS_AI_PRIMITIVE.red40 }} />
        <AutoAwesomeOutlinedIcon sx={{ fontSize: 10, color: ATLAS_AI_PRIMITIVE.indigo50 }} />
      </Box>
      <TradAtlasText semanticFont={SF.textSmEmphasis} sx={{ color: "inherit" }}>
        {label}
      </TradAtlasText>
    </Box>
  );
}

/** Citation chip array — small numbered pill chips on surface/variant, with an
 *  optional "N+" overflow chip. Mirrors the chips shown on an AI response body
 *  in the Components — Atlas Lens reference screens. */
function AtlasReferenceCitationRow({
  count,
  overflow = 0,
}: {
  count: number;
  overflow?: number;
}) {
  const items: string[] = Array.from({ length: count }).map((_, i) => String(i + 1));
  if (overflow > 0) items.push(`${overflow}+`);
  return (
    <Box
      data-atlas-component="AICitationRow"
      sx={{ display: "flex", flexWrap: "wrap", gap: "4px", mt: "4px" }}
    >
      {items.map((label, idx) => (
        <Box
          key={`atlas-citation-${idx}`}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 20,
            height: 20,
            px: "6px",
            borderRadius: atlasSemanticRadius.sm,
            background: atlasSemanticColor.surface.variant,
            color: atlasSemanticColor.type.default,
            ...semanticFontStyle(SF.textXs),
          }}
        >
          {label}
        </Box>
      ))}
    </Box>
  );
}

/** Sources / Searching row — labelled strip of domain chips. Each chip has a
 *  leading icon (description for Sources, search for Searching), a domain
 *  label in text/md, and a pill outline at radius.md. The overflow "+ N" chip
 *  follows the same outline treatment without a leading icon. */
function AtlasReferenceDomainChipRow({
  label,
  kind,
  domains,
  overflow = 0,
}: {
  label: string;
  kind: "sources" | "searching";
  domains: string[];
  overflow?: number;
}) {
  const LeadingIcon = kind === "sources" ? DescriptionOutlinedIcon : SearchOutlinedIcon;
  return (
    <Box
      data-atlas-component="AIContentAreaDomainChipRow"
      data-atlas-variant={kind}
      sx={{ display: "flex", flexDirection: "column", gap: "6px" }}
    >
      <TradAtlasText semanticFont={SF.textSm} sx={{ color: atlasSemanticColor.type.muted }}>
        {label}
      </TradAtlasText>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {domains.map((domain) => (
          <Box
            key={`${kind}-${domain}`}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              height: 28,
              px: "10px",
              borderRadius: atlasSemanticRadius.md,
              border: `1px solid ${atlasSemanticColor.outline.fixed}`,
              background: atlasSemanticColor.surface.default,
              color: atlasSemanticColor.type.default,
            }}
          >
            <LeadingIcon sx={{ fontSize: 14, color: atlasSemanticColor.type.muted }} />
            <TradAtlasText semanticFont={SF.textSm} sx={{ color: "inherit" }}>
              {domain}
            </TradAtlasText>
          </Box>
        ))}
        {overflow > 0 ? (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              height: 28,
              px: "10px",
              borderRadius: atlasSemanticRadius.md,
              border: `1px solid ${atlasSemanticColor.outline.fixed}`,
              background: atlasSemanticColor.surface.default,
              color: atlasSemanticColor.type.muted,
            }}
          >
            <Box component="span" aria-hidden sx={{ fontSize: 14, lineHeight: 1 }}>
              +
            </Box>
            <TradAtlasText semanticFont={SF.textSm} sx={{ color: "inherit" }}>
              {overflow}
            </TradAtlasText>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}

/** Canonical Atlas AI chatbox — `AI chatbox` component from Components — Atlas
 *  Lens (frame 44787:3280, "State=Default" symbol 44893:3346).
 *
 *  Structure (top → bottom, 24px gap):
 *    1. Card (surface/default, 1px outline/default, radius.lg) with
 *       - "AI glow" blurred gradient positioned above the top edge
 *       - "AI Stroke" 1px gradient pinned to the card's top edge
 *       - Input row (pill, 24px horizontal padding, text/body placeholder)
 *       - Footer button array (attach / Tools / mic / send)
 *    2. "Chip array" of quick-action pill chips with highlighted leading icons
 *    3. "AI-generated content may have inaccuracies. Learn more." disclaimer
 *
 *  Density note: the compact rail variant collapses the footer to attach-only
 *  + send (no Tools dropdown, no mic), and hides quick actions + disclaimer —
 *  matching the mobile/rail state documented in the Atlas Lens file. */
function AtlasReferenceChatPrompt({ density }: { density: "relaxed" | "compact" }) {
  const isCompact = density === "compact";
  const quickActions: {
    label: string;
    icon: React.ReactNode;
  }[] = [
    { label: "Help write prompt", icon: <SearchOutlinedIcon sx={{ fontSize: 16 }} /> },
    { label: "Summarize article", icon: <DescriptionOutlinedIcon sx={{ fontSize: 16 }} /> },
    { label: "Analyze data", icon: <AssessmentOutlinedIcon sx={{ fontSize: 16 }} /> },
    {
      label: "Show more",
      icon: (
        <Box
          component="span"
          aria-hidden
          sx={{ fontSize: 18, fontWeight: 400, lineHeight: 1, color: "inherit" }}
        >
          +
        </Box>
      ),
    },
  ];
  return (
    <Box
      data-atlas-component="AIChatbox"
      data-atlas-variant={
        isCompact ? "state=default, density=compact" : "state=default, density=relaxed"
      }
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        pt: "28px",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          background: atlasSemanticColor.surface.default,
          border: `1px solid ${atlasSemanticColor.outline.default}`,
          borderRadius: atlasSemanticRadius.lg,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            left: "24px",
            right: "24px",
            top: "-18px",
            height: "66px",
            backgroundImage: ATLAS_AI_GLOW_GRADIENT,
            filter: "blur(40px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            left: "75px",
            right: "75px",
            top: "-1px",
            height: "1px",
            backgroundImage: ATLAS_AI_STROKE_GRADIENT,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            pt: "16px",
          }}
        >
          <Box sx={{ px: "24px" }}>
            <TradAtlasText
              semanticFont={SF.textLg}
              sx={{
                color: atlasSemanticColor.type.muted,
                lineHeight: "24px",
              }}
            >
              Placeholder text or suggestion for prompt
            </TradAtlasText>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              pb: "16px",
              px: "16px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
              <Box
                component="span"
                aria-label="Attach file"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: "8px",
                  borderRadius: atlasSemanticRadius.lg,
                  color: atlasSemanticColor.action.secondary.onSecondary,
                }}
              >
                <AttachFileIcon sx={{ fontSize: 24 }} />
              </Box>
              {!isCompact ? (
                <Box
                  component="span"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    px: "12px",
                    py: "8px",
                    borderRadius: atlasSemanticRadius.lg,
                    color: atlasSemanticColor.action.secondary.onSecondary,
                  }}
                >
                  <TuneIcon sx={{ fontSize: 24 }} />
                  <TradAtlasText
                    semanticFont={SF.textLgEmphasis}
                    sx={{ color: "inherit", lineHeight: "24px" }}
                  >
                    Tools
                  </TradAtlasText>
                  <ExpandMoreIcon sx={{ fontSize: 24 }} />
                </Box>
              ) : null}
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
              {!isCompact ? (
                <Box
                  component="span"
                  aria-label="Voice input"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: "8px",
                    borderRadius: atlasSemanticRadius["2xl"],
                    color: atlasSemanticColor.action.secondary.onSecondary,
                  }}
                >
                  <MicIcon sx={{ fontSize: 24 }} />
                </Box>
              ) : null}
              <Box
                component="span"
                aria-label="Send message"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: "8px",
                  borderRadius: atlasSemanticRadius.lg,
                  border: `1px solid ${atlasSemanticColor.action.secondary.disabledOutline}`,
                  color: atlasSemanticColor.action.secondary.onSecondaryDisabled,
                }}
              >
                <ArrowUpwardIcon sx={{ fontSize: 24 }} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      {!isCompact ? (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "8px",
            width: "100%",
          }}
        >
          {quickActions.map((action) => (
            <Box
              key={action.label}
              component="button"
              type="button"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                height: "36px",
                pl: "8px",
                pr: "16px",
                border: `1px solid ${atlasSemanticColor.outline.default}`,
                borderRadius: atlasSemanticRadius.full,
                background: atlasSemanticColor.surface.default,
                color: atlasSemanticColor.action.secondary.onSecondary,
                cursor: "pointer",
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 24,
                  height: 24,
                  background: atlasSemanticColor.status.error.background,
                  color: atlasSemanticColor.action.destructive.default,
                }}
              >
                {action.icon}
              </Box>
              <Box sx={{ display: "inline-flex", alignItems: "center", height: "36px", px: "8px" }}>
                <TradAtlasText semanticFont={SF.textLg} sx={{ color: "inherit", lineHeight: "24px" }}>
                  {action.label}
                </TradAtlasText>
              </Box>
            </Box>
          ))}
        </Box>
      ) : null}
      {!isCompact ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
          }}
        >
          <TradAtlasText semanticFont={SF.textMicro} sx={{ color: atlasSemanticColor.type.muted }}>
            AI-generated content may have inaccuracies.
          </TradAtlasText>
          <TradAtlasText
            semanticFont={SF.textMicroEmphasis}
            sx={{
              color: atlasSemanticColor.action.link.default,
              textDecoration: "underline",
              textDecorationSkipInk: "none",
            }}
          >
            Learn more.
          </TradAtlasText>
        </Box>
      ) : null}
    </Box>
  );
}

/** Atlas reference — AI content area user prompt (user message bubble).
 *  Per Figma node 44063:5755 (Building blocks / 🧩 AI content area prompt):
 *    • surface/default (white) fill, no border
 *    • Asymmetric radii — tl/bl/br = radius.lg (12px), tr = radius.sm (4px)
 *    • Elevation: `0 0 2px rgba(0,0,0,.1), 0 8px 16px rgba(0,0,0,.1)`
 *    • 20px horizontal / 12px vertical padding, max-width 600px, right-aligned
 *    • Text at text/body (SF.textLg, 16px/24px) in type/default */
function AtlasReferenceUserBubble({ text }: { text: string }) {
  return (
    <Box
      data-atlas-component="AIContentAreaPrompt"
      data-atlas-variant="desktop"
      sx={{
        maxWidth: 600,
        background: atlasSemanticColor.surface.default,
        borderTopLeftRadius: atlasSemanticRadius.lg,
        borderTopRightRadius: atlasSemanticRadius.sm,
        borderBottomLeftRadius: atlasSemanticRadius.lg,
        borderBottomRightRadius: atlasSemanticRadius.lg,
        boxShadow:
          "0 0 2px rgba(0, 0, 0, 0.08), 0 4px 10px rgba(0, 0, 0, 0.06)",
        px: "20px",
        py: "12px",
      }}
    >
      <TradAtlasText
        semanticFont={SF.textLg}
        sx={{ color: atlasSemanticColor.type.default, whiteSpace: "pre-wrap" }}
      >
        {text}
      </TradAtlasText>
    </Box>
  );
}

/** Atlas reference — agent header row. Per Components — Atlas Lens screens:
 *  20×20 Diligent "D" brand mark → name (label/sm emphasis) stacked over time
 *  (label/xs muted). The inline "Thinking" pill that used to live here has
 *  been split into `AtlasReferenceThinkingPill` so it can render as its own
 *  row directly under the timestamp (as in the reference thread). */
function AtlasReferenceAgentHeader({
  name = "Diligent Agentforce",
  time = "03:14 PM",
}: {
  name?: string;
  time?: string;
}) {
  return (
    <Box
      data-atlas-component="AIAgentHeader"
      sx={{ display: "flex", alignItems: "center", gap: "12px" }}
    >
      <DiligentAgentMark size={20} />
      <Box sx={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <TradAtlasText semanticFont={SF.textSmEmphasis} sx={{ color: atlasSemanticColor.type.default }}>
          {name}
        </TradAtlasText>
        <TradAtlasText semanticFont={SF.textMicro} sx={{ color: atlasSemanticColor.type.muted }}>
          {time}
        </TradAtlasText>
      </Box>
    </Box>
  );
}

/** Atlas reference — agent response text item (AI content area / Text item).
 *  Per Figma 44063:5755 and the Components — Atlas Lens reference screens:
 *    • Optional headline in title/h3-lg emphasis (22px/28px, 600) type/default
 *    • "Explanation/description" sub-label in label/sm emphasis (12px, 600) muted
 *    • Body copy in text/md (14px/20px, 400) type/default — not text/lg
 *    • Optional citation row (see `AtlasReferenceCitationRow`) with an "N+"
 *      overflow chip when there are more citations than fit inline */
function AtlasReferenceAgentResponse({
  headline,
  description,
  html,
  citations,
  citationOverflow = 0,
}: {
  headline?: string;
  description?: string;
  html: string;
  citations?: number;
  citationOverflow?: number;
}) {
  return (
    <Box
      data-atlas-component="AIContentAreaAgentResponse"
      data-atlas-variant="desktop"
      sx={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}
    >
      {headline ? (
        <TradAtlasText
          semanticFont={SF.titleH3Emphasis}
          sx={{ color: atlasSemanticColor.type.default }}
        >
          {headline}
        </TradAtlasText>
      ) : null}
      {description ? (
        <TradAtlasText
          semanticFont={SF.textSmEmphasis}
          sx={{ color: atlasSemanticColor.type.muted, textTransform: "none" }}
        >
          {description}
        </TradAtlasText>
      ) : null}
      <Box
        sx={{
          ...semanticFontStyle(SF.textMd),
          color: atlasSemanticColor.type.default,
          "& strong": { fontWeight: 600 },
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {citations && citations > 0 ? (
        <AtlasReferenceCitationRow count={citations} overflow={citationOverflow} />
      ) : null}
    </Box>
  );
}

/** Atlas reference — reasoning module.
 *  Per the Components — Atlas Lens reference screens (AI content area):
 *    • Header row: "Reasoning (N steps)" in text/md emphasis muted, with a
 *      24×24 expand-down chevron (▼ collapsed / ▲ when the module is open).
 *    • Optional intro paragraph (text/md muted) under the header to summarise
 *      the plan — appears once the module is open.
 *    • Each step is its **own** collapsible row (not a single global toggle):
 *        - 20×20 leading status icon
 *            done    → CheckCircleOutline in type/muted (outlined, not filled)
 *            active  → AutoAwesome sparkle tinted purple/50 (#ab48da)
 *            pending → 4px dot bullet in type/muted
 *        - Title in **text/body regular** (SF.textLg, 400) — not emphasised
 *        - 20×20 trailing chevron toggle: ▼ when collapsed, ▲ when expanded;
 *          pending steps have no trailing chevron (can't be expanded).
 *      Expanded step body renders below the row in text/md muted, indented
 *      under the title copy.
 *    • The global module is *flat* — no left-border accent or filled surface;
 *      individual steps just flow with 12px vertical rhythm. */
function AtlasReferenceThinkingPanel({
  open,
  steps,
  intro,
  expandedStepIndex,
}: {
  open: boolean;
  steps: { title: string; body: string; status: "done" | "active" | "pending" }[];
  intro?: string;
  expandedStepIndex?: number;
}) {
  return (
    <Box
      data-atlas-component="AIContentAreaReasoning"
      data-atlas-variant={open ? "expanded" : "collapsed"}
      sx={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <TradAtlasText
          semanticFont={SF.textMdEmphasis}
          sx={{ color: atlasSemanticColor.type.muted }}
        >
          Reasoning ({steps.length} steps)
        </TradAtlasText>
        <Box
          aria-label={open ? "Collapse reasoning" : "Expand reasoning"}
          sx={{
            width: 24,
            height: 24,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: atlasSemanticColor.type.muted,
          }}
        >
          <ExpandMoreIcon
            sx={{
              fontSize: 20,
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 120ms ease",
            }}
          />
        </Box>
      </Box>
      {open ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {intro ? (
            <TradAtlasText
              semanticFont={SF.textMd}
              sx={{ color: atlasSemanticColor.type.muted }}
            >
              {intro}
            </TradAtlasText>
          ) : null}
          {steps.map((step, idx) => {
            const stepOpen = expandedStepIndex === idx;
            const canExpand = step.status !== "pending";
            return (
              <Box
                key={`atlas-step-${idx}`}
                sx={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {step.status === "done" ? (
                        <CheckCircleOutlineIcon
                          sx={{ fontSize: 20, color: atlasSemanticColor.type.muted }}
                        />
                      ) : step.status === "active" ? (
                        <AutoAwesomeOutlinedIcon
                          sx={{ fontSize: 18, color: ATLAS_AI_PRIMITIVE.purple50 }}
                        />
                      ) : (
                        <Box
                          aria-hidden
                          sx={{
                            width: 4,
                            height: 4,
                            borderRadius: "50%",
                            background: atlasSemanticColor.type.muted,
                          }}
                        />
                      )}
                    </Box>
                    <TradAtlasText
                      semanticFont={SF.textLg}
                      sx={{ color: atlasSemanticColor.type.default }}
                    >
                      {step.title}
                    </TradAtlasText>
                  </Box>
                  {canExpand ? (
                    <Box
                      aria-label={stepOpen ? "Collapse step" : "Expand step"}
                      sx={{
                        width: 20,
                        height: 20,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: atlasSemanticColor.type.muted,
                      }}
                    >
                      <ExpandMoreIcon
                        sx={{
                          fontSize: 18,
                          transform: stepOpen ? "rotate(180deg)" : "none",
                          transition: "transform 120ms ease",
                        }}
                      />
                    </Box>
                  ) : null}
                </Box>
                {stepOpen && step.body ? (
                  <TradAtlasText
                    semanticFont={SF.textMd}
                    sx={{ color: atlasSemanticColor.type.muted, pl: "30px" }}
                  >
                    {step.body}
                  </TradAtlasText>
                ) : null}
              </Box>
            );
          })}
        </Box>
      ) : null}
    </Box>
  );
}

/** Atlas reference — feedback footer (top divider + Regenerate / Share /
 *  Export tertiary buttons on the left, thumbs-up / thumbs-down / copy
 *  icon-only tertiaries on the right). This is the *secondary* footer
 *  variation in the AI content area; the primary screens instead surface
 *  Sources + Searching rows (see `AtlasReferenceDomainChipRow`). */
function AtlasReferenceAgentFeedbackFooter() {
  return (
    <Box
      data-atlas-component="AIContentAreaAgentFeedbackFooter"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        pt: "12px",
        borderTop: `1px solid ${atlasSemanticColor.outline.fixed}`,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {[
          { label: "Regenerate", icon: <ReplayIcon sx={{ fontSize: 20 }} /> },
          { label: "Share", icon: <ShareOutlinedIcon sx={{ fontSize: 20 }} /> },
          { label: "Export", icon: <DescriptionOutlinedIcon sx={{ fontSize: 20 }} /> },
        ].map((action) => (
          <Box
            key={action.label}
            component="button"
            type="button"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              px: "8px",
              py: "6px",
              borderRadius: atlasSemanticRadius.lg,
              background: "transparent",
              color: atlasSemanticColor.action.secondary.onSecondary,
              cursor: "pointer",
            }}
          >
            {action.icon}
            <TradAtlasText semanticFont={SF.textMdEmphasis} sx={{ color: "inherit" }}>
              {action.label}
            </TradAtlasText>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {[
          { label: "Helpful", icon: <ThumbUpOutlinedIcon sx={{ fontSize: 20 }} /> },
          { label: "Not helpful", icon: <ThumbDownOutlinedIcon sx={{ fontSize: 20 }} /> },
          { label: "Copy", icon: <ContentCopyIcon sx={{ fontSize: 20 }} /> },
        ].map((action) => (
          <Box
            key={action.label}
            component="button"
            type="button"
            aria-label={action.label}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: atlasSemanticRadius.lg,
              background: "transparent",
              color: atlasSemanticColor.action.secondary.onSecondary,
              cursor: "pointer",
            }}
          >
            {action.icon}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/** Atlas reference — user prompt row. Right-aligned composition of:
 *    • timestamp (label/xs muted) above the bubble
 *    • bubble (see `AtlasReferenceUserBubble`)
 *    • circular initials avatar (32px) on the far right
 *  Mirrors the user-message arrangement in the AI content area reference. */
function AtlasReferenceUserMessageRow({
  text,
  time,
  initials,
  avatarColor = "#6a2eb8",
}: {
  text: string;
  time: string;
  initials: string;
  avatarColor?: string;
}) {
  return (
    <Box
      data-atlas-component="AIContentAreaUserMessage"
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        gap: "12px",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "4px",
          maxWidth: 600,
        }}
      >
        <TradAtlasText semanticFont={SF.textMicro} sx={{ color: atlasSemanticColor.type.muted }}>
          {time}
        </TradAtlasText>
        <AtlasReferenceUserBubble text={text} />
      </Box>
      <Box
        aria-hidden
        sx={{
          flexShrink: 0,
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: avatarColor,
          color: "#ffffff",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          ...semanticFontStyle(SF.textSmEmphasis),
          letterSpacing: 0,
        }}
      >
        {initials}
      </Box>
    </Box>
  );
}

const AI_THINKING_STEPS: { title: string; body: string; status: "done" | "active" | "pending" }[] = [
  {
    title: "Gather filing context",
    body: "Pull the jurisdiction rules, open deadlines, and prior correspondence.",
    status: "done",
  },
  {
    title: "Identify required signers",
    body: "Cross-check directors on file against the resolution quorum.",
    status: "active",
  },
  {
    title: "Draft stakeholder brief",
    body: "Summarize action, risk, and next steps for the audit committee.",
    status: "pending",
  },
];

const AI_COMPONENT_ROWS: {
  key: string;
  variant: string;
  delta: string;
  atlas: React.ReactNode;
  modified: React.ReactNode;
}[] = [
  {
    key: "chat-prompt-relaxed",
    variant: "AI chatbox — relaxed (Components — Atlas Lens, AI chatbox / State=Default)",
    delta:
      "Figma Atlas (Components — Atlas Lens, node 44787:3280): 1px outline/default border at 12px radius, 16px top padding, pill input row with 24px horizontal padding, footer button array (attach 12px radius + Tools pill + mic at 36px radius + send in an outline 12px radius button). A 40px-blurred horizontal gradient halo (white → red/50 → purple/50 → indigo/50 → white @ 30% alpha) floats 18px above the top edge, and a 1px top-edge AI Stroke gradient accents the card. Below the card: a Chip array of quick actions (Help write prompt / Summarize article / Analyze data / Show more) and the &ldquo;AI-generated content may have inaccuracies. Learn more.&rdquo; disclaimer. Modified: no halo, no top stroke, no quick actions, no disclaimer — the card uses a flat rgba(36,38,40,0.07) double shadow and a 12px-radius send button ghost; toolbar parity.",
    atlas: (
      <Box sx={{ width: "100%", maxWidth: 760, mx: "auto" }}>
        <AtlasReferenceChatPrompt density="relaxed" />
      </Box>
    ),
    modified: (
      <Box sx={{ width: "100%", maxWidth: 640, mx: "auto" }}>
        <ChatPromptComponent
          value=""
          onChange={() => {}}
          onSend={() => {}}
          density="relaxed"
          fullWidth
        />
      </Box>
    ),
  },
  {
    key: "chat-prompt-compact",
    variant: "AI chatbox — compact (workspace rail)",
    delta:
      "Figma Atlas: the AI glow halo and top AI Stroke still apply in the rail layout; footer collapses to attach + send only (no Tools dropdown, no mic). Quick-action chips and the disclaimer are hidden in the compact composition. Modified: halo / stroke / disclaimer removed; flat shadow retained; toolbar parity.",
    atlas: (
      <Box sx={{ width: "100%", maxWidth: 420, mx: "auto" }}>
        <AtlasReferenceChatPrompt density="compact" />
      </Box>
    ),
    modified: (
      <Box sx={{ width: "100%", maxWidth: 360, mx: "auto", py: "20px" }}>
        <ChatPromptComponent
          value=""
          onChange={() => {}}
          onSend={() => {}}
          density="compact"
          fullWidth
        />
      </Box>
    ),
  },
  {
    key: "date-separator",
    variant: "Date separator",
    delta:
      "Figma Atlas: centered date in label/xs muted, flanked by 1px outline/fixed dividers with 10px horizontal padding. Used at day-boundaries in the AI content area thread. Modified: not implemented — the chat thread has no day boundary affordance today.",
    atlas: (
      <Box sx={{ width: "100%", maxWidth: 720 }}>
        <AtlasReferenceDateSeparator date="11 August 2025" />
      </Box>
    ),
    modified: (
      <TradAtlasText semanticFont={SF.textSm} sx={{ color: atlasSemanticColor.type.muted }}>
        (Not implemented in modified components.)
      </TradAtlasText>
    ),
  },
  {
    key: "user-prompt-bubble",
    variant: "User prompt record (AI content area / user message row)",
    delta:
      "Figma Atlas (node 44063:5755 — AI content area prompt): the full user message row is timestamp (label/xs muted, right-aligned) above the bubble, with a 32px circular initials avatar trailing on the right. The bubble itself is surface/default (white) fill, no border, asymmetric radii (top-left / bottom-left / bottom-right = radius.lg 12px; top-right = radius.sm 4px — the inbound chat tail), a subtle 0/0/2px + 0/4/10px elevation at rgba(0,0,0,.06–.08), 20×12 padding, max-width 600, body text at text/body (SF.textLg) in type/default. Modified: bubble uses surface/subtle fill with a 1px outline/static border, symmetric radius.md (8px), no elevation, no timestamp or avatar chrome — flattened for density.",
    atlas: (
      <Box sx={{ width: "100%" }}>
        <AtlasReferenceUserMessageRow
          text="Hmm, I&rsquo;m not sure. The odds are insanely low, and this might be against company policy."
          time="03:14 PM"
          initials="B"
        />
      </Box>
    ),
    modified: (
      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
        <MessageBubble messageRole="prompt" density="relaxed">
          Hmm, I&rsquo;m not sure. The odds are insanely low, and this might be against company policy.
        </MessageBubble>
      </Box>
    ),
  },
  {
    key: "thinking-pill",
    variant: "Thinking pill (loading indicator)",
    delta:
      "Figma Atlas: compact pill (surface/variant fill, radius.full) showing a 3-sparkle cluster — purple/50, red/40, indigo/50 — followed by &ldquo;Thinking&rdquo; in label/sm emphasis. Surfaces directly under the agent timestamp while the assistant is reasoning (not inside the agent header). Modified: the thinking state is represented by the `isThinking` prop on the Reasoning panel header copy only — no separate pill.",
    atlas: (
      <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <TradAtlasText semanticFont={SF.textMicro} sx={{ color: atlasSemanticColor.type.muted }}>
          03:14 PM
        </TradAtlasText>
        <AtlasReferenceThinkingPill />
      </Box>
    ),
    modified: (
      <TradAtlasText semanticFont={SF.textSm} sx={{ color: atlasSemanticColor.type.muted }}>
        (Not implemented in modified components.)
      </TradAtlasText>
    ),
  },
  {
    key: "agent-response",
    variant: "Agent response (AI content area / Text item)",
    delta:
      "Figma Atlas (Components — Atlas Lens, AI content area): 20×20 Diligent &ldquo;D&rdquo; mark + name (label/sm 600) over time (label/xs 400) agent header precedes the body. The text item itself is headline (title/h3-lg 600) → &ldquo;Explanation/description&rdquo; sub-label (label/sm 600 muted) → body at **text/md** (14px/20px, not text/lg) in type/default, followed by a citation chip row (20-tall pills on surface/variant, with an &ldquo;N+&rdquo; overflow chip when there are more than fit). Modified: no agent header, no headline / sub-label, no citations — body copy is lifted to SF.textLg (16px) directly on the canvas.",
    atlas: (
      <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
        <AtlasReferenceAgentHeader />
        <AtlasReferenceAgentResponse
          headline="New Regulatory Change Alert – Czech GDPR Push Consent Required"
          description="Explanation/description"
          citations={4}
          citationOverflow={5}
          html={
            "First, I need to analyze the EU AI Act Article 27 requirements and map them against our current AI inventory to understand scope and impact. I&rsquo;ll identify which high-risk AI systems are in scope &mdash; our credit scoring, HR screening, and fraud detection systems definitely qualify based on their decision-making authority and individual impact. Next, I should determine the right stakeholders for this workspace: the CLO for legal oversight, DPO for AI risk assessment expertise, <strong>Compliance Manager</strong> for multi-jurisdictional coordination, and Risk Manager for control implementation."
          }
        />
      </Box>
    ),
    modified: (
      <ChatAssistantResponse
        density="relaxed"
        htmlContent={
          "First, I need to analyze the EU AI Act Article 27 requirements and map them against our current AI inventory to understand scope and impact. I&rsquo;ll identify which high-risk AI systems are in scope &mdash; our credit scoring, HR screening, and fraud detection systems definitely qualify based on their decision-making authority and individual impact. Next, I should determine the right stakeholders for this workspace: the CLO for legal oversight, DPO for AI risk assessment expertise, <strong>Compliance Manager</strong> for multi-jurisdictional coordination, and Risk Manager for control implementation."
        }
      />
    ),
  },
  {
    key: "agent-sources",
    variant: "Sources / Searching chip rows",
    delta:
      "Figma Atlas: below the agent response, two labelled chip strips — &ldquo;Sources&rdquo; (description-icon chips linking to cited domains) and &ldquo;Searching&rdquo; (search-icon chips showing live retrieval). Chips are 28px pills with a 1px outline/fixed border, 10px horizontal padding, text/sm copy, and a muted leading icon; a trailing &ldquo;+ N&rdquo; overflow chip uses the same outline. Modified: not implemented — the response body has no citations, sources, or retrieval affordance today.",
    atlas: (
      <Box sx={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
        <AtlasReferenceDomainChipRow
          label="Sources"
          kind="sources"
          domains={["openpaymentsdata.cms.gov", "openpaymentsdata.cms.gov"]}
          overflow={1}
        />
        <AtlasReferenceDomainChipRow
          label="Searching"
          kind="searching"
          domains={["openpaymentsdata.cms.gov", "openpaymentsdata.cms.gov"]}
        />
      </Box>
    ),
    modified: (
      <TradAtlasText semanticFont={SF.textSm} sx={{ color: atlasSemanticColor.type.muted }}>
        (Not implemented in modified components.)
      </TradAtlasText>
    ),
  },
  {
    key: "agent-feedback-footer",
    variant: "Agent response — feedback footer",
    delta:
      "Figma Atlas: optional footer below the agent response — top divider then tertiary buttons (Regenerate / Share / Export with 20px leading icon + label) on the left, and 32×32 icon-only tertiaries (thumbs-up / thumbs-down / copy) on the right. Modified: not implemented — no feedback affordances render alongside the assistant response today.",
    atlas: (
      <Box sx={{ width: "100%" }}>
        <AtlasReferenceAgentFeedbackFooter />
      </Box>
    ),
    modified: (
      <TradAtlasText semanticFont={SF.textSm} sx={{ color: atlasSemanticColor.type.muted }}>
        (Not implemented in modified components.)
      </TradAtlasText>
    ),
  },
  {
    key: "thinking-module-collapsed",
    variant: "Reasoning module — collapsed",
    delta:
      "Figma Atlas: header reads &ldquo;Reasoning (N steps)&rdquo; in text/md emphasis muted with a 24×24 expand-down chevron (▼) on the right — no surface card, no &ldquo;Thought for Ns&rdquo; summary. Modified: renamed to &ldquo;Thought for Ns&rdquo; with an inline chevron that rotates to 90° when expanded.",
    atlas: <AtlasReferenceThinkingPanel open={false} steps={AI_THINKING_STEPS} />,
    modified: (
      <ThinkingPanelComponent
        steps={AI_THINKING_STEPS.map((s) => ({ title: s.title, body: s.body }))}
        isThinking={false}
        activeStep={AI_THINKING_STEPS.length}
        open={false}
        onToggle={() => {}}
        density="relaxed"
      />
    ),
  },
  {
    key: "thinking-module-expanded",
    variant: "Reasoning module — expanded",
    delta:
      "Figma Atlas: **flat composition** — no filled surface, no left-border accent. Optional intro paragraph (text/md muted) under the header, then a step list with 12px vertical rhythm. Step glyphs: done → CheckCircleOutline in type/muted (outlined, not the filled status.success glyph), active → AutoAwesome sparkle tinted purple/50 (#ab48da), pending → 4px muted dot bullet. Titles render at **text/body regular** (SF.textLg, 400) — not emphasised. Each non-pending step gets its own 20×20 ExpandMore toggle on the right (▼ collapsed / ▲ expanded); only the expanded step shows its body in text/md muted indented 30px. Modified: surface/subtle filled panel at radius.lg with 14px padding, titles rendered at SF.textSmEmphasis with strike-through on done; active step uses a ringed ArrowForward glyph tinted action/link; there's a single global open state — every step's body is always visible once open.",
    atlas: (
      <AtlasReferenceThinkingPanel
        open
        steps={AI_THINKING_STEPS}
        intro="This is what I will do: analyze the EU AI Act Article 27 requirements, cross-check our AI inventory, and draft a stakeholder brief for the committee."
        expandedStepIndex={1}
      />
    ),
    modified: (
      <ThinkingPanelComponent
        steps={AI_THINKING_STEPS.map((s) => ({ title: s.title, body: s.body }))}
        isThinking
        activeStep={1}
        open
        onToggle={() => {}}
        density="relaxed"
      />
    ),
  },
];

function SystemPageToc() {
  const { color } = useTokens();
  return (
    <Stack component="nav" aria-label="On this page" spacing="2px" sx={{ width: "100%" }}>
      <TradAtlasText semanticFont={SF.textSmEmphasis} sx={{ mb: "4px", color: color.type.muted }}>
        On this page
      </TradAtlasText>
      {SYSTEM_PAGE_TOC.map((item) => (
        <Link
          key={item.id}
          href={`#${item.id}`}
          underline="none"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
            window.history.replaceState(null, "", `#${item.id}`);
          }}
          sx={{
            display: "block",
            py: "6px",
            px: "10px",
            borderRadius: "6px",
            ...semanticFontStyle(SF.textSm),
            color: color.type.muted,
            transition: "background-color 0.15s, color 0.15s",
            "&:hover": {
              backgroundColor: color.surface.subtle,
              color: color.type.default,
            },
          }}
        >
          {item.label}
        </Link>
      ))}
    </Stack>
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

  const { color } = useTokens();

  return (
    <Box sx={{ py: "32px", px: "24px", maxWidth: 1680, mx: "auto" }}>
      <TradAtlasText component="h1" semanticFont={SF.titleH4Emphasis} sx={{ mb: "8px" }}>
        Design system reference
      </TradAtlasText>
      <TradAtlasText semanticFont={SF.textMd} sx={{ color: "text.secondary", mb: "24px" }}>
        Colors resolved from the <strong>Atlas Light</strong> theme. Radii from{" "}
        <strong>Trad Atlas</strong> (2 / 4 / 6 / 8 px). Focus variants omitted.
      </TradAtlasText>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: "20px", md: "32px" },
          alignItems: "flex-start",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: 212 },
            flexShrink: 0,
            position: { md: "sticky" },
            top: { md: 24 },
            alignSelf: { md: "flex-start" },
            pb: { xs: "16px", md: 0 },
            borderBottom: { xs: "1px solid", md: "none" },
            borderColor: "divider",
          }}
        >
          <SystemPageToc />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* ── Token reference ── */}
          <Box
            component="section"
            id="system-design-tokens"
            sx={{ scrollMarginTop: SYSTEM_PAGE_SCROLL_MARGIN, mb: "40px" }}
          >
            <TradAtlasText semanticFont={SF.titleH5Emphasis} sx={{ mb: "12px" }}>
              Atlas Light design tokens
            </TradAtlasText>

            <Stack spacing="24px">
        {TOKEN_SECTIONS.map((section) => (
          <Box key={section.heading}>
            <TradAtlasText semanticFont={SF.textSmEmphasis} sx={{ mb: "4px" }}>
              {section.heading}
            </TradAtlasText>
            <TableContainer component={Paper} elevation={0} sx={SYSTEM_DOC_TABLE_CONTAINER_SX}>
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
          </Box>

          <Divider sx={{ mb: "32px" }} />

          {/* ── Table: command center vs native MUI (Atlas Light) ── */}
          <Box
            component="section"
            id="system-table"
            sx={{ scrollMarginTop: SYSTEM_PAGE_SCROLL_MARGIN, mb: "32px" }}
          >
            <TradAtlasText semanticFont={SF.titleH5Emphasis} sx={{ mb: "12px" }}>
              Table
            </TradAtlasText>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: "24px",
                alignItems: "start",
              }}
            >
        <Box>
          <TradAtlasText semanticFont={SF.textSmEmphasis} sx={{ mb: "8px", display: "block" }}>
            Command centers
          </TradAtlasText>
          <CommandCenterTableSample />
        </Box>
        <Box>
          <TradAtlasText semanticFont={SF.textSmEmphasis} sx={{ mb: "8px", display: "block" }}>
            Native MUI Table (Atlas Light)
          </TradAtlasText>
          <AtlasLightMuiTableSample />
            </Box>
          </Box>
          </Box>

          <Divider sx={{ mb: "32px" }} />

          {/* ── Button component grid ── */}
          <Box
            component="section"
            id="system-button"
            sx={{ scrollMarginTop: SYSTEM_PAGE_SCROLL_MARGIN, mb: "32px" }}
          >
            <TradAtlasText semanticFont={SF.titleH5Emphasis} sx={{ mb: "4px" }}>
              Button
            </TradAtlasText>
            <TradAtlasText semanticFont={SF.textMd} sx={{ color: "text.secondary", mb: "12px" }}>
              Trad Atlas — Components. Border radii: XS 2px, S 4px, M 6px, L 8px.
            </TradAtlasText>

            <TableContainer component={Paper} elevation={0} sx={{ maxHeight: "70vh", ...SYSTEM_DOC_TABLE_CONTAINER_SX }}>
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
          </Box>

          <Divider sx={{ my: "32px" }} />

          {/* ── Chip component grid ── */}
          <Box
            component="section"
            id="system-chip"
            sx={{ scrollMarginTop: SYSTEM_PAGE_SCROLL_MARGIN, mb: "24px" }}
          >
            <TradAtlasText semanticFont={SF.titleH5Emphasis} sx={{ mb: "4px" }}>
              Chip
            </TradAtlasText>
            <TradAtlasText semanticFont={SF.textMd} sx={{ color: "text.secondary", mb: "12px" }}>
              Atlas chips are monochrome (Outline / Filled) with sizes, states, and a selected toggle.
              Radius: full pill (9999px). Font: Inter 400 12/16 tracking 0.3px.
            </TradAtlasText>

            <TableContainer component={Paper} elevation={0} sx={{ maxHeight: "50vh", mb: "8px", ...SYSTEM_DOC_TABLE_CONTAINER_SX }}>
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
          </Box>

          {/* ── Loading Indicator (Linear + Circular) — Atlas vs MUI default ── */}
          <Box
            component="section"
            id="system-progress"
            sx={{ scrollMarginTop: SYSTEM_PAGE_SCROLL_MARGIN, mb: "32px" }}
          >
            <TradAtlasText semanticFont={SF.titleH5Emphasis} sx={{ mb: "4px" }}>
              Loading indicator
            </TradAtlasText>
            <TradAtlasText semanticFont={SF.textMd} sx={{ color: "text.secondary", mb: "12px" }}>
              Atlas uses a <strong>Loading Indicator</strong> component (linear, circular, and AI variants).
              The closest MUI equivalents are <code>LinearProgress</code> and <code>CircularProgress</code>.
              The Atlas pattern differs significantly in geometry: a pill-shaped outlined track with internal
              padding, versus MUI's flat thin bar.
            </TradAtlasText>

            <TableContainer component={Paper} elevation={0} sx={{ mb: "8px", ...SYSTEM_DOC_TABLE_CONTAINER_SX }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, minWidth: 260 }}>Atlas Loading Indicator</TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: 260 }}>MUI default</TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: 220 }}>Variant</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Delta</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {LOADING_INDICATOR_DOC_ROWS.map((row) => {
                    const atlasCell =
                      row.key === "lin-det" ? (
                        <AtlasLinearDeterminate value={68} />
                      ) : row.key === "lin-indet" ? (
                        <AtlasLinearIndeterminate />
                      ) : (
                        <AtlasCircular size={32} />
                      );
                    const muiCell =
                      row.key === "lin-det" ? (
                        <MuiDefaultLinearDeterminate value={68} />
                      ) : row.key === "lin-indet" ? (
                        <MuiDefaultLinearIndeterminate />
                      ) : (
                        <MuiDefaultCircular />
                      );
                    return (
                      <TableRow key={row.key} hover>
                        <TableCell sx={{ py: "12px", verticalAlign: "middle" }}>{atlasCell}</TableCell>
                        <TableCell sx={{ py: "12px", verticalAlign: "middle" }}>{muiCell}</TableCell>
                        <TableCell>
                          <TradAtlasText semanticFont={SF.textSm} sx={{ fontFamily: atlasFontFamilyMono }}>
                            {row.variant}
                          </TradAtlasText>
                        </TableCell>
                        <TableCell>
                          <TradAtlasText semanticFont={SF.textSm} sx={{ fontFamily: atlasFontFamilyMono, color: "text.secondary" }}>
                            {row.attrs}
                          </TradAtlasText>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* ── Extended color chips — NOT in Atlas ── */}
          <Box
            component="section"
            id="system-extended-chips"
            sx={{ scrollMarginTop: SYSTEM_PAGE_SCROLL_MARGIN, mb: "32px" }}
          >
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

      <TableContainer component={Paper} elevation={0} sx={{ mb: "8px", ...SYSTEM_DOC_TABLE_CONTAINER_SX }}>
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
          </Box>

          <Divider sx={{ my: "32px" }} />

          {/* ── Status Indicator grid ── */}
          <Box
            component="section"
            id="system-status-indicator"
            sx={{ scrollMarginTop: SYSTEM_PAGE_SCROLL_MARGIN, mb: "24px" }}
          >
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

      <TableContainer component={Paper} elevation={0} sx={{ mb: "8px", ...SYSTEM_DOC_TABLE_CONTAINER_SX }}>
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
          </Box>

          {/* ── Extended status patterns ── */}
          <Box
            component="section"
            id="system-status-patterns"
            sx={{ scrollMarginTop: SYSTEM_PAGE_SCROLL_MARGIN, mb: "32px" }}
          >
            <TradAtlasText semanticFont={SF.textSmEmphasis} sx={{ mt: "24px", mb: "8px", display: "block" }}>
              Additional visual status patterns used in the app
            </TradAtlasText>

            <TableContainer component={Paper} elevation={0} sx={{ mb: "8px", ...SYSTEM_DOC_TABLE_CONTAINER_SX }}>
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
          </Box>

          <Divider sx={{ my: "32px" }} />

          {/* ── Badge grid ── */}
          <Box
            component="section"
            id="system-badge"
            sx={{ scrollMarginTop: SYSTEM_PAGE_SCROLL_MARGIN }}
          >
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

      <TableContainer component={Paper} elevation={0} sx={{ mb: "8px", ...SYSTEM_DOC_TABLE_CONTAINER_SX }}>
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

          <Divider sx={{ my: "32px" }} />

          {/* ── AI components ── */}
          <Box
            component="section"
            id="system-ai"
            sx={{ scrollMarginTop: SYSTEM_PAGE_SCROLL_MARGIN }}
          >
            <TradAtlasText semanticFont={SF.titleH5Emphasis} sx={{ mb: "4px" }}>
              AI components
            </TradAtlasText>
            <TradAtlasText semanticFont={SF.textMd} sx={{ color: "text.secondary", mb: "12px" }}>
              Atlas groups four components as the AI surface: the <strong>Chat Prompt</strong>{" "}
              (<code>AI / Chat Prompt</code>, Input composite — relaxed and compact densities),
              the <strong>user prompt record</strong> shown in the chat thread, the{" "}
              <strong>agent response</strong> body rendered on the canvas, and the{" "}
              <strong>thinking module</strong> that exposes the agent&rsquo;s step list.
              The Atlas column below recreates each component from the Atlas React bundle using
              resolved Atlas Light tokens; the Modified column renders the project components
              from <code>src/components/ai/</code>.
            </TradAtlasText>

            <Paper
              variant="outlined"
              sx={{ p: "16px", mb: "16px", bgcolor: "#fff8e1", borderColor: "#ffe082" }}
            >
              <TradAtlasText semanticFont={SF.textSmEmphasis} sx={{ mb: "4px", display: "block" }}>
                Large gradient shadow on the Chat Prompt
              </TradAtlasText>
              <TradAtlasText semanticFont={SF.textSm} sx={{ color: "text.secondary" }}>
                The Atlas bundle&rsquo;s Chat Prompt sits above a diffuse, primary-tinted radial
                halo — a blurred gradient layer behind the card that signals the AI affordance.
                Because CSS <code>box-shadow</code> cannot carry a gradient fill, the halo is
                implemented as an absolutely-positioned sibling layer with a radial gradient
                (<code>action.primary</code> tones fading to transparent) and a{" "}
                <code>filter: blur(36px)</code>. The project-modified <code>ChatPrompt</code>{" "}
                drops this halo and renders a flat neutral double shadow instead.
              </TradAtlasText>
            </Paper>

            <TableContainer
              component={Paper}
              elevation={0}
              sx={{ mb: "8px", ...SYSTEM_DOC_TABLE_CONTAINER_SX }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, minWidth: 320, width: "36%" }}>
                      Atlas (React bundle reference)
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: 320, width: "36%" }}>
                      Modified (this project)
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: 200 }}>Variant</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Delta</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {AI_COMPONENT_ROWS.map((row) => (
                    <TableRow key={row.key} hover>
                      <TableCell sx={{ py: "20px", verticalAlign: "top", background: color.background.base }}>
                        {row.atlas}
                      </TableCell>
                      <TableCell sx={{ py: "20px", verticalAlign: "top", background: color.background.base }}>
                        {row.modified}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top" }}>
                        <TradAtlasText
                          semanticFont={SF.textSm}
                          sx={{ fontFamily: atlasFontFamilyMono }}
                        >
                          {row.variant}
                        </TradAtlasText>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top" }}>
                        <TradAtlasText
                          semanticFont={SF.textSm}
                          sx={{ fontFamily: atlasFontFamilyMono, color: "text.secondary" }}
                          dangerouslySetInnerHTML={{ __html: row.delta }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
