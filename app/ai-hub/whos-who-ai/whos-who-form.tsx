"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useMemberSpaceUser } from "@/hooks/use-memberspace-user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Loader2,
  Search,
  Mail,
  CheckCircle,
  AlertCircle,
  Phone,
  MapPin,
  Home,
  Clock,
  ExternalLink,
  Shield,
  Target,
  BarChart3,
  Users,
  Building,
  TrendingUp,
} from "lucide-react"
import { skipTraceProperty } from "./actions"
import { analyzeComparables } from "@/components/actions"
import { QuickCMAResults } from "@/components/quickcma-results"

interface SkipTraceResult {
  summary: string
  rawData: any
  additionalData?: any
  address: string
}

interface CMAResult {
  analysisText: string
  sections: Record<string, string[]>
  address: string
  comparableData: {
    totalComparables: number
    comparables: any[]
    summary: {
      averagePrice: number
      averageSqft: number
      priceRange: { min: number; max: number }
    }
  }
  rawData?: {
    error?: string
    usingRealData: boolean
  }
}

export function WhosWhoForm() {
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    email: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<SkipTraceResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)

  // CMA-related state
  const [cmaResult, setCmaResult] = useState<CMAResult | null>(null)
  const [isCmaLoading, setIsCmaLoading] = useState(false)
  const [cmaError, setCmaError] = useState<string | null>(null)

  const { user, isLoggedIn } = useMemberSpaceUser()

  // Auto-populate email when user data is available
  useEffect(() => {
    if (isLoggedIn && user?.email && !formData.email) {
      setFormData((prev) => ({ ...prev, email: user.email }))
    }
  }, [isLoggedIn, user?.email, formData.email])

  const resultsRef = useRef<HTMLDivElement>(null)
  const cmaRef = useRef<HTMLDivElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Auto-scroll to results when they appear
  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }, [result])

  // Auto-scroll to CMA results when they appear
  useEffect(() => {
    if (cmaResult && cmaRef.current) {
      cmaRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }, [cmaResult])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResult(null)
    setEmailSent(false)
    setCmaResult(null) // Clear any previous CMA results

    try {
      const response = await skipTraceProperty(formData)

      if (response.success && response.data) {
        setResult(response.data)
        setEmailSent(true)
      } else {
        setError(response.error || "Failed to retrieve property information")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCMA = async () => {
    if (!result) return

    setIsCmaLoading(true)
    setCmaError(null)
    setCmaResult(null)

    try {
      const fullAddress = result.address
      console.log("Creating CMA for address:", fullAddress)

      const cmaResponse = await analyzeComparables(fullAddress)

      if (cmaResponse.error) {
        setCmaError(cmaResponse.message || "Failed to generate CMA")
      } else {
        setCmaResult(cmaResponse)
      }
    } catch (err) {
      console.error("CMA generation error:", err)
      setCmaError("An unexpected error occurred while generating the CMA. Please try again.")
    } finally {
      setIsCmaLoading(false)
    }
  }

  const isFormValid = formData.street && formData.city && formData.state && formData.zip && formData.email

  // Enhanced parsing function to extract and format content
  const parseAISummary = (summary: string) => {
    const sections = summary.split("##").filter((section) => section.trim())
    return sections.map((section) => {
      const lines = section.trim().split("\n")
      const title = lines[0].trim()
      const content = lines.slice(1).join("\n").trim()

      // Extract URLs from content for the contact section
      const urls = content.match(/https?:\/\/[^\s)]+/g) || []

      return { title, content, urls }
    })
  }

  const getSectionIcon = (title: string) => {
    if (title.includes("PROPERTY OVERVIEW")) return <Building className="h-5 w-5 text-blue-600" />
    if (title.includes("OWNER INFORMATION")) return <Users className="h-5 w-5 text-green-600" />
    if (title.includes("CONTACT DETAILS")) return <Phone className="h-5 w-5 text-purple-600" />
    if (title.includes("PROPERTY CHARACTERISTICS")) return <Home className="h-5 w-5 text-orange-600" />
    if (title.includes("PROFESSIONAL OUTREACH")) return <Target className="h-5 w-5 text-red-600" />
    if (title.includes("MARKET INSIGHTS")) return <BarChart3 className="h-5 w-5 text-indigo-600" />
    return <CheckCircle className="h-5 w-5 text-gray-600" />
  }

  const getSectionColor = (title: string) => {
    if (title.includes("PROPERTY OVERVIEW")) return "border-blue-200 bg-blue-50"
    if (title.includes("OWNER INFORMATION")) return "border-green-200 bg-green-50"
    if (title.includes("CONTACT DETAILS")) return "border-purple-200 bg-purple-50"
    if (title.includes("PROPERTY CHARACTERISTICS")) return "border-orange-200 bg-orange-50"
    if (title.includes("PROFESSIONAL OUTREACH")) return "border-red-200 bg-red-50"
    if (title.includes("MARKET INSIGHTS")) return "border-indigo-200 bg-indigo-50"
    return "border-gray-200 bg-gray-50"
  }

  // Function to make URLs clickable in content
  const makeUrlsClickable = (content: string, isContactSection = false) => {
    const urlRegex = /(https?:\/\/[^\s)]+)/g
    const parts = content.split(urlRegex)

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline font-medium ${
              isContactSection ? "bg-blue-100 px-2 py-1 rounded-md" : ""
            }`}
          >
            {isContactSection ? "View Public Records" : part}
            <ExternalLink className="h-3 w-3" />
          </a>
        )
      }
      return part
    })
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              name="street"
              type="text"
              placeholder="123 Main Street"
              value={formData.street}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              type="text"
              placeholder="Miami"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              name="state"
              type="text"
              placeholder="FL"
              value={formData.state}
              onChange={handleInputChange}
              required
              maxLength={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zip">ZIP Code</Label>
            <Input
              id="zip"
              name="zip"
              type="text"
              placeholder="33101"
              value={formData.zip}
              onChange={handleInputChange}
              required
              maxLength={5}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            Your Email Address
            {isLoggedIn && user?.email && formData.email === user.email && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-xs">Auto-filled</span>
              </div>
            )}
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <p className="text-sm text-gray-500">The detailed property owner report will be sent to this email address</p>
        </div>

        <Button type="submit" className="w-full" disabled={!isFormValid || isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching Property Records...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Find Property Owner
            </>
          )}
        </Button>
      </form>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {emailSent && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Detailed report sent successfully to {formData.email}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {result && (
        <div ref={resultsRef} className="space-y-6">
          {/* Header Card with CMA Button */}
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Search className="h-6 w-6" />
                Property Owner Research Complete
              </CardTitle>
              <CardDescription className="text-blue-700">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {result.address}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Skip Trace Complete
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Mail className="h-3 w-3 mr-1" />
                  Email Sent
                </Badge>
                {result.additionalData && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    <Phone className="h-3 w-3 mr-1" />
                    Enhanced Contact Data
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleCreateCMA}
                  disabled={isCmaLoading}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  {isCmaLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating CMA...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-4 w-4" />
                      Create CMA For This Property
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* CMA Error */}
          {cmaError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{cmaError}</AlertDescription>
            </Alert>
          )}

          {/* Professional Summary - Enhanced Layout */}
          <div className="grid gap-6">
            {parseAISummary(result.summary).map((section, index) => {
              const isContactSection = section.title.includes("CONTACT DETAILS")

              return (
                <Card key={index} className={`${getSectionColor(section.title)} border-l-4`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3 text-lg">
                      {getSectionIcon(section.title)}
                      <span className="font-semibold">{section.title.replace(/[🏠👤📞🏘️💼📋]/gu, "").trim()}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap leading-relaxed text-gray-700">
                        {makeUrlsClickable(section.content, isContactSection)}
                      </div>

                      {/* Special handling for contact section URLs */}
                      {isContactSection && section.urls.length > 0 && (
                        <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
                          <h4 className="font-medium text-purple-800 mb-2 flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Public Record Links
                          </h4>
                          <div className="space-y-2">
                            {section.urls.map((url, urlIndex) => (
                              <a
                                key={urlIndex}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-md transition-colors font-medium"
                              >
                                <ExternalLink className="h-4 w-4" />
                                View Additional Contact Data
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Legal Disclaimer */}
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">*** Legal Disclaimer ***</p>
                  <p className="leading-relaxed">
                    The provided data is sourced from publicly available information and should be used for
                    informational purposes only. All Federal, State and Local laws regarding the DNC (Do Not Call) list
                    and TCPA (Telephone Consumer Protection Act) laws should be followed at all times. Users are
                    responsible for ensuring compliance with all applicable regulations when contacting individuals
                    based on this information.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Raw Data Preview (Collapsible) */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Data Sources & Technical Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <details className="space-y-2">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 font-medium">
                  View raw API response data
                </summary>
                <div className="mt-3 p-3 bg-gray-50 rounded-md border">
                  <pre className="text-xs text-gray-600 overflow-auto max-h-40">
                    {JSON.stringify(result.rawData, null, 2)}
                  </pre>
                </div>
                {result.additionalData && (
                  <div className="mt-3 p-3 bg-purple-50 rounded-md border border-purple-200">
                    <p className="text-xs font-medium text-purple-800 mb-2">Additional Contact Data:</p>
                    <pre className="text-xs text-purple-600 overflow-auto max-h-40">
                      {JSON.stringify(result.additionalData, null, 2)}
                    </pre>
                  </div>
                )}
              </details>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CMA Results Section */}
      {cmaResult && (
        <div ref={cmaRef} className="space-y-6">
          <div className="border-t-4 border-green-500 pt-6">
            <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              Comparative Market Analysis
            </h2>
            <QuickCMAResults data={cmaResult} />
          </div>
        </div>
      )}
    </div>
  )
}
