"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateListingDescription, generateListingHTML } from "@/lib/listing-description-actions"
import { Loader2, Copy, Download, Mail, Home, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type FormState = {
  propertyAddress: string
  listingPrice: string
  bedrooms: string
  bathrooms: string
  squareFootage: string
  feature1: string
  feature2: string
  feature3: string
  feature4: string
  feature5: string
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
  const [formData, setFormData] = useState<FormState>({
    propertyAddress: "",
    listingPrice: "",
    bedrooms: "",
    bathrooms: "",
    squareFootage: "",
    feature1: "",
    feature2: "",
    feature3: "",
    feature4: "",
    feature5: "",
    agentName: "",
    agentEmail: "",
  })
  const [result, setResult] = useState<ListingResult | null>(null)

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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
      setStep(4) // Go to step 4 (results)
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
            listingHTML,
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
        Next: Property Features
      </Button>
    </div>
  )

  const renderStepTwo = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-black">Key Property Features</h3>
        <p className="text-gray-600">List the 5 most important features that make this property special</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="feature1">Key Feature 1 *</Label>
        <Input
          id="feature1"
          name="feature1"
          placeholder="e.g. Newly renovated kitchen with granite countertops"
          value={formData.feature1}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="feature2">Key Feature 2 *</Label>
        <Input
          id="feature2"
          name="feature2"
          placeholder="e.g. Spacious backyard with covered patio"
          value={formData.feature2}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="feature3">Key Feature 3 *</Label>
        <Input
          id="feature3"
          name="feature3"
          placeholder="e.g. Open floor plan with hardwood floors"
          value={formData.feature3}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="feature4">Key Feature 4 *</Label>
        <Input
          id="feature4"
          name="feature4"
          placeholder="e.g. Master suite with walk-in closet and en-suite bathroom"
          value={formData.feature4}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="feature5">Key Feature 5 *</Label>
        <Input
          id="feature5"
          name="feature5"
          placeholder="e.g. Prime location near schools and shopping"
          value={formData.feature5}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
          Back
        </Button>
        <Button
          onClick={() => setStep(3)}
          disabled={
            !formData.feature1 || !formData.feature2 || !formData.feature3 || !formData.feature4 || !formData.feature5
          }
          className="flex-1 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white"
        >
          Next: Your Information
        </Button>
      </div>
    </div>
  )

  const renderStepThree = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-black">Agent Information</h3>
        <p className="text-gray-600">Enter your details to receive the listing description</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="agentName">Your Name *</Label>
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
          <Label htmlFor="agentEmail">Your Email *</Label>
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

      {/* Property Summary */}
      <Card className="bg-gray-50 border-0">
        <CardContent className="p-6">
          <h4 className="font-semibold text-black mb-4 flex items-center gap-2">
            <Home className="h-4 w-4" />
            Property Summary
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <span className="font-medium">Address:</span> {formData.propertyAddress}
              </p>
              <p>
                <span className="font-medium">Price:</span> {formData.listingPrice}
              </p>
              <p>
                <span className="font-medium">Bedrooms:</span> {formData.bedrooms}
              </p>
              <p>
                <span className="font-medium">Bathrooms:</span> {formData.bathrooms}
              </p>
              <p>
                <span className="font-medium">Square Footage:</span> {formData.squareFootage}
              </p>
            </div>
            <div>
              <p>
                <span className="font-medium">Feature 1:</span> {formData.feature1}
              </p>
              <p>
                <span className="font-medium">Feature 2:</span> {formData.feature2}
              </p>
              <p>
                <span className="font-medium">Feature 3:</span> {formData.feature3}
              </p>
              <p>
                <span className="font-medium">Feature 4:</span> {formData.feature4}
              </p>
              <p>
                <span className="font-medium">Feature 5:</span> {formData.feature5}
              </p>
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
          disabled={isGenerating || !formData.agentName || !formData.agentEmail}
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

  const renderStepFour = () => (
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button variant="outline" onClick={copyToClipboard} className="flex items-center justify-center gap-2">
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
        <Button
          variant="outline"
          onClick={sendEmail}
          disabled={isSendingEmail}
          className="flex items-center justify-center gap-2"
        >
          {isSendingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          <span className="whitespace-nowrap">Email</span>
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
          setStep(1)
          setResult(null)
          setFormData({
            propertyAddress: "",
            listingPrice: "",
            bedrooms: "",
            bathrooms: "",
            squareFootage: "",
            feature1: "",
            feature2: "",
            feature3: "",
            feature4: "",
            feature5: "",
            agentName: "",
            agentEmail: "",
          })
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
            3
          </div>
          <div className={`h-1 w-16 ${step >= 4 ? "bg-yellow-600" : "bg-gray-200"}`}></div>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 4 ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            ✓
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            {step === 1 && "Property Information"}
            {step === 2 && "Key Features"}
            {step === 3 && "Agent Information"}
            {step === 4 && "Generated Description"}
          </p>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        {step === 1 && renderStepOne()}
        {step === 2 && renderStepTwo()}
        {step === 3 && renderStepThree()}
        {step === 4 && renderStepFour()}
      </form>
    </div>
  )
}
