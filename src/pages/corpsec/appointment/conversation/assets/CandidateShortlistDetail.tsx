import { Box, Button } from "@mui/material";

import {
  CheckCircleIcon,
  WarningAmberIcon,
} from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import { SF } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

import { useWorkflowConversation } from "../WorkflowConversationContext";

/**
 * Detailed view of the candidate shortlist for the right-hand asset rail.
 * Mirrors the in-chat shortlist card but with breathing room — reads like
 * an HR brief rather than a chat bubble.
 */
export default function CandidateShortlistDetail() {
  const { color, weight, radius } = useTokens();
  const { state, selectCandidate } = useWorkflowConversation();
  const selected = state.selectedCandidate;

  return (
    <Box
      sx={{
        flex: 1,
        overflow: "auto",
        background: color.surface.subtle,
        p: "24px",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Box>
          <TradAtlasText
            semanticFont={SF.titleH4Emphasis}
            sx={{ color: color.type.default, fontWeight: weight.semiBold }}
          >
            Candidate shortlist
          </TradAtlasText>
          <TradAtlasText
            semanticFont={SF.textSm}
            sx={{ color: color.type.muted, mt: "2px" }}
          >
            Sourced from Workday · filtered against Singapore Companies Act
            local-director rule · ranked by match score
          </TradAtlasText>
        </Box>

        {state.candidatePool.map((c) => {
          const isSelected = selected?.id === c.id;
          return (
            <Box
              key={c.id}
              sx={{
                background: color.surface.default,
                border: `1px solid ${
                  isSelected ? color.status.success.default : color.outline.fixed
                }`,
                borderRadius: radius.md,
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <Box
                  aria-hidden
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "#7B53D6",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: weight.semiBold,
                  }}
                >
                  {c.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "baseline", gap: "8px", flexWrap: "wrap" }}>
                    <TradAtlasText
                      semanticFont={SF.textMdEmphasis}
                      sx={{ color: color.type.default, fontWeight: weight.semiBold }}
                    >
                      {c.name}
                    </TradAtlasText>
                    <Box
                      sx={{
                        fontSize: "12px",
                        fontWeight: weight.semiBold,
                        px: "8px",
                        py: "1px",
                        borderRadius: 999,
                        background: color.status.notification.background,
                        color: color.action.primary.default,
                      }}
                    >
                      {c.matchPct}% match
                    </Box>
                    {c.recommended ? (
                      <Box
                        sx={{
                          fontSize: "10px",
                          fontWeight: weight.semiBold,
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                          px: "6px",
                          py: "1px",
                          borderRadius: "4px",
                          background: color.action.primary.default,
                          color: color.action.primary.onPrimary,
                        }}
                      >
                        Recommended
                      </Box>
                    ) : null}
                  </Box>
                  <TradAtlasText
                    semanticFont={SF.textSm}
                    sx={{ color: color.type.muted, mt: "2px" }}
                  >
                    {c.title}
                  </TradAtlasText>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: c.resident
                    ? color.status.success.text
                    : color.status.warning.text,
                }}
              >
                {c.resident ? (
                  <CheckCircleIcon sx={{ fontSize: 16 }} />
                ) : (
                  <WarningAmberIcon sx={{ fontSize: 16 }} />
                )}
                <TradAtlasText semanticFont={SF.textSm} sx={{ color: "inherit" }}>
                  {c.notes}
                </TradAtlasText>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {isSelected ? (
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      color: color.status.success.text,
                      fontWeight: weight.semiBold,
                      fontSize: "13px",
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 16 }} />
                    Selected for appointment
                  </Box>
                ) : (
                  <Button
                    variant={c.recommended ? "contained" : "outlined"}
                    color={c.recommended ? "primary" : "inherit"}
                    size="small"
                    onClick={() => selectCandidate(c)}
                    sx={{
                      textTransform: "none",
                      fontWeight: weight.semiBold,
                      borderColor: !c.recommended ? color.outline.fixed : undefined,
                    }}
                  >
                    Select {c.name.split(" ")[0]}
                  </Button>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
