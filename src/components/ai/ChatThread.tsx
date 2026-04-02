import { Box, Collapse, IconButton, Stack, Typography } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import AiSparkle from "./AiSparkle";
import {
  atlasSemanticColor as color,
  atlasSemanticRadius as radius,
  atlasFontWeight as weight,
} from "../../tokens/atlasLight";

export type ChatPhase = "idle" | "thinking" | "responding" | "done";

const body = {
  fontSize: "16px",
  lineHeight: "24px",
  letterSpacing: "0.2px",
  color: color.type.default,
} as const;

const bodySm = {
  fontSize: "12px",
  lineHeight: "16px",
  letterSpacing: "0.3px",
  color: color.type.default,
} as const;

const labelSmEmphasis = {
  ...bodySm,
  fontWeight: weight.semiBold,
} as const;

export const THINKING_STEPS: { title: string; body: string }[] = [
  {
    title: "Identifying the scope",
    body: "The user is asking about UK subsidiary board appointments specifically. I need to cover the Companies Act 2006 baseline and the ECCTA 2023 changes that came into effect in November 2025.",
  },
  {
    title: "Checking the ECCTA 2023 changes",
    body: "Key update: all new directors must verify their identity with Companies House before an appointment can be filed. They receive a Personal Identification Code (PIC). No PIC, no valid AP01 filing.",
  },
  {
    title: "Mapping statutory eligibility",
    body: "Core criteria: minimum age 16, at least one natural-person director on the board, no disqualification under CDDA 1986, and no undischarged bankruptcy. Standard, but worth stating clearly.",
  },
  {
    title: "Walking through the appointment process",
    body: "Board resolution or shareholder ordinary resolution depending on the Articles. The appointee must give written Consent to Act. Form AP01 goes to Companies House within 14 days and must include the director's PIC.",
  },
  {
    title: "Considering subsidiary-specific duties",
    body: "A common pitfall: under s.172 CA 2006, fiduciary duties run to the subsidiary itself — not the parent group. Directors must exercise independent judgment even if seconded from the parent. Intercompany conflicts must be declared.",
  },
  {
    title: "Structuring the response",
    body: "I'll organise into four sections: eligibility criteria, internal authorisation, filing obligations, and subsidiary-specific duties. That's the logical sequence a lawyer would walk through.",
  },
];

function FeedbackIconButton({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <IconButton
      aria-label={label}
      size="small"
      sx={{
        borderRadius: `${radius.md}`,
        color: color.type.muted,
        py: "6px",
        px: "4px",
        "&:hover": { background: color.action.secondary.hoverFill, color: color.type.default },
      }}
    >
      {children}
    </IconButton>
  );
}

function SuggestionChipFooter({ label }: { label: string }) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        height: "36px",
        border: `1px solid ${color.outline.static}`,
        borderRadius: "6px",
        px: "8px",
        background: color.background.base,
        cursor: "pointer",
        "&:hover": { background: color.surface.variant },
      }}
    >
      <Typography
        sx={{
          fontWeight: weight.semiBold,
          fontSize: "14px",
          lineHeight: "20px",
          letterSpacing: "0.2px",
          color: color.type.default,
          px: "8px",
        }}
      >
        {label}
      </Typography>
      <NorthEastIcon sx={{ fontSize: 16, color: color.type.default }} />
    </Box>
  );
}

/** Only mounts when visible so the container height always matches real content. */
function RevealSection({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        width: "100%",
        animation: "section-reveal 0.45s ease both",
        "@keyframes section-reveal": {
          from: { opacity: 0, transform: "translateY(10px)" },
          to:   { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {children}
    </Box>
  );
}

interface ChatThreadProps {
  phase: ChatPhase;
  /**
   * 0-based index of the thinking step currently being revealed.
   * -1 means thinking hasn't started yet.
   * Steps 0–(N-1) correspond to THINKING_STEPS entries.
   */
  activeThinkingStep: number;
  thinkingOpen: boolean;
  onToggleThinking: () => void;
  /** 0 = no sections, 1–5 = content sections, 6 = footer */
  visibleSections: number;
}

export default function ChatThread({
  phase,
  activeThinkingStep,
  thinkingOpen,
  onToggleThinking,
  visibleSections,
}: ChatThreadProps) {
  const isThinking = phase === "thinking";
  const showThread = phase !== "idle";

  if (!showThread) return null;

  /* Label for the expand toggle button */
  const toggleLabel = isThinking
    ? THINKING_STEPS[Math.max(0, activeThinkingStep)].title
    : thinkingOpen
    ? "Hide thinking"
    : "Show thinking";

  /* How many steps to render inside the panel */
  const stepsToShow = isThinking
    ? Math.min(activeThinkingStep + 1, THINKING_STEPS.length)
    : THINKING_STEPS.length;

  return (
    <Box
      sx={{
        maxWidth: 640,
        width: "100%",
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        py: "24px",
      }}
    >
      {/* User message */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
        <Box
          sx={{
            maxWidth: 520,
            minWidth: 280,
            background: color.surface.subtle,
            borderRadius: radius.md,
            px: "16px",
            py: "12px",
          }}
        >
          <Typography sx={body}>
            Summarize the legal requirements of appointing a subsidiary board member in the UK
          </Typography>
        </Box>
      </Box>

      {/* Thinking block */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>

        {/* Header row — always shows the animated sparkle + expandable toggle */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Box sx={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <AiSparkle size="lg" animate={isThinking} />
          </Box>

          <Box
            component="button"
            type="button"
            onClick={onToggleThinking}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              border: "none",
              borderRadius: "10px",
              px: "12px",
              py: "4px",
              background: "transparent",
              cursor: "pointer",
              color: color.type.default,
              "&:hover": { background: color.action.secondary.hoverFill },
            }}
          >
            <Typography
              sx={{
                fontWeight: weight.semiBold,
                fontSize: "14px",
                lineHeight: "20px",
                letterSpacing: "0.14px",
                color: isThinking ? color.type.muted : color.type.default,
                transition: "color 0.3s ease",
              }}
            >
              {toggleLabel}
            </Typography>
            {thinkingOpen ? (
              <ArrowDropUpIcon sx={{ fontSize: 24, color: isThinking ? color.type.muted : color.type.default }} />
            ) : (
              <ArrowDropDownIcon sx={{ fontSize: 24, color: isThinking ? color.type.muted : color.type.default }} />
            )}
          </Box>
        </Box>

        {/* Expandable thinking steps panel */}
        <Collapse in={thinkingOpen} timeout={280}>
          <Box
            sx={{
              background: color.surface.subtle,
              borderRadius: radius.lg,
              p: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              width: "100%",
            }}
          >
            {THINKING_STEPS.slice(0, stepsToShow).map((step, idx) => {
              const isActiveStep = isThinking && idx === stepsToShow - 1;
              return (
                <Box
                  key={step.title}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    opacity: isActiveStep ? 0.75 : 1,
                    transition: "opacity 0.3s ease",
                  }}
                >
                  <Typography sx={labelSmEmphasis}>{step.title}</Typography>
                  <Typography sx={{ ...bodySm, fontWeight: weight.regular }}>
                    {step.body}
                    {isActiveStep && (
                      <Box
                        component="span"
                        sx={{
                          display: "inline-block",
                          width: "1px",
                          height: "12px",
                          background: color.type.muted,
                          ml: "2px",
                          verticalAlign: "middle",
                          animation: "blink-cursor 1s step-end infinite",
                          "@keyframes blink-cursor": {
                            "0%, 100%": { opacity: 1 },
                            "50%": { opacity: 0 },
                          },
                        }}
                      />
                    )}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Collapse>
      </Box>

      {/* Response sections — revealed one by one */}
      {(phase === "responding" || phase === "done") && (
        <Stack spacing="24px" sx={{ width: "100%" }}>
          {/* Section 1 — intro */}
          {visibleSections >= 1 && <RevealSection>
            <Stack spacing="16px">
              <Typography sx={body} component="p">
                Appointing a board member (director) to a UK subsidiary involves complying with the{" "}
                <Box component="span" sx={{ fontWeight: weight.semiBold }}>
                  Companies Act 2006
                </Box>
                , the newly implemented{" "}
                <Box component="span" sx={{ fontWeight: weight.semiBold }}>
                  Economic Crime and Corporate Transparency Act 2023 (ECCTA)
                </Box>
                , and the company&apos;s own{" "}
                <Box component="span" sx={{ fontWeight: weight.semiBold }}>
                  Articles of Association
                </Box>
                .
              </Typography>
              <Typography sx={body}>Here is a summary of the current legal requirements:</Typography>
            </Stack>
          </RevealSection>}

          {/* Section 2 — Statutory Eligibility */}
          {visibleSections >= 2 && <RevealSection>
            <Stack spacing="16px">
              <Typography sx={{ ...body, fontWeight: weight.semiBold }}>Statutory eligibility criteria</Typography>
              <Typography sx={body}>
                Before an appointment can proceed, the candidate must meet several baseline legal standards:
              </Typography>
              <Box
                component="ul"
                sx={{ m: 0, pl: "24px", ...body, "& li": { mb: "12px" }, "& li::marker": { color: color.type.default } }}
              >
                <li>
                  <Box component="span" sx={{ fontWeight: weight.semiBold }}>Minimum age: </Box>
                  The individual must be at least 16 years old.
                </li>
                <li>
                  <Box component="span" sx={{ fontWeight: weight.semiBold }}>Natural person requirement: </Box>
                  Every UK company must have at least one director who is a &quot;natural person.&quot; Corporate directors are permitted in certain situations, but they cannot act as the sole director.
                </li>
                <li>
                  <Box component="span" sx={{ fontWeight: weight.semiBold }}>Disqualification checks: </Box>
                  The candidate must not be disqualified under the Company Directors Disqualification Act 1986, nor can they be an undischarged bankrupt without explicit court permission.
                </li>
                <li>
                  <Box component="span" sx={{ fontWeight: weight.semiBold }}>Identity verification (mandatory since November 2025): </Box>
                  Under the ECCTA, all new directors must verify their identity with Companies House before their appointment is filed. Upon verification, the director receives a Personal Identification Code (PIC), which is legally required to process the appointment.
                </li>
              </Box>
            </Stack>
          </RevealSection>}

          {/* Section 3 — Internal Authorization */}
          {visibleSections >= 3 && <RevealSection>
            <Stack spacing="16px">
              <Typography sx={{ ...body, fontWeight: weight.semiBold }}>Internal authorisation</Typography>
              <Typography sx={body}>
                The procedural steps for appointment are governed by the subsidiary&apos;s Articles of Association:
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: "24px", ...body, "& li": { mb: "12px" } }}>
                <li>
                  <Box component="span" sx={{ fontWeight: weight.semiBold }}>Board or shareholder approval: </Box>
                  In most standard articles (including the UK Model Articles), the existing board can appoint a new director by simple majority vote. The parent company (as sole or majority shareholder) also typically holds reserve powers to appoint or remove directors via an ordinary resolution.
                </li>
                <li>
                  <Box component="span" sx={{ fontWeight: weight.semiBold }}>Consent to act: </Box>
                  The appointee must actively consent to the appointment, confirming they agree to assume the legal duties and liabilities of the role.
                </li>
              </Box>
            </Stack>
          </RevealSection>}

          {/* Section 4 — Filing obligations */}
          {visibleSections >= 4 && <RevealSection>
            <Stack spacing="16px">
              <Typography sx={{ ...body, fontWeight: weight.semiBold }}>Filing and record-keeping obligations</Typography>
              <Typography sx={body}>
                Once the appointment is approved, the subsidiary must complete the following administrative steps:
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: "24px", ...body, "& li": { mb: "12px" } }}>
                <li>
                  <Box component="span" sx={{ fontWeight: weight.semiBold }}>Companies House notification: </Box>
                  The company must submit Form AP01 (for an individual) within 14 days of the appointment. This filing must include the new director&apos;s PIC.
                </li>
                <li>
                  <Box component="span" sx={{ fontWeight: weight.semiBold }}>Centralised registers: </Box>
                  As of 18 November 2025, the ECCTA abolished the requirement for UK companies to maintain their own internal statutory registers. Companies House is now the single definitive register, making the 14-day deadline strictly enforced.
                </li>
              </Box>
            </Stack>
          </RevealSection>}

          {/* Section 5 — Subsidiary-Specific Duties */}
          {visibleSections >= 5 && <RevealSection>
            <Stack spacing="16px">
              <Typography sx={{ ...body, fontWeight: weight.semiBold }}>Subsidiary-specific legal duties</Typography>
              <Typography sx={body}>
                A common pitfall is for subsidiary directors to prioritise the parent company&apos;s interests over the entity they are appointed to. Under Section 172 of the Companies Act 2006, the director owes their fiduciary duties strictly to the subsidiary:
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: "24px", ...body, "& li": { mb: "12px" } }}>
                <li>
                  <Box component="span" sx={{ fontWeight: weight.semiBold }}>Promote success: </Box>
                  They must act in a way that promotes the success of the subsidiary for the benefit of its members as a whole.
                </li>
                <li>
                  <Box component="span" sx={{ fontWeight: weight.semiBold }}>Independent judgment: </Box>
                  They must exercise independent, objective judgment, even if they are simultaneously an executive or director of the parent company.
                </li>
                <li>
                  <Box component="span" sx={{ fontWeight: weight.semiBold }}>Conflict of interest: </Box>
                  They must declare any conflicts of interest, particularly in commercial transactions between the subsidiary and the parent.
                </li>
              </Box>
            </Stack>
          </RevealSection>}

          {/* Section 6 — Footer */}
          {visibleSections >= 6 && <RevealSection>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", pt: "8px" }}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                <FeedbackIconButton label="Thumbs up">
                  <ThumbUpOutlinedIcon sx={{ fontSize: 24 }} />
                </FeedbackIconButton>
                <FeedbackIconButton label="Thumbs down">
                  <ThumbDownOutlinedIcon sx={{ fontSize: 24 }} />
                </FeedbackIconButton>
                <FeedbackIconButton label="Copy">
                  <ContentCopyIcon sx={{ fontSize: 24 }} />
                </FeedbackIconButton>
                <FeedbackIconButton label="Share">
                  <ShareOutlinedIcon sx={{ fontSize: 24 }} />
                </FeedbackIconButton>
                <FeedbackIconButton label="Export">
                  <FileDownloadOutlinedIcon sx={{ fontSize: 24 }} />
                </FeedbackIconButton>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    lineHeight: "20px",
                    letterSpacing: "0.2px",
                    fontWeight: weight.regular,
                    color: color.type.muted,
                  }}
                >
                  Suggested actions
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  <SuggestionChipFooter label="Get started on next step" />
                  <SuggestionChipFooter label="Summarize article" />
                  <SuggestionChipFooter label="Analyze data" />
                </Box>
              </Box>
            </Box>
          </RevealSection>}
        </Stack>
      )}
    </Box>
  );
}
