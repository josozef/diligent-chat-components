import { Box, Drawer, IconButton } from "@mui/material";

import { CloseIcon } from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import { SF } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

import ConsentToActEditor from "../ConsentToActEditor";
import BoardResolutionEditor from "../BoardResolutionEditor";

import { useWorkflowConversation } from "./WorkflowConversationContext";
import type { AssetId } from "./types";
import CandidateShortlistDetail from "./assets/CandidateShortlistDetail";
import ApproverListDetail from "./assets/ApproverListDetail";
import Form45NotificationEditor from "./assets/Form45NotificationEditor";

interface AssetMeta {
  id: AssetId;
  label: string;
  caption: string;
}

const ASSET_META: AssetMeta[] = [
  {
    id: "candidate-shortlist",
    label: "Candidate shortlist",
    caption: "Workday + Singapore eligibility filter",
  },
  {
    id: "consent-to-act",
    label: "Consent to Act (Form 45)",
    caption: "Companies Act s.145(5)",
  },
  {
    id: "approver-list",
    label: "Approver list",
    caption: "Nominating & Governance + CEO + 2 independents",
  },
  {
    id: "board-resolution",
    label: "Board Resolution",
    caption: "Cessation + appointment + filing authority",
  },
  {
    id: "form45-notification",
    label: "Form 45 — Notification",
    caption: "Lodged with ACRA via BizFile+",
  },
];

/**
 * On-demand asset surface. The conversational workspace no longer reserves a
 * permanent right column for documents — clicking an asset (from the chat
 * cards or the side-rail Assets list) opens this Drawer over the chat, and
 * dismissing it returns the user to the conversation. The chat stays at its
 * fixed center column underneath.
 */
export default function AssetDrawer() {
  const { color, radius } = useTokens();
  const { state, openAsset } = useWorkflowConversation();

  const isOpen =
    state.rightPanel.open !== null && state.rightPanel.open !== "list";
  const assetId = isOpen ? (state.rightPanel.open as AssetId) : null;
  const meta = assetId ? ASSET_META.find((m) => m.id === assetId) : null;

  const close = () => openAsset(null);

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={close}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 560, md: 720, lg: 800 },
          maxWidth: "100vw",
          background: color.surface.default,
          borderTopLeftRadius: radius.lg,
          borderBottomLeftRadius: radius.lg,
          overflow: "hidden",
        },
      }}
    >
      {assetId ? (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Box
            sx={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              px: "20px",
              py: "14px",
              borderBottom: `1px solid ${color.outline.fixed}`,
              background: color.surface.default,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <TradAtlasText
                semanticFont={SF.textMdEmphasis}
                sx={{
                  color: color.type.default,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {meta?.label ?? "Asset"}
              </TradAtlasText>
              {meta?.caption ? (
                <TradAtlasText
                  semanticFont={SF.textXs}
                  sx={{
                    color: color.type.muted,
                    fontSize: "11px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {meta.caption}
                </TradAtlasText>
              ) : null}
            </Box>
            <IconButton
              size="small"
              aria-label="Close asset"
              onClick={close}
              sx={{ color: color.type.muted }}
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "auto",
            }}
          >
            <AssetBody assetId={assetId} />
          </Box>
        </Box>
      ) : null}
    </Drawer>
  );
}

function AssetBody({ assetId }: { assetId: AssetId }) {
  const { state, sendConsent, sendResolution } = useWorkflowConversation();

  switch (assetId) {
    case "candidate-shortlist":
      return <CandidateShortlistDetail />;

    case "approver-list":
      return <ApproverListDetail />;

    case "consent-to-act": {
      const appointee = state.selectedCandidate;
      if (!appointee) {
        return <EmptyDetail label="Select a candidate to draft this document." />;
      }
      return (
        <ConsentToActEditor
          appointeeName={appointee.name}
          appointeeNric={state.appointmentNric}
          effectiveDate={state.appointmentEffectiveDate}
          onReplaceDocument={() => undefined}
          onSendForSignature={sendConsent}
          signatureSent={state.consentDocument.sent}
        />
      );
    }

    case "board-resolution": {
      const appointee = state.selectedCandidate;
      if (!appointee) {
        return <EmptyDetail label="Select a candidate to draft this resolution." />;
      }
      return (
        <BoardResolutionEditor
          companyName={state.entity.name}
          companyUen={state.entity.uen}
          appointeeName={appointee.name}
          appointeeNric={state.appointmentNric ?? ""}
          appointeeAddress="14 Nassim Road, #08-02, Singapore 258395"
          effectiveDate={state.appointmentEffectiveDate ?? ""}
          departingDirector={state.departingDirector?.name ?? "—"}
          onApproveAndSend={sendResolution}
          approved={state.boardResolution.sent}
        />
      );
    }

    case "form45-notification": {
      const appointee = state.selectedCandidate;
      if (!appointee) {
        return <EmptyDetail label="Form 45 will be available once filing begins." />;
      }
      return (
        <Form45NotificationEditor
          companyName={state.entity.name}
          companyUen={state.entity.uen}
          appointeeName={appointee.name}
          appointeeNric={state.appointmentNric ?? ""}
          appointeeAddress="14 Nassim Road, #08-02, Singapore 258395"
          appointeeNationality="Singaporean"
          appointeeDateOfBirth="12 March 1979"
          effectiveDate={state.appointmentEffectiveDate ?? ""}
          departingDirectorName={state.departingDirector?.name ?? "—"}
          departingDirectorLastDay={state.trigger.lastWorkingDay}
        />
      );
    }
  }
}

function EmptyDetail({ label }: { label: string }) {
  const { color } = useTokens();
  return (
    <Box sx={{ p: "32px", textAlign: "center" }}>
      <TradAtlasText semanticFont={SF.textMd} sx={{ color: color.type.muted }}>
        {label}
      </TradAtlasText>
    </Box>
  );
}
