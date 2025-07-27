import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function GET() {
  const audioFiles = [
    "buyer-prequalification-script.mp3",
    "listing-prequal-script.mp3",
    "listing-prequal-script-new.mp3",
    "listing-presentation-script.mp3",
    "advanced-fsbo-follow-up.mp3",
    "prospecting-fsbo-script.mp3",
    "fsbo-follow-up.mp3",
    "always-get-the-listing-signed.mp3",
    "overcoming-transaction-fee.mp3",
    "another-agent-said-they-can-get-me-more-money.mp3",
    "other-agents-will-cut-their-commission.mp3",
    "what-are-you-going-to-do-differently.mp3",
    "we-want-a-shorter-listing-timeframe.mp3",
    "we-want-to-interview-another-agent.mp3",
    "we-want-to-think-it-over.mp3",
    "we-want-you-to-cut-your-commission.mp3",
    "you-dont-handle-homes-in-my-price-range.mp3",
    "you-dont-have-any-listings-sales-in-my-area.mp3",
  ]

  const audioDir = path.join(process.cwd(), "public", "audio")
  const results = {
    audioDirectoryExists: false,
    existingFiles: [] as string[],
    missingFiles: [] as string[],
    allFiles: [] as string[],
  }

  try {
    // Check if audio directory exists
    await fs.access(audioDir)
    results.audioDirectoryExists = true

    // Get all files in the audio directory
    const allFiles = await fs.readdir(audioDir)
    results.allFiles = allFiles

    // Check each expected file
    for (const file of audioFiles) {
      const filePath = path.join(audioDir, file)
      try {
        await fs.access(filePath)
        results.existingFiles.push(file)
      } catch {
        results.missingFiles.push(file)
      }
    }
  } catch (error) {
    // Audio directory doesn't exist
    results.audioDirectoryExists = false
    results.missingFiles = audioFiles
  }

  return NextResponse.json(results)
}
