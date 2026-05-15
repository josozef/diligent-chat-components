import { Box, Button } from "@mui/material";

import { CheckCircleIcon, WarningAmberIcon } from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import { SF } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

import AdaptiveCard from "./AdaptiveCard";
import { useWorkflowConversation } from "../WorkflowConversationContext";
import type { Candidate } from "../types";

export default function CandidateShortlistCard() {
  const { color, weight, radius } = useTokens();
  const { state, selectCandidate, resetCandidate, openAsset, cardAnchorId } =
    useWorkflowConversation();
  const selected = state.selectedCandidate;

  const renderRow = (c: Candidate) => {
    const isSelected = selected?.id === c.id;
    const isRecommended = c.recommended === true;
    const initials = c.name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const borderColor = isSelected
      ? color.status.success.default
      : isRecommended && !selected
        ? color.action.primary.default
        : color.outline.fixed;
    const background = isSelected
      ? color.status.success.background
      : isRecommended && !selected
        ? color.status.notification.background
        : color.surface.default;

    return (
      <Box
        key={c.id}
        sx={{
          border: `1px solid ${borderColor}`,
          borderRadius: radius.md,
          background,
          padding: "10px 12px",
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
        }}
      >
        <Box
          aria-hidden
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#7B53D6",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: weight.semiBold,
            flexShrink: 0,
          }}
        >
          {initials}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", gap: "8px", alignItems: "baseline", flexWrap: "wrap" }}>
            <TradAtlasText
              semanticFont={SF.textSmEmphasis}
              sx={{ color: color.type.default, fontWeight: weight.semiBold }}
            >
              {c.name}
            </TradAtlasText>
            <Box
              sx={{
                fontSize: "11px",
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
            {isRecommended ? (
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
            semanticFont={SF.textXs}
            sx={{ color: color.type.muted, mt: "2px" }}
          >
            {c.title}
          </TradAtlasText>
          <Box
            sx={{
              display: "flex",
              gap: "6px",
              alignItems: "center",
              mt: "6px",
              color: c.resident ? color.status.success.text : color.status.warning.text,
            }}
          >
            {c.resident ? (
              <CheckCircleIcon sx={{ fontSize: 14 }} />
            ) : (
              <WarningAmberIcon sx={{ fontSize: 14 }} />
            )}
            <TradAtlasText
              semanticFont={SF.textXs}
              sx={{ color: "inherit" }}
            >
              {c.notes}
            </TradAtlasText>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          {selected ? (
            isSelected ? (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  color: color.status.success.text,
                  fontWeight: weight.semiBold,
                  fontSize: "12px",
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 14 }} />
                Selected
              </Box>
            ) : (
              <Button variant="text" size="small" disabled sx={{ textTransform: "none" }}>
                Not selected
              </Button>
            )
          ) : (
            <Button
              variant={isRecommended ? "contained" : "outlined"}
              color={isRecommended ? "primary" : "inherit"}
              size="small"
              onClick={() => selectCandidate(c)}
              sx={{
                textTransform: "none",
                fontWeight: weight.semiBold,
                borderColor: !isRecommended ? color.outline.fixed : undefined,
              }}
            >
              Select
            </Button>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <AdaptiveCard
      title="Candidate shortlist"
      subtitle="Workday · Singapore Companies Act eligibility filter"
      status={selected ? "resolved" : "awaiting"}
      statusLabel={selected ? "Selected" : "Pick one"}
      anchorId={cardAnchorId("identify-candidate")}
      body={
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {state.candidatePool.map(renderRow)}
        </Box>
      }
      footer={
        selected ? (
          <>
            <Button
              variant="text"
              size="small"
              onClick={resetCandidate}
              sx={{
                textTransform: "none",
                color: color.type.muted,
                fontWeight: weight.medium,
              }}
            >
              Pick a different candidate
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => openAsset("candidate-shortlist")}
              sx={{
                textTransform: "none",
                fontWeight: weight.semiBold,
                borderColor: color.outline.fixed,
              }}
            >
              View shortlist
            </Button>
          </>
        ) : null
      }
    />
  );
}
