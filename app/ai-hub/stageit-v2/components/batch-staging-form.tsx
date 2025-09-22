"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"

interface BatchStagingFormProps {
  onImageUpload: (file: File) => void
  onRoomTypeSelect: (roomType: string) => void
  onStartStaging: () => void
  isProcessing: boolean
  roomType: string
}

const ROOM_TYPES = [
  'Living Room',
  'Bedroom', 
  'Kitchen',
  'Dining Room',
  'Bathroom',
  'Office',
  'Nursery',
  'Basement',
  'Patio',
  'Other'
]

export default function BatchStagingForm({
  onImageUpload,
  onRoomTypeSelect,
  onStartStaging,
  isProcessing,
  roomType
}: BatchStagingFormProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      onImageUpload(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleRemoveImage = () => {
    setUploadedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    onImageUpload(null as any)
  }

  const canStartStaging = uploadedFile && roomType && !isProcessing

  return (
    <div className="space-y-6">
      {/* Image Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {previewUrl ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                src={previewUrl}
                alt="Uploaded room"
                className="max-w-full max-h-64 rounded-lg shadow-md"
              />
              <Button
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2"
                onClick={handleRemoveImage}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              {uploadedFile?.name} ({(uploadedFile?.size! / 1024 / 1024).toFixed(2)} MB)
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-lg font-medium text-gray-900">
                Drop your room photo here
              </p>
              <p className="text-sm text-gray-500">
                or click to browse files
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>
        )}
      </div>

      {/* Room Type Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Room Type
        </label>
        <Select value={roomType} onValueChange={onRoomTypeSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select the room type for optimal staging" />
          </SelectTrigger>
          <SelectContent>
            {ROOM_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Staging Styles Preview */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Staging Styles (8 styles will be generated)
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {['Modern', 'Scandinavian', 'Industrial', 'Midcentury', 'Luxury', 'Farmhouse', 'Coastal', 'Original'].map((style) => (
            <div key={style} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>{style}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Start Staging Button */}
      <Button
        onClick={onStartStaging}
        disabled={!canStartStaging}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing All Styles...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Start Batch Staging (2-3 min)
          </>
        )}
      </Button>

      {!canStartStaging && !isProcessing && (
        <p className="text-sm text-gray-500 text-center">
          Upload an image and select room type to begin
        </p>
      )}
    </div>
  )
}
