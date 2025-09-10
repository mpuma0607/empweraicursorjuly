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
  Mail,
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
  const [isDownloading, setIsDownloading] = useState(false)
  const [isEmailing, setIsEmailing] = useState(false)
  const [emailAddress, setEmailAddress] = useState('')
  const [showEmailInput, setShowEmailInput] = useState(false)

  // Download plan as PDF
  const handleDownloadPlan = async () => {
    setIsDownloading(true)
    try {
      const response = await fetch("/api/generate-realcoach-plan-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile: {
            ...profile,
            name: profile.name || 'Real Estate Professional'
          },
          planData: generatePlanData()
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate PDF")
      }

      // Get the PDF blob
      const blob = await response.blob()

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `RealCoach_Action_Plan_${profile.name?.replace(/\s+/g, "_") || 'Professional'}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      alert("PDF downloaded successfully!")
    } catch (error) {
      console.error("Error downloading PDF:", error)
      alert("Failed to download PDF. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  // Email plan to self
  const handleEmailToSelf = async () => {
    setIsEmailing(true)
    try {
      const response = await fetch("/api/send-realcoach-plan-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: profile.email || 'your-email@example.com',
          name: profile.name || 'Real Estate Professional',
          profile: {
            ...profile,
            name: profile.name || 'Real Estate Professional'
          },
          planData: {
            recommendedChannels,
            weeklyPlaybook,
            microSkills,
            pdfBuffer: null // Will be generated on server side
          }
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send email")
      }

      alert("Action plan emailed to yourself successfully!")
    } catch (error) {
      console.error("Error sending email:", error)
      alert("Failed to send email. Please try again.")
    } finally {
      setIsEmailing(false)
    }
  }

  // Email plan to someone else
  const handleEmailToOther = async () => {
    if (!emailAddress.trim()) {
      alert("Please enter an email address")
      return
    }

    setIsEmailing(true)
    try {
      const response = await fetch("/api/send-realcoach-plan-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: emailAddress,
          name: profile.name || 'Real Estate Professional',
          profile: {
            ...profile,
            name: profile.name || 'Real Estate Professional'
          },
          planData: {
            recommendedChannels,
            weeklyPlaybook,
            microSkills,
            pdfBuffer: null // Will be generated on server side
          }
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send email")
      }

      alert(`Action plan emailed to ${emailAddress} successfully!`)
      setEmailAddress('')
      setShowEmailInput(false)
    } catch (error) {
      console.error("Error sending email:", error)
      alert("Failed to send email. Please try again.")
    } finally {
      setIsEmailing(false)
    }
  }

  // Generate comprehensive plan data
  const generatePlanData = () => {
    const monthlyTarget = profile.targetUnits / 12
    const weeklyTarget = monthlyTarget / 4.33
    const avgNetPerClose = profile.avgPricePoint * 0.03
    const targetGCI = profile.targetUnits * avgNetPerClose

    return `
REALCOACH AI - PERSONALIZED ACTION PLAN
Generated: ${new Date().toLocaleDateString()}

=== YOUR NORTH STAR ===
Annual Closings: ${profile.targetUnits}
Annual GCI: $${targetGCI.toLocaleString()}
Weekly Closings: ${Math.round(weeklyTarget * 10) / 10}

Your Why: ${profile.whyPrimary || profile.whySecondary || "Your motivation drives everything."}
${profile.inactionCost ? `Cost of Inaction: ${profile.inactionCost}` : ''}

=== WEEKLY KPI TARGETS ===
${Object.entries(profile.kpiTargets || {}).map(([kpi, target]) => `• ${kpi.replace('_', ' ').toUpperCase()}: ${target}`).join('\n')}

=== RECOMMENDED CHANNELS ===
${recommendedChannels.map((channel, index) => 
  `${index + 1}. ${channel.name} (Score: ${channel.score}/3)`
).join('\n')}

=== WEEKLY PLAYBOOK ===
${weeklyPlaybook.map(channel => 
  `${channel.channel}:\n${channel.plays.map(play => `  • ${play}`).join('\n')}`
).join('\n\n')}

=== MICRO-SKILLS TRAINING ===
${microSkills.map(skill => 
  `${skill.skill} (${skill.confidence}/10 confidence)\n  Drill: ${skill.drill}`
).join('\n\n')}

=== TIME BLOCKS ===
${profile.weeklyBlocks?.map(block => 
  `${block.day} at ${block.time}: ${block.activity}`
).join('\n') || 'No time blocks scheduled'}

=== NEXT STEPS ===
1. Start This Week: Begin with your primary channel and focus on consistency
2. Track Your Progress: Use the KPI targets to measure what's working
3. Weekly Check-ins: Every ${profile.checkinDay} at ${profile.checkinTime}

---
Generated by RealCoach AI - Your Personal Real Estate Coaching Assistant
    `.trim()
  }

  // Create calendar event for a single time block
  const createCalendarEvent = (block: { day: string; time: string; activity: string }) => {
    const now = new Date()
    const dayOfWeek = getDayOfWeek(block.day)
    const [hours, minutes] = block.time.split(':').map(Number)
    
    // Find next occurrence of this day
    const eventDate = new Date(now)
    const daysUntilTarget = (dayOfWeek - now.getDay() + 7) % 7
    eventDate.setDate(now.getDate() + (daysUntilTarget === 0 ? 7 : daysUntilTarget))
    eventDate.setHours(hours, minutes, 0, 0)
    
    const endDate = new Date(eventDate)
    endDate.setHours(hours + 1, minutes, 0, 0) // Default 1-hour duration
    
    const startTime = eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    const endTime = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    
    // Create Google Calendar URL
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(block.activity)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(`RealCoach AI - ${block.activity}\n\nGenerated by RealCoach AI`)}`
    
    // Create Outlook URL
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(block.activity)}&startdt=${startTime}&enddt=${endTime}&body=${encodeURIComponent(`RealCoach AI - ${block.activity}\n\nGenerated by RealCoach AI`)}`
    
    // Create Apple Calendar URL
    const appleUrl = `https://calendar.apple.com/event?title=${encodeURIComponent(block.activity)}&start=${startTime}&end=${endTime}&notes=${encodeURIComponent(`RealCoach AI - ${block.activity}\n\nGenerated by RealCoach AI`)}`
    
    // Show calendar options
    const calendarChoice = window.confirm(
      `Choose your calendar:\n\nOK = Google Calendar\nCancel = See all options`
    )
    
    if (calendarChoice) {
      window.open(googleUrl, '_blank')
    } else {
      const allOptions = `Calendar Options for "${block.activity}":\n\n` +
        `Google Calendar: ${googleUrl}\n\n` +
        `Outlook: ${outlookUrl}\n\n` +
        `Apple Calendar: ${appleUrl}\n\n` +
        `Copy any URL above to add to your calendar.`
      
      alert(allOptions)
    }
  }

  // Create calendar events for all time blocks
  const createAllCalendarEvents = () => {
    if (!profile.weeklyBlocks || profile.weeklyBlocks.length === 0) {
      alert('No time blocks to add to calendar')
      return
    }
    
    const calendarEvents = profile.weeklyBlocks.map(block => {
      const now = new Date()
      const dayOfWeek = getDayOfWeek(block.day)
      const [hours, minutes] = block.time.split(':').map(Number)
      
      const eventDate = new Date(now)
      const daysUntilTarget = (dayOfWeek - now.getDay() + 7) % 7
      eventDate.setDate(now.getDate() + (daysUntilTarget === 0 ? 7 : daysUntilTarget))
      eventDate.setHours(hours, minutes, 0, 0)
      
      const endDate = new Date(eventDate)
      endDate.setHours(hours + 1, minutes, 0, 0)
      
      const startTime = eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
      const endTime = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
      
      return {
        title: block.activity,
        start: startTime,
        end: endTime,
        description: `RealCoach AI - ${block.activity}\n\nGenerated by RealCoach AI`
      }
    })
    
    // Create a comprehensive calendar URL with multiple events
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('RealCoach AI - Weekly Schedule')}&dates=${calendarEvents[0].start}/${calendarEvents[0].end}&details=${encodeURIComponent(calendarEvents.map(event => `${event.title} - ${new Date(event.start).toLocaleString()}`).join('\n'))}`
    
    window.open(googleUrl, '_blank')
  }

  // Helper function to convert day name to day of week
  const getDayOfWeek = (dayName: string): number => {
    const days = {
      'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
      'Thursday': 4, 'Friday': 5, 'Saturday': 6
    }
    return days[dayName as keyof typeof days] ?? 0
  }

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
    
    // Map all willing activities to channels
    const activityToChannel = {
      'phone_calls': 'soi_referrals',
      'text_messaging': 'soi_referrals', 
      'social_dms': 'social_dms',
      'open_houses': 'open_houses',
      'short_form_video': 'video',
      'long_form_video': 'video',
      'farming': 'farming',
      'fsbo_expired': 'fsbo_expired',
      'events': 'events',
      'mailers': 'farming',
      'content_creation': 'social_dms',
      'referral_asks': 'soi_referrals',
      'investor_outreach': 'soi_referrals'
    }
    
    // Score channels based on willingness and energy
    const channelScores: Record<string, number> = {}
    
    // Initialize all possible channels
    const allChannels = {
      'soi_referrals': 'SOI & Referrals',
      'social_dms': 'Social Media DMs', 
      'open_houses': 'Open Houses',
      'video': 'Video Marketing',
      'farming': 'Geographic Farming',
      'fsbo_expired': 'FSBO & Expireds',
      'events': 'Events & Networking',
      'content': 'Content Creation',
      'referrals': 'Referral System'
    }
    
    // Initialize scores
    Object.keys(allChannels).forEach(channel => {
      channelScores[channel] = 0
    })
    
    // Score based on willing activities
    willing.forEach(activity => {
      const channel = activityToChannel[activity as keyof typeof activityToChannel]
      if (channel) {
        channelScores[channel] += 2
      }
    })
    
    // Add bonus for energizing activities
    energizing.forEach(activity => {
      const channel = activityToChannel[activity as keyof typeof activityToChannel]
      if (channel) {
        channelScores[channel] += 1
      }
    })

    // Return ALL channels with scores > 0, sorted by score
    return Object.entries(channelScores)
      .filter(([channel, score]) => score > 0)
      .sort(([,a], [,b]) => b - a)
      .map(([channel, score]) => ({
        channel,
        score,
        name: allChannels[channel as keyof typeof allChannels] || channel
      }))
  }

  const recommendedChannels = getRecommendedChannels()

  // Generate micro-skills based on selected activities and lowest confidence areas
  const getMicroSkills = () => {
    const skills = profile.skills || {}
    const willing = profile.willingActivities || []
    
    // If no skills data, generate based on willing activities
    if (Object.keys(skills).length === 0) {
      const activityToSkills = {
        'phone_calls': ['scripts', 'crm_usage'],
        'text_messaging': ['scripts', 'crm_usage'],
        'social_dms': ['social_media', 'scripts'],
        'open_houses': ['listing_presentation', 'networking'],
        'short_form_video': ['video', 'social_media'],
        'long_form_video': ['video', 'content_creation'],
        'farming': ['networking', 'email_marketing'],
        'fsbo_expired': ['scripts', 'negotiation'],
        'events': ['networking', 'presentation'],
        'mailers': ['email_marketing', 'content_creation'],
        'content_creation': ['content_creation', 'social_media'],
        'referral_asks': ['scripts', 'networking']
      }
      
      const relevantSkills = new Set<string>()
      willing.forEach(activity => {
        const skillIds = activityToSkills[activity as keyof typeof activityToSkills] || []
        skillIds.forEach(skill => relevantSkills.add(skill))
      })
      
      return Array.from(relevantSkills).slice(0, 3).map(skillId => ({
        skill: getSkillName(skillId),
        confidence: 5, // Default to medium confidence
        drill: getSkillDrill(skillId)
      }))
    }
    
    // Use actual skills data if available
    const lowConfidenceSkills = Object.entries(skills)
      .filter(([_, confidence]) => confidence < 7)
      .sort(([_, a], [__, b]) => a - b)
      .slice(0, 3)
    
    if (lowConfidenceSkills.length === 0) {
      // If all skills are high confidence, suggest advanced skills
      return [
        { skill: 'Advanced Negotiation', confidence: 8, drill: 'Practice complex multi-party negotiations' },
        { skill: 'Market Analysis', confidence: 7, drill: 'Create weekly market trend reports' },
        { skill: 'Team Leadership', confidence: 6, drill: 'Mentor one new agent weekly' }
      ]
    }
    
    return lowConfidenceSkills.map(([skillId, confidence]) => ({
      skill: getSkillName(skillId),
      confidence,
      drill: getSkillDrill(skillId)
    }))
  }
  
  const getSkillName = (skillId: string) => {
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
      'time_management': 'Time Management',
      'content_creation': 'Content Creation',
      'presentation': 'Presentation Skills'
    }
    return skillNames[skillId as keyof typeof skillNames] || skillId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
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
      'time_management': 'Plan tomorrow\'s top 3 priorities each evening',
      'content_creation': 'Write 500 words of valuable content daily',
      'presentation': 'Practice presenting to a mirror for 10 minutes daily',
      'advanced_negotiation': 'Study one negotiation case study daily',
      'market_analysis': 'Create one market trend analysis weekly',
      'team_leadership': 'Mentor one new agent for 30 minutes weekly'
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
          'Send 5 referral request emails',
          'Text 15 past clients with market update',
          'Call 5 SOI contacts for coffee meetings'
        ],
        'social_dms': [
          'DM 20 people from your target segments',
          'Engage with 50 posts in your market',
          'Share 3 valuable pieces of content',
          'Comment on 25 local business posts',
          'Respond to all DMs within 2 hours'
        ],
        'open_houses': [
          'Host 1 open house',
          'Invite 25 neighbors via DM/email',
          'Follow up with all attendees within 24 hours',
          'Post 3 social media posts about the open house',
          'Send follow-up thank you cards'
        ],
        'video': [
          'Create 3 short-form videos',
          'Post 1 market update video',
          'Share 1 client success story',
          'Go live on social media for 10 minutes',
          'Create 1 educational video series'
        ],
        'farming': [
          'Send 1 mailer to 100 homes',
          'Post 5 geo-targeted social media posts',
          'Attend 1 community event',
          'Door knock 20 homes in target area',
          'Host 1 neighborhood meet & greet'
        ],
        'fsbo_expired': [
          'Call 10 FSBOs from MLS',
          'Mail 5 expired listing letters',
          'Follow up with 5 previous contacts',
          'Send 10 personalized emails to FSBOs',
          'Visit 3 FSBO properties in person'
        ],
        'events': [
          'Attend 1 networking event',
          'Follow up with 5 new contacts',
          'Plan next month\'s event calendar',
          'Host 1 client appreciation event',
          'Join 1 new professional organization'
        ],
        'content': [
          'Write 2 blog posts about market trends',
          'Create 5 social media posts',
          'Record 1 podcast episode',
          'Write 1 email newsletter',
          'Update your website with new content'
        ],
        'referrals': [
          'Ask 3 clients for referrals',
          'Send 10 referral thank you gifts',
          'Create 1 referral incentive program',
          'Follow up with 5 past referral sources',
          'Host 1 referral partner appreciation event'
        ]
      }
      
      playbook.push({
        channel: name,
        plays: plays[channel as keyof typeof plays] || [
          'Focus on this channel for 2 hours daily',
          'Track your activities and results',
          'Adjust strategy based on what works'
        ]
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
      <div className="text-center" data-step-header>
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {profile.name ? `${profile.name}'s Personalized Action Plan` : 'Your Personalized Action Plan'}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Based on your goals, preferences, and constraints, here's your customized 4-week action plan.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button 
          className="flex items-center gap-2"
          onClick={handleDownloadPlan}
          disabled={isDownloading}
        >
          <Download className="h-4 w-4" />
          {isDownloading ? 'Generating PDF...' : 'Download Plan'}
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleEmailToSelf}
          disabled={isEmailing}
        >
          <Mail className="h-4 w-4" />
          {isEmailing ? 'Sending...' : 'Email to Self'}
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setShowEmailInput(!showEmailInput)}
        >
          <Mail className="h-4 w-4" />
          Email to Someone
        </Button>
      </div>

      {/* Email Input */}
      {showEmailInput && (
        <div className="max-w-md mx-auto">
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email address"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && emailAddress.trim()) {
                    handleEmailToOther()
                  }
                }}
              />
              <Button 
                onClick={handleEmailToOther}
                disabled={isEmailing || !emailAddress.trim()}
                className="px-4"
              >
                {isEmailing ? 'Sending...' : 'Send'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowEmailInput(false)
                  setEmailAddress('')
                }}
              >
                Cancel
              </Button>
            </div>
            <p className="text-sm text-gray-600 text-center">
              The action plan will be sent as a professional PDF with your personalized recommendations.
            </p>
          </div>
        </div>
      )}

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
                <p className="text-gray-700">
                  {profile.whyPrimary || profile.whySecondary || "Your motivation drives everything. When you know your why, you can endure any how."}
                </p>
                {profile.inactionCost && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                    <h5 className="font-medium text-red-900 mb-1">Cost of Inaction</h5>
                    <p className="text-red-800 text-sm">{profile.inactionCost}</p>
                  </div>
                )}
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
              <CardDescription>
                Click "Add to Calendar" to create calendar invites for your time blocks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.weeklyBlocks && profile.weeklyBlocks.length > 0 ? (
                  <>
                    {profile.weeklyBlocks.map((block, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <Clock className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{block.day} at {block.time}</div>
                            <div className="text-gray-600 text-sm">{block.activity}</div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => createCalendarEvent(block)}
                          className="flex items-center gap-2"
                        >
                          <Calendar className="h-4 w-4" />
                          Add to Calendar
                        </Button>
                      </div>
                    ))}
                    <div className="mt-4 pt-4 border-t">
                      <Button
                        onClick={createAllCalendarEvents}
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <Calendar className="h-4 w-4" />
                        Add All Time Blocks to Calendar
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No time blocks scheduled</p>
                    <p className="text-sm">Complete the Commitment Contract step to add time blocks</p>
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
                {recommendedChannels.length > 0 ? (
                  recommendedChannels.map((channel, index) => {
                    const maxScore = 3 // 2 for willing + 1 for energizing
                    const scorePercentage = (channel.score / maxScore) * 100
                    const priority = channel.score >= 4 ? 'Primary' : channel.score >= 2 ? 'Secondary' : 'Support'
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="font-bold text-blue-600">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{channel.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${scorePercentage}%` }}
                                ></div>
                              </div>
                              <span className="text-gray-600 text-sm font-medium">{channel.score}/{maxScore}</span>
                            </div>
                            <p className="text-gray-600 text-xs mt-1">
                              {channel.score >= 4 ? 'Willing + Energizing' : 
                               channel.score >= 2 ? 'Willing to do' : 'Support activity'}
                            </p>
                          </div>
                        </div>
                        <Badge variant={priority === 'Primary' ? 'default' : 'secondary'}>
                          {priority}
                        </Badge>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No channels selected yet</p>
                    <p className="text-sm">Complete the Will/Will-Not Matrix to see your recommended channels</p>
                  </div>
                )}
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
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 font-bold text-sm">4</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Calendar Integration</h4>
                <p className="text-gray-600 text-sm">Add your time blocks to your calendar to ensure you follow through on your commitments.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            Success Metrics
          </CardTitle>
          <CardDescription>
            Track these key indicators to measure your progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Weekly Targets</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• {Math.round(weeklyTarget * 10) / 10} closings per week</li>
                <li>• {profile.hoursPerWeek} hours of prospecting</li>
                <li>• ${profile.marketingBudget} monthly marketing budget</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Monthly Goals</h4>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• {Math.round(monthlyTarget * 10) / 10} closings per month</li>
                <li>• ${Math.round(targetGCI / 12).toLocaleString()} monthly GCI</li>
                <li>• {recommendedChannels.length} active channels</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
