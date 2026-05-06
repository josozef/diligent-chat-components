/**
 * Shared HTML builders for the documents that flow through the board-appointment
 * workflow. These power both the in-editor previews (Board Resolution, Form 45 —
 * Consent) and the end-of-workflow downloads on the Regulatory Filing step.
 *
 * Keeping a single source of truth means the document the user reviewed in the
 * editor is bit-identical to the one they download from "Documents filed".
 */

const FIELD =
  'style="border-bottom: 1.5px solid #1a1a1a; padding: 0 4px 1px; min-width: 120px; display: inline-block;"';
const FIELD_WIDE =
  'style="border-bottom: 1.5px solid #1a1a1a; padding: 0 4px 1px; min-width: 280px; display: inline-block;"';
const FIELD_FULL =
  'style="border-bottom: 1.5px solid #1a1a1a; padding: 0 4px 1px; width: 100%; display: inline-block; margin-top: 4px;"';
const BLANK =
  'style="border-bottom: 1.5px solid #999; padding: 0 4px 1px; min-width: 200px; display: inline-block; color: #888; font-style: italic;"';
const SIG_BOX_LG =
  'style="border: 1.5px solid #1a1a1a; min-height: 64px; padding: 12px; margin-top: 4px; display: block;"';
const SIG_BOX =
  'style="border: 1.5px solid #1a1a1a; min-height: 56px; padding: 12px; margin-top: 4px; display: block;"';
const PAGE_BREAK =
  'style="border: none; border-top: 2px dashed #bbb; margin: 36px 0; position: relative;"';
const PAGE_LABEL =
  'style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #fff; padding: 0 12px; font-size: 11px; color: #999; letter-spacing: 0.5px;"';

function val(v: string, placeholder = ""): string {
  if (v) return `<span ${FIELD}>${v}</span>`;
  return `<span ${BLANK}>${placeholder || "&nbsp;"}</span>`;
}

function valWide(v: string, placeholder = ""): string {
  if (v) return `<span ${FIELD_WIDE}>${v}</span>`;
  return `<span ${BLANK}>${placeholder || "&nbsp;"}</span>`;
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "[date to be confirmed]";
  // Accept either YYYY-MM-DD or anything Date can parse.
  const parsed = new Date(iso.includes("T") ? iso : `${iso}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleDateString("en-SG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ── Form 45 — Consent to Act as Director ──────────────────────── */

export interface Form45ConsentData {
  companyName: string;
  companyUen: string;
  appointeeName: string;
  appointeeNric: string;
  appointeeNationality: string;
  appointeeAddress: string;
  effectiveDate: string;
}

export function buildForm45ConsentHtml(d: Form45ConsentData): string {
  const todayParts = new Date();
  const day = todayParts.getDate().toString();
  const month = todayParts.toLocaleDateString("en-SG", { month: "long" });
  const year = todayParts.getFullYear().toString();

  return `
<h2 style="text-align: center; margin-bottom: 2px;">CONSENT TO ACT AS DIRECTOR</h2>
<p style="text-align: center; margin-bottom: 24px;"><em>(Pursuant to Section 145(5) of the Companies Act, Cap. 50)</em></p>

<p><strong>Name of Company:</strong><br>${val(d.companyName)}</p>

<p><strong>Company No.:</strong><br>${val(d.companyUen)}</p>

<hr>

<p>I, the undermentioned person, declare that:</p>

<p><strong>(a)</strong>&nbsp; I consent to act as a director of the abovementioned company with effect from ${val(d.effectiveDate, "[date to be confirmed]")} (date).</p>

<p><strong>(b)</strong>&nbsp; I shall be personally responsible for the discharge of all obligations attached to the company under the Companies Act.</p>

<p><strong>(c)</strong>&nbsp; I am not disqualified from acting as a director, in that:</p>

<p style="padding-left: 28px;"><strong>(i)</strong>&nbsp; I am at least 18 years of age, of full capacity and not an undischarged bankrupt in Singapore or any foreign jurisdiction;</p>

<p style="padding-left: 28px;"><strong>(ii)</strong>&nbsp; There is no disqualification order made by the High Court of Singapore against me currently in force;</p>

<p style="padding-left: 28px;"><strong>(iii)</strong>&nbsp; Within a period of 5 years preceding the date of this statement, I have —</p>

<p style="padding-left: 56px;"><strong>(A)</strong>&nbsp; not been convicted, in Singapore or elsewhere, of any offence involving fraud or dishonesty punishable with imprisonment for 3 months or more;**</p>

<p style="padding-left: 56px;"><strong>(B)</strong>&nbsp; not been convicted of 3 or more offences under the Companies Act relating to the requirements of:</p>

<p style="padding-left: 84px;">a.&nbsp; filing any returns, accounts or other documents with the Registrar of Companies, or</p>

<p style="padding-left: 84px;">b.&nbsp; giving notice of any matter to the Registrar of Companies;</p>

<p style="padding-left: 56px;">and</p>

<p style="padding-left: 56px;"><strong>(C)</strong>&nbsp; not had 3 or more orders of the High Court of Singapore made against me in relation to such requirements in (B).</p>

<p style="padding-left: 28px;"><strong>(iv)</strong>&nbsp; I am not disqualified under the Limited Liability Partnerships Act from being a manager of a limited liability partnership.</p>

<p><strong>(d)</strong>&nbsp; *I have read and understood the above statements / the above statements were interpreted to me in</p>

<p>${valWide("English", "[state language/dialect]")}</p>

<p>by ${valWide("—", "[state name]")}</p>

<p>NRIC NO: ${valWide("—", "[NRIC of interpreter]")}</p>

<p>before I executed this form and I confirm that the statements are true. I am also aware that I can be prosecuted in Court if I willingly give any information on this form which is false.</p>

<div ${PAGE_BREAK}><span ${PAGE_LABEL}>PAGE 1 OF 2</span></div>

<h3 style="margin-bottom: 16px;">Particulars of Director</h3>

<p><strong>Name:</strong><br><span ${FIELD_FULL}>${d.appointeeName}</span></p>

<p><strong>Address:</strong><br><span ${FIELD_FULL}>${d.appointeeAddress}</span></p>

<p><strong>*NRIC / Passport No.:</strong><br><span ${FIELD_FULL}>${d.appointeeNric || "<em>[To be provided — enter in Appointee Details tab]</em>"}</span></p>

<p><strong>Nationality:</strong><br><span ${FIELD_FULL}>${d.appointeeNationality}</span></p>

<p><strong>Signature:</strong></p>
<div ${SIG_BOX_LG}><em style="color: #888;">[ Electronic signature to be captured upon submission ]</em></div>

<p style="margin-top: 20px;">Dated this ${val(day)} day of ${val(month)}, ${val(year)}</p>

<hr>

<p style="font-size: 12px; color: #666;">*Delete as appropriate.</p>
<p style="font-size: 12px; color: #666;">** Where the disqualified person is sentenced to imprisonment, the disqualification takes effect on conviction and continues for a period of 5 years after release from prison.</p>

<div ${PAGE_BREAK}><span ${PAGE_LABEL}>PAGE 2 OF 2</span></div>

<h3 style="text-align: center; margin-bottom: 4px;">Form 45 — Continuation Sheet 1</h3>

<p><strong>Name of Company:</strong><br>${val(d.companyName)}</p>

<p><strong>Company No.:</strong><br>${val(d.companyUen)}</p>

<p style="margin-top: 20px;"><em style="color: #888;">[ No additional directors on this filing. ]</em></p>
`;
}

/* ── Board Resolution ──────────────────────────────────────────── */

export interface BoardResolutionData {
  companyName: string;
  companyUen: string;
  appointeeName: string;
  appointeeNric: string;
  appointeeAddress: string;
  effectiveDate: string;
  departingDirector: string;
}

export function buildBoardResolutionHtml(d: BoardResolutionData): string {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-SG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const effectiveFormatted = formatDate(d.effectiveDate);

  return `
<h2 style="text-align: center; margin-bottom: 2px;">BOARD RESOLUTION</h2>
<h3 style="text-align: center; margin-bottom: 2px;">WRITTEN RESOLUTION OF THE BOARD OF DIRECTORS</h3>
<p style="text-align: center; margin-bottom: 24px;"><em>of</em></p>
<h3 style="text-align: center; margin-bottom: 4px;">${d.companyName.toUpperCase()}</h3>
<p style="text-align: center; margin-bottom: 24px;">(Company Registration No. ${val(d.companyUen)})</p>
<p style="text-align: center; margin-bottom: 24px;"><em>(Pursuant to Article 104 of the Constitution and Section 184A of the Companies Act, Cap. 50)</em></p>

<hr>

<p style="margin-bottom: 20px;">We, being all the directors of <strong>${d.companyName}</strong> (the "<strong>Company</strong>") who are entitled to vote on the resolution set out below, hereby resolve as follows:</p>

<h3 style="margin-bottom: 12px;">1.&nbsp;&nbsp;CESSATION OF DIRECTOR</h3>

<p>IT IS RESOLVED THAT the Board acknowledges and accepts the resignation of ${val(d.departingDirector)} as a director of the Company with effect from ${val("17 April 2026")}.</p>

<p>The Board records its appreciation for the service and contributions of ${d.departingDirector.split('"')[0]?.trim() || d.departingDirector} during his tenure as director of the Company.</p>

<h3 style="margin-bottom: 12px;">2.&nbsp;&nbsp;APPOINTMENT OF DIRECTOR</h3>

<p>IT IS RESOLVED THAT ${val(d.appointeeName)}, bearing NRIC No. ${val(d.appointeeNric || "[NRIC]")} and residing at:</p>

<p><span ${FIELD_FULL}>${d.appointeeAddress}</span></p>

<p>be and is hereby appointed as a director of the Company with effect from ${val(effectiveFormatted)}, pursuant to the Constitution of the Company.</p>

<h3 style="margin-bottom: 12px;">3.&nbsp;&nbsp;CONSENT TO ACT</h3>

<p>IT IS NOTED THAT ${val(d.appointeeName)} has duly executed a Consent to Act as Director in the form prescribed under Section 145(5) of the Companies Act (Cap. 50) (Form 45), and has confirmed that she is not disqualified from acting as a director under any provision of the Companies Act.</p>

<h3 style="margin-bottom: 12px;">4.&nbsp;&nbsp;STATUTORY FILINGS</h3>

<p>IT IS RESOLVED THAT the Company Secretary be and is hereby authorised and directed to:</p>

<p style="padding-left: 28px;"><strong>(a)</strong>&nbsp; file the Notification of Change of Director (Form 45) with the Accounting and Corporate Regulatory Authority ("ACRA") within 14 days of the date of appointment, in compliance with Section 173(6) of the Companies Act;</p>

<p style="padding-left: 28px;"><strong>(b)</strong>&nbsp; update the Company's Register of Directors in accordance with Section 173(1) of the Companies Act;</p>

<p style="padding-left: 28px;"><strong>(c)</strong>&nbsp; update the Company's records maintained with ACRA via BizFile+ to reflect the above changes; and</p>

<p style="padding-left: 28px;"><strong>(d)</strong>&nbsp; do all such acts and things and execute all such documents as may be necessary or expedient to give effect to this resolution.</p>

<h3 style="margin-bottom: 12px;">5.&nbsp;&nbsp;GENERAL AUTHORITY</h3>

<p>IT IS RESOLVED THAT any director or the Company Secretary be and is hereby authorised to do all such acts and things, to sign, execute and deliver all such documents, deeds, and instruments as may be necessary or desirable to give effect to the resolutions set out above.</p>

<div ${PAGE_BREAK}><span ${PAGE_LABEL}>PAGE 1 OF 2</span></div>

<h3 style="margin-bottom: 16px;">SIGNATURES OF DIRECTORS</h3>

<p>Passed by the directors in writing on ${val(formattedDate)} in accordance with Article 104 of the Constitution of the Company.</p>

<hr style="margin: 24px 0 24px;">

<p><strong>1. Robert Johnson</strong><br>Committee Chair, Nomination Committee</p>
<p><strong>Signature:</strong></p>
<div ${SIG_BOX}><em style="color: #888;">[ Electronic signature — awaiting ]</em></div>

<p style="margin-top: 24px;"><strong>2. Margaret Sullivan</strong><br>Chief Executive Officer</p>
<p><strong>Signature:</strong></p>
<div ${SIG_BOX}><em style="color: #888;">[ Electronic signature — awaiting ]</em></div>

<p style="margin-top: 24px;"><strong>3. Linda Williams</strong><br>Independent Director</p>
<p><strong>Signature:</strong></p>
<div ${SIG_BOX}><em style="color: #888;">[ Electronic signature — awaiting ]</em></div>

<p style="margin-top: 24px;"><strong>4. David Martinez</strong><br>Independent Director</p>
<p><strong>Signature:</strong></p>
<div ${SIG_BOX}><em style="color: #888;">[ Electronic signature — awaiting ]</em></div>

<div ${PAGE_BREAK}><span ${PAGE_LABEL}>PAGE 2 OF 2</span></div>

<h3 style="text-align: center; margin-bottom: 4px;">SCHEDULE A</h3>
<h4 style="text-align: center; margin-bottom: 16px;">Particulars of New Director</h4>

<p><strong>Full Name:</strong><br><span ${FIELD_FULL}>${d.appointeeName}</span></p>

<p><strong>NRIC / Passport No.:</strong><br><span ${FIELD_FULL}>${d.appointeeNric || "[To be provided]"}</span></p>

<p><strong>Residential Address:</strong><br><span ${FIELD_FULL}>${d.appointeeAddress}</span></p>

<p><strong>Nationality:</strong><br><span ${FIELD_FULL}>Singaporean</span></p>

<p><strong>Date of Appointment:</strong><br><span ${FIELD_FULL}>${effectiveFormatted}</span></p>

<p><strong>Designation:</strong><br><span ${FIELD_FULL}>Director</span></p>

<hr>

<p style="font-size: 12px; color: #666;">This resolution is effective as of the date last signed by a director and shall be entered in the minutes book of the Company in accordance with Section 184A(3) of the Companies Act (Cap. 50).</p>
`;
}

/* ── Form 45 — Notification of Change of Director ─────────────── */

export interface Form45NotificationData {
  companyName: string;
  companyUen: string;
  appointeeName: string;
  appointeeNric: string;
  appointeeNationality: string;
  appointeeAddress: string;
  appointeeDateOfBirth: string;
  effectiveDate: string;
  departingDirectorName: string;
  departingDirectorNric?: string;
  departingDirectorLastDay: string;
}

export function buildForm45NotificationHtml(d: Form45NotificationData): string {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-SG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const effectiveFormatted = formatDate(d.effectiveDate);
  const lastDayFormatted = formatDate(d.departingDirectorLastDay);

  return `
<h2 style="text-align: center; margin-bottom: 2px;">NOTIFICATION OF CHANGE OF DIRECTOR</h2>
<p style="text-align: center; margin-bottom: 4px;"><strong>Form 45</strong></p>
<p style="text-align: center; margin-bottom: 24px;"><em>(Pursuant to Section 173(6) of the Companies Act, Cap. 50)</em></p>

<p><strong>Filed with:</strong> Accounting and Corporate Regulatory Authority ("ACRA") via BizFile+</p>
<p><strong>Lodgement date:</strong> ${val(formattedDate)}</p>

<hr>

<h3 style="margin-bottom: 12px;">1.&nbsp;&nbsp;PARTICULARS OF COMPANY</h3>

<p><strong>Company name:</strong><br><span ${FIELD_FULL}>${d.companyName}</span></p>

<p><strong>Company registration number (UEN):</strong><br><span ${FIELD_FULL}>${d.companyUen}</span></p>

<p><strong>Registered office:</strong><br><span ${FIELD_FULL}>50 Raffles Place, #30-00 Singapore Land Tower, Singapore 048623</span></p>

<h3 style="margin-bottom: 12px;">2.&nbsp;&nbsp;CESSATION OF DIRECTOR</h3>

<p>The following director has ceased to hold office:</p>

<p><strong>Full name:</strong><br><span ${FIELD_FULL}>${d.departingDirectorName}</span></p>

<p><strong>NRIC / Passport No.:</strong><br><span ${FIELD_FULL}>${d.departingDirectorNric || "[On file with ACRA]"}</span></p>

<p><strong>Reason for cessation:</strong><br><span ${FIELD_FULL}>Resignation</span></p>

<p><strong>Effective date of cessation (last working day):</strong><br><span ${FIELD_FULL}>${lastDayFormatted}</span></p>

<h3 style="margin-bottom: 12px;">3.&nbsp;&nbsp;APPOINTMENT OF DIRECTOR</h3>

<p>The following person has been appointed as a director:</p>

<p><strong>Full name:</strong><br><span ${FIELD_FULL}>${d.appointeeName}</span></p>

<p><strong>NRIC / Passport No.:</strong><br><span ${FIELD_FULL}>${d.appointeeNric || "[To be provided]"}</span></p>

<p><strong>Date of birth:</strong><br><span ${FIELD_FULL}>${d.appointeeDateOfBirth}</span></p>

<p><strong>Nationality:</strong><br><span ${FIELD_FULL}>${d.appointeeNationality}</span></p>

<p><strong>Residential address:</strong><br><span ${FIELD_FULL}>${d.appointeeAddress}</span></p>

<p><strong>Designation:</strong><br><span ${FIELD_FULL}>Director</span></p>

<p><strong>Effective date of appointment:</strong><br><span ${FIELD_FULL}>${effectiveFormatted}</span></p>

<p><strong>Consent to Act as Director (Form 45) executed:</strong><br><span ${FIELD_FULL}>Yes — executed on ${formattedDate}</span></p>

<h3 style="margin-bottom: 12px;">4.&nbsp;&nbsp;DECLARATION</h3>

<p>I, the undersigned, being a director or the Company Secretary of the abovementioned Company, hereby declare that the particulars set out above are true and correct to the best of my knowledge and belief, and that this notification is being lodged in compliance with Section 173(6) of the Companies Act (Cap. 50).</p>

<p style="margin-top: 24px;"><strong>Name of declarant:</strong><br><span ${FIELD_FULL}>Sarah Marquez, Corporate Secretary</span></p>

<p><strong>Capacity:</strong><br><span ${FIELD_FULL}>Company Secretary</span></p>

<p><strong>Date of declaration:</strong><br><span ${FIELD_FULL}>${formattedDate}</span></p>

<p><strong>Signature:</strong></p>
<div ${SIG_BOX}><em style="color: #888;">[ Electronic signature captured at lodgement ]</em></div>

<hr>

<p style="font-size: 12px; color: #666;">This notification must be lodged with ACRA within 14 days of the date of cessation or appointment, whichever is later, in accordance with Section 173(6) of the Companies Act (Cap. 50).</p>
`;
}
