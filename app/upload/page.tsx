"use client"

import FileUploadContent from "@/pages/file-upload-content"


export default function UploadPage() {
  return (
    // <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* <AppSidebar /> */}
        <main className="flex-1">
          <FileUploadContent />
        </main>
      </div>
    // </SidebarProvider>
  )
}
