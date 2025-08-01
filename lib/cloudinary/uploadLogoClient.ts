export async function uploadLogoClientSide(file: File): Promise<string> {
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "")
    formData.append("folder", "dynamic-content-logos")

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    )

    if (!response.ok) {
      throw new Error("Failed to upload logo")
    }

    const result = await response.json()

    // Return just the filename part (without folder prefix)
    const publicId = result.public_id.replace("dynamic-content-logos/", "")
    return publicId
  } catch (error) {
    console.error("Error uploading logo client-side:", error)
    throw new Error("Failed to upload logo")
  }
}
