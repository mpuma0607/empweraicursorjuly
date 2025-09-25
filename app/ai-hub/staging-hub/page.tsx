"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageIcon, CodeIcon, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function StagingHubPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Virtual Staging Hub</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect staging solution for your needs. Stage individual images or create interactive staging experiences for your website.
            </p>
          </div>

          {/* Staging Options */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* StageIT - Single Image */}
            <Card className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ImageIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">StageIT</CardTitle>
                </div>
                <p className="text-gray-600">Stage a single image</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Perfect for staging individual property photos. Upload one image and get professionally staged results in your preferred style.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Upload single property photos</li>
                  <li>• Choose from 8 different staging styles</li>
                  <li>• Download high-quality staged images</li>
                  <li>• Perfect for MLS listings and marketing</li>
                </ul>
                <Link href="/ai-hub/stage-it">
                  <Button className="w-full group-hover:bg-blue-600 transition-colors">
                    Start Staging
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* StageIT Embed - Interactive */}
            <Card className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CodeIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">StageIT Embed</CardTitle>
                </div>
                <p className="text-gray-600">Interactive Virtual Staging</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Create interactive staging experiences for your website. Generate embeddable HTML code with sliders and style switching.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Stage all 8 styles simultaneously</li>
                  <li>• Generate embeddable HTML code</li>
                  <li>• Interactive before/after sliders</li>
                  <li>• Perfect for website integration</li>
                </ul>
                <Link href="/ai-hub/stageit-v2">
                  <Button className="w-full group-hover:bg-green-600 transition-colors">
                    Create Interactive Staging
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <Card className="max-w-4xl mx-auto">
              <CardContent className="py-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Which Option Should I Choose?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Choose StageIT if you need:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Individual staged photos for MLS</li>
                      <li>• Marketing materials and flyers</li>
                      <li>• Social media content</li>
                      <li>• Quick staging of single images</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Choose StageIT Embed if you need:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Interactive staging for your website</li>
                      <li>• Client-facing staging demos</li>
                      <li>• Multiple style comparisons</li>
                      <li>• Embeddable staging widgets</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
