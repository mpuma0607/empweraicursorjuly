import { NextRequest, NextResponse } from "next/server"
import { oauthTokens } from "@/lib/oauth-tokens"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }
    
    console.log('Beggins OAuth Status Check - Email:', email)
    
    // Check for valid tokens for Beggins tenant
    const hasValidTokens = await oauthTokens.hasValidTokens(email, 'google', 'century21-beggins')
    
    console.log('Beggins OAuth Status - Has valid tokens:', hasValidTokens)
    
    return NextResponse.json({
      connected: hasValidTokens,
      tenant: 'century21-beggins'
    })
    
  } catch (error) {
    console.error('Error checking Beggins OAuth status:', error)
    return NextResponse.json(
      { error: 'Failed to check OAuth status' },
      { status: 500 }
    )
  }
}
