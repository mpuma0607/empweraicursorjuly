"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useMemberSpaceUser } from "@/hooks/use-memberspace-user"
import { analyzeMarket, MarketData } from "./actions"
import { BarChart3, Home, Building2, MapPin, User, Mail, ArrowRight, ArrowLeft, AlertCircle, DollarSign, TrendingUp, Download } from "lucide-react"

interface FormData {
  agentName: string
  agentEmail: string
  marketType: 'housing' | 'rental' | null
  searchQuery: string
  homeType: string
  rentalType: string
  bedroomType: string
}

export default function MyMarketForm() {
  const { toast } = useToast()
  const { user, loading: isUserLoading } = useMemberSpaceUser()
  const isLoggedIn = !!user && !isUserLoading

  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<MarketData | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [email, setEmail] = useState("")

  const [formData, setFormData] = useState<FormData>({
    agentName: "",
    agentEmail: "",
    marketType: null,
    searchQuery: "",
    homeType: "All_Homes",
    rentalType: "All_Property_Types",
    bedroomType: "All_Bedrooms"
  })

  // Auto-populate user data when available - exactly like other tools
  useEffect(() => {
    if (user && !isUserLoading) {
      setFormData((prev) => ({
        ...prev,
        agentName: prev.agentName || user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        agentEmail: prev.agentEmail || user.email || "",
      }))
    }
  }, [user, isUserLoading])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step === 1) {
      if (!formData.agentName || !formData.agentEmail || !formData.marketType) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive"
        })
        return
      }
      setStep(2)
    }
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.searchQuery) {
      toast({
        title: "Missing Location",
        description: "Please enter a location to search.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      if (!formData.marketType) {
        throw new Error("Market type is required")
      }
      
      const marketData = await analyzeMarket(
        formData.agentName,
        formData.agentEmail,
        formData.marketType,
        formData.searchQuery,
        formData.marketType === 'housing' ? formData.homeType : undefined,
        formData.marketType === 'rental' ? formData.rentalType : undefined,
        formData.marketType === 'rental' ? formData.bedroomType : undefined
      )

      setResult(marketData)
      toast({
        title: "Analysis Complete",
        description: "Market analysis has been generated successfully.",
      })
    } catch (error) {
      console.error("MyMarket AI Error:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An error occurred during analysis.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!result) return

    setIsDownloading(true)
    try {
      const { jsPDF } = await import("jspdf")
      const doc = new jsPDF()

      // Add header
      doc.setFontSize(24)
      doc.setFont("helvetica", "bold")
      doc.text("Market Analysis Report", 20, 25)

      // Add subtitle
      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")
      doc.text(`${result.marketType === 'housing' ? 'Housing' : 'Rental'} Market Analysis for ${result.searchQuery}`, 20, 35)
      doc.text(`Analyzed by ${result.agentName} on ${new Date(result.timestamp).toLocaleDateString()}`, 20, 42)

      let yPosition = 60

      // Add market data
      const formattedData = formatMarketData(result.data)
      
      if (formattedData.type === 'housing') {
        doc.setFontSize(16)
        doc.setFont("helvetica", "bold")
        doc.text("Market Overview", 20, yPosition)
        yPosition += 10

        doc.setFontSize(12)
        doc.setFont("helvetica", "normal")
        doc.text(`Typical Home Value: $${formattedData.typicalHomeValue?.toLocaleString() || 'N/A'}`, 20, yPosition)
        yPosition += 8
        doc.text(`For Sale Inventory: ${formattedData.forSaleInventory?.toLocaleString() || 'N/A'}`, 20, yPosition)
        yPosition += 8
        doc.text(`Sale/List Ratio: ${formattedData.saleToListRatio || 'N/A'}`, 20, yPosition)
        yPosition += 15

        if (formattedData.description) {
          doc.setFontSize(14)
          doc.setFont("helvetica", "bold")
          doc.text("Market Description", 20, yPosition)
          yPosition += 10

          doc.setFontSize(10)
          doc.setFont("helvetica", "normal")
          const descriptionLines = doc.splitTextToSize(formattedData.description, 170)
          doc.text(descriptionLines, 20, yPosition)
          yPosition += descriptionLines.length * 5 + 10
        }

        if (formattedData.aiInsights) {
          doc.setFontSize(14)
          doc.setFont("helvetica", "bold")
          doc.text("AI Market Analysis", 20, yPosition)
          yPosition += 10

          doc.setFontSize(10)
          doc.setFont("helvetica", "normal")
          const insightsLines = doc.splitTextToSize(formattedData.aiInsights, 170)
          doc.text(insightsLines, 20, yPosition)
        }
      } else if (formattedData.type === 'rental') {
        doc.setFontSize(16)
        doc.setFont("helvetica", "bold")
        doc.text("Rental Market Overview", 20, yPosition)
        yPosition += 10

        doc.setFontSize(12)
        doc.setFont("helvetica", "normal")
        doc.text(`Average Rent: $${formattedData.averageRent?.toLocaleString() || 'N/A'}`, 20, yPosition)
        yPosition += 8
        doc.text(`Rental Inventory: ${formattedData.rentalInventory?.toLocaleString() || 'N/A'}`, 20, yPosition)
        yPosition += 8
        doc.text(`Rent Trend: ${formattedData.rentTrend || 'N/A'}`, 20, yPosition)
        yPosition += 15

        if (formattedData.description) {
          doc.setFontSize(14)
          doc.setFont("helvetica", "bold")
          doc.text("Market Description", 20, yPosition)
          yPosition += 10

          doc.setFontSize(10)
          doc.setFont("helvetica", "normal")
          const descriptionLines = doc.splitTextToSize(formattedData.description, 170)
          doc.text(descriptionLines, 20, yPosition)
          yPosition += descriptionLines.length * 5 + 10
        }

        if (formattedData.aiInsights) {
          doc.setFontSize(14)
          doc.setFont("helvetica", "bold")
          doc.text("AI Market Analysis", 20, yPosition)
          yPosition += 10

          doc.setFontSize(10)
          doc.setFont("helvetica", "normal")
          const insightsLines = doc.splitTextToSize(formattedData.aiInsights, 170)
          doc.text(insightsLines, 20, yPosition)
        }
      }

      // Save the PDF
      const fileName = `market-analysis-${result.searchQuery.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(fileName)

      toast({
        title: "Download Complete",
        description: "Market analysis PDF has been downloaded.",
      })
    } catch (error) {
      console.error("Error downloading PDF:", error)
      toast({
        title: "Download Failed",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleSendEmail = async () => {
    if (!result || !email) {
      toast({
        title: "Missing Information",
        description: "Please enter an email address.",
        variant: "destructive"
      })
      return
    }

    setIsSendingEmail(true)
    setEmailError(null)

    try {
      const response = await fetch("/api/send-market-analysis-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          agentName: result.agentName,
          agentEmail: result.agentEmail,
          marketType: result.marketType,
          searchQuery: result.searchQuery,
          marketData: result.data,
          timestamp: result.timestamp
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send email")
      }

      setEmailSent(true)
      setEmail("")
      toast({
        title: "Email Sent",
        description: "Market analysis has been sent to your email.",
      })
    } catch (error) {
      console.error("Error sending email:", error)
      setEmailError("Failed to send email. Please try again.")
      toast({
        title: "Email Failed",
        description: "Failed to send email. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSendingEmail(false)
    }
  }

  const resetForm = () => {
    setFormData({
      agentName: "",
      agentEmail: "",
      marketType: null,
      searchQuery: "",
      homeType: "All_Homes",
      rentalType: "All_Property_Types",
      bedroomType: "All_Bedrooms"
    })
    setStep(1)
    setResult(null)
    setError(null)
  }

  // Format market data for professional display
  const formatMarketData = (data: any) => {
    if (!data || typeof data !== 'object') {
      return { error: "No data available" }
    }

    try {
      // Handle housing market data
      if (data.market_overview) {
        return {
          type: 'housing',
          location: data.search_query || "Unknown Location",
          typicalHomeValue: data.market_overview.typical_home_values,
          description: data.market_overview.description,
          forSaleInventory: data.market_overview.for_sale_inventory,
          newListings: data.market_overview.new_listings,
          saleToListRatio: data.market_overview["market saletolist ratio"],
          aiInsights: data.ai_insights || null
        }
      }

      // Handle rental market data - check for actual API response structure
      if (data.rental_market_trends || data.rental_data) {
        const rentalData = data.rental_market_trends || data.rental_data || {}
        return {
          type: 'rental',
          location: data.search_query || rentalData.areaName || "Unknown Location",
          averageRent: rentalData.average_rent || rentalData.avgRent || 'N/A',
          rentTrend: rentalData.rent_trend || rentalData.rentTrend || 'N/A',
          rentalInventory: rentalData.rental_inventory || rentalData.inventory || 'N/A',
          description: rentalData.description || `Rental market data for ${rentalData.areaName || 'this area'}`,
          aiInsights: data.ai_insights || null
        }
      }

      // Handle case where rental data might be in a different structure
      if (data.message === 'success' && (data.rental_market_trends || data.rental_data)) {
        const rentalData = data.rental_market_trends || data.rental_data || {}
        return {
          type: 'rental',
          location: data.search_query || rentalData.areaName || "Unknown Location",
          averageRent: rentalData.average_rent || rentalData.avgRent || 'N/A',
          rentTrend: rentalData.rent_trend || rentalData.rentTrend || 'N/A',
          rentalInventory: rentalData.rental_inventory || rentalData.inventory || 'N/A',
          description: rentalData.description || `Rental market data for ${rentalData.areaName || 'this area'}`,
          aiInsights: data.ai_insights || null
        }
      }

      // Fallback for other data structures
      return {
        type: 'unknown',
        location: data.search_query || "Unknown Location",
        rawData: data
      }
    } catch (error) {
      return { error: "Unable to format data" }
    }
  }

  if (isUserLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Loading...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-4">
        <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            1
          </div>
          <span className="hidden sm:inline">Agent Info & Market Type</span>
        </div>
        <ArrowRight className="h-4 w-4 text-gray-400" />
        <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            2
          </div>
          <span className="hidden sm:inline">Location & Details</span>
        </div>
      </div>

      {/* Step 1: Agent Info & Market Type */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Step 1: Agent Information & Market Type
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Agent Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Agent Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="agentName">Your Name *</Label>
                  <Input
                    id="agentName"
                    value={formData.agentName}
                    onChange={(e) => handleInputChange('agentName', e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <Label htmlFor="agentEmail">Your Email *</Label>
                  <Input
                    id="agentEmail"
                    type="email"
                    value={formData.agentEmail}
                    onChange={(e) => handleInputChange('agentEmail', e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            </div>

            {/* Market Type Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Market Analysis Type *</h3>
              <RadioGroup
                value={formData.marketType || ""}
                onValueChange={(value) => handleInputChange('marketType', value as 'rental' | 'housing')}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="housing" id="housing" />
                  <Label htmlFor="housing" className="flex items-center gap-2 cursor-pointer">
                    <Home className="h-4 w-4" />
                    Housing Market Analysis
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rental" id="rental" />
                  <Label htmlFor="rental" className="flex items-center gap-2 cursor-pointer">
                    <Building2 className="h-4 w-4" />
                    Rental Market Analysis
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button onClick={handleNext} className="w-full">
              Continue to Step 2
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Location & Details */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Step 2: Location & Market Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Location Input */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Location *</h3>
                <div>
                  <Label htmlFor="searchQuery">
                    {formData.marketType === 'housing' 
                      ? "Enter City, State, Zip Code, or USA/United States" 
                      : "Enter City or Zip Code"
                    }
                  </Label>
                  <Input
                    id="searchQuery"
                    value={formData.searchQuery}
                    onChange={(e) => handleInputChange('searchQuery', e.target.value)}
                    placeholder={formData.marketType === 'housing' 
                      ? "e.g., Tampa, FL or 33601 or USA" 
                      : "e.g., Tampa or 33601"
                    }
                  />
                </div>
              </div>

              {/* Conditional Fields */}
              {formData.marketType === 'housing' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Home Type</h3>
                  <Select
                    value={formData.homeType}
                    onValueChange={(value) => handleInputChange('homeType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select home type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All_Homes">All Homes</SelectItem>
                      <SelectItem value="Single_Family">Single Family</SelectItem>
                      <SelectItem value="Condo">Condo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.marketType === 'rental' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Rental Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Rental Type</Label>
                      <Select
                        value={formData.rentalType}
                        onValueChange={(value) => handleInputChange('rentalType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select rental type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All_Property_Types">All Property Types</SelectItem>
                          <SelectItem value="Houses">Houses</SelectItem>
                          <SelectItem value="Apartments_and_Condos">Apartments and Condos</SelectItem>
                          <SelectItem value="Townhomes">Townhomes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Bedroom Type</Label>
                      <Select
                        value={formData.bedroomType}
                        onValueChange={(value) => handleInputChange('bedroomType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select bedroom type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All_Bedrooms">All Bedroom Types</SelectItem>
                          <SelectItem value="Studio">Studio</SelectItem>
                          <SelectItem value="1_Bedroom">1 Bedroom</SelectItem>
                          <SelectItem value="2_Bedroom">2 Bedrooms</SelectItem>
                          <SelectItem value="3_Bedroom">3 Bedrooms</SelectItem>
                          <SelectItem value="4_Bedroom_Plus">4 Bedrooms+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <Button type="button" variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing Market...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Analyze Market
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Market Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="outline" className="mb-2">
                    {result.marketType === 'housing' ? 'Housing Market' : 'Rental Market'}
                  </Badge>
                  <h3 className="text-lg font-semibold">{result.searchQuery}</h3>
                  <p className="text-sm text-gray-600">
                    Analyzed by {result.agentName} on {new Date(result.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="outline" onClick={resetForm}>
                  New Analysis
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleDownloadPDF} 
                  disabled={isDownloading}
                  className="flex items-center gap-2"
                >
                  {isDownloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Download PDF
                    </>
                  )}
                </Button>

                <div className="flex flex-col sm:flex-row gap-2 flex-1">
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendEmail} 
                    disabled={isSendingEmail || !email}
                    className="flex items-center gap-2"
                  >
                    {isSendingEmail ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4" />
                        Send Email
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {emailError && (
                <div className="text-red-600 text-sm">{emailError}</div>
              )}

              {emailSent && (
                <div className="text-green-600 text-sm">Email sent successfully!</div>
              )}
              
              {/* Professional Market Data Display */}
              {(() => {
                const formattedData = formatMarketData(result.data)
                
                if (formattedData.error) {
                  return (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-red-800">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-medium">Error:</span>
                        <span>{formattedData.error}</span>
                      </div>
                    </div>
                  )
                }

                if (formattedData.type === 'housing') {
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="font-semibold">Typical Home Value</span>
                            </div>
                            <p className="text-2xl font-bold text-green-600">
                              ${formattedData.typicalHomeValue?.toLocaleString() || 'N/A'}
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <Home className="h-4 w-4 text-blue-600" />
                              <span className="font-semibold">For Sale Inventory</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-600">
                              {formattedData.forSaleInventory?.toLocaleString() || 'N/A'}
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <TrendingUp className="h-4 w-4 text-purple-600" />
                              <span className="font-semibold">Sale/List Ratio</span>
                            </div>
                            <p className="text-2xl font-bold text-purple-600">
                              {formattedData.saleToListRatio || 'N/A'}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                      
                      {formattedData.description && (
                        <Card>
                          <CardContent className="p-4">
                            <h4 className="font-semibold mb-2">Market Overview</h4>
                            <p className="text-gray-700">{formattedData.description}</p>
                          </CardContent>
                        </Card>
                      )}

                      {/* AI Insights Section */}
                      {formattedData.aiInsights && (
                        <Card>
                          <CardContent className="p-4">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <BarChart3 className="h-4 w-4 text-blue-600" />
                              AI Market Analysis
                            </h4>
                            <div className="prose prose-sm max-w-none">
                              <p className="text-gray-700 whitespace-pre-line">{formattedData.aiInsights}</p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )
                }

                if (formattedData.type === 'rental') {
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="font-semibold">Average Rent</span>
                            </div>
                            <p className="text-2xl font-bold text-green-600">
                              ${formattedData.averageRent?.toLocaleString() || 'N/A'}
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <Building2 className="h-4 w-4 text-blue-600" />
                              <span className="font-semibold">Rental Inventory</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-600">
                              {formattedData.rentalInventory?.toLocaleString() || 'N/A'}
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <TrendingUp className="h-4 w-4 text-purple-600" />
                              <span className="font-semibold">Rent Trend</span>
                            </div>
                            <p className="text-2xl font-bold text-purple-600">
                              {formattedData.rentTrend || 'N/A'}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                      
                      {formattedData.description && (
                        <Card>
                          <CardContent className="p-4">
                            <h4 className="font-semibold mb-2">Market Overview</h4>
                            <p className="text-gray-700">{formattedData.description}</p>
                          </CardContent>
                        </Card>
                      )}

                      {/* AI Insights Section */}
                      {formattedData.aiInsights && (
                        <Card>
                          <CardContent className="p-4">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <BarChart3 className="h-4 w-4 text-blue-600" />
                              AI Market Analysis
                            </h4>
                            <div className="prose prose-sm max-w-none">
                              <p className="text-gray-700 whitespace-pre-line">{formattedData.aiInsights}</p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )
                }

                // Fallback for unknown data types
                return (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Raw Data</h4>
                    <pre className="text-sm overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                )
              })()}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-800">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 