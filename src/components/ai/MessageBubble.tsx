import { Box, Typography } from "@mui/material";
import {
  atlasSemanticColor as color,
  atlasSemanticRadius as radius,
} from "../../tokens/atlasLight";

const body = {
  fontSize: "16px",
  lineHeight: "24px",
  letterSpacing: "0.2px",
  color: color.type.default,
} as const;

export default function MessageBubble({
  children,
  align = "right",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <Box sx={{ display: "flex", justifyContent: align === "right" ? "flex-end" : "flex-start", width: "100%" }}>
      <Box
        sx={{
          maxWidth: 520,
          minWidth: 280,
          background: color.surface.subtle,
          borderRadius: radius.md,
          px: "16px",
          py: "12px",
          border: `1px solid ${color.outline.static}`,
        }}
      >
        <Typography sx={body}>{children}</Typography>
      </Box>
    </Box>
  );
}
