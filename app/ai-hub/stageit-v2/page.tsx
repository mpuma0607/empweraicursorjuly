"use client"

import { useState } from "react"
import { useMemberSpaceUser } from "@/hooks/useMemberSpaceUser"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload, Download, Code, Eye, Home, Palette, Zap } from "lucide-react"
import BatchStagingForm from "./components/batch-staging-form"
import StylePreviewGrid from "./components/style-preview-grid"
import InteractiveSlider from "./components/interactive-slider"
import EmbedCodeGenerator from "./components/embed-code-generator"

const STAGING_STYLES = [
  { id: 'modern', name: 'Modern', description: 'Clean lines, neutral colors, contemporary furniture' },
  { id: 'scandinavian', name: 'Scandinavian', description: 'Light woods, minimal, hygge aesthetic' },
  { id: 'industrial', name: 'Industrial', description: 'Exposed brick, metal accents, urban loft feel' },
  { id: 'midcentury', name: 'Midcentury', description: '1950s-60s style, bold colors, geometric shapes' },
  { id: 'luxury', name: 'Luxury', description: 'High-end finishes, marble, gold accents' },
  { id: 'farmhouse', name: 'Farmhouse', description: 'Rustic charm, shiplap, vintage elements' },
  { id: 'coastal', name: 'Coastal', description: 'Nautical themes, light blues, beachy vibes' },
  { id: 'original', name: 'Original', description: 'The actual uploaded photo' }
]

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

interface StagedImage {
  style: string
  name: string
  url: string
  isOriginal?: boolean
  blob?: Blob
}

export default function StageITV2Page() {
  const { user } = useMemberSpaceUser()
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [roomType, setRoomType] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [stagedImages, setStagedImages] = useState<StagedImage[]>([])
  const [selectedStyle, setSelectedStyle] = useState<string>('')
  const [showSlider, setShowSlider] = useState(false)
  const [showEmbedCode, setShowEmbedCode] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<{[key: string]: 'pending' | 'processing' | 'completed' | 'failed'}>({})

  const handleImageUpload = (file: File) => {
    setUploadedImage(file)
    setStagedImages([])
    setSelectedStyle('')
    setShowSlider(false)
    setShowEmbedCode(false)
  }

  const handleBatchStaging = async () => {
    if (!uploadedImage || !roomType) return

    setIsProcessing(true)
    setProcessingProgress(0)
    setStagedImages([])
    setProcessingStatus({})

    try {
      
      // Process each style one by one, just like the original StageIT
      const results: StagedImage[] = []
      const totalStyles = STAGING_STYLES.length
      
      for (let i = 0; i < STAGING_STYLES.length; i++) {
        const style = STAGING_STYLES[i]
        
        // Update status
        setProcessingStatus(prev => ({ ...prev, [style.id]: 'processing' }))
        setProcessingProgress((i / totalStyles) * 100)
        
        try {
          console.log(`Processing style ${i + 1}/${totalStyles}: ${style.name}`)
          
          // Create form data for each individual API call (same as original StageIT)
          const formData = new FormData()
          formData.append('image', uploadedImage)
          formData.append('roomType', roomType)
          formData.append('style', style.name)
          formData.append('colors', '')
          formData.append('notes', '')
          formData.append('size', '1024x1024')

          // Call the original StageIT API for each style
          const response = await fetch('/api/stage-it', {
            method: 'POST',
            body: formData
          })

          if (!response.ok) {
            if (response.status === 413) {
              throw new Error('Image file is too large. Please use an image smaller than 8MB or try compressing your image.')
            }
            throw new Error(`API error: ${response.status}`)
          }

          // Convert response to blob URL for display, but we'll handle embed differently
          const blob = await response.blob()
          const imageUrl = URL.createObjectURL(blob)
          
          results.push({
            style: style.id,
            name: style.name,
            url: imageUrl,
            isOriginal: false,
            blob: blob // Store the blob for embed code generation
          })
          
          setProcessingStatus(prev => ({ ...prev, [style.id]: 'completed' }))
          console.log(`Successfully processed ${style.name}`)
          
        } catch (error) {
          console.error(`Error processing ${style.name}:`, error)
          setProcessingStatus(prev => ({ ...prev, [style.id]: 'failed' }))
          
          // Add failed result
          results.push({
            style: style.id,
            name: style.name,
            url: '',
            isOriginal: false
          })
        }
      }

      // Add original image
      const originalUrl = URL.createObjectURL(uploadedImage)
      results.push({
        style: 'original',
        name: 'Original',
        url: originalUrl,
        isOriginal: true,
        blob: uploadedImage
      })

      setStagedImages(results)
      setSelectedStyle('modern')
      setProcessingProgress(100)
      
      const successfulCount = results.filter(r => r.url && !r.isOriginal).length
      console.log(`Batch staging completed: ${successfulCount}/${totalStyles} styles successful`)
      
      if (successfulCount < totalStyles) {
        const failedStyles = results.filter(r => !r.url && !r.isOriginal).map(r => r.name).join(', ')
        alert(`Warning: ${totalStyles - successfulCount} styles failed to process: ${failedStyles}`)
      }
      
    } catch (error) {
      console.error('Error processing batch staging:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to process staging'}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleStyleSelect = (style: string) => {
    setSelectedStyle(style)
    setShowSlider(true)
  }

  const handleGenerateEmbedCode = () => {
    setShowEmbedCode(true)
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Home className="w-8 h-8 text-blue-600" />
          <h1 className="text-4xl font-bold">StageIT V2</h1>
          <Badge variant="secondary" className="ml-2">BETA</Badge>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Professional virtual staging with batch processing. Generate 8 different styles simultaneously in just 2-3 minutes.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload & Configure
            </CardTitle>
            <CardDescription>
              Upload your room photo and select the room type for optimal staging results.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BatchStagingForm
              onImageUpload={handleImageUpload}
              onRoomTypeSelect={setRoomType}
              onStartStaging={handleBatchStaging}
              isProcessing={isProcessing}
              roomType={roomType}
            />
          </CardContent>
        </Card>

        {/* Processing Status */}
        {isProcessing && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing All Styles
              </CardTitle>
              <CardDescription>
                Generating 8 different staging styles simultaneously...
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={processingProgress} className="w-full" />
              <div className="text-center text-sm text-gray-600">
                {processingProgress.toFixed(0)}% Complete
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {STAGING_STYLES.map((style) => (
                  <div key={style.id} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      processingStatus[style.id] === 'completed' 
                        ? 'bg-green-500' 
                        : processingStatus[style.id] === 'processing'
                        ? 'bg-blue-500 animate-pulse'
                        : processingStatus[style.id] === 'failed'
                        ? 'bg-red-500'
                        : 'bg-gray-300'
                    }`} />
                    <span className={processingStatus[style.id] === 'failed' ? 'text-red-600' : ''}>
                      {style.name}
                      {processingStatus[style.id] === 'processing' && ' (processing...)'}
                      {processingStatus[style.id] === 'failed' && ' (failed)'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {stagedImages.length > 0 && !isProcessing && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Staging Results
              </CardTitle>
              <CardDescription>
                All 8 styles have been generated. Click "View" on any style to test the slider comparison.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StylePreviewGrid
                images={stagedImages}
                onStyleSelect={handleStyleSelect}
                selectedStyle={selectedStyle}
              />
            </CardContent>
          </Card>
        )}

        {/* Interactive Slider */}
        {showSlider && selectedStyle && stagedImages.length > 0 && (
          <Card className="lg:col-span-2" data-testid="interactive-slider">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Interactive Comparison
              </CardTitle>
              <CardDescription>
                Drag the slider to compare the original photo with the {selectedStyle} staging.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InteractiveSlider
                originalImage={stagedImages.find(img => img.isOriginal)?.url || ''}
                stagedImage={stagedImages.find(img => img.style === selectedStyle)?.url || ''}
                styleName={selectedStyle}
              />
            </CardContent>
          </Card>
        )}

        {/* Embed Code Generator */}
        {stagedImages.length > 0 && !isProcessing && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Generate Embed Code
              </CardTitle>
              <CardDescription>
                Create an interactive widget for your website or digital presentation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={handleGenerateEmbedCode} className="w-full">
                  <Zap className="w-4 h-4 mr-2" />
                  Generate HTML Widget
                </Button>
                
                {showEmbedCode && (
                  <EmbedCodeGenerator
                    images={stagedImages}
                    roomType={roomType}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle>StageIT V2 Features</CardTitle>
          <CardDescription>
            What makes StageIT V2 the most advanced virtual staging tool available.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <Zap className="w-8 h-8 text-blue-600 mx-auto" />
              <h3 className="font-semibold">Batch Processing</h3>
              <p className="text-sm text-gray-600">
                Generate all 8 styles simultaneously in just 2-3 minutes
              </p>
            </div>
            <div className="text-center space-y-2">
              <Eye className="w-8 h-8 text-green-600 mx-auto" />
              <h3 className="font-semibold">Interactive Slider</h3>
              <p className="text-sm text-gray-600">
                Smooth before/after comparison with drag controls
              </p>
            </div>
            <div className="text-center space-y-2">
              <Code className="w-8 h-8 text-purple-600 mx-auto" />
              <h3 className="font-semibold">Embed Widget</h3>
              <p className="text-sm text-gray-600">
                Generate HTML code for websites and presentations
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
