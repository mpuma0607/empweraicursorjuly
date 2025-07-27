const { v2: cloudinary } = require("cloudinary")

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

async function convertPrivateToPublic() {
  console.log("🚀 Starting conversion of private assets to public...")
  console.log(`📁 Target folder: social-content`)

  try {
    // Search for all private assets in social-content folder
    console.log("🔍 Searching for private assets...")

    const searchResult = await cloudinary.search
      .expression("folder:social-content/* AND resource_type:image")
      .sort_by("created_at", "desc")
      .max_results(500)
      .execute()

    console.log(`📊 Found ${searchResult.resources.length} total assets`)

    // Filter for private assets only
    const privateAssets = searchResult.resources.filter(
      (asset) => asset.access_mode === "private" || asset.delivery_type === "private",
    )

    console.log(`🔒 Found ${privateAssets.length} private assets to convert`)

    if (privateAssets.length === 0) {
      console.log("✅ No private assets found. All assets are already public!")
      return
    }

    let successCount = 0
    let errorCount = 0
    const errors = []

    // Process assets in batches of 10 to avoid rate limits
    const batchSize = 10
    for (let i = 0; i < privateAssets.length; i += batchSize) {
      const batch = privateAssets.slice(i, i + batchSize)

      console.log(
        `\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(privateAssets.length / batchSize)}`,
      )

      const batchPromises = batch.map(async (asset) => {
        try {
          console.log(`  🔄 Converting: ${asset.public_id}`)

          // Use rename method to convert from private to public
          const result = await cloudinary.uploader.rename(asset.public_id, asset.public_id, {
            type: "private",
            to_type: "upload",
            invalidate: true,
          })

          console.log(`  ✅ Success: ${asset.public_id}`)
          return { success: true, publicId: asset.public_id }
        } catch (error) {
          console.log(`  ❌ Error: ${asset.public_id} - ${error.message}`)
          return { success: false, publicId: asset.public_id, error: error.message }
        }
      })

      // Wait for batch to complete
      const batchResults = await Promise.all(batchPromises)

      // Count results
      batchResults.forEach((result) => {
        if (result.success) {
          successCount++
        } else {
          errorCount++
          errors.push(result)
        }
      })

      // Add delay between batches to respect rate limits
      if (i + batchSize < privateAssets.length) {
        console.log("  ⏳ Waiting 2 seconds before next batch...")
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }

    // Final report
    console.log("\n📈 CONVERSION COMPLETE!")
    console.log(`✅ Successfully converted: ${successCount} assets`)
    console.log(`❌ Failed conversions: ${errorCount} assets`)

    if (errors.length > 0) {
      console.log("\n🚨 ERRORS:")
      errors.forEach((error) => {
        console.log(`  - ${error.publicId}: ${error.error}`)
      })
    }

    console.log("\n🎉 Your Dynamic Branded Content page should now work properly!")
  } catch (error) {
    console.error("💥 Fatal error during conversion:", error)
    process.exit(1)
  }
}

// Run the conversion
convertPrivateToPublic()
  .then(() => {
    console.log("\n✨ Script completed successfully!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("💥 Script failed:", error)
    process.exit(1)
  })
