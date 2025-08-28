import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RealImgForm } from "./real-img-form"

export default function RealImgPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Real-IMG</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create interactive images for real estate marketing. Add hotspots to property photos, floor plans, and neighborhood maps to engage your audience.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📸 Image Upload</CardTitle>
              <CardDescription>Upload property photos, floor plans, or neighborhood maps</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Drag & drop image upload</li>
                <li>• Support for JPG, PNG, WebP</li>
                <li>• High-resolution image processing</li>
                <li>• Automatic image optimization</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🎯 Hotspot Creation</CardTitle>
              <CardDescription>Add interactive hotspots with rich content</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Click & drag hotspot creation</li>
                <li>• Text, links, and media content</li>
                <li>• Customizable hotspot styles</li>
                <li>• Real-time preview</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🚀 Export & Embed</CardTitle>
              <CardDescription>Generate embeddable interactive images</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• HTML embed code</li>
                <li>• React component export</li>
                <li>• Mobile-responsive design</li>
                <li>• Analytics tracking</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">🏠 Interactive Image Creator</CardTitle>
            <CardDescription>
              Transform static images into engaging, interactive experiences for your real estate marketing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RealImgForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
