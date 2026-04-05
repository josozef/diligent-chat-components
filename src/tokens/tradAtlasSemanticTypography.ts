/**
 * Trad Atlas — semantic typography (Foundation → Trad Atlas).
 *
 * Source of truth: Figma file Foundation—Trad Atlas, frame "Semantic typography"
 * (node 33011:5716). **Typography/** entries are primitive variables; **Semantic/Font/**
 * entries match the Atlas column of the semantic grid.
 *
 * Verified via Figma MCP (variable_defs + get_design_context): Inter for text styles;
 * numeric values match Typography/Text/Md, Text/Sm, Title/H3 Lg, Title/H4 Md bindings.
 *
 * Do not add parallel MUI or ad-hoc typography scales here — extend only by adding
 * rows that exist in Figma, then record deviations in TypographyChangeLog.md.
 */

import type { SystemStyleObject } from "@mui/system";
import type { Theme } from "@mui/material/styles";

import { atlasFontFamily, atlasFontWeight } from "./atlasLight";

/** Figma Typography/* primitives — resolved CSS (Atlas column uses Semantic/Font → these). */
export const TYPOGRAPHY_PRIMITIVE: Record<string, SystemStyleObject<Theme>> = {
  "Typography/Text/Md": {
    fontFamily: atlasFontFamily,
    fontSize: "14px",
    lineHeight: "18px",
    letterSpacing: "0.2px",
  },
  "Typography/Text/Sm": {
    fontFamily: atlasFontFamily,
    fontSize: "12px",
    lineHeight: "16px",
    letterSpacing: "0.3px",
  },
  "Typography/Text/Lg": {
    fontFamily: atlasFontFamily,
    fontSize: "16px",
    lineHeight: "24px",
    letterSpacing: "0.2px",
  },
  "Typography/Text/Label Md": {
    fontFamily: atlasFontFamily,
    fontSize: "13px",
    lineHeight: "17px",
    letterSpacing: "0.2px",
  },
  "Typography/Text/Label Md Compact": {
    fontFamily: atlasFontFamily,
    fontSize: "13px",
    lineHeight: "16px",
    letterSpacing: "0.2px",
  },
  "Typography/Text/Micro": {
    fontFamily: atlasFontFamily,
    fontSize: "11px",
    lineHeight: "14px",
    letterSpacing: "0.2px",
  },
  "Typography/Text/Xs": {
    fontFamily: atlasFontFamily,
    fontSize: "10px",
    lineHeight: "13px",
    letterSpacing: "0.5px",
  },
  "Typography/Title/H1 Billboard": {
    fontFamily: atlasFontFamily,
    fontSize: "30px",
    lineHeight: "38px",
    letterSpacing: "-0.3px",
  },
  "Typography/Title/H2 Display": {
    fontFamily: atlasFontFamily,
    fontSize: "26px",
    lineHeight: "34px",
    letterSpacing: "0",
  },
  "Typography/Title/H3 Lg": {
    fontFamily: atlasFontFamily,
    fontSize: "22px",
    lineHeight: "28px",
    letterSpacing: "0",
  },
  "Typography/Title/H4 Md": {
    fontFamily: atlasFontFamily,
    fontSize: "18px",
    lineHeight: "28px",
    letterSpacing: "0.2px",
  },
  "Typography/Title/H5 Sm": {
    fontFamily: atlasFontFamily,
    fontSize: "16px",
    lineHeight: "24px",
    letterSpacing: "0.2px",
  },
  "Typography/Title/H6 Xs": {
    fontFamily: atlasFontFamily,
    fontSize: "14px",
    lineHeight: "18px",
    letterSpacing: "0.2px",
  },
};

function prim(name: keyof typeof TYPOGRAPHY_PRIMITIVE): SystemStyleObject<Theme> {
  return TYPOGRAPHY_PRIMITIVE[name];
}

/**
 * Full Figma paths: Semantic/Font/… — Atlas column of the semantic typography grid.
 * Weights follow Figma style names (Regular = 400, Medium = 500, SemiBold = 600).
 */
export const SEMANTIC_FONT_STYLES: Record<string, SystemStyleObject<Theme>> = {
  "Semantic/Font/Text/Md": { ...prim("Typography/Text/Md"), fontWeight: atlasFontWeight.regular },
  "Semantic/Font/Text/Md  - Emphasis": { ...prim("Typography/Text/Md"), fontWeight: atlasFontWeight.semiBold },
  "Semantic/Font/Text/Sm": { ...prim("Typography/Text/Sm"), fontWeight: atlasFontWeight.regular },
  "Semantic/Font/Text/Sm - Emphasis": { ...prim("Typography/Text/Sm"), fontWeight: atlasFontWeight.semiBold },
  "Semantic/Font/Text/Lg": { ...prim("Typography/Text/Lg"), fontWeight: atlasFontWeight.regular },
  "Semantic/Font/Text/Lg - Emphasis": { ...prim("Typography/Text/Lg"), fontWeight: atlasFontWeight.semiBold },
  "Semantic/Font/Text/Label Md": { ...prim("Typography/Text/Label Md"), fontWeight: atlasFontWeight.regular },
  "Semantic/Font/Text/Label Md - Emphasis": { ...prim("Typography/Text/Label Md"), fontWeight: atlasFontWeight.semiBold },
  "Semantic/Font/Text/Label Md Compact": { ...prim("Typography/Text/Label Md Compact"), fontWeight: atlasFontWeight.regular },
  "Semantic/Font/Text/Micro": { ...prim("Typography/Text/Micro"), fontWeight: atlasFontWeight.regular },
  "Semantic/Font/Text/Micro - Emphasis": { ...prim("Typography/Text/Micro"), fontWeight: atlasFontWeight.semiBold },
  "Semantic/Font/Text/Xs": { ...prim("Typography/Text/Xs"), fontWeight: atlasFontWeight.semiBold },
  "Semantic/Font/Title/H1 Billboard - Emphasis": { ...prim("Typography/Title/H1 Billboard"), fontWeight: atlasFontWeight.semiBold },
  "Semantic/Font/Title/H2 Display - Emphasis": { ...prim("Typography/Title/H2 Display"), fontWeight: atlasFontWeight.semiBold },
  "Semantic/Font/Title/H3 Lg - Emphasis": { ...prim("Typography/Title/H3 Lg"), fontWeight: atlasFontWeight.semiBold },
  "Semantic/Font/Title/H4 Md - Emphasis": { ...prim("Typography/Title/H4 Md"), fontWeight: atlasFontWeight.semiBold },
  "Semantic/Font/Title/H5 Sm - Emphasis": { ...prim("Typography/Title/H5 Sm"), fontWeight: atlasFontWeight.semiBold },
  "Semantic/Font/Title/H6 Xs - Emphasis": { ...prim("Typography/Title/H6 Xs"), fontWeight: atlasFontWeight.semiBold },
  /* ── Project extensions (not in Figma baseline — see TypographyChangeLog.md) ── */
  "Semantic/Font/Text/Md  - Uppercase": { ...prim("Typography/Text/Md"), fontWeight: atlasFontWeight.semiBold, textTransform: "uppercase", letterSpacing: "0.08em" },
  "Semantic/Font/Text/Sm - Uppercase": { ...prim("Typography/Text/Sm"), fontWeight: atlasFontWeight.semiBold, textTransform: "uppercase", letterSpacing: "0.08em" },
};

/** Shorter references in code; `data-semantic-font` still uses the full string via `semanticFont`. */
export const SF = {
  textMd: "Semantic/Font/Text/Md",
  textMdEmphasis: "Semantic/Font/Text/Md  - Emphasis",
  textSm: "Semantic/Font/Text/Sm",
  textSmEmphasis: "Semantic/Font/Text/Sm - Emphasis",
  textLg: "Semantic/Font/Text/Lg",
  textLgEmphasis: "Semantic/Font/Text/Lg - Emphasis",
  labelMd: "Semantic/Font/Text/Label Md",
  labelMdEmphasis: "Semantic/Font/Text/Label Md - Emphasis",
  labelMdCompact: "Semantic/Font/Text/Label Md Compact",
  textMicro: "Semantic/Font/Text/Micro",
  textMicroEmphasis: "Semantic/Font/Text/Micro - Emphasis",
  textXs: "Semantic/Font/Text/Xs",
  titleH1Emphasis: "Semantic/Font/Title/H1 Billboard - Emphasis",
  titleH2Emphasis: "Semantic/Font/Title/H2 Display - Emphasis",
  titleH3Emphasis: "Semantic/Font/Title/H3 Lg - Emphasis",
  titleH4Emphasis: "Semantic/Font/Title/H4 Md - Emphasis",
  titleH5Emphasis: "Semantic/Font/Title/H5 Sm - Emphasis",
  titleH6Emphasis: "Semantic/Font/Title/H6 Xs - Emphasis",
  textMdUppercase: "Semantic/Font/Text/Md  - Uppercase",
  textSmUppercase: "Semantic/Font/Text/Sm - Uppercase",
} as const;

export type SemanticFontPath = (typeof SF)[keyof typeof SF];

export function semanticFontStyle(path: SemanticFontPath): SystemStyleObject<Theme> {
  return SEMANTIC_FONT_STYLES[path];
}

export const DATA_SEMANTIC_FONT = "data-semantic-font" as const;
