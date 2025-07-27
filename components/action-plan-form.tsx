"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateActionPlan } from "./actions"
import { Loader2, Copy, Download, Mail, CheckCircle, Save, UserCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useMemberSpaceUser } from "@/hooks/use-memberspace-user"
import { saveUserCreation } from "@/lib/auto-save-creation"

type FormState = {
  name: string
  email: string
  prospectType: string
  customProspectType: string
  language: string
  specificGoals: string
}

type ActionPlanResult = {
  plan: string
  html: string
}

export default function ActionPlanForm() {
  const { toast } = useToast()
  const { user, isLoading: userLoading } = useMemberSpaceUser()
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    prospectType: "",
    customProspectType: "",
    language: "English",
    specificGoals: "",
  })
  const [result, setResult] = useState<ActionPlanResult | null>(null)

  // Auto-populate user data when available
  useEffect(() => {
    if (user && !userLoading) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: prev.email || user.email || "",
      }))
    }
  }, [user, userLoading])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    try {
      const generatedPlan = await generateActionPlan(formData)
      setResult(generatedPlan)
      setStep(2)
      toast({
        title: "Action Plan Generated Successfully",
        description: "Your daily action plan is ready!",
      })
    } catch (error) {
      console.error("Error generating action plan:", error)
      toast({
        title: "Error Generating Plan",
        description: "Failed to generate action plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    if (result?.plan) {
      navigator.clipboard.writeText(result.plan)
      toast({
        title: "Copied to Clipboard",
        description: "Your action plan has been copied to clipboard.",
      })
    }
  }

  const downloadPDF = async () => {
    if (result?.plan) {
      setIsGeneratingPDF(true)
      try {
        const response = await fetch("/api/generate-action-plan-pdf", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formData,
            plan: result.plan,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to generate PDF")
        }

        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `Daily_Action_Plan_${new Date().toLocaleDateString().replace(/\//g, "-")}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        toast({
          title: "PDF Downloaded",
          description: "Your action plan PDF has been downloaded successfully.",
        })
      } catch (error) {
        console.error("Error generating PDF:", error)
        toast({
          title: "PDF Generation Failed",
          description: error instanceof Error ? error.message : "Failed to generate PDF. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsGeneratingPDF(false)
      }
    }
  }

  const sendEmail = async () => {
    if (result?.plan && result?.html) {
      setIsSendingEmail(true)
      try {
        const response = await fetch("/api/send-action-plan-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: formData.email,
            name: formData.name,
            plan: result.plan,
            html: result.html,
          }),
        })

        const data = await response.json()

        if (data.success) {
          toast({
            title: "Email Sent Successfully",
            description: "Check your inbox for your daily action plan!",
          })
        } else {
          throw new Error(data.error || "Failed to send email")
        }
      } catch (error) {
        console.error("Error sending email:", error)
        toast({
          title: "Email Sending Failed",
          description: error instanceof Error ? error.message : "Failed to send email. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsSendingEmail(false)
      }
    }
  }

  const saveToProfile = async () => {
    if (!result || !user) return

    setIsSaving(true)
    try {
      const title = `Action Plan - ${formData.prospectType === "Other" ? formData.customProspectType : formData.prospectType}`

      const success = await saveUserCreation({
        userId: user?.id || "anonymous",
        userEmail: user?.email || "",
        toolType: "action-plan",
        title,
        content: result.plan,
        formData,
        metadata: {
          formData,
          generatedAt: new Date().toISOString(),
          toolUsed: "Action AI",
        },
      })

      if (success.success) {
        toast({
          title: "Saved Successfully",
          description: "Action plan saved to your profile!",
        })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Error saving action plan:", error)
      toast({
        title: "Save Failed",
        description: "Failed to save action plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const renderStepOne = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-black">Create Your Daily Action Plan</h3>
        <p className="text-gray-600">Tell us who you want to prospect today</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            Your Name *{user && <UserCheck className="h-4 w-4 text-green-600" title="Auto-filled from your profile" />}
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          {user && formData.name === (user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim()) && (
            <p className="text-xs text-green-600">✓ Auto-filled from your profile</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            Your Email *{user && <UserCheck className="h-4 w-4 text-green-600" title="Auto-filled from your profile" />}
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          {user && formData.email === user.email && (
            <p className="text-xs text-green-600">✓ Auto-filled from your profile</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="prospectType">Who Do You Want to Talk to Today? *</Label>
          <select
            id="prospectType"
            name="prospectType"
            value={formData.prospectType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select prospect type...</option>
            <option value="FSBO">FSBO (For Sale By Owner)</option>
            <option value="Absentee Owners">Absentee Owners</option>
            <option value="SOI">SOI (Sphere of Influence)</option>
            <option value="Expired Listings">Expired Listings</option>
            <option value="People Going Through Probate">People Going Through Probate</option>
            <option value="People Going Through Divorce">People Going Through Divorce</option>
            <option value="First Time Home Buyers">First Time Home Buyers</option>
            <option value="Real Estate Investors">Real Estate Investors</option>
            <option value="Homeowners with Equity">Homeowners with Equity</option>
            <option value="Homeowners Looking to Downsize">Homeowners Looking to Downsize</option>
            <option value="People Looking to Relocate">People Looking to Relocate</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {formData.prospectType === "Other" && (
          <div className="space-y-2">
            <Label htmlFor="customProspectType">Please specify who you want to talk to *</Label>
            <Textarea
              id="customProspectType"
              name="customProspectType"
              placeholder="Example: New construction buyers, luxury home sellers, etc."
              value={formData.customProspectType}
              onChange={handleInputChange}
              className="min-h-[80px]"
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="language">Language for Your Action Plan *</Label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="Mandarin Chinese">Mandarin Chinese</option>
            <option value="Hindi">Hindi</option>
            <option value="Arabic">Arabic</option>
            <option value="Bengali">Bengali</option>
            <option value="Portuguese">Portuguese</option>
            <option value="Russian">Russian</option>
            <option value="Japanese">Japanese</option>
            <option value="Javanese">Javanese</option>
            <option value="German">German</option>
            <option value="Korean">Korean</option>
            <option value="French">French</option>
            <option value="Turkish">Turkish</option>
            <option value="Italian">Italian</option>
            <option value="Vietnamese">Vietnamese</option>
            <option value="Marathi">Marathi</option>
            <option value="Telugu">Telugu</option>
            <option value="Burmese">Burmese</option>
            <option value="Wu Chinese">Wu Chinese</option>
            <option value="Thai">Thai</option>
            <option value="Gujarati">Gujarati</option>
            <option value="Shan">Shan</option>
            <option value="Odia">Odia</option>
            <option value="Punjabi">Punjabi</option>
            <option value="Kannada">Kannada</option>
            <option value="Sundanese">Sundanese</option>
            <option value="Hausa">Hausa</option>
            <option value="Min Nan">Min Nan</option>
            <option value="Zhuang">Zhuang</option>
            <option value="Malayalam">Malayalam</option>
            <option value="Assamese">Assamese</option>
            <option value="Fang">Fang</option>
            <option value="Ilocano">Ilocano</option>
            <option value="Xhosa">Xhosa</option>
            <option value="Yoruba">Yoruba</option>
            <option value="Maithili">Maithili</option>
            <option value="Uzbek">Uzbek</option>
            <option value="Swahili">Swahili</option>
            <option value="Hmong">Hmong</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="specificGoals">Any Specific Goals or Challenges? (Optional)</Label>
          <Textarea
            id="specificGoals"
            name="specificGoals"
            placeholder="Example: I want to set 3 appointments this week, I'm struggling with getting responses to my texts, etc."
            value={formData.specificGoals}
            onChange={handleInputChange}
            className="min-h-[100px]"
          />
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={
          isGenerating ||
          !formData.name ||
          !formData.email ||
          !formData.prospectType ||
          (formData.prospectType === "Other" && !formData.customProspectType)
        }
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Your Action Plan...
          </>
        ) : (
          "Generate My Daily Action Plan"
        )}
      </Button>
    </div>
  )

  const renderStepTwo = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-black">Your Daily Action Plan is Ready!</h3>
        <p className="text-gray-600">
          Here's your personalized plan for prospecting{" "}
          {formData.prospectType === "Other" ? formData.customProspectType : formData.prospectType}
        </p>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="text">Text Only</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="space-y-4">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              {result?.html ? (
                <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: result.html }}></div>
              ) : (
                <div className="whitespace-pre-wrap text-gray-800">{result?.plan}</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="text">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <Textarea value={result?.plan || ""} readOnly className="min-h-[400px] resize-none" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Button
          variant="outline"
          onClick={copyToClipboard}
          className="flex items-center justify-center gap-2 bg-transparent"
        >
          <Copy className="h-4 w-4" /> <span className="whitespace-nowrap">Copy</span>
        </Button>
        <Button
          variant="outline"
          onClick={downloadPDF}
          disabled={isGeneratingPDF}
          className="flex items-center justify-center gap-2 bg-transparent"
        >
          {isGeneratingPDF ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          <span className="whitespace-nowrap">Download</span>
        </Button>
        <Button
          variant="outline"
          onClick={sendEmail}
          disabled={isSendingEmail}
          className="flex items-center justify-center gap-2 bg-transparent"
        >
          {isSendingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          <span className="whitespace-nowrap">Email</span>
        </Button>
        <Button
          variant="outline"
          onClick={saveToProfile}
          disabled={isSaving || !user}
          className="flex items-center justify-center gap-2 bg-transparent"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span className="whitespace-nowrap">{!user ? "Login to Save" : "Save"}</span>
        </Button>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h5 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
          <CheckCircle className="h-4 w-4" /> Tips for Success:
        </h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Schedule specific time blocks for each activity in your plan</li>
          <li>• Track your results to refine your approach</li>
          <li>• Personalize the scripts for each prospect</li>
          <li>• Follow up consistently with interested leads</li>
          <li>• Create a new action plan tomorrow to maintain momentum</li>
        </ul>
      </div>

      <Button
        onClick={() => {
          setStep(1)
          setResult(null)
          setFormData({
            name: user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "",
            email: user?.email || "",
            prospectType: "",
            customProspectType: "",
            language: "English",
            specificGoals: "",
          })
        }}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
      >
        Create Another Action Plan
      </Button>
    </div>
  )

  return (
    <div className="bg-white rounded-lg p-6">
      {step === 1 && renderStepOne()}
      {step === 2 && renderStepTwo()}
    </div>
  )
}
