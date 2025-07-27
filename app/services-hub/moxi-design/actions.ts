"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function submitProjectInquiry(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const service = formData.get("service") as string
    const message = formData.get("message") as string

    const serviceLabels: { [key: string]: string } = {
      website: "Moxi Website Design ($500+)",
      landing: "Custom Landing Pages ($100/page)",
      presentation: "Moxi Presentations ($150/presentation)",
      email: "Email Campaign Development ($150/campaign)",
      custom: "Custom Project",
    }

    const emailContent = `
      <h2>New Moxi Design Project Inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
      <p><strong>Service:</strong> ${serviceLabels[service] || service || "Not specified"}</p>
      <p><strong>Project Details:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `

    await resend.emails.send({
      from: "noreply@thenextlevelu.com",
      to: "MikePuma@c21be.com",
      subject: `New Moxi Design Inquiry from ${name}`,
      html: emailContent,
    })

    return {
      success: true,
      message: "Your project inquiry has been sent successfully! We'll get back to you within 24 hours.",
    }
  } catch (error) {
    console.error("Error sending project inquiry:", error)
    return {
      success: false,
      message: "There was an error sending your inquiry. Please try again or contact us directly.",
    }
  }
}
