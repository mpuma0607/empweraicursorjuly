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
  Info,
  ArrowRight
} from "lucide-react"
import { AgentProfile } from "../page"
import { useState } from "react"

interface WillMatrixStepProps {
  profile: AgentProfile
  updateProfile: (updates: Partial<AgentProfile>) => void
}

export default function WillMatrixStep({ profile, updateProfile }: WillMatrixStepProps) {
  const [currentSection, setCurrentSection] = useState<'willing' | 'hard-nos' | 'energizing' | 'draining'>('willing')
  const [completedSections, setCompletedSections] = useState<string[]>([])

  const activityOptions = [
    {
      id: 'phone_calls',
      title: 'Phone Calls',
      description: 'Call prospects',
      icon: Phone,
      color: 'bg-green-500'
    },
    {
      id: 'text_messaging',
      title: 'Text Messaging',
      description: 'Text prospects',
      icon: MessageSquare,
      color: 'bg-blue-500'
    },
    {
      id: 'social_dms',
      title: 'Social Media DMs',
      description: 'Social outreach',
      icon: Share2,
      color: 'bg-purple-500'
    },
    {
      id: 'open_houses',
      title: 'Open Houses',
      description: 'Host events',
      icon: Home,
      color: 'bg-purple-500'
    },
    {
      id: 'door_knocking',
      title: 'Door Knocking',
      description: 'Door-to-door',
      icon: Building2,
      color: 'bg-red-500'
    },
    {
      id: 'events',
      title: 'Events & Networking',
      description: 'Network events',
      icon: Calendar,
      color: 'bg-orange-500'
    },
    {
      id: 'short_form_video',
      title: 'Short-Form Video',
      description: 'Quick videos',
      icon: Video,
      color: 'bg-pink-500'
    },
    {
      id: 'long_form_video',
      title: 'Long-Form Video',
      description: 'Long videos',
      icon: Video,
      color: 'bg-indigo-500'
    },
    {
      id: 'mailers',
      title: 'Mailers & Postcards',
      description: 'Direct mail',
      icon: Mail,
      color: 'bg-yellow-500'
    },
    {
      id: 'farming',
      title: 'Geographic Farming',
      description: 'Area farming',
      icon: Target,
      color: 'bg-teal-500'
    },
    {
      id: 'fsbo_expired',
      title: 'FSBO & Expireds',
      description: 'FSBO leads',
      icon: AlertTriangle,
      color: 'bg-red-600'
    },
    {
      id: 'investor_outreach',
      title: 'Investor Outreach',
      description: 'Investor leads',
      icon: TrendingUp,
      color: 'bg-gray-500'
    },
    {
      id: 'content_creation',
      title: 'Content Creation',
      description: 'Create content',
      icon: FileText,
      color: 'bg-cyan-500'
    },
    {
      id: 'referral_asks',
      title: 'Referral Asks',
      description: 'Ask referrals',
      icon: Star,
      color: 'bg-amber-500'
    }
  ]

  const handleActivityToggle = (activityId: string, category: keyof Pick<AgentProfile, 'willingActivities' | 'hardNos' | 'energizingActivities' | 'drainingActivities'>) => {
    try {
      // Validate inputs
      if (!activityId || !category) {
        console.warn('Invalid activityId or category:', { activityId, category })
        return
      }

      // Create a safe copy of the current array
      const current = Array.isArray(profile[category]) ? [...(profile[category] as string[])] : []
      
      // Validate the current array
      if (!Array.isArray(current)) {
        console.warn('Profile category is not an array:', { category, value: profile[category] })
        return
      }

      const updated = current.includes(activityId)
        ? current.filter(a => a !== activityId)
        : [...current, activityId]
      
      // Validate the updated array
      if (!Array.isArray(updated)) {
        console.warn('Updated array is not valid:', updated)
        return
      }

      updateProfile({ [category]: updated })
    } catch (error) {
      console.error('Error toggling activity:', error, { activityId, category })
      // Don't update anything if there's an error to prevent data loss
    }
  }

  const handleNextSection = () => {
    // Mark current section as completed
    if (!completedSections.includes(currentSection)) {
      setCompletedSections(prev => [...prev, currentSection])
    }

    // Move to next section
    const sections = ['willing', 'hard-nos', 'energizing', 'draining']
    const currentIndex = sections.indexOf(currentSection)
    if (currentIndex < sections.length - 1) {
      setCurrentSection(sections[currentIndex + 1] as any)
      // Scroll to top of new section
      setTimeout(() => {
        const sectionHeader = document.querySelector('[data-section-header]')
        if (sectionHeader) {
          sectionHeader.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } else {
      // All sections completed, trigger next step
      const event = new CustomEvent('nextStep')
      window.dispatchEvent(event)
    }
  }

  const handlePrevSection = () => {
    const sections = ['willing', 'hard-nos', 'energizing', 'draining']
    const currentIndex = sections.indexOf(currentSection)
    if (currentIndex > 0) {
      setCurrentSection(sections[currentIndex - 1] as any)
      // Scroll to top of previous section
      setTimeout(() => {
        const sectionHeader = document.querySelector('[data-section-header]')
        if (sectionHeader) {
          sectionHeader.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
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
    return Array.isArray(profile[category]) ? profile[category]?.length || 0 : 0
  }

  const getCurrentSectionInfo = () => {
    const sections = {
      'willing': {
        title: 'Activities You\'re Willing to Do',
        description: 'Select all activities you\'re open to doing regularly',
        icon: CheckCircle,
        color: 'bg-green-500',
        category: 'willingActivities' as const
      },
      'hard-nos': {
        title: 'Activities You Won\'t Do',
        description: 'Select activities that are completely off the table',
        icon: XCircle,
        color: 'bg-red-500',
        category: 'hardNos' as const
      },
      'energizing': {
        title: 'Activities That Energize You',
        description: 'Select activities that give you energy and motivation',
        icon: Zap,
        color: 'bg-yellow-500',
        category: 'energizingActivities' as const
      },
      'draining': {
        title: 'Activities That Drain You',
        description: 'Select activities that exhaust or demotivate you',
        icon: AlertTriangle,
        color: 'bg-gray-500',
        category: 'drainingActivities' as const
      }
    }
    return sections[currentSection]
  }

  const renderActivityGrid = (category: keyof Pick<AgentProfile, 'willingActivities' | 'hardNos' | 'energizingActivities' | 'drainingActivities'>) => {
    try {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activityOptions.map((activity) => {
            try {
              const Icon = activity.icon
              const isSelected = Array.isArray(profile[category]) ? profile[category]?.includes(activity.id) || false : false
              
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
            } catch (error) {
              console.error(`Error rendering activity ${activity.id}:`, error)
              return null
            }
          })}
        </div>
      )
    } catch (error) {
      console.error('Error rendering activity grid:', error)
      return (
        <div className="text-center py-8 text-red-500">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <p>Error loading activities. Please refresh the page.</p>
        </div>
      )
    }
  }

  const currentSectionInfo = getCurrentSectionInfo()
  const Icon = currentSectionInfo.icon

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center" data-step-header>
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="h-8 w-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Will/Will-Not Matrix</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Let's be honest about what you're willing to do and what's completely off the table.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center">
        <div className="flex space-x-2">
          {['willing', 'hard-nos', 'energizing', 'draining'].map((section, index) => {
            const isActive = currentSection === section
            const isCompleted = completedSections.includes(section)
            return (
              <div
                key={section}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  isActive ? 'bg-purple-600 text-white' :
                  isCompleted ? 'bg-green-600 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}
              >
                {index + 1}
              </div>
            )
          })}
        </div>
      </div>

      {/* Current Section */}
      <Card>
        <CardHeader data-section-header>
          <CardTitle className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${currentSectionInfo.color} text-white`}>
              <Icon className="h-6 w-6" />
            </div>
            {currentSectionInfo.title}
          </CardTitle>
          <CardDescription>
            {currentSectionInfo.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Activity Grid */}
          {renderActivityGrid(currentSectionInfo.category)}
          
          {/* Navigation */}
          <div className="flex justify-between mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevSection}
              disabled={currentSection === 'willing'}
            >
              Previous
            </Button>
            
            <Button
              onClick={handleNextSection}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {currentSection === 'draining' ? 'Next Step' : 'Next Section'}
            </Button>
          </div>
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
            {Array.isArray(profile.hardNos) && profile.hardNos.length > 0 ? (
              profile.hardNos.map((hardNo) => {
                try {
                  const activity = activityOptions.find(a => a.id === hardNo)
                  if (!activity) {
                    console.warn(`Activity not found for ID: ${hardNo}`)
                    return null
                  }

                  const alternatives = {
                    'door_knocking': 'Community events + neighbor DM playbook',
                    'phone_calls': 'Warm referrals + social media outreach',
                    'social_dms': 'Email sequences + content marketing',
                    'open_houses': 'Virtual tours + video content',
                    'mailers': 'Digital marketing + social media ads',
                    'fsbo_expired': 'Referral network + past client reactivation',
                    'text_messaging': 'Email sequences + social media outreach',
                    'events': 'Virtual events + online networking',
                    'short_form_video': 'Long-form content + written posts',
                    'long_form_video': 'Short-form content + written posts',
                    'farming': 'Referral network + past client reactivation',
                    'investor_outreach': 'Referral network + past client reactivation',
                    'content_creation': 'Curated content + repurposing',
                    'referral_asks': 'Automated follow-up sequences'
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
                } catch (error) {
                  console.error(`Error rendering alternative for ${hardNo}:`, error)
                  return null
                }
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <XCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No activities marked as "hard no" yet</p>
                <p className="text-sm">Complete the activity selection above to see alternatives</p>
              </div>
            )}
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
