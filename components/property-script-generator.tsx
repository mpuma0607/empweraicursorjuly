"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Loader2, 
  Copy, 
  Download, 
  Mail, 
  FileText, 
  MessageSquare, 
  Save, 
  UserCheck,
  Target,
  Users,
  MapPin,
  Building,
  Calendar,
  RotateCcw
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useMemberSpaceUser } from "@/hooks/use-memberspace-user"
import { useTenant } from "@/contexts/tenant-context"
import { getUserBrandingProfile } from "@/app/profile/branding/actions"
import { saveUserCreation, generateCreationTitle } from "@/lib/auto-save-creation"
import EmailCompositionModal from "@/components/email-composition-modal"
import CalendarScheduler from "@/components/calendar/calendar-scheduler"
import RecurringScheduler from "@/components/calendar/recurring-scheduler"

interface PropertyScriptGeneratorProps {
  propertyAddress: string
  ownerNames?: string[]
  propertyType?: string
  estimatedValue?: string
  propertyDetails?: string
  onScriptGenerated?: (script: string) => void
}

interface ScriptFormData {
  deliveryMethod: "email" | "phone" | "text" | "in-person"
  prospectType: "fsbo" | "expired" | "absentee" | "off-market" | "other"
  customProspectType: string
  language: string
  tonality: string
  agentName: string
  brokerageName: string
  agentEmail: string
  additionalDetails: string
}

interface ScriptResult {
  script: string
  metadata: {
    propertyAddress: string
    deliveryMethod: string
    prospectType: string
    customProspectType?: string
    tonality: string
    agentName: string
    brokerageName: string
    generatedAt: string
  }
}

const deliveryMethodOptions = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone Call" },
  { value: "text", label: "Text Message" },
  { value: "in-person", label: "In Person" },
]

const prospectTypeOptions = [
  { value: "fsbo", label: "FSBO (For Sale By Owner)" },
  { value: "expired", label: "Expired Listing" },
  { value: "absentee", label: "Absentee Owner" },
  { value: "off-market", label: "Off Market" },
  { value: "other", label: "Other (Custom)" },
]

const tonalityOptions = [
  { value: "Professional & Authoritative", description: "Tone: Confident, knowledgeable, clear" },
  { value: "Friendly & Approachable", description: "Tone: Warm, conversational, down-to-earth" },
  { value: "Witty & Playful", description: "Tone: Lighthearted, tongue-in-cheek, surprising twists" },
  { value: "Inspirational & Motivational", description: "Tone: Uplifting, aspirational, empowering" },
  { value: "Educational & Informative", description: "Tone: Clear, explanatory, step-by-step" },
  { value: "Conversational & Story-Driven", description: "Tone: Narrative, personal anecdotes, dialogue style" },
  { value: "Urgent & Action-Oriented", description: 'Tone: Direct, brisk, focused on "now"' },
  { value: "Empathetic & Supportive", description: "Tone: Compassionate, understanding, reassuring" },
  { value: "Visionary & Futuristic", description: "Tone: Forward-looking, trend-spotting, big-picture" },
  { value: "Bold & Disruptive", description: "Tone: Challenging conventions, strong opinions, confident declarations" },
]

export function PropertyScriptGenerator({
  propertyAddress,
  ownerNames = [],
  propertyType,
  estimatedValue,
  propertyDetails,
  onScriptGenerated
}: PropertyScriptGeneratorProps) {
  const { toast } = useToast()
  const { user, loading: isUserLoading } = useMemberSpaceUser()
  const { config: tenantConfig } = useTenant()
  const [userBranding, setUserBranding] = useState<any>(null)
  const isLoggedIn = !!user && !isUserLoading

  const [isGenerating, setIsGenerating] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showScriptForm, setShowScriptForm] = useState(false)
  const [result, setResult] = useState<ScriptResult | null>(null)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isGmailConnected, setIsGmailConnected] = useState(false)

  const [formData, setFormData] = useState<ScriptFormData>({
    deliveryMethod: "phone",
    prospectType: "fsbo",
    customProspectType: "",
    language: "English",
    tonality: "Professional & Authoritative",
    agentName: "",
    brokerageName: "",
    agentEmail: "",
    additionalDetails: "",
  })

  const resultsRef = useRef<HTMLDivElement>(null)

  // Auto-populate user data when available
  useEffect(() => {
    if (user && !isUserLoading) {
      setFormData((prev) => ({
        ...prev,
        agentName: prev.agentName || user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        agentEmail: prev.agentEmail || user.email || "",
        // Use brokerage name from branding profile if available
        brokerageName: prev.brokerageName || userBranding?.brokerage || "",
      }))
    }
  }, [user, isUserLoading, userBranding])

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
    if (result && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }, 100)
    }
  }, [result])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenerateScript = async () => {
    setIsGenerating(true)
    setResult(null)

    try {
      const response = await fetch("/api/generate-property-script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyAddress,
          ownerNames,
          propertyType,
          estimatedValue,
          propertyDetails,
          ...formData,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
        onScriptGenerated?.(data.script)
        toast({
          title: "Script Generated Successfully",
          description: "Your personalized property script is ready!",
        })
      } else {
        throw new Error(data.error || "Failed to generate script")
      }
    } catch (error) {
      console.error("Error generating script:", error)
      toast({
        title: "Error Generating Script",
        description: error instanceof Error ? error.message : "Failed to generate script. Please try again.",
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
            formData: {
              ...formData,
              propertyAddress,
              ownerNames,
              propertyType,
              estimatedValue,
              propertyDetails,
            },
            script: result.script,
            title: `Property Script - ${propertyAddress}`,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to generate PDF")
        }

        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `Property_Script_${propertyAddress.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`
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
      console.log("Sending property script email with data:", {
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
          formData: {
            ...formData,
            propertyAddress,
            ownerNames,
            propertyType,
            estimatedValue,
            propertyDetails,
          },
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API response error:", response.status, errorText)
        throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Property script email API response:", data)

      if (data.success) {
        toast({
          title: "Email Sent Successfully",
          description: "Check your inbox for your personalized property script!",
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
      const title = generateCreationTitle("property-script", `${propertyAddress} - ${formData.prospectType}`)
      const success = await saveUserCreation({
        userId: user.id.toString(),
        userEmail: user.email,
        toolType: "property-script",
        title,
        content: result.script,
        formData: {
          ...formData,
          propertyAddress,
          ownerNames,
          propertyType,
          estimatedValue,
          propertyDetails,
        },
        metadata: {
          propertyAddress,
          deliveryMethod: formData.deliveryMethod,
          prospectType: formData.prospectType,
          customProspectType: formData.customProspectType,
          tonality: formData.tonality,
          agentName: formData.agentName,
          brokerageName: formData.brokerageName,
        },
      })

      if (success.success) {
        toast({
          title: "Script Saved",
          description: "Your property script has been saved to your profile dashboard.",
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

  if (!showScriptForm) {
    return (
      <Button
        onClick={() => setShowScriptForm(true)}
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
      >
        <Target className="h-4 w-4" />
        Generate Personalized Outreach Script
      </Button>
    )
  }

  return (
    <div className="space-y-6">
      {/* Property Information Card */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Building className="h-5 w-5" />
            Property Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-purple-800">Address:</p>
              <p className="text-purple-700">{propertyAddress}</p>
            </div>
            {ownerNames.length > 0 && (
              <div>
                <p className="font-medium text-purple-800">Owners:</p>
                <p className="text-purple-700">{ownerNames.join(", ")}</p>
              </div>
            )}
            {propertyType && (
              <div>
                <p className="font-medium text-purple-800">Property Type:</p>
                <p className="text-purple-700">{propertyType}</p>
              </div>
            )}
            {estimatedValue && (
              <div>
                <p className="font-medium text-purple-800">Estimated Value:</p>
                <p className="text-purple-700">{estimatedValue}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Script Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Script Configuration
          </CardTitle>
          <CardDescription>
            Configure your personalized outreach script for this property
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                             <Label htmlFor="agentName" className="flex items-center gap-2">
                 Your Name *
                 {user && <UserCheck className="h-4 w-4 text-green-600" />}
               </Label>
              <Input
                id="agentName"
                name="agentName"
                placeholder="Enter your full name"
                value={formData.agentName}
                onChange={handleInputChange}
                required
              />
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
                <p className="text-xs text-green-600">✓ Auto-filled from your profile</p>
              )}
              {user && !formData.brokerageName && (
                <p className="text-xs text-gray-500">Add your brokerage name to your branding profile to auto-fill this field</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deliveryMethod">Script Delivery *</Label>
              <Select
                value={formData.deliveryMethod}
                onValueChange={(value) => handleSelectChange("deliveryMethod", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select delivery method" />
                </SelectTrigger>
                <SelectContent>
                  {deliveryMethodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Email delivery note */}
              {formData.deliveryMethod === "email" && (
                <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-md border border-blue-200 mt-2">
                  💡 <strong>Email Delivery:</strong> When you select "Email" as your delivery method, you can send the script to yourself via email, and if you have Gmail connected, you can also send it directly to clients using your Gmail account.
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="prospectType">Prospect Type *</Label>
              <Select
                value={formData.prospectType}
                onValueChange={(value) => handleSelectChange("prospectType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select prospect type" />
                </SelectTrigger>
                <SelectContent>
                  {prospectTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.prospectType === "other" && (
            <div className="space-y-2">
              <Label htmlFor="customProspectType">Custom Prospect Type *</Label>
              <Input
                id="customProspectType"
                name="customProspectType"
                placeholder="Enter custom prospect type"
                value={formData.customProspectType}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tonality">Tonality</Label>
              <Select
                value={formData.tonality}
                onValueChange={(value) => handleSelectChange("tonality", value)}
              >
                <SelectTrigger>
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

            <div className="space-y-2">
                             <Label htmlFor="agentEmail" className="flex items-center gap-2">
                 Your Email *
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
            </div>
          </div>

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
            <Button
              variant="outline"
              onClick={() => setShowScriptForm(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerateScript}
              disabled={
                isGenerating ||
                !formData.agentName ||
                !formData.brokerageName ||
                !formData.agentEmail ||
                (formData.prospectType === "other" && !formData.customProspectType)
              }
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Script...
                </>
              ) : (
                <>
                  <Target className="mr-2 h-4 w-4" />
                  Generate Script
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Script Results */}
      {result && (
        <div ref={resultsRef} className="space-y-6">
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <MessageSquare className="h-5 w-5" />
                Your Personalized Property Script
              </CardTitle>
              <CardDescription className="text-purple-700">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {propertyAddress}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  <Target className="h-3 w-3 mr-1" />
                  VAK Enhanced
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Users className="h-3 w-3 mr-1" />
                  Property Specific
                </Badge>
              </div>

              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="text">Text Only</TabsTrigger>
                </TabsList>

                <TabsContent value="preview" className="space-y-4">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
                    <div className="prose prose-gray max-w-none">
                      <div className="whitespace-pre-wrap text-gray-800 leading-relaxed font-medium">
                        {result.script}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="text">
                  <Textarea value={result.script} readOnly className="min-h-[400px] resize-none" />
                </TabsContent>
              </Tabs>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={copyToClipboard}
                  className="flex items-center justify-center gap-2 bg-transparent"
                >
                  <Copy className="h-4 w-4" />
                  <span className="whitespace-nowrap">Copy</span>
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

                   {/* Gmail Client Email (Only if Gmail Connected and Email Delivery Method) */}
                   {isGmailConnected && formData.deliveryMethod === "email" && (
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
                  className="flex items-center justify-center gap-2 bg-transparent"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span className="whitespace-nowrap">{!isLoggedIn ? "Login to Save" : "Save"}</span>
                </Button>
              </div>

              {/* Calendar Integration */}
              {result && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    📅 Schedule Your Outreach
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <CalendarScheduler
                      title={`${formData.prospectType === "other" ? formData.customProspectType : formData.prospectType.toUpperCase()} Call - ${propertyAddress}`}
                      description={result.script}
                      defaultDuration={formData.deliveryMethod === "phone" ? 30 : 15}
                      className="w-full"
                    >
                      <Button variant="outline" className="w-full flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Schedule Single Call
                      </Button>
                    </CalendarScheduler>

                    {formData.prospectType === "fsbo" && (
                      <RecurringScheduler
                        title={`Follow-up - ${propertyAddress}`}
                        description={result.script}
                        defaultDuration={30}
                        className="w-full"
                      >
                        <Button variant="outline" className="w-full flex items-center gap-2">
                          <RotateCcw className="h-4 w-4" />
                          Schedule Follow-ups
                        </Button>
                      </RecurringScheduler>
                    )}
                  </div>
                  <p className="text-xs text-blue-700 mt-2">
                    💡 Schedule your outreach calls directly to your Google Calendar. Follow-ups are perfect for FSBO properties!
                  </p>
                </div>
              )}

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mt-6">
                <h5 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  💡 How to Use Your Script:
                </h5>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Practice the script until it feels natural</li>
                  <li>• Customize it with specific details for this property</li>
                  <li>• The script integrates VAK principles automatically</li>
                  <li>• Focus on the call-to-action at the end</li>
                  <li>• Track your results and refine as needed</li>
                  <li>• Print the PDF for easy reference during outreach</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Email Composition Modal */}
      {result && (
        <EmailCompositionModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          scriptContent={result.script}
          agentName={formData.agentName}
          brokerageName={formData.brokerageName}
          contentType="script"
        />
      )}
    </div>
  )
} 