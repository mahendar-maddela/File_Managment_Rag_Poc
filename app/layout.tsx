import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import ClientLayout from "@/components/layout/client-layout";

export const metadata: Metadata = {
  title: "RAG_POC - Management",
  description: "File management with intelligent text extraction and editing",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="h-screen overflow-hidden">
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
