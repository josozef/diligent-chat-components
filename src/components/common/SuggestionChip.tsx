import { Box, Button } from "@mui/material";
import { NorthEastIcon } from "@/icons";
import { DATA_SEMANTIC_FONT, SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
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
    <Button
      type="button"
      variant="outlined"
      color="inherit"
      size="small"
      onClick={onClick}
      data-atlas-component="Button"
      data-atlas-variant="outlined - chip - sm"
      {...{ [DATA_SEMANTIC_FONT]: SF.textMdEmphasis }}
      sx={{
        ...semanticFontStyle(SF.textMdEmphasis),
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: "36px",
        minWidth: 0,
        px: "8px",
        py: 0,
        textTransform: "none",
        fontWeight: weight.semiBold,
        borderColor: color.outline.fixed,
        overflow: "clip",
        color: color.type.default,
        "&:hover": { background: color.surface.variant },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", height: "36px", px: "8px", whiteSpace: "nowrap" }}>
        {label}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", height: "36px", px: 0 }}>
        <NorthEastIcon sx={{ fontSize: 16, color: color.type.default }} />
      </Box>
    </Button>
  );
}
