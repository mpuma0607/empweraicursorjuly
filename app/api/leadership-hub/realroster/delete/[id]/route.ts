import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = parseInt(params.id.replace('agent_', ''))

    if (!agentId) {
      return NextResponse.json({ error: 'Invalid agent ID' }, { status: 400 })
    }

    // Delete agent from database
    await sql`
      DELETE FROM agents 
      WHERE id = ${agentId}
    `

    return NextResponse.json({
      success: true,
      message: 'Agent deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting agent:', error)
    return NextResponse.json({
      error: 'Failed to delete agent'
    }, { status: 500 })
  }
}
