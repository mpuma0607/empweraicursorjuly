import { NextRequest, NextResponse } from 'next/server'
import { oauthTokens } from '@/lib/oauth-tokens'
import { getUserBrandingProfile } from '@/app/profile/branding/actions'

export async function POST(request: NextRequest) {
  try {
    const { userEmail, userId, tenantId } = await request.json()

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      )
    }

    let signature = ''

    // Try to get signature from FUB user info first
    try {
      const fubTokens = await oauthTokens.get(userEmail, 'followupboss')
      
      if (fubTokens) {
        const response = await fetch('https://api.followupboss.com/v1/identity', {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${fubTokens.accessToken}:`).toString('base64')}`,
            'Content-Type': 'application/json',
            'X-System': process.env.FUB_X_SYSTEM || 'EmpowerAI',
            'X-System-Key': process.env.FUB_X_SYSTEM_KEY || ''
          }
        })

        if (response.ok) {
          const fubUser = await response.json()
          console.log('FUB User Info for signature:', fubUser)
          
          // Build signature from FUB data
          signature = `Best regards,\n${fubUser.name || 'Your Name'}`
          
          if (fubUser.email) {
            signature += `\n${fubUser.email}`
          }
          
          if (fubUser.phone) {
            signature += `\n${fubUser.phone}`
          }
        }
      }
    } catch (error) {
      console.log('Could not get FUB user info for signature:', error)
    }

    // Fallback to branding profile if available
    if (!signature && userId && tenantId) {
      try {
        const brandingProfile = await getUserBrandingProfile(userId, tenantId)
        if (brandingProfile) {
          signature = `Best regards,\n${brandingProfile.name || 'Your Name'}`
          
          if (brandingProfile.brokerage) {
            signature += `\n${brandingProfile.brokerage}`
          }
          
          if (brandingProfile.email) {
            signature += `\n${brandingProfile.email}`
          }
          
          if (brandingProfile.phone) {
            signature += `\n${brandingProfile.phone}`
          }
        }
      } catch (error) {
        console.log('Could not get branding profile for signature:', error)
      }
    }

    // Final fallback
    if (!signature) {
      signature = `Best regards,\nYour Name\nYour Brokerage\nYour Phone\n${userEmail}`
    }

    return NextResponse.json({
      signature
    })

  } catch (error) {
    console.error('Error generating signature:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


