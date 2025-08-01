import type { TenantConfig } from "../types"

export const century21BegginsConfig: TenantConfig = {
  id: "century21-beggins",
  name: "Century 21 Beggins",
  domain: [
    "begginsuniversity.com",
    "www.begginsuniversity.com",
    "beggins.thenextlevelu.com",
    "begginsagents.com",
    "www.begginsagents.com",
  ],
  branding: {
    name: "Beggins University",
    logo: "/images/beggins-university-black.png", // Black logo for light backgrounds
    logoDark: "/images/beggins-university-white.png", // White logo for dark backgrounds
    colors: {
      primary: "#C8102E",
      secondary: "#FFD100",
      accent: "#1F4E79",
      background: "#ffffff",
      text: "#1f2937",
    },
  },
  features: {
    customHomePage: "/beggins-home",
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
      "mymarket-ai",
      "whos-who-ai",
      "goalscreen-ai",
      "propbot-ai",
      "dynamic-branded-content",
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
        subdomain: "beggins",
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
    onboardingFlow: true,
    privateResources: false,
  },
}
