"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateCoachingPlan } from "./actions"
import { Loader2, Copy, Download, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type FormStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

interface FormData {
  // Basic Info
  firstName: string
  lastName: string
  email: string

  // Real Estate Status & Earnings
  status: string
  highestEarnings: string
  lastYearEarnings: string

  // Income Satisfaction
  incomeSatisfaction: string
  desiredIncome: string
  additionalIncomeNeeded: string

  // Business Growth
  growthIntent: string
  noGrowthImpact: string
  commitmentReason: boolean | null
  keepConsistent: boolean | null

  // Purpose & Urgency
  incomeReason: string
  biggestNeed: string
  extraCash30Days: string
  currentBills: string
  totalIncome30Days: string

  // Production Metrics
  lastYearTotalIncome: string
  pendingContracts: boolean
  pendingVolume: string
  pendingCalc: string
  averageCommission: string
  dealsThisYear: string

  // Calculations
  dealsNeededForGoal: string
  incomeToMatchLastYear: string
  dealsForRemainingIncome: string
  dealsNeeded30Days: string
  conversionRate: string
  appointmentsForTargetIncome: string
  weeklyConversations: string
  appointmentsForRemainingIncome: string
  interactionsForAppointments: string
  appointmentsNeeded30Days: string
  weeklyAppointments: string
  newContactsPerWeek: string

  // Experience
  agentExperience: string

  // Deal Sources
  dealSources: {
    pastClients: boolean
    referralsFromPastClients: boolean
    sphereOfInfluence: boolean
    referralsFromSphere: boolean
    referralsFromAgent: boolean
    geographicalFarm: boolean
    openHouse: boolean
    companyLeads: boolean
    other: boolean
  }

  // Deal counts for each source
  pastClientsCount: string
  referralsFromPastClientsCount: string
  sphereOfInfluenceCount: string
  referralsFromSphereCount: string
  referralsFromAgentCount: string
  geographicalFarmCount: string
  openHouseCount: string
  companyLeadsCount: string
  otherCount: string
  totalDealsLastYear: string

  // Market Ties & Outreach
  timeInArea: string
  hasBigSphere: boolean
  willingToColdCall: boolean
  willingToText: boolean
  hasLargeSocialMedia: boolean
  willingToJoinGroups: boolean

  // Focus Area
  focusArea: string
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  status: "",
  highestEarnings: "",
  lastYearEarnings: "",
  incomeSatisfaction: "",
  desiredIncome: "",
  additionalIncomeNeeded: "",
  growthIntent: "",
  noGrowthImpact: "",
  commitmentReason: null,
  keepConsistent: null,
  incomeReason: "",
  biggestNeed: "",
  extraCash30Days: "",
  currentBills: "",
  totalIncome30Days: "",
  lastYearTotalIncome: "",
  pendingContracts: false,
  pendingVolume: "",
  pendingCalc: "",
  averageCommission: "",
  dealsThisYear: "",
  dealsNeededForGoal: "",
  incomeToMatchLastYear: "",
  dealsForRemainingIncome: "",
  dealsNeeded30Days: "",
  conversionRate: "",
  appointmentsForTargetIncome: "",
  weeklyConversations: "",
  appointmentsForRemainingIncome: "",
  interactionsForAppointments: "",
  appointmentsNeeded30Days: "",
  weeklyAppointments: "",
  newContactsPerWeek: "",
  agentExperience: "",
  dealSources: {
    pastClients: false,
    referralsFromPastClients: false,
    sphereOfInfluence: false,
    referralsFromSphere: false,
    referralsFromAgent: false,
    geographicalFarm: false,
    openHouse: false,
    companyLeads: false,
    other: false,
  },
  pastClientsCount: "",
  referralsFromPastClientsCount: "",
  sphereOfInfluenceCount: "",
  referralsFromSphereCount: "",
  referralsFromAgentCount: "",
  geographicalFarmCount: "",
  openHouseCount: "",
  companyLeadsCount: "",
  otherCount: "",
  totalDealsLastYear: "",
  timeInArea: "",
  hasBigSphere: false,
  willingToColdCall: false,
  willingToText: false,
  hasLargeSocialMedia: false,
  willingToJoinGroups: false,
  focusArea: "",
}

export default function RealCoachForm() {
  const [currentStep, setCurrentStep] = useState<FormStep>(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isGenerating, setIsGenerating] = useState(false)
  const [coachingPlan, setCoachingPlan] = useState<string>("")
  const [isEmailSending, setIsEmailSending] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const { toast } = useToast()

  // Calculate derived values when relevant form fields change
  useEffect(() => {
    // Calculate total income needed for 30 days
    if (formData.extraCash30Days && formData.currentBills) {
      const extraCash = Number.parseFloat(formData.extraCash30Days.replace(/[$,]/g, "")) || 0
      const currentBills = Number.parseFloat(formData.currentBills.replace(/[$,]/g, "")) || 0
      const total = extraCash + currentBills
      setFormData((prev) => ({
        ...prev,
        totalIncome30Days: total.toString(),
      }))
    }

    // Calculate deals needed based on income goal and average commission
    if (formData.totalIncome30Days && formData.averageCommission) {
      const incomeNeeded = Number.parseFloat(formData.totalIncome30Days) || 0
      const avgCommission = Number.parseFloat(formData.averageCommission.replace(/[$,]/g, "")) || 9500 // Default to $9,500
      const dealsNeeded = Math.ceil(incomeNeeded / avgCommission)
      setFormData((prev) => ({
        ...prev,
        dealsNeededForGoal: dealsNeeded.toString(),
        dealsNeeded30Days: dealsNeeded.toString(),
      }))
    }

    // Calculate appointments and conversations needed
    if (formData.dealsNeededForGoal && formData.conversionRate) {
      const dealsNeeded = Number.parseInt(formData.dealsNeededForGoal) || 0
      const convRate = Number.parseInt(formData.conversionRate) || 20 // Default to 20%
      const convRateDecimal = convRate / 100

      // Appointments needed (deals ÷ conversion rate)
      const appointmentsNeeded = Math.ceil(dealsNeeded / convRateDecimal)

      // Weekly appointments (total ÷ 4 weeks)
      const weeklyAppointments = Math.ceil(appointmentsNeeded / 4)

      // Conversations needed (assuming 8% conversion from conversation to appointment)
      const conversionsToAppointment = 0.08
      const conversationsNeeded = Math.ceil(appointmentsNeeded / conversionsToAppointment)
      const weeklyConversations = Math.ceil(conversationsNeeded / 4)

      // New contacts per week (assuming 7 attempts per contact)
      const attemptsPerContact = 7
      const newContactsPerWeek = Math.ceil(weeklyConversations / attemptsPerContact)

      setFormData((prev) => ({
        ...prev,
        appointmentsForTargetIncome: appointmentsNeeded.toString(),
        appointmentsNeeded30Days: appointmentsNeeded.toString(),
        weeklyAppointments: weeklyAppointments.toString(),
        interactionsForAppointments: conversationsNeeded.toString(),
        weeklyConversations: weeklyConversations.toString(),
        newContactsPerWeek: newContactsPerWeek.toString(),
      }))
    }

    // Calculate total deals from sources
    let totalDeals = 0
    if (formData.dealSources.pastClients && formData.pastClientsCount)
      totalDeals += Number.parseInt(formData.pastClientsCount) || 0
    if (formData.dealSources.referralsFromPastClients && formData.referralsFromPastClientsCount)
      totalDeals += Number.parseInt(formData.referralsFromPastClientsCount) || 0
    if (formData.dealSources.sphereOfInfluence && formData.sphereOfInfluenceCount)
      totalDeals += Number.parseInt(formData.sphereOfInfluenceCount) || 0
    if (formData.dealSources.referralsFromSphere && formData.referralsFromSphereCount)
      totalDeals += Number.parseInt(formData.referralsFromSphereCount) || 0
    if (formData.dealSources.referralsFromAgent && formData.referralsFromAgentCount)
      totalDeals += Number.parseInt(formData.referralsFromAgentCount) || 0
    if (formData.dealSources.geographicalFarm && formData.geographicalFarmCount)
      totalDeals += Number.parseInt(formData.geographicalFarmCount) || 0
    if (formData.dealSources.openHouse && formData.openHouseCount)
      totalDeals += Number.parseInt(formData.openHouseCount) || 0
    if (formData.dealSources.companyLeads && formData.companyLeadsCount)
      totalDeals += Number.parseInt(formData.companyLeadsCount) || 0
    if (formData.dealSources.other && formData.otherCount) totalDeals += Number.parseInt(formData.otherCount) || 0

    if (totalDeals > 0) {
      setFormData((prev) => ({
        ...prev,
        totalDealsLastYear: totalDeals.toString(),
      }))
    }
  }, [
    formData.extraCash30Days,
    formData.currentBills,
    formData.totalIncome30Days,
    formData.averageCommission,
    formData.dealsNeededForGoal,
    formData.conversionRate,
    formData.dealSources,
    formData.pastClientsCount,
    formData.referralsFromPastClientsCount,
    formData.sphereOfInfluenceCount,
    formData.referralsFromSphereCount,
    formData.referralsFromAgentCount,
    formData.geographicalFarmCount,
    formData.openHouseCount,
    formData.companyLeadsCount,
    formData.otherCount,
  ])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleBooleanChange = (name: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDealSourceChange = (source: keyof FormData["dealSources"], checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      dealSources: {
        ...prev.dealSources,
        [source]: checked,
      },
    }))
  }

  const nextStep = () => {
    // Validate current step
    if (currentStep === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields to continue.",
          variant: "destructive",
        })
        return
      }
    }

    // Handle conditional logic for step progression
    if (currentStep === 4) {
      if (formData.noGrowthImpact === "I'd be fine" && formData.commitmentReason === false) {
        // Skip to step 7 if they're fine and not committed to growing
        setCurrentStep(7)
        return
      }

      if (formData.status === "I need money asap") {
        // Go to urgency questions if they need money ASAP
        setCurrentStep(5)
        return
      }

      // Otherwise go to production metrics
      setCurrentStep(6)
      return
    }

    // Normal progression
    setCurrentStep((prev) => (prev < 10 ? ((prev + 1) as FormStep) : prev))
  }

  const prevStep = () => {
    // Handle conditional logic for step regression
    if (currentStep === 6) {
      if (formData.status === "I need money asap") {
        // Go back to urgency questions if they came from there
        setCurrentStep(5)
        return
      }

      // Otherwise go back to business growth
      setCurrentStep(4)
      return
    }

    if (currentStep === 7 && formData.noGrowthImpact === "I'd be fine" && formData.commitmentReason === false) {
      // Go back to business growth if they skipped urgency and production
      setCurrentStep(4)
      return
    }

    // Normal regression
    setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as FormStep) : prev))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    try {
      const result = await generateCoachingPlan(formData)
      if (result.success) {
        setCoachingPlan(result.plan)
        setCurrentStep(10)
      } else {
        throw new Error(result.error || "Failed to generate plan")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate your coaching plan. Please try again.",
        variant: "destructive",
      })
      console.error("Error generating coaching plan:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(coachingPlan)
      toast({
        title: "Copied!",
        description: "Coaching plan copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      })
    }
  }

  const downloadPDF = async () => {
    setIsDownloading(true)
    try {
      const response = await fetch("/api/generate-coaching-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: coachingPlan,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
        }),
      })

      if (!response.ok) throw new Error("Failed to generate PDF")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `RealCoach_Plan_${formData.lastName}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Success!",
        description: "Your coaching plan has been downloaded as a PDF.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive",
      })
      console.error("Error downloading PDF:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  const sendEmail = async () => {
    setIsEmailSending(true)
    try {
      const response = await fetch("/api/send-coaching-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: coachingPlan,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
        }),
      })

      if (!response.ok) throw new Error("Failed to send email")

      toast({
        title: "Email Sent!",
        description: "Your coaching plan has been sent to your email.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      })
      console.error("Error sending email:", error)
    } finally {
      setIsEmailSending(false)
    }
  }

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((step) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full ${
                step === currentStep ? "bg-[#b6a888]" : step < currentStep ? "bg-gray-400" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
    )
  }

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#b6a888]">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#b6a888]">Real Estate Status & Earnings Goals</h2>

            <div>
              <Label>Which best describes you?</Label>
              <RadioGroup
                value={formData.status}
                onValueChange={(value) => handleRadioChange("status", value)}
                className="mt-2 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="I need money asap" id="status-1" />
                  <Label htmlFor="status-1">I need money ASAP</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="I am new to real estate" id="status-2" />
                  <Label htmlFor="status-2">I am new to real estate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="I would like to keep my business consistent" id="status-3" />
                  <Label htmlFor="status-3">I would like to keep my business consistent</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="I am doing well just looking to expand" id="status-4" />
                  <Label htmlFor="status-4">I am doing well just looking to expand</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="highestEarnings">
                What is the most amount of money you have ever earned in a single year?
              </Label>
              <Input
                id="highestEarnings"
                name="highestEarnings"
                type="text"
                placeholder="$"
                value={formData.highestEarnings}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="lastYearEarnings">How much income did you earn last year?</Label>
              <Input
                id="lastYearEarnings"
                name="lastYearEarnings"
                type="text"
                placeholder="$"
                value={formData.lastYearEarnings}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#b6a888]">Income Satisfaction & Goal Setting</h2>

            <div>
              <Label>What best describes that level of income?</Label>
              <RadioGroup
                value={formData.incomeSatisfaction}
                onValueChange={(value) => handleRadioChange("incomeSatisfaction", value)}
                className="mt-2 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Perfect, allows me to live the lifestyle I want" id="income-1" />
                  <Label htmlFor="income-1">Perfect, allows me to live the lifestyle I want</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Okay, but I'd like to earn more" id="income-2" />
                  <Label htmlFor="income-2">Okay, but I'd like to earn more</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No where near enough" id="income-3" />
                  <Label htmlFor="income-3">No where near enough</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="More than needed" id="income-4" />
                  <Label htmlFor="income-4">More than needed</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="desiredIncome">
                What is the income that would allow you to live the lifestyle you want?
              </Label>
              <Input
                id="desiredIncome"
                name="desiredIncome"
                type="text"
                placeholder="$"
                value={formData.desiredIncome}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="additionalIncomeNeeded">How much additional income do you need?</Label>
              <Input
                id="additionalIncomeNeeded"
                name="additionalIncomeNeeded"
                type="text"
                placeholder="$"
                value={formData.additionalIncomeNeeded}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#b6a888]">Business Growth Intent & Implications</h2>

            <div>
              <Label>Which best describes your desire to grow your business?</Label>
              <RadioGroup
                value={formData.growthIntent}
                onValueChange={(value) => handleRadioChange("growthIntent", value)}
                className="mt-2 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Increase income" id="growth-1" />
                  <Label htmlFor="growth-1">Increase income</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Do more deals (volume)" id="growth-2" />
                  <Label htmlFor="growth-2">Do more deals (volume)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Add a new lane to business" id="growth-3" />
                  <Label htmlFor="growth-3">Add a new lane to business</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>If you don't earn this extra level of income, which best describes your situation?</Label>
              <RadioGroup
                value={formData.noGrowthImpact}
                onValueChange={(value) => handleRadioChange("noGrowthImpact", value)}
                className="mt-2 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="I'd be fine" id="impact-1" />
                  <Label htmlFor="impact-1">I'd be fine</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="I won't be able to eat" id="impact-2" />
                  <Label htmlFor="impact-2">I won't be able to eat</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="I won't be able to pay some bills" id="impact-3" />
                  <Label htmlFor="impact-3">I won't be able to pay some bills</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="I won't be able to do certain things (vacation etc.)" id="impact-4" />
                  <Label htmlFor="impact-4">I won't be able to do certain things (vacation etc.)</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.noGrowthImpact === "I'd be fine" && (
              <div>
                <Label>Do you have a reason you are committed to growing your business?</Label>
                <div className="flex space-x-4 mt-2">
                  <Button
                    type="button"
                    variant={formData.commitmentReason === true ? "default" : "outline"}
                    onClick={() => handleBooleanChange("commitmentReason", true)}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    variant={formData.commitmentReason === false ? "default" : "outline"}
                    onClick={() => handleBooleanChange("commitmentReason", false)}
                  >
                    No
                  </Button>
                </div>
              </div>
            )}

            {formData.noGrowthImpact === "I'd be fine" && formData.commitmentReason === false && (
              <div>
                <Label>
                  We think the best course is to build a plan to keep your business consistent. Do you agree?
                </Label>
                <div className="flex space-x-4 mt-2">
                  <Button
                    type="button"
                    variant={formData.keepConsistent === true ? "default" : "outline"}
                    onClick={() => handleBooleanChange("keepConsistent", true)}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    variant={formData.keepConsistent === false ? "default" : "outline"}
                    onClick={() => handleBooleanChange("keepConsistent", false)}
                  >
                    No
                  </Button>
                </div>
              </div>
            )}
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#b6a888]">Purpose & Urgency</h2>

            <div>
              <Label htmlFor="incomeReason">What is your reason for the additional income?</Label>
              <Textarea
                id="incomeReason"
                name="incomeReason"
                value={formData.incomeReason}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="biggestNeed">What is the biggest need for the cash?</Label>
              <Input
                id="biggestNeed"
                name="biggestNeed"
                value={formData.biggestNeed}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="extraCash30Days">How much extra cash do you need in the next 30 days?</Label>
              <Input
                id="extraCash30Days"
                name="extraCash30Days"
                type="text"
                placeholder="$"
                value={formData.extraCash30Days}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="currentBills">How much are your current bills beyond the extra you need?</Label>
              <Input
                id="currentBills"
                name="currentBills"
                type="text"
                placeholder="$"
                value={formData.currentBills}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <Label>Total income needed over the next 30 days</Label>
              <div className="text-xl font-bold text-[#b6a888]">
                ${formData.totalIncome30Days ? Number.parseInt(formData.totalIncome30Days).toLocaleString() : "0"}
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#b6a888]">Production Metrics & Planning</h2>

            <div>
              <Label htmlFor="lastYearTotalIncome">What was your total income from real estate last year?</Label>
              <Input
                id="lastYearTotalIncome"
                name="lastYearTotalIncome"
                type="text"
                placeholder="$"
                value={formData.lastYearTotalIncome}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label>Do you have any pending contracts?</Label>
              <div className="flex space-x-4 mt-2">
                <Button
                  type="button"
                  variant={formData.pendingContracts === true ? "default" : "outline"}
                  onClick={() => handleBooleanChange("pendingContracts", true)}
                >
                  Yes
                </Button>
                <Button
                  type="button"
                  variant={formData.pendingContracts === false ? "default" : "outline"}
                  onClick={() => handleBooleanChange("pendingContracts", false)}
                >
                  No
                </Button>
              </div>
            </div>

            {formData.pendingContracts && (
              <div>
                <Label htmlFor="pendingVolume">Total $ volume of pending sales</Label>
                <Input
                  id="pendingVolume"
                  name="pendingVolume"
                  type="text"
                  placeholder="$"
                  value={formData.pendingVolume}
                  onChange={handleInputChange}
                />
              </div>
            )}

            <div>
              <Label htmlFor="averageCommission">Enter Your Average Deal Commission</Label>
              <Input
                id="averageCommission"
                name="averageCommission"
                type="text"
                placeholder="$ (company average is $9,500)"
                value={formData.averageCommission}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="dealsThisYear">How many deals have you done this year already? (excluding pending)</Label>
              <Input
                id="dealsThisYear"
                name="dealsThisYear"
                type="number"
                value={formData.dealsThisYear}
                onChange={handleInputChange}
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div>
                <Label>Deals needed to hit income goal</Label>
                <div className="text-lg font-bold">{formData.dealsNeededForGoal || "0"}</div>
              </div>

              <div>
                <Label>Select Your Conversion Rate %</Label>
                <Select
                  value={formData.conversionRate}
                  onValueChange={(value) => handleSelectChange("conversionRate", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select conversion rate" />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((rate) => (
                      <SelectItem key={rate} value={rate.toString()}>
                        {rate}%
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.conversionRate && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div>
                  <Label>Appointments needed to earn target income</Label>
                  <div className="text-lg font-bold text-blue-600">{formData.appointmentsForTargetIncome || "0"}</div>
                </div>

                <div>
                  <Label>Weekly prospect conversations needed</Label>
                  <div className="text-lg font-bold text-green-600">{formData.weeklyConversations || "0"}</div>
                </div>

                <div>
                  <Label>Appointments needed in next 30 days</Label>
                  <div className="text-lg font-bold text-purple-600">{formData.appointmentsNeeded30Days || "0"}</div>
                </div>

                <div>
                  <Label>Weekly required appointments over next 4 weeks</Label>
                  <div className="text-lg font-bold text-orange-600">{formData.weeklyAppointments || "0"}</div>
                </div>

                <div>
                  <Label>New contacts needed per week to hit appointment goal</Label>
                  <div className="text-lg font-bold text-red-600">{formData.newContactsPerWeek || "0"}</div>
                </div>
              </div>
            )}
          </div>
        )

      case 7:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#b6a888]">Experience Level</h2>

            <div>
              <Label>Select Your Agent Experience</Label>
              <RadioGroup
                value={formData.agentExperience}
                onValueChange={(value) => handleRadioChange("agentExperience", value)}
                className="mt-2 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="New Agent (0-4 deals LTM)" id="exp-1" />
                  <Label htmlFor="exp-1">New Agent (0-4 deals LTM)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Experienced Agent (5+ deals LTM)" id="exp-2" />
                  <Label htmlFor="exp-2">Experienced Agent (5+ deals LTM)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )

      case 8:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#b6a888]">Leverage Your Sources</h2>

            <div>
              <Label className="text-lg">Deal Sources From Last 12 Months</Label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pastClients"
                    checked={formData.dealSources.pastClients}
                    onCheckedChange={(checked) => handleDealSourceChange("pastClients", checked === true)}
                  />
                  <Label htmlFor="pastClients">Past Clients</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="referralsFromPastClients"
                    checked={formData.dealSources.referralsFromPastClients}
                    onCheckedChange={(checked) => handleDealSourceChange("referralsFromPastClients", checked === true)}
                  />
                  <Label htmlFor="referralsFromPastClients">Referrals from past clients</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sphereOfInfluence"
                    checked={formData.dealSources.sphereOfInfluence}
                    onCheckedChange={(checked) => handleDealSourceChange("sphereOfInfluence", checked === true)}
                  />
                  <Label htmlFor="sphereOfInfluence">Sphere Of Influence</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="referralsFromSphere"
                    checked={formData.dealSources.referralsFromSphere}
                    onCheckedChange={(checked) => handleDealSourceChange("referralsFromSphere", checked === true)}
                  />
                  <Label htmlFor="referralsFromSphere">Referrals from Sphere</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="referralsFromAgent"
                    checked={formData.dealSources.referralsFromAgent}
                    onCheckedChange={(checked) => handleDealSourceChange("referralsFromAgent", checked === true)}
                  />
                  <Label htmlFor="referralsFromAgent">Referrals from another agent</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="geographicalFarm"
                    checked={formData.dealSources.geographicalFarm}
                    onCheckedChange={(checked) => handleDealSourceChange("geographicalFarm", checked === true)}
                  />
                  <Label htmlFor="geographicalFarm">Geographical Farm</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="openHouse"
                    checked={formData.dealSources.openHouse}
                    onCheckedChange={(checked) => handleDealSourceChange("openHouse", checked === true)}
                  />
                  <Label htmlFor="openHouse">Open House</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="companyLeads"
                    checked={formData.dealSources.companyLeads}
                    onCheckedChange={(checked) => handleDealSourceChange("companyLeads", checked === true)}
                  />
                  <Label htmlFor="companyLeads">Company generated leads</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="other"
                    checked={formData.dealSources.other}
                    onCheckedChange={(checked) => handleDealSourceChange("other", checked === true)}
                  />
                  <Label htmlFor="other">Other</Label>
                </div>
              </div>
            </div>

            {/* Input fields for each selected source */}
            <div className="space-y-3">
              {formData.dealSources.pastClients && (
                <div>
                  <Label htmlFor="pastClientsCount">Number of deals from Past Clients</Label>
                  <Input
                    id="pastClientsCount"
                    name="pastClientsCount"
                    type="number"
                    value={formData.pastClientsCount}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              {formData.dealSources.referralsFromPastClients && (
                <div>
                  <Label htmlFor="referralsFromPastClientsCount">
                    Number of deals from Referrals from past clients
                  </Label>
                  <Input
                    id="referralsFromPastClientsCount"
                    name="referralsFromPastClientsCount"
                    type="number"
                    value={formData.referralsFromPastClientsCount}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              {formData.dealSources.sphereOfInfluence && (
                <div>
                  <Label htmlFor="sphereOfInfluenceCount">Number of deals from Sphere Of Influence</Label>
                  <Input
                    id="sphereOfInfluenceCount"
                    name="sphereOfInfluenceCount"
                    type="number"
                    value={formData.sphereOfInfluenceCount}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              {formData.dealSources.referralsFromSphere && (
                <div>
                  <Label htmlFor="referralsFromSphereCount">Number of deals from Referrals from Sphere</Label>
                  <Input
                    id="referralsFromSphereCount"
                    name="referralsFromSphereCount"
                    type="number"
                    value={formData.referralsFromSphereCount}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              {formData.dealSources.referralsFromAgent && (
                <div>
                  <Label htmlFor="referralsFromAgentCount">Number of deals from Referrals from another agent</Label>
                  <Input
                    id="referralsFromAgentCount"
                    name="referralsFromAgentCount"
                    type="number"
                    value={formData.referralsFromAgentCount}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              {formData.dealSources.geographicalFarm && (
                <div>
                  <Label htmlFor="geographicalFarmCount">Number of deals from Geographical Farm</Label>
                  <Input
                    id="geographicalFarmCount"
                    name="geographicalFarmCount"
                    type="number"
                    value={formData.geographicalFarmCount}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              {formData.dealSources.openHouse && (
                <div>
                  <Label htmlFor="openHouseCount">Number of deals from Open House</Label>
                  <Input
                    id="openHouseCount"
                    name="openHouseCount"
                    type="number"
                    value={formData.openHouseCount}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              {formData.dealSources.companyLeads && (
                <div>
                  <Label htmlFor="companyLeadsCount">Number of deals from Company generated leads</Label>
                  <Input
                    id="companyLeadsCount"
                    name="companyLeadsCount"
                    type="number"
                    value={formData.companyLeadsCount}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              {formData.dealSources.other && (
                <div>
                  <Label htmlFor="otherCount">Number of deals from Other sources</Label>
                  <Input
                    id="otherCount"
                    name="otherCount"
                    type="number"
                    value={formData.otherCount}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <Label>Total # of deals this past year</Label>
              <div className="text-xl font-bold text-[#b6a888]">{formData.totalDealsLastYear || "0"}</div>
            </div>
          </div>
        )

      case 9:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#b6a888]">Market Ties & Outreach Willingness</h2>

            <div>
              <Label>How long have you lived in the area you plan to sell in?</Label>
              <RadioGroup
                value={formData.timeInArea}
                onValueChange={(value) => handleRadioChange("timeInArea", value)}
                className="mt-2 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="<2 years" id="time-1" />
                  <Label htmlFor="time-1">&lt;2 years</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3-5 years" id="time-2" />
                  <Label htmlFor="time-2">3-5 years</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="6+ years" id="time-3" />
                  <Label htmlFor="time-3">6+ years</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Do you have a big sphere?</Label>
              <div className="flex space-x-4 mt-2">
                <Button
                  type="button"
                  variant={formData.hasBigSphere === true ? "default" : "outline"}
                  onClick={() => handleBooleanChange("hasBigSphere", true)}
                >
                  Yes
                </Button>
                <Button
                  type="button"
                  variant={formData.hasBigSphere === false ? "default" : "outline"}
                  onClick={() => handleBooleanChange("hasBigSphere", false)}
                >
                  No
                </Button>
              </div>
            </div>

            <div>
              <Label>Are you willing to cold call?</Label>
              <div className="flex space-x-4 mt-2">
                <Button
                  type="button"
                  variant={formData.willingToColdCall === true ? "default" : "outline"}
                  onClick={() => handleBooleanChange("willingToColdCall", true)}
                >
                  Yes
                </Button>
                <Button
                  type="button"
                  variant={formData.willingToColdCall === false ? "default" : "outline"}
                  onClick={() => handleBooleanChange("willingToColdCall", false)}
                >
                  No
                </Button>
              </div>
            </div>

            <div>
              <Label>Are you willing to text people?</Label>
              <div className="flex space-x-4 mt-2">
                <Button
                  type="button"
                  variant={formData.willingToText === true ? "default" : "outline"}
                  onClick={() => handleBooleanChange("willingToText", true)}
                >
                  Yes
                </Button>
                <Button
                  type="button"
                  variant={formData.willingToText === false ? "default" : "outline"}
                  onClick={() => handleBooleanChange("willingToText", false)}
                >
                  No
                </Button>
              </div>
            </div>

            <div>
              <Label>Do you have a large social media presence?</Label>
              <div className="flex space-x-4 mt-2">
                <Button
                  type="button"
                  variant={formData.hasLargeSocialMedia === true ? "default" : "outline"}
                  onClick={() => handleBooleanChange("hasLargeSocialMedia", true)}
                >
                  Yes
                </Button>
                <Button
                  type="button"
                  variant={formData.hasLargeSocialMedia === false ? "default" : "outline"}
                  onClick={() => handleBooleanChange("hasLargeSocialMedia", false)}
                >
                  No
                </Button>
              </div>
            </div>

            <div>
              <Label>
                Are you willing to join groups on social and spend hours each day on the platform sending messages,
                posting and starting conversations?
              </Label>
              <div className="flex space-x-4 mt-2">
                <Button
                  type="button"
                  variant={formData.willingToJoinGroups === true ? "default" : "outline"}
                  onClick={() => handleBooleanChange("willingToJoinGroups", true)}
                >
                  Yes
                </Button>
                <Button
                  type="button"
                  variant={formData.willingToJoinGroups === false ? "default" : "outline"}
                  onClick={() => handleBooleanChange("willingToJoinGroups", false)}
                >
                  No
                </Button>
              </div>
            </div>

            <div>
              <Label>Select the lane below that most excites you</Label>
              <RadioGroup
                value={formData.focusArea}
                onValueChange={(value) => handleRadioChange("focusArea", value)}
                className="mt-2 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="For Sale By Owners" id="focus-1" />
                  <Label htmlFor="focus-1">For Sale By Owners</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Expired Listings" id="focus-2" />
                  <Label htmlFor="focus-2">Expired Listings</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="My Sphere of Influence" id="focus-3" />
                  <Label htmlFor="focus-3">My Sphere of Influence</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Social Media" id="focus-4" />
                  <Label htmlFor="focus-4">Social Media</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Probate" id="focus-5" />
                  <Label htmlFor="focus-5">Probate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Helping Divorcing Couples" id="focus-6" />
                  <Label htmlFor="focus-6">Helping Divorcing Couples</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Absentee Owners" id="focus-7" />
                  <Label htmlFor="focus-7">Absentee Owners</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Pre-foreclosure" id="focus-8" />
                  <Label htmlFor="focus-8">Pre-foreclosure</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )

      case 10:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#b6a888] text-center">Your Personalized Coaching Plan</h2>

            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-[#b6a888]" />
                <p className="mt-4 text-lg">Generating your personalized coaching plan...</p>
              </div>
            ) : coachingPlan && typeof coachingPlan === "string" ? (
              <>
                {/* Executive Summary Card */}
                <Card className="p-6 bg-gradient-to-r from-[#b6a888]/10 to-[#b6a888]/5 border-[#b6a888]/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#b6a888] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">📊</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#b6a888]">Executive Summary</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-sm text-gray-600">Experience Level</div>
                      <div className="text-lg font-semibold">{formData.agentExperience}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-sm text-gray-600">30-Day Income Goal</div>
                      <div className="text-2xl font-bold text-green-600">
                        $
                        {formData.totalIncome30Days
                          ? Number.parseInt(formData.totalIncome30Days).toLocaleString()
                          : "0"}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-sm text-gray-600">Deals Needed</div>
                      <div className="text-2xl font-bold text-blue-600">{formData.dealsNeededForGoal || "0"}</div>
                    </div>
                  </div>
                </Card>

                {/* Key Metrics Dashboard */}
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">🎯</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Key Performance Metrics</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{formData.appointmentsNeeded30Days || "0"}</div>
                      <div className="text-sm text-gray-600">Appointments Needed</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{formData.weeklyAppointments || "0"}</div>
                      <div className="text-sm text-gray-600">Weekly Appointments</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{formData.weeklyConversations || "0"}</div>
                      <div className="text-sm text-gray-600">Weekly Conversations</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{formData.conversionRate || "0"}%</div>
                      <div className="text-sm text-gray-600">Conversion Rate</div>
                    </div>
                  </div>
                </Card>

                {/* Daily Action Plan */}
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">📅</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Daily Action Plan</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                      <div key={day} className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-2">{day}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>📞 Calls:</span>
                            <span className="font-semibold">{Math.ceil(Number(formData.weeklyConversations) / 5)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>💬 Texts:</span>
                            <span className="font-semibold">{Math.ceil(Number(formData.weeklyConversations) / 5)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>📧 Emails:</span>
                            <span className="font-semibold">
                              {Math.ceil(Number(formData.weeklyConversations) / 10)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Focus Area Strategy */}
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">🔍</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Prospecting Strategy</h3>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-lg font-semibold text-purple-800 mb-2">
                      Primary Focus: {formData.focusArea}
                    </div>
                    <div className="text-gray-700">
                      Based on your preferences and experience, we recommend focusing on{" "}
                      {formData.focusArea.toLowerCase()}
                      as your primary prospecting lane. This aligns with your willingness to{" "}
                      {formData.willingToColdCall ? "cold call" : "use alternative methods"}
                      and your {formData.timeInArea} of experience in the area.
                    </div>
                  </div>
                </Card>

                {/* Weekly Tracker */}
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">📈</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Weekly Accountability Tracker</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Metric</th>
                          <th className="text-center p-2">Week 1</th>
                          <th className="text-center p-2">Week 2</th>
                          <th className="text-center p-2">Week 3</th>
                          <th className="text-center p-2">Week 4</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Conversations</td>
                          <td className="text-center p-2">{formData.weeklyConversations}</td>
                          <td className="text-center p-2">{formData.weeklyConversations}</td>
                          <td className="text-center p-2">{formData.weeklyConversations}</td>
                          <td className="text-center p-2">{formData.weeklyConversations}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Appointments</td>
                          <td className="text-center p-2">{formData.weeklyAppointments}</td>
                          <td className="text-center p-2">{formData.weeklyAppointments}</td>
                          <td className="text-center p-2">{formData.weeklyAppointments}</td>
                          <td className="text-center p-2">{formData.weeklyAppointments}</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-medium">Target Deals</td>
                          <td className="text-center p-2">{Math.ceil(Number(formData.dealsNeededForGoal) / 4)}</td>
                          <td className="text-center p-2">{Math.ceil(Number(formData.dealsNeededForGoal) / 4)}</td>
                          <td className="text-center p-2">{Math.ceil(Number(formData.dealsNeededForGoal) / 4)}</td>
                          <td className="text-center p-2">{Math.ceil(Number(formData.dealsNeededForGoal) / 4)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* AI Generated Detailed Plan */}
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#b6a888] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">🤖</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">AI-Generated Action Plan</h3>
                  </div>
                  <div className="prose max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: coachingPlan.replace(/\n/g, "<br>") }} />
                  </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button onClick={copyToClipboard} className="whitespace-nowrap">
                    <Copy className="mr-2 h-4 w-4" /> Copy Plan
                  </Button>

                  <Button onClick={downloadPDF} disabled={isDownloading} className="whitespace-nowrap">
                    <Download className="mr-2 h-4 w-4" />
                    {isDownloading ? "Downloading..." : "Download PDF"}
                  </Button>

                  <Button onClick={sendEmail} disabled={isEmailSending} className="whitespace-nowrap">
                    <Mail className="mr-2 h-4 w-4" />
                    {isEmailSending ? "Sending..." : "Email Plan"}
                  </Button>
                </div>

                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFormData(initialFormData)
                      setCoachingPlan("")
                      setCurrentStep(1)
                    }}
                  >
                    Create New Plan
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p>Click "Generate Plan" to create your personalized coaching plan.</p>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {renderStepIndicator()}

      {renderFormStep()}

      <div className="flex justify-between mt-6">
        {currentStep > 1 && currentStep !== 10 && (
          <Button type="button" variant="outline" onClick={prevStep}>
            Back
          </Button>
        )}

        {currentStep < 10 ? (
          <Button type="button" onClick={nextStep} className="ml-auto">
            Next
          </Button>
        ) : !coachingPlan ? (
          <Button type="submit" disabled={isGenerating} className="ml-auto">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Plan"
            )}
          </Button>
        ) : null}
      </div>
    </form>
  )
}
