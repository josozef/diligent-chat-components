import { Box } from "@mui/material";

import TradAtlasText from "@/components/common/TradAtlasText";
import { SF } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

import { useWorkflowConversation } from "../WorkflowConversationContext";

/**
 * Detailed view of the selected approver panel for the right-hand asset rail.
 * The approver list is currently fixed (matches the Teams reference) — this
 * surface is read-only for now, with edit affordances added when we wire the
 * real approver picker.
 */
export default function ApproverListDetail() {
  const { color, weight, radius } = useTokens();
  const { state } = useWorkflowConversation();

  return (
    <Box
      sx={{
        flex: 1,
        overflow: "auto",
        background: color.surface.subtle,
        p: "24px",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Box>
          <TradAtlasText
            semanticFont={SF.titleH4Emphasis}
            sx={{ color: color.type.default, fontWeight: weight.semiBold }}
          >
            Approver list
          </TradAtlasText>
          <TradAtlasText
            semanticFont={SF.textSm}
            sx={{ color: color.type.muted, mt: "2px" }}
          >
            Pre-selected from the Nominating &amp; Governance committee, the
            sitting CEO, and two independent directors — the bylaw quorum for
            an APAC director appointment.
          </TradAtlasText>
        </Box>

        {state.approvers.selected.map((a) => (
          <Box
            key={a.id}
            sx={{
              background: color.surface.default,
              border: `1px solid ${color.outline.fixed}`,
              borderRadius: radius.md,
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <Box
              aria-hidden
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: color.action.primary.default,
                color: color.action.primary.onPrimary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: weight.semiBold,
                flexShrink: 0,
              }}
            >
              {a.initials}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <TradAtlasText
                semanticFont={SF.textMdEmphasis}
                sx={{ color: color.type.default, fontWeight: weight.semiBold }}
              >
                {a.name}
              </TradAtlasText>
              <TradAtlasText
                semanticFont={SF.textSm}
                sx={{ color: color.type.muted }}
              >
                {a.title}
              </TradAtlasText>
              <TradAtlasText
                semanticFont={SF.textXs}
                sx={{ color: color.type.muted, fontSize: "11px", mt: "2px" }}
              >
                {a.fromCommittee} · {a.email}
              </TradAtlasText>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
