"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import Image from "next/image"

export function DotloopSetupViewer() {
  const [zoom, setZoom] = useState(100)

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 300))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50))
  }

  const handleReset = () => {
    setZoom(100)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with controls */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <h3 className="text-lg font-semibold">Dotloop Account Setup Guide</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 50}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center">{zoom}%</span>
          <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 300}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Image container */}
      <div className="flex-1 overflow-auto bg-gray-100 p-4">
        <div className="flex justify-center">
          <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}>
            <Image
              src="/images/dotloop-account-setup.png"
              alt="Dotloop Account Setup Guide"
              width={1200}
              height={800}
              className="max-w-none shadow-lg rounded-lg"
              priority
            />
          </div>
        </div>
      </div>

      {/* Quick reference footer */}
      <div className="p-3 bg-indigo-50 border-t border-indigo-200">
        <p className="text-sm text-indigo-800">
          📋 <strong>Quick Reference:</strong> Account Setup → Profile Setup → Mobile App Download
        </p>
      </div>
    </div>
  )
}
