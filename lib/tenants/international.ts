import type { TenantConfig } from "../types"

export const internationalConfig: TenantConfig = {
  id: "international",
  name: "International Platform",
  domain: [
    // Phase 2: Test subdomains
    "international.thenextlevelu.com",
    "international.localhost",
    // Phase 3: Future custom domains
    "international-realestate.com",
    "www.international-realestate.com",
  ],
  branding: {
    name: "International Real Estate Platform",
    logo: "/images/nlu-logo-light.png",
    logoDark: "/images/nlu-logo-dark.png",
    colors: {
      primary: "#059669",
      secondary: "#6b7280",
      accent: "#10b981",
      background: "#ffffff",
      text: "#111827",
    },
  },
  features: {
    enabledTools: [
      "ideahub-ai",
      "realbio",
      "listit",
      "scriptit",
      "quickcma-ai",
      "roleplay-ai",
      "propbot-ai",
      "whos-who-ai",
      "goalscreen-ai",
      "action-ai",
      "realcoach-ai",
      "bizplan-ai",
      "realdeal-ai",
    ],
    customSections: [
      {
        id: "international-markets",
        title: "International Markets",
        href: "/training-hub/international-markets",
        description: "Global real estate market insights",
      },
      {
        id: "currency-tools",
        title: "Currency Tools",
        href: "/tools/currency-converter",
        description: "Multi-currency conversion tools",
      },
    ],
    hiddenFeatures: [],
    customNavigation: false,
    customHomePage: null,
  },
  localization: {
    language: "en",
    currency: "USD",
    dateFormat: "DD/MM/YYYY",
    translations: {
      "ai-hub.title": "AI Hub",
      "marketing-hub.title": "Marketing Hub",
      "prospecting-hub.title": "Prospecting Hub",
      "training-hub.title": "Training Hub",
      "services-hub.title": "Services Hub",
      "networking-hub.title": "Networking Hub",
      "gear-hub.title": "Gear Hub",
    },
  },
  auth: {
    provider: "memberspace",
    settings: {
      memberspace: {
        subdomain: "international-platform",
        planUrls: {
          monthly: "/plans/monthly",
          annual: "/plans/annual",
        },
      },
    },
    billing: {
      model: "subscription",
      currency: "USD",
      plans: [
        {
          id: "global",
          name: "Global Plan",
          price: 79,
          interval: "month",
        },
      ],
    },
  },
  content: {
    customTraining: true,
    onboardingFlow: false,
    privateResources: false,
    customAbout: "International real estate platform serving global markets.",
  },
}
