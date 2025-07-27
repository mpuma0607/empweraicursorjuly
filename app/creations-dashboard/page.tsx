"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Download, FileText, Calendar, Palette } from "lucide-react"
import { useMemberSpaceUser } from "@/hooks/use-memberspace-user"

interface UserCreation {
  id: string
  tool_type: string
  title: string
  content: string
  created_at: string
  form_data: any
  metadata: any
}

export default function CreationsDashboardPage() {
  const { user, isLoggedIn } = useMemberSpaceUser()
  const [creations, setCreations] = useState<UserCreation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isLoggedIn && user?.email) {
      fetchUserCreations()
    } else {
      setIsLoading(false)
    }
  }, [isLoggedIn, user])

  const fetchUserCreations = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/user-creations?email=${encodeURIComponent(user?.email || "")}`)

      if (!response.ok) {
        throw new Error("Failed to fetch creations")
      }

      const data = await response.json()
      setCreations(data.creations || [])
    } catch (error) {
      console.error("Error fetching user creations:", error)
      setError("Failed to load your creations. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const downloadCreation = async (creation: UserCreation) => {
    try {
      const response = await fetch("/api/generate-creation-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: creation.title,
          content: creation.content,
          toolType: creation.tool_type,
          createdAt: creation.created_at,
          metadata: creation.metadata,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate PDF")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `${creation.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading creation:", error)
      alert("Failed to download creation. Please try again.")
    }
  }

  const getToolIcon = (toolType: string) => {
    switch (toolType) {
      case "ideahub-ai":
        return <Palette className="h-4 w-4" />
      case "scriptit-ai":
        return <FileText className="h-4 w-4" />
      case "listit-ai":
        return <FileText className="h-4 w-4" />
      case "realbio":
        return <FileText className="h-4 w-4" />
      case "action-ai":
        return <FileText className="h-4 w-4" />
      case "bizplan-ai":
        return <FileText className="h-4 w-4" />
      case "goalscreen-ai":
        return <FileText className="h-4 w-4" />
      case "quickcma-ai":
        return <FileText className="h-4 w-4" />
      case "whos-who-ai":
        return <FileText className="h-4 w-4" />
      case "propbot-ai":
        return <FileText className="h-4 w-4" />
      case "realcoach-ai":
        return <FileText className="h-4 w-4" />
      case "realdeal-ai":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getToolName = (toolType: string) => {
    switch (toolType) {
      case "ideahub-ai":
        return "IdeaHub AI"
      case "scriptit-ai":
        return "ScriptIt AI"
      case "listit-ai":
        return "ListIt AI"
      case "realbio":
        return "RealBio"
      case "action-ai":
        return "Action AI"
      case "bizplan-ai":
        return "BizPlan AI"
      case "goalscreen-ai":
        return "GoalScreen AI"
      case "quickcma-ai":
        return "QuickCMA AI"
      case "whos-who-ai":
        return "WhosWho AI"
      case "propbot-ai":
        return "PropBot AI"
      case "realcoach-ai":
        return "RealCoach AI"
      case "realdeal-ai":
        return "RealDeal AI"
      default:
        return toolType.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const groupCreationsByTool = (creations: UserCreation[]) => {
    return creations.reduce(
      (acc, creation) => {
        if (!acc[creation.tool_type]) {
          acc[creation.tool_type] = []
        }
        acc[creation.tool_type].push(creation)
        return acc
      },
      {} as Record<string, UserCreation[]>,
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please log in to view your saved creations.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your creations...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchUserCreations} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const groupedCreations = groupCreationsByTool(creations)
  const toolTypes = Object.keys(groupedCreations)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Creations</h1>
          <p className="text-gray-600">
            View and download all your saved AI-generated content ({creations.length} total)
          </p>
        </div>

        {creations.length === 0 ? (
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <CardTitle>No Creations Yet</CardTitle>
              <CardDescription>
                Start using our AI tools to create content, and your saved creations will appear here.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue={toolTypes[0]} className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 mb-8">
                {toolTypes.map((toolType) => (
                  <TabsTrigger key={toolType} value={toolType} className="flex items-center gap-2">
                    {getToolIcon(toolType)}
                    <span className="hidden sm:inline">{getToolName(toolType)}</span>
                    <Badge variant="secondary" className="ml-1">
                      {groupedCreations[toolType].length}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>

              {toolTypes.map((toolType) => (
                <TabsContent key={toolType} value={toolType}>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {groupedCreations[toolType]
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .map((creation) => (
                        <Card key={creation.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                {getToolIcon(creation.tool_type)}
                                <Badge variant="outline">{getToolName(creation.tool_type)}</Badge>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadCreation(creation)}
                                className="shrink-0"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                            <CardTitle className="text-lg line-clamp-2">{creation.title}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(creation.created_at)}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600 line-clamp-3 mb-4">{creation.content}</p>
                            {creation.metadata && (
                              <div className="flex flex-wrap gap-2">
                                {creation.metadata.contentType && (
                                  <Badge variant="secondary">{creation.metadata.contentType}</Badge>
                                )}
                                {creation.metadata.language && (
                                  <Badge variant="secondary">{creation.metadata.language}</Badge>
                                )}
                                {creation.metadata.hasImage && <Badge variant="secondary">Has Image</Badge>}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}
