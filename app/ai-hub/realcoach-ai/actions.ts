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
    const prompt = `
Generate: Real estate coaching insights
Style: Professional, motivational, actionable
Focus: Agent coaching and development
Agent Status: ${formData.status}
Agent Experience: ${formData.agentExperience}
Current Earnings: ${formData.lastYearEarnings}
Desired Income: ${formData.desiredIncome}
Biggest Need: ${formData.biggestNeed}

Create:
- Key coaching points
- Actionable strategies
- Motivation and encouragement
- Next steps`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      temperature: 0.7,
      prompt,
    })

    return { success: true, plan: text }
  } catch (error) {
    console.error("Error generating coaching plan:", error)
    return { success: false, error: "Failed to generate coaching plan. Please try again." }
  }
}
