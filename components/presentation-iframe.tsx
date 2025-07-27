"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface PresentationIframeProps {
  src: string
  title: string
}

export function PresentationIframe({ src, title }: PresentationIframeProps) {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const openInNewTab = () => {
    window.open(src, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with controls */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={openInNewTab}>
            <ExternalLink className="w-4 h-4 mr-1" />
            Open in New Tab
          </Button>
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading presentation...</p>
          </div>
        </div>
      )}

      {/* Iframe container */}
      <div className="flex-1 min-h-[70vh]">
        <iframe
          src={src}
          title={title}
          className="w-full h-full min-h-[600px] border-0"
          onLoad={handleLoad}
          allow="fullscreen"
          style={{ display: isLoading ? "none" : "block" }}
        />
      </div>

      {/* Instructions */}
      <div className="p-3 bg-purple-50 border-t border-purple-200">
        <p className="text-sm text-purple-800">
          📖 <strong>Navigation:</strong> Use the presentation controls to navigate through the content. Click "Open in
          New Tab" for fullscreen viewing.
        </p>
      </div>
    </div>
  )
}
