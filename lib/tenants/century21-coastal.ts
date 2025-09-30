import type { TenantConfig } from "../types"

export const century21CoastalConfig: TenantConfig = {
  id: "century21-coastal",
  name: "Century 21 Coastal Advantage",
  domain: [
    "c21coastal.com",
    "www.c21coastal.com",
    "coastal.thenextlevelu.com",
    "century21coastal.com",
    "www.century21coastal.com",
  ],
  branding: {
    name: "Century 21 Coastal Advantage",
    logo: "/images/c21-coastal-white.png", // White logo for light backgrounds (homepage)
    logoDark: "/images/c21-coastal-black.png", // Black logo for dark backgrounds (portal)
    colors: {
      primary: "#C8102E", // Century 21 Red
      secondary: "#FFD100", // Century 21 Gold
      accent: "#1F4E79", // Century 21 Navy
      background: "#ffffff",
      text: "#1f2937",
    },
  },
  features: {
    customHomePage: "/c21-coastal-home",
    enabledTools: [
      "ideahub-beggins",
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
        subdomain: "c21coastal",
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
