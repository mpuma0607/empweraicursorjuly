"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getTenantConfig } from "@/lib/tenant-config"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function DomainTestPage() {
  const [currentTenant, setCurrentTenant] = useState<any>(null)
  const [hostname, setHostname] = useState<string>("")
  const [urlParams, setUrlParams] = useState<string>("")
  const [localStorage, setLocalStorage] = useState<string>("")
  const [detectionMethod, setDetectionMethod] = useState<string>("")

  useEffect(() => {
    const config = getTenantConfig()
    setCurrentTenant(config)
    setHostname(window.location.hostname)
    setUrlParams(new URLSearchParams(window.location.search).get("tenant") || "none")
    setLocalStorage(window.localStorage.getItem("preview-tenant") || "none")

    // Determine detection method
    if (window.localStorage.getItem("preview-tenant")) {
      setDetectionMethod("localStorage")
    } else if (new URLSearchParams(window.location.search).get("tenant")) {
      setDetectionMethod("URL parameter")
    } else if (
      window.location.hostname.includes("beggins") ||
      window.location.hostname.includes("brokerage") ||
      window.location.hostname.includes("international")
    ) {
      setDetectionMethod("domain detection")
    } else {
      setDetectionMethod("default fallback")
    }
  }, [])

  const testDomainDetection = () => {
    window.location.reload()
  }

  const clearOverrides = () => {
    localStorage.removeItem("preview-tenant")
    const url = new URL(window.location.href)
    url.searchParams.delete("tenant")
    window.location.href = url.toString()
  }

  const testSubdomains = [
    { subdomain: "beggins.thenextlevelu.com", tenant: "Beggins University", id: "century21-beggins" },
    { subdomain: "brokerage.thenextlevelu.com", tenant: "Private Brokerage", id: "brokerage-private" },
    { subdomain: "international.thenextlevelu.com", tenant: "International Platform", id: "international" },
  ]

  if (!currentTenant) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Phase 2: Domain Detection Testing</h1>
        <Badge variant="outline">Subdomain Testing</Badge>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Phase 2 Testing:</strong> Set up subdomains in your DNS to point to this application, then test domain
          detection. All existing functionality (URL params, localStorage, tenant switcher) should continue working.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Detection Status</CardTitle>
            <CardDescription>Shows how the current tenant was detected</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Active Tenant:</span>
              <Badge variant="default">{currentTenant.name}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Tenant ID:</span>
              <code className="text-sm bg-muted px-2 py-1 rounded">{currentTenant.id}</code>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Current Domain:</span>
              <code className="text-sm bg-muted px-2 py-1 rounded">{hostname}</code>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Detection Method:</span>
              <Badge variant={detectionMethod === "domain detection" ? "default" : "secondary"}>
                {detectionMethod}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detection Methods Status</CardTitle>
            <CardDescription>Priority order of tenant detection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">1. LocalStorage Override:</span>
              <div className="flex items-center gap-2">
                {localStorage !== "none" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-400" />
                )}
                <code className="text-sm bg-muted px-2 py-1 rounded">{localStorage}</code>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">2. URL Parameter:</span>
              <div className="flex items-center gap-2">
                {urlParams !== "none" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-400" />
                )}
                <code className="text-sm bg-muted px-2 py-1 rounded">{urlParams}</code>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">3. Domain Detection:</span>
              <div className="flex items-center gap-2">
                {hostname.includes("beggins") ||
                hostname.includes("brokerage") ||
                hostname.includes("international") ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-400" />
                )}
                <Badge
                  variant={
                    hostname.includes("beggins") || hostname.includes("brokerage") || hostname.includes("international")
                      ? "default"
                      : "secondary"
                  }
                >
                  {hostname.includes("beggins") || hostname.includes("brokerage") || hostname.includes("international")
                    ? "Active"
                    : "Inactive"}
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">4. Default Fallback:</span>
              <div className="flex items-center gap-2">
                {detectionMethod === "default fallback" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-400" />
                )}
                <Badge variant={detectionMethod === "default fallback" ? "default" : "secondary"}>
                  {detectionMethod === "default fallback" ? "Active" : "Standby"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Phase 2: Test Subdomains</CardTitle>
          <CardDescription>Configure these subdomains in your DNS to test domain detection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {testSubdomains.map((test) => (
              <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">{test.tenant}</div>
                  <code className="text-sm text-muted-foreground">{test.subdomain}</code>
                </div>
                <div className="flex items-center gap-2">
                  {hostname === test.subdomain ? (
                    <Badge variant="default">Currently Active</Badge>
                  ) : (
                    <Badge variant="outline">Ready to Test</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">DNS Setup Instructions:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>In your DNS provider, create CNAME records for each subdomain</li>
              <li>Point each subdomain to your main domain (e.g., thenextlevelu.com)</li>
              <li>In your hosting provider (Vercel/Netlify), add each subdomain as a custom domain</li>
              <li>Test by visiting each subdomain - it should automatically load the correct tenant</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Actions</CardTitle>
          <CardDescription>Verify all detection methods work properly</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <Button onClick={testDomainDetection} variant="outline">
              Refresh & Test Detection
            </Button>
            <Button onClick={clearOverrides} variant="outline">
              Clear All Overrides
            </Button>
            <Button onClick={() => (window.location.href = "?tenant=century21-beggins")} variant="outline">
              Test URL Parameter
            </Button>
            <Button
              onClick={() => {
                localStorage.setItem("preview-tenant", "brokerage-private")
                window.location.reload()
              }}
              variant="outline"
            >
              Test LocalStorage Override
            </Button>
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Phase 2 Success Criteria:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Subdomains automatically load correct tenant (no URL params needed)</li>
                <li>URL parameters still override domain detection</li>
                <li>LocalStorage overrides still work</li>
                <li>Tenant switcher component still functions</li>
                <li>All existing functionality preserved</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
