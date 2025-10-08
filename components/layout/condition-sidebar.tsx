"use client"

import { usePathname } from "next/navigation"
import { AppSidebar } from "./app-sidebar"

export function ConditionalSideBar() {
  const pathname = usePathname()

  const hiddenRoutes = ["/", "/login", "/signup"]

  if (!pathname || hiddenRoutes.includes(pathname)) {
    return null
  }

  return <AppSidebar />
}
