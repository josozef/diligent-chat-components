import { Box } from "@mui/material";
import { useTokens } from "../../hooks/useTokens";

export default function ContentCard({ children, sx }: { children: React.ReactNode; sx?: object }) {
  const { color, radius } = useTokens();
  return (
    <Box
      data-atlas-component="ContentCard"
      data-atlas-variant="surface - card - lg"
      sx={{
        borderRadius: radius.lg,
        border: `1px solid ${color.outline.fixed}`,
        background: color.surface.default,
        p: "20px",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
