"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Clock, 
  Shield, 
  TrendingUp, 
  BarChart3, 
  Calendar, 
  Zap, 
  Users, 
  Target, 
  CheckCircle, 
  ArrowRight,
  Play,
  Star,
  MessageSquare,
  Image,
  Share2,
  Building2,
  Eye,
  MousePointer,
  FileText,
  Settings,
  Mail,
  AlertTriangle
} from "lucide-react"
import { useState } from "react"

export default function SOCiSocialMediaAutomationPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const features = [
    {
      icon: Clock,
      title: "Save hours weekly",
      description: "Plan a month of content in minutes with templates built for agents"
    },
    {
      icon: Shield,
      title: "Always on brand",
      description: "Pre-approved assets keep your posts consistent and compliant"
    },
    {
      icon: TrendingUp,
      title: "More reach, less effort",
      description: "Schedule across Facebook, Instagram, LinkedIn, and Google Business Profiles from one place"
    },
    {
      icon: BarChart3,
      title: "See what works",
      description: "Simple dashboards show which posts drive views, clicks, and inquiries"
    }
  ]

  const howItWorks = [
    {
      step: "1",
      title: "Connect your accounts",
      description: "Securely link your social profiles to SOCi. It takes a few clicks.",
      icon: Settings
    },
    {
      step: "2", 
      title: "Pick your plan",
      description: "Choose a recommended posting cadence (e.g., 3x weekly) and content mix for your goals.",
      icon: Target
    },
    {
      step: "3",
      title: "Personalize & schedule", 
      description: "Use branded templates and optional AI caption suggestions. Approve or edit in seconds.",
      icon: MessageSquare
    },
    {
      step: "4",
      title: "Publish everywhere",
      description: "Push to multiple networks at once. Queue content for peak engagement times.",
      icon: Share2
    },
    {
      step: "5",
      title: "Measure & improve",
      description: "See performance by post, channel, and week. Double down on what resonates.",
      icon: BarChart3
    }
  ]

  const c21Features = [
    {
      icon: Image,
      title: "Branded template library",
      description: "Listing spotlights, local market updates, tips for buyers and sellers, and seasonal pieces—already styled for C21."
    },
    {
      icon: CheckCircle,
      title: "One-click approvals",
      description: "Stay compliant without the back-and-forth. Pre-approved assets keep your brand tight."
    },
    {
      icon: Calendar,
      title: "Calendar view",
      description: "Glanceable monthly and weekly calendars with drag-and-drop control."
    },
    {
      icon: Zap,
      title: "AI caption assist (optional)",
      description: "Generate conversational captions you can tweak in seconds."
    },
    {
      icon: Users,
      title: "Team and assistant access",
      description: "Let your admin or marketing support help build and schedule posts with role-based permissions."
    }
  ]

  const leadershipFeatures = [
    {
      icon: Building2,
      title: "Multi-location publishing",
      description: "Roll out campaigns to offices or regions with local tweaks."
    },
    {
      icon: Shield,
      title: "Guardrails by design",
      description: "Brand colors, logos, and disclaimers applied automatically."
    },
    {
      icon: Clock,
      title: "Bulk scheduling & asset kits",
      description: "Launch a quarter's content in one session."
    },
    {
      icon: BarChart3,
      title: "Insights that matter",
      description: "Track adoption, posting consistency, and engagement by office and agent."
    }
  ]

  const contentTypes = [
    "Weekly market snapshots and quick stat cards",
    "Buyer and seller education series", 
    "Just listed / under contract / just sold spotlights",
    "Community and lifestyle content",
    "Open house promos and event recaps",
    "Review highlights and trust builders"
  ]

  const results = [
    {
      icon: CheckCircle,
      title: "More consistency",
      description: "Never miss a week again."
    },
    {
      icon: TrendingUp,
      title: "Better engagement", 
      description: "Educational, brand-safe posts earn more saves and shares."
    },
    {
      icon: Clock,
      title: "Time back",
      description: "Spend minutes, not hours, planning your content."
    },
    {
      icon: BarChart3,
      title: "Cleaner reporting",
      description: "See what's working and replicate it."
    }
  ]

  const gettingStarted = [
    "Click Connect SOCi and sign in.",
    "Link your social profiles.",
    "Choose your posting cadence and content categories.",
    "Approve your first week's calendar.",
    "Check performance after seven days and adjust."
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Share2 className="h-4 w-4" />
            SOCi + C21 Beggins
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Social Media Automation
          </h1>
          
          <p className="text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
            Automate your social media. Stay on brand. Win back your time.
          </p>
          
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Every week matters. With SOCi connected to C21 Beggins, your social presence runs on rails—brand-safe posts, smart scheduling, and clear analytics—so you can stay focused on listings, clients, and closings.
          </p>

          {/* Video Section */}
          <div className="mb-12">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
              <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                <div className="text-center">
                  <Play className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">SOCi + C21 Beggins Demo Video</p>
                  <p className="text-sm text-gray-500">Video will be embedded here</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
              Connect SOCi
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4">
              Book a 15-minute Setup
            </Button>
          </div>
        </div>

        {/* Why This Matters */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why this matters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How it works</h2>
          <div className="space-y-8">
            {howItWorks.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="h-6 w-6 text-blue-600" />
                      <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 text-lg">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-20">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="overview">Built for C21 Beggins</TabsTrigger>
              <TabsTrigger value="leadership">For Leaders & Marketing</TabsTrigger>
              <TabsTrigger value="content">What You Can Publish</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Built for C21 Beggins agents</h3>
                <p className="text-gray-600 text-lg">Everything you need to maintain a professional, consistent social media presence</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {c21Features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                          <Icon className="h-6 w-6 text-green-600" />
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">{feature.description}</CardDescription>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="leadership" className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">For leaders & marketing</h3>
                <p className="text-gray-600 text-lg">Advanced features for managing multiple agents and locations</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {leadershipFeatures.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                          <Icon className="h-6 w-6 text-purple-600" />
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">{feature.description}</CardDescription>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">What you can publish</h3>
                <p className="text-gray-600 text-lg">Professional content types designed for real estate agents</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contentTypes.map((type, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{type}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Results */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Results you can expect</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {results.map((result, index) => {
              const Icon = result.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-xl">{result.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{result.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Getting Started */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Getting started</h2>
          <div className="max-w-2xl mx-auto">
            <div className="space-y-4">
              {gettingStarted.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 text-lg">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sign Up Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
            <p className="text-lg text-gray-600 mb-6">
              Connect your social media accounts and start automating your content today.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm text-yellow-800 font-medium mb-1">Important Setup Information</p>
                  <p className="text-sm text-yellow-700">
                    Once you have signed up and paid, within 24 hours you will receive an email to your company email 
                    (will likely go to spam) from the SOCi platform. This email contains the instructions you need to 
                    actually connect SOCi and get your social media accounts connected.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* PayWhirl Widget */}
          <div className="max-w-2xl mx-auto">
            <div id="paywhirl-widget" className="min-h-[400px] bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">SOCi Sign-up Widget</p>
                <p className="text-sm text-gray-500">Payment form will load here</p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Questions about SOCi?</h3>
          <p className="text-gray-600 mb-6">
            Contact our support team for assistance with setup or any questions about the platform.
          </p>
          <Button size="lg" variant="outline" className="text-lg px-8 py-4">
            <Mail className="mr-2 h-5 w-5" />
            Contact Support
          </Button>
        </div>
      </div>

      {/* PayWhirl Script */}
      <script 
        type="text/javascript" 
        id='pw_68c0698f398b9' 
        src="https://app.paywhirl.com/pwa.js"
        async
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof paywhirl !== 'undefined') {
              paywhirl('widget', {
                autoscroll: 1,
                initial_autoscroll: 0,
                domain: 'century-21-be3',
                uuid: '431ef523-cd04-40ea-9cff-ee096a4eb2c3'
              }, 'pw_68c0698f398b9');
            }
          `
        }}
      />
    </div>
  )
}
