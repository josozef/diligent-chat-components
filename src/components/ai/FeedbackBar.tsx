import { Box, IconButton } from "@mui/material";
import {
  ContentCopyIcon,
  ThumbDownOutlinedIcon,
  ThumbUpOutlinedIcon,
  FileDownloadOutlinedIcon,
  ShareOutlinedIcon,
} from "@/icons";
import {
  atlasSemanticColor as color,
  atlasSemanticRadius as radius,
} from "../../tokens/atlasLight";

function FeedbackIconButton({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <IconButton
      aria-label={label}
      size="small"
      sx={{
        borderRadius: `${radius.md}`,
        color: color.type.muted,
        py: "6px",
        px: "4px",
        "&:hover": { background: color.action.secondary.hoverFill, color: color.type.default },
      }}
    >
      {children}
    </IconButton>
  );
}

export default function FeedbackBar() {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
      <FeedbackIconButton label="Thumbs up">
        <ThumbUpOutlinedIcon sx={{ fontSize: 24 }} />
      </FeedbackIconButton>
      <FeedbackIconButton label="Thumbs down">
        <ThumbDownOutlinedIcon sx={{ fontSize: 24 }} />
      </FeedbackIconButton>
      <FeedbackIconButton label="Copy">
        <ContentCopyIcon sx={{ fontSize: 24 }} />
      </FeedbackIconButton>
      <FeedbackIconButton label="Share">
        <ShareOutlinedIcon sx={{ fontSize: 24 }} />
      </FeedbackIconButton>
      <FeedbackIconButton label="Export">
        <FileDownloadOutlinedIcon sx={{ fontSize: 24 }} />
      </FeedbackIconButton>
    </Box>
  );
}
