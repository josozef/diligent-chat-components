import { Box } from "@mui/material";

import { CheckCircleIcon, RadioButtonUncheckedIcon } from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import PulsingStatusDot from "@/components/common/PulsingStatusDot";
import { SF } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

import AdaptiveCard from "./AdaptiveCard";
import { useWorkflowConversation } from "../WorkflowConversationContext";

export default function VoteCard() {
  const { color, weight, radius } = useTokens();
  const { state, cardAnchorId } = useWorkflowConversation();
  const votes = state.agentic.votes;
  const approved = votes.filter((v) => v.status === "approved").length;
  const total = votes.length;
  const allApproved = approved === total;

  return (
    <AdaptiveCard
      title="Board approval"
      subtitle={`${approved} of ${total} approved`}
      status={allApproved ? "resolved" : "running"}
      statusLabel={allApproved ? "Approved" : "Voting in progress"}
      anchorId={cardAnchorId("board-approval")}
      body={
        <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {votes.map((v) => {
            const isApproved = v.status === "approved";
            return (
              <Box
                key={v.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 10px",
                  border: `1px solid ${color.outline.fixed}`,
                  borderRadius: radius.md,
                  background: isApproved
                    ? color.status.success.background
                    : color.surface.default,
                }}
              >
                {isApproved ? (
                  <CheckCircleIcon
                    sx={{ fontSize: 18, color: color.status.success.text }}
                  />
                ) : (
                  <Box sx={{ width: 18, height: 18 }}>
                    <PulsingStatusDot size="sm" tone="info" />
                  </Box>
                )}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <TradAtlasText
                    semanticFont={SF.textSmEmphasis}
                    sx={{
                      color: color.type.default,
                      fontWeight: weight.semiBold,
                    }}
                  >
                    {v.name}
                  </TradAtlasText>
                  <TradAtlasText
                    semanticFont={SF.textXs}
                    sx={{ color: color.type.muted, fontSize: "11px" }}
                  >
                    {v.title}
                  </TradAtlasText>
                </Box>
                <TradAtlasText
                  semanticFont={SF.textXs}
                  sx={{
                    color: isApproved ? color.status.success.text : color.type.muted,
                    fontWeight: weight.semiBold,
                  }}
                >
                  {isApproved ? `Approved · ${v.time ?? ""}` : "Awaiting"}
                </TradAtlasText>
              </Box>
            );
          })}
          {/* Subtle reminder that nothing here is silent: */}
          <Box
            aria-hidden
            sx={{ display: "flex", alignItems: "center", gap: "6px", mt: "4px" }}
          >
            <RadioButtonUncheckedIcon sx={{ fontSize: 12, color: color.type.muted }} />
            <TradAtlasText
              semanticFont={SF.textXs}
              sx={{ color: color.type.muted, fontSize: "11px" }}
            >
              Each approver reviews the resolution and Form 45 in their own
              channel; the agent will tally and surface results here.
            </TradAtlasText>
          </Box>
        </Box>
      }
    />
  );
}
