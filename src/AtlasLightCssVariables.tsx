import { GlobalStyles } from "@mui/material";

import { atlasSemanticColor, atlasSemanticRadius } from "./tokens/atlasLight";

/**
 * Exposes Atlas Light semantic colors as CSS custom properties for use outside MUI
 * (e.g. raw CSS, third-party components). Prefix: `--atlas-`
 */
export default function AtlasLightCssVariables() {
  const c = atlasSemanticColor;
  return (
    <GlobalStyles
      styles={{
        ":root": {
          "--atlas-color-background-base": c.background.base,
          "--atlas-color-background-container": c.background.container,
          "--atlas-color-background-backdrop": c.background.backdrop,
          "--atlas-color-surface-default": c.surface.default,
          "--atlas-color-surface-variant": c.surface.variant,
          "--atlas-color-surface-subtle": c.surface.subtle,
          "--atlas-color-type-default": c.type.default,
          "--atlas-color-type-muted": c.type.muted,
          "--atlas-color-type-disabled": c.type.disabled,
          "--atlas-color-outline-default": c.outline.default,
          "--atlas-color-outline-fixed": c.outline.fixed,
          "--atlas-color-outline-static": c.outline.static,
          "--atlas-color-outline-hover": c.outline.hover,
          "--atlas-color-action-primary": c.action.primary.default,
          "--atlas-color-action-primary-hover": c.action.primary.hover,
          "--atlas-color-action-primary-disabled": c.action.primary.disabled,
          "--atlas-radius-sm": atlasSemanticRadius.sm,
          "--atlas-radius-md": atlasSemanticRadius.md,
          "--atlas-radius-lg": atlasSemanticRadius.lg,
          "--atlas-radius-full": atlasSemanticRadius.full,
        },
      }}
    />
  );
}
