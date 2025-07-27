"use server"

export async function submitSupportRequest(prevState: any, formData: FormData) {
  console.log("Support request action called")

  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const issue = formData.get("issue") as string

    console.log("Form data:", { name: !!name, email: !!email, phone: !!phone, issue: !!issue })

    // Validate required fields
    if (!name || !email || !issue) {
      console.log("Validation failed - missing required fields")
      return {
        success: false,
        error: true,
        message: "Please fill in all required fields.",
      }
    }

    const requestData = {
      name,
      email,
      phone: phone || "Not provided",
      issue,
    }

    console.log("Sending request to API...")

    // Send email using the same pattern as other tools
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/send-support-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      },
    )

    console.log("API response status:", response.status)

    const result = await response.json()
    console.log("API response data:", result)

    if (!response.ok) {
      console.error("API request failed:", result)
      throw new Error(result.message || result.error || "Failed to send support request")
    }

    console.log("Support request successful")
    return {
      success: true,
      error: false,
      message: "Your support request has been submitted successfully! We'll get back to you within 24 hours.",
    }
  } catch (error) {
    console.error("Support request action error:", error)
    return {
      success: false,
      error: true,
      message: `Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`,
    }
  }
}
