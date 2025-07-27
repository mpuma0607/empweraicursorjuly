"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Loader2, AlertCircle } from "lucide-react"

export default function AgentDirectoryPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCommunityBox = () => {
      try {
        // Create and execute the CommunityBox bootstrap script
        const xhr = new XMLHttpRequest()
        xhr.open("POST", "https://cfapi.communitybox.co/bootstrap/revision", true)

        xhr.onload = () => {
          if (xhr.readyState === 4 && xhr.status === 200) {
            try {
              const returnObj = JSON.parse(xhr.responseText)
              if (returnObj.hasOwnProperty("err")) {
                console.error("CommunityBox Error:", returnObj.err)
                setError("Failed to load agent directory. Please try again later.")
                setIsLoading(false)
              } else {
                const r = returnObj.revision
                const script = document.createElement("script")
                script.src = `https://dashboard.communitybox.co/embed/${r}/cbebloader-${r}.js`
                script.onload = () => {
                  setIsLoading(false)
                }
                script.onerror = () => {
                  setError("Failed to load agent directory script.")
                  setIsLoading(false)
                }
                document.head.appendChild(script)
              }
            } catch (parseError) {
              console.error("Error parsing CommunityBox response:", parseError)
              setError("Failed to initialize agent directory.")
              setIsLoading(false)
            }
          } else {
            setError("Failed to connect to agent directory service.")
            setIsLoading(false)
          }
        }

        xhr.onerror = () => {
          setError("Network error while loading agent directory.")
          setIsLoading(false)
        }

        xhr.send("f8f0cb28-5e59-4cd2-91e5-29bc474bc78e")
      } catch (error) {
        console.error("Error initializing CommunityBox:", error)
        setError("Failed to initialize agent directory.")
        setIsLoading(false)
      }
    }

    // Load the CommunityBox script
    loadCommunityBox()

    // Cleanup function
    return () => {
      // Remove any CommunityBox scripts on unmount
      const scripts = document.querySelectorAll('script[src*="communitybox"]')
      scripts.forEach((script) => script.remove())
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agent Directory</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with fellow real estate professionals in your network. Browse profiles, send messages, and build
            valuable relationships.
          </p>
        </div>

        {/* Directory Content */}
        <Card className="max-w-6xl mx-auto border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Network Directory</CardTitle>
            <CardDescription>Find and connect with other agents in your professional network</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
                  <p className="text-gray-600">Loading agent directory...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
                  <p className="text-red-600 mb-2">Error Loading Directory</p>
                  <p className="text-gray-600 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* CommunityBox Embed Container */}
            <div className="min-h-[600px] w-full">
              <div id="communitybox-target" box="6bdb3884-cffe-43f5-bbca-d38f5aa62029" className="w-full h-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
