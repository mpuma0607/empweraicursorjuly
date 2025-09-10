"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Target, 
  Calendar,
  BarChart3,
  Users,
  MessageSquare,
  Home,
  TrendingUp,
  Star,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Zap,
  Award,
  Clock,
  DollarSign,
  MapPin,
  Building2,
  Heart,
  AlertCircle,
  Info,
  Download,
  Share2,
  PlayCircle,
  BookOpen,
  Eye
} from "lucide-react"
import { AgentProfile } from "../page"
import { useState } from "react"

interface PlanOutputProps {
  profile: AgentProfile
}

export default function PlanOutput({ profile }: PlanOutputProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'weekly' | 'channels' | 'skills' | 'assets'>('overview')

  // Calculate derived values
  const monthlyTarget = profile.targetUnits / 12
  const weeklyTarget = monthlyTarget / 4.33
  const avgNetPerClose = profile.avgPricePoint * 0.03
  const targetGCI = profile.targetUnits * avgNetPerClose

  // Generate channel recommendations based on will/will-not matrix
  const getRecommendedChannels = () => {
    const willing = profile.willingActivities || []
    const energizing = profile.energizingActivities || []
    const hardNos = profile.hardNos || []
    
    // Score channels based on willingness and energy
    const channelScores = {
      'soi_referrals': (willing.includes('calls_texts') ? 2 : 0) + (energizing.includes('calls_texts') ? 1 : 0),
      'social_dms': (willing.includes('social_dms') ? 2 : 0) + (energizing.includes('social_dms') ? 1 : 0),
      'open_houses': (willing.includes('open_houses') ? 2 : 0) + (energizing.includes('open_houses') ? 1 : 0),
      'video': (willing.includes('short_form_video') || willing.includes('long_form_video') ? 2 : 0) + (energizing.includes('short_form_video') || energizing.includes('long_form_video') ? 1 : 0),
      'farming': (willing.includes('farming') ? 2 : 0) + (energizing.includes('farming') ? 1 : 0),
      'fsbo_expired': (willing.includes('fsbo_expired') ? 2 : 0) + (energizing.includes('fsbo_expired') ? 1 : 0),
      'events': (willing.includes('events') ? 2 : 0) + (energizing.includes('events') ? 1 : 0)
    }

    // Sort by score and take top 3
    return Object.entries(channelScores)
      .filter(([channel, score]) => score > 0)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([channel, score]) => ({
        channel,
        score,
        name: {
          'soi_referrals': 'SOI & Referrals',
          'social_dms': 'Social Media DMs',
          'open_houses': 'Open Houses',
          'video': 'Video Marketing',
          'farming': 'Geographic Farming',
          'fsbo_expired': 'FSBO & Expireds',
          'events': 'Events & Networking'
        }[channel] || channel
      }))
  }

  const recommendedChannels = getRecommendedChannels()

  // Generate micro-skills based on lowest confidence areas
  const getMicroSkills = () => {
    const skills = profile.skills || {}
    return Object.entries(skills)
      .filter(([_, confidence]) => confidence < 6)
      .sort(([_, a], [__, b]) => a - b)
      .slice(0, 2)
      .map(([skillId, confidence]) => {
        const skillNames = {
          'listing_presentation': 'Listing Presentation',
          'buyer_consultation': 'Buyer Consultation',
          'negotiation': 'Negotiation',
          'pricing_strategy': 'Pricing Strategy',
          'scripts': 'Scripts & Objection Handling',
          'video': 'Video Marketing',
          'crm_usage': 'CRM Usage',
          'social_media': 'Social Media',
          'email_marketing': 'Email Marketing',
          'open_houses': 'Open Houses',
          'networking': 'Networking',
          'time_management': 'Time Management'
        }
        return {
          skill: skillNames[skillId as keyof typeof skillNames] || skillId,
          confidence,
          drill: getSkillDrill(skillId)
        }
      })
  }

  const getSkillDrill = (skillId: string) => {
    const drills = {
      'listing_presentation': 'Practice 5-minute listing presentation daily',
      'buyer_consultation': 'Role-play buyer consultation questions',
      'negotiation': 'Practice objection responses in mirror',
      'pricing_strategy': 'Analyze 3 comps daily for pricing practice',
      'scripts': 'Record yourself delivering scripts, listen back',
      'video': 'Create one 60-second video daily',
      'crm_usage': 'Spend 10 minutes organizing contacts daily',
      'social_media': 'Post one piece of valuable content daily',
      'email_marketing': 'Write one email template daily',
      'open_houses': 'Practice open house opening 5 times daily',
      'networking': 'Make one new professional connection daily',
      'time_management': 'Plan tomorrow\'s top 3 priorities each evening'
    }
    return drills[skillId as keyof typeof drills] || 'Practice this skill for 10 minutes daily'
  }

  const microSkills = getMicroSkills()

  // Generate weekly playbook based on channels
  const getWeeklyPlaybook = () => {
    const playbook = []
    
    recommendedChannels.forEach(({ channel, name }) => {
      const plays = {
        'soi_referrals': [
          'Send 30 birthday/anniversary messages',
          'Make 10 follow-up calls to past clients',
          'Send 5 referral request emails'
        ],
        'social_dms': [
          'DM 20 people from your target segments',
          'Engage with 50 posts in your market',
          'Share 3 valuable pieces of content'
        ],
        'open_houses': [
          'Host 1 open house',
          'Invite 25 neighbors via DM/email',
          'Follow up with all attendees within 24 hours'
        ],
        'video': [
          'Create 3 short-form videos',
          'Post 1 market update video',
          'Share 1 client success story'
        ],
        'farming': [
          'Send 1 mailer to 100 homes',
          'Post 5 geo-targeted social media posts',
          'Attend 1 community event'
        ],
        'fsbo_expired': [
          'Call 10 FSBOs from MLS',
          'Mail 5 expired listing letters',
          'Follow up with 5 previous contacts'
        ],
        'events': [
          'Attend 1 networking event',
          'Follow up with 5 new contacts',
          'Plan next month\'s event calendar'
        ]
      }
      
      playbook.push({
        channel: name,
        plays: plays[channel as keyof typeof plays] || []
      })
    })
    
    return playbook
  }

  const weeklyPlaybook = getWeeklyPlaybook()

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'weekly', label: 'Weekly Plan', icon: Calendar },
    { id: 'channels', label: 'Channels', icon: BarChart3 },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'assets', label: 'Assets', icon: Star }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Personalized Action Plan</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Based on your goals, preferences, and constraints, here's your customized 4-week action plan.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Plan
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Share Plan
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.id as any)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* North Star */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-purple-600" />
                Your North Star
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{profile.targetUnits}</div>
                  <div className="text-purple-800">Annual Closings</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">${targetGCI.toLocaleString()}</div>
                  <div className="text-blue-800">Annual GCI</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{Math.round(weeklyTarget * 10) / 10}</div>
                  <div className="text-green-800">Weekly Closings</div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Your Why</h4>
                <p className="text-gray-700">"{profile.whyPrimary}"</p>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Targets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                Weekly KPI Targets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(profile.kpiTargets || {}).map(([kpi, target]) => {
                  const kpiOption = {
                    'conversations': { label: 'Conversations', icon: MessageSquare, color: 'bg-blue-500' },
                    'appointments': { label: 'Appointments', icon: Calendar, color: 'bg-green-500' },
                    'listings': { label: 'Listings', icon: Home, color: 'bg-purple-500' },
                    'buyers': { label: 'Buyers', icon: Users, color: 'bg-orange-500' },
                    'videos': { label: 'Videos', icon: TrendingUp, color: 'bg-pink-500' },
                    'mailers': { label: 'Mailers', icon: MessageSquare, color: 'bg-teal-500' }
                  }[kpi]
                  
                  if (!kpiOption || target === 0) return null
                  
                  const Icon = kpiOption.icon
                  return (
                    <div key={kpi} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className={`w-12 h-12 ${kpiOption.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{target}</div>
                      <div className="text-gray-600 text-sm">{kpiOption.label}</div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Time Blocks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-orange-600" />
                Your Weekly Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.weeklyBlocks && profile.weeklyBlocks.length > 0 ? (
                  profile.weeklyBlocks.map((block, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{block.day} at {block.time}</div>
                        <div className="text-gray-600 text-sm">{block.activity}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No time blocks scheduled</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'weekly' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-green-600" />
                Weekly Playbook
              </CardTitle>
              <CardDescription>
                Your specific activities for each channel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {weeklyPlaybook.map((channel, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                      {channel.channel}
                    </h4>
                    <div className="space-y-2">
                      {channel.plays.map((play, playIndex) => (
                        <div key={playIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{play}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'channels' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                Recommended Channels
              </CardTitle>
              <CardDescription>
                Based on your preferences and energy levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendedChannels.map((channel, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{channel.name}</h4>
                        <p className="text-gray-600 text-sm">Score: {channel.score}/3</p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {index === 0 ? 'Primary' : index === 1 ? 'Secondary' : 'Support'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-purple-600" />
                Micro-Skills Training
              </CardTitle>
              <CardDescription>
                Daily 10-minute drills for your focus areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {microSkills.map((skill, index) => (
                  <div key={index} className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{skill.skill}</h4>
                      <Badge variant="outline" className="text-purple-600">
                        {skill.confidence}/10 confidence
                      </Badge>
                    </div>
                    <p className="text-gray-700 text-sm mb-3">{skill.drill}</p>
                    <div className="flex items-center gap-2 text-sm text-purple-600">
                      <Clock className="h-4 w-4" />
                      <span>10 minutes daily</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'assets' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-600" />
                Asset Leverage Strategy
              </CardTitle>
              <CardDescription>
                How to use your existing resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.assets && profile.assets.length > 0 ? (
                  profile.assets.map((asset, index) => {
                    const assetStrategies = {
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
                    
                    const strategy = assetStrategies[asset as keyof typeof assetStrategies] || 'Integrate into marketing plan'
                    
                    return (
                      <div key={index} className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Star className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 capitalize">{asset.replace('_', ' ')}</h4>
                          <p className="text-gray-600 text-sm">{strategy}</p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No assets selected</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-6 w-6 text-green-600" />
            Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Start This Week</h4>
                <p className="text-gray-600 text-sm">Begin with your primary channel and focus on consistency over perfection.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Track Your Progress</h4>
                <p className="text-gray-600 text-sm">Use the KPI targets to measure what's working and what needs adjustment.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Weekly Check-ins</h4>
                <p className="text-gray-600 text-sm">Every {profile.checkinDay} at {profile.checkinTime}, we'll review your progress and adjust the plan.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
