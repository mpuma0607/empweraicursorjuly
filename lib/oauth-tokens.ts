// OAuth token storage with database persistence
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

interface OAuthTokens {
  id: number
  userEmail: string
  provider: string
  accessToken: string
  refreshToken?: string
  expiresAt: Date
  scopes: string[]
  createdAt: Date
  lastUsed: Date
  isActive: boolean
}

export const oauthTokens = {
  // Store tokens for a user
  async store(email: string, tokens: {
    accessToken: string
    refreshToken?: string
    expiresAt: Date
    scopes: string[]
    provider?: string
  }): Promise<void> {
    try {
      const provider = tokens.provider || 'google'
      
      // First, try to update existing tokens
      const updateResult = await sql`
        UPDATE oauth_tokens 
        SET 
          access_token = ${tokens.accessToken},
          refresh_token = ${tokens.refreshToken || null},
          expires_at = ${tokens.expiresAt},
          scopes = ${tokens.scopes},
          last_used = CURRENT_TIMESTAMP,
          is_active = true
        WHERE user_email = ${email} AND provider = ${provider}
        RETURNING id
      `

      // If no rows were updated, insert new tokens
      if (updateResult.length === 0) {
        await sql`
          INSERT INTO oauth_tokens (
            user_email, provider, access_token, refresh_token, 
            expires_at, scopes, created_at, last_used, is_active
          ) VALUES (
            ${email}, ${provider}, ${tokens.accessToken}, 
            ${tokens.refreshToken || null}, ${tokens.expiresAt}, 
            ${tokens.scopes}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true
          )
        `
      }

      console.log(`Stored OAuth tokens for ${email} (${provider})`)
    } catch (error) {
      console.error('Error storing OAuth tokens:', error)
      throw new Error('Failed to store OAuth tokens')
    }
  },

  // Get tokens for a user
  async get(email: string, provider: string = 'google'): Promise<OAuthTokens | null> {
    try {
      const result = await sql`
        SELECT 
          id, user_email, provider, access_token, refresh_token,
          expires_at, scopes, created_at, last_used, is_active
        FROM oauth_tokens 
        WHERE user_email = ${email} AND provider = ${provider} AND is_active = true
        ORDER BY created_at DESC 
        LIMIT 1
      `

      if (result.length === 0) return null

      const row = result[0]
      return {
        id: row.id,
        userEmail: row.user_email,
        provider: row.provider,
        accessToken: row.access_token,
        refreshToken: row.refresh_token,
        expiresAt: new Date(row.expires_at),
        scopes: row.scopes,
        createdAt: new Date(row.created_at),
        lastUsed: new Date(row.last_used),
        isActive: row.is_active
      }
    } catch (error) {
      console.error('Error getting OAuth tokens:', error)
      return null
    }
  },

  // Check if user has valid tokens
  async hasValidTokens(email: string, provider: string = 'google'): Promise<boolean> {
    try {
      const tokens = await this.get(email, provider)
      if (!tokens) return false

      // Check if token is expired (with 5 minute buffer)
      const now = new Date()
      const bufferTime = 5 * 60 * 1000 // 5 minutes in milliseconds
      return tokens.expiresAt.getTime() > (now.getTime() + bufferTime)
    } catch (error) {
      console.error('Error checking OAuth token validity:', error)
      return false
    }
  },

  // Update last used time
  async updateLastUsed(email: string, provider: string = 'google'): Promise<void> {
    try {
      await sql`
        UPDATE oauth_tokens 
        SET last_used = CURRENT_TIMESTAMP 
        WHERE user_email = ${email} AND provider = ${provider} AND is_active = true
      `
    } catch (error) {
      console.error('Error updating OAuth token last used time:', error)
    }
  },

  // Remove tokens for a user (soft delete)
  async remove(email: string, provider: string = 'google'): Promise<void> {
    try {
      await sql`
        UPDATE oauth_tokens 
        SET is_active = false 
        WHERE user_email = ${email} AND provider = ${provider}
      `
      console.log(`Removed OAuth tokens for ${email} (${provider})`)
    } catch (error) {
      console.error('Error removing OAuth tokens:', error)
      throw new Error('Failed to remove OAuth tokens')
    }
  },

  // Get all active tokens for a user
  async getAllForUser(email: string): Promise<OAuthTokens[]> {
    try {
      const result = await sql`
        SELECT 
          id, user_email, provider, access_token, refresh_token,
          expires_at, scopes, created_at, last_used, is_active
        FROM oauth_tokens 
        WHERE user_email = ${email} AND is_active = true
        ORDER BY created_at DESC
      `

      return result.map(row => ({
        id: row.id,
        userEmail: row.user_email,
        provider: row.provider,
        accessToken: row.access_token,
        refreshToken: row.refresh_token,
        expiresAt: new Date(row.expires_at),
        scopes: row.scopes,
        createdAt: new Date(row.created_at),
        lastUsed: new Date(row.last_used),
        isActive: row.is_active
      }))
    } catch (error) {
      console.error('Error getting all OAuth tokens for user:', error)
      return []
    }
  },

  // Get all stored emails (for debugging)
  async getAllEmails(): Promise<string[]> {
    try {
      const result = await sql`
        SELECT DISTINCT user_email 
        FROM oauth_tokens 
        WHERE is_active = true
      `
      return result.map(row => row.user_email)
    } catch (error) {
      console.error('Error getting all OAuth emails:', error)
      return []
    }
  },

  // Clean up expired tokens
  async cleanupExpiredTokens(): Promise<number> {
    try {
      const result = await sql`
        UPDATE oauth_tokens 
        SET is_active = false 
        WHERE expires_at < CURRENT_TIMESTAMP AND is_active = true
        RETURNING id
      `
      const cleanedCount = result.length
      if (cleanedCount > 0) {
        console.log(`Cleaned up ${cleanedCount} expired OAuth tokens`)
      }
      return cleanedCount
    } catch (error) {
      console.error('Error cleaning up expired OAuth tokens:', error)
      return 0
    }
  }
}
