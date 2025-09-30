"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, BarChart3, FileText, TrendingUp, Download, ArrowLeft, Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

interface Report {
  id: string
  name: string
  type: string
  uploadDate: string
  status: 'processing' | 'completed' | 'error'
  insights?: string
  summary?: string
  trends?: string[]
  keyMetrics?: { [key: string]: string }
}

export default function RealReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [customInstructions, setCustomInstructions] = useState("")
  const { toast } = useToast()

  const reportTypes = [
    "Financial Summary",
    "Commission Report", 
    "Agent Performance",
    "Market Analysis",
    "Expense Report",
    "Revenue Analysis",
    "Custom Analysis"
  ]

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validTypes = ['.csv']
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    
    if (!validTypes.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file. Excel support coming soon.",
        variant: "destructive"
      })
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('customInstructions', customInstructions)

      const response = await fetch('/api/leadership-hub/realreports/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload file')
      }

      const data = await response.json()
      const newReport: Report = {
        id: data.reportId,
        name: file.name,
        type: data.reportType || 'Financial Analysis',
        uploadDate: new Date().toISOString(),
        status: 'processing'
      }

      setReports([newReport, ...reports])
      setSelectedReport(newReport)
      
      toast({
        title: "File uploaded successfully",
        description: "Analysis in progress...",
      })

      // Start analysis
      await analyzeReport(newReport.id)

    } catch (error) {
      console.error('Error uploading file:', error)
      toast({
        title: "Upload failed",
        description: "Failed to process file.",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const analyzeReport = async (reportId: string) => {
    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/leadership-hub/realreports/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportId })
      })

      if (!response.ok) {
        throw new Error('Failed to analyze report')
      }

      const data = await response.json()
      
      // Update the report with analysis results
      setReports(prev => prev.map(report => 
        report.id === reportId 
          ? { 
              ...report, 
              status: 'completed',
              insights: data.insights,
              summary: data.summary,
              trends: data.trends,
              keyMetrics: data.keyMetrics
            }
          : report
      ))

      // Update selected report if it's the one being analyzed
      if (selectedReport?.id === reportId) {
        setSelectedReport(prev => prev ? {
          ...prev,
          status: 'completed',
          insights: data.insights,
          summary: data.summary,
          trends: data.trends,
          keyMetrics: data.keyMetrics
        } : null)
      }

      toast({
        title: "Analysis completed",
        description: "Your report has been analyzed successfully.",
      })

    } catch (error) {
      console.error('Error analyzing report:', error)
      setReports(prev => prev.map(report => 
        report.id === reportId 
          ? { ...report, status: 'error' }
          : report
      ))
      toast({
        title: "Analysis failed",
        description: "Failed to analyze the report.",
        variant: "destructive"
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDeleteReport = (reportId: string) => {
    setReports(prev => prev.filter(report => report.id !== reportId))
    if (selectedReport?.id === reportId) {
      setSelectedReport(null)
    }
    toast({
      title: "Report deleted",
      description: "Report has been removed.",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>
      case 'completed':
        return <Badge variant="default">Completed</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/leadership-hub">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Leadership Hub
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-8 h-8 text-purple-600" />
              <h1 className="text-4xl font-bold text-gray-900">RealReports</h1>
            </div>
            <p className="text-xl text-gray-600">Upload and analyze your financial reports with AI insights</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Section */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Report</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <Button asChild className="w-full">
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </span>
                      </Button>
                    </Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Supports CSV files (Excel support coming soon)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="customInstructions">Custom Instructions (Optional)</Label>
                    <Textarea
                      id="customInstructions"
                      value={customInstructions}
                      onChange={(e) => setCustomInstructions(e.target.value)}
                      placeholder="Any specific analysis requirements..."
                      rows={3}
                    />
                  </div>

                  {isUploading && (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">Uploading...</p>
                    </div>
                  )}

                  {isAnalyzing && (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">Analyzing...</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Reports List */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Recent Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  {reports.length === 0 ? (
                    <div className="text-center py-4">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm text-gray-500">No reports uploaded yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {reports.map((report) => (
                        <div
                          key={report.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedReport?.id === report.id ? 'bg-purple-50 border-purple-200' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedReport(report)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{report.name}</p>
                              <p className="text-xs text-gray-500">{report.type}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {getStatusBadge(report.status)}
                                <span className="text-xs text-gray-400">
                                  {new Date(report.uploadDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteReport(report.id)
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Report Analysis */}
            <div className="lg:col-span-2">
              {selectedReport ? (
                <div className="space-y-6">
                  {/* Report Header */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{selectedReport.name}</CardTitle>
                          <p className="text-sm text-gray-600">{selectedReport.type}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(selectedReport.status)}
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Analysis Results */}
                  {selectedReport.status === 'completed' && (
                    <div className="space-y-6">
                      {/* Key Metrics */}
                      {selectedReport.keyMetrics && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <TrendingUp className="w-5 h-5" />
                              Key Metrics
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {Object.entries(selectedReport.keyMetrics).map(([key, value]) => (
                                <div key={key} className="p-3 bg-gray-50 rounded-lg">
                                  <p className="text-sm font-medium text-gray-600">{key}</p>
                                  <p className="text-lg font-bold text-gray-900">{value}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Summary */}
                      {selectedReport.summary && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Executive Summary</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-700">{selectedReport.summary}</p>
                          </CardContent>
                        </Card>
                      )}

                      {/* Insights */}
                      {selectedReport.insights && (
                        <Card>
                          <CardHeader>
                            <CardTitle>AI Insights</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-700">{selectedReport.insights}</p>
                          </CardContent>
                        </Card>
                      )}

                      {/* Trends */}
                      {selectedReport.trends && selectedReport.trends.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Key Trends</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {selectedReport.trends.map((trend, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                                  <p className="text-gray-700">{trend}</p>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}

                  {selectedReport.status === 'processing' && (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Analyzing your report...</p>
                        <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                      </CardContent>
                    </Card>
                  )}

                  {selectedReport.status === 'error' && (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FileText className="w-6 h-6 text-red-600" />
                        </div>
                        <p className="text-gray-600">Analysis failed</p>
                        <p className="text-sm text-gray-500 mt-2">Please try uploading the file again</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">Select a report to view analysis</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
