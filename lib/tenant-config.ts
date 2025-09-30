import { defaultTenantConfig } from "@/lib/tenants/default"
import { brokeragePrivateConfig } from "@/lib/tenants/brokerage-private"
import { internationalConfig } from "@/lib/tenants/international"
import { century21BegginsConfig } from "@/lib/tenants/century21-beggins"
import { century21CoastalConfig } from "@/lib/tenants/century21-coastal"
import { century21PortfolioConfig } from "@/lib/tenants/century21-portfolio"
import { empowerAiConfig } from "@/lib/tenants/empower-ai"
import { empowerBetaConfig } from "@/lib/tenants/empower-beta"
import type { TenantConfig } from "@/lib/types"

const tenantConfigs: Record<string, TenantConfig> = {
  default: defaultTenantConfig,
  "brokerage-private": brokeragePrivateConfig,
  international: internationalConfig,
  "century21-beggins": century21BegginsConfig,
  "century21-coastal": century21CoastalConfig,
  "century21-portfolio": century21PortfolioConfig,
  "empower-ai": empowerAiConfig,
  "empower-beta": empowerBetaConfig,
}

export function getTenantConfig(): TenantConfig {
  if (typeof window === "undefined") {
    // Server-side: Use Empower AI as default
    return empowerAiConfig
  }

  // Client-side: All existing methods preserved in exact same order
  // 1. Check for preview tenant override (existing)
  const previewTenant = localStorage.getItem("preview-tenant")
  if (previewTenant && tenantConfigs[previewTenant]) {
    return tenantConfigs[previewTenant]
  }

  // 2. Check URL parameter (existing)
  const urlParams = new URLSearchParams(window.location.search)
  const tenantParam = urlParams.get("tenant")
  if (tenantParam && tenantConfigs[tenantParam]) {
    return tenantConfigs[tenantParam]
  }

  // 3. Check domain detection (additive - doesn't break existing)
  const hostname = window.location.hostname

  // Check for exact subdomain matches first
  if (hostname === "beggins.thenextlevelu.com") {
    return century21BegginsConfig
  }
  if (hostname === "coastal.thenextlevelu.com") {
    return century21CoastalConfig
  }
  if (hostname === "portfolio.thenextlevelu.com") {
    return century21PortfolioConfig
  }
  if (hostname === "brokerage.thenextlevelu.com") {
    return brokeragePrivateConfig
  }
  if (hostname === "international.thenextlevelu.com") {
    return internationalConfig
  }

  // Check for C21 Portfolio domains
  if (hostname === "c21agenthome.com" || hostname === "www.c21agenthome.com" || 
      hostname === "c21portfolio.com" || hostname === "www.c21portfolio.com") {
    return century21PortfolioConfig
  }

  // Check for Empower AI domains
  if (hostname === "getempowerai.com" || hostname === "www.getempowerai.com") {
    // Check if we're on the C21 Coastal or Portfolio home page
    if (window.location.pathname === "/c21-coastal-home") {
      return century21CoastalConfig
    }
    if (window.location.pathname === "/c21-portfolio-home") {
      return century21PortfolioConfig
    }
    return empowerAiConfig
  }
  if (hostname === "empoweraibeta.com" || hostname === "www.empoweraibeta.com") {
    return empowerBetaConfig
  }

  // Fallback to partial matches (existing logic)
  if (hostname.includes("beggins") || hostname.includes("century21-beggins")) {
    return century21BegginsConfig
  }
  if (hostname.includes("coastal") || hostname.includes("century21-coastal") || hostname.includes("c21coastal")) {
    return century21CoastalConfig
  }
  if (hostname.includes("portfolio") || hostname.includes("century21-portfolio") || hostname.includes("c21portfolio") || hostname.includes("c21agenthome")) {
    return century21PortfolioConfig
  }
  if (hostname.includes("brokerage1") || hostname.includes("brokerage-private")) {
    return brokeragePrivateConfig
  }
  if (hostname.includes("international")) {
    return internationalConfig
  }
  if (hostname.includes("empowerai") || hostname.includes("empower-ai")) {
    return empowerAiConfig
  }
  if (hostname.includes("empoweraibeta") || hostname.includes("empower-beta")) {
    return empowerBetaConfig
  }

  // 4. Fallback to Empower AI as default (changed from defaultTenantConfig)
  return empowerAiConfig
}

export function getAllTenants() {
  return [
    { id: "empower-ai", name: "Empower AI" },
    { id: "empower-beta", name: "Empower Beta" },
    { id: "century21-beggins", name: "Beggins University" },
    { id: "century21-coastal", name: "Century 21 Coastal Advantage" },
    { id: "century21-portfolio", name: "Century 21 Portfolio" },
    { id: "brokerage-private", name: "Private Brokerage" },
    { id: "international", name: "International Platform" },
    { id: "default", name: "The Next Level U (Legacy)" },
  ]
}

export function getTenantById(id: string): TenantConfig | undefined {
  return tenantConfigs[id]
}

// Utility functions for feature checking
export function isToolEnabled(toolId: string, config: TenantConfig): boolean {
  return config.features.enabledTools?.includes(toolId) || false
}

export function isFeatureHidden(featureId: string, config: TenantConfig): boolean {
  return config.features.hiddenFeatures?.includes(featureId) || false
}

export function getTranslation(key: string, config: TenantConfig): string {
  return config.localization?.translations?.[key] || key
}
