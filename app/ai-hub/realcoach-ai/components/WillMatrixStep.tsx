"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { 
  Shield, 
  CheckCircle, 
  XCircle,
  Clock,
  DollarSign,
  Zap,
  Heart,
  AlertTriangle,
  Lightbulb,
  Target,
  Users,
  MessageSquare,
  Home,
  Calendar,
  Phone,
  Mail,
  Share2,
  Video,
  FileText,
  Building2,
  Star,
  TrendingUp,
  BarChart3,
  Award,
  Info
} from "lucide-react"
import { AgentProfile } from "../page"
import { useState } from "react"

interface WillMatrixStepProps {
  profile: AgentProfile
  updateProfile: (updates: Partial<AgentProfile>) => void
}

export default function WillMatrixStep({ profile, updateProfile }: WillMatrixStepProps) {
  const [matrixView, setMatrixView] = useState<'willing' | 'hard-nos' | 'energizing' | 'draining'>('willing')

  const activityOptions = [
    {
      id: 'calls_texts',
      title: 'Calls & Texts',
      description: 'Phone calls and text messaging',
      icon: Phone,
      color: 'bg-green-500'
    },
    {
      id: 'social_dms',
      title: 'Social Media DMs',
      description: 'Direct messaging on social platforms',
      icon: MessageSquare,
      color: 'bg-blue-500'
    },
    {
      id: 'open_houses',
      title: 'Open Houses',
      description: 'Hosting and attending open houses',
      icon: Home,
      color: 'bg-purple-500'
    },
    {
      id: 'door_knocking',
      title: 'Door Knocking',
      description: 'Going door-to-door in neighborhoods',
      icon: Building2,
      color: 'bg-red-500'
    },
    {
      id: 'events',
      title: 'Events & Networking',
      description: 'Community events and networking',
      icon: Calendar,
      color: 'bg-orange-500'
    },
    {
      id: 'short_form_video',
      title: 'Short-Form Video',
      description: 'TikTok, Instagram Reels, YouTube Shorts',
      icon: Video,
      color: 'bg-pink-500'
    },
    {
      id: 'long_form_video',
      title: 'Long-Form Video',
      description: 'YouTube videos, webinars, tutorials',
      icon: Video,
      color: 'bg-indigo-500'
    },
    {
      id: 'mailers',
      title: 'Mailers & Postcards',
      description: 'Direct mail marketing',
      icon: Mail,
      color: 'bg-yellow-500'
    },
    {
      id: 'farming',
      title: 'Geographic Farming',
      description: 'Targeting specific neighborhoods',
      icon: Target,
      color: 'bg-teal-500'
    },
    {
      id: 'fsbo_expired',
      title: 'FSBO & Expireds',
      description: 'For Sale By Owner and expired listings',
      icon: AlertTriangle,
      color: 'bg-red-600'
    },
    {
      id: 'investor_outreach',
      title: 'Investor Outreach',
      description: 'Working with real estate investors',
      icon: TrendingUp,
      color: 'bg-gray-500'
    },
    {
      id: 'content_creation',
      title: 'Content Creation',
      description: 'Blogs, articles, social media posts',
      icon: FileText,
      color: 'bg-cyan-500'
    },
    {
      id: 'referral_asks',
      title: 'Referral Asks',
      description: 'Asking for referrals from clients',
      icon: Star,
      color: 'bg-amber-500'
    }
  ]

  const handleActivityToggle = (activityId: string, category: keyof Pick<AgentProfile, 'willingActivities' | 'hardNos' | 'energizingActivities' | 'drainingActivities'>) => {
    const current = profile[category] || []
    const updated = current.includes(activityId)
      ? current.filter(a => a !== activityId)
      : [...current, activityId]
    
    updateProfile({ [category]: updated })
  }

  const handleTimeChange = (hours: number) => {
    updateProfile({ hoursPerWeek: hours })
  }

  const handleBudgetChange = (budget: number) => {
    updateProfile({ marketingBudget: budget })
  }

  const getActivityStatus = (activityId: string) => {
    return {
      willing: profile.willingActivities?.includes(activityId) || false,
      hardNo: profile.hardNos?.includes(activityId) || false,
      energizing: profile.energizingActivities?.includes(activityId) || false,
      draining: profile.drainingActivities?.includes(activityId) || false
    }
  }

  const getMatrixCount = (category: keyof Pick<AgentProfile, 'willingActivities' | 'hardNos' | 'energizingActivities' | 'drainingActivities'>) => {
    return profile[category]?.length || 0
  }

  const renderActivityGrid = (category: keyof Pick<AgentProfile, 'willingActivities' | 'hardNos' | 'energizingActivities' | 'drainingActivities'>) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activityOptions.map((activity) => {
          const Icon = activity.icon
          const isSelected = profile[category]?.includes(activity.id) || false
          
          return (
            <Card 
              key={activity.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleActivityToggle(activity.id, category)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${activity.color} text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm">{activity.title}</h4>
                    <p className="text-gray-600 text-xs">{activity.description}</p>
                  </div>
                  {isSelected && (
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="h-8 w-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Will/Will-Not Matrix</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Let's be honest about what you're willing to do and what's completely off the table.
        </p>
      </div>

      {/* Matrix Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-purple-600" />
            Activity Preferences
          </CardTitle>
          <CardDescription>
            Categorize each activity based on your preferences and constraints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Button
              variant={matrixView === 'willing' ? 'default' : 'outline'}
              className={`flex items-center gap-2 ${
                matrixView === 'willing' ? 'bg-green-600 hover:bg-green-700' : ''
              }`}
              onClick={() => setMatrixView('willing')}
            >
              <CheckCircle className="h-4 w-4" />
              Willing ({getMatrixCount('willingActivities')})
            </Button>
            <Button
              variant={matrixView === 'hard-nos' ? 'default' : 'outline'}
              className={`flex items-center gap-2 ${
                matrixView === 'hard-nos' ? 'bg-red-600 hover:bg-red-700' : ''
              }`}
              onClick={() => setMatrixView('hard-nos')}
            >
              <XCircle className="h-4 w-4" />
              Hard No ({getMatrixCount('hardNos')})
            </Button>
            <Button
              variant={matrixView === 'energizing' ? 'default' : 'outline'}
              className={`flex items-center gap-2 ${
                matrixView === 'energizing' ? 'bg-yellow-600 hover:bg-yellow-700' : ''
              }`}
              onClick={() => setMatrixView('energizing')}
            >
              <Zap className="h-4 w-4" />
              Energizing ({getMatrixCount('energizingActivities')})
            </Button>
            <Button
              variant={matrixView === 'draining' ? 'default' : 'outline'}
              className={`flex items-center gap-2 ${
                matrixView === 'draining' ? 'bg-gray-600 hover:bg-gray-700' : ''
              }`}
              onClick={() => setMatrixView('draining')}
            >
              <AlertTriangle className="h-4 w-4" />
              Draining ({getMatrixCount('drainingActivities')})
            </Button>
          </div>

          {/* Matrix Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">
                  {matrixView === 'willing' && 'Willing to Do'}
                  {matrixView === 'hard-nos' && 'Hard No - Never'}
                  {matrixView === 'energizing' && 'Energizes Me'}
                  {matrixView === 'draining' && 'Drains My Energy'}
                </h4>
                <p className="text-blue-800 text-sm">
                  {matrixView === 'willing' && 'Activities you\'re open to doing regularly'}
                  {matrixView === 'hard-nos' && 'Activities you absolutely won\'t do, no matter what'}
                  {matrixView === 'energizing' && 'Activities that give you energy and motivation'}
                  {matrixView === 'draining' && 'Activities that exhaust you or demotivate you'}
                </p>
              </div>
            </div>
          </div>

          {/* Activity Grid */}
          {renderActivityGrid(
            matrixView === 'willing' ? 'willingActivities' :
            matrixView === 'hard-nos' ? 'hardNos' :
            matrixView === 'energizing' ? 'energizingActivities' :
            'drainingActivities'
          )}
        </CardContent>
      </Card>

      {/* Time & Budget Constraints */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-orange-600" />
            Your Constraints
          </CardTitle>
          <CardDescription>
            Realistic time and budget for business development
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-base font-medium">
                How many hours per week can you dedicate to prospecting and business development?
              </Label>
              <div className="mt-2">
                <Slider
                  value={[profile.hoursPerWeek]}
                  onValueChange={([value]) => handleTimeChange(value)}
                  max={40}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>0 hours</span>
                  <span className="font-semibold">{profile.hoursPerWeek} hours/week</span>
                  <span>40 hours</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">
                What's your monthly marketing budget?
              </Label>
              <div className="mt-2">
                <Slider
                  value={[profile.marketingBudget]}
                  onValueChange={([value]) => handleBudgetChange(value)}
                  max={2000}
                  min={0}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>$0</span>
                  <span className="font-semibold">${profile.marketingBudget}/month</span>
                  <span>$2000</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span className="font-medium text-yellow-900">Be Honest</span>
            </div>
            <p className="text-yellow-800 text-sm">
              It's better to set realistic constraints now than to create a plan you can't follow through on. 
              We can always increase these as you build momentum.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Alternative Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-green-600" />
            Smart Alternatives
          </CardTitle>
          <CardDescription>
            For every "hard no," there's usually a functionally equivalent alternative
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profile.hardNos?.map((hardNo) => {
              const activity = activityOptions.find(a => a.id === hardNo)
              if (!activity) return null

              const alternatives = {
                'door_knocking': 'Community events + neighbor DM playbook',
                'cold_calling': 'Warm referrals + social media outreach',
                'social_dms': 'Email sequences + content marketing',
                'open_houses': 'Virtual tours + video content',
                'mailers': 'Digital marketing + social media ads',
                'fsbo_expired': 'Referral network + past client reactivation'
              }

              const alternative = alternatives[hardNo as keyof typeof alternatives] || 'Referral-based approach'

              return (
                <div key={hardNo} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <span className="font-medium text-gray-900">{activity.title}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{alternative}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Why This Matters */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Heart className="h-6 w-6 text-gray-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Why This Matrix Matters</h4>
            <p className="text-gray-700 text-sm mb-3">
              I need to know your constraints so I can:
            </p>
            <ul className="text-gray-700 text-sm space-y-1">
              <li>• Only suggest activities you'll actually do</li>
              <li>• Focus on channels that energize you (not drain you)</li>
              <li>• Respect your boundaries and values</li>
              <li>• Find creative alternatives for your "hard nos"</li>
              <li>• Build a plan that fits your lifestyle and preferences</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
