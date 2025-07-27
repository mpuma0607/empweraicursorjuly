import type { TenantConfig } from "../types"

export const brokeragePrivateConfig: TenantConfig = {
  id: "brokerage-private",
  name: "Private Brokerage",
  domain: [
    // Phase 2: Test subdomains
    "brokerage.thenextlevelu.com",
    "brokerage.localhost",
    // Phase 3: Future custom domains
    "brokerage-pro.com",
    "www.brokerage-pro.com",
  ],
  branding: {
    name: "Private Brokerage Platform",
    logo: "/images/nlu-logo-light.png",
    logoDark: "/images/nlu-logo-dark.png",
    colors: {
      primary: "#2563eb",
      secondary: "#64748b",
      accent: "#0ea5e9",
      background: "#ffffff",
      text: "#1e293b",
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
        id: "private-training",
        title: "Private Training",
        href: "/training-hub/private-training",
        description: "Exclusive training materials",
      },
      {
        id: "brokerage-resources",
        title: "Brokerage Resources",
        href: "/marketing-hub/brokerage-resources",
        description: "Internal brokerage materials",
      },
    ],
    hiddenFeatures: [],
    customNavigation: false,
    customHomePage: null,
  },
  localization: {
    language: "en",
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
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
        subdomain: "private-brokerage",
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
          id: "basic",
          name: "Basic Plan",
          price: 49,
          interval: "month",
        },
        {
          id: "pro",
          name: "Pro Plan",
          price: 99,
          interval: "month",
        },
      ],
    },
  },
  content: {
    customTraining: true,
    onboardingFlow: false,
    privateResources: true,
    customAbout: "Private brokerage platform with exclusive tools and training.",
  },
}
