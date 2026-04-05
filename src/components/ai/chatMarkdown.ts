/** Minimal markdown-like formatting for demo assistant copy (`**bold**`, newlines). */
export function formatChatMarkdownToHtml(content: string): string {
  return content
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");
}
