# TypographyChangeLog

Chronological record of **intentional** changes to Trad Atlas typography after the initial baseline (Semantic typography grid, Atlas column — see `tradAtlasSemanticTypography.ts`).

| Date | Change | Rationale |
|------|--------|-----------|
| _Baseline_ | Introduced `tradAtlasSemanticTypography.ts` as the single source for `Semantic/Font/*` and `data-semantic-font` on text and style-inheriting containers. | Align app with Foundation — Trad Atlas; remove parallel `atlasTypography` / MUI variant scales as sources of truth. |

| 2026-04-04 | Added `Semantic/Font/Text/Md  - Uppercase` and `Semantic/Font/Text/Sm - Uppercase`. Built from their respective `- Emphasis` tokens (SemiBold) with `text-transform: uppercase` and `letter-spacing: 0.08em`. | KPI stat labels, trend tile labels, table column headers, activity category tags, and eyebrow labels benefit from an all-caps treatment to create visual hierarchy contrast against body copy. These tokens do not exist in the Figma baseline grid. |

| 2026-04-04 | Tightened line-height on primitives where lineHeight ≤ 20px to cap at ≤ 1.3× font size. `Text/Md` 20→18px, `Label Md` 20→17px, `Xs` 14→13px, `Title/H6 Xs` 20→18px. | Reduce excess leading on small type to produce tighter, more polished blocks — especially noticeable when text wraps to multiple lines. |

_Add new rows below when you deliberately diverge from Figma or adjust token mappings._
