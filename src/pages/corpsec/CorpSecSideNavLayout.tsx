import type { ReactNode } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router";

import GlobalHeader from "@/components/common/GlobalHeader";
import CommandCenterSideNav from "@/components/common/CommandCenterSideNav";
import { useTokens } from "@/hooks/useTokens";

import { SEED_WORKFLOWS, addNewChat, useCorpsecChats } from "./sideNavData";

export interface CorpSecSideNavLayoutProps {
  /** Page body — rendered in the main content column to the right of the rail. */
  children: ReactNode;
  /** Constrain the inner content to a fixed max width and center horizontally. */
  contentMaxWidth?: number;
  /** Override the side rail's "Command Center" active state if needed. */
  active?: "command-center";
}

/**
 * Shared chrome for every page that lives behind the corp-sec command center
 * side rail (the command center itself, the new-chat surface, the workflow
 * picker, workflow history, and chat history). Centralizing it here means
 *  - a single set of routing rules for the rail's `+ chat` and `+ workflow`
 *    affordances,
 *  - a single source of truth for which chats and workflows the rail shows,
 *  - and a single content-frame layout (page padding, max-width, scrolling)
 *    that every page can opt into without re-implementing the shell.
 */
export default function CorpSecSideNavLayout({
  children,
  contentMaxWidth,
  active = "command-center",
}: CorpSecSideNavLayoutProps) {
  const { color } = useTokens();
  const navigate = useNavigate();
  const { sideNavChats } = useCorpsecChats();

  /**
   * Clicking `+ chat` adds a fresh entry to the chats list and routes the
   * user into a blank chat. We do both side-effects here so any page that
   * hosts the layout (not just the command center) gets the same behavior.
   */
  const handleAddChat = () => {
    const chat = addNewChat();
    navigate(`/corpsec/chats/${chat.id}`);
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        background: color.surface.variant,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <GlobalHeader currentApp="corpsec" />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "flex-start",
          gap: "16px",
          px: "16px",
          py: "16px",
        }}
      >
        <CommandCenterSideNav
          active={active}
          workflows={SEED_WORKFLOWS}
          chats={sideNavChats}
          addWorkflowHref="/corpsec/workflows/new"
          onAddChat={handleAddChat}
          pastWorkflowsHref="/corpsec/workflows"
          allChatsHref="/corpsec/chats"
        />

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            px: "16px",
            py: "16px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: contentMaxWidth ?? "none",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
