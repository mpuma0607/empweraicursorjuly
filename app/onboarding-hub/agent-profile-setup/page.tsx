"use client"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  CheckCircle,
  Circle,
  Users,
  Wifi,
  Mail,
  Calendar,
  Phone,
  User,
  CreditCard,
  Building,
  Globe,
  GraduationCap,
  Key,
  Wrench,
  Calculator,
  Shield,
  AlertTriangle,
  List,
  FilePenLineIcon as Signature,
  Download,
  ExternalLink,
  FileText,
  Smartphone,
  Scale,
  PlayCircle,
  Loader2,
} from "lucide-react"
import { useTenant } from "@/contexts/tenant-context"
import { useUserProgress } from "@/hooks/use-user-progress"
import { LeadershipGuideViewer } from "@/components/leadership-guide-viewer"
import { GetConnectedViewer } from "@/components/get-connected-viewer"
import { GSuiteSetupViewer } from "@/components/gsuite-setup-viewer"
import { CompanyCalendarViewer } from "@/components/company-calendar-viewer"
import { VoicemailSetupViewer } from "@/components/voicemail-setup-viewer"
import Image from "next/image"

const steps = [
  {
    id: 1,
    title: "Meet Your Leadership Team & Who To Contact For What",
    description: "Get to know your leadership team and understand the chain of command",
    icon: Users,
    content: {
      overview: "Understanding your leadership structure is crucial for success at Century 21 Beggins.",
      steps: [
        "Review the leadership organizational chart below",
        "Schedule meet-and-greet with your direct manager",
        "Learn about each department head's responsibilities",
        "Save important contact information in your phone",
        "Understand escalation procedures for different situations",
      ],
      tips: "Keep a contact sheet handy for your first few weeks!",
      hasImageViewer: true,
    },
  },
  {
    id: 2,
    title: "Get Connected - Wifi, Office Access, Printers",
    description: "Set up your physical office access and connectivity (BE3 Agents may skip)",
    icon: Wifi,
    content: {
      overview: "Get connected to all office systems and equipment you'll need daily.",
      steps: [
        "Obtain your office key card and test access",
        "Connect to the office WiFi network",
        "Set up printer access on your devices",
        "Test copier/scanner functionality",
        "Learn office security procedures and codes",
      ],
      tips: "BE3 agents working remotely can skip the physical office setup steps.",
      hasImageViewer: true,
    },
  },
  {
    id: 3,
    title: "G-Suite & Email Set Up",
    description: "Configure your professional email and Google Workspace access",
    icon: Mail,
    content: {
      overview: "Your G-Suite account is your gateway to all Century 21 Beggins digital tools.",
      steps: [
        "Receive your @c21beggins.com email credentials",
        "Set up email on all your devices (phone, tablet, computer)",
        "Configure email signature with your contact information",
        "Set up Gmail filters and labels for organization",
        "Access Google Drive and shared folders",
      ],
      tips: "Use a professional headshot in your email signature to build recognition!",
      hasImageViewer: true,
    },
  },
  {
    id: 4,
    title: "How To Set Up Company Calendar",
    description: "Integrate with the company calendar system for scheduling",
    icon: Calendar,
    content: {
      overview: "Stay synchronized with company events and team schedules.",
      steps: [
        "Access the shared Century 21 Beggins calendar",
        "Add company calendar to your personal calendar app",
        "Set up calendar notifications and reminders",
        "Learn how to book conference rooms",
        "Understand calendar sharing permissions",
      ],
      tips: "Color-code different types of appointments for better organization!",
      hasImageViewer: true,
    },
  },
  {
    id: 5,
    title: "How To Add Voicemail Greeting",
    description: "Set up a professional voicemail message",
    icon: Phone,
    content: {
      overview: "Your voicemail greeting is often the first impression clients have of you.",
      steps: [
        "Access your phone system voicemail settings",
        "Record a professional greeting message",
        "Include your name, company, and callback promise",
        "Test the greeting by calling yourself",
        "Set up voicemail-to-email notifications",
      ],
      tips: "Keep your greeting under 20 seconds and speak clearly!",
      hasImageViewer: true,
    },
  },
  {
    id: 6,
    title: "How To Write Your Agent Bio",
    description: "Create a compelling professional biography",
    icon: User,
    content: {
      overview: "Your agent bio tells your story and builds trust with potential clients.",
      steps: [
        "Gather information about your background and experience",
        "Write a compelling opening statement",
        "Include your specialties and areas of expertise",
        "Add personal touches that make you relatable",
        "Review and edit for clarity and professionalism",
      ],
      tips: "Include a professional headshot and mention local community involvement!",
      hasCustomContent: true,
    },
  },
  {
    id: 7,
    title: "Printed & Digital Business Cards",
    description: "Order business cards and set up digital versions",
    icon: CreditCard,
    content: {
      overview: "Business cards remain essential networking tools in real estate.",
      steps: [
        "Submit your information for business card design",
        "Review and approve the design proof",
        "Place order for printed business cards",
        "Set up digital business card for easy sharing",
        "Learn best practices for business card distribution",
      ],
      tips: "Always carry business cards and consider QR codes for easy contact sharing!",
      hasCustomContent: true,
    },
  },
  {
    id: 10,
    title: "MLS Set Up",
    description: "Get access to the Multiple Listing Service",
    icon: Building,
    content: {
      overview: "MLS access is essential for property searches and listing management.",
      steps: [
        "Complete MLS application and background check",
        "Attend required MLS orientation session",
        "Set up your MLS login credentials",
        "Learn basic search and listing functions",
        "Download MLS mobile app for field access",
      ],
      tips: "Bookmark frequently used MLS searches to save time!",
      hasCustomContent: true,
    },
  },
  {
    id: 11,
    title: "How To Use 21online.com",
    description: "Navigate the Century 21 online platform",
    icon: Globe,
    content: {
      overview: "21online.com is your hub for Century 21 resources and tools.",
      steps: [
        "Create your 21online.com account",
        "Explore available marketing materials",
        "Learn how to customize marketing pieces",
        "Access training resources and webinars",
        "Set up your agent profile on the platform",
      ],
      tips: "Check 21online regularly for new marketing materials and company updates!",
      hasCustomContent: true,
    },
  },
  {
    id: 13,
    title: "How To Set Up Real Satisfied Reviews",
    description: "Implement client review and feedback system",
    icon: Building,
    content: {
      overview: "Real Satisfied helps you gather and manage client reviews and referrals.",
      steps: [
        "Set up your Real Satisfied account",
        "Customize your review request templates",
        "Learn how to send review requests to clients",
        "Set up automated review campaigns",
        "Monitor and respond to reviews",
      ],
      tips: "Send review requests within 24-48 hours of closing for best response rates!",
      hasCustomContent: true,
    },
  },
  {
    id: 14,
    title: "Zillow Showcase",
    description: "Optimize your Zillow agent profile",
    icon: Building,
    content: {
      overview: "Your Zillow profile is often where potential clients first discover you.",
      steps: [
        "Claim and verify your Zillow agent profile",
        "Upload professional photos and bio",
        "Add your recent sales and client reviews",
        "Set up Zillow Premier Agent if applicable",
        "Learn how to respond to Zillow leads",
      ],
      tips: "Keep your Zillow profile updated with recent sales and client testimonials!",
      hasCustomContent: true,
    },
  },
  {
    id: 15,
    title: "Setting Up Your Online Presence",
    description: "Establish profiles on Zillow, Realtor.com, GMB, and YouTube",
    icon: Globe,
    content: {
      overview: "A strong online presence across multiple platforms increases your visibility.",
      steps: [
        "Optimize your Zillow agent profile",
        "Set up your Realtor.com professional profile",
        "Create/claim your Google My Business listing",
        "Start your YouTube channel for video marketing",
        "Ensure consistent branding across all platforms",
      ],
      tips: "Use the same professional headshot and bio across all platforms for consistency!",
      hasCustomContent: true,
    },
  },
  {
    id: 16,
    title: "Where To Find Us Online",
    description: "Learn about Century 21 Beggins' online presence",
    icon: Globe,
    content: {
      overview: "Understanding your company's online presence helps you leverage it for your business.",
      steps: [
        "Explore the main Century 21 Beggins website",
        "Follow company social media accounts",
        "Learn how to share company content",
        "Understand co-branding guidelines",
        "Access company marketing materials",
      ],
      tips: "Share company content regularly to show you're part of a professional team!",
      hasCustomContent: true,
    },
  },
  {
    id: 17,
    title: "Join C21's Global Network",
    description: "Connect with the broader Century 21 community",
    icon: Globe,
    content: {
      overview: "Century 21's global network provides resources and referral opportunities.",
      steps: [
        "Create your Century 21 global network profile",
        "Join relevant Century 21 Facebook groups",
        "Access Century 21 University training resources",
        "Learn about referral programs and opportunities",
        "Connect with other Century 21 agents",
      ],
      tips: "The Century 21 network is a powerful resource for referrals and knowledge sharing!",
      hasCustomContent: true,
    },
  },
  {
    id: 18,
    title: "Board Of Realtors Additional Required Courses",
    description: "Complete mandatory continuing education",
    icon: GraduationCap,
    content: {
      overview: "Stay compliant with local board requirements and enhance your knowledge.",
      steps: [
        "Review your local board's continuing education requirements",
        "Enroll in required courses",
        "Schedule and complete coursework",
        "Submit completion certificates to the board",
        "Track your continuing education credits",
      ],
      tips: "Don't wait until the last minute - spread your CE requirements throughout the year!",
      hasCustomContent: true,
    },
  },
  {
    id: 19,
    title: "E-Key Set Up",
    description: "Get access to electronic lockbox system",
    icon: Key,
    content: {
      overview: "E-Key provides secure access to listed properties for showings.",
      steps: [
        "Apply for E-Key through your local MLS",
        "Complete required background check",
        "Download the E-Key mobile app",
        "Activate your E-Key device",
        "Learn proper E-Key usage protocols",
      ],
      tips: "Always follow proper showing procedures and log your property visits!",
      hasCustomContent: true,
    },
  },
  {
    id: 20,
    title: "Intro to Utility Helpers",
    description: "Learn about utility connection services for clients",
    icon: Wrench,
    content: {
      overview: "Utility Helpers streamlines utility connections for your clients.",
      steps: [
        "Set up your Utility Helpers account",
        "Learn how the service works",
        "Understand how to refer clients",
        "Learn about available utilities and services",
        "Practice using the referral system",
      ],
      tips: "This service adds value for your clients and can generate additional income!",
      hasCustomContent: true,
    },
  },
  {
    id: 21,
    title: "Closing Cost Estimator App",
    description: "Use tools to estimate closing costs for clients",
    icon: Calculator,
    content: {
      overview: "Accurate closing cost estimates help clients prepare financially.",
      steps: [
        "Download the closing cost estimator app",
        "Learn how to input property and loan information",
        "Practice creating estimates for different scenarios",
        "Understand how to explain costs to clients",
        "Learn when to refer to lenders for precise figures",
      ],
      tips: "Always explain that estimates are approximate and final costs may vary!",
      hasCustomContent: true,
    },
  },
  {
    id: 22,
    title: "Agent Legal Hotline",
    description: "Access legal support and guidance",
    icon: Shield,
    content: {
      overview: "The legal hotline provides guidance on complex real estate situations.",
      steps: [
        "Get your legal hotline access information",
        "Learn what types of questions are appropriate",
        "Understand the hotline's hours and availability",
        "Practice using the service with sample scenarios",
        "Know when to escalate to your broker",
      ],
      tips: "Don't hesitate to call when you're unsure - it's better to ask than assume!",
      hasCustomContent: true,
    },
  },
  {
    id: 23,
    title: "Agent Safety Protocols",
    description: "Learn safety procedures for showing properties",
    icon: AlertTriangle,
    content: {
      overview: "Your safety is paramount when working with clients and showing properties.",
      steps: [
        "Review company safety policies and procedures",
        "Learn about safe showing practices",
        "Understand client verification procedures",
        "Know emergency contact procedures",
        "Practice safety scenarios and responses",
      ],
      tips: "Trust your instincts - if something feels wrong, prioritize your safety!",
      hasCustomContent: true,
    },
  },
  {
    id: 24,
    title: "Forewarn, Been Verified, and Title Toolbox",
    description: "Set up client screening and title research tools",
    icon: Shield,
    content: {
      overview: "These tools help you screen clients and research property information safely.",
      steps: [
        "Set up your Forewarn account for client screening",
        "Learn how to use Been Verified for background checks",
        "Access Title Toolbox for property research",
        "Practice using each tool with sample data",
        "Understand privacy and legal considerations",
      ],
      tips: "Use these tools consistently to protect yourself and provide better service!",
      hasCustomContent: true,
    },
  },
  {
    id: 25,
    title: "Do Not Call List",
    description: "Understand compliance with telemarketing regulations",
    icon: List,
    content: {
      overview: "Compliance with Do Not Call regulations is legally required.",
      steps: [
        "Learn about Do Not Call List requirements",
        "Understand exemptions for real estate professionals",
        "Set up systems to check numbers before calling",
        "Learn proper procedures for cold calling",
        "Understand penalties for non-compliance",
      ],
      tips: "When in doubt, don't call - focus on referrals and warm leads instead!",
      hasCustomContent: true,
    },
  },
  {
    id: 26,
    title: "Adding Calendly To Email Signature",
    description: "Streamline appointment scheduling with clients",
    icon: Signature,
    content: {
      overview: "Calendly makes it easy for clients to schedule appointments with you.",
      steps: [
        "Set up your Calendly account and availability",
        "Create different meeting types (consultation, showing, etc.)",
        "Generate your Calendly scheduling link",
        "Add the link to your email signature",
        "Test the scheduling process",
      ],
      tips: "Set buffer time between appointments and block out personal time!",
      hasCustomContent: true,
    },
  },
  {
    id: 27,
    title: "Export Your Contacts",
    description: "Transfer existing contacts to your new systems",
    icon: Download,
    content: {
      overview: "Your existing contacts are valuable - make sure they're properly imported.",
      steps: [
        "Export contacts from your previous phone/email system",
        "Clean and organize contact data",
        "Import contacts into your CRM system",
        "Verify contact information accuracy",
        "Set up contact categories and tags",
      ],
      tips: "Take time to clean your contact list - quality is better than quantity!",
      hasCustomContent: true,
    },
  },
  {
    id: 28,
    title: "Attend Tech and Tools Overview",
    description: "Join the weekly training session to learn essential tools and systems",
    icon: GraduationCap,
    content: {
      overview: "Complete your onboarding by attending the comprehensive Tech and Tools Overview session.",
      steps: [
        "Mark your calendar for Wednesdays 1pm-3pm EST",
        "Join the Zoom meeting using code 993 604 7345",
        "Ensure your camera is on as required",
        "Learn about MoxiWorks CRM and marketing tools",
        "Understand dotloop for contracts and e-signing",
        "Explore Beggins University training resources",
      ],
      tips: "This session is essential for understanding all the tools you'll use daily in your real estate business!",
      hasCustomContent: true,
    },
  },
]

export default function AgentProfileSetupPage() {
  const { completedSteps, toggleStep, isLoading, error } = useUserProgress("agent-profile-setup")
  const { tenantConfig } = useTenant()

  const completionPercentage = Math.round((completedSteps.length / steps.length) * 100)

  const renderAgentBioContent = () => (
    <div className="flex-1 overflow-y-auto space-y-6">
      <div>
        <h4 className="font-semibold mb-3">Create Your Professional Agent Bio:</h4>
        {/* RealBio AI Tool Section */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4 mb-4">
          <h5 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">🤖 AI-Powered Bio Creation</h5>
          <p className="text-yellow-700 mb-3">
            To write a beautiful bio that takes into account DISC and VAK personality types, use our RealBio AI Tool:
          </p>
          <Button
            onClick={() => window.open("/ai-hub/realbio", "_blank")}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open RealBio AI Tool
          </Button>
        </div>
        <ol className="list-decimal list-inside space-y-2">
          <li className="text-sm text-gray-700">Gather information about your background and experience</li>
          <li className="text-sm text-gray-700">Write a compelling opening statement</li>
          <li className="text-sm text-gray-700">Include your specialties and areas of expertise</li>
          <li className="text-sm text-gray-700">Add personal touches that make you relatable</li>
          <li className="text-sm text-gray-700">Review and edit for clarity and professionalism</li>
        </ol>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <FileText className="h-4 w-4" />💡 How to Use Your Bio:
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Add it to your website's "About" page</li>
          <li>• Use it in your social media profiles</li>
          <li>• Include it in marketing materials and brochures</li>
          <li>• Add it to your email signature</li>
          <li>• Use it for speaking engagements and networking events</li>
          <li>• Print the PDF for professional presentations</li>
        </ul>
      </div>
      <div className="bg-green-50 p-3 rounded-lg">
        <h4 className="font-semibold text-green-900 mb-1">💡 Pro Tip:</h4>
        <p className="text-sm text-green-800">
          Include a professional headshot and mention local community involvement to build trust and connection with
          potential clients!
        </p>
      </div>
    </div>
  )

  const renderBusinessCardsContent = () => (
    <div className="flex-1 overflow-y-auto space-y-6">
      <div>
        <h4 className="font-semibold mb-3">Order Your Business Cards:</h4>
        {/* Business Cards Guide Image */}
        <div className="mb-6">
          <Image
            src="/images/business-cards-guide.png"
            alt="Business Cards Ordering Guide for Beggins and BE3 Agents"
            width={800}
            height={600}
            className="w-full h-auto rounded-lg border shadow-sm"
          />
        </div>
        {/* Beggins Agents Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h5 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            For Beggins Agents:
          </h5>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
            <li>
              Go to <strong>c21cards.com</strong>
            </li>
            <li>Choose your preferred style from the available designs</li>
            <li>Email the card number (for both front and back sides) to your admin</li>
            <li>You'll receive a proof in your company email</li>
            <li>Once approved, your cards will be ordered and shipped to your home address</li>
          </ol>
        </div>
        {/* BE3 Agents Section */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
          <h5 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            For BE3 Agents:
          </h5>
          <div className="text-sm text-purple-700">
            <p className="mb-2">
              Go to <strong>oakleysign.com/century21beggins</strong> to place your business card order.
            </p>
            <Button
              onClick={() => window.open("https://oakleysign.com/century21beggins", "_blank")}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              size="sm"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Order BE3 Business Cards
            </Button>
          </div>
        </div>
        {/* Digital Business Cards Section */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h5 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Digital Business Cards (BUP):
          </h5>
          <ul className="list-disc list-inside space-y-2 text-sm text-green-700">
            <li>Upon joining, you'll receive a BUP tag (digital business card for your phone)</li>
            <li>This will be shipped to your home address</li>
            <li>Monthly subscription service for the first year is covered by the company</li>
            <li>After the first year, the agent picks up this cost</li>
            <li>Perfect for networking events and easy contact sharing</li>
          </ul>
        </div>
      </div>
      <div className="bg-yellow-50 p-3 rounded-lg">
        <h4 className="font-semibold text-yellow-900 mb-1">💡 Pro Tip:</h4>
        <p className="text-sm text-yellow-800">
          Always carry both physical and digital business cards. Consider adding QR codes to your printed cards for easy
          contact sharing, and use your BUP tag at networking events for instant digital connections!
        </p>
      </div>
    </div>
  )


  const renderMLSSetupContent = () => (
    <div className="flex-1 overflow-y-auto space-y-6">
      <div>
        <h4 className="font-semibold mb-3">MLS Setup:</h4>
        <div className="mb-6">
          <Image
            src="/images/mls-setup-1.png"
            alt="MLS Setup - Access to Real Estate Listings"
            width={800}
            height={500}
            className="w-full h-auto rounded-lg border shadow-sm"
          />
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
          <h5 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            MLS Setup:
          </h5>
          <ol className="list-decimal list-inside space-y-2 text-sm text-purple-700">
            <li>
              Go to <strong>MLS.com</strong>
            </li>
            <li>Create an account using your Century21 credentials</li>
            <li>Verify your information and set up your profile</li>
            <li>Access real estate listings and tools</li>
          </ol>
        </div>
      </div>
      <div className="bg-purple-50 p-3 rounded-lg">
        <h4 className="font-semibold text-purple-900 mb-1">💡 Pro Tip:</h4>
        <p className="text-sm text-purple-800">
          MLS is a valuable resource for accessing real estate listings and tools. Make sure your profile is complete
          and up-to-date to maximize your visibility and opportunities.
        </p>
      </div>
    </div>
  )

  const render21OnlineContent = () => (
    <div className="flex-1 overflow-y-auto space-y-6">
      <div>
        <h4 className="font-semibold mb-3">21online Setup:</h4>
        <div className="mb-6">
          <Image
            src="/images/21online-setup-1.png"
            alt="21online Setup - Access to Company Resources"
            width={800}
            height={500}
            className="w-full h-auto rounded-lg border shadow-sm"
          />
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h5 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
            <Building className="w-4 h-4" />
            21online Setup:
          </h5>
          <ol className="list-decimal list-inside space-y-2 text-sm text-red-700">
            <li>
              Go to <strong>21online.com</strong>
            </li>
            <li>Create an account using your Century21 credentials</li>
            <li>Explore available resources and tools</li>
            <li>Set up your workspace and preferences</li>
          </ol>
        </div>
      </div>
      <div className="bg-red-50 p-3 rounded-lg">
        <h4 className="font-semibold text-red-900 mb-1">💡 Pro Tip:</h4>
        <p className="text-sm text-red-800">
          21online is a comprehensive platform for accessing company resources and tools. Familiarize yourself with its
          features to enhance your productivity and efficiency.
        </p>
      </div>
    </div>
  )

  const renderRealSatisfiedContent = () => (
    <div className="flex-1 overflow-y-auto space-y-6">
      <div>
        <h4 className="font-semibold mb-3">Real Satisfied Setup:</h4>
        <div className="mb-6">
          <Image
            src="/images/real-satisfied-setup-1.png"
            alt="Real Satisfied Setup - Client Feedback and Reviews"
            width={800}
            height={500}
            className="w-full h-auto rounded-lg border shadow-sm"
          />
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
          <h5 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Real Satisfied Setup:
          </h5>
          <ol className="list-decimal list-inside space-y-2 text-sm text-orange-700">
            <li>
              Go to <strong>realsatisfied.com</strong>
            </li>
            <li>Create an account using your Century21 credentials</li>
            <li>Set up your profile and preferences</li>
            <li>Start collecting client feedback and reviews</li>
          </ol>
        </div>
      </div>
      <div className="bg-orange-50 p-3 rounded-lg">
        <h4 className="font-semibold text-orange-900 mb-1">💡 Pro Tip:</h4>
        <p className="text-sm text-orange-800">
          Real Satisfied helps you collect valuable client feedback and reviews. Use it to improve your services and
          build trust with your clients.
        </p>
      </div>
    </div>
  )

  const renderZillowShowcaseContent = () => (
    <div className="flex-1 overflow-y-auto space-y-6">
      <div>
        <h4 className="font-semibold mb-3">Zillow Showcase Setup:</h4>
        <div className="mb-6">
          <Image
            src="/images/zillow-showcase-setup.png"
            alt="Zillow Showcase Setup - Showcase Your Listings"
            width={800}
            height={500}
            className="w-full h-auto rounded-lg border shadow-sm"
          />
        </div>
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-4">
          <h5 className="font-semibold text-pink-800 mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Zillow Showcase Setup:
          </h5>
          <ol className="list-decimal list-inside space-y-2 text-sm text-pink-700">
            <li>
              Go to <strong>zillow.com</strong>
            </li>
            <li>Create an account using your Century21 credentials</li>
            <li>Set up your profile and preferences</li>
            <li>Start showcasing your listings</li>
          </ol>
        </div>
      </div>
      <div className="bg-pink-50 p-3 rounded-lg">
        <h4 className="font-semibold text-pink-900 mb-1">💡 Pro Tip:</h4>
        <p className="text-sm text-pink-800">
          Zillow Showcase helps you showcase your listings to a wider audience. Use it to attract potential clients and
          increase your visibility online.
        </p>
      </div>
    </div>
  )

  const renderOnlinePresenceContent = () => (
    <div className="flex-1 overflow-y-auto space-y-6">
      <div>
        <h4 className="font-semibold mb-3">Enhance Your Online Presence:</h4>
        <div className="mb-6">
          <Image
            src="/images/online-presence-setup.png"
            alt="Online Presence Setup - Boost Your Digital Profile"
            width={800}
            height={500}
            className="w-full h-auto rounded-lg border shadow-sm"
          />
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Online Presence Setup:
          </h5>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>
              Update your <strong>Century21.com</strong> profile regularly
            </li>
            <li>
              Optimize your <strong>Google Business Profile</strong> for visibility
            </li>
            <li>
              Create and maintain a professional <strong>YouTube Channel</strong>
            </li>
            <li>
              Share company content on your <strong>social media profiles</strong>
            </li>
          </ol>
        </div>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-1">💡 Pro Tip:</h4>
        <p className="text-sm text-gray-800">
          A strong online presence can help you attract more clients and build your professional reputation. Make sure
          all your profiles are up-to-date and reflect your expertise in real estate.
        </p>
      </div>
    </div>
  )

  const renderWhereToFindUsContent = () => (
    <div className="flex-1 overflow-y-auto space-y-6">
      <div>
        <h4 className="font-semibold mb-3">Where To Find Century 21 Beggins Online:</h4>
        <div className="mb-6">
          <Image
            src="/images/where-to-find-us-online.png"
            alt="Where to Find Century 21 Beggins Online - Social Media and Digital Presence"
            width={800}
            height={500}
            className="w-full h-auto rounded-lg border shadow-sm"
          />
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h5 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Main Company Website:
          </h5>
          <div className="space-y-2 text-sm text-blue-700">
            <p>
              <strong>Century21Beggins.com</strong> - Our main company website
            </p>
            <Button
              onClick={() => window.open("https://century21beggins.com", "_blank")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              Visit Century21Beggins.com
            </Button>
          </div>
        </div>
      </div>
      <div className="bg-blue-50 p-3 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-1">💡 Pro Tip:</h4>
        <p className="text-sm text-blue-800">
          Share company content regularly to show you're part of a professional team! Follow all company social media
          accounts and engage with their content.
        </p>
      </div>
    </div>
  )

  const renderC21GlobalNetworkContent = () => (
    <div className="flex-1 overflow-y-auto space-y-6">
      <div>
        <h4 className="font-semibold mb-3">Join Century 21's Global Network:</h4>
        <div className="mb-6">
          <Image
            src="/images/c21-global-network-facebook.png"
            alt="Century 21 Global Network Facebook Groups - Connect with Agents Worldwide"
            width={800}
            height={500}
            className="w-full h-auto rounded-lg border shadow-sm"
          />
        </div>
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <h5 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Century 21 Global Network Benefits:
          </h5>
          <ul className="list-disc list-inside space-y-2 text-sm text-yellow-700">
            <li>Connect with 147,000+ agents in 80+ countries and territories</li>
            <li>Access referral opportunities from agents worldwide</li>
            <li>Share best practices and learn from top performers</li>
            <li>Stay updated on industry trends and company news</li>
            <li>Build professional relationships that can benefit your business</li>
          </ul>
        </div>
      </div>
      <div className="bg-yellow-50 p-3 rounded-lg">
        <h4 className="font-semibold text-yellow-900 mb-1">💡 Pro Tip:</h4>
        <p className="text-sm text-yellow-800">
          The Century 21 network is a powerful resource for referrals and knowledge sharing! Actively participate in the
          Facebook groups by sharing insights, asking questions, and building relationships.
        </p>
      </div>
    </div>
  )

  const renderAdditionalCoursesContent = () => (
    <div className="flex-1 overflow-y-auto space-y-6">
      <div>
        <h4 className="font-semibold mb-3">Board Of Realtors Additional Required Courses:</h4>
        <div className="mb-6">
          <Image
            src="/images/additional-required-courses.png"
            alt="Additional Required Courses - Complete Mandatory Continuing Education"
            width={800}
            height={500}
            className="w-full h-auto rounded-lg border shadow-sm"
          />
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h5 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Required Courses:
          </h5>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
            <li>Review your local board's continuing education requirements</li>
            <li>Enroll in required courses</li>
            <li>Schedule and complete coursework</li>
            <li>Submit completion certificates to the board</li>
            <li>Track your continuing education credits</li>
          </ol>
        </div>
      </div>
      <div className="bg-blue-50 p-3 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-1">💡 Pro Tip:</h4>
        <p className="text-sm text-blue-800">
          Don't wait until the last minute - spread your CE requirements throughout the year!
        </p>
      </div>
    </div>
  )

  const renderEKeySetupContent = () => (
    <div className="flex-1 overflow-y-auto space-y-6">
      <div>
        <h4 className="font-semibold mb-3">E-Key Set Up:</h4>
        <div className="mb-6">
          <Image
            src="/images/ekey-setup-guide.png"
            alt="E-Key Setup Guide - Get Access to Electronic Lockbox System"
            width={800}
            height={500}
            className="w-full h-auto rounded-lg border shadow-sm"
          />
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <h5 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
            <Key className="w-4 h-4" />
            E-Key Setup:
          </h5>
          <ol className="list-decimal list-inside space-y-2 text-sm text-green-700">
            <li>Apply for E-Key through your local MLS</li>
            <li>Complete required background check</li>
            <li>Download the E-Key mobile app</li>
            <li>Activate your E-Key device</li>
            <li>Learn proper E-Key usage protocols</li>
          </ol>
        </div>
      </div>
      <div className="bg-green-50 p-3 rounded-lg">
        <h4 className="font-semibold text-green-900 mb-1">💡 Pro Tip:</h4>
        <p className="text-sm text-green-800">Always follow proper showing procedures and log your property visits!</p>
      </div>
    </div>
  )

  const renderUtilityHelpersContent = () => (
    <div className="flex-1 overflow-y-auto space-y-6">
      <div>
        <h4 className="font-semibold mb-3">Intro to Utility Helpers:</h4>
        <div className="mb-6">
          <Image
            src="/images/utility-helpers-guide.png"
            alt="Utility Helpers Guide - Learn About Utility Connection Services for Clients"
            width={800}
            height={500}
            className="w-full h-auto rounded-lg border shadow-sm"
          />
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
          <h5 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            Utility Helpers Setup:
          </h5>
          <ol className="list-decimal list-inside space-y-2 text-sm text-purple-700">
            <li>Set up your Utility Helpers account</li>
            <li>Learn how the service works</li>
            <li>Understand how to refer clients</li>
            <li>Learn about available utilities and services</li>
            <li>Practice using the referral system</li>
          </ol>
        </div>
      </div>
      <div className="bg-purple-50 p-3 rounded-lg">
        <h4 className="font-semibold text-purple-900 mb-1">💡 Pro Tip:</h4>
        <p className="text-sm text-purple-800">
          This service adds value for your clients and can generate additional income!
        </p>
      </div>
    </div>
  )

  const renderClosingCostEstimatorContent = () => (
    <div className="flex-1 overflow-y-auto space-y-6">
      <div>
        <h4 className="font-semibold mb-3">Use the Closing Cost Estimator App:</h4>
        <div className="mb-6">
          <Image
            src="/images/closing-cost-estimator-guide.png"
            alt="Closing Cost Estimator Guide - Estimate Closing Costs for Clients"
            width={800}
            height={500}
            className="w-full h-auto rounded-lg border shadow-sm"
          />
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h5 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Accurate Closing Cost Estimates:
          </h5>
          <p className="text-sm text-blue-700 mb-3">
            Accurate closing cost estimates help clients prepare financially and build trust.
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-blue-700">
            <li>Download the closing cost estimator app</li>
            <li>Learn how to input property and loan information</li>
            <li>Practice creating estimates for different scenarios</li>
            <li>Understand how to explain costs to clients</li>
            <li>Learn when to refer to lenders for precise figures</li>
          </ul>
        </div>
      </div>
      <div className="bg-yellow-50 p-3 rounded-lg">
        <h4 className="font-semibold text-yellow-900 mb-1">💡 Pro Tip:</h4>
        <p className="text-sm text-yellow-800">
          Always explain that estimates are approximate and final costs may vary!
        </p>
      </div>
    </div>
  )

  const renderLegalHotlineContent = () => (
    <div className="flex-1 overflow-y-auto space-y-6">
      <div>
        <h4 className="font-semibold mb-3">Agent Legal Hotline Access:</h4>
        <div className="mb-6">
          <Image
            src="/images/legal-hotline-guide.png"
            alt="Legal Hotline Guide - Free Legal Support for Florida Realtors"
            width={800}
            height={500}
            className="w-full h-auto rounded-lg border shadow-sm"
          />
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h5 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <Scale className="w-4 h-4" />
            What is the Legal Hotline?
          </h5>
          <p className="text-sm text-blue-700 mb-3">
            Even though your Brokers, Managers, and Regional Presidents are just a phone call away, you also have access
            to your own lawyer, for free, as part of your member services from your Florida Realtors Association.
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-blue-700">
            <li>Free legal consultation for Florida Realtors Association members</li>
            <li>Professional attorneys specializing in real estate law</li>
            <li>Confidential advice on complex real estate situations</li>
            <li>Available during business hours for immediate guidance</li>
          </ul>
        </div>
        <div className="bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
          <h5 className="font-semibold text-gray-800 mb-4 text-center text-lg">Contact Information</h5>
          <div className="text-center space-y-3">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <p className="font-semibold text-gray-800 mb-2">Website:</p>
              <p className="text-lg font-mono text-blue-600">FloridaRealtors.org &gt; Legal Hotline</p>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <p className="font-semibold text-gray-800 mb-2">Phone Number:</p>
              <p className="text-2xl font-mono text-green-600 font-bold">407-438-1409</p>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <p className="font-semibold text-gray-800 mb-2">Hours:</p>
              <p className="text-lg text-gray-700">9 am to 4:45 pm - Monday through Friday</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-blue-50 p-3 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-1">💡 Pro Tip:</h4>
        <p className="text-sm text-blue-800">
          Don't hesitate to call the legal hotline when you're unsure - it's better to ask than assume!
        </p>
      </div>
    </div>
  )

  const renderSafetyProtocolsContent = () => (
    <div className="flex-1 overflow-y-auto space-y-6">
      <div>
        <h4 className="font-semibold mb-3">Agent Safety Protocols:</h4>
        <div className="mb-6">
          <Image
            src="/images/safety-first-guide.png"
            alt="Safety First Guide - Essential Safety Protocols for Real Estate Agents"
            width={800}
            height={500}
            className="w-full h-auto rounded-lg border shadow-sm"
          />
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h5 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Essential Safety Protocols:
          </h5>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded border">
              <h6 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Second Meeting Only Policy
              </h6>
              <p className="text-sm text-red-700">
                Always meet new clients in the office or a public location first to vet them before agreeing to a
                private showing.
              </p>
            </div>
            <div className="bg-white p-4 rounded border">
              <h6 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Verify Identity
              </h6>
              <p className="text-sm text-red-700">
                Ask for and make a copy of the client's driver's license or ID, leaving it with your front desk. Use a
                service like Forewarn to know who you're meeting.
              </p>
            </div>
            <div className="bg-white p-4 rounded border">
              <h6 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Share Your Location
              </h6>
              <p className="text-sm text-red-700">
                Ensure someone knows your whereabouts by providing a colleague, friend, or spouse with the property
                address and client information. Utilize location-tracking services on your devices.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-red-50 p-3 rounded-lg">
        <h4 className="font-semibold text-red-900 mb-1">💡 Pro Tip:</h4>
        <p className="text-sm text-red-800">
          Trust your instincts - if something feels wrong, prioritize your safety! Remember: your safety is more
          important than any commission!
        </p>
      </div>
    </div>
  )

  const renderForewarnToolsContent = () => (
    <div className="flex-1 overflow-y-auto space-y-6">
      <div>
        <h4 className="font-semibold mb-3">Client Screening and Research Tools:</h4>
        {/* FOREWARN Section */}
        <div className="mb-8">
          <h5 className="text-xl font-semibold mb-4 text-center">KNOW WHO YOU'RE DEALING WITH</h5>
          <div className="mb-6">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-07-11%20195930-vj5PyDMMFzlen1Hv6DXessNffawDQI.png"
              alt="FOREWARN - Know Who You're Dealing With"
              width={800}
              height={500}
              className="w-full h-auto rounded-lg border shadow-sm"
            />
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h6 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              FOREWARN: A resource to find contact info and more
            </h6>
            <p className="text-sm text-blue-700 mb-3">
              The Florida Realtor Association offers Forewarn, a leading provider of real-time information solutions for
              real estate agents, as a member benefit, ensuring that agents possess this essential solution to mitigate
              risk.
            </p>
            <p className="text-sm text-blue-700 mb-3">
              Verify identities and validate information provided by potential clients – using just a phone number.
              Enables agents to plan for showings with a higher level of confidence.
            </p>
            <div className="mt-4">
              <p className="text-sm text-blue-700 mb-2">
                <strong>
                  Using only a phone number, FOREWARN can positively identify over 80% of potential prospects,
                  including:
                </strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 ml-4">
                <li>If the prospect has a criminal history</li>
                <li>Current property and vehicle ownership</li>
                <li>Financial risks (bankruptcies/liens)</li>
                <li>Additional phone numbers and full address history</li>
                <li>Instant risk management and due diligence</li>
                <li>Be and stay safe</li>
                <li>
                  <strong>Know more about who you're dealing with before any direct interactions.</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* BeenVerified and Title Toolbox Section */}
        <div className="mb-8">
          <h5 className="text-xl font-semibold mb-4 text-center">FIND MISSING CONTACT INFO</h5>
          <p className="text-center text-gray-600 mb-6">Resources to find emails, phone #s and more</p>
          <div className="mb-6">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-07-11%20195952-Li6ktUw9nUg5V5zXpVm60MEP1VwxIx.png"
              alt="Find Missing Contact Info - BeenVerified and Title Toolbox"
              width={800}
              height={500}
              className="w-full h-auto rounded-lg border shadow-sm"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h6 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                BeenVerified.com Features:
              </h6>
              <ul className="list-disc list-inside space-y-1 text-sm text-green-700">
                <li>People Search</li>
                <li>Reverse Phone Lookup</li>
                <li>Username Search</li>
                <li>Unclaimed Money Search</li>
                <li>Email Lookup</li>
                <li>Address Lookup</li>
                <li>Vehicle Lookup</li>
              </ul>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h6 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                <Building className="w-4 h-4" />
                Title Toolbox Services:
              </h6>
              <ul className="list-disc list-inside space-y-1 text-sm text-purple-700">
                <li>Contact Information Search</li>
                <li>Research Properties</li>
                <li>Market Insights</li>
                <li>Detailed Maps and Property Info</li>
                <li>Filter by Life Events</li>
              </ul>
              <div className="mt-3 p-2 bg-white rounded border">
                <p className="text-xs text-purple-600">
                  <strong>To Get Started, contact:</strong>
                  <br />
                  Meghan Dukett - Paramount Title
                  <br />
                  813.708.0639
                  <br />
                  Meghan.Dukett@ptitlefl.com
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Setup Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <h6 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Setup Instructions:
          </h6>
          <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-700">
            <li>Set up your Forewarn account through Florida Realtors Association</li>
            <li>Create a BeenVerified.com account for comprehensive background searches</li>
            <li>Contact Meghan Dukett at Paramount Title to access Title Toolbox</li>
            <li>Practice using each tool with sample data to become proficient</li>
            <li>Understand privacy laws and legal considerations when using these tools</li>
            <li>Integrate these tools into your client screening workflow</li>
          </ol>
        </div>
        {/* Privacy and Legal Considerations */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h6 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Privacy and Legal Considerations:
          </h6>
          <ul className="list-disc list-inside space-y-2 text-sm text-red-700">
            <li>Only use these tools for legitimate business purposes</li>
            <li>Respect client privacy and confidentiality</li>
            <li>Follow all applicable federal and state privacy laws</li>
            <li>Do not share or misuse personal information obtained through these services</li>
            <li>Use information responsibly to enhance safety and service quality</li>
            <li>When in doubt about usage, consult with your broker or legal counsel</li>
          </ul>
        </div>
      </div>
      <div className="bg-blue-50 p-3 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-1">💡 Pro Tip:</h4>
        <p className="text-sm text-blue-800">
          Use these tools consistently to protect yourself and provide better service! Always verify client information
          before meeting in person, and trust your instincts if something doesn't feel right. These tools are invaluable
          for your safety and peace of mind.
        </p>
      </div>
    </div>
  )

  const renderDoNotCallContent = () => (
    <div className="flex-1 overflow-y-auto space-y-6">
      <div>
        <h4 className="font-semibold mb-3">National Do Not Call Registry Compliance:</h4>
        <div className="mb-6">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-07-11%20200628-KmDYPcbSi4FbmUC1IHKisHXZQlFxgg.png"
            alt="National Do Not Call Registry - Avoid Fines from Violating TCPA"
            width={800}
            height={600}
            className="w-full h-auto rounded-lg border shadow-sm"
          />
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h5 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Why TCPA Compliance Matters:
          </h5>
          <ul className="list-disc list-inside space-y-2 text-sm text-red-700">
            <li>
              <strong>Personal Liability:</strong> You will be personally liable for any violations of the TCPA
            </li>
            <li>
              <strong>Significant Fines:</strong> Fines can be as much as $500 per call or text, and add up quickly
            </li>
            <li>
              <strong>Legal Consequences:</strong> Violations can result in serious legal and financial penalties
            </li>
          </ul>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <h5 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Before Making Your Next Call or Text:
          </h5>
          <div className="space-y-3">
            <div className="bg-white p-3 rounded border border-red-300">
              <h6 className="font-semibold text-red-800 mb-2">DO NOT:</h6>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                <li>Use an automated platform vendor to call or text potential customers</li>
                <li>Leave pre-recorded messages</li>
              </ul>
            </div>
            <div className="bg-white p-3 rounded border border-blue-300">
              <h6 className="font-semibold text-blue-800 mb-2">DO:</h6>
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                <li>Check phone numbers against Do Not Call Lists prior to making any calls or texting</li>
                <li>Get prior written consent before calling or texting a number on the Do Not Call Lists</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h5 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <List className="w-4 h-4" />
            Key Compliance Requirements:
          </h5>
          <ul className="list-disc list-inside space-y-2 text-sm text-blue-700">
            <li>
              If you choose to make contact by phone or text, check phone numbers against the federal and state DNC
              registries
            </li>
            <li>
              <strong>Do NOT use autodialers</strong>
            </li>
            <li>
              <strong>Do NOT use artificial voice or pre-record messages</strong>
            </li>
            <li>
              <strong>Emails must follow CAN-SPAM rules</strong>
            </li>
            <li>
              <strong>Adhere to the Do Not Email/Unsubscribe Requests</strong>
            </li>
          </ul>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Common TCPA Myths Dispelled:
          </h5>
          <div className="space-y-3">
            <div className="bg-white p-3 rounded border">
              <h6 className="font-semibold text-gray-800 mb-1">Myth 1: "The TCPA applies to calls, not texts."</h6>
              <p className="text-sm text-red-600">
                <strong>NOT TRUE.</strong> The TCPA covers both calls and texts.
              </p>
            </div>
            <div className="bg-white p-3 rounded border">
              <h6 className="font-semibold text-gray-800 mb-1">
                Myth 2: "I checked the Do Not Call (DNC) Lists when I got the number; I'm covered."
              </h6>
              <p className="text-sm text-red-600">
                <strong>NOT TRUE.</strong> Numbers are added to the DNC Lists all the time. If you haven't recently
                checked the number against the DNC Lists, you must do so before calling or texting.
              </p>
            </div>
            <div className="bg-white p-3 rounded border">
              <h6 className="font-semibold text-gray-800 mb-1">
                Myth 3: "A friend gave me this person's number, so I don't need to check the DNC Lists."
              </h6>
              <p className="text-sm text-red-600">
                <strong>NOT TRUE.</strong> If the person you are going to call or text did not give you the number, you
                must check the DNC Lists.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h5 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Best Practices for Compliance:
          </h5>
          <ol className="list-decimal list-inside space-y-2 text-sm text-green-700">
            <li>Always check the National Do Not Call Registry before making calls</li>
            <li>Check your state's Do Not Call registry as well</li>
            <li>Keep records of when you checked numbers and obtained consent</li>
            <li>Focus on building relationships through referrals and warm leads</li>
            <li>Use email marketing and social media as safer alternatives</li>
            <li>When in doubt, consult with your broker or legal counsel</li>
          </ol>
        </div>
      </div>
      <div className="bg-yellow-50 p-3 rounded-lg">
        <h4 className="font-semibold text-yellow-900 mb-1">💡 Pro Tip:</h4>
        <p className="text-sm text-yellow-800">
          When in doubt, don't call - focus on referrals and warm leads instead! Building your business through
          relationships and referrals is not only safer legally, but often more effective for long-term success.
        </p>
      </div>
    </div>
  )

  const renderCalendlyContent = () => (
    <div className="flex-1 overflow-y-auto space-y-6">
      <div>
        <h4 className="font-semibold mb-3">Adding Calendly To Your Email Signature:</h4>
        {/* Video Tutorial Section */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 mb-4">
            <h5 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <PlayCircle className="w-5 h-5" />
              Video Tutorial: How to Add Calendly to Your Email Signature
            </h5>
            <p className="text-sm text-blue-700 mb-4">
              Watch this step-by-step tutorial to learn how to seamlessly integrate Calendly into your email signature
              for easy client scheduling.
            </p>
          </div>
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src="https://www.youtube.com/embed/CXVfIF75Vs0"
              title="How to Add Calendly to Email Signature"
              className="absolute top-0 left-0 w-full h-full rounded-lg border shadow-sm"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
        {/* Setup Instructions */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <h5 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Step-by-Step Setup:
          </h5>
          <ol className="list-decimal list-inside space-y-2 text-sm text-green-700">
            <li>Create your Calendly account at calendly.com</li>
            <li>Set up your availability preferences and time zones</li>
            <li>Create different meeting types (consultation, property showing, follow-up, etc.)</li>
            <li>Customize your booking page with your branding and information</li>
            <li>Generate your personal Calendly scheduling link</li>
            <li>Add the link to your email signature following the video tutorial</li>
            <li>Test the scheduling process to ensure everything works smoothly</li>
          </ol>
        </div>
        {/* Benefits Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h5 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <Signature className="w-4 h-4" />
            Benefits of Calendly in Your Email Signature:
          </h5>
          <ul className="list-disc list-inside space-y-2 text-sm text-blue-700">
            <li>Eliminates back-and-forth emails for scheduling appointments</li>
            <li>Allows clients to book meetings at their convenience, 24/7</li>
            <li>Automatically syncs with your calendar to prevent double-bookings</li>
            <li>Sends automatic confirmation and reminder emails</li>
            <li>Shows your professionalism and tech-savviness</li>
            <li>Saves time and reduces scheduling friction</li>
            <li>Integrates with popular calendar apps (Google, Outlook, etc.)</li>
          </ul>
        </div>
        {/* Best Practices */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h5 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Best Practices:
          </h5>
          <ul className="list-disc list-inside space-y-2 text-sm text-purple-700">
            <li>Set buffer time between appointments to avoid rushing</li>
            <li>Block out personal time and lunch breaks</li>
            <li>Create specific meeting types for different purposes</li>
            <li>Include clear descriptions of what each meeting type covers</li>
            <li>Set appropriate meeting durations for each type of appointment</li>
            <li>Use custom questions to gather important information beforehand</li>
            <li>Enable email and SMS reminders to reduce no-shows</li>
          </ul>
        </div>
      </div>
      <div className="bg-yellow-50 p-3 rounded-lg">
        <h4 className="font-semibold text-yellow-900 mb-1">💡 Pro Tip:</h4>
        <p className="text-sm text-yellow-800">
          Set buffer time between appointments and block out personal time! This prevents back-to-back meetings and
          gives you time to prepare for each client interaction. Also consider creating different Calendly links for
          different types of meetings (buyer consultations, listing appointments, etc.).
        </p>
      </div>
    </div>
  )

  const renderExportContactsContent = () => (
    <div className="flex-1 overflow-y-auto space-y-6">
      <div>
        <h4 className="font-semibold mb-3">Export Your Contacts - Complete Guide:</h4>

        {/* Page 1 - Title Page */}
        <div className="mb-6">
          <h5 className="font-semibold mb-3 text-lg">Export Your Contacts</h5>
          <Image
            src="/images/2024_OnboardingGetting_Started_9_Page_1.png"
            alt="Export Your Contacts - Title Page"
            width={800}
            height={600}
            className="w-full h-auto rounded-lg border shadow-sm"
          />
        </div>

        {/* Page 2 - Covve Export Process */}
        <div className="mb-6">
          <h5 className="font-semibold mb-3 text-lg">Step 1: Using Covve Export App</h5>
          <Image
            src="/images/2024_OnboardingGetting_Started_9_Page_2.png"
            alt="Export Your Contacts - Covve Export App Process"
            width={800}
            height={600}
            className="w-full h-auto rounded-lg border shadow-sm"
          />
        </div>

        {/* Page 3 - Opening Downloaded File & Moxi Template */}
        <div className="mb-6">
          <h5 className="font-semibold mb-3 text-lg">Step 2: Open Downloaded File & Download Moxi Template</h5>
          <Image
            src="/images/2024_OnboardingGetting_Started_9_Page_3.png"
            alt="Export Your Contacts - Open File and Download Template"
            width={800}
            height={600}
            className="w-full h-auto rounded-lg border shadow-sm"
          />
        </div>

        {/* Page 4 - Transfer Data */}
        <div className="mb-6">
          <h5 className="font-semibold mb-3 text-lg">Step 3: Download CSV File & Transfer Data</h5>
          <Image
            src="/images/2024_OnboardingGetting_Started_9_Page_4.png"
            alt="Export Your Contacts - Download CSV and Transfer Data"
            width={800}
            height={600}
            className="w-full h-auto rounded-lg border shadow-sm"
          />
        </div>

        {/* Page 5 - Upload to Moxi Engage */}
        <div className="mb-6">
          <h5 className="font-semibold mb-3 text-lg">Step 4: Upload Into Moxi Engage</h5>
          <Image
            src="/images/2024_OnboardingGetting_Started_9_Page_5.png"
            alt="Export Your Contacts - Upload to Moxi Engage"
            width={800}
            height={600}
            className="w-full h-auto rounded-lg border shadow-sm"
          />
        </div>

        {/* Page 6 - Set Up Campaigns */}
        <div className="mb-6">
          <h5 className="font-semibold mb-3 text-lg">Step 5: Set Up Your Campaigns</h5>
          <Image
            src="/images/2024_OnboardingGetting_Started_9_Page_6.png"
            alt="Export Your Contacts - Set Up Campaigns in Moxi Engage"
            width={800}
            height={600}
            className="w-full h-auto rounded-lg border shadow-sm"
          />
        </div>

        {/* Page 7 - Campaign Setup Process */}
        <div className="mb-6">
          <h5 className="font-semibold mb-3 text-lg">Step 6: Campaign Setup & Recipients</h5>
          <Image
            src="/images/2024_OnboardingGetting_Started_9_Page_7.png"
            alt="Export Your Contacts - Campaign Setup and Recipients"
            width={800}
            height={600}
            className="w-full h-auto rounded-lg border shadow-sm"
          />
        </div>

        {/* Page 8 - Final Steps */}
        <div className="mb-6">
          <h5 className="font-semibold mb-3 text-lg">Step 7: Choose Groups & Run Campaign</h5>
          <Image
            src="/images/2024_OnboardingGetting_Started_9_Page_8.png"
            alt="Export Your Contacts - Choose Groups and Run Campaign"
            width={800}
            height={600}
            className="w-full h-auto rounded-lg border shadow-sm"
          />
        </div>

        {/* Summary Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h5 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Contact Export Summary:
          </h5>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
            <li>Download and use the Covve Export app to extract contacts from your phone</li>
            <li>Open the exported file and download the Moxi Engage template</li>
            <li>Download the CSV file and transfer data between spreadsheets</li>
            <li>Upload your organized contacts into Moxi Engage</li>
            <li>Set up marketing campaigns using your imported contacts</li>
            <li>Configure recipients and choose appropriate groups</li>
            <li>Run your campaigns to stay connected with your network</li>
          </ol>
        </div>
      </div>
      <div className="bg-green-50 p-3 rounded-lg">
        <h4 className="font-semibold text-green-900 mb-1">💡 Pro Tip:</h4>
        <p className="text-sm text-green-800">
          Take time to clean your contact list during the export process - quality is better than quantity! Remove
          duplicates, update outdated information, and organize contacts into meaningful categories. Also, add yourself
          to each group so you can see what your recipients are receiving!
        </p>
      </div>
    </div>
  )

  const renderTechToolsOverviewContent = () => (
    <div className="flex-1 overflow-y-auto space-y-6">
      <div>
        <h4 className="font-semibold mb-3">Tech and Tools Overview Session:</h4>
        <div className="mb-6">
          <Image
            src="/images/tech-and-tools-overview.png"
            alt="Tech and Tools Overview - Weekly Training Session"
            width={800}
            height={600}
            className="w-full h-auto rounded-lg border shadow-sm"
          />
        </div>

        {/* Session Details */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h5 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Session Information:
          </h5>
          <div className="space-y-2 text-sm text-blue-700">
            <p>
              <strong>When:</strong> Every Wednesday, 1:00 PM - 3:00 PM EST
            </p>
            <p>
              <strong>Zoom Meeting Code:</strong> 993 604 7345
            </p>
            <p>
              <strong>Requirement:</strong> Cameras must be on
            </p>
          </div>
        </div>

        {/* What You'll Learn */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* MoxiWorks */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h6 className="font-semibold text-gray-800 mb-3">MoxiWorks</h6>
            <p className="text-xs text-gray-600 mb-2">Hosted by Jimmy McNally</p>
            <p className="text-xs text-gray-600 mb-2">jimmymcnally@c21be.com</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>Moxi Engage - CRM, email integration and marketing, lead nurturing</li>
              <li>Moxi Present - Create Seller and Buyer Presentations, top-notch CMAs plus much more</li>
              <li>
                Moxi Impress - Marketing made Easy, automatically create and distribute print, digital and social media
                advertising
              </li>
              <li>Moxi Website - your personalized and customizable agent website</li>
            </ul>
          </div>

          {/* dotloop */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h6 className="font-semibold text-blue-800 mb-3">dotloop</h6>
            <p className="text-xs text-blue-600 mb-2">Hosted by Sam Beggins</p>
            <p className="text-xs text-blue-600 mb-2">sambeggins@c21be.com</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
              <li>Pre-Built Templates for Listings and Contracts</li>
              <li>Auto-Populating Forms</li>
              <li>Secure e-signing</li>
              <li>Free Dotloop account for Clients</li>
              <li>Cloud Storage for paperwork, closing statements, inspection reports, etc.</li>
            </ul>
          </div>

          {/* Beggins University */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h6 className="font-semibold text-yellow-800 mb-3">Beggins University</h6>
            <p className="text-xs text-yellow-600 mb-2">Hosted by Caitlin Beaird</p>
            <p className="text-xs text-yellow-600 mb-2">caitlinbeaird@c21be.com</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
              <li>Training Resources</li>
              <li>Agent Toolkits</li>
              <li>Scripts</li>
              <li>AI Tools</li>
              <li>Listing Process</li>
              <li>Buyer Process</li>
              <li>Business Plans</li>
            </ul>
          </div>
        </div>

        {/* Preparation Steps */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h5 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            How to Prepare:
          </h5>
          <ol className="list-decimal list-inside space-y-2 text-sm text-green-700">
            <li>Add the recurring Wednesday session to your calendar</li>
            <li>Test your camera and microphone before the session</li>
            <li>Prepare questions about the tools you'll be using</li>
            <li>Have a notebook ready to take notes</li>
            <li>Join the Zoom meeting a few minutes early</li>
          </ol>
        </div>
      </div>
      <div className="bg-blue-50 p-3 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-1">💡 Pro Tip:</h4>
        <p className="text-sm text-blue-800">
          This comprehensive training session will give you hands-on experience with all the essential tools you'll use
          daily. Don't miss it - it's the key to hitting the ground running in your new career!
        </p>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading your progress...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Agent Profile & Set Up</h1>
            <p className="text-gray-600">Complete your comprehensive onboarding checklist</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Progress Overview</h2>
            <Badge variant={completionPercentage === 100 ? "default" : "secondary"}>
              {completedSteps.length} of {steps.length} completed
            </Badge>
          </div>
          <Progress value={completionPercentage} className="mb-2" />
          <p className="text-sm text-gray-600">{completionPercentage}% complete</p>
          {error && <p className="text-sm text-red-600 mt-2">{error} - Your progress is still saved locally.</p>}
        </div>
      </div>
      <div className="grid gap-4">
        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.id)
          const Icon = step.icon
          return (
            <Card
              key={step.id}
              className={`transition-all duration-200 ${isCompleted ? "bg-green-50 border-green-200" : "hover:shadow-md"}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <button onClick={() => toggleStep(step.id)} className="transition-colors duration-200">
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                      <span className="text-xs text-gray-500 text-center leading-tight">
                        Mark Step
                        <br />
                        Complete
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4 text-blue-600" />
                        <CardTitle className={`text-lg ${isCompleted ? "text-green-800" : "text-gray-900"}`}>
                          {step.title}
                        </CardTitle>
                      </div>
                      <CardDescription className={isCompleted ? "text-green-700" : "text-gray-600"}>
                        {step.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Start This Step
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                      <DialogHeader className="flex-shrink-0">
                        <DialogTitle className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-blue-600" />
                          {step.title}
                        </DialogTitle>
                        <DialogDescription>{step.content.overview}</DialogDescription>
                      </DialogHeader>
                      {/* Image Viewer for Step 1 */}
                      {step.id === 1 && step.content.hasImageViewer ? (
                        <div className="flex-1 overflow-y-auto">
                          <LeadershipGuideViewer />
                        </div>
                      ) : step.id === 2 && step.content.hasImageViewer ? (
                        /* Image Viewer for Step 2 */
                        <div className="flex-1 overflow-y-auto">
                          <GetConnectedViewer />
                        </div>
                      ) : step.id === 3 && step.content.hasImageViewer ? (
                        /* Image Viewer for Step 3 */
                        <div className="flex-1 overflow-y-auto">
                          <GSuiteSetupViewer />
                        </div>
                      ) : step.id === 4 && step.content.hasImageViewer ? (
                        /* Image Viewer for Step 4 */
                        <div className="flex-1 overflow-y-auto">
                          <CompanyCalendarViewer />
                        </div>
                      ) : step.id === 5 && step.content.hasImageViewer ? (
                        /* Image Viewer for Step 5 */
                        <div className="flex-1 overflow-y-auto">
                          <VoicemailSetupViewer />
                        </div>
                      ) : step.id === 6 && step.content.hasCustomContent ? (
                        /* Custom content for Step 6 - Agent Bio */
                        renderAgentBioContent()
                      ) : step.id === 7 && step.content.hasCustomContent ? (
                        /* Custom content for Step 7 - Business Cards */
                        renderBusinessCardsContent()
                      ) : step.id === 10 && step.content.hasCustomContent ? (
                        /* Custom content for Step 10 - MLS Setup */
                        renderMLSSetupContent()
                      ) : step.id === 11 && step.content.hasCustomContent ? (
                        /* Custom content for Step 11 - 21online */
                        render21OnlineContent()
                      ) : step.id === 13 && step.content.hasCustomContent ? (
                        /* Custom content for Step 13 - Real Satisfied */
                        renderRealSatisfiedContent()
                      ) : step.id === 14 && step.content.hasCustomContent ? (
                        /* Custom content for Step 14 - Zillow Showcase */
                        renderZillowShowcaseContent()
                      ) : step.id === 15 && step.content.hasCustomContent ? (
                        /* Custom content for Step 15 - Online Presence */
                        renderOnlinePresenceContent()
                      ) : step.id === 16 && step.content.hasCustomContent ? (
                        /* Custom content for Step 16 - Where To Find Us Online */
                        renderWhereToFindUsContent()
                      ) : step.id === 17 && step.content.hasCustomContent ? (
                        /* Custom content for Step 17 - C21 Global Network */
                        renderC21GlobalNetworkContent()
                      ) : step.id === 18 && step.content.hasCustomContent ? (
                        /* Custom content for Step 18 - Additional Courses */
                        renderAdditionalCoursesContent()
                      ) : step.id === 19 && step.content.hasCustomContent ? (
                        /* Custom content for Step 19 - E-Key Setup */
                        renderEKeySetupContent()
                      ) : step.id === 20 && step.content.hasCustomContent ? (
                        /* Custom content for Step 20 - Utility Helpers */
                        renderUtilityHelpersContent()
                      ) : step.id === 21 && step.content.hasCustomContent ? (
                        /* Custom content for Step 21 - Closing Cost Estimator */
                        renderClosingCostEstimatorContent()
                      ) : step.id === 22 && step.content.hasCustomContent ? (
                        /* Custom content for Step 22 - Legal Hotline */
                        renderLegalHotlineContent()
                      ) : step.id === 23 && step.content.hasCustomContent ? (
                        /* Custom content for Step 23 - Safety Protocols */
                        renderSafetyProtocolsContent()
                      ) : step.id === 24 && step.content.hasCustomContent ? (
                        /* Custom content for Step 24 - Forewarn Tools */
                        renderForewarnToolsContent()
                      ) : step.id === 25 && step.content.hasCustomContent ? (
                        /* Custom content for Step 25 - Do Not Call List */
                        renderDoNotCallContent()
                      ) : step.id === 26 && step.content.hasCustomContent ? (
                        /* Custom content for Step 26 - Calendly */
                        renderCalendlyContent()
                      ) : step.id === 27 && step.content.hasCustomContent ? (
                        /* Custom content for Step 27 - Export Your Contacts */
                        renderExportContactsContent()
                      ) : step.id === 28 && step.content.hasCustomContent ? (
                        /* Custom content for Step 28 - Tech and Tools Overview */
                        renderTechToolsOverviewContent()
                      ) : (
                        /* Regular content for other steps */
                        <div className="flex-1 overflow-y-auto space-y-6">
                          <div>
                            <h4 className="font-semibold mb-2">Steps to Complete:</h4>
                            <ol className="list-decimal list-inside space-y-1">
                              {step.content.steps.map((stepItem, index) => (
                                <li key={index} className="text-sm text-gray-700">
                                  {stepItem}
                                </li>
                              ))}
                            </ol>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-1">💡 Pro Tip:</h4>
                            <p className="text-sm text-blue-800">{step.content.tips}</p>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>
      {completionPercentage === 100 && (
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-800 mb-2">Congratulations! 🎉</h3>
          <p className="text-green-700 mb-4">
            You've completed all 28 steps of your agent profile setup. You're ready to start your successful career at
            Century 21 Beggins!
          </p>
          <p className="text-sm text-green-600">
            <strong>Next Step:</strong> Attend Tools and Tech Overview
          </p>
        </div>
      )}
    </div>
  )
}
