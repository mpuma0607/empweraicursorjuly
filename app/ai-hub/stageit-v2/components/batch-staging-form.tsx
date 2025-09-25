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
  'Family Room',
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
  const [isCompressing, setIsCompressing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()
      
      img.onload = () => {
        // More aggressive compression for large files
        let { width, height } = img
        
        // Calculate target size based on original file size
        const originalSizeMB = file.size / (1024 * 1024)
        let maxDimension = 2048
        let quality = 0.8
        
        // More aggressive settings for larger files
        if (originalSizeMB > 15) {
          maxDimension = 1000 // Even smaller dimensions
          quality = 0.4 // Even lower quality
        } else if (originalSizeMB > 10) {
          maxDimension = 1200
          quality = 0.5
        } else if (originalSizeMB > 8) {
          maxDimension = 1400
          quality = 0.6
        } else if (originalSizeMB > 5) {
          maxDimension = 1600
          quality = 0.7
        }
        
        // Scale down dimensions
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height * maxDimension) / width
            width = maxDimension
          } else {
            width = (width * maxDimension) / height
            height = maxDimension
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            })
            
            // If still too large, try a second compression pass
            if (compressedFile.size > 8 * 1024 * 1024 && quality > 0.2) {
              console.log('First compression not enough, trying second pass...')
              const secondCanvas = document.createElement('canvas')
              const secondCtx = secondCanvas.getContext('2d')!
              const secondImg = new Image()
              
              secondImg.onload = () => {
                const secondMaxDim = Math.min(maxDimension * 0.8, 1000)
                let secondWidth = secondImg.width
                let secondHeight = secondImg.height
                
                if (secondWidth > secondMaxDim || secondHeight > secondMaxDim) {
                  if (secondWidth > secondHeight) {
                    secondHeight = (secondHeight * secondMaxDim) / secondWidth
                    secondWidth = secondMaxDim
                  } else {
                    secondWidth = (secondWidth * secondMaxDim) / secondHeight
                    secondHeight = secondMaxDim
                  }
                }
                
                secondCanvas.width = secondWidth
                secondCanvas.height = secondHeight
                secondCtx.drawImage(secondImg, 0, 0, secondWidth, secondHeight)
                
                secondCanvas.toBlob((secondBlob) => {
                  if (secondBlob) {
                    const finalFile = new File([secondBlob], file.name, {
                      type: 'image/jpeg',
                      lastModified: Date.now()
                    })
                    console.log(`Second compression: ${(compressedFile.size / (1024 * 1024)).toFixed(2)}MB -> ${(finalFile.size / (1024 * 1024)).toFixed(2)}MB`)
                    resolve(finalFile)
                  } else {
                    resolve(compressedFile)
                  }
                }, 'image/jpeg', Math.max(quality * 0.7, 0.3))
              }
              
              secondImg.src = URL.createObjectURL(compressedFile)
            } else {
              resolve(compressedFile)
            }
          } else {
            resolve(file) // Fallback to original if compression fails
          }
        }, 'image/jpeg', quality) // Use dynamic quality
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  const handleFileSelect = async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      // Compress if file is larger than 8MB
      const maxSize = 8 * 1024 * 1024 // 8MB
      let processedFile = file
      
      if (file.size >= maxSize) { // Changed from > to >= to compress 8MB files
        setIsCompressing(true)
        try {
          console.log(`File size ${(file.size / (1024 * 1024)).toFixed(2)}MB exceeds limit, compressing...`)
          processedFile = await compressImage(file)
          console.log(`Compressed to ${(processedFile.size / (1024 * 1024)).toFixed(2)}MB`)
          
          // Check if compressed file is still too large
          if (processedFile.size > maxSize) {
            alert(`Image is still too large after compression (${(processedFile.size / (1024 * 1024)).toFixed(2)}MB). Please use a smaller image or try a different file.`)
            setIsCompressing(false)
            return
          }
          
          // Show compression success message
          const compressionRatio = ((file.size - processedFile.size) / file.size * 100).toFixed(1)
          console.log(`Compression successful: ${compressionRatio}% size reduction`)
        } catch (error) {
          console.error('Error compressing image:', error)
          alert('Failed to compress image. Please try a smaller image or a different file format.')
          setIsCompressing(false)
          return
        } finally {
          setIsCompressing(false)
        }
      }
      
      setUploadedFile(processedFile)
      const url = URL.createObjectURL(processedFile)
      setPreviewUrl(url)
      onImageUpload(processedFile)
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
              {isCompressing && (
                <div className="flex items-center gap-1 mt-1 text-blue-600">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span className="text-xs">Compressing image...</span>
                </div>
              )}
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
          {['Modern', 'Scandinavian', 'Industrial', 'Midcentury', 'Luxury', 'Farmhouse', 'Coastal', 'Remove Furniture'].map((style) => (
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
