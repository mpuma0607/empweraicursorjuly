"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestSSOPage() {
  const [debugResult, setDebugResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runDebugTest = async () => {
    setLoading(true)
    setDebugResult(null)

    try {
      console.log("Starting debug test...")
      const response = await fetch("/api/debug-sso")
      console.log("Response status:", response.status)

      const result = await response.json()
      console.log("Debug result:", result)

      setDebugResult(result)
    } catch (error) {
      console.error("Debug test error:", error)
      setDebugResult({
        error: "Failed to run debug test",
        details: String(error),
        fetchError: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const testBasicAPI = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/community-sso?username=test@example.com&email=test@example.com&name=Test User")
      const result = await response.json()
      setDebugResult(result)
    } catch (error) {
      setDebugResult({ error: "API test failed", details: String(error) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>SSO Debug Testing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Buttons */}
          <div className="flex gap-4">
            <Button onClick={runDebugTest} disabled={loading} className="flex-1">
              {loading ? "Running Debug..." : "Run Debug Test"}
            </Button>
            <Button onClick={testBasicAPI} disabled={loading} variant="outline" className="flex-1">
              {loading ? "Testing API..." : "Test Basic API"}
            </Button>
          </div>

          {/* Environment Check */}
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold mb-2">Environment Check:</h3>
            <p className="text-sm">
              API Key configured: {process.env.WEBSITE_TOOLBOX_SSO_API_KEY ? "✅ Yes" : "❌ No"}
            </p>
            <p className="text-sm">Forum Domain: forum.thenextlevelu.com</p>
          </div>

          {/* Results */}
          {debugResult && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">
                Debug Results:
                {debugResult.success ? (
                  <span className="text-green-600 ml-2">✅ Success</span>
                ) : (
                  <span className="text-red-600 ml-2">❌ Failed</span>
                )}
              </h3>

              {debugResult.error && (
                <div className="bg-red-50 border border-red-200 p-4 rounded mb-4">
                  <h4 className="font-semibold text-red-800">Error:</h4>
                  <p className="text-red-700">{debugResult.error}</p>
                  {debugResult.websiteToolboxError && (
                    <p className="text-red-600 mt-2">Website Toolbox: {debugResult.websiteToolboxError}</p>
                  )}
                </div>
              )}

              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96 whitespace-pre-wrap">
                {JSON.stringify(debugResult, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
