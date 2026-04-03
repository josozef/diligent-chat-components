import { useMemo } from "react";
import { useDemo } from "../DemoContext";
import { atlasSemanticColor } from "../tokens/atlasLight";
import { atlasSemanticColorDark } from "../tokens/atlasDark";
import {
  atlasSemanticRadius,
  atlasFontWeight,
  atlasTypography,
  atlasCoreSpacing,
} from "../tokens/atlasLight";

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
    typography: atlasTypography,
    spacing: atlasCoreSpacing,
    isDark: themeMode === "atlas-dark",
  };
}
