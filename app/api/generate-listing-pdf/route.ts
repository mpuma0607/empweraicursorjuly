import { type NextRequest, NextResponse } from "next/server"
import { jsPDF } from "jspdf"

export async function POST(request: NextRequest) {
  try {
    const { formData, description } = await request.json()

    // Create PDF using jsPDF with text content
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // Set up fonts and colors
    pdf.setFont("helvetica")

    // Header section with Vegas Gold background
    pdf.setFillColor(182, 168, 136) // Vegas Gold color
    pdf.rect(0, 0, 210, 40, "F")

    // Header text
    pdf.setTextColor(255, 255, 255) // White text
    pdf.setFontSize(24)
    pdf.text("Professional Listing Description", 105, 20, { align: "center" })
    pdf.setFontSize(12)
    pdf.text("Generated by ListIT - The Next Level U", 105, 30, { align: "center" })

    // Reset text color to black
    pdf.setTextColor(0, 0, 0)

    // Property title and price
    pdf.setFontSize(18)
    pdf.setFont("helvetica", "bold")
    pdf.text(formData.propertyAddress, 20, 60)

    // Ensure price has $ and commas
    let formattedPrice = formData.listingPrice
    if (!formattedPrice.includes("$")) {
      formattedPrice = `$${formattedPrice}`
    }
    if (!formattedPrice.includes(",") && formattedPrice.length > 4) {
      const priceWithoutSymbol = formattedPrice.replace("$", "")
      const priceNum = Number.parseFloat(priceWithoutSymbol)
      if (!isNaN(priceNum)) {
        formattedPrice = `$${priceNum.toLocaleString()}`
      }
    }

    pdf.setTextColor(182, 168, 136) // Vegas Gold
    pdf.setFontSize(16)
    pdf.text(formattedPrice, 20, 70)

    // Property details
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(10)
    pdf.text(
      `${formData.bedrooms} Bedrooms • ${formData.bathrooms} Bathrooms • ${formData.squareFootage} Sq Ft`,
      20,
      80,
    )

    // Divider line
    pdf.setDrawColor(229, 231, 235)
    pdf.line(20, 85, 190, 85)

    // Description
    pdf.setFontSize(11)
    pdf.setFont("helvetica", "normal")
    const splitDescription = pdf.splitTextToSize(description, 170)
    pdf.text(splitDescription, 20, 95)

    // Calculate where description ends
    const descriptionHeight = splitDescription.length * 5
    let currentY = 95 + descriptionHeight + 10

    // Key Features section
    pdf.setFontSize(10)
    pdf.setFont("helvetica", "bold")
    pdf.setTextColor(107, 114, 128)
    pdf.text("KEY FEATURES", 20, currentY)

    currentY += 8
    pdf.setFont("helvetica", "normal")
    pdf.setTextColor(75, 85, 99)
    pdf.text(`• ${formData.feature1}`, 20, currentY)
    currentY += 5
    pdf.text(`• ${formData.feature2}`, 20, currentY)
    currentY += 5
    pdf.text(`• ${formData.feature3}`, 20, currentY)
    currentY += 5
    pdf.text(`• ${formData.feature4}`, 20, currentY)
    currentY += 5
    pdf.text(`• ${formData.feature5}`, 20, currentY)

    // Footer
    currentY += 20
    pdf.setFillColor(249, 250, 251)
    pdf.rect(0, currentY, 210, 30, "F")

    pdf.setFontSize(8)
    pdf.setTextColor(107, 114, 128)
    pdf.text("© 2024 The Next Level U - Empowering Real Estate Professionals", 105, currentY + 10, { align: "center" })
    pdf.text("Generated with AI-powered tools designed for real estate success", 105, currentY + 16, {
      align: "center",
    })
    pdf.text(`Listing Agent: ${formData.agentName}`, 105, currentY + 22, { align: "center" })

    const pdfBuffer = Buffer.from(pdf.output("arraybuffer"))

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${formData.propertyAddress.replace(/\s+/g, "_")}_Listing_Description.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
