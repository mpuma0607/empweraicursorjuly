import type { TenantConfig } from "../types"

export const defaultTenantConfig: TenantConfig = {
  id: "default",
  name: "The Next Level U",
  domain: ["localhost", "thenextlevelu.com", "www.thenextlevelu.com"],
  branding: {
    name: "The Next Level U",
    logo: "/images/nlu-logo-light.png", // Light version with beige text for light backgrounds
    logoDark: "/images/nlu-logo-dark.png", // Dark version with black text for dark backgrounds
    colors: {
      primary: "#16a34a", // green-600
      secondary: "#059669", // emerald-600
      accent: "#0d9488", // teal-600
      background: "#ffffff",
      text: "#1f2937", // gray-800
    },
  },
  features: {
    enabledTools: [
      "ideahub-ai",
      "realbio",
      "listit",
      "scriptit",
      "roleplay-ai",
      "action-ai",
      "realcoach-ai",
      "bizplan-ai",
      "realdeal-ai",
      "quickcma-ai",
      "whos-who-ai",
      "goalscreen-ai",
      "propbot-ai",
    ],
    customSections: [],
    hiddenFeatures: [],
    customNavigation: false,
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
        subdomain: "thenextlevelu",
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
          id: "monthly",
          name: "Monthly Plan",
          price: 29.99,
          interval: "month",
          features: ["All AI Tools", "Training Hub", "Community Access"],
        },
        {
          id: "annual",
          name: "Annual Plan",
          price: 252,
          interval: "year",
          features: ["All AI Tools", "Training Hub", "Community Access", "30% Savings"],
        },
      ],
    },
  },
  content: {
    customTraining: false,
    onboardingFlow: false,
    privateResources: false,
  },
}
