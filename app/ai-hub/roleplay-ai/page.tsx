import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Mic, Brain } from "lucide-react"

export default function RolePlayPage() {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Users className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">RolePlay AI</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Practice your real estate conversations with AI-powered roleplay scenarios. Perfect your scripts, handle
            objections, and build confidence before your next client interaction.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <Mic className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <CardTitle className="text-black">Voice Practice</CardTitle>
              <CardDescription>Practice with realistic voice AI that responds like real clients</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <Brain className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <CardTitle className="text-black">Smart Scenarios</CardTitle>
              <CardDescription>AI adapts to create challenging but realistic practice scenarios</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <Users className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
              <CardTitle className="text-black">Real Situations</CardTitle>
              <CardDescription>Practice common real estate scenarios and objection handling</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Tool Interface */}
        <Card className="max-w-4xl mx-auto border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-black text-center">AI Roleplay Practice</CardTitle>
            <CardDescription className="text-center">
              Choose a scenario and start practicing your real estate conversations with AI
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
              <h4 className="font-bold text-black mb-4 text-lg">Voice AI Roleplay Training</h4>
              <p className="text-gray-700 mb-4">
                Practice your real estate conversations with advanced voice AI. Choose from various scenarios including
                cold calling, listing presentations, buyer consultations, and objection handling.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 mt-6">
              <iframe
                src="https://cerebras.vercel.app/"
                width="100%"
                height="700"
                style={{ border: "none", borderRadius: "8px" }}
                title="Cerebras Voice AI - Real Estate Roleplay Training"
                allow="microphone *; camera *; fullscreen *; autoplay *; clipboard-read; clipboard-write"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-presentation allow-downloads allow-pointer-lock allow-top-navigation"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
