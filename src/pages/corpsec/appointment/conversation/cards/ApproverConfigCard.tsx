import { Box, Button } from "@mui/material";

import { SendOutlinedIcon, VisibilityOutlinedIcon } from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import { SF } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

import AdaptiveCard from "./AdaptiveCard";
import { useWorkflowConversation } from "../WorkflowConversationContext";
import FileChip from "./FileChip";

export default function ApproverConfigCard() {
  const { color, weight, radius } = useTokens();
  const { state, confirmApprovers, sendResolution, openAsset, cardAnchorId } =
    useWorkflowConversation();
  const sent = state.boardResolution.sent;
  const confirmed = state.approvers.confirmed;

  return (
    <AdaptiveCard
      title="Approvers & board resolution"
      subtitle="4 of 4 directors selected · meets bylaw quorum"
      status={sent ? "running" : confirmed ? "running" : "awaiting"}
      statusLabel={
        sent ? "Resolution dispatched" : confirmed ? "Ready to send" : "Confirm approvers"
      }
      anchorId={cardAnchorId("select-approvers")}
      body={
        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {state.approvers.selected.map((a) => (
              <Box
                key={a.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 10px",
                  border: `1px solid ${color.outline.fixed}`,
                  borderRadius: radius.md,
                  background: color.surface.default,
                }}
              >
                <Box
                  aria-hidden
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: color.action.primary.default,
                    color: color.action.primary.onPrimary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: weight.semiBold,
                    flexShrink: 0,
                  }}
                >
                  {a.initials}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <TradAtlasText
                    semanticFont={SF.textSmEmphasis}
                    sx={{
                      color: color.type.default,
                      fontWeight: weight.semiBold,
                    }}
                  >
                    {a.name}
                  </TradAtlasText>
                  <TradAtlasText
                    semanticFont={SF.textXs}
                    sx={{ color: color.type.muted, fontSize: "11px" }}
                  >
                    {a.title} · {a.fromCommittee}
                  </TradAtlasText>
                </Box>
              </Box>
            ))}
          </Box>

          <FileChip
            label="Board Resolution — Pacific Polymer Logistics.docx"
            metaLine="Cessation + appointment + filing authority"
            onClick={() => openAsset("board-resolution")}
          />
        </Box>
      }
      footer={
        sent ? (
          <Button
            variant="text"
            size="small"
            startIcon={<VisibilityOutlinedIcon sx={{ fontSize: 16 }} />}
            onClick={() => openAsset("board-resolution")}
            sx={{
              textTransform: "none",
              color: color.type.muted,
              fontWeight: weight.medium,
            }}
          >
            View resolution
          </Button>
        ) : confirmed ? (
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<SendOutlinedIcon sx={{ fontSize: 18 }} />}
            onClick={sendResolution}
            sx={{ textTransform: "none", fontWeight: weight.semiBold }}
          >
            Send resolution to all approvers
          </Button>
        ) : (
          <>
            <Button
              variant="outlined"
              size="small"
              startIcon={<VisibilityOutlinedIcon sx={{ fontSize: 16 }} />}
              onClick={() => openAsset("approver-list")}
              sx={{
                textTransform: "none",
                fontWeight: weight.semiBold,
                borderColor: color.outline.fixed,
              }}
            >
              Edit approvers
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={confirmApprovers}
              sx={{ textTransform: "none", fontWeight: weight.semiBold }}
            >
              Confirm list
            </Button>
          </>
        )
      }
    />
  );
}
