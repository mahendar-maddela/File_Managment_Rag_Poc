"use client"

import { usePathname } from "next/navigation"
import { HeaderNav } from "./header-nav"

export function ConditionalNav() {
  const pathname = usePathname()

  // Don't show navigation on login page
  const hiddenRoutes = ["/", "/login", "/signup"]

  if (!pathname || hiddenRoutes.includes(pathname)) {
    return null
  }
  
  return <HeaderNav />
}
