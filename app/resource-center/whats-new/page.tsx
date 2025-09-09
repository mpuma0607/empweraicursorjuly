"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTenantConfig } from "@/contexts/tenant-context"
import { 
  ArrowLeft, 
  Calendar, 
  Star, 
  Zap, 
  BookOpen,
  Brain,
  Megaphone,
  Target,
  GraduationCap,
  Settings,
  Users,
  FileText,
  Lightbulb,
  Home,
  MessageSquare,
  Mic,
  Calculator,
  Search,
  Image,
  TrendingUp,
  Building2,
  Waves,
  Share2,
  Monitor,
  Video,
  HelpCircle
} from "lucide-react"

// Static changelog data - in a real app, this could be loaded from a CMS or API
const changelogData = [
  {
    version: "2.1.0",
    date: "2024-01-15",
    title: "Major Platform Update",
    description: "Exciting new features and improvements across the platform",
    changes: [
      {
        type: "feature",
        title: "New Resource Center",
        description: "Centralized hub for all tools, training, and resources with powerful search functionality",
        icon: BookOpen,
        impact: "high"
      },
      {
        type: "feature",
        title: "Social Media Mastery Course",
        description: "Comprehensive 8-module course on building a magnetic brand and converting attention ethically",
        icon: Share2,
        impact: "high"
      },
      {
        type: "feature",
        title: "Negotiation Mastery Course",
        description: "Tactical empathy and dealcraft training with downloadable PDF resources",
        icon: MessageSquare,
        impact: "high"
      },
      {
        type: "improvement",
        title: "Enhanced AI Tools",
        description: "Improved performance and accuracy across all AI-powered tools",
        icon: Brain,
        impact: "medium"
      },
      {
        type: "improvement",
        title: "Better Search Experience",
        description: "Faster search with better filtering and results in the AI Hub",
        icon: Search,
        impact: "medium"
      }
    ],
    tags: ["empower-ai", "century21-beggins"]
  },
  {
    version: "2.0.5",
    date: "2024-01-08",
    title: "Training Hub Enhancements",
    description: "New training modules and improved user experience",
    changes: [
      {
        type: "feature",
        title: "Moxi Works Training Updates",
        description: "Updated video content and new PDF resources for Moxi Works platform",
        icon: Monitor,
        impact: "medium"
      },
      {
        type: "improvement",
        title: "PDF Download Fixes",
        description: "Fixed issues with PDF downloads in training modules",
        icon: FileText,
        impact: "low"
      },
      {
        type: "feature",
        title: "UserGuiding Integration",
        description: "Added onboarding tooltips and guided tours for new users",
        icon: HelpCircle,
        impact: "medium"
      }
    ],
    tags: ["empower-ai", "century21-beggins"]
  },
  {
    version: "2.0.3",
    date: "2024-01-02",
    title: "Marketing Hub Improvements",
    description: "Enhanced marketing tools and content generation",
    changes: [
      {
        type: "feature",
        title: "Dynamic Branded Content Updates",
        description: "Added text color selection and improved branding options",
        icon: Megaphone,
        impact: "medium"
      },
      {
        type: "feature",
        title: "Real Estate Hot Takes",
        description: "New RSS feed integration for real estate news and trends",
        icon: TrendingUp,
        impact: "medium"
      },
      {
        type: "improvement",
        title: "Prospecting Content Integration",
        description: "Better integration between prospecting strategies and marketing content",
        icon: Target,
        impact: "medium"
      }
    ],
    tags: ["empower-ai", "century21-beggins"]
  },
  {
    version: "2.0.1",
    date: "2023-12-20",
    title: "AI Tools Enhancement",
    description: "New AI capabilities and improved user experience",
    changes: [
      {
        type: "feature",
        title: "IdeaHub Text Color Options",
        description: "Added white/black text color selection for better image generation",
        icon: Lightbulb,
        impact: "medium"
      },
      {
        type: "feature",
        title: "RealDeal Email Integration",
        description: "Added Gmail OAuth integration for sending emails directly from RealDeal",
        icon: MessageSquare,
        impact: "high"
      },
      {
        type: "improvement",
        title: "Who's Who Link Fixes",
        description: "Fixed parentheses in TruePeopleSearch links",
        icon: Search,
        impact: "low"
      }
    ],
    tags: ["empower-ai", "century21-beggins"]
  }
]

export default function WhatsNewPage() {
  const tenantConfig = useTenantConfig()

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "feature":
        return Star
      case "improvement":
        return Zap
      case "fix":
        return Settings
      default:
        return FileText
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "feature":
        return "bg-blue-500"
      case "improvement":
        return "bg-green-500"
      case "fix":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/resource-center" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Resource Center
          </Link>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Calendar className="h-4 w-4" />
              What's New
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Latest Updates
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay up to date with the latest features, improvements, and enhancements to the {tenantConfig.name} platform.
            </p>
          </div>
        </div>

        {/* Changelog */}
        <div className="space-y-8">
          {changelogData.map((release, releaseIndex) => (
            <Card key={releaseIndex} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="font-mono">
                        v{release.version}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {new Date(release.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <CardTitle className="text-2xl">{release.title}</CardTitle>
                    <CardDescription className="text-lg mt-2">
                      {release.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {release.changes.map((change, changeIndex) => {
                    const Icon = change.icon
                    const TypeIcon = getTypeIcon(change.type)
                    return (
                      <div key={changeIndex} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <Icon className="h-5 w-5 text-gray-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`p-1 rounded ${getTypeColor(change.type)} text-white`}>
                                <TypeIcon className="h-3 w-3" />
                              </div>
                              <h4 className="font-semibold text-gray-900">{change.title}</h4>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getImpactColor(change.impact)}`}
                              >
                                {change.impact} impact
                              </Badge>
                            </div>
                            <p className="text-gray-700">{change.description}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon */}
        <Card className="mt-16">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Coming Soon
            </CardTitle>
            <CardDescription>
              Exciting features and improvements in development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 border border-dashed border-gray-300 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Advanced Analytics Dashboard</h4>
                <p className="text-gray-600 text-sm">
                  Track your performance across all tools with detailed analytics and insights.
                </p>
              </div>
              <div className="p-4 border border-dashed border-gray-300 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Mobile App</h4>
                <p className="text-gray-600 text-sm">
                  Access all your tools and resources on the go with our mobile application.
                </p>
              </div>
              <div className="p-4 border border-dashed border-gray-300 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Team Collaboration Features</h4>
                <p className="text-gray-600 text-sm">
                  Share resources and collaborate with your team members seamlessly.
                </p>
              </div>
              <div className="p-4 border border-dashed border-gray-300 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Advanced AI Training</h4>
                <p className="text-gray-600 text-sm">
                  More specialized AI training modules for specific real estate scenarios.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Have feedback or suggestions?</CardTitle>
              <CardDescription>
                We'd love to hear from you! Share your ideas for new features or improvements.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/support?type=feature">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Share Your Ideas
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
