"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wrench, Clock, Bell, Mail, ExternalLink, ShoppingBag, Star, Truck } from "lucide-react"
import { useTenantConfig } from "@/contexts/tenant-context"

export default function GearHubPage() {
  const tenantConfig = useTenantConfig()

  // Show Printful store for default tenant, coming soon for others
  const showPrintfulStore = tenantConfig.id === "default"

  if (showPrintfulStore) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Wrench className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Gear Hub</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Your one-stop shop for The Next Level U branded merchandise and real estate tools.
            </p>

            {/* Main CTA */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white mb-12">
              <div className="flex items-center justify-center mb-4">
                <ShoppingBag className="h-12 w-12" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Shop The Next Level U Store</h2>
              <p className="text-xl mb-6 opacity-90">
                Professional branded apparel, accessories, and real estate tools
              </p>
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8 py-3"
                onClick={() => window.open("https://nextlevelu.printful.me/", "_blank")}
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                Visit Store
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Star className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <CardTitle>Premium Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  High-quality branded merchandise including jerseys, t-shirts, polos, and professional apparel
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Truck className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <CardTitle>Fast Shipping</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Secure checkout with worldwide shipping. Orders processed and shipped quickly via Printful
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Badge className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <CardTitle>Member Exclusive</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Exclusive designs and products available only to The Next Level U community members
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Product Categories */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-12">
            <h3 className="text-2xl font-bold text-center mb-8">Available Products</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-white rounded-lg p-4 mb-3 shadow-sm">
                  <div className="text-2xl mb-2">👕</div>
                  <h4 className="font-semibold">Men's Clothing</h4>
                </div>
                <p className="text-sm text-gray-600">Jerseys, T-shirts, Polos</p>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-lg p-4 mb-3 shadow-sm">
                  <div className="text-2xl mb-2">👚</div>
                  <h4 className="font-semibold">Women's Clothing</h4>
                </div>
                <p className="text-sm text-gray-600">T-shirts, Blouses, Apparel</p>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-lg p-4 mb-3 shadow-sm">
                  <div className="text-2xl mb-2">🧢</div>
                  <h4 className="font-semibold">Hats & Accessories</h4>
                </div>
                <p className="text-sm text-gray-600">Caps, Beanies, Accessories</p>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-lg p-4 mb-3 shadow-sm">
                  <div className="text-2xl mb-2">⚾</div>
                  <h4 className="font-semibold">Sports & Leisure</h4>
                </div>
                <p className="text-sm text-gray-600">Athletic wear, Casual items</p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Shop?</h3>
            <p className="text-gray-600 mb-6">
              Browse our full collection of branded merchandise and professional tools
            </p>
            <Button
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white"
              onClick={() => window.open("https://nextlevelu.printful.me/", "_blank")}
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Shop Now
            </Button>
            <p className="text-sm text-gray-500 mt-4">Powered by Printful • Secure checkout • Worldwide shipping</p>
          </div>
        </div>
      </div>
    )
  }

  // Coming soon page for other tenants
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <Wrench className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Gear Hub</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your one-stop shop for real estate tools, equipment, and resources to power your business.
          </p>
        </div>

        {/* Coming Soon Card */}
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-blue-100 rounded-full">
                <Clock className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">Coming Soon!</CardTitle>
            <CardDescription className="text-lg text-gray-600 mt-4">
              We're working hard to bring you an amazing collection of real estate tools and gear.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    1
                  </Badge>
                  Professional Tools
                </h3>
                <p className="text-sm text-gray-600 ml-8">
                  High-quality cameras, measuring tools, and presentation equipment
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    2
                  </Badge>
                  Marketing Materials
                </h3>
                <p className="text-sm text-gray-600 ml-8">
                  Business cards, yard signs, brochures, and branded merchandise
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    3
                  </Badge>
                  Tech Solutions
                </h3>
                <p className="text-sm text-gray-600 ml-8">
                  CRM systems, mobile apps, and productivity software recommendations
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    4
                  </Badge>
                  Exclusive Deals
                </h3>
                <p className="text-sm text-gray-600 ml-8">
                  Member-only discounts and special pricing on essential tools
                </p>
              </div>
            </div>

            <div className="pt-6 border-t">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                <Bell className="h-4 w-4" />
                <span>Get notified when Gear Hub launches</span>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Mail className="h-4 w-4 mr-2" />
                Notify Me When Available
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Have suggestions for tools or gear you'd like to see?
            <a href="/support" className="text-blue-600 hover:text-blue-700 ml-1">
              Let us know!
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
