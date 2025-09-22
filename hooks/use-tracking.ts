"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useMemberSpaceUser } from "./useMemberSpaceUser"

export function useTracking() {
  const pathname = usePathname()
  const { user } = useMemberSpaceUser()

  useEffect(() => {
    // Generate a session ID if it doesn't exist
    let sessionId = localStorage.getItem("session_id")
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36)
      localStorage.setItem("session_id", sessionId)
    }

    // Track page view
    const trackPageView = async () => {
      try {
        const response = await fetch("/api/track/page-view", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            pagePath: pathname,
            pageTitle: document.title,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            ipAddress: null, // Will be extracted server-side
            userEmail: user?.email || null,
          }),
        })

        const result = await response.json()
        console.log("Page view tracked:", result)
      } catch (error) {
        console.error("Failed to track page view:", error)
      }
    }

    trackPageView()
  }, [pathname, user?.email])

  const trackEvent = async (eventType: string, eventData?: any) => {
    try {
      let sessionId = localStorage.getItem("session_id")
      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36)
        localStorage.setItem("session_id", sessionId)
      }

      const response = await fetch("/api/track/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          eventType,
          eventData,
        }),
      })

      const result = await response.json()
      console.log("Event tracked:", result)
    } catch (error) {
      console.error("Failed to track event:", error)
    }
  }

  return { trackEvent }
}
