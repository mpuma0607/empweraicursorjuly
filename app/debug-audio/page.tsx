"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"

export default function DebugAudioPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [urlTests, setUrlTests] = useState<Record<string, any>>({})

  const testFiles = [
    "advanced-fsbo-follow-up.mp3",
    "another-agent-said-they-can-get-me-more-money.mp3",
    "we-want-a-shorter-listing-timeframe.mp3",
    "you-dont-handle-homes-in-my-price-range.mp3",
  ]

  useEffect(() => {
    loadDebugInfo()
  }, [])

  const loadDebugInfo = async () => {
    try {
      const response = await fetch("/api/debug-audio-serving", {
        cache: "no-cache",
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      const data = await response.json()
      setDebugInfo(data)
    } catch (error) {
      console.error("Error loading debug info:", error)
    } finally {
      setLoading(false)
    }
  }

  const testDirectUrls = async () => {
    console.log("🔍 Testing direct URL access...")

    for (const file of testFiles) {
      setUrlTests((prev) => ({ ...prev, [file]: { status: "loading" } }))

      // Test multiple URL patterns
      const urlsToTest = [`/audio/${file}`, `/api/test-direct-audio?file=${file}`]

      for (const url of urlsToTest) {
        try {
          console.log(`Testing URL: ${url}`)
          const response = await fetch(url, {
            method: "HEAD",
            cache: "no-cache",
            headers: {
              "Cache-Control": "no-cache",
            },
          })

          setUrlTests((prev) => ({
            ...prev,
            [file]: {
              ...prev[file],
              [url]: {
                status: response.status,
                ok: response.ok,
                headers: Object.fromEntries(response.headers.entries()),
              },
            },
          }))

          console.log(`${url} - Status: ${response.status}`)
        } catch (error) {
          console.error(`Error testing ${url}:`, error)
          setUrlTests((prev) => ({
            ...prev,
            [file]: {
              ...prev[file],
              [url]: {
                status: "error",
                error: error instanceof Error ? error.message : "Unknown error",
              },
            },
          }))
        }
      }

      setUrlTests((prev) => ({ ...prev, [file]: { ...prev[file], status: "complete" } }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg text-gray-600">Loading debug information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-black mb-4">🔍 Audio Serving Debug</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Deep diagnostic to find why audio files exist but return 404 errors
          </p>
        </div>

        {/* Environment Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🌍 Environment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p>
                  <strong>Environment:</strong> {debugInfo?.environment}
                </p>
                <p>
                  <strong>Platform:</strong> {debugInfo?.buildInfo?.platform}
                </p>
                <p>
                  <strong>Node Version:</strong> {debugInfo?.buildInfo?.nodeVersion}
                </p>
              </div>
              <div className="space-y-2">
                <p>
                  <strong>Working Directory:</strong> <code className="text-xs">{debugInfo?.pathResolution?.cwd}</code>
                </p>
                <p>
                  <strong>Public Path:</strong> <code className="text-xs">{debugInfo?.pathResolution?.publicPath}</code>
                </p>
                <p>
                  <strong>Audio Path:</strong> <code className="text-xs">{debugInfo?.pathResolution?.audioPath}</code>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filesystem Check */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>📁 Filesystem Check</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {debugInfo?.filesystemCheck?.publicExists ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span>Public directory exists: {debugInfo?.filesystemCheck?.publicExists ? "Yes" : "No"}</span>
              </div>

              <div className="flex items-center gap-3">
                {debugInfo?.filesystemCheck?.audioExists ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span>Audio directory exists: {debugInfo?.filesystemCheck?.audioExists ? "Yes" : "No"}</span>
              </div>

              {debugInfo?.directoryListing && (
                <div>
                  <h4 className="font-medium mb-2">Files in audio directory ({debugInfo.directoryListing.length}):</h4>
                  <div className="bg-gray-100 p-3 rounded max-h-40 overflow-y-auto">
                    <ul className="text-sm space-y-1">
                      {debugInfo.directoryListing.map((file: string) => (
                        <li key={file} className="font-mono">
                          • {file}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* File Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>📄 Test Files Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testFiles.map((file) => {
                const fileInfo = debugInfo?.filesystemCheck?.[file]
                return (
                  <div key={file} className="p-4 bg-white rounded border">
                    <div className="flex items-center gap-3 mb-2">
                      {fileInfo?.exists ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <h4 className="font-medium">{file}</h4>
                    </div>
                    {fileInfo && (
                      <div className="text-sm text-gray-600 ml-8">
                        {fileInfo.exists ? (
                          <>
                            <p>Size: {fileInfo.size} bytes</p>
                            <p>Modified: {new Date(fileInfo.modified).toLocaleString()}</p>
                            <p>Readable: {fileInfo.readable ? "Yes" : "No"}</p>
                          </>
                        ) : (
                          <p className="text-red-600">Error: {fileInfo.error}</p>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* URL Testing */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🌐 URL Access Testing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <button
                onClick={testDirectUrls}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                🔍 Test Direct URL Access
              </button>

              {Object.keys(urlTests).length > 0 && (
                <div className="space-y-4">
                  {testFiles.map((file) => {
                    const test = urlTests[file]
                    if (!test) return null

                    return (
                      <div key={file} className="p-4 bg-white rounded border">
                        <h4 className="font-medium mb-3">{file}</h4>
                        <div className="space-y-2 text-sm">
                          {Object.entries(test).map(([url, result]: [string, any]) => {
                            if (url === "status") return null

                            return (
                              <div key={url} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <code className="text-xs">{url}</code>
                                <span
                                  className={`font-medium ${
                                    result.ok
                                      ? "text-green-600"
                                      : result.status === "error"
                                        ? "text-red-600"
                                        : "text-orange-600"
                                  }`}
                                >
                                  {result.ok ? "✅ OK" : result.status === "error" ? "❌ Error" : `❌ ${result.status}`}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Live Test */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🎵 Live Audio Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">Test actual audio playback with different URL patterns:</p>

              {testFiles.slice(0, 2).map((file) => (
                <div key={file} className="space-y-2">
                  <h4 className="font-medium text-sm">{file}</h4>

                  <div className="grid gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs w-24">Standard:</span>
                      <audio controls className="h-8" preload="none">
                        <source src={`/audio/${file}`} type="audio/mpeg" />
                      </audio>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs w-24">Cache-bust:</span>
                      <audio controls className="h-8" preload="none">
                        <source src={`/audio/${file}?v=${Date.now()}`} type="audio/mpeg" />
                      </audio>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs w-24">API Route:</span>
                      <audio controls className="h-8" preload="none">
                        <source src={`/api/test-direct-audio?file=${file}`} type="audio/mpeg" />
                      </audio>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle>🔧 Troubleshooting Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded border border-red-200">
                <h4 className="font-medium text-red-800 mb-2">🚨 If files exist but URLs return 404:</h4>
                <ul className="list-disc pl-6 text-sm text-red-700 space-y-1">
                  <li>Files exist on filesystem but Next.js isn't serving them</li>
                  <li>Check if files are committed to git repository</li>
                  <li>Verify deployment includes the files</li>
                  <li>Check Next.js static file serving configuration</li>
                </ul>
              </div>

              <div className="p-4 bg-orange-50 rounded border border-orange-200">
                <h4 className="font-medium text-orange-800 mb-2">⚠️ Common Deployment Issues:</h4>
                <ul className="list-disc pl-6 text-sm text-orange-700 space-y-1">
                  <li>Files not included in build process</li>
                  <li>Git LFS issues with large audio files</li>
                  <li>Deployment platform file size limits</li>
                  <li>Build step excluding audio files</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 rounded border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">💡 Solutions to Try:</h4>
                <ol className="list-decimal pl-6 text-sm text-blue-700 space-y-1">
                  <li>
                    Check git status: <code>git status</code>
                  </li>
                  <li>
                    Add files to git: <code>git add public/audio/</code>
                  </li>
                  <li>Commit and redeploy</li>
                  <li>Check deployment logs for file upload issues</li>
                  <li>Verify file sizes aren't too large for platform</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
