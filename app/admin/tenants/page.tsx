"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getAllTenants, getTenantConfig } from "@/lib/tenant-config"
import { Label } from "@/components/ui/label"

export default function TenantsAdminPage() {
  const [currentTenant, setCurrentTenant] = useState(getTenantConfig())
  const [previewTenant, setPreviewTenant] = useState("")
  const tenants = getAllTenants()

  const handlePreviewTenant = (tenantId: string) => {
    localStorage.setItem("preview-tenant", tenantId)
    window.location.reload()
  }

  const clearPreview = () => {
    localStorage.removeItem("preview-tenant")
    window.location.reload()
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tenant Management</h1>
        <Badge variant="outline">Current: {currentTenant.name}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Configuration</CardTitle>
          <CardDescription>Active tenant configuration details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tenant ID</Label>
              <p className="font-mono text-sm">{currentTenant.id}</p>
            </div>
            <div>
              <Label>Name</Label>
              <p>{currentTenant.name}</p>
            </div>
            <div>
              <Label>Domains</Label>
              <div className="flex flex-wrap gap-1">
                {currentTenant.domain.map((domain) => (
                  <Badge key={domain} variant="secondary" className="text-xs">
                    {domain}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label>Auth Provider</Label>
              <p>{currentTenant.auth.provider}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Tenants</CardTitle>
          <CardDescription>Switch between tenant configurations for testing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {tenants.map((tenant) => (
              <div key={tenant.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{tenant.name}</h3>
                  <p className="text-sm text-muted-foreground">ID: {tenant.id}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tenant.domains.map((domain) => (
                      <Badge key={domain} variant="outline" className="text-xs">
                        {domain}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handlePreviewTenant(tenant.id)}>
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => window.open(`/?tenant=${tenant.id}`, "_blank")}>
                    Open
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" onClick={clearPreview}>
              Clear Preview Mode
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Domain Setup Instructions</CardTitle>
          <CardDescription>How to configure custom domains for each tenant</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">1. DNS Configuration</h4>
            <p className="text-sm text-muted-foreground">
              Point your custom domains to your hosting provider (Vercel, Netlify, etc.)
            </p>
            <div className="bg-muted p-3 rounded font-mono text-sm">CNAME: your-domain.com → your-app.vercel.app</div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">2. Hosting Configuration</h4>
            <p className="text-sm text-muted-foreground">Add domains to your hosting platform's domain settings</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">3. SSL Certificates</h4>
            <p className="text-sm text-muted-foreground">
              Most hosting providers automatically provision SSL certificates for custom domains
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
