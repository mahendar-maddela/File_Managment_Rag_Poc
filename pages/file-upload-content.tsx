"use client"

import { useState, useCallback, useRef } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  FileText,
  File,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  FileSpreadsheet,
  Send,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik"
import * as Yup from "yup"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { supabase } from "@/api/supabase/client"

interface UploadedFile {
  id: string
  file: File
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  extractedText?: string
  error?: string
}

interface FormValues {
  title: string
  author: string
  category: string
  tags: string
  description: string
  file: File | null
}

const ACCEPTED_FILE_TYPES = {
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

// ✅ Validation schema
const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  author: Yup.string().required("Author is required"),
  category: Yup.string().required("Category is required"),
  tags: Yup.string(),
  description: Yup.string().max(
    200,
    "Description must be less than 200 characters",
  ),
  file: Yup.mixed<File>()
    .required("File is required")
    .test("fileType", "Unsupported file format", (value) => {
      if (!value) return false
      return Object.keys(ACCEPTED_FILE_TYPES).includes(value.type)
    }),
})

export default function FileUploadContent() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent, setFieldValue: FormikHelpers<FormValues>["setFieldValue"]) => {
      e.preventDefault()
      setIsDragOver(false)

      const droppedFiles = e.dataTransfer.files
      if (droppedFiles.length > 0) {
        const file = droppedFiles[0]
        setFieldValue("file", file)
        setFieldValue("title", file.name.replace(/\.[^/.]+$/, "")) // Auto-fill title
      }
    },
    [],
  )

  const handleFileSelect = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      setFieldValue: FormikHelpers<FormValues>["setFieldValue"],
    ) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0]
        setFieldValue("file", file)
        setFieldValue("title", file.name.replace(/\.[^/.]+$/, "")) // Auto-fill title
      }

      // 👇 Reset the input value so same file can be selected again
      e.target.value = ""
    },
    [],
  )


  const removeFile = (setFieldValue: FormikHelpers<FormValues>["setFieldValue"]) => {
    setFieldValue("file", null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // handleSubmit is typed properly
  const handleSubmit = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    if (!values.file) {
      toast.info("Please select a file first")
      return
    }

    setIsSubmitting(true)
    try {
      // Generate unique file name
      const fileName = `uploads/${Date.now()}_${values.file.name.toLowerCase()}`

      // Upload to Supabase storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from("filesMahendar")
        .upload(fileName, values.file, {
          cacheControl: "3600",
          upsert: false,
        })

        console.log("Storage data:", storageData ,storageError)
      if (storageError) {
        toast.error(storageError.message)
        return
      }

      // Get public URL
      const { data: publicUrlData ,  } = supabase.storage
        .from("filesMahendar")
        .getPublicUrl(fileName)

      const fileUrl = publicUrlData.publicUrl

      //  Insert metadata + file URL into Supabase table
      const { error: insertError } = await supabase.from("fileInfo").insert([
        {
          title: values.title,
          author: values.author,
          category: values.category,
          tags: values.tags,
          description: values.description,
          file_name : values.file.name.toLowerCase(),
          file_size: values.file.size,
          file_type: values.file.type,
          file_url: fileUrl,
          isExtracted: false,
        },
      ])

      if (insertError) {
        toast.error(insertError.message)
        return
      }

      // Add to local state
      // const newFile: UploadedFile = {
      //   id: Math.random().toString(36).substr(2, 9),
      //   file: values.file,
      //   status: "processing",
      //   progress: 0,
      // }
      // setFiles((prev) => [...prev, newFile])
      // simulateFileProcessing(newFile.id, values.file)

      toast.success("File uploaded successfully 🎉")
      resetForm()
    } catch (error: any) {
      console.error("Upload error:", error)
      toast.error(error.message || "An error occurred while uploading the file")
    } finally {
      setIsSubmitting(false)
    }
  }


  const simulateFileProcessing = async (fileId: string, file: File) => {
    try {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: "uploading", progress: 50 } : f,
        ),
      )
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
              ...f,
              status: "completed",
              progress: 100,
              extractedText: "Sample extracted text from the document...",
            }
            : f,
        ),
      )
      setTimeout(() => {
        router.push(`/files/${fileId}`)
      }, 1000)
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
              ...f,
              status: "error",
              progress: 0,
              error: error instanceof Error ? error.message : "Unknown error",
            }
            : f,
        ),
      )
    }
  }

  const getFileIcon = (fileType: string) => {
    const fileInfo =
      ACCEPTED_FILE_TYPES[fileType as keyof typeof ACCEPTED_FILE_TYPES]
    return fileInfo ?? { icon: File, label: "Unknown", color: "text-gray-500" }
  }

  const getStatusIcon = (status: UploadedFile["status"]) => {
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

  return (
    <div className="p-6 space-y-6">
      {/* ✅ Formik is typed with FormValues */}
      <Formik<FormValues>
        initialValues={{
          title: "",
          author: "",
          category: "",
          tags: "",
          description: "",
          file: null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, isSubmitting: formikSubmitting }) => (
          <Form>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">Upload File with Metadata</CardTitle>
                <CardDescription>
                  Select a file and provide metadata information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload Section */}

                <div className="space-y-4">
                  <Label htmlFor="file">File Upload *</Label>
                  {!values.file && (<div
                    className={cn(
                      "relative border-2 border-dashed rounded-lg p-3 text-center transition-all duration-200 cursor-pointer",
                      isDragOver
                        ? "border-primary bg-primary/10 scale-[1.02]"
                        : "border-border hover:border-primary/50 hover:bg-primary/5",
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, setFieldValue)}

                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.xlsx,.csv,.txt"
                      onChange={(e) => handleFileSelect(e, setFieldValue)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div className="space-y-4">
                      <div className="w-10 h-10 mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-white" />
                      </div>

                      <div className="">
                        <h3 className="text-lg font-semibold text-foreground">
                          {isDragOver ? "Drop file here" : "Click to upload or drag and drop"}
                        </h3>
                        <p className="text-muted-foreground">
                          Supported formats:
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {Object.entries(ACCEPTED_FILE_TYPES).map(([type, info]) => (
                            <Badge key={type} variant="secondary" className="text-xs">
                              {info.label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>)}
                  {/* Selected File Display */}
                  {values.file && (
                    <div className="mt-4 p-4 border rounded-lg bg-muted/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn("flex-shrink-0", values.file ? getFileIcon(values.file.type).color : "")}>
                            {values.file && (() => {
                              const IconComponent = getFileIcon(values.file.type).icon;
                              return <IconComponent className="w-6 h-6" />;
                            })()}
                          </div>

                          {values.file && (
                            <div>
                              <p className="text-sm font-medium text-foreground truncate">{values.file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {getFileIcon(values.file.type).label} • {(values.file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          )}

                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(setFieldValue)}
                          className="flex-shrink-0 h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  <ErrorMessage name="file" component="div" className="text-sm text-destructive mt-2" />
                </div>

                {/* Metadata Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Row 1: Title + Author */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Field
                      as={Input}
                      id="title"
                      name="title"
                      placeholder="Enter document title"
                    />
                    <ErrorMessage name="title" component="div" className="text-sm text-destructive" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author">Author *</Label>
                    <Field
                      as={Input}
                      id="author"
                      name="author"
                      placeholder="Enter author name"
                    />
                    <ErrorMessage name="author" component="div" className="text-sm text-destructive" />
                  </div>

                  {/* Row 2: Tags + Category */}
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Field
                      as={Input}
                      id="tags"
                      name="tags"
                      placeholder="Enter tags (comma separated)"
                    />
                    <ErrorMessage name="tags" component="div" className="text-sm text-destructive" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Field
                      as={Input}
                      id="category"
                      name="category"
                      placeholder="Enter category"
                    />
                    <ErrorMessage name="category" component="div" className="text-sm text-destructive" />
                  </div>

                  {/* Row 3: Description full width */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Field
                      as={Input}
                      id="description"
                      name="description"
                      placeholder="Enter a brief description (max 200 characters)"
                    />
                    <ErrorMessage name="description" component="div" className="text-sm text-destructive" />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting || formikSubmitting || !values.file}
                    className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-medium transition-all duration-200"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        uploadedFile...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Upload File
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Form>
        )}
      </Formik>
    </div>
  )
}
