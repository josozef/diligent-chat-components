import { InputAdornment, TextField } from "@mui/material";

import { SearchOutlinedIcon } from "@/icons";
import { SF, semanticFontStyle } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

export interface SearchFieldProps {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}

/**
 * Sticky search input shared by every corp-sec list-view page (workflow
 * picker, workflow history, all chats). Wraps an MUI `TextField` with the
 * Atlas search icon and the design system's text-md font, so each page can
 * drop one in without re-implementing the styling.
 */
export default function SearchField({
  value,
  onChange,
  placeholder = "Search…",
}: SearchFieldProps) {
  const { color, radius } = useTokens();

  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      fullWidth
      size="small"
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlinedIcon
                sx={{ fontSize: 20, color: color.type.muted }}
              />
            </InputAdornment>
          ),
        },
      }}
      sx={{
        background: color.surface.default,
        borderRadius: radius.md,
        "& .MuiOutlinedInput-root": {
          borderRadius: radius.md,
          ...semanticFontStyle(SF.textMd),
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: color.outline.fixed,
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: color.outline.hover,
        },
      }}
    />
  );
}
