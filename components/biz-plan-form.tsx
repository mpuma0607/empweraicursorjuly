"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Mail, TrendingUp, FileText, Save, Check } from "lucide-react"
import { Smartphone, Target } from "lucide-react"
import { useMemberSpaceUser } from "@/hooks/use-memberspace-user"
import { saveUserCreation, generateCreationTitle } from "@/lib/auto-save-creation"

interface FormData {
  name: string
  email: string
  situation: string
  targetEarnings: number
  moneyPlan: string
  avgCommission: number
  conversionRate: number
}

interface BusinessPlan {
  dealsNeeded: number
  appointmentsNeeded: number
  conversationsNeeded: number
  attemptsNeeded: number
  dailyConversations: number
  weeklyConversations: number
  monthlyConversations: number
  dailyAppointments: number
  weeklyAppointments: number
  monthlyAppointments: number
  dailyAttempts: number
  weeklyAttempts: number
  monthlyAttempts: number
}

export default function BizPlanForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    situation: "",
    targetEarnings: 0,
    moneyPlan: "",
    avgCommission: 9500,
    conversionRate: 80,
  })

  const [businessPlan, setBusinessPlan] = useState<BusinessPlan | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isEmailing, setIsEmailing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [isCreatingSimpleWallpaper, setIsCreatingSimpleWallpaper] = useState(false)
  const [isEmailingWallpaper, setIsEmailingWallpaper] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)
  const { user, isLoggedIn } = useMemberSpaceUser()

  useEffect(() => {
    if (businessPlan && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }, 100)
    }
  }, [businessPlan])

  // Auto-populate user data when logged in
  useEffect(() => {
    if (isLoggedIn && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || prev.name,
        email: user.email || prev.email,
      }))
    }
  }, [isLoggedIn, user])

  const calculateBusinessPlan = () => {
    setIsCalculating(true)
    setMessage("")

    // Simulate calculation delay
    setTimeout(() => {
      const dealsNeeded = Math.ceil(formData.targetEarnings / formData.avgCommission)
      const appointmentsNeeded = Math.ceil(dealsNeeded / (formData.conversionRate / 100))
      const conversationsNeeded = Math.ceil(appointmentsNeeded / 0.08) // 8% conversion rate
      const attemptsNeeded = conversationsNeeded * 7 // 7 attempts per conversation

      const dailyConversations = Math.ceil(conversationsNeeded / 90)
      const weeklyConversations = Math.ceil(conversationsNeeded / 13) // ~13 weeks in 90 days
      const monthlyConversations = Math.ceil(conversationsNeeded / 3)

      const dailyAppointments = Math.ceil(appointmentsNeeded / 90)
      const weeklyAppointments = Math.ceil(appointmentsNeeded / 13)
      const monthlyAppointments = Math.ceil(appointmentsNeeded / 3)

      const dailyAttempts = Math.ceil(attemptsNeeded / 90)
      const weeklyAttempts = Math.ceil(attemptsNeeded / 13)
      const monthlyAttempts = Math.ceil(attemptsNeeded / 3)

      setBusinessPlan({
        dealsNeeded,
        appointmentsNeeded,
        conversationsNeeded,
        attemptsNeeded,
        dailyConversations,
        weeklyConversations,
        monthlyConversations,
        dailyAppointments,
        weeklyAppointments,
        monthlyAppointments,
        dailyAttempts,
        weeklyAttempts,
        monthlyAttempts,
      })

      setIsCalculating(false)
    }, 1500)
  }

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    setMessage("")

    try {
      // Import jsPDF dynamically
      const { jsPDF } = await import("jspdf")

      // Create new PDF document
      const doc = new jsPDF()

      // Set up colors and fonts
      const primaryColor = [16, 185, 129] // emerald-600
      const textColor = [51, 51, 51] // gray-800
      const lightGray = [248, 250, 252] // gray-50

      let yPosition = 20

      // Header
      doc.setFillColor(...primaryColor)
      doc.rect(0, 0, 210, 40, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(24)
      doc.setFont("helvetica", "bold")
      doc.text("90-DAY BUSINESS PLAN", 105, 20, { align: "center" })
      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")
      doc.text("Generated by BizPlan AI - The Next Level U", 105, 30, { align: "center" })
      doc.text(`Agent: ${formData.name}`, 105, 37, { align: "center" })

      yPosition = 55
      doc.setTextColor(...textColor)

      // Agent Information Section
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(...primaryColor)
      doc.text("AGENT INFORMATION", 20, yPosition)
      yPosition += 10

      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(...textColor)
      doc.text(`Name: ${formData.name}`, 20, yPosition)
      yPosition += 7
      doc.text(`Email: ${formData.email}`, 20, yPosition)
      yPosition += 7
      doc.text(
        `Current Situation: ${formData.situation.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`,
        20,
        yPosition,
      )
      yPosition += 15

      // Financial Goals Section
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(...primaryColor)
      doc.text("FINANCIAL GOALS", 20, yPosition)
      yPosition += 10

      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(...textColor)
      doc.text(`Target Earnings (90 days): $${formData.targetEarnings.toLocaleString()}`, 20, yPosition)
      yPosition += 7
      doc.text(`Money Plan: ${formData.moneyPlan}`, 20, yPosition)
      yPosition += 7
      doc.text(`Average Commission: $${formData.avgCommission.toLocaleString()}`, 20, yPosition)
      yPosition += 7
      doc.text(`Conversion Rate: ${formData.conversionRate}%`, 20, yPosition)
      yPosition += 15

      // Business Plan Calculations Section
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(...primaryColor)
      doc.text("BUSINESS PLAN CALCULATIONS", 20, yPosition)
      yPosition += 15

      // Key metrics in boxes
      const metrics = [
        { label: "Deals Needed", value: businessPlan!.dealsNeeded },
        { label: "Appointments Needed", value: businessPlan!.appointmentsNeeded },
        { label: "Conversations Needed", value: businessPlan!.conversationsNeeded },
        { label: "Total Attempts Needed", value: businessPlan!.attemptsNeeded },
      ]

      let xPos = 20
      metrics.forEach((metric, index) => {
        if (index === 2) {
          xPos = 20
          yPosition += 25
        }

        // Draw metric box
        doc.setFillColor(240, 253, 244) // light green
        doc.rect(xPos, yPosition - 5, 80, 20, "F")
        doc.setDrawColor(...primaryColor)
        doc.rect(xPos, yPosition - 5, 80, 20, "S")

        // Add metric text
        doc.setFontSize(18)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(...primaryColor)
        doc.text(metric.value.toString(), xPos + 40, yPosition + 5, { align: "center" })

        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(...textColor)
        doc.text(metric.label, xPos + 40, yPosition + 12, { align: "center" })

        xPos += 90
      })

      yPosition += 35

      // Calculation Breakdown
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(...primaryColor)
      doc.text("CALCULATION BREAKDOWN", 20, yPosition)
      yPosition += 10

      const calculations = [
        `Step 1: To earn $${formData.targetEarnings.toLocaleString()}, you need ${businessPlan!.dealsNeeded} deals`,
        `Step 2: To get ${businessPlan!.dealsNeeded} deals, you need ${businessPlan!.appointmentsNeeded} appointments`,
        `Step 3: To get ${businessPlan!.appointmentsNeeded} appointments, you need ${businessPlan!.conversationsNeeded} conversations`,
        `Step 4: To get ${businessPlan!.conversationsNeeded} conversations, you need ${businessPlan!.attemptsNeeded} total attempts`,
      ]

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(...textColor)

      calculations.forEach((calc) => {
        doc.text(calc, 20, yPosition)
        yPosition += 7
      })

      yPosition += 10

      // Daily Activity Targets
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(...primaryColor)
      doc.text("DAILY ACTIVITY TARGETS", 20, yPosition)
      yPosition += 15

      const dailyTargets = [
        { label: "Attempts per day", value: businessPlan!.dailyAttempts },
        { label: "Conversations per day", value: businessPlan!.dailyConversations },
        { label: "Appointments per day", value: businessPlan!.dailyAppointments },
      ]

      xPos = 20
      dailyTargets.forEach((target) => {
        // Draw target box
        doc.setFillColor(248, 250, 252) // light gray
        doc.rect(xPos, yPosition - 5, 55, 15, "F")
        doc.setDrawColor(203, 213, 225) // gray border
        doc.rect(xPos, yPosition - 5, 55, 15, "S")

        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(...textColor)
        doc.text(target.value.toString(), xPos + 27.5, yPosition + 2, { align: "center" })

        doc.setFontSize(8)
        doc.setFont("helvetica", "normal")
        doc.text(target.label, xPos + 27.5, yPosition + 8, { align: "center" })

        xPos += 60
      })

      yPosition += 25

      // Add new page if needed
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }

      // Success Tips
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(...primaryColor)
      doc.text("SUCCESS TIPS", 20, yPosition)
      yPosition += 10

      const tips = [
        "Remember: It takes an average of 7 attempts to get one meaningful conversation",
        "Track your daily attempts and conversations to stay on target",
        "Focus on quality conversations that lead to appointments",
        "Follow up consistently - most deals happen after multiple touchpoints",
        "Adjust your approach if conversion rates are lower than expected",
      ]

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(...textColor)

      tips.forEach((tip) => {
        doc.text(`• ${tip}`, 20, yPosition)
        yPosition += 7
      })

      yPosition += 15

      // Footer
      doc.setFillColor(...lightGray)
      doc.rect(0, yPosition, 210, 20, "F")
      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(...textColor)
      doc.text("Generated by The Next Level U - BizPlan AI", 105, yPosition + 8, { align: "center" })
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 105, yPosition + 15, { align: "center" })

      // Save the PDF
      const fileName = `${formData.name.replace(/\s+/g, "-")}-90-day-business-plan.pdf`
      doc.save(fileName)

      setMessage("✅ Business plan PDF downloaded successfully!")
    } catch (error) {
      console.error("Error generating PDF:", error)
      setMessage("❌ Error generating PDF")
    }

    setIsDownloading(false)
  }

  const handleEmailPlan = async () => {
    setIsEmailing(true)
    setMessage("")
    try {
      const response = await fetch("/api/send-bizplan-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, businessPlan }),
      })

      const result = await response.json()
      if (response.ok) {
        setMessage("✅ Business plan sent to your email!")
      } else {
        setMessage(`❌ Failed to send email: ${result.error}`)
        console.error("Email error details:", result.details)
      }
    } catch (error) {
      console.error("Error sending email:", error)
      setMessage("❌ Error sending email")
    }
    setIsEmailing(false)
  }

  const saveToProfile = async () => {
    if (!businessPlan || !isLoggedIn) return

    setIsSaving(true)
    try {
      const title = generateCreationTitle("business-plan", {
        name: formData.name,
        targetEarnings: formData.targetEarnings,
      })

      const planSummary = `90-Day Business Plan for ${formData.name}

Target Earnings: $${formData.targetEarnings.toLocaleString()}
Deals Needed: ${businessPlan.dealsNeeded}
Daily Conversations: ${businessPlan.dailyConversations}
Daily Appointments: ${businessPlan.dailyAppointments}

Money Plan: ${formData.moneyPlan}`

      await saveUserCreation({
        userId: user?.id || "anonymous",
        contentType: "business-plan",
        title,
        content: planSummary,
        metadata: {
          formData,
          businessPlan,
          generatedAt: new Date().toISOString(),
          toolUsed: "BizPlan AI",
        },
      })

      setMessage("✅ Business plan saved to your profile!")
    } catch (error) {
      console.error("Error saving business plan:", error)
      setMessage("❌ Failed to save business plan. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const createSimpleWallpaper = async () => {
    setIsCreatingSimpleWallpaper(true)
    setMessage("")

    try {
      // Create canvas
      const canvas = document.createElement("canvas")
      canvas.width = 1080
      canvas.height = 1920
      const ctx = canvas.getContext("2d")!

      // Black background
      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, 1080, 1920)

      // White text
      ctx.fillStyle = "#FFFFFF"
      ctx.textAlign = "center"

      // Title
      ctx.font = "bold 72px Arial"
      ctx.fillText("DAILY GOAL", 540, 400)

      // Main question
      ctx.font = "bold 64px Arial"
      const mainText = `Have you made your ${businessPlan!.dailyConversations} contacts today?`

      // Word wrap for main text
      const words = mainText.split(" ")
      let line = ""
      let y = 600
      const lineHeight = 80

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " "
        const metrics = ctx.measureText(testLine)
        const testWidth = metrics.width

        if (testWidth > 900 && n > 0) {
          ctx.fillText(line, 540, y)
          line = words[n] + " "
          y += lineHeight
        } else {
          line = testLine
        }
      }
      ctx.fillText(line, 540, y)

      // Stats section
      y += 200
      ctx.font = "bold 48px Arial"
      ctx.fillText("YOUR DAILY TARGETS", 540, y)

      y += 100
      ctx.font = "36px Arial"
      ctx.fillText(`${businessPlan!.dailyAttempts} Attempts`, 540, y)
      y += 60
      ctx.fillText(`${businessPlan!.dailyConversations} Conversations`, 540, y)
      y += 60
      ctx.fillText(`${businessPlan!.dailyAppointments} Appointments`, 540, y)

      // Footer
      y += 200
      ctx.font = "32px Arial"
      ctx.fillText("The Next Level U", 540, y)
      y += 50
      ctx.font = "28px Arial"
      ctx.fillText("BizPlan AI", 540, y)

      // Download
      const link = document.createElement("a")
      link.download = `${formData.name.replace(/\s+/g, "-")}-daily-goals-wallpaper.png`
      link.href = canvas.toDataURL()
      link.click()

      setMessage("✅ Simple wallpaper downloaded successfully!")
    } catch (error) {
      console.error("Error creating wallpaper:", error)
      setMessage("❌ Error creating wallpaper")
    }

    setIsCreatingSimpleWallpaper(false)
  }

  const emailWallpaper = async () => {
    setIsEmailingWallpaper(true)
    setMessage("")

    try {
      // Create canvas
      const canvas = document.createElement("canvas")
      canvas.width = 1080
      canvas.height = 1920
      const ctx = canvas.getContext("2d")!

      // Black background
      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, 1080, 1920)

      // White text
      ctx.fillStyle = "#FFFFFF"
      ctx.textAlign = "center"

      // Title
      ctx.font = "bold 72px Arial"
      ctx.fillText("DAILY GOAL", 540, 400)

      // Main question
      ctx.font = "bold 64px Arial"
      const mainText = `Have you made your ${businessPlan!.dailyConversations} contacts today?`

      // Word wrap for main text
      const words = mainText.split(" ")
      let line = ""
      let y = 600
      const lineHeight = 80

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " "
        const metrics = ctx.measureText(testLine)
        const testWidth = metrics.width

        if (testWidth > 900 && n > 0) {
          ctx.fillText(line, 540, y)
          line = words[n] + " "
          y += lineHeight
        } else {
          line = testLine
        }
      }
      ctx.fillText(line, 540, y)

      // Stats section
      y += 200
      ctx.font = "bold 48px Arial"
      ctx.fillText("YOUR DAILY TARGETS", 540, y)

      y += 100
      ctx.font = "36px Arial"
      ctx.fillText(`${businessPlan!.dailyAttempts} Attempts`, 540, y)
      y += 60
      ctx.fillText(`${businessPlan!.dailyConversations} Conversations`, 540, y)
      y += 60
      ctx.fillText(`${businessPlan!.dailyAppointments} Appointments`, 540, y)

      // Footer
      y += 200
      ctx.font = "32px Arial"
      ctx.fillText("The Next Level U", 540, y)
      y += 50
      ctx.font = "28px Arial"
      ctx.fillText("BizPlan AI", 540, y)

      // Convert canvas to base64
      const base64Image = canvas.toDataURL("image/png").split(",")[1]

      // Send via Resend API
      const response = await fetch("/api/send-wallpaper-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          base64Image: base64Image,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setMessage("✅ Wallpaper sent to your email!")
      } else {
        setMessage(`❌ Failed to send email: ${result.error}`)
        console.error("Email error details:", result.details)
      }
    } catch (error) {
      console.error("Error sending email:", error)
      setMessage("❌ Error sending email")
    }

    setIsEmailingWallpaper(false)
  }

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.situation &&
    formData.targetEarnings > 0 &&
    formData.moneyPlan &&
    formData.avgCommission > 0 &&
    formData.conversionRate > 0

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Message Display */}
      {message && (
        <div
          className={`p-4 rounded-lg ${message.includes("✅") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
        >
          {message}
        </div>
      )}

      {/* Form Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-emerald-600" />
            Business Planning Form
          </CardTitle>
          <CardDescription>Answer these questions to generate your personalized 90-day business plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="flex items-center gap-2">
                Name
                {isLoggedIn && user && (user.name || user.firstName) && (
                  <span className="flex items-center gap-1 text-green-600 text-xs">
                    <Check className="h-3 w-3" />
                    Auto-filled
                  </span>
                )}
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                Email
                {isLoggedIn && user?.email && (
                  <span className="flex items-center gap-1 text-green-600 text-xs">
                    <Check className="h-3 w-3" />
                    Auto-filled
                  </span>
                )}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email address"
              />
            </div>
          </div>

          {/* Current Situation */}
          <div>
            <Label>How would you describe your current situation?</Label>
            <RadioGroup
              value={formData.situation}
              onValueChange={(value) => setFormData({ ...formData, situation: value })}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="need-money-asap" id="need-money-asap" />
                <Label htmlFor="need-money-asap">I need to make more money ASAP</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good-but-hungry" id="good-but-hungry" />
                <Label htmlFor="good-but-hungry">I am good financially but hungry to earn more</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="maintain-current" id="maintain-current" />
                <Label htmlFor="maintain-current">
                  I'm good where I am financially and would like to stay here consistently
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Financial Goals */}
          <div>
            <Label htmlFor="targetEarnings">How much money would you like to earn over the next 90 days?</Label>
            <Input
              id="targetEarnings"
              type="number"
              value={formData.targetEarnings || ""}
              onChange={(e) => setFormData({ ...formData, targetEarnings: Number(e.target.value) })}
              placeholder="Enter amount (e.g., 50000)"
            />
          </div>

          {/* Money Plan */}
          <div>
            <Label htmlFor="moneyPlan">What is your plan for the money?</Label>
            <Textarea
              id="moneyPlan"
              value={formData.moneyPlan}
              onChange={(e) => setFormData({ ...formData, moneyPlan: e.target.value })}
              placeholder="e.g., Go on vacation, pay off debt, put towards retirement..."
              rows={3}
            />
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="avgCommission">What is your average commission amount per deal?</Label>
              <Input
                id="avgCommission"
                type="number"
                value={formData.avgCommission}
                onChange={(e) => setFormData({ ...formData, avgCommission: Number(e.target.value) })}
                placeholder="National average is $9,500"
              />
              <p className="text-sm text-muted-foreground mt-1">National average is $9,500</p>
            </div>
            <div>
              <Label htmlFor="conversionRate">What is your average conversion rate of appointments you go on?</Label>
              <Input
                id="conversionRate"
                type="number"
                value={formData.conversionRate}
                onChange={(e) => setFormData({ ...formData, conversionRate: Number(e.target.value) })}
                placeholder="National average is 80%"
              />
              <p className="text-sm text-muted-foreground mt-1">National average is 80%</p>
            </div>
          </div>

          <Button
            onClick={calculateBusinessPlan}
            disabled={!isFormValid || isCalculating}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            {isCalculating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calculating Your Business Plan...
              </>
            ) : (
              "Generate My 90-Day Business Plan"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {businessPlan && (
        <Card ref={resultsRef}>
          <CardHeader>
            <CardTitle className="text-emerald-600">Your 90-Day Business Plan</CardTitle>
            <CardDescription>Based on your inputs, here's your personalized action plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Numbers */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600">{businessPlan.dealsNeeded}</div>
                <div className="text-sm text-muted-foreground">Deals Needed</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{businessPlan.appointmentsNeeded}</div>
                <div className="text-sm text-muted-foreground">Appointments Needed</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{businessPlan.conversationsNeeded}</div>
                <div className="text-sm text-muted-foreground">Conversations Needed</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{businessPlan.attemptsNeeded}</div>
                <div className="text-sm text-muted-foreground">Total Attempts Needed</div>
              </div>
            </div>

            {/* Calculation Explanation */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">How We Calculated Your Numbers:</h4>
              <div className="text-sm space-y-1">
                <p>
                  • To earn ${formData.targetEarnings.toLocaleString()}, you need {businessPlan.dealsNeeded} deals ($
                  {formData.targetEarnings.toLocaleString()} ÷ ${formData.avgCommission.toLocaleString()})
                </p>
                <p>
                  • To get {businessPlan.dealsNeeded} deals, you need {businessPlan.appointmentsNeeded} appointments (
                  {businessPlan.dealsNeeded} ÷ {formData.conversionRate}%)
                </p>
                <p>
                  • To get {businessPlan.appointmentsNeeded} appointments, you need {businessPlan.conversationsNeeded}{" "}
                  conversations ({businessPlan.appointmentsNeeded} ÷ 8%)
                </p>
                <p>
                  • To get {businessPlan.conversationsNeeded} conversations, you need {businessPlan.attemptsNeeded}{" "}
                  total attempts ({businessPlan.conversationsNeeded} × 7 attempts per conversation)
                </p>
              </div>
            </div>

            {/* Daily Breakdown */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Daily Activity Targets</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-xl font-bold">{businessPlan.dailyAttempts}</div>
                  <div className="text-sm text-muted-foreground">Attempts per day</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-xl font-bold">{businessPlan.dailyConversations}</div>
                  <div className="text-sm text-muted-foreground">Conversations per day</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-xl font-bold">{businessPlan.dailyAppointments}</div>
                  <div className="text-sm text-muted-foreground">Appointments per day</div>
                </div>
              </div>
            </div>

            {/* Weekly & Monthly Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Weekly Targets</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Attempts:</span>
                    <span className="font-medium">{businessPlan.weeklyAttempts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conversations:</span>
                    <span className="font-medium">{businessPlan.weeklyConversations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Appointments:</span>
                    <span className="font-medium">{businessPlan.weeklyAppointments}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Monthly Targets</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Attempts:</span>
                    <span className="font-medium">{businessPlan.monthlyAttempts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conversations:</span>
                    <span className="font-medium">{businessPlan.monthlyConversations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Appointments:</span>
                    <span className="font-medium">{businessPlan.monthlyAppointments}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Prospecting Plan */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Recommended Daily Prospecting Schedule</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-gray-50 rounded">
                  <strong>Morning (9 AM - 12 PM):</strong> Make {Math.ceil(businessPlan.dailyAttempts * 0.6)}{" "}
                  prospecting attempts
                  <br />
                  <span className="text-muted-foreground">
                    Expected conversations: {Math.ceil(businessPlan.dailyConversations * 0.6)}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <strong>Afternoon (1 PM - 3 PM):</strong> Social media outreach and follow-ups (
                  {Math.ceil(businessPlan.dailyAttempts * 0.3)} attempts)
                  <br />
                  <span className="text-muted-foreground">
                    Expected conversations: {Math.ceil(businessPlan.dailyConversations * 0.3)}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <strong>Evening (5 PM - 7 PM):</strong> Door knocking or networking events (
                  {Math.ceil(businessPlan.dailyAttempts * 0.1)} attempts)
                  <br />
                  <span className="text-muted-foreground">
                    Expected conversations: {Math.ceil(businessPlan.dailyConversations * 0.1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Success Tips */}
            <div className="p-4 bg-emerald-50 rounded-lg">
              <h4 className="font-semibold text-emerald-800 mb-2">Success Tips:</h4>
              <ul className="text-sm text-emerald-700 space-y-1">
                <li>• Remember: It takes an average of 7 attempts to get one meaningful conversation</li>
                <li>• Track your daily attempts and conversations to stay on target</li>
                <li>• Focus on quality conversations that lead to appointments</li>
                <li>• Follow up consistently - most deals happen after multiple touchpoints</li>
                <li>• Adjust your approach if conversion rates are lower than expected</li>
              </ul>
            </div>

            {/* Accountability Hack Section */}
            <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-8 w-8 text-purple-600" />
                <h3 className="text-xl font-bold text-purple-800">🎯 Accountability Hack</h3>
              </div>

              <div className="mb-6">
                <p className="text-purple-700 mb-3">
                  <strong>Pro Tip:</strong> Make your daily activity goal impossible to ignore! Create a phone wallpaper
                  with your daily contact target that you'll see every time you pick up your phone.
                </p>
                <p className="text-purple-600 text-sm">
                  Psychology shows that visual reminders increase goal achievement by 42%. Your phone wallpaper is seen
                  96+ times per day!
                </p>
                <p className="text-purple-600 text-sm mt-2">
                  <strong>Instructions:</strong>
                  <br />- <strong>Mobile:</strong> Save the image to your photos, then set as wallpaper in your phone
                  settings.
                  <br />- <strong>Desktop:</strong> Email the image to yourself, then save and set as wallpaper.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={createSimpleWallpaper}
                  disabled={isCreatingSimpleWallpaper}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isCreatingSimpleWallpaper ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Smartphone className="mr-2 h-4 w-4" />
                      Download Wallpaper
                    </>
                  )}
                </Button>

                <Button
                  onClick={emailWallpaper}
                  disabled={isEmailingWallpaper}
                  variant="outline"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50 bg-transparent"
                >
                  {isEmailingWallpaper ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Email Wallpaper
                    </>
                  )}
                </Button>
              </div>

              <div className="mt-4 p-3 bg-white/50 rounded-lg">
                <p className="text-sm text-purple-600">
                  <strong>Your Daily Goal:</strong> Have you made your{" "}
                  <span className="font-bold text-purple-800">{businessPlan.dailyConversations} contacts</span> today?
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button onClick={handleDownloadPDF} disabled={isDownloading} className="flex-1">
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Download PDF
                  </>
                )}
              </Button>
              <Button
                onClick={handleEmailPlan}
                disabled={isEmailing}
                variant="outline"
                className="flex-1 bg-transparent"
              >
                {isEmailing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Email Plan
                  </>
                )}
              </Button>
              <Button
                onClick={saveToProfile}
                disabled={isSaving || !isLoggedIn}
                variant="outline"
                className="flex-1 bg-transparent"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {!isLoggedIn ? "Login to Save" : "Save"}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
