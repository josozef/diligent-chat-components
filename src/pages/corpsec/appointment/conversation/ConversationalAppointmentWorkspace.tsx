import { Box } from "@mui/material";

import { ChatPrompt } from "@/components/ai";
import TradAtlasText from "@/components/common/TradAtlasText";
import { SF } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";
import GlobalHeader from "@/components/common/GlobalHeader";

import { WorkflowConversationProvider, useWorkflowConversation } from "./WorkflowConversationContext";
import WorkflowSideRail from "./WorkflowSideRail";
import ChatThread from "./ChatThread";
import AssetDrawer from "./AssetDrawer";

/**
 * Width of the centered chat content. Tuned to comfortably fit the adaptive
 * cards (~720–760px) plus breathing room without letting messages stretch
 * too wide on large monitors.
 */
const CHAT_MAX_WIDTH = 960;

/**
 * Height reserved at the top of the chat scroll container for the floating
 * workflow title. Sized for a single-line H4 title plus generous breathing
 * room below so chat content has room to scroll under without crowding.
 */
const TITLE_OVERLAY_INSET = 80;

export default function ConversationalAppointmentWorkspace() {
  const { color } = useTokens();

  return (
    <WorkflowConversationProvider>
      <Box
        sx={{
          height: "100dvh",
          display: "flex",
          flexDirection: "column",
          background: color.surface.subtle,
          overflow: "hidden",
        }}
      >
        <GlobalHeader currentApp="corpsec" />
        <WorkspaceBody />
        <AssetDrawer />
      </Box>
    </WorkflowConversationProvider>
  );
}

/**
 * Strip the legal entity suffix (`Pte. Ltd.`, `Inc.`, etc.) so the workflow
 * title reads like the command-center side-nav entry — short, scannable, and
 * a single line on most viewports.
 */
function shortEntityName(name: string): string {
  return name
    .replace(/\s+(Pte\.?\s+Ltd\.?|Pty\.?\s+Ltd\.?|Ltd\.?|Inc\.?|LLC|GmbH|S\.A\.|N\.V\.|B\.V\.)$/i, "")
    .trim();
}

/**
 * Floating workflow title — sits absolutely at the top of the chat column so
 * the chat thread can scroll behind it. Sources the workflow nomenclature
 * from the conversation state so the user always sees what journey they're in.
 */
function WorkflowTitleOverlay() {
  const { color, weight } = useTokens();
  const { state } = useWorkflowConversation();

  const entityShort = shortEntityName(state.entity.name);
  const departing = state.departingDirector?.name;
  // Stable workflow identifier — frames the journey by the action being
  // performed (replacing the departing director). Matches the `Workflows`
  // entry in the command-center side nav so both surfaces refer to the same
  // journey by the same name.
  const title = departing
    ? `Replace director ${departing} at ${entityShort}`
    : `Board member appointment — ${entityShort}`;

  return (
    <Box
      aria-label="Workflow title"
      sx={{
        // Cover the entire top edge of the chat column so messages can never
        // peek above the title. The opaque canvas-colored background masks
        // any chat content that scrolls underneath without painting a
        // visible card on top of the canvas.
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        px: "24px",
        pt: "20px",
        pb: "24px",
        background: color.surface.subtle,
      }}
    >
      <TradAtlasText
        semanticFont={SF.titleH4Emphasis}
        sx={{
          color: color.type.default,
          fontWeight: weight.semiBold,
          letterSpacing: "-0.01em",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          width: "100%",
        }}
        title={title}
      >
        {title}
      </TradAtlasText>
    </Box>
  );
}

/**
 * Decorative composer footer — uses the design system `ChatPrompt` so the
 * prompt-box styling matches the general-purpose chat. The conversation is
 * fully card-driven, so the input is intentionally inert.
 */
function DecorativeComposer() {
  const { color } = useTokens();
  return (
    <Box
      sx={{
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        px: "24px",
        pt: "12px",
        pb: "16px",
        background: color.surface.subtle,
      }}
    >
      <ChatPrompt
        value=""
        onChange={() => undefined}
        onSend={() => undefined}
        disabled
        canSend={false}
        density="relaxed"
        fullWidth
        placeholder="Reply to Diligent Governance Agent…"
      />
      <TradAtlasText
        semanticFont={SF.textXs}
        sx={{
          color: color.type.muted,
          textAlign: "center",
          fontSize: "11px",
        }}
      >
        This is a demo. Use the cards above to step through the workflow.
      </TradAtlasText>
    </Box>
  );
}

/**
 * The 2-column workflow body: side rail on the left, centered chat column on
 * the right. Asset previews open over the top of the chat in a Drawer rather
 * than reserving a permanent third column — see {@link AssetDrawer}.
 */
function WorkspaceBody() {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        gap: "16px",
        px: "16px",
        py: "16px",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <WorkflowSideRail />

      {/*
        Outer wrapper fills the remaining viewport width so the chat column
        can be centered horizontally. The inner column is the actual chat
        surface — fixed max-width, anchored center-page regardless of how
        wide the viewport gets.
      */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          minHeight: 0,
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "relative",
            flex: "1 1 auto",
            width: "100%",
            maxWidth: CHAT_MAX_WIDTH,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <WorkflowTitleOverlay />
          <ChatThread topInset={TITLE_OVERLAY_INSET} />
          <DecorativeComposer />
        </Box>
      </Box>
    </Box>
  );
}
