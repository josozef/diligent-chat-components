import { Box, Typography } from "@mui/material";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import { useTokens } from "../../hooks/useTokens";

export default function SuggestionChip({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  const { color, weight } = useTokens();

  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: "36px",
        border: `1px solid ${color.outline.fixed}`,
        borderRadius: "6px",
        background: "transparent",
        px: "8px",
        py: 0,
        cursor: "pointer",
        overflow: "clip",
        "&:hover": { background: color.surface.variant },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", height: "36px", px: "8px" }}>
        <Typography
          sx={{
            fontWeight: weight.semiBold,
            fontSize: "14px",
            lineHeight: "20px",
            letterSpacing: "0.2px",
            color: color.type.default,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", height: "36px", px: 0 }}>
        <NorthEastIcon sx={{ fontSize: 16, color: color.type.default }} />
      </Box>
    </Box>
  );
}
