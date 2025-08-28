"use client"

import React, { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Video
} from "lucide-react"
import { useMemberSpaceUser } from "@/hooks/use-memberspace-user"
import { saveUserCreation } from "@/lib/auto-save-creation"

interface Hotspot {
  id: string
  x: number
  y: number
  width: number
  height: number
  title: string
  content: string
  type: 'text' | 'link' | 'image' | 'video'
  url?: string
  style: {
    backgroundColor: string
    borderColor: string
    textColor: string
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
      setImageName(file.name.replace(/\.[^/.]+$/, '')) // Remove file extension
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
      x: x - 25, // Center the hotspot on click
      y: y - 25,
      width: 50,
      height: 50,
      title: 'New Hotspot',
      content: 'Add your content here',
      type: 'text',
      style: {
        backgroundColor: '#3b82f6',
        borderColor: '#1d4ed8',
        textColor: '#ffffff'
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

  // Generate export code
  const generateExportCode = () => {
    const htmlCode = `
<div class="real-img-interactive" data-image-id="${Date.now()}">
  <div class="real-img-container" style="position: relative; display: inline-block;">
    <img src="${imageUrl}" alt="${imageName}" style="max-width: 100%; height: auto;" />
    ${hotspots.map(hotspot => `
      <div 
        class="real-img-hotspot" 
        data-hotspot-id="${hotspot.id}"
        style="
          position: absolute;
          left: ${hotspot.x}px;
          top: ${hotspot.y}px;
          width: ${hotspot.width}px;
          height: ${hotspot.height}px;
          background-color: ${hotspot.style.backgroundColor};
          border: 2px solid ${hotspot.style.borderColor};
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${hotspot.style.textColor};
          font-weight: bold;
          font-size: 12px;
        "
        title="${hotspot.title}"
        onclick="showHotspotContent('${hotspot.id}')"
      >
        ${hotspot.title.charAt(0).toUpperCase()}
      </div>
    `).join('')}
  </div>
  
  <script>
    function showHotspotContent(hotspotId) {
      const hotspot = ${JSON.stringify(hotspots)}.find(h => h.id === hotspotId);
      if (hotspot) {
        alert(hotspot.content);
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
                        variant={isCreatingHotspot ? "default" : "outline"}
                        size="sm"
                        onClick={() => setIsCreatingHotspot(!isCreatingHotspot)}
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
                    {hotspots.map((hotspot) => (
                      <div
                        key={hotspot.id}
                        className={`absolute border-2 rounded cursor-pointer transition-all ${
                          selectedHotspot?.id === hotspot.id ? 'ring-2 ring-blue-500' : ''
                        }`}
                        style={{
                          left: hotspot.x,
                          top: hotspot.y,
                          width: hotspot.width,
                          height: hotspot.height,
                          backgroundColor: hotspot.style.backgroundColor,
                          borderColor: hotspot.style.borderColor,
                          color: hotspot.style.textColor
                        }}
                        onClick={() => setSelectedHotspot(hotspot)}
                      >
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold">
                          {hotspot.title.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {isCreatingHotspot && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                      Click on the image to place a new hotspot
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
                        <Label htmlFor="hotspot-type">Type</Label>
                        <Select
                          value={selectedHotspot.type}
                          onValueChange={(value) => updateHotspot(selectedHotspot.id, { type: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">
                              <div className="flex items-center gap-2">
                                <Type className="h-4 w-4" />
                                Text
                              </div>
                            </SelectItem>
                            <SelectItem value="link">
                              <div className="flex items-center gap-2">
                                <Link className="h-4 w-4" />
                                Link
                              </div>
                            </SelectItem>
                            <SelectItem value="image">
                              <div className="flex items-center gap-2">
                                <ImageIcon className="h-4 w-4" />
                                Image
                              </div>
                            </SelectItem>
                            <SelectItem value="video">
                              <div className="flex items-center gap-2">
                                <Video className="h-4 w-4" />
                                Video
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="hotspot-content">Content</Label>
                        <Textarea
                          id="hotspot-content"
                          value={selectedHotspot.content}
                          onChange={(e) => updateHotspot(selectedHotspot.id, { content: e.target.value })}
                          rows={3}
                        />
                      </div>
                      
                      {selectedHotspot.type === 'link' && (
                        <div>
                          <Label htmlFor="hotspot-url">URL</Label>
                          <Input
                            id="hotspot-url"
                            value={selectedHotspot.url || ''}
                            onChange={(e) => updateHotspot(selectedHotspot.id, { url: e.target.value })}
                            placeholder="https://..."
                          />
                        </div>
                      )}
                      
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
                            <div className="text-sm text-gray-500">{hotspot.type}</div>
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
            <Button onClick={generateExportCode} disabled={hotspots.length === 0}>
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
                </ol>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep('edit')}>
              Back to Editor
            </Button>
            <Button onClick={handleSaveToProfile} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save to Profile'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
