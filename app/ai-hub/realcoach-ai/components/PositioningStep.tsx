"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Building2, 
  Target, 
  Star,
  MapPin,
  Users,
  Home,
  TrendingUp,
  DollarSign,
  Heart,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  MessageSquare,
  BarChart3,
  Award,
  Info,
  AlertCircle,
  Zap
} from "lucide-react"
import { AgentProfile } from "../page"
import { useState } from "react"

interface PositioningStepProps {
  profile: AgentProfile
  updateProfile: (updates: Partial<AgentProfile>) => void
}

export default function PositioningStep({ profile, updateProfile }: PositioningStepProps) {
  const [selectedSegments, setSelectedSegments] = useState<string[]>([])

  const segmentOptions = [
    {
      id: 'first_time_buyers',
      title: 'First-Time Buyers',
      description: 'Helping first-time buyers navigate the process',
      icon: Home,
      color: 'bg-blue-500',
      characteristics: ['Education-focused', 'Hand-holding', 'Financing guidance']
    },
    {
      id: 'move_up_families',
      title: 'Move-Up Families',
      description: 'Families looking to upgrade their home',
      icon: Users,
      color: 'bg-green-500',
      characteristics: ['Space needs', 'School districts', 'Timing coordination']
    },
    {
      id: 'luxury',
      title: 'Luxury Market',
      description: 'High-end properties and affluent clients',
      icon: Star,
      color: 'bg-purple-500',
      characteristics: ['Discretion', 'Exclusivity', 'Premium service']
    },
    {
      id: 'relocation',
      title: 'Relocation',
      description: 'Clients moving to or from the area',
      icon: MapPin,
      color: 'bg-orange-500',
      characteristics: ['Market knowledge', 'Area expertise', 'Remote service']
    },
    {
      id: 'investors',
      title: 'Real Estate Investors',
      description: 'Buy and hold, fix and flip, BRRRR strategies',
      icon: TrendingUp,
      color: 'bg-yellow-500',
      characteristics: ['Numbers-focused', 'Quick decisions', 'Portfolio building']
    },
    {
      id: 'new_construction',
      title: 'New Construction',
      description: 'New builds and pre-construction sales',
      icon: Building2,
      color: 'bg-red-500',
      characteristics: ['Builder relationships', 'Timeline management', 'Warranty knowledge']
    },
    {
      id: 'va_clients',
      title: 'VA Clients',
      description: 'Military and veteran homebuyers',
      icon: Award,
      color: 'bg-indigo-500',
      characteristics: ['VA loan expertise', 'Military understanding', 'Relocation support']
    },
    {
      id: 'seniors_55_plus',
      title: '55+ Community',
      description: 'Active adult and senior living',
      icon: Heart,
      color: 'bg-pink-500',
      characteristics: ['Downsizing', 'Accessibility', 'Lifestyle changes']
    },
    {
      id: 'geo_farm',
      title: 'Geographic Farming',
      description: 'Specific neighborhoods or areas',
      icon: MapPin,
      color: 'bg-teal-500',
      characteristics: ['Local expertise', 'Community involvement', 'Market dominance']
    }
  ]

  const uspCategories = [
    {
      id: 'service',
      title: 'Service Excellence',
      description: 'Outstanding client care and attention',
      examples: ['24/7 availability', 'White-glove service', 'Personalized approach']
    },
    {
      id: 'expertise',
      title: 'Market Expertise',
      description: 'Deep local market knowledge',
      examples: ['Neighborhood specialist', 'Market trends expert', 'Pricing accuracy']
    },
    {
      id: 'technology',
      title: 'Technology & Innovation',
      description: 'Cutting-edge tools and processes',
      examples: ['Virtual tours', 'AI-powered marketing', 'Digital contracts']
    },
    {
      id: 'negotiation',
      title: 'Negotiation Skills',
      description: 'Getting the best deals for clients',
      examples: ['Deal savers', 'Price optimization', 'Contract expertise']
    },
    {
      id: 'network',
      title: 'Professional Network',
      description: 'Strong vendor and referral relationships',
      examples: ['Preferred lenders', 'Quality contractors', 'Referral partners']
    },
    {
      id: 'communication',
      title: 'Communication',
      description: 'Clear, consistent, and responsive',
      examples: ['Regular updates', 'Proactive communication', 'Multiple channels']
    }
  ]

  const handleSegmentToggle = (segmentId: string) => {
    const current = selectedSegments
    const updated = current.includes(segmentId)
      ? current.filter(s => s !== segmentId)
      : [...current, segmentId]
    setSelectedSegments(updated)
    updateProfile({ targetSegments: updated })
  }

  const handleUspChange = (usp: string) => {
    updateProfile({ usp: usp })
  }

  const handleGeographicFocusChange = (focus: string) => {
    updateProfile({ geographicFocus: focus })
  }

  const getSegmentInsights = () => {
    if (selectedSegments.length === 0) return null

    const insights = {
      'first_time_buyers': 'Focus on education, financing, and hand-holding. Great for building long-term relationships.',
      'move_up_families': 'Emphasize space planning, school districts, and timing coordination. Often have equity to work with.',
      'luxury': 'Requires discretion, exclusivity, and premium service. Higher price points but more demanding clients.',
      'relocation': 'Need strong market knowledge and remote service capabilities. Often time-sensitive.',
      'investors': 'Numbers-focused and quick decisions. Build relationships with lenders and contractors.',
      'new_construction': 'Requires builder relationships and timeline management. Often pre-construction sales.',
      'va_clients': 'Need VA loan expertise and military understanding. Often relocation-based.',
      'seniors_55_plus': 'Focus on downsizing, accessibility, and lifestyle changes. Often cash buyers.',
      'geo_farm': 'Build deep local expertise and community involvement. Become the neighborhood expert.'
    }

    return selectedSegments.map(segmentId => ({
      segment: segmentOptions.find(s => s.id === segmentId),
      insight: insights[segmentId as keyof typeof insights]
    })).filter(Boolean)
  }

  const segmentInsights = getSegmentInsights()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center" data-step-header>
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Market Positioning</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Let's define your target market and what makes you unique in your space.
        </p>
      </div>

      {/* Target Segments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-green-600" />
            Your Target Market Segments
          </CardTitle>
          <CardDescription>
            Which types of clients do you want to focus on? (Select 1-3 for best results)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {segmentOptions.map((segment) => {
              const Icon = segment.icon
              const isSelected = selectedSegments.includes(segment.id)
              
              return (
                <Card 
                  key={segment.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? 'ring-2 ring-green-500 bg-green-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSegmentToggle(segment.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${segment.color} text-white`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm mb-2">{segment.title}</h4>
                        <p className="text-gray-600 text-xs mb-3">{segment.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {segment.characteristics.map((char, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {char}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {selectedSegments.length > 3 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-900">Focus Recommendation</span>
              </div>
              <p className="text-yellow-800 text-sm">
                You've selected {selectedSegments.length} segments. Consider focusing on 1-3 for better results. 
                It's better to be excellent with a few segments than mediocre with many.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Segment Insights */}
      {segmentInsights && segmentInsights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-blue-600" />
              Segment Strategy Insights
            </CardTitle>
            <CardDescription>
              Based on your selected segments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {segmentInsights.map((insight, index) => {
                if (!insight?.segment) return null
                const Icon = insight.segment.icon
                
                return (
                  <div key={index} className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                    <div className={`p-2 rounded-lg ${insight.segment.color} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{insight.segment.title}</h4>
                      <p className="text-gray-700 text-sm">{insight.insight}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Unique Selling Proposition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-6 w-6 text-purple-600" />
            Your Unique Selling Proposition
          </CardTitle>
          <CardDescription>
            What makes you different from other agents in your market?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-3 block">
              What would your best client say you do exceptionally well?
            </Label>
            <Textarea
              placeholder="Describe what makes you unique in your market..."
              value={profile.usp}
              onChange={(e) => handleUspChange(e.target.value)}
              className="min-h-[100px] text-base"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uspCategories.map((category) => (
              <Card key={category.id} className="hover:bg-gray-50 cursor-pointer">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{category.title}</h4>
                  <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                  <div className="space-y-1">
                    {category.examples.map((example, index) => (
                      <div key={index} className="text-xs text-gray-500">• {example}</div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Geographic Focus */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-orange-600" />
            Geographic Focus
          </CardTitle>
          <CardDescription>
            What areas do you want to specialize in?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">
                Primary market areas (cities, neighborhoods, zip codes)
              </Label>
              <Input
                placeholder="e.g., Downtown Seattle, Bellevue, Kirkland, 98004, 98005..."
                value={profile.geographicFocus}
                onChange={(e) => handleGeographicFocusChange(e.target.value)}
                className="mt-2"
              />
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-5 w-5 text-orange-600" />
                <span className="font-medium text-orange-900">Geographic Strategy</span>
              </div>
              <p className="text-orange-800 text-sm">
                Focus on 2-3 specific areas where you can become the recognized expert. 
                This helps with referrals, market knowledge, and brand recognition.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Positioning Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-indigo-600" />
            Your Positioning Summary
          </CardTitle>
          <CardDescription>
            How you'll be positioned in the market
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Target Segments</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSegments.map((segmentId) => {
                    const segment = segmentOptions.find(s => s.id === segmentId)
                    return segment ? (
                      <Badge key={segmentId} variant="secondary">
                        {segment.title}
                      </Badge>
                    ) : null
                  })}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Geographic Focus</h4>
                <p className="text-gray-700 text-sm">
                  {profile.geographicFocus || 'Not specified'}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Your USP</h4>
              <p className="text-gray-700 text-sm">
                {profile.usp || 'Not defined yet'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Why This Matters */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Zap className="h-6 w-6 text-gray-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Why Positioning Matters</h4>
            <p className="text-gray-700 text-sm mb-3">
              Clear positioning helps you:
            </p>
            <ul className="text-gray-700 text-sm space-y-1">
              <li>• Attract the right clients who value what you offer</li>
              <li>• Stand out in a crowded market</li>
              <li>• Build expertise and credibility in specific areas</li>
              <li>• Create targeted marketing messages that resonate</li>
              <li>• Charge premium prices for specialized service</li>
              <li>• Build a referral network of complementary professionals</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
