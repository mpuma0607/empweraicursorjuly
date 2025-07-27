import { type NextRequest, NextResponse } from "next/server"
import { jsPDF } from "jspdf"

export async function POST(request: NextRequest) {
  try {
    const { content, name, email } = await request.json()

    // Create PDF using jsPDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // Set up fonts and colors
    pdf.setFont("helvetica")

    // Header section with Vegas Gold background
    pdf.setFillColor(182, 168, 136) // Vegas Gold color (#b6a888)
    pdf.rect(0, 0, 210, 40, "F")

    // Header text
    pdf.setTextColor(255, 255, 255) // White text
    pdf.setFontSize(24)
    pdf.text("RealCoach AI - Coaching Plan", 105, 20, { align: "center" })
    pdf.setFontSize(12)
    pdf.text(`Generated for ${name} - ${new Date().toLocaleDateString()}`, 105, 30, { align: "center" })

    // Reset text color to black
    pdf.setTextColor(0, 0, 0)

    // Add agent name
    pdf.setFontSize(16)
    pdf.setFont("helvetica", "bold")
    pdf.text(`Coaching Plan for ${name}`, 20, 55)

    // Add content with better formatting
    let currentY = 70
    const lines = content.split("\n").filter((line) => line.trim() !== "")

    for (const line of lines) {
      if (currentY > 270) {
        pdf.addPage()
        currentY = 20
      }

      // Clean the line of HTML tags and extra whitespace
      const cleanLine = line.replace(/<[^>]*>/g, "").trim()

      if (!cleanLine) continue

      // Check for headers (lines that start with emojis or contain certain keywords)
      if (
        cleanLine.match(/^[🔍📱📞📧📊🎯💡⭐]/u) ||
        cleanLine.includes("STRATEGY:") ||
        cleanLine.includes("ACTION PLAN:") ||
        cleanLine.includes("SCRIPTS:") ||
        cleanLine.toLowerCase().includes("week ")
      ) {
        pdf.setTextColor(182, 168, 136) // Vegas Gold color
        pdf.setFontSize(12)
        pdf.setFont("helvetica", "bold")
      } else {
        pdf.setTextColor(0, 0, 0)
        pdf.setFontSize(10)
        pdf.setFont("helvetica", "normal")
      }

      const splitText = pdf.splitTextToSize(cleanLine, 170)
      pdf.text(splitText, 20, currentY)
      currentY += splitText.length * 5 + 3
    }

    // Footer
    pdf.setFillColor(249, 250, 251)
    pdf.rect(0, 277, 210, 20, "F")

    pdf.setFontSize(8)
    pdf.setTextColor(107, 114, 128)
    pdf.text("© 2024 The Next Level U - RealCoach AI", 105, 283, { align: "center" })
    pdf.text("Empowering Real Estate Professionals with AI-powered coaching", 105, 288, {
      align: "center",
    })

    const pdfBuffer = Buffer.from(pdf.output("arraybuffer"))

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="RealCoach_Plan_${name.replace(/\s+/g, "_")}_${new Date().toLocaleDateString().replace(/\//g, "-")}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
