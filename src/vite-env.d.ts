/// <reference types="vite/client" />

import type {} from "@mui/material/Button";
import type {} from "@mui/material/Chip";

declare module "@mui/material/Button" {
  interface ButtonProps {
    /** Trad Atlas semantic font path (Figma `Semantic/Font/...`) for inherited text styles. */
    "data-semantic-font"?: string;
  }
}

declare module "@mui/material/Chip" {
  interface ChipProps {
    "data-semantic-font"?: string;
  }
}

declare module "@mui/material/InputBase" {
  interface InputBaseProps {
    "data-semantic-font"?: string;
  }
}
