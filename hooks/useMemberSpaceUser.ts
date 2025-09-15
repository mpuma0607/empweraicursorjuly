"use client"

import { useState, useEffect } from "react"
import { useTenant } from "@/contexts/tenant-context"

interface MemberSpaceUser {
  id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  customFields?: Record<string, any>
}

export function useMemberSpaceUser() {
  const [user, setUser] = useState<MemberSpaceUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use the tenant context properly with error handling
  const { config: tenantConfig, isLoading: tenantLoading } = useTenant()

  useEffect(() => {
    // Wait for tenant config to load
    if (tenantLoading) {
      console.log("🔄 Tenant config still loading...")
      return
    }

    // Check if tenantConfig exists and has the required properties
    if (!tenantConfig) {
      console.log("❌ No tenant config available")
      setLoading(false)
      return
    }

    console.log("🏢 Tenant config loaded:", tenantConfig?.auth?.provider)

    // Only load MemberSpace for tenants configured to use it
    if (tenantConfig.auth?.provider !== "memberspace") {
      console.log("❌ Not using MemberSpace auth, skipping user load")
      setLoading(false)
      return
    }

    let timeoutId: NodeJS.Timeout

    const loadMemberSpace = () => {
      try {
        console.log("🔍 Checking for MemberSpace...")
        // Check if MemberSpace is available
        if (typeof window !== "undefined" && (window as any).MemberSpace) {
          const memberspace = (window as any).MemberSpace
          console.log("✅ MemberSpace found, checking tenant...")

          // Check if this is the Beggins tenant (century21-beggins) - with null safety
          const isBegginsTenant = tenantConfig?.id === "century21-beggins"
          console.log(`🏢 Is Beggins tenant: ${isBegginsTenant}`)

          if (isBegginsTenant) {
            // For Beggins tenant, use getMemberInfo() method (Google OAuth flow)
            console.log("📞 Using Beggins-specific getMemberInfo() method...")
            console.log("🔍 Available MemberSpace methods:", Object.keys(memberspace))
            console.log("🔍 MemberSpace object:", memberspace)

            if (typeof memberspace.getMemberInfo === "function") {
              memberspace
                .getMemberInfo()
                .then((memberInfo: any) => {
                  console.log("👤 Beggins MemberSpace member info:", memberInfo)

                  if (memberInfo && memberInfo.id) {
                    const userData = {
                      id: memberInfo.id,
                      email: memberInfo.email || memberInfo.emailAddress || "",
                      name:
                        memberInfo.name ||
                        memberInfo.displayName ||
                        `${memberInfo.firstName || ""} ${memberInfo.lastName || ""}`.trim(),
                      firstName: memberInfo.firstName || memberInfo.first_name,
                      lastName: memberInfo.lastName || memberInfo.last_name,
                      customFields: memberInfo.customFields || memberInfo.custom_fields,
                    }
                    console.log("✅ Setting Beggins user data:", userData)
                    setUser(userData)
                  } else {
                    console.log("❌ No Beggins member info found or missing ID")
                  }
                  setLoading(false)
                })
                .catch((err: any) => {
                  console.error("❌ Error getting Beggins member info:", err)
                  setError("Failed to get member info")
                  setLoading(false)
                })
            } else {
              console.log("❌ getMemberInfo method not available for Beggins")
              setLoading(false)
            }
          } else {
            // For other tenants (like Empower AI), use the original working method
            console.log("📞 Using standard MemberSpace getCurrentMember() method...")

            // Try the original method that works for Empower AI
            let currentUser = null

            if (typeof memberspace.getCurrentMember === "function") {
              currentUser = memberspace.getCurrentMember()
            } else if (typeof memberspace.getMember === "function") {
              currentUser = memberspace.getMember()
            } else if (typeof memberspace.getUser === "function") {
              currentUser = memberspace.getUser()
            } else if (typeof memberspace.getCurrentUser === "function") {
              currentUser = memberspace.getCurrentUser()
            } else if (memberspace.member) {
              currentUser = memberspace.member
            } else if (memberspace.user) {
              currentUser = memberspace.user
            }

            console.log("👤 Standard MemberSpace user data:", currentUser)

            if (currentUser) {
              const userData = {
                id: currentUser.id || currentUser.memberId || "unknown",
                email: currentUser.email || currentUser.emailAddress || "",
                name:
                  currentUser.name ||
                  currentUser.displayName ||
                  `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim(),
                firstName: currentUser.firstName || currentUser.first_name,
                lastName: currentUser.lastName || currentUser.last_name,
                customFields: currentUser.customFields || currentUser.custom_fields,
              }
              console.log("✅ Setting standard user data:", userData)
              setUser(userData)
            } else {
              console.log("❌ No current member found")
            }

            setLoading(false)
          }
        } else {
          console.log("⏳ MemberSpace not ready yet, retrying...")
          // MemberSpace not loaded yet, try again
          timeoutId = setTimeout(loadMemberSpace, 500)
        }
      } catch (err) {
        console.error("❌ Error loading MemberSpace user:", err)
        setError("Failed to load user data")
        setLoading(false)
      }
    }

    // Start loading with a timeout to prevent infinite waiting
    const maxWaitTime = setTimeout(() => {
      console.log("⏰ MemberSpace load timeout reached")
      setLoading(false)
      setError("MemberSpace took too long to load")
    }, 10000) // 10 seconds max wait

    loadMemberSpace()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (maxWaitTime) clearTimeout(maxWaitTime)
    }
  }, [tenantConfig, tenantLoading])

  return { user, loading, error }
}
