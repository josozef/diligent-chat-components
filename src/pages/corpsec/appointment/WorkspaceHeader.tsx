import { Box, IconButton } from "@mui/material";
import { ArrowBackIcon } from "@/icons";
import { useNavigate } from "react-router";
import TradAtlasText from "../../../components/common/TradAtlasText";
import { SF } from "@/tokens/tradAtlasSemanticTypography";
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

    </Box>
  );
}
