import { useCallback, useRef, useState } from "react";
import { Box, Button } from "@mui/material";
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

interface Form45Data {
  companyName: string;
  companyUen: string;
  appointeeName: string;
  appointeeNric: string;
  appointeeNationality: string;
  appointeeAddress: string;
  effectiveDate: string;
}

const FIELD = 'style="border-bottom: 1.5px solid #1a1a1a; padding: 0 4px 1px; min-width: 120px; display: inline-block;"';
const FIELD_WIDE = 'style="border-bottom: 1.5px solid #1a1a1a; padding: 0 4px 1px; min-width: 280px; display: inline-block;"';
const FIELD_FULL = 'style="border-bottom: 1.5px solid #1a1a1a; padding: 0 4px 1px; width: 100%; display: inline-block; margin-top: 4px;"';
const BLANK = 'style="border-bottom: 1.5px solid #999; padding: 0 4px 1px; min-width: 200px; display: inline-block; color: #888; font-style: italic;"';
const SIG_BOX = 'style="border: 1.5px solid #1a1a1a; min-height: 64px; padding: 12px; margin-top: 4px; display: block;"';
const PAGE_BREAK = 'style="border: none; border-top: 2px dashed #bbb; margin: 36px 0; position: relative;"';
const PAGE_LABEL = 'style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #fff; padding: 0 12px; font-size: 11px; color: #999; letter-spacing: 0.5px;"';

function val(v: string, placeholder = "") {
  if (v) return `<span ${FIELD}>${v}</span>`;
  return `<span ${BLANK}>${placeholder || "&nbsp;"}</span>`;
}

function valWide(v: string, placeholder = "") {
  if (v) return `<span ${FIELD_WIDE}>${v}</span>`;
  return `<span ${BLANK}>${placeholder || "&nbsp;"}</span>`;
}

function buildForm45Html(d: Form45Data): string {
  const todayParts = new Date();
  const day = todayParts.getDate().toString();
  const month = todayParts.toLocaleDateString("en-SG", { month: "long" });
  const year = todayParts.getFullYear().toString();

  return `
<h2 style="text-align: center; margin-bottom: 2px;">CONSENT TO ACT AS DIRECTOR</h2>
<p style="text-align: center; margin-bottom: 24px;"><em>(Pursuant to Section 145(5) of the Companies Act, Cap. 50)</em></p>

<p><strong>Name of Company:</strong><br>${val(d.companyName)}</p>

<p><strong>Company No.:</strong><br>${val(d.companyUen)}</p>

<hr>

<p>I, the undermentioned person, declare that:</p>

<p><strong>(a)</strong>&nbsp; I consent to act as a director of the abovementioned company with effect from ${val(d.effectiveDate, "[date to be confirmed]")} (date).</p>

<p><strong>(b)</strong>&nbsp; I shall be personally responsible for the discharge of all obligations attached to the company under the Companies Act.</p>

<p><strong>(c)</strong>&nbsp; I am not disqualified from acting as a director, in that:</p>

<p style="padding-left: 28px;"><strong>(i)</strong>&nbsp; I am at least 18 years of age, of full capacity and not an undischarged bankrupt in Singapore or any foreign jurisdiction;</p>

<p style="padding-left: 28px;"><strong>(ii)</strong>&nbsp; There is no disqualification order made by the High Court of Singapore against me currently in force;</p>

<p style="padding-left: 28px;"><strong>(iii)</strong>&nbsp; Within a period of 5 years preceding the date of this statement, I have —</p>

<p style="padding-left: 56px;"><strong>(A)</strong>&nbsp; not been convicted, in Singapore or elsewhere, of any offence involving fraud or dishonesty punishable with imprisonment for 3 months or more;**</p>

<p style="padding-left: 56px;"><strong>(B)</strong>&nbsp; not been convicted of 3 or more offences under the Companies Act relating to the requirements of:</p>

<p style="padding-left: 84px;">a.&nbsp; filing any returns, accounts or other documents with the Registrar of Companies, or</p>

<p style="padding-left: 84px;">b.&nbsp; giving notice of any matter to the Registrar of Companies;</p>

<p style="padding-left: 56px;">and</p>

<p style="padding-left: 56px;"><strong>(C)</strong>&nbsp; not had 3 or more orders of the High Court of Singapore made against me in relation to such requirements in (B).</p>

<p style="padding-left: 28px;"><strong>(iv)</strong>&nbsp; I am not disqualified under the Limited Liability Partnerships Act from being a manager of a limited liability partnership.</p>

<p><strong>(d)</strong>&nbsp; *I have read and understood the above statements / the above statements were interpreted to me in</p>

<p>${valWide("English", "[state language/dialect]")}</p>

<p>by ${valWide("—", "[state name]")}</p>

<p>NRIC NO: ${valWide("—", "[NRIC of interpreter]")}</p>

<p>before I executed this form and I confirm that the statements are true. I am also aware that I can be prosecuted in Court if I willingly give any information on this form which is false.</p>

<div ${PAGE_BREAK}><span ${PAGE_LABEL}>PAGE 1 OF 2</span></div>

<h3 style="margin-bottom: 16px;">Particulars of Director</h3>

<p><strong>Name:</strong><br><span ${FIELD_FULL}>${d.appointeeName}</span></p>

<p><strong>Address:</strong><br><span ${FIELD_FULL}>${d.appointeeAddress}</span></p>

<p><strong>*NRIC / Passport No.:</strong><br><span ${FIELD_FULL}>${d.appointeeNric || "<em>[To be provided — enter in Appointee Details tab]</em>"}</span></p>

<p><strong>Nationality:</strong><br><span ${FIELD_FULL}>${d.appointeeNationality}</span></p>

<p><strong>Signature:</strong></p>
<div ${SIG_BOX}><em style="color: #888;">[ Electronic signature to be captured upon submission ]</em></div>

<p style="margin-top: 20px;">Dated this ${val(day)} day of ${val(month)}, ${val(year)}</p>

<hr>

<p style="font-size: 12px; color: #666;">*Delete as appropriate.</p>
<p style="font-size: 12px; color: #666;">** Where the disqualified person is sentenced to imprisonment, the disqualification takes effect on conviction and continues for a period of 5 years after release from prison.</p>

<div ${PAGE_BREAK}><span ${PAGE_LABEL}>PAGE 2 OF 2</span></div>

<h3 style="text-align: center; margin-bottom: 4px;">Form 45 — Continuation Sheet 1</h3>

<p><strong>Name of Company:</strong><br>${val(d.companyName)}</p>

<p><strong>Company No.:</strong><br>${val(d.companyUen)}</p>

<p style="margin-top: 20px;"><em style="color: #888;">[ No additional directors on this filing. ]</em></p>
`;
}


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

  const form45Data: Form45Data = {
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
      content: buildForm45Html(form45Data),
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", height: "100%" }}>
      <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.default }}>
        Review and edit the <strong>Consent to Act as Director (Form 45)</strong> below. All known
        particulars of <strong>{appointeeName}</strong> and <strong>Pacific Polymer Logistics Pte. Ltd.</strong> have
        been pre-filled. Editable fields are shown with an underline. You may edit any field directly,
        replace the document entirely, or send it for electronic signature once ready.
      </TradAtlasText>

      {editor ? <TipTapEditorShell editor={editor} /> : null}

      {importNote ? (
        <TradAtlasText semanticFont={SF.textSm} sx={{ color: color.type.muted }}>
          {importNote}
        </TradAtlasText>
      ) : null}

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", flexShrink: 0 }}>
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
      </Box>
    </Box>
  );
}
