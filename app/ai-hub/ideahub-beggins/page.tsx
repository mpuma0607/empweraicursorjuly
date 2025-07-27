import { Suspense } from "react"
import IdeaHubBegginsForm from "./idea-hub-beggins-form"

export default function IdeaHubBegginsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Content Creation Tool</h1>
          <p className="text-xl text-gray-600">Generate professional social media content powered by AI</p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <IdeaHubBegginsForm />
        </Suspense>
      </div>
    </div>
  )
}
