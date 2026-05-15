import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";

import TradAtlasText from "@/components/common/TradAtlasText";
import TipTapEditorShell from "@/components/editor/TipTapEditorShell";
import { SF } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

import {
  buildForm45NotificationHtml,
  type Form45NotificationData,
} from "../../documentTemplates";

export default function Form45NotificationEditor(props: Form45NotificationData) {
  const { color } = useTokens();
  const { companyName, appointeeName } = props;

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
        Underline,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        Placeholder.configure({
          placeholder: "Edit the notification before lodgement…",
        }),
      ],
      content: buildForm45NotificationHtml(props),
    },
    [appointeeName, companyName],
  );

  if (!editor) return null;

  const header = (
    <TradAtlasText
      semanticFont={SF.textMd}
      sx={{ color: color.type.default, maxWidth: 820 }}
    >
      The <strong>Notification of Change of Director (Form 45)</strong> is
      lodged with ACRA via BizFile+ within 14 days of the change. The agent
      auto-prepares this filing once the board resolution is approved — review
      below before electronic submission.
    </TradAtlasText>
  );

  const exportFileName = `Form 45 Notification - ${companyName} - ${appointeeName}`;

  return (
    <TipTapEditorShell
      editor={editor}
      header={header}
      documentTitle={`Form 45 — Notification of Change of Director (${companyName})`}
      exportFileName={exportFileName}
    />
  );
}
