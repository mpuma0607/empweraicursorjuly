"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTenantConfig } from "@/contexts/tenant-context"
import { 
  HelpCircle, 
  ArrowLeft, 
  MessageSquare, 
  BookOpen, 
  Settings, 
  Brain,
  Target,
  Megaphone,
  GraduationCap
} from "lucide-react"

export default function FAQPage() {
  const tenantConfig = useTenantConfig()

  const faqCategories = [
    {
      title: "Getting Started",
      icon: BookOpen,
      color: "bg-blue-500",
      questions: [
        {
          question: "How do I get started with the platform?",
          answer: "Start by visiting the Onboarding Hub to complete your agent profile setup, configure your Moxi Works account, and set up Dotloop. The Portal Dashboard will guide you through all available tools and resources."
        },
        {
          question: "What's the difference between Empower AI and Beggins University?",
          answer: "Empower AI is our general real estate platform, while Beggins University is specifically designed for Century 21 Beggins agents with additional training modules and branding resources."
        },
        {
          question: "How do I access my profile and settings?",
          answer: "Click on 'Profile' in the main navigation to access your account settings, branding preferences, and personal information. You can also manage your logo and branding assets there."
        }
      ]
    },
    {
      title: "AI Tools",
      icon: Brain,
      color: "bg-purple-500",
      questions: [
        {
          question: "What AI tools are available?",
          answer: "We offer a comprehensive suite of AI tools including IdeaHub for social media content, ScriptIT for real estate scripts, QuickCMA for market analysis, RealBio for agent bios, and many more. Visit the AI Hub to explore all available tools."
        },
        {
          question: "How do I use IdeaHub for social media content?",
          answer: "IdeaHub helps you create engaging social media posts. Simply enter your topic, select your brand, choose content type, and let AI generate creative posts with images. You can customize the tone, language, and add your contact information."
        },
        {
          question: "Can I customize the AI-generated content?",
          answer: "Yes! All AI tools allow you to customize the generated content. You can edit text, adjust tone, change language, add your branding, and modify the output to match your style and needs."
        },
        {
          question: "What's the difference between IdeaHub Empower and IdeaHub Beggins?",
          answer: "IdeaHub Empower is for general real estate agents, while IdeaHub Beggins is specifically tailored for Century 21 Beggins agents with brand-specific content and styling options."
        }
      ]
    },
    {
      title: "Marketing & Branding",
      icon: Megaphone,
      color: "bg-pink-500",
      questions: [
        {
          question: "How do I create branded content?",
          answer: "Use the Dynamic Branded Content tool in the Marketing Hub to create custom branded materials. You can upload your logo, select colors, add contact information, and generate professional marketing materials for any topic."
        },
        {
          question: "Where can I find my brokerage logos?",
          answer: "Visit the Brokerage Logos section in the Marketing Hub to access your company's official logos and branding assets. For Beggins agents, you'll find Century 21 specific logos and materials."
        },
        {
          question: "How do I stay updated with real estate news?",
          answer: "Check out the Real Estate Hot Takes section for the latest industry news, trends, and insights. This RSS feed is updated regularly with relevant real estate content you can share on social media."
        }
      ]
    },
    {
      title: "Prospecting",
      icon: Target,
      color: "bg-green-500",
      questions: [
        {
          question: "What prospecting strategies are available?",
          answer: "We provide comprehensive prospecting strategies for FSBOs, absentee owners, expired listings, probate properties, SOI marketing, pre-foreclosure leads, first-time buyers, investors, and divorce situations. Each strategy includes scripts, templates, and step-by-step guides."
        },
        {
          question: "How do I find property owners?",
          answer: "Use the Who's Who AI tool to skip trace property owners. Simply enter the property address and the AI will help you find contact information for property owners, including phone numbers and email addresses."
        },
        {
          question: "What scripts should I use for prospecting?",
          answer: "The ScriptIT tool provides custom real estate scripts for any situation. You can also find proven scripts in the Script Mastery training course, which covers objection handling and conversion techniques."
        }
      ]
    },
    {
      title: "Training & Development",
      icon: GraduationCap,
      color: "bg-indigo-500",
      questions: [
        {
          question: "What training programs are available?",
          answer: "We offer comprehensive training including Social Media Mastery, Negotiation Mastery, Script Mastery, Moxi Works Training, Buyer Process (6P's), Listing Process (7P's), and DISC/VAK Connection training. Beggins agents also have access to daily morning huddles and specialized training modules."
        },
        {
          question: "How do I access the training materials?",
          answer: "Visit the Training Hub to access all training programs. Each course includes modules, practical exercises, field assignments, and downloadable resources. You can work through the courses at your own pace."
        },
        {
          question: "Are there any live training sessions?",
          answer: "Yes! Beggins University agents have access to daily morning huddles for motivation, updates, and live training. Check the Training Hub for upcoming sessions and special events."
        }
      ]
    },
    {
      title: "Technical Support",
      icon: Settings,
      color: "bg-gray-500",
      questions: [
        {
          question: "I'm having trouble with a tool. Where can I get help?",
          answer: "Visit the Support Center for technical assistance. You can report bugs, request features, or get help with any platform issues. Our support team is available to help you succeed."
        },
        {
          question: "How do I update my profile information?",
          answer: "Go to Profile in the main navigation to update your personal information, contact details, and preferences. Make sure to keep your information current for the best experience with AI tools and personalized content."
        },
        {
          question: "Can I change my branding preferences?",
          answer: "Yes! Visit Profile > Branding to update your logo, colors, and branding preferences. These settings will be used across all AI tools and content generation features."
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/resource-center" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Resource Center
          </Link>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <HelpCircle className="h-4 w-4" />
              Frequently Asked Questions
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {tenantConfig.name} FAQ
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about using the {tenantConfig.name} platform.
            </p>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => {
            const Icon = category.icon
            return (
              <Card key={categoryIndex} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${category.color} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`${categoryIndex}-${faqIndex}`} className="border-b last:border-b-0">
                        <AccordionTrigger className="px-6 py-4 text-left hover:bg-gray-50">
                          <span className="font-medium text-gray-900">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Still Need Help */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Still need help?
              </CardTitle>
              <CardDescription>
                Can't find the answer you're looking for? Our support team is here to help.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/support">
                  <Button className="w-full sm:w-auto">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </Link>
                <Link href="/resource-center">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse Resources
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
