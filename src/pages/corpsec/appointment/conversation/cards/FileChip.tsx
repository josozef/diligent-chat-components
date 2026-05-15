import { Box } from "@mui/material";

import { DescriptionOutlinedIcon } from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import { SF } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

export interface FileChipProps {
  label: string;
  metaLine?: string;
  onClick?: () => void;
}

/**
 * Compact "file chip" shown inside chat cards to advertise an attached
 * document. Clicks bubble out to the parent (which typically opens the
 * document in the right-hand asset rail).
 */
export default function FileChip({ label, metaLine, onClick }: FileChipProps) {
  const { color, weight, radius } = useTokens();

  return (
    <Box
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 12px",
        background: color.surface.subtle,
        border: `1px solid ${color.outline.fixed}`,
        borderRadius: radius.md,
        cursor: onClick ? "pointer" : "default",
        transition: "background-color 120ms ease, border-color 120ms ease",
        "&:hover": onClick
          ? {
              background: color.surface.variant,
              borderColor: color.outline.hover,
            }
          : undefined,
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: 36,
          height: 36,
          borderRadius: radius.sm,
          background: color.action.primary.default,
          color: color.action.primary.onPrimary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <DescriptionOutlinedIcon sx={{ fontSize: 18 }} />
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <TradAtlasText
          semanticFont={SF.textSmEmphasis}
          sx={{
            color: color.type.default,
            fontWeight: weight.semiBold,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </TradAtlasText>
        {metaLine ? (
          <TradAtlasText
            semanticFont={SF.textXs}
            sx={{
              color: color.type.muted,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: "11px",
            }}
          >
            {metaLine}
          </TradAtlasText>
        ) : null}
      </Box>
    </Box>
  );
}
