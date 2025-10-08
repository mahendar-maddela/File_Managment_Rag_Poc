"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Search, Download, Eye, Trash2, Edit } from "lucide-react"
import { useRouter } from "next/navigation"
import { ConfirmationModal } from "@/components/model/ConfirmationModal"
import { supabase } from "@/api/supabase/client"
import { formatFileSize } from "@/lib/fileSizeConversion"
import { formatDateTime } from "@/lib/dateConvert"
import LoaderComponent from "@/app/loading"

// Mock data for demonstration
const mockFiles = [
  { id: 1, name: "quarterly-report.pdf", type: "PDF", size: "2.4 MB", date: "2024-01-15", status: "completed", link: "https://tourism.gov.in/sites/default/files/2019-04/dummy-pdf_2.pdf" },
  { id: 2, name: "customer-data.xlsx", type: "XLSX", size: "1.8 MB", date: "2024-01-14", status: "completed", link: "https://tourism.gov.in/sites/default/files/2019-04/dummy-pdf_2.pdf" },
  { id: 3, name: "meeting-notes.docx", type: "DOCX", size: "0.9 MB", date: "2024-01-13", status: "completed", link: "https://tourism.gov.in/sites/default/files/2019-04/dummy-pdf_2.pdf" },
  { id: 4, name: "survey-results.csv", type: "CSV", size: "0.5 MB", date: "2024-01-12", status: "completed", link: "https://tourism.gov.in/sites/default/files/2019-04/dummy-pdf_2.pdf" },
  { id: 5, name: "project-brief.txt", type: "TXT", size: "0.1 MB", date: "2024-01-11", status: "completed", link: "https://tourism.gov.in/sites/default/files/2019-04/dummy-pdf_2.pdf" },
]

export default function MyFilesContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [files, setFiles] = useState<any>([])
  const router = useRouter()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [allFiles, setAllFiles] = useState<any>([]) // full list from Supabase


useEffect(() => {
  if (!searchTerm) {
    setFiles(allFiles)
  } else {
    const filtered = allFiles.filter((file: any) =>
      file.file_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFiles(filtered)
  }
}, [searchTerm, allFiles])

  const handleDelete = () => {
    console.log(`Deleting file with ID ${fileToDelete}`)
    // Add your delete logic here
    setShowDeleteModal(false)
    setFileToDelete(null)
  }

  const openDeleteModal = (fileId: number) => {
    setFileToDelete(fileId)
    setShowDeleteModal(true)
  }

  const onSubmit = (id: any) => {
    // Simulate file download or processing
    console.log(`Processing file with ID ${id}`)
    router.push(`/files/${id}` || `/files/1`)
  }

  const getAllFiles = async () => {
      setLoading(true)
    try {
      const { data, error } = await supabase
        .from("fileInfo") // 👈 your table name
        .select("*")
        .order("created_at", { ascending: false }) // optional: latest first

      if (error) {
        console.log("Supabase fetch error:", error.message)
        return
      }

      if (data) {
        setFiles(data)
        setAllFiles(data)
      // setFiles(data)
      }
      console.log(data)
    } catch (error) {
      console.error("Unexpected error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllFiles()
  }, [])
  if (loading) return <LoaderComponent />

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">My Files</h1>
        <p className="text-muted-foreground">View and manage your uploaded files</p>
      </div>

      {/* Search */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">Search Files</CardTitle>
          <CardDescription>Find your files quickly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search files by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Files List */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">Files ({files.length})</CardTitle>
          <CardDescription>Your uploaded and processed files</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="space-y-4 ">
            {files.map((file: any) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <FileText className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{file.file_name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {file.file_type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{formatFileSize(file.file_size)}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{formatDateTime(file.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      window.open(file?.file_url, "_blank");
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onSubmit(file.id || 1)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => openDeleteModal(file.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setFileToDelete(null)
        }}
        onConfirm={handleDelete}
        title="Delete File"
        description="Are you sure you want to delete this file? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        icon={<Trash2 className="w-5 h-5" />}
      />
    </div>
  )
}