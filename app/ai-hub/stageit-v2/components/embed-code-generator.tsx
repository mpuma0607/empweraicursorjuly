"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Check, Code, Eye, Download, Loader2 } from "lucide-react"

interface StagedImage {
  style: string
  name: string
  url: string
  isOriginal?: boolean
  blob?: Blob
}

interface EmbedCodeGeneratorProps {
  images: StagedImage[]
  roomType: string
}

export default function EmbedCodeGenerator({
  images,
  roomType
}: EmbedCodeGeneratorProps) {
  const [widgetConfig, setWidgetConfig] = useState({
    width: '800',
    height: '600',
    theme: 'light',
    showLabels: true,
    showControls: true,
    autoPlay: false
  })
  const [copied, setCopied] = useState(false)
  const [generatedCode, setGeneratedCode] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)

  const generateEmbedCode = async () => {
    try {
      setIsGenerating(true)
      
      if (!images || images.length === 0) {
        throw new Error('No images available for embed code generation')
      }
      
      const { width, height, theme, showLabels, showControls, autoPlay } = widgetConfig
      
      // Convert images to data URLs for embed
      const imageDataUrls: {[key: string]: string} = {}
      
      for (const image of images) {
        if (image.blob) {
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = () => reject(new Error('Failed to read image blob'))
            reader.readAsDataURL(image.blob!)
          })
          imageDataUrls[image.style] = dataUrl
        } else if (image.url) {
          // Fallback to URL if no blob
          imageDataUrls[image.style] = image.url
        }
      }
      
      if (Object.keys(imageDataUrls).length === 0) {
        throw new Error('No valid images found for embed code generation')
      }
      
      const originalImageDataUrl = imageDataUrls['original'] || images.find(img => img.isOriginal)?.url || ''
      const currentStyle = images.find(img => !img.isOriginal)?.style || 'modern'
      
      const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Virtual Staging - ${roomType}</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
        }
        
        .staging-widget {
            width: ${width}px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .grid {
            display: grid;
        }
        
        .grid-cols-1 {
            grid-template-columns: repeat(1, minmax(0, 1fr));
        }
        
        .lg:grid-cols-2 {
            grid-template-columns: repeat(1, minmax(0, 1fr));
        }
        
        @media (min-width: 1024px) {
            .lg:grid-cols-2 {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
            
            /* Desktop: Step 2 (slider) on left, Step 1 (styles) on right */
            .step-1-card {
                order: 2;
            }
            .step-2-card {
                order: 1;
            }
        }
        
        /* Mobile: Step 1 first, Step 2 second */
        .step-1-card {
            order: 1;
        }
        .step-2-card {
            order: 2;
        }
        
        .gap-6 {
            gap: 1.5rem;
        }
        
        .card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .card-header {
            padding: 1.5rem 1.5rem 0 1.5rem;
        }
        
        .card-content {
            padding: 1.5rem;
        }
        
        .card-title {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.125rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 0.5rem;
        }
        
        .card-description {
            color: #6b7280;
            font-size: 0.875rem;
            margin-bottom: 1rem;
        }
        
        .icon {
            font-size: 1.25rem;
        }
        
        .results-section {
            padding: 24px;
        }
        
        .section-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 16px;
        }
        
        .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
        }
        
        .section-description {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 24px;
        }
        
        .styles-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
        }
        
        .style-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .style-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .style-card.selected {
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
        
        .style-image {
            width: 100%;
            height: 120px;
            object-fit: cover;
            background: #f3f4f6;
        }
        
        .style-content {
            padding: 12px;
        }
        
        .style-name {
            font-weight: 500;
            font-size: 14px;
            color: #1f2937;
            margin-bottom: 8px;
        }
        
        .style-actions {
            display: flex;
            gap: 8px;
        }
        
        .action-button {
            flex: 1;
            padding: 6px 8px;
            border: 1px solid #d1d5db;
            background: white;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
        }
        
        .action-button:hover {
            background: #f9fafb;
            border-color: #9ca3af;
        }
        
        .action-button.primary {
            background: #3b82f6;
            color: white;
            border-color: #3b82f6;
        }
        
        .action-button.primary:hover {
            background: #2563eb;
        }
        
        .comparison-section {
            background: #f9fafb;
            border-radius: 8px;
            padding: 24px;
            margin-top: 24px;
        }
        
        .comparison-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 16px;
        }
        
        .comparison-title {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
        }
        
        .comparison-description {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 20px;
        }
        
        .image-comparison {
            position: relative;
            width: 100%;
            height: 300px;
            border-radius: 8px;
            overflow: hidden;
            background: #f3f4f6;
        }
        
        .image-layer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: opacity 0.3s ease;
        }
        
        .original-image {
            z-index: 1;
        }
        
        .staged-image {
            z-index: 2;
            opacity: 0;
        }
        
        .staged-image.active {
            opacity: 1;
        }
        
        .slider-container {
            margin-top: 20px;
        }
        
        .slider {
            width: 100%;
            height: 6px;
            border-radius: 3px;
            background: #d1d5db;
            outline: none;
            cursor: pointer;
            -webkit-appearance: none;
        }
        
        .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            border: 2px solid white;
        }
        
        .slider::-moz-range-thumb {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        
        /* Mobile-specific slider improvements */
        @media (max-width: 768px) {
            .slider {
                height: 8px;
            }
            
            .slider::-webkit-slider-thumb {
                width: 28px;
                height: 28px;
            }
            
            .slider::-moz-range-thumb {
                width: 28px;
                height: 28px;
            }
        }
        
        .slider-labels {
            display: flex;
            justify-content: space-between;
            margin-top: 8px;
            font-size: 12px;
            color: #6b7280;
        }
        
        @media (max-width: 768px) {
            .staging-widget {
                width: 100%;
                max-width: ${width}px;
            }
            
            .results-section {
                padding: 16px;
            }
            
            .styles-grid {
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 12px;
            }
            
            .style-image {
                height: 100px;
            }
            
            .style-content {
                padding: 8px;
            }
            
            .style-name {
                font-size: 12px;
            }
            
            .action-button {
                font-size: 11px;
                padding: 4px 6px;
            }
            
            .comparison-section {
                padding: 16px;
            }
            
            .image-comparison {
                height: 250px;
            }
        }
    </style>
</head>
<body>
    <div class="staging-widget">
        <!-- Desktop Layout: Slider on Left, Styles on Right -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Mobile: Step 1 First, Desktop: Right Side -->
            <div class="card step-1-card">
                <div class="card-header">
                    <div class="card-title">
                        <span class="icon">🎨</span>
                        Step 1: Select Style
                    </div>
                    <div class="card-description">
                        All 8 styles have been generated. Click "View" on any style to test the slider comparison.
                    </div>
                </div>
                <div class="card-content">
                    <div class="styles-grid">
                        ${images.map(img => `
                            <div class="style-card" data-style="${img.style}">
                                <img class="style-image" src="${imageDataUrls[img.style] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIFBsYWNlaG9sZGVyPC90ZXh0Pjwvc3ZnPg=='}" alt="${img.name}" />
                                <div class="style-content">
                                    <div class="style-name">${img.name}</div>
                                    <div class="style-actions">
                                        <button class="action-button primary" onclick="selectStyle('${img.style}')">
                                            👁️ View
                                        </button>
                                        <button class="action-button" onclick="downloadImage('${img.style}')">
                                            💾 Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- Mobile: Step 2 Second, Desktop: Left Side -->
            <div class="card step-2-card" data-testid="interactive-slider">
                <div class="card-header">
                    <div class="card-title">
                        <span class="icon">👁️</span>
                        Step 2: Play with Slider
                    </div>
                    <div class="card-description" id="slider-description">
                        Select a style from the right to start comparing.
                    </div>
                </div>
                <div class="card-content">
                    <div class="image-comparison">
                        <img id="original" class="image-layer original-image" src="${originalImageDataUrl}" alt="Original" />
                        ${images.filter(img => !img.isOriginal).map(img => 
                            `<img data-style="${img.style}" class="image-layer staged-image" src="${imageDataUrls[img.style]}" alt="${img.name}" />`
                        ).join('')}
                    </div>
                    
                    <div class="slider-container">
                        <input type="range" id="comparison-slider" class="slider" min="0" max="100" value="0" oninput="updateComparison(this.value)" />
                        <div class="slider-labels">
                            <span>Original</span>
                            <span id="staged-label">Select a style</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        let currentStyle = '${currentStyle}';
        let originalImage = document.getElementById('original');
        
        function selectStyle(style) {
            console.log('selectStyle called with:', style);
            
            // Update selected card
            document.querySelectorAll('.style-card').forEach(card => {
                card.classList.remove('selected');
            });
            const selectedCard = document.querySelector('[data-style="' + style + '"]');
            if (selectedCard) {
                selectedCard.classList.add('selected');
            }
            
            // Update staged image - remove active from all staged images first
            document.querySelectorAll('.staged-image').forEach(img => {
                img.classList.remove('active');
            });
            
            // Find and activate the selected staged image
            const stagedImage = document.querySelector('[data-style="' + style + '"]');
            if (stagedImage) {
                stagedImage.classList.add('active');
                console.log('Activated staged image for style:', style);
            } else {
                console.error('Could not find staged image for style:', style);
            }
            
            currentStyle = style;
            
            // Reset slider to show original (0%) when switching styles
            const slider = document.getElementById('comparison-slider');
            if (slider) {
                slider.value = 0;
                updateComparison(0);
            }
            
            // Update staged label and slider description
            const stagedLabel = document.getElementById('staged-label');
            const sliderDescription = document.getElementById('slider-description');
            if (stagedLabel) {
                stagedLabel.textContent = style.charAt(0).toUpperCase() + style.slice(1);
            }
            if (sliderDescription) {
                sliderDescription.textContent = 'Drag the slider to compare the original photo with the ' + style + ' staging.';
            }
        }
        
        function updateComparison(value) {
            const activeStagedImage = document.querySelector('.staged-image.active');
            if (originalImage && activeStagedImage) {
                const opacity = value / 100;
                activeStagedImage.style.opacity = opacity;
            }
        }
        
        function downloadImage(style) {
            const imageDataUrls = {
                ${images.filter(img => !img.isOriginal).map(img => `'${img.style}': '${imageDataUrls[img.style]}'`).join(',\n                ')}
            };
            const imageDataUrl = imageDataUrls[style];
            if (imageDataUrl) {
                const link = document.createElement('a');
                link.href = imageDataUrl;
                link.download = style + '-staged.png';
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.error('No image data found for style:', style);
            }
        }
        
        // Initialize - select first style and activate it
        function initializeWidget() {
            const firstStyle = '${images.find(img => !img.isOriginal)?.style || ''}';
            if (firstStyle) {
                selectStyle(firstStyle);
            }
        }
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeWidget);
        } else {
            initializeWidget();
        }
        
        ${autoPlay ? `
            // Auto-play through styles
            let styleIndex = 0;
            const styles = ${JSON.stringify(images.filter(img => !img.isOriginal).map(img => img.style))};
            
            setInterval(() => {
                styleIndex = (styleIndex + 1) % styles.length;
                selectStyle(styles[styleIndex]);
            }, 3000);
        ` : ''}
    </script>
</body>
</html>`

      setGeneratedCode(htmlCode)
      return htmlCode
    } catch (error) {
      console.error('Error generating embed code:', error)
      setGeneratedCode(`Error generating embed code: ${error instanceof Error ? error.message : 'Unknown error'}`)
      throw error
    } finally {
      setIsGenerating(false)
    }
  }

  const getStyleIcon = (style: string) => {
    const icons: {[key: string]: string} = {
      'modern': '🏢',
      'scandinavian': '🏠',
      'industrial': '🏭',
      'midcentury': '🕰️',
      'luxury': '💎',
      'farmhouse': '🚜',
      'coastal': '🌊',
      'vacant': '🪑'
    }
    return icons[style] || '🏠'
  }

  const getStyleDescription = (style: string) => {
    const descriptions: {[key: string]: string} = {
      'modern': 'Clean & Contemporary',
      'scandinavian': 'Minimal & Cozy',
      'industrial': 'Urban & Raw',
      'midcentury': 'Retro & Bold',
      'luxury': 'Elegant & Rich',
      'farmhouse': 'Rustic & Charming',
      'coastal': 'Nautical & Fresh',
      'vacant': 'Remove Furniture'
    }
    return descriptions[style] || 'Style Preview'
  }

  const generateCode = async () => {
    setIsGenerating(true)
    try {
      const code = await generateEmbedCode()
      setGeneratedCode(code)
    } catch (error) {
      console.error('Error generating code:', error)
      setGeneratedCode('Error generating embed code')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    if (!generatedCode) {
      await generateCode()
      return
    }
    await navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = async () => {
    if (!generatedCode) {
      await generateCode()
      return
    }
    const blob = new Blob([generatedCode], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `staging-widget-${roomType.toLowerCase().replace(' ', '-')}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Widget Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width (px)</Label>
              <Input
                id="width"
                value={widgetConfig.width}
                onChange={(e) => setWidgetConfig(prev => ({ ...prev, width: e.target.value }))}
                type="number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (px)</Label>
              <Input
                id="height"
                value={widgetConfig.height}
                onChange={(e) => setWidgetConfig(prev => ({ ...prev, height: e.target.value }))}
                type="number"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select 
              value={widgetConfig.theme} 
              onValueChange={(value) => setWidgetConfig(prev => ({ ...prev, theme: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={widgetConfig.showLabels}
                onChange={(e) => setWidgetConfig(prev => ({ ...prev, showLabels: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Show Labels</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={widgetConfig.showControls}
                onChange={(e) => setWidgetConfig(prev => ({ ...prev, showControls: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Show Controls</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={widgetConfig.autoPlay}
                onChange={(e) => setWidgetConfig(prev => ({ ...prev, autoPlay: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Auto Play</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Generated Code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Generated HTML Code
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={generateCode}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Code className="w-4 h-4 mr-1" />
                    Generate Code
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownload}
                disabled={!generatedCode}
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
              <Button
                size="sm"
                onClick={handleCopy}
                disabled={copied || !generatedCode}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={generatedCode || "Click 'Generate Code' to create the embed code..."}
            readOnly
            className="font-mono text-xs h-96 resize-none"
          />
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm text-gray-600">
            <h4 className="font-semibold text-gray-900">How to use this widget:</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click "Generate Code" to create the HTML widget</li>
              <li>Copy the generated HTML code</li>
              <li>Paste it into your website's HTML editor or create a new HTML file</li>
              <li>Upload the file to your web server or hosting platform</li>
              <li>The widget will display an interactive style selection interface</li>
            </ol>
            <p className="mt-4 text-xs text-gray-500">
              Note: This is a preview widget that demonstrates the virtual staging concept. 
              The actual staged images would need to be integrated separately.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}