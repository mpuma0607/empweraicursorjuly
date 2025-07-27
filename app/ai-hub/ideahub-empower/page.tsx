import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Sparkles, ImageIcon, MessageSquare, Zap, Target } from "lucide-react"
import IdeaHubEmpowerForm from "./idea-hub-empower-form"

export default function IdeaHubEmpowerPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
            <Lightbulb className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            IdeaHub AI
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Generate engaging social media content with AI-powered creativity, custom branding, and professional design
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <Card className="border-yellow-200 hover:border-yellow-400 transition-colors">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-2">
              <Sparkles className="h-6 w-6 text-yellow-600" />
            </div>
            <CardTitle className="text-lg">AI Content Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              Create compelling social media posts, emails, and blog content with advanced AI that understands real
              estate
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-blue-200 hover:border-blue-400 transition-colors">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <ImageIcon className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Custom Branding</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              Add your brokerage logo, brand colors, and contact information to create professional, branded content
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-green-200 hover:border-green-400 transition-colors">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">Multiple Formats</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              Generate content optimized for social posts, email campaigns, blog articles, and text messages
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Main Form */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center border-b">
          <CardTitle className="flex items-center justify-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Content Generator
          </CardTitle>
          <CardDescription>
            Choose your topic, customize your branding, and let AI create professional content for your real estate
            business
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
              </div>
            }
          >
            <IdeaHubEmpowerForm />
          </Suspense>
        </CardContent>
      </Card>

      {/* Benefits Section */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-8">Why Use IdeaHub AI?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Save Time</h3>
            <p className="text-sm text-muted-foreground">Generate professional content in minutes, not hours</p>
          </div>
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Stay Consistent</h3>
            <p className="text-sm text-muted-foreground">Maintain your brand voice across all marketing channels</p>
          </div>
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Boost Engagement</h3>
            <p className="text-sm text-muted-foreground">Create content that resonates with your target audience</p>
          </div>
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <ImageIcon className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="font-semibold mb-2">Professional Design</h3>
            <p className="text-sm text-muted-foreground">Get branded visuals that look professionally designed</p>
          </div>
        </div>
      </div>
    </div>
  )
}
