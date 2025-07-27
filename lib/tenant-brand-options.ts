import type { TenantConfig } from "./types"

export interface BrandOption {
  value: string
  label: string
  publicId: string
}

// All brands for Empower AI tenant
const empowerAiBrandOptions: BrandOption[] = [
  { value: "century21", label: "Century 21", publicId: "century21" },
  { value: "kw", label: "Keller Williams", publicId: "kw" },
  { value: "remax", label: "RE/MAX", publicId: "REMAX" },
  { value: "coldwellbanker", label: "Coldwell Banker", publicId: "coldwellbanker" },
  { value: "berkshirehathaway", label: "Berkshire Hathaway HomeServices", publicId: "berkshirehathaway" },
  { value: "exp", label: "eXp Realty", publicId: "exp" },
  { value: "compass", label: "Compass", publicId: "compass" },
  { value: "realty", label: "Realty ONE Group", publicId: "realty" },
  { value: "better", label: "Better Homes and Gardens", publicId: "better" },
  { value: "corcoran", label: "The Corcoran Group", publicId: "corcoran" },
  { value: "sothebys", label: "Sotheby's International Realty", publicId: "sothebys" },
  { value: "redfin", label: "Redfin", publicId: "redfin" },
  { value: "douglas", label: "Douglas Elliman", publicId: "douglas" },
  { value: "howard", label: "Howard Hanna Real Estate Services", publicId: "howard" },
  { value: "windermere", label: "Windermere Real Estate", publicId: "windermere" },
  { value: "era", label: "ERA Real Estate", publicId: "era" },
  { value: "properties", label: "@properties", publicId: "properties" },
  { value: "weichert", label: "Weichert Realtors", publicId: "weichert" },
  { value: "united", label: "United Real Estate", publicId: "united" },
  { value: "home", label: "HomeSmart", publicId: "home" },
  { value: "other", label: "Other", publicId: "" },
]

// Beggins tenant only has Century 21
const begginsBrandOptions: BrandOption[] = [{ value: "century21", label: "Century 21", publicId: "century21" }]

// Default fallback
const defaultBrandOptions: BrandOption[] = [{ value: "century21", label: "Century 21", publicId: "century21" }]

export function getBrandOptionsForTenant(tenantConfig: TenantConfig): BrandOption[] {
  switch (tenantConfig.id) {
    case "empower-ai":
    case "empower-beta":
      return empowerAiBrandOptions
    case "century21-beggins":
      return begginsBrandOptions
    default:
      return defaultBrandOptions
  }
}

export function getBrandPublicId(brandValue: string, tenantConfig: TenantConfig): string {
  const brandOptions = getBrandOptionsForTenant(tenantConfig)
  const brand = brandOptions.find((b) => b.value === brandValue)
  return brand?.publicId || ""
}
