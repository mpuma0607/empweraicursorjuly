"use server"

import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export type CloudinaryImage = {
  public_id: string
  secure_url: string
  format: string
  width: number
  height: number
  filename: string
}

export type ContactInfo = {
  name: string
  email: string
  phone: string
} | null

export type BrandingParams = {
  publicId: string
  brandingChoice: "saved-brand" | "saved-logo" | "dropdown"
  logoIdentifier: string
  contactInfo: ContactInfo
  textColor?: "white" | "black"
}

export type BrandingResult = {
  url: string
}

// Fetch images from a Cloudinary folder
export async function fetchCloudinaryImages(folderPath: string): Promise<CloudinaryImage[]> {
  try {
    console.log(`Fetching images from Cloudinary folder: ${folderPath}`)
    const result = await cloudinary.search
      .expression(`folder:${folderPath}`)
      .sort_by("filename", "asc")
      .max_results(100)
      .execute()

    console.log(`Found ${result.resources.length} images in ${folderPath}`)

    return result.resources.map((resource: any) => ({
      public_id: resource.public_id,
      secure_url: resource.secure_url,
      format: resource.format,
      width: resource.width,
      height: resource.height,
      filename: resource.filename || resource.public_id.split("/").pop() || "image",
    }))
  } catch (error) {
    console.error(`Error fetching images from ${folderPath}:`, error)
    return [] // Return empty array instead of throwing
  }
}

// Apply branding transformation to an image
export async function applyBrandingTransformation(params: BrandingParams): Promise<BrandingResult> {
  try {
    const { publicId, brandingChoice, logoIdentifier, contactInfo, textColor = "white" } = params

    console.log("Applying branding transformation:", {
      publicId,
      brandingChoice,
      hasLogoIdentifier: !!logoIdentifier,
      hasContactInfo: !!contactInfo,
      textColor,
    })

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    if (!cloudName) {
      throw new Error("Cloudinary cloud name not configured")
    }

    const transformations: string[] = []

    // 1. Base image format - 1080x1080 to match grid display, maintaining aspect ratio
    transformations.push("c_fit,w_1080,h_1080")

    // 2. Logo overlay
    if (logoIdentifier) {
      transformations.push(`l_${logoIdentifier},w_150,g_south_east,x_30,y_30`)
    }

    // 3. Contact info text overlay
    if (contactInfo && contactInfo.name) {
      const contactParts = [contactInfo.name, contactInfo.email, contactInfo.phone].filter(Boolean)
      const contactText = contactParts.join(" | ")
      const encoded = encodeURIComponent(contactText)
      const colorCode = textColor === "black" ? "co_black" : "co_white"
      transformations.push(`l_text:Arial_24_bold:${encoded},${colorCode},g_south_west,x_30,y_30`)
    }

    // 4. Combine full URL
    const transformationPath = transformations.join("/")
    const fullUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${transformationPath}/${publicId}`

    console.log("Generated branded URL:", fullUrl)

    return {
      url: fullUrl,
    }
  } catch (error) {
    console.error("Error applying branding transformation:", error)
    throw new Error(`Failed to apply branding: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
