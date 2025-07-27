"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import Image from "next/image"

const images = [
  {
    src: "/images/moxi-essential-1.png",
    alt: "Moxi Account Setup",
    title: "Moxi Account Setup",
  },
  {
    src: "/images/moxi-essential-2.png",
    alt: "Moxi Engage Setup",
    title: "Moxi Engage Setup",
  },
  {
    src: "/images/moxi-essential-3.png",
    alt: "Share Moxi Account",
    title: "Share Moxi Account",
  },
]

export function MoxiEssentialViewer() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [zoom, setZoom] = useState(100)

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 300))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50))
  }

  const handleReset = () => {
    setZoom(100)
  }

  const currentImage = images[currentIndex]

  return (
    <div className="flex flex-col h-full">
      {/* Header with controls */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <h3 className="text-lg font-semibold">{currentImage.title}</h3>
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
              src={currentImage.src || "/placeholder.svg"}
              alt={currentImage.alt}
              width={1200}
              height={800}
              className="max-w-none shadow-lg rounded-lg"
              priority
            />
          </div>
        </div>
      </div>

      {/* Navigation footer */}
      <div className="flex items-center justify-between p-4 border-t bg-gray-50">
        <Button variant="outline" onClick={handlePrevious} disabled={currentIndex === 0}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-purple-600" : "bg-gray-300"
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {currentIndex + 1} of {images.length}
          </span>
        </div>

        <Button variant="outline" onClick={handleNext} disabled={currentIndex === images.length - 1}>
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Quick reference footer */}
      <div className="p-3 bg-purple-50 border-t border-purple-200">
        <div className="flex justify-between text-sm text-purple-800">
          <span>📋 Page 1: Moxi Account Setup</span>
          <span>📋 Page 2: Moxi Engage Setup</span>
          <span>📋 Page 3: Share Moxi Account</span>
        </div>
      </div>
    </div>
  )
}
