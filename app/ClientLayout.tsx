"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { TenantProvider } from "@/contexts/tenant-context"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import TenantSwitcher from "@/components/tenant-switcher"
import { useTracking } from "@/hooks/use-tracking"

function TrackingWrapper({ children }: { children: React.ReactNode }) {
  useTracking() // This will automatically track page views
  return <>{children}</>
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const isBegginsHomePage = pathname === "/beggins-home"

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TenantProvider>
        <TrackingWrapper>
          <div className="min-h-screen flex flex-col">
            {!isHomePage && !isBegginsHomePage && <Navigation />}
            <main className="flex-1">{children}</main>
            <Footer />
            <TenantSwitcher />
            <Toaster />
          </div>
        </TrackingWrapper>
      </TenantProvider>
    </ThemeProvider>
  )
}
