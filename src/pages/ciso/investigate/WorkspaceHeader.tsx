import { Box, Button, Chip, IconButton } from "@mui/material";
import { ArrowBackIcon } from "@/icons";
import { useNavigate } from "react-router";
import TradAtlasText from "../../../components/common/TradAtlasText";
import { SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "../../../hooks/useTokens";

interface WorkspaceHeaderProps {
  onReset: () => void;
}

export default function WorkspaceHeader({ onReset }: WorkspaceHeaderProps) {
  const navigate = useNavigate();
  const { color, weight } = useTokens();

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
          onClick={() => navigate("/ciso")}
          size="small"
          sx={{ color: color.type.muted, "&:hover": { color: color.type.default } }}
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} />
        </IconButton>

        <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.default, fontWeight: weight.medium }}>
          Vulnerability response — CVE-2026-1847
        </TradAtlasText>

        <Chip
          label="Critical"
          size="small"
          sx={{
            backgroundColor: color.status.error.default,
            color: "#fff",
            fontWeight: weight.semiBold,
            height: 22,
            ...semanticFontStyle(SF.textMicro),
          }}
        />
      </Box>

      <Button
        variant="text"
        size="small"
        onClick={onReset}
        sx={{
          textTransform: "none",
          color: color.type.muted,
          fontWeight: weight.medium,
          ...semanticFontStyle(SF.labelMd),
          "&:hover": { color: color.type.default },
        }}
      >
        Reset demo
      </Button>
    </Box>
  );
}
