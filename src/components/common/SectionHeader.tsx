import { Box, Chip } from "@mui/material";
import TradAtlasText from "./TradAtlasText";
import { SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

export type StatusVariant = "in_progress" | "not_started" | "completed";

export default function SectionHeader({
  title,
  subtitle,
  statusLabel,
  statusVariant,
}: {
  title: string;
  subtitle?: string;
  statusLabel?: string;
  statusVariant?: StatusVariant;
}) {
  const { color, weight } = useTokens();
  const chipColor =
    statusVariant === "completed"
      ? color.status.success.default
      : statusVariant === "in_progress"
        ? color.action.primary.default
        : color.type.disabled;

  return (
    <Box sx={{ mb: "20px" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: subtitle ? "4px" : 0 }}>
        <TradAtlasText
          semanticFont={SF.titleH4Emphasis}
          sx={{ fontWeight: weight.semiBold, color: color.type.default }}
        >
          {title}
        </TradAtlasText>
        {statusLabel ? (
          <Chip
            label={statusLabel}
            size="small"
            sx={{
              ...semanticFontStyle(SF.textXs),
              backgroundColor: chipColor,
              color: "#fff",
              fontWeight: weight.semiBold,
              height: 20,
              letterSpacing: "0.5px",
            }}
          />
        ) : null}
      </Box>
      {subtitle ? (
        <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
          {subtitle}
        </TradAtlasText>
      ) : null}
    </Box>
  );
}
