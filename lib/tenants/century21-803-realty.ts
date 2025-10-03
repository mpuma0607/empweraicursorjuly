import { TenantConfig } from '@/lib/tenant-config'

export const century21803RealtyConfig: TenantConfig = {
  id: 'century21-803-realty',
  name: 'Century 21 803 Realty',
  domain: '21goldconnect.com',
  branding: {
    logo: '/images/c21-803-realty-logo.png',
    logoWhite: '/images/c21-803-realty-white.png',
    logoBlack: '/images/c21-803-realty-black.png',
    favicon: '/images/c21-803-realty-favicon.ico',
    colors: {
      primary: '#1e40af',
      secondary: '#fbbf24',
      accent: '#dc2626',
      background: '#f8fafc'
    }
  },
  features: {
    aiHub: true,
    leadHub: true,
    marketingHub: true,
    stagingHub: true,
    leadershipHub: true,
    roleplayAI: true,
    roleplay2AI: true,
    quickCMA: true,
    ideaHub: true,
    dynamicBrandedContent: true,
    chatbot: true,
    customHomePage: "/c21-803-realty-home"
  },
  localization: {
    currency: 'USD',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY'
  },
  auth: {
    provider: 'memberspace',
    settings: {
      memberspace: {
        subdomain: '21goldconnect',
        script: `var MemberSpace = window.MemberSpace || {"subdomain":"21goldconnect"}; (function(d){ var s = d.createElement("script"); s.src = "https://cdn.memberspace.com/scripts/widgets.js"; var e = d.getElementsByTagName("script")[0]; e.parentNode.insertBefore(s,e); }(document));`
      }
    }
  },
  content: {
    title: 'Century 21 803 Realty',
    description: 'Empower your real estate business with AI-powered tools and training',
    hero: {
      title: 'Welcome to Century 21 803 Realty',
      subtitle: 'Your AI-powered real estate platform',
      cta: 'Get Started'
    }
  }
}
