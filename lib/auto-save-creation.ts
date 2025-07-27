interface SaveCreationParams {
  userId: string
  userEmail: string
  toolType: string
  title: string
  content: string
  formData?: any
  metadata?: any
}

export async function saveUserCreation(params: SaveCreationParams): Promise<{ success: boolean; error?: string }> {
  try {
    // Don't save RealDeal contract analyses
    if (params.toolType === "realdeal-ai") {
      console.log("Skipping save for RealDeal contract analysis (security policy)")
      return { success: true }
    }

    console.log("Saving user creation:", params)

    const response = await fetch("/api/user-creations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to save creation")
    }

    const result = await response.json()
    console.log("Creation saved successfully:", result)
    return { success: true }
  } catch (error) {
    console.error("Error saving creation:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to save creation" }
  }
}

// Auto-save function that can be called automatically
export async function autoSaveCreation(params: SaveCreationParams): Promise<void> {
  try {
    const result = await saveUserCreation(params)
    if (!result.success) {
      console.warn("Auto-save failed:", result.error)
    }
  } catch (error) {
    console.warn("Auto-save error:", error)
    // Don't throw error for auto-save failures to avoid disrupting user experience
  }
}

// Helper function to generate titles for different tool types
export function generateCreationTitle(toolType: string, formData: any): string {
  switch (toolType) {
    case "listit-ai":
      return `Listing: ${formData.propertyAddress || "Property"}`
    case "realbio":
      return `Bio: ${formData.agentName || "Agent"}`
    case "scriptit-ai":
      return `Script: ${formData.scriptType || "Custom"}`
    case "quickcma-ai":
      return `CMA: ${formData.address || "Property"}`
    case "action-ai":
      return `Action Plan: ${new Date().toLocaleDateString()}`
    case "bizplan-ai":
      return `Business Plan: ${formData.agentName || "Agent"}`
    case "ideahub-ai":
      return `${formData.contentType || "Content"}: ${formData.primaryTopic || formData.alternateTopic || "Social Media"}`
    case "goalscreen-ai":
      return `Goal Wallpaper: ${new Date().toLocaleDateString()}`
    case "realcoach-ai":
      return `Coaching: ${formData.focusArea || "Business"}`
    default:
      return `${toolType}: ${new Date().toLocaleDateString()}`
  }
}
