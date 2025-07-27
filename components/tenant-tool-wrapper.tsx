"use client"

import type React from "react"

import { useTenantConfig } from "@/contexts/tenant-context"
import { isToolEnabled } from "@/lib/tenant-config"

interface TenantToolWrapperProps {
  toolId: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function TenantToolWrapper({ toolId, children, fallback = null }: TenantToolWrapperProps) {
  const tenantConfig = useTenantConfig()

  if (!isToolEnabled(toolId, tenantConfig)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Hook for checking tool availability
export function useToolAvailability(toolId: string): boolean {
  const tenantConfig = useTenantConfig()
  return isToolEnabled(toolId, tenantConfig)
}
