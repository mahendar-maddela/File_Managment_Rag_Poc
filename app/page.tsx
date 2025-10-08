"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Upload, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/AuthContext"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const {login} =useAuth()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple UI navigation - no actual auth
     login(email, password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding and features */}
        <div className=" hidden lg:block space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                RAG_POC
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-md">
              Upload your PDF and Word documents for intelligent content extraction, review, and editing. Built for high-volume processing.
            </p>
          </div>

          <div className=" grid gap-6 max-w-md mx-auto lg:mx-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Upload className="w-6 h-6 text-accent" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-foreground">Smart Upload</h3>
                <p className="text-sm text-muted-foreground">Drag & drop files with instant text extraction</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-foreground">Advanced Editor</h3>
                <p className="text-sm text-muted-foreground">Rich text editing with JSONL conversion</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-foreground">Multi-User</h3>
                <p className="text-sm text-muted-foreground">Collaborative workspace for teams</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-bold text-foreground">Welcome Back</CardTitle>
              <CardDescription className="text-muted-foreground">
                Sign in to access your file management dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 transition-all duration-200 focus:ring-2 focus:ring-accent/20 border-border/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 transition-all duration-200 focus:ring-2 focus:ring-accent/20 border-border/50"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Sign In
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button className="text-accent hover:text-accent/80 font-medium transition-colors duration-200">
                    Contact Admin
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
