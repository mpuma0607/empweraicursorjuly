"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Calculator, MapPin, Clock, Save, CheckCircle } from "lucide-react"
import { analyzeComparables } from "./actions"
import Image from "next/image"
import { useMemberSpaceUser } from "@/hooks/use-memberspace-user"
import { saveUserCreation, generateCreationTitle } from "@/lib/auto-save-creation"
import { toast } from "@/hooks/use-toast"
import { getUserBrandingProfile } from "@/app/profile/branding/actions"
import { useTenantConfig } from "@/hooks/useTenantConfig"

interface QuickCMAFormProps {
  onAnalysisComplete?: (data: any) => void
}

interface UserBrandingData {
  brand: string
  customLogo?: string
  colors: {
    primary: string
    secondary?: string
  }
  logoUrl?: string
}

export default function QuickCMAForm({ onAnalysisComplete }: QuickCMAFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingMessage, setLoadingMessage] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [userBranding, setUserBranding] = useState<UserBrandingData | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const { user } = useMemberSpaceUser()
  const tenantConfig = useTenantConfig()

  const [emailAddress, setEmailAddress] = useState("")

  // Auto-populate email when user data is available
  useEffect(() => {
    if (user?.email && !emailAddress) {
      setEmailAddress(user.email)
    }
  }, [user?.email, emailAddress])

  // Fetch user branding data
  useEffect(() => {
    const fetchUserBranding = async () => {
      if (!user?.id || !tenantConfig?.id) return

      try {
        const brandingProfile = await getUserBrandingProfile(user.id.toString(), tenantConfig.id)

        if (brandingProfile) {
          // Brand color mapping
          const brandColors: Record<string, { primary: string; secondary?: string }> = {
            century21: { primary: "#b6a888", secondary: "#000000" },
            kw: { primary: "#cc0000", secondary: "#000000" },
            remax: { primary: "#003da5", secondary: "#cc0000" },
            coldwellbanker: { primary: "#0066cc", secondary: "#ffffff" },
            berkshirehathaway: { primary: "#800020", secondary: "#ffffff" },
            exp: { primary: "#0066cc", secondary: "#ff6600" },
            compass: { primary: "#000000", secondary: "#ffffff" },
            realty: { primary: "#b6a888", secondary: "#000000" },
            better: { primary: "#228b22", secondary: "#ffffff" },
            corcoran: { primary: "#000000", secondary: "#ffffff" },
            sothebys: { primary: "#1a365d", secondary: "#ffffff" },
            redfin: { primary: "#a02021", secondary: "#ffffff" },
            douglas: { primary: "#000000", secondary: "#ffffff" },
            howard: { primary: "#0066cc", secondary: "#ffffff" },
            windermere: { primary: "#228b22", secondary: "#ffffff" },
            era: { primary: "#0066cc", secondary: "#ffffff" },
            properties: { primary: "#000000", secondary: "#ffffff" },
            weichert: { primary: "#ffd700", secondary: "#000000" },
            united: { primary: "#cc0000", secondary: "#ffffff" },
            home: { primary: "#0066cc", secondary: "#ffffff" },
          }

          const colors = brandColors[brandingProfile.brand] || { primary: "#000000", secondary: "#ffffff" }

          setUserBranding({
            brand: brandingProfile.brand,
            customLogo: brandingProfile.customLogo,
            colors,
            logoUrl: brandingProfile.customLogo || undefined,
          })
        }
      } catch (error) {
        console.error("Error fetching user branding:", error)
        // Continue without branding - will use default styling
      }
    }

    fetchUserBranding()
  }, [user?.id, tenantConfig?.id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Immediately set loading state
    setIsLoading(true)
    setError(null)
    setAnalysisData(null)
    setLoadingMessage("Starting CMA analysis...")

    console.log("=== LOADING STATE SET ===")
    console.log("isLoading:", true)

    try {
      const formData = new FormData(e.currentTarget)
      const street = formData.get("street") as string
      const city = formData.get("city") as string
      const state = formData.get("state") as string
      const zip = formData.get("zip") as string

      if (!street || !city || !state || !zip) {
        throw new Error("Please fill in all address fields")
      }

      // Create full address string
      const fullAddress = `${street} ${city} ${state} ${zip}`
      setLoadingMessage(`Analyzing comparable properties for ${fullAddress}...`)

      console.log("=== QuickCMA Form Debug ===")
      console.log("Full Address:", fullAddress)
      console.log("Form Data:", { street, city, state, zip })

      // Add a small delay to ensure loading state shows
      await new Promise((resolve) => setTimeout(resolve, 500))

      setLoadingMessage("Fetching comparable properties from Zillow...")

      const result = await analyzeComparables(fullAddress)

      console.log("Analysis result:", result)

      // Check if the result contains an error
      if (result.error) {
        throw new Error(result.message || "Failed to analyze comparables")
      }

      console.log("Analysis successful:", {
        hasResult: !!result,
        totalComparables: result?.comparableData?.totalComparables,
        hasAnalysisText: !!result?.analysisText,
      })

      setLoadingMessage("Generating AI analysis...")

      // Another small delay for the final step
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Add branding data to the result
      const resultWithBranding = {
        ...result,
        userBranding,
      }

      setAnalysisData(resultWithBranding)
      onAnalysisComplete?.(resultWithBranding)

      // Auto-scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }, 100)
    } catch (err) {
      console.error("QuickCMA Form Error:", err)
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
      setLoadingMessage("")
      console.log("=== LOADING STATE CLEARED ===")
    }
  }

  const handleSave = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save your CMA report.",
        variant: "destructive",
      })
      return
    }

    if (!analysisData) {
      toast({
        title: "No Data to Save",
        description: "Please generate a CMA report first.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const title = generateCreationTitle("quickcma-ai", analysisData.address || "CMA Report")

      const content = `CMA Report for ${analysisData.address}

Market Summary:
- Average Price: $${analysisData.comparableData?.summary?.averagePrice?.toLocaleString() || "N/A"}
- Average Size: ${analysisData.comparableData?.summary?.averageSqft?.toLocaleString() || "N/A"} sq ft
- Total Comparables: ${analysisData.comparableData?.totalComparables || 0}

${analysisData.analysisText || "No analysis available"}

Generated on ${new Date().toLocaleDateString()}`

      const result = await saveUserCreation({
        userId: user.id.toString(),
        userEmail: user.email || "",
        toolType: "quickcma-ai",
        title,
        content,
        metadata: {
          address: analysisData.address,
          comparableData: analysisData.comparableData,
          sections: analysisData.sections,
        },
      })

      if (result.success) {
        toast({
          title: "CMA Report Saved!",
          description: "Your CMA report has been saved to your dashboard.",
        })
      } else {
        throw new Error(result.error || "Failed to save")
      }
    } catch (error) {
      console.error("Save error:", error)
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save CMA report.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Get brand logo with fallback logic
  const brandLogo = (() => {
    // Complete brand logo mapping - all 20 uploaded brand logos
    const brandLogos: Record<string, string> = {
      century21: "/images/brands/century21-logo.png",
      kw: "/images/brands/keller-williams-logo.png",
      coldwellbanker: "/images/brands/coldwell-banker-logo.png",
      berkshirehathaway: "/images/brands/berkshire-hathaway-logo.png",
      exp: "/images/brands/exp-realty-logo.png",
      compass: "/images/brands/compass-logo.png",
      better: "/images/brands/better-homes-gardens-logo.png",
      corcoran: "/images/brands/corcoran-logo.png",
      howard: "/images/brands/howard-hanna-logo.png",
      home: "/images/brands/homesmart-logo.png",
      realty: "/images/brands/realty-one-logo.png",
      redfin: "/images/brands/redfin-logo.jpeg",
      sothebys: "/images/brands/sothebys-logo.png",
      weichert: "/images/brands/weichert-logo.png",
      remax: "/images/brands/remax-logo.png",
      windermere: "/images/brands/windermere-logo.png",
      united: "/images/brands/united-real-estate-logo.png",
      douglas: "/images/brands/douglas-elliman-logo.png",
      properties: "/images/brands/@properties_logo.png",
      era: "/images/brands/era-real-estate-logo.png",
    }

    // Return brand logo if user has a brand and it exists, otherwise null (no logo)
    if (userBranding?.brand && userBranding.brand !== "other" && brandLogos[userBranding.brand]) {
      return brandLogos[userBranding.brand]
    }

    // No logo for independents ("other") or unmapped brands
    return null
  })()

  // Debug: Log loading state changes
  console.log("Current loading state:", isLoading)

  return (
    <div className="space-y-6 relative">
      {/* LOADING OVERLAY - ALWAYS VISIBLE WHEN isLoading IS TRUE */}
      {isLoading && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-60 z-[9999] flex items-center justify-center"
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl border-2 border-yellow-200">
              <div className="relative mb-6">
                {brandLogo ? (
                  <Image
                    src={brandLogo || "/placeholder.svg"}
                    alt="User Brand Logo"
                    width={120}
                    height={120}
                    className="animate-spin mx-auto"
                    style={{ animationDuration: "2s" }}
                  />
                ) : (
                  <Image
                    src="/images/empower-ai-portal-logo.png"
                    alt="Empower AI Logo"
                    width={120}
                    height={120}
                    className="animate-spin mx-auto"
                    style={{ animationDuration: "2s" }}
                  />
                )}
              </div>
              <div className="flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-yellow-600 mr-2" />
                <h3 className="text-2xl font-bold text-yellow-800">CMA Generating</h3>
              </div>
              <p className="text-yellow-600 mb-4 font-medium">Please wait while we analyze the market...</p>
              <div className="bg-yellow-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-700">{loadingMessage}</p>
              </div>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div
                  className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">This typically takes 30-60 seconds</p>
            </div>
          </div>
        </>
      )}

      <Card className={isLoading ? "opacity-50" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            QuickCMA AI - Comparative Market Analysis
          </CardTitle>
          <CardDescription>
            Generate comprehensive CMA reports with comparable homes data and AI-powered market analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="street" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Street Address
                </Label>
                <Input id="street" name="street" placeholder="123 Main Street" required disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" placeholder="Tampa" required disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" placeholder="FL" required disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input id="zip" name="zip" placeholder="33543" required disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  Email Address (for sending report)
                  {user?.email && emailAddress === user.email && (
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
                  placeholder="your@email.com"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading} className="flex-1" size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating CMA Report...
                  </>
                ) : (
                  <>
                    <Calculator className="mr-2 h-5 w-5" />
                    Generate CMA Report
                  </>
                )}
              </Button>

              {analysisData && (
                <Button type="button" variant="outline" onClick={handleSave} disabled={isSaving || !user?.id} size="lg">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save to Dashboard
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 font-medium">{error}</p>
              <div className="mt-2 text-xs text-red-600">
                <p>Debug steps:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Check if the address format is correct</li>
                  <li>Try a different address</li>
                  <li>Check browser console for detailed logs</li>
                </ol>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {analysisData && !analysisData.error && (
        <div ref={resultsRef}>{/* QuickCMAResults component should be placed here */}</div>
      )}
    </div>
  )
}
