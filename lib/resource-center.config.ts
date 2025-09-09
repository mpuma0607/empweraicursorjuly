import type { TenantConfig } from "@/lib/types"
import { 
  Brain, 
  Megaphone, 
  Target, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Settings, 
  FileText, 
  Lightbulb, 
  User, 
  Home, 
  MessageSquare, 
  Mic, 
  Calculator, 
  Search, 
  Image, 
  TrendingUp, 
  Building2, 
  Waves,
  Share2,
  Monitor,
  Video,
  HelpCircle,
  Calendar,
  Star,
  Zap
} from "lucide-react"

export type ResourceItem = {
  id: string
  title: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  keywords: string[]
  toolId?: string
  tenantSpecific?: boolean
  category: string
  priority: number
}

export type ResourceSection = {
  id: string
  title: string
  description: string
  items: ResourceItem[]
}

export type TenantResourceConfig = {
  sections: ResourceSection[]
}

export const resourceCenterByTenant: Record<string, TenantResourceConfig> = {
  "empower-ai": {
    sections: [
      {
        id: "getting-started",
        title: "Getting Started",
        description: "Essential resources for new users",
        items: [
          {
            id: "portal",
            title: "Portal Dashboard",
            description: "Your main dashboard with all available tools and resources",
            href: "/portal",
            icon: Home,
            keywords: ["dashboard", "main", "home", "overview", "portal"],
            category: "getting-started",
            priority: 1
          },
          {
            id: "onboarding-hub",
            title: "Onboarding Hub",
            description: "Complete setup guides and initial configuration",
            href: "/onboarding-hub",
            icon: BookOpen,
            keywords: ["onboarding", "setup", "getting started", "initial", "configuration"],
            category: "getting-started",
            priority: 2
          },
          {
            id: "profile-setup",
            title: "Agent Profile Setup",
            description: "Complete your agent profile and branding",
            href: "/onboarding-hub/agent-profile-setup",
            icon: User,
            keywords: ["profile", "agent", "setup", "branding", "personal"],
            category: "getting-started",
            priority: 3
          }
        ]
      },
      {
        id: "ai-tools",
        title: "AI Tools",
        description: "Powerful AI tools to supercharge your real estate business",
        items: [
          {
            id: "ai-hub",
            title: "AI Hub",
            description: "Access all AI-powered tools and features",
            href: "/ai-hub",
            icon: Brain,
            keywords: ["ai", "artificial intelligence", "tools", "hub", "main"],
            category: "ai-tools",
            priority: 1
          },
          {
            id: "ideahub-empower",
            title: "IdeaHub",
            description: "Social Media Content Generation",
            href: "/ai-hub/ideahub-empower",
            icon: Lightbulb,
            keywords: ["social media", "content", "posts", "marketing", "ideas", "creative"],
            toolId: "ideahub-empower",
            tenantSpecific: true,
            category: "ai-tools",
            priority: 2
          },
          {
            id: "realbio",
            title: "RealBio",
            description: "Professional Agent Bio Creation",
            href: "/ai-hub/realbio",
            icon: User,
            keywords: ["bio", "profile", "agent", "professional", "biography"],
            toolId: "realbio",
            category: "ai-tools",
            priority: 3
          },
          {
            id: "scriptit",
            title: "ScriptIT",
            description: "Custom Real Estate Scripts",
            href: "/ai-hub/scriptit-ai",
            icon: MessageSquare,
            keywords: ["scripts", "conversation", "sales", "dialogue", "talking points"],
            toolId: "scriptit-ai",
            category: "ai-tools",
            priority: 4
          },
          {
            id: "quickcma",
            title: "QuickCMA AI",
            description: "Comparative Market Analysis Tool",
            href: "/ai-hub/quickcma-ai",
            icon: Calculator,
            keywords: ["cma", "market analysis", "comparative", "pricing", "valuation"],
            toolId: "quickcma-ai",
            category: "ai-tools",
            priority: 5
          },
          {
            id: "roleplay",
            title: "RolePlay AI",
            description: "Voice Conversation Practice",
            href: "/ai-hub/roleplay-ai",
            icon: Mic,
            keywords: ["roleplay", "practice", "voice", "conversation", "training"],
            toolId: "roleplay-ai",
            category: "ai-tools",
            priority: 6
          },
          {
            id: "whos-who",
            title: "Who's Who AI",
            description: "Property Owner Skip Tracing",
            href: "/ai-hub/whos-who-ai",
            icon: Search,
            keywords: ["skip tracing", "property owner", "research", "find", "contact"],
            toolId: "whos-who-ai",
            category: "ai-tools",
            priority: 7
          },
          {
            id: "stageit",
            title: "StageIT",
            description: "AI-Powered Virtual Staging Tool",
            href: "/ai-hub/stageit",
            icon: Home,
            keywords: ["staging", "virtual", "home", "interior", "design"],
            toolId: "stageit",
            category: "ai-tools",
            priority: 8
          },
          {
            id: "listit",
            title: "ListIT",
            description: "Property Listing Descriptions",
            href: "/ai-hub/listit-ai",
            icon: FileText,
            keywords: ["listing", "description", "property", "write", "content"],
            toolId: "listit-ai",
            category: "ai-tools",
            priority: 9
          },
          {
            id: "propbot",
            title: "PropBot AI",
            description: "Intelligent Property Search & Analysis",
            href: "/ai-hub/propbot-ai",
            icon: Search,
            keywords: ["property search", "find homes", "listings", "search", "analysis"],
            toolId: "propbot-ai",
            category: "ai-tools",
            priority: 10
          },
          {
            id: "mymarket",
            title: "MyMarket AI",
            description: "Housing & Rental Market Analysis",
            href: "/ai-hub/mymarket-ai",
            icon: TrendingUp,
            keywords: ["market analysis", "housing", "rental", "trends", "data"],
            toolId: "mymarket-ai",
            category: "ai-tools",
            priority: 11
          },
          {
            id: "real-img",
            title: "Real-IMG",
            description: "Interactive Image Creator with Hotspots",
            href: "/ai-hub/real-img",
            icon: Image,
            keywords: ["image", "interactive", "hotspots", "visual", "create"],
            toolId: "real-img",
            category: "ai-tools",
            priority: 12
          },
          {
            id: "goalscreen",
            title: "GoalScreen AI",
            description: "Daily Contact Goal Wallpaper Creator",
            href: "/ai-hub/goalscreen-ai",
            icon: Target,
            keywords: ["goals", "wallpaper", "daily", "contact", "motivation"],
            toolId: "goalscreen-ai",
            category: "ai-tools",
            priority: 13
          },
          {
            id: "action-ai",
            title: "Action AI",
            description: "Daily Prospecting Action Plans",
            href: "/ai-hub/action-ai",
            icon: Zap,
            keywords: ["action", "prospecting", "daily", "plans", "tasks"],
            toolId: "action-ai",
            category: "ai-tools",
            priority: 14
          },
          {
            id: "realcoach",
            title: "RealCoach AI",
            description: "Personalized Business Coaching",
            href: "/ai-hub/realcoach-ai",
            icon: Users,
            keywords: ["coaching", "business", "personalized", "advice", "mentor"],
            toolId: "realcoach-ai",
            category: "ai-tools",
            priority: 15
          },
          {
            id: "bizplan",
            title: "BizPlan AI",
            description: "90-Day Business Plan Generator",
            href: "/ai-hub/bizplan-ai",
            icon: FileText,
            keywords: ["business plan", "90 day", "planning", "strategy", "goals"],
            toolId: "bizplan-ai",
            category: "ai-tools",
            priority: 16
          },
          {
            id: "realdeal",
            title: "RealDeal AI",
            description: "Contract Analysis & Summarization",
            href: "/ai-hub/realdeal-ai",
            icon: FileText,
            keywords: ["contract", "analysis", "legal", "document", "review"],
            toolId: "realdeal-ai",
            category: "ai-tools",
            priority: 17
          }
        ]
      },
      {
        id: "marketing-branding",
        title: "Marketing & Branding",
        description: "Create compelling content and manage your brand",
        items: [
          {
            id: "marketing-hub",
            title: "Marketing Hub",
            description: "Access all marketing tools and resources",
            href: "/marketing-hub",
            icon: Megaphone,
            keywords: ["marketing", "content", "branding", "social media", "promotion"],
            category: "marketing-branding",
            priority: 1
          },
          {
            id: "dynamic-branded-content",
            title: "Dynamic Branded Content",
            description: "Create custom branded content for any topic",
            href: "/marketing-hub/dynamic-branded-content",
            icon: Megaphone,
            keywords: ["branded content", "custom", "dynamic", "marketing", "personalized"],
            category: "marketing-branding",
            priority: 2
          },
          {
            id: "hot-takes",
            title: "Real Estate Hot Takes",
            description: "RSS feed of the latest real estate news and trends",
            href: "/marketing-hub/hot-takes",
            icon: TrendingUp,
            keywords: ["news", "trends", "rss", "hot takes", "industry"],
            category: "marketing-branding",
            priority: 3
          }
        ]
      },
      {
        id: "prospecting",
        title: "Prospecting",
        description: "Find and convert leads with proven strategies",
        items: [
          {
            id: "prospecting-hub",
            title: "Prospecting Hub",
            description: "Access all prospecting tools and strategies",
            href: "/prospecting-hub",
            icon: Target,
            keywords: ["prospecting", "leads", "conversion", "strategies", "sales"],
            category: "prospecting",
            priority: 1
          },
          {
            id: "fsbo",
            title: "For Sale By Owners",
            description: "FSBO lead generation strategies",
            href: "/prospecting-hub/fsbo",
            icon: Home,
            keywords: ["fsbo", "for sale by owner", "leads", "generation", "strategies"],
            category: "prospecting",
            priority: 2
          },
          {
            id: "absentee-owners",
            title: "Absentee Owners",
            description: "Target absentee property owners",
            href: "/prospecting-hub/absentee-owners",
            icon: Users,
            keywords: ["absentee owners", "property owners", "target", "leads"],
            category: "prospecting",
            priority: 3
          },
          {
            id: "expired-listings",
            title: "Expired Listings",
            description: "Convert expired listing leads",
            href: "/prospecting-hub/expired-listings",
            icon: Calendar,
            keywords: ["expired listings", "leads", "conversion", "follow up"],
            category: "prospecting",
            priority: 4
          },
          {
            id: "probate",
            title: "Probate",
            description: "Probate real estate opportunities",
            href: "/prospecting-hub/probate",
            icon: FileText,
            keywords: ["probate", "estate", "opportunities", "leads", "legal"],
            category: "prospecting",
            priority: 5
          },
          {
            id: "soi",
            title: "SOI",
            description: "Sphere of influence marketing",
            href: "/prospecting-hub/soi",
            icon: Users,
            keywords: ["soi", "sphere of influence", "networking", "relationships"],
            category: "prospecting",
            priority: 6
          },
          {
            id: "pre-foreclosure",
            title: "Pre-Foreclosure",
            description: "Pre-foreclosure lead strategies",
            href: "/prospecting-hub/pre-foreclosure",
            icon: TrendingUp,
            keywords: ["pre-foreclosure", "leads", "strategies", "distressed"],
            category: "prospecting",
            priority: 7
          },
          {
            id: "first-time-buyers",
            title: "First Time Home Buyers",
            description: "First-time buyer conversion",
            href: "/prospecting-hub/first-time-buyers",
            icon: Home,
            keywords: ["first time buyers", "buyers", "conversion", "new"],
            category: "prospecting",
            priority: 8
          },
          {
            id: "investors",
            title: "Real Estate Investors",
            description: "Investor lead generation",
            href: "/prospecting-hub/investors",
            icon: Building2,
            keywords: ["investors", "investment", "leads", "generation"],
            category: "prospecting",
            priority: 9
          },
          {
            id: "divorce",
            title: "Divorce",
            description: "Divorce real estate strategies",
            href: "/prospecting-hub/divorce",
            icon: Users,
            keywords: ["divorce", "strategies", "leads", "family"],
            category: "prospecting",
            priority: 10
          }
        ]
      },
      {
        id: "training",
        title: "Training & Development",
        description: "Comprehensive training programs to elevate your skills",
        items: [
          {
            id: "training-hub",
            title: "Training Hub",
            description: "Access all training programs and resources",
            href: "/training-hub",
            icon: GraduationCap,
            keywords: ["training", "education", "learning", "development", "skills"],
            category: "training",
            priority: 1
          },
          {
            id: "social-media-mastery",
            title: "Social Media Mastery",
            description: "Build a magnetic brand, win attention daily, and convert it ethically",
            href: "/training-hub/social-media-mastery",
            icon: Share2,
            keywords: ["social media", "branding", "marketing", "content", "conversion"],
            category: "training",
            priority: 2
          },
          {
            id: "negotiation-mastery",
            title: "Negotiation Mastery",
            description: "Tactical empathy + dealcraft for listings, buyers, and everything in between",
            href: "/training-hub/negotiation-mastery",
            icon: MessageSquare,
            keywords: ["negotiation", "tactical empathy", "deals", "sales", "strategy"],
            category: "training",
            priority: 3
          },
          {
            id: "moxi-works",
            title: "Moxi Works Training",
            description: "Master the complete Moxi Works platform with comprehensive training modules",
            href: "/training-hub/moxi-works",
            icon: Monitor,
            keywords: ["moxi works", "platform", "training", "crm", "management"],
            category: "training",
            priority: 4
          },
          {
            id: "script-mastery",
            title: "Script Mastery",
            description: "Master objection handling and conversion scripts for any situation",
            href: "/training-hub/script-mastery",
            icon: BookOpen,
            keywords: ["scripts", "objection handling", "conversion", "sales", "dialogue"],
            category: "training",
            priority: 5
          },
          {
            id: "buyer-process",
            title: "Buyer Process (6P's)",
            description: "Our proven 6P's system for guiding buyers through the purchase process",
            href: "/training-hub/buyer-process",
            icon: Target,
            keywords: ["buyer process", "6ps", "buyers", "system", "process"],
            category: "training",
            priority: 6
          },
          {
            id: "listing-process",
            title: "Listing Process (7P's)",
            description: "7-step listing consultation and presentation process",
            href: "/training-hub/listing-process",
            icon: Home,
            keywords: ["listing process", "7ps", "listings", "presentation", "consultation"],
            category: "training",
            priority: 7
          },
          {
            id: "disc-vak",
            title: "DISC/VAK Connection",
            description: "Personality-based communication training",
            href: "/training-hub/disc-vak",
            icon: Users,
            keywords: ["disc", "vak", "personality", "communication", "behavior"],
            category: "training",
            priority: 8
          }
        ]
      },
      {
        id: "support",
        title: "Support & Help",
        description: "Get help and support when you need it",
        items: [
          {
            id: "support",
            title: "Support Center",
            description: "Get help with any questions or issues",
            href: "/support",
            icon: HelpCircle,
            keywords: ["support", "help", "questions", "issues", "assistance"],
            category: "support",
            priority: 1
          },
          {
            id: "profile",
            title: "Profile Settings",
            description: "Manage your profile and account settings",
            href: "/profile",
            icon: Settings,
            keywords: ["profile", "settings", "account", "preferences", "manage"],
            category: "support",
            priority: 2
          },
          {
            id: "branding",
            title: "Branding Settings",
            description: "Manage your personal branding and logo preferences",
            href: "/profile/branding",
            icon: Star,
            keywords: ["branding", "logo", "personal", "preferences", "customization"],
            category: "support",
            priority: 3
          }
        ]
      }
    ]
  },
  "century21-beggins": {
    sections: [
      {
        id: "getting-started",
        title: "Getting Started",
        description: "Essential resources for new Beggins University users",
        items: [
          {
            id: "portal",
            title: "Portal Dashboard",
            description: "Your main dashboard with all available tools and resources",
            href: "/portal",
            icon: Home,
            keywords: ["dashboard", "main", "home", "overview", "portal"],
            category: "getting-started",
            priority: 1
          },
          {
            id: "onboarding-hub",
            title: "Onboarding Hub",
            description: "Complete setup guides and initial configuration",
            href: "/onboarding-hub",
            icon: BookOpen,
            keywords: ["onboarding", "setup", "getting started", "initial", "configuration"],
            category: "getting-started",
            priority: 2
          },
          {
            id: "profile-setup",
            title: "Agent Profile Setup",
            description: "Complete your agent profile and branding",
            href: "/onboarding-hub/agent-profile-setup",
            icon: User,
            keywords: ["profile", "agent", "setup", "branding", "personal"],
            category: "getting-started",
            priority: 3
          }
        ]
      },
      {
        id: "ai-tools",
        title: "AI Tools",
        description: "Powerful AI tools to supercharge your real estate business",
        items: [
          {
            id: "ai-hub",
            title: "AI Hub",
            description: "Access all AI-powered tools and features",
            href: "/ai-hub",
            icon: Brain,
            keywords: ["ai", "artificial intelligence", "tools", "hub", "main"],
            category: "ai-tools",
            priority: 1
          },
          {
            id: "ideahub-beggins",
            title: "IdeaHub",
            description: "Social Media Content Generation for Beggins",
            href: "/ai-hub/ideahub-beggins",
            icon: Lightbulb,
            keywords: ["social media", "content", "posts", "marketing", "ideas", "creative", "beggins"],
            toolId: "ideahub-beggins",
            tenantSpecific: true,
            category: "ai-tools",
            priority: 2
          },
          {
            id: "realbio",
            title: "RealBio",
            description: "Professional Agent Bio Creation",
            href: "/ai-hub/realbio",
            icon: User,
            keywords: ["bio", "profile", "agent", "professional", "biography"],
            toolId: "realbio",
            category: "ai-tools",
            priority: 3
          },
          {
            id: "scriptit",
            title: "ScriptIT",
            description: "Custom Real Estate Scripts",
            href: "/ai-hub/scriptit-ai",
            icon: MessageSquare,
            keywords: ["scripts", "conversation", "sales", "dialogue", "talking points"],
            toolId: "scriptit-ai",
            category: "ai-tools",
            priority: 4
          },
          {
            id: "quickcma",
            title: "QuickCMA AI",
            description: "Comparative Market Analysis Tool",
            href: "/ai-hub/quickcma-ai",
            icon: Calculator,
            keywords: ["cma", "market analysis", "comparative", "pricing", "valuation"],
            toolId: "quickcma-ai",
            category: "ai-tools",
            priority: 5
          },
          {
            id: "roleplay",
            title: "RolePlay AI",
            description: "Voice Conversation Practice",
            href: "/ai-hub/roleplay-ai",
            icon: Mic,
            keywords: ["roleplay", "practice", "voice", "conversation", "training"],
            toolId: "roleplay-ai",
            category: "ai-tools",
            priority: 6
          },
          {
            id: "whos-who",
            title: "Who's Who AI",
            description: "Property Owner Skip Tracing",
            href: "/ai-hub/whos-who-ai",
            icon: Search,
            keywords: ["skip tracing", "property owner", "research", "find", "contact"],
            toolId: "whos-who-ai",
            category: "ai-tools",
            priority: 7
          },
          {
            id: "stageit",
            title: "StageIT",
            description: "AI-Powered Virtual Staging Tool",
            href: "/ai-hub/stageit",
            icon: Home,
            keywords: ["staging", "virtual", "home", "interior", "design"],
            toolId: "stageit",
            category: "ai-tools",
            priority: 8
          },
          {
            id: "listit",
            title: "ListIT",
            description: "Property Listing Descriptions",
            href: "/ai-hub/listit-ai",
            icon: FileText,
            keywords: ["listing", "description", "property", "write", "content"],
            toolId: "listit-ai",
            category: "ai-tools",
            priority: 9
          },
          {
            id: "propbot",
            title: "PropBot AI",
            description: "Intelligent Property Search & Analysis",
            href: "/ai-hub/propbot-ai",
            icon: Search,
            keywords: ["property search", "find homes", "listings", "search", "analysis"],
            toolId: "propbot-ai",
            category: "ai-tools",
            priority: 10
          },
          {
            id: "mymarket",
            title: "MyMarket AI",
            description: "Housing & Rental Market Analysis",
            href: "/ai-hub/mymarket-ai",
            icon: TrendingUp,
            keywords: ["market analysis", "housing", "rental", "trends", "data"],
            toolId: "mymarket-ai",
            category: "ai-tools",
            priority: 11
          },
          {
            id: "real-img",
            title: "Real-IMG",
            description: "Interactive Image Creator with Hotspots",
            href: "/ai-hub/real-img",
            icon: Image,
            keywords: ["image", "interactive", "hotspots", "visual", "create"],
            toolId: "real-img",
            category: "ai-tools",
            priority: 12
          },
          {
            id: "goalscreen",
            title: "GoalScreen AI",
            description: "Daily Contact Goal Wallpaper Creator",
            href: "/ai-hub/goalscreen-ai",
            icon: Target,
            keywords: ["goals", "wallpaper", "daily", "contact", "motivation"],
            toolId: "goalscreen-ai",
            category: "ai-tools",
            priority: 13
          },
          {
            id: "action-ai",
            title: "Action AI",
            description: "Daily Prospecting Action Plans",
            href: "/ai-hub/action-ai",
            icon: Zap,
            keywords: ["action", "prospecting", "daily", "plans", "tasks"],
            toolId: "action-ai",
            category: "ai-tools",
            priority: 14
          },
          {
            id: "realcoach",
            title: "RealCoach AI",
            description: "Personalized Business Coaching",
            href: "/ai-hub/realcoach-ai",
            icon: Users,
            keywords: ["coaching", "business", "personalized", "advice", "mentor"],
            toolId: "realcoach-ai",
            category: "ai-tools",
            priority: 15
          },
          {
            id: "bizplan",
            title: "BizPlan AI",
            description: "90-Day Business Plan Generator",
            href: "/ai-hub/bizplan-ai",
            icon: FileText,
            keywords: ["business plan", "90 day", "planning", "strategy", "goals"],
            toolId: "bizplan-ai",
            category: "ai-tools",
            priority: 16
          },
          {
            id: "realdeal",
            title: "RealDeal AI",
            description: "Contract Analysis & Summarization",
            href: "/ai-hub/realdeal-ai",
            icon: FileText,
            keywords: ["contract", "analysis", "legal", "document", "review"],
            toolId: "realdeal-ai",
            category: "ai-tools",
            priority: 17
          }
        ]
      },
      {
        id: "marketing-branding",
        title: "Marketing & Branding",
        description: "Create compelling content and manage your Century 21 Beggins brand",
        items: [
          {
            id: "marketing-hub",
            title: "Marketing Hub",
            description: "Access all marketing tools and resources",
            href: "/marketing-hub",
            icon: Megaphone,
            keywords: ["marketing", "content", "branding", "social media", "promotion"],
            category: "marketing-branding",
            priority: 1
          },
          {
            id: "dynamic-branded-content",
            title: "Dynamic Branded Content",
            description: "Create custom branded content for any topic",
            href: "/marketing-hub/dynamic-branded-content",
            icon: Megaphone,
            keywords: ["branded content", "custom", "dynamic", "marketing", "personalized"],
            category: "marketing-branding",
            priority: 2
          },
          {
            id: "hot-takes",
            title: "Real Estate Hot Takes",
            description: "RSS feed of the latest real estate news and trends",
            href: "/marketing-hub/hot-takes",
            icon: TrendingUp,
            keywords: ["news", "trends", "rss", "hot takes", "industry"],
            category: "marketing-branding",
            priority: 3
          },
          {
            id: "century21-logos",
            title: "Century 21 Logos",
            description: "Access Century 21 Beggins logos and branding assets",
            href: "/marketing-hub/century21-logos",
            icon: Building2,
            keywords: ["century 21", "logos", "branding", "assets", "beggins"],
            category: "marketing-branding",
            priority: 4
          },
          {
            id: "beach-project-toolkits",
            title: "Beach Project Toolkits",
            description: "Marketing materials for premium beach development projects",
            href: "/marketing-hub/beach-project-toolkits",
            icon: Waves,
            keywords: ["beach projects", "toolkits", "marketing", "premium", "development"],
            category: "marketing-branding",
            priority: 5
          }
        ]
      },
      {
        id: "prospecting",
        title: "Prospecting",
        description: "Find and convert leads with proven strategies",
        items: [
          {
            id: "prospecting-hub",
            title: "Prospecting Hub",
            description: "Access all prospecting tools and strategies",
            href: "/prospecting-hub",
            icon: Target,
            keywords: ["prospecting", "leads", "conversion", "strategies", "sales"],
            category: "prospecting",
            priority: 1
          },
          {
            id: "fsbo",
            title: "For Sale By Owners",
            description: "FSBO lead generation strategies",
            href: "/prospecting-hub/fsbo",
            icon: Home,
            keywords: ["fsbo", "for sale by owner", "leads", "generation", "strategies"],
            category: "prospecting",
            priority: 2
          },
          {
            id: "absentee-owners",
            title: "Absentee Owners",
            description: "Target absentee property owners",
            href: "/prospecting-hub/absentee-owners",
            icon: Users,
            keywords: ["absentee owners", "property owners", "target", "leads"],
            category: "prospecting",
            priority: 3
          },
          {
            id: "expired-listings",
            title: "Expired Listings",
            description: "Convert expired listing leads",
            href: "/prospecting-hub/expired-listings",
            icon: Calendar,
            keywords: ["expired listings", "leads", "conversion", "follow up"],
            category: "prospecting",
            priority: 4
          },
          {
            id: "probate",
            title: "Probate",
            description: "Probate real estate opportunities",
            href: "/prospecting-hub/probate",
            icon: FileText,
            keywords: ["probate", "estate", "opportunities", "leads", "legal"],
            category: "prospecting",
            priority: 5
          },
          {
            id: "soi",
            title: "SOI",
            description: "Sphere of influence marketing",
            href: "/prospecting-hub/soi",
            icon: Users,
            keywords: ["soi", "sphere of influence", "networking", "relationships"],
            category: "prospecting",
            priority: 6
          },
          {
            id: "pre-foreclosure",
            title: "Pre-Foreclosure",
            description: "Pre-foreclosure lead strategies",
            href: "/prospecting-hub/pre-foreclosure",
            icon: TrendingUp,
            keywords: ["pre-foreclosure", "leads", "strategies", "distressed"],
            category: "prospecting",
            priority: 7
          },
          {
            id: "first-time-buyers",
            title: "First Time Home Buyers",
            description: "First-time buyer conversion",
            href: "/prospecting-hub/first-time-buyers",
            icon: Home,
            keywords: ["first time buyers", "buyers", "conversion", "new"],
            category: "prospecting",
            priority: 8
          },
          {
            id: "investors",
            title: "Real Estate Investors",
            description: "Investor lead generation",
            href: "/prospecting-hub/investors",
            icon: Building2,
            keywords: ["investors", "investment", "leads", "generation"],
            category: "prospecting",
            priority: 9
          },
          {
            id: "divorce",
            title: "Divorce",
            description: "Divorce real estate strategies",
            href: "/prospecting-hub/divorce",
            icon: Users,
            keywords: ["divorce", "strategies", "leads", "family"],
            category: "prospecting",
            priority: 10
          }
        ]
      },
      {
        id: "training",
        title: "Training & Development",
        description: "Comprehensive training programs to elevate your skills",
        items: [
          {
            id: "training-hub",
            title: "Training Hub",
            description: "Access all training programs and resources",
            href: "/training-hub",
            icon: GraduationCap,
            keywords: ["training", "education", "learning", "development", "skills"],
            category: "training",
            priority: 1
          },
          {
            id: "social-media-mastery",
            title: "Social Media Mastery",
            description: "Build a magnetic brand, win attention daily, and convert it ethically",
            href: "/training-hub/social-media-mastery",
            icon: Share2,
            keywords: ["social media", "branding", "marketing", "content", "conversion"],
            category: "training",
            priority: 2
          },
          {
            id: "negotiation-mastery",
            title: "Negotiation Mastery",
            description: "Tactical empathy + dealcraft for listings, buyers, and everything in between",
            href: "/training-hub/negotiation-mastery",
            icon: MessageSquare,
            keywords: ["negotiation", "tactical empathy", "deals", "sales", "strategy"],
            category: "training",
            priority: 3
          },
          {
            id: "moxi-works",
            title: "Moxi Works Training",
            description: "Master the complete Moxi Works platform with comprehensive training modules",
            href: "/training-hub/moxi-works",
            icon: Monitor,
            keywords: ["moxi works", "platform", "training", "crm", "management"],
            category: "training",
            priority: 4
          },
          {
            id: "script-mastery",
            title: "Script Mastery",
            description: "Master objection handling and conversion scripts for any situation",
            href: "/training-hub/script-mastery",
            icon: BookOpen,
            keywords: ["scripts", "objection handling", "conversion", "sales", "dialogue"],
            category: "training",
            priority: 5
          },
          {
            id: "buyer-process",
            title: "Buyer Process (6P's)",
            description: "Our proven 6P's system for guiding buyers through the purchase process",
            href: "/training-hub/buyer-process",
            icon: Target,
            keywords: ["buyer process", "6ps", "buyers", "system", "process"],
            category: "training",
            priority: 6
          },
          {
            id: "listing-process",
            title: "Listing Process (7P's)",
            description: "7-step listing consultation and presentation process",
            href: "/training-hub/listing-process",
            icon: Home,
            keywords: ["listing process", "7ps", "listings", "presentation", "consultation"],
            category: "training",
            priority: 7
          },
          {
            id: "disc-vak",
            title: "DISC/VAK Connection",
            description: "Personality-based communication training",
            href: "/training-hub/disc-vak",
            icon: Users,
            keywords: ["disc", "vak", "personality", "communication", "behavior"],
            category: "training",
            priority: 8
          },
          {
            id: "daily-morning-huddles",
            title: "Daily Morning Huddles",
            description: "Join our daily team huddles for motivation, updates, and training",
            href: "/training-hub/daily-morning-huddles",
            icon: Video,
            keywords: ["morning huddles", "daily", "team", "motivation", "updates"],
            category: "training",
            priority: 9
          },
          {
            id: "buyer-broker-agreement",
            title: "Buyer Broker Agreement Training",
            description: "Master the art of presenting and executing buyer broker agreements effectively",
            href: "/training-hub/buyer-broker-agreement-training",
            icon: FileText,
            keywords: ["buyer broker agreement", "training", "presentation", "execution"],
            category: "training",
            priority: 10
          },
          {
            id: "dotloop-training",
            title: "Dotloop Training",
            description: "Complete Dotloop mastery from setup to closing with interactive training modules",
            href: "/training-hub/dotloop-training",
            icon: Settings,
            keywords: ["dotloop", "training", "setup", "closing", "transaction management"],
            category: "training",
            priority: 11
          }
        ]
      },
      {
        id: "support",
        title: "Support & Help",
        description: "Get help and support when you need it",
        items: [
          {
            id: "support",
            title: "Support Center",
            description: "Get help with any questions or issues",
            href: "/support",
            icon: HelpCircle,
            keywords: ["support", "help", "questions", "issues", "assistance"],
            category: "support",
            priority: 1
          },
          {
            id: "profile",
            title: "Profile Settings",
            description: "Manage your profile and account settings",
            href: "/profile",
            icon: Settings,
            keywords: ["profile", "settings", "account", "preferences", "manage"],
            category: "support",
            priority: 2
          },
          {
            id: "branding",
            title: "Branding Settings",
            description: "Manage your personal branding and logo preferences",
            href: "/profile/branding",
            icon: Star,
            keywords: ["branding", "logo", "personal", "preferences", "customization"],
            category: "support",
            priority: 3
          }
        ]
      }
    ]
  }
}
