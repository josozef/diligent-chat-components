import { Box, Stack, Typography } from "@mui/material";
import {
  atlasSemanticColor as color,
  atlasFontWeight as weight,
} from "../../tokens/atlasLight";

const body = {
  fontSize: "16px",
  lineHeight: "24px",
  letterSpacing: "0.2px",
  color: color.type.default,
} as const;

const Bold = ({ children }: { children: React.ReactNode }) => (
  <Box component="span" sx={{ fontWeight: weight.semiBold }}>{children}</Box>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <Typography sx={{ ...body, fontWeight: weight.semiBold }}>{children}</Typography>
);

const BulletList = ({ children }: { children: React.ReactNode }) => (
  <Box
    component="ul"
    sx={{ m: 0, pl: "24px", ...body, "& li": { mb: "12px" }, "& li::marker": { color: color.type.default } }}
  >
    {children}
  </Box>
);

export const GOVERNANCE_RESPONSE_SECTIONS: React.ReactNode[] = [
  /* Section 1 — Intro */
  <Stack spacing="16px">
    <Typography sx={body} component="p">
      Appointing a board member (director) to a UK subsidiary involves complying with the{" "}
      <Bold>Companies Act 2006</Bold>, the newly implemented{" "}
      <Bold>Economic Crime and Corporate Transparency Act 2023 (ECCTA)</Bold>, and the company&apos;s own{" "}
      <Bold>Articles of Association</Bold>.
    </Typography>
    <Typography sx={body}>Here is a summary of the current legal requirements:</Typography>
  </Stack>,

  /* Section 2 — Statutory Eligibility */
  <Stack spacing="16px">
    <SectionHeading>Statutory eligibility criteria</SectionHeading>
    <Typography sx={body}>
      Before an appointment can proceed, the candidate must meet several baseline legal standards:
    </Typography>
    <BulletList>
      <li><Bold>Minimum age: </Bold>The individual must be at least 16 years old.</li>
      <li><Bold>Natural person requirement: </Bold>Every UK company must have at least one director who is a &quot;natural person.&quot; Corporate directors are permitted in certain situations, but they cannot act as the sole director.</li>
      <li><Bold>Disqualification checks: </Bold>The candidate must not be disqualified under the Company Directors Disqualification Act 1986, nor can they be an undischarged bankrupt without explicit court permission.</li>
      <li><Bold>Identity verification (mandatory since November 2025): </Bold>Under the ECCTA, all new directors must verify their identity with Companies House before their appointment is filed. Upon verification, the director receives a Personal Identification Code (PIC), which is legally required to process the appointment.</li>
    </BulletList>
  </Stack>,

  /* Section 3 — Internal Authorization */
  <Stack spacing="16px">
    <SectionHeading>Internal authorisation</SectionHeading>
    <Typography sx={body}>
      The procedural steps for appointment are governed by the subsidiary&apos;s Articles of Association:
    </Typography>
    <BulletList>
      <li><Bold>Board or shareholder approval: </Bold>In most standard articles (including the UK Model Articles), the existing board can appoint a new director by simple majority vote. The parent company (as sole or majority shareholder) also typically holds reserve powers to appoint or remove directors via an ordinary resolution.</li>
      <li><Bold>Consent to act: </Bold>The appointee must actively consent to the appointment, confirming they agree to assume the legal duties and liabilities of the role.</li>
    </BulletList>
  </Stack>,

  /* Section 4 — Filing obligations */
  <Stack spacing="16px">
    <SectionHeading>Filing and record-keeping obligations</SectionHeading>
    <Typography sx={body}>
      Once the appointment is approved, the subsidiary must complete the following administrative steps:
    </Typography>
    <BulletList>
      <li><Bold>Companies House notification: </Bold>The company must submit Form AP01 (for an individual) within 14 days of the appointment. This filing must include the new director&apos;s PIC.</li>
      <li><Bold>Centralised registers: </Bold>As of 18 November 2025, the ECCTA abolished the requirement for UK companies to maintain their own internal statutory registers. Companies House is now the single definitive register, making the 14-day deadline strictly enforced.</li>
    </BulletList>
  </Stack>,

  /* Section 5 — Subsidiary-Specific Duties */
  <Stack spacing="16px">
    <SectionHeading>Subsidiary-specific legal duties</SectionHeading>
    <Typography sx={body}>
      A common pitfall is for subsidiary directors to prioritise the parent company&apos;s interests over the entity they are appointed to. Under Section 172 of the Companies Act 2006, the director owes their fiduciary duties strictly to the subsidiary:
    </Typography>
    <BulletList>
      <li><Bold>Promote success: </Bold>They must act in a way that promotes the success of the subsidiary for the benefit of its members as a whole.</li>
      <li><Bold>Independent judgment: </Bold>They must exercise independent, objective judgment, even if they are simultaneously an executive or director of the parent company.</li>
      <li><Bold>Conflict of interest: </Bold>They must declare any conflicts of interest, particularly in commercial transactions between the subsidiary and the parent.</li>
    </BulletList>
  </Stack>,
];
