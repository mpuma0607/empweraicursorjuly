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
          <div className="mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Welcome to{" "}
              <span className="text-yellow-400">Century 21</span>
              <br />
              <span className="text-yellow-400">Coastal Advantage</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Your gateway to real estate success. Access cutting-edge AI tools, 
              comprehensive training, and a community of top-performing agents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleAuthAction}
                size="lg"
                className="bg-yellow-400 text-black hover:bg-yellow-300 text-lg px-8 py-4"
              >
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-black text-lg px-8 py-4"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">500+</div>
              <div className="text-gray-300">Active Agents</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">$2.5B+</div>
              <div className="text-gray-300">Sales Volume</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">98%</div>
              <div className="text-gray-300">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Century 21 Coastal Advantage?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We provide everything you need to succeed in real estate with cutting-edge technology and proven strategies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mr-4">
                    <GraduationCap className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold">AI-Powered Tools</h3>
                </div>
                <p className="text-gray-300">
                  Access cutting-edge AI tools for lead generation, market analysis, and client communication.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mr-4">
                    <TrendingUp className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold">Proven Training</h3>
                </div>
                <p className="text-gray-300">
                  Comprehensive training programs designed to accelerate your success and boost your sales.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mr-4">
                    <Award className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold">Market Leadership</h3>
                </div>
                <p className="text-gray-300">
                  Join the #1 real estate brand with unmatched market presence and brand recognition.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mr-4">
                    <Building className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold">Coastal Advantage</h3>
                </div>
                <p className="text-gray-300">
                  Specialized expertise in coastal markets with unique opportunities and high-value properties.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mr-4">
                    <Star className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold">Support Network</h3>
                </div>
                <p className="text-gray-300">
                  Connect with top-performing agents and access mentorship from industry leaders.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mr-4">
                    <CheckCircle className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold">Proven Results</h3>
                </div>
                <p className="text-gray-300">
                  Our agents consistently outperform the market with higher sales and client satisfaction.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join the Coastal Advantage?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start your journey with Century 21 Coastal Advantage and unlock your potential in real estate.
          </p>
          <Button
            onClick={handleAuthAction}
            size="lg"
            className="bg-black text-white hover:bg-gray-800 text-lg px-8 py-4"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Image
                src="/images/c21-coastal-white.png"
                alt="Century 21 Coastal Advantage"
                width={200}
                height={60}
                className="object-contain mb-4"
              />
              <p className="text-gray-400">
                Your trusted partner in coastal real estate success.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Training</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>info@c21coastal.com</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Century 21 Coastal Advantage. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
