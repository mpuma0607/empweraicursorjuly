"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface CMAEmailData {
  email: string
  address: string
  analysisText: string
  comparableData: {
    totalComparables: number
    comparables: any[]
    summary: {
      averagePrice: number
      averageSqft: number
      priceRange: { min: number; max: number }
    }
  }
}

export async function sendCMAEmail(data: CMAEmailData) {
  try {
    console.log("Sending CMA email to:", data.email)

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header with Century 21 Branding -->
        <div style="background: linear-gradient(135deg, #b6a888 0%, #000000 100%); padding: 30px; text-align: center; position: relative;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🏠 QuickCMA Report</h1>
          <p style="color: #f5f5dc; margin: 10px 0 0 0; font-size: 18px;">
            Comparative Market Analysis
          </p>
          <p style="color: #e6d7c3; margin: 5px 0 0 0; font-size: 16px;">
            ${data.address}
          </p>
          <!-- Century 21 Logo -->
          <div style="position: absolute; bottom: 10px; right: 20px; opacity: 0.8;">
            <span style="color: white; font-size: 12px;">Powered by Century 21</span>
          </div>
        </div>

        <!-- Content -->
        <div style="padding: 30px;">
          <!-- Market Summary with Vegas Gold Accents -->
          <div style="background: #faf9f7; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #b6a888;">
            <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 20px;">Market Summary</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
              <div>
                <strong style="color: #b6a888;">Average Price:</strong><br>
                <span style="font-size: 18px; font-weight: bold; color: #b6a888;">$${data.comparableData.summary.averagePrice.toLocaleString()}</span>
              </div>
              <div>
                <strong style="color: #b6a888;">Average Size:</strong><br>
                <span style="font-size: 18px; font-weight: bold; color: #b6a888;">${data.comparableData.summary.averageSqft.toLocaleString()} sq ft</span>
              </div>
              <div>
                <strong style="color: #b6a888;">Comparables:</strong><br>
                <span style="font-size: 18px; font-weight: bold; color: #b6a888;">${data.comparableData.totalComparables} properties</span>
              </div>
            </div>
          </div>

          <!-- Top Comparables -->
          <h2 style="color: #1e293b; margin-bottom: 20px;">Top Comparable Properties</h2>
          ${data.comparableData.comparables
            .slice(0, 5)
            .map(
              (comp, index) => `
            <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 15px; border-left: 4px solid #b6a888;">
              <h3 style="color: #1e293b; margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">
                ${index + 1}. ${comp.address || "Address not available"}
              </h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; font-size: 14px;">
                <div><strong>Price:</strong> <span style="color: #b6a888; font-weight: bold;">$${comp.price?.toLocaleString() || "N/A"}</span></div>
                <div><strong>Bed/Bath:</strong> ${comp.bedrooms || 0}BR/${comp.bathrooms || 0}BA</div>
                <div><strong>Sq Ft:</strong> ${comp.sqft?.toLocaleString() || "N/A"}</div>
                <div><strong>$/Sq Ft:</strong> <span style="color: #b6a888; font-weight: bold;">$${comp.pricePerSqft || "N/A"}</span></div>
              </div>
            </div>
          `,
            )
            .join("")}

          <!-- AI Analysis -->
          <div style="margin-top: 30px;">
            <h2 style="color: #1e293b; margin-bottom: 20px;">AI Market Analysis</h2>
            <div style="background: #faf9f7; padding: 20px; border-radius: 8px; border-left: 4px solid #b6a888;">
              ${data.analysisText.replace(/\n/g, "<br>")}
            </div>
          </div>

          <!-- Guidelines -->
          <div style="margin-top: 40px; padding-top: 30px; border-top: 2px solid #e2e8f0;">
            <p style="margin: 0 0 10px 0;"><strong>Professional Use Guidelines:</strong></p>
            <ul style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li>This CMA is generated using current market data and AI analysis</li>
              <li>Verify all property details independently before making decisions</li>
              <li>Consider local market conditions and property-specific factors</li>
              <li>Consult with local real estate professionals for detailed analysis</li>
            </ul>
          </div>

          <!-- Footer -->
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="margin: 0 0 10px 0;">Thank you for using QuickCMA AI powered by Century 21.</p>
            <p style="margin: 0;">For more tools and insights, visit <a href="https://getempowerai.com" style="color: #b6a888; text-decoration: none;">getempowerai.com</a></p>
          </div>
        </div>

        <!-- Bottom Footer with Century 21 Branding -->
        <div style="background: linear-gradient(135deg, #b6a888 0%, #000000 100%); padding: 20px; text-align: center; color: white; font-size: 12px;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Century 21 • Powered by The Next Level U</p>
          <p style="margin: 5px 0 0 0;">Generated on ${new Date().toLocaleDateString()} • ${data.comparableData.totalComparables} comparables analyzed</p>
        </div>
      </div>
    `

    const result = await resend.emails.send({
      from: "QuickCMA AI <noreply@marketing.getempowerai.com>",
      to: [data.email],
      subject: `CMA Report: ${data.address.split(",")[0]} - Century 21`,
      html: emailHtml,
    })

    if (result.error) {
      console.error("Resend API error:", result.error)
      throw new Error(`Failed to send email: ${result.error.message}`)
    }

    console.log("Email sent successfully:", result.data?.id)
    return { success: true, messageId: result.data?.id }
  } catch (error) {
    console.error("Error in sendCMAEmail:", error)
    throw error
  }
}
