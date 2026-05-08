import { Box } from "@mui/material";

import { CheckCircleIcon, RadioButtonUncheckedIcon } from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import PulsingStatusDot from "@/components/common/PulsingStatusDot";
import { SF } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

import AdaptiveCard from "./AdaptiveCard";
import { useWorkflowConversation } from "../WorkflowConversationContext";
import type { AgenticSubstep } from "../types";

interface AgenticProgressCardProps {
  kind: "filing" | "entity";
}

export default function AgenticProgressCard({ kind }: AgenticProgressCardProps) {
  const { color } = useTokens();
  const { state, cardAnchorId } = useWorkflowConversation();

  const substeps =
    kind === "filing"
      ? state.agentic.filingSubsteps
      : state.agentic.entitySubsteps;

  const allDone = substeps.every((s) => s.status === "completed");
  const anyRunning = substeps.some((s) => s.status === "in_progress");

  const config =
    kind === "filing"
      ? {
          title: "Filing with ACRA",
          subtitle: "BizFile+ · Form 45 — Notification of Change of Director",
          anchor: cardAnchorId("filing"),
        }
      : {
          title: "Updating entity records",
          subtitle: `${state.entity.name} · register sync`,
          anchor: cardAnchorId("update-entities"),
        };

  return (
    <AdaptiveCard
      title={config.title}
      subtitle={config.subtitle}
      status={allDone ? "resolved" : anyRunning ? "running" : "awaiting"}
      statusLabel={allDone ? "Completed" : "Running"}
      anchorId={config.anchor}
      body={
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {substeps.map((s, idx) => (
            <SubstepRow key={idx} substep={s} />
          ))}
        </Box>
      }
      footer={
        allDone ? (
          <TradAtlasText
            semanticFont={SF.textXs}
            sx={{ color: color.type.muted, fontSize: "11px" }}
          >
            Audit trail recorded · no further input required
          </TradAtlasText>
        ) : null
      }
    />
  );
}

function SubstepRow({ substep }: { substep: AgenticSubstep }) {
  const { color, weight } = useTokens();
  const completed = substep.status === "completed";
  const inProgress = substep.status === "in_progress";

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <Box
        sx={{
          width: 20,
          height: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {completed ? (
          <CheckCircleIcon sx={{ fontSize: 18, color: color.status.success.text }} />
        ) : inProgress ? (
          <PulsingStatusDot size="sm" tone="info" />
        ) : (
          <RadioButtonUncheckedIcon
            sx={{ fontSize: 16, color: color.type.disabled }}
          />
        )}
      </Box>
      <TradAtlasText
        semanticFont={SF.textSm}
        sx={{
          flex: 1,
          color: completed ? color.type.muted : color.type.default,
          fontWeight: inProgress ? weight.semiBold : weight.regular,
        }}
      >
        {substep.name}
      </TradAtlasText>
      <TradAtlasText
        semanticFont={SF.textXs}
        sx={{ color: color.type.muted, fontSize: "11px", flexShrink: 0 }}
      >
        {substep.time ?? (inProgress ? "running…" : "queued")}
      </TradAtlasText>
    </Box>
  );
}
