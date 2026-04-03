import { useRef } from "react";
import { Box, InputBase } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import TuneIcon from "@mui/icons-material/Tune";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MicIcon from "@mui/icons-material/Mic";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { TertiaryButton, TertiaryIconButton } from "../common";
import { useTokens } from "../../hooks/useTokens";

interface ChatPromptProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  canSend?: boolean;
  placeholder?: string;
  maxWidth?: number;
}

export default function ChatPrompt({
  value,
  onChange,
  onSend,
  disabled = false,
  canSend = false,
  placeholder = "Ask anything...",
  maxWidth = 640,
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

  return (
    <Box sx={{ maxWidth, width: "100%", borderRadius: radius.lg }}>
      <Box
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
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <TertiaryIconButton ariaLabel="Attach file" disabled={disabled}>
              <AttachFileIcon sx={{ fontSize: 24 }} />
            </TertiaryIconButton>
            <TertiaryButton
              label="Tools"
              leadingIcon={<TuneIcon sx={{ fontSize: 24, color: color.action.secondary.onSecondary }} />}
              trailingIcon={<ExpandMoreIcon sx={{ fontSize: 24, color: color.action.secondary.onSecondary }} />}
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <TertiaryIconButton ariaLabel="Voice input" disabled={disabled}>
              <MicIcon sx={{ fontSize: 24 }} />
            </TertiaryIconButton>
            <TertiaryIconButton ariaLabel="Send message" disabled={!canSend} onClick={onSend}>
              <ArrowUpwardIcon sx={{ fontSize: 24 }} />
            </TertiaryIconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
