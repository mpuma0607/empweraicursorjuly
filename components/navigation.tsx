"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react"
import { useTenantConfig, useTranslation } from "@/contexts/tenant-context"
import { isFeatureHidden } from "@/lib/tenant-config"

const navigationItems = [
  {
    title: "AI Hub",
    href: "/ai-hub",
    submenu: [
      // Prospecting & Marketing AI Tools
      { title: "── Prospecting & Marketing AI Tools ──", href: "#", description: "", isHeader: true },
      { 
        title: "IdeaHub", 
        href: "/ai-hub/ideahub-empower", 
        description: "Social Media Content Generation",
        begginsHref: "/ai-hub/ideahub-beggins",
        empowerHref: "/ai-hub/ideahub-empower"
      },
      { title: "RealBio", href: "/ai-hub/realbio", description: "Professional Agent Bio Creation" },
      { title: "ScriptIT", href: "/ai-hub/scriptit-ai", description: "Custom Real Estate Scripts" },
      { title: "QuickCMA AI", href: "/ai-hub/quickcma-ai", description: "Comparative Market Analysis Tool" },
      { title: "RolePlay AI", href: "/ai-hub/roleplay-ai", description: "Voice Conversation Practice" },
      { title: "Who's Who AI", href: "/ai-hub/whos-who-ai", description: "Property Owner Skip Tracing" },
      // AI Tools For Buyers & Listings
      { title: "── AI Tools For Buyers & Listings ──", href: "#", description: "", isHeader: true },
      { title: "StageIT", href: "/ai-hub/stageit", description: "AI-Powered Virtual Staging Tool" },
      { title: "ListIT", href: "/ai-hub/listit-ai", description: "Property Listing Descriptions" },
      { title: "PropBot AI", href: "/ai-hub/propbot-ai", description: "Intelligent Property Search & Analysis" },
      { title: "MyMarket AI", href: "/ai-hub/mymarket-ai", description: "Housing & Rental Market Analysis" },
      { title: "Real-IMG", href: "/ai-hub/real-img", description: "Interactive Image Creator with Hotspots" },
      // AI Planning and Coaching AI Tools
      { title: "── AI Planning and Coaching AI Tools ──", href: "#", description: "", isHeader: true },
      { title: "GoalScreen AI", href: "/ai-hub/goalscreen-ai", description: "Daily Contact Goal Wallpaper Creator" },
      { title: "Action AI", href: "/ai-hub/action-ai", description: "Daily Prospecting Action Plans" },
      { title: "RealCoach AI", href: "/ai-hub/realcoach-ai", description: "Personalized Business Coaching" },
      { title: "BizPlan AI", href: "/ai-hub/bizplan-ai", description: "90-Day Business Plan Generator" },
      // AI Deal Analysis Tools
      { title: "── AI Deal Analysis Tools ──", href: "#", description: "", isHeader: true },
      { title: "RealDeal AI", href: "/ai-hub/realdeal-ai", description: "Contract Analysis & Summarization" },
    ],
  },
  {
    title: "Marketing Hub",
    href: "/marketing-hub",
    submenu: [
      {
        title: "Real Estate Hot Takes",
        href: "/marketing-hub/hot-takes",
        description: "Industry news and trending topics",
      },
      {
        title: "Brokerage Logos",
        href: "/marketing-hub/brokerage-logos",
        description: "Access Century 21 Beggins logos and branding assets",
      },
    ],
  },
  {
    title: "Prospecting Hub",
    href: "/prospecting-hub",
    submenu: [
      { title: "For Sale By Owners", href: "/prospecting-hub/fsbo", description: "FSBO lead generation strategies" },
      {
        title: "Absentee Owners",
        href: "/prospecting-hub/absentee-owners",
        description: "Target absentee property owners",
      },
      { title: "Expired Listings", href: "/prospecting-hub/expired-listings", description: "Convert expired listings" },
      { title: "Probate", href: "/prospecting-hub/probate", description: "Probate property opportunities" },
      { title: "SOI", href: "/prospecting-hub/soi", description: "Sphere of influence cultivation" },
      {
        title: "First Time Home Buyers",
        href: "/prospecting-hub/first-time-buyers",
        description: "First-time buyer programs",
      },
      { title: "Real Estate Investors", href: "/prospecting-hub/investors", description: "Investment property leads" },
      { title: "Divorce", href: "/prospecting-hub/divorce", description: "Divorce-related property sales" },
    ],
  },
  {
    title: "Training Hub",
    href: "/training-hub",
    submenu: [
      {
        title: "Negotiation Mastery",
        href: "/training-hub/negotiation-mastery",
        description: "Tactical empathy + dealcraft for real estate",
      },
      {
        title: "Moxi Works Training",
        href: "/training-hub/moxi-works",
        description: "Complete Moxi platform training",
      },
      { title: "Script Mastery", href: "/training-hub/script-mastery", description: "Master your sales scripts" },
      {
        title: "Buyer Process (6P's)",
        href: "/training-hub/buyer-process",
        description: "6-step buyer consultation process",
      },
      {
        title: "Listing Process (7P's)",
        href: "/training-hub/listing-process",
        description: "7-step listing consultation and presentation process",
      },
      { title: "DISC/VAK Connection", href: "/training-hub/disc-vak", description: "Personality-based communication" },
    ],
  },
  {
    title: "Coaching Hub",
    href: "/coaching-hub",
    submenu: [],
    empowerOnly: true,
  },
  {
    title: "Onboarding Hub",
    href: "/onboarding-hub",
    submenu: [
      {
        title: "Agent Profile & Set Up",
        href: "/onboarding-hub/agent-profile-setup",
        description: "Complete your agent profile and initial setup",
      },
      {
        title: "Moxi Works Set Up",
        href: "/onboarding-hub/moxi-works-setup",
        description: "Configure your Moxi Works platform",
      },
      {
        title: "Dotloop Set Up",
        href: "/onboarding-hub/dotloop-setup",
        description: "Set up your Dotloop transaction management",
      },
      {
        title: "Zoom Set Up",
        href: "/onboarding-hub/zoom-setup",
        description: "Configure Zoom for client meetings",
      },
    ],
  },
  {
    title: "Services Hub",
    href: "/services-hub",
    submenu: [
      {
        title: "Moxi Design Services",
        href: "/services-hub/moxi-design",
        description: "Professional design and marketing",
      },
      {
        title: "Brokerage Consulting",
        href: "/services-hub/brokerage-consulting",
        description: "Business growth consulting",
      },
    ],
  },
  {
    title: "Zillow Hub",
    href: "/zillow-hub/zillow-showcase",
    submenu: [
      {
        title: "Zillow Showcase",
        href: "/zillow-hub/zillow-showcase",
        description: "Complete Zillow Showcase training and resources",
      },
    ],
  },
  {
    title: "Networking Hub",
    href: "/networking-hub",
    submenu: [
      {
        title: "Community Groups & Chats",
        href: "/networking-hub",
        description: "Connect with real estate professionals",
      },
      {
        title: "Agent Directory",
        href: "/networking-hub/agent-directory",
        description: "Find and connect with other agents",
      },
    ],
  },
  {
    title: "Gear Hub",
    href: "/gear-hub",
    submenu: [],
  },
  {
    title: "Profile",
    href: "/profile",
    submenu: [
      {
        title: "Profile",
        href: "/profile",
        description: "Manage your member profile",
      },
      {
        title: "Creations Dashboard",
        href: "/creations-dashboard",
        description: "View your saved AI creations",
      },
    ],
  },
]

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const pathname = usePathname()
  const tenantConfig = useTenantConfig()
  const t = useTranslation()

  const toggleSubmenu = (title: string) => {
    setActiveSubmenu(activeSubmenu === title ? null : title)
  }

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Filter navigation items based on tenant config
  const filteredNavigationItems = navigationItems
    .map((item) => {
      // Check if this hub is hidden for this tenant
      const hubKey = item.title.toLowerCase().replace(" ", "-")
      if (isFeatureHidden(hubKey, tenantConfig)) {
        return null
      }

      // For Beggins tenant, show Onboarding Hub, for others hide it
      if (item.title === "Onboarding Hub" && tenantConfig.id !== "century21-beggins") {
        return null
      }

      // For Beggins tenant, show Zillow Hub, for others hide it
      if (item.title === "Zillow Hub" && tenantConfig.id !== "century21-beggins") {
        return null
      }

      // For Beggins tenant, hide Networking Hub
      if (item.title === "Networking Hub" && tenantConfig.id === "century21-beggins") {
        return null
      }

      // For Coaching Hub, only show for Empower tenants
      if (item.title === "Coaching Hub" && tenantConfig.id !== "empower-ai" && tenantConfig.id !== "empower-beta") {
        return null
      }

      // Filter submenu items based on tenant
      let filteredSubmenu =
        item.submenu?.filter((subItem) => {
          if (subItem.tenantSpecific && subItem.tenantSpecific !== tenantConfig.id) {
            return false
          }
          // Remove Brokerage Logos for all tenants except Beggins
          if (subItem.title === "Brokerage Logos" && tenantConfig.id !== "century21-beggins") {
            return false
          }
          return true
        }) || []

      // Add Dynamic Branded Content for Empower AI and Beggins tenants
      if (
        item.title === "Marketing Hub" &&
        (tenantConfig.id === "empower-ai" ||
          tenantConfig.id === "empower-beta" ||
          tenantConfig.id === "century21-beggins")
      ) {
        // Add Dynamic Branded Content as the first item
        filteredSubmenu.unshift({
          title: "Dynamic Branded Content",
          href: "/marketing-hub/dynamic-branded-content",
          description: "Create custom branded content for any topic",
        })
      }

      // Add Beggins-specific marketing items
      if (item.title === "Marketing Hub" && tenantConfig.id === "century21-beggins") {
        // Add Beach Project Toolkits
        filteredSubmenu.push({
          title: "Beach Project Toolkits",
          href: "/marketing-hub/beach-project-toolkits",
          description: "Marketing materials for premium beach development projects",
        })
      }

      // Add Beggins-specific training items
      if (item.title === "Training Hub" && tenantConfig.id === "century21-beggins") {
        // Add Daily Morning Huddles as the first item
        filteredSubmenu.unshift({
          title: "Daily Morning Huddles",
          href: "/training-hub/daily-morning-huddles",
          description: "Access daily training session replays Monday-Friday",
        })

        // Add Buyer Broker Agreement Training
        filteredSubmenu.push({
          title: "Buyer Broker Agreement Training",
          href: "/training-hub/buyer-broker-agreement-training",
          description: "Master buyer broker agreement presentations and execution",
        })

        // Add Dotloop Training
        filteredSubmenu.push({
          title: "Dotloop Training",
          href: "/training-hub/dotloop-training",
          description: "Complete Dotloop platform training and best practices",
        })
      }

      // Modify Services Hub for Beggins tenant
      if (item.title === "Services Hub" && tenantConfig.id === "century21-beggins") {
        // Remove Brokerage Consulting and add Referral/Relocation
        filteredSubmenu = filteredSubmenu.filter((subItem) => subItem.title !== "Brokerage Consulting")
        filteredSubmenu.push({
          title: "Referral/Relocation - Refer A Client",
          href: "/services-hub/referral-relocation",
          description: "Submit client referrals and relocation requests",
        })
      }

      // Add Beggins-specific profile links
      if (item.title === "Profile" && tenantConfig.id === "century21-beggins") {
        // Add Branding Profile as the first item
        filteredSubmenu.unshift({
          title: "Branding Profile",
          href: "/profile/branding",
          description: "Manage your personal branding and logo preferences",
        })

        filteredSubmenu.push(
          {
            title: "Pay Beggins Onboarding Fee",
            href: "https://buy.stripe.com/7sYeVecOM29m53Q4vq9ws00",
            description: "Complete your onboarding payment",
            external: true,
          },
          {
            title: "Manage BE3 Membership",
            href: "https://joinc21be3.com/pages/membership-portal",
            description: "Access your BE3 membership portal",
            external: true,
          },
        )
      }

      // Add Empower AI-specific profile links
      if (item.title === "Profile" && (tenantConfig.id === "empower-ai" || tenantConfig.id === "empower-beta")) {
        // Add Branding Profile as the first item
        filteredSubmenu.unshift({
          title: "Branding Profile",
          href: "/profile/branding",
          description: "Manage your personal branding and logo preferences",
        })
      }

      // Add custom sections for Training Hub if they exist, but exclude onboarding for Beggins
      if (item.title === "Training Hub" && tenantConfig.features.customSections.length > 0) {
        const customTrainingSections = tenantConfig.features.customSections.filter((section) => {
          // For Beggins tenant, exclude onboarding from Training Hub since it's now its own hub
          if (tenantConfig.id === "century21-beggins" && section.id === "onboarding") {
            return false
          }
          return section.href.startsWith("/training-hub/")
        })
        filteredSubmenu = [...filteredSubmenu, ...customTrainingSections]
      }

      // Get translated title, fallback to original if no translation
      const translationKey = `${hubKey}.title`
      const translatedTitle = t(translationKey)
      const displayTitle = translatedTitle !== translationKey ? translatedTitle : item.title

      return {
        ...item,
        title: displayTitle,
        submenu: filteredSubmenu,
      }
    })
    .filter(Boolean)

  // Get the correct logo for the tenant - use logo (black) for portal navigation (light background)
  const logoSrc = (() => {
    if (tenantConfig.id === "empower-ai") {
      return "/images/empower-ai-portal-logo.png"
    }
    if (tenantConfig.id === "century21-beggins") {
      return "/images/beggins-university-black.png" // Black logo for light background
    }
    if (tenantConfig.id === "default") {
      return "/images/nlu-logo-dark-new.png"
    }
    return tenantConfig.branding.logo || "/placeholder.svg"
  })()

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/portal" className="flex items-center">
            <Image
              src={logoSrc || "/placeholder.svg"}
              alt={tenantConfig.branding.name}
              width={140}
              height={50}
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {filteredNavigationItems.map(
              (item) =>
                item && (
                  <div key={item.title} className="relative group">
                    <div className="flex items-center gap-1">
                      {item.title === "Gear Hub" && tenantConfig.id === "default" ? (
                        <a
                          href="https://nextlevelu.printful.me/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                        >
                          {item.title}
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                        >
                          {item.title}
                        </Link>
                      )}
                      {item.submenu && item.submenu.length > 0 && (
                        <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-green-600 transition-colors" />
                      )}
                    </div>

                    {/* Desktop Submenu */}
                    {item.submenu && item.submenu.length > 0 && (
                      <div
                        className={`absolute left-0 mt-2 w-80 bg-white shadow-lg rounded-md border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 ${
                          item.submenu.length > 8 ? "max-h-96 overflow-y-auto" : ""
                        }`}
                      >
                        <div className="py-2">
                          {item.submenu.map((subItem) =>
                            subItem.isHeader ? (
                              <div
                                key={subItem.title}
                                className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100"
                              >
                                {subItem.title.replace(/──/g, "").trim()}
                              </div>
                            ) : subItem.external ? (
                              <a
                                key={subItem.href}
                                href={subItem.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block px-4 py-3 text-sm hover:bg-gray-50 hover:text-green-600 border-b border-gray-50 last:border-b-0"
                              >
                                <div className="font-medium text-gray-900">{subItem.title}</div>
                                {subItem.description && (
                                  <div className="text-xs text-gray-500 mt-1">{subItem.description}</div>
                                )}
                              </a>
                            ) : (
                              <Link
                                key={subItem.href}
                                href={
                                  subItem.title === "IdeaHub" && tenantConfig.id === "century21-beggins"
                                    ? subItem.begginsHref || subItem.href
                                    : subItem.title === "IdeaHub" &&
                                        (tenantConfig.id === "empower-ai" || tenantConfig.id === "empower-beta")
                                      ? subItem.empowerHref || subItem.href
                                      : subItem.href
                                }
                                className="block px-4 py-3 text-sm hover:bg-gray-50 hover:text-green-600 border-b border-gray-50 last:border-b-0"
                              >
                                <div className="font-medium text-gray-900">{subItem.title}</div>
                                {subItem.description && (
                                  <div className="text-xs text-gray-500 mt-1">{subItem.description}</div>
                                )}
                              </Link>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ),
            )}

            {/* Get Support Link */}
            <Link href="/support" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
              Get Support
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <div className="space-y-2">
              {filteredNavigationItems.map(
                (item) =>
                  item && (
                    <div key={item.title} className="border-b border-gray-100 pb-2">
                      <div
                        className="flex items-center justify-between py-2"
                        onClick={item.submenu && item.submenu.length > 0 ? () => toggleSubmenu(item.title) : undefined}
                      >
                        {item.title === "Gear Hub" && tenantConfig.id === "default" ? (
                          <a
                            href="https://nextlevelu.printful.me/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-gray-700 hover:text-green-600 font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.title}
                          </a>
                        ) : (
                          <Link
                            href={item.href}
                            className="block text-gray-700 hover:text-green-600 font-medium"
                            onClick={(e) => {
                              if (item.submenu && item.submenu.length > 0) {
                                e.preventDefault()
                              } else {
                                setMobileMenuOpen(false)
                              }
                            }}
                          >
                            {item.title}
                          </Link>
                        )}
                        {item.submenu && item.submenu.length > 0 && (
                          <Button variant="ghost" size="sm" className="p-1">
                            {activeSubmenu === item.title ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>

                      {/* Mobile Submenu */}
                      {activeSubmenu === item.title && item.submenu && item.submenu.length > 0 && (
                        <div
                          className={`pl-4 space-y-1 mt-1 ${item.submenu.length > 8 ? "max-h-80 overflow-y-auto" : ""}`}
                        >
                          {item.submenu.map((subItem) =>
                            subItem.isHeader ? (
                              <div
                                key={subItem.title}
                                className="py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                              >
                                {subItem.title.replace(/──/g, "").trim()}
                              </div>
                            ) : subItem.external ? (
                              <a
                                key={subItem.href}
                                href={subItem.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block py-2 text-sm hover:text-green-600"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <div className="font-medium text-gray-700">{subItem.title}</div>
                                {subItem.description && (
                                  <div className="text-xs text-gray-500 mt-1">{subItem.description}</div>
                                )}
                              </a>
                            ) : (
                              <Link
                                key={subItem.href}
                                href={
                                  subItem.title === "IdeaHub" && tenantConfig.id === "century21-beggins"
                                    ? subItem.begginsHref || subItem.href
                                    : subItem.title === "IdeaHub" &&
                                        (tenantConfig.id === "empower-ai" || tenantConfig.id === "empower-beta")
                                      ? subItem.empowerHref || subItem.href
                                      : subItem.href
                                }
                                className="block py-2 text-sm hover:text-green-600"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <div className="font-medium text-gray-700">{subItem.title}</div>
                                {subItem.description && (
                                  <div className="text-xs text-gray-500 mt-1">{subItem.description}</div>
                                )}
                              </Link>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  ),
              )}

              {/* Mobile Get Support Link */}
              <Link
                href="/support"
                className="flex items-center gap-2 py-2 text-gray-700 hover:text-green-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Support
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
