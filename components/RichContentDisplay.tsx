
/**
 * Convert backend rich text (or markdown-like text) into HTML suitable for RichTextEditor
 * @param rawText - string from backend
 * @returns HTML string
 */
export function richText(rawText: any) {
  if (!rawText) return "<p></p>";

  let html = rawText;

  // Convert headers: [HEADER] Text -> <h2>Text</h2>
  html = html.replace(/\[HEADER\]\s*(.+)/g, "<h2>$1</h2>");

  // Convert bullet points: * Item -> <li>Item</li> inside <ul>
  html = html.replace(/^\s*\*\s+(.+)/gm, "<li>$1</li>");
  // html = html.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>"); // wrap in <ul>

  // Replace newlines with paragraphs if not inside a list
  html = html.replace(/^(?!<ul>|<li>|<\/li>|<\/ul>)(.+)$/gm, "<p>$1</p>");

  // Optional: replace image placeholders
  html = html.replace(/\[Image_Page\d+_\d+\]/g, '<span class="text-muted">[Image]</span>');

  return html;
}
