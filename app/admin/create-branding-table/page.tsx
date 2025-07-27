"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreateBrandingTablePage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const createTable = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/create-branding-table", {
        method: "POST",
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, error: "Failed to create table" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Branding Table</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={createTable} disabled={loading}>
            {loading ? "Creating Table..." : "Create user_branding_profiles Table"}
          </Button>

          {result && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
