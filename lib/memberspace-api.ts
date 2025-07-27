interface MemberSpaceUser {
  id: string
  email: string
  name?: string
  status: "active" | "inactive" | "trial"
  subscription?: {
    plan: string
    status: string
    expires_at?: string
  }
}

interface MemberSpaceResponse {
  success: boolean
  user?: MemberSpaceUser
  error?: string
}

export class MemberSpaceAPI {
  private baseUrl = "https://api.memberspace.com/v1"
  private apiKey: string

  constructor() {
    this.apiKey = process.env.MEMBERSPACE_API_KEY || ""
    if (!this.apiKey) {
      console.warn("MemberSpace API key not configured")
    }
  }

  async getCurrentUser(sessionToken?: string): Promise<MemberSpaceResponse> {
    try {
      if (!this.apiKey) {
        return { success: false, error: "API key not configured" }
      }

      // Try to get user from MemberSpace widget session
      const response = await fetch(`${this.baseUrl}/members/current`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          ...(sessionToken && { "X-Session-Token": sessionToken }),
        },
      })

      if (!response.ok) {
        return { success: false, error: `API error: ${response.status}` }
      }

      const data = await response.json()

      return {
        success: true,
        user: {
          id: data.id,
          email: data.email,
          name: data.name || data.first_name + " " + data.last_name,
          status: data.status,
          subscription: data.subscription,
        },
      }
    } catch (error) {
      console.error("MemberSpace API error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  async getUserById(userId: string): Promise<MemberSpaceResponse> {
    try {
      if (!this.apiKey) {
        return { success: false, error: "API key not configured" }
      }

      const response = await fetch(`${this.baseUrl}/members/${userId}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        return { success: false, error: `API error: ${response.status}` }
      }

      const data = await response.json()

      return {
        success: true,
        user: {
          id: data.id,
          email: data.email,
          name: data.name || data.first_name + " " + data.last_name,
          status: data.status,
          subscription: data.subscription,
        },
      }
    } catch (error) {
      console.error("MemberSpace API error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }
}

export const memberSpaceAPI = new MemberSpaceAPI()
