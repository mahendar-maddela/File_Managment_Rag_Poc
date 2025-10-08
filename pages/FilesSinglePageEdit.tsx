"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FileText, File, CheckCircle, AlertCircle, Clock, FileSpreadsheet, Send, Download, Edit } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import LoaderComponent from "@/app/loading"
import NotFound from "@/app/not-found"
import { supabase } from "@/api/supabase/client"
import axios from 'axios';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import RichTextEditor from "@/components/RichTextEditor"
import { richText } from "@/components/RichContentDisplay"
import axiosApiInstance from "@/lib/axiosInstance"
import AddCleanInstructionModal from "@/components/model/AddCleanInstructionModal"
import MarkdownPreview from "@/components/MarkdownPreview"
// import dynamic from "next/dynamic";

// // ✅ Editor
// const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

// // ✅ Preview (correct package)
// import type { MarkdownPreviewProps } from "@uiw/react-markdown-preview";
// const MarkdownPreview = dynamic<MarkdownPreviewProps>(
//   () => import("@uiw/react-markdown-preview"),
//   { ssr: false }
// );




interface FileData {
  id: string
  file_name: string
  type: string
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  extracted_markdown_text?: string
  extracted_rich_text?: any
  user_reviewed?: string
  editedText?: string
  created_at: string
  error?: string
  content?: string
  downloadUrl?: string
  isExtracted: boolean
  file_type: string
  file_url: string
}

const FILE_TYPE_ICONS = {
  "application/pdf": { icon: FileText, label: "PDF", color: "text-red-500" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    icon: FileText,
    label: "DOCX",
    color: "text-blue-500",
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
    icon: FileSpreadsheet,
    label: "XLSX",
    color: "text-green-500",
  },
  "text/csv": { icon: FileSpreadsheet, label: "CSV", color: "text-orange-500" },
  "text/plain": { icon: File, label: "TXT", color: "text-gray-500" },
}



const validationSchema = Yup.object({
  content: Yup.string()
    .required("Content is required")
    .min(10, "Content must be at least 10 characters"),
})

export default function FilesSinglePageEdit() {
  const [fileData, setFileData] = useState<FileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isExtracting, setIsExtracting] = useState(false)
  const [skipPages, setSkipPages] = useState<string>('');
  const [promptTemplate, setPromptTemplate] = useState<any>();
  const [promptContent, setPromptContent] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false)

  const router = useRouter();

  const params = useParams()
  const id = params?.id

  const getStatusIcon = (status: FileData["status"]) => {
    switch (status) {
      case "uploading":
      case "processing":
        return <Clock className="w-4 h-4 text-primary animate-spin" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-destructive" />
    }
  }

  const getFileIcon = (fileType: string) => {
    const fileInfo = FILE_TYPE_ICONS[fileType as keyof typeof FILE_TYPE_ICONS]
    return fileInfo || { icon: File, label: "Unknown", color: "text-gray-500" }
  }

  const downloadFile = () => {
    // TODO: Implement file download functionality
    // toast.success("File downloaded successfully!")
    window.open(fileData?.file_url, "_blank")
  }

  const handleExtract = async (id: any) => {
    setIsExtracting(true)
    try {
      // Convert "1,3,5" → ["1","3","5"]
      const pagesToSkip = skipPages
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s);

      // Build query params with multiple skip_pages
      const queryParams = pagesToSkip.map((p) => `skip_pages=${p}`).join("&");

      const url = `/files/extract_file/${id}${queryParams ? `?${queryParams}` : ""
        }`;

      console.log("Calling extract endpoint:", url);

      const res = await axiosApiInstance.get(url)
      console.log("res data file extracted", res)
      toast.success("File extracted successfully!")
      getFileData();
    } catch (error: any) {
      console.error(error)
      toast.error(error.response.data.detail || "Failed to extract file")
    } finally {
      setIsExtracting(false)
    }
  }
  const renderFileContent = () => {
    if (!fileData) return null

    const FileIcon = getFileIcon(fileData.file_type).icon

    switch (fileData.file_type) {
      case "application/pdf":
        return (
          <iframe
            src={fileData.file_url}
            className="w-full h-full border-none rounded-md overflow-y-auto"
            title="PDF Preview"
          />
        )

      case "text/plain":
        return (
          <div className="p-4 bg-muted/30 rounded-md h-full overflow-auto whitespace-pre-wrap">
            {fileData.extracted_markdown_text || "No text extracted yet."}
          </div>
        )

      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return (
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${fileData.file_url}`}
            className="w-full h-full border-none rounded-md overflow-y-auto overflow-x-auto"
            title="Word Document Preview"
          />
        );


      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      case "text/csv":
        return (
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${fileData.file_url}`}
            className="w-full h-full border-none rounded-md overflow-y-auto overflow-x-auto"
            title="csv sheet Document Preview"
          />
        )

      default:
        return (
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${fileData.file_url}`}
            className="w-full h-full border-none rounded-md overflow-y-auto"
            title="default Preview"
          />
        )
    }
  }

  const getFileData = async () => {
    if (!id) return; // Make sure id exists
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("fileInfo").select("*").eq('id', id).single();

      if (error) {
        console.log("Supabase fetch error:", error.message);
        return;
      }

      if (data) {
        setFileData(data); // set the fetched row to state
        console.log("Fetched file data:", data);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPromptTemplate = async () => {
    try {
      const { data, error } = await supabase
        .from("Template").select("*")


      if (error) {
        console.error("Supabase fetch error:", error.message);
        return;
      }

      if (data) {
        setPromptTemplate(data); // set the fetched row to state
      }

    } catch (error) {
      console.error("Failed to get prompt template:", error);
    }
  }

  useEffect(() => {
    getPromptTemplate();
  }, []);
  useEffect(() => {
    getFileData();
  }, [id]);

  const updatedFileData = async (formData: any) => {

    try {
      const { data, error } = await supabase
        .from("fileInfo")
        .update({ "user_reviewed": formData.content })
        .eq("id", id)
        .single();
      if (error) {
        console.error("Supabase update error:", error.message);
        return;
      }
      toast.success("File data updated successfully!");
      // router.back()

    } catch (error: any) {
      toast.error(error.response.message || "Failed to update file data");
    }
  }

  const handleClean = () => {
    setIsExtracting(true)
    axiosApiInstance
      .get(`/files/clean_file/${id}`)
      .then(() => {
        getFileData();
        toast.success("Cleaning was successfully completed");
        setIsExtracting(false)
      })
      .catch((err:any) => {
        console.error("Error cleaning file:", err);
        setIsExtracting(false)

      });
  };

  const handleSubmitInstruction = (data: { extract: string }) => {
    console.log("Instruction saved:", data)
    axiosApiInstance.post(`/files/user_rule_yml`, data).then(() => {
      toast.success("Cleaning Instruction saved");
      setIsModalOpen(false)
    }).catch((err:any) => {
      console.error("Error cleaning file:", err);

    })
  }

  if (isLoading) return <LoaderComponent />
  if (!fileData) return <NotFound data="File " />
  const FileIcon = getFileIcon(fileData?.file_type).icon
  const fileTypeLabel = getFileIcon(fileData?.file_type).label
  return (
    <div className="p-3 h-[95vh] flex flex-col">
      {/* Header */}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        {/* Left Column */}
        <Card className="border-border/50 h-full flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground flex items-center gap-2">
                <FileIcon className={getFileIcon(fileData?.file_type).color} />
                File Preview
              </CardTitle>
              <div>
                <Button variant="outline" onClick={() => setIsModalOpen(true)}>
                  Open Instructions
                </Button>
              </div>
            </div>
            <CardDescription>
              <div className="flex items-center justify-between">
                <div> {fileData?.file_name} • {fileTypeLabel} •{" "}
                  {new Date(fileData?.created_at).toLocaleDateString()}
                </div>
                <div>
                  <Button
                    onClick={handleClean}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-white dark:border-border/50"
                    disabled={isExtracting} // disable while extracting
                  >
                    {isExtracting ? "Cleaning..." : "Clean File"}
                  </Button>
                </div>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            {renderFileContent()}
          </CardContent>
        </Card>

        {/* Right Column */}
        {!fileData.extracted_markdown_text && (
          <div>
            {/* skip pages inputs */}
            <div className="flex flex-col gap-2 mt-3 mb-3">

              <Label className="text-foreground">Skip pages:</Label>
              <Input
                className="w-full py-2 px-4 border border-gray-300 rounded-md"
                value={skipPages} // Link input value to state
                onChange={(e) => setSkipPages(e.target.value)} // Update state on change
                placeholder="e.g., 4,7,8" // Add a placeholder for user guidance
              />
            </div>
            <Button
              onClick={() => handleExtract(fileData.id)}
              variant="outline"
              className="flex items-center w-full gap-2 bg-primary hover:bg-primary/80 text-white"
              disabled={isExtracting} // disable while extracting
            >
              <FileText className="w-4 h-4" />
              {isExtracting ? "Extracting..." : "Extract File"}
            </Button>
          </div>
        )}


        {fileData.extracted_markdown_text && (
          <Card className="border-border/50  flex flex-col h-screen">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  Text Editor
                </div>

                <div className="flex items-center gap-2">
                  <Select value={promptContent} onValueChange={(val) => setPromptContent(val)}>
                    <SelectTrigger className="w-56">
                      <SelectValue placeholder="Select Prompt" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Select Model</SelectItem>
                      {promptTemplate?.map((template: any) => (
                        <SelectItem key={template.id} value={template.name}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Apply button */}
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-white dark:border-border/50"
                    onClick={() => {
                      if (promptContent) {
                        // 👇 do your apply logic here
                        console.log("Applied:", promptContent);
                      }
                    }}
                  >
                    Apply
                  </Button>
                </div>
              </CardTitle>

              <CardDescription>
                Edit the extracted text content from your file
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              {/* <RichTextEditor
                content={fileData.user_reviewed || fileData.extracted_rich_text}
                onSave={(val) => updatedFileData({ content: val })}
              /> */}
              {/* <RichTextEditor
                content={fileData.user_reviewed || richText(fileData.extracted_rich_text || "")}
                onSave={(val) => updatedFileData({ content: val })}
                /> */}
              {/* <RichTextEditor
              content={fileData.user_reviewed || fileData.extracted_markdown_text}
              onSave={(val) => updatedFileData({ content: val })}
            /> */}
              <RichTextEditor
                content={fileData.user_reviewed || fileData.extracted_markdown_text}
                onSave={(val) => updatedFileData({ content: val })}
              />

              <MarkdownPreview rawText={fileData.extracted_markdown_text} />

            </CardContent>
          </Card>
        )}

      </div>

      <AddCleanInstructionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitInstruction={handleSubmitInstruction}
      />
    </div>
  )
}
