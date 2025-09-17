"use client"

import Link from "next/link"
import { useTenantConfig } from "@/contexts/tenant-context"

export default function Footer() {
  const tenantConfig = useTenantConfig()

  // Only show footer for Empower AI tenant
  if (tenantConfig.id !== "empower-ai") {
    return null
  }

  return (
    <footer className="bg-gray-100 border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-600">© 2025 Empower AI. All rights reserved.</div>
          <div className="flex space-x-6">
            <Link href="/terms-of-service" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Terms of Service
            </Link>
            <Link href="/terms-of-service" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/support" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
