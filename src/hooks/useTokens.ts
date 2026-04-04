import { useMemo } from "react";
import { useDemo } from "../DemoContext";
import { atlasSemanticColor } from "../tokens/atlasLight";
import { atlasSemanticColorDark } from "../tokens/atlasDark";
import { atlasSemanticRadius, atlasFontWeight, atlasCoreSpacing } from "../tokens/atlasLight";
import { DATA_SEMANTIC_FONT, SF, semanticFontStyle } from "../tokens/tradAtlasSemanticTypography";

export function useTokens() {
  const { themeMode } = useDemo();
  const color = useMemo(
    () => (themeMode === "atlas-dark" ? atlasSemanticColorDark : atlasSemanticColor),
    [themeMode],
  );
  return {
    color,
    radius: atlasSemanticRadius,
    weight: atlasFontWeight,
    spacing: atlasCoreSpacing,
    isDark: themeMode === "atlas-dark",
    semanticFontStyle,
    SF,
    DATA_SEMANTIC_FONT,
  };
}
