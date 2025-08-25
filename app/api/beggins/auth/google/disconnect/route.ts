import { NextRequest, NextResponse } from "next/server"
import { oauthTokens } from "@/lib/oauth-tokens"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }
    
    console.log('Beggins OAuth Disconnect - Email:', email)
    
    // Remove tokens for Beggins tenant
    await oauthTokens.remove(email, 'google', 'century21-beggins')
    
    console.log('Beggins OAuth disconnected successfully for:', email)
    
    return NextResponse.json({
      success: true,
      message: 'Gmail disconnected successfully',
      tenant: 'century21-beggins'
    })
    
  } catch (error) {
    console.error('Error disconnecting Beggins OAuth:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect OAuth' },
      { status: 500 }
    )
  }
}
