import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { DATA_SEMANTIC_FONT, SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

export type AtlasTextFieldProps = TextFieldProps;

/**
 * Outlined text field using Trad Atlas semantic typography for label, input, and helper text.
 * Matches Trad Atlas form field patterns (Figma: Components — Trad Atlas).
 */
export default function AtlasTextField({
  variant = "outlined",
  size = "small",
  fullWidth = true,
  sx,
  ...rest
}: AtlasTextFieldProps) {
  const { color } = useTokens();

  return (
    <TextField
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      data-atlas-component="TextField"
      data-atlas-variant="outlined - md"
      {...{ [DATA_SEMANTIC_FONT]: SF.textMd }}
      sx={{
        "& .MuiInputLabel-root": {
          ...semanticFontStyle(SF.textSm),
          color: color.type.muted,
          "&.Mui-focused": { color: color.action.primary.default },
        },
        "& .MuiOutlinedInput-input": {
          ...semanticFontStyle(SF.textMd),
          color: color.type.default,
        },
        "& .MuiFormHelperText-root": {
          ...semanticFontStyle(SF.textSm),
          mt: "4px",
        },
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          backgroundColor: color.surface.default,
          "& fieldset": {
            borderColor: color.outline.default,
          },
          "&:hover fieldset": {
            borderColor: color.outline.default,
          },
          "&.Mui-focused fieldset": {
            borderWidth: "1px",
            borderColor: color.action.primary.default,
          },
          "&.Mui-disabled": {
            backgroundColor: color.surface.subtle,
          },
        },
        "& .MuiInputBase-input.Mui-disabled": {
          WebkitTextFillColor: color.type.muted,
        },
        ...sx,
      }}
      {...rest}
    />
  );
}
