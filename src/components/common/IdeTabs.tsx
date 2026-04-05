import { Box } from "@mui/material";
import { CheckCircleIcon } from "@/icons";
import { semanticFontStyle, SF } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

export interface TabDef {
  label: string;
  done: boolean;
}

export function AtlasTabButton({
  label,
  selected,
  done,
  onClick,
}: {
  label: string;
  selected: boolean;
  done: boolean;
  onClick: () => void;
}) {
  const { color, radius, weight } = useTokens();
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      data-atlas-component="TabButton"
      data-atlas-variant={`small - label${done ? " + badge" : ""} - ${selected ? "selected" : "default"}`}
      sx={{
        position: "relative",
        ...semanticFontStyle(SF.textMdEmphasis),
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        px: "16px",
        py: "6px",
        border: "none",
        borderTopLeftRadius: radius.md,
        borderTopRightRadius: radius.md,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        background: selected ? color.surface.default : "transparent",
        cursor: "pointer",
        color: selected ? color.action.secondary.onSecondary : color.type.muted,
        fontWeight: selected ? weight.semiBold : weight.regular,
        whiteSpace: "nowrap",
        transition: "background 0.12s ease, color 0.12s ease",
        overflow: "clip",
        "&:hover": {
          background: selected ? color.surface.default : color.action.secondary.hoverFill,
          color: color.action.secondary.onSecondary,
        },
        "&:active": {
          background: selected ? color.surface.default : "#e6e6e6",
        },
      }}
    >
      {label}
      {done ? (
        <CheckCircleIcon sx={{ fontSize: 15, color: color.status.success.default }} />
      ) : null}
      {selected ? (
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            borderTopLeftRadius: "2px",
            borderTopRightRadius: "2px",
            background: color.action.primary.default,
          }}
        />
      ) : null}
    </Box>
  );
}

export default function IdeTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: TabDef[];
  active: number;
  onChange: (i: number) => void;
}) {
  const { color } = useTokens();
  return (
    <Box
      data-atlas-component="TabBar"
      data-atlas-variant="horizontal - small"
      sx={{
        display: "flex",
        borderBottom: `1px solid ${color.outline.fixed}`,
        background: color.surface.subtle,
        flexShrink: 0,
      }}
    >
      {tabs.map((t, i) => (
        <AtlasTabButton
          key={t.label}
          label={t.label}
          selected={i === active}
          done={t.done}
          onClick={() => onChange(i)}
        />
      ))}
    </Box>
  );
}
