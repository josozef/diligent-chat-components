import { useCallback, useEffect, useRef, useState } from "react";
import { Box, IconButton, InputBase, Typography } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import TuneIcon from "@mui/icons-material/Tune";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MicIcon from "@mui/icons-material/Mic";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import ChatThread, { type ChatPhase, THINKING_STEPS } from "../components/ai/ChatThread";
import AiSparkle from "../components/ai/AiSparkle";
import {
  atlasSemanticColor as color,
  atlasSemanticRadius as radius,
  atlasFontWeight as weight,
} from "../tokens/atlasLight";

const CHAT_WIDTH = 640;

const STEP_CYCLE_MS = 700;
const SECTION_DELAY_MS = 680;
const SECTION_COUNT = 6;

function SuggestionChip({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: "36px",
        border: `1px solid ${color.outline.fixed}`,
        borderRadius: "6px",
        background: "transparent",
        px: "8px",
        py: 0,
        cursor: "pointer",
        overflow: "clip",
        "&:hover": { background: color.surface.variant },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", height: "36px", px: "8px" }}>
        <Typography
          sx={{
            fontWeight: weight.semiBold,
            fontSize: "14px",
            lineHeight: "20px",
            letterSpacing: "0.2px",
            color: color.type.default,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", height: "36px", px: 0 }}>
        <NorthEastIcon sx={{ fontSize: 16, color: color.type.default }} />
      </Box>
    </Box>
  );
}

function TertiaryIconButton({
  children,
  disabled = false,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel: string;
}) {
  return (
    <IconButton
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      sx={{
        borderRadius: radius.lg,
        p: "8px",
        color: disabled ? color.type.disabled : color.action.secondary.onSecondary,
        "&:hover": { background: color.action.secondary.hoverFill },
      }}
    >
      {children}
    </IconButton>
  );
}

function TertiaryButton({
  label,
  leadingIcon,
  trailingIcon,
  onClick,
}: {
  label: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        px: "12px",
        py: "8px",
        borderRadius: "6px",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        color: color.action.secondary.onSecondary,
        "&:hover": { background: color.action.secondary.hoverFill },
      }}
    >
      {leadingIcon}
      <Box sx={{ display: "flex", alignItems: "center", height: "24px", px: "4px", pb: "2px" }}>
        <Typography
          sx={{
            fontWeight: weight.semiBold,
            fontSize: "16px",
            lineHeight: "24px",
            letterSpacing: "0.2px",
            color: color.action.secondary.onSecondary,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </Typography>
      </Box>
      {trailingIcon}
    </Box>
  );
}

const SUGGESTION_PROMPTS = [
  "Help write prompt",
  "Summarize article",
  "Analyze data",
];

const DEMO_PROMPT =
  "Summarize the legal requirements of appointing a subsidiary board member in the UK";

export default function HomePage() {
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<ChatPhase>("idle");
  const [activeThinkingStep, setActiveThinkingStep] = useState(0);
  const [thinkingOpen, setThinkingOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const canSend = input.trim().length > 0 && phase === "idle";

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, []);

  const handleSend = useCallback(() => {
    if (!canSend) return;
    setInput("");
    setPhase("thinking");
    setActiveThinkingStep(0);
    setThinkingOpen(false);
    setVisibleSections(0);
    setTimeout(scrollToBottom, 60);
  }, [canSend, scrollToBottom]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  /* Thinking phase: advance one step at a time, then move to responding */
  useEffect(() => {
    if (phase !== "thinking") return;

    let step = 0;

    const advance = () => {
      step += 1;
      if (step >= THINKING_STEPS.length) {
        setPhase("responding");
      } else {
        setActiveThinkingStep(step);
        timer = setTimeout(advance, STEP_CYCLE_MS);
      }
    };

    let timer = setTimeout(advance, STEP_CYCLE_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  /* Responding phase: reveal sections one at a time */
  useEffect(() => {
    if (phase !== "responding") return;

    let section = 0;

    const reveal = () => {
      section += 1;
      setVisibleSections(section);
      scrollToBottom();
      if (section >= SECTION_COUNT) {
        setPhase("done");
      } else {
        timer = setTimeout(reveal, SECTION_DELAY_MS);
      }
    };

    let timer = setTimeout(reveal, SECTION_DELAY_MS);
    return () => clearTimeout(timer);
  }, [phase, scrollToBottom]);

  /* Auto-scroll when new content appears */
  useEffect(() => {
    scrollToBottom();
  }, [visibleSections, scrollToBottom]);

  return (
    <Box
      sx={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: color.background.base,
      }}
    >
      {/* Scrollable thread area */}
      <Box
        ref={scrollRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {phase === "idle" ? (
          /* Welcome state */
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              px: "24px",
              py: "48px",
            }}
          >
            <AiSparkle size="2xl" />
            <Typography
              sx={{
                fontSize: "24px",
                lineHeight: "32px",
                fontWeight: weight.semiBold,
                letterSpacing: "-0.2px",
                color: color.type.default,
                textAlign: "center",
              }}
            >
              How can I help you today?
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "0.2px",
                color: color.type.muted,
                textAlign: "center",
                maxWidth: 480,
              }}
            >
              Ask a question, draft a document, or explore legal requirements — I&apos;m here to assist.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ px: "24px" }}>
            <ChatThread
              phase={phase}
              activeThinkingStep={activeThinkingStep}
              thinkingOpen={thinkingOpen}
              onToggleThinking={() => setThinkingOpen((o) => !o)}
              visibleSections={visibleSections}
            />
          </Box>
        )}
      </Box>

      {/* Pinned prompt area */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: "24px",
          pb: "24px",
          pt: "8px",
          gap: "12px",
          flexShrink: 0,
        }}
      >
        {/* Prompt box */}
        <Box sx={{ maxWidth: CHAT_WIDTH, width: "100%", borderRadius: radius.lg }}>
          <Box
            sx={{
              border: `1px solid ${color.outline.default}`,
              borderRadius: radius.lg,
              background: color.surface.default,
              px: "12px",
              py: "8px",
              display: "flex",
              flexDirection: "column",
              boxShadow: `0 1px 2px rgba(36, 38, 40, 0.06), 0 4px 14px rgba(36, 38, 40, 0.07)`,
            }}
          >
            <InputBase
              inputRef={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              multiline
              maxRows={6}
              disabled={phase !== "idle"}
              sx={{
                width: "100%",
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "0.2px",
                color: color.type.default,
                py: "8px",
                px: "12px",
                "& .MuiInputBase-input::placeholder": {
                  color: color.type.muted,
                  opacity: 1,
                },
              }}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <TertiaryIconButton ariaLabel="Attach file" disabled={phase !== "idle"}>
                  <AttachFileIcon sx={{ fontSize: 24 }} />
                </TertiaryIconButton>
                <TertiaryButton
                  label="Tools"
                  leadingIcon={<TuneIcon sx={{ fontSize: 24, color: color.action.secondary.onSecondary }} />}
                  trailingIcon={<ExpandMoreIcon sx={{ fontSize: 24, color: color.action.secondary.onSecondary }} />}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <TertiaryIconButton ariaLabel="Voice input" disabled={phase !== "idle"}>
                  <MicIcon sx={{ fontSize: 24 }} />
                </TertiaryIconButton>
                <TertiaryIconButton ariaLabel="Send message" disabled={!canSend} onClick={handleSend}>
                  <ArrowUpwardIcon sx={{ fontSize: 24 }} />
                </TertiaryIconButton>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Suggestion chips — only shown in idle state */}
        {phase === "idle" && (
          <Box
            sx={{
              display: "flex",
              gap: "8px",
              alignItems: "start",
              maxWidth: CHAT_WIDTH,
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            {SUGGESTION_PROMPTS.map((label) => (
              <SuggestionChip
                key={label}
                label={label}
                onClick={() => setInput(label === "Summarize article" ? DEMO_PROMPT : label)}
              />
            ))}
            <SuggestionChip label="..." />
          </Box>
        )}
      </Box>
    </Box>
  );
}
