/**
 * Atlas Design System — **Atlas Dark** semantic tokens (resolved).
 *
 * Dark-mode counterparts for every token in `atlasLight.ts`.
 * Derived from the Foundation — Trad Atlas Figma file
 * (https://www.figma.com/design/fAuIT7LY3ZqRZqTmbPU8p7/Foundation---Trad-Atlas?node-id=130-50)
 * following the Atlas semantic variable structure with dark-mode value mappings.
 */

import {
  atlasCoreSpacing,
  atlasSemanticRadius,
  atlasFontWeight,
  atlasTypography,
} from "./atlasLight";

export {
  atlasCoreSpacing,
  atlasSemanticRadius,
  atlasFontWeight,
  atlasTypography,
};

export const atlasSemanticColorDark = {
  background: {
    base: "#0f1113",
    container: "#1a1c20",
    backdrop: "#000000cc",
    baseGradientStart: "#121416",
    baseGradientEnd: "#16181c",
  },
  surface: {
    default: "#1c1e22",
    variant: "#26282e",
    subtle: "#16181c",
    inverse: "#1c1e22",
  },
  type: {
    default: "#e8e9eb",
    muted: "#8e9093",
    disabled: "#56585b",
    inverse: "#e8e9eb",
  },
  outline: {
    fixed: "#2e3036",
    default: "#5d5f63",
    hover: "#8e9093",
    active: "#e8e9eb",
    disabled: "#2e3036",
    static: "#3a3c42",
  },
  action: {
    primary: {
      default: "#4069fe",
      hover: "#5a80ff",
      active: "#2952d9",
      disabled: "#2e3036",
      onPrimary: "#ffffff",
      onPrimaryDisabled: "#56585b",
    },
    secondary: {
      onSecondary: "#e8e9eb",
      onSecondaryDisabled: "#56585b",
      outline: "#5d5f63",
      disabledOutline: "#2e3036",
      hoverFill: "#26282e",
      activeFill: "#5d5f63",
    },
    destructive: {
      default: "#ff4d5e",
      onDestructive: "#ffffff",
    },
    link: {
      default: "#5a80ff",
      hover: "#7a9cff",
      active: "#4069fe",
      disabled: "#2e3036",
    },
  },
  status: {
    success: {
      default: "#2ec377",
      text: "#5ae89a",
      background: "#0d2e1c",
    },
    warning: {
      default: "#fee400",
      text: "#fee400",
      background: "#2e2a0d",
    },
    error: {
      default: "#ff4d5e",
      text: "#ff6b78",
      background: "#2e0d12",
    },
    notification: {
      default: "#5a80ff",
      text: "#7a9cff",
      background: "#0d1a2e",
    },
  },
} as const;
