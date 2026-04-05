import { Box, CircularProgress } from "@mui/material";
import { CheckCircleIcon, RadioButtonUncheckedIcon } from "@/icons";
import TradAtlasText from "./TradAtlasText";
import { SF } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

export type SubstepStatus = "pending" | "in_progress" | "completed";

export default function StatusSubstepRow({
  status,
  label,
  time,
  size = "md",
}: {
  status: SubstepStatus;
  label: string;
  time?: string | null;
  size?: "sm" | "md";
}) {
  const { color, weight } = useTokens();

  const iconSize = size === "sm" ? 16 : 20;
  const spinnerSize = size === "sm" ? 14 : 18;
  const spinnerOffset = size === "sm" ? "1px" : "1px";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: size === "sm" ? "8px" : "12px",
        py: size === "sm" ? "6px" : "10px",
        px: "4px",
        borderBottom: `1px solid ${color.outline.fixed}`,
        "&:last-child": { borderBottom: "none" },
      }}
    >
      {status === "completed" ? (
        <CheckCircleIcon sx={{ fontSize: iconSize, color: color.status.success.default, flexShrink: 0 }} />
      ) : status === "in_progress" ? (
        <CircularProgress
          size={spinnerSize}
          thickness={5}
          sx={{ color: color.action.primary.default, flexShrink: 0, ml: spinnerOffset, mr: spinnerOffset }}
        />
      ) : (
        <RadioButtonUncheckedIcon sx={{ fontSize: iconSize, color: color.outline.fixed, flexShrink: 0 }} />
      )}
      <TradAtlasText
        semanticFont={size === "sm" ? SF.textSm : SF.labelMd}
        sx={{
          color: status === "pending" ? color.type.muted : color.type.default,
          fontWeight: status === "in_progress" ? weight.semiBold : weight.regular,
          flex: 1,
        }}
      >
        {label}
      </TradAtlasText>
      {time && (
        <TradAtlasText semanticFont={SF.textMicro} sx={{ color: color.type.muted, flexShrink: 0 }}>
          {time}
        </TradAtlasText>
      )}
    </Box>
  );
}
