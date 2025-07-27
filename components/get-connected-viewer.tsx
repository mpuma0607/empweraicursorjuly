"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut } from "lucide-react"
import Image from "next/image"

export function GetConnectedViewer() {
  const [zoom, setZoom] = useState(100)

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 300))
  }

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50))
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with title and controls */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">Get Connected</h3>
          <div className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-blue-800">Setup Guide</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={zoomOut} disabled={zoom <= 50}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-600 min-w-[50px] text-center">{zoom}%</span>
          <Button variant="outline" size="sm" onClick={zoomIn} disabled={zoom >= 300}>
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation Instructions */}
      <div className="p-3 bg-yellow-50 border-b border-yellow-200">
        <p className="text-sm text-yellow-800">
          📋 <strong>Connection Guide:</strong> WiFi, KISI app for office access, and printer setup instructions
        </p>
      </div>

      {/* Image viewer */}
      <div className="flex-1 overflow-auto bg-gray-100 p-4">
        <div className="flex justify-center">
          <div style={{ transform: `scale(${zoom / 100})` }} className="transition-transform duration-200 origin-top">
            <Image
              src="/images/get-connected-step2.png"
              alt="Get Connected guide showing WiFi network C21BE1 with password C21BEGGINS, KISI app setup for office access, and printer configuration instructions"
              width={1200}
              height={800}
              className="max-w-none shadow-lg rounded-lg"
              priority
            />
          </div>
        </div>
      </div>

      {/* Quick Reference Footer */}
      <div className="p-4 border-t bg-blue-50">
        <div className="text-sm text-blue-800 space-y-1">
          <p>
            <strong>WiFi:</strong> Network "C21BE1" • Password "C21BEGGINS" (all caps)
          </p>
          <p>
            <strong>KISI App:</strong> Download from app store, sign in with company email •{" "}
            <strong>Printer Help:</strong> tech@c21be.com
          </p>
        </div>
      </div>
    </div>
  )
}
