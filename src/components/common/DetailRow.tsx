import { Box } from "@mui/material";
import TradAtlasText from "./TradAtlasText";
import { SF } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

export default function DetailRow({
  icon,
  label,
  value,
  muted,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  muted?: boolean;
}) {
  const { color, weight } = useTokens();
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
      <Box sx={{ color: color.type.muted, mt: "2px" }}>{icon}</Box>
      <Box>
        <TradAtlasText
          semanticFont={SF.textMicroEmphasis}
          sx={{ color: color.type.muted, fontWeight: weight.medium }}
        >
          {label}
        </TradAtlasText>
        <TradAtlasText
          semanticFont={SF.labelMd}
          sx={{
            color: muted ? color.type.disabled : color.type.default,
            fontWeight: weight.medium,
            fontStyle: muted ? "italic" : "normal",
          }}
        >
          {value}
        </TradAtlasText>
      </Box>
    </Box>
  );
}
