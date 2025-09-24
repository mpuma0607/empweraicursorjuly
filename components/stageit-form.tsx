"use client"

import React, { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { 
  Upload, 
  Download, 
  Copy, 
  Mail,
  Save,
  RefreshCw,
  Eye,
  Palette,
  Home,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react"
import { useMemberSpaceUser } from "@/hooks/use-memberspace-user"
import { saveUserCreation } from "@/lib/auto-save-creation"
import EmailCompositionModal from "@/components/email-composition-modal"

interface StagingRequest {
  roomType: string
  style: string
  colorPalette: string
  furnitureDensity: 'minimal' | 'moderate' | 'luxurious'
  lighting: string
  targetMarket: string
  additionalFeatures: string[]
  propertyValue: 'starter' | 'mid-range' | 'luxury'
}

interface StagingResult {
  id: string
  originalImage: string
  stagedImage: string
  style: string
  prompt: string
  metadata: StagingRequest
  createdAt: Date
}

// Image compression function (moved outside component to avoid dependency issues)
const compressImage = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new Image()
    
    // Add timeout to prevent hanging
    const timeout = setTimeout(() => {
      console.error('Compression timeout')
      reject(new Error('Compression timeout'))
    }, 10000) // 10 second timeout
    
    img.onload = () => {
      clearTimeout(timeout)
      try {
      // More aggressive compression for large files
      let { width, height } = img
      
      // Calculate target size based on original file size
      const originalSizeMB = file.size / (1024 * 1024)
      let maxDimension = 2048
      let quality = 0.8
      
      // Simple, fast compression settings
      if (originalSizeMB > 10) {
        maxDimension = 1600
        quality = 0.7
      } else if (originalSizeMB >= 4) { // 4MB files
        maxDimension = 1800 // Good size for 4MB files
        quality = 0.8 // Good quality
      }
      
      console.log(`Compression settings: ${originalSizeMB.toFixed(2)}MB -> maxDim: ${maxDimension}, quality: ${quality}`)
      
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
          
          console.log(`Compression result: ${(file.size / (1024 * 1024)).toFixed(2)}MB -> ${(compressedFile.size / (1024 * 1024)).toFixed(2)}MB`)
          
          // If still too large, try even more aggressive compression
          if (compressedFile.size > 8 * 1024 * 1024) { // Still > 8MB
            console.log('Still too large, applying secondary compression...')
            // Create smaller canvas for secondary compression
            const smallerCanvas = document.createElement('canvas')
            const smallerCtx = smallerCanvas.getContext('2d')!
            
            const secondaryMaxDimension = 1024
            let newWidth = width
            let newHeight = height
            
            if (width > secondaryMaxDimension || height > secondaryMaxDimension) {
              if (width > height) {
                newHeight = (height * secondaryMaxDimension) / width
                newWidth = secondaryMaxDimension
              } else {
                newWidth = (width * secondaryMaxDimension) / height
                newHeight = secondaryMaxDimension
              }
            }
            
            smallerCanvas.width = newWidth
            smallerCanvas.height = newHeight
            smallerCtx.drawImage(img, 0, 0, newWidth, newHeight)
            
            smallerCanvas.toBlob((secondBlob) => {
              if (secondBlob) {
                const finalFile = new File([secondBlob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                })
                console.log(`Final compression: ${(finalFile.size / (1024 * 1024)).toFixed(2)}MB`)
                resolve(finalFile)
              } else {
                resolve(compressedFile)
              }
            }, 'image/jpeg', 0.5) // Very aggressive quality
          } else {
            resolve(compressedFile)
          }
        } else {
          resolve(file) // Fallback to original if compression fails
        }
      }, 'image/jpeg', quality)
    }
    
    img.src = URL.createObjectURL(file)
  })
}

export function StageItForm() {
  const [currentStep, setCurrentStep] = useState<'upload' | 'configure' | 'process' | 'results'>('upload')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [imageName, setImageName] = useState('')
  const [stagingRequest, setStagingRequest] = useState<StagingRequest>({
    roomType: '',
    style: '',
    colorPalette: '',
    furnitureDensity: 'moderate',
    lighting: '',
    targetMarket: '',
    additionalFeatures: [],
    propertyValue: 'mid-range'
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [stagingResults, setStagingResults] = useState<StagingResult[]>([])
  const [selectedResult, setSelectedResult] = useState<StagingResult | null>(null)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [emailContent, setEmailContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false)
  
  const { user, loading: userLoading } = useMemberSpaceUser()

  // Image compression function
  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()
      
      img.onload = () => {
        // Calculate new dimensions (max 2048x2048 for staging)
        let { width, height } = img
        const maxDimension = 2048
        
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
            
            resolve(compressedFile)
          } else {
            resolve(file) // Fallback to original if compression fails
          }
        }, 'image/jpeg', quality) // Use dynamic quality
      } catch (error) {
        clearTimeout(timeout)
        console.error('Compression error:', error)
        reject(error)
      }
    }
    
    img.onerror = () => {
        clearTimeout(timeout)
        console.error('Image load error')
        reject(new Error('Failed to load image'))
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (JPG, PNG, etc.)')
        return
      }
      
      // Check if file is too large and needs compression
      const maxUploadSize = 4 * 1024 * 1024 // 4MB limit to avoid Vercel 413 errors
      let processedFile = file
      
      if (file.size >= maxUploadSize) { // Changed from > to >= to compress 8MB files
        try {
          setIsCompressing(true)
          console.log(`File size ${(file.size / (1024 * 1024)).toFixed(2)}MB exceeds limit, compressing...`)
          processedFile = await compressImage(file)
          console.log(`Compressed to ${(processedFile.size / (1024 * 1024)).toFixed(2)}MB`)
          
          // Check if compressed file is still too large
          if (processedFile.size > maxUploadSize) {
            alert('Image is too large even after compression. Please use a smaller image or compress it further.')
            return
          }
        } catch (error) {
          console.error('Error compressing image:', error)
          alert('Failed to compress image. Please try a smaller image.')
          return
        } finally {
          setIsCompressing(false)
        }
      }
      
      setImageFile(processedFile)
      const url = URL.createObjectURL(processedFile)
      setImageUrl(url)
      setImageName(file.name.replace(/\.[^/.]+$/, ''))
      setCurrentStep('configure')
    }
  }

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (JPG, PNG, etc.)')
        return
      }
      
      // Check if file is too large and needs compression
      const maxUploadSize = 4 * 1024 * 1024 // 4MB limit to avoid Vercel 413 errors
      let processedFile = file
      
      if (file.size >= maxUploadSize) { // Changed from > to >= to compress 8MB files
        try {
          setIsCompressing(true)
          console.log(`File size ${(file.size / (1024 * 1024)).toFixed(2)}MB exceeds limit, compressing...`)
          processedFile = await compressImage(file)
          console.log(`Compressed to ${(processedFile.size / (1024 * 1024)).toFixed(2)}MB`)
          
          // Check if compressed file is still too large
          if (processedFile.size > maxUploadSize) {
            alert('Image is too large even after compression. Please use a smaller image or compress it further.')
            return
          }
        } catch (error) {
          console.error('Error compressing image:', error)
          alert('Failed to compress image. Please try a smaller image.')
          return
        } finally {
          setIsCompressing(false)
        }
      }
      
      setImageFile(processedFile)
      const url = URL.createObjectURL(processedFile)
      setImageUrl(url)
      setImageName(file.name.replace(/\.[^/.]+$/, ''))
      setCurrentStep('configure')
    }
  }, [])

  // Update staging request
  const updateStagingRequest = (updates: Partial<StagingRequest>) => {
    setStagingRequest(prev => ({ ...prev, ...updates }))
  }

  // Add/remove additional features
  const toggleFeature = (feature: string) => {
    setStagingRequest(prev => ({
      ...prev,
      additionalFeatures: prev.additionalFeatures.includes(feature)
        ? prev.additionalFeatures.filter(f => f !== feature)
        : [...prev.additionalFeatures, feature]
    }))
  }

  // Generate staging
  const generateStaging = async () => {
    if (!imageFile) {
      alert('Please upload an image first')
      return
    }
    
    if (!stagingRequest.roomType) {
      alert('Please select a room type')
      return
    }
    
    if (!stagingRequest.style) {
      alert('Please select a design style')
      return
    }

    // Optional but recommended fields
    if (!stagingRequest.colorPalette) {
      if (!confirm('No color palette selected. Continue with default colors?')) {
        return
      }
    }

    setIsProcessing(true)
    setCurrentStep('process')

                try {
        // Call the new API route for staging using multipart form data
        const formData = new FormData()
        formData.append('image', imageFile!)
        formData.append('roomType', stagingRequest.roomType)
        formData.append('style', stagingRequest.style)
        formData.append('colors', stagingRequest.colorPalette || '')
        formData.append('notes', `Furniture density: ${stagingRequest.furnitureDensity}, Lighting: ${stagingRequest.lighting}, Target market: ${stagingRequest.targetMarket}, Property value: ${stagingRequest.propertyValue}, Additional features: ${stagingRequest.additionalFeatures.join(', ')}`)
        formData.append('size', "1536x1024") // landscape format for real estate photos

        console.log('Sending staging request with form data:');
        console.log('FormData entries:', Array.from(formData.entries()).map(([key, value]) => ({
          key,
          value: value instanceof File ? `File: ${value.name} (${value.size} bytes, ${value.type})` : value
        })));

        const response = await fetch('/api/stage-it', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          // Handle specific HTTP error codes
          if (response.status === 413) {
            throw new Error('Image file is too large. Please use an image smaller than 8MB or try compressing your image.')
          }
          
          // Try to get detailed error information
          let errorMessage = 'Staging failed'
          let errorDetails = null
          
          try {
            const errorData = await response.json()
            errorMessage = errorData.error || errorMessage
            errorDetails = errorData.details || errorData
            console.error('Detailed error:', errorData)
          } catch {
            // If response isn't JSON, use status text
            if (response.status === 413) {
              errorMessage = 'Image file is too large'
            } else {
              errorMessage = response.statusText || errorMessage
            }
          }
          
          // Log additional details for debugging
          console.error('Response status:', response.status)
          console.error('Response headers:', Object.fromEntries(response.headers.entries()))
          
          throw new Error(`${errorMessage}${errorDetails ? ` - Details: ${JSON.stringify(errorDetails)}` : ''}`)
        }

        // Handle binary image response
        const blob = await response.blob()
        const objectUrl = URL.createObjectURL(blob)
        
        // Create staging results with the generated image
        const clientResults: StagingResult[] = [{
          id: `staging-${Date.now()}-1`,
          originalImage: imageUrl,
          stagedImage: objectUrl, // The AI-generated staged image from OpenAI as object URL
          style: stagingRequest.style,
          prompt: `AI-generated ${stagingRequest.style} staging for ${stagingRequest.roomType}`,
          metadata: stagingRequest,
          createdAt: new Date()
        }]
        
        setStagingResults(clientResults)
        setSelectedResult(clientResults[0])
        setCurrentStep('results')
    } catch (error) {
      console.error('Error generating staging:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      console.error('Detailed error:', errorMessage)
      console.error('Full error object:', error)
      alert(`Failed to generate staging: ${errorMessage}`)
    } finally {
      setIsProcessing(false)
    }
  }

  // Save to profile
  const handleSaveToProfile = async () => {
    if (!user || !selectedResult) return
    
    setIsSaving(true)
    try {
      const title = `Virtual Staging - ${imageName} (${selectedResult.style})`
      await saveUserCreation({
        userId: user.id.toString(),
        userEmail: user.email,
        toolType: 'real-img',
        title,
        content: JSON.stringify({ stagingRequest, selectedResult }),
        formData: {
          imageName,
          style: selectedResult.style,
          roomType: stagingRequest.roomType
        },
        metadata: {
          imageUrl,
          stagedImageUrl: selectedResult.stagedImage,
          style: selectedResult.style,
          createdAt: new Date().toISOString()
        }
      })
      alert('Virtual staging saved to your profile successfully!')
    } catch (error) {
      console.error('Error saving to profile:', error)
      alert('Failed to save to profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }


  // Email to self (Resend API with attachments - same methodology as Gmail)
  const handleEmailToSelf = async () => {
    if (!user || !selectedResult) return
    
    try {
      const emailContent = `
Virtual Staging: ${imageName}

Style: ${selectedResult.style}
Room Type: ${stagingRequest.roomType}
Color Palette: ${stagingRequest.colorPalette}
Furniture Density: ${stagingRequest.furnitureDensity}
Lighting: ${stagingRequest.lighting}
Target Market: ${stagingRequest.targetMarket}
Property Value: ${stagingRequest.propertyValue}

Additional Features: ${stagingRequest.additionalFeatures.join(', ')}

Generated on: ${new Date().toLocaleDateString()}
      `.trim()

      // Create FormData (same methodology as Gmail API)
      const formData = new FormData()
      formData.append('to', user.email)
      formData.append('from', 'noreply@marketing.getempowerai.com')
      formData.append('subject', `StageIT: ${imageName} - ${selectedResult.style}`)
      formData.append('body', emailContent)

      // Add image attachment (same methodology as Gmail API)
      try {
        const imageResponse = await fetch(selectedResult.stagedImage)
        const imageBlob = await imageResponse.blob()
        const imageFile = new File([imageBlob], `staged-${imageName}-${selectedResult.style}.jpg`, { type: 'image/jpeg' })
        formData.append('attachment_0', imageFile)
        console.log('📎 Added image attachment:', imageFile.name, imageFile.size, 'bytes')
      } catch (error) {
        console.warn('Failed to add image attachment:', error)
        // Continue without attachment if image fetch fails
      }

      const response = await fetch('/api/send-stageit-email-resend', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        alert('Email sent to yourself successfully!')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send email')
      }
    } catch (error) {
      console.error('Error sending email to self:', error)
      alert(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Email to someone else (Gmail)
  const handleEmailToClient = () => {
    if (!selectedResult) return
    
    const emailContent = `
Virtual Staging: ${imageName}

I've created a beautiful ${selectedResult.style} virtual staging for your ${stagingRequest.roomType}.

Style Details:
• Design: ${selectedResult.style}
• Color Palette: ${stagingRequest.colorPalette}
• Furniture: ${stagingRequest.furnitureDensity}
• Lighting: ${stagingRequest.lighting}
• Target Market: ${stagingRequest.targetMarket}

This staging will help showcase your property's full potential and attract more qualified buyers.

Best regards,
${user?.name || 'Your Name'}
    `.trim()

    setEmailContent(emailContent)
    setIsEmailModalOpen(true)
  }


  // Download image
  const downloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (userLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <Tabs value={currentStep} onValueChange={(value) => setCurrentStep(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload">1. Upload Image</TabsTrigger>
          <TabsTrigger value="configure" disabled={!imageUrl}>2. Configure Staging</TabsTrigger>
          <TabsTrigger value="process" disabled={!imageUrl || !stagingRequest.roomType || !stagingRequest.style}>3. Process</TabsTrigger>
          <TabsTrigger value="results" disabled={stagingResults.length === 0}>4. Results</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <div className="text-center py-12">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-gray-400 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Upload your room photo
              </h3>
              <p className="text-gray-500 mb-4">
                Drag and drop an image here, or click to select. 
                Best results with empty or minimally furnished rooms.
              </p>
              {isCompressing ? (
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Compressing image...</span>
                </div>
              ) : (
                <Button onClick={() => document.getElementById('image-upload')?.click()}>
                  Choose Image
                </Button>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="configure" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Room Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt={imageName}
                    className="w-full h-auto rounded-lg border"
                  />
                  <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    {imageName}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Staging Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Staging Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Room Type */}
                <div>
                  <Label htmlFor="room-type">Room Type *</Label>
                  <Select
                    value={stagingRequest.roomType}
                    onValueChange={(value) => updateStagingRequest({ roomType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="living-room">Living Room</SelectItem>
                      <SelectItem value="kitchen">Kitchen</SelectItem>
                      <SelectItem value="bedroom">Bedroom</SelectItem>
                      <SelectItem value="bathroom">Bathroom</SelectItem>
                      <SelectItem value="dining-room">Dining Room</SelectItem>
                      <SelectItem value="office">Office/Study</SelectItem>
                      <SelectItem value="family-room">Family Room</SelectItem>
                      <SelectItem value="entryway">Entryway/Foyer</SelectItem>
                      <SelectItem value="basement">Basement</SelectItem>
                      <SelectItem value="garage">Garage/Workshop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Style Selection */}
                <div>
                  <Label htmlFor="style">Design Style *</Label>
                  <Select
                    value={stagingRequest.style}
                    onValueChange={(value) => updateStagingRequest({ style: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select design style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coastal">Coastal/Beach House</SelectItem>
                      <SelectItem value="modern">Modern/Minimalist</SelectItem>
                      <SelectItem value="traditional">Traditional/Classic</SelectItem>
                      <SelectItem value="rustic">Rustic/Farmhouse</SelectItem>
                      <SelectItem value="industrial">Industrial/Urban</SelectItem>
                      <SelectItem value="scandinavian">Scandinavian</SelectItem>
                      <SelectItem value="mediterranean">Mediterranean</SelectItem>
                      <SelectItem value="contemporary">Contemporary</SelectItem>
                      <SelectItem value="luxury">Luxury/High-End</SelectItem>
                      <SelectItem value="mid-century">Mid-Century Modern</SelectItem>
                      <SelectItem value="bohemian">Bohemian/Eclectic</SelectItem>
                      <SelectItem value="asian-fusion">Asian Fusion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Color Palette */}
                <div>
                  <Label htmlFor="color-palette">Color Palette</Label>
                  <Select
                    value={stagingRequest.colorPalette}
                    onValueChange={(value) => updateStagingRequest({ colorPalette: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select color palette" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warm">Warm & Cozy</SelectItem>
                      <SelectItem value="cool">Cool & Calm</SelectItem>
                      <SelectItem value="neutral">Neutral & Timeless</SelectItem>
                      <SelectItem value="bold">Bold & Vibrant</SelectItem>
                      <SelectItem value="pastel">Soft & Pastel</SelectItem>
                      <SelectItem value="earthy">Earthy & Natural</SelectItem>
                      <SelectItem value="monochromatic">Monochromatic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Furniture Density */}
                <div>
                  <Label htmlFor="furniture-density">Furniture Density</Label>
                  <Select
                    value={stagingRequest.furnitureDensity}
                    onValueChange={(value) => updateStagingRequest({ furnitureDensity: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">Minimal & Spacious</SelectItem>
                      <SelectItem value="moderate">Moderate & Balanced</SelectItem>
                      <SelectItem value="luxurious">Luxurious & Full</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Lighting */}
                <div>
                  <Label htmlFor="lighting">Lighting Style</Label>
                  <Select
                    value={stagingRequest.lighting}
                    onValueChange={(value) => updateStagingRequest({ lighting: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select lighting style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="natural">Natural & Bright</SelectItem>
                      <SelectItem value="ambient">Ambient & Cozy</SelectItem>
                      <SelectItem value="dramatic">Dramatic & Mood</SelectItem>
                      <SelectItem value="warm">Warm & Inviting</SelectItem>
                      <SelectItem value="cool">Cool & Modern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Target Market */}
                <div>
                  <Label htmlFor="target-market">Target Market</Label>
                  <Select
                    value={stagingRequest.targetMarket}
                    onValueChange={(value) => updateStagingRequest({ targetMarket: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select target market" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first-time-buyers">First-Time Buyers</SelectItem>
                      <SelectItem value="families">Families</SelectItem>
                      <SelectItem value="professionals">Young Professionals</SelectItem>
                      <SelectItem value="luxury">Luxury Buyers</SelectItem>
                      <SelectItem value="investors">Investors</SelectItem>
                      <SelectItem value="retirees">Retirees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Property Value */}
                <div>
                  <Label htmlFor="property-value">Property Value Range</Label>
                  <Select
                    value={stagingRequest.propertyValue}
                    onValueChange={(value) => updateStagingRequest({ propertyValue: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter Home</SelectItem>
                      <SelectItem value="mid-range">Mid-Range</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Additional Features */}
                <div>
                  <Label>Additional Features</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Fireplace', 'Hardwood Floors', 'Large Windows', 'Vaulted Ceilings', 'Built-ins', 'Outdoor Access', 'Open Concept', 'Natural Light'].map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Switch
                          id={feature}
                          checked={stagingRequest.additionalFeatures.includes(feature)}
                          onCheckedChange={() => toggleFeature(feature)}
                        />
                        <Label htmlFor={feature} className="text-sm">{feature}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep('upload')}>
              Back to Upload
            </Button>
            <Button onClick={generateStaging} disabled={!stagingRequest.roomType || !stagingRequest.style}>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Staging
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="process" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Processing</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12">
              <RefreshCw className="mx-auto h-16 w-16 text-blue-500 mb-4 animate-spin" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                AI is creating your virtual staging
              </h3>
              <p className="text-gray-600">
                This usually takes 2-3 minutes. Please don't close this page.
              </p>
              <div className="mt-6">
                <div className="bg-gray-200 rounded-full h-2 w-full">
                  <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {selectedResult && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Original Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Original Room</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={selectedResult.originalImage}
                    alt="Original room"
                    className="w-full h-auto rounded-lg border"
                  />
                </CardContent>
              </Card>

              {/* Staged Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Staged Room - {selectedResult.style}</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={selectedResult.stagedImage}
                    alt="Staged room"
                    className="w-full h-auto rounded-lg border"
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Style Variations */}
          {stagingResults.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Style Variations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stagingResults.map((result) => (
                    <div
                      key={result.id}
                      className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                        selectedResult?.id === result.id
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedResult(result)}
                    >
                      <img
                        src={result.stagedImage}
                        alt={`${result.style} staging`}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-2 text-center">
                        <p className="text-sm font-medium capitalize">{result.style}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

                     {/* Action Buttons */}
           <div className="flex flex-wrap gap-2 justify-center">
             <Button onClick={() => downloadImage(selectedResult?.stagedImage || '', `staged-${imageName}-${selectedResult?.style}.jpg`)}>
               <Download className="h-4 w-4 mr-2" />
               Download Staged Image
             </Button>
             <Button variant="outline" onClick={handleEmailToSelf}>
               <Mail className="h-4 w-4 mr-2" />
               Email To Self
             </Button>
             <Button variant="outline" onClick={handleEmailToClient}>
               <Mail className="h-4 w-4 mr-2" />
               Email To Someone Else
             </Button>
             <Button onClick={handleSaveToProfile} disabled={isSaving}>
               <Save className="h-4 w-4 mr-2" />
               {isSaving ? 'Saving...' : 'Save to Profile'}
             </Button>
           </div>

           {/* Stage Again/Another Buttons */}
           <div className="flex flex-wrap gap-2 justify-center">
             <Button variant="outline" onClick={() => setCurrentStep('configure')}>
               <RefreshCw className="h-4 w-4 mr-2" />
               Stage Again
             </Button>
             <Button variant="outline" onClick={() => {
               setImageFile(null)
               setImageUrl('')
               setImageName('')
               setStagingResults([])
               setSelectedResult(null)
               setCurrentStep('upload')
             }}>
               <Upload className="h-4 w-4 mr-2" />
               Stage Another
             </Button>
           </div>

          {/* Staging Details */}
          {selectedResult && (
            <Card>
              <CardHeader>
                <CardTitle>Staging Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Configuration</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li><strong>Room:</strong> {stagingRequest.roomType}</li>
                      <li><strong>Style:</strong> {selectedResult.style}</li>
                      <li><strong>Colors:</strong> {stagingRequest.colorPalette}</li>
                      <li><strong>Furniture:</strong> {stagingRequest.furnitureDensity}</li>
                      <li><strong>Lighting:</strong> {stagingRequest.lighting}</li>
                      <li><strong>Market:</strong> {stagingRequest.targetMarket}</li>
                      <li><strong>Value:</strong> {stagingRequest.propertyValue}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Features</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {stagingRequest.additionalFeatures.map((feature) => (
                        <li key={feature}>• {feature}</li>
                      ))}
                      {stagingRequest.additionalFeatures.length === 0 && (
                        <li className="text-gray-400">No additional features selected</li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Staging Description */}
          {selectedResult && (
            <Card>
              <CardHeader>
                <CardTitle>AI Staging Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {selectedResult.prompt}
                  </p>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  <p><strong>Note:</strong> This is the AI-generated staging plan. In the future, this will generate actual staged images.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Email Composition Modal */}
      <EmailCompositionModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        contentType="script"
        scriptContent={emailContent}
        agentName={user?.name || 'Your Name'}
        brokerageName="Your Brokerage"
        attachments={selectedResult?.stagedImage ? {
          imageUrl: selectedResult.stagedImage,
          fileName: `staged-${imageName}-${selectedResult?.style}.jpg`
        } : undefined}
      />

    </div>
  )
}
