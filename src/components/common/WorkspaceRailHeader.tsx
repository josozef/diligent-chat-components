import { Box } from "@mui/material";
import TradAtlasText from "./TradAtlasText";
import { SF } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

export default function WorkspaceRailHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const { color } = useTokens();
  return (
    <Box
      data-atlas-component="WorkspaceRailHeader"
      sx={{
        px: "16px",
        py: "12px",
        borderBottom: `1px solid ${color.outline.fixed}`,
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      {icon}
      <Box>
        <TradAtlasText semanticFont={SF.labelMdEmphasis} sx={{ color: color.type.default }}>
          {title}
        </TradAtlasText>
        {subtitle ? (
          <TradAtlasText semanticFont={SF.textMicro} sx={{ color: color.type.muted }}>
            {subtitle}
          </TradAtlasText>
        ) : null}
      </Box>
    </Box>
  );
}
