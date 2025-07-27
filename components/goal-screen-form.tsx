"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useMemberSpaceUser } from "@/hooks/use-memberspace-user"
import { Target, Download, Mail, Calculator, TrendingUp, Phone, Brain, Eye, Zap, Save, CheckCircle } from "lucide-react"
import { saveUserCreation, generateCreationTitle } from "@/lib/auto-save-creation"

interface CalculationResults {
  monthlyIncome: number
  dealsNeeded: number
  appointmentsNeeded: number
  conversationsNeeded: number
  dailyContacts: number
}

export default function GoalScreenForm() {
  const [monthlyIncome, setMonthlyIncome] = useState("")
  const [calculations, setCalculations] = useState<CalculationResults | null>(null)
  const [wallpaperGenerated, setWallpaperGenerated] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEmailing, setIsEmailing] = useState(false)
  const [emailAddress, setEmailAddress] = useState("")
  const [showEmailInput, setShowEmailInput] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)
  const [isSaving, setIsSaving] = useState(false)
  const { user, isLoggedIn } = useMemberSpaceUser()

  // Auto-populate email when user data is available
  useEffect(() => {
    if (isLoggedIn && user?.email && !emailAddress) {
      setEmailAddress(user.email)
    }
  }, [isLoggedIn, user?.email, emailAddress])

  // Real estate calculation constants
  const AVG_COMMISSION = 9500
  const APPT_CONVERSION = 0.8
  const CONVERSATION_TO_APPT = 0.08
  const ATTEMPTS_PER_CONVERSATION = 7
  const DAYS_PER_MONTH = 30

  const calculateGoals = (income: number): CalculationResults => {
    const dealsNeeded = income / AVG_COMMISSION
    const appointmentsNeeded = dealsNeeded / APPT_CONVERSION
    const conversationsNeeded = appointmentsNeeded / CONVERSATION_TO_APPT
    const dailyContacts = Math.ceil((conversationsNeeded * ATTEMPTS_PER_CONVERSATION) / DAYS_PER_MONTH)

    return {
      monthlyIncome: income,
      dealsNeeded: Math.ceil(dealsNeeded),
      appointmentsNeeded: Math.ceil(appointmentsNeeded),
      conversationsNeeded: Math.ceil(conversationsNeeded),
      dailyContacts,
    }
  }

  const handleCalculate = () => {
    const income = Number.parseFloat(monthlyIncome)
    if (income > 0) {
      const results = calculateGoals(income)
      setCalculations(results)
      setWallpaperGenerated(false)
    }
  }

  const createWallpaperCanvas = (dailyContacts: number, monthlyIncome: number): HTMLCanvasElement => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!

    // Phone wallpaper dimensions
    canvas.width = 1080
    canvas.height = 1920

    // Black background
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // White text
    ctx.fillStyle = "#FFFFFF"
    ctx.textAlign = "center"

    // Main question
    ctx.font = "bold 64px Arial"
    const mainText = "Have you made your"
    ctx.fillText(mainText, canvas.width / 2, 600)

    // Daily contacts number (large)
    ctx.font = "bold 120px Arial"
    ctx.fillStyle = "#10B981" // Green accent
    ctx.fillText(`${dailyContacts}`, canvas.width / 2, 800)

    // "contacts today?" text
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "bold 64px Arial"
    ctx.fillText("contacts today?", canvas.width / 2, 950)

    // Goal reminder
    ctx.font = "48px Arial"
    ctx.fillText("Remember you need", canvas.width / 2, 1100)
    ctx.font = "bold 52px Arial"
    ctx.fillText(`${dailyContacts} contacts daily`, canvas.width / 2, 1180)

    // Income goal context
    ctx.font = "40px Arial"
    ctx.fillStyle = "#9CA3AF"
    ctx.fillText(`to reach your $${monthlyIncome.toLocaleString()}/month goal`, canvas.width / 2, 1280)

    // NLU Logo text (since we can't easily load image in canvas)
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "bold 36px Arial"
    ctx.fillText("THE NEXT LEVEL U", canvas.width / 2, 1750)
    ctx.font = "28px Arial"
    ctx.fillStyle = "#9CA3AF"
    ctx.fillText("Your Success Partner", canvas.width / 2, 1800)

    return canvas
  }

  const handleGenerateWallpaper = async () => {
    if (!calculations) return

    setIsGenerating(true)
    try {
      const canvas = createWallpaperCanvas(calculations.dailyContacts, calculations.monthlyIncome)

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `goalscreen-wallpaper-${calculations.dailyContacts}-contacts.png`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)

          setWallpaperGenerated(true)

          // Auto-scroll to results
          setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: "smooth" })
          }, 100)
        }
      }, "image/png")
    } catch (error) {
      console.error("Error generating wallpaper:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEmailWallpaper = async () => {
    if (!calculations || !emailAddress) return

    setIsEmailing(true)
    try {
      const canvas = createWallpaperCanvas(calculations.dailyContacts, calculations.monthlyIncome)

      // Convert canvas to base64
      const dataURL = canvas.toDataURL("image/png")
      const base64Data = dataURL.split(",")[1]

      const response = await fetch("/api/send-goalscreen-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailAddress,
          dailyContacts: calculations.dailyContacts,
          monthlyIncome: calculations.monthlyIncome,
          wallpaperData: base64Data,
        }),
      })

      if (response.ok) {
        alert("Wallpaper sent to your email successfully!")
        setShowEmailInput(false)
        setEmailAddress("")
      } else {
        alert("Failed to send email. Please try again.")
      }
    } catch (error) {
      console.error("Error sending email:", error)
      alert("Failed to send email. Please try again.")
    } finally {
      setIsEmailing(false)
    }
  }

  const handleSaveToProfile = async () => {
    if (!calculations || !isLoggedIn || !user) return

    setIsSaving(true)
    try {
      const success = await saveUserCreation({
        userId: user.id.toString(),
        userEmail: user.email,
        toolType: "goalscreen-ai",
        title: generateCreationTitle("goalscreen-ai", { monthlyIncome: calculations.monthlyIncome }),
        content: `Daily Contacts Needed: ${calculations.dailyContacts}\nMonthly Income Goal: $${calculations.monthlyIncome.toLocaleString()}\nDeals Needed: ${calculations.dealsNeeded}\nAppointments Needed: ${calculations.appointmentsNeeded}\nConversations Needed: ${calculations.conversationsNeeded}`,
        formData: {
          monthlyIncome: calculations.monthlyIncome,
          dailyContacts: calculations.dailyContacts,
          dealsNeeded: calculations.dealsNeeded,
          appointmentsNeeded: calculations.appointmentsNeeded,
          conversationsNeeded: calculations.conversationsNeeded,
        },
        metadata: {
          wallpaperGenerated: wallpaperGenerated,
        },
      })

      if (success) {
        alert("Goal screen saved to your profile successfully!")
      } else {
        alert("Failed to save to profile. Please try again.")
      }
    } catch (error) {
      console.error("Error saving to profile:", error)
      alert("Failed to save to profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Set Your Monthly Income Goal
          </CardTitle>
          <CardDescription>
            Enter your desired monthly income and we'll calculate exactly how many daily contacts you need to make it
            happen.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="income">Monthly Income Goal ($)</Label>
              <Input
                id="income"
                type="number"
                placeholder="25000"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                className="text-lg"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleCalculate} disabled={!monthlyIncome || Number.parseFloat(monthlyIncome) <= 0}>
                <Calculator className="h-4 w-4 mr-2" />
                Calculate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculation Results */}
      {calculations && (
        <Card ref={resultsRef}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Your Success Formula
            </CardTitle>
            <CardDescription>
              Based on industry averages: $9,500 avg commission, 80% appointment conversion, 8%
              conversation-to-appointment rate, 7 attempts per conversation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{calculations.dealsNeeded}</div>
                <div className="text-sm text-gray-600">Deals Needed</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{calculations.appointmentsNeeded}</div>
                <div className="text-sm text-gray-600">Appointments</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{calculations.conversationsNeeded}</div>
                <div className="text-sm text-gray-600">Conversations</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-3xl font-bold text-red-600">{calculations.dailyContacts}</div>
                <div className="text-sm text-gray-600">Daily Contacts</div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Psychology Section */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Brain className="h-5 w-5" />
                  The Psychology Behind Visual Accountability
                </CardTitle>
              </CardHeader>
              <CardContent className="text-green-700">
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <Eye className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <h4 className="font-semibold">Visual Priming</h4>
                    <p className="text-sm">You see your phone 96+ times per day. Each glance reinforces your goal.</p>
                  </div>
                  <div className="text-center">
                    <Zap className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <h4 className="font-semibold">Instant Motivation</h4>
                    <p className="text-sm">No apps to open or reminders to set. Your goal is always visible.</p>
                  </div>
                  <div className="text-center">
                    <Target className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <h4 className="font-semibold">Behavioral Trigger</h4>
                    <p className="text-sm">Creates an automatic "Did I do my contacts?" check every phone unlock.</p>
                  </div>
                </div>
                <div className="bg-white/50 rounded-lg p-4 text-center">
                  <p className="font-semibold text-green-800 mb-2">
                    🧠 Studies show visual reminders increase goal achievement by 42%
                  </p>
                  <p className="text-sm">
                    Your phone wallpaper becomes a constant accountability partner, turning every phone check into a
                    productivity reminder.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Create Your Accountability Wallpaper</h3>
              <p className="text-gray-600 mb-6">
                Turn your phone into a daily accountability partner. Every time you look at your screen, you'll be
                reminded of your daily contact goal.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={handleGenerateWallpaper} disabled={isGenerating} size="lg">
                  <Download className="h-4 w-4 mr-2" />
                  {isGenerating ? "Creating..." : "Download Wallpaper"}
                </Button>

                <Button variant="outline" onClick={() => setShowEmailInput(!showEmailInput)} size="lg">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Wallpaper
                </Button>

                <Button
                  variant="outline"
                  onClick={handleSaveToProfile}
                  disabled={isSaving || !calculations || !isLoggedIn}
                  size="lg"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save to Profile"}
                </Button>
              </div>
            </div>

            {showEmailInput && (
              <div className="mt-6 max-w-md mx-auto">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    Email Address
                    {isLoggedIn && user?.email && emailAddress === user.email && (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-xs">Auto-filled</span>
                      </div>
                    )}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                    />
                    <Button onClick={handleEmailWallpaper} disabled={isEmailing || !emailAddress}>
                      {isEmailing ? "Sending..." : "Send"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {wallpaperGenerated && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-green-600" />
              How to Set Your Wallpaper
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">📱 On Mobile:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>Open the downloaded image</li>
                  <li>Tap the share button</li>
                  <li>Select "Use as Wallpaper"</li>
                  <li>Choose "Set Lock Screen" or "Set Both"</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold mb-2">💻 On Desktop:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>Email the wallpaper to yourself</li>
                  <li>Open email on your phone</li>
                  <li>Save the image to your photos</li>
                  <li>Follow mobile steps above</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
