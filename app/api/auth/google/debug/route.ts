import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID ? `${process.env.GOOGLE_OAUTH_CLIENT_ID.substring(0, 10)}...` : 'NOT SET',
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET ? `${process.env.GOOGLE_OAUTH_CLIENT_SECRET.substring(0, 10)}...` : 'NOT SET',
    redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URI || 'https://getempowerai.com/api/auth/google/callback',
    nodeEnv: process.env.NODE_ENV,
    message: 'Check these values match your Google OAuth console configuration'
  })
}
