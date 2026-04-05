import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { Box } from "@mui/material";
import TradAtlasText from "@/components/common/TradAtlasText";
import { DATA_SEMANTIC_FONT, SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

export interface AtlasFormFieldProps {
  label: string;
  /** Muted text below the label (e.g. "Optional" or source system). */
  hint?: string;
  value?: string;
  placeholder?: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  /** Support text below the input (turns red when `error` is true). */
  helperText?: string;
  /** Adornment icon or text to the right of the label row. */
  endAdornment?: ReactNode;
  /** Chip or badge rendered inline after the label. */
  statusBadge?: ReactNode;
  onChange?: (value: string) => void;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
}

/**
 * Atlas-style form field: **label above** the input, 1px outlined box, `radius.sm` corners.
 * Uses Trad Atlas semantic font tokens throughout. Not a MUI TextField wrapper.
 */
const AtlasFormField = forwardRef<HTMLInputElement, AtlasFormFieldProps>(function AtlasFormField(
  {
    label,
    hint,
    value,
    placeholder,
    type = "text",
    disabled = false,
    readOnly = false,
    error = false,
    helperText,
    endAdornment,
    statusBadge,
    onChange,
    inputProps,
  },
  ref,
) {
  const { color, radius, weight } = useTokens();

  const borderColor = error
    ? color.status.error.default
    : color.outline.default;
  const focusBorderColor = error
    ? color.status.error.default
    : color.action.primary.default;

  return (
    <Box
      data-atlas-component="FormField"
      data-atlas-variant="outlined - label-above"
      sx={{ display: "flex", flexDirection: "column", gap: "6px" }}
    >
      <Box sx={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
        <TradAtlasText
          component="label"
          semanticFont={SF.labelMdEmphasis}
          sx={{ color: disabled ? color.type.disabled : color.type.default }}
        >
          {label}
        </TradAtlasText>
        {statusBadge}
        {hint ? (
          <TradAtlasText semanticFont={SF.textMicro} sx={{ color: color.type.muted }}>
            {hint}
          </TradAtlasText>
        ) : null}
      </Box>

      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          borderRadius: radius.sm,
          border: `1px solid ${borderColor}`,
          background: disabled ? color.surface.subtle : color.surface.default,
          transition: "border-color 0.15s ease",
          "&:focus-within": {
            borderColor: focusBorderColor,
            boxShadow: error ? "none" : `0 0 0 1px ${focusBorderColor}`,
          },
          ...(disabled ? { opacity: 0.7, pointerEvents: "none" as const } : {}),
        }}
      >
        <Box
          component="input"
          ref={ref}
          type={type}
          value={value ?? ""}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value)}
          {...{ [DATA_SEMANTIC_FONT]: SF.textMd }}
          sx={{
            ...semanticFontStyle(SF.textMd),
            flex: 1,
            width: "100%",
            border: "none",
            outline: "none",
            background: "transparent",
            color: disabled ? color.type.disabled : color.type.default,
            px: "12px",
            py: "10px",
            "&::placeholder": {
              color: color.type.disabled,
              opacity: 1,
            },
            "&::-webkit-calendar-picker-indicator": {
              filter: "opacity(0.5)",
              cursor: "pointer",
            },
          }}
          {...inputProps}
        />
        {endAdornment ? (
          <Box sx={{ display: "flex", alignItems: "center", pr: "10px", color: color.type.muted }}>
            {endAdornment}
          </Box>
        ) : null}
      </Box>

      {helperText ? (
        <TradAtlasText
          semanticFont={SF.textSm}
          sx={{
            color: error ? color.status.error.text : color.type.muted,
            fontWeight: error ? weight.medium : weight.regular,
          }}
        >
          {helperText}
        </TradAtlasText>
      ) : null}
    </Box>
  );
});

export default AtlasFormField;
