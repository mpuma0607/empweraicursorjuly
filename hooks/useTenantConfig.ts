"use client"

import { useEffect, useState } from "react"
import { getTenantConfig } from "@/lib/tenant-config"
import type { TenantConfig } from "@/lib/types"

export function useTenantConfig() {
  const [config, setConfig] = useState<TenantConfig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const tenantConfig = getTenantConfig()
      setConfig(tenantConfig)
    } catch (error) {
      console.error("Error loading tenant config:", error)
      // Fallback to a default config if needed
      setConfig(null)
    } finally {
      setLoading(false)
    }
  }, [])

  return config
}
