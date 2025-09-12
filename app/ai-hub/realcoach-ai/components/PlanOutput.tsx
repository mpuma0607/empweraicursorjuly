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
  AlertTriangle,
  Info,
  Download,
  Mail,
  PlayCircle,
  BookOpen,
  Eye
} from "lucide-react"
import { AgentProfile } from "../page"
import { useState } from "react"

interface PlayAction {
  action: string
  tool: string
  toolLink: string
  description: string
}

interface PlaybookChannel {
  channel: string
  plays: PlayAction[]
}

interface TrainingRecommendation {
  course: string
  link: string
  description: string
  tool?: string
  toolLink?: string
  toolDescription?: string
}

interface MicroSkill {
  skill: string
  confidence: number
  drill: string
  training: TrainingRecommendation
}

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
    try {
      console.log('Creating calendar event for:', block)
      console.log('Profile weeklyBlocks:', profile.weeklyBlocks)
      console.log('Block data type:', typeof block, 'Block keys:', Object.keys(block || {}))
      
      // Validate input data
      if (!block || !block.day || !block.time || !block.activity) {
        throw new Error('Invalid time block data: missing required fields')
      }
      
      const now = new Date()
      const dayOfWeek = getDayOfWeek(block.day)
      
      // Validate day of week
      if (isNaN(dayOfWeek)) {
        throw new Error(`Invalid day name: ${block.day}`)
      }
      
      // Parse time with validation
      const timeMatch = block.time.match(/^(\d{1,2}):(\d{2})$/)
      if (!timeMatch) {
        throw new Error(`Invalid time format: ${block.time}. Expected HH:MM format.`)
      }
      
      const hours = parseInt(timeMatch[1], 10)
      const minutes = parseInt(timeMatch[2], 10)
      
      // Validate time values
      if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        throw new Error(`Invalid time values: ${block.time}`)
      }
      
      // Find next occurrence of this day
      const eventDate = new Date(now)
      const daysUntilTarget = (dayOfWeek - now.getDay() + 7) % 7
      eventDate.setDate(now.getDate() + (daysUntilTarget === 0 ? 7 : daysUntilTarget))
      eventDate.setHours(hours, minutes, 0, 0)
      
      // Validate the created date
      if (isNaN(eventDate.getTime())) {
        throw new Error('Invalid date created from time block')
      }
      
      const endDate = new Date(eventDate)
      endDate.setHours(hours + 1, minutes, 0, 0) // Default 1-hour duration
      
      // Validate end date
      if (isNaN(endDate.getTime())) {
        throw new Error('Invalid end date created from time block')
      }
      
      const startTime = eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
      const endTime = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
      
      // Create Google Calendar URL
      const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(block.activity)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(`RealCoach AI - ${block.activity}\n\nGenerated by RealCoach AI`)}`
      
      console.log('Google Calendar URL:', googleUrl)
      
      // Try to open Google Calendar directly
      const newWindow = window.open(googleUrl, '_blank', 'noopener,noreferrer')
      
      if (!newWindow) {
        // Fallback: copy to clipboard and show message
        navigator.clipboard.writeText(googleUrl).then(() => {
          alert(`Calendar event copied to clipboard!\n\nGoogle Calendar URL:\n${googleUrl}\n\nPaste this into your browser to add the event.`)
        }).catch(() => {
          alert(`Calendar event ready!\n\nGoogle Calendar URL:\n${googleUrl}\n\nCopy this URL to add the event to your calendar.`)
        })
      }
    } catch (error) {
      console.error('Error creating calendar event:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error creating calendar event: ${errorMessage}\n\nPlease check that your time blocks have valid day names (Monday, Tuesday, etc.) and time format (HH:MM).`)
    }
  }

  // Create calendar events for all time blocks
  const createAllCalendarEvents = () => {
    try {
      console.log('Creating all calendar events')
      
      if (!profile.weeklyBlocks || profile.weeklyBlocks.length === 0) {
        alert('No time blocks to add to calendar')
        return
      }
      
      // Validate all time blocks before processing
      const invalidBlocks = profile.weeklyBlocks.filter(block => 
        !block || !block.day || !block.time || !block.activity
      )
      
      if (invalidBlocks.length > 0) {
        alert(`Found ${invalidBlocks.length} invalid time blocks. Please check that all time blocks have day, time, and activity filled in.`)
        return
      }
      
      // For now, just open the first event and let user add others manually
      // This is simpler and more reliable than trying to create multiple events at once
      if (profile.weeklyBlocks.length > 0) {
        createCalendarEvent(profile.weeklyBlocks[0])
        
        if (profile.weeklyBlocks.length > 1) {
          setTimeout(() => {
            const addMore = confirm(`Added first time block to calendar. Add the remaining ${profile.weeklyBlocks.length - 1} time blocks one by one?`)
            if (addMore) {
              profile.weeklyBlocks.slice(1).forEach((block, index) => {
                setTimeout(() => {
                  createCalendarEvent(block)
                }, (index + 1) * 2000) // 2 second delay between each
              })
            }
          }, 1000)
        }
      }
    } catch (error) {
      console.error('Error creating all calendar events:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error creating calendar events: ${errorMessage}\n\nPlease check that your time blocks are properly formatted and try adding them one by one.`)
    }
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
  const getMicroSkills = (): MicroSkill[] => {
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
        drill: getSkillDrill(skillId),
        training: getTrainingRecommendation(skillId, 5)
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
        { skill: 'Advanced Negotiation', confidence: 8, drill: 'Practice complex multi-party negotiations', training: { course: 'Negotiation Mastery', link: '/training-hub/negotiation-mastery', description: 'Master advanced negotiation techniques' } },
        { skill: 'Market Analysis', confidence: 7, drill: 'Create weekly market trend reports', training: { course: 'MyMarket AI', link: '/ai-hub/mymarket-ai', description: 'Use AI to analyze market data' } },
        { skill: 'Team Leadership', confidence: 6, drill: 'Mentor one new agent weekly', training: { course: 'Leadership Training', link: '/training-hub', description: 'Develop leadership skills' } }
      ]
    }
    
    return lowConfidenceSkills.map(([skillId, confidence]) => ({
      skill: getSkillName(skillId),
      confidence,
      drill: getSkillDrill(skillId),
      training: getTrainingRecommendation(skillId, confidence)
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

  const getTrainingRecommendation = (skillId: string, confidence: number) => {
    const trainingMap = {
      'listing_presentation': { 
        course: 'Listing Presentation Training', 
        link: '/training-hub', 
        description: 'Master the art of listing presentations',
        tool: 'ScriptIT AI',
        toolLink: '/ai-hub/scriptit-ai',
        toolDescription: 'Create compelling listing presentation scripts'
      },
      'buyer_consultation': { 
        course: 'Buyer Consultation Training', 
        link: '/training-hub', 
        description: 'Perfect your buyer consultation process',
        tool: 'ScriptIT AI',
        toolLink: '/ai-hub/scriptit-ai',
        toolDescription: 'Generate buyer consultation scripts'
      },
      'negotiation': { 
        course: 'Negotiation Mastery', 
        link: '/training-hub/negotiation-mastery', 
        description: 'Master advanced negotiation techniques',
        tool: 'Roleplay AI',
        toolLink: '/ai-hub/roleplay-ai',
        toolDescription: 'Practice negotiation scenarios'
      },
      'pricing_strategy': { 
        course: 'Pricing Strategy Training', 
        link: '/training-hub', 
        description: 'Learn effective pricing strategies',
        tool: 'MyMarket AI',
        toolLink: '/ai-hub/mymarket-ai',
        toolDescription: 'Get market data for pricing decisions'
      },
      'scripts': { 
        course: 'Scripts & Objection Handling', 
        link: '/training-hub', 
        description: 'Master scripts and objection handling',
        tool: 'ScriptIT AI',
        toolLink: '/ai-hub/scriptit-ai',
        toolDescription: 'Generate scripts for any situation'
      },
      'video': { 
        course: 'Video Marketing Training', 
        link: '/training-hub', 
        description: 'Create engaging video content',
        tool: 'IdeaHub AI',
        toolLink: '/ai-hub/ideahub-ai',
        toolDescription: 'Generate video content ideas and scripts'
      },
      'crm_usage': { 
        course: 'CRM Mastery Training', 
        link: '/training-hub', 
        description: 'Maximize your CRM effectiveness',
        tool: 'CRM Setup Guide',
        toolLink: '/training-hub',
        toolDescription: 'Learn CRM best practices'
      },
      'social_media': { 
        course: 'Social Media Mastery', 
        link: '/training-hub/social-media-mastery', 
        description: 'Master social media for real estate',
        tool: 'IdeaHub AI',
        toolLink: '/ai-hub/ideahub-ai',
        toolDescription: 'Generate social media content'
      },
      'email_marketing': { 
        course: 'Email Marketing Training', 
        link: '/training-hub', 
        description: 'Create effective email campaigns',
        tool: 'ScriptIT AI',
        toolLink: '/ai-hub/scriptit-ai',
        toolDescription: 'Generate email templates'
      },
      'open_houses': { 
        course: 'Open House Mastery', 
        link: '/training-hub', 
        description: 'Host successful open houses',
        tool: 'ScriptIT AI',
        toolLink: '/ai-hub/scriptit-ai',
        toolDescription: 'Create open house scripts'
      },
      'networking': { 
        course: 'Networking Mastery', 
        link: '/training-hub', 
        description: 'Build powerful professional networks',
        tool: 'ScriptIT AI',
        toolLink: '/ai-hub/scriptit-ai',
        toolDescription: 'Generate networking conversation starters'
      },
      'time_management': { 
        course: 'Time Management Training', 
        link: '/training-hub', 
        description: 'Master your time and productivity',
        tool: 'Calendar Integration',
        toolLink: '#',
        toolDescription: 'Use calendar tools effectively'
      },
      'content_creation': { 
        course: 'Content Creation Training', 
        link: '/training-hub', 
        description: 'Create valuable content consistently',
        tool: 'IdeaHub AI',
        toolLink: '/ai-hub/ideahub-ai',
        toolDescription: 'Generate content ideas and scripts'
      },
      'presentation': { 
        course: 'Presentation Skills Training', 
        link: '/training-hub', 
        description: 'Deliver compelling presentations',
        tool: 'ScriptIT AI',
        toolLink: '/ai-hub/scriptit-ai',
        toolDescription: 'Create presentation scripts'
      }
    }
    
    const training = trainingMap[skillId as keyof typeof trainingMap]
    if (!training) {
      return { 
        course: 'General Skills Training', 
        link: '/training-hub', 
        description: 'Improve your professional skills',
        tool: 'ScriptIT AI',
        toolLink: '/ai-hub/scriptit-ai',
        toolDescription: 'Get help with any skill area'
      }
    }
    
    return training
  }

  const microSkills = getMicroSkills()

  // Add CRM recommendations if needed
  const getCRMRecommendations = () => {
    const recommendations = []
    
    // Check if CRM usage is low confidence or not mentioned
    const crmConfidence = profile.skills?.crm_usage || 0
    if (crmConfidence < 7) {
      recommendations.push({
        priority: 'high',
        title: 'CRM Database Optimization',
        description: 'Your CRM confidence is low. This is a major opportunity to improve your business.',
        actions: [
          'Update all contact information in your CRM',
          'Set up automated follow-up sequences',
          'Create custom fields for lead sources and preferences',
          'Implement lead scoring system',
          'Set up task reminders and follow-up alerts'
        ],
        training: {
          course: 'CRM Mastery Training',
          link: '/training-hub',
          description: 'Learn CRM best practices and automation'
        },
        tool: {
          name: 'CRM Setup Guide',
          link: '/training-hub',
          description: 'Step-by-step CRM optimization guide'
        }
      })
    }
    
    return recommendations
  }

  const crmRecommendations = getCRMRecommendations()

  // Generate weekly playbook based on channels
  const getWeeklyPlaybook = (): PlaybookChannel[] => {
    const playbook: PlaybookChannel[] = []
    
    recommendedChannels.forEach(({ channel, name }) => {
      const plays = {
        'soi_referrals': [
          { action: 'Send 30 birthday/anniversary messages', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Use ScriptIT to create personalized birthday messages' },
          { action: 'Make 10 follow-up calls to past clients', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Generate follow-up call scripts for past clients' },
          { action: 'Send 5 referral request emails', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Create professional referral request email templates' },
          { action: 'Text 15 past clients with market update', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Generate text message templates for market updates' },
          { action: 'Call 5 SOI contacts for coffee meetings', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Create coffee meeting invitation scripts' }
        ],
        'social_dms': [
          { action: 'DM 20 people from your target segments', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Use ScriptIT to create engaging DM templates' },
          { action: 'Engage with 50 posts in your market', tool: 'Dynamic Branded Content', toolLink: '/marketing-hub/dynamic-branded-content', description: 'Create branded content to engage with' },
          { action: 'Share 3 valuable pieces of content', tool: 'IdeaHub AI', toolLink: '/ai-hub/ideahub-ai', description: 'Generate valuable content ideas and posts' },
          { action: 'Comment on 25 local business posts', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Create thoughtful comment templates' },
          { action: 'Respond to all DMs within 2 hours', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Prepare quick response templates' }
        ],
        'open_houses': [
          { action: 'Host 1 open house', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Create open house presentation scripts' },
          { action: 'Invite 25 neighbors via DM/email', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Generate neighbor invitation messages' },
          { action: 'Follow up with all attendees within 24 hours', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Create follow-up scripts for attendees' },
          { action: 'Post 3 social media posts about the open house', tool: 'IdeaHub AI', toolLink: '/ai-hub/ideahub-ai', description: 'Generate social media content for open house' },
          { action: 'Send follow-up thank you cards', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Create thank you card message templates' }
        ],
        'video': [
          { action: 'Create 3 short-form videos', tool: 'IdeaHub AI', toolLink: '/ai-hub/ideahub-ai', description: 'Generate video content ideas and scripts' },
          { action: 'Post 1 market update video', tool: 'MyMarket AI', toolLink: '/ai-hub/mymarket-ai', description: 'Get market data to create informed video content' },
          { action: 'Share 1 client success story', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Create compelling success story scripts' },
          { action: 'Go live on social media for 10 minutes', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Prepare talking points for live sessions' },
          { action: 'Create 1 educational video series', tool: 'IdeaHub AI', toolLink: '/ai-hub/ideahub-ai', description: 'Generate educational content ideas' }
        ],
        'farming': [
          { action: 'Send 1 mailer to 100 homes', tool: 'Dynamic Branded Content', toolLink: '/marketing-hub/dynamic-branded-content', description: 'Create branded mailer designs' },
          { action: 'Post 5 geo-targeted social media posts', tool: 'IdeaHub AI', toolLink: '/ai-hub/ideahub-ai', description: 'Generate location-specific content ideas' },
          { action: 'Attend 1 community event', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Create networking conversation starters' },
          { action: 'Door knock 20 homes in target area', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Generate door knocking scripts' },
          { action: 'Host 1 neighborhood meet & greet', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Create event invitation and follow-up scripts' }
        ],
        'fsbo_expired': [
          { action: 'Call 10 FSBOs from MLS', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Create FSBO cold calling scripts' },
          { action: 'Mail 5 expired listing letters', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Generate expired listing letter templates' },
          { action: 'Follow up with 5 previous contacts', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Create follow-up call scripts' },
          { action: 'Send 10 personalized emails to FSBOs', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Generate personalized email templates' },
          { action: 'Visit 3 FSBO properties in person', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Create in-person presentation scripts' }
        ],
        'events': [
          { action: 'Attend 1 networking event', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Create networking conversation starters' },
          { action: 'Follow up with 5 new contacts', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Generate follow-up message templates' },
          { action: 'Plan next month\'s event calendar', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Create event invitation templates' },
          { action: 'Host 1 client appreciation event', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Generate event planning and invitation scripts' },
          { action: 'Join 1 new professional organization', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Create introduction and follow-up scripts' }
        ],
        'content': [
          { action: 'Write 2 blog posts about market trends', tool: 'MyMarket AI', toolLink: '/ai-hub/mymarket-ai', description: 'Get market data to inform your blog posts' },
          { action: 'Create 5 social media posts', tool: 'IdeaHub AI', toolLink: '/ai-hub/ideahub-ai', description: 'Generate engaging social media content' },
          { action: 'Record 1 podcast episode', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Create podcast talking points and scripts' },
          { action: 'Write 1 email newsletter', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Generate newsletter content and templates' },
          { action: 'Update your website with new content', tool: 'IdeaHub AI', toolLink: '/ai-hub/ideahub-ai', description: 'Create fresh website content ideas' }
        ],
        'referrals': [
          { action: 'Ask 3 clients for referrals', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Create referral request scripts' },
          { action: 'Send 10 referral thank you gifts', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Generate thank you message templates' },
          { action: 'Create 1 referral incentive program', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Create referral program communication' },
          { action: 'Follow up with 5 past referral sources', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Generate follow-up scripts for referral sources' },
          { action: 'Host 1 referral partner appreciation event', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Create event planning and invitation scripts' }
        ]
      }
      
      playbook.push({
        channel: name,
        plays: plays[channel as keyof typeof plays] || [
          { action: 'Focus on this channel for 2 hours daily', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Create scripts to maximize your time' },
          { action: 'Track your activities and results', tool: 'CRM Training', toolLink: '/training-hub', description: 'Learn CRM best practices for tracking' },
          { action: 'Adjust strategy based on what works', tool: 'ScriptIT AI', toolLink: '/ai-hub/scriptit-ai', description: 'Refine your scripts based on results' }
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

          {/* CRM Recommendations */}
          {crmRecommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                  High-Impact Opportunity
                </CardTitle>
                <CardDescription>
                  Critical area that could significantly improve your business
                </CardDescription>
              </CardHeader>
              <CardContent>
                {crmRecommendations.map((rec, index) => (
                  <div key={index} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-orange-900">{rec.title}</h4>
                      <Badge variant="destructive" className="bg-orange-600">
                        High Priority
                      </Badge>
                    </div>
                    <p className="text-orange-800 text-sm mb-4">{rec.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-orange-900 mb-2">Action Items:</h5>
                        <ul className="space-y-1">
                          {rec.actions.map((action, actionIndex) => (
                            <li key={actionIndex} className="flex items-center gap-2 text-sm text-orange-800">
                              <CheckCircle className="h-4 w-4 text-orange-600 flex-shrink-0" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="border-t border-orange-200 pt-3">
                        <div className="flex flex-wrap gap-3">
                          <a 
                            href={rec.training.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            <ArrowRight className="h-4 w-4" />
                            {rec.training.course}
                          </a>
                          <a 
                            href={rec.tool.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-800 hover:underline"
                          >
                            <ArrowRight className="h-4 w-4" />
                            {rec.tool.name}
                          </a>
                        </div>
                        <p className="text-xs text-orange-700 mt-2">
                          {rec.training.description} • {rec.tool.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

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
                    <div className="space-y-3">
                      {channel.plays.map((play: PlayAction, playIndex: number) => (
                        <div key={playIndex} className="border-l-2 border-green-200 pl-4 py-2">
                          <div className="flex items-start gap-2 text-sm mb-1">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="font-medium">{play.action}</span>
                          </div>
                          <div className="ml-6 mt-1">
                            <a 
                              href={play.toolLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              <ArrowRight className="h-3 w-3" />
                              {play.tool}
                            </a>
                            <p className="text-xs text-gray-600 mt-1">{play.description}</p>
                          </div>
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
                    
                    {skill.training && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-purple-600" />
                          <span className="text-purple-600">10 minutes daily</span>
                        </div>
                        
                        <div className="border-t border-purple-200 pt-2">
                          <p className="text-xs text-gray-600 mb-2">Recommended Training:</p>
                          <div className="space-y-2">
                            <a 
                              href={skill.training.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              <ArrowRight className="h-3 w-3" />
                              {skill.training.course}
                            </a>
                            <p className="text-xs text-gray-600">{skill.training.description}</p>
                            
                            {skill.training.tool && (
                              <div className="ml-4">
                                <a 
                                  href={skill.training.toolLink || '#'} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-800 hover:underline"
                                >
                                  <ArrowRight className="h-3 w-3" />
                                  {skill.training.tool}
                                </a>
                                <p className="text-xs text-gray-600">{skill.training.toolDescription || skill.training.description}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
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
