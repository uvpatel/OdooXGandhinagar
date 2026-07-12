import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AssetFlow",
    template: "%s | AssetFlow",
  },
  description:
    "AssetFlow is an Enterprise Asset & Resource Management System that helps organizations register, allocate, track, maintain, audit, and manage physical assets and shared resources through a centralized, secure, and role-based ERP platform.",
  keywords: [
    "AssetFlow",
    "Asset Management",
    "Resource Management",
    "ERP",
    "Asset Tracking",
    "Inventory",
    "Maintenance",
    "Audit",
    "Resource Booking",
    "Enterprise",
    "Dashboard",
    "Next.js",
  ],
  authors: [{ name: "Team AssetFlow" }],
  creator: "Team AssetFlow",
  applicationName: "AssetFlow",
  category: "Business",
  openGraph: {
    title: "AssetFlow – Enterprise Asset & Resource Management System",
    description:
      "Manage assets, allocate resources, schedule maintenance, perform audits, and monitor organization-wide operations from one centralized ERP platform.",
    type: "website",
    siteName: "AssetFlow",
  },
  twitter: {
    card: "summary_large_image",
    title: "AssetFlow – Enterprise Asset & Resource Management System",
    description:
      "A modern ERP platform for asset lifecycle management, resource booking, maintenance workflows, audits, and analytics.",
  },
};

import { TooltipProvider } from "@/components/ui/tooltip"
import FloatingNavDemo from "@/components/floating-navbar-demo";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}> 
      <body>
        <TooltipProvider>
          <FloatingNavDemo />
          {children}</TooltipProvider>
      </body>
    </html>
  )
}