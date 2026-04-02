import { createTheme } from "@mui/material/styles";

import {
  atlasFontWeight,
  atlasSemanticColor,
  atlasSemanticRadius,
  atlasTypography,
} from "./tokens/atlasLight";

const mdRadiusPx = Number.parseInt(atlasSemanticRadius.md.replace("px", ""), 10) || 8;

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: atlasSemanticColor.action.primary.default,
      light: atlasSemanticColor.action.primary.hover,
      dark: atlasSemanticColor.action.primary.active,
      contrastText: atlasSemanticColor.action.primary.onPrimary,
    },
    secondary: {
      main: atlasSemanticColor.action.secondary.outline,
      contrastText: atlasSemanticColor.action.secondary.onSecondary,
    },
    error: {
      main: atlasSemanticColor.status.error.default,
      contrastText: atlasSemanticColor.status.error.text,
    },
    success: {
      main: atlasSemanticColor.status.success.default,
    },
    warning: {
      main: atlasSemanticColor.status.warning.default,
    },
    info: {
      main: atlasSemanticColor.status.notification.default,
    },
    text: {
      primary: atlasSemanticColor.type.default,
      secondary: atlasSemanticColor.type.muted,
      disabled: atlasSemanticColor.type.disabled,
    },
    divider: atlasSemanticColor.outline.default,
    background: {
      default: atlasSemanticColor.background.base,
      paper: atlasSemanticColor.surface.subtle,
    },
    action: {
      active: atlasSemanticColor.outline.active,
      disabled: atlasSemanticColor.type.disabled,
      disabledBackground: atlasSemanticColor.action.primary.disabled,
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

export default theme;
