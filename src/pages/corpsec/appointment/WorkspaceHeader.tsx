import { Box, Button, IconButton } from "@mui/material";
import { ArrowBackIcon, VisibilityOutlinedIcon } from "@/icons";
import { useNavigate } from "react-router";
import TradAtlasText from "../../../components/common/TradAtlasText";
import { DATA_SEMANTIC_FONT, SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "../../../hooks/useTokens";

interface WorkspaceHeaderProps {
  selectedCandidate: string | null;
}

export default function WorkspaceHeader({ selectedCandidate }: WorkspaceHeaderProps) {
  const navigate = useNavigate();
  const { color, weight } = useTokens();

  const title = selectedCandidate
    ? `Replace director David Chen with ${selectedCandidate}`
    : "Replace director David Chen";

  return (
    <Box
      sx={{
        height: 48,
        px: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `1px solid ${color.outline.fixed}`,
        background: color.surface.default,
        flexShrink: 0,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <IconButton
          onClick={() => navigate("/corpsec")}
          size="small"
          data-atlas-component="IconButton"
          data-atlas-variant="ghost - sm"
          sx={{
            color: color.type.muted,
            "&:hover": { color: color.type.default },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} />
        </IconButton>

        <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.default, fontWeight: weight.medium }}>
          {title}
        </TradAtlasText>
      </Box>

      <Button
        variant="outlined"
        color="inherit"
        size="small"
        data-atlas-component="Button"
        data-atlas-variant="outlined - secondary - sm"
        {...{ [DATA_SEMANTIC_FONT]: SF.labelMd }}
        startIcon={<VisibilityOutlinedIcon sx={{ fontSize: 15 }} />}
        sx={{
          ...semanticFontStyle(SF.labelMd),
          textTransform: "none",
          color: color.type.muted,
          borderColor: color.outline.fixed,
          fontWeight: weight.medium,
          px: "10px",
          py: "4px",
          minWidth: 0,
          "&:hover": { color: color.type.default, borderColor: color.outline.default },
        }}
      >
        Preview
      </Button>
    </Box>
  );
}
