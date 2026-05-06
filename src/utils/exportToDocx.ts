import HTMLtoDOCX from "@turbodocx/html-to-docx";

/**
 * Wraps editor HTML in a complete document with print-friendly styles, then
 * uses `@turbodocx/html-to-docx` to produce a real OOXML `.docx` blob and
 * triggers a browser download.
 *
 * Notes
 * -----
 * - We strip the on-screen page-break markers (the dashed lines + "PAGE x of y"
 *   labels) from the HTML and replace them with a real Word page break, so the
 *   exported document paginates the same way Word would.
 * - We use a Times New Roman 12pt body to match a printed legal/regulatory
 *   document.
 * - File names are sanitised to remove characters that some operating systems
 *   reject in filenames.
 */

interface ExportToDocxOptions {
  /** Editor HTML body content (no <html>/<body> wrapper). */
  html: string;
  /** Document title (used for <title> + suggested filename). */
  title: string;
  /**
   * File name to suggest to the browser. The `.docx` extension is appended
   * automatically if not present. Invalid characters are stripped.
   */
  fileName: string;
}

const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const PAGE_BREAK_HTML =
  '<p style="page-break-before: always; margin: 0;">&nbsp;</p>';

function sanitiseFileName(name: string): string {
  const cleaned = name.replace(/[\\/:*?"<>|]+/g, " ").trim().replace(/\s+/g, " ");
  return cleaned.toLowerCase().endsWith(".docx") ? cleaned : `${cleaned}.docx`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Replace the editor's visual page-break dividers with a real Word page break.
 * The on-screen markers are <div> elements styled with `border-top: ... dashed`
 * and contain a "PAGE n OF m" label — we match by the dashed border style.
 */
function replaceVisualPageBreaks(html: string): string {
  return html.replace(
    /<div[^>]*border-top:\s*2px\s*dashed[^>]*>[\s\S]*?<\/div>/gi,
    PAGE_BREAK_HTML,
  );
}

function buildDocument(bodyHtml: string, title: string): string {
  const safeTitle = escapeHtml(title);
  const body = replaceVisualPageBreaks(bodyHtml);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${safeTitle}</title>
  <style>
    body {
      font-family: "Times New Roman", Times, serif;
      font-size: 12pt;
      color: #1a1a1a;
      line-height: 1.45;
    }
    h2 { font-size: 16pt; font-weight: 700; margin: 0 0 6pt; }
    h3 { font-size: 13pt; font-weight: 700; margin: 14pt 0 6pt; }
    h4 { font-size: 12pt; font-weight: 700; margin: 10pt 0 4pt; }
    p  { margin: 0 0 8pt; }
    hr { border: none; border-top: 1px solid #1a1a1a; margin: 10pt 0; }
    em { font-style: italic; }
    strong { font-weight: 700; }
    ul, ol { margin: 0 0 8pt 24pt; }
    li { margin-bottom: 4pt; }
  </style>
</head>
<body>
${body}
</body>
</html>`;
}

function triggerDownload(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export async function exportEditorHtmlToDocx({
  html,
  title,
  fileName,
}: ExportToDocxOptions): Promise<void> {
  const fullHtml = buildDocument(html, title);

  const result = (await HTMLtoDOCX(fullHtml, null, {
    orientation: "portrait",
    title,
    margins: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
    font: "Times New Roman",
    fontSize: 24, // half-points: 12pt
  })) as ArrayBuffer | Blob | Uint8Array;

  // In browser environments the library returns a Blob; under Node it can
  // return an ArrayBuffer or Buffer. Normalise to a Blob for the download.
  const blob =
    result instanceof Blob
      ? result
      : new Blob([result as ArrayBuffer], { type: DOCX_MIME });

  triggerDownload(blob, sanitiseFileName(fileName));
}
