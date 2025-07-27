"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, Download, Mail, Copy, Loader2, AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import Script from "next/script"

interface AnalysisResult {
  analysis: string
  agentName: string
  propertyAddress: string
  email: string
}

// Define window.pdfjsLib for TypeScript
declare global {
  interface Window {
    pdfjsLib: any
    jspdf: any
  }
}

// Function to estimate tokens (rough approximation: 1 token ≈ 4 characters)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

export default function RealDealForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [contractText, setContractText] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPdfLoading, setIsPdfLoading] = useState(false)
  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [pdfJsLoaded, setPdfJsLoaded] = useState(false)
  const [jsPdfLoaded, setJsPdfLoaded] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Handle PDF.js library loading
  const handlePdfJsLoad = () => {
    setPdfJsLoaded(true)
    console.log("PDF.js library loaded successfully")
  }

  // Handle jsPDF library loading
  const handleJsPdfLoad = () => {
    setJsPdfLoaded(true)
    console.log("jsPDF library loaded successfully")
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const droppedFile = files[0]
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile)
        setError(null)
        extractPdfText(droppedFile)
      } else {
        setError("Please upload a PDF file only.")
      }
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile)
        setError(null)
        await extractPdfText(selectedFile)
      } else {
        setError("Please upload a PDF file only.")
        setFile(null)
      }
    }
  }

  const extractPdfText = async (file: File) => {
    setIsExtracting(true)
    try {
      console.log("Starting PDF extraction for:", file.name)

      // Try client-side extraction with PDF.js
      if (window.pdfjsLib) {
        console.log("Using PDF.js for extraction")

        // Read the file
        const arrayBuffer = await file.arrayBuffer()

        // Load the PDF document
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise
        console.log("PDF loaded, pages:", pdf.numPages)

        let fullText = ""

        // Extract text from each page
        for (let i = 1; i <= pdf.numPages; i++) {
          try {
            const page = await pdf.getPage(i)
            const textContent = await page.getTextContent()

            // Sort text items by their vertical position to maintain reading order
            const sortedItems = textContent.items.sort((a: any, b: any) => {
              // Compare y positions first (for vertical ordering)
              if (Math.abs(a.transform[5] - b.transform[5]) > 5) {
                return b.transform[5] - a.transform[5] // Higher y value comes first
              }
              // If y positions are similar, compare x positions (for horizontal ordering)
              return a.transform[4] - b.transform[4]
            })

            // Join text items with spaces, adding newlines between different vertical positions
            let lastY = 0
            let pageText = ""

            for (const item of sortedItems) {
              if (lastY && Math.abs(item.transform[5] - lastY) > 5) {
                pageText += "\n" // Add newline for new vertical position
              }
              pageText += item.str + " "
              lastY = item.transform[5]
            }

            fullText += pageText + "\n\n" // Add double newline between pages

            // Log progress for every 5 pages
            if (i % 5 === 0 || i === pdf.numPages) {
              console.log(`Extracted ${i}/${pdf.numPages} pages`)
            }
          } catch (pageError) {
            console.error(`Error extracting page ${i}:`, pageError)
          }
        }

        console.log("Text extraction complete, length:", fullText.length)
        console.log("First 500 characters:", fullText.substring(0, 500))

        // Set the extracted text (we'll handle truncation on the server)
        setContractText(fullText)

        const words = fullText.split(/\s+/).length
        const estimatedTokens = estimateTokens(fullText)

        toast({
          title: "PDF Text Extracted",
          description: `Successfully extracted ${words.toLocaleString()} words (~${estimatedTokens.toLocaleString()} tokens) from the contract.`,
        })

        return
      }

      // Fallback message if PDF.js not available
      toast({
        title: "PDF Upload Complete",
        description: "Please copy and paste the contract text below for analysis.",
        variant: "default",
      })
    } catch (error) {
      console.error("PDF extraction error:", error)
      toast({
        title: "PDF Upload Complete",
        description: "Please copy and paste the contract text below for analysis.",
        variant: "default",
      })
    } finally {
      setIsExtracting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!contractText.trim()) {
      setError("Please upload a contract or paste contract text.")
      return
    }

    if (contractText.trim().length < 100) {
      setError("Contract text is too short for analysis. Please provide more content.")
      return
    }

    setIsLoading(true)

    try {
      console.log("Starting contract analysis submission...")

      const formData = new FormData()
      formData.append("contractText", contractText)
      formData.append("agentName", (e.currentTarget.elements.namedItem("agentName") as HTMLInputElement).value)
      formData.append("email", (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value)
      formData.append(
        "propertyAddress",
        (e.currentTarget.elements.namedItem("propertyAddress") as HTMLInputElement).value,
      )

      console.log("Sending request to analysis API...")

      const response = await fetch("/api/realdeal/analyze", {
        method: "POST",
        body: formData,
      })

      console.log("Analysis API response status:", response.status)

      if (!response.ok) {
        let errorMessage = "Failed to analyze contract"
        try {
          const errorData = await response.json()
          console.error("Analysis API error:", errorData)
          errorMessage = errorData.details || errorData.error || errorMessage
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError)
          const errorText = await response.text()
          console.error("Raw error response:", errorText)
          errorMessage = `Server error (${response.status}): ${errorText.substring(0, 200)}`
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log("Analysis completed successfully")

      setResult(result)

      toast({
        title: "Analysis Complete",
        description: "Your contract has been analyzed successfully.",
      })
    } catch (error) {
      console.error("Analysis error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze the contract. Please try again."
      setError(errorMessage)

      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const cleanTextForPDF = (text: string) => {
    // Remove emojis and special characters, replace with clean section headers
    return text
      .replace(/📅[^:]*:/g, "KEY DATES:")
      .replace(/💰[^:]*:/g, "FINANCIAL DETAILS:")
      .replace(/📝[^:]*:/g, "CONTRACT TERMS:")
      .replace(/🏠[^:]*:/g, "PROPERTY DETAILS:")
      .replace(/🔍[^:]*:/g, "INSPECTION NOTES:")
      .replace(/📌[^:]*:/g, "IMPORTANT NOTES:")
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove markdown bold
      .replace(/[^\x00-\x7F]/g, "") // Remove non-ASCII characters
      .trim()
  }

  const generatePDF = async () => {
    if (!result || !window.jspdf) return null

    try {
      console.log("Generating PDF with jsPDF...")

      // Create new document
      const { jsPDF } = window.jspdf
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Set document properties
      doc.setProperties({
        title: `Contract Analysis for ${result.propertyAddress}`,
        subject: "Real Estate Contract Analysis",
        author: "RealDeal AI",
        creator: "RealDeal AI",
      })

      // Document styling
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 20
      const contentWidth = pageWidth - 2 * margin

      // Header
      doc.setFillColor(255, 193, 7) // Yellow background
      doc.rect(0, 0, pageWidth, 40, "F")

      // Title
      doc.setFontSize(20)
      doc.setTextColor(51, 51, 51)
      doc.text("REAL ESTATE CONTRACT ANALYSIS", pageWidth / 2, 15, { align: "center" })

      // Property address - wrap if too long
      doc.setFontSize(14)
      doc.setTextColor(85, 85, 85)
      const propertyText = result.propertyAddress || "Property Analysis"
      const splitPropertyText = doc.splitTextToSize(propertyText, contentWidth)
      let propertyY = 25
      for (const line of splitPropertyText) {
        doc.text(line, pageWidth / 2, propertyY, { align: "center" })
        propertyY += 4
      }

      // Agent and date info
      doc.setFontSize(10)
      doc.setTextColor(102, 102, 102)
      doc.text(`Prepared for: ${result.agentName}`, pageWidth / 2, propertyY + 3, { align: "center" })
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, propertyY + 8, { align: "center" })

      // Clean the analysis text
      const cleanedAnalysis = cleanTextForPDF(result.analysis)
      const lines = cleanedAnalysis.split("\n").filter((line) => line.trim() !== "")

      // Content
      let y = 55
      const lineHeight = 6

      doc.setTextColor(51, 51, 51)

      for (const line of lines) {
        // Check if we need a new page
        if (y > pageHeight - 30) {
          doc.addPage()
          y = margin
        }

        const trimmedLine = line.trim()

        // Section headers
        if (
          trimmedLine.includes("KEY DATES:") ||
          trimmedLine.includes("FINANCIAL DETAILS:") ||
          trimmedLine.includes("CONTRACT TERMS:") ||
          trimmedLine.includes("PROPERTY DETAILS:") ||
          trimmedLine.includes("INSPECTION NOTES:") ||
          trimmedLine.includes("IMPORTANT NOTES:")
        ) {
          // Add some space before section
          y += 5

          // Check if header fits on current page
          if (y > pageHeight - 40) {
            doc.addPage()
            y = margin + 5
          }

          // Section header styling
          doc.setFontSize(14)
          doc.setFont(undefined, "bold")
          doc.setTextColor(51, 51, 51)

          // Background for section header
          doc.setFillColor(248, 249, 250)
          doc.rect(margin, y - 4, contentWidth, 8, "F")

          // Split header text if too long
          const splitHeaderText = doc.splitTextToSize(trimmedLine, contentWidth - 4)
          for (const headerLine of splitHeaderText) {
            doc.text(headerLine, margin + 2, y + 1)
            y += lineHeight
          }

          y += 3

          // Reset font for content
          doc.setFontSize(11)
          doc.setFont(undefined, "normal")
          doc.setTextColor(85, 85, 85)
        }
        // Bullet points
        else if (trimmedLine.startsWith("- ")) {
          const bulletText = trimmedLine.substring(2)
          const splitText = doc.splitTextToSize(`• ${bulletText}`, contentWidth - 10)

          for (const textLine of splitText) {
            if (y > pageHeight - 30) {
              doc.addPage()
              y = margin
            }
            doc.text(textLine, margin + 5, y)
            y += lineHeight
          }
        }
        // Regular content
        else if (trimmedLine.length > 0) {
          const splitText = doc.splitTextToSize(trimmedLine, contentWidth)

          for (const textLine of splitText) {
            if (y > pageHeight - 30) {
              doc.addPage()
              y = margin
            }
            doc.text(textLine, margin, y)
            y += lineHeight
          }
        }
      }

      // Footer
      const totalPages = doc.internal.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        doc.setFontSize(9)
        doc.setTextColor(128, 128, 128)
        doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: "center" })
        doc.text("Powered by RealDeal AI", pageWidth / 2, pageHeight - 5, { align: "center" })
      }

      return doc
    } catch (error) {
      console.error("Error generating PDF:", error)
      return null
    }
  }

  const downloadPDF = async () => {
    if (!result) return

    try {
      setIsPdfLoading(true)

      if (!jsPdfLoaded) {
        toast({
          variant: "destructive",
          title: "PDF Library Not Loaded",
          description: "Please wait for the PDF library to load and try again.",
        })
        return
      }

      const doc = await generatePDF()
      if (!doc) {
        throw new Error("Failed to generate PDF")
      }

      // Save the PDF
      doc.save(`Contract_Analysis_${result.propertyAddress.replace(/[^a-z0-9]/gi, "_")}.pdf`)

      toast({
        title: "PDF Downloaded",
        description: "Your contract analysis PDF has been downloaded successfully.",
      })
    } catch (error) {
      console.error("Error downloading PDF:", error)
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Failed to download the PDF. Please try again.",
      })
    } finally {
      setIsPdfLoading(false)
    }
  }

  const sendEmail = async () => {
    if (!result) return

    try {
      setIsEmailLoading(true)
      console.log("Starting email send...")

      // Create a simple formatted text version for email
      const cleanedAnalysis = cleanTextForPDF(result.analysis)

      const formData = new FormData()
      formData.append("analysis", cleanedAnalysis)
      formData.append("agentName", result.agentName)
      formData.append("propertyAddress", result.propertyAddress)
      formData.append("email", result.email)

      console.log("Making request to /api/realdeal/send-email")

      const response = await fetch("/api/realdeal/send-email", {
        method: "POST",
        body: formData,
      })

      console.log("Email response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        console.error("Email sending failed:", errorData)
        throw new Error(errorData.error || `Failed to send email: ${response.status}`)
      }

      const emailResult = await response.json()
      console.log("Email sent successfully:", emailResult)

      toast({
        title: "Email Sent",
        description: "Contract analysis has been sent to your email.",
      })
    } catch (error) {
      console.error("Error sending email:", error)
      toast({
        variant: "destructive",
        title: "Email Failed",
        description: error instanceof Error ? error.message : "Failed to send the email. Please try again.",
      })
    } finally {
      setIsEmailLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (!result) return

    navigator.clipboard.writeText(result.analysis)
    toast({
      title: "Copied to Clipboard",
      description: "Contract analysis has been copied to clipboard.",
    })
  }

  const formatAnalysis = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900 font-semibold">$1</strong>')
      .split("\n")
      .map((line, index) => {
        if (line.trim() === "") return <br key={index} />
        if (
          line.includes("📅") ||
          line.includes("💰") ||
          line.includes("📝") ||
          line.includes("🏠") ||
          line.includes("🔍") ||
          line.includes("📌")
        ) {
          return (
            <h3 key={index} className="text-lg font-semibold text-gray-900 mt-6 mb-3 pb-2 border-b border-gray-200">
              <span dangerouslySetInnerHTML={{ __html: line }} />
            </h3>
          )
        }
        if (line.startsWith("- ")) {
          return (
            <li key={index} className="ml-4 mb-2 text-gray-700">
              <span dangerouslySetInnerHTML={{ __html: line.substring(2) }} />
            </li>
          )
        }
        return (
          <p key={index} className="mb-2 text-gray-700">
            <span dangerouslySetInnerHTML={{ __html: line }} />
          </p>
        )
      })
  }

  // Calculate text statistics
  const estimatedTokens = estimateTokens(contractText)
  const isTextTooLong = estimatedTokens > 5000 // Conservative limit
  const textStats = {
    characters: contractText.length,
    words: contractText.split(/\s+/).length,
    estimatedTokens,
  }

  return (
    <>
      {/* Load PDF.js from CDN */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        onLoad={handlePdfJsLoad}
        strategy="lazyOnload"
      />

      {/* Load jsPDF from CDN */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
        onLoad={handleJsPdfLoad}
        strategy="lazyOnload"
      />

      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-yellow-600" />
              Contract Analysis
            </CardTitle>
            <CardDescription>Upload your real estate contract for professional analysis and summary.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isTextTooLong && (
              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Your contract text is quite long (~{estimatedTokens.toLocaleString()} tokens). The system will
                  automatically truncate it to fit within AI processing limits while preserving the most important
                  content.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="agentName">Agent Name *</Label>
                  <Input id="agentName" name="agentName" placeholder="Your full name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" name="email" type="email" placeholder="your.email@example.com" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyAddress">Property Address (Optional)</Label>
                <Input
                  id="propertyAddress"
                  name="propertyAddress"
                  placeholder="We'll extract this from the contract if not provided"
                />
                <p className="text-xs text-gray-500">
                  For best results, enter the property address manually if you know it.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Upload Contract</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                    isDragOver
                      ? "border-yellow-400 bg-yellow-50"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  {file ? (
                    <div>
                      <p className="text-sm font-medium text-green-600">{file.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      {isExtracting && (
                        <div className="flex items-center justify-center mt-2">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span className="text-sm text-gray-600">Processing PDF...</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        {isDragOver
                          ? "Drop your contract PDF here"
                          : "Drag and drop your contract PDF here, or click to browse"}
                      </p>
                      <Button type="button" variant="outline" size="sm">
                        Choose File
                      </Button>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Upload a PDF and we'll try to extract the text automatically. You can always paste text manually
                  below.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="contractText">Contract Text *</Label>
                  <div className="text-sm text-gray-500">
                    {textStats.characters.toLocaleString()} chars • {textStats.words.toLocaleString()} words • ~
                    {textStats.estimatedTokens.toLocaleString()} tokens
                    {isTextTooLong && <span className="text-amber-600 ml-2">(will be auto-truncated)</span>}
                  </div>
                </div>
                <Textarea
                  id="contractText"
                  value={contractText}
                  onChange={(e) => setContractText(e.target.value)}
                  placeholder="Contract text will appear here after PDF upload, or paste it manually..."
                  className="min-h-[200px] font-mono text-sm"
                  required
                />
                <p className="text-xs text-gray-500">
                  Upload a PDF above to try automatic extraction, or paste your contract text directly here. Long
                  contracts will be automatically truncated to fit AI processing limits.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !contractText.trim() || contractText.length < 100}
                className="w-full bg-yellow-600 hover:bg-yellow-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Contract...
                  </>
                ) : (
                  "Analyze Contract"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Contract Analysis Results</span>
                <div className="flex gap-2">
                  <Button
                    onClick={downloadPDF}
                    variant="outline"
                    size="sm"
                    className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                    disabled={isPdfLoading || !jsPdfLoaded}
                  >
                    {isPdfLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    PDF
                  </Button>
                  <Button
                    onClick={sendEmail}
                    variant="outline"
                    size="sm"
                    className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                    disabled={isEmailLoading}
                  >
                    {isEmailLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Mail className="h-4 w-4 mr-2" />
                    )}
                    Email
                  </Button>
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>Professional analysis for {result.propertyAddress}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
                  <div className="space-y-4">{formatAnalysis(result.analysis)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
