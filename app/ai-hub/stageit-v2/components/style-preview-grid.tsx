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
  const handleDownload = (image: StagedImage) => {
    // In a real implementation, this would trigger a download
    console.log('Downloading:', image.name)
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
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900">
                {images.find(img => img.style === selectedStyle)?.name} Style Selected
              </h3>
              <p className="text-sm text-blue-700">
                Click "View" above to see the interactive comparison slider
              </p>
            </div>
            <Button
              onClick={() => onStyleSelect(selectedStyle)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Eye className="w-4 h-4 mr-2" />
              Compare Now
            </Button>
          </div>
        </div>
      )}

      {/* Batch Actions */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Download All
        </Button>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          View All in Grid
        </Button>
      </div>
    </div>
  )
}
