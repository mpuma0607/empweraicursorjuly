import { Metadata } from "next"
import { StageItForm } from "@/components/stageit-form"

export const metadata: Metadata = {
  title: "StageIT - AI Virtual Staging Tool",
  description: "Transform empty rooms into beautifully staged spaces using AI. Upload photos and get professional virtual staging in multiple styles.",
}

export default function StageItPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          StageIT - AI Virtual Staging
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Transform empty rooms into beautifully staged spaces using advanced AI. 
          Upload photos and get professional virtual staging in multiple styles to 
          maximize your property's appeal and value.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="text-3xl mb-4">🎨</div>
          <h3 className="text-lg font-semibold mb-2">Multiple Styles</h3>
          <p className="text-gray-600">
            Choose from coastal, modern, rustic, classic, and more design styles
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="text-3xl mb-4">⚡</div>
          <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
          <p className="text-gray-600">
            Advanced AI technology for realistic and professional staging results
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="text-3xl mb-4">📱</div>
          <h3 className="text-lg font-semibold mb-2">Easy Export</h3>
          <p className="text-gray-600">
            Download high-quality images and share directly to listings
          </p>
        </div>
      </div>

      {/* Main Form */}
      <StageItForm />
    </div>
  )
}
