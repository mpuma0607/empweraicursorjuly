import type { TenantConfig } from "../types"

export const century21PortfolioConfig: TenantConfig = {
  id: "century21-portfolio",
  name: "Century 21 Portfolio",
  domain: [
    "c21agenthome.com",
    "www.c21agenthome.com",
    "portfolio.thenextlevelu.com",
    "c21portfolio.com",
    "www.c21portfolio.com",
  ],
  branding: {
    name: "Century 21 Portfolio",
    logo: "/images/c21-portfolio-black.png", // Black logo for light backgrounds
    logoDark: "/images/c21-portfolio-white.png", // White logo for dark backgrounds
    colors: {
      primary: "#C8102E",
      secondary: "#FFD100",
      accent: "#1F4E79",
      background: "#ffffff",
      text: "#1f2937",
    },
  },
  features: {
    customHomePage: "/c21-portfolio-home",
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
        subdomain: "c21portfolio",
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
