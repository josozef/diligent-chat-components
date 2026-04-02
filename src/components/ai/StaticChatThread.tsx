import { Box, IconButton, Stack, Typography } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import AiSparkle from "./AiSparkle";
import {
  atlasSemanticColor as color,
  atlasSemanticRadius as radius,
  atlasFontWeight as weight,
} from "../../tokens/atlasLight";

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

/** 66054 — expanded thinking: “Hide thinking” + steps */
function ThinkingExpandedStatic() {
  const steps: { title: string; body: string }[] = [
    {
      title: "Analyzing ECCTA Implementation",
      body: "I've clarified the ECCTA's IDV mandate, highlighting the 2025 deadline and new director requirements.",
    },
    {
      title: "Clarifying Subsidiary Boards",
      body: "I've now defined the prompt and determined I'm generating the first response, so I will prioritize ECCTA's implications for UK subsidiary board appointments.",
    },
    {
      title: "Defining Director Qualifications",
      body: "I've outlined statutory eligibility, including age, natural person, and disqualification checks for board appointments.",
    },
    {
      title: "Detailing Appointment Procedures",
      body: "I've now mapped the director appointment process, outlining board/shareholder approval, consent, filing, and subsidiary duties.",
    },
    {
      title: "Assessing Director Duties",
      body: "I've clarified director's independent judgment and conflict disclosure duties within the subsidiary context.",
    },
    {
      title: "Updating Filing Processes",
      body: "I've learned the AP01 form filing is required within 14 days and the ECCTA abolished statutory registers.",
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
        <Box sx={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <AiSparkle size="lg" />
        </Box>
        <Box
          component="button"
          type="button"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            border: "none",
            borderRadius: "10px",
            px: "12px",
            py: "4px",
            background: "transparent",
            cursor: "default",
            color: color.type.default,
          }}
        >
          <Typography
            sx={{
              fontWeight: weight.semiBold,
              fontSize: "14px",
              lineHeight: "20px",
              letterSpacing: "0.14px",
            }}
          >
            Hide thinking
          </Typography>
          <ArrowDropUpIcon sx={{ fontSize: 24 }} />
        </Box>
      </Box>

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
        {steps.map((step) => (
          <Box key={step.title} sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <Typography sx={labelSmEmphasis}>{step.title}</Typography>
            <Typography sx={{ ...bodySm, fontWeight: weight.regular }}>{step.body}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function FeedbackIconButton({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <IconButton
      aria-label={label}
      size="small"
      sx={{
        borderRadius: `${radius.md}`,
        color: color.action.secondary.onSecondary,
        py: "6px",
        px: "4px",
        "&:hover": { background: color.action.secondary.hoverFill },
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
      <ArrowRightAltIcon sx={{ fontSize: 24, color: color.type.default }} />
    </Box>
  );
}

function AssistantBody() {
  return (
    <Stack spacing="24px" sx={{ width: "100%" }}>
      <Box>
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
      </Box>
      <Typography sx={body}>Here is a summary of the current legal requirements:</Typography>

      <Stack spacing="16px">
        <Typography sx={{ ...body, fontWeight: weight.semiBold }}>Statutory Eligibility Criteria</Typography>
        <Typography sx={body}>
          Before an appointment can proceed, the candidate must meet several baseline legal standards:
        </Typography>
        <Box
          component="ul"
          sx={{
            m: 0,
            pl: "24px",
            ...body,
            "& li": { mb: "12px" },
            "& li::marker": { color: color.type.default },
          }}
        >
          <li>
            <Box component="span" sx={{ fontWeight: weight.semiBold }}>
              Minimum Age:{" "}
            </Box>
            The individual must be at least 16 years old.
          </li>
          <li>
            <Box component="span" sx={{ fontWeight: weight.semiBold }}>
              Natural Person Requirement:{" "}
            </Box>
            Every UK company must have at least one director who is a &quot;natural person&quot; (a human individual). While corporate directors (other legal entities) are permitted in certain situations, they cannot act as the sole director.
          </li>
          <li>
            <Box component="span" sx={{ fontWeight: weight.semiBold }}>
              Disqualification Checks:{" "}
            </Box>
            The candidate must not be disqualified from acting as a director under the Company Directors Disqualification Act 1986, nor can they be an undischarged bankrupt without explicit court permission.
          </li>
          <li>
            <Box component="span" sx={{ fontWeight: weight.semiBold }}>
              Identity Verification (Mandatory since November 2025):{" "}
            </Box>
            Under the ECCTA, all new directors must successfully verify their identity with Companies House before their appointment is filed. Upon verification, the director receives a Personal Identification Code (PIC), which is legally required to process the appointment.
          </li>
        </Box>
      </Stack>

      <Stack spacing="16px">
        <Typography sx={{ ...body, fontWeight: weight.semiBold }}>Internal Authorization</Typography>
        <Typography sx={body}>
          The procedural steps for appointment are governed by the subsidiary&apos;s Articles of Association:
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: "24px", ...body, "& li": { mb: "12px" } }}>
          <li>
            <Box component="span" sx={{ fontWeight: weight.semiBold }}>
              Board or Shareholder Approval:
            </Box>{" "}
            In most standard articles (including the UK Model Articles), the existing board of directors can appoint a new director via a simple majority vote. The parent company (as the sole or majority shareholder) also typically holds reserve powers to appoint or remove directors via an ordinary resolution.
          </li>
          <li>
            <Box component="span" sx={{ fontWeight: weight.semiBold }}>
              Consent to Act:
            </Box>{" "}
            The appointee must actively consent to the appointment, confirming they agree to assume the legal duties and liabilities of the role.
          </li>
        </Box>
      </Stack>

      <Stack spacing="16px">
        <Typography sx={{ ...body, fontWeight: weight.semiBold }}>Filing and Record-Keeping Obligations</Typography>
        <Typography sx={body}>
          Once the appointment is approved, the subsidiary must complete the following administrative steps:
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: "24px", ...body, "& li": { mb: "12px" } }}>
          <li>
            Companies House Notification: The company must submit Form AP01 (for an individual) to Companies House within 14 days of the appointment. This filing must include the new director&apos;s PIC.
          </li>
          <li>
            Centralised Registers: As of November 18, 2025, the ECCTA abolished the requirement for UK companies to maintain their own internal statutory registers (such as the Register of Directors or Persons with Significant Control). Companies House now acts as the single central, definitive register, making the 14-day filing deadline strictly enforced to keep public records accurate.
          </li>
        </Box>
      </Stack>

      <Stack spacing="16px">
        <Typography sx={{ ...body, fontWeight: weight.semiBold }}>Subsidiary-Specific Legal Duties</Typography>
        <Typography sx={body}>
          It is a common legal pitfall for subsidiary directors to prioritize the parent company&apos;s interests over the entity they are appointed to. Under Section 172 of the Companies Act 2006, the director owes their fiduciary duties strictly to the subsidiary:
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: "24px", ...body, "& li": { mb: "12px" } }}>
          <li>Promote Success: They must act in a way that promotes the success of the subsidiary company for the benefit of its members as a whole.</li>
          <li>
            Independent Judgment: They must exercise independent, objective judgment, even if they are simultaneously an executive or director of the parent company.
          </li>
          <li>
            Conflict of Interest: They must declare any conflicts of interest, particularly in commercial transactions or decisions between the subsidiary and the parent company.
          </li>
        </Box>
      </Stack>
    </Stack>
  );
}

function MessageFooter() {
  return (
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
  );
}

/**
 * Static Trad Atlas AI chat (Figma 66054:5630, footer 56719:1423).
 * Surfaces use `semantic.color.surface.subtle` (#f9f9fc) — Figma Color/Surface/Variant Subtle.
 */
export default function StaticChatThread() {
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
      <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
        <Box
          sx={{
            maxWidth: 592,
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

      <ThinkingExpandedStatic />

      <Stack spacing="24px" sx={{ width: "100%" }}>
        <AssistantBody />
        <MessageFooter />
      </Stack>
    </Box>
  );
}
