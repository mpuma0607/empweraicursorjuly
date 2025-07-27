import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, ArrowRight } from "lucide-react"
import Link from "next/link"

const prospectingStrategies = [
  { title: "For Sale By Owners", href: "/prospecting-hub/fsbo", description: "FSBO lead generation strategies" },
  {
    title: "Absentee Owners",
    href: "/prospecting-hub/absentee-owners",
    description: "Target absentee property owners",
  },
  {
    title: "Expired Listings",
    href: "/prospecting-hub/expired-listings",
    description: "Convert expired listing leads",
  },
  { title: "Probate", href: "/prospecting-hub/probate", description: "Probate real estate opportunities" },
  { title: "SOI", href: "/prospecting-hub/soi", description: "Sphere of influence marketing" },
  {
    title: "Pre-Foreclosure",
    href: "/prospecting-hub/pre-foreclosure",
    description: "Pre-foreclosure lead strategies",
  },
  {
    title: "First Time Home Buyers",
    href: "/prospecting-hub/first-time-buyers",
    description: "First-time buyer conversion",
  },
  { title: "Real Estate Investors", href: "/prospecting-hub/investors", description: "Investor lead generation" },
  { title: "Divorce", href: "/prospecting-hub/divorce", description: "Divorce real estate strategies" },
]

export default function ProspectingHubPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-yellow-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Target className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">Prospecting Hub</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master lead generation with our proven 3-step system: Find them, Connect with them, and Market to them
            effectively.
          </p>
        </div>

        {/* Strategies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {prospectingStrategies.map((strategy, index) => (
            <Link key={index} href={strategy.href} className="group">
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg group-hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-black group-hover:text-orange-600 transition-colors flex items-center justify-between">
                    {strategy.title}
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                  </CardTitle>
                  <CardDescription className="text-gray-600">{strategy.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
