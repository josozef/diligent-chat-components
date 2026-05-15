import { useMemo, useState } from "react";
import { Box, Button } from "@mui/material";
import { useParams } from "react-router";

import {
  AutoAwesomeOutlinedIcon,
  GroupsOutlinedIcon,
  DescriptionOutlinedIcon,
  GavelOutlinedIcon,
  BusinessOutlinedIcon,
  HowToVoteOutlinedIcon,
  PolicyOutlinedIcon,
} from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import { ChatPrompt } from "@/components/ai";
import { SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

import CorpSecSideNavLayout from "./CorpSecSideNavLayout";
import { useCorpsecChats } from "./sideNavData";

const STARTERS: { label: string; description: string; icon: React.ReactNode }[] = [
  {
    label: "Replace a director",
    description: "Walk me through the appointment workflow end-to-end.",
    icon: <GroupsOutlinedIcon sx={{ fontSize: 20 }} />,
  },
  {
    label: "Draft board minutes",
    description: "Capture deliberations, decisions, and action items.",
    icon: <DescriptionOutlinedIcon sx={{ fontSize: 20 }} />,
  },
  {
    label: "Review a governance policy",
    description: "Compare against latest regulatory guidance.",
    icon: <GavelOutlinedIcon sx={{ fontSize: 20 }} />,
  },
  {
    label: "Check entity compliance",
    description: "Filings, licenses, and director requirements.",
    icon: <BusinessOutlinedIcon sx={{ fontSize: 20 }} />,
  },
  {
    label: "Prepare an AGM resolution",
    description: "Notices, proxies, voting items, and disclosures.",
    icon: <HowToVoteOutlinedIcon sx={{ fontSize: 20 }} />,
  },
  {
    label: "Run a conflict-of-interest check",
    description: "Issue, collect, and archive declarations.",
    icon: <PolicyOutlinedIcon sx={{ fontSize: 20 }} />,
  },
];

/**
 * Blank chat surface — the destination for the side-nav `+ chat` affordance
 * (and for clicking any chat row in the history). The shell is the same
 * shared corp-sec layout as the command center; the body offers a centered
 * greeting, six conversation starters, and the design-system `ChatPrompt`.
 *
 * The page is intentionally inert beyond local input state — it's a demo
 * surface, not a wired chat backend.
 */
export default function NewChatPage() {
  const { color, weight } = useTokens();
  const params = useParams();
  const { newChats } = useCorpsecChats();

  const chatId = params.chatId;
  const persisted = useMemo(
    () => newChats.find((c) => c.id === chatId),
    [newChats, chatId],
  );
  const title = persisted?.title ?? "New chat";

  const [input, setInput] = useState("");

  return (
    <CorpSecSideNavLayout>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: 960, width: "100%", mx: "auto" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: "16px" }}>
          <AutoAwesomeOutlinedIcon
            sx={{ fontSize: 22, color: color.action.primary.default }}
          />
          <TradAtlasText
            semanticFont={SF.titleH3Emphasis}
            sx={{ fontWeight: weight.semiBold, color: color.type.default }}
          >
            {title}
          </TradAtlasText>
        </Box>

        {/* Centered hero block — greeting + composer + starter chips. */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "24px",
            py: "32px",
          }}
        >
          <Box sx={{ textAlign: "center", maxWidth: 640 }}>
            <TradAtlasText
              semanticFont={SF.titleH2Emphasis}
              sx={{
                fontWeight: weight.semiBold,
                color: color.type.default,
                letterSpacing: "-0.01em",
                mb: "10px",
              }}
            >
              How can I help with your governance work today?
            </TradAtlasText>
            <TradAtlasText
              semanticFont={SF.textMd}
              sx={{ color: color.type.muted }}
            >
              Ask anything about board operations, entity management, filings,
              policies, or running an agentic workflow.
            </TradAtlasText>
          </Box>

          <Box sx={{ width: "100%", maxWidth: 720 }}>
            <ChatPrompt
              value={input}
              onChange={setInput}
              onSend={() => setInput("")}
              canSend={input.trim().length > 0}
              placeholder="Ask a question or describe what you need..."
              fullWidth
              density="relaxed"
            />
          </Box>

          <Box sx={{ width: "100%", maxWidth: 720 }}>
            <TradAtlasText
              semanticFont={SF.textMdUppercase}
              sx={{
                color: color.type.muted,
                textAlign: "center",
                mb: "12px",
              }}
            >
              Or start with
            </TradAtlasText>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                gap: "12px",
              }}
            >
              {STARTERS.map((s) => (
                <Button
                  key={s.label}
                  variant="outlined"
                  color="inherit"
                  onClick={() => setInput(s.label)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "6px",
                    p: "14px",
                    height: "auto",
                    textAlign: "left",
                    textTransform: "none",
                    borderColor: color.outline.fixed,
                    background: color.surface.default,
                    transition: "border-color 0.15s, box-shadow 0.15s",
                    "&:hover": {
                      borderColor: color.outline.hover,
                      background: color.surface.subtle,
                    },
                  }}
                >
                  <Box sx={{ color: color.type.muted }}>{s.icon}</Box>
                  <TradAtlasText
                    component="span"
                    semanticFont={SF.textSmEmphasis}
                    sx={{
                      ...semanticFontStyle(SF.textSmEmphasis),
                      fontWeight: weight.semiBold,
                      color: color.type.default,
                    }}
                  >
                    {s.label}
                  </TradAtlasText>
                  <TradAtlasText
                    component="span"
                    semanticFont={SF.textXs}
                    sx={{ color: color.type.muted }}
                  >
                    {s.description}
                  </TradAtlasText>
                </Button>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </CorpSecSideNavLayout>
  );
}
