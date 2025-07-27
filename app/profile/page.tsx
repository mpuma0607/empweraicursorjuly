"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"

export default function ProfilePage() {
  useEffect(() => {
    // Apply styles to make the embed more scrollable and accessible
    const applyStyles = () => {
      const style = document.createElement("style")
      style.textContent = `
        /* MemberSpace embed overrides for better scrollability */
        .ms-widget-container,
        .ms-widget-container iframe,
        #ms-widget-container,
        #ms-widget-container iframe {
          min-height: calc(100vh - 120px) !important;
          height: calc(100vh - 120px) !important;
          max-height: none !important;
          overflow: auto !important;
          border: none !important;
        }
        
        /* Force scrollable content */
        .ms-widget-embed,
        .ms-widget-embed * {
          overflow: visible !important;
          max-height: none !important;
        }
        
        /* Ensure form elements are visible */
        .ms-widget-container form,
        .ms-widget-container .form-group,
        .ms-widget-container .btn,
        .ms-widget-container button {
          position: relative !important;
          z-index: 1 !important;
          overflow: visible !important;
        }
        
        /* Make sure save buttons are accessible */
        .ms-widget-container .btn-primary,
        .ms-widget-container button[type="submit"] {
          margin-bottom: 20px !important;
          padding: 10px 20px !important;
        }
      `
      document.head.appendChild(style)
    }

    // Apply styles immediately and after delays to catch dynamic content
    applyStyles()
    setTimeout(applyStyles, 1000)
    setTimeout(applyStyles, 3000)
    setTimeout(applyStyles, 5000)

    return () => {
      // Cleanup styles on unmount
      const styles = document.querySelectorAll("style")
      styles.forEach((style) => {
        if (style.textContent?.includes("ms-widget-container")) {
          style.remove()
        }
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        {/* Profile Embed */}
        <Card className="max-w-6xl mx-auto border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Account Settings</CardTitle>
            <CardDescription>Update your profile information and account preferences</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[calc(100vh-200px)] min-h-[600px] overflow-auto">
              <div
                dangerouslySetInnerHTML={{
                  __html: '[ms-widget-embed path="/member/sign_in"]',
                }}
                className="w-full h-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
