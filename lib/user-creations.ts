import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface UserCreation {
  id: number
  user_id: string
  user_email: string
  tool_type: string
  title: string
  content: string
  form_data: any
  metadata: any
  created_at: string
  expires_at: string
}

export interface CreateUserCreationData {
  user_id: string
  user_email: string
  tool_type: string
  title: string
  content: string
  form_data?: any
  metadata?: any
}

export class UserCreationsService {
  async saveCreation(data: CreateUserCreationData): Promise<UserCreation> {
    try {
      const result = await sql`
        INSERT INTO user_creations (
          user_id, user_email, tool_type, title, content, form_data, metadata
        ) VALUES (
          ${data.user_id}, ${data.user_email}, ${data.tool_type}, 
          ${data.title}, ${data.content}, ${JSON.stringify(data.form_data || {})}, 
          ${JSON.stringify(data.metadata || {})}
        )
        RETURNING *
      `

      return result[0] as UserCreation
    } catch (error) {
      console.error("Error saving user creation:", error)
      throw new Error("Failed to save creation")
    }
  }

  async getUserCreations(userId: string, limit = 50, offset = 0): Promise<UserCreation[]> {
    try {
      const result = await sql`
        SELECT * FROM user_creations 
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `

      return result as UserCreation[]
    } catch (error) {
      console.error("Error fetching user creations:", error)
      throw new Error("Failed to fetch creations")
    }
  }

  async getUserCreationsByTool(userId: string, toolType: string): Promise<UserCreation[]> {
    try {
      const result = await sql`
        SELECT * FROM user_creations 
        WHERE user_id = ${userId} AND tool_type = ${toolType}
        ORDER BY created_at DESC
      `

      return result as UserCreation[]
    } catch (error) {
      console.error("Error fetching user creations by tool:", error)
      throw new Error("Failed to fetch creations")
    }
  }

  async deleteCreation(id: number, userId: string): Promise<boolean> {
    try {
      const result = await sql`
        DELETE FROM user_creations 
        WHERE id = ${id} AND user_id = ${userId}
      `

      return result.length > 0
    } catch (error) {
      console.error("Error deleting user creation:", error)
      throw new Error("Failed to delete creation")
    }
  }

  async cleanupExpiredCreations(): Promise<number> {
    try {
      const result = await sql`
        DELETE FROM user_creations 
        WHERE expires_at < NOW()
      `

      return result.length
    } catch (error) {
      console.error("Error cleaning up expired creations:", error)
      throw new Error("Failed to cleanup expired creations")
    }
  }

  // Cache management
  async getCachedResponse(cacheKey: string): Promise<any | null> {
    try {
      const result = await sql`
        SELECT response_data FROM creation_cache 
        WHERE cache_key = ${cacheKey} AND expires_at > NOW()
      `

      return result[0]?.response_data || null
    } catch (error) {
      console.error("Error getting cached response:", error)
      return null
    }
  }

  async setCachedResponse(cacheKey: string, toolType: string, inputHash: string, responseData: any): Promise<void> {
    try {
      await sql`
        INSERT INTO creation_cache (cache_key, tool_type, input_hash, response_data)
        VALUES (${cacheKey}, ${toolType}, ${inputHash}, ${JSON.stringify(responseData)})
        ON CONFLICT (cache_key) 
        DO UPDATE SET 
          response_data = ${JSON.stringify(responseData)},
          created_at = NOW(),
          expires_at = NOW() + INTERVAL '30 days'
      `
    } catch (error) {
      console.error("Error setting cached response:", error)
    }
  }
}

export const userCreationsService = new UserCreationsService()
