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
