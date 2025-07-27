import type { TenantConfig } from "../types"

export const empowerAiConfig: TenantConfig = {
  id: "empower-ai",
  name: "Empower AI",
  domain: ["getempowerai.com", "www.getempowerai.com"],
  branding: {
    name: "Empower AI",
    logo: "/images/empower-ai-logo.png", // WHITE logo for consumer home page
    logoDark: "/images/empower-ai-portal-logo.png", // BLACK logo for portal navigation
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
      "ideahub-empower",
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
        subdomain: "getempowerai",
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
    customAbout: "",
  },
}
