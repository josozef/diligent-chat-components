import { useState, useRef, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import { AutoAwesomeOutlinedIcon, SendOutlinedIcon } from "@/icons";
import TradAtlasText from "../../../components/common/TradAtlasText";
import { DATA_SEMANTIC_FONT, SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "../../../hooks/useTokens";

interface Message {
  role: "assistant" | "user";
  content: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: "assistant",
    content:
      "I've reviewed the Workday notification about David Chen's resignation from Pacific Polymer Logistics Pte. Ltd. His last day is April 17, 2026 — 14 days from now.\n\nI've pulled the Singapore Companies Act requirements for director appointments. Since Pacific Polymer must maintain at least one locally resident director, I've cross-referenced eligible internal candidates from Workday who meet the residency and eligibility criteria.\n\nThe first step is to identify and select a replacement candidate. Shall I walk you through the shortlisted candidates?",
  },
  {
    role: "user",
    content: "Yes, what candidates are available?",
  },
  {
    role: "assistant",
    content:
      "Based on Workday data and Singapore Companies Act requirements, I've identified three candidates:\n\n1. **Priya Nair** — Regional Finance Director, APAC (94% match). Singapore resident, no disqualifications, strong finance background.\n\n2. **Lim Pei Shan** — Director of Risk Management (87% match). Singapore resident, compliance expertise.\n\n3. **Kenji Tanaka** — Head of Digital Transformation (72% match). Note: non-resident — may not satisfy the local director requirement without additional arrangements.\n\nPriya Nair is the recommended candidate given her residency status and role seniority. Would you like to proceed with her, or review the other candidates in more detail?",
  },
];

export default function ChatPanel() {
  const { color, weight, radius } = useTokens();
  const [messages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  return (
    <Box
      sx={{
        width: 340,
        flexShrink: 0,
        borderLeft: `1px solid ${color.outline.fixed}`,
        background: color.surface.default,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: "16px",
          py: "12px",
          borderBottom: `1px solid ${color.outline.fixed}`,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <AutoAwesomeOutlinedIcon sx={{ fontSize: 18, color: color.action.primary.default }} />
        <Box>
          <TradAtlasText semanticFont={SF.labelMdEmphasis} sx={{ color: color.type.default }}>
            AI Governance Assistant
          </TradAtlasText>
          <TradAtlasText semanticFont={SF.textMicro} sx={{ color: color.type.muted }}>
            Context for this appointment
          </TradAtlasText>
        </Box>
      </Box>

      {/* Messages */}
      <Box ref={scrollRef} sx={{ flex: 1, overflow: "auto", px: "16px", py: "16px" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {messages.map((msg, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <Box
                data-atlas-component="MessageBubble"
                data-atlas-variant={`chat - ${msg.role} - lg`}
                {...{ [DATA_SEMANTIC_FONT]: SF.labelMd }}
                sx={{
                  maxWidth: "95%",
                  px: "12px",
                  py: "10px",
                  borderRadius: radius.lg,
                  background:
                    msg.role === "user" ? color.action.primary.default : color.surface.variant,
                  color:
                    msg.role === "user" ? color.action.primary.onPrimary : color.type.default,
                }}
              >
                <TradAtlasText
                  semanticFont={SF.labelMd}
                  sx={{
                    whiteSpace: "pre-wrap",
                    "& strong": { fontWeight: weight.semiBold },
                  }}
                  dangerouslySetInnerHTML={{
                    __html: msg.content
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\n/g, "<br/>"),
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Input */}
      <Box
        sx={{
          px: "12px",
          py: "12px",
          borderTop: `1px solid ${color.outline.fixed}`,
        }}
      >
        <Box
          data-atlas-component="ChatInput"
          data-atlas-variant="input - outlined - lg"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            border: `1px solid ${color.outline.fixed}`,
            borderRadius: radius.lg,
            px: "12px",
            py: "8px",
            "&:focus-within": {
              borderColor: color.action.primary.default,
            },
          }}
        >
          <Box
            component="input"
            value={inputValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
            placeholder="Ask a question..."
            {...{ [DATA_SEMANTIC_FONT]: SF.labelMd }}
            sx={{
              ...semanticFontStyle(SF.labelMd),
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              color: color.type.default,
              "&::placeholder": { color: color.type.disabled },
            }}
          />
          <IconButton
            size="small"
            sx={{
              color: inputValue.trim()
                ? color.action.primary.default
                : color.type.disabled,
              p: "4px",
            }}
          >
            <SendOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
