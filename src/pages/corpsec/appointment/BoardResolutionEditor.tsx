import { Button } from "@mui/material";
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
import { buildBoardResolutionHtml, type BoardResolutionData } from "./documentTemplates";


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

  const resData: BoardResolutionData = {
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
      content: buildBoardResolutionHtml(resData),
    },
    [appointeeName],
  );

  const header = (
    <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.default, maxWidth: 820 }}>
      Review and edit the <strong>Board Resolution</strong> for the appointment of{" "}
      <strong>{appointeeName}</strong> as director of <strong>{companyName}</strong>. The resolution
      covers the cessation of the departing director, the new appointment, Form 45 consent, statutory
      filings, and includes signature blocks for all selected approvers.
    </TradAtlasText>
  );

  const footer = approved ? (
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
      sx={{
        textTransform: "none",
        fontWeight: weight.semiBold,
        ...semanticFontStyle(SF.labelMd),
        borderRadius: radius.md,
      }}
    >
      Approve & send for signature
    </Button>
  );

  if (!editor) {
    return null;
  }

  const exportFileName = `Board Resolution - ${companyName} - ${appointeeName}`;

  return (
    <TipTapEditorShell
      editor={editor}
      header={header}
      footer={footer}
      documentTitle={`Board Resolution — ${companyName}`}
      exportFileName={exportFileName}
    />
  );
}
