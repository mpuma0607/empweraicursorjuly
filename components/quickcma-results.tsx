"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { formatCurrency } from "../utils/formatting"
import { RingLoader } from "react-spinners"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Download,
  Mail,
  Check,
  Home,
  DollarSign,
  Ruler,
  MapPin,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Hash,
} from "lucide-react"

interface QuickCmaReportData {
  quickCmaReport: {
    subjectProperty: {
      address: string
      city: string
      state: string
      zipCode: string
    }
    averagePrice: number
    lowPrice: number
    highPrice: number
    medianPrice: number
    averagePricePerSquareFoot: number
    bedrooms: number
    bathrooms: number
    squareFootage: number
    yearBuilt: number
    propertyType: string
  }
  userBranding: {
    name: string
    title: string
    company: string
    phone: string
    email: string
    photo: string
    brand: string
    customLogo?: string
    colors: {
      primary: string
      secondary?: string
    }
    logoUrl?: string
  }
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

interface QuickCMAResultsProps {
  data: {
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
    userBranding?: UserBrandingData
  }
}

const QuickCMAResults = ({ data }: QuickCMAResultsProps) => {
  const router = useRouter()

  const [isDownloading, setIsDownloading] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [expandedComps, setExpandedComps] = useState<Set<number>>(new Set())

  // Get brand colors with fallback to black/white
  const brandColors = useMemo(() => {
    if (data.userBranding?.colors) {
      return data.userBranding.colors
    }
    // Default to black/white if no branding
    return { primary: "#000000", secondary: "#ffffff" }
  }, [data.userBranding])

  // Get brand logo with fallback logic
  const brandLogo = useMemo(() => {
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
    if (data.userBranding?.brand && data.userBranding.brand !== "other" && brandLogos[data.userBranding.brand]) {
      return brandLogos[data.userBranding.brand]
    }

    // No logo for independents ("other") or unmapped brands
    return null
  }, [data.userBranding])

  // Determine if we should show a logo
  const shouldShowLogo = useMemo(() => {
    return brandLogo !== null
  }, [brandLogo])

  const toggleCompExpansion = (index: number) => {
    const newExpanded = new Set(expandedComps)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedComps(newExpanded)
  }

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    try {
      const { jsPDF } = await import("jspdf")
      const doc = new jsPDF()

      // Add header background with brand color
      const primaryColor = brandColors.primary
      const rgbColor = hexToRgb(primaryColor)
      if (rgbColor) {
        doc.setFillColor(rgbColor.r, rgbColor.g, rgbColor.b)
      } else {
        doc.setFillColor(0, 0, 0) // Fallback to black
      }
      doc.rect(0, 0, 210, 40, "F")

      // Add title
      doc.setTextColor(255, 255, 255)
      doc.setFont("helvetica", "bold")
      doc.setFontSize(24)
      doc.text("QuickCMA Report", 20, 25)

      // Add subtitle
      doc.setFontSize(12)
      doc.text(`Comparative Market Analysis for ${data.address}`, 20, 32)

      // Reset text color for body
      doc.setTextColor(0, 0, 0)

      // Add generation date and stats
      doc.setFontSize(10)
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 150, 50)
      doc.text(`Comparables Analyzed: ${data.comparableData.totalComparables}`, 150, 55)
      doc.text(`Average Price: $${data.comparableData.summary.averagePrice.toLocaleString()}`, 150, 60)

      let yPosition = 80

      // Add comparable properties summary
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("Comparable Properties Summary", 20, yPosition)
      yPosition += 15

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text(
        `Price Range: $${data.comparableData.summary.priceRange.min.toLocaleString()} - $${data.comparableData.summary.priceRange.max.toLocaleString()}`,
        20,
        yPosition,
      )
      yPosition += 8
      doc.text(
        `Average Square Footage: ${data.comparableData.summary.averageSqft.toLocaleString()} sq ft`,
        20,
        yPosition,
      )
      yPosition += 15

      // Add top comparables with MLS IDs
      doc.setFont("helvetica", "bold")
      doc.text("Top Comparable Properties:", 20, yPosition)
      yPosition += 10

      data.comparableData.comparables.slice(0, 5).forEach((comp, index) => {
        if (yPosition > 250) {
          doc.addPage()
          yPosition = 30
        }

        doc.setFont("helvetica", "normal")
        doc.setFontSize(9)
        doc.text(`${index + 1}. ${comp.address}`, 25, yPosition)
        yPosition += 6

        // Add MLS ID if available
        if (comp.mlsId || comp.listingId) {
          doc.text(`   MLS ID: ${comp.mlsId || comp.listingId}`, 25, yPosition)
          yPosition += 6
        }

        doc.text(
          `   $${comp.price?.toLocaleString() || "N/A"} • ${comp.bedrooms}BR/${comp.bathrooms}BA • ${comp.sqft?.toLocaleString() || "N/A"} sq ft`,
          25,
          yPosition,
        )
        yPosition += 10
      })

      yPosition += 10

      // Add analysis sections
      Object.entries(data.sections).forEach(([header, bullets]) => {
        if (yPosition > 250) {
          doc.addPage()
          yPosition = 30
        }

        doc.setFont("helvetica", "bold")
        doc.setFontSize(12)
        doc.text(header, 20, yPosition)
        yPosition += 10

        doc.setFont("helvetica", "normal")
        doc.setFontSize(9)

        bullets.forEach((bullet) => {
          if (yPosition > 270) {
            doc.addPage()
            yPosition = 30
          }

          const splitText = doc.splitTextToSize(`• ${bullet}`, 170)
          doc.text(splitText, 25, yPosition)
          yPosition += splitText.length * 5 + 3
        })

        yPosition += 8
      })

      // Add footer with brand info
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFillColor(248, 250, 252)
        doc.rect(0, 280, 210, 17, "F")
        doc.setFontSize(9)
        doc.setTextColor(100, 116, 139)

        const brandName = data.userBranding?.brand
          ? data.userBranding.brand.charAt(0).toUpperCase() + data.userBranding.brand.slice(1)
          : "QuickCMA AI"

        doc.text(`Generated by QuickCMA AI - ${brandName}`, 20, 290)
        doc.text(`Page ${i} of ${pageCount}`, 170, 290)
      }

      const cleanAddress = data.address.split(",")[0].replace(/[^a-zA-Z0-9]/g, "-")
      doc.save(`${cleanAddress}-CMA-Report.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleSendEmail = async () => {
    if (!email) {
      setEmailError("Please enter your email address")
      return
    }

    setIsSendingEmail(true)
    setEmailError(null)

    try {
      const response = await fetch("/api/send-cma-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          address: data.address,
          analysisText: data.analysisText,
          comparableData: data.comparableData,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Failed to send email")
      }

      setEmailSent(true)
      setEmail("")
    } catch (error) {
      console.error("Email error:", error)
      setEmailError(error instanceof Error ? error.message : "Failed to send email")
    } finally {
      setIsSendingEmail(false)
    }
  }

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : null
  }

  // Check if we have data to display
  if (!data || !data.address) {
    return (
      <div className="flex justify-center items-center h-screen">
        <RingLoader color="#36D7B7" size={150} />
      </div>
    )
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <Button
          variant="outline"
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex items-center gap-2 bg-transparent"
        >
          {isDownloading ? (
            <>
              <img src="/images/empower-ai-portal-logo.png" alt="Empower AI" className="h-4 w-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Download CMA Report
            </>
          )}
        </Button>

        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-64"
          />
          <Button onClick={handleSendEmail} disabled={isSendingEmail || emailSent} className="flex items-center gap-2">
            {isSendingEmail ? (
              <>
                <img src="/images/empower-ai-portal-logo.png" alt="Empower AI" className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : emailSent ? (
              <>
                <Check className="h-4 w-4" />
                Sent
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Email Report
              </>
            )}
          </Button>
        </div>
      </div>

      {emailError && (
        <div className="p-4 bg-red-50 text-red-800 rounded-md flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {emailError}
        </div>
      )}

      {emailSent && (
        <div className="p-4 bg-green-50 text-green-800 rounded-md flex items-center gap-2">
          <Check className="h-4 w-4" />
          CMA report successfully sent to {email}
        </div>
      )}

      {/* Header with Dynamic Brand Colors */}
      <div
        className="text-white p-6 rounded-lg relative overflow-hidden"
        style={{
          background: `linear-gradient(to right, ${brandColors.primary}, ${brandColors.secondary || "#ffffff"})`,
        }}
      >
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Home className="h-8 w-8" />
            QuickCMA Report
          </h1>
          <p className="text-yellow-100 text-lg">{data.address}</p>
          <div className="flex items-center gap-4 mt-3">
            <Badge variant="secondary" className="bg-yellow-600 text-white">
              {data.comparableData.totalComparables} Comparables Found
            </Badge>
            <p className="text-yellow-200 text-sm">Generated on {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Dynamic Brand Logo */}
        {shouldShowLogo && brandLogo && (
          <div className="absolute bottom-4 right-4 opacity-80">
            <Image
              src={brandLogo || "/placeholder.svg"}
              alt="Brand Logo"
              width={60}
              height={60}
              className="filter brightness-0 invert"
            />
          </div>
        )}
      </div>

      {/* Market Summary Cards with Dynamic Brand Colors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4" style={{ borderLeftColor: brandColors.primary }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5" style={{ color: brandColors.primary }} />
              Average Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" style={{ color: brandColors.primary }}>
              ${data.comparableData.summary.averagePrice.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Range: ${data.comparableData.summary.priceRange.min.toLocaleString()} - $
              {data.comparableData.summary.priceRange.max.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4" style={{ borderLeftColor: brandColors.primary }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Ruler className="h-5 w-5" style={{ color: brandColors.primary }} />
              Average Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" style={{ color: brandColors.primary }}>
              {data.comparableData.summary.averageSqft.toLocaleString()} sq ft
            </p>
            <p className="text-sm text-gray-600 mt-1">
              ${Math.round(data.comparableData.summary.averagePrice / data.comparableData.summary.averageSqft || 0)}
              /sq ft
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4" style={{ borderLeftColor: brandColors.primary }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" style={{ color: brandColors.primary }} />
              Market Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" style={{ color: brandColors.primary }}>
              {data.comparableData.totalComparables}
            </p>
            <p className="text-sm text-gray-600 mt-1">Active Comparables</p>
          </CardContent>
        </Card>
      </div>

      {/* Comparable Properties with MLS IDs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Comparable Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.comparableData.comparables.slice(0, 8).map((comp, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-lg">{comp.address}</h4>
                      {(comp.mlsId || comp.listingId) && (
                        <Badge variant="outline" className="text-xs">
                          <Hash className="h-3 w-3 mr-1" />
                          MLS: {comp.mlsId || comp.listingId}
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                      <div>
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="font-semibold" style={{ color: brandColors.primary }}>
                          ${comp.price?.toLocaleString() || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Bed/Bath</p>
                        <p className="font-semibold">
                          {comp.bedrooms || 0}BR / {comp.bathrooms || 0}BA
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Square Feet</p>
                        <p className="font-semibold">{comp.sqft?.toLocaleString() || "N/A"} sq ft</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Price/Sq Ft</p>
                        <p className="font-semibold">${comp.pricePerSqft || "N/A"}</p>
                      </div>
                    </div>

                    {expandedComps.has(index) && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                        <div>
                          <p className="text-sm text-gray-600">Year Built</p>
                          <p className="font-semibold">{comp.yearBuilt || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Days on Market</p>
                          <p className="font-semibold">{comp.daysOnMarket || "N/A"} days</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Property Type</p>
                          <p className="font-semibold">{comp.propertyType || "N/A"}</p>
                        </div>
                        {(comp.mlsId || comp.listingId) && (
                          <div>
                            <p className="text-sm text-gray-600">MLS ID</p>
                            <p className="font-semibold font-mono" style={{ color: brandColors.primary }}>
                              {comp.mlsId || comp.listingId}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <Button variant="ghost" size="sm" onClick={() => toggleCompExpansion(index)} className="ml-4">
                    {expandedComps.has(index) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Sections with Dynamic Brand Colors */}
      <div className="space-y-6">
        {Object.entries(data.sections).map(([header, bullets]) => (
          <Card key={header} className="border-l-4" style={{ borderLeftColor: brandColors.primary }}>
            <CardHeader>
              <CardTitle className="text-xl font-bold" style={{ color: brandColors.primary }}>
                {header}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {bullets.map((bullet, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="font-bold mt-1 flex-shrink-0" style={{ color: brandColors.primary }}>
                      •
                    </span>
                    <span className="text-gray-700 leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Subject Property */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Subject Property</h2>
        <p>Address: {data.address}</p>
      </div>

      {/* Agent Branding */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Agent Information</h2>
        {brandLogo && (
          <Image src={brandLogo || "/placeholder.svg"} alt="Brand Logo" width={100} height={50} className="mb-2" />
        )}
        <p>Brand: {data.userBranding?.brand || "Independent"}</p>
      </div>
    </div>
  )
}

export { QuickCMAResults }
