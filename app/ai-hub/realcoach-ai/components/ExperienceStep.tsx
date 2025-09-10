"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { 
  TrendingUp, 
  Users, 
  Home, 
  MessageSquare,
  Calendar,
  Building2,
  Star,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  BarChart3,
  Target,
  Award,
  Phone,
  Mail,
  Share2,
  Video,
  FileText,
  AlertCircle,
  Info
} from "lucide-react"
import { AgentProfile } from "../page"
import { useState } from "react"

interface ExperienceStepProps {
  profile: AgentProfile
  updateProfile: (updates: Partial<AgentProfile>) => void
}

export default function ExperienceStep({ profile, updateProfile }: ExperienceStepProps) {
  const [selectedSources, setSelectedSources] = useState<string[]>([])

  const sourceOptions = [
    {
      id: 'soi_referrals',
      title: 'SOI & Referrals',
      description: 'Sphere of influence and past client referrals',
      icon: Users,
      color: 'bg-blue-500',
      effort: 'Low',
      roi: 'High'
    },
    {
      id: 'past_clients',
      title: 'Past Clients',
      description: 'Repeat business and referrals from past clients',
      icon: Star,
      color: 'bg-yellow-500',
      effort: 'Low',
      roi: 'High'
    },
    {
      id: 'open_houses',
      title: 'Open Houses',
      description: 'Prospecting at open houses and events',
      icon: Home,
      color: 'bg-green-500',
      effort: 'Medium',
      roi: 'Medium'
    },
    {
      id: 'online_leads',
      title: 'Online Leads',
      description: 'Zillow, Realtor.com, and other online platforms',
      icon: Share2,
      color: 'bg-purple-500',
      effort: 'High',
      roi: 'Medium'
    },
    {
      id: 'farming',
      title: 'Geographic Farming',
      description: 'Targeting specific neighborhoods or areas',
      icon: Building2,
      color: 'bg-orange-500',
      effort: 'High',
      roi: 'High'
    },
    {
      id: 'social_dm',
      title: 'Social Media DMs',
      description: 'Direct messaging on social platforms',
      icon: MessageSquare,
      color: 'bg-pink-500',
      effort: 'Medium',
      roi: 'Medium'
    },
    {
      id: 'fsbo_expired',
      title: 'FSBO & Expireds',
      description: 'For Sale By Owner and expired listings',
      icon: Target,
      color: 'bg-red-500',
      effort: 'High',
      roi: 'High'
    },
    {
      id: 'events',
      title: 'Events & Networking',
      description: 'Community events, networking, and meetups',
      icon: Calendar,
      color: 'bg-indigo-500',
      effort: 'Medium',
      roi: 'Medium'
    },
    {
      id: 'sphere_handraisers',
      title: 'Sphere Handraisers',
      description: 'People in your network who are ready to buy/sell',
      icon: Phone,
      color: 'bg-teal-500',
      effort: 'Low',
      roi: 'High'
    },
    {
      id: 'renters_buyers',
      title: 'Renters to Buyers',
      description: 'Converting renters into first-time buyers',
      icon: Home,
      color: 'bg-cyan-500',
      effort: 'Medium',
      roi: 'Medium'
    },
    {
      id: 'investors',
      title: 'Investor Outreach',
      description: 'Working with real estate investors',
      icon: Building2,
      color: 'bg-gray-500',
      effort: 'High',
      roi: 'High'
    }
  ]

  const strengthOptions = [
    'Negotiation skills',
    'Market knowledge',
    'Client communication',
    'Pricing strategy',
    'Marketing expertise',
    'Technology proficiency',
    'Problem solving',
    'Time management',
    'Relationship building',
    'Contract expertise',
    'Inspection knowledge',
    'Financing guidance',
    'Staging advice',
    'Photography skills',
    'Video marketing',
    'Social media presence',
    'Community involvement',
    'Professional network',
    'Attention to detail',
    'Patience and empathy'
  ]

  const crmOptions = [
    { id: 'none', label: 'No CRM', description: 'Using basic tools or nothing' },
    { id: 'basic', label: 'Basic CRM', description: 'Simple contact management' },
    { id: 'advanced', label: 'Advanced CRM', description: 'Full pipeline and automation' }
  ]

  const handleSourceToggle = (sourceId: string) => {
    const current = selectedSources
    const updated = current.includes(sourceId)
      ? current.filter(s => s !== sourceId)
      : [...current, sourceId]
    setSelectedSources(updated)
    
    // Update closings by source (initialize with 0 if not set)
    const currentClosings = profile.closingsBySource || {}
    updateProfile({
      closingsBySource: {
        ...currentClosings,
        [sourceId]: currentClosings[sourceId] || 0
      }
    })
  }

  const handleClosingCount = (sourceId: string, count: number) => {
    updateProfile({
      closingsBySource: {
        ...profile.closingsBySource,
        [sourceId]: count
      }
    })
  }

  const handleStrengthToggle = (strength: string) => {
    const current = profile.uniqueStrengths || []
    const updated = current.includes(strength)
      ? current.filter(s => s !== strength)
      : [...current, strength]
    updateProfile({ uniqueStrengths: updated })
  }

  const handleCrmChange = (crm: 'none' | 'basic' | 'advanced') => {
    updateProfile({ crmStatus: crm })
  }

  const handleDatabaseSizeChange = (size: number) => {
    updateProfile({ databaseSize: size })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center" data-step-header>
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">What's Worked Before</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Let's look at your experience and what's been successful for you in the past.
        </p>
      </div>

      {/* Database & CRM */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Your Database & Systems
          </CardTitle>
          <CardDescription>
            Understanding your current infrastructure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-base font-medium">
                How many contacts are in your database?
              </Label>
              <div className="mt-2">
                <Slider
                  value={[profile.databaseSize]}
                  onValueChange={([value]) => handleDatabaseSizeChange(value)}
                  max={2000}
                  min={0}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>0</span>
                  <span className="font-semibold">{profile.databaseSize} contacts</span>
                  <span>2000</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">
                What's your CRM situation?
              </Label>
              <div className="mt-2 space-y-2">
                {crmOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant={profile.crmStatus === option.id ? "default" : "outline"}
                    className={`w-full justify-start ${
                      profile.crmStatus === option.id ? 'bg-blue-600 hover:bg-blue-700' : ''
                    }`}
                    onClick={() => handleCrmChange(option.id as any)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm opacity-80">{option.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lead Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-green-600" />
            Your Lead Sources
          </CardTitle>
          <CardDescription>
            Where have your closings come from in the past 12 months?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sourceOptions.map((source) => {
              const Icon = source.icon
              const isSelected = selectedSources.includes(source.id)
              const closingCount = profile.closingsBySource?.[source.id] || 0
              
              return (
                <Card 
                  key={source.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? 'ring-2 ring-green-500 bg-green-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSourceToggle(source.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${source.color} text-white`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm">{source.title}</h4>
                        <p className="text-gray-600 text-xs mb-2">{source.description}</p>
                        <div className="flex gap-1 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {source.effort} effort
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {source.roi} ROI
                          </Badge>
                        </div>
                        {isSelected && (
                          <div className="flex items-center gap-2">
                            <Label className="text-xs text-gray-600">Closings:</Label>
                            <Input
                              type="number"
                              value={closingCount}
                              onChange={(e) => handleClosingCount(source.id, parseInt(e.target.value) || 0)}
                              className="w-16 h-6 text-xs"
                              min="0"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        )}
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

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900">Don't Remember Exact Numbers?</span>
            </div>
            <p className="text-blue-800 text-sm">
              No problem! Just estimate. We'll track your actual performance going forward and adjust your plan accordingly.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Unique Strengths */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-purple-600" />
            Your Unique Strengths
          </CardTitle>
          <CardDescription>
            What would your best client say you do exceptionally well?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {strengthOptions.map((strength) => {
              const isSelected = profile.uniqueStrengths?.includes(strength) || false
              return (
                <Button
                  key={strength}
                  variant={isSelected ? "default" : "outline"}
                  className={`justify-start h-auto p-3 text-left ${
                    isSelected ? 'bg-purple-600 hover:bg-purple-700' : ''
                  }`}
                  onClick={() => handleStrengthToggle(strength)}
                >
                  <div className="flex items-center gap-2">
                    {isSelected ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-300 rounded" />
                    )}
                    <span className="text-sm">{strength}</span>
                  </div>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Experience Insights */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-6 w-6 text-gray-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Why This Matters</h4>
            <p className="text-gray-700 text-sm mb-3">
              I'm looking for patterns in what's worked for you so I can:
            </p>
            <ul className="text-gray-700 text-sm space-y-1">
              <li>• Focus your plan on channels that have proven ROI</li>
              <li>• Avoid suggesting activities that haven't worked</li>
              <li>• Leverage your strengths in your marketing and positioning</li>
              <li>• Build on your existing systems rather than starting from scratch</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
