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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { generateContent } from "./actions"
import { Loader2, Copy, Download, Mail, Mic, MicOff, Save, Upload, Info } from "lucide-react"
import Image from "next/image"
import { useMemberSpaceUser } from "@/hooks/use-memberspace-user"
import { useTenantConfig } from "@/contexts/tenant-context"
import { saveUserCreation, generateCreationTitle } from "@/lib/auto-save-creation"
import { getUserBrandingProfile } from "@/app/profile/branding/actions"
import EmailCompositionModal from "@/components/email-composition-modal"
import type { UserBrandingProfile } from "@/app/profile/branding/actions"
import { getBrandOptionsForTenant } from "@/lib/tenant-brand-options"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"

const topicOptions = [
  "The benefits of working with a real estate agent",
  "How to prepare your home for sale",
  "The process of buying a new home",
  "The importance of home inspections",
  "Tips for first-time home buyers",
  "How to stage your home for maximum appeal",
  "The benefits of owning a vacation home",
  "How to find the perfect neighborhood for your family",
  "The pros and cons of renting vs. buying",
  "How to negotiate a better deal on a home",
  "How to finance a new home",
  "How to find the best mortgage rates",
  "How to maintain and improve your credit score",
  "How to invest in real estate",
  "How to flip a house for profit",
  "How to find the best real estate deals",
  "How to make money in real estate",
  "How to create a budget for buying a new home",
  "How to handle closing costs",
  "How to find the right property management company",
  "How to choose the right home insurance",
  "How to create a home maintenance schedule",
  "How to find the best home warranty plan",
  "How to create a home security plan",
  "How to create a home automation system",
  "How to design a sustainable home",
  "How to find the best architect or designer for your home",
  "How to find the best contractor for your home renovation",
  "How to create a home office space",
  "How to create a home gym",
  "How to create a home theater",
  "How to create an outdoor living space",
  "How to create a home garden",
  "How to create a home pool or spa",
  "How to create a home wine cellar or tasting room",
  "How to create a home library or study",
  "How to create a home spa or massage room",
  "How to create a home sauna or steam room",
  "How to create a home game room or arcade",
  "How to create a home bar or lounge",
  "How to create a home pet grooming room",
  "How to create a home yoga or meditation room",
  "How to create a home greenhouse or sunroom",
  "How to create a home artist studio",
  "How to create a home dance studio",
  "How to create a home music studio",
  "How to create a home photography studio",
  "How to create a home craft or sewing room",
  "How to create a home sewing studio",
  "How to create a home art studio",
  "A beginner's guide to real estate investing",
  "A step-by-step guide to buying your first home",
  "A guide to understanding the mortgage process",
  "A guide to home inspections and what to look for",
  "A guide to understanding property taxes",
  "A guide to the different types of mortgages",
  "A guide to the home buying process for veterans",
  "A guide to the home buying process for first-time home buyers",
  "A guide to understanding home insurance",
  "A guide to home staging for sellers",
  "A guide to understanding property values and appraisals",
  "A guide to understanding closing costs",
  "A guide to understanding zoning laws and building codes",
  "A guide to understanding the real estate market",
  "A guide to understanding real estate contracts",
  "A guide to understanding home warranties",
  "A guide to understanding home security systems",
  "A guide to understanding home automation systems",
  "A guide to understanding the benefits of owning a vacation home",
  "A guide to understanding property management",
  "A guide to understanding the benefits of renting vs. buying",
  "A guide to understanding real estate trends",
  "A guide to understanding the benefits of owning a rental property",
  "A guide to understanding the benefits of a reverse mortgage",
  "A guide to understanding the benefits of owning a second home",
  "A guide to understanding the benefits of owning a green home",
  "A guide to understanding the benefits of owning a smart home",
  "A guide to understanding the benefits of owning a luxury home",
  "A guide to understanding the benefits of owning a waterfront property",
  "A guide to understanding the benefits of owning a beach property",
  "A guide to understanding the benefits of owning a golf course property",
  "A guide to understanding the benefits of owning a ski property",
  "A guide to understanding the benefits of owning a farm or ranch property",
  "A guide to understanding the benefits of owning a commercial property",
  "A guide to understanding the benefits of owning a industrial property",
  "A guide to understanding the benefits of owning a office building",
  "A guide to understanding the benefits of owning a retail property",
  "A guide to understanding the benefits of owning a apartment building",
  "A guide to understanding the benefits of owning a self-storage property",
  "A guide to understanding the benefits of owning a hotel or resort property",
  "A guide to understanding the benefits of owning a nursing home or assisted living facility",
  "A guide to understanding the benefits of owning a industrial park or business park",
  "A guide to understanding the benefits of owning a mobile home park or RV park",
  "A guide to understanding the benefits of owning a self-storage facility",
  "A guide to understanding the benefits of owning a warehouse or distribution center",
  "A guide to understanding the benefits of owning a land or undeveloped property",
  "A guide to understanding the benefits of owning a time share property",
  "A guide to understanding the benefits of owning a co-working space",
  "A guide to understanding the benefits of owning a data center",
  "A guide to understanding the benefits of owning a marina or boatyard",
  "How to buy and sell luxury properties",
  "How to buy and sell homes for first-time home buyers",
  "How to buy and sell properties for investors",
  "How to buy and sell new construction properties",
  "How to buy and sell foreclosures",
  "How to buy and sell short sales",
  "How to buy and sell rental properties",
  "How to buy and sell vacation homes",
  "How to buy and sell properties in retirement communities",
  "How to buy and sell properties in gated communities",
  "How to buy and sell waterfront properties",
  "How to buy and sell beach properties",
  "How to buy and sell ski properties",
  "How to buy and sell properties on golf courses",
  "How to buy and sell farm and ranch properties",
  "How to buy and sell commercial properties",
  "How to buy and sell industrial properties",
  "How to buy and sell office buildings",
  "How to buy and sell retail properties",
  "How to buy and sell apartment buildings",
  "How to buy and sell self-storage properties",
  "How to buy and sell hotel and resort properties",
  "How to buy and sell nursing homes and assisted living facilities",
  "How to buy and sell industrial parks and business parks",
  "How to buy and sell mobile home parks and RV parks",
  "How to buy and sell self-storage facilities",
  "How to buy and sell warehouses and distribution centers",
  "How to buy and sell land and undeveloped properties",
  "How to buy and sell timeshare properties",
  "How to buy and sell co-working spaces",
  "How to buy and sell data centers",
  "How to buy and sell marinas and boatyards",
  "How to buy and sell sustainable and green homes",
  "How to buy and sell smart homes",
  "How to buy and sell fixer-uppers",
  "How to buy and sell multi-generational homes",
  "How to buy and sell properties for down-sizing",
  "How to buy and sell luxury rental properties",
  "How to buy and sell executive rental properties",
  "How to buy and sell corporate rental properties",
  "How to buy and sell properties for relocation",
  "How to buy and sell international properties",
  "How to buy and sell properties in 55+ communities",
  "How to buy and sell tiny homes",
  "How to buy and sell rent-to-own properties",
  "How to buy and sell lease-to-own properties",
  "How to buy and sell shared equity properties",
  "How to buy and sell properties in community land trusts",
  "How to buy and sell accessory dwelling units (ADUs)",
  "How to buy and sell micro-units and tiny apartments",
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
]

type FormState = {
  primaryTopic: string
  alternateTopic: string
  imageChoice: "own" | "generate"
  customImage: File | null
  wantBranding: boolean
  brandingChoice: "saved-brand" | "saved-logo" | "dropdown" | "upload"
  selectedBrand: string
  customLogo: File | null
  includeContact: boolean
  name: string
  email: string
  phone: string
  contentType: string
  tonality: string
  language: string
  textColor: "white" | "black"
}

type ContentResult = {
  text: string
  imageUrl: string
}

export default function IdeaHubEmpowerForm() {
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [userBrandingProfile, setUserBrandingProfile] = useState<UserBrandingProfile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [showImageHelp, setShowImageHelp] = useState(false)
  const [showLogoHelp, setShowLogoHelp] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)
  const settingsRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  const { user, loading: userLoading } = useMemberSpaceUser()
  const tenantConfig = useTenantConfig()

  // Get tenant-aware brand options
  const brandOptions = tenantConfig ? getBrandOptionsForTenant(tenantConfig) : []

  const [formData, setFormData] = useState<FormState>({
    primaryTopic: "",
    alternateTopic: "",
    imageChoice: "generate",
    customImage: null,
    wantBranding: false,
    brandingChoice: "dropdown",
    selectedBrand: "",
    customLogo: null,
    includeContact: false,
    name: "",
    email: "",
    phone: "",
    contentType: "Social post",
    tonality: "Professional & Authoritative",
    language: "English",
    textColor: "white",
  })

  const [result, setResult] = useState<ContentResult | null>(null)
  const [editableText, setEditableText] = useState("")

  // Load user branding profile
  useEffect(() => {
    async function loadUserBrandingProfile() {
      if (!user?.id || userLoading || !tenantConfig) {
        setLoadingProfile(false)
        return
      }

      try {
        const profile = await getUserBrandingProfile(user.id.toString(), tenantConfig.id)
        setUserBrandingProfile(profile)
        console.log("Loaded user branding profile:", profile)
      } catch (error) {
        console.error("Error loading user branding profile:", error)
      } finally {
        setLoadingProfile(false)
      }
    }

    loadUserBrandingProfile()
  }, [user, userLoading, tenantConfig])

  // Auto-populate user data when available
  useEffect(() => {
    if (user && !userLoading) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
      }))
    }
  }, [user, userLoading])

  // Auto-scroll to settings section when Step 2 loads (mobile UX improvement)
  useEffect(() => {
    if (step === 2 && settingsRef.current) {
      setTimeout(() => {
        settingsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }, 300) // Small delay to ensure content is rendered
    }
  }, [step])

  // Auto-scroll to results when they're generated
  useEffect(() => {
    if (result && step === 3 && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }, 100)
    }
  }, [result, step])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: "customImage" | "customLogo") => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, [fieldName]: file }))
  }

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.")
      return
    }

    const recognition = new (window as any).webkitSpeechRecognition()
    recognitionRef.current = recognition

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "en-US"

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setFormData((prev) => ({
        ...prev,
        alternateTopic: prev.alternateTopic + (prev.alternateTopic ? " " : "") + transcript,
      }))
    }

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    try {
      // Transform formData to match the expected format for generateContent
      const transformedFormData = {
        ...formData,
        // Map brandingChoice to the expected format
        selectedBrand:
          formData.brandingChoice === "saved-brand"
            ? userBrandingProfile?.brand || ""
            : formData.brandingChoice === "dropdown"
              ? formData.selectedBrand
              : "",
        customLogo: formData.brandingChoice === "upload" ? formData.customLogo : null,
        // Use saved logo URL if brandingChoice is "saved-logo"
        savedLogoUrl: formData.brandingChoice === "saved-logo" ? userBrandingProfile?.custom_logo_url : null,
      }

      const generatedContent = await generateContent(transformedFormData)
      setResult(generatedContent)
      setStep(3)
    } catch (error) {
      console.error("Error generating content:", error)
      alert("Failed to generate content. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    const textToCopy = editableText || result?.text
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy)
      alert("Text copied to clipboard!")
    }
  }

  const downloadImage = () => {
    if (result?.imageUrl) {
      try {
        const link = document.createElement("a")
        link.href = result.imageUrl
        link.download = "social-media-image-branded.jpg"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch (error) {
        console.error("Error downloading image:", error)
        alert("Failed to download image. Please try again.")
      }
    }
  }

  const sendEmail = async () => {
    // Use Resend email functionality (Email to Self)
    const contentToSend = editableText || result?.text
    if (contentToSend && result?.imageUrl) {
      setIsSendingEmail(true)
      try {
        const response = await fetch("/api/ideahub-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "send-email",
            data: {
              to: formData.email,
              name: formData.name,
              content: contentToSend,
              imageUrl: result.imageUrl,
            },
          }),
        })

        const data = await response.json()
        if (data.success) {
          alert("Email sent successfully! Check your inbox.")
        } else {
          throw new Error(data.error || "Failed to send email")
        }
      } catch (error) {
        console.error("Error sending email:", error)
        alert(`Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`)
      } finally {
        setIsSendingEmail(false)
      }
    }
  }

  const sendEmailToClient = async () => {
    // Use Gmail modal for sending content to client
    setIsEmailModalOpen(true)
  }

  const saveToProfile = async () => {
    const contentToSave = editableText || result?.text
    if (!user || !contentToSave) {
      alert("Please log in to save your content.")
      return
    }

    setIsSaving(true)
    try {
      const title = generateCreationTitle("ideahub-empower", formData)
      await saveUserCreation({
        userId: user.id.toString(),
        userEmail: user.email,
        toolType: "ideahub-empower",
        title,
        content: contentToSave,
        formData,
        metadata: {
          imageUrl: result.imageUrl,
          contentType: formData.contentType,
          tonality: formData.tonality,
          language: formData.language,
          topic: formData.primaryTopic || formData.alternateTopic,
          imageChoice: formData.imageChoice,
          wantBranding: formData.wantBranding,
          brandingChoice: formData.brandingChoice,
          selectedBrand: formData.selectedBrand,
          includeContact: formData.includeContact,
        },
      })
      alert("Content saved to your profile successfully!")
    } catch (error) {
      console.error("Error saving content:", error)
      alert("Failed to save content. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const canProceedToStep2 = () => {
    const hasTopic = formData.primaryTopic || formData.alternateTopic
    const hasImageChoice = formData.imageChoice
    const hasImageIfOwn = formData.imageChoice === "generate" || formData.customImage
    const hasBrandingChoice =
      !formData.wantBranding ||
      (formData.brandingChoice === "saved-brand" && userBrandingProfile?.brand) ||
      (formData.brandingChoice === "saved-logo" && userBrandingProfile?.custom_logo_url) ||
      (formData.brandingChoice === "dropdown" && formData.selectedBrand) ||
      (formData.brandingChoice === "upload" && formData.customLogo)
    const hasContactChoice = !formData.includeContact || (formData.name && formData.email)

    return hasTopic && hasImageChoice && hasImageIfOwn && hasBrandingChoice && hasContactChoice
  }

  const renderBrandingOptions = () => {
    if (!formData.wantBranding) return null

    // Show 3 options if user has branding profile, 2 if not
    const hasProfile = userBrandingProfile && (userBrandingProfile.brand || userBrandingProfile.custom_logo_url)

    return (
      <div className="space-y-4">
        <Label>Choose your branding option:</Label>
        <RadioGroup
          value={formData.brandingChoice}
          onValueChange={(value: "saved-brand" | "saved-logo" | "dropdown" | "upload") =>
            handleSelectChange("brandingChoice", value)
          }
        >
          {hasProfile && userBrandingProfile?.brand && (
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="saved-brand" id="saved-brand" />
              <Label htmlFor="saved-brand">
                Use your saved brand: <strong>{userBrandingProfile.brand}</strong>
              </Label>
            </div>
          )}
          {hasProfile && userBrandingProfile?.custom_logo_url && (
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="saved-logo" id="saved-logo" />
              <Label htmlFor="saved-logo">Use your custom logo from profile</Label>
              {userBrandingProfile.custom_logo_url && (
                <div className="ml-4">
                  <Image
                    src={userBrandingProfile.custom_logo_url || "/placeholder.svg"}
                    alt="Saved logo"
                    width={50}
                    height={50}
                    className="object-contain border rounded"
                  />
                </div>
              )}
            </div>
          )}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dropdown" id="dropdown" />
            <Label htmlFor="dropdown">Select brand from list</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="upload" id="upload" />
            <Label htmlFor="upload">Upload a new logo</Label>
          </div>
        </RadioGroup>

        {formData.brandingChoice === "dropdown" && (
          <div className="space-y-2">
            <Label htmlFor="selectedBrand">Select a brand</Label>
            <Select
              value={formData.selectedBrand}
              onValueChange={(value) => handleSelectChange("selectedBrand", value)}
            >
              <SelectTrigger id="selectedBrand">
                <SelectValue placeholder="Choose a brand" />
              </SelectTrigger>
              <SelectContent>
                {brandOptions.map((brand) => (
                  <SelectItem key={brand.value} value={brand.value}>
                    {brand.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {formData.brandingChoice === "upload" && (
          <div className="space-y-2">
            <Label htmlFor="customLogo">Upload your logo</Label>
            <p className="text-sm text-gray-600">Accepts: JPEG, PNG, WebP | Max size: 10MB</p>
            <div className="flex items-center gap-2">
              <Input
                id="customLogo"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "customLogo")}
                className="flex-1"
              />
              <Upload className="h-4 w-4 text-gray-500" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowLogoHelp(!showLogoHelp)}
                className="p-1"
              >
                <Info className="h-4 w-4 text-blue-500" />
              </Button>
            </div>
            {formData.customLogo && (
              <p className="text-sm text-green-600">✓ Logo selected: {formData.customLogo.name}</p>
            )}

            <Collapsible open={showLogoHelp} onOpenChange={setShowLogoHelp}>
              <CollapsibleContent className="space-y-2">
                <div className="bg-blue-50 p-4 rounded-lg text-sm">
                  <h4 className="font-semibold text-blue-800 mb-2">Mobile Upload Issues? Try These Solutions:</h4>

                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-blue-700">iPhone Settings Change:</p>
                      <p className="text-blue-600">
                        Settings → Camera → Formats → Choose "Most Compatible" instead of "High Efficiency"
                      </p>
                      <p className="text-blue-600">
                        This makes iPhone save photos as JPEG instead of HEIC by default - One-time setting change fixes
                        it permanently
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-blue-700">Share/Export Method:</p>
                      <p className="text-blue-600">Instead of selecting photo directly from camera roll</p>
                      <p className="text-blue-600">
                        Use iPhone's "Share" button on the photo → "Save to Files" or "Copy"
                      </p>
                      <p className="text-blue-600">This often auto-converts HEIC to JPEG during the share process</p>
                    </div>

                    <div>
                      <p className="font-medium text-blue-700">Use Different Photo Selection:</p>
                      <p className="text-blue-600">
                        When the file picker opens, choose "Browse" instead of "Photo Library"
                      </p>
                      <p className="text-blue-600">Or select from "Recents" in Files app instead of Photos app</p>
                      <p className="text-blue-600">Different selection methods handle formats differently</p>
                    </div>

                    <div>
                      <p className="font-medium text-blue-700">Third-Party Apps:</p>
                      <p className="text-blue-600">Apps like "HEIC Converter" (free) can batch convert</p>
                      <p className="text-blue-600">Or use built-in "Shortcuts" app to create a conversion workflow</p>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </div>
    )
  }

  const renderStepOne = () => (
    <div className="space-y-6">
      {/* Topic Selection */}
      <div className="space-y-2">
        <Label htmlFor="primaryTopic">Choose a Topic from our list</Label>
        <Select value={formData.primaryTopic} onValueChange={(value) => handleSelectChange("primaryTopic", value)}>
          <SelectTrigger id="primaryTopic">
            <SelectValue placeholder="Select a topic from our library" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {topicOptions.map((topic, index) => (
              <SelectItem key={index} value={topic}>
                {topic}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="alternateTopic">Or enter custom topic below</Label>
        <div className="relative">
          <Textarea
            id="alternateTopic"
            name="alternateTopic"
            placeholder="Enter any custom topic or additional details you'd like to include"
            value={formData.alternateTopic}
            onChange={handleInputChange}
            className="min-h-[100px] pr-12"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0"
            onClick={isListening ? stopListening : startListening}
          >
            {isListening ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
          </Button>
        </div>
        {isListening && <p className="text-sm text-blue-600">Listening... Speak now</p>}
      </div>

      {/* Image Choice */}
      <div className="space-y-4">
        <Label>Would you like to use your own image or have one generated?</Label>
        <RadioGroup
          value={formData.imageChoice}
          onValueChange={(value: "own" | "generate") => handleSelectChange("imageChoice", value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="own" id="own" />
            <Label htmlFor="own">Use my own image</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="generate" id="generate" />
            <Label htmlFor="generate">Generate one for me</Label>
          </div>
        </RadioGroup>

        {formData.imageChoice === "own" && (
          <div className="space-y-2">
            <Label htmlFor="customImage">Upload your image</Label>
            <p className="text-sm text-gray-600">Accepts: JPEG, PNG, WebP | Max size: 10MB</p>
            <div className="flex items-center gap-2">
              <Input
                id="customImage"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "customImage")}
                className="flex-1"
              />
              <Upload className="h-4 w-4 text-gray-500" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowImageHelp(!showImageHelp)}
                className="p-1"
              >
                <Info className="h-4 w-4 text-blue-500" />
              </Button>
            </div>
            {formData.customImage && (
              <p className="text-sm text-green-600">✓ Image selected: {formData.customImage.name}</p>
            )}

            <Collapsible open={showImageHelp} onOpenChange={setShowImageHelp}>
              <CollapsibleContent className="space-y-2">
                <div className="bg-blue-50 p-4 rounded-lg text-sm">
                  <h4 className="font-semibold text-blue-800 mb-2">Mobile Upload Issues? Try These Solutions:</h4>

                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-blue-700">iPhone Settings Change:</p>
                      <p className="text-blue-600">
                        Settings → Camera → Formats → Choose "Most Compatible" instead of "High Efficiency"
                      </p>
                      <p className="text-blue-600">
                        This makes iPhone save photos as JPEG instead of HEIC by default - One-time setting change fixes
                        it permanently
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-blue-700">Share/Export Method:</p>
                      <p className="text-blue-600">Instead of selecting photo directly from camera roll</p>
                      <p className="text-blue-600">
                        Use iPhone's "Share" button on the photo → "Save to Files" or "Copy"
                      </p>
                      <p className="text-blue-600">This often auto-converts HEIC to JPEG during the share process</p>
                    </div>

                    <div>
                      <p className="font-medium text-blue-700">Use Different Photo Selection:</p>
                      <p className="text-blue-600">
                        When the file picker opens, choose "Browse" instead of "Photo Library"
                      </p>
                      <p className="text-blue-600">Or select from "Recents" in Files app instead of Photos app</p>
                      <p className="text-blue-600">Different selection methods handle formats differently</p>
                    </div>

                    <div>
                      <p className="font-medium text-blue-700">Third-Party Apps:</p>
                      <p className="text-blue-600">Apps like "HEIC Converter" (free) can batch convert</p>
                      <p className="text-blue-600">Or use built-in "Shortcuts" app to create a conversion workflow</p>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </div>

      {/* Branding Question */}
      <div className="space-y-4">
        <Label>Would you like to brand this post?</Label>
        <RadioGroup
          value={formData.wantBranding.toString()}
          onValueChange={(value) => handleSelectChange("wantBranding", value === "true")}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="brand-yes" />
            <Label htmlFor="brand-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="brand-no" />
            <Label htmlFor="brand-no">No</Label>
          </div>
        </RadioGroup>

        {loadingProfile && formData.wantBranding && (
          <p className="text-sm text-gray-500">Loading your branding profile...</p>
        )}

        {!loadingProfile && renderBrandingOptions()}
      </div>

      {/* Contact Info Question */}
      <div className="space-y-4">
        <Label>Would you like your name and contact info added?</Label>
        <RadioGroup
          value={formData.includeContact.toString()}
          onValueChange={(value) => handleSelectChange("includeContact", value === "true")}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="contact-yes" />
            <Label htmlFor="contact-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="contact-no" />
            <Label htmlFor="contact-no">No</Label>
          </div>
        </RadioGroup>

        {formData.includeContact && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Text Color</Label>
              <RadioGroup
                value={formData.textColor}
                onValueChange={(value: "white" | "black") => handleSelectChange("textColor", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="white" id="empower-text-white" />
                  <Label htmlFor="empower-text-white" className="text-sm">White Text (for darker backgrounds)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="black" id="empower-text-black" />
                  <Label htmlFor="empower-text-black" className="text-sm">Black Text (for lighter backgrounds)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}
      </div>

      {/* Content Type */}
      <div className="space-y-2">
        <Label htmlFor="contentType">Content Type *</Label>
        <Select value={formData.contentType} onValueChange={(value) => handleSelectChange("contentType", value)}>
          <SelectTrigger id="contentType">
            <SelectValue placeholder="Select content type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Social post">Social Post</SelectItem>
            <SelectItem value="Email">Email</SelectItem>
            <SelectItem value="Blog article">Blog Article</SelectItem>
            <SelectItem value="Text message">Text Message</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tonality */}
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

      {/* Language */}
      <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <Select value={formData.language} onValueChange={(value) => handleSelectChange("language", value)}>
          <SelectTrigger id="language">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Spanish">Spanish</SelectItem>
            <SelectItem value="French">French</SelectItem>
            <SelectItem value="German">German</SelectItem>
            <SelectItem value="Italian">Italian</SelectItem>
            <SelectItem value="Portuguese">Portuguese</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={() => setStep(2)}
        disabled={!canProceedToStep2()}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
      >
        Next
      </Button>
    </div>
  )

  const renderStepTwo = () => (
    <div className="space-y-6">
      <div ref={settingsRef} className="text-center">
        <h3 className="text-xl font-bold mb-4">Review Your Settings</h3>
        <div className="text-left space-y-2 bg-gray-50 p-4 rounded-lg">
          <p>
            <strong>Topic:</strong> {formData.primaryTopic || formData.alternateTopic}
          </p>
          <p>
            <strong>Image:</strong> {formData.imageChoice === "own" ? "Custom upload" : "AI Generated"}
          </p>
          <p>
            <strong>Branding:</strong>{" "}
            {formData.wantBranding
              ? formData.brandingChoice === "saved-brand"
                ? `Saved brand: ${userBrandingProfile?.brand}`
                : formData.brandingChoice === "saved-logo"
                  ? "Custom logo from profile"
                  : formData.brandingChoice === "dropdown"
                    ? `Selected: ${brandOptions.find((b) => b.value === formData.selectedBrand)?.label}`
                    : "Custom logo upload"
              : "None"}
          </p>
          <p>
            <strong>Contact Info:</strong> {formData.includeContact ? "Yes" : "No"}
          </p>
          <p>
            <strong>Content Type:</strong> {formData.contentType}
          </p>
          <p>
            <strong>Tonality:</strong> {formData.tonality}
          </p>
          <p>
            <strong>Language:</strong> {formData.language}
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isGenerating}
          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
            </>
          ) : (
            "Generate Content"
          )}
        </Button>
      </div>
    </div>
  )

  const renderStepThree = () => (
    <div ref={resultsRef} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-black">Your Content is Ready!</h3>
        <p className="text-gray-600">Here's your professionally generated social media content with custom branding</p>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="text">Text Only</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          <Card className="border-0 shadow-md overflow-hidden">
            <CardContent className="p-0">
              {result?.imageUrl && (
                <div className="relative w-full max-w-[600px] mx-auto" style={{ aspectRatio: "1200/630" }}>
                  <Image
                    src={result.imageUrl || "/placeholder.svg"}
                    alt="Generated content image with custom branding"
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
              )}
              <div className="p-6">
                <p className="whitespace-pre-wrap text-gray-800">{result?.text}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="text">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="space-y-2">
                <Textarea 
                  value={editableText || result?.text || ""} 
                  onChange={(e) => setEditableText(e.target.value)}
                  className="min-h-[300px] resize-none" 
                  placeholder="Generated content will appear here..."
                />
                <div className="text-right text-sm text-gray-500">
                  {editableText ? editableText.length : (result?.text?.length || 0)} characters
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Button
          variant="outline"
          onClick={copyToClipboard}
          className="flex items-center justify-center gap-2 bg-transparent"
        >
          <Copy className="h-4 w-4" /> <span className="whitespace-nowrap">Copy</span>
        </Button>
        <Button
          variant="outline"
          onClick={downloadImage}
          className="flex items-center justify-center gap-2 bg-transparent"
        >
          <Download className="h-4 w-4" /> <span className="whitespace-nowrap">Download</span>
        </Button>
        <Button
          variant="outline"
          onClick={sendEmail}
          disabled={isSendingEmail}
          className="flex items-center justify-center gap-2 bg-transparent"
        >
          {isSendingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          <span className="whitespace-nowrap">Email To Self</span>
        </Button>
        
        {/* Always show Send Email to Client button */}
        <Button
          variant="outline"
          onClick={sendEmailToClient}
          className="flex items-center justify-center gap-2 bg-transparent"
        >
          <Mail className="h-4 w-4" />
          <span className="whitespace-nowrap">Send Email To Client</span>
        </Button>
        <Button
          variant="outline"
          onClick={saveToProfile}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 bg-transparent"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span className="whitespace-nowrap">Save</span>
        </Button>
      </div>

      <Button
        onClick={() => {
          setStep(1)
          setResult(null)
          setEditableText("")
          setFormData({
            primaryTopic: "",
            alternateTopic: "",
            imageChoice: "generate",
            customImage: null,
            wantBranding: false,
            brandingChoice: "dropdown",
            selectedBrand: "",
            customLogo: null,
            includeContact: false,
            name: "",
            email: "",
            phone: "",
            contentType: "Social post",
            tonality: "Professional & Authoritative",
            language: "English",
            textColor: "white",
          })
        }}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
      >
        Create New Content
      </Button>

      {/* Email Composition Modal */}
      <EmailCompositionModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        scriptContent={editableText || result?.text || ""}
        agentName={formData.name}
        brokerageName=""
        contentType="ideahub"
        attachments={result?.imageUrl ? {
          imageUrl: result.imageUrl,
          fileName: "social-media-content.png"
        } : undefined}
      />
    </div>
  )

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-2">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 1 ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            1
          </div>
          <div className={`h-1 w-16 ${step >= 2 ? "bg-purple-600" : "bg-gray-200"}`}></div>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 2 ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            2
          </div>
          <div className={`h-1 w-16 ${step >= 3 ? "bg-purple-600" : "bg-gray-200"}`}></div>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 3 ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            3
          </div>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        {step === 1 && renderStepOne()}
        {step === 2 && renderStepTwo()}
        {step === 3 && renderStepThree()}
      </form>
    </div>
  )
}
