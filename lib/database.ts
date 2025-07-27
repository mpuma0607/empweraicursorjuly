/**
 * Generates a cache key for database operations
 * @param prefix - The prefix for the cache key (e.g., 'user', 'post', 'query')
 * @param identifier - The unique identifier (e.g., user ID, query hash)
 * @param params - Additional parameters to include in the cache key
 * @returns A formatted cache key string
 */
export function generateCacheKey(prefix: string, identifier: string | number, params?: Record<string, any>): string {
  const baseKey = `${prefix}:${identifier}`

  if (!params || Object.keys(params).length === 0) {
    return baseKey
  }

  // Sort parameters for consistent cache keys
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${JSON.stringify(params[key])}`)
    .join("&")

  return `${baseKey}:${sortedParams}`
}

/**
 * Generates a cache key specifically for database queries
 * @param table - The database table name
 * @param query - The query parameters or conditions
 * @param userId - Optional user ID for user-specific caching
 * @returns A formatted cache key for the database query
 */
export function generateQueryCacheKey(table: string, query: Record<string, any>, userId?: string | number): string {
  const queryHash = Buffer.from(JSON.stringify(query)).toString("base64")
  const prefix = userId ? `db:${table}:user:${userId}` : `db:${table}`

  return generateCacheKey(prefix, queryHash)
}

/**
 * Generates a cache key for user-specific data
 * @param userId - The user ID
 * @param dataType - The type of data being cached
 * @param additionalParams - Any additional parameters
 * @returns A formatted cache key for user data
 */
export function generateUserCacheKey(
  userId: string | number,
  dataType: string,
  additionalParams?: Record<string, any>,
): string {
  return generateCacheKey(`user:${dataType}`, userId, additionalParams)
}
