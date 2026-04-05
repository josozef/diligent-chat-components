import { Box, IconButton } from "@mui/material";
import {
  atlasFontWeight,
  atlasSemanticColor as color,
  atlasSemanticRadius as radius,
} from "../../tokens/atlasLight";
import TradAtlasText from "../common/TradAtlasText";
import { DATA_SEMANTIC_FONT, SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { ReplayIcon } from "@/icons";
import type { ChatPresentationDensity } from "./chatPresentation";

export type ChatMessageBubbleRole = "prompt" | "user" | "assistant";

export default function MessageBubble({
  children,
  align = "right",
  messageRole = "prompt",
  density = "relaxed",
  fullWidth = false,
  htmlContent,
  onRerun,
}: {
  children?: React.ReactNode;
  /** Rich HTML body (e.g. from `formatChatMarkdownToHtml`). Used for assistant turns; also supported on `prompt` cards. */
  htmlContent?: string;
  align?: "left" | "right";
  /**
   * `prompt` — neutral bordered card (general chat + workspace threads; use `fullWidth` in rails).
   * `user` / `assistant` — legacy conversational chips (primary / variant); prefer `prompt` for consistency.
   */
  messageRole?: ChatMessageBubbleRole;
  density?: ChatPresentationDensity;
  fullWidth?: boolean;
  onRerun?: () => void;
}) {
  const isCompact = density === "compact";
  const isPrompt = messageRole === "prompt";
  const isUser = messageRole === "user";
  const isAssistant = messageRole === "assistant";

  const conversational = isUser || isAssistant;
  const semanticForBody = isCompact ? SF.labelMd : SF.textLg;

  const outerJustify = conversational
    ? isUser
      ? "flex-end"
      : "flex-start"
    : align === "right" && !fullWidth
      ? "flex-end"
      : "flex-start";

  const maxWidthCss =
    isPrompt && fullWidth ? "100%" : conversational && isCompact ? "95%" : isPrompt ? "520px" : "520px";

  const bubbleMinWidth = isPrompt && !fullWidth ? 280 : 0;

  const px = isPrompt ? "16px" : isCompact ? "12px" : "16px";
  const pt = isPrompt ? "12px" : isCompact ? "10px" : "12px";
  const pb =
    onRerun && isPrompt ? "40px" : isPrompt ? "12px" : isCompact ? "10px" : "12px";

  const bubbleSx = (() => {
    if (isPrompt) {
      return {
        background: color.surface.subtle,
        borderRadius: radius.md,
        border: `1px solid ${color.outline.static}`,
      };
    }
    if (isUser) {
      return {
        background: color.action.primary.default,
        borderRadius: isCompact ? radius.lg : radius.md,
        border: "none",
      };
    }
    return {
      background: color.surface.variant,
      borderRadius: isCompact ? radius.lg : radius.md,
      border: "none",
    };
  })();

  const textColor = isUser ? color.action.primary.onPrimary : color.type.default;

  const dataVariant = [
    "bubble",
    isPrompt ? "prompt" : messageRole,
    isCompact ? "compact" : "relaxed",
    fullWidth && isPrompt ? "full" : null,
  ]
    .filter(Boolean)
    .join(" - ");

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: outerJustify,
        width: "100%",
      }}
    >
      <Box
        data-atlas-component="MessageBubble"
        data-atlas-variant={dataVariant}
        {...{ [DATA_SEMANTIC_FONT]: semanticForBody }}
        sx={{
          position: "relative",
          width: isPrompt && fullWidth ? "100%" : "auto",
          maxWidth: maxWidthCss,
          minWidth: bubbleMinWidth,
          px,
          pt,
          pb,
          ...bubbleSx,
        }}
      >
        {htmlContent ? (
          <Box
            component="div"
            sx={{
              ...semanticFontStyle(semanticForBody),
              color: textColor,
              whiteSpace: "pre-wrap",
              "& strong": { fontWeight: atlasFontWeight.semiBold },
            }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        ) : (
          <TradAtlasText semanticFont={semanticForBody} sx={{ color: textColor, whiteSpace: "pre-wrap" }}>
            {children ?? null}
          </TradAtlasText>
        )}
        {onRerun && isPrompt ? (
          <IconButton
            type="button"
            size="small"
            aria-label="Re-run prompt"
            onClick={onRerun}
            sx={{
              position: "absolute",
              bottom: 4,
              right: 4,
              color: color.type.muted,
              "&:hover": { color: color.type.default, background: color.action.secondary.hoverFill },
            }}
          >
            <ReplayIcon sx={{ fontSize: 18 }} />
          </IconButton>
        ) : null}
      </Box>
    </Box>
  );
}
