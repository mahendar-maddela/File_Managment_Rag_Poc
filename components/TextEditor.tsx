// "use client"
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface TextEditorProps {
    initialContent?: string;
    onContentChange?: (content: string) => void;
}

export default function TextEditor({ initialContent = "", onContentChange }: TextEditorProps) {
    const [editorValue, setEditorValue] = useState(initialContent);

    useEffect(() => {
        setEditorValue(initialContent);
    }, [initialContent]);

    const handleChange = (value: string) => {
        setEditorValue(value);
        if (onContentChange) {
            onContentChange(value);
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'align': [] }],
            // ['link', 'image'],
            // ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'indent',
        'align',
        // 'link', 'image'
    ];

    return (
        <div className="text-editor-container">
            <ReactQuill
                value={editorValue}
                onChange={handleChange}
                modules={modules}
                formats={formats}
                theme="snow"
                className="h-100"
            />
        </div>
    );
}