"use client";

import dynamic from "next/dynamic";
import type { MarkdownPreviewProps } from "@uiw/react-markdown-preview";

// Load only client-side
const Markdown = dynamic<MarkdownPreviewProps>(
  () => import("@uiw/react-markdown-preview"),
  { ssr: false }
);

type Props = {
  rawText?: string;
  className?: string;
};

export default function MarkdownPreview({ rawText, className }: Props) {
  return (
    <div
      className={`flex-1 overflow-y-auto rounded-md border bg-background text-foreground ${className || ""}`}
    >
      <Markdown
        wrapperElement={{ "data-color-mode": "light" }}
        className="prose prose-sm max-w-none"
        source={rawText || "_(empty)_"} // 👈 correct prop
      />
    </div>
  );
}
