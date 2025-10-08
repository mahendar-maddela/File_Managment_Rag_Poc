"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Upload, CheckCircle, TrendingUp, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DashboardContent() {
  const router = useRouter()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your file management overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all duration-200 hover:shadow-lg border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Files</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1,234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-lg border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Processed Today</CardTitle>
            <Upload className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">89</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary">+5%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-lg border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">98.5%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary">+0.2%</span> improvement
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-lg border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">24</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary">+3</span> new this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Files */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Files</CardTitle>
            <CardDescription>Your latest uploaded and processed files</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "quarterly-report.pdf", status: "completed", time: "2 minutes ago", type: "PDF" },
              { name: "customer-data.xlsx", status: "processing", time: "5 minutes ago", type: "Excel" },
              { name: "meeting-notes.docx", status: "completed", time: "1 hour ago", type: "Word" },
              { name: "survey-results.csv", status: "completed", time: "2 hours ago", type: "CSV" },
            ].map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {file.type}
                  </Badge>
                  <Badge variant={file.status === "completed" ? "default" : "secondary"} className="text-xs">
                    {file.status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                    {file.status === "processing" && <Clock className="w-3 h-3 mr-1" />}
                    {file.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => router.push("/upload")}
              className="w-full justify-start h-12 bg-primary hover:bg-primary/90 text-white transition-all duration-200"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload New Files
            </Button>
            <Button
              onClick={() => router.push("/files")}
              variant="outline"
              className="w-full justify-start h-12 border-border/50 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200"
            >
              <FileText className="w-4 h-4 mr-2" />
              View My Files
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
