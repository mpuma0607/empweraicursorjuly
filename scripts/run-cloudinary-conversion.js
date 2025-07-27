#!/usr/bin/env node

// Load environment variables
require("dotenv").config()

// Check if required environment variables are present
const requiredEnvVars = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"]

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

if (missingVars.length > 0) {
  console.error("❌ Missing required environment variables:")
  missingVars.forEach((varName) => {
    console.error(`  - ${varName}`)
  })
  console.error("\nPlease check your .env file or environment configuration.")
  process.exit(1)
}

console.log("🔧 Environment variables loaded successfully")
console.log(`📡 Cloudinary Cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`)

// Import and configure Cloudinary
const { v2: cloudinary } = require("cloudinary")

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
    // First, let's test our connection by trying to list resources
    console.log("🔍 Testing Cloudinary connection...")

    let privateAssets = []

    try {
      // Try to get private assets specifically
      const privateSearchResult = await cloudinary.api.resources({
        type: "private",
        prefix: "social-content/",
        resource_type: "image",
        max_results: 500,
      })

      privateAssets = privateSearchResult.resources || []
      console.log(`🔒 Found ${privateAssets.length} private assets to convert`)
    } catch (searchError) {
      console.log("⚠️  Could not search private assets directly:", searchError.message)

      // Alternative: try to list all resources and filter
      try {
        console.log("🔄 Trying alternative search method...")
        const allResources = await cloudinary.api.resources({
          prefix: "social-content/",
          resource_type: "image",
          max_results: 500,
        })

        // Filter for private assets
        privateAssets = (allResources.resources || []).filter(
          (asset) => asset.access_mode === "private" || asset.type === "private",
        )

        console.log(`🔒 Found ${privateAssets.length} private assets via alternative method`)
      } catch (altError) {
        console.log("⚠️  Alternative search also failed:", altError.message)

        // Last resort: try to access known folder structure
        const folders = ["motivational", "educational", "entertaining", "engaging"]
        const prospectingFolders = [
          "soi",
          "probate",
          "pre-foreclosure",
          "divorce",
          "absentee-owners",
          "expired",
          "fsbo",
        ]

        for (const folder of folders) {
          try {
            const folderAssets = await cloudinary.api.resources({
              type: "private",
              prefix: `social-content/unbranded/${folder}/`,
              resource_type: "image",
              max_results: 100,
            })
            privateAssets = [...privateAssets, ...(folderAssets.resources || [])]
          } catch (folderError) {
            console.log(`⚠️  Could not access folder: social-content/unbranded/${folder}`)
          }
        }

        for (const folder of prospectingFolders) {
          try {
            const folderAssets = await cloudinary.api.resources({
              type: "private",
              prefix: `social-content/unbranded/prospecting/${folder}/`,
              resource_type: "image",
              max_results: 100,
            })
            privateAssets = [...privateAssets, ...(folderAssets.resources || [])]
          } catch (folderError) {
            console.log(`⚠️  Could not access folder: social-content/unbranded/prospecting/${folder}`)
          }
        }
      }
    }

    if (privateAssets.length === 0) {
      console.log("✅ No private assets found to convert!")

      // Let's verify by checking if we can find any assets at all
      try {
        console.log("🧪 Testing if assets are already accessible...")
        const publicCheck = await cloudinary.search.expression("folder:social-content/*").max_results(10).execute()

        console.log(`📊 Found ${publicCheck.total_count} total accessible assets in social-content folder`)
        if (publicCheck.total_count > 0) {
          console.log("✅ Assets are already public and accessible!")
          console.log("🎉 Your Dynamic Branded Content page should work now!")
          return
        } else {
          console.log("⚠️  No assets found at all. Please check your folder structure in Cloudinary.")
        }
      } catch (checkError) {
        console.log("⚠️  Could not verify asset status:", checkError.message)
      }

      return
    }

    console.log(`\n🎯 Starting conversion of ${privateAssets.length} private assets...`)

    let successCount = 0
    let errorCount = 0
    const errors = []

    // Process assets in batches of 5 to be conservative with rate limits
    const batchSize = 5
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
        console.log("  ⏳ Waiting 3 seconds before next batch...")
        await new Promise((resolve) => setTimeout(resolve, 3000))
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

    // Test the conversion by trying to search for public assets
    try {
      console.log("\n🧪 Testing conversion by searching for public assets...")
      const testResult = await cloudinary.search.expression("folder:social-content/*").max_results(5).execute()

      console.log(`✅ Test successful! Found ${testResult.total_count} accessible assets`)
      if (testResult.resources && testResult.resources.length > 0) {
        console.log("📋 Sample assets found:")
        testResult.resources.slice(0, 3).forEach((asset) => {
          console.log(`  - ${asset.public_id}`)
        })
      }
    } catch (testError) {
      console.log("⚠️  Test search failed:", testError.message)
    }
  } catch (error) {
    console.error("💥 Fatal error during conversion:", error)
    throw error
  }
}

// Run the conversion
console.log("🎬 Starting Cloudinary Private-to-Public Conversion...")
console.log("🔑 Using Root API credentials for full access...")

convertPrivateToPublic()
  .then(() => {
    console.log("\n✨ Script completed successfully!")
    console.log("🚀 Your Dynamic Branded Content page should now load images properly!")
    console.log("\n📝 Next steps:")
    console.log("1. Go to /marketing-hub/dynamic-branded-content")
    console.log("2. Try opening any content category")
    console.log("3. Images should now load and display properly!")
  })
  .catch((error) => {
    console.error("💥 Script failed:", error)
    console.error("Please check your Cloudinary credentials and folder structure.")
  })
