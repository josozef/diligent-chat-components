import { IconButton, Tooltip } from "@mui/material";

export default function RichDocumentToolbarButton({
  icon,
  label,
  active,
  disabled,
  onClick,
  activeColor,
  hoverBg,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  activeColor: string;
  hoverBg: string;
}) {
  return (
    <Tooltip title={label} arrow enterDelay={400}>
      <span>
        <IconButton
          size="small"
          onClick={onClick}
          disabled={disabled}
          aria-label={label}
          sx={{
            borderRadius: "6px",
            width: 32,
            height: 32,
            border: active ? `1.5px solid ${activeColor}` : `1px solid transparent`,
            background: active ? `${activeColor}14` : "transparent",
            color: active ? activeColor : "inherit",
            "&:hover": { background: hoverBg },
          }}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  );
}
