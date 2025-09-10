import { type NextRequest, NextResponse } from "next/server"
import { jsPDF } from "jspdf"

export async function POST(request: NextRequest) {
  try {
    const { profile, planData } = await request.json()

    if (!profile || !planData) {
      return NextResponse.json({ error: "Profile and plan data are required" }, { status: 400 })
    }

    // Create PDF using jsPDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })
    
    // Helper function to add new page if needed
    const checkPageBreak = (requiredSpace: number) => {
      if (currentY + requiredSpace > 280) {
        pdf.addPage()
        currentY = 20
        return true
      }
      return false
    }

    // Set up fonts and colors
    pdf.setFont("helvetica")

    // Header section with Vegas Gold background
    pdf.setFillColor(182, 168, 136) // Vegas Gold color
    pdf.rect(0, 0, 210, 45, "F")

    // Header text
    pdf.setTextColor(255, 255, 255) // White text
    pdf.setFontSize(24)
    pdf.text("RealCoach AI - Action Plan", 105, 20, { align: "center" })
    pdf.setFontSize(12)
    pdf.text(`Generated for ${profile.name || 'Real Estate Professional'} - ${new Date().toLocaleDateString()}`, 105, 30, { align: "center" })
    pdf.setFontSize(10)
    pdf.text("Your Personalized 4-Week Action Plan", 105, 38, { align: "center" })

    // Reset text color to black
    pdf.setTextColor(0, 0, 0)
    let currentY = 60

    // North Star section
    pdf.setFillColor(239, 246, 255) // Blue-50
    pdf.rect(15, currentY - 5, 180, 12, "F")
    pdf.setFontSize(14)
    pdf.setFont("helvetica", "bold")
    pdf.setTextColor(30, 64, 175) // Blue-800
    pdf.text("YOUR NORTH STAR", 20, currentY + 3)
    currentY += 15

    // North Star metrics
    const monthlyTarget = profile.targetUnits / 12
    const weeklyTarget = monthlyTarget / 4.33
    const avgNetPerClose = profile.avgPricePoint * 0.03
    const targetGCI = profile.targetUnits * avgNetPerClose

    pdf.setFontSize(11)
    pdf.setFont("helvetica", "normal")
    pdf.setTextColor(55, 65, 81) // Gray-700
    pdf.text(`Annual Closings: ${profile.targetUnits}`, 20, currentY)
    currentY += 6
    pdf.text(`Annual GCI: $${targetGCI.toLocaleString()}`, 20, currentY)
    currentY += 6
    pdf.text(`Weekly Closings: ${Math.round(weeklyTarget * 10) / 10}`, 20, currentY)
    currentY += 8

    // Why section
    if (profile.whyPrimary || profile.whySecondary) {
      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(0, 0, 0)
      pdf.text("Your Why:", 20, currentY)
      currentY += 6
      
      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      const whyText = profile.whyPrimary || profile.whySecondary || "Your motivation drives everything."
      const whyLines = pdf.splitTextToSize(whyText, 170)
      pdf.text(whyLines, 20, currentY)
      currentY += whyLines.length * 4 + 8
    }

    // Weekly KPI Targets
    if (profile.kpiTargets && Object.keys(profile.kpiTargets).length > 0) {
      pdf.setFillColor(240, 253, 244) // Green-50
      pdf.rect(15, currentY - 5, 180, 12, "F")
      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(22, 101, 52) // Green-800
      pdf.text("WEEKLY KPI TARGETS", 20, currentY + 3)
      currentY += 15

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(55, 65, 81)
      Object.entries(profile.kpiTargets).forEach(([kpi, target]) => {
        if (target > 0) {
          pdf.text(`• ${kpi.replace('_', ' ').toUpperCase()}: ${target}`, 20, currentY)
          currentY += 5
        }
      })
      currentY += 8
    }

    // Recommended Channels
    const recommendedChannels = getRecommendedChannels(profile)
    if (recommendedChannels.length > 0) {
      pdf.setFillColor(254, 242, 242) // Red-50
      pdf.rect(15, currentY - 5, 180, 12, "F")
      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(153, 27, 27) // Red-800
      pdf.text("RECOMMENDED CHANNELS", 20, currentY + 3)
      currentY += 15

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(55, 65, 81)
      recommendedChannels.forEach((channel, index) => {
        pdf.text(`${index + 1}. ${channel.name} (Score: ${channel.score}/3)`, 20, currentY)
        currentY += 5
      })
      currentY += 8
    }

    // Weekly Playbook
    const weeklyPlaybook = getWeeklyPlaybook(recommendedChannels)
    if (weeklyPlaybook.length > 0) {
      pdf.setFillColor(254, 249, 195) // Yellow-50
      pdf.rect(15, currentY - 5, 180, 12, "F")
      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(146, 64, 14) // Yellow-800
      pdf.text("WEEKLY PLAYBOOK", 20, currentY + 3)
      currentY += 15

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(55, 65, 81)
      weeklyPlaybook.forEach(channel => {
        pdf.setFont("helvetica", "bold")
        pdf.text(`${channel.channel}:`, 20, currentY)
        currentY += 5
        pdf.setFont("helvetica", "normal")
        channel.plays.forEach(play => {
          pdf.text(`  • ${play}`, 20, currentY)
          currentY += 4
        })
        currentY += 3
      })
      currentY += 8
    }

    // Micro-Skills Training
    const microSkills = getMicroSkills(profile)
    if (microSkills.length > 0) {
      pdf.setFillColor(243, 232, 255) // Purple-50
      pdf.rect(15, currentY - 5, 180, 12, "F")
      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(91, 33, 182) // Purple-800
      pdf.text("MICRO-SKILLS TRAINING", 20, currentY + 3)
      currentY += 15

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(55, 65, 81)
      microSkills.forEach(skill => {
        pdf.setFont("helvetica", "bold")
        pdf.text(`${skill.skill} (${skill.confidence}/10 confidence):`, 20, currentY)
        currentY += 5
        pdf.setFont("helvetica", "normal")
        const drillLines = pdf.splitTextToSize(skill.drill, 170)
        pdf.text(drillLines, 20, currentY)
        currentY += drillLines.length * 4 + 5
      })
      currentY += 8
    }

    // Time Blocks
    if (profile.weeklyBlocks && profile.weeklyBlocks.length > 0) {
      pdf.setFillColor(255, 247, 237) // Orange-50
      pdf.rect(15, currentY - 5, 180, 12, "F")
      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(154, 52, 18) // Orange-800
      pdf.text("WEEKLY SCHEDULE", 20, currentY + 3)
      currentY += 15

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(55, 65, 81)
      profile.weeklyBlocks.forEach(block => {
        pdf.text(`${block.day} at ${block.time}: ${block.activity}`, 20, currentY)
        currentY += 5
      })
      currentY += 8
    }

    // Next Steps
    pdf.setFillColor(236, 253, 245) // Green-50
    pdf.rect(15, currentY - 5, 180, 12, "F")
    pdf.setFontSize(12)
    pdf.setFont("helvetica", "bold")
    pdf.setTextColor(22, 101, 52) // Green-800
    pdf.text("NEXT STEPS", 20, currentY + 3)
    currentY += 15

    pdf.setFontSize(10)
    pdf.setFont("helvetica", "normal")
    pdf.setTextColor(55, 65, 81)
    pdf.text("1. Start This Week: Begin with your primary channel and focus on consistency", 20, currentY)
    currentY += 5
    pdf.text("2. Track Your Progress: Use the KPI targets to measure what's working", 20, currentY)
    currentY += 5
    pdf.text("3. Weekly Check-ins: Review your progress and adjust the plan", 20, currentY)
    currentY += 5
    pdf.text("4. Calendar Integration: Add your time blocks to your calendar", 20, currentY)

    // Add footer
    const pageCount = pdf.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i)
      pdf.setFontSize(8)
      pdf.setTextColor(128, 128, 128)
      pdf.text("Generated by RealCoach AI - The Next Level U", 20, 290)
      pdf.text(`Page ${i} of ${pageCount}`, 170, 290)
    }

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(pdf.output("arraybuffer"))

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="RealCoach_Action_Plan_${profile.name?.replace(/\s+/g, '_') || 'Professional'}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generating RealCoach plan PDF:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}

// Helper functions (simplified versions of the component logic)
function getRecommendedChannels(profile: any) {
  const willing = profile.willingActivities || []
  const energizing = profile.energizingActivities || []
  
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
  
  const channelScores: Record<string, number> = {}
  Object.keys(allChannels).forEach(channel => {
    channelScores[channel] = 0
  })
  
  willing.forEach((activity: string) => {
    const channel = activityToChannel[activity as keyof typeof activityToChannel]
    if (channel) {
      channelScores[channel] += 2
    }
  })
  
  energizing.forEach((activity: string) => {
    const channel = activityToChannel[activity as keyof typeof activityToChannel]
    if (channel) {
      channelScores[channel] += 1
    }
  })

  return Object.entries(channelScores)
    .filter(([channel, score]) => score > 0)
    .sort(([,a], [,b]) => b - a)
    .map(([channel, score]) => ({
      channel,
      score,
      name: allChannels[channel as keyof typeof allChannels] || channel
    }))
}

function getWeeklyPlaybook(recommendedChannels: any[]) {
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

function getMicroSkills(profile: any) {
  const skills = profile.skills || {}
  const willing = profile.willingActivities || []
  
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
    willing.forEach((activity: string) => {
      const skillIds = activityToSkills[activity as keyof typeof activityToSkills] || []
      skillIds.forEach(skill => relevantSkills.add(skill))
    })
    
    return Array.from(relevantSkills).slice(0, 3).map(skillId => ({
      skill: getSkillName(skillId),
      confidence: 5,
      drill: getSkillDrill(skillId)
    }))
  }
  
  const lowConfidenceSkills = Object.entries(skills)
    .filter(([_, confidence]) => confidence < 7)
    .sort(([_, a], [__, b]) => a - b)
    .slice(0, 3)
  
  if (lowConfidenceSkills.length === 0) {
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

function getSkillName(skillId: string) {
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

function getSkillDrill(skillId: string) {
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
