import { Box, Typography } from "@mui/material";
import { useTokens } from "../../hooks/useTokens";

export default function TertiaryButton({
  label,
  leadingIcon,
  trailingIcon,
  onClick,
}: {
  label: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
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
        gap: "8px",
        px: "12px",
        py: "8px",
        borderRadius: "6px",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        color: color.action.secondary.onSecondary,
        "&:hover": { background: color.action.secondary.hoverFill },
      }}
    >
      {leadingIcon}
      <Box sx={{ display: "flex", alignItems: "center", height: "24px", px: "4px", pb: "2px" }}>
        <Typography
          sx={{
            fontWeight: weight.semiBold,
            fontSize: "16px",
            lineHeight: "24px",
            letterSpacing: "0.2px",
            color: color.action.secondary.onSecondary,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </Typography>
      </Box>
      {trailingIcon}
    </Box>
  );
}
