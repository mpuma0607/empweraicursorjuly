"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function submitConsultingInquiry(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const company = formData.get("company") as string
    const service = formData.get("service") as string
    const delivery = formData.get("delivery") as string
    const message = formData.get("message") as string

    const serviceLabels: { [key: string]: string } = {
      moxi: "Moxi Works Training",
      ai: "AI Integration & Training",
      marketing: "Marketing & Lead Generation",
      sales: "Sales & Connection Skills",
      recruiting: "Agent Recruiting",
      leadership: "Leadership & Team Building",
      comprehensive: "Comprehensive Consulting",
      other: "Other",
    }

    const deliveryLabels: { [key: string]: string } = {
      "in-person": "In-Person Consulting",
      webinar: "Virtual Webinar",
      hybrid: "Combination of Both",
      flexible: "Flexible - Let's Discuss",
    }

    const emailContent = `
      <h2>New Brokerage Consulting Inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
      <p><strong>Brokerage/Company:</strong> ${company || "Not provided"}</p>
      <p><strong>Area of Interest:</strong> ${serviceLabels[service] || service || "Not specified"}</p>
      <p><strong>Preferred Delivery:</strong> ${deliveryLabels[delivery] || delivery || "Not specified"}</p>
      <p><strong>Consulting Needs:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `

    await resend.emails.send({
      from: "noreply@marketing.thenextlevelu.com",
      to: "MikePuma@c21be.com",
      subject: `New Brokerage Consulting Inquiry from ${name}`,
      html: emailContent,
    })

    return {
      success: true,
      message:
        "Your consulting inquiry has been sent successfully! We'll get back to you within 24 hours to discuss your needs.",
    }
  } catch (error) {
    console.error("Error sending consulting inquiry:", error)
    return {
      success: false,
      message: "There was an error sending your inquiry. Please try again or contact us directly.",
    }
  }
}

export async function submitNotificationRequest(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const company = formData.get("company") as string
    const service = formData.get("service") as string
    const message = formData.get("message") as string

    const serviceLabels: { [key: string]: string } = {
      moxi: "Moxi Works Training",
      ai: "AI Integration & Training",
      marketing: "Marketing & Lead Generation",
      sales: "Sales & Connection Skills",
      recruiting: "Agent Recruiting",
      leadership: "Leadership & Team Building",
      comprehensive: "Comprehensive Consulting",
      other: "Other",
    }

    const emailContent = `
      <h2>New Service Notification Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
      <p><strong>Brokerage/Company:</strong> ${company || "Not provided"}</p>
      <p><strong>Service Interest:</strong> ${serviceLabels[service] || service || "Not specified"}</p>
      <p><strong>Additional Details:</strong></p>
      <p>${message?.replace(/\n/g, "<br>") || "No additional details provided"}</p>
    `

    await resend.emails.send({
      from: "noreply@marketing.thenextlevelu.com",
      to: "MikePuma@c21be.com",
      subject: `Service Notification Request from ${name}`,
      html: emailContent,
    })

    return {
      success: true,
      message: "Thank you! We'll notify you when this service becomes available.",
    }
  } catch (error) {
    console.error("Error sending notification request:", error)
    return {
      success: false,
      message: "There was an error processing your request. Please try again or contact us directly.",
    }
  }
}
