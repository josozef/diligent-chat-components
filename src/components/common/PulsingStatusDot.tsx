import type { ReactNode } from "react";
import { Box, Stack } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

import { atlasSemanticColor } from "../../tokens/atlasLight";
import TradAtlasText from "./TradAtlasText";
import { SF, type SemanticFontPath } from "../../tokens/tradAtlasSemanticTypography";

export type PulsingStatusTone = "info" | "success" | "warning" | "error" | "neutral";
export type PulsingStatusSize = "sm" | "md" | "lg";

export interface PulsingStatusDotProps {
  /**
   * Semantic color. `info` is the agentic-progress default (blue).
   * Use `success` only when a long-running task is settled-but-watching
   * (e.g. a monitor that's running green).
   */
  tone?: PulsingStatusTone;
  /** `sm` = 6px, `md` = 8px (default), `lg` = 10px — core dot diameter. */
  size?: PulsingStatusSize;
  /**
   * When `false`, the outer ring halo stops animating and the core dot
   * renders at reduced opacity — a quiet "paused / idle" state.
   * Defaults to `true`.
   */
  running?: boolean;
  /** Optional inline text rendered to the right of the dot. */
  label?: ReactNode;
  /** Screen-reader description. Falls back to the stringified `label` or "Working". */
  "aria-label"?: string;
  /** Overrides applied to the wrapper `<span>`. */
  sx?: SxProps<Theme>;
}

/* ────────────────────────────────────────────────────────────
 * Size tokens — core dot diameter and the ring's max expansion.
 * The ring animates from ~60% → ~220% of the core so the halo
 * blooms outward without ever fully obscuring surrounding text.
 * ──────────────────────────────────────────────────────────── */
const SIZE_TOKENS: Record<PulsingStatusSize, { dot: number; ring: number; font: SemanticFontPath }> = {
  sm: { dot: 6,  ring: 14, font: SF.textMicro },
  md: { dot: 8,  ring: 18, font: SF.textSm },
  lg: { dot: 10, ring: 24, font: SF.textSm },
};

/* ────────────────────────────────────────────────────────────
 * Tone → color. Pulls straight from the status tokens so the
 * dot inherits any future theme changes.
 * ──────────────────────────────────────────────────────────── */
function toneColor(tone: PulsingStatusTone): string {
  switch (tone) {
    case "success": return atlasSemanticColor.status.success.default;
    case "warning": return atlasSemanticColor.status.warning.default;
    case "error":   return atlasSemanticColor.status.error.default;
    case "neutral": return atlasSemanticColor.outline.default;
    case "info":
    default:        return atlasSemanticColor.status.notification.default;
  }
}

/* Shared keyframe name — scoped to this component via unique prefix. */
const RING_ANIM_NAME = "atlasPulsingStatusDot-ring";
const DOT_ANIM_NAME = "atlasPulsingStatusDot-dot";

/**
 * **Activity pulse.**
 *
 * A low-attention alternative to a spinner for long-running agentic work —
 * tasks that may run for minutes, hours, even days. Instead of continuously
 * rotating geometry, a static colored dot emits a soft halo that blooms and
 * fades every ~2.4 seconds. The animation is quiet enough to leave running
 * for weeks without fatiguing the viewer, and decorative enough that the
 * user trusts the process is still live.
 *
 * Prefer a spinner (`CircularProgress`) when the operation blocks interaction
 * or is expected to resolve in under ~10 seconds. Prefer the activity pulse
 * for ambient / background / long-horizon progress surfaces.
 *
 * Respects `prefers-reduced-motion` — the halo stops expanding and the dot
 * does a very slow opacity pulse instead, which conveys "alive" without
 * continuous motion.
 */
export default function PulsingStatusDot({
  tone = "info",
  size = "md",
  running = true,
  label,
  sx,
  ...rest
}: PulsingStatusDotProps) {
  const ariaLabel =
    rest["aria-label"] ??
    (typeof label === "string" && label.length > 0 ? label : "Working");
  const { dot, ring, font } = SIZE_TOKENS[size];
  const color = toneColor(tone);

  // Centered layout: the ring sits behind the dot, both anchored by a
  // `position: relative` wrapper sized to the ring's max footprint so
  // adjacent text doesn't reflow as the halo expands.
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing="8px"
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      sx={sx}
    >
      <Box
        sx={{
          position: "relative",
          width: ring,
          height: ring,
          flexShrink: 0,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Halo ring — animated outward bloom */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: dot,
            height: dot,
            borderRadius: "50%",
            background: color,
            transform: "translate(-50%, -50%)",
            opacity: running ? 0.5 : 0,
            animation: running
              ? `${RING_ANIM_NAME} 2400ms cubic-bezier(0.4, 0, 0.6, 1) infinite`
              : "none",
            [`@keyframes ${RING_ANIM_NAME}`]: {
              "0%":   { transform: "translate(-50%, -50%) scale(0.8)", opacity: 0.55 },
              "70%":  { transform: `translate(-50%, -50%) scale(${ring / dot})`, opacity: 0 },
              "100%": { transform: `translate(-50%, -50%) scale(${ring / dot})`, opacity: 0 },
            },
            "@media (prefers-reduced-motion: reduce)": { animation: "none", opacity: 0 },
          }}
        />
        {/* Core dot — static when running; ghosted when paused */}
        <Box
          aria-hidden
          sx={{
            position: "relative",
            width: dot,
            height: dot,
            borderRadius: "50%",
            background: color,
            opacity: running ? 1 : 0.45,
            "@media (prefers-reduced-motion: reduce)": running
              ? {
                  animation: `${DOT_ANIM_NAME} 4000ms ease-in-out infinite`,
                  [`@keyframes ${DOT_ANIM_NAME}`]: {
                    "0%":   { opacity: 1 },
                    "50%":  { opacity: 0.55 },
                    "100%": { opacity: 1 },
                  },
                }
              : {},
          }}
        />
      </Box>
      {label != null && (
        <TradAtlasText
          semanticFont={font}
          sx={{ color: running ? atlasSemanticColor.type.default : atlasSemanticColor.type.muted }}
        >
          {label}
        </TradAtlasText>
      )}
    </Stack>
  );
}
