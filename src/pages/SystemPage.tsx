import {
  Box,
  CircularProgress,
  Divider,
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

import { atlasFontFamily, atlasSemanticRadius } from "../tokens/atlasLight";
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
                        {...{ [DATA_SEMANTIC_FONT]: SF.codeSm }}
                        sx={{ ...semanticFontStyle(SF.codeSm), py: "4px", width: "50%" }}
                      >
                        {token}
                      </TableCell>
                      <TableCell sx={{ py: "4px" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {!value.endsWith("px") && <Swatch color={value} />}
                          <TradAtlasText semanticFont={SF.codeSm}>{value}</TradAtlasText>
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
              <TableCell sx={{ fontWeight: 600, minWidth: 160 }}>Preview</TableCell>
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
                    <VariantPreview
                      type={row.type}
                      destructive={row.destructive}
                      state={row.state}
                      size={row.size}
                    />
                  </TableCell>
                  <TableCell>
                    <TradAtlasText semanticFont={SF.codeSm}>{variantLabel}</TradAtlasText>
                  </TableCell>
                  <TableCell>
                    <TradAtlasText semanticFont={SF.codeSm} sx={{ color: "text.secondary" }}>
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
  );
}
