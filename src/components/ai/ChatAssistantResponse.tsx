import { Box } from "@mui/material";
import {
  atlasFontWeight,
  atlasSemanticColor as color,
} from "../../tokens/atlasLight";
import { DATA_SEMANTIC_FONT, SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import type { ChatPresentationDensity } from "./chatPresentation";

/**
 * Assistant body text on the canvas — no card, border, or fill (matches general-purpose chat).
 */
export default function ChatAssistantResponse({
  htmlContent,
  density,
}: {
  htmlContent: string;
  density: ChatPresentationDensity;
}) {
  const isCompact = density === "compact";
  const semantic = isCompact ? SF.labelMd : SF.textLg;

  return (
    <Box
      data-atlas-component="ChatAssistantResponse"
      data-atlas-variant={isCompact ? "compact" : "relaxed"}
      component="div"
      {...{ [DATA_SEMANTIC_FONT]: semantic }}
      sx={{
        width: "100%",
        ...semanticFontStyle(semantic),
        color: color.type.default,
        "& strong": { fontWeight: atlasFontWeight.semiBold },
      }}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
