import { type NextRequest, NextResponse } from "next/server"

const PLAYLISTS = {
  Monday: "PLnJRpgqKE8_NhC8zVWZgH5QlWeS4z2tU1",
  Tuesday: "PLnJRpgqKE8_Ou7CohCjNkTBIS71lO4QUN",
  Wednesday: "PLnJRpgqKE8_MeOquVJ33PeLyvDfDVX4eD",
  Thursday: "PLnJRpgqKE8_PcAre7YSP5dcQ20wuou0ad",
  Friday: "PLnJRpgqKE8_NYpSQCtLhGUIBOC0rRq3UF",
}

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "YouTube API key not configured" }, { status: 500 })
    }

    const allVideoData: any[] = []

    for (const [day, playlistId] of Object.entries(PLAYLISTS)) {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${apiKey}`,
          {
            headers: {
              Accept: "application/json",
            },
            next: { revalidate: 300 },
          },
        )

        if (response.ok) {
          const data = await response.json()
          const videos =
            data.items?.map((item: any) => ({
              id: item.snippet.resourceId.videoId,
              title: item.snippet.title,
              description: item.snippet.description || "",
              publishedAt: item.snippet.publishedAt,
              thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
              playlistId,
              day,
            })) || []

          allVideoData.push(...videos)
        }
      } catch (error) {
        console.error(`Error fetching ${day} playlist:`, error)
      }
    }

    allVideoData.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    return NextResponse.json({
      videos: allVideoData,
      latest: allVideoData[0] || null,
      count: allVideoData.length,
    })
  } catch (error) {
    console.error("Error in YouTube API route:", error)
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
  }
}
