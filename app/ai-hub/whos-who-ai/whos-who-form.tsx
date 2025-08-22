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
  Save,
} from "lucide-react"
import { skipTraceProperty } from "./actions"
import { analyzeComparables } from "@/components/actions"
import { QuickCMAResults } from "@/components/quickcma-results"
import { PropertyScriptGenerator } from "@/components/property-script-generator"

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
  const [cmaResult, setCmaResult] = useState<CMAResult | null>(null)
  const [isCmaLoading, setIsCmaLoading] = useState(false)
  const [cmaError, setCmaError] = useState<string | null>(null)

  // Script generation state
  const [showScriptGenerator, setShowScriptGenerator] = useState(false)

  // Action states
  const [isEmailing, setIsEmailing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

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
    setCmaResult(null) // Clear any previous CMA results

    try {
      const response = await skipTraceProperty(formData)

      if (response.success && response.data) {
        setResult(response.data)
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

      if ('error' in cmaResponse && cmaResponse.error) {
        setCmaError(('message' in cmaResponse ? cmaResponse.message : "Failed to generate CMA") || "Failed to generate CMA")
      } else {
        setCmaResult(cmaResponse as CMAResult)
      }
    } catch (err) {
      console.error("CMA generation error:", err)
      setCmaError("An unexpected error occurred while generating the CMA. Please try again.")
    } finally {
      setIsCmaLoading(false)
    }
  }

  const handleEmailResults = async () => {
    if (!result) return
    
    setIsEmailing(true)
    setEmailSent(false)
    
    try {
      console.log('Sending email with data:', {
        email: formData.email,
        address: result.address,
        summaryLength: result.summary.length,
        hasRawData: !!result.rawData,
        hasAdditionalData: !!result.additionalData
      })
      
      const response = await fetch('/api/send-whos-who-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          address: result.address,
          summary: result.summary,
          rawData: result.rawData,
          additionalData: result.additionalData
        })
      })
      
      console.log('Email API response:', response.status, response.statusText)
      
      if (response.ok) {
        const responseData = await response.json()
        console.log('Email API success:', responseData)
        setEmailSent(true)
        setTimeout(() => setEmailSent(false), 5000) // Hide after 5 seconds
      } else {
        const errorText = await response.text()
        console.error('Failed to send email:', response.status, errorText)
      }
    } catch (error) {
      console.error('Email error:', error)
    } finally {
      setIsEmailing(false)
    }
  }

  const handleSaveToProfile = async () => {
    if (!result || !isLoggedIn || !user) return
    
    setIsSaving(true)
    setSaveSuccess(false)
    
    try {
      const response = await fetch('/api/user-creations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: String(user.id), // Convert to string as required by API
          userEmail: formData.email,
          toolType: 'whos-who',
          title: `Property Owner Report - ${result.address}`,
          content: result.summary,
          formData: {
            address: result.address,
            email: formData.email
          },
          metadata: {
            address: result.address,
            hasAdditionalData: !!result.additionalData,
            generatedAt: new Date().toISOString()
          }
        })
      })
      
      if (response.ok) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 5000) // Hide after 5 seconds
      } else {
        console.error('Failed to save to profile')
      }
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const isFormValid = formData.street && formData.city && formData.state && formData.zip && formData.email

  // Enhanced parsing function to extract and format content
  const parseAISummary = (summary: string) => {
    const sections = summary.split("##").filter((section) => section.trim())
    return sections.map((section) => {
      const lines = section.trim().split("\n")
      const title = lines[0].trim()
      let content = lines.slice(1).join("\n").trim()

      // Clean up content based on section type
      if (title.includes("PROPERTY OVERVIEW")) {
        // Only keep the address, remove property type, value, details, features
        const addressMatch = content.match(/Address:\s*([^\n]+)/i)
        content = addressMatch ? `Address: ${addressMatch[1].trim()}` : content
      } else if (title.includes("OWNER INFORMATION")) {
        // Only keep the first 2 primary owners, remove associated individuals, past owners
        const primaryOwners = extractOwnerNames(summary)
        if (primaryOwners.length > 0) {
          // Create a clean owner information section with just the primary owners
          content = `Primary Owner Name(s) and Associated Individuals:\n` +
            primaryOwners.map((owner, index) => `- ${owner}`).join('\n') + '\n\n' +
            `Mailing Address:\nNot Available\n\n` +
            `Owner Demographics and Background Information:\n` +
            primaryOwners.map((owner, index) => `- ${owner}: Age information not available, Lives in current location`).join('\n')
        }
      } else if (title.includes("CONTACT DETAILS")) {
        // Extract ALL public profile links from the content
        const lines = content.split('\n')
        const publicProfileLines: string[] = []
        const otherContactLines: string[] = []
        
        lines.forEach(line => {
          // Check if this line contains a URL (public profile link)
          const hasUrl = /https?:\/\/[^\s)]+/.test(line)
          
          if (hasUrl) {
            // This is a public profile link - format it nicely
            const urlMatch = line.match(/(https?:\/\/[^\s)]+)/)
            if (urlMatch) {
              const url = urlMatch[1]
              let description = line.replace(url, '').trim()
              
              // Clean up the description
              if (description.startsWith('-')) description = description.substring(1).trim()
              if (description.startsWith('•')) description = description.substring(1).trim()
              
              // If no description, create one based on the URL
              if (!description || description.length < 5) {
                if (url.includes('truepeoplesearch.com')) description = 'TruePeopleSearch Profile'
                else if (url.includes('whitepages.com')) description = 'Whitepages Profile'
                else if (url.includes('spokeo.com')) description = 'Spokeo Profile'
                else if (url.includes('beenverified.com')) description = 'BeenVerified Profile'
                else if (url.includes('peoplefinder.com')) description = 'PeopleFinder Profile'
                else description = 'Public Profile'
              }
              
              publicProfileLines.push(`• ${description}: ${url}`)
            }
          } else {
            // This is other contact info (phone, email, etc.)
            const trimmedLine = line.trim()
            if (trimmedLine && !trimmedLine.startsWith('##')) {
              otherContactLines.push(trimmedLine)
            }
          }
        })
        
        // Combine public profile links with other contact info
        if (publicProfileLines.length > 0) {
          content = `Public Profile Links:\n${publicProfileLines.join('\n')}`
          if (otherContactLines.length > 0) {
            content += `\n\nOther Contact Information:\n${otherContactLines.join('\n')}`
          }
        } else if (otherContactLines.length > 0) {
          content = `Other Contact Information:\n${otherContactLines.join('\n')}`
        } else {
          content = `No contact information available.`
        }
      }

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

  // Enhanced function to make URLs clickable and extract public record links
  const makeUrlsClickable = (text: string, isContactSection: boolean = false): { content: string; urls: string[] } => {
    const urls: string[] = []
    
    // Enhanced regex to catch more URL patterns including public record sites
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(truepeoplesearch\.com[^\s]*)|(whitepages\.com[^\s]*)|(spokeo\.com[^\s]*)|(beenverified\.com[^\s]*)|(peoplefinder\.com[^\s]*)/gi
    
    const content = text.replace(urlRegex, (match) => {
      let url = match
      if (!url.startsWith('http')) {
        url = 'https://' + url
      }
      urls.push(url)
      
      // Create clickable link with better formatting for public profile links
      const displayName = match.replace(/^https?:\/\//, '').replace(/^www\./, '')
      
      // Special styling for public profile links
      if (isContactSection && (url.includes('truepeoplesearch.com') || url.includes('whitepages.com') || url.includes('spokeo.com') || url.includes('beenverified.com') || url.includes('peoplefinder.com'))) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-purple-600 hover:text-purple-800 underline font-semibold bg-purple-50 px-2 py-1 rounded">🔗 ${displayName}</a>`
      }
      
      // Regular link styling
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-medium">${displayName}</a>`
    })
    
    return { content, urls }
  }

  // Helper functions to extract property information from summary
  const extractOwnerNames = (summary: string): string[] => {
    const ownerSection = summary.match(/## OWNER INFORMATION[\s\S]*?(?=##|$)/i)
    if (ownerSection) {
      // Look for the "Primary Owner Name(s) and Associated Individuals" section
      const primarySection = ownerSection[0].match(/Primary Owner Name\(s\) and Associated Individuals:[\s\S]*?(?=\n\n|$)/i)
      if (primarySection) {
        // Extract names that start with "- " (bullet points)
        const nameMatches = primarySection[0].match(/- ([^\n]+)/g)
        if (nameMatches) {
          return nameMatches
            .map(name => name.replace(/^- /, '').trim())
            .filter(name => name && name.length > 0)
            .slice(0, 2) // Only take first 2 owners as requested
        }
      }
      
      // Fallback: Look for any owner names in the section
      const allOwners = ownerSection[0].match(/- ([^\n]+)/g)
      if (allOwners) {
        return allOwners
          .map(name => name.replace(/^- /, '').trim())
          .filter(name => name && name.length > 0)
          .slice(0, 2) // Only take first 2 owners as requested
      }
      
      // Additional fallback: Look for names in the demographics section
      const demographicsSection = ownerSection[0].match(/Owner Demographics and Background Information:[\s\S]*?(?=\n\n|$)/i)
      if (demographicsSection) {
        const nameMatches = demographicsSection[0].match(/- ([^:]+):/g)
        if (nameMatches) {
          return nameMatches
            .map(name => name.replace(/^- /, '').replace(/:/, '').trim())
            .filter(name => name && name.length > 0)
            .slice(0, 2) // Only take first 2 owners as requested
        }
      }
    }
    return []
  }

  // Helper function to check if a line contains a primary owner name
  const isPrimaryOwnerLine = (line: string, primaryOwners: string[]): boolean => {
    return primaryOwners.some(owner => 
      line.toLowerCase().includes(owner.toLowerCase())
    )
  }

  const extractPropertyType = (summary: string): string | undefined => {
    const propertySection = summary.match(/## PROPERTY CHARACTERISTICS[\s\S]*?(?=##|$)/i)
    if (propertySection) {
      const typeMatch = propertySection[0].match(/(?:Property type|Type):\s*([^\n]+)/i)
      return typeMatch ? typeMatch[1].trim() : undefined
    }
    return undefined
  }

  const extractEstimatedValue = (summary: string): string | undefined => {
    const propertySection = summary.match(/## PROPERTY CHARACTERISTICS[\s\S]*?(?=##|$)/i)
    if (propertySection) {
      // Look for various value formats
      const valueMatch = propertySection[0].match(/(?:Estimated value|Value|Price|Estimated price):\s*([^\n]+)/i)
      if (valueMatch) {
        return valueMatch[1].trim()
      }
      // Also check for any dollar amounts in the property section
      const dollarMatch = propertySection[0].match(/\$[\d,]+(?:\.\d{2})?/g)
      if (dollarMatch && dollarMatch.length > 0) {
        return dollarMatch[0] // Return the first dollar amount found
      }
    }
    return undefined
  }

  const extractPropertyDetails = (summary: string): string | undefined => {
    const propertySection = summary.match(/## PROPERTY CHARACTERISTICS[\s\S]*?(?=##|$)/i)
    if (propertySection) {
      return propertySection[0].replace(/## PROPERTY CHARACTERISTICS/i, '').trim()
    }
    return undefined
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
          <p className="text-sm text-gray-500">Your email is used to track your search history, provide support if needed, and send you the property owner report</p>
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
        
        {isLoading && (
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-600 mb-2">This may take 15-30 seconds for comprehensive results</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </form>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
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
                
                <Button
                  onClick={() => {
                    setShowScriptGenerator(true)
                    // Auto-scroll to script section after a brief delay
                    setTimeout(() => {
                      const scriptSection = document.getElementById('script-generator-section')
                      if (scriptSection) {
                        scriptSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }
                    }, 100)
                  }}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                >
                  <Target className="h-4 w-4" />
                  Generate Personalized Script
                </Button>
              </div>

              {/* Download, Email & Save Actions */}
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-blue-200">
                <Button
                  onClick={handleEmailResults}
                  disabled={isEmailing}
                  variant="outline"
                  className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50"
                >
                  {isEmailing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending Email...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      Email Results
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={handleSaveToProfile}
                  disabled={isSaving || !isLoggedIn}
                  variant="outline"
                  className="flex items-center gap-2 border-purple-300 text-purple-700 hover:bg-purple-50"
                  title={!isLoggedIn ? "Please log in to save reports to your profile" : ""}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save to Profile
                    </>
                  )}
                </Button>
              </div>

              {/* Success Messages */}
              {emailSent && (
                <Alert className="border-green-200 bg-green-50 mt-4">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Email sent successfully to {formData.email}
                  </AlertDescription>
                </Alert>
              )}

              {saveSuccess && (
                <Alert className="border-purple-200 bg-purple-50 mt-4">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                  <AlertDescription className="text-purple-800">
                    Report saved to your profile successfully
                  </AlertDescription>
                </Alert>
              )}
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
                      <div 
                        className="whitespace-pre-wrap leading-relaxed text-gray-700"
                        dangerouslySetInnerHTML={{ 
                          __html: makeUrlsClickable(section.content, isContactSection).content 
                        }}
                      />

                      {/* Special handling for contact section URLs */}
                      {isContactSection && (() => {
                        const urlData = makeUrlsClickable(section.content, isContactSection)
                        console.log("Who's Who: Contact section content:", section.content)
                        console.log("Who's Who: Extracted URLs:", urlData.urls)
                        console.log("Who's Who: Processed content:", urlData.content)
                        
                        if (urlData.urls.length > 0) {
                          // Separate public profile links from other URLs
                          const publicProfileUrls = urlData.urls.filter(url => 
                            url.includes('truepeoplesearch.com') || 
                            url.includes('whitepages.com') || 
                            url.includes('spokeo.com') || 
                            url.includes('beenverified.com') || 
                            url.includes('peoplefinder.com')
                          )
                          
                          const otherUrls = urlData.urls.filter(url => 
                            !url.includes('truepeoplesearch.com') && 
                            !url.includes('whitepages.com') && 
                            !url.includes('spokeo.com') && 
                            !url.includes('beenverified.com') && 
                            !url.includes('peoplefinder.com')
                          )
                          
                          return (
                            <div className="mt-4 space-y-4">
                              {/* Public Profile Links - Highlighted */}
                              {publicProfileUrls.length > 0 && (
                                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                  <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                                    <ExternalLink className="h-5 w-5" />
                                    🔗 Public Profile Links for Homeowners
                                  </h4>
                                  <div className="space-y-2">
                                    {publicProfileUrls.map((url, urlIndex) => {
                                      const displayName = url.includes('truepeoplesearch.com') ? 'TruePeopleSearch Profile' :
                                                        url.includes('whitepages.com') ? 'Whitepages Profile' :
                                                        url.includes('spokeo.com') ? 'Spokeo Profile' :
                                                        url.includes('beenverified.com') ? 'BeenVerified Profile' :
                                                        url.includes('peoplefinder.com') ? 'PeopleFinder Profile' :
                                                        'Public Profile'
                                      
                                      return (
                                        <a
                                          key={urlIndex}
                                          href={url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-2 text-purple-700 hover:text-purple-900 bg-white hover:bg-purple-100 px-4 py-2 rounded-md transition-colors font-medium border border-purple-200 hover:border-purple-300"
                                        >
                                          <ExternalLink className="h-4 w-4" />
                                          {displayName}
                                        </a>
                                      )
                                    })}
                                  </div>
                                </div>
                              )}
                              
                              {/* Other URLs */}
                              {otherUrls.length > 0 && (
                                <div className="p-3 bg-white rounded-lg border border-gray-200">
                                  <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <ExternalLink className="h-4 w-4" />
                                    Additional Links
                                  </h4>
                                  <div className="space-y-2">
                                    {otherUrls.map((url, urlIndex) => (
                                      <a
                                        key={urlIndex}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-md transition-colors font-medium"
                                      >
                                        <ExternalLink className="h-4 w-4" />
                                        View Additional Data
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        }
                        return null
                      })()}
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

                      {/* Script Generator Section */}
      {showScriptGenerator && result && (
        <div id="script-generator-section" className="border-t-4 border-purple-500 pt-6">
          <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
            <Target className="h-6 w-6" />
            Personalized Outreach Script
          </h2>
          <PropertyScriptGenerator
            propertyAddress={result.address}
            ownerNames={extractOwnerNames(result.summary)}
            propertyType={extractPropertyType(result.summary)}
            estimatedValue={extractEstimatedValue(result.summary)}
            propertyDetails={extractPropertyDetails(result.summary)}
            onScriptGenerated={(script) => {
              console.log("Script generated:", script)
            }}
          />
        </div>
      )}
    </div>
  )
}
