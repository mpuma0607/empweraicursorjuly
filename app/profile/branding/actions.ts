"use server"

import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface UserBrandingProfile {
  user_id: string
  user_email: string
  brand: string
  brokerage: string
  custom_logo_url: string | null
  logo_public_id: string | null
  preferences: { auto_brand: boolean }
  tenant_id: string
}

export async function getUserBrandingProfile(userId: string, tenantId: string) {
  try {
    const result = await sql`
      SELECT * FROM user_branding_profiles 
      WHERE user_id = ${userId} AND tenant_id = ${tenantId}
      LIMIT 1
    `
    if (result.length > 0) {
      return result[0] as UserBrandingProfile
    }
    return null
  } catch (error) {
    console.error("Error fetching user branding profile:", error)
    throw error
  }
}

export async function saveUserBrandingProfile(profile: UserBrandingProfile) {
  try {
    const result = await sql`
      INSERT INTO user_branding_profiles (
        user_id, user_email, brand, brokerage, custom_logo_url, 
        logo_public_id, preferences, tenant_id
      ) VALUES (
        ${profile.user_id}, ${profile.user_email}, ${profile.brand}, 
        ${profile.brokerage}, ${profile.custom_logo_url},
        ${profile.logo_public_id}, ${JSON.stringify(profile.preferences)},
        ${profile.tenant_id}
      )
      ON CONFLICT (user_id, tenant_id) 
      DO UPDATE SET
        user_email = EXCLUDED.user_email,
        brand = EXCLUDED.brand,
        brokerage = EXCLUDED.brokerage,
        custom_logo_url = EXCLUDED.custom_logo_url,
        logo_public_id = EXCLUDED.logo_public_id,
        preferences = EXCLUDED.preferences,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `
    return {
      success: true,
      data: result[0] as UserBrandingProfile,
    }
  } catch (error) {
    console.error("Error saving user branding profile:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function uploadBrandingLogo(formData: FormData) {
  const file = formData.get("logo") as File
  if (!file) {
    throw new Error("No file provided")
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary configuration missing")
  }

  console.log("=== BRANDING LOGO UPLOAD START (FormData Method) ===")
  console.log("Logo file details:", {
    name: file.name,
    size: file.size,
    type: file.type,
  })

  try {
    // Convert File to Blob for FormData upload (same as Idea Hub V2)
    console.log("Converting File to ArrayBuffer...")
    const arrayBuffer = await file.arrayBuffer()
    const blob = new Blob([arrayBuffer], { type: file.type })

    console.log("Creating FormData for logo upload...")
    // Create FormData for upload - EXACT SAME METHOD AS IDEA HUB V2
    const uploadFormData = new FormData()
    uploadFormData.append("file", blob, file.name)
    uploadFormData.append("upload_preset", uploadPreset)
    uploadFormData.append("folder", "branding-logos")

    console.log("Uploading logo with FormData (NO base64)...")
    // Upload using FormData - EXACT SAME METHOD AS IDEA HUB V2
    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: uploadFormData, // Pure FormData, no JSON
    })

    const result = await uploadResponse.json()

    console.log("Logo upload response:", {
      ok: uploadResponse.ok,
      status: uploadResponse.status,
      result: result,
    })

    if (!uploadResponse.ok) {
      throw new Error(`Logo upload failed: ${result.error?.message || JSON.stringify(result)}`)
    }

    // Extract clean public_id (remove folder prefix if present)
    let publicId = result.public_id
    console.log("Original logo public_id:", publicId)

    if (publicId.startsWith("branding-logos/")) {
      publicId = publicId.replace("branding-logos/", "")
      console.log("Cleaned logo public_id:", publicId)
    }

    console.log("=== BRANDING LOGO UPLOAD SUCCESS ===")
    return {
      success: true,
      data: {
        url: result.secure_url,
        public_id: publicId,
      },
    }
  } catch (error) {
    console.error("=== BRANDING LOGO UPLOAD ERROR ===")
    console.error("Error details:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    }
  }
}

export async function deleteUserBrandingProfile(userId: string, tenantId: string) {
  try {
    // First get the profile to check for logo
    const profile = await getUserBrandingProfile(userId, tenantId)

    if (profile?.logo_public_id) {
      // Delete logo from Cloudinary using unsigned method
      try {
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME
        const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET

        if (cloudName && uploadPreset) {
          const deleteFormData = new FormData()
          deleteFormData.append("public_id", profile.logo_public_id)
          deleteFormData.append("upload_preset", uploadPreset)

          await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
            method: "POST",
            body: deleteFormData,
          })
        }
      } catch (cloudinaryError) {
        console.error("Error deleting logo from Cloudinary:", cloudinaryError)
        // Continue with database deletion even if Cloudinary fails
      }
    }

    // Delete from database
    await sql`
      DELETE FROM user_branding_profiles 
      WHERE user_id = ${userId} AND tenant_id = ${tenantId}
    `

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting user branding profile:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Delete failed",
    }
  }
}
