"use client"

import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export default function LanguageSelector() {
  // Stub implementation - shows disabled language selector
  return (
    <Button variant="ghost" size="sm" disabled className="opacity-50">
      <Globe className="h-4 w-4 mr-2" />
      EN
    </Button>
  )
}
