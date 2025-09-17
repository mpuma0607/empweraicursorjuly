"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  User, 
  Palette, 
  Mail,
  Database,
  Settings
} from "lucide-react"

const navigation = [
  {
    name: "Profile",
    href: "/profile",
    icon: User,
    description: "Account settings and preferences"
  },
  {
    name: "Branding",
    href: "/profile/branding",
    icon: Palette,
    description: "Customize your brand appearance"
  },
  {
    name: "Email Integration",
    href: "/profile/email-integration",
    icon: Mail,
    description: "Connect Gmail or Outlook for sending emails"
  },
  {
    name: "CRM Integration",
    href: "/profile/crm-integration",
    icon: Database,
    description: "Connect Follow Up Boss for personalized content"
  }
]

export function ProfileNavigation() {
  const pathname = usePathname()

  return (
    <nav className="flex space-x-1 mb-8" aria-label="Profile navigation">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}
