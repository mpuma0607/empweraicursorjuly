"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Send, Copy, Download, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function RealRecruitPage() {
  const [formData, setFormData] = useState({
    agentName: "",
    agentLevel: "",
    scriptType: "",
    tonality: "",
    context: "",
    customInstructions: ""
  })
  const [generatedScript, setGeneratedScript] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const scriptTypes = [
    { value: "first-outreach", label: "First Outreach" },
    { value: "follow-up", label: "Follow-up" },
    { value: "agent-referral", label: "Agent Referral" },
    { value: "recruiting-call", label: "Recruiting Call" },
    { value: "welcome-message", label: "Welcome Message" },
    { value: "check-in", label: "Check-in" }
  ]

  const agentLevels = [
    { value: "new-agent", label: "New Agent (0-6 months)" },
    { value: "developing-agent", label: "Developing Agent (6-18 months)" },
    { value: "established-agent", label: "Established Agent (1-3 years)" },
    { value: "top-agent", label: "Top Agent (3+ years)" },
    { value: "team-leader", label: "Team Leader" },
    { value: "broker", label: "Broker" }
  ]

  const tonalities = [
    { value: "professional", label: "Professional" },
    { value: "casual", label: "Casual" },
    { value: "motivational", label: "Motivational" },
    { value: "direct", label: "Direct" },
    { value: "friendly", label: "Friendly" },
    { value: "authoritative", label: "Authoritative" }
  ]

  const handleGenerate = async () => {
    if (!formData.agentName || !formData.scriptType || !formData.tonality) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/leadership-hub/realrecruit/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to generate script')
      }

      const data = await response.json()
      setGeneratedScript(data.script)
    } catch (error) {
      console.error('Error generating script:', error)
      toast({
        title: "Error",
        description: "Failed to generate script. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedScript)
    toast({
      title: "Copied!",
      description: "Script copied to clipboard.",
    })
  }

  const handleDownload = () => {
    const blob = new Blob([generatedScript], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `recruiting-script-${formData.scriptType}-${formData.agentName}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
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
              <FileText className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">RealRecruit</h1>
            </div>
            <p className="text-xl text-gray-600">Generate personalized recruiting scripts for your team</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Script Generation Form */}
            <Card>
              <CardHeader>
                <CardTitle>Script Generator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="agentName">Agent Name *</Label>
                    <Input
                      id="agentName"
                      value={formData.agentName}
                      onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                      placeholder="Enter agent name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="agentLevel">Agent Level *</Label>
                    <Select value={formData.agentLevel} onValueChange={(value) => setFormData({ ...formData, agentLevel: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select agent level" />
                      </SelectTrigger>
                      <SelectContent>
                        {agentLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="scriptType">Script Type *</Label>
                    <Select value={formData.scriptType} onValueChange={(value) => setFormData({ ...formData, scriptType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select script type" />
                      </SelectTrigger>
                      <SelectContent>
                        {scriptTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tonality">Tonality *</Label>
                    <Select value={formData.tonality} onValueChange={(value) => setFormData({ ...formData, tonality: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tonality" />
                      </SelectTrigger>
                      <SelectContent>
                        {tonalities.map((tone) => (
                          <SelectItem key={tone.value} value={tone.value}>
                            {tone.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="context">Context/Scenario</Label>
                  <Textarea
                    id="context"
                    value={formData.context}
                    onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                    placeholder="Describe the specific situation or context for this script..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="customInstructions">Custom Instructions</Label>
                  <Textarea
                    id="customInstructions"
                    value={formData.customInstructions}
                    onChange={(e) => setFormData({ ...formData, customInstructions: e.target.value })}
                    placeholder="Any specific instructions or requirements for this script..."
                    rows={2}
                  />
                </div>

                <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
                  {isGenerating ? "Generating..." : "Generate Script"}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Script */}
            <Card>
              <CardHeader>
                <CardTitle>Generated Script</CardTitle>
              </CardHeader>
              <CardContent>
                {generatedScript ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700">{generatedScript}</pre>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleCopy} variant="outline" size="sm">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button onClick={handleDownload} variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Generate a script to see it here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
