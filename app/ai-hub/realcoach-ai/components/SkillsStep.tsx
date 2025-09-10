"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { 
  Award, 
  CheckCircle, 
  Star,
  Target,
  MessageSquare,
  FileText,
  Video,
  BarChart3,
  Users,
  Home,
  DollarSign,
  Phone,
  Mail,
  Share2,
  Calendar,
  Building2,
  TrendingUp,
  Lightbulb,
  AlertCircle,
  Info,
  BookOpen,
  PlayCircle,
  Eye,
  Zap,
  Camera,
  Clock
} from "lucide-react"
import { AgentProfile } from "../page"
import { useState } from "react"

interface SkillsStepProps {
  profile: AgentProfile
  updateProfile: (updates: Partial<AgentProfile>) => void
}

export default function SkillsStep({ profile, updateProfile }: SkillsStepProps) {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])

  const skillOptions = [
    {
      id: 'listing_presentation',
      title: 'Listing Presentation',
      description: 'Presenting your services to potential sellers',
      icon: Home,
      color: 'bg-blue-500'
    },
    {
      id: 'buyer_consultation',
      title: 'Buyer Consultation',
      description: 'Understanding buyer needs and qualifying',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      id: 'negotiation',
      title: 'Negotiation',
      description: 'Getting the best terms for your clients',
      icon: Target,
      color: 'bg-purple-500'
    },
    {
      id: 'pricing_strategy',
      title: 'Pricing Strategy',
      description: 'Accurate market analysis and pricing',
      icon: DollarSign,
      color: 'bg-yellow-500'
    },
    {
      id: 'scripts',
      title: 'Scripts & Objection Handling',
      description: 'Confident phone and in-person conversations',
      icon: MessageSquare,
      color: 'bg-pink-500'
    },
    {
      id: 'video',
      title: 'Video Marketing',
      description: 'Creating and using video content',
      icon: Video,
      color: 'bg-red-500'
    },
    {
      id: 'crm_usage',
      title: 'CRM Usage',
      description: 'Managing contacts and pipeline effectively',
      icon: BarChart3,
      color: 'bg-indigo-500'
    },
    {
      id: 'social_media',
      title: 'Social Media',
      description: 'Building presence and engagement online',
      icon: Share2,
      color: 'bg-cyan-500'
    },
    {
      id: 'email_marketing',
      title: 'Email Marketing',
      description: 'Creating effective email campaigns',
      icon: Mail,
      color: 'bg-orange-500'
    },
    {
      id: 'open_houses',
      title: 'Open Houses',
      description: 'Hosting and converting open house traffic',
      icon: Calendar,
      color: 'bg-teal-500'
    },
    {
      id: 'networking',
      title: 'Networking',
      description: 'Building relationships and referral sources',
      icon: Building2,
      color: 'bg-gray-500'
    },
    {
      id: 'time_management',
      title: 'Time Management',
      description: 'Prioritizing and organizing your day',
      icon: Clock,
      color: 'bg-amber-500'
    }
  ]

  const assetOptions = [
    {
      id: 'testimonials',
      title: 'Client Testimonials',
      description: 'Written reviews and video testimonials',
      icon: Star,
      color: 'bg-yellow-500'
    },
    {
      id: 'case_studies',
      title: 'Case Studies',
      description: 'Success stories and before/after examples',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      id: 'idx_website',
      title: 'IDX Website',
      description: 'Professional website with property search',
      icon: Home,
      color: 'bg-green-500'
    },
    {
      id: 'templates',
      title: 'Email Templates',
      description: 'Pre-written email sequences and campaigns',
      icon: Mail,
      color: 'bg-purple-500'
    },
    {
      id: 'vendor_partners',
      title: 'Vendor Partners',
      description: 'Lenders, inspectors, contractors, etc.',
      icon: Users,
      color: 'bg-orange-500'
    },
    {
      id: 'marketing_materials',
      title: 'Marketing Materials',
      description: 'Flyers, postcards, business cards',
      icon: FileText,
      color: 'bg-pink-500'
    },
    {
      id: 'video_content',
      title: 'Video Content Library',
      description: 'Market updates, property tours, tips',
      icon: Video,
      color: 'bg-red-500'
    },
    {
      id: 'social_media_presence',
      title: 'Social Media Presence',
      description: 'Active profiles on key platforms',
      icon: Share2,
      color: 'bg-cyan-500'
    },
    {
      id: 'crm_system',
      title: 'CRM System',
      description: 'Contact management and automation',
      icon: BarChart3,
      color: 'bg-indigo-500'
    },
    {
      id: 'professional_photos',
      title: 'Professional Photos',
      description: 'Headshots and property photography',
      icon: Camera,
      color: 'bg-teal-500'
    },
    {
      id: 'referral_network',
      title: 'Referral Network',
      description: 'Other agents and professionals',
      icon: Building2,
      color: 'bg-gray-500'
    },
    {
      id: 'market_reports',
      title: 'Market Reports',
      description: 'Regular market analysis and updates',
      icon: TrendingUp,
      color: 'bg-amber-500'
    }
  ]

  const handleSkillChange = (skillId: string, confidence: number) => {
    updateProfile({
      skills: {
        ...profile.skills,
        [skillId]: confidence
      }
    })
  }

  const handleAssetToggle = (assetId: string) => {
    const current = selectedAssets
    const updated = current.includes(assetId)
      ? current.filter(a => a !== assetId)
      : [...current, assetId]
    setSelectedAssets(updated)
    updateProfile({ assets: updated })
  }

  const getSkillLevel = (confidence: number) => {
    if (confidence >= 8) return { label: 'Expert', color: 'text-green-600' }
    if (confidence >= 6) return { label: 'Proficient', color: 'text-blue-600' }
    if (confidence >= 4) return { label: 'Developing', color: 'text-yellow-600' }
    return { label: 'Beginner', color: 'text-red-600' }
  }

  const getLowestSkills = () => {
    return Object.entries(profile.skills || {})
      .filter(([_, confidence]) => confidence < 6)
      .sort(([_, a], [__, b]) => a - b)
      .slice(0, 3)
      .map(([skillId, _]) => skillOptions.find(s => s.id === skillId))
      .filter(Boolean)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Award className="h-8 w-8 text-yellow-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Skills & Assets</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Let's assess your current capabilities and what resources you have to work with.
        </p>
      </div>

      {/* Skills Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-600" />
            Skills Confidence Assessment
          </CardTitle>
          <CardDescription>
            Rate your confidence level (1-10) for each skill area
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {skillOptions.map((skill) => {
            const Icon = skill.icon
            const confidence = profile.skills?.[skill.id] || 5
            const skillLevel = getSkillLevel(confidence)
            
            return (
              <div key={skill.id} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${skill.color} text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{skill.title}</h4>
                    <p className="text-gray-600 text-sm">{skill.description}</p>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${skillLevel.color}`}>
                      {confidence}/10
                    </div>
                    <div className="text-xs text-gray-500">
                      {skillLevel.label}
                    </div>
                  </div>
                </div>
                
                <div className="ml-12">
                  <Slider
                    value={[confidence]}
                    onValueChange={([value]) => handleSkillChange(skill.id, value)}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Beginner (1)</span>
                    <span>Expert (10)</span>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Assets Inventory */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-6 w-6 text-green-600" />
            Your Marketing Assets
          </CardTitle>
          <CardDescription>
            What resources do you already have that we can leverage?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assetOptions.map((asset) => {
              const Icon = asset.icon
              const isSelected = selectedAssets.includes(asset.id)
              
              return (
                <Card 
                  key={asset.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? 'ring-2 ring-green-500 bg-green-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleAssetToggle(asset.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${asset.color} text-white`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm">{asset.title}</h4>
                        <p className="text-gray-600 text-xs">{asset.description}</p>
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
        </CardContent>
      </Card>

      {/* Skill Gaps Analysis */}
      {getLowestSkills().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-orange-600" />
              Focus Areas for Development
            </CardTitle>
            <CardDescription>
              These are your lowest confidence areas - we'll include micro-training for these
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getLowestSkills().map((skill) => {
                if (!skill) return null
                const Icon = skill.icon
                const confidence = profile.skills?.[skill.id] || 0
                
                return (
                  <div key={skill.id} className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg">
                    <div className={`p-2 rounded-lg ${skill.color} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{skill.title}</h4>
                      <p className="text-gray-600 text-sm">Current confidence: {confidence}/10</p>
                    </div>
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      Needs Focus
                    </Badge>
                  </div>
                )
              })}
            </div>
            
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Micro-Training Plan</h4>
                  <p className="text-blue-800 text-sm">
                    I'll include 10-minute daily drills for your focus areas. Small, consistent practice 
                    is more effective than long training sessions you might skip.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Asset Leverage Strategy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-purple-600" />
            Asset Leverage Strategy
          </CardTitle>
          <CardDescription>
            How we'll use your existing resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedAssets.map((assetId) => {
              const asset = assetOptions.find(a => a.id === assetId)
              if (!asset) return null
              
              const strategies = {
                'testimonials': 'Feature in marketing materials and social media',
                'case_studies': 'Use in listing presentations and buyer consultations',
                'idx_website': 'Drive traffic from all marketing efforts',
                'templates': 'Automate follow-up sequences and nurture campaigns',
                'vendor_partners': 'Create referral partnerships and co-marketing',
                'marketing_materials': 'Distribute through chosen channels',
                'video_content': 'Repurpose across all platforms and touchpoints',
                'social_media_presence': 'Amplify all content and build engagement',
                'crm_system': 'Track and nurture all leads systematically',
                'professional_photos': 'Use in all marketing and social media',
                'referral_network': 'Activate for cross-referrals and partnerships',
                'market_reports': 'Share regularly to demonstrate expertise'
              }
              
              const strategy = strategies[assetId as keyof typeof strategies] || 'Integrate into marketing plan'
              
              return (
                <div key={assetId} className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
                  <div className={`p-2 rounded-lg ${asset.color} text-white`}>
                    <asset.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{asset.title}</h4>
                    <p className="text-gray-600 text-sm">{strategy}</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Why This Matters */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Info className="h-6 w-6 text-gray-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Why This Assessment Matters</h4>
            <p className="text-gray-700 text-sm mb-3">
              I need to understand your capabilities so I can:
            </p>
            <ul className="text-gray-700 text-sm space-y-1">
              <li>• Focus your training on areas that need the most improvement</li>
              <li>• Leverage your existing assets to maximize impact</li>
              <li>• Build confidence through small, achievable skill improvements</li>
              <li>• Avoid overwhelming you with activities you're not ready for</li>
              <li>• Create a plan that builds on your strengths</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
