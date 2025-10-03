"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { TenantProvider } from "@/contexts/tenant-context"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
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
  const isC21CoastalHomePage = pathname === "/c21-coastal-home"
  const isC21PortfolioHomePage = pathname === "/c21-portfolio-home"
  const isC21803RealtyHomePage = pathname === "/c21-803-realty-home"
  const isAIAssistant = pathname === "/ai-assistant"
  const isBrokerageIntake = pathname === "/brokerage-intake"

  return (
    <TenantProvider>
      <TrackingWrapper>
        <div className="min-h-screen flex flex-col">
          {!isHomePage && !isBegginsHomePage && !isC21CoastalHomePage && !isC21PortfolioHomePage && !isC21803RealtyHomePage && !isBrokerageIntake && <Navigation />}
          <main className="flex-1">{children}</main>
          {!isAIAssistant && !isBrokerageIntake && <Footer />}
          <TenantSwitcher />
          <Toaster />
        </div>
      </TrackingWrapper>
    </TenantProvider>
  )
}
