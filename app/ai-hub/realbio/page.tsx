import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, FileText, Heart, Target } from "lucide-react"
import RealBioForm from "@/components/realbio-form"

export default function RealBioPage() {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <User className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">RealBio</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Create a compelling, professional agent bio that connects with all personality types and showcases your
            unique value proposition in the real estate market.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <FileText className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <CardTitle className="text-black">Professional Copy</CardTitle>
              <CardDescription>Expert-crafted bio copy that sounds human, not robotic</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-black">Emotionally Resonant</CardTitle>
              <CardDescription>Connects with visual, auditory, and kinesthetic personality types</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <Target className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <CardTitle className="text-black">Unique Positioning</CardTitle>
              <CardDescription>Highlights what sets you apart in the real estate market</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Tool Interface */}
        <Card className="max-w-4xl mx-auto border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-black text-center">Agent Bio Generator</CardTitle>
            <CardDescription className="text-center">
              Fill out your details below to generate a professional, compelling agent bio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RealBioForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
