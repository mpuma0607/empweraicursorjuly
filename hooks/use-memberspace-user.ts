"use client"

import { useState, useEffect } from "react"

interface MemberInfo {
  id: number
  name: string
  firstName: string
  lastName: string
  email: string
  profileImageUrl: string
  memberships: Array<{
    id: number
    planId: number
    publicPlanId: string
    name: string
    type: string
    createdAt: string
    status: string
    cancelsOn?: string
    billingPeriodEnd?: string
    expiresOn?: string
    paymentFailure: boolean
    welcomeUrl: string
    contentUrl: string
  }>
  customSignupFields: Array<{
    id: number
    type: string
    required: boolean
    value: any
    options?: Array<{ label: string; value: string }>
  }>
}

interface MemberSpaceData {
  isLoggedIn: boolean
  memberInfo?: MemberInfo
}

declare global {
  interface Window {
    MemberSpace?: {
      ready: boolean
      getMemberInfo(): MemberSpaceData
    }
  }
}

export function useMemberSpaceUser() {
  const [user, setUser] = useState<MemberInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkMemberSpace = () => {
      try {
        if (window.MemberSpace && window.MemberSpace.ready) {
          const data = window.MemberSpace.getMemberInfo()
          if (data.isLoggedIn && data.memberInfo) {
            setUser(data.memberInfo)
          } else {
            setUser(null)
          }
          setLoading(false)
        } else {
          // MemberSpace not ready yet, check again in 100ms
          setTimeout(checkMemberSpace, 100)
        }
      } catch (err) {
        console.error("Error checking MemberSpace:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
        setLoading(false)
      }
    }

    // Initial check
    checkMemberSpace()

    // Event listeners
    const handleMemberInfo = ({ detail }: any) => {
      const { memberInfo } = detail
      setUser(memberInfo)
      setLoading(false)
    }

    const handleLogout = () => {
      setUser(null)
      setLoading(false)
    }

    document.addEventListener("MemberSpace.member.info", handleMemberInfo)
    document.addEventListener("MemberSpace.member.logout", handleLogout)

    // Cleanup
    return () => {
      document.removeEventListener("MemberSpace.member.info", handleMemberInfo)
      document.removeEventListener("MemberSpace.member.logout", handleLogout)
    }
  }, [])

  return {
    user,
    loading,
    error,
    isLoggedIn: !!user,
  }
}
