"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Target, 
  Users, 
  Clock, 
  CheckCircle, 
  PlayCircle, 
  FileText, 
  Star,
  Lightbulb,
  MessageSquare,
  TrendingUp,
  Shield,
  Zap,
  Share2,
  Heart,
  BarChart3,
  Calendar,
  Camera,
  Hash,
  Video
} from "lucide-react";

export default function SocialMediaMasteryPage() {
  const [activeModule, setActiveModule] = useState(0);

  const modules = [
    {
      id: 1,
      title: "Brand DNA and Voice",
      duration: "2 hours",
      icon: <Hash className="h-6 w-6" />,
      objective: "Create a brand people choose to follow.",
      keyIdeas: [
        "Authentic niche, consistency over perfection, document vs create",
        "One-liner: 'I help [who] achieve [result] in [market] by [unique angle]'",
        "3 brand pillars: Education, Community, Proof",
        "Voice guide: 5 words that describe your tone"
      ],
      scripts: [
        {
          title: "Brand One-Liner Template:",
          content: "\"I help [who] achieve [result] in [market] by [unique angle]\""
        },
        {
          title: "Voice Guide Exercise:",
          content: "Write 5 words that describe your tone (e.g., helpful, authentic, confident, approachable, knowledgeable)"
        }
      ],
      drill: "Create your brand one-liner and 3 pillars in 15 minutes.",
      assignment: "Record a 60-second origin story video and pin it to your profile."
    },
    {
      id: 2,
      title: "Jabs: Give First, Give Often",
      duration: "2 hours",
      icon: <Heart className="h-6 w-6" />,
      objective: "Ship consistent value without asking for anything.",
      keyIdeas: [
        "The jab is context-native value. No pitch.",
        "Content buckets: Education, Community, Proof without bragging, Empathy",
        "Education: market myths, financing basics, offer strategy",
        "Community: local spotlights, school info, events",
        "Proof: behind the scenes, process peeks, client wins framed as lessons",
        "Empathy: moving anxiety, first-time buyer stress, downsizing stories"
      ],
      scripts: [
        {
          title: "Reel Hook Example:",
          content: "\"3 silent costs buyers miss in our market.\" Body: tip 1–3. Close: \"Want the full checklist? Comment 'checklist'.\""
        },
        {
          title: "Carousel Example:",
          content: "\"Inspection asks that actually get accepted.\""
        }
      ],
      drill: "Batch 10 jab hooks in 10 minutes.",
      assignment: "Post 5 jabs this week, no CTAs other than saves/shares."
    },
    {
      id: 3,
      title: "Right Hooks: Ask With Clarity and Timing",
      duration: "2 hours",
      icon: <Target className="h-6 w-6" />,
      objective: "Convert attention to action without breaking trust.",
      keyIdeas: [
        "Earn the right to ask. Make the CTA frictionless, native to the platform",
        "Right-hook formats: Lead magnet, Event, Consult",
        "Lead magnet: 'First-time buyer playbook' download",
        "Event: virtual Q&A or open house tour with RSVP link",
        "Consult: 'Free 15-minute pre-approval roadmap call'"
      ],
      scripts: [
        {
          title: "Swipe Copy Examples:",
          content: "\"Ready in the next 90 days? Comment '90' and I'll DM a 6-step plan.\" \"Thinking of selling before school starts? Tap the link for my pricing prep checklist.\""
        }
      ],
      drill: "Write 3 right hooks for each pillar.",
      assignment: "Publish 1 right hook for every 4–6 jabs this week."
    },
    {
      id: 4,
      title: "Day Trading Attention",
      duration: "2 hours",
      icon: <TrendingUp className="h-6 w-6" />,
      objective: "Spot and exploit attention underpriced by the market.",
      keyIdeas: [
        "Speed beats polish. Native trends. Cultural moments",
        "Daily scan: 10 minutes on Reels/TikTok Discover, 5 minutes on X trends, 5 minutes on local Facebook groups",
        "If a trend fits a pillar, post within hours using a native format",
        "Remix a trending audio with a local stat overlay",
        "Stitch a viral renovation clip and add your 'agent take' in 12 seconds"
      ],
      scripts: [
        {
          title: "Trend Tap System:",
          content: "Daily 20-minute scan → Identify trend → Adapt to your market → Post within hours"
        }
      ],
      drill: "\"90-minute sprint\" once a week. Produce 6 short-form pieces from one core topic.",
      assignment: "Ship 2 trend-taps this week tied to your market."
    },
    {
      id: 5,
      title: "Platform Plays (Native Tactics)",
      duration: "2 hours",
      icon: <Share2 className="h-6 w-6" />,
      objective: "Make the same idea work natively on each platform.",
      keyIdeas: [
        "Instagram: Reels for reach, Carousels for saves, Stories for DM depth. Ratio: 4–5 jabs to 1 right hook",
        "TikTok: Hook in 1 second, Text overlays, Fast cuts. Post volume beats perfection. 7–14 per week",
        "YouTube + Shorts: Shorts for discovery, long-form for trust. Titles: problem + specificity",
        "Facebook + Groups: Neighborhood groups for hyperlocal reach. Lead with service posts",
        "LinkedIn: Authority posts, Market explainers, Case studies. CTA: invite to webinar or calendar link"
      ],
      scripts: [
        {
          title: "Platform-Specific CTAs:",
          content: "Instagram: 'Follow for daily [market] micro-lessons.' TikTok: 'Follow for daily [market] micro-lessons.' LinkedIn: 'Invite to webinar or calendar link in first comment.'"
        }
      ],
      drill: "Take one topic and map 5 native versions.",
      assignment: "Publish the same idea in 3 native ways across 3 platforms."
    },
    {
      id: 6,
      title: "The Thank You Engine",
      duration: "2 hours",
      icon: <MessageSquare className="h-6 w-6" />,
      objective: "Turn followers into fans with micro-interactions.",
      keyIdeas: [
        "Surprise-and-delight. 1-to-1 > 1-to-many",
        "Daily '15-5-5': 15 meaningful comments, 5 DMs that purely thank or help, 5 shares of community content",
        "Comment framework: 'Name + specific praise + add value + open question'",
        "DM welcome: 'Saw you followed. Thanks for being here. Anything you want me to cover about [market]?'",
        "Delight plays: Handwritten note to top commenters monthly, Shout-out reel for local teacher/nurse/small biz"
      ],
      scripts: [
        {
          title: "Comment Framework:",
          content: "\"Name + specific praise + add value + open question\""
        },
        {
          title: "DM Welcome Template:",
          content: "\"Saw you followed. Thanks for being here. Anything you want me to cover about [market]?\""
        }
      ],
      drill: "Practice the comment framework on 10 posts in 10 minutes.",
      assignment: "Log 25 high-quality interactions in 5 days."
    },
    {
      id: 7,
      title: "Proof That Persuades",
      duration: "2 hours",
      icon: <Star className="h-6 w-6" />,
      objective: "Show results without sounding salesy.",
      keyIdeas: [
        "Teach through the win; client is the hero",
        "Formats: 'Deal breakdown' carousel, UGC prompts, Before-after staging/pricing/timeline",
        "'Deal breakdown' carousel: problem, plan, process, payoff, lesson",
        "UGC prompts: ask clients to share a 10-second 'what surprised us' clip",
        "Before-after: staging, pricing strategy, timeline"
      ],
      scripts: [
        {
          title: "Deal Breakdown Script:",
          content: "\"We listed at X, received Y offers, and chose Z. Why? Here's the framework so you can use it.\""
        }
      ],
      drill: "Create 3 proof post templates for different scenarios.",
      assignment: "Publish 2 proof posts that teach a principle."
    },
    {
      id: 8,
      title: "Scoreboard and Iteration",
      duration: "2 hours",
      icon: <BarChart3 className="h-6 w-6" />,
      objective: "Measure leading indicators and optimize weekly.",
      keyIdeas: [
        "North-star metrics: Saves and shares per jab, DM starts per story, Comment rate from non-followers, Click-through or DM reply rate on right hooks, Appointments booked",
        "Weekly retro (30 minutes): Top 3 posts and why, Underperformers and what to fix, Plan next week's tests",
        "Plan next week's tests: 2 new hooks, 1 new format, 1 new CTA"
      ],
      scripts: [
        {
          title: "Weekly Retro Questions:",
          content: "What were your top 3 posts and why? What underperformed and what to fix? What will you test next week?"
        }
      ],
      drill: "Run a 30-minute weekly retro on your content performance.",
      assignment: "Run the retro and ship your A/B tests."
    }
  ];

  const contentBuckets = [
    {
      title: "Education",
      description: "Market myths, financing basics, offer strategy",
      examples: [
        "3 silent costs buyers miss in our market",
        "The 90-day path from renting to owning without stress",
        "3 negotiation levers most buyers never use"
      ]
    },
    {
      title: "Community",
      description: "Local spotlights, school info, events",
      examples: [
        "Shout-out reel for a local teacher, nurse, or small biz",
        "Neighborhood coffee shop spotlight",
        "Local school district updates"
      ]
    },
    {
      title: "Proof Without Bragging",
      description: "Behind the scenes, process peeks, client wins framed as lessons",
      examples: [
        "Deal breakdown carousel: problem, plan, process, payoff, lesson",
        "Behind the scenes of staging process",
        "Client testimonial framed as market lesson"
      ]
    },
    {
      title: "Empathy",
      description: "Moving anxiety, first-time buyer stress, downsizing stories",
      examples: [
        "First-time buyer anxiety: 'I remember feeling overwhelmed too'",
        "Downsizing family: 'This transition is emotional, here's how we navigate it'",
        "Moving day stress: 'Let me help you avoid these common mistakes'"
      ]
    }
  ];

  const platformGuides = [
    {
      platform: "Instagram",
      icon: <Camera className="h-5 w-5" />,
      strategy: "Reels for reach, Carousels for saves, Stories for DM depth",
      ratio: "4–5 jabs to 1 right hook",
      tips: [
        "Use Story CTAs: polls, sliders, 'Questions' box that lead to DMs",
        "Post consistently in Stories for deeper connections",
        "Use trending audio with local market stats"
      ]
    },
    {
      platform: "TikTok",
      icon: <PlayCircle className="h-5 w-5" />,
      strategy: "Hook in 1 second, Text overlays, Fast cuts",
      ratio: "Post volume beats perfection. 7–14 per week",
      tips: [
        "Hook viewers in the first second",
        "Use text overlays for key points",
        "Fast cuts keep attention",
        "CTA: 'Follow for daily [market] micro-lessons'"
      ]
    },
    {
      platform: "YouTube + Shorts",
      icon: <Video className="h-5 w-5" />,
      strategy: "Shorts for discovery, long-form for trust",
      ratio: "Mix of both formats",
      tips: [
        "Titles: problem + specificity",
        "Thumbnails: one clear promise",
        "Shorts for trend-tapping",
        "Long-form for authority building"
      ]
    },
    {
      platform: "Facebook + Groups",
      icon: <Users className="h-5 w-5" />,
      strategy: "Neighborhood groups for hyperlocal reach",
      ratio: "Lead with service posts",
      tips: [
        "Join local neighborhood groups",
        "Lead with helpful service posts",
        "Right hook via events and checklists",
        "Share community content authentically"
      ]
    },
    {
      platform: "LinkedIn",
      icon: <FileText className="h-5 w-5" />,
      strategy: "Authority posts, Market explainers, Case studies",
      ratio: "Professional focus",
      tips: [
        "Share market insights and analysis",
        "Post case studies and success stories",
        "CTA: invite to webinar or calendar link in first comment",
        "Engage with other real estate professionals"
      ]
    }
  ];

  const weeklyRhythm = [
    { day: "Monday", type: "Education jab", format: "Carousel", content: "Market myth or financing tip" },
    { day: "Tuesday", type: "Community jab", format: "Reel", content: "Local spotlight or event" },
    { day: "Wednesday", type: "Proof jab", format: "Carousel", content: "Behind the scenes or case study" },
    { day: "Thursday", type: "Education jab", format: "Story series + DM prompt", content: "Multi-part educational series" },
    { day: "Friday", type: "Right hook", format: "Post", content: "Lead magnet or consult offer" },
    { day: "Saturday", type: "Trend-tap", format: "Reel", content: "Ride a trending topic" },
    { day: "Sunday", type: "Personal slice-of-life", format: "Story", content: "Authentic personal moment" }
  ];

  const hookBank = [
    "Stop doing this before you tour homes.",
    "The 90-day path from renting to owning without stress.",
    "3 negotiation levers most buyers never use.",
    "What your Zestimate isn't telling you.",
    "How to win without being the highest offer.",
    "The inspection ask that saved my client $5,000.",
    "Why I tell my clients to skip the open house.",
    "The hidden cost every first-time buyer misses.",
    "3 things that make or break your offer.",
    "The staging trick that sold this house in 3 days."
  ];

  const leadMagnetIdeas = [
    "Offer Strategy Playbook",
    "Inspection Ask Matrix", 
    "30-day Home Search Sprint",
    "First-time Buyer Checklist",
    "Pricing Strategy Guide",
    "Negotiation Lever Toolkit",
    "Pre-approval Roadmap",
    "Downsizer's Checklist"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <BookOpen className="h-4 w-4" />
            Advanced Training Course
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Social Media Mastery
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Build a magnetic brand, win attention daily, and convert it ethically.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              8 Modules • 16 Hours
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              4-8 Week Program
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Social Media Focused
            </div>
          </div>
        </div>

        {/* Course Outcomes */}
        <Card className="mb-12 border-2 border-pink-200">
          <CardHeader className="bg-pink-50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <CheckCircle className="h-6 w-6 text-pink-600" />
              Course Outcomes
            </CardTitle>
            <CardDescription className="text-lg">
              By the end, agents will:
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Build a personal brand that feels human and memorable</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>"Day trade" attention by spotting and riding trends fast</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Publish the right mix of jabs (give) and right hooks (ask) per platform</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Turn comments and DMs into conversations, then appointments</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Measure what matters and iterate weekly</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="modules" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="modules">Course Modules</TabsTrigger>
            <TabsTrigger value="platforms">Platform Guides</TabsTrigger>
            <TabsTrigger value="content">Content Strategy</TabsTrigger>
            <TabsTrigger value="templates">Templates & Tools</TabsTrigger>
            <TabsTrigger value="calendar">Weekly Calendar</TabsTrigger>
          </TabsList>

          {/* Course Modules */}
          <TabsContent value="modules" className="space-y-6">
            <div className="grid gap-6">
              {modules.map((module, index) => (
                <Card key={module.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-pink-100 rounded-lg">
                          {module.icon}
                        </div>
                        <div>
                          <CardTitle className="text-xl">Module {module.id}</CardTitle>
                          <CardDescription className="text-lg font-medium text-gray-900">
                            {module.title}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-white">
                        <Clock className="h-3 w-3 mr-1" />
                        {module.duration}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Objective:</h4>
                        <p className="text-gray-700">{module.objective}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Key Ideas:</h4>
                        <ul className="space-y-2">
                          {module.keyIdeas.map((idea, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{idea}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Scripts & Examples:</h4>
                        <div className="space-y-3">
                          {module.scripts.map((script, idx) => (
                            <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                              <p className="font-medium text-gray-900 mb-2">{script.title}</p>
                              <p className="text-gray-700 italic">"{script.content}"</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Drill:</h4>
                          <p className="text-gray-700 bg-yellow-50 p-3 rounded-lg">{module.drill}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Field Assignment:</h4>
                          <p className="text-gray-700 bg-green-50 p-3 rounded-lg">{module.assignment}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Platform Guides */}
          <TabsContent value="platforms" className="space-y-6">
            <div className="grid gap-6">
              {platformGuides.map((platform, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {platform.icon}
                      {platform.platform}
                    </CardTitle>
                    <CardDescription className="text-lg font-medium">
                      {platform.strategy}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="font-medium text-blue-900">Ratio: {platform.ratio}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Key Tips:</h4>
                        <ul className="space-y-2">
                          {platform.tips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Content Strategy */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {contentBuckets.map((bucket, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Hash className="h-5 w-5" />
                      {bucket.title}
                    </CardTitle>
                    <CardDescription>{bucket.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Examples:</h4>
                      <ul className="space-y-2">
                        {bucket.examples.map((example, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700 italic">"{example}"</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Templates & Tools */}
          <TabsContent value="templates" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Hook Bank
                  </CardTitle>
                  <CardDescription>Ready-to-use hooks for any market</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {hookBank.map((hook, idx) => (
                      <div key={idx} className="p-2 bg-gray-50 rounded text-sm">
                        "{hook}"
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Lead Magnet Ideas
                  </CardTitle>
                  <CardDescription>High-converting lead magnets for real estate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {leadMagnetIdeas.map((idea, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{idea}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Story DM Prompts
                  </CardTitle>
                  <CardDescription>Engage your audience with these prompts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium">"Ask me anything about [neighborhood] this week."</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium">"Poll: Which scares you more, appraisal or inspection?"</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium">"What's one thing you want me to cover next week?"</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Right Hook CTAs
                  </CardTitle>
                  <CardDescription>Convert attention to action</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm font-medium">"Comment 'PLAN' for my 7-step first-time buyer plan."</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm font-medium">"Tap the link for the Downsizer's Checklist."</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm font-medium">"DM 'SELL' for a no-pressure pricing walkthrough."</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Weekly Calendar */}
          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Default Weekly Rhythm
                </CardTitle>
                <CardDescription>Your go-to content schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weeklyRhythm.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-20 font-medium text-gray-900">{day.day}</div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{day.type}</div>
                          <div className="text-sm text-gray-600">{day.format} • {day.content}</div>
                        </div>
                      </div>
                      <Badge variant="outline">{day.format}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">30-Day Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-blue-900">Days 0-30</div>
                      <div className="text-sm text-blue-700">Publish daily. Build library of 30 hooks, 10 carousels, 20 short-form videos.</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">60-Day Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="font-medium text-green-900">Days 31-60</div>
                      <div className="text-sm text-green-700">Add one right hook per week. Host 1 live Q&A. Launch a lead magnet.</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">90-Day Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="font-medium text-purple-900">Days 61-90</div>
                      <div className="text-sm text-purple-700">Create a weekly show format. Launch a quarterly webinar. Build a UGC system.</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Production OS */}
        <Card className="mt-12 border-2 border-purple-200">
          <CardHeader className="bg-purple-50">
            <CardTitle className="flex items-center gap-2 text-2xl text-purple-800">
              <Zap className="h-6 w-6" />
              Production OS (Simple & Sustainable)
            </CardTitle>
            <CardDescription className="text-purple-700">
              Your weekly content creation system
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Weekly 2-Hour Batch Session:</h4>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                    <span>Pick 3 topics from FAQs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                    <span>Script 10 hooks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                    <span>Shoot 10 short-form clips in one session</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                    <span>Design 2 carousels from past posts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">5</span>
                    <span>Schedule with your tool of choice</span>
                  </li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Daily 20-Minute Engagement:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Block 20 minutes daily for comments and DMs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Respond to all comments within 2 hours</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Share 2-3 pieces of community content</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
