import type { ThinkingStep } from "../../components/ai";

export const GOVERNANCE_THINKING_STEPS: ThinkingStep[] = [
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
    body: "Board resolution or shareholder ordinary resolution depending on the Articles. The appointee must give written Consent to Act. Form AP01 goes to Companies House within 14 days and must include the director\u2019s PIC.",
  },
  {
    title: "Considering subsidiary-specific duties",
    body: "A common pitfall: under s.172 CA 2006, fiduciary duties run to the subsidiary itself \u2014 not the parent group. Directors must exercise independent judgment even if seconded from the parent. Intercompany conflicts must be declared.",
  },
  {
    title: "Structuring the response",
    body: "I\u2019ll organise into four sections: eligibility criteria, internal authorisation, filing obligations, and subsidiary-specific duties. That\u2019s the logical sequence a lawyer would walk through.",
  },
];
