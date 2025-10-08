// "use client";

// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Bold from "@tiptap/extension-bold";
// import Underline from "@tiptap/extension-underline";
// import { Table } from "@tiptap/extension-table";
// import { TableRow } from "@tiptap/extension-table-row";
// import { TableCell } from "@tiptap/extension-table-cell";
// import { TableHeader } from "@tiptap/extension-table-header";
// import BulletList from "@tiptap/extension-bullet-list";
// import OrderedList from "@tiptap/extension-ordered-list";
// import ListItem from "@tiptap/extension-list-item";
// import { Button } from "@/components/ui/button";
// import { Send } from "lucide-react";

// export default function RichTextEditor({
//   content,
//   onSave,
// }: {
//   content?: any;
//   onSave: (val: string) => void;
// }) {
//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Bold,
//       Underline,
//       BulletList,
//       OrderedList,
//       ListItem,
//       Table.configure({ resizable: true }),
//       TableRow,
//       TableHeader,
//       TableCell,
//     ],
//     content: content || "<p>Start writing here...</p>",
//     immediatelyRender: false, // ✅ Fix for SSR hydration issue
//   });

//   if (!editor) return null; // wait until editor is ready

//   return (
//     <div className="flex flex-col h-[90vh]">
//       {/* Toolbar */}
//       <div className="flex gap-2 border-b p-2 bg-muted">
//         <Button
//           size="sm"
//           variant="outline"
//           onClick={() => editor.chain().focus().toggleBold().run()}
//         >
//           Bold
//         </Button>
//         <Button
//           size="sm"
//           variant="outline"
//           onClick={() => editor.chain().focus().toggleBulletList().run()}
//         >
//           Bullet List
//         </Button>
//         <Button
//           size="sm"
//           variant="outline"
//           onClick={() => editor.chain().focus().toggleOrderedList().run()}
//         >
//           Numbered List
//         </Button>
//         <Button
//           size="sm"
//           variant="outline"
//           onClick={() =>
//             editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()
//           }
//         >
//           Table
//         </Button>
//       </div>

//       {/* Editor */}
//       <div className="flex-1 overflow-y-auto p-2 border rounded-md">
//         <EditorContent editor={editor} className="prose max-w-none" />
//       </div>

//       {/* Save Button */}
//       <div className="mt-auto flex justify-center pt-4">
//         <Button
//           className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-medium transition-all duration-200"
//           onClick={() => onSave(editor.getHTML())}
//         >
//           <Send className="w-4 h-4 mr-2" />
//           Save Changes
//         </Button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Heading from "@tiptap/extension-heading";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import CodeBlock from "@tiptap/extension-code-block";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function RichTextEditor({
  content,
  onSave,
}: {
  content?: any;
  onSave: (val: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      
      Heading.configure({ levels: [1, 2, 3, 4] }), // multiple heading sizes
      Underline,
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      HorizontalRule,
      CodeBlock,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content || "<p>Start writing here...</p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-full focus:outline-none",
      },
    },
    immediatelyRender: false, // fix SSR hydration issue
  });

  if (!editor) return null;

  return (
    <div className="flex flex-col h-[90vh]">
      {/* Toolbar */}
      {/* <div className="flex flex-wrap gap-2 border-b p-2 bg-muted mt-0">
        <Button size="sm" variant="outline" onClick={() => editor.chain().focus().toggleBold().run()}>
          Bold
        </Button>
        <Button size="sm" variant="outline" onClick={() => editor.chain().focus().toggleItalic().run()}>
          Italic
        </Button>
        <Button size="sm" variant="outline" onClick={() => editor.chain().focus().toggleUnderline().run()}>
          Underline
        </Button>
        <Button size="sm" variant="outline" onClick={() => editor.chain().focus().toggleStrike().run()}>
          Strike
        </Button>
        <Button size="sm" variant="outline" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          HR
        </Button>
        <Button size="sm" variant="outline" onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}>
          H1
        </Button>
        <Button size="sm" variant="outline" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()}>
          Table
        </Button>
      </div> */}

      {/* Editor */}
      <div className="flex-1 overflow-y-auto p-4 border rounded-md bg-white">
        <EditorContent editor={editor} className="prose max-w-full list-inside list-disc" />
      </div>

      {/* Save Button */}
      <div className="mt-auto flex justify-center pt-4">
        <Button
          className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-medium transition-all duration-200"
          onClick={() => onSave(editor.getHTML())}
        >
          <Send className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
