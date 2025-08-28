"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useTenant } from "@/contexts/tenant-context"
import {
  FileText,
  Lightbulb,
  User,
  Home,
  MessageSquare,
  Mic,
  Target,
  GraduationCap,
  TrendingUp,
  Calculator,
  Search,
  Image,
} from "lucide-react"

const aiTools = {
  "AI Marketing & Prospecting Tools": [
    {
      title: "IdeaHub AI",
      href: (config: any) => (config.id === "century21-beggins" ? "/ai-hub/ideahub-beggins" : "/ai-hub/ideahub-ai"),
      description: "Social Media Content Generation",
      icon: Lightbulb,
      color: "yellow",
      toolId: "ideahub-ai",
      keywords: [
        "social media",
        "content",
        "posts",
        "marketing",
        "ideas",
        "creative",
        "engagement",
        "write",
        "create",
        "generate",
        "facebook",
        "instagram",
        "linkedin",
        "twitter",
        "social content",
        "social posts",
        "content creation",
        "marketing content",
        "write posts",
        "create content",
        "generate ideas",
        "social media posts",
        "content ideas",
        "marketing ideas",
        "creative content",
        "social strategy",
      ],
    },
    {
      title: "IdeaHub V2",
      href: "/ai-hub/ideahub-v2",
      description: "Advanced Social Media Content Generation",
      icon: Lightbulb,
      color: "yellow",
      toolId: "ideahub-v2",
      keywords: [
        "social media",
        "content",
        "posts",
        "marketing",
        "ideas",
        "creative",
        "engagement",
        "write",
        "create",
        "generate",
        "facebook",
        "instagram",
        "linkedin",
        "twitter",
        "social content",
        "social posts",
        "content creation",
        "marketing content",
        "write posts",
        "create content",
        "generate ideas",
        "social media posts",
        "content ideas",
        "marketing ideas",
        "creative content",
        "social strategy",
        "advanced",
        "v2",
        "branding",
        "custom image",
        "personalized",
      ],
    },
    {
      title: "IdeaHub Empower",
      href: "/ai-hub/ideahub-empower",
      description: "Multi-Brand Social Media Content Generation",
      icon: Lightbulb,
      color: "yellow",
      toolId: "ideahub-empower",
      keywords: [
        "social media",
        "content",
        "posts",
        "marketing",
        "ideas",
        "creative",
        "engagement",
        "write",
        "create",
        "generate",
        "facebook",
        "instagram",
        "linkedin",
        "twitter",
        "social content",
        "social posts",
        "content creation",
        "marketing content",
        "write posts",
        "create content",
        "generate ideas",
        "social media posts",
        "content ideas",
        "marketing ideas",
        "creative content",
        "social strategy",
        "multi-brand",
        "empower",
        "brand selection",
        "multiple brands",
        "brand options",
      ],
    },
    {
      title: "RealBio",
      href: "/ai-hub/realbio",
      description: "Professional Agent Bio Creation",
      icon: User,
      color: "green",
      toolId: "realbio",
      keywords: [
        "bio",
        "biography",
        "profile",
        "about me",
        "agent bio",
        "professional",
        "introduction",
        "write",
        "create",
        "generate",
        "personal",
        "agent profile",
        "about section",
        "write bio",
        "create bio",
        "generate bio",
        "write about me",
        "create profile",
        "generate profile",
        "professional bio",
        "agent introduction",
        "personal bio",
        "write profile",
        "create about me",
        "generate profile",
        "bio writing",
        "profile writing",
      ],
    },
    {
      title: "ListIT",
      href: "/ai-hub/listit-ai",
      description: "Property Listing Descriptions",
      icon: Home,
      color: "purple",
      toolId: "listit-ai",
      keywords: [
        "listing",
        "description",
        "property",
        "home",
        "sell",
        "marketing copy",
        "features",
        "write",
        "create",
        "generate",
        "listing description",
        "property description",
        "write listing",
        "create listing",
        "generate listing",
        "listing copy",
        "property copy",
        "home description",
        "listing text",
        "property text",
        "write description",
        "create description",
        "generate description",
        "listing content",
        "property content",
        "home listing",
        "property listing",
      ],
    },
    {
      title: "ScriptIT",
      href: "/ai-hub/scriptit-ai",
      description: "Custom Real Estate Scripts",
      icon: MessageSquare,
      color: "red",
      toolId: "scriptit",
      keywords: [
        "script",
        "calling",
        "phone",
        "conversation",
        "prospecting",
        "objections",
        "dialogue",
        "write",
        "create",
        "generate",
        "phone script",
        "call script",
        "talking points",
        "write script",
        "create script",
        "generate script",
        "phone calls",
        "cold calling",
        "prospecting script",
        "objection handling",
        "conversation script",
        "call dialogue",
        "phone dialogue",
        "script writing",
        "call preparation",
        "talking script",
      ],
    },
    {
      title: "QuickCMA AI",
      href: "/ai-hub/quickcma-ai",
      description: "Comparative Market Analysis Tool",
      icon: Calculator,
      color: "slate",
      toolId: "quickcma-ai",
      keywords: [
        "cma",
        "market analysis",
        "comparable",
        "pricing",
        "valuation",
        "property value",
        "comps",
        "create",
        "generate",
        "analyze",
        "market report",
        "property analysis",
        "home value",
        "create cma",
        "generate cma",
        "market comparison",
        "property comparison",
        "comparable sales",
        "market data",
        "pricing analysis",
        "value analysis",
        "home analysis",
        "property report",
        "market study",
        "valuation report",
      ],
    },
    {
      title: "MyMarket AI",
      href: "/ai-hub/mymarket-ai",
      description: "Housing & Rental Market Analysis",
      icon: TrendingUp,
      color: "emerald",
      toolId: "mymarket-ai",
      keywords: [
        "market analysis",
        "housing market",
        "rental market",
        "market trends",
        "market data",
        "housing trends",
        "rental trends",
        "market research",
        "housing analysis",
        "rental analysis",
        "market insights",
        "housing insights",
        "rental insights",
        "market report",
        "housing report",
        "rental report",
        "market statistics",
        "housing statistics",
        "rental statistics",
        "market overview",
        "housing overview",
        "rental overview",
        "market conditions",
        "housing conditions",
        "rental conditions",
        "market analysis tool",
        "housing market tool",
        "rental market tool",
      ],
    },
    {
      title: "RolePlay AI",
      href: "/ai-hub/roleplay-ai",
      description: "Voice Conversation Practice",
      icon: Mic,
      color: "indigo",
      toolId: "roleplay-ai",
      keywords: [
        "practice",
        "roleplay",
        "voice",
        "conversation",
        "training",
        "rehearse",
        "mock calls",
        "role play",
        "practice calls",
        "conversation practice",
        "voice practice",
        "mock conversations",
        "training calls",
        "practice scripts",
        "rehearse calls",
        "conversation training",
        "call practice",
        "voice training",
        "speaking practice",
        "dialogue practice",
        "communication practice",
        "phone practice",
      ],
    },
    {
      title: "PropBot AI",
      href: "/ai-hub/propbot-ai",
      description: "Intelligent Property Search & Analysis",
      icon: Search,
      color: "cyan",
      toolId: "propbot-ai",
      keywords: [
        "property search",
        "find homes",
        "listings",
        "search properties",
        "home finder",
        "real estate search",
        "find",
        "search",
        "locate",
        "discover",
        "property finder",
        "home search",
        "find properties",
        "search homes",
        "locate homes",
        "discover properties",
        "property lookup",
        "home lookup",
        "real estate finder",
        "listing search",
        "property database",
        "home database",
        "search listings",
        "find listings",
      ],
    },
    {
      title: "Who's Who AI",
      href: "/ai-hub/whos-who-ai",
      description: "Property Owner Skip Tracing",
      icon: User,
      color: "violet",
      toolId: "whos-who-ai",
      keywords: [
        "owner info",
        "skip trace",
        "property owner",
        "contact info",
        "find owner",
        "owner details",
        "find",
        "locate",
        "discover",
        "owner information",
        "property information",
        "find owner info",
        "locate owner",
        "discover owner",
        "owner lookup",
        "property owner info",
        "contact information",
        "owner contact",
        "skip tracing",
        "owner research",
        "property research",
        "find contact",
        "locate contact",
      ],
    },
    {
      title: "Real-IMG",
      href: "/ai-hub/real-img",
      description: "Interactive Image Creator for Real Estate",
      icon: Image,
      color: "teal",
      toolId: "real-img",
      keywords: [
        "interactive image",
        "hotspot",
        "property photo",
        "floor plan",
        "real estate marketing",
        "clickable image",
        "image editor",
        "hotspot creator",
        "interactive content",
        "property presentation",
        "marketing tool",
        "image enhancement",
        "click to learn more",
        "interactive floor plan",
        "property hotspot",
        "real estate image",
        "marketing image",
        "interactive property",
        "clickable property",
        "property marketing",
        "image marketing",
        "hotspot marketing",
        "interactive marketing",
      ],
    },
    {
      title: "GoalScreen AI",
      href: "/ai-hub/goalscreen-ai",
      description: "Custom Goal Wallpaper Generator",
      icon: Target,
      color: "pink",
      toolId: "goalscreen",
      keywords: [
        "goals",
        "wallpaper",
        "motivation",
        "targets",
        "daily goals",
        "visual goals",
        "screensaver",
        "create",
        "generate",
        "design",
        "goal wallpaper",
        "motivational wallpaper",
        "create wallpaper",
        "generate wallpaper",
        "design wallpaper",
        "goal screen",
        "motivational screen",
        "daily targets",
        "goal tracker",
        "visual motivation",
        "goal reminder",
        "target wallpaper",
        "achievement wallpaper",
        "success wallpaper",
      ],
    },
  ],
  "AI Planning & Coaching Tools": [
    {
      title: "Action AI",
      href: "/ai-hub/action-ai",
      description: "Daily Prospecting Action Plans",
      icon: Target,
      color: "orange",
      toolId: "action-ai",
      keywords: [
        "action plan",
        "daily plan",
        "prospecting plan",
        "tasks",
        "activities",
        "daily actions",
        "plan",
        "create",
        "generate",
        "build",
        "make",
        "daily planning",
        "action planning",
        "create plan",
        "generate plan",
        "build plan",
        "make plan",
        "daily tasks",
        "prospecting activities",
        "daily activities",
        "action items",
        "to-do list",
        "daily schedule",
        "work plan",
        "business plan",
        "activity plan",
        "task plan",
      ],
    },
    {
      title: "RealCoach AI",
      href: "/ai-hub/realcoach-ai",
      description: "Personalized Business Coaching",
      icon: GraduationCap,
      color: "teal",
      toolId: "realcoach-ai",
      keywords: [
        "coaching",
        "business coach",
        "advice",
        "guidance",
        "mentor",
        "business help",
        "strategy",
        "get",
        "receive",
        "need",
        "want",
        "business coaching",
        "professional coaching",
        "get advice",
        "receive coaching",
        "need help",
        "want guidance",
        "business guidance",
        "professional advice",
        "business mentor",
        "coaching session",
        "business support",
        "strategic advice",
        "business strategy",
        "professional help",
        "expert advice",
      ],
    },
    {
      title: "BizPlan AI",
      href: "/ai-hub/bizplan-ai",
      description: "90-Day Business Plan Generator",
      icon: TrendingUp,
      color: "emerald",
      toolId: "bizplan-ai",
      keywords: [
        "business plan",
        "90 day plan",
        "planning",
        "strategy",
        "goals",
        "business strategy",
        "plan",
        "create",
        "generate",
        "build",
        "make",
        "develop",
        "business planning",
        "create business plan",
        "generate business plan",
        "build business plan",
        "make business plan",
        "90-day plan",
        "quarterly plan",
        "business goals",
        "strategic plan",
        "growth plan",
        "business development",
        "planning strategy",
        "business roadmap",
        "success plan",
      ],
    },
  ],
  "AI Analysis & Contract Tools": [
    {
      title: "RealDeal AI",
      href: "/ai-hub/realdeal-ai",
      description: "Contract Analysis & Summarization",
      icon: FileText,
      color: "blue",
      toolId: "realdeal-ai",
      keywords: [
        "contract",
        "analysis",
        "legal",
        "document",
        "review",
        "contract review",
        "summarize",
        "analyze",
        "review",
        "examine",
        "check",
        "study",
        "contract analysis",
        "analyze contract",
        "review contract",
        "examine contract",
        "check contract",
        "contract summary",
        "document analysis",
        "legal analysis",
        "contract help",
        "document review",
        "legal review",
        "contract assistance",
        "document help",
        "contract interpretation",
        "legal document",
        "agreement analysis",
        "contract breakdown",
      ],
    },
  ],
}

const colorClasses = {
  yellow: "border-yellow-200 hover:border-yellow-400 bg-yellow-100 text-yellow-600 bg-yellow-600 hover:bg-yellow-700",
  green: "border-green-200 hover:border-green-400 bg-green-100 text-green-600 bg-green-600 hover:bg-green-700",
  purple: "border-purple-200 hover:border-purple-400 bg-purple-100 text-purple-600 bg-purple-600 hover:bg-purple-700",
  red: "border-red-200 hover:border-red-400 bg-red-100 text-red-600 bg-red-600 hover:bg-red-700",
  slate: "border-slate-200 hover:border-slate-400 bg-slate-100 text-slate-600 bg-slate-600 hover:bg-slate-700",
  indigo: "border-indigo-200 hover:border-indigo-400 bg-indigo-100 text-indigo-600 bg-indigo-600 hover:bg-indigo-700",
  cyan: "border-cyan-200 hover:border-cyan-400 bg-cyan-100 text-cyan-600 bg-cyan-600 hover:bg-cyan-700",
  violet: "border-violet-200 hover:border-violet-400 bg-violet-100 text-violet-600 bg-violet-600 hover:bg-violet-700",
  pink: "border-pink-200 hover:border-pink-400 bg-pink-100 text-pink-600 bg-pink-600 hover:bg-pink-700",
  orange: "border-orange-200 hover:border-orange-400 bg-orange-100 text-orange-600 bg-orange-600 hover:bg-orange-700",
  teal: "border-teal-200 hover:border-teal-400 bg-teal-100 text-teal-600 bg-teal-600 hover:bg-teal-700",
  emerald:
    "border-emerald-200 hover:border-emerald-400 bg-emerald-100 text-emerald-600 bg-emerald-600 hover:bg-emerald-700",
  blue: "border-blue-200 hover:border-blue-400 bg-blue-100 text-blue-600 bg-blue-600 hover:bg-blue-700",
}

export default function AIHubPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { config } = useTenant()

  const filteredTools = useMemo(() => {
    // First filter by tenant configuration
    const tenantFilteredTools: any = {}

    Object.entries(aiTools).forEach(([category, tools]) => {
      const enabledTools = tools.filter((tool: any) => {
        // If no enabledTools array exists, show all tools (backward compatibility)
        if (!config.features.enabledTools) return true
        // Otherwise, only show tools that are in the enabledTools array
        return config.features.enabledTools.includes(tool.toolId)
      })

      if (enabledTools.length > 0) {
        tenantFilteredTools[category] = enabledTools
      }
    })

    // Then filter by search query
    if (!searchQuery.trim()) {
      return tenantFilteredTools
    }

    const query = searchQuery.toLowerCase()
    const searchFiltered: any = {}

    Object.entries(tenantFilteredTools).forEach(([category, tools]) => {
      const matchingTools = tools.filter(
        (tool: any) =>
          tool.title.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.keywords.some((keyword: any) => keyword.toLowerCase().includes(query)),
      )

      if (matchingTools.length > 0) {
        searchFiltered[category] = matchingTools
      }
    })

    return searchFiltered
  }, [searchQuery, config.features.enabledTools, config.id])

  const renderToolCard = (tool: any) => {
    const Icon = tool.icon
    const borderColor =
      colorClasses[tool.color as keyof typeof colorClasses].split(" ")[0] +
      " " +
      colorClasses[tool.color as keyof typeof colorClasses].split(" ")[1]
    const iconBg =
      colorClasses[tool.color as keyof typeof colorClasses].split(" ")[2] +
      " " +
      colorClasses[tool.color as keyof typeof colorClasses].split(" ")[3]
    const buttonColor =
      colorClasses[tool.color as keyof typeof colorClasses].split(" ")[4] +
      " " +
      colorClasses[tool.color as keyof typeof colorClasses].split(" ")[5]

    const toolHref = typeof tool.href === "function" ? tool.href(config) : tool.href

    return (
      <Card key={tool.href} className={`h-full flex flex-col ${borderColor} transition-colors`}>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 ${iconBg} rounded-lg`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">{tool.title}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground">
            {tool.title === "RealDeal AI" &&
              "Upload and analyze real estate contracts for clear, professional summaries with key dates, financials, and important clauses highlighted."}
            {tool.title === "IdeaHub AI" &&
              "Generate engaging social media content ideas and posts tailored to your real estate business and target audience with AI-powered creativity."}
            {tool.title === "IdeaHub V2" &&
              "Advanced social media content generation with custom branding, logo overlays, and personalized contact information for professional social media posts."}
            {tool.title === "IdeaHub Empower" &&
              "Generate engaging social media content with support for multiple real estate brands. Choose from 18+ brand options including Keller Williams, RE/MAX, Coldwell Banker, and more."}
            {tool.title === "RealBio" &&
              "Create compelling, professional agent biographies that showcase your expertise, experience, and unique value proposition to attract more clients."}
            {tool.title === "ListIT" &&
              "Generate compelling property listing descriptions that highlight key features and attract potential buyers with persuasive, professional language."}
            {tool.title === "ScriptIT" &&
              "Create personalized scripts for prospecting calls, listing presentations, buyer consultations, and objection handling to improve your conversion rates."}
            {tool.title === "RolePlay AI" &&
              "Practice real estate conversations with AI-powered voice simulation. Perfect your scripts, handle objections, and build confidence through realistic roleplay scenarios."}
            {tool.title === "Action AI" &&
              "Get personalized daily action plans for prospecting activities, lead generation strategies, and business development tasks tailored to your goals and market."}
            {tool.title === "RealCoach AI" &&
              "Receive personalized business coaching and strategic advice powered by AI. Get insights on market trends, business growth strategies, and performance optimization."}
            {tool.title === "BizPlan AI" &&
              "Create a personalized 90-day business plan with specific daily targets, prospecting strategies, and actionable steps to reach your financial goals."}
            {tool.title === "QuickCMA AI" &&
              "Generate comprehensive comparative market analysis reports with comparable homes data, pricing insights, and professional AI-powered market summaries."}
            {tool.title === "MyMarket AI" &&
              "Analyze current housing and rental market trends, identify key indicators, and receive insights on market conditions to inform your real estate strategies."}
            {tool.title === "Who's Who AI" &&
              "Discover property owner information and contact details using advanced skip tracing technology with AI-powered professional summaries."}
            {tool.title === "PropBot AI" &&
              "Describe properties in natural language and let AI search, analyze, and present the best matches from active listings with detailed insights and voice search."}
            {tool.title === "GoalScreen AI" &&
              "Create personalized goal-focused wallpapers for your devices with motivational content, target tracking, and custom designs to keep you focused."}
          </p>
        </CardContent>
        <CardFooter>
          <Link href={toolHref} className="w-full">
            <Button className={`w-full ${buttonColor}`}>Open Tool</Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">AI Tools Hub</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Discover our complete suite of AI-powered tools designed to streamline your real estate business, from content
          creation to contract analysis and everything in between.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="What are you trying to accomplish? (e.g., 'write my bio', 'create content', 'find owner info', 'make a plan')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-green-500 rounded-lg"
            />
          </div>
          {searchQuery && <p className="text-sm text-gray-600 mt-2">Showing tools for: "{searchQuery}"</p>}
        </div>
      </div>

      {/* Tool Categories */}
      {Object.entries(filteredTools).map(([category, tools]) => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b-2 border-green-500 pb-2">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{tools.map(renderToolCard)}</div>
        </div>
      ))}

      {Object.keys(filteredTools).length === 0 && searchQuery && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No tools found</h3>
          <p className="text-gray-500 mb-4">Try searching for terms like:</p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <span className="bg-gray-100 px-3 py-1 rounded-full">"write"</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">"create"</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">"find"</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">"analyze"</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">"plan"</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">"generate"</span>
          </div>
        </div>
      )}
    </div>
  )
}
