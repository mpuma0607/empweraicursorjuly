"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut } from "lucide-react"
import Image from "next/image"

export function CompanyCalendarViewer() {
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
          <h3 className="text-lg font-semibold">Subscribe to the Company Calendar</h3>
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
          📋 <strong>Setup Guide:</strong> Follow the laptop and mobile instructions to subscribe to the company
          calendar using info@c21be.com
        </p>
      </div>

      {/* Image viewer */}
      <div className="flex-1 overflow-auto bg-gray-100 p-4">
        <div className="flex justify-center">
          <div style={{ transform: `scale(${zoom / 100})` }} className="transition-transform duration-200 origin-top">
            <Image
              src="/images/company-calendar-setup.png"
              alt="Company Calendar setup guide showing how to subscribe to the company calendar on laptop and mobile devices, with Google Calendar interface screenshots"
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
            <strong>Key Steps:</strong> Add calendar using info@c21be.com, enable on mobile, join Zoom meetings from
            calendar
          </p>
          <p>
            <strong>BE3 Agents:</strong> Email info@c21be.com to request Company Training Calendar access
          </p>
        </div>
      </div>
    </div>
  )
}
