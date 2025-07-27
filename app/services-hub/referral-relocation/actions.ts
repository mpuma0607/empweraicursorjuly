"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface ReferralFormData {
  yourName: string
  yourEmail: string
  yourPhone: string
  primaryClientName: string
  secondaryClientName?: string
  primaryClientPhone: string
  secondaryClientPhone?: string
  primaryClientEmail: string
  secondaryClientEmail?: string
  currentLocation: string
  desiredLocation: string
  timeline: string
  knowAgent: boolean
  agentName?: string
  agentEmail?: string
  agentPhone?: string
  additionalDetails?: string
}

export async function submitReferralForm(formData: ReferralFormData) {
  try {
    const emailContent = `
      <h2>New Agent Referral Form</h2>
      
      <h3>Agent Information:</h3>
      <p><strong>Name:</strong> ${formData.yourName}</p>
      <p><strong>Email:</strong> ${formData.yourEmail}</p>
      <p><strong>Phone:</strong> ${formData.yourPhone}</p>
      
      <h3>Primary Client Information:</h3>
      <p><strong>Name:</strong> ${formData.primaryClientName}</p>
      <p><strong>Phone:</strong> ${formData.primaryClientPhone}</p>
      <p><strong>Email:</strong> ${formData.primaryClientEmail}</p>
      
      ${
        formData.secondaryClientName
          ? `
      <h3>Secondary Client Information:</h3>
      <p><strong>Name:</strong> ${formData.secondaryClientName}</p>
      <p><strong>Phone:</strong> ${formData.secondaryClientPhone || "Not provided"}</p>
      <p><strong>Email:</strong> ${formData.secondaryClientEmail || "Not provided"}</p>
      `
          : ""
      }
      
      <h3>Location & Timeline:</h3>
      <p><strong>Current Location:</strong> ${formData.currentLocation}</p>
      <p><strong>Desired Location:</strong> ${formData.desiredLocation}</p>
      <p><strong>Timeline:</strong> ${formData.timeline}</p>
      
      <h3>Preferred Agent:</h3>
      <p><strong>Know Agent:</strong> ${formData.knowAgent ? "Yes" : "No"}</p>
      ${
        formData.knowAgent && formData.agentName
          ? `
      <p><strong>Agent Name:</strong> ${formData.agentName}</p>
      <p><strong>Agent Email:</strong> ${formData.agentEmail || "Not provided"}</p>
      <p><strong>Agent Phone:</strong> ${formData.agentPhone || "Not provided"}</p>
      `
          : ""
      }
      
      ${
        formData.additionalDetails
          ? `
      <h3>Additional Details:</h3>
      <p>${formData.additionalDetails}</p>
      `
          : ""
      }
    `

    const { data, error } = await resend.emails.send({
      from: "Beggins University <noreply@thenextlevelu.com>",
      to: ["relocation@c21be.com", "mikepuma@c21be.com"],
      subject: "New Agent Referral Form",
      html: emailContent,
    })

    if (error) {
      console.error("Error sending email:", error)
      return { success: false, error: "Failed to send email" }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in submitReferralForm:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
