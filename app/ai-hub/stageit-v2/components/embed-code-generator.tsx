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
  const [previewMode, setPreviewMode] = useState(false)
  const [generatedCode, setGeneratedCode] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)

  const generateEmbedCode = async () => {
    const { width, height, theme, showLabels, showControls, autoPlay } = widgetConfig
    
    // Convert images to data URLs for embed
    const imageDataUrls: {[key: string]: string} = {}
    
    for (const image of images) {
      if (image.blob) {
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(image.blob!)
        })
        imageDataUrls[image.style] = dataUrl
      }
    }
    
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
            height: ${height}px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            overflow: hidden;
            position: relative;
        }
        
        .image-container {
            position: relative;
            width: 100%;
            height: 70%;
            overflow: hidden;
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
        
        .style-selector {
            position: absolute;
            top: 20px;
            right: 20px;
            z-index: 10;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .style-button {
            padding: 8px 12px;
            background: ${theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)'};
            color: ${theme === 'dark' ? 'white' : 'black'};
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s ease;
            backdrop-filter: blur(10px);
        }
        
        .style-button:hover {
            background: ${theme === 'dark' ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,1)'};
            transform: translateY(-1px);
        }
        
        .style-button.active {
            background: #3b82f6;
            color: white;
        }
        
        .slider-container {
            position: absolute;
            bottom: 20px;
            left: 20px;
            right: 20px;
            z-index: 10;
        }
        
        .slider {
            width: 100%;
            height: 4px;
            background: ${theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'};
            border-radius: 2px;
            outline: none;
            cursor: pointer;
        }
        
        .slider::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            background: #3b82f6;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        
        .slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: #3b82f6;
            border-radius: 50%;
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        
        .labels {
            position: absolute;
            top: 20px;
            left: 20px;
            z-index: 10;
            display: flex;
            gap: 12px;
        }
        
        .label {
            padding: 6px 12px;
            background: ${theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)'};
            color: ${theme === 'dark' ? 'white' : 'black'};
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            backdrop-filter: blur(10px);
        }
        
        @media (max-width: 768px) {
            .staging-widget {
                width: 100%;
                max-width: ${width}px;
            }
            
            .styles-grid {
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 10px;
            }
            
            .style-card {
                padding: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="staging-widget">
        <div class="image-container">
            ${images.map((image, index) => `
                <img 
                    src="${imageDataUrls[image.style] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIFBsYWNlaG9sZGVyPC90ZXh0Pjwvc3ZnPg=='}" 
                    alt="${image.name}" 
                    class="image-layer ${image.isOriginal ? 'original-image' : 'staged-image'}"
                    data-style="${image.style}"
                    ${image.isOriginal ? 'id="original"' : ''}
                />
            `).join('')}
            
            ${showLabels ? `
                <div class="labels">
                    <div class="label" id="original-label">Original</div>
                    <div class="label" id="staged-label">Staged</div>
                </div>
            ` : ''}
            
            <div class="style-selector">
                ${images.filter(img => !img.isOriginal).map((image, index) => `
                    <button 
                        class="style-button ${index === 0 ? 'active' : ''}" 
                        data-style="${image.style}"
                        onclick="selectStyle('${image.style}')"
                    >
                        ${image.name}
                    </button>
                `).join('')}
            </div>
            
            ${showControls ? `
                <div class="slider-container">
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value="0" 
                        class="slider" 
                        id="comparison-slider"
                        oninput="updateComparison(this.value)"
                    />
                </div>
            ` : ''}
        </div>
    </div>

    <script>
        let currentStyle = '${images.find(img => !img.isOriginal)?.style || ''}';
        let originalImage = document.getElementById('original');
        let stagedImage = document.querySelector(\`[data-style="\${currentStyle}"]\`);
        
        function selectStyle(style) {
            // Update active button
            document.querySelectorAll('.style-button').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(\`[data-style="\${style}"]\`).classList.add('active');
            
            // Update staged image
            if (stagedImage) stagedImage.classList.remove('active');
            stagedImage = document.querySelector(\`[data-style="\${style}"]\`);
            if (stagedImage) stagedImage.classList.add('active');
            
            currentStyle = style;
            
            // Update staged label
            const stagedLabel = document.getElementById('staged-label');
            if (stagedLabel) {
                stagedLabel.textContent = style.charAt(0).toUpperCase() + style.slice(1);
            }
        }
        
        function updateComparison(value) {
            if (originalImage && stagedImage) {
                const opacity = value / 100;
                stagedImage.style.opacity = opacity;
            }
        }
        
        // Initialize
        if (stagedImage) {
            stagedImage.classList.add('active');
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

    return htmlCode
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
      'original': '📷'
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
      'original': 'Original Photo'
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
                onClick={() => setPreviewMode(!previewMode)}
                disabled={!generatedCode}
              >
                <Eye className="w-4 h-4 mr-1" />
                {previewMode ? 'Hide' : 'Preview'}
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
          {previewMode ? (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="text-center text-gray-600 mb-4">
                Widget Preview ({widgetConfig.width} × {widgetConfig.height}px)
              </div>
              <div 
                className="mx-auto border rounded-lg overflow-hidden bg-white"
                style={{ 
                  width: Math.min(parseInt(widgetConfig.width), 400),
                  height: Math.min(parseInt(widgetConfig.height), 300)
                }}
              >
                <div className="p-4 text-center">
                  <div className="text-2xl mb-2">🏠</div>
                  <div className="font-semibold">Virtual Staging Widget</div>
                  <div className="text-sm text-gray-600 mt-1">Interactive Preview</div>
                </div>
              </div>
            </div>
          ) : (
            <Textarea
              value={generatedCode || "Click 'Generate Code' to create the embed code..."}
              readOnly
              className="font-mono text-xs h-96 resize-none"
            />
          )}
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