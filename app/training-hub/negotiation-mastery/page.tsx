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
  Zap
} from "lucide-react";

export default function NegotiationMasteryPage() {
  const [activeModule, setActiveModule] = useState(0);

  const modules = [
    {
      id: 1,
      title: "Mindset, Ethics, and Process Control",
      duration: "2 hours",
      icon: <Shield className="h-6 w-6" />,
      objective: "Set a pro mindset: no bad deals, protect reputation, play long game.",
      keyIdeas: [
        "From Voss: 'No deal is better than a bad deal,' tactical empathy, listening as control",
        "From Dealcraft: Bold vision, clear outcomes, manage perception and momentum"
      ],
      scripts: [
        {
          title: "Framing a tough conversation:",
          content: "\"My goal is a great outcome without surprises. If something feels off at any point, can we agree to pause and reassess together?\""
        }
      ],
      drill: "3× \"Outcome Snapshot\" reps: write the ideal result, minimum acceptable, walk-away.",
      assignment: "Write a 1-page \"Deal Intent\" before your next negotiation: goals, non-price levers, walk-away."
    },
    {
      id: 2,
      title: "Tactical Empathy: Tone, Mirroring, Labeling, Silence",
      duration: "2 hours",
      icon: <MessageSquare className="h-6 w-6" />,
      objective: "Make people feel understood so they move toward you.",
      keyIdeas: [
        "Late-night FM DJ voice, mirroring the last 1–3 words, labeling emotions, strategic silence",
        "Seek the \"That's right\" moment (not \"You're right\")"
      ],
      scripts: [
        {
          title: "Listing commission concern:",
          content: "\"It sounds like you're worried we'll charge and vanish, leaving you to do the heavy lifting.\" [silence] \"It seems getting a premium outcome without chaos matters most.\""
        },
        {
          title: "Buyer fear about overpaying:",
          content: "\"It looks like the real worry is paying more than the home is worth and regretting it.\""
        }
      ],
      drill: "5-minute Mirrors & Labels: partner tells a story; you only mirror + label. Partner ends when they say \"That's right.\"",
      assignment: "In 3 real calls, earn a genuine \"That's right.\" Journal the moment it clicked."
    },
    {
      id: 3,
      title: "Calibrated and No-Oriented Questions",
      duration: "2 hours",
      icon: <Lightbulb className="h-6 w-6" />,
      objective: "Ask questions that give you control while making the other side feel safe.",
      keyIdeas: [
        "\"How\" and \"What\" questions create collaboration",
        "No-oriented framing reduces pressure: \"Would it be ridiculous to...?\""
      ],
      scripts: [
        {
          title: "Multiple offers (buyer):",
          content: "\"What would need to be true for our offer to beat the others without just throwing money at it?\" \"Would it be out of the question to close on your ideal date if we shorten inspection?\""
        },
        {
          title: "Commission discussion (seller):",
          content: "\"How am I supposed to deliver top-tier marketing, negotiation, and risk management for less and still get you the outcome you want?\""
        }
      ],
      drill: "Write 10 no-oriented questions you can use this week. Practice them with a timer.",
      assignment: "Replace every \"why\" with \"what\" or \"how\" in your next 5 negotiations. Track response quality."
    },
    {
      id: 4,
      title: "Accusation Audit & Objection Handling",
      duration: "2 hours",
      icon: <Target className="h-6 w-6" />,
      objective: "Disarm resistance before it appears.",
      keyIdeas: [
        "List every negative thing they could say about you—say it first",
        "Validate feelings without agreeing to inaccurate facts"
      ],
      scripts: [
        {
          title: "FSBO conversion:",
          content: "\"You might think I'll pressure you, overcharge you, and lock you into a contract you can't escape. You may also feel agents add fluff without results. Did I miss anything important?\" [When they add more, label it; then move to calibrated questions.]"
        },
        {
          title: "Inspection renegotiation call (listing agent to seller):",
          content: "\"You're probably bracing for a big ask, worried it will kill the deal and waste weeks.\""
        }
      ],
      drill: "2-minute Accusation Audit sprints for 3 scenarios: commission, price reduction, inspection.",
      assignment: "Use an accusation audit in your next live objection. Note tone change and concessions gained."
    },
    {
      id: 5,
      title: "Anchoring, Bargaining, and the Ackerman Plan",
      duration: "2 hours",
      icon: <TrendingUp className="h-6 w-6" />,
      objective: "Negotiate numbers with precision and warmth.",
      keyIdeas: [
        "Thoughtful anchoring sets the frame",
        "Ackerman method (adapted for real estate): define target price or credit, then 4 offers with decreasing increments, using calibrated questions and non-monetary items to close"
      ],
      scripts: [
        {
          title: "Buyer in a seller's market:",
          content: "Anchor with terms, not just price (close date, free rent-back, inspection scope, appraisal gap coverage with cap)."
        },
        {
          title: "Inspection credits:",
          content: "Aim for your target credit using 4 steps; trade non-monetary items (handyman window, quick close, leaving appliances) to bridge gaps."
        },
        {
          title: "Key questions:",
          content: "\"What flexibility do you have on timing if we make the numbers easy?\" \"How can we solve the roof concern without reopening the whole deal?\""
        }
      ],
      drill: "Ackerman worksheet: pick a target (e.g., $12,000 credit). Plan 65% → 85% → 95% → 100% steps, with non-monetary trades prepared.",
      assignment: "Run a full Ackerman sequence on your next repair credit or price reduction ask."
    },
    {
      id: 6,
      title: "Leverage, Black Swans, and Momentum",
      duration: "2 hours",
      icon: <Zap className="h-6 w-6" />,
      objective: "Find and use hidden information ethically.",
      keyIdeas: [
        "Black swans = unknowns that change the deal: life events, timelines, financing quirks, HOA rules",
        "Manage time: use expiration and milestones to create momentum without pressure"
      ],
      scripts: [
        {
          title: "Discovery (to listing agent):",
          content: "\"What about the sellers' situation would make this a stress-free win for them?\" \"Is there any flexibility on possession that would make their move smoother?\""
        }
      ],
      drill: "Stakeholder map: list every person influencing the deal (spouse, parent, lender, appraiser, HOA, relo company), write 2 calibrated questions for each.",
      assignment: "Uncover 1 black swan per active file this week. Document and use it to shape terms."
    },
    {
      id: 7,
      title: "Offer Crafting and Process Management",
      duration: "2 hours",
      icon: <FileText className="h-6 w-6" />,
      objective: "Write offers and counteroffers that get \"yes.\"",
      keyIdeas: [
        "Clean terms signal competence",
        "Package your offer: short cover note that mirrors and labels the seller's goals, explains how your structure meets them"
      ],
      scripts: [
        {
          title: "Offer cover note skeleton:",
          content: "1. Label the seller's priorities. 2. \"That's why\" your terms fit. 3. Calibrated question inviting collaboration: \"What would make this feel even easier for your clients?\""
        }
      ],
      drill: "Offer Optimization Checklist race: teams compete to produce the most \"seller-friendly\" structure without overpaying.",
      assignment: "Submit 2 offers with cover notes using labels and calibrated questions."
    },
    {
      id: 8,
      title: "Advanced Plays: Appraisal, Repairs, Price Reductions, Commission",
      duration: "2 hours",
      icon: <Star className="h-6 w-6" />,
      objective: "Navigate the toughest renegotiations while protecting trust.",
      keyIdeas: [
        "Appraisal gap tree: A) Price hold + seller credit to reduce buyer cash. B) Partial gap coverage + repair concessions. C) Rebut appraisal with new comps + time extension",
        "Repairs: convert punch-lists into 3 buckets: safety, function, cosmetic. Trade cosmetic concessions for timing or credits",
        "Price reduction (stale listing): accusation audit + market data + incremental plan tied to showings/feedback cadence",
        "Commission defense without discounting value: demonstrate delta between average and your process"
      ],
      scripts: [
        {
          title: "Commission defense:",
          content: "Demonstrate delta between average and your process (marketing, negotiation, risk). If pressed, trade non-monetary extras (pre-inspection coordination, minor staging package) instead of fee cuts."
        }
      ],
      drill: "Hot-seat role-plays: appraisal 5-minute rescue, inspection war-room, price-reduction talk.",
      assignment: "Execute 1 advanced play this month and record a short debrief."
    }
  ];

  const tools = [
    {
      title: "Negotiation One-Pager",
      description: "Fill-in template for deal preparation",
      pdfFile: "Negotiation_One_Pager.pdf",
      items: [
        "Deal goal, minimum acceptable, walk-away",
        "Stakeholders + interests",
        "Black swans to probe",
        "3 labels you'll use",
        "5 calibrated or no-oriented questions",
        "Anchor plan + Ackerman steps",
        "Non-price levers you'll trade"
      ]
    },
    {
      title: "Offer Optimization Checklist",
      description: "Ensure your offers get accepted",
      pdfFile: "Offer_Optimization_Checklist.pdf",
      items: [
        "Financing strength verified",
        "Clean contingencies with clear scopes",
        "EMD sized to signal seriousness",
        "Close/possession aligned to seller life",
        "Cover note using label → \"That's why\" → calibrated question"
      ]
    },
    {
      title: "Commission Value Map",
      description: "Defend your value without discounting",
      pdfFile: "Commission_Value_Map.pdf",
      items: [
        "Marketing assets, negotiation strategy, risk shields",
        "Case study: price-to-net gap you routinely achieve",
        "\"How am I supposed to...?\" questions for fee pressure"
      ]
    },
    {
      title: "Inspection Negotiation Script",
      description: "Call + follow-up email template",
      pdfFile: "Inspection_Negotiation_Script.pdf",
      items: [
        "Call open: accusation audit → label → calibrated question",
        "Email: bullet the essentials, propose 1–2 high-probability structures, invite collaboration"
      ]
    },
    {
      title: "Appraisal Gap Options Tree",
      description: "Visual menu of concessions and coverage levels",
      pdfFile: "Appraisal_Gap_Options_Tree.pdf",
      items: [
        "Buyer and seller versions",
        "Gap coverage levels",
        "Timing moves and concessions"
      ]
    },
    {
      title: "Quick-Start One-Pager",
      description: "Print and keep by your phone",
      pdfFile: "Quick_Start_One_Pager.pdf",
      items: [
        "8-step negotiation process",
        "Key phrases and questions",
        "Emergency reference guide"
      ]
    }
  ];

  const scenarios = [
    {
      title: "FSBO Conversion",
      content: "Accusation audit: \"You may feel agents just slap it on the MLS, take a big fee, and disappear. You might also worry I'll push you into decisions that favor me.\" Label: \"It sounds like you want control and a premium result.\" Calibrated: \"How would you like to keep control while I take on the parts that cost you time, stress, and money?\""
    },
    {
      title: "Buyer in Multiple Offers",
      content: "Label: \"It seems like timing and certainty matter most to the sellers.\" Calibrated: \"What would make our offer feel safest without just adding dollars?\" Terms to propose: shorter inspection with scope, appraisal buffer with cap, seller's ideal close + rent-back."
    },
    {
      title: "Price Reduction With Dignity",
      content: "Accusation audit: \"You might feel lowering price means you failed or I did.\" Label: \"It looks like the market is telling us buyers won't act at this number.\" Calibrated: \"What reduction would attract showings in the next 7 days without overshooting?\""
    },
    {
      title: "Inspection Renegotiation",
      content: "Label: \"It sounds like your real concern is surprise costs after closing.\" Calibrated: \"How can we address safety and function now and leave cosmetics off the table?\" Ackerman your target credit using 4 planned moves."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <BookOpen className="h-4 w-4" />
            Advanced Training Course
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Negotiation Mastery
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Tactical empathy + dealcraft for listings, buyers, and everything in between.
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
              Real Estate Focused
            </div>
          </div>
        </div>

        {/* Course Outcomes */}
        <Card className="mb-12 border-2 border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <CheckCircle className="h-6 w-6 text-blue-600" />
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
                  <span>Control the tone and tempo of tough conversations</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Surface hidden motivations ("black swans") that change outcomes</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Use calibrated, no-oriented questions to steer decisions</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Anchor and bargain with precision (while protecting goodwill)</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Turn objections into agreement without discounting their value</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Win terms beyond price: timing, repairs, credits, rent-backs, extras</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="modules" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="modules">Course Modules</TabsTrigger>
            <TabsTrigger value="tools">Tools & Templates</TabsTrigger>
            <TabsTrigger value="scenarios">Scenario Scripts</TabsTrigger>
            <TabsTrigger value="practice">Practice Labs</TabsTrigger>
          </TabsList>

          {/* Course Modules */}
          <TabsContent value="modules" className="space-y-6">
            <div className="grid gap-6">
              {modules.map((module, index) => (
                <Card key={module.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
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
                        <h4 className="font-semibold text-gray-900 mb-2">Agent Scripts:</h4>
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

          {/* Tools & Templates */}
          <TabsContent value="tools" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {tools.map((tool, index) => (
                <Card key={index} className="h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {tool.title}
                    </CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tool.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <a 
                      href={`/pdfs/${tool.pdfFile}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <FileText className="h-4 w-4" />
                      Download PDF
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Scenario Scripts */}
          <TabsContent value="scenarios" className="space-y-6">
            <div className="grid gap-6">
              {scenarios.map((scenario, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      {scenario.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">{scenario.content}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Practice Labs */}
          <TabsContent value="practice" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlayCircle className="h-5 w-5" />
                    Weekly Practice Lab
                  </CardTitle>
                  <CardDescription>Repeat weekly for skill building</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Mirrors & Labels warm-up</span>
                      <Badge variant="outline">10 min</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="font-medium">Accusation Audit lightning round</span>
                      <Badge variant="outline">15 min</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Calibrated Question gauntlet</span>
                      <Badge variant="outline">20 min</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="font-medium">Ackerman bargaining drill</span>
                      <Badge variant="outline">20 min</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="font-medium">Hot-seat scenario</span>
                      <Badge variant="outline">15 min</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Debrief and scorecard</span>
                      <Badge variant="outline">10 min</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    30-Day Skill Sprint
                  </CardTitle>
                  <CardDescription>Daily micro-drills for rapid improvement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-blue-900">Days 1-7</div>
                      <div className="text-sm text-blue-700">Earn 1 "That's right" per day</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="font-medium text-yellow-900">Days 8-14</div>
                      <div className="text-sm text-yellow-700">5 no-oriented questions per day</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="font-medium text-green-900">Days 15-21</div>
                      <div className="text-sm text-green-700">1 accusation audit per day</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="font-medium text-purple-900">Days 22-30</div>
                      <div className="text-sm text-purple-700">1 Ackerman plan + debrief per day</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Weekly KPI Targets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>3+ offers sent with cover notes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>1+ black swan uncovered per active file</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Average concession delta improved by X%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Time-to-agreement reduced by Y%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Start Guide */}
        <Card className="mt-12 border-2 border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center gap-2 text-2xl text-green-800">
              <Zap className="h-6 w-6" />
              Quick-Start One-Pager
            </CardTitle>
            <CardDescription className="text-green-700">
              Print and keep by your phone
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="bg-white p-6 rounded-lg border-2 border-green-100">
              <ol className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                  <span>Open with a label</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                  <span>Accusation audit big negatives</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                  <span>Earn "That's right"</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                  <span>Ask a no-oriented or calibrated question</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">5</span>
                  <span>Anchor with terms and value, not just price</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">6</span>
                  <span>Run your Ackerman steps</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">7</span>
                  <span>Trade non-price levers to bridge the last gap</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">8</span>
                  <span>Summarize the agreement in the other side's words</span>
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
