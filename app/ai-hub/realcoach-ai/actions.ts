"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export interface CoachingFormData {
  firstName: string
  lastName: string
  email: string
  status: string
  highestEarnings: string
  lastYearEarnings: string
  incomeSatisfaction: string
  desiredIncome: string
  additionalIncomeNeeded: string
  growthIntent: string
  noGrowthImpact: string
  commitmentReason: boolean | null
  keepConsistent: boolean | null
  incomeReason: string
  biggestNeed: string
  extraCash30Days: string
  currentBills: string
  totalIncome30Days: string
  lastYearTotalIncome: string
  pendingContracts: boolean
  pendingVolume: string
  pendingCalc: string
  averageCommission: string
  dealsThisYear: string
  dealsNeededForGoal: string
  totalIncomeStillNeeded: string
  dealsNeededRemaining: string
  dealsNeeded30Days: string
  conversionRate: string
  appointmentsNeeded: string
  weeklyProspectConversations: string
  totalAppointmentsNeeded: string
  prospectInteractionsNeeded: string
  appointments30Days: string
  weeklyAppointments: string
  newContactsPerWeek: string
  agentExperience: string
  dealSources: string[]
  pastClientsDeals: string
  referralsFromClientsDeals: string
  sphereDeals: string
  referralsFromSphereDeals: string
  agentReferralDeals: string
  geographicalFarmDeals: string
  openHouseDeals: string
  companyLeadsDeals: string
  otherDeals: string
  totalDealsLastYear: string
  timeInArea: string
  bigSphere: boolean
  willColdCall: boolean
  willText: boolean
  largeSocialMedia: boolean
  willJoinGroups: boolean
  preferredLane: string
}

export async function generateCoachingPlan(formData: CoachingFormData) {
  try {
    const prompt = `You are an elite real estate coach for Century 21, dedicated to helping agents reach their short-term income goals with precision and purpose. Based on the agent's responses to the questions below, generate a highly detailed, structured action plan that includes:

1. Executive Summary
Summarize the agent's current status, goals, and driving motivation. Clearly state:

Their experience level: ${formData.agentExperience}
Transactions completed in the past 12 months: ${formData.totalDealsLastYear}
Current situation: ${formData.status}
Immediate income goal: ${formData.totalIncome30Days}
Reason for the income need: ${formData.incomeReason}
Biggest need for cash: ${formData.biggestNeed}

2. Transaction Goal Breakdown
Clearly outline how the transaction goal is calculated:

Income Target: ${formData.totalIncome30Days}
Average Commission per Deal: ${formData.averageCommission}
Required Transactions: ${formData.dealsNeeded30Days}
Required Appointments: ${formData.appointments30Days}
Conversion Rate: ${formData.conversionRate}%
Estimated Conversations Needed: ${formData.weeklyProspectConversations}

3. Prospecting Strategy & Tactics
Design a personalized lead generation plan based on the agent's preferences and strengths:

Time in market: ${formData.timeInArea}
Willingness to:
- Use social networking: ${formData.willJoinGroups ? "Yes" : "No"}
- Cold call: ${formData.willColdCall ? "Yes" : "No"}
- Text prospects: ${formData.willText ? "Yes" : "No"}
- Leverage sphere of influence: ${formData.bigSphere ? "Yes" : "No"}

Preferred Prospecting Lane: ${formData.preferredLane}

Provide action steps tailored to that lane and preferences. Include:
- Daily Contact Goals
- Call, text, DM, or post templates based on channel
- Prospecting schedule (Monday–Friday)
- Social media posting strategy (if applicable)
- CTA script examples for each channel

4. Daily Execution Plan (Mon–Fri)
Break down exact daily activities needed to hit weekly and monthly appointment/conversation goals:

Monday – Friday Breakdown:
📞 Calls: [Insert Daily Target #]
💬 Texts: [Insert Daily Target #]
📱 Social Media: [Post Idea + DM Targets]
👥 Follow-Up: Re-attempts (from prior conversations)
✍️ Track All Conversations and Attempts

5. Accountability Tracker
Provide a simple, trackable system with weekly milestones. Include:
- Weekly conversation targets: ${formData.weeklyProspectConversations}
- Weekly appointments goal: ${formData.weeklyAppointments}
- Weekly deals target (based on conv. rate)

Use spreadsheet or CRM logging to track:
- Attempts made
- Conversations had
- Appointments set
- Appointments held
- Transactions in progress

6. Motivation & Coaching Mindset
Wrap up with a motivational paragraph that ties into the agent's "why," reinforcing that this plan is not just about transactions—it's about reclaiming control, creating momentum, and taking daily action that leads to big breakthroughs.

Format the response with clear headers using the color #b6a888 for section titles, and include relevant emojis for each section. Make it professional and actionable.`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 4000,
    })

    return { success: true, plan: text }
  } catch (error) {
    console.error("Error generating coaching plan:", error)
    return { success: false, error: "Failed to generate coaching plan. Please try again." }
  }
}
