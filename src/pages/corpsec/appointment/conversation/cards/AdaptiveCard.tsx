import type { ReactNode } from "react";
import { Box, Chip } from "@mui/material";

import TradAtlasText from "@/components/common/TradAtlasText";
import PulsingStatusDot from "@/components/common/PulsingStatusDot";
import { SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

export type AdaptiveCardStatus = "awaiting" | "running" | "resolved";

export interface AdaptiveCardProps {
  title: string;
  subtitle?: string;
  status?: AdaptiveCardStatus;
  /** Right-aligned status pill. Falls back to a sensible label per status. */
  statusLabel?: string;
  body: ReactNode;
  /** Footer is right-aligned by default; pass any actions (typically buttons). */
  footer?: ReactNode;
  /** Optional anchor ID — used by the side rail to scroll the chat to this card. */
  anchorId?: string;
}

/**
 * Adaptive Card frame for chat-driven workflow steps.
 *
 * Modeled after the Microsoft Teams Adaptive Card pattern (the reference
 * implementation in the Teams version of this workflow), then re-skinned
 * with Atlas tokens. Three slots — header, body, footer — and a status
 * pill that drives the visual state of the card as the workflow advances.
 */
export default function AdaptiveCard({
  title,
  subtitle,
  status = "awaiting",
  statusLabel,
  body,
  footer,
  anchorId,
}: AdaptiveCardProps) {
  const { color, radius, weight } = useTokens();

  const pillStyles = (() => {
    switch (status) {
      case "resolved":
        return {
          background: color.status.success.background,
          color: color.status.success.text,
        };
      case "running":
        return {
          background: color.status.notification.background,
          color: color.action.primary.default,
        };
      case "awaiting":
      default:
        return {
          background: color.status.warning.background,
          color: color.status.warning.text,
        };
    }
  })();

  const resolvedLabel =
    statusLabel ??
    (status === "resolved" ? "Done" : status === "running" ? "Working" : "Action needed");

  return (
    <Box
      id={anchorId}
      data-atlas-component="AdaptiveCard"
      data-atlas-variant={`card - ${status}`}
      sx={{
        width: "100%",
        maxWidth: 640,
        background: color.surface.default,
        border: `1px solid ${color.outline.fixed}`,
        borderRadius: radius.lg,
        overflow: "hidden",
        boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.04)",
        opacity: status === "resolved" ? 0.96 : 1,
        scrollMarginTop: "16px",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          px: "16px",
          py: "12px",
          background: color.surface.subtle,
          borderBottom: `1px solid ${color.outline.fixed}`,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
          <TradAtlasText
            semanticFont={SF.textMdEmphasis}
            sx={{
              color: color.type.default,
              fontWeight: weight.semiBold,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </TradAtlasText>
          {subtitle ? (
            <TradAtlasText
              semanticFont={SF.textXs}
              sx={{
                color: color.type.muted,
                fontSize: "11px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {subtitle}
            </TradAtlasText>
          ) : null}
        </Box>
        {status === "running" ? (
          <PulsingStatusDot size="sm" tone="info" aria-label={resolvedLabel} />
        ) : null}
        <Chip
          label={resolvedLabel}
          size="small"
          sx={{
            ...semanticFontStyle(SF.textMicroEmphasis),
            ...pillStyles,
            height: 22,
            fontWeight: weight.semiBold,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            "& .MuiChip-label": { px: "8px" },
          }}
        />
      </Box>

      {/* Body */}
      <Box sx={{ px: "16px", py: "16px" }}>{body}</Box>

      {/* Footer */}
      {footer ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "8px",
            px: "16px",
            py: "12px",
            background: color.surface.subtle,
            borderTop: `1px solid ${color.outline.fixed}`,
            flexWrap: "wrap",
          }}
        >
          {footer}
        </Box>
      ) : null}
    </Box>
  );
}
