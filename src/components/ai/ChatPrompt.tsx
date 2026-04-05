import { useRef } from "react";
import { Box, InputBase } from "@mui/material";
import { AttachFileIcon, ArrowUpwardIcon, ExpandMoreIcon, MicIcon, TuneIcon } from "@/icons";
import { DATA_SEMANTIC_FONT, SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { TertiaryButton, TertiaryIconButton } from "../common";
import { useTokens } from "../../hooks/useTokens";
import type { ChatPresentationDensity } from "./chatPresentation";

interface ChatPromptProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  canSend?: boolean;
  placeholder?: string;
  maxWidth?: number;
  /** When true, prompt stretches to the full width of its container. */
  fullWidth?: boolean;
  /** `compact` — attach + send only (workspace rail). `relaxed` — full toolbar (general chat). */
  density?: ChatPresentationDensity;
}

export default function ChatPrompt({
  value,
  onChange,
  onSend,
  disabled = false,
  canSend = false,
  placeholder = "Ask anything...",
  maxWidth = 640,
  fullWidth = false,
  density = "relaxed",
}: ChatPromptProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { color, radius, isDark } = useTokens();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) onSend();
    }
  };

  const shadowColor = isDark ? "rgba(0, 0, 0, 0.3)" : "rgba(36, 38, 40, 0.07)";

  const isCompact = density === "compact";

  return (
    <Box
      sx={{
        maxWidth: fullWidth ? "100%" : maxWidth,
        width: "100%",
        borderRadius: radius.lg,
      }}
    >
      <Box
        data-atlas-component="ChatPrompt"
        data-atlas-variant={isCompact ? "input - composite - compact" : "input - composite - relaxed"}
        sx={{
          border: `1px solid ${color.outline.default}`,
          borderRadius: radius.lg,
          background: color.surface.default,
          px: "12px",
          py: "8px",
          display: "flex",
          flexDirection: "column",
          boxShadow: `0 1px 2px ${shadowColor}, 0 4px 14px ${shadowColor}`,
        }}
      >
        <InputBase
          inputRef={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          multiline
          maxRows={6}
          disabled={disabled}
          {...{ [DATA_SEMANTIC_FONT]: SF.textLg }}
          sx={{
            ...semanticFontStyle(SF.textLg),
            width: "100%",
            color: color.type.default,
            py: "8px",
            px: "12px",
            "& .MuiInputBase-input::placeholder": {
              color: color.type.muted,
              opacity: 1,
            },
          }}
        />
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: isCompact ? "8px" : "16px" }}>
            <TertiaryIconButton ariaLabel="Attach file" disabled={disabled}>
              <AttachFileIcon sx={{ fontSize: isCompact ? 22 : 24 }} />
            </TertiaryIconButton>
            {!isCompact ? (
              <TertiaryButton
                label="Tools"
                leadingIcon={<TuneIcon sx={{ fontSize: 24, color: color.action.secondary.onSecondary }} />}
                trailingIcon={<ExpandMoreIcon sx={{ fontSize: 24, color: color.action.secondary.onSecondary }} />}
              />
            ) : null}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: isCompact ? "8px" : "16px" }}>
            {!isCompact ? (
              <TertiaryIconButton ariaLabel="Voice input" disabled={disabled}>
                <MicIcon sx={{ fontSize: 24 }} />
              </TertiaryIconButton>
            ) : null}
            <TertiaryIconButton ariaLabel="Send message" disabled={!canSend} onClick={onSend}>
              <ArrowUpwardIcon sx={{ fontSize: isCompact ? 22 : 24 }} />
            </TertiaryIconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
