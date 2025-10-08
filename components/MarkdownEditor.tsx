"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { markdownToHtml } from "@/components/markdownToHtml"; // your existing helper

interface MarkdownEditorProps {
  content?: string; // initial markdown content
  onSave: (val: string) => void;
}

export default function MarkdownEditor({ content, onSave }: MarkdownEditorProps) {
  const [markdown, setMarkdown] = useState<string>(content || "");
  
  // Live rendered HTML from Markdown
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    setHtml(markdownToHtml(markdown));
  }, [markdown]);

  // Handles inserting Markdown formatting (Bold, Italic, etc.)
  const applyMarkdown = (syntax: string, selectionStart?: number, selectionEnd?: number) => {
    const textarea = document.getElementById("markdown-editor") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end) || "text";
    const newText = `${markdown.substring(0, start)}${syntax}${selectedText}${syntax}${markdown.substring(end)}`;
    
    setMarkdown(newText);

    // Restore cursor inside the syntax
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + syntax.length, end + syntax.length);
    }, 0);
  };

  return (
    <div className="flex flex-col h-[90vh]">
      {/* Toolbar for Markdown formatting */}
      <div className="flex gap-2 border-b p-2 bg-muted mb-2">
        <Button size="sm" variant="outline" onClick={() => applyMarkdown("**")}>Bold</Button>
        <Button size="sm" variant="outline" onClick={() => applyMarkdown("_")}>Italic</Button>
        <Button size="sm" variant="outline" onClick={() => applyMarkdown("~~")}>Strike</Button>
        <Button size="sm" variant="outline" onClick={() => applyMarkdown("# ", 0, 0)}>H1</Button>
        <Button size="sm" variant="outline" onClick={() => applyMarkdown("## ", 0, 0)}>H2</Button>
        <Button size="sm" variant="outline" onClick={() => applyMarkdown("- ", 0, 0)}>Bullet List</Button>
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Hidden Markdown input */}
        {/* <textarea
          id="markdown-editor"
          className="hidden"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
        /> */}

        {/* Live Preview */}
        <div
          className="flex-1 border rounded-md p-4 overflow-auto prose max-w-full bg-white"
          contentEditable={true}
          suppressContentEditableWarning={true}
          onInput={(e) => setMarkdown(e.currentTarget.innerText)}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      {/* Save Button */}
      <div className="mt-4 flex justify-center">
        <Button
          className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-medium transition-all duration-200"
          onClick={() => onSave(markdown)}
        >
          <Send className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
