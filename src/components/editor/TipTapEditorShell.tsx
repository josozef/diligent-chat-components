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
 * Provides the outer frame, standard formatting toolbar, and paper-on-grey
 * editor surface used by both the Consent-to-Act and Board Resolution editors.
 *
 * Pass `extraToolbar` to append additional buttons after the standard set.
 */
export default function TipTapEditorShell({
  editor,
  extraToolbar,
}: {
  editor: Editor;
  extraToolbar?: React.ReactNode;
}) {
  const { color, radius } = useTokens();

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
        border: `1px solid ${color.outline.default}`,
        borderRadius: radius.lg,
        background: color.surface.default,
        overflow: "hidden",
      }}
    >
      {/* Toolbar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "2px",
          flexWrap: "wrap",
          px: "10px",
          py: "6px",
          borderBottom: `1px solid ${color.outline.fixed}`,
          background: color.surface.subtle,
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

      {/* Paper-on-grey editor surface */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          px: "32px",
          py: "24px",
          background: "#f8f8f8",
          "& .tiptap": {
            outline: "none",
            ...semanticFontStyle(SF.textMd),
            color: color.type.default,
            maxWidth: 720,
            mx: "auto",
            background: "#fff",
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
    </Box>
  );
}
