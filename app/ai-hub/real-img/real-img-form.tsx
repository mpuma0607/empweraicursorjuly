"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
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
  Plus, 
  Trash2, 
  Eye, 
  Download, 
  Copy, 
  Settings,
  Image as ImageIcon,
  Link,
  Type,
  Video,
  Play,
  X,
  Palette,
  Move,
  Zap,
  Mail,
  Save
} from "lucide-react"
import { useMemberSpaceUser } from "@/hooks/use-memberspace-user"
import { saveUserCreation } from "@/lib/auto-save-creation"
import EmailCompositionModal from "@/components/email-composition-modal"

interface Hotspot {
  id: string
  x: number
  y: number
  width: number
  height: number
  title: string
  content: string
  shape: 'square' | 'circle'
  displayType: 'blank' | 'number' | 'icon' | 'first-letter'
  displayIcon: string
  media: {
    image?: string
    video?: string
    link?: string
    linkText?: string
  }
  style: {
    backgroundColor: string
    borderColor: string
    textColor: string
    fontSize: number
    fontWeight: string
    borderRadius: number
    isFlashing: boolean
    flashSpeed: number
    buttonColor: string
  }
}

interface InteractiveImage {
  id: string
  name: string
  imageUrl: string
  hotspots: Hotspot[]
  createdAt: string
}

export function RealImgForm() {
  const [currentStep, setCurrentStep] = useState<'upload' | 'edit' | 'export'>('upload')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [imageName, setImageName] = useState('')
  const [hotspots, setHotspots] = useState<Hotspot[]>([])
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null)
  const [isCreatingHotspot, setIsCreatingHotspot] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [exportCode, setExportCode] = useState('')
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [previewHotspot, setPreviewHotspot] = useState<Hotspot | null>(null)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [emailContent, setEmailContent] = useState('')
  const [draggedHotspot, setDraggedHotspot] = useState<Hotspot | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  
  const { user, loading: userLoading } = useMemberSpaceUser()
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setImageFile(file)
      const url = URL.createObjectURL(file)
      setImageUrl(url)
      setImageName(file.name.replace(/\.[^/.]+$/, ''))
      setCurrentStep('edit')
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
      setCurrentStep('edit')
    }
  }, [])

  // Create new hotspot
  const createHotspot = (x: number, y: number) => {
    const newHotspot: Hotspot = {
      id: `hotspot-${Date.now()}`,
      x: x - 25,
      y: y - 25,
      width: 50,
      height: 50,
      title: 'New Hotspot',
      content: 'Add your content here',
      shape: 'square',
      displayType: 'blank',
      displayIcon: '',
      media: {},
              style: {
          backgroundColor: '#3b82f6',
          borderColor: '#1d4ed8',
          textColor: '#ffffff',
          fontSize: 12,
          fontWeight: 'bold',
          borderRadius: 4,
          isFlashing: false,
          flashSpeed: 1000,
          buttonColor: '#3b82f6'
        }
    }
    setHotspots([...hotspots, newHotspot])
    setSelectedHotspot(newHotspot)
    setIsCreatingHotspot(false)
  }

  // Handle image click for hotspot creation
  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isCreatingHotspot) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    createHotspot(x, y)
  }

  // Update hotspot
  const updateHotspot = (id: string, updates: Partial<Hotspot>) => {
    setHotspots(hotspots.map(h => h.id === id ? { ...h, ...updates } : h))
    if (selectedHotspot?.id === id) {
      setSelectedHotspot({ ...selectedHotspot, ...updates })
    }
  }

  // Delete hotspot
  const deleteHotspot = (id: string) => {
    setHotspots(hotspots.filter(h => h.id !== id))
    if (selectedHotspot?.id === id) {
      setSelectedHotspot(null)
    }
  }

  // Handle media uploads
  const handleMediaUpload = (type: 'image' | 'video', file: File) => {
    if (!selectedHotspot) return
    
    const url = URL.createObjectURL(file)
    const mediaKey = type === 'image' ? 'image' : 'video'
    
    updateHotspot(selectedHotspot.id, {
      media: { ...selectedHotspot.media, [mediaKey]: url }
    })
  }

  // Remove media
  const removeMedia = (type: 'image' | 'video') => {
    if (!selectedHotspot) return
    
    const newMedia = { ...selectedHotspot.media }
    delete newMedia[type]
    
    updateHotspot(selectedHotspot.id, { media: newMedia })
  }

  // Handle hotspot click in preview mode
  const handleHotspotClick = (hotspot: Hotspot) => {
    if (isPreviewMode) {
      setPreviewHotspot(hotspot)
    } else {
      setSelectedHotspot(hotspot)
    }
  }

  // Handle hotspot drag start
  const handleHotspotMouseDown = (e: React.MouseEvent, hotspot: Hotspot) => {
    if (isPreviewMode || isCreatingHotspot) return
    
    e.preventDefault()
    e.stopPropagation()
    
    const rect = e.currentTarget.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top
    
    setDraggedHotspot(hotspot)
    setDragOffset({ x: offsetX, y: offsetY })
  }

  // Handle mouse move for dragging
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggedHotspot || !canvasRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const newX = e.clientX - rect.left - dragOffset.x
    const newY = e.clientY - rect.top - dragOffset.y
    
    // Ensure hotspot stays within image bounds
    const maxX = rect.width - draggedHotspot.width
    const maxY = rect.height - draggedHotspot.height
    
    const clampedX = Math.max(0, Math.min(newX, maxX))
    const clampedY = Math.max(0, Math.min(newY, maxY))
    
    updateHotspot(draggedHotspot.id, { x: clampedX, y: clampedY })
  }, [draggedHotspot, dragOffset])

  // Handle mouse up to stop dragging
  const handleMouseUp = useCallback(() => {
    setDraggedHotspot(null)
  }, [])

  // Add/remove mouse event listeners
  useEffect(() => {
    if (draggedHotspot) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [draggedHotspot, handleMouseMove, handleMouseUp])

    // Generate export code
  const generateExportCode = async () => {
    // Convert image to base64 for embedding
    let base64Image = ''
    if (imageFile) {
      try {
        const arrayBuffer = await imageFile.arrayBuffer()
        const bytes = new Uint8Array(arrayBuffer)
        let binary = ''
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        const mimeType = imageFile.type
        base64Image = `data:${mimeType};base64,${btoa(binary)}`
      } catch (error) {
        console.error('Error converting image to base64:', error)
        // Fallback to original URL if conversion fails
        base64Image = imageUrl
      }
    } else {
      base64Image = imageUrl
    }

    // Convert hotspot media files to base64
    const hotspotsWithBase64Media = await Promise.all(
      hotspots.map(async (hotspot) => {
        const media = { ...hotspot.media }
        
        // Convert image media to base64
        if (media.image && media.image.startsWith('blob:')) {
          try {
            const response = await fetch(media.image)
            const blob = await response.blob()
            const arrayBuffer = await blob.arrayBuffer()
            const bytes = new Uint8Array(arrayBuffer)
            let binary = ''
            for (let i = 0; i < bytes.byteLength; i++) {
              binary += String.fromCharCode(bytes[i])
            }
            const mimeType = blob.type
            media.image = `data:${mimeType};base64,${btoa(binary)}`
          } catch (error) {
            console.error('Error converting hotspot image to base64:', error)
            // Remove the image if conversion fails
            media.image = undefined
          }
        }
        
        // Convert video media to base64
        if (media.video && media.video.startsWith('blob:')) {
          try {
            const response = await fetch(media.video)
            const blob = await response.blob()
            const arrayBuffer = await blob.arrayBuffer()
            const bytes = new Uint8Array(arrayBuffer)
            let binary = ''
            for (let i = 0; i < bytes.byteLength; i++) {
              binary += String.fromCharCode(bytes[i])
            }
            const mimeType = blob.type
            media.video = `data:${mimeType};base64,${btoa(binary)}`
          } catch (error) {
            console.error('Error converting hotspot video to base64:', error)
            // Remove the video if conversion fails
            media.video = undefined
          }
        }
        
        return { ...hotspot, media }
      })
    )

    // Get image dimensions for percentage-based positioning
    const img = new Image()
    img.src = imageUrl
    await new Promise((resolve) => {
      img.onload = resolve
    })
    
    const imageWidth = img.naturalWidth
    const imageHeight = img.naturalHeight

    // Get the displayed image dimensions from the DOM
    const displayedImage = imageRef.current
    const displayedWidth = displayedImage?.offsetWidth || imageWidth
    const displayedHeight = displayedImage?.offsetHeight || imageHeight

    const htmlCode = `
 <div class="real-img-interactive" data-image-id="${Date.now()}">
   <div class="real-img-container" style="position: relative; display: inline-block;">
     <img src="${base64Image}" alt="${imageName}" style="max-width: 100%; height: auto;" />
                   ${hotspotsWithBase64Media.map(hotspot => {
        // Convert pixel positions to percentages based on displayed image size
        const leftPercent = (hotspot.x / displayedWidth) * 100
        const topPercent = (hotspot.y / displayedHeight) * 100
        const widthPercent = (hotspot.width / displayedWidth) * 100
        const heightPercent = (hotspot.height / displayedHeight) * 100
       
       return `
       <div 
         class="real-img-hotspot ${hotspot.style.isFlashing ? 'flashing' : ''}" 
         data-hotspot-id="${hotspot.id}"
         style="
           position: absolute;
           left: ${leftPercent.toFixed(2)}%;
           top: ${topPercent.toFixed(2)}%;
           width: ${widthPercent.toFixed(2)}%;
           height: ${heightPercent.toFixed(2)}%;
           background-color: ${hotspot.style.backgroundColor};
           border: 2px solid ${hotspot.style.borderColor};
           border-radius: ${hotspot.shape === 'circle' ? '50%' : hotspot.style.borderRadius + 'px'};
           cursor: pointer;
           display: flex;
           align-items: center;
           justify-content: center;
           color: ${hotspot.style.textColor};
           font-weight: ${hotspot.style.fontWeight};
           font-size: ${hotspot.style.fontSize}px;
           transition: all 0.2s ease;
         "
         title="${hotspot.title}"
         onclick="showHotspotContent('${hotspot.id}')"
       >
                  ${hotspot.displayType === 'blank' ? '' :
           hotspot.displayType === 'number' ? (hotspots.indexOf(hotspot) + '') :
           hotspot.displayType === 'icon' ? hotspot.displayIcon :
           hotspot.title.charAt(0).toUpperCase()}
       </div>
     `
     }).join('')}
  </div>
  
     <style>
     .flashing {
       animation: flash ${hotspots.find(h => h.style.isFlashing)?.style.flashSpeed || 1000}ms infinite;
     }
     @keyframes flash {
       0%, 50% { opacity: 1; }
       51%, 100% { opacity: 0.5; }
     }
           .real-img-hotspot {
        transition: all 0.2s ease;
        /* Ensure hotspots scale with the image */
        transform-origin: center;
      }
      .real-img-hotspot:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      }
             /* Make sure the container scales properly */
       .real-img-container {
         max-width: 100%;
         height: auto;
         position: relative;
       }
       .real-img-container img {
         width: 100%;
         height: auto;
         display: block;
       }
       /* Ensure hotspots scale proportionally */
       .real-img-hotspot {
         position: absolute;
         transform-origin: top left;
       }
   </style>
  
  <script>
    function showHotspotContent(hotspotId) {
      const hotspot = ${JSON.stringify(hotspotsWithBase64Media)}.find(h => h.id === hotspotId);
      if (hotspot) {
        let content = '<div style="max-width: 500px; padding: 30px; background: white; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); position: relative;">';
        
        // Add close button
        content += '<button onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 15px; right: 15px; background: #f3f4f6; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; color: #6b7280;">×</button>';
        
        if (hotspot.media.image) {
          content += '<img src="' + hotspot.media.image + '" style="max-width: 100%; height: 200px; object-fit: cover; margin-bottom: 20px; border-radius: 8px; display: block;" />';
        }
        
        if (hotspot.media.video) {
          content += '<video controls style="max-width: 100%; height: 200px; object-fit: cover; margin-bottom: 20px; border-radius: 8px;"><source src="' + hotspot.media.video + '" type="video/mp4">Your browser does not support the video tag.</video>';
        }
        
        content += '<h3 style="margin: 0 0 15px 0; color: #111827; font-size: 24px; font-weight: 600;">' + hotspot.title + '</h3>';
        content += '<p style="margin: 0 0 20px 0; line-height: 1.6; color: #4b5563; font-size: 16px;">' + hotspot.content + '</p>';
        
        if (hotspot.media.link) {
          content += '<a href="' + hotspot.media.link + '" target="_blank" style="display: inline-block; background: ' + hotspot.style.buttonColor + '; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; transition: opacity 0.2s;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1">' + (hotspot.media.linkText || 'Learn More') + '</a>';
        }
        
        content += '</div>';
        
        // Create modal with proper styling
        const modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;';
        modal.innerHTML = content;
        modal.onclick = (e) => {
          if (e.target === modal) {
            document.body.removeChild(modal);
          }
        };
        document.body.appendChild(modal);
      }
    }
  </script>
</div>`

    setExportCode(htmlCode)
    setCurrentStep('export')
  }

  // Save to profile
  const handleSaveToProfile = async () => {
    if (!user || !imageUrl) return
    
    setIsSaving(true)
    try {
      const title = `Interactive Image - ${imageName}`
      await saveUserCreation({
        userId: user.id.toString(),
        userEmail: user.email,
        toolType: 'real-img',
        title,
        content: JSON.stringify({ hotspots, imageName }),
        formData: {
          imageName,
          hotspotCount: hotspots.length,
          imageUrl
        },
        metadata: {
          imageUrl,
          hotspotCount: hotspots.length,
          createdAt: new Date().toISOString()
        }
      })
      alert('Interactive image saved to your profile successfully!')
    } catch (error) {
      console.error('Error saving to profile:', error)
      alert('Failed to save to profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Email to self (Resend)
  const handleEmailToSelf = async () => {
    if (!user || !imageUrl) return
    
    try {
      const emailContent = `
Interactive Image: ${imageName}

Image URL: ${imageUrl}
Hotspots: ${hotspots.length}

${hotspots.map(hotspot => `
${hotspot.title}:
- Content: ${hotspot.content}
- Media: ${hotspot.media.image ? 'Image ✓' : ''} ${hotspot.media.video ? 'Video ✓' : ''} ${hotspot.media.link ? 'Link ✓' : ''}
- Style: ${hotspot.shape}, ${hotspot.style.backgroundColor}, ${hotspot.style.isFlashing ? 'Flashing' : 'Static'}
`).join('')}

Generated on: ${new Date().toLocaleDateString()}
      `.trim()

      const response = await fetch('/api/send-support-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: user.email,
          from: 'noreply@marketing.getempowerai.com',
          subject: `Real-IMG: ${imageName}`,
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
    if (!imageUrl || hotspots.length === 0) return
    
    const emailContent = `
Interactive Image: ${imageName}

I've created an interactive image with ${hotspots.length} hotspots for you to review.

${hotspots.map(hotspot => `
• ${hotspot.title}: ${hotspot.content}
`).join('')}

You can view the full interactive experience by clicking on the hotspots in the image.

Best regards,
${user?.name || 'Your Name'}
    `.trim()

    setEmailContent(emailContent)
    setIsEmailModalOpen(true)
  }

  // Copy export code
  const copyExportCode = () => {
    navigator.clipboard.writeText(exportCode)
    alert('Export code copied to clipboard!')
  }

  if (userLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <Tabs value={currentStep} onValueChange={(value) => setCurrentStep(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">1. Upload Image</TabsTrigger>
          <TabsTrigger value="edit" disabled={!imageUrl}>2. Add Hotspots</TabsTrigger>
          <TabsTrigger value="export" disabled={!imageUrl || hotspots.length === 0}>3. Export</TabsTrigger>
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
                Upload your image
              </h3>
              <p className="text-gray-500 mb-4">
                Drag and drop an image here, or click to select
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

        <TabsContent value="edit" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Image Editor */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Image Editor</span>
                    <div className="flex gap-2">
                      <Button
                        variant={isPreviewMode ? "default" : "outline"}
                        size="sm"
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {isPreviewMode ? 'Exit Preview' : 'Preview Mode'}
                      </Button>
                      <Button
                        variant={isCreatingHotspot ? "default" : "outline"}
                        size="sm"
                        onClick={() => setIsCreatingHotspot(!isCreatingHotspot)}
                        disabled={isPreviewMode}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {isCreatingHotspot ? 'Cancel' : 'Add Hotspot'}
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative inline-block" ref={canvasRef}>
                    <img
                      ref={imageRef}
                      src={imageUrl}
                      alt={imageName}
                      className="max-w-full h-auto cursor-crosshair"
                      onClick={handleImageClick}
                      style={{ cursor: isCreatingHotspot ? 'crosshair' : 'default' }}
                    />
                    
                                         {/* Render hotspots */}
                     {hotspots.map((hotspot, index) => (
                       <div
                         key={hotspot.id}
                         className={`absolute border-2 cursor-pointer transition-all ${
                           selectedHotspot?.id === hotspot.id ? 'ring-2 ring-blue-500' : ''
                         } ${hotspot.style.isFlashing ? 'animate-pulse' : ''} ${
                           draggedHotspot?.id === hotspot.id ? 'z-10' : ''
                         }`}
                         style={{
                           left: hotspot.x,
                           top: hotspot.y,
                           width: hotspot.width,
                           height: hotspot.height,
                           backgroundColor: hotspot.style.backgroundColor,
                           borderColor: hotspot.style.borderColor,
                           color: hotspot.style.textColor,
                           fontSize: hotspot.style.fontSize,
                           fontWeight: hotspot.style.fontWeight,
                           borderRadius: hotspot.shape === 'circle' ? '50%' : hotspot.style.borderRadius,
                           cursor: isPreviewMode ? 'pointer' : 'grab'
                         }}
                         onClick={() => handleHotspotClick(hotspot)}
                         onMouseDown={(e) => handleHotspotMouseDown(e, hotspot)}
                       >
                         <div className="w-full h-full flex items-center justify-center text-xs font-bold">
                           {hotspot.displayType === 'blank' ? '' :
                            hotspot.displayType === 'number' ? (index + 1).toString() :
                            hotspot.displayType === 'icon' ? hotspot.displayIcon :
                            hotspot.title.charAt(0).toUpperCase()}
                         </div>
                       </div>
                     ))}
                  </div>
                  
                                     {isCreatingHotspot && (
                     <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                       Click on the image to place a new hotspot
                     </div>
                   )}
                   
                   {!isPreviewMode && !isCreatingHotspot && hotspots.length > 0 && (
                     <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                       💡 Tip: Drag hotspots to move them around the image
                     </div>
                   )}
                   
                   {isPreviewMode && (
                     <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                       Preview Mode: Click hotspots to see how they'll appear to users
                     </div>
                   )}
                </CardContent>
              </Card>
            </div>

            {/* Hotspot Editor */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Hotspot Editor</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedHotspot ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="hotspot-title">Title</Label>
                        <Input
                          id="hotspot-title"
                          value={selectedHotspot.title}
                          onChange={(e) => updateHotspot(selectedHotspot.id, { title: e.target.value })}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="hotspot-content">Content</Label>
                        <Textarea
                          id="hotspot-content"
                          value={selectedHotspot.content}
                          onChange={(e) => updateHotspot(selectedHotspot.id, { content: e.target.value })}
                          rows={3}
                          placeholder="Describe what users will see when they click this hotspot..."
                        />
                      </div>
                      
                      {/* Shape Selection */}
                      <div>
                        <Label htmlFor="hotspot-shape">Shape</Label>
                        <Select
                          value={selectedHotspot.shape}
                          onValueChange={(value) => updateHotspot(selectedHotspot.id, { shape: value as 'square' | 'circle' })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="square">Square</SelectItem>
                            <SelectItem value="circle">Circle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Display Type Selection */}
                      <div>
                        <Label htmlFor="hotspot-display-type">Display Type</Label>
                        <Select
                          value={selectedHotspot.displayType}
                          onValueChange={(value) => updateHotspot(selectedHotspot.id, { displayType: value as 'blank' | 'number' | 'icon' | 'first-letter' })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blank">Blank</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="icon">Icon</SelectItem>
                            <SelectItem value="first-letter">First Letter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                                             {/* Display Icon Selection (if icon is selected) */}
                       {selectedHotspot.displayType === 'icon' && (
                         <div>
                           <Label htmlFor="hotspot-display-icon">Icon</Label>
                           <div className="grid grid-cols-6 gap-2 p-2 border rounded bg-gray-50">
                             {['🏠', '📸', '🎥', '🔗', '📄', '💡', '⭐', '❤️', '🔥', '✨', '💎', '🌺', '🚗', '✈️', '🏖️', '🎯', '💼', '🎨', '🎭', '🎪', '🎨', '🎬', '🎵', '🎮'].map((icon) => (
                               <button
                                 key={icon}
                                 type="button"
                                 className={`w-8 h-8 text-lg border rounded hover:bg-white transition-colors ${
                                   selectedHotspot.displayIcon === icon ? 'bg-blue-100 border-blue-300' : 'bg-white border-gray-200'
                                 }`}
                                 onClick={() => updateHotspot(selectedHotspot.id, { displayIcon: icon })}
                                 title={icon}
                               >
                                 {icon}
                               </button>
                             ))}
                           </div>
                           <p className="text-xs text-gray-500 mt-1">Click an icon to select it</p>
                         </div>
                       )}
                      
                      {/* Media Section */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Media</Label>
                        
                        {/* Image Upload */}
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">Image</Label>
                          {selectedHotspot.media.image ? (
                            <div className="relative">
                              <img 
                                src={selectedHotspot.media.image} 
                                alt="Hotspot image" 
                                className="w-full h-20 object-cover rounded border"
                              />
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 h-6 w-6 p-0"
                                onClick={() => removeMedia('image')}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded p-2 text-center">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleMediaUpload('image', e.target.files[0])}
                                className="hidden"
                                id="hotspot-image-upload"
                              />
                              <label htmlFor="hotspot-image-upload" className="cursor-pointer">
                                <ImageIcon className="h-4 w-4 mx-auto mb-1 text-gray-400" />
                                <span className="text-xs text-gray-500">Add Image</span>
                              </label>
                            </div>
                          )}
                        </div>
                        
                        {/* Video Upload */}
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">Video</Label>
                          {selectedHotspot.media.video ? (
                            <div className="relative">
                              <video 
                                src={selectedHotspot.media.video} 
                                className="w-full h-20 object-cover rounded border"
                                controls
                              />
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 h-6 w-6 p-0"
                                onClick={() => removeMedia('video')}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded p-2 text-center">
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => e.target.files?.[0] && handleMediaUpload('video', e.target.files[0])}
                                className="hidden"
                                id="hotspot-video-upload"
                              />
                              <label htmlFor="hotspot-video-upload" className="cursor-pointer">
                                <Video className="h-4 w-4 mx-auto mb-1 text-gray-400" />
                                <span className="text-xs text-gray-500">Add Video</span>
                              </label>
                            </div>
                          )}
                        </div>
                        
                        {/* Link */}
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">Link</Label>
                          <Input
                            placeholder="https://..."
                            value={selectedHotspot.media.link || ''}
                            onChange={(e) => updateHotspot(selectedHotspot.id, { 
                              media: { ...selectedHotspot.media, link: e.target.value }
                            })}
                          />
                          <Input
                            placeholder="Link text (e.g., 'Learn More')"
                            value={selectedHotspot.media.linkText || ''}
                            onChange={(e) => updateHotspot(selectedHotspot.id, { 
                              media: { ...selectedHotspot.media, linkText: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                      
                      {/* Style Section */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Style</Label>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs text-gray-600">Width</Label>
                            <Input
                              type="number"
                              value={selectedHotspot.width}
                              onChange={(e) => updateHotspot(selectedHotspot.id, { width: parseInt(e.target.value) || 50 })}
                              min="20"
                              max="200"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600">Height</Label>
                            <Input
                              type="number"
                              value={selectedHotspot.height}
                              onChange={(e) => updateHotspot(selectedHotspot.id, { height: parseInt(e.target.value) || 50 })}
                              min="20"
                              max="200"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-xs text-gray-600">Background Color</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={selectedHotspot.style.backgroundColor}
                              onChange={(e) => updateHotspot(selectedHotspot.id, { 
                                style: { ...selectedHotspot.style, backgroundColor: e.target.value }
                              })}
                              className="w-12 h-8 p-1"
                            />
                            <Input
                              value={selectedHotspot.style.backgroundColor}
                              onChange={(e) => updateHotspot(selectedHotspot.id, { 
                                style: { ...selectedHotspot.style, backgroundColor: e.target.value }
                              })}
                              className="flex-1"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-xs text-gray-600">Border Color</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={selectedHotspot.style.borderColor}
                              onChange={(e) => updateHotspot(selectedHotspot.id, { 
                                style: { ...selectedHotspot.style, borderColor: e.target.value }
                              })}
                              className="w-12 h-8 p-1"
                            />
                            <Input
                              value={selectedHotspot.style.borderColor}
                              onChange={(e) => updateHotspot(selectedHotspot.id, { 
                                style: { ...selectedHotspot.style, borderColor: e.target.value }
                              })}
                              className="flex-1"
                            />
                          </div>
                        </div>
                        
                                                 <div>
                           <Label className="text-xs text-gray-600">Text Color</Label>
                           <div className="flex gap-2">
                             <Input
                               type="color"
                               value={selectedHotspot.style.textColor}
                               onChange={(e) => updateHotspot(selectedHotspot.id, { 
                                 style: { ...selectedHotspot.style, textColor: e.target.value }
                               })}
                               className="w-12 h-8 p-1"
                             />
                             <Input
                               value={selectedHotspot.style.textColor}
                               onChange={(e) => updateHotspot(selectedHotspot.id, { 
                                 style: { ...selectedHotspot.style, textColor: e.target.value }
                               })}
                               className="flex-1"
                             />
                           </div>
                         </div>
                         
                         <div>
                           <Label className="text-xs text-gray-600">Button Color (for links)</Label>
                           <div className="flex gap-2">
                             <Input
                               type="color"
                               value={selectedHotspot.style.buttonColor}
                               onChange={(e) => updateHotspot(selectedHotspot.id, { 
                                 style: { ...selectedHotspot.style, buttonColor: e.target.value }
                               })}
                               className="w-12 h-8 p-1"
                             />
                             <Input
                               value={selectedHotspot.style.buttonColor}
                               onChange={(e) => updateHotspot(selectedHotspot.id, { 
                                 style: { ...selectedHotspot.style, buttonColor: e.target.value }
                               })}
                               className="flex-1"
                             />
                           </div>
                         </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs text-gray-600">Font Size</Label>
                            <Input
                              type="number"
                              value={selectedHotspot.style.fontSize}
                              onChange={(e) => updateHotspot(selectedHotspot.id, { 
                                style: { ...selectedHotspot.style, fontSize: parseInt(e.target.value) || 12 }
                              })}
                              min="8"
                              max="24"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600">Border Radius</Label>
                            <Input
                              type="number"
                              value={selectedHotspot.style.borderRadius}
                              onChange={(e) => updateHotspot(selectedHotspot.id, { 
                                style: { ...selectedHotspot.style, borderRadius: parseInt(e.target.value) || 4 }
                              })}
                              min="0"
                              max="50"
                              disabled={selectedHotspot.shape === 'circle'}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-xs text-gray-600">Font Weight</Label>
                          <Select
                            value={selectedHotspot.style.fontWeight}
                            onValueChange={(value) => updateHotspot(selectedHotspot.id, { 
                              style: { ...selectedHotspot.style, fontWeight: value }
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="bold">Bold</SelectItem>
                              <SelectItem value="bolder">Bolder</SelectItem>
                              <SelectItem value="lighter">Lighter</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Flashing Animation</Label>
                          <Switch
                            checked={selectedHotspot.style.isFlashing}
                            onCheckedChange={(checked) => updateHotspot(selectedHotspot.id, { 
                              style: { ...selectedHotspot.style, isFlashing: checked }
                            })}
                          />
                        </div>
                        
                        {selectedHotspot.style.isFlashing && (
                          <div>
                            <Label className="text-xs text-gray-600">Flash Speed (ms)</Label>
                            <Input
                              type="number"
                              value={selectedHotspot.style.flashSpeed}
                              onChange={(e) => updateHotspot(selectedHotspot.id, { 
                                style: { ...selectedHotspot.style, flashSpeed: parseInt(e.target.value) || 1000 }
                              })}
                              min="200"
                              max="3000"
                              step="100"
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteHotspot(selectedHotspot.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      Select a hotspot to edit its properties
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hotspots ({hotspots.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {hotspots.map((hotspot) => (
                      <div
                        key={hotspot.id}
                        className={`p-3 border rounded cursor-pointer transition-colors ${
                          selectedHotspot?.id === hotspot.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedHotspot(hotspot)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{hotspot.title}</div>
                            <div className="text-sm text-gray-500">
                              <span className="capitalize">{hotspot.shape}</span>
                              {hotspot.media.image && <ImageIcon className="inline h-3 w-3 ml-2 mr-1" />}
                              {hotspot.media.video && <Video className="inline h-3 w-3 ml-2 mr-1" />}
                              {hotspot.media.link && <Link className="inline h-3 w-3 ml-2 mr-1" />}
                              {hotspot.style.isFlashing && <Zap className="inline h-3 w-3 ml-2 mr-1 text-yellow-500" />}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteHotspot(hotspot.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {hotspots.length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                      No hotspots created yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep('upload')}>
              Back to Upload
            </Button>
                         <Button onClick={() => generateExportCode()} disabled={hotspots.length === 0}>
               Generate Export Code
             </Button>
          </div>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Your Interactive Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="export-code">HTML Embed Code</Label>
                <Textarea
                  id="export-code"
                  value={exportCode}
                  readOnly
                  rows={15}
                  className="font-mono text-sm"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={copyExportCode}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
                </Button>
                <Button variant="outline" onClick={() => setCurrentStep('edit')}>
                  Back to Editor
                </Button>
              </div>
              
                             <div className="p-4 bg-gray-50 rounded border">
                 <h4 className="font-medium mb-2">How to use:</h4>
                 <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                   <li>Copy the HTML code above</li>
                   <li>Paste it into your website's HTML</li>
                   <li>The interactive image will appear with clickable hotspots</li>
                   <li>Click hotspots to see the content you added</li>
                   <li>Flashing animations and hover effects will work in the exported version</li>
                 </ol>
                                   <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                    <strong>Note:</strong> The exported HTML includes the image and all hotspot media (images, videos) as base64 data, so it will work anywhere you embed it, even offline! Hotspots are now positioned using percentages based on the displayed image size, ensuring perfect alignment regardless of container dimensions. All media content is embedded directly in the HTML for complete portability.
                  </div>
               </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep('edit')}>
              Back to Editor
            </Button>
            <div className="flex gap-2">
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
          </div>
        </TabsContent>
      </Tabs>

      {/* Preview Modal */}
      {previewHotspot && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewHotspot(null)}
        >
          <div 
            className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              {/* Close button */}
              <button
                onClick={() => setPreviewHotspot(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                ×
              </button>
              
              {previewHotspot.media.image && (
                <img 
                  src={previewHotspot.media.image} 
                  alt="Hotspot preview" 
                  className="w-full h-56 object-cover rounded-lg mb-6 shadow-md"
                />
              )}
              
              {previewHotspot.media.video && (
                <video 
                  src={previewHotspot.media.video} 
                  controls 
                  className="w-full h-56 object-cover rounded-lg mb-6 shadow-md"
                />
              )}
              
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{previewHotspot.title}</h3>
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">{previewHotspot.content}</p>
              
              {previewHotspot.media.link && (
                <a 
                  href={previewHotspot.media.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: previewHotspot.style.buttonColor,
                    color: 'white'
                  }}
                  className="inline-block px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium text-lg shadow-md"
                >
                  {previewHotspot.media.linkText || 'Learn More'}
                </a>
              )}
            </div>
          </div>
        </div>
      )}

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
