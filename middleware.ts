import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Domain to tenant mapping - Phase 2: Adding test subdomains
const domainTenantMap: Record<string, string> = {
  // Empower AI domains
  "empowerai.com": "empower-ai",
  "www.empowerai.com": "empower-ai",
  "empowerai.localhost": "empower-ai",

  // Empower AI Beta domains
  "empoweraibeta.com": "empower-beta",
  "www.empoweraibeta.com": "empower-beta",
  "empoweraibeta.localhost": "empower-beta",

  // Century 21 Beggins domains
  "beggins.com": "century21-beggins",
  "www.beggins.com": "century21-beggins",
  "beggins.localhost": "century21-beggins",
  "begginsuniversity.com": "century21-beggins",
  "www.begginsuniversity.com": "century21-beggins",
  "begginsagents.com": "century21-beggins",
  "www.begginsagents.com": "century21-beggins",
  "beggins.thenextlevelu.com": "century21-beggins",

  // International domains
  "international.com": "international",
  "www.international.com": "international",
  "international.localhost": "international",

  // Brokerage Private domains
  "brokerage.com": "brokerage-private",
  "www.brokerage.com": "brokerage-private",
  "brokerage.localhost": "brokerage-private",
}

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || ""

  console.log(`[Middleware] Checking hostname: ${hostname}`)

  // Get tenant from domain mapping
  let tenant = domainTenantMap[hostname]

  // If no exact match, try partial matching for development
  if (!tenant) {
    if (hostname.includes("empoweraibeta")) {
      tenant = "empower-beta"
    } else if (hostname.includes("empowerai")) {
      tenant = "empower-ai"
    } else if (hostname.includes("beggins")) {
      tenant = "century21-beggins"
    } else if (hostname.includes("international")) {
      tenant = "international"
    } else if (hostname.includes("brokerage")) {
      tenant = "brokerage-private"
    } else {
      tenant = "default"
    }
  }

  // Add tenant to headers
  const response = NextResponse.next()
  response.headers.set("x-tenant", tenant)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
