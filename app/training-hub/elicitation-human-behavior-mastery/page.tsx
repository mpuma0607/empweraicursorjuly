"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { 
  Brain, 
  Target, 
  Users, 
  Clock, 
  CheckCircle, 
  PlayCircle, 
  FileText, 
  Star,
  Lightbulb,
  MessageSquare,
  Eye,
  Heart,
  Shield,
  Zap,
  BookOpen,
  Download,
  ArrowRight,
  GraduationCap,
  Award,
  TrendingUp,
  BarChart3,
  Calendar,
  User,
  Settings,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Minus,
  Plus
} from "lucide-react"

export default function ElicitationHumanBehaviorMasteryPage() {
  const modules = [
    {
      id: 1,
      title: "Foundations: Intent, Rapport, and Psychological Safety",
      duration: "2 hours",
      bigIdeas: [
        "Intent leaks. If your goal is 'win at any cost,' the system fails. Aim for clarity + outcome fit.",
        "Rapport = comfort + credibility. Comfort lowers resistance; credibility increases receptivity."
      ],
      skills: [
        "90-second warm start: name, mission, and a mutuality statement",
        "Micro-affirmations: brief nods, soft 'mm-hm,' short paraphrases (not big speeches)"
      ],
      script: {
        title: "Listing Start Script",
        content: "My goal is to help you make a confident decision with no surprises. If anything feels off, can we pause and make it right?"
      },
      drill: "Record a 60-second introduction; score yourself on warmth (comfort) and structure (credibility)."
    },
    {
      id: 2,
      title: "Baselines & Behavioral Clusters",
      duration: "2 hours",
      bigIdeas: [
        "Baseline first: observe standard posture, blink rate, gesture speed, voice tone on 'easy' topics.",
        "Deviations matter only in clusters (2–3 shifts), tied to topics, not in isolation."
      ],
      skills: [
        "Comfort cues: open torso, symmetrical hands, relaxed breathing, easy smiles",
        "Discomfort cues: lip compression, neck touch, eyebrow knit, foot withdrawal, rapid self-touch",
        "Cognitive load cues: longer pauses, verbal hedges, rehearsed phrasing, eye 'searching'"
      ],
      exercise: "5-minute baseline capture on neutral topics (weekend, hobbies). Note 5 'normal' markers. During price talk, log any 2–3 cue clusters that deviate.",
      fieldAssignment: "Baseline 3 clients this week. Capture clusters during: price, timing, and repairs."
    },
    {
      id: 3,
      title: "Para-linguistics: The Message Under the Words",
      duration: "2 hours",
      bigIdeas: [
        "People hear how you say it before what you say.",
        "Down-shifting pace, slight lower pitch, and deliberate pauses reduce threat."
      ],
      skills: [
        "Pace mirror: match, then lead to a calmer tempo",
        "Pauses: 1–2 seconds after key questions (silence invites depth)",
        "Friction words to avoid: 'But,' 'Actually,' 'Calm down.' Replace with 'And,' 'Here's what I'm seeing,' 'Let's slow this down together.'"
      ],
      drill: "Read the same script in three tones: hurried, neutral, calm. Have a partner rate comfort."
    },
    {
      id: 4,
      title: "Ethical Elicitation: Getting the Truth Without Pressure",
      duration: "2 hours",
      bigIdeas: [
        "Core framework: C.L.E.A.R. - Curiosity opener, Label the value, Expand with neutral follow-up, Acknowledge and validate, Route toward specifics",
        "Ethical elicitation surfaces motivations, risks, and priorities without deception."
      ],
      skills: [
        "Curiosity openers: 'What had you thinking about moving now?' / 'What would an easy move look like for you?'",
        "Expanders: 'Tell me more about that.' / 'How did you decide on that timeline?'",
        "Specifics: 'So we don't waste your time—what's the line you won't cross on price or repairs?'"
      ],
      drill: "Run C.L.E.A.R. on a buyer consult and a listing preview. Capture the exact phrase that unlocked the most detail."
    },
    {
      id: 5,
      title: "Drives, Values, and Message Framing",
      duration: "2 hours",
      bigIdeas: [
        "People move for reasons: certainty, status, belonging, autonomy, relief. Your job is to discover which top one is in play.",
        "Map language to preference style for maximum impact."
      ],
      skills: [
        "Direct (decisive, time-sensitive) → options + decisive question",
        "Influential (social, enthusiastic) → stories + social proof",
        "Steady (relationship, safety) → process clarity + guarantees of calm",
        "Conscientious (detail, accuracy) → data + step-by-step logic"
      ],
      drill: "Take one client; write two versions of the same message for two different drives."
    },
    {
      id: 6,
      title: "Reading Words: Content Signals & Question Design",
      duration: "2 hours",
      bigIdeas: [
        "Content signals: strong absolutes ('always,' 'never'), distancing ('that property,' vs 'our home'), tense shifts—often correlate with emotion or unresolved risk.",
        "Question design hierarchy: Non-threatening opinion → Third-person → Personal specifics"
      ],
      skills: [
        "Non-threatening opinion: 'What's your take on…'",
        "Third-person: 'How do people in your situation usually handle…'",
        "Personal specifics: 'How would you want to handle…' (only after safety)"
      ],
      drill: "Rewrite 5 yes/no questions into open 'what/how' formats that invite elaboration."
    },
    {
      id: 7,
      title: "Resistance, Emotion, and De-escalation",
      duration: "2 hours",
      bigIdeas: [
        "Resistance is a signal, not a stop sign: meet it, name it, slow it down.",
        "Emotional regulation: breathe low and slow; drop your shoulders; give space."
      ],
      skills: [
        "3-step de-escalation: Name it, Pace it, Bridge it",
        "Name it: 'It sounds like this inspection list feels overwhelming.'",
        "Pace it: 'Let's take this one section at a time.'",
        "Bridge it: 'Which two items would change this from a 'no' to a 'maybe'?'"
      ],
      drill: "Log one de-escalation this week. Note tone shift and the phrase that turned the corner."
    },
    {
      id: 8,
      title: "Field Lab, Scorecard, and Habit System",
      duration: "2 hours",
      bigIdeas: [
        "Behavior tracking creates awareness and improvement.",
        "Weekly retros build sustainable skill development."
      ],
      skills: [
        "Behavior Scorecard: Rate 1-5 on baseline capture, behavior clusters, C.L.E.A.R. execution, drive identification, de-escalation use, decision clarity",
        "Weekly retro: 3 moments of high informational yield, 1 phrasing that caused resistance, 1 micro-habit for next week"
      ],
      drill: "Complete weekly scorecard and 30-minute retro session."
    }
  ]

  const ethicsPrinciples = [
    {
      title: "Consent and Dignity",
      description: "Never deceive, threaten, or coerce. Always maintain respect for the client's autonomy and decision-making process."
    },
    {
      title: "Privacy",
      description: "Don't extract sensitive information irrelevant to the transaction. Stay focused on what's necessary for the real estate process."
    },
    {
      title: "Transparency",
      description: "If a topic feels personal, ask permission to go there. Be open about your intentions and methods."
    },
    {
      title: "Accuracy",
      description: "Behavior signals are probabilistic; look for clusters + context, not 'gotchas.' Avoid making assumptions based on single observations."
    }
  ]

  const realEstateScripts = [
    {
      title: "Buyer Discovery (Multiple Offers Possible)",
      scripts: [
        "What about this move matters most—certainty, timing, or price over everything?",
        "What would we regret more: losing this home or stretching $X? Why?",
        "If the seller picked our offer for reasons beyond price, what would those be?"
      ]
    },
    {
      title: "Seller Motivation (Before Pricing)",
      scripts: [
        "What would 'a clean, calm sale' mean in your words?",
        "Are there any family or work timelines we should build around?",
        "If we had to trade 1% of price for 100% certainty, where does that become a yes/no for you?"
      ]
    },
    {
      title: "Inspection Renegotiation (Buyer Side)",
      scripts: [
        "It looks like the surprise cost is the real fear here.",
        "If we solved the safety items and 1 major system, how would that change your decision?"
      ]
    },
    {
      title: "Appraisal Conversation",
      scripts: [
        "How flexible are you on cash vs timing if value comes in tight?",
        "What would make holding the deal together feel more responsible than starting over?"
      ]
    }
  ]

  const tools = [
    {
      title: "Baseline & Cluster Log",
      description: "Track neutral topic observations and topic-linked deviations",
      items: [
        "Neutral topic notes (gestures, pace, posture, expressions)",
        "Topic-linked deviations (2–3 cue clusters)",
        "Decision moment timestamp"
      ]
    },
    {
      title: "C.L.E.A.R. Elicitation Planner",
      description: "Structure your elicitation conversations for maximum effectiveness",
      items: [
        "Curiosity opener",
        "Value label ('why this helps you')",
        "2 expanders",
        "Route-to-specifics question",
        "Consent checkpoint ('ok if we go deeper?')"
      ]
    },
    {
      title: "Drive & Message Map",
      description: "Match your communication to client's primary motivations",
      items: [
        "Primary drive hypothesis (certainty/status/belonging/autonomy/relief)",
        "Matching phrases to use / avoid",
        "Offer packaging (terms, timing, proof)"
      ]
    },
    {
      title: "De-escalation Card",
      description: "Quick reference for managing emotional situations",
      items: [
        "Name it / Pace it / Bridge it lines",
        "Your calming cues (pace, pitch, breath)",
        "Weekly Scorecard & Retro"
      ]
    }
  ]

  const weeklyRetro = [
    "What unlocked truth",
    "What triggered resistance", 
    "Next week's single behavior focus"
  ]

  const thirtyDaySprint = {
    daily: "1 baseline capture + 1 C.L.E.A.R. conversation (10 min)",
    weekly: "2 de-escalations, 1 drive reframe, 1 offer framed to the discovered drive",
    kpis: [
      "% of appointments where you can articulate the client's true top drive in one sentence",
      "Number of 'decision-clarity' moments (who/what/when) per week"
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Brain className="h-4 w-4" />
            Advanced Training
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Elicitation & Human Behavior Mastery
          </h1>
          
          <p className="text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
            Modern behavioral skills for ethical influence, clarity, and trust.
          </p>
          
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Master the art of reading people, building genuine rapport, and ethically eliciting information to create better outcomes for your clients and yourself.
          </p>

          {/* Key Outcomes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardHeader>
                <Heart className="h-8 w-8 text-pink-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Fast Rapport</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Establish genuine connection and psychological safety quickly</CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Behavioral Reading</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Spot meaningful deviations and behavioral clusters</CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Ethical Influence</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Surface motivations and priorities without pressure</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Ethics First Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ethics First (Non-Negotiable)</h2>
            <p className="text-lg text-gray-600">These principles guide every technique and interaction</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ethicsPrinciples.map((principle, index) => (
              <Card key={index} className="border-l-4 border-l-red-500">
                <CardHeader>
                  <CardTitle className="text-lg text-red-700">{principle.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{principle.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Program Structure */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Program Structure</h2>
            <p className="text-lg text-gray-600">8 modules, 2 hours each + fieldwork</p>
          </div>
          
          <Tabs defaultValue="modules" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="modules">Course Modules</TabsTrigger>
              <TabsTrigger value="tools">Tools & Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="modules" className="space-y-6">
              {modules.map((module) => (
                <Card key={module.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="font-mono">
                            Module {module.id}
                          </Badge>
                          <Badge variant="secondary">
                            {module.duration}
                          </Badge>
                        </div>
                        <CardTitle className="text-2xl">{module.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value={`module-${module.id}`}>
                        <AccordionTrigger className="px-6 py-4 text-left hover:bg-gray-50">
                          <span className="font-medium text-gray-900">View Module Details</span>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                          <div className="space-y-6">
                            {/* Big Ideas */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Lightbulb className="h-4 w-4 text-yellow-600" />
                                Big Ideas
                              </h4>
                              <ul className="space-y-2">
                                {module.bigIdeas.map((idea, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                                    <span className="text-gray-700">{idea}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Skills */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Target className="h-4 w-4 text-blue-600" />
                                Skills You'll Learn
                              </h4>
                              <ul className="space-y-2">
                                {module.skills.map((skill, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <ArrowRight className="h-4 w-4 text-blue-600 flex-shrink-0 mt-1" />
                                    <span className="text-gray-700">{skill}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Script */}
                            {module.script && (
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <MessageSquare className="h-4 w-4 text-purple-600" />
                                  {module.script.title}
                                </h4>
                                <div className="bg-gray-100 rounded-lg p-4">
                                  <p className="text-gray-800 italic">"{module.script.content}"</p>
                                </div>
                              </div>
                            )}

                            {/* Exercise */}
                            {module.exercise && (
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <PlayCircle className="h-4 w-4 text-orange-600" />
                                  Exercise
                                </h4>
                                <p className="text-gray-700">{module.exercise}</p>
                              </div>
                            )}

                            {/* Drill */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Zap className="h-4 w-4 text-red-600" />
                                Practice Drill
                              </h4>
                              <p className="text-gray-700">{module.drill}</p>
                            </div>

                            {/* Field Assignment */}
                            {module.fieldAssignment && (
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <Users className="h-4 w-4 text-green-600" />
                                  Field Assignment
                                </h4>
                                <p className="text-gray-700">{module.fieldAssignment}</p>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="tools" className="space-y-8">
              {/* Real Estate Scripts */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Real Estate Scenario Scripts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {realEstateScripts.map((scenario, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{scenario.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {scenario.scripts.map((script, scriptIndex) => (
                            <li key={scriptIndex} className="flex items-start gap-2">
                              <MessageSquare className="h-4 w-4 text-blue-600 flex-shrink-0 mt-1" />
                              <span className="text-gray-700 italic">"{script}"</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Tools & Worksheets */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Tools & Worksheets</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tools.map((tool, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{tool.title}</CardTitle>
                        <CardDescription>{tool.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {tool.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* 30-Day Skill Sprint */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Calendar className="h-6 w-6 text-purple-600" />
                    30-Day Skill Sprint
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Daily (10 min)</h4>
                    <p className="text-gray-700">{thirtyDaySprint.daily}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Weekly</h4>
                    <p className="text-gray-700">{thirtyDaySprint.weekly}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Key Performance Indicators</h4>
                    <ul className="space-y-1">
                      {thirtyDaySprint.kpis.map((kpi, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <BarChart3 className="h-4 w-4 text-blue-600 flex-shrink-0 mt-1" />
                          <span className="text-gray-700">{kpi}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Retro */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Weekly Retro (30 min)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {weeklyRetro.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-orange-600 flex-shrink-0 mt-1" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Behavior Scorecard */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Behavior Scorecard</h2>
            <p className="text-lg text-gray-600">Rate yourself 1-5 on each skill</p>
          </div>
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Baseline captured before stakes rose</span>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map((num) => (
                        <Button key={num} variant="outline" size="sm" className="w-8 h-8">
                          {num}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">2+ behavior clusters noted</span>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map((num) => (
                        <Button key={num} variant="outline" size="sm" className="w-8 h-8">
                          {num}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">C.L.E.A.R. sequence executed</span>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map((num) => (
                        <Button key={num} variant="outline" size="sm" className="w-8 h-8">
                          {num}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Drive correctly identified</span>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map((num) => (
                        <Button key={num} variant="outline" size="sm" className="w-8 h-8">
                          {num}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">De-escalation used when needed</span>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map((num) => (
                        <Button key={num} variant="outline" size="sm" className="w-8 h-8">
                          {num}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Decision clarity achieved</span>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map((num) => (
                        <Button key={num} variant="outline" size="sm" className="w-8 h-8">
                          {num}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Master Human Behavior?</CardTitle>
              <CardDescription className="text-lg">
                Start with Module 1 and begin your journey toward ethical influence and better client outcomes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                <GraduationCap className="mr-2 h-5 w-5" />
                Begin Training
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
