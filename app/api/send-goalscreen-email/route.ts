import { Resend } from "resend"
import { type NextRequest, NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, monthlyIncome, dailyContacts } = body

    const data = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Your Goal Screen Results",
      html: `
        <p>Hi ${firstName} ${lastName},</p>
        <p>Here are your Goal Screen results:</p>
        <ul>
          <li>Monthly Income Goal: $${monthlyIncome}</li>
          <li>Daily Contacts Needed: ${dailyContacts}</li>
        </ul>
        <p>
          Your success formula: ${Math.ceil(monthlyIncome / 9500)} deals → ${Math.ceil(monthlyIncome / 9500 / 0.8)} appointments → ${Math.ceil(monthlyIncome / 9500 / 0.8 / 0.08)} conversations → ${dailyContacts} daily contacts
        </p>
      `,
    })

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error })
  }
}
