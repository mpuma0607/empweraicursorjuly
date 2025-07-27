"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BookOpen, Phone, Play, Home } from "lucide-react"

// Audio Player Component
function AudioPlayer({ src, title }: { src: string; title: string }) {
  return (
    <div className="bg-white p-4 rounded-md border border-gray-200 mb-4">
      <div className="flex items-center gap-3 mb-2">
        <Play className="h-4 w-4 text-blue-600" />
        <h4 className="font-medium text-sm text-gray-700">{title}</h4>
      </div>
      <audio controls className="w-full h-10" preload="metadata" style={{ maxWidth: "100%" }}>
        <source src={src} type="audio/mpeg" />
        <p className="text-sm text-gray-500">Your browser does not support the audio element.</p>
      </audio>
    </div>
  )
}

// FSBO Audio Section
function FSBOAudioSection() {
  return (
    <div className="mt-6 space-y-4">
      <h4 className="font-semibold text-lg mb-4">🎵 Audio Training Resources</h4>

      <AudioPlayer src="/audio/advanced-fsbo-follow-up.mp3" title="Advanced FSBO Follow-Up Training" />

      <AudioPlayer src="/audio/prospecting-fsbo-script.mp3" title="Prospecting FSBO Script Training" />

      <AudioPlayer src="/audio/fsbo-follow-up.mp3" title="FSBO Follow-Up Training" />
    </div>
  )
}

// Objections Audio Section
function ObjectionsAudioSection() {
  const objectionAudios = [
    {
      src: "/audio/always-get-the-listing-signed.mp3",
      title: "Always Get the Listing Signed",
    },
    {
      src: "/audio/overcoming-transaction-fee.mp3",
      title: "Overcoming Transaction Fee Objections",
    },
    {
      src: "/audio/another-agent-said-they-can-get-me-more-money.mp3",
      title: "Another Agent Said They Can Get Me More Money",
    },
    {
      src: "/audio/other-agents-will-cut-their-commission.mp3",
      title: "Other Agents Will Cut Their Commission",
    },
    {
      src: "/audio/what-are-you-going-to-do-differently.mp3",
      title: "What Are You Going to Do Differently?",
    },
    {
      src: "/audio/we-want-a-shorter-listing-timeframe.mp3",
      title: "We Want a Shorter Listing Timeframe",
    },
    {
      src: "/audio/we-want-to-interview-another-agent.mp3",
      title: "We Want to Interview Another Agent",
    },
    {
      src: "/audio/we-want-to-think-it-over.mp3",
      title: "We Want to Think It Over",
    },
    {
      src: "/audio/we-want-you-to-cut-your-commission.mp3",
      title: "We Want You to Cut Your Commission",
    },
    {
      src: "/audio/you-dont-handle-homes-in-my-price-range.mp3",
      title: "You Don't Handle Homes in My Price Range",
    },
    {
      src: "/audio/you-dont-have-any-listings-sales-in-my-area.mp3",
      title: "You Don't Have Any Listing Sales in My Area",
    },
  ]

  return (
    <div className="mt-6 space-y-4">
      <h4 className="font-semibold text-lg mb-4">🎵 Audio Training Resources</h4>
      <div className="grid gap-4">
        {objectionAudios.map((audio, index) => (
          <AudioPlayer key={index} src={audio.src} title={audio.title} />
        ))}
      </div>
    </div>
  )
}

export default function ScriptMasteryPage() {
  const [openModal, setOpenModal] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">Script Mastery</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master the art of conversation with our professionally crafted scripts for every real estate situation.
          </p>
        </div>

        {/* Script Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
          {scriptCategories.map((category) => (
            <Dialog
              key={category.id}
              open={openModal === category.id}
              onOpenChange={(open) => {
                if (open) {
                  setOpenModal(category.id)
                } else {
                  setOpenModal(null)
                }
              }}
            >
              <DialogTrigger asChild>
                <Button
                  className="w-full h-32 flex flex-col items-center justify-center gap-3 rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${category.gradientFrom} 0%, ${category.gradientTo} 100%)`,
                  }}
                >
                  <category.icon className="h-8 w-8 text-white" />
                  <span className="text-lg font-medium text-white">{category.name}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl flex items-center gap-2">
                    <category.icon className="h-6 w-6" />
                    {category.name}
                  </DialogTitle>
                  <DialogDescription>{category.description}</DialogDescription>
                </DialogHeader>
                <div className="mt-6">
                  <Tabs defaultValue={category.tabs[0].id}>
                    <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-6">
                      {category.tabs.map((tab) => (
                        <TabsTrigger key={tab.id} value={tab.id}>
                          {tab.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {category.tabs.map((tab) => (
                      <TabsContent key={tab.id} value={tab.id}>
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <h3 className="text-xl font-bold mb-4">{tab.name}</h3>
                          <p className="text-gray-600 mb-6">{tab.description}</p>

                          <Accordion type="single" collapsible className="w-full">
                            {tab.scripts.map((script, index) => (
                              <AccordionItem key={index} value={`script-${index}`}>
                                <AccordionTrigger className="text-left font-medium">{script.title}</AccordionTrigger>
                                <AccordionContent>
                                  <div className="bg-white p-4 rounded-md border border-gray-200">
                                    <div className="mb-4">
                                      <h4 className="font-semibold text-sm text-gray-500 mb-2">OBJECTIVE</h4>
                                      <p className="text-gray-700">{script.objective}</p>
                                    </div>

                                    <div className="mb-4">
                                      <h4 className="font-semibold text-sm text-gray-500 mb-2">SCRIPT</h4>
                                      <div className="bg-gray-50 p-4 rounded-md border border-gray-100 whitespace-pre-line">
                                        {script.content}
                                      </div>
                                    </div>

                                    {script.notes && (
                                      <div>
                                        <h4 className="font-semibold text-sm text-gray-500 mb-2">NOTES</h4>
                                        <p className="text-gray-700">{script.notes}</p>
                                      </div>
                                    )}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>

                          {/* Audio Sections */}
                          {tab.id === "fsbo" && <FSBOAudioSection />}
                          {tab.id === "overcoming-objections" && <ObjectionsAudioSection />}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {/* Additional Content */}
        <div className="max-w-4xl mx-auto bg-gray-50 p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">How to Use These Scripts Effectively</h2>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Practice Makes Perfect</h3>
              <p>
                Rehearse these scripts until they feel natural. The goal isn't to sound robotic but to internalize the
                key points so you can deliver them conversationally.
              </p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Personalize Your Approach</h3>
              <p>
                Adapt these scripts to fit your personal style and the specific needs of your clients. Use them as a
                foundation, not a rigid template.
              </p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Listen More Than You Speak</h3>
              <p>
                The best scripts are interactive. Ask questions, listen carefully, and respond to what your clients are
                actually saying rather than just moving to the next line.
              </p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Track Your Results</h3>
              <p>
                Keep notes on which scripts and approaches work best for different situations. Continuously refine your
                delivery based on real-world feedback.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Script Data
const scriptCategories = [
  {
    id: "prospecting",
    name: "Prospecting Scripts",
    description: "Scripts for generating new leads and opportunities",
    icon: Phone,
    gradientFrom: "#4F46E5",
    gradientTo: "#7C3AED",
    tabs: [
      {
        id: "expired-listing",
        name: "Expired Listing",
        description: "Professional scripts for contacting owners of expired listings",
        scripts: [
          {
            title: "Expired Listing Phone Script",
            objective:
              "To establish rapport with expired listing owners and secure an appointment to interview for the listing",
            content: `(Mirror/Match Introduction) ... I'm ______ from (your brokerage name)... The reason I'm here (or calling) is your property came up on our computer as an expired listing and what I am curious about is ... when I can interview for the job of getting this property sold for you... You do still want to SELL YOUR PROPERTY right...

Let me ask you: (REMEMBER TO FIND WAYS TO CONNECT)

If you sold this property ... where would you go next. (_____) Wow! (Find a way to Connect)

How soon do you have to be there. (_____) Ouch!

What do you think stopped your property from selling. (_____) Really!

How did you happen to pick the last company that you listed with. (_____) Great!

What did that company do that you liked best. (_____) You're kidding!

What do you feel they should have done to get your property sold for you. (_____) OK

What will you expect from the next company that you choose. (_____) Terrific!

Have you already chosen a company to work with. (_____) Wonderful!

Let's do this... let me show you what your house is REALLY worth in today's market and ... show you the tools that only CENTURY 21 BEGGINS has ... that allow us to sell 20-30 homes a day which is more than any of our competitors. You do expect the best...right.

This way at least you REALLY ...know your options... and if it makes sense, it makes sense...if it doesn't, it doesn't.

The worst case scenario is...you'll know what your house is REALLY going to sell for... and that will be nice to know, right.

So... What would be the best time for me to come back with today's real value, show you how much money you would put in your pocket and interview for the job of selling your property.

Either you will like what I have to say and want to ... hire us ... or you won't want to... hire us ...and either one is fine.

What's better for you (_____) or (_____). Fantastic!!! See you then!

When can I take a look around to ensure that I fully understand your property so I can ...maximize your value... Now since I'm here...or ___ or ___ at ___.`,
            notes:
              "This script emphasizes building rapport through questions and positioning yourself as interviewing for the job. Fill in the blanks with specific times and personalize the company references as needed.",
          },
          {
            title: "Expired Listing Email Campaign (5 Emails)",
            objective: "Professional email sequence to nurture expired listing sellers with empathetic messaging",
            content: `EMAIL 1: Let's Turn a New Page for Your [Address] Property!
Subject: Let's Turn a New Page for Your [Address] Property!

Hi [Homeowner's Name],
I noticed that your listing at [Address] recently expired, and I understand this might be a bit discouraging. I'm [Your Name] with [Your Realty Company], and I specialize in revitalizing listings like yours. My approach is tailored to each property, focusing on targeted marketing and pricing strategies that resonate with today's buyers.

Would you be open to discussing a fresh approach for your property? I'd love to share some success stories and ideas specific to homes in [Area/Neighborhood].

Best regards,
[Your Name]

EMAIL 2: It's Time for a New Strategy for Your Home on [Street Name]
Subject: [Homeowner's Name], It's Time for a New Strategy for Your Home on [Street Name]

Dear [Homeowner's Name],
Seeing your home on [Street Name] leave the market unsold can be frustrating, but it's often just a matter of strategy. I'm [Your Name] from [Your Realty Company], and I have a track record of successfully selling properties that had previously struggled to find the right buyer.

I'd like to offer you a no-obligation assessment of your home, providing insights into the current market and how we can position your property for a successful sale.

Looking forward to hearing from you,
[Your Name]

EMAIL 3: New Possibilities Await Your Home at [Address]
Subject: New Possibilities Await Your Home at [Address]

Hello [Homeowner's Name],
I'm [Your Name], a real estate professional with [Your Realty Company]. I noticed that your property at [Address] is no longer listed. In today's dynamic market, repositioning and an innovative marketing approach can make all the difference.

I have specific ideas for your property, including a comprehensive digital marketing strategy and staging techniques that can enhance its appeal. Let's discuss how we can unlock the full potential of your home.

Warm regards,
[Your Name]

EMAIL 4: Explore a Fresh Approach to Selling Your [Area] Home
Subject: [Homeowner's Name], Explore a Fresh Approach to Selling Your [Area] Home

Greetings [Homeowner's Name],
I'm [Your Name] with [Your Realty Company], and I specialize in properties in the [Area] region. It's not uncommon for listings to expire in this complex market, but with a fresh perspective and a customized marketing plan, success is within reach.

I'd love to connect and discuss a tailored strategy that aligns with your goals and showcases your property's unique features to the right audience.

Best wishes,
[Your Name]

EMAIL 5: Revitalize Your Listing at [Address] with Proven Strategies
Subject: Revitalize Your Listing at [Address] with Proven Strategies

Hi [Homeowner's Name],
I'm [Your Name] from [Your Realty Company], reaching out regarding your property at [Address]. Sometimes, a fresh set of eyes and a new marketing approach are what's needed to sell a home. With my experience in [Area], I bring proven strategies that have helped similar homes sell quickly and at desirable prices.

Let's schedule a time to review what didn't work in the past and how we can turn things around for your property.

Regards,
[Your Name]`,
            notes:
              "Send these emails 3-5 days apart. Personalize with actual area names and specific market data when possible. Focus on empathy and fresh solutions.",
          },
          {
            title: "Expired Listing SMS Campaign (5 Messages)",
            objective: "Concise text message sequence for mobile-first expired listing outreach",
            content: `SMS 1: Friendly Introduction & Value Offer
"Hi [Homeowner's Name], I'm [Your Name] with [Your Realty Company]. I noticed your listing on [Street Name] recently expired. I have some unique strategies that might help in this challenging market. Can we chat about this?"

SMS 2: Empathetic Approach & Expertise Highlight
"Hello [Homeowner's Name], it's [Your Name] from [Your Realty Company]. Selling a home can be tough, especially in today's market. I've successfully helped homes like yours sell quickly and for a great price. Let's talk about how I can do the same for you."

SMS 3: Market Insight & Consultation Offer
"Good morning [Homeowner's Name], I'm [Your Name] with [Your Realty Company]. I specialize in properties in [Area Name] and have insights into why some listings don't close. Would you be open to a brief call to discuss your home's potential?"

SMS 4: Personalized Strategy & Success Record
"Hi [Homeowner's Name], this is [Your Name] from [Your Realty Company]. I've had success in re-listing properties like yours in [Neighborhood/Area]. I have a tailored strategy ready for your home. Are you available for a quick call to explore this?"

SMS 5: Direct & Solution-Oriented
"Hey [Homeowner's Name], I'm [Your Name] from [Your Realty Company]. Saw your listing on [Street Name] expired. I have a few ideas that could turn things around and get your house sold. Interested in hearing more?"`,
            notes:
              "Send SMS messages 2-3 days apart. Keep messages professional but friendly. Always offer specific value and avoid being pushy.",
          },
        ],
      },
      {
        id: "fsbo",
        name: "FSBO",
        description: "Scripts for For Sale By Owner prospects",
        scripts: [
          {
            title: "FSBO Door Knock Script - 15 Step System",
            objective:
              "To establish rapport with FSBO sellers through systematic questioning and secure an appointment using a proven 15-step process",
            content: `____, I'm here about the home for sale... is it still available... ____ Great!

I'm ______ with (insert brokerage name), and I know you are going to try it on your own for a little while, and I'm here to interview for the job when you are ready.....and that's why ... I'm curious...

1. If you sold this home ... where would you go next. __________ Great!

2. How soon do you have to be there. _________________ No Problem!

3. How long have you been trying to ... sell your property... on your own. ____ Wow!

4. How would you rate your motivation to ... move ... on a scale of 1 to 10. ______ Great!

5. If we were able to ... sell your home... in the next 30 days would that be OK. ___

6. What methods are you using for marketing your home. _____Interesting!

7. How did you determine your sales price. ________________ OK!

8. Are you prepared to ... adjust your price down...when working with a buyer. __ Great!

9. Why did you decide to sell yourself...rather than to ...hire the best ...Real Estate company. ________________Understandable!

10. If you were to ... hire the best Company...what would you expect us to do ... to ...get your property sold... for you. ______________ Excellent!

11. When do you think you will at least ... interview (your brokerage name)... for the job of selling your home. _____________ Wonderful!

12. What would have to happen .... to cause you to ... make the decision ...to ... HIRE THE BEST COMPANY ... (your brokerage name)...for the job of selling your property. ___ OK!

13. Let's do this... let me ... show you what your house is REALLY worth in today's market and show you the tools that only (your brokerage name) has that allow us to sell 20-30 homes a day which is more than any of our competitors.... You do... expect the best ...don't you.... Of course!

14. This way... at least you REALLY ... know your options... and if ...it makes sense...it makes sense... if it doesn't it doesn't... either way ... let's ... find out... The worst case scenario is...you'll know what your house is REALLY going to sell for... that will be nice to know.. RIGHT!

15. What would be the best time for me to come back by with today's real value, show you how much you would put in your pocket and interview for the job of selling your property? Either you will like what I have to say and want to ...hire us... or you won't want to ...hire us...and either one is fine....

What's better for you ___ or ____ Fantastic!!! See you then!

When can I take a look at the property to ensure that I fully maximize the value? ____ or ____ or right now?`,
            notes:
              "This comprehensive 15-step system builds rapport systematically. Practice the flow and timing between questions. Each question serves a specific purpose in uncovering motivation and building trust. Audio training files provide real-world examples of this script in action.",
          },
          {
            title: "FSBO Email Campaign (5 Emails)",
            objective: "Professional email sequence to nurture FSBO sellers with value-focused messaging",
            content: `EMAIL 1: Introduction and Value Proposition
Subject: Local Expertise to Maximize Your FSBO Success

Hello [Seller's Name],
As a dedicated local real estate agent, I've noticed your property on the FSBO listings. My expertise in [Your Area] real estate market positions me uniquely to assist you. While you're embarking on a FSBO journey, partnering with a professional can significantly enhance your success.

My goal is to ensure your property sells for its highest potential value. This not only benefits you but also positively impacts my other clients by establishing higher market values in our community. Let's chat about how we can achieve the best outcome for your sale.

Best regards,
[Your Name]

EMAIL 2: Highlighting Local Market Knowledge
Subject: Leverage My Local Market Insights for Your FSBO Sale

Hi [Seller's Name],
I'm [Your Name], a real estate expert in [Your Area], and I've been following your FSBO listing. My deep understanding of our local market can be a vital asset in your home selling process.

Selling at an optimal price point benefits not only you but also helps in maintaining robust property values for the entire neighborhood – something all my clients, present and future, greatly appreciate. Let's discuss how we can collaborate to maximize your sale price.

Warm regards,
[Your Name]

EMAIL 3: Focusing on Mutual Benefits
Subject: Achieving Top Dollar for Your Home Benefits Us Both

Dear [Seller's Name],
I'm reaching out as a seasoned real estate professional in [Your Area]. I see you're selling your home independently, and I admire your initiative. As someone deeply invested in the local property market, I understand how important it is for homes like yours to sell for their true worth.

Achieving a successful sale at a great price not only fulfills your goals but also elevates the market, benefiting my other clients. I'd love to explore how we can work together for mutual success.

Best,
[Your Name]

EMAIL 4: Offering Support and Guidance
Subject: Expert Guidance to Enhance Your FSBO Journey

Hello [Seller's Name],
As a real estate agent specializing in [Your Area], I noticed your FSBO listing and wanted to offer my expertise. Navigating the FSBO route can be challenging, but with the right guidance, it's incredibly rewarding.

By ensuring your home sells for the best possible price, we not only achieve your goal but also support the overall health of our local real estate market, benefiting all homeowners in the area. Let's talk about how we can make your sale a resounding success.

Regards,
[Your Name]

EMAIL 5: Emphasizing Community Impact
Subject: Your FSBO Success Contributes to Our Community's Value

Hi [Seller's Name],
I'm [Your Name], a local real estate agent, and I noticed your home listed as FSBO. Selling your home at a peak value is crucial for you and has a ripple effect throughout our community.

By achieving the best possible sale price, we elevate the market standards, benefiting all property owners in the area, including my clients. I'd be thrilled to discuss how we can collaborate to maximize your home's value and positively impact our community.

Sincerely,
[Your Name]`,
            notes:
              "Send these emails 3-5 days apart. Personalize with actual area names and specific market data when possible.",
          },
        ],
      },
      {
        id: "farming",
        name: "Farming",
        description: "Scripts for geographic farming",
        scripts: [
          {
            title: "Property Wizard Farming Script",
            objective:
              "To deliver neighborhood updates while identifying potential sellers and securing listing appointments",
            content: `___(Mirror/Match Introduction)..... I'm (_____) with (Insert Brokerage Name). I am delivering the latest edition of the Property Wizard to keep you informed on Real estate activity in OUR neighborhood. (There is a new listing /a recent sale/an open house/etc. (Find something of interest to discuss with them)

I'm curious. Who do you know that might be interested in moving into OUR area?

The _(area)_ market is heating up, we are selling about 20-30 houses a day as a company, mortgage rates are low and the inventory VERY limited so it's a great time to move up, move down or just move around town.

So I was wondering:
• When do you plan on moving? (_____) Terrific!
• How long have you lived at this address? (_____) Great!
• Where did you move from? (_____) Good for You!
• How did you happen to pick this area? (_____) Excellent! / Ouch!

I know you said you weren't going to move but I'm curious. If you were to move (hypothetically) where would you go next? (_____) And when would that be ("Hypothetically")? (_____) Fantastic!

***KEEP ASKING UNTIL YOU GET AN ANSWER!!!!!***

(Bigger house/Smaller House/ Condo/ In Florida/ Out of State/etc.)

You're probably curious as to what your property is REALLY worth in today's rising market, aren't you. ****(If they are curious- continue)**** (If not leave them with positive impression)

Let's do this let me show you what your house is REALLY worth in today's market and show you the tools that only (your brokerage) has that allow us to sell 20-30 homes a day which is more than any of our competitors. You do expect the best don't you. (_____). Of course!

This way at least you REALLY... know your options and if ... it makes sense... it makes sense. If it doesn't... it doesn't. Either way let's find out.

The worst case scenario is you'll know what your house is REALLY going to sell for. That will be nice to know. (_____) RIGHT!

So what would be the best time for me to come back by with today's real value, show you how much you would put in your pocket and interview for the job of selling your property.

Either you will like what I have to say and want to... hire us ... or you won't want to... hire us ... and either one is fine. What's better for you (_____) or (_____) Fantastic!!!

In order to maximize the value for you and do the best job when would be a good time for me to take a look at your home. NOW ... since I'm here or (_____) or (_____) at (_____). Great.

(Get Phone # and Email address)`,
            notes:
              "This script uses the Property Wizard newsletter as a door opener. The key is to keep asking questions until you get engagement. Always have current neighborhood statistics and recent sales data ready to discuss. Remember to collect contact information for follow-up.",
          },
        ],
      },
      {
        id: "soi",
        name: "SOI",
        description: "Scripts for your Sphere of Influence",
        scripts: [
          {
            title: "SOI Follow-Up Script",
            objective:
              "To systematically ask your sphere of influence for referrals and secure contact information for potential leads",
            content: `(Mirror/Match Introduction)______, its _______ This is a business call, do you have a quick minute for me? (_____)Wonderful! (We can catch up on personal stuff later.)

As you know I'm with (insert brokerage name) Real Estate is Awesome right now and I have set REALLY HIGH GOALS for myself this year, and I really could use your help...

Who do you know that is thinking about SELLING or BUYING Real Estate in the next 30/60/90 days. (_____)Great!

(Chunk Down if they can't think of anyone)
Ok, who can you think of in your (office, church group, family, neighborhood) that may be thinking about moving soon.
(Who do you know that's getting married, divorced, Job transfer, having kids, etc) (_____) Great!

It would be OK if I called them ...right. What's their contact info______________________________. (WRITE CONTACT INFO)

By the way, when do YOU plan on moving/buying investment property. (_____)Terrific!
(Set Appointment/Set them up on listing book/Confirm their Email Address for Business Builder campaign...etc.)

Thank you SO much... I'll check in with you periodically to see who you know who is interested, okay. (_____) Great! Have a great day!`,
            notes:
              "This script systematically asks for referrals by chunking down into specific life events that trigger real estate needs. Always ask for contact information and follow up on results.",
          },
          {
            title: "SOI Follow-Up - Second Contact",
            objective: "Follow-up script for subsequent SOI contacts to maintain momentum",
            content: `(Mirror/Match Introduction)It's (_____) I was thinking about our last conversation and I was wondering, who did you see, hear about, or think of who is selling or buying real estate in the next 30/60/90 days. (_____) (Great)

If they have a lead....
Thanks! What's their number? _______________________(Record number) Awesome! I'll give them a call! I really appreciate your help and I know you are going to keep looking for me...right!

Excellent! Talk to you soon. Have a great day!

If they don't have a lead for you yet...

No Problem, I know you'll keep looking for me, right... Thanks!(_____)`,
            notes:
              "Use this for follow-up contacts with your sphere. Keep it brief and focused on referrals. Always express appreciation for their help.",
          },
        ],
      },
      {
        id: "vacant-land",
        name: "Vacant Land",
        description: "Scripts for vacant land opportunities",
        scripts: [
          {
            title: "Vacant Land Prospecting Script",
            objective: "To approach owners of vacant land about selling opportunities",
            content: `(Match their greeting) It's ______ with (insert brokerage) here in _________(area).

I'm (here/calling) about your prospect. I work with builders and investors who are looking for properties to build on. If you've ever thought about cashing out, this is a great time with inventory being so tight. Supply and demand is definitely on the seller's side.

Would you be willing to sell for the right price?

(If you get a Yes)
Let me ask you (ask questions from the prompts below; find ways to connect; take notes of their answers):

How long have you owned the property?

Are you planning on building?

You're probably curious as to what properties are REALLY worth in today's market, aren't you?

Let's do this ... let me show you what your lot is REALLY worth in today's market. This way at least you REALLY know your options and if it makes sense, it makes sense. If it doesn't, it doesn't. The worst-case scenario is you'll know what your lot would sell for in today's market.`,
            notes:
              "Research zoning and potential uses before calling. Focus on current market conditions and supply/demand dynamics.",
          },
        ],
      },
    ],
  },
  {
    id: "overcoming-objections",
    name: "Overcoming Objections",
    description: "Scripts for handling common real estate objections",
    icon: Phone,
    gradientFrom: "#DC2626",
    gradientTo: "#B91C1C",
    tabs: [
      {
        id: "overcoming-objections",
        name: "Objection Responses",
        description: "Professional responses to common seller and buyer objections",
        scripts: [
          {
            title: "Commission Objection Response",
            objective: "To address commission concerns while demonstrating value",
            content: `I understand your concern about commission. Let me ask you this - if I could show you that by working with me, you'll actually net more money in your pocket even after paying commission, would that be worth discussing?

Here's what most people don't realize: The difference between a professional marketing your home and trying to do it yourself often results in a higher sale price that more than covers the commission.

Plus, consider the time, stress, and potential legal issues you avoid. When you factor in the marketing costs, your time value, and the expertise in negotiations, most sellers find they come out ahead.

Would you like me to show you exactly how this works with some recent examples?`,
            notes:
              "Focus on value and net proceeds rather than just commission percentage. Use specific examples when possible.",
          },
          {
            title: "Price Objection Response",
            objective: "To address pricing concerns and guide sellers to market reality",
            content: `I completely understand wanting to get the highest possible price for your home. That's exactly what I want for you too.

The challenge is that buyers determine value by comparison shopping. They're looking at what they can get for their money compared to other homes on the market.

If we price above market value, we risk your home sitting on the market, which actually costs you money in the long run. Homes that sit too long often sell for less than they would have if priced correctly from the start.

Let me show you the Strategic Positioning Analysis I prepared. This shows exactly where your home fits in today's market and how we can position it to sell quickly and for top dollar.`,
            notes:
              "Use market data to support your position. Always bring the conversation back to net proceeds and timeline.",
          },
          {
            title: "Think It Over Objection",
            objective: "To address hesitation and move toward a decision",
            content: `I completely understand wanting to think it over - this is a big decision. 

Let me ask you this: What specifically would you like to think about? Is it the price, the marketing strategy, or something else?

(Listen to their response, then address the specific concern)

Here's what I've found: The longer a property sits on the market without professional representation, the more it costs sellers in the end. Every day that passes is another day your competition is getting ahead.

What would have to happen for you to feel comfortable moving forward today?`,
            notes: "Identify the specific concern behind the objection. Create urgency without being pushy.",
          },
        ],
      },
    ],
  },
  {
    id: "listing-scripts",
    name: "Listing Scripts",
    description: "Scripts for listing presentations and seller interactions",
    icon: Home,
    gradientFrom: "#10B981",
    gradientTo: "#059669",
    tabs: [
      {
        id: "listing-prequal",
        name: "Listing PreQual",
        description: "Script for pre-qualifying sellers before the listing presentation",
        scripts: [
          {
            title: "Listing PreQual Script",
            objective:
              "To confirm appointment details and gather essential information before the listing presentation",
            content: `Mirror and Match greeting. (Repeat back their greeting exactly - match their energy / tonality / vocabulary)

__________ it's ________________ with (Your brokerage). I'm calling to confirm our appointment at _____ on _____. Does that still work for you? In order to make the most efficient use of our time, I'd like to confirm some information and ask you a few questions.

ASK QUESTIONS.
REPEAT AND APPROVE THEIR ANSWERS.
TAKE NOTES DURING THE CONVERSATION.

• Are you interviewing more than one agent? Who?
• Will all of the decision makers be at our meeting?
• Where are you moving?
• When would be the ideal date to close and move? How soon do you have to be there? Why? (reason for moving)
• What do you feel is the approximate value of the home?
• Will your plans change if you can't get your price? Why?
• Have you already found your next home?
• Have you already bought your next home? If not, I'd love to interview for the job of being your buyer's agent.
• How much do you owe on your home?
• Will you help finance the home for the buyer or do you need to take the cash out for the next home?
• Do you need to sell this property in order to purchase your next?
• How would you describe your home? (take notes, use their words for your marketing remarks)
• How would you rate your home on a scale from 1 to 10?
• What would make it a 10?
• Why did you select this home ... what sold YOU?
• What did you enjoy most about living here?
• What do you think is the biggest drawback?
• What is the best feature?
• What's the most recent upgrade?
• Have there been other improvements to the property?
• What's the approximate age of the roof?
• Age of appliances?

I'd like to send over a brief video showing our marketing strategies. What's your preferred method of contact? Text or email? (send the Strategic Marketing Presentation video)

I'd also like to email you our listing documents and disclosures for your review. This will be coming in an email from me through dotloop. (set up a listing loop and share with the seller)

Here's a blank sample of our Strategic Positioning Analysis. I'll be back with one of these specifically prepared for your property for us to review together. (send blank example using the Listing Package in MoxiPresent)

This will show:
• Your top 5 competitors so we can evaluate the features and benefits vs your property
• 5 most recent solds (that appraisers will see)
• 5 most recent properties that have been rejected (no longer on the market)`,
            notes:
              "This script helps you gather crucial information before the presentation. Take detailed notes and use their own words in your marketing materials. Confirm all decision makers will be present and send all promised materials promptly.",
          },
        ],
      },
      {
        id: "listing-presentation",
        name: "Listing Presentation",
        description: "Complete script for the listing presentation meeting",
        scripts: [
          {
            title: "The Listing Presentation Script",
            objective:
              "To secure the listing agreement through a structured presentation focused on motivation and pricing",
            content: `Mirror and Match greeting. (Repeat back their greeting exactly - match their energy / tonality / vocabulary)

ASK QUESTIONS.
REPEAT AND APPROVE THEIR ANSWERS.
TAKE NOTES DURING THE CONVERSATION.


Thank you for having me over. This should only take a few minutes. Let's go have a seat at the kitchen table.

I wrote down 3 important questions for you ...

• Have you absolutely decided to sell your property?

• Will you position your property to sell versus the competition? Or do we position your property so it sits on the market?

• (it's totally ok to say Yes to this one) Do you want (insert your brokerage name) to handle the sale for you?

If they say yes, Go to the PRICING and SIGN THE CONTRACT.
If "No" or they are not sure yet ... then continue on!

TALK PRICE ONCE HIRED.

At the end of my presentation, one of three things will happen ...

• You'll have the opportunity to hire us.
• You'll decide not to hire me
• We'll decide not to market your property ... and any of these is fine. (This will only happen if we can't come to agreement on price and terms)

Let's quickly take a moment to review the questions I asked you over the phone.

• You said you were moving to (_______________) Right?
• And you said you want to be there by (______________) Correct?
• You think you would like to price your property at (_______________) Right?
• And ... you said you owe (_________________) Right?
• And ... you did (did not) want to hold seller financing (___________________) Correct?

Did you have the opportunity to watch the presentation that I emailed to you?

YES - Great! Any questions? What did you think about it?
NO - No Problem. Please take a few minutes when you can. (or offer to watch it together)

There are really only two issues we have to look at today.

• Your motivation to sell your property ... and
• The price we set on your property.

Now ... It's important that you understand ... these are the only two issues in selling real estate today ... are we clear on that?

I have prepared a Strategic Positioning Analysis for you.

The purpose of the Strategic Positioning Analysis is to determine the value of your home in the eyes of the BUYER. Do you know how Buyers determine value? Buyers determine value by comparison shopping. They look at the price of your home based on its features and benefits, and they compare it with the features and benefits of similar homes that have sold recently or are currently on the market.

What we have found is that if you want to increase VALUE: You need to either

• Lower the price ... or...
• Have more features and benefits for the same price.

So ... unless you're planning to add more features/benefits to your home ... Are you? (NO) Then ... price is the only issue. Can I show you what I mean? Let's look at the Strategic Positioning Analysis that I prepared for you.

We are going to compare your property with:

• 5 Similar Properties (Current competition) - What Buyers Can Pay.
• 5 Sold Properties - What Buyers Did Pay.
• 5 Expired/Withdrawn/Cancelled - What Buyers Refused to Pay.

Here are my questions for you. (Ask for each ... ACTIVES 1st, SOLDS 2nd, and EXPIREDS 3rd)

• What's the least expensive home we are competing with (Active)(Sold) (Expired) ... CIRCLE THEIR ANSWER
• What's the most expensive home we are competing with (Active) (Sold) (Expired) ... CIRCLE THEIR ANSWER
• Which home is most similar to yours ... (Active) (Sold) (Expired) ... CIRCLE THEIR ANSWER

You said that you would like to have this property sold by _______, right? OK. Let's review our Seller's Cost Estimator to see how much money you will put in your pocket in the time frame that you want. Here is the range of values where your home should sell.

• Pricing towards the left side will result in a SLOWER sale.
• Pricing towards the right side will result in a FASTER sale.
• Pricing towards the middle will result in a sale in the AVERAGE time on market.

Now that you've seen these prices ... what price do you feel we should use to get this property sold for you in your timeframe? I will write that price in the listing agreement and let's simply ... SIGN THE LISTING AGREEMENT ... and let's get your property sold!`,
            notes:
              "This presentation script focuses on two key issues: motivation and pricing. Use the Strategic Positioning Analysis to guide pricing discussions. Always aim to secure the listing agreement at the end of the presentation.",
          },
        ],
      },
    ],
  },
  {
    id: "buyer-scripts",
    name: "Buyer Scripts",
    description: "Scripts for buyer consultations and interactions",
    icon: Home,
    gradientFrom: "#0EA5E9",
    gradientTo: "#0284C7",
    tabs: [
      {
        id: "buyer-prequal",
        name: "Buyer PreQual",
        description: "Script for pre-qualifying buyers before consultation",
        scripts: [
          {
            title: "Buyer Pre Qualification Script",
            objective: "To confirm appointment details, assess financing status, and gather buyer requirements",
            content: `Hi, this is________________________ with (your brokerage name) The reason I'm calling is to ...SET/CONFIRM our appointment...to get you into your next property...

Would____ Or____work better for you. _______

In order to make the most efficient use of our time...and provide you with the best service, I'd like to confirm some information and ask you a few questions prior to our meeting, Okay. _____(Super)

Buyer's who ... get pre-approved for a mortgage ... are in a much better negotiating position than those who don't ... Have you, by any chance, already arranged financing for your new property._____(Good)

If YES – Good for you! What lender are you working with. Super! Let me do you a favor ... let's see if our in house loan officer might be able to help you to ... get a better rate... I will have him/her call you when we are finished...

If NO - Our In-House Loan Officers work with over 500 lenders to get you the best loan program. I will have one of our loan officers call you later today...

And, how much of a down payment do you plan to invest. __________Great!

And, what price ranges are you entertaining. $ To $ . Super!

Ideally, when would you like to move into your new home. Great!

Do you have to sell the property you are in now before you buy the new on...

I'm going to be sending you a link to a very brief overview presentation that I'd like you to watch before our meeting...

Let me confirm your e-mail address.____________________________

I'm also going to send you a link to a cool service that I actually pay for ...for you... which is going to send you daily updates of everything new that hits the inventory...that matches your criteria...its going to allow you to have a great understanding between now and the time anything new comes on the market before (_________).

When we get together, we're going to review all of your options as far as location...style of home...amenities...neighborhoods...everything you can possibly think of. In order to ...save us time ... I'd like to ask you to ...complete our Lifestyle Profile ... it will tell me your wants and needs better...so I can do the VERY BEST JOB for you. I'll e-mail it to you. (__) GREAT!

What you are going to find is that we have a very thorough system for finding the right home for each of our clients. Quite frankly...I think it's the best system in the industry. When we get together on ____________, we'll review the entire process and I'll answer any questions that you may have.`,
            notes:
              "This script systematically gathers buyer information while positioning your professional services. Always follow up with promised materials and confirm all appointments.",
          },
        ],
      },
    ],
  },
]
