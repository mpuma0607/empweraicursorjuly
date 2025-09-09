"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTenantConfig } from "@/contexts/tenant-context"
import { isToolEnabled } from "@/lib/tenant-config"
import { resourceCenterByTenant, type ResourceItem, type ResourceSection } from "@/lib/resource-center.config"
import { 
  Search, 
  HelpCircle, 
  Lightbulb, 
  Star, 
  Calendar,
  ArrowRight,
  BookOpen,
  Brain,
  Megaphone,
  Target,
  GraduationCap,
  Users,
  Settings,
  FileText,
  User,
  Home,
  MessageSquare,
  Mic,
  Calculator,
  Image,
  TrendingUp,
  Building2,
  Waves,
  Share2,
  Monitor,
  Video,
  Zap
} from "lucide-react"

export default function ResourceCenterPage() {
  const tenantConfig = useTenantConfig()
  const [searchQuery, setSearchQuery] = useState("")
  
  // Get tenant-specific resource configuration
  const resourceConfig = resourceCenterByTenant[tenantConfig.id] || resourceCenterByTenant["empower-ai"]
  
  // Filter resources based on tool enablement and search
  const filteredSections = useMemo(() => {
    return resourceConfig.sections.map(section => ({
      ...section,
      items: section.items
        .filter(item => {
          // Filter by tool enablement if toolId exists
          if (item.toolId && !isToolEnabled(item.toolId, tenantConfig)) {
            return false
          }
          
          // Filter by search query
          if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            return (
              item.title.toLowerCase().includes(query) ||
              item.description.toLowerCase().includes(query) ||
              item.keywords.some(keyword => keyword.toLowerCase().includes(query))
            )
          }
          
          return true
        })
        .sort((a, b) => a.priority - b.priority) // Sort by priority
    })).filter(section => section.items.length > 0) // Only show sections with items
  }, [resourceConfig, tenantConfig, searchQuery])

  const totalResults = filteredSections.reduce((sum, section) => sum + section.items.length, 0)

  const quickActions = [
    {
      title: "Report a Bug",
      description: "Help us improve by reporting issues",
      href: "/support?type=bug",
      icon: HelpCircle,
      color: "bg-red-500"
    },
    {
      title: "Request a Feature",
      description: "Suggest new features or improvements",
      href: "/support?type=feature",
      icon: Lightbulb,
      color: "bg-blue-500"
    },
    {
      title: "Training Calendar",
      description: "View upcoming training sessions",
      href: "/training-hub",
      icon: Calendar,
      color: "bg-green-500"
    }
  ]

  const renderResourceCard = (item: ResourceItem) => {
    const Icon = item.icon
    return (
      <Link key={item.id} href={item.href} className="group">
        <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md group-hover:-translate-y-1">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                <Icon className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 line-clamp-2 mt-1">
                  {item.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {item.tenantSpecific && (
                  <Badge variant="outline" className="text-xs">
                    {tenantConfig.name}
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs">
                  {item.category}
                </Badge>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <BookOpen className="h-4 w-4" />
            Resource Center
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {tenantConfig.name} Resource Center
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Everything you need to succeed in real estate. Find tools, training, and resources tailored for {tenantConfig.name}.
          </p>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search resources, tools, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
              />
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-600 mt-2">
                {totalResults} result{totalResults !== 1 ? 's' : ''} found
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link key={index} href={action.href}>
                  <Button variant="outline" className="h-auto p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${action.color} text-white`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-xs text-gray-600">{action.description}</div>
                      </div>
                    </div>
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Resource Sections */}
        {filteredSections.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or browse all resources.
            </p>
            <Button 
              onClick={() => setSearchQuery("")}
              variant="outline"
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredSections.map((section) => (
              <div key={section.id}>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{section.title}</h2>
                  <p className="text-gray-600">{section.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.items.map(renderResourceCard)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl p-8 shadow-sm border">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Need more help?</h3>
            <p className="text-gray-600 mb-4">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <Link href="/support">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <HelpCircle className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
