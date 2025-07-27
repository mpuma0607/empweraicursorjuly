"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { getTenantConfig } from "@/lib/tenant-config"
import type { TenantConfig } from "@/lib/types"

interface TenantContextType {
  config: TenantConfig
  isLoading: boolean
  t: (key: string) => string // Translation function
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<TenantConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get tenant config based on current domain
    const tenantConfig = getTenantConfig()
    setConfig(tenantConfig)
    setIsLoading(false)

    // Apply theme colors to CSS variables
    const root = document.documentElement
    root.style.setProperty("--color-primary", tenantConfig.branding.colors.primary)
    root.style.setProperty("--color-secondary", tenantConfig.branding.colors.secondary)
    root.style.setProperty("--color-accent", tenantConfig.branding.colors.accent)
    root.style.setProperty("--color-background", tenantConfig.branding.colors.background)
    root.style.setProperty("--color-text", tenantConfig.branding.colors.text)

    // Update document title
    document.title = `${tenantConfig.branding.name} - Real Estate Platform`
  }, [])

  const t = (key: string): string => {
    if (!config) return key
    return config.localization.translations?.[key] || key
  }

  if (!config) {
    return <div>Loading...</div>
  }

  return <TenantContext.Provider value={{ config, isLoading, t }}>{children}</TenantContext.Provider>
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider")
  }
  return context
}

// Convenience hooks
export function useTenantConfig() {
  return useTenant().config
}

export function useTranslation() {
  return useTenant().t
}
