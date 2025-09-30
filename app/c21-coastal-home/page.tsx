"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, TrendingUp, Award, CheckCircle, ArrowRight, Star, Building, Phone, Mail } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function C21CoastalHomePage() {
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleAuthAction = () => {
    // Go directly to portal instead of opening MemberSpace
    router.push("/portal")
  }

  if (!isClient) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Simple Header with ONLY logo and login - NO navigation menu */}
      <header className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo - using white logo for dark background */}
          <div className="flex items-center">
            <Image
              src="/images/c21-coastal-white.png"
              alt="Century 21 Coastal Advantage"
              width={250}
              height={80}
              className="object-contain"
              priority
            />
          </div>

          {/* Login/Sign up Button */}
          <Button
            onClick={handleAuthAction}
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white hover:text-black"
          >
            Log in/Sign up
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Section */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">Welcome to Century 21 Coastal Advantage</h1>

          <div className="flex items-center justify-center mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-white to-transparent w-32"></div>
            <span className="px-6 text-xl text-gray-300 font-light">EMPOWER • EDUCATE • ENCOURAGE</span>
            <div className="h-px bg-gradient-to-r from-transparent via-white to-transparent w-32"></div>
          </div>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
            Your comprehensive training and development platform, designed to elevate our agents to the next level of
            success.
          </p>

          <Button
            onClick={handleAuthAction}
            size="lg"
            className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-4"
          >
            Access Your Portal
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

        </div>
      </main>

      {/* Everything You Need Section */}
      <section className="py-20 px-4 bg-black/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools, training, and resources you need to take your real
              estate business to the next level.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* AI Hub */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">AI Hub</h3>
                <p className="text-gray-300 mb-6">
                  12 powerful AI tools including ListIT, ScriptIT, RealBio, ActionAI, and more
                </p>
                <p className="text-sm text-gray-400 mb-4">For a demo of each tool, click it below:</p>
                <div className="space-y-2">
                  <div className="flex items-center text-green-400">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm">FSBO & Expired Listings</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm">Sphere of Influence</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prospecting Hub */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Prospecting Hub</h3>
                <p className="text-gray-300 mb-6">Complete prospecting strategies for every lead type</p>
                <div className="space-y-2">
                  <div className="flex items-center text-green-400">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm">FSBO & Expired Listings</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm">Sphere of Influence</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Marketing Hub */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Marketing Hub</h3>
                <p className="text-gray-300 mb-6">Professional marketing content and social media resources</p>
                <div className="space-y-2">
                  <div className="flex items-center text-green-400">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm">Branded social content</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm">Market hot takes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Training Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6 bg-purple-600/20 text-purple-300 border-purple-500/30">
                🎯 Comprehensive Training
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Master Every Aspect of Real Estate</h2>
              <p className="text-xl text-gray-300 mb-8">
                From buyer and listing processes to advanced prospecting techniques, our training hub covers everything
                you need to know.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                  <span className="text-white">Buyer & Listing Process Training</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                  <span className="text-white">Advanced Prospecting Techniques</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                  <span className="text-white">Market Analysis & Pricing Strategies</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                  <span className="text-white">Client Communication & Negotiation</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-3xl p-8 backdrop-blur-sm border border-white/10">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <GraduationCap className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Interactive Learning</h3>
                  <p className="text-gray-300 mb-6">
                    Our training modules are designed to be interactive and engaging, ensuring you retain the knowledge
                    and can apply it immediately.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-white">50+</div>
                      <div className="text-sm text-gray-400">Training Modules</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white">100+</div>
                      <div className="text-sm text-gray-400">Hours of Content</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of successful agents who have transformed their business with our comprehensive platform.
          </p>
          <Button
            onClick={handleAuthAction}
            size="lg"
            className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-4"
          >
            Access Your Portal Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}
