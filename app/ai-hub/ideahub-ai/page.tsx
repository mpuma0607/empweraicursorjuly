import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Lightbulb } from "lucide-react"
import IdeaHubForm from "./idea-hub-form"

export default function IdeaHubAIPage() {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Brain className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">IdeaHub AI</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Your AI-powered content creation assistant. Generate engaging social media posts, blog articles, and
            marketing copy tailored for real estate professionals.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <Lightbulb className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <CardTitle className="text-black">Creative Ideas</CardTitle>
              <CardDescription>Generate unlimited content ideas for your marketing campaigns</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 text-green-500 mx-auto mb-4"
              >
                <path d="M12 2v8" />
                <path d="m4.93 10.93 1.41 1.41" />
                <path d="M2 18h2" />
                <path d="M20 18h2" />
                <path d="m19.07 10.93-1.41 1.41" />
                <path d="M22 22H2" />
                <path d="M16 6a4 4 0 0 0-8 0" />
                <path d="M16 18a4 4 0 0 0-8 0" />
              </svg>
              <CardTitle className="text-black">Instant Results</CardTitle>
              <CardDescription>Get professional content in seconds, not hours</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 text-purple-500 mx-auto mb-4"
              >
                <rect width="18" height="10" x="3" y="11" rx="2" />
                <circle cx="12" cy="5" r="2" />
                <path d="M12 7v4" />
                <line x1="8" x2="16" y1="16" y2="16" />
              </svg>
              <CardTitle className="text-black">Share Anywhere</CardTitle>
              <CardDescription>Easily share your content across social platforms</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Tool Interface */}
        <Card className="max-w-4xl mx-auto border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-black text-center">Content Creation Tool</CardTitle>
            <CardDescription className="text-center">
              Generate professional social media content powered by AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IdeaHubForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
