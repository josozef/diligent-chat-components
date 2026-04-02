/**
 * Atlas Design System — **Atlas Light** semantic tokens (resolved).
 *
 * Sourced from the Atlas token registry (`theme: atlas-light`), aligned with
 * [Foundation — Atlas Lens](https://www.figma.com/design/t9rSYPySbTWytcGTu7D1zl/Foundation---Atlas-Lens?node-id=36-399).
 *
 * Core palette references are resolved to hex/RGBA here so the app does not
 * depend on runtime token resolution.
 *
 * **Typography family:** Figma semantic tokens reference Plus Jakarta Sans; this
 * app’s MUI theme uses **Inter** as the product standard—sizes and weights below
 * still match Atlas semantic steps.
 */

/** Core spacing scale (Foundation → core.spacing) */
export const atlasCoreSpacing = {
  px: "1px",
  "0": "0px",
  "0_25": "2px",
  "0_5": "4px",
  "1": "8px",
  "1_5": "12px",
  "2": "16px",
  "2_5": "20px",
  "3": "24px",
  "4": "32px",
  "4_5": "36px",
  "5": "40px",
  "6": "48px",
  "7": "56px",
  "8": "64px",
  "9": "72px",
} as const;

/** Semantic radius → resolved from core.spacing (Atlas Light) */
export const atlasSemanticRadius = {
  none: "0px",
  sm: atlasCoreSpacing["0_5"], // 4px
  md: atlasCoreSpacing["1"], // 8px
  lg: atlasCoreSpacing["1_5"], // 12px
  xl: atlasCoreSpacing["3"], // 24px
  "2xl": atlasCoreSpacing["4_5"], // 36px
  full: "9999px",
} as const;

/** Core font weights */
export const atlasFontWeight = {
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
} as const;

/**
 * Semantic colors — Atlas Light resolved values.
 * Names mirror Figma variable paths: `semantic/color/...`
 */
export const atlasSemanticColor = {
  background: {
    base: "#ffffff",
    container: "#faf3f7",
    backdrop: "#282e3750",
    baseGradientStart: "#f9f9fc",
    baseGradientEnd: "#fcfcff",
  },
  surface: {
    default: "#ffffff",
    variant: "#f0f0f3",
    /**
     * semantic.color.surface.subtle (Atlas Light) — Figma: Color/Surface/Variant Subtle.
     * Registry: `--lens-semantic-color-surface-subtle: #f9f9fc`
     */
    subtle: "#f9f9fc",
    inverse: "#ffffff",
  },
  type: {
    default: "#242628",
    muted: "#5d5e61",
    disabled: "#aaabae",
    inverse: "#1a1c1e",
  },
  outline: {
    fixed: "#e2e2e5",
    default: "#8f9193",
    hover: "#515255",
    active: "#0f1113",
    disabled: "#e2e2e5",
    /** Trad Atlas chip/outline.static; use `fixed` for pure Atlas Light surfaces */
    static: "#dadada",
  },
  action: {
    primary: {
      default: "#0040d5",
      hover: "#4069fe",
      active: "#002585",
      disabled: "#e2e2e5",
      onPrimary: "#ffffff",
      onPrimaryDisabled: "#aaabae",
    },
    secondary: {
      onSecondary: "#242628",
      onSecondaryDisabled: "#aaabae",
      outline: "#76777a",
      disabledOutline: "#e2e2e5",
      hoverFill: "#f0f0f3",
      activeFill: "#8f9193",
    },
    destructive: {
      default: "#be0c1e",
      onDestructive: "#ffffff",
    },
    link: {
      default: "#1c4ee4",
      hover: "#4069fe",
      active: "#002585",
      disabled: "#e2e2e5",
    },
  },
  status: {
    success: {
      default: "#2ec377",
      text: "#005f35",
      background: "#c2ffd2",
    },
    warning: {
      default: "#fee400",
      text: "#5d5300",
      background: "#fff2aa",
    },
    error: {
      default: "#be0c1e",
      text: "#a90016",
      background: "#ffedeb",
    },
    notification: {
      default: "#1c4ee4",
      text: "#19519d",
      background: "#ecf0ff",
    },
  },
} as const;

/** Typography: sizes from semantic.font.* (Atlas); family overridden in theme to Inter */
export const atlasTypography = {
  fontSize: {
    body: "1rem",
    md: "0.875rem",
    sm: "0.75rem",
    h1Billboard: "1.875rem",
    h2Display: "1.625rem",
    h3Lg: "1.375rem",
    h4Md: "1.125rem",
    h5Sm: "1rem",
    h6Xs: "0.875rem",
  },
  lineHeight: {
    body: "1.5rem",
    md: "1.25rem",
    sm: "1rem",
    h1Billboard: "2.375rem",
    h2Display: "2.125rem",
    h3Lg: "1.75rem",
    h4Md: "1.75rem",
    h5Sm: "1.5rem",
    h6Xs: "1.25rem",
  },
} as const;
