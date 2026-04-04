import { Box, Button } from "@mui/material";
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
  const { color } = useTokens();

  return (
    <Button
      type="button"
      variant="text"
      color="inherit"
      size="medium"
      onClick={onClick}
      data-atlas-component="Button"
      data-atlas-variant="text - tertiary - md"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        px: "12px",
        py: "8px",
        minWidth: 0,
        textTransform: "none",
        color: color.action.secondary.onSecondary,
        "&:hover": { background: color.action.secondary.hoverFill },
      }}
    >
      {leadingIcon}
      <Box sx={{ display: "flex", alignItems: "center", height: "24px", px: "4px", pb: "2px" }}>{label}</Box>
      {trailingIcon}
    </Button>
  );
}
