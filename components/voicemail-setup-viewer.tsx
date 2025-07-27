"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCcw, Phone } from "lucide-react"
import Image from "next/image"

export function VoicemailSetupViewer() {
  const [zoom, setZoom] = useState(100)

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 300))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50))
  const handleResetZoom = () => setZoom(100)

  return (
    <div className="flex flex-col h-full">
      {/* Zoom Controls */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <h3 className="font-semibold text-gray-900">Voicemail Setup Guide</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 50}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center">{zoom}%</span>
          <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 300}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetZoom}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Image Viewer */}
      <div className="flex-1 overflow-auto bg-gray-100 p-4">
        <div className="flex justify-center">
          <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}>
            <Image
              src="/images/voicemail-setup.png"
              alt="Voicemail Setup Instructions"
              width={800}
              height={600}
              className="rounded-lg shadow-lg bg-white"
            />
          </div>
        </div>
      </div>

      {/* Professional Script Template */}
      <div className="border-t bg-white p-4 space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Professional Voicemail Script Template:
          </h4>
          <div className="bg-white p-3 rounded border text-sm">
            <p className="italic text-gray-700">
              "Hi, you've reached [Your Name] with Century 21 Beggins. I'm sorry I missed your call, but your call is
              important to me. Please leave your name, number, and a brief message, and I'll get back to you within 24
              hours. You can also text me at this number for a quicker response. Thank you!"
            </p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <h5 className="font-semibold text-green-800 mb-2">Recording Best Practices:</h5>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Speak clearly and at a moderate pace</li>
            <li>• Keep your greeting under 20 seconds</li>
            <li>• Record in a quiet environment</li>
            <li>• Test your greeting by calling yourself</li>
            <li>• Update your greeting if you'll be unavailable for extended periods</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
