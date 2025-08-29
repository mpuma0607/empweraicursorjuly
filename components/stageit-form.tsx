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
  Image as ImageIcon
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
  
  const { user, loading: userLoading } = useMemberSpaceUser()

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setImageFile(file)
      const url = URL.createObjectURL(file)
      setImageUrl(url)
      setImageName(file.name.replace(/\.[^/.]+$/, ''))
      setCurrentStep('configure')
    }
  }

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setImageFile(file)
      const url = URL.createObjectURL(file)
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
        // Call the new API route for staging
        const response = await fetch('/api/stage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageUrl: imageUrl,
            roomType: stagingRequest.roomType,
            style: stagingRequest.style,
            colors: stagingRequest.colorPalette,
            notes: `Furniture density: ${stagingRequest.furnitureDensity}, Lighting: ${stagingRequest.lighting}, Target market: ${stagingRequest.targetMarket}, Property value: ${stagingRequest.propertyValue}, Additional features: ${stagingRequest.additionalFeatures.join(', ')}`,
            size: "2048x2048"
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Staging failed')
        }

        const result = await response.json()
        
        // Create staging results with the generated image
        const clientResults: StagingResult[] = [{
          id: `staging-${Date.now()}-1`,
          originalImage: imageUrl,
          stagedImage: result.dataUrl, // The AI-generated staged image
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
      alert('Failed to generate staging. Please try again.')
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

  // Email to self (Resend)
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

      const response = await fetch('/api/send-support-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: user.email,
          from: 'noreply@marketing.getempowerai.com',
          subject: `StageIT: ${imageName} - ${selectedResult.style}`,
          message: emailContent
        })
      })

      if (response.ok) {
        alert('Email sent to yourself successfully!')
      } else {
        throw new Error('Failed to send email')
      }
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Failed to send email. Please try again.')
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
              <Button onClick={() => document.getElementById('image-upload')?.click()}>
                Choose Image
              </Button>
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
              Email To Client
            </Button>
            <Button onClick={handleSaveToProfile} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save to Profile'}
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
                      contentType="real-img"
        scriptContent={emailContent}
        agentName={user?.name || 'Your Name'}
        brokerageName="Your Brokerage"
      />
    </div>
  )
}
