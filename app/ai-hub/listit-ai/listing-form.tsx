"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateListingDescription, generateListingHTML } from "./actions"
import { Loader2, Copy, Download, Mail, FileText, Save, Check, Mic, MicOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useMemberSpaceUser } from "@/hooks/use-memberspace-user"
import { saveUserCreation, generateCreationTitle } from "@/lib/auto-save-creation"

type FormState = {
  propertyAddress: string
  listingPrice: string
  bedrooms: string
  bathrooms: string
  squareFootage: string
  propertyDescription: string
  agentName: string
  agentEmail: string
}

type ListingResult = {
  description: string
}

export default function ListingForm() {
  const { toast } = useToast()
  const resultsRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isListeningDescription, setIsListeningDescription] = useState(false)
  const [formData, setFormData] = useState<FormState>({
    propertyAddress: "",
    listingPrice: "",
    bedrooms: "",
    bathrooms: "",
    squareFootage: "",
    propertyDescription: "",
    agentName: "",
    agentEmail: "",
  })
  const [result, setResult] = useState<ListingResult | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const { user, isLoggedIn } = useMemberSpaceUser()

  // Auto-scroll to results when they're generated
  useEffect(() => {
    if (result && step === 4 && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }, 100)
    }
  }, [result, step])

  // Auto-populate user data when logged in
  useEffect(() => {
    if (isLoggedIn && user) {
      setFormData((prev) => ({
        ...prev,
        agentName: user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || prev.agentName,
        agentEmail: user.email || prev.agentEmail,
      }))
    }
  }, [isLoggedIn, user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const startListening = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()

      // Mobile-optimized settings (copied exactly from PropBot)
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = "en-US"
      recognition.maxAlternatives = 3

      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        recognition.continuous = false
        recognition.interimResults = true
        recognition.speechTimeoutLength = 10000
        recognition.speechInputPossiblyComplete = 8000
      }

      let finalTranscript = ""
      let interimTranscript = ""

      recognition.onstart = () => {
        setIsListeningDescription(true)
        console.log("Voice recognition started for property description")
      }

      recognition.onresult = (event: any) => {
        finalTranscript = ""
        interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        const currentText = finalTranscript || interimTranscript
        if (currentText.trim()) {
          // REPLACE the content, don't append (this fixes the repetition issue)
          setFormData((prev) => ({
            ...prev,
            propertyDescription: currentText.trim(),
          }))
        }

        console.log("Voice result:", { final: finalTranscript, interim: interimTranscript })
      }

      recognition.onerror = (event: any) => {
        console.error("Voice recognition error:", event.error)
        setIsListeningDescription(false)

        let errorMessage = "Voice recognition failed. "
        switch (event.error) {
          case "no-speech":
            errorMessage += "No speech detected. Please try again."
            break
          case "audio-capture":
            errorMessage += "Microphone not accessible. Please check permissions."
            break
          case "not-allowed":
            errorMessage += "Microphone permission denied. Please enable microphone access."
            break
          case "network":
            errorMessage += "Network error. Please check your connection."
            break
          default:
            errorMessage += "Please try typing your description instead."
        }

        if (event.error !== "aborted") {
          toast({
            title: "Voice Recognition Error",
            description: errorMessage,
            variant: "destructive",
          })
        }
      }

      recognition.onend = () => {
        setIsListeningDescription(false)
        console.log("Voice recognition ended")

        if (finalTranscript.trim()) {
          setFormData((prev) => ({
            ...prev,
            propertyDescription: finalTranscript.trim(),
          }))
        }
      }

      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        navigator.mediaDevices
          ?.getUserMedia({ audio: true })
          .then(() => {
            recognition.start()
          })
          .catch((err) => {
            console.error("Microphone permission error:", err)
            toast({
              title: "Microphone Access Required",
              description: "Please allow microphone access to use voice input.",
              variant: "destructive",
            })
          })
      } else {
        recognition.start()
      }
    } else {
      toast({
        title: "Voice Recognition Not Supported",
        description: "Voice recognition is not supported in your browser. Please try Chrome or Safari.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    try {
      // Format the price if it doesn't already have a $ sign
      if (!formData.listingPrice.includes("$")) {
        // Try to parse the price as a number
        const priceNum = Number.parseFloat(formData.listingPrice.replace(/,/g, ""))
        if (!isNaN(priceNum)) {
          // Format with $ and commas
          formData.listingPrice = `$${priceNum.toLocaleString()}`
        } else {
          // If not a valid number, just add $ prefix
          formData.listingPrice = `$${formData.listingPrice}`
        }
      }

      // Also ensure commas in the price even if $ is already there
      if (formData.listingPrice.includes("$") && !formData.listingPrice.includes(",")) {
        const priceWithoutSymbol = formData.listingPrice.replace("$", "")
        const priceNum = Number.parseFloat(priceWithoutSymbol)
        if (!isNaN(priceNum)) {
          formData.listingPrice = `$${priceNum.toLocaleString()}`
        }
      }

      console.log("Generating listing description with data:", formData)
      const generatedListing = await generateListingDescription(formData)
      console.log("Generated listing:", generatedListing)
      setResult(generatedListing)
      setStep(3) // Go to step 3 (results)
      toast({
        title: "Listing Description Generated Successfully",
        description: "Your professional listing description is ready!",
      })
    } catch (error) {
      console.error("Error generating listing description:", error)
      toast({
        title: "Error Generating Description",
        description: "Failed to generate listing description. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    if (result?.description) {
      navigator.clipboard.writeText(result.description)
      toast({
        title: "Copied to Clipboard",
        description: "Your listing description has been copied to clipboard.",
      })
    }
  }

  const downloadPDF = async () => {
    if (result?.description) {
      setIsGeneratingPDF(true)
      try {
        // Call API route to generate and download PDF (same pattern as RealBio)
        const response = await fetch("/api/generate-listing-pdf", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formData,
            description: result.description,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to generate PDF")
        }

        // Get the PDF blob
        const blob = await response.blob()

        // Create download link
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${formData.propertyAddress.replace(/\s+/g, "_")}_Listing_Description.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        toast({
          title: "PDF Downloaded",
          description: "Your listing description PDF has been downloaded successfully.",
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
    if (result?.description) {
      setIsSendingEmail(true)
      try {
        // Generate HTML for email
        const listingHTML = await generateListingHTML(formData, result.description)

        // Send email via API route
        const response = await fetch("/api/send-listing-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: formData.agentEmail,
            name: formData.agentName,
            description: result.description,
            propertyAddress: formData.propertyAddress,
            listingPrice: formData.listingPrice,
            listingHTML: listingHTML,
          }),
        })

        const data = await response.json()

        if (data.success) {
          toast({
            title: "Email Sent Successfully",
            description: "Check your inbox for your professional listing description!",
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
    if (!result?.description || !isLoggedIn) {
      toast({
        title: "Save Failed",
        description: !isLoggedIn ? "Please log in to save your creations." : "No content to save.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const title = generateCreationTitle("listit-ai", formData)

      const success = await saveUserCreation({
        userId: user?.id || "anonymous",
        userEmail: user?.email || "",
        toolType: "listit-ai",
        title,
        content: result.description,
        formData,
        metadata: {
          propertyAddress: formData.propertyAddress,
          listingPrice: formData.listingPrice,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          squareFootage: formData.squareFootage,
          propertyDescription: formData.propertyDescription,
          agentName: formData.agentName,
          agentEmail: formData.agentEmail,
        },
      })

      if (success) {
        toast({
          title: "Saved Successfully",
          description: "Your listing description has been saved to your profile.",
        })
      } else {
        throw new Error("Save operation failed")
      }
    } catch (error) {
      console.error("Error saving to profile:", error)
      toast({
        title: "Save Failed",
        description: "Failed to save to your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const renderStepOne = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-black">Property Information</h3>
        <p className="text-gray-600">Enter the basic details about the property</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="propertyAddress">Property Address *</Label>
        <Input
          id="propertyAddress"
          name="propertyAddress"
          placeholder="Enter the full property address"
          value={formData.propertyAddress}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="listingPrice">Listing Price *</Label>
        <Input
          id="listingPrice"
          name="listingPrice"
          placeholder="e.g. $450,000"
          value={formData.listingPrice}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms *</Label>
          <Input
            id="bedrooms"
            name="bedrooms"
            placeholder="e.g. 3"
            value={formData.bedrooms}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bathrooms">Bathrooms *</Label>
          <Input
            id="bathrooms"
            name="bathrooms"
            placeholder="e.g. 2.5"
            value={formData.bathrooms}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="squareFootage">Square Footage *</Label>
          <Input
            id="squareFootage"
            name="squareFootage"
            placeholder="e.g. 2,100"
            value={formData.squareFootage}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <Button
        onClick={() => setStep(2)}
        disabled={
          !formData.propertyAddress ||
          !formData.listingPrice ||
          !formData.bedrooms ||
          !formData.bathrooms ||
          !formData.squareFootage
        }
        className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white"
      >
        Next: Property Description
      </Button>
    </div>
  )

  const renderStepTwo = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-black">Property Description</h3>
        <p className="text-gray-600">Describe the property features, amenities, and highlights</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="propertyDescription">Property Description *</Label>
        <div className="relative">
          <Textarea
            id="propertyDescription"
            name="propertyDescription"
            placeholder="Describe the property features, amenities, and what makes it special. For example: This house has a newly renovated kitchen with granite countertops, spacious backyard with covered patio, open floor plan with hardwood floors, master suite with walk-in closet, and is located in a prime area near schools and shopping..."
            value={formData.propertyDescription}
            onChange={handleInputChange}
            className="min-h-[150px] pr-12"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2"
            onClick={startListening}
            disabled={isListeningDescription}
          >
            {isListeningDescription ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
          </Button>
        </div>
        {isListeningDescription && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <div className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></div>
            Listening... Describe the property features and amenities
          </div>
        )}
        <p className="text-xs text-gray-500">
          💡 Tip: Use voice input to naturally describe the property. The AI will organize your description into a
          professional listing.
        </p>
      </div>

      {/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && (
        <div className="text-xs text-muted-foreground mt-2 p-2 bg-blue-50 rounded">
          <strong>Voice Input Tips:</strong> Speak clearly, hold phone close to mouth, ensure good internet connection
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="agentName" className="flex items-center gap-2">
            Your Name *
            {isLoggedIn && user && (user.name || user.firstName) && (
              <span className="flex items-center gap-1 text-green-600 text-xs">
                <Check className="h-3 w-3" />
                Auto-filled
              </span>
            )}
          </Label>
          <Input
            id="agentName"
            name="agentName"
            placeholder="Enter your name"
            value={formData.agentName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="agentEmail" className="flex items-center gap-2">
            Your Email *
            {isLoggedIn && user?.email && (
              <span className="flex items-center gap-1 text-green-600 text-xs">
                <Check className="h-3 w-3" />
                Auto-filled
              </span>
            )}
          </Label>
          <Input
            id="agentEmail"
            name="agentEmail"
            type="email"
            placeholder="Enter your email"
            value={formData.agentEmail}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isGenerating || !formData.propertyDescription || !formData.agentName || !formData.agentEmail}
          className="flex-1 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Description...
            </>
          ) : (
            "Generate Listing Description"
          )}
        </Button>
      </div>
    </div>
  )

  const renderStepThree = () => (
    <div ref={resultsRef} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-black">Your Listing Description is Ready!</h3>
        <p className="text-gray-600">
          Here's your professionally crafted listing description for {formData.propertyAddress}
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
              <div className="mb-4">
                <h3 className="text-xl font-bold text-black">{formData.propertyAddress}</h3>
                <p className="text-lg font-semibold text-yellow-600">{formData.listingPrice}</p>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">{result?.description}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Bedrooms:</span> {formData.bedrooms}
                  </div>
                  <div>
                    <span className="font-medium">Bathrooms:</span> {formData.bathrooms}
                  </div>
                  <div>
                    <span className="font-medium">Sq Ft:</span> {formData.squareFootage}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="text">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <Textarea value={result?.description || ""} readOnly className="min-h-[300px] resize-none" />
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
          disabled={isSaving || !result?.description || !isLoggedIn}
          className="flex items-center justify-center gap-2 bg-transparent"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span className="whitespace-nowrap">{!isLoggedIn ? "Login to Save" : "Save"}</span>
        </Button>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h5 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
          <FileText className="h-4 w-4" />💡 How to Use Your Listing Description:
        </h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Add it to your MLS listing</li>
          <li>• Use it in property brochures and flyers</li>
          <li>• Include it in email marketing campaigns</li>
          <li>• Post it on your website and social media</li>
          <li>• Share it with potential buyers</li>
          <li>• Download the PDF for professional presentations</li>
        </ul>
      </div>

      <Button
        onClick={() => {
          const newFormData = {
            propertyAddress: "",
            listingPrice: "",
            bedrooms: "",
            bathrooms: "",
            squareFootage: "",
            propertyDescription: "",
            agentName: isLoggedIn && user ? user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() : "",
            agentEmail: isLoggedIn && user ? user.email : "",
          }
          setFormData(newFormData)
          setStep(1)
          setResult(null)
        }}
        className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white"
      >
        Create Another Listing
      </Button>
    </div>
  )

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-2">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 1 ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            1
          </div>
          <div className={`h-1 w-16 ${step >= 2 ? "bg-yellow-600" : "bg-gray-200"}`}></div>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 2 ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            2
          </div>
          <div className={`h-1 w-16 ${step >= 3 ? "bg-yellow-600" : "bg-gray-200"}`}></div>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 3 ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            ✓
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            {step === 1 && "Property Information"}
            {step === 2 && "Property Description"}
            {step === 3 && "Generated Description"}
          </p>
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
