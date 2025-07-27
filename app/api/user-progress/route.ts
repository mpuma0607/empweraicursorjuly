import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get("userEmail")
    const pageType = searchParams.get("pageType")

    if (!userEmail || !pageType) {
      return NextResponse.json({ error: "Missing userEmail or pageType parameter" }, { status: 400 })
    }

    const progress = await sql`
      SELECT step_id, completed, completed_at 
      FROM user_progress 
      WHERE user_email = ${userEmail} AND page_type = ${pageType}
      ORDER BY completed_at DESC
    `

    return NextResponse.json({ progress })
  } catch (error) {
    console.error("Error fetching user progress:", error)
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userEmail, pageType, stepId, completed } = await request.json()

    if (!userEmail || !pageType || !stepId) {
      return NextResponse.json({ error: "Missing required fields: userEmail, pageType, stepId" }, { status: 400 })
    }

    if (completed) {
      // Insert or update progress as completed
      await sql`
        INSERT INTO user_progress (user_email, page_type, step_id, completed, completed_at, updated_at)
        VALUES (${userEmail}, ${pageType}, ${stepId}, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT (user_email, page_type, step_id) 
        DO UPDATE SET 
          completed = true,
          completed_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      `
    } else {
      // Remove progress (mark as incomplete by deleting the record)
      await sql`
        DELETE FROM user_progress 
        WHERE user_email = ${userEmail} 
        AND page_type = ${pageType} 
        AND step_id = ${stepId}
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving user progress:", error)
    return NextResponse.json({ error: "Failed to save progress" }, { status: 500 })
  }
}
