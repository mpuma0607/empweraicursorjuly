import type { TenantConfig } from "../types"

export const century21803RealtyConfig: TenantConfig = {
  id: "century21-803-realty",
  name: "Century 21 803 Realty",
  domain: [
    "21goldconnect.com",
    "www.21goldconnect.com",
    "803.thenextlevelu.com",
  ],
  branding: {
    name: "Century 21 803 Realty",
    logo: "/images/c21-803-realty-black.png", // Black logo for light backgrounds
    logoDark: "/images/c21-803-realty-white.png", // White logo for dark backgrounds
    colors: {
      primary: "#1e40af",
      secondary: "#fbbf24",
      accent: "#dc2626",
      background: "#ffffff",
      text: "#1f2937",
    },
  },
  features: {
    enabledTools: [
      "ideahub-empower",
      "realbio",
      "scriptit",
      "quickcma",
      "roleplay-ai",
      "whos-who-ai",
      "staging-hub",
      "listit",
      "propbot-ai",
      "mymarket-ai",
      "real-img",
      "goalscreen-ai",
      "action-ai",
      "realcoach-ai",
      "bizplan-ai",
      "realdeal-ai",
    ],
    customSections: [],
    hiddenFeatures: [],
    customNavigation: false,
    customHomePage: "/c21-803-realty-home",
  },
  localization: {
    language: "en",
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
    translations: {},
  },
  auth: {
    provider: "memberspace",
    settings: {
      memberspace: {
        siteId: "21goldconnect",
        requireLogin: true,
        allowedPlans: ["basic", "premium", "enterprise"],
      },
    },
    billing: {
      model: "subscription",
      currency: "USD",
      plans: [
        {
          id: "basic",
          name: "Basic",
          price: 29,
          interval: "month",
          features: ["ai-hub", "lead-hub"],
        },
        {
          id: "premium",
          name: "Premium",
          price: 59,
          interval: "month",
          features: ["ai-hub", "lead-hub", "marketing-hub", "staging-hub"],
        },
        {
          id: "enterprise",
          name: "Enterprise",
          price: 99,
          interval: "month",
          features: ["ai-hub", "lead-hub", "marketing-hub", "staging-hub", "leadership-hub"],
        },
      ],
    },
  },
  content: {
    customTraining: false,
    onboardingFlow: true,
    privateResources: false,
    customAbout: "Century 21 803 Realty - Empowering real estate professionals with AI-powered tools and comprehensive training.",
  },
}
