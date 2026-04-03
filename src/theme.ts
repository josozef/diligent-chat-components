import { createTheme, type Theme } from "@mui/material/styles";

import {
  atlasFontWeight,
  atlasSemanticColor,
  atlasSemanticRadius,
  atlasTypography,
} from "./tokens/atlasLight";
import { atlasSemanticColorDark } from "./tokens/atlasDark";

const mdRadiusPx = Number.parseInt(atlasSemanticRadius.md.replace("px", ""), 10) || 8;

type DeepStringify<T> = { [K in keyof T]: T[K] extends string ? string : DeepStringify<T[K]> };
type SemanticColors = DeepStringify<typeof atlasSemanticColor>;

function buildTheme(mode: "light" | "dark", c: SemanticColors): Theme {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: c.action.primary.default,
        light: c.action.primary.hover,
        dark: c.action.primary.active,
        contrastText: c.action.primary.onPrimary,
      },
      secondary: {
        main: c.action.secondary.outline,
        contrastText: c.action.secondary.onSecondary,
      },
      error: {
        main: c.status.error.default,
        contrastText: c.status.error.text,
      },
      success: {
        main: c.status.success.default,
      },
      warning: {
        main: c.status.warning.default,
      },
      info: {
        main: c.status.notification.default,
      },
      text: {
        primary: c.type.default,
        secondary: c.type.muted,
        disabled: c.type.disabled,
      },
      divider: c.outline.default,
      background: {
        default: c.background.base,
        paper: c.surface.subtle,
      },
      action: {
        active: c.outline.active,
        disabled: c.type.disabled,
        disabledBackground: c.action.primary.disabled,
      },
    },
    shape: {
      borderRadius: mdRadiusPx,
    },
    typography: {
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      fontWeightRegular: atlasFontWeight.regular,
      fontWeightMedium: atlasFontWeight.medium,
      fontWeightBold: atlasFontWeight.bold,
      h1: {
        fontSize: atlasTypography.fontSize.h1Billboard,
        lineHeight: atlasTypography.lineHeight.h1Billboard,
        fontWeight: atlasFontWeight.regular,
      },
      h2: {
        fontSize: atlasTypography.fontSize.h2Display,
        lineHeight: atlasTypography.lineHeight.h2Display,
        fontWeight: atlasFontWeight.regular,
      },
      h3: {
        fontSize: atlasTypography.fontSize.h3Lg,
        lineHeight: atlasTypography.lineHeight.h3Lg,
        fontWeight: atlasFontWeight.regular,
      },
      h4: {
        fontSize: atlasTypography.fontSize.h4Md,
        lineHeight: atlasTypography.lineHeight.h4Md,
        fontWeight: atlasFontWeight.regular,
      },
      h5: {
        fontSize: atlasTypography.fontSize.h5Sm,
        lineHeight: atlasTypography.lineHeight.h5Sm,
        fontWeight: atlasFontWeight.regular,
      },
      h6: {
        fontSize: atlasTypography.fontSize.h6Xs,
        lineHeight: atlasTypography.lineHeight.h6Xs,
        fontWeight: atlasFontWeight.regular,
      },
      body1: {
        fontSize: atlasTypography.fontSize.body,
        lineHeight: atlasTypography.lineHeight.body,
        fontWeight: atlasFontWeight.regular,
      },
      body2: {
        fontSize: atlasTypography.fontSize.md,
        lineHeight: atlasTypography.lineHeight.md,
        fontWeight: atlasFontWeight.regular,
      },
      subtitle1: {
        fontSize: atlasTypography.fontSize.md,
        lineHeight: atlasTypography.lineHeight.md,
        fontWeight: atlasFontWeight.medium,
      },
      subtitle2: {
        fontSize: atlasTypography.fontSize.sm,
        lineHeight: atlasTypography.lineHeight.sm,
        fontWeight: atlasFontWeight.medium,
      },
      button: {
        fontSize: atlasTypography.fontSize.md,
        lineHeight: atlasTypography.lineHeight.md,
        fontWeight: atlasFontWeight.semiBold,
        textTransform: "none",
      },
      caption: {
        fontSize: atlasTypography.fontSize.sm,
        lineHeight: atlasTypography.lineHeight.sm,
        fontWeight: atlasFontWeight.regular,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: atlasSemanticRadius.lg,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
    },
  });
}

export const lightTheme = buildTheme("light", atlasSemanticColor);
export const darkTheme = buildTheme("dark", atlasSemanticColorDark);

const theme = lightTheme;
export default theme;
