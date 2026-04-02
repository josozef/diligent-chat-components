import { Box } from "@mui/material";

/**
 * AI sparkle — Foundation Trad Atlas (Figma 16491:140).
 * Raster exports from Figma MCP; replace with hosted assets if URLs expire.
 *
 * @see https://www.figma.com/design/fAuIT7LY3ZqRZqTmbPU8p7/Foundation---Trad-Atlas?node-id=16491-140
 */
const SPARKLE_SRC = {
  md: "https://www.figma.com/api/mcp/asset/92462de3-9578-4dbf-a06f-fb8453c7ab4f",
  lg: "https://www.figma.com/api/mcp/asset/1f2ab1a5-6cdc-4b27-8006-e074a84fceec",
  xl: "https://www.figma.com/api/mcp/asset/fab1e62a-91ed-411b-829c-11d5bc433476",
  "2xl": "https://www.figma.com/api/mcp/asset/6ae1fa52-545d-491f-aa9a-520be7fdb9a6",
} as const;

export type AiSparkleSize = keyof typeof SPARKLE_SRC;

const SIZE_PX: Record<AiSparkleSize, number> = {
  md: 20,
  lg: 24,
  xl: 40,
  "2xl": 48,
};

export default function AiSparkle({
  size = "lg",
  animate = false,
  className,
}: {
  size?: AiSparkleSize;
  animate?: boolean;
  className?: string;
}) {
  const px = SIZE_PX[size];
  return (
    <Box
      component="img"
      src={SPARKLE_SRC[size]}
      alt=""
      className={className}
      width={px}
      height={px}
      sx={{
        display: "block",
        flexShrink: 0,
        ...(animate && {
          animation: "sparkle-thinking 1.6s ease-in-out infinite",
          "@keyframes sparkle-thinking": {
            "0%":   { transform: "scale(1) rotate(0deg)",   filter: "brightness(1)" },
            "25%":  { transform: "scale(1.25) rotate(12deg)", filter: "brightness(1.3)" },
            "50%":  { transform: "scale(1) rotate(0deg)",   filter: "brightness(1)" },
            "75%":  { transform: "scale(1.25) rotate(-12deg)", filter: "brightness(1.3)" },
            "100%": { transform: "scale(1) rotate(0deg)",   filter: "brightness(1)" },
          },
        }),
      }}
    />
  );
}
