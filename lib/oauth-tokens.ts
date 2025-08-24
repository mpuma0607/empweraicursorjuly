// OAuth token storage with localStorage persistence
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

// Helper functions for localStorage
const getStoredTokens = (): Record<string, OAuthTokens> => {
  if (typeof window === 'undefined') return {}
  
  try {
    const stored = localStorage.getItem('oauth_tokens')
    if (!stored) return {}
    
    const parsed = JSON.parse(stored)
    // Convert date strings back to Date objects
    Object.keys(parsed).forEach(email => {
      if (parsed[email]) {
        parsed[email].expiresAt = new Date(parsed[email].expiresAt)
        parsed[email].createdAt = new Date(parsed[email].createdAt)
        parsed[email].lastUsed = new Date(parsed[email].lastUsed)
      }
    })
    return parsed
  } catch (error) {
    console.error('Error parsing stored OAuth tokens:', error)
    return {}
  }
}

const saveTokensToStorage = (tokens: Record<string, OAuthTokens>) => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem('oauth_tokens', JSON.stringify(tokens))
  } catch (error) {
    console.error('Error saving OAuth tokens to localStorage:', error)
  }
}

export const oauthTokens = {
  // Store tokens for a user (using email as key for now)
  store: (email: string, tokens: Omit<OAuthTokens, 'createdAt' | 'lastUsed'>) => {
    const now = new Date()
    const storedTokens = getStoredTokens()
    storedTokens[email] = {
      ...tokens,
      createdAt: now,
      lastUsed: now
    }
    saveTokensToStorage(storedTokens)
    console.log(`Stored OAuth tokens for ${email}`)
  },

  // Get tokens for a user
  get: (email: string): OAuthTokens | undefined => {
    const storedTokens = getStoredTokens()
    return storedTokens[email]
  },

  // Check if user has valid tokens
  hasValidTokens: (email: string): boolean => {
    const tokens = getStoredTokens()[email]
    if (!tokens) return false
    
    // Check if token is expired (with 5 minute buffer)
    const now = new Date()
    const bufferTime = 5 * 60 * 1000 // 5 minutes in milliseconds
    return tokens.expiresAt.getTime() > (now.getTime() + bufferTime)
  },

  // Update last used time
  updateLastUsed: (email: string) => {
    const storedTokens = getStoredTokens()
    if (storedTokens[email]) {
      storedTokens[email].lastUsed = new Date()
      saveTokensToStorage(storedTokens)
    }
  },

  // Remove tokens for a user
  remove: (email: string) => {
    const storedTokens = getStoredTokens()
    delete storedTokens[email]
    saveTokensToStorage(storedTokens)
    console.log(`Removed OAuth tokens for ${email}`)
  },

  // Get all stored emails (for debugging)
  getAllEmails: (): string[] => {
    return Object.keys(getStoredTokens())
  }
}
