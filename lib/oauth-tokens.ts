// Simple in-memory token storage for OAuth
// TODO: Replace with database storage in production

interface OAuthTokens {
  accessToken: string
  refreshToken?: string
  expiresAt: Date
  email: string
  scopes: string[]
  createdAt: Date
  lastUsed: Date
}

// In-memory storage (will be cleared on server restart)
const tokenStore = new Map<string, OAuthTokens>()

export const oauthTokens = {
  // Store tokens for a user (using email as key for now)
  store: (email: string, tokens: Omit<OAuthTokens, 'createdAt' | 'lastUsed'>) => {
    const now = new Date()
    tokenStore.set(email, {
      ...tokens,
      createdAt: now,
      lastUsed: now
    })
    console.log(`Stored OAuth tokens for ${email}`)
  },

  // Get tokens for a user
  get: (email: string): OAuthTokens | undefined => {
    return tokenStore.get(email)
  },

  // Check if user has valid tokens
  hasValidTokens: (email: string): boolean => {
    const tokens = tokenStore.get(email)
    if (!tokens) return false
    
    // Check if token is expired (with 5 minute buffer)
    const now = new Date()
    const bufferTime = 5 * 60 * 1000 // 5 minutes in milliseconds
    return tokens.expiresAt.getTime() > (now.getTime() + bufferTime)
  },

  // Update last used time
  updateLastUsed: (email: string) => {
    const tokens = tokenStore.get(email)
    if (tokens) {
      tokens.lastUsed = new Date()
      tokenStore.set(email, tokens)
    }
  },

  // Remove tokens for a user
  remove: (email: string) => {
    tokenStore.delete(email)
    console.log(`Removed OAuth tokens for ${email}`)
  },

  // Get all stored emails (for debugging)
  getAllEmails: (): string[] => {
    return Array.from(tokenStore.keys())
  }
}
