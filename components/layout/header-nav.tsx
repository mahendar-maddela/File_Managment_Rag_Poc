"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { ConfirmationModal } from "../model/ConfirmationModal"
import { useState } from "react"

export function HeaderNav() {
  const router = useRouter()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleLogout = () => {
    // Simple logout - redirect to login page
    router.push("/")
  }

  return (
    <header className="sticky top-0 w-full bg-background/95 backdrop-blur lg:w-full supports-[backdrop-filter]:bg-background/60">
      <div className=" flex h-14 items-center justify-between">
        {/* Left side (logo or nav links if you want later) */}
        <div className="flex items-center">
          {/* Example logo or title */}
          {/* <span className="font-bold">RAG_POC</span> */}
        </div>

        {/* Right side (ThemeToggle + Logout) */}
        <nav className="flex items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={ ()=>setShowLogoutModal(true)}
            className=" hover:text-foreground/50"
          >
            <LogOut className="h-4 w-4 mr-1" />
            {/* <span className="hidden sm:inline">Logout</span> */}
          </Button>
        </nav>
      </div>
            <ConfirmationModal
              isOpen={showLogoutModal}
              onClose={() => {
                setShowLogoutModal(false)
              }}
              onConfirm={handleLogout}
              title="Logout"
              description="Are you sure you want to log out?"
              confirmText="Logout"
              // variant=""
              icon={<LogOut className="w-5 h-5" />}
            />
    </header>
  )
}
