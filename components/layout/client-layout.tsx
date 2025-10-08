"use client";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { ConditionalNav } from "@/components/layout/conditional-nav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ConditionalSideBar } from "@/components/layout/condition-sidebar";
import { Toaster } from "sonner";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SidebarProvider>
        <div className="flex h-screen w-full  overflow-hidden">
          {/* Sidebar */}
          <ConditionalSideBar />

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Navbar */}
            {/* <ConditionalNav /> */}

            {/* Page content */}
            <main className="flex-1 overflow-auto">{children}</main>
            <Toaster />
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
