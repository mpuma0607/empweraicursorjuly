"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut } from "lucide-react"
import Image from "next/image"

interface ZoomSetupViewerProps {
  isOpen: boolean
  onClose: () => void
}

export function ZoomSetupViewer({ isOpen, onClose }: ZoomSetupViewerProps) {
  const [zoom, setZoom] = useState(100)

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 300))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Zoom Initial Set Up Guide</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 50}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-normal">{zoom}%</span>
              <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 300}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-center p-4">
          <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}>
            <Image
              src="/images/zoom-initial-setup.png"
              alt="Zoom Initial Setup Guide"
              width={1200}
              height={800}
              className="max-w-none"
              priority
            />
          </div>
        </div>

        <div className="mt-4 p-4 bg-orange-50 rounded-lg">
          <h4 className="font-semibold text-orange-900 mb-2">Quick Reference:</h4>
          <div className="text-sm text-orange-800 space-y-1">
            <p>• Go to zoom.us and sign in with your company Google account</p>
            <p>• Add your photo and confirm your name display</p>
            <p>• Use Zoom code 509 422 490 for daily training</p>
            <p>• Join morning meetings weekdays from 9 to 9:30 am</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
