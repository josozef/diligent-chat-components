import { Box } from "@mui/material";
import {
  atlasSemanticColor as color,
  atlasSemanticRadius as radius,
} from "../../tokens/atlasLight";
import TradAtlasText from "../common/TradAtlasText";
import { DATA_SEMANTIC_FONT, SF } from "@/tokens/tradAtlasSemanticTypography";

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
        data-atlas-component="MessageBubble"
        data-atlas-variant={`bubble - ${align} - md`}
        {...{ [DATA_SEMANTIC_FONT]: SF.textLg }}
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
        <TradAtlasText semanticFont={SF.textLg} sx={{ color: color.type.default }}>
          {children}
        </TradAtlasText>
      </Box>
    </Box>
  );
}
