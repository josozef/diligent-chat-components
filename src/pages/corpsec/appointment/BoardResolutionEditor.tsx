import { Box, Button, Divider, IconButton, Tooltip } from "@mui/material";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import {
  FormatBoldIcon,
  FormatItalicIcon,
  FormatUnderlinedIcon,
  FormatListBulletedIcon,
  FormatListNumberedIcon,
  UndoIcon,
  RedoIcon,
  TitleIcon,
  FormatClearIcon,
  HorizontalRuleIcon,
  CheckCircleIcon,
  GavelOutlinedIcon,
} from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
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

interface ToolbarBtnProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  activeColor: string;
  hoverBg: string;
}

function ToolbarBtn({ icon, label, active, disabled, onClick, activeColor, hoverBg }: ToolbarBtnProps) {
  return (
    <Tooltip title={label} arrow enterDelay={400}>
      <span>
        <IconButton
          size="small"
          onClick={onClick}
          disabled={disabled}
          aria-label={label}
          sx={{
            borderRadius: "6px",
            width: 32,
            height: 32,
            border: active ? `1.5px solid ${activeColor}` : `1px solid transparent`,
            background: active ? `${activeColor}14` : "transparent",
            color: active ? activeColor : "inherit",
            "&:hover": { background: hoverBg },
          }}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  );
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

  const btnProps = {
    activeColor: color.action.primary.default,
    hoverBg: color.action.secondary.hoverFill,
  };

  const iconSz = { fontSize: 18 } as const;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", height: "100%" }}>
      <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.default }}>
        Review and edit the <strong>Board Resolution</strong> for the appointment of{" "}
        <strong>{appointeeName}</strong> as director of <strong>{companyName}</strong>. The resolution
        covers the cessation of the departing director, the new appointment, Form 45 consent, statutory
        filings, and includes signature blocks for all selected approvers.
      </TradAtlasText>

      {editor ? (
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
            <ToolbarBtn icon={<UndoIcon sx={iconSz} />} label="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()} {...btnProps} />
            <ToolbarBtn icon={<RedoIcon sx={iconSz} />} label="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()} {...btnProps} />
            <Divider orientation="vertical" flexItem sx={{ mx: "4px" }} />
            <ToolbarBtn icon={<TitleIcon sx={iconSz} />} label="Heading" active={editor.isActive("heading")} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} {...btnProps} />
            <Divider orientation="vertical" flexItem sx={{ mx: "4px" }} />
            <ToolbarBtn icon={<FormatBoldIcon sx={iconSz} />} label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} {...btnProps} />
            <ToolbarBtn icon={<FormatItalicIcon sx={iconSz} />} label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} {...btnProps} />
            <ToolbarBtn icon={<FormatUnderlinedIcon sx={iconSz} />} label="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} {...btnProps} />
            <Divider orientation="vertical" flexItem sx={{ mx: "4px" }} />
            <ToolbarBtn icon={<FormatListBulletedIcon sx={iconSz} />} label="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} {...btnProps} />
            <ToolbarBtn icon={<FormatListNumberedIcon sx={iconSz} />} label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} {...btnProps} />
            <Divider orientation="vertical" flexItem sx={{ mx: "4px" }} />
            <ToolbarBtn icon={<HorizontalRuleIcon sx={iconSz} />} label="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()} {...btnProps} />
            <ToolbarBtn icon={<FormatClearIcon sx={iconSz} />} label="Clear formatting" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} {...btnProps} />
          </Box>

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
      ) : null}

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
