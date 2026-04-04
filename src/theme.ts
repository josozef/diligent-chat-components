import { createTheme, type Theme } from "@mui/material/styles";

import {
  atlasFontFamily,
  atlasFontWeight,
  atlasSemanticColor,
  atlasSemanticRadius,
} from "./tokens/atlasLight";
import { DATA_SEMANTIC_FONT, SF, semanticFontStyle } from "./tokens/tradAtlasSemanticTypography";

type ActionLabelFont = {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: string;
  letterSpacing: string;
};

const actionLabelPrimaryStyle = semanticFontStyle(SF.actionLabelPrimary) as ActionLabelFont;
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
      fontFamily: atlasFontFamily,
      fontWeightRegular: atlasFontWeight.regular,
      fontWeightMedium: atlasFontWeight.medium,
      fontWeightBold: atlasFontWeight.bold,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily: atlasFontFamily,
          },
        },
      },
      MuiButton: {
        defaultProps: {
          ...{ [DATA_SEMANTIC_FONT]: SF.actionLabelPrimary },
        },
        styleOverrides: {
          root: {
            ...actionLabelPrimaryStyle,
            borderRadius: atlasSemanticRadius.smmd,
            textTransform: "none",
          },
          sizeSmall: {
            borderRadius: atlasSemanticRadius.sm,
          },
          sizeMedium: {
            borderRadius: atlasSemanticRadius.smmd,
          },
          sizeLarge: {
            borderRadius: atlasSemanticRadius.md,
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
