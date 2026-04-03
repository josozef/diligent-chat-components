import { IconButton } from "@mui/material";
import {
  atlasSemanticColor as color,
  atlasSemanticRadius as radius,
} from "../../tokens/atlasLight";

export default function TertiaryIconButton({
  children,
  disabled = false,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel: string;
}) {
  return (
    <IconButton
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      sx={{
        borderRadius: radius.lg,
        p: "8px",
        color: disabled ? color.type.disabled : color.action.secondary.onSecondary,
        "&:hover": { background: color.action.secondary.hoverFill },
      }}
    >
      {children}
    </IconButton>
  );
}
