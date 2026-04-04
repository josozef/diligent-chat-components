import Typography, { type TypographyProps } from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";

import {
  DATA_SEMANTIC_FONT,
  type SemanticFontPath,
  semanticFontStyle,
} from "@/tokens/tradAtlasSemanticTypography";

export type TradAtlasTextProps = Omit<TypographyProps, "variant"> & {
  semanticFont: SemanticFontPath;
};

/**
 * Text using only Trad Atlas Semantic/Font/* tokens. Sets `data-semantic-font` to the full Figma path.
 */
export default function TradAtlasText({ semanticFont, sx, ...rest }: TradAtlasTextProps) {
  return (
    <Typography
      {...rest}
      {...{ [DATA_SEMANTIC_FONT]: semanticFont }}
      sx={{ ...semanticFontStyle(semanticFont), ...sx } as SxProps<Theme>}
    />
  );
}
