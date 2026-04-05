import { Box } from "@mui/material";
import MessageBubble from "./MessageBubble";
import ChatAssistantResponse from "./ChatAssistantResponse";
import ThinkingPanel from "./ThinkingPanel";
import type { ThinkingStep } from "./ThinkingPanel";
import type { ChatPresentationDensity } from "./chatPresentation";
import { formatChatMarkdownToHtml } from "./chatMarkdown";

export type ChatConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ChatConversationItem =
  | { type: "user"; content: string }
  | { type: "assistant"; content: string }
  | {
      type: "thinking";
      steps: ThinkingStep[];
      open: boolean;
      onToggle: () => void;
    };

/**
 * Workspace / multi-turn thread: **user** prompts use the bordered card + optional replay;
 * **assistant** replies are plain on the canvas (like Governance); optional **thinking** blocks
 * use {@link ThinkingPanel}.
 */
export default function ChatConversation({
  items,
  density,
  gap,
  onRerunUser,
}: {
  items: ChatConversationItem[];
  density: ChatPresentationDensity;
  /** Vertical gap between blocks; defaults match {@link ChatThread} for the same density. */
  gap?: string;
  /** Invoked when the user taps replay on a user prompt bubble. */
  onRerunUser?: (userContent: string) => void;
}) {
  const isCompact = density === "compact";
  const gapY = gap ?? (isCompact ? "24px" : "40px");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: gapY, width: "100%" }}>
      {items.map((item, i) => {
        if (item.type === "user") {
          return (
            <MessageBubble
              key={`user-${i}`}
              messageRole="prompt"
              density={density}
              fullWidth
              onRerun={onRerunUser ? () => onRerunUser(item.content) : undefined}
            >
              {item.content}
            </MessageBubble>
          );
        }
        if (item.type === "assistant") {
          return (
            <ChatAssistantResponse
              key={`assistant-${i}`}
              htmlContent={formatChatMarkdownToHtml(item.content)}
              density={density}
            />
          );
        }
        return (
          <ThinkingPanel
            key={`thinking-${i}`}
            steps={item.steps}
            isThinking={false}
            activeStep={item.steps.length}
            open={item.open}
            onToggle={item.onToggle}
            density={density}
          />
        );
      })}
    </Box>
  );
}
