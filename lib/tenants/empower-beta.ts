import type { TenantConfig } from "../types"

export const empowerBetaConfig: TenantConfig = {
  id: "empower-beta",
  name: "Empower Beta",
  domain: ["empoweraibeta.com", "www.empoweraibeta.com"],
  branding: {
    name: "Empower AI",
    logo: "/images/empower-ai-logo.png",
    logoDark: "/images/empower-ai-portal-logo.png",
    colors: {
      primary: "#16a34a",
      secondary: "#059669",
      accent: "#0d9488",
      background: "#ffffff",
      text: "#1f2937",
    },
  },
  features: {
    enabledTools: [
      "ideahub-empower",
      "realbio",
      "scriptit",
      "quickcma-ai",
      "roleplay-ai",
      "whos-who-ai",
      "stageit",
      "listit-ai",
      "propbot-ai",
      "mymarket-ai",
      "real-img",
      "goalscreen",
      "action-ai",
      "realcoach-ai",
      "bizplan-ai",
      "realdeal-ai",
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
