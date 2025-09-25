"use client"

import { useState } from "react"
import { useMemberSpaceUser } from "@/hooks/use-memberspace-user"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Upload, FileText, Trash2, Search, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QAPair {
  id: string
  question: string
  answer: string
  category?: string
  created_at: string
}

export default function KnowledgeBasePage() {
  const { user } = useMemberSpaceUser()
  const [qaPairs, setQaPairs] = useState<QAPair[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newQA, setNewQA] = useState({ question: "", answer: "", category: "" })
  const { toast } = useToast()

  // Check if user is admin (you can customize this logic)
  if (!user?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Access Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please log in to access the knowledge base.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file.",
        variant: "destructive"
      })
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userEmail', user.email)

      const response = await fetch('/api/knowledge-base/upload-csv', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('CSV upload error:', errorData)
        throw new Error(errorData.error || 'Failed to upload CSV')
      }

      const data = await response.json()
      console.log('CSV upload success:', data)
      setQaPairs(data.qaPairs)
      
      toast({
        title: "CSV uploaded successfully",
        description: `Processed ${data.qaPairs.length} Q&A pairs.`,
      })
    } catch (error) {
      console.error('Error uploading CSV:', error)
      toast({
        title: "Upload failed",
        description: "Failed to process CSV file.",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleAddQA = async () => {
    if (!newQA.question.trim() || !newQA.answer.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both question and answer.",
        variant: "destructive"
      })
      return
    }

    try {
      const response = await fetch('/api/knowledge-base/add-qa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: newQA.question,
          answer: newQA.answer,
          category: newQA.category,
          userEmail: user.email
        })
      })

      if (!response.ok) {
        throw new Error('Failed to add Q&A')
      }

      const data = await response.json()
      setQaPairs(prev => [data.qaPair, ...prev])
      setNewQA({ question: "", answer: "", category: "" })
      setShowAddForm(false)
      
      toast({
        title: "Q&A added successfully",
        description: "New question and answer pair has been added.",
      })
    } catch (error) {
      console.error('Error adding Q&A:', error)
      toast({
        title: "Failed to add Q&A",
        description: "Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleDeleteQA = async (id: string) => {
    try {
      const response = await fetch(`/api/knowledge-base/delete-qa/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: user.email })
      })

      if (!response.ok) {
        throw new Error('Failed to delete Q&A')
      }

      setQaPairs(prev => prev.filter(qa => qa.id !== id))
      
      toast({
        title: "Q&A deleted",
        description: "Question and answer pair has been removed.",
      })
    } catch (error) {
      console.error('Error deleting Q&A:', error)
      toast({
        title: "Failed to delete Q&A",
        description: "Please try again.",
        variant: "destructive"
      })
    }
  }

  const filteredQAs = qaPairs.filter(qa => 
    qa.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    qa.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (qa.category && qa.category.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Knowledge Base</h1>
            <p className="text-gray-600">Manage Q&A data for the AI assistant</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Section */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload CSV
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="csv-upload">CSV File</Label>
                    <Input
                      id="csv-upload"
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Expected format: question, answer, category (optional)
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button
                      onClick={() => setShowAddForm(!showAddForm)}
                      variant="outline"
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Q&A Manually
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Add Q&A Form */}
              {showAddForm && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-lg">Add Q&A</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="question">Question</Label>
                      <Textarea
                        id="question"
                        value={newQA.question}
                        onChange={(e) => setNewQA(prev => ({ ...prev, question: e.target.value }))}
                        placeholder="Enter the question..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="answer">Answer</Label>
                      <Textarea
                        id="answer"
                        value={newQA.answer}
                        onChange={(e) => setNewQA(prev => ({ ...prev, answer: e.target.value }))}
                        placeholder="Enter the answer..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category (Optional)</Label>
                      <Input
                        id="category"
                        value={newQA.category}
                        onChange={(e) => setNewQA(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g., Platform, Features, Support"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddQA} className="flex-1">
                        Add Q&A
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowAddForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Q&A List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Q&A Pairs ({filteredQAs.length})
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search Q&A..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredQAs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {searchQuery ? 'No Q&A pairs match your search.' : 'No Q&A pairs found. Upload a CSV or add manually.'}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredQAs.map((qa) => (
                        <div key={qa.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 mb-1">
                                {qa.question}
                              </h3>
                              <p className="text-gray-600 text-sm mb-2">
                                {qa.answer}
                              </p>
                              <div className="flex items-center gap-2">
                                {qa.category && (
                                  <Badge variant="secondary">{qa.category}</Badge>
                                )}
                                <span className="text-xs text-gray-400">
                                  {new Date(qa.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteQA(qa.id)}
                              className="text-red-600 hover:text-red-700"
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
          </div>
        </div>
      </div>
    </div>
  )
}
