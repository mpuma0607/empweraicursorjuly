// Function to get auth token from Website Toolbox SSO API
export async function getCommunityAuthToken(user: {
  username: string
  email?: string
  name?: string
  avatar?: string
  brokerage?: string
  market?: string
  remember?: boolean
}) {
  try {
    console.log("getCommunityAuthToken called with:", user)

    // Build query string
    const queryParams = new URLSearchParams()
    queryParams.append("username", user.username)
    if (user.email) queryParams.append("email", user.email)
    if (user.name) queryParams.append("name", user.name)
    if (user.avatar) queryParams.append("avatar", user.avatar)
    if (user.brokerage) queryParams.append("brokerage", user.brokerage)
    if (user.market) queryParams.append("market", user.market)
    queryParams.append("remember", user.remember ? "true" : "false")

    console.log("Making SSO request with params:", queryParams.toString())

    // Call our SSO API endpoint
    const response = await fetch(`/api/community-sso?${queryParams.toString()}`)

    console.log("SSO API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("SSO API error response:", errorText)
      throw new Error(`SSO API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("SSO API response data:", data)

    if (data.error) {
      throw new Error(data.error)
    }

    return data
  } catch (error) {
    console.error("Error getting community auth token:", error)
    throw error
  }
}

// Function to handle community logout
export async function logoutFromCommunity() {
  try {
    const response = await fetch("/api/community-logout")

    if (!response.ok) {
      throw new Error(`Logout failed: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error logging out from community:", error)
    throw error
  }
}

// Function to check SSO status
export async function checkSSOStatus() {
  try {
    const response = await fetch("/api/sso-status")

    if (!response.ok) {
      throw new Error(`SSO status check failed: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error checking SSO status:", error)
    throw error
  }
}

// Function to register new user via SSO
export async function registerCommunityUser(user: {
  username?: string
  email: string
  name?: string
  brokerage?: string
  market?: string
}) {
  try {
    console.log("registerCommunityUser called with:", user)

    const queryParams = new URLSearchParams()
    if (user.username) queryParams.append("username", user.username)
    queryParams.append("email", user.email)
    if (user.name) queryParams.append("name", user.name)
    if (user.brokerage) queryParams.append("brokerage", user.brokerage)
    if (user.market) queryParams.append("market", user.market)

    const response = await fetch(`/api/community-sso-register?${queryParams.toString()}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("SSO registration error:", errorText)
      throw new Error(`SSO registration error: ${response.status}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error)
    }

    return data
  } catch (error) {
    console.error("Error registering community user:", error)
    throw error
  }
}

// Types for SSO responses
export interface SSOResponse {
  success: boolean
  authToken?: string
  userId?: string
  forumDomain?: string
  user?: string
  autoCreated?: boolean
  error?: string
  details?: string
}

export interface SSOUser {
  username: string
  email?: string
  name?: string
  avatar?: string
  brokerage?: string
  market?: string
  remember?: boolean
}
