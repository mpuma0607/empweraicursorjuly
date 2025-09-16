"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  X, 
  RefreshCw, 
  Lightbulb, 
  Loader2,
  Image as ImageIcon
} from "lucide-react"
import Image from "next/image"

interface ImageEditModalProps {
  isOpen: boolean
  onClose: () => void
  originalImage: string
  stagedImage: string
  roomType: string
  style: string
  onRegenerate: (instructions: string) => Promise<void>
  isRegenerating?: boolean
}

const EXAMPLE_INSTRUCTIONS = [
  "Remove the window that was added",
  "Move the chair to the right",
  "Add more lighting",
  "Remove the extra door",
  "Make the room look more spacious",
  "Remove the table blocking the doorway",
  "Add a rug to the floor",
  "Change the wall color to white",
  "Remove the extra furniture",
  "Make the room look cleaner"
]

export default function ImageEditModal({
  isOpen,
  onClose,
  originalImage,
  stagedImage,
  roomType,
  style,
  onRegenerate,
  isRegenerating = false
}: ImageEditModalProps) {
  const [instructions, setInstructions] = useState("")
  const [selectedExample, setSelectedExample] = useState<string | null>(null)

  const handleExampleClick = (example: string) => {
    setInstructions(example)
    setSelectedExample(example)
  }

  const handleRegenerate = async () => {
    if (!instructions.trim()) return
    await onRegenerate(instructions.trim())
  }

  const handleClose = () => {
    setInstructions("")
    setSelectedExample(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Edit Staged Image
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Image Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Original Image</Label>
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={originalImage}
                  alt="Original room"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Current Staged Image</Label>
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={stagedImage}
                  alt="Staged room"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Room Info */}
          <div className="flex gap-2">
            <Badge variant="secondary">{roomType}</Badge>
            <Badge variant="outline">{style}</Badge>
          </div>

          {/* Instructions Input */}
          <div className="space-y-3">
            <Label htmlFor="instructions" className="text-sm font-medium">
              What would you like to change?
            </Label>
            <Textarea
              id="instructions"
              placeholder="Describe the changes you want to make to the staged image..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="min-h-[100px]"
              disabled={isRegenerating}
            />
          </div>

          {/* Example Instructions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <Label className="text-sm font-medium">Quick Examples:</Label>
            </div>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_INSTRUCTIONS.map((example, index) => (
                <Button
                  key={index}
                  variant={selectedExample === example ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleExampleClick(example)}
                  disabled={isRegenerating}
                  className="text-xs"
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose} disabled={isRegenerating}>
              Cancel
            </Button>
            <Button 
              onClick={handleRegenerate} 
              disabled={!instructions.trim() || isRegenerating}
              className="min-w-[120px]"
            >
              {isRegenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate Image
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
