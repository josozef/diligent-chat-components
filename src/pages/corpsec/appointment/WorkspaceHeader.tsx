import { Box, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useNavigate } from "react-router";
import { useTokens } from "../../../hooks/useTokens";

interface WorkspaceHeaderProps {
  selectedCandidate: string | null;
}

export default function WorkspaceHeader({ selectedCandidate }: WorkspaceHeaderProps) {
  const navigate = useNavigate();
  const { color, weight } = useTokens();

  const title = selectedCandidate
    ? `Replace director David Chen with ${selectedCandidate}`
    : "Replace director David Chen";

  return (
    <Box
      sx={{
        height: 48,
        px: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `1px solid ${color.outline.fixed}`,
        background: color.surface.default,
        flexShrink: 0,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Box
          component="button"
          onClick={() => navigate("/corpsec")}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: color.type.muted,
            p: 0,
            "&:hover": { color: color.type.default },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} />
        </Box>

        <Typography
          sx={{
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: weight.medium,
            color: color.type.default,
          }}
        >
          {title}
        </Typography>
      </Box>

      <Box
        component="button"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          background: "transparent",
          border: `1px solid ${color.outline.fixed}`,
          borderRadius: "6px",
          cursor: "pointer",
          color: color.type.muted,
          fontSize: "13px",
          fontWeight: weight.medium,
          px: "10px",
          py: "4px",
          "&:hover": { color: color.type.default, borderColor: color.outline.default },
        }}
      >
        <VisibilityOutlinedIcon sx={{ fontSize: 15 }} />
        Preview
      </Box>
    </Box>
  );
}
