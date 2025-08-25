"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

import { Button } from "@/components/ui/button"

import { Card, CardContent } from "@/components/ui/card"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import { Textarea } from "@/components/ui/textarea"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { generateScript } from "./actions"

import { Loader2, Copy, Download, Mail, FileText, MessageSquare, Save, UserCheck } from "lucide-react"

import { useToast } from "@/hooks/use-toast"

import { useMemberSpaceUser } from "@/hooks/use-memberspace-user"

import { useTenant } from "@/contexts/tenant-context"

import { getUserBrandingProfile } from "@/app/profile/branding/actions"

import { saveUserCreation, generateCreationTitle } from "@/lib/auto-save-creation"
import EmailCompositionModal from "@/components/email-composition-modal"

type ScriptFormState = {
  agentName: string

  brokerageName: string

  scriptType: string

  topic: string

  customTopic: string

  additionalDetails: string

  agentEmail: string

  scriptTypeCategory: string

  difficultConversationType: string

  tonality: string
}

type ScriptResult = {
  script: string
}

const scriptTypeOptions = [
  { value: "email", label: "Email" },

  { value: "phone", label: "Phone Call" },

  { value: "text", label: "Text Message" },

  { value: "video", label: "Video Script" },

  { value: "doorknocking", label: "Door Knocking" },
]

const topicOptions = [
  { value: "current-client", label: "Current Client" },

  { value: "expired-listing", label: "Expired Listing" },

  { value: "first-time-homebuyer", label: "First Time Homebuyer" },

  { value: "past-client", label: "Past Client" },

  { value: "neighbor", label: "Neighbor" },

  { value: "fsbo", label: "FSBO (For Sale By Owner)" },

  { value: "homeowner-high-equity", label: "Homeowner with High Equity" },

  { value: "foreclosure", label: "Foreclosure" },

  { value: "rental", label: "Rental" },

  { value: "divorce", label: "Divorce" },

  { value: "just-sold", label: "Just Sold" },

  { value: "other", label: "Other (Custom Topic)" },
]

const tonalityOptions = [
  {
    value: "Professional & Authoritative",

    description: "Tone: Confident, knowledgeable, clear",
  },

  {
    value: "Friendly & Approachable",

    description: "Tone: Warm, conversational, down-to-earth",
  },

  {
    value: "Witty & Playful",

    description: "Tone: Lighthearted, tongue-in-cheek, surprising twists",
  },

  {
    value: "Inspirational & Motivational",

    description: "Tone: Uplifting, aspirational, empowering",
  },

  {
    value: "Educational & Informative",

    description: "Tone: Clear, explanatory, step-by-step",
  },

  {
    value: "Conversational & Story-Driven",

    description: "Tone: Narrative, personal anecdotes, dialogue style",
  },

  {
    value: "Urgent & Action-Oriented",

    description: 'Tone: Direct, brisk, focused on "now"',
  },

  {
    value: "Empathetic & Supportive",

    description: "Tone: Compassionate, understanding, reassuring",
  },

  {
    value: "Visionary & Futuristic",

    description: "Tone: Forward-looking, trend-spotting, big-picture",
  },

  {
    value: "Bold & Disruptive",

    description: "Tone: Challenging conventions, strong opinions, confident declarations",
  },
]

const scriptTypeCategoryOptions = [
  { value: "Prospecting Script", label: "Prospecting Script" },

  { value: "Follow Up Script", label: "Follow Up Script" },

  { value: "Networking Script", label: "Networking Script" },

  { value: "Difficult conversation", label: "Difficult conversation" },
]

const difficultConversationOptions = [
  "Price Reduction Request",

  "Listing Not Selling",

  "Buyer Wants to Cancel Contract",

  "Seller Unrealistic on Price",

  "Home Inspection Issues",

  "Low Appraisal Conversation",

  "Client Ghosting or Going Silent",

  "Discussing Commission Concerns",

  "Competing Agent or Friend in the Business",

  "Multiple Offers – Managing Expectations",

  "Client Not Ready to Commit",

  "Financing Fell Through",

  "Delays in Closing",

  "Expired Listing Follow-Up",

  "Termination of Representation",

  "Telling a Buyer They're Over Bidding",

  "Seller Won't Make Repairs",

  "Difficult Tenant in the Property",

  "Client Pushing for Off-Market Deals",

  "When the Market Has Shifted",

  "Unrealistic Home Search Criteria",

  "Client Making Emotional Decisions",

  "Talking About Why You're the Best Agent",

  "Explaining Market Conditions They Don't Want to Hear",
]

export default function ScriptForm() {
  const { toast } = useToast()

  const [step, setStep] = useState(1)

  const [isGenerating, setIsGenerating] = useState(false)

  const [isSendingEmail, setIsSendingEmail] = useState(false)

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const [isSaving, setIsSaving] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isResendModalOpen, setIsResendModalOpen] = useState(false)
  const [isGmailConnected, setIsGmailConnected] = useState(false)

  const [formData, setFormData] = useState<ScriptFormState>({
    agentName: "",

    brokerageName: "",

    scriptType: "",

    topic: "",

    customTopic: "",

    additionalDetails: "",

    agentEmail: "",

    scriptTypeCategory: "",

    difficultConversationType: "",

    tonality: "Professional & Authoritative",
  })

  const [result, setResult] = useState<ScriptResult | null>(null)

  const { user, loading: isUserLoading } = useMemberSpaceUser()
  const { config: tenantConfig } = useTenant()
  const [userBranding, setUserBranding] = useState<any>(null)

  const isLoggedIn = !!user && !isUserLoading

  // Debug user data
  useEffect(() => {
    console.log("User data changed:", { user, isUserLoading, isLoggedIn })
  }, [user, isUserLoading, isLoggedIn])

  // Fetch user branding profile
  useEffect(() => {
    const fetchUserBranding = async () => {
      if (!user?.id || !tenantConfig?.id) return

      try {
        const brandingProfile = await getUserBrandingProfile(user.id.toString(), tenantConfig.id)
        if (brandingProfile) {
          setUserBranding(brandingProfile)
          console.log("Loaded user branding profile:", brandingProfile)
        }
      } catch (error) {
        console.error("Error fetching user branding:", error)
        // Continue without branding - will use default styling
      }
    }

    fetchUserBranding()
  }, [user?.id, tenantConfig?.id])

  const resultsRef = useRef<HTMLDivElement>(null)

  // Auto-populate user data and brokerage name when available
  useEffect(() => {
    if (user && !isUserLoading) {
      console.log("Setting user data - current formData:", formData)
      console.log("User data available:", { 
        name: user.name, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        email: user.email,
        userBranding: userBranding
      })
      
      setFormData((prev) => ({
        ...prev,
        agentName: prev.agentName || user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        agentEmail: prev.agentEmail || user.email || "",
        // Use brokerage name from branding profile if available
        brokerageName: prev.brokerageName || userBranding?.brokerage || "",
      }))
    }
  }, [user, isUserLoading, userBranding])

  // Debug form data changes
  useEffect(() => {
    console.log("Form data changed:", formData)
  }, [formData])

  // Check Gmail connection status
  useEffect(() => {
    const checkGmailStatus = async () => {
      try {
        const response = await fetch('/api/auth/google/status')
        if (response.ok) {
          const data = await response.json()
          setIsGmailConnected(data.status.connected)
        }
      } catch (error) {
        console.error('Error checking Gmail status:', error)
        setIsGmailConnected(false)
      }
    }
    
    checkGmailStatus()
  }, [])

  // Auto-scroll to results when they're generated

  useEffect(() => {
    if (step === 4 && result && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",

          block: "start",
        })
      }, 100)
    }
  }, [step, result])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsGenerating(true)

    try {
      console.log("Generating script with data:", formData)

      const generatedScript = await generateScript(formData)

      console.log("Generated script:", generatedScript)

      setResult(generatedScript)

      setStep(4) // Go to step 4 (results)

      toast({
        title: "Script Generated Successfully",

        description: "Your professional script is ready!",
      })
    } catch (error) {
      console.error("Error generating script:", error)

      toast({
        title: "Error Generating Script",

        description: "Failed to generate script. Please try again.",

        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    if (result?.script) {
      navigator.clipboard.writeText(result.script)

      toast({
        title: "Copied to Clipboard",

        description: "Your script has been copied to clipboard.",
      })
    }
  }

  const downloadPDF = async () => {
    if (result?.script) {
      setIsGeneratingPDF(true)

      try {
        const response = await fetch("/api/generate-script-pdf", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            formData,

            script: result.script,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to generate PDF")
        }

        const blob = await response.blob()

        const url = window.URL.createObjectURL(blob)

        const link = document.createElement("a")

        link.href = url

        link.download = `${formData.agentName.replace(/\s+/g, "_")}_${formData.scriptType}_Script.pdf`

        document.body.appendChild(link)

        link.click()

        document.body.removeChild(link)

        window.URL.revokeObjectURL(url)

        toast({
          title: "PDF Downloaded",

          description: "Your script PDF has been downloaded successfully.",
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
    if (!result?.script) {
      toast({
        title: "No Script Available",
        description: "Please generate a script first.",
        variant: "destructive",
      })
      return
    }

    if (!formData.agentEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      })
      return
    }

    if (!formData.agentName) {
      toast({
        title: "Name Required",
        description: "Please enter your name.",
        variant: "destructive",
      })
      return
    }

    setIsSendingEmail(true)

    try {
      console.log("Sending email with data:", {
        to: formData.agentEmail,
        name: formData.agentName,
        scriptLength: result.script.length,
        formData
      })

      const response = await fetch("/api/send-script-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: formData.agentEmail,
          name: formData.agentName,
          script: result.script,
          formData,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API response error:", response.status, errorText)
        throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Email API response:", data)

      if (data.success) {
        toast({
          title: "Email Sent Successfully",
          description: "Check your inbox for your professional script!",
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

  const saveToProfile = async () => {
    if (!result?.script || !user) {
      toast({
        title: "Save Failed",

        description: "Please log in to save your script.",

        variant: "destructive",
      })

      return
    }

    setIsSaving(true)

    try {
      const title = generateCreationTitle("scriptit-ai", formData)

      const success = await saveUserCreation({
        userId: user.id.toString(),

        userEmail: user.email,

        toolType: "scriptit-ai",

        title,

        content: result.script,

        formData,

        metadata: {
          agentName: formData.agentName,

          brokerageName: formData.brokerageName,

          scriptType: formData.scriptType,

          topic: formData.topic,

          customTopic: formData.customTopic,

          additionalDetails: formData.additionalDetails,
        },
      })

      if (success.success) {
        toast({
          title: "Script Saved",

          description: "Your script has been saved to your profile dashboard.",
        })
      } else {
        throw new Error("Failed to save script")
      }
    } catch (error) {
      console.error("Error saving script:", error)

      toast({
        title: "Save Failed",

        description: "Failed to save script. Please try again.",

        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const renderStepOne = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-black">Agent Information</h3>

        <p className="text-gray-600">Tell us about yourself and your brokerage</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
                     <Label htmlFor="agentName" className="flex items-center gap-2">
             Your Name *{user && <UserCheck className="h-4 w-4 text-green-600" />}
           </Label>

          <Input
            id="agentName"
            name="agentName"
            placeholder="Enter your full name"
            value={formData.agentName}
            onChange={handleInputChange}
            required
          />

          {user && formData.agentName === (user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim()) && (
            <p className="text-xs text-green-600">✓ Auto-filled from your profile</p>
          )}
        </div>

        <div className="space-y-2">
                     <Label htmlFor="brokerageName" className="flex items-center gap-2">
             Brokerage Name *
             {user && formData.brokerageName && <UserCheck className="h-4 w-4 text-green-600" />}
           </Label>

          <Input
            id="brokerageName"
            name="brokerageName"
            placeholder="Enter your brokerage name"
            value={formData.brokerageName}
            onChange={handleInputChange}
            required
          />

          {user && formData.brokerageName && (
            <p className="text-xs text-green-600">✓ Auto-filled from your branding profile</p>
          )}
          {user && !formData.brokerageName && (
            <p className="text-xs text-gray-500">💡 Set up your branding profile to auto-fill this field</p>
          )}
        </div>
      </div>

      <Button
        onClick={() => setStep(2)}
        disabled={!formData.agentName || !formData.brokerageName}
        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
      >
        Next: Script Details
      </Button>
    </div>
  )

  const renderStepTwo = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-black">Script Configuration</h3>

        <p className="text-gray-600">Choose the type and topic for your script</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="scriptTypeCategory">Type of Script *</Label>

        <Select
          value={formData.scriptTypeCategory}
          onValueChange={(value) => handleSelectChange("scriptTypeCategory", value)}
        >
          <SelectTrigger id="scriptTypeCategory">
            <SelectValue placeholder="Select the type of script you need" />
          </SelectTrigger>

          <SelectContent>
            {scriptTypeCategoryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="scriptType">Script Delivery *</Label>

        <Select value={formData.scriptType} onValueChange={(value) => handleSelectChange("scriptType", value)}>
          <SelectTrigger id="scriptType">
            <SelectValue placeholder="Select how you'll deliver this script" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="text">Text Message</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="phone">Phone</SelectItem>
            <SelectItem value="doorknocking">In Person</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Email delivery note */}
        {formData.scriptType === "email" && (
          <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-md border border-blue-200">
            💡 <strong>Email Delivery:</strong> When you select "Email" as your script type, you can send the script to yourself via email, and if you have Gmail connected, you can also send it directly to clients using your Gmail account.
          </div>
        )}
      </div>

      {formData.scriptTypeCategory === "Difficult conversation" && (
        <div className="space-y-2">
          <Label htmlFor="difficultConversationType">Difficult Conversation Type *</Label>

          <Select
            value={formData.difficultConversationType}
            onValueChange={(value) => handleSelectChange("difficultConversationType", value)}
          >
            <SelectTrigger id="difficultConversationType">
              <SelectValue placeholder="Select the type of difficult conversation" />
            </SelectTrigger>

            <SelectContent>
              {difficultConversationOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="topic">Script Target *</Label>

        <Select value={formData.topic} onValueChange={(value) => handleSelectChange("topic", value)}>
          <SelectTrigger id="topic">
            <SelectValue placeholder="Select the target for your script" />
          </SelectTrigger>

          <SelectContent>
            {topicOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tonality">Tonality</Label>

        <Select value={formData.tonality} onValueChange={(value) => handleSelectChange("tonality", value)}>
          <SelectTrigger id="tonality">
            <SelectValue placeholder="Select tonality" />
          </SelectTrigger>

          <SelectContent>
            {tonalityOptions.map((option, index) => (
              <SelectItem key={index} value={option.value}>
                <div>
                  <div className="font-medium">{option.value}</div>

                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {formData.topic === "other" && (
        <div className="space-y-2">
          <Label htmlFor="customTopic">Custom Topic *</Label>

          <Input
            id="customTopic"
            name="customTopic"
            placeholder="Enter your custom topic"
            value={formData.customTopic}
            onChange={handleInputChange}
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="additionalDetails">Additional Details (Optional)</Label>

        <Textarea
          id="additionalDetails"
          name="additionalDetails"
          placeholder="Any specific details, context, or requirements for your script..."
          value={formData.additionalDetails}
          onChange={handleInputChange}
          className="min-h-[100px]"
        />
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
          Back
        </Button>

        <Button
          onClick={() => setStep(3)}
          disabled={
            !formData.scriptType ||
            !formData.scriptTypeCategory ||
            !formData.topic ||
            (formData.topic === "other" && !formData.customTopic) ||
            (formData.scriptTypeCategory === "Difficult conversation" && !formData.difficultConversationType)
          }
          className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
        >
          Next: Contact Information
        </Button>
      </div>
    </div>
  )

  const renderStepThree = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-black">Contact Information</h3>

        <p className="text-gray-600">Enter your email to receive the script</p>
      </div>

      <div className="space-y-2">
                 <Label htmlFor="agentEmail" className="flex items-center gap-2">
           Your Email Address *
           {user && <UserCheck className="h-4 w-4 text-green-600" />}
         </Label>

        <Input
          id="agentEmail"
          name="agentEmail"
          type="email"
          placeholder="Enter your email address"
          value={formData.agentEmail}
          onChange={handleInputChange}
          required
        />

        {user && formData.agentEmail === user.email && (
          <p className="text-xs text-green-600">✓ Auto-filled from your profile</p>
        )}
      </div>

      {/* Script Summary */}

      <Card className="bg-gray-50 border-0">
        <CardContent className="p-6">
          <h4 className="font-semibold text-black mb-4 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Script Summary
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <span className="font-medium">Agent:</span> {formData.agentName}
              </p>

              <p>
                <span className="font-medium">Brokerage:</span> {formData.brokerageName}
              </p>

              <p>
                <span className="font-medium">Script Type:</span>{" "}
                {scriptTypeCategoryOptions.find((opt) => opt.value === formData.scriptTypeCategory)?.label}
              </p>

              {formData.scriptTypeCategory === "Difficult conversation" && (
                <p>
                  <span className="font-medium">Conversation Type:</span> {formData.difficultConversationType}
                </p>
              )}

              <p>
                <span className="font-medium">Target:</span>{" "}
                {formData.topic === "other"
                  ? formData.customTopic
                  : topicOptions.find((opt) => opt.value === formData.topic)?.label}
              </p>

              <p>
                <span className="font-medium">Tonality:</span> {formData.tonality}
              </p>
            </div>

            <div>
              <p>
                <span className="font-medium">Topic:</span>{" "}
                {formData.topic === "other"
                  ? formData.customTopic
                  : topicOptions.find((opt) => opt.value === formData.topic)?.label}
              </p>

              {formData.additionalDetails && (
                <p>
                  <span className="font-medium">Details:</span> {formData.additionalDetails.substring(0, 100)}
                  {formData.additionalDetails.length > 100 && "..."}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
          Back
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={isGenerating || !formData.agentEmail}
          className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Script...
            </>
          ) : (
            "Generate My Script"
          )}
        </Button>
      </div>
    </div>
  )

  const renderStepFour = () => (
    <div className="space-y-6" ref={resultsRef}>
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-black">Your Script is Ready!</h3>

        <p className="text-gray-600">
          Here's your professionally crafted{" "}
          {scriptTypeOptions.find((opt) => opt.value === formData.scriptType)?.label.toLowerCase()} script with DISC &
          VAK integration
        </p>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>

          <TabsTrigger value="text">Text Only</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
            <CardContent className="p-8">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Your Professional Script</h3>

                    <p className="text-gray-600">
                      {scriptTypeOptions.find((opt) => opt.value === formData.scriptType)?.label} •{" "}
                      {formData.topic === "other"
                        ? formData.customTopic
                        : topicOptions.find((opt) => opt.value === formData.topic)?.label}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    VAK Enhanced
                  </span>

                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Conversion Optimized
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100">
                <div className="prose prose-gray max-w-none">
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed font-medium">{result?.script}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="text">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="editableScript" className="text-sm font-medium text-gray-700">
                    Edit Your Script
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (result?.script) {
                        setResult({ script: result.script })
                      }
                    }}
                    className="text-xs"
                  >
                    Reset to Original
                  </Button>
                </div>
                <Textarea 
                  id="editableScript"
                  value={result?.script || ""} 
                  onChange={(e) => setResult(prev => prev ? { ...prev, script: e.target.value } : null)}
                  className="min-h-[400px] resize-none" 
                  placeholder="Your generated script will appear here for editing..."
                />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <p>💡 You can edit the script above to customize it for your specific needs before copying, downloading, or saving.</p>
                  <span className="text-gray-500">
                    {(result?.script?.length || 0)} characters
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button
          variant="outline"
          onClick={copyToClipboard}
          className="flex items-center justify-center gap-2"
        >
          <Copy className="h-4 w-4" /> <span className="whitespace-nowrap">Copy</span>
        </Button>

        <Button
          variant="outline"
          onClick={downloadPDF}
          disabled={isGeneratingPDF}
          className="flex items-center justify-center gap-2"
        >
          {isGeneratingPDF ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          <span className="whitespace-nowrap">Download</span>
        </Button>

        {/* Email Options */}
        <div className="flex flex-col gap-2">
          {/* Resend Email to Self (Always Available) */}
          <Button
            variant="outline"
            onClick={sendEmail}
            disabled={isSendingEmail || !result?.script || !formData.agentEmail || !formData.agentName}
            className="flex items-center justify-center gap-2 w-full"
          >
            {isSendingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            <span className="whitespace-nowrap">Email to Self</span>
          </Button>
          {(!result?.script || !formData.agentEmail || !formData.agentName) && (
            <p className="text-xs text-gray-500 text-center">
              {!result?.script ? "Generate a script first" : 
               !formData.agentEmail ? "Enter your email address" : 
               !formData.agentName ? "Enter your name" : ""}
            </p>
          )}

          {/* Gmail Client Email (Only if Gmail Connected and Email Script Type) */}
          {isGmailConnected && formData.scriptType === "email" && (
            <Button
              variant="outline"
              onClick={() => setIsEmailModalOpen(true)}
              className="flex items-center justify-center gap-2 w-full"
            >
              <Mail className="h-4 w-4" />
              <span className="whitespace-nowrap">Send to Client</span>
            </Button>
          )}
        </div>

        <Button
          variant="outline"
          onClick={saveToProfile}
          disabled={isSaving || !isLoggedIn}
          className="flex items-center justify-center gap-2"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span className="whitespace-nowrap">{!isLoggedIn ? "Login to Save" : "Save"}</span>
        </Button>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h5 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
          <FileText className="h-4 w-4" />💡 How to Use Your Script:
        </h5>

        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Practice the script until it feels natural</li>

          <li>• Customize it with specific details for each prospect</li>

          <li>• The script integrates DISC and VAK principles automatically</li>

          <li>• Focus on the call-to-action at the end</li>

          <li>• Track your results and refine as needed</li>

          <li>• Print the PDF for easy reference during calls</li>
        </ul>
      </div>

      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
        <h5 className="font-medium text-orange-900 mb-2">🎯 DISC & VAK Integration:</h5>

        <p className="text-sm text-orange-800">
          This script incorporates language patterns that appeal to all DISC personality types (Dominant, Influential,
          Steady, Compliant) and includes VAK sensory language (Visual, Auditory, Kinesthetic) for maximum effectiveness
          with any prospect.
        </p>
      </div>

      <Button
        onClick={() => {
          setStep(1)

          setResult(null)

          setFormData({
            agentName: user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "",

            brokerageName: formData.brokerageName, // Keep the auto-filled brokerage name

            scriptType: "",

            topic: "",

            customTopic: "",

            additionalDetails: "",

            agentEmail: user?.email || "",

            scriptTypeCategory: "",

            difficultConversationType: "",

            tonality: "Professional & Authoritative",
          })
        }}
        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
      >
        Create Another Script
      </Button>
    </div>
  )

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-2">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 1 ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            1
          </div>

          <div className={`h-1 w-16 ${step >= 2 ? "bg-orange-600" : "bg-gray-200"}`}></div>

          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 2 ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            2
          </div>

          <div className={`h-1 w-16 ${step >= 3 ? "bg-orange-600" : "bg-gray-200"}`}></div>

          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 3 ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            3
          </div>

          <div className={`h-1 w-16 ${step >= 4 ? "bg-orange-600" : "bg-gray-200"}`}></div>

          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 4 ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            ✓
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            {step === 1 && "Agent Information"}

            {step === 2 && "Script Configuration"}

            {step === 3 && "Contact Information"}

            {step === 4 && "Generated Script"}
          </p>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        {step === 1 && renderStepOne()}

        {step === 2 && renderStepTwo()}

        {step === 3 && renderStepThree()}

        {step === 4 && renderStepFour()}
      </form>

      {/* Email Composition Modal */}
      {result && (
        <EmailCompositionModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          scriptContent={result.script}
          agentName={formData.agentName}
          brokerageName={formData.brokerageName}
        />
      )}
    </div>
  )
}
