"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star, TrendingUp, Eye, Share, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ZillowHubPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">🏠 Zillow Integration Hub</Badge>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Zillow Hub</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Master Zillow's powerful tools and features to maximize your listing exposure, generate more leads, and close
          more deals with professional Zillow Showcase training.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">75%</div>
            <p className="text-gray-600">More Page Views</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">68%</div>
            <p className="text-gray-600">More Saves</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Share className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">75%</div>
            <p className="text-gray-600">More Shares</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Feature Card */}
      <Card className="mb-12 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-0">
          <div className="p-8 lg:p-12">
            <Badge className="mb-4 bg-yellow-100 text-yellow-800 border-yellow-200">⭐ Featured Training</Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Zillow Showcase Mastery</h2>
            <p className="text-gray-600 mb-6 text-lg">
              Learn how to leverage Zillow Showcase to make your listings stand out, attract more qualified buyers, and
              sell properties faster at higher prices.
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-center text-gray-700">
                <TrendingUp className="h-5 w-5 text-green-500 mr-3" />
                <span>20% more likely to go pending in first 14 days</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Star className="h-5 w-5 text-yellow-500 mr-3" />
                <span>Sell for 2% more than similar listings</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Badge className="mr-3 bg-blue-100 text-blue-800 text-xs">EXCLUSIVE</Badge>
                <span>Available to only 10% of listings in your market</span>
              </div>
            </div>

            <Link href="/zillow-hub/zillow-showcase">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Zillow Showcase Training
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 lg:p-12 flex items-center justify-center">
            <div className="relative">
              <Image
                src="/images/zillow-showcase-page1.jpeg"
                alt="Zillow Showcase Preview"
                width={400}
                height={300}
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -top-4 -right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                SHOWCASE
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tools Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">🏠</div>
              Zillow Showcase
            </CardTitle>
            <CardDescription>
              Complete training on setting up, ordering, pitching, and using Zillow Showcase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Master every aspect of Zillow Showcase from initial setup to closing more deals with enhanced listing
              presentations.
            </p>
            <Link href="/zillow-hub/zillow-showcase">
              <Button variant="outline" className="w-full bg-transparent">
                Access Training
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-500">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">🚀</div>
              More Tools Coming Soon
            </CardTitle>
            <CardDescription>Additional Zillow integration tools and training modules in development</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-4">
              We're continuously expanding our Zillow Hub with new tools and training to help you maximize your success
              on the platform.
            </p>
            <Button variant="ghost" disabled className="w-full">
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
