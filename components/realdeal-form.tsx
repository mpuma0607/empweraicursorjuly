"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, Download, Mail, Copy, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

interface AnalysisResult {
  analysis: string
  agentName: string
  propertyAddress: string
  email: string
  contractText: string
}

export default function ContractAnalysisForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [contractText, setContractText] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPdfLoading, setIsPdfLoading] = useState(false)
  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const { toast } = useToast()

  const handlePDFUpload = async (file: File) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/extract-pdf-text", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setContractText(result.text)
        toast({
          title: "PDF Processed",
          description: `Extracted ${result.wordCount} words from PDF${result.truncated ? " (truncated)" : ""}`,
        })
      } else {
        throw new Error(result.error || "Failed to extract text from PDF")
      }
    } catch (error) {
      console.error("PDF upload error:", error)
      toast({
        title: "PDF Processing Failed",
        description: "Please copy and paste the contract text manually.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile)
        setError(null)
        handlePDFUpload(selectedFile)
        toast({
          title: "PDF Selected",
          description: `File "${selectedFile.name}" selected.`,
        })
      } else {
        setError("Please upload a PDF file only.")
        setFile(null)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("contractText", contractText)
      formData.append("agentName", (e.currentTarget.elements.namedItem("agentName") as HTMLInputElement).value)
      formData.append("email", (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value)

      const response = await fetch("/api/analyze-contract", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`)
      }

      const result = await response.json()
      setResult(result)

      toast({
        title: "Analysis Complete",
        description: "Your contract has been analyzed successfully.",
      })
    } catch (error) {
      console.error("Form submission error:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
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

  const handleDownloadPDF = async () => {
    if (!result) return

    setIsPdfLoading(true)

    try {
      const formData = new FormData()
      formData.append("analysis", result.analysis)
      formData.append("agentName", result.agentName)
      formData.append("propertyAddress", result.propertyAddress)

      const response = await fetch("/api/generate-contract-pdf", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to generate PDF")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `Contract_Analysis_${result.propertyAddress.replace(/[^a-z0-9]/gi, "_")}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "PDF Downloaded",
        description: "Contract analysis PDF has been downloaded successfully.",
      })
    } catch (error) {
      console.error("Error downloading PDF:", error)
      toast({
        title: "Download Failed",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPdfLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-yellow-600" />
            Contract Analysis (Static Demo)
          </CardTitle>
          <CardDescription>
            This is a static demo version. Enter your name and email to see a sample analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
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

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Upload Contract PDF (Demo Only)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload your contract PDF (demo only)</p>
                  <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="pdf-upload" />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("pdf-upload")?.click()}
                  >
                    {file ? `Selected: ${file.name}` : "Choose PDF File"}
                  </Button>
                </div>
              </div>

              <div className="text-center text-sm text-gray-500">or</div>

              <div className="space-y-2">
                <Label htmlFor="contractText">Contract Text (Demo Only)</Label>
                <Textarea
                  id="contractText"
                  value={contractText}
                  onChange={(e) => setContractText(e.target.value)}
                  placeholder="Paste contract text here (demo only)..."
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-yellow-600 hover:bg-yellow-700">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading Demo...
                </>
              ) : (
                "Show Demo Analysis"
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
                  onClick={handleDownloadPDF}
                  disabled={isPdfLoading}
                  variant="outline"
                  size="sm"
                  className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                >
                  {isPdfLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => alert("Email is disabled in demo mode")}
                  variant="outline"
                  size="sm"
                  className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(result.analysis)
                    toast({
                      title: "Copied to Clipboard",
                      description: "Demo analysis has been copied to clipboard.",
                    })
                  }}
                  variant="outline"
                  size="sm"
                  className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardTitle>
            <CardDescription>Demo analysis for {result.propertyAddress}</CardDescription>
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
  )
}
