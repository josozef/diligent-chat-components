import { useCallback, useRef, useState } from "react";
import { Button } from "@mui/material";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import {
  UploadFileOutlinedIcon,
  SendOutlinedIcon,
  CheckCircleIcon,
} from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import TipTapEditorShell from "@/components/editor/TipTapEditorShell";
import { SF } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";
import { buildForm45ConsentHtml } from "./documentTemplates";


export default function ConsentToActEditor({
  appointeeName,
  appointeeNric,
  effectiveDate,
  onReplaceDocument,
  onSendForSignature,
  signatureSent,
}: {
  appointeeName: string;
  appointeeNric?: string | null;
  effectiveDate?: string | null;
  onReplaceDocument: (file: File) => void;
  onSendForSignature: () => void;
  signatureSent: boolean;
}) {
  const { color, weight } = useTokens();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importNote, setImportNote] = useState<string | null>(null);

  const form45Data = {
    companyName: "Pacific Polymer Logistics Pte. Ltd.",
    companyUen: "201812345K",
    appointeeName,
    appointeeNric: appointeeNric ?? "",
    appointeeNationality: "Singaporean",
    appointeeAddress: "14 Nassim Road, #08-02, Singapore 258395",
    effectiveDate: effectiveDate ?? "",
  };

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          heading: { levels: [2, 3, 4] },
        }),
        Underline,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        Placeholder.configure({
          placeholder: "Edit the consent form or paste your own wording…",
        }),
      ],
      content: buildForm45ConsentHtml(form45Data),
    },
    [appointeeName],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (!f || !editor) {
        e.target.value = "";
        return;
      }
      onReplaceDocument(f);
      const lower = f.name.toLowerCase();
      if (lower.endsWith(".txt") || lower.endsWith(".html") || lower.endsWith(".htm")) {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            editor.commands.setContent(reader.result);
            setImportNote(`Loaded "${f.name}" into the editor.`);
          }
        };
        reader.readAsText(f);
      } else {
        setImportNote(
          `Attached "${f.name}" as the consent document. Binary files cannot be previewed in the editor — the original Form 45 template is still shown for reference.`,
        );
      }
      e.target.value = "";
    },
    [editor, onReplaceDocument],
  );

  const header = (
    <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.default, maxWidth: 820 }}>
      Review and edit the <strong>Consent to Act as Director (Form 45)</strong> below. All known
      particulars of <strong>{appointeeName}</strong> and <strong>Pacific Polymer Logistics Pte. Ltd.</strong> have
      been pre-filled. Editable fields are shown with an underline. You may edit any field directly,
      replace the document entirely, or send it for electronic signature once ready.
    </TradAtlasText>
  );

  const footer = (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.html,.htm"
        hidden
        onChange={handleFileChange}
      />
      <Button
        variant="outlined"
        color="inherit"
        size="small"
        startIcon={<UploadFileOutlinedIcon sx={{ fontSize: 18 }} />}
        onClick={() => fileInputRef.current?.click()}
        sx={{ textTransform: "none", borderColor: color.outline.fixed }}
      >
        Replace with my document
      </Button>

      {signatureSent ? (
        <Button
          variant="contained"
          color="success"
          size="small"
          startIcon={<CheckCircleIcon sx={{ fontSize: 18 }} />}
          disabled
          sx={{ textTransform: "none", fontWeight: weight.semiBold }}
        >
          Sent for signature
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<SendOutlinedIcon sx={{ fontSize: 18 }} />}
          onClick={onSendForSignature}
          sx={{ textTransform: "none", fontWeight: weight.semiBold }}
        >
          Send to {appointeeName.split(" ")[0] ?? appointeeName} for signature
        </Button>
      )}

      {importNote ? (
        <TradAtlasText
          semanticFont={SF.textSm}
          sx={{ color: color.type.muted, flexBasis: "100%" }}
        >
          {importNote}
        </TradAtlasText>
      ) : null}
    </>
  );

  if (!editor) {
    return null;
  }

  const exportFileName = `Consent to Act - ${appointeeName}`;

  return (
    <TipTapEditorShell
      editor={editor}
      header={header}
      footer={footer}
      documentTitle={`Consent to Act as Director — ${appointeeName}`}
      exportFileName={exportFileName}
    />
  );
}
