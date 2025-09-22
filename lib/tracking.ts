import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface UserSession {
  id: number
  session_id: string
  user_email?: string
  user_agent?: string
  ip_address?: string
  created_at: Date
  updated_at: Date
}

export interface PageView {
  id: number
  session_id: string
  page_path: string
  page_title?: string
  referrer?: string
  timestamp: Date
}

export interface UserEvent {
  id: number
  session_id: string
  event_type: string
  event_data?: any
  timestamp: Date
}

export async function createOrUpdateSession(sessionId: string, userAgent?: string, ipAddress?: string, userEmail?: string): Promise<void> {
  try {
    await sql`
      INSERT INTO user_sessions (session_id, user_agent, ip_address, user_email)
      VALUES (${sessionId}, ${userAgent}, ${ipAddress}, ${userEmail})
      ON CONFLICT (session_id) 
      DO UPDATE SET 
        updated_at = CURRENT_TIMESTAMP,
        user_agent = COALESCE(EXCLUDED.user_agent, user_sessions.user_agent),
        ip_address = COALESCE(EXCLUDED.ip_address, user_sessions.ip_address),
        user_email = COALESCE(EXCLUDED.user_email, user_sessions.user_email)
    `
    console.log("Session created/updated:", sessionId, userEmail ? `for user: ${userEmail}` : '')
  } catch (error) {
    console.error("Error creating/updating session:", error)
    throw error
  }
}

export async function trackPageView(
  sessionId: string,
  pagePath: string,
  pageTitle?: string,
  referrer?: string,
): Promise<void> {
  try {
    await sql`
      INSERT INTO page_views (session_id, page_path, page_title, referrer)
      VALUES (${sessionId}, ${pagePath}, ${pageTitle}, ${referrer})
    `
    console.log("Page view tracked:", { sessionId, pagePath })
  } catch (error) {
    console.error("Error tracking page view:", error)
    throw error
  }
}

export async function trackEvent(sessionId: string, eventType: string, eventData?: any): Promise<void> {
  try {
    await sql`
      INSERT INTO user_events (session_id, event_type, event_data)
      VALUES (${sessionId}, ${eventType}, ${eventData ? JSON.stringify(eventData) : null})
    `
    console.log("Event tracked:", { sessionId, eventType })
  } catch (error) {
    console.error("Error tracking event:", error)
    throw error
  }
}

export async function getAnalytics(days = 7) {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    console.log("Getting analytics for date range:", startDate.toISOString())

    // Get page views
    const pageViews = await sql`
      SELECT 
        page_path,
        COUNT(*) as views,
        COUNT(DISTINCT session_id) as unique_visitors
      FROM page_views 
      WHERE timestamp >= ${startDate.toISOString()}
      GROUP BY page_path
      ORDER BY views DESC
    `

    // Get daily stats
    const dailyStats = await sql`
      SELECT 
        DATE(timestamp) as date,
        COUNT(*) as page_views,
        COUNT(DISTINCT session_id) as unique_visitors
      FROM page_views 
      WHERE timestamp >= ${startDate.toISOString()}
      GROUP BY DATE(timestamp)
      ORDER BY date DESC
    `

    // Get top events
    const topEvents = await sql`
      SELECT 
        event_type,
        COUNT(*) as count
      FROM user_events 
      WHERE timestamp >= ${startDate.toISOString()}
      GROUP BY event_type
      ORDER BY count DESC
    `

    // Get total stats
    const totalStats = await sql`
      SELECT 
        COUNT(DISTINCT session_id) as total_sessions,
        COUNT(*) as total_page_views
      FROM page_views 
      WHERE timestamp >= ${startDate.toISOString()}
    `

    console.log("Analytics results:", {
      pageViews: pageViews.length,
      dailyStats: dailyStats.length,
      topEvents: topEvents.length,
      totalStats: totalStats[0],
    })

    return {
      pageViews,
      dailyStats,
      topEvents,
      totalStats: totalStats[0] || { total_sessions: 0, total_page_views: 0 },
    }
  } catch (error) {
    console.error("Error getting analytics:", error)
    return {
      pageViews: [],
      dailyStats: [],
      topEvents: [],
      totalStats: { total_sessions: 0, total_page_views: 0 },
    }
  }
}

export async function getUserAnalytics(days = 7) {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    console.log("Getting user analytics for date range:", startDate.toISOString())

    // Get user summary stats
    const userStats = await sql`
      SELECT 
        us.user_email,
        COUNT(DISTINCT us.session_id) as total_sessions,
        COUNT(pv.id) as total_page_views,
        MAX(us.updated_at) as last_login,
        MIN(us.created_at) as first_login,
        EXTRACT(EPOCH FROM (MAX(us.updated_at) - MIN(us.created_at))) / 3600 as total_hours
      FROM user_sessions us
      LEFT JOIN page_views pv ON us.session_id = pv.session_id
      WHERE us.user_email IS NOT NULL 
        AND us.created_at >= ${startDate.toISOString()}
      GROUP BY us.user_email
      ORDER BY total_sessions DESC, total_page_views DESC
    `

    return userStats
  } catch (error) {
    console.error("Error getting user analytics:", error)
    return []
  }
}

export async function getUserDetailAnalytics(userEmail: string, days = 30) {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    console.log("Getting detailed analytics for user:", userEmail)

    // Get user sessions with details
    const userSessions = await sql`
      SELECT 
        us.session_id,
        us.created_at as session_start,
        us.updated_at as session_end,
        COUNT(pv.id) as pages_viewed,
        EXTRACT(EPOCH FROM (us.updated_at - us.created_at)) / 60 as session_duration_minutes
      FROM user_sessions us
      LEFT JOIN page_views pv ON us.session_id = pv.session_id
      WHERE us.user_email = ${userEmail}
        AND us.created_at >= ${startDate.toISOString()}
      GROUP BY us.session_id, us.created_at, us.updated_at
      ORDER BY us.created_at DESC
    `

    // Get user page views
    const userPageViews = await sql`
      SELECT 
        page_path,
        COUNT(*) as views,
        MAX(timestamp) as last_visited
      FROM page_views pv
      JOIN user_sessions us ON pv.session_id = us.session_id
      WHERE us.user_email = ${userEmail}
        AND pv.timestamp >= ${startDate.toISOString()}
      GROUP BY page_path
      ORDER BY views DESC
    `

    // Get user events
    const userEvents = await sql`
      SELECT 
        event_type,
        COUNT(*) as count,
        MAX(timestamp) as last_occurred
      FROM user_events ue
      JOIN user_sessions us ON ue.session_id = us.session_id
      WHERE us.user_email = ${userEmail}
        AND ue.timestamp >= ${startDate.toISOString()}
      GROUP BY event_type
      ORDER BY count DESC
    `

    // Get daily activity
    const dailyActivity = await sql`
      SELECT 
        DATE(us.created_at) as date,
        COUNT(DISTINCT us.session_id) as sessions,
        COUNT(pv.id) as page_views,
        EXTRACT(EPOCH FROM (MAX(us.updated_at) - MIN(us.created_at))) / 3600 as total_hours
      FROM user_sessions us
      LEFT JOIN page_views pv ON us.session_id = pv.session_id
      WHERE us.user_email = ${userEmail}
        AND us.created_at >= ${startDate.toISOString()}
      GROUP BY DATE(us.created_at)
      ORDER BY date DESC
    `

    return {
      sessions: userSessions,
      pageViews: userPageViews,
      events: userEvents,
      dailyActivity: dailyActivity,
    }
  } catch (error) {
    console.error("Error getting user detail analytics:", error)
    return {
      sessions: [],
      pageViews: [],
      events: [],
      dailyActivity: [],
    }
  }
}
