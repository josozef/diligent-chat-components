# Non-Atlas UI Element Audit

**Date:** April 5, 2026
**Scope:** All files in `src/pages/corpsec/`, `src/components/`, `src/App.tsx`
**Atlas bundle:** `@diligentcorp/atlas-react-bundle`

---

## Executive summary

The codebase uses Atlas bundle icons correctly throughout, but all UI components are imported from vanilla MUI rather than the Atlas-themed re-exports. Two critical structural gaps exist:

1. **`GlobalHeader`** is entirely custom instead of using the Atlas `global-nav` module.
2. **`<AppLayout>`** from the bundle is not used, meaning `useTheme()` tokens/presets are unavailable — the app relies on a custom `DemoContext` + `useTokens()` hook instead.

Until the Atlas MCP server is enabled in Cursor (it is configured in `.cursor/mcp.json` but not currently active), we cannot confirm which specific Atlas component variants are available for Button, Chip, TextField, Progress, Card, etc. **Enabling the Atlas MCP server is a prerequisite for the retrofit phase.**

---

## Critical gaps

### 1. GlobalHeader — should use Atlas Global Nav

| | |
|---|---|
| **File** | `src/pages/corpsec/GlobalHeader.tsx` |
| **Issue** | Entirely custom header built from MUI `Box`, `Stack`, `IconButton`, `Menu`, `MenuItem` |
| **Guidance** | AGENTS.md documents `@diligentcorp/atlas-react-bundle/global-nav` as the import path |
| **Recommendation** | Replace with Atlas `GlobalNav` component. Highest-priority retrofit (app shell chrome visible on every page) |
| **Hard-coded colors** | `#16a34a` (logo background), `#fff`, `rgba(0,0,0,0.12)` |

### 2. AppLayout not used

| | |
|---|---|
| **File** | `src/App.tsx` |
| **Issue** | AGENTS.md says `<AppLayout>` from the bundle wires the theme provider and MUI-X Pro license. App uses custom `DemoContext` + `useTokens()` instead |
| **Recommendation** | Wrap app in `<AppLayout>` so `useTheme()` tokens/presets work natively. This unlocks all Atlas theme tokens and removes the need for the custom token hook |

---

## MUI components used directly

These are imported from `@mui/material` rather than the Atlas bundle. Atlas applies heavy theming via `<AppLayout>`, so once AppLayout is adopted, these will automatically pick up Atlas styling. Some may also have Atlas-specific wrapper components.

| MUI Component | Files | Notes |
|---|---|---|
| `Button` | WorkPanel, StatusPanel, ConfigureApproversTabs, CollectAppointmentDataTabs, BoardResolutionEditor, ConsentToActEditor, CorpSecCommandCenter, DemoControlsFab, SuggestionChip, TertiaryButton | Atlas themes MUI Button; likely fine once under AppLayout. Verify Atlas-specific variants/presets via MCP |
| `Chip` | WorkPanel, ConfigureApproversTabs, CollectAppointmentDataTabs, CorpSecCommandCenter, SectionHeader | Check Atlas MCP for Atlas-specific Chip or Badge component |
| `IconButton` | WorkspaceHeader, ConfigureApproversTabs, RichDocumentToolbarButton, GlobalHeader, DemoControlsFab, FeedbackBar, MessageBubble, TertiaryIconButton | Atlas themes MUI IconButton; likely fine |
| `LinearProgress` | StatusPanel, WorkPanel, CorpSecCommandCenter | Check Atlas MCP for progress components |
| `CircularProgress` | WorkPanel, StatusSubstepRow | Check Atlas MCP |
| `TextField` | AtlasTextField (wrapper) | Atlas may have its own TextField; currently using MUI + heavy sx override |
| `InputBase` | ChatPrompt | Custom chat input; Atlas may have a search/input component |
| `Collapse` | ConfigureApproversTabs, ThinkingPanel | Standard MUI utility; no Atlas replacement expected |
| `Tooltip` | RichDocumentToolbarButton | Atlas may theme this; check MCP |
| `Typography` | TradAtlasText (wrapper) | Atlas bundle likely has its own text approach via `useTheme()` tokens |
| `Menu` / `MenuItem` | GlobalHeader | Will go away with GlobalNav retrofit |
| `Fab` | DemoControlsFab | Demo chrome only; no retrofit needed |
| `Popover` | DemoControlsFab | Demo chrome only; no retrofit needed |
| `Divider` | CorpSecCommandCenter, TipTapEditorShell, GlobalHeader | Standard MUI; likely fine |
| `Box` | Nearly every file | Standard MUI layout primitive; fine |
| `Stack` | GlobalHeader, DemoControlsFab, ChatThread | Standard MUI layout; fine |

---

## Custom components (potential Atlas equivalents)

| Custom Component | Location | Notes |
|---|---|---|
| `TradAtlasText` | `src/components/common/TradAtlasText.tsx` | Wraps MUI `Typography` + semantic font tokens. Atlas bundle likely has its own text/typography approach via `useTheme()` tokens. May need alignment after AppLayout adoption |
| `AtlasFormField` | `src/components/form/AtlasFormField.tsx` | Uses native `<input>`, not MUI TextField. Built to match Figma spec "label-above" pattern. Atlas bundle may have a form field component; check MCP |
| `AtlasTextField` | `src/components/form/AtlasTextField.tsx` | Wraps MUI `TextField` with heavy `sx` overrides. Atlas bundle TextField would already be themed under AppLayout |
| `TertiaryButton` | `src/components/common/TertiaryButton.tsx` | Custom button variant using MUI `Button`. Atlas Button with `variant="text"` or a specific Atlas variant likely covers this |
| `TertiaryIconButton` | `src/components/common/TertiaryIconButton.tsx` | Same as above for icon buttons |
| `SuggestionChip` | `src/components/common/SuggestionChip.tsx` | Custom chip/button hybrid. Atlas Chip or Button variants may cover this |
| `ContentCard` | `src/components/common/ContentCard.tsx` | Atlas may have Card/Surface components. Check MCP |
| All AI components | `src/components/ai/` | Fully custom (ChatPrompt, MessageBubble, ThinkingPanel, etc.). No Atlas equivalent expected — these are domain-specific |

---

## Extracted shared components (this sprint)

The following were extracted from inline/duplicated definitions to shared locations:

| Component | Path | Extracted from |
|---|---|---|
| `ContentCard` | `src/components/common/ContentCard.tsx` | CorpSecCommandCenter, WorkPanel |
| `IdeTabs` + `AtlasTabButton` | `src/components/common/IdeTabs.tsx` | CollectAppointmentDataTabs, ConfigureApproversTabs |
| `SectionHeader` | `src/components/common/SectionHeader.tsx` | WorkPanel (StepHeader), ConfigureApproversTabs, CollectAppointmentDataTabs |
| `DetailRow` | `src/components/common/DetailRow.tsx` | WorkPanel |
| `StatusSubstepRow` | `src/components/common/StatusSubstepRow.tsx` | WorkPanel (3 step pages), StatusPanel |
| `RichDocumentToolbarButton` | `src/components/common/RichDocumentToolbarButton.tsx` | ConsentToActEditor, BoardResolutionEditor |
| `TipTapEditorShell` | `src/components/editor/TipTapEditorShell.tsx` | ConsentToActEditor, BoardResolutionEditor |
| `WorkspaceRailHeader` | `src/components/common/WorkspaceRailHeader.tsx` | ChatPanel |

---

## Hard-coded colors

### Application styling (should be replaced with tokens)

| File | Line(s) | Value | Context |
|---|---|---|---|
| `GlobalHeader.tsx` | ~42 | `#16a34a` | Logo background — should use a brand token |
| `GlobalHeader.tsx` | ~46, 49 | `#fff`, `rgba(0,0,0,0.12)` | Text color and divider |
| `IdeTabs.tsx` | ~55 | `#e6e6e6` | `&:active` background on tab button |
| `SectionHeader.tsx` | ~43 | `#fff` | Chip text color |
| `ChatPrompt.tsx` | ~44 | `rgba(0,0,0,0.3)`, `rgba(36,38,40,0.07)` | Box shadow |
| `TipTapEditorShell.tsx` | ~92, 99, 103 | `#f8f8f8`, `#fff`, `rgba(0,0,0,0.06)` | Paper surface background |

### Document template HTML (acceptable — render-only)

| File | Context |
|---|---|
| `BoardResolutionEditor.tsx` | `#1a1a1a`, `#bbb`, `#fff`, `#999`, `#888`, `#666` in HTML template strings |
| `ConsentToActEditor.tsx` | Same set of colors in Form 45 HTML template strings |

### Demo chrome (acceptable — not production code)

| File | Context |
|---|---|
| `DemoControlsFab.tsx` | Emerald hex palette for FAB: `#d1fae5`, `#064e3b`, `#10b981`, etc. |

---

## Inline SVG

| File | Location | Description |
|---|---|---|
| `CorpSecCommandCenter.tsx` | ~820–829 | Raw `<svg>` + `<polyline>` for sparkline trend charts in `OperationalTrends` section |

AGENTS.md allows third-party chart libraries for charts. If more personas need charts, consider adopting a lightweight library (e.g., Recharts).

---

## Recommended action sequence

| Priority | Action | Blocker |
|---|---|---|
| **P0** | Enable the Atlas MCP server in Cursor's MCP settings so component docs can be queried | User action required |
| **P1** | Retrofit `GlobalHeader` → Atlas `GlobalNav` from `@diligentcorp/atlas-react-bundle/global-nav` | Atlas MCP needed for API reference |
| **P2** | Adopt `<AppLayout>` in `App.tsx` to get native `useTheme()` tokens and auto-themed MUI | Architecture change — may affect DemoContext |
| **P3** | Query Atlas MCP for Button, Chip, TextField, Progress, Card component docs | P0 |
| **P4** | Replace `TertiaryButton` / `TertiaryIconButton` / `SuggestionChip` with Atlas Button variants (if available) | P3 |
| **P5** | Replace `AtlasTextField` with Atlas bundle TextField (if available) | P3 |
| **P6** | Evaluate replacing `TradAtlasText` with Atlas typography approach | P2 |
| **P7** | Replace hard-coded colors with design tokens | P2 |
| **P8** | Consider chart library for sparklines in CorpSecCommandCenter | Nice to have |
