"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Download, RotateCcw, Maximize2 } from "lucide-react"

interface InteractiveSliderProps {
  originalImage: string
  stagedImage: string
  styleName: string
}

export default function InteractiveSlider({
  originalImage,
  stagedImage,
  styleName
}: InteractiveSliderProps) {
  const [sliderValue, setSliderValue] = useState([50])
  const [isDragging, setIsDragging] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value)
  }

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const resetSlider = () => {
    setSliderValue([50])
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleDownload = () => {
    // In a real implementation, this would download the current view
    console.log('Downloading current view')
  }

  // Calculate the clip path for the reveal effect
  const clipPath = `inset(0 ${100 - sliderValue[0]}% 0 0)`

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold">
            {styleName} vs Original
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Original</span>
            <div className="w-8 h-0.5 bg-gray-300" />
            <span>{styleName}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={resetSlider}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={toggleFullscreen}
          >
            <Maximize2 className="w-4 h-4 mr-1" />
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </Button>
          <Button
            size="sm"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
        </div>
      </div>

      {/* Image Comparison Container */}
      <div 
        ref={containerRef}
        className={`relative overflow-hidden rounded-lg bg-gray-100 ${
          isFullscreen ? 'h-[80vh]' : 'h-96'
        }`}
      >
        {/* Original Image (Background) */}
        <div className="absolute inset-0">
          <img
            src={originalImage}
            alt="Original room"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20" />
        </div>

        {/* Staged Image (Foreground with clip) */}
        <div 
          className="absolute inset-0"
          style={{ clipPath }}
        >
          <img
            src={stagedImage}
            alt={`${styleName} staged room`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Slider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
          style={{ left: `${sliderValue[0]}%` }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-gray-300 flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-400 rounded-full" />
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
          Original
        </div>
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
          {styleName}
        </div>
      </div>

      {/* Slider Control */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Original</span>
          <span>{sliderValue[0]}%</span>
          <span>{styleName}</span>
        </div>
        <Slider
          value={sliderValue}
          onValueChange={handleSliderChange}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-gray-600">
        <p>
          Drag the slider or use the handle above to compare the images. 
          The slider shows the transition between original and staged versions.
        </p>
      </div>
    </div>
  )
}
