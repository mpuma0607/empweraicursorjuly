import { NextRequest, NextResponse } from "next/server"
import { oauthTokens } from "@/lib/oauth-tokens"

export async function POST(request: NextRequest) {
  try {
    const { to, subject, body, fromEmail } = await request.json()

    if (!to || !subject || !body || !fromEmail) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, body, fromEmail" },
        { status: 400 }
      )
    }

    console.log("Sending Beggins Gmail email:", { to, subject, fromEmail })

    // Get OAuth tokens for the user on Beggins tenant
    const tokens = await oauthTokens.get(fromEmail, 'google', 'century21-beggins')

    if (!tokens.success || !tokens.tokens) {
      console.error("No valid OAuth tokens found for Beggins user:", fromEmail)
      return NextResponse.json(
        { error: "Gmail not connected. Please connect your Gmail account first." },
        { status: 401 }
      )
    }

    // Check if tokens are still valid
    const hasValidTokens = await oauthTokens.hasValidTokens(fromEmail, "century21-beggins")
    if (!hasValidTokens.success || !hasValidTokens.hasValid) {
      console.error("OAuth tokens expired for Beggins user:", fromEmail)
      return NextResponse.json(
        { error: "Gmail connection expired. Please reconnect your Gmail account." },
        { status: 401 }
      )
    }

    // Create email message
    const message = [
      `To: ${to}`,
      `From: ${fromEmail}`,
      `Subject: ${subject}`,
      "",
      body,
    ].join("\n")

    const encodedMessage = Buffer.from(message).toString("base64").replace(/\+/g, "-").replace(/\//g, "_")

    // Send email via Gmail API
    const gmailResponse = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokens.tokens.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        raw: encodedMessage,
      }),
    })

    if (!gmailResponse.ok) {
      const errorText = await gmailResponse.text()
      console.error("Gmail API error for Beggins user:", errorText)
      
      // If token is invalid, try to refresh
      if (gmailResponse.status === 401 && tokens.tokens.refresh_token) {
        console.log("Attempting to refresh token for Beggins user:", fromEmail)
        
        const refreshResponse = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: process.env.BEGGINS_GOOGLE_CLIENT_ID!,
            client_secret: process.env.BEGGINS_GOOGLE_CLIENT_SECRET!,
            refresh_token: tokens.tokens.refresh_token,
            grant_type: "refresh_token",
          }),
        })

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json()
          
          // Update tokens in database
          await oauthTokens.store(
            fromEmail,
            "century21-beggins",
            refreshData.access_token,
            tokens.tokens.refresh_token,
            refreshData.expires_in,
            tokens.tokens.scope
          )

          // Retry sending email with new token
          const retryResponse = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${refreshData.access_token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              raw: encodedMessage,
            }),
          })

          if (retryResponse.ok) {
            const retryData = await retryResponse.json()
            console.log("Beggins Gmail email sent successfully after token refresh:", retryData.id)
            return NextResponse.json({
              success: true,
              messageId: retryData.id,
              message: "Email sent successfully via Gmail",
              tenant: "century21-beggins",
            })
          }
        }
      }

      return NextResponse.json(
        { error: "Failed to send email via Gmail" },
        { status: 500 }
      )
    }

    const gmailData = await gmailResponse.json()
    console.log("Beggins Gmail email sent successfully:", gmailData.id)

    // Update last used timestamp
    await oauthTokens.updateLastUsed(fromEmail, "century21-beggins")

    return NextResponse.json({
      success: true,
      messageId: gmailData.id,
      message: "Email sent successfully via Gmail",
      tenant: "century21-beggins",
    })
  } catch (error) {
    console.error("Error sending Beggins Gmail email:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to send email",
        tenant: "century21-beggins",
      },
      { status: 500 }
    )
  }
}
