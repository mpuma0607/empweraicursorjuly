import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Sparkles } from "lucide-react"
import ScriptForm from "./script-form"

export default function ScriptITPage() {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">ScriptIT</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Generate personalized scripts for any real estate situation. From cold calls to listing presentations, get
            proven scripts that convert prospects into clients.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <Sparkles className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-black">Personalized Scripts</CardTitle>
              <CardDescription>Custom scripts tailored to your specific situation and market</CardDescription>
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
                className="h-12 w-12 text-pink-500 mx-auto mb-4"
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
              <CardTitle className="text-black">Proven Techniques</CardTitle>
              <CardDescription>Scripts based on proven sales psychology and objection handling</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <MessageSquare className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <CardTitle className="text-black">Ready to Use</CardTitle>
              <CardDescription>Get scripts you can use immediately in your next conversation</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Tool Interface */}
        <Card className="max-w-4xl mx-auto border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-black text-center">Script Generator</CardTitle>
            <CardDescription className="text-center">
              Tell us about your situation and we'll create a personalized script for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScriptForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
