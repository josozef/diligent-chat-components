import { Box, Button } from "@mui/material";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { CheckCircleIcon, GavelOutlinedIcon } from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import TipTapEditorShell from "@/components/editor/TipTapEditorShell";
import { SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

interface ResolutionData {
  companyName: string;
  companyUen: string;
  appointeeName: string;
  appointeeNric: string;
  appointeeAddress: string;
  effectiveDate: string;
  departingDirector: string;
}

const FIELD = 'style="border-bottom: 1.5px solid #1a1a1a; padding: 0 4px 1px; min-width: 120px; display: inline-block;"';
const FIELD_FULL = 'style="border-bottom: 1.5px solid #1a1a1a; padding: 0 4px 1px; width: 100%; display: inline-block; margin-top: 4px;"';
const SIG_BOX = 'style="border: 1.5px solid #1a1a1a; min-height: 56px; padding: 12px; margin-top: 4px; display: block;"';
const PAGE_BREAK = 'style="border: none; border-top: 2px dashed #bbb; margin: 36px 0; position: relative;"';
const PAGE_LABEL = 'style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #fff; padding: 0 12px; font-size: 11px; color: #999; letter-spacing: 0.5px;"';

function val(v: string) {
  return `<span ${FIELD}>${v}</span>`;
}

function buildResolutionHtml(d: ResolutionData): string {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-SG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const effectiveFormatted = d.effectiveDate
    ? new Date(d.effectiveDate + "T00:00:00").toLocaleDateString("en-SG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "[date to be confirmed]";

  return `
<h2 style="text-align: center; margin-bottom: 2px;">BOARD RESOLUTION</h2>
<h3 style="text-align: center; margin-bottom: 2px;">WRITTEN RESOLUTION OF THE BOARD OF DIRECTORS</h3>
<p style="text-align: center; margin-bottom: 24px;"><em>of</em></p>
<h3 style="text-align: center; margin-bottom: 4px;">${d.companyName.toUpperCase()}</h3>
<p style="text-align: center; margin-bottom: 24px;">(Company Registration No. ${val(d.companyUen)})</p>
<p style="text-align: center; margin-bottom: 24px;"><em>(Pursuant to Article 104 of the Constitution and Section 184A of the Companies Act, Cap. 50)</em></p>

<hr>

<p style="margin-bottom: 20px;">We, being all the directors of <strong>${d.companyName}</strong> (the "<strong>Company</strong>") who are entitled to vote on the resolution set out below, hereby resolve as follows:</p>

<h3 style="margin-bottom: 12px;">1.&nbsp;&nbsp;CESSATION OF DIRECTOR</h3>

<p>IT IS RESOLVED THAT the Board acknowledges and accepts the resignation of ${val(d.departingDirector)} as a director of the Company with effect from ${val("17 April 2026")}.</p>

<p>The Board records its appreciation for the service and contributions of ${d.departingDirector.split('"')[0]?.trim() || d.departingDirector} during his tenure as director of the Company.</p>

<h3 style="margin-bottom: 12px;">2.&nbsp;&nbsp;APPOINTMENT OF DIRECTOR</h3>

<p>IT IS RESOLVED THAT ${val(d.appointeeName)}, bearing NRIC No. ${val(d.appointeeNric || "[NRIC]")} and residing at:</p>

<p><span ${FIELD_FULL}>${d.appointeeAddress}</span></p>

<p>be and is hereby appointed as a director of the Company with effect from ${val(effectiveFormatted)}, pursuant to the Constitution of the Company.</p>

<h3 style="margin-bottom: 12px;">3.&nbsp;&nbsp;CONSENT TO ACT</h3>

<p>IT IS NOTED THAT ${val(d.appointeeName)} has duly executed a Consent to Act as Director in the form prescribed under Section 145(5) of the Companies Act (Cap. 50) (Form 45), and has confirmed that she is not disqualified from acting as a director under any provision of the Companies Act.</p>

<h3 style="margin-bottom: 12px;">4.&nbsp;&nbsp;STATUTORY FILINGS</h3>

<p>IT IS RESOLVED THAT the Company Secretary be and is hereby authorised and directed to:</p>

<p style="padding-left: 28px;"><strong>(a)</strong>&nbsp; file the Notification of Change of Director (Form 45) with the Accounting and Corporate Regulatory Authority ("ACRA") within 14 days of the date of appointment, in compliance with Section 173(6) of the Companies Act;</p>

<p style="padding-left: 28px;"><strong>(b)</strong>&nbsp; update the Company's Register of Directors in accordance with Section 173(1) of the Companies Act;</p>

<p style="padding-left: 28px;"><strong>(c)</strong>&nbsp; update the Company's records maintained with ACRA via BizFile+ to reflect the above changes; and</p>

<p style="padding-left: 28px;"><strong>(d)</strong>&nbsp; do all such acts and things and execute all such documents as may be necessary or expedient to give effect to this resolution.</p>

<h3 style="margin-bottom: 12px;">5.&nbsp;&nbsp;GENERAL AUTHORITY</h3>

<p>IT IS RESOLVED THAT any director or the Company Secretary be and is hereby authorised to do all such acts and things, to sign, execute and deliver all such documents, deeds, and instruments as may be necessary or desirable to give effect to the resolutions set out above.</p>

<div ${PAGE_BREAK}><span ${PAGE_LABEL}>PAGE 1 OF 2</span></div>

<h3 style="margin-bottom: 16px;">SIGNATURES OF DIRECTORS</h3>

<p>Passed by the directors in writing on ${val(formattedDate)} in accordance with Article 104 of the Constitution of the Company.</p>

<hr style="margin: 24px 0 24px;">

<p><strong>1. Robert Johnson</strong><br>Committee Chair, Nomination Committee</p>
<p><strong>Signature:</strong></p>
<div ${SIG_BOX}><em style="color: #888;">[ Electronic signature — awaiting ]</em></div>

<p style="margin-top: 24px;"><strong>2. Margaret Sullivan</strong><br>Chief Executive Officer</p>
<p><strong>Signature:</strong></p>
<div ${SIG_BOX}><em style="color: #888;">[ Electronic signature — awaiting ]</em></div>

<p style="margin-top: 24px;"><strong>3. Linda Williams</strong><br>Independent Director</p>
<p><strong>Signature:</strong></p>
<div ${SIG_BOX}><em style="color: #888;">[ Electronic signature — awaiting ]</em></div>

<p style="margin-top: 24px;"><strong>4. David Martinez</strong><br>Independent Director</p>
<p><strong>Signature:</strong></p>
<div ${SIG_BOX}><em style="color: #888;">[ Electronic signature — awaiting ]</em></div>

<div ${PAGE_BREAK}><span ${PAGE_LABEL}>PAGE 2 OF 2</span></div>

<h3 style="text-align: center; margin-bottom: 4px;">SCHEDULE A</h3>
<h4 style="text-align: center; margin-bottom: 16px;">Particulars of New Director</h4>

<p><strong>Full Name:</strong><br><span ${FIELD_FULL}>${d.appointeeName}</span></p>

<p><strong>NRIC / Passport No.:</strong><br><span ${FIELD_FULL}>${d.appointeeNric || "[To be provided]"}</span></p>

<p><strong>Residential Address:</strong><br><span ${FIELD_FULL}>${d.appointeeAddress}</span></p>

<p><strong>Nationality:</strong><br><span ${FIELD_FULL}>Singaporean</span></p>

<p><strong>Date of Appointment:</strong><br><span ${FIELD_FULL}>${effectiveFormatted}</span></p>

<p><strong>Designation:</strong><br><span ${FIELD_FULL}>Director</span></p>

<hr>

<p style="font-size: 12px; color: #666;">This resolution is effective as of the date last signed by a director and shall be entered in the minutes book of the Company in accordance with Section 184A(3) of the Companies Act (Cap. 50).</p>
`;
}


export default function BoardResolutionEditor({
  companyName,
  companyUen,
  appointeeName,
  appointeeNric,
  appointeeAddress,
  effectiveDate,
  departingDirector,
  onApproveAndSend,
  approved,
}: {
  companyName: string;
  companyUen: string;
  appointeeName: string;
  appointeeNric: string;
  appointeeAddress: string;
  effectiveDate: string;
  departingDirector: string;
  onApproveAndSend: () => void;
  approved: boolean;
}) {
  const { color, radius, weight } = useTokens();

  const resData: ResolutionData = {
    companyName,
    companyUen,
    appointeeName,
    appointeeNric,
    appointeeAddress,
    effectiveDate,
    departingDirector,
  };

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
        Underline,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        Placeholder.configure({ placeholder: "Edit the board resolution…" }),
      ],
      content: buildResolutionHtml(resData),
    },
    [appointeeName],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", height: "100%" }}>
      <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.default }}>
        Review and edit the <strong>Board Resolution</strong> for the appointment of{" "}
        <strong>{appointeeName}</strong> as director of <strong>{companyName}</strong>. The resolution
        covers the cessation of the departing director, the new appointment, Form 45 consent, statutory
        filings, and includes signature blocks for all selected approvers.
      </TradAtlasText>

      {editor ? <TipTapEditorShell editor={editor} /> : null}

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", flexShrink: 0 }}>
        {approved ? (
          <Button
            variant="contained"
            color="success"
            size="small"
            startIcon={<CheckCircleIcon sx={{ fontSize: 18 }} />}
            disabled
            sx={{ textTransform: "none", fontWeight: weight.semiBold }}
          >
            Approved & sent to board
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<GavelOutlinedIcon sx={{ fontSize: 18 }} />}
            onClick={onApproveAndSend}
            sx={{ textTransform: "none", fontWeight: weight.semiBold, ...semanticFontStyle(SF.labelMd), borderRadius: radius.md }}
          >
            Approve & send for signature
          </Button>
        )}
      </Box>
    </Box>
  );
}
