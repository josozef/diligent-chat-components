import { Box } from "@mui/material";

/** Mounts with a fade-in + slide-up entrance animation. Only render when content is ready. */
export default function RevealSection({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        width: "100%",
        animation: "section-reveal 0.45s ease both",
        "@keyframes section-reveal": {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {children}
    </Box>
  );
}
