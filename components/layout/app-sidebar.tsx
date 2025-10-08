"use client"

import { FileText, Upload, Home, LogOut, Menu, X, MessageSquare, LayoutTemplate, Search, Settings, HelpCircle, CheckSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Upload Files",
    url: "/upload",
    icon: Upload,
  },
  {
    title: "My Files",
    url: "/files",
    icon: FileText,
  },
  {
    title: "Chat",
    url: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Chunks",
    url: "/files/chunck/:id",
    icon: CheckSquare,
  },
  {
    title: "Templates",
    url: "/template",
    icon: LayoutTemplate,
  },
]

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)

      // On mobile, close sidebar by default
      if (mobile) {
        setIsOpen(false)
      } else {
        setIsOpen(true)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false)
    }
  }, [pathname, isMobile])

  // Prevent body scrolling when sidebar is open on mobile
  useEffect(() => {
    if (isMobile) {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'auto'
      }
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, isMobile])

  const toggleSidebar = () => setIsOpen(!isOpen)

  return (
    <>
      {/* Toggle button - Only show when sidebar is closed */}
      {!isOpen && (
        <div className="fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSidebar}
            className="h-10 w-10 rounded-full bg-background/80 backdrop-blur border-primary/20"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed lg:sticky top-0 left-0 z-40 h-screen flex flex-col",
        "transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-0", // Width changes based on open state
        !isOpen && "border-r-0", // Remove border when closed
        isMobile && !isOpen && "-translate-x-full" // Hide completely on mobile when closed
      )}>
        <div className={cn(
          "border-r border-border bg-gradient-to-b backdrop-blur-sm from-primary/5 to-background h-full flex flex-col",
          "transition-all duration-300 ease-in-out",
          isOpen ? "w-64" : "w-0 overflow-hidden" // Adjust width and hide overflow when closed
        )}>
          {/* Sidebar Header */}
          <div className="p-3 border-b border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                RAG_POC
              </h2>

              {/* Close button for sidebar */}
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto h-8 w-8"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Search Bar -*/}
            {/* <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-background border border-border pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div> */}
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <a
                  key={item.title}
                  href={item.url}
                  className={cn(
                    "flex items-center gap-3 p-1 rounded-lg transition-all duration-200 group ",
                    pathname === item.url
                      ? "bg-primary/10 text-primary font-medium border border-primary/20 "
                      : "hover:bg-primary/5 hover:text-primary text-muted-foreground border border-transparent"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </a>
              ))}
            </div>

            {/* Recent chats section  */}
            {/* <div className="mt-8">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                Recent Chats
              </h3>
              <div className="space-y-1">
                {["Introduction to RAG", "Document Analysis", "Project Discussion"].map((chat, index) => (
                  <button
                    key={index}
                    className="w-full text-left flex items-center gap-3 p-2 rounded-lg transition-all duration-200 hover:bg-primary/5 text-muted-foreground hover:text-foreground group"
                  >
                    <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-sm truncate">{chat}</span>
                  </button>
                ))}
              </div>
            </div> */}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 space-y-4  border-border/50">
            {/* Support and Settings */}
            <div className="flex items-center justify-between px-2">
              {/* <button className="p-2 rounded-lg hover:bg-primary/5 transition-colors text-muted-foreground hover:text-foreground">
                <HelpCircle className="h-4 w-4" />
              </button>
              <button className="p-2 rounded-lg hover:bg-primary/5 transition-colors text-muted-foreground hover:text-foreground">
                <Settings className="h-4 w-4" />
              </button> */}
              {/* <ThemeToggle /> */}
            </div>

            {/* User profile */}
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 border border-border/50">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder-usr.png" />
                <AvatarFallback className="bg-primary text-white text-sm">M</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">Mahendar</p>
                <p className="text-xs text-muted-foreground truncate">demo@company.com</p>
              </div>
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => router.push("/")}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}