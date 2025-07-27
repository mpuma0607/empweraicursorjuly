"use client"

import { useState, useEffect } from "react"
import { Network, AlertCircle, CheckCircle } from "lucide-react"
import { getCommunityAuthToken } from "@/lib/community-sso"

export default function NetworkingHubPage() {
  const [memberInfo, setMemberInfo] = useState<any>(null)
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [ssoStatus, setSsoStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [ssoError, setSsoError] = useState<string | null>(null)
  const [forumLoaded, setForumLoaded] = useState(false)

  useEffect(() => {
    console.log("=== NETWORKING HUB LOADED ===")

    // Load forum without SSO first
    loadForumScript()

    // Set up comprehensive MemberSpace detection
    setupMemberSpaceDetection()
  }, [])

  const setupMemberSpaceDetection = () => {
    console.log("Setting up MemberSpace detection...")

    // Listen for ALL possible MemberSpace events
    const memberSpaceEvents = [
      "MemberSpace.member.registration",
      "MemberSpace.member.login",
      "MemberSpace.member.info",
      "MemberSpace.member.loaded",
      "MemberSpace.member.updated",
      "MemberSpace.ready",
      "MemberSpace.loaded",
      "memberspace-ready",
      "memberspace-login",
      "memberspace-member-info",
    ]

    memberSpaceEvents.forEach((eventName) => {
      document.addEventListener(eventName, (e: any) => {
        console.log(`MemberSpace event received: ${eventName}`, e.detail)
        handleMemberSpaceEvent(eventName, e.detail)
      })

      window.addEventListener(eventName, (e: any) => {
        console.log(`MemberSpace window event received: ${eventName}`, e.detail)
        handleMemberSpaceEvent(eventName, e.detail)
      })
    })

    // Aggressive polling for MemberSpace
    let pollCount = 0
    const maxPolls = 60 // 60 seconds

    const pollForMemberSpace = () => {
      pollCount++
      console.log(`Polling for MemberSpace (${pollCount}/${maxPolls})`)

      try {
        // Check window.MemberSpace
        if ((window as any).MemberSpace) {
          const ms = (window as any).MemberSpace
          console.log("Found MemberSpace object", Object.keys(ms))

          // Try all possible ways to get member data
          if (ms.member) {
            console.log("Found ms.member", ms.member)
            if (ms.member.info) {
              console.log("Found member info via ms.member.info", ms.member.info)
              setMemberInfo(ms.member.info)
              handleSSO(ms.member.info)
              return true
            }
          }

          // Try getCurrentMember
          if (typeof ms.getCurrentMember === "function") {
            console.log("Trying getCurrentMember()")
            ms.getCurrentMember()
              .then((memberData: any) => {
                if (memberData) {
                  console.log("getCurrentMember returned data", memberData)
                  setMemberInfo(memberData)
                  handleSSO(memberData)
                }
              })
              .catch((e: any) => console.log("getCurrentMember failed", e))
          }

          // Try getMember
          if (typeof ms.getMember === "function") {
            console.log("Trying getMember()")
            try {
              const memberData = ms.getMember()
              if (memberData) {
                console.log("getMember returned data", memberData)
                setMemberInfo(memberData)
                handleSSO(memberData)
              }
            } catch (e) {
              console.log("getMember failed", e)
            }
          }

          // Check for member in different locations
          const possiblePaths = ["member", "currentMember", "user", "currentUser", "memberInfo", "userInfo"]

          possiblePaths.forEach((path) => {
            if (ms[path]) {
              console.log(`Found member data at ms.${path}`, ms[path])
              setMemberInfo(ms[path])
              handleSSO(ms[path])
            }
          })
        }

        // Check localStorage for member data
        try {
          const keys = Object.keys(localStorage)
          const memberKeys = keys.filter(
            (key) =>
              key.toLowerCase().includes("member") ||
              key.toLowerCase().includes("user") ||
              key.toLowerCase().includes("auth"),
          )

          if (memberKeys.length > 0) {
            console.log("Found potential member data in localStorage", memberKeys)
            memberKeys.forEach((key) => {
              try {
                const data = JSON.parse(localStorage.getItem(key) || "{}")
                if (data && (data.email || data.name || data.id)) {
                  console.log(`Found member data in localStorage.${key}`, data)
                  setMemberInfo(data)
                  handleSSO(data)
                }
              } catch (e) {
                // Not JSON, skip
              }
            })
          }
        } catch (e) {
          console.log("Error checking localStorage", e)
        }

        // Check sessionStorage
        try {
          const keys = Object.keys(sessionStorage)
          const memberKeys = keys.filter(
            (key) =>
              key.toLowerCase().includes("member") ||
              key.toLowerCase().includes("user") ||
              key.toLowerCase().includes("auth"),
          )

          if (memberKeys.length > 0) {
            console.log("Found potential member data in sessionStorage", memberKeys)
            memberKeys.forEach((key) => {
              try {
                const data = JSON.parse(sessionStorage.getItem(key) || "{}")
                if (data && (data.email || data.name || data.id)) {
                  console.log(`Found member data in sessionStorage.${key}`, data)
                  setMemberInfo(data)
                  handleSSO(data)
                }
              } catch (e) {
                // Not JSON, skip
              }
            })
          }
        } catch (e) {
          console.log("Error checking sessionStorage", e)
        }
      } catch (error) {
        console.log("Error in polling", error)
      }

      // Continue polling
      if (pollCount < maxPolls && !memberInfo) {
        setTimeout(pollForMemberSpace, 1000)
      } else if (pollCount >= maxPolls) {
        console.log("Stopped polling - max attempts reached")
      }
    }

    // Start polling immediately
    pollForMemberSpace()
  }

  const handleMemberSpaceEvent = (eventName: string, detail: any) => {
    console.log(`Processing MemberSpace event: ${eventName}`, detail)

    let memberData = null

    // Try different ways to extract member data
    if (detail?.memberInfo) {
      memberData = detail.memberInfo
    } else if (detail?.member) {
      memberData = detail.member
    } else if (detail?.user) {
      memberData = detail.user
    } else if (detail) {
      memberData = detail
    }

    if (memberData && (memberData.email || memberData.name || memberData.id)) {
      console.log("Valid member data found", memberData)
      setMemberInfo(memberData)
      handleSSO(memberData)
    } else {
      console.log("No valid member data in event", detail)
    }
  }

  const handleSSO = async (memberData: any) => {
    if (!memberData) {
      console.log("No member data provided for SSO")
      return
    }

    try {
      setSsoStatus("loading")
      setSsoError(null)
      setIsLoading(true)

      console.log("=== STARTING SSO PROCESS ===", memberData)

      // Extract user data with extensive fallbacks
      const userData = {
        username: memberData.email || memberData.username || memberData.user || memberData.id || `user_${Date.now()}`,
        email: memberData.email || memberData.emailAddress || memberData.userEmail || "",
        name:
          memberData.name ||
          memberData.fullName ||
          memberData.displayName ||
          (memberData.firstName && memberData.lastName ? `${memberData.firstName} ${memberData.lastName}` : "") ||
          memberData.firstName ||
          memberData.lastName ||
          "",
        brokerage:
          memberData.brokerage ||
          memberData.company ||
          memberData.organization ||
          memberData.broker ||
          memberData.firm ||
          "",
        market:
          memberData.market || memberData.location || memberData.city || memberData.region || memberData.area || "",
        remember: true,
      }

      console.log("Processed user data for SSO", userData)

      if (!userData.username) {
        throw new Error("No valid username/email found for SSO")
      }

      console.log("Calling getCommunityAuthToken...")
      const ssoData = await getCommunityAuthToken(userData)
      console.log("SSO successful! Received", ssoData)

      setAuthToken(ssoData.authToken)
      setSsoStatus("success")

      // Reload forum with auth token
      console.log("Reloading forum with SSO token...")
      loadForumScript(ssoData.authToken)
    } catch (error) {
      console.error("=== SSO FAILED ===", error)
      setSsoStatus("error")
      setSsoError(error instanceof Error ? error.message : String(error))
    } finally {
      setIsLoading(false)
    }
  }

  const loadForumScript = (authToken?: string) => {
    try {
      console.log("=== LOADING FORUM SCRIPT ===", { hasAuthToken: !!authToken })

      // Remove existing script and clear container
      const existingScript = document.getElementById("embedded_forum")
      if (existingScript) {
        console.log("Removing existing forum script")
        existingScript.remove()
      }

      const embedContainer = document.getElementById("wtEmbedCode")
      if (!embedContainer) {
        console.log("Forum embed container not found!")
        return
      }

      // Clear container
      embedContainer.innerHTML = `<noscript><a href="https://forum.thenextlevelu.com/">The Next Level U - Community Groups & Chats</a></noscript>`

      // Create new script
      setTimeout(() => {
        const script = document.createElement("script")
        script.type = "text/javascript"
        script.id = "embedded_forum"
        script.setAttribute("data-version", "1.1")

        // Add load event listener
        script.onload = () => {
          console.log("Forum script loaded successfully")
          setForumLoaded(true)
        }

        script.onerror = () => {
          console.log("Forum script failed to load")
          setForumLoaded(false)
        }

        if (authToken) {
          script.src = `https://forum.thenextlevelu.com/js/mb/embed.js?authtoken=${authToken}&remember=1`
          console.log("Loading forum WITH SSO token")
        } else {
          script.src = "https://forum.thenextlevelu.com/js/mb/embed.js"
          console.log("Loading forum WITHOUT SSO token")
        }

        embedContainer.appendChild(script)
        console.log("Forum script added to DOM")
      }, 200)
    } catch (error) {
      console.error("Error loading forum script", error)
      setForumLoaded(false)
    }
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Network className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">Community Groups & Chats</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with like-minded real estate professionals, share insights, and build valuable relationships.
          </p>

          {/* Status Display */}
          <div className="mt-6 space-y-2">
            {memberInfo && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 max-w-md mx-auto">
                <p className="text-sm text-green-800">
                  <CheckCircle className="h-4 w-4 inline mr-2" />
                  Welcome, {memberInfo.name || memberInfo.email || memberInfo.firstName || "Member"}!
                </p>
                {memberInfo.brokerage && <p className="text-xs text-green-600">{memberInfo.brokerage}</p>}
                {memberInfo.market && <p className="text-xs text-green-600">{memberInfo.market}</p>}
              </div>
            )}

            {ssoStatus === "loading" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-md mx-auto">
                <div className="flex items-center justify-center text-sm text-blue-800">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Connecting to community...
                </div>
              </div>
            )}

            {ssoStatus === "success" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 max-w-md mx-auto">
                <div className="flex items-center justify-center text-sm text-green-800">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Successfully connected to community
                </div>
              </div>
            )}

            {ssoStatus === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-w-md mx-auto">
                <div className="text-sm text-red-800">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  Community connection failed: {ssoError}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Community Forum Embed */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Live Community Forum</h2>
              <p className="text-indigo-100 text-sm">
                Join the conversation with fellow real estate professionals
                {forumLoaded && <span className="ml-2">✅ Connected</span>}
              </p>
            </div>
            <div className="p-0">
              <div className="h-[800px] w-full relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col justify-center items-center z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                    <span className="text-gray-600">Connecting with SSO...</span>
                  </div>
                )}
                <div id="wtEmbedCode" className="h-full w-full">
                  <noscript>
                    <a href="https://forum.thenextlevelu.com/">The Next Level U - Community Groups & Chats</a>
                  </noscript>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
