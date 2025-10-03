"use client"

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Play, Square, BarChart3, Star, Clock, Volume2 } from "lucide-react"
import { useMemberSpaceUser } from "@/hooks/useMemberSpaceUser"

interface ConversationAnalysis {
  overallScore: number
  toneScore: number
  vakScore: number
  discScore: number
  nlpScore: number
  feedback: string[]
  upswings: { timestamp: string, text: string }[]
  downswings: { timestamp: string, text: string }[]
  vakMatches: { timestamp: string, technique: string, score: number }[]
  discAdaptations: { timestamp: string, technique: string, score: number }[]
  nlpTechniques: { timestamp: string, technique: string, score: number }[]
}

export default function RolePlay2Page() {
  const { user, loading: userLoading } = useMemberSpaceUser()
  const [isRecording, setIsRecording] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [conversationStarted, setConversationStarted] = useState(false)
  const [conversationEnded, setConversationEnded] = useState(false)
  const [analysis, setAnalysis] = useState<ConversationAnalysis | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const [recordingDuration, setRecordingDuration] = useState(0)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioStreamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Start conversation
  const startConversation = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioStreamRef.current = stream
      
      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      mediaRecorderRef.current = mediaRecorder
      
      // Collect audio chunks
      const chunks: Blob[] = []
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }
      
      mediaRecorder.onstop = () => {
        setAudioChunks(chunks)
      }
      
      // Start recording
      mediaRecorder.start(1000) // Collect data every second
      setIsRecording(true)
      setConversationStarted(true)
      setConversationEnded(false)
      setAnalysis(null)
      
      // Start duration timer
      setRecordingDuration(0)
      intervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1)
      }, 1000)
      
    } catch (error) {
      console.error('Error starting conversation:', error)
      alert('Could not access microphone. Please check permissions.')
    }
  }

  // End conversation
  const endConversation = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }
    
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop())
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    setIsRecording(false)
    setConversationEnded(true)
    setConversationStarted(false)
  }

  // Analyze conversation
  const analyzeConversation = async () => {
    if (audioChunks.length === 0) {
      alert('No audio recorded to analyze')
      return
    }
    
    setIsAnalyzing(true)
    
    try {
      console.log('Starting analysis...')
      console.log('Audio chunks count:', audioChunks.length)
      console.log('Recording duration:', recordingDuration)
      
      // Combine audio chunks
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' })
      console.log('Audio blob size:', audioBlob.size, 'bytes')
      
      // Check if audio is too large (limit to 25MB)
      if (audioBlob.size > 25 * 1024 * 1024) {
        alert('Audio file too large. Please record a shorter conversation.')
        setIsAnalyzing(false)
        return
      }
      
      // Convert to base64 for API - use a more efficient method
      const reader = new FileReader()
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string
          // Remove data URL prefix
          const base64 = result.split(',')[1]
          resolve(base64)
        }
        reader.onerror = reject
      })
      
      reader.readAsDataURL(audioBlob)
      const base64Audio = await base64Promise
      
      console.log('Base64 audio length:', base64Audio.length)
      
      // Send to analysis API
      const response = await fetch('/api/roleplay-2-0/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio: base64Audio,
          duration: recordingDuration,
          userEmail: user?.email
        })
      })
      
      console.log('Analysis response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Analysis failed:', errorText)
        throw new Error(`Analysis failed: ${response.status} - ${errorText}`)
      }
      
      const analysisData = await response.json()
      console.log('Analysis completed successfully')
      setAnalysis(analysisData)
      
    } catch (error) {
      console.error('Error analyzing conversation:', error)
      alert(`Failed to analyze conversation: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Get score badge variant
  const getScoreBadgeVariant = (score: number) => {
    if (score >= 8) return 'default'
    if (score >= 6) return 'secondary'
    return 'destructive'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">RolePlay 2.0</h1>
          <p className="text-xl text-muted-foreground mb-2">
            Advanced Role-Playing with AI Coaching
          </p>
          <p className="text-sm text-muted-foreground">
            Practice your sales conversations with real-time AI analysis and feedback
          </p>
        </div>

        {/* Cerebras RolePlay Interface */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              AI Roleplay Practice
            </CardTitle>
            <CardDescription>
              Practice with Cerebras AI and get real-time coaching feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Recording Controls */}
            <div className="mb-6">
              {!conversationStarted && !conversationEnded && (
                <div className="text-center py-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Ready to Practice?</h3>
                    <p className="text-muted-foreground mb-4">
                      Start recording to capture your conversation for AI analysis
                    </p>
                  </div>
                  <Button onClick={startConversation} size="lg" className="px-8">
                    <Mic className="h-4 w-4 mr-2" />
                    Start Recording & Practice
                  </Button>
                </div>
              )}

              {conversationStarted && (
                <div className="text-center py-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="mb-4">
                    <div className="w-16 h-16 mx-auto mb-3 bg-red-100 rounded-full flex items-center justify-center">
                      <Mic className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-red-800">Recording in Progress</h3>
                    <p className="text-red-600 mb-3">
                      Duration: <span className="font-mono text-xl font-bold">{formatDuration(recordingDuration)}</span>
                    </p>
                    <Badge variant="destructive" className="mb-4">
                      <Mic className="h-3 w-3 mr-1" />
                      Recording
                    </Badge>
                  </div>
                  <Button onClick={endConversation} variant="destructive" size="lg" className="px-8">
                    <Square className="h-4 w-4 mr-2" />
                    Stop Recording
                  </Button>
                </div>
              )}

              {conversationEnded && !analysis && (
                <div className="text-center py-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="mb-4">
                    <div className="w-16 h-16 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-green-800">Conversation Complete</h3>
                    <p className="text-green-600 mb-3">
                      Duration: <span className="font-mono text-xl font-bold">{formatDuration(recordingDuration)}</span>
                    </p>
                    <p className="text-green-600 mb-4">
                      Ready to analyze your performance?
                    </p>
                  </div>
                  <Button 
                    onClick={analyzeConversation} 
                    size="lg" 
                    className="px-8 bg-green-600 hover:bg-green-700"
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analyze Performance
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Cerebras AI Interface */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <iframe
                src="https://cerebras.vercel.app/"
                width="100%"
                height="700"
                style={{ border: "none", borderRadius: "8px" }}
                title="Cerebras Voice AI - Real Estate Roleplay Training"
                allow="microphone *; camera *; fullscreen *; autoplay *; clipboard-read; clipboard-write"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-presentation allow-downloads allow-pointer-lock allow-top-navigation"
              />
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Performance Analysis
              </CardTitle>
              <CardDescription>
                Detailed feedback on your role-play conversation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Overall Score */}
              <div className="text-center mb-8">
                <div className="text-6xl font-bold mb-2">
                  <span className={getScoreColor(analysis.overallScore)}>
                    {analysis.overallScore}
                  </span>
                  <span className="text-2xl text-muted-foreground">/10</span>
                </div>
                <p className="text-lg text-muted-foreground">Overall Performance</p>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center">
                  <Badge variant={getScoreBadgeVariant(analysis.toneScore)} className="text-lg px-3 py-1">
                    {analysis.toneScore}/10
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">Tone & Delivery</p>
                </div>
                <div className="text-center">
                  <Badge variant={getScoreBadgeVariant(analysis.vakScore)} className="text-lg px-3 py-1">
                    {analysis.vakScore}/10
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">VAK Matching</p>
                </div>
                <div className="text-center">
                  <Badge variant={getScoreBadgeVariant(analysis.discScore)} className="text-lg px-3 py-1">
                    {analysis.discScore}/10
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">DISC Adaptation</p>
                </div>
                <div className="text-center">
                  <Badge variant={getScoreBadgeVariant(analysis.nlpScore)} className="text-lg px-3 py-1">
                    {analysis.nlpScore}/10
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">NLP Techniques</p>
                </div>
              </div>

              {/* Detailed Feedback */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Key Feedback</h4>
                  <ul className="space-y-2">
                    {analysis.feedback.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Upswings (Bad) */}
                {analysis.upswings.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 text-red-600">❌ Up Swings Detected</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      These statements sounded like questions and lacked confidence:
                    </p>
                    <div className="space-y-2">
                      {analysis.upswings.map((upswing, index) => (
                        <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-medium text-red-800">{upswing.text}</span>
                            <Badge variant="destructive" className="text-xs">
                              {upswing.timestamp}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Downswings (Good) */}
                {analysis.downswings.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 text-green-600">✅ Down Swings Detected</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      These statements were confident and authoritative:
                    </p>
                    <div className="space-y-2">
                      {analysis.downswings.map((downswing, index) => (
                        <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-medium text-green-800">{downswing.text}</span>
                            <Badge variant="default" className="text-xs bg-green-600">
                              {downswing.timestamp}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* VAK Matches */}
                {analysis.vakMatches.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">VAK Matching</h4>
                    <div className="space-y-2">
                      {analysis.vakMatches.map((match, index) => (
                        <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-sm font-medium text-blue-800">{match.technique}</span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {match.score}/10
                              </Badge>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {match.timestamp}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* DISC Adaptations */}
                {analysis.discAdaptations.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">DISC Adaptations</h4>
                    <div className="space-y-2">
                      {analysis.discAdaptations.map((adaptation, index) => (
                        <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-sm font-medium text-purple-800">{adaptation.technique}</span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {adaptation.score}/10
                              </Badge>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {adaptation.timestamp}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* NLP Techniques */}
                {analysis.nlpTechniques.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">NLP Techniques</h4>
                    <div className="space-y-2">
                      {analysis.nlpTechniques.map((technique, index) => (
                        <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-sm font-medium text-orange-800">{technique.technique}</span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {technique.score}/10
                              </Badge>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {technique.timestamp}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t">
                <Button onClick={startConversation} className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Practice Again
                </Button>
                <Button variant="outline" onClick={() => window.print()}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Print Report
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
