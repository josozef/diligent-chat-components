import type { ReactNode } from "react";
import { Box, Divider } from "@mui/material";
import { EditorContent, type Editor } from "@tiptap/react";
import {
  FormatBoldIcon,
  FormatItalicIcon,
  FormatUnderlinedIcon,
  FormatListBulletedIcon,
  FormatListNumberedIcon,
  UndoIcon,
  RedoIcon,
  TitleIcon,
  HorizontalRuleIcon,
  FormatClearIcon,
} from "@/icons";
import RichDocumentToolbarButton from "@/components/common/RichDocumentToolbarButton";
import { SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

const iconSz = { fontSize: 18 } as const;

/**
 * Shared shell for TipTap-based document editors.
 *
 * Layout model — top to bottom, all edge-to-edge:
 *   1. Optional `header` slot for descriptive copy / recipient controls
 *      (rendered on `surface.default`, generous padding).
 *   2. Formatting toolbar (flat — no outer container border, just a thin
 *      bottom divider separating it from the document surface).
 *   3. Document surface — the paper sits centered on `surface.subtle`
 *      with comfortable breathing room on all sides.
 *   4. Optional `footer` slot, pinned with a `surface.default` bar,
 *      top border, for primary/secondary actions.
 *
 * Consumers own what goes in the slots; the shell owns the framing.
 */
export default function TipTapEditorShell({
  editor,
  extraToolbar,
  header,
  footer,
}: {
  editor: Editor;
  extraToolbar?: ReactNode;
  /**
   * Descriptive copy, recipient controls, or anything else that belongs
   * above the toolbar. Rendered in a padded white header region.
   */
  header?: ReactNode;
  /**
   * Primary/secondary actions pinned to the bottom of the editor, on
   * `surface.default` with a thin top border.
   */
  footer?: ReactNode;
}) {
  const { color } = useTokens();

  const btnProps = {
    activeColor: color.action.primary.default,
    hoverBg: color.action.secondary.hoverFill,
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        background: color.surface.default,
        overflow: "hidden",
      }}
    >
      {header ? (
        <Box
          sx={{
            flexShrink: 0,
            px: "32px",
            pt: "32px",
            pb: "20px",
            background: color.surface.default,
          }}
        >
          {header}
        </Box>
      ) : null}

      {/* Toolbar — flat, no boxing; just a subtle hairline below */}
      <Box
        sx={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: "2px",
          flexWrap: "wrap",
          px: "24px",
          py: "8px",
          borderBottom: `1px solid ${color.outline.fixed}`,
          background: color.surface.default,
        }}
      >
        <RichDocumentToolbarButton icon={<UndoIcon sx={iconSz} />} label="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()} {...btnProps} />
        <RichDocumentToolbarButton icon={<RedoIcon sx={iconSz} />} label="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()} {...btnProps} />
        <Divider orientation="vertical" flexItem sx={{ mx: "4px" }} />
        <RichDocumentToolbarButton icon={<TitleIcon sx={iconSz} />} label="Heading" active={editor.isActive("heading")} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} {...btnProps} />
        <Divider orientation="vertical" flexItem sx={{ mx: "4px" }} />
        <RichDocumentToolbarButton icon={<FormatBoldIcon sx={iconSz} />} label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} {...btnProps} />
        <RichDocumentToolbarButton icon={<FormatItalicIcon sx={iconSz} />} label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} {...btnProps} />
        <RichDocumentToolbarButton icon={<FormatUnderlinedIcon sx={iconSz} />} label="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} {...btnProps} />
        <Divider orientation="vertical" flexItem sx={{ mx: "4px" }} />
        <RichDocumentToolbarButton icon={<FormatListBulletedIcon sx={iconSz} />} label="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} {...btnProps} />
        <RichDocumentToolbarButton icon={<FormatListNumberedIcon sx={iconSz} />} label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} {...btnProps} />
        <Divider orientation="vertical" flexItem sx={{ mx: "4px" }} />
        <RichDocumentToolbarButton icon={<HorizontalRuleIcon sx={iconSz} />} label="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()} {...btnProps} />
        <RichDocumentToolbarButton icon={<FormatClearIcon sx={iconSz} />} label="Clear formatting" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} {...btnProps} />
        {extraToolbar}
      </Box>

      {/* Paper on surface.subtle — the document floats on a soft tint rather
          than a heavy neutral gray, with extra room above and below. */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          px: "40px",
          py: "40px",
          background: color.surface.subtle,
          "& .tiptap": {
            outline: "none",
            ...semanticFontStyle(SF.textMd),
            color: color.type.default,
            maxWidth: 720,
            mx: "auto",
            background: color.surface.default,
            border: `1px solid ${color.outline.fixed}`,
            borderRadius: "4px",
            padding: "48px 56px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            minHeight: 900,
          },
          "& .tiptap p": { margin: "0 0 12px", lineHeight: 1.7 },
          "& .tiptap p:last-child": { marginBottom: 0 },
          "& .tiptap h2": {
            ...semanticFontStyle(SF.titleH2Emphasis),
            margin: "0 0 4px",
            textAlign: "center",
          },
          "& .tiptap h3": {
            ...semanticFontStyle(SF.titleH4Emphasis),
            margin: "28px 0 12px",
          },
          "& .tiptap h4": {
            ...semanticFontStyle(SF.textMdEmphasis),
            margin: "16px 0 6px",
          },
          "& .tiptap ul, & .tiptap ol": {
            paddingLeft: "28px",
            margin: "0 0 12px",
          },
          "& .tiptap li": {
            marginBottom: "6px",
            lineHeight: 1.7,
          },
          "& .tiptap li > ul, & .tiptap li > ol": {
            marginTop: "4px",
            marginBottom: "4px",
          },
          "& .tiptap hr": {
            border: "none",
            borderTop: `1px solid ${color.outline.fixed}`,
            margin: "24px 0",
          },
          "& .tiptap em": { fontStyle: "italic" },
          "& .tiptap strong": { fontWeight: 600 },
          "& .tiptap .is-editor-empty:first-child::before": {
            content: "attr(data-placeholder)",
            float: "left",
            color: color.type.muted,
            pointerEvents: "none",
            height: 0,
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>

      {footer ? (
        <Box
          sx={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            px: "32px",
            py: "16px",
            background: color.surface.default,
            borderTop: `1px solid ${color.outline.fixed}`,
          }}
        >
          {footer}
        </Box>
      ) : null}
    </Box>
  );
}
