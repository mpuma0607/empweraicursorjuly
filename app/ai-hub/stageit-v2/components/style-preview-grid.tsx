"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download, Check } from "lucide-react"

interface StagedImage {
  style: string
  name: string
  url: string
  isOriginal?: boolean
}

interface StylePreviewGridProps {
  images: StagedImage[]
  onStyleSelect: (style: string) => void
  selectedStyle: string
}

export default function StylePreviewGrid({
  images,
  onStyleSelect,
  selectedStyle
}: StylePreviewGridProps) {
  const handleDownload = async (image: StagedImage) => {
    try {
      if (image.blob) {
        // Convert blob to download
        const url = URL.createObjectURL(image.blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${image.name.toLowerCase().replace(' ', '-')}-staged.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } else if (image.url) {
        // For blob URLs, fetch and download
        const response = await fetch(image.url)
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${image.name.toLowerCase().replace(' ', '-')}-staged.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  const handleDownloadAll = async () => {
    try {
      // Download all images with a small delay between each
      for (let i = 0; i < images.length; i++) {
        const image = images[i]
        if (image.url && !image.isOriginal) {
          await handleDownload(image)
          // Small delay to prevent browser blocking multiple downloads
          if (i < images.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500))
          }
        }
      }
    } catch (error) {
      console.error('Error downloading all images:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Grid of Styled Images */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image) => (
          <Card 
            key={image.style}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedStyle === image.style 
                ? 'ring-2 ring-blue-500 shadow-lg' 
                : 'hover:shadow-md'
            }`}
            onClick={() => onStyleSelect(image.style)}
          >
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={image.url}
                  alt={`${image.name} staging`}
                  className="w-full h-32 object-cover rounded-t-lg"
                />
                {selectedStyle === image.style && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-blue-500 text-white">
                      <Check className="w-3 h-3 mr-1" />
                      Selected
                    </Badge>
                  </div>
                )}
                {image.isOriginal && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary">
                      Original
                    </Badge>
                  </div>
                )}
              </div>
              <div className="p-3 space-y-2">
                <h3 className="font-medium text-sm">{image.name}</h3>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      onStyleSelect(image.style)
                    }}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDownload(image)
                    }}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Style Info */}
      {selectedStyle && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div>
            <h3 className="font-semibold text-blue-900">
              {images.find(img => img.style === selectedStyle)?.name} Style Selected
            </h3>
            <p className="text-sm text-blue-700">
              The interactive comparison slider is now active below. Drag the slider to compare original vs staged.
            </p>
          </div>
        </div>
      )}

      {/* Batch Actions */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleDownloadAll}
        >
          <Download className="w-4 h-4 mr-2" />
          Download All
        </Button>
      </div>
    </div>
  )
}
