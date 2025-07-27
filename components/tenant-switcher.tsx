"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { getAllTenants, getTenantConfig } from "@/lib/tenant-config"

export default function TenantSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const [shouldShow, setShouldShow] = useState(false)
  const tenants = getAllTenants()
  const currentTenant = getTenantConfig()

  useEffect(() => {
    const hostname = window.location.hostname
    const isV0Preview = hostname.includes("vusercontent.net")
    const isLocalhost = hostname.includes("localhost")
    const isDev = process.env.NODE_ENV === "development"
    setShouldShow(isV0Preview || isLocalhost || isDev)
  }, [])

  if (!shouldShow) {
    return null
  }

  const switchTenant = (tenantId: string) => {
    if (tenantId === "default") {
      localStorage.removeItem("preview-tenant")
    } else {
      localStorage.setItem("preview-tenant", tenantId)
    }
    window.location.reload()
  }

  return (
    <div className="fixed top-20 left-4 z-[9999] bg-white shadow-2xl rounded-lg border-2 border-gray-300">
      <div className="relative">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="bg-white shadow-lg border-2 text-sm font-medium px-4 py-2"
        >
          🔄 {currentTenant.name} <ChevronDown className="h-4 w-4 ml-2" />
        </Button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white shadow-xl border-2 rounded-md min-w-64 max-h-64 overflow-y-auto">
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 border-b">Switch Tenant</div>
              {tenants.map((tenant) => (
                <button
                  key={tenant.id}
                  onClick={() => {
                    switchTenant(tenant.id)
                    setIsOpen(false)
                  }}
                  className={`block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                    currentTenant.id === tenant.id ? "bg-blue-50 text-blue-600 font-medium" : ""
                  }`}
                >
                  <div className="font-medium">{tenant.name}</div>
                  <div className="text-xs text-gray-500">{tenant.id}</div>
                  {currentTenant.id === tenant.id && <div className="text-xs text-blue-600 mt-1">✓ Current</div>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
