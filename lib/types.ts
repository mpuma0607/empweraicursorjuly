export interface TenantConfig {
  id: string
  name: string
  domain: string[]
  branding: {
    name: string
    logo: string
    logoDark?: string
    colors: {
      primary: string
      secondary: string
      accent: string
      background: string
      text: string
    }
  }
  features: {
    enabledTools: string[]
    customSections: Array<{
      id: string
      title: string
      href: string
      description: string
    }>
    hiddenFeatures: string[]
    customNavigation: boolean
    customHomePage?: string
  }
  localization: {
    language: string
    currency: string
    dateFormat: string
    translations?: Record<string, string>
  }
  auth: {
    provider: "memberspace" | "google-workspace" | "custom"
    settings: {
      memberspace?: {
        siteId: string
        requireLogin: boolean
        allowedPlans: string[]
      }
      googleWorkspace?: {
        allowedDomains: string[]
        clientId: string
      }
      custom?: Record<string, any>
    }
    billing: {
      model: "subscription" | "enterprise" | "free"
      currency: string
      plans: Array<{
        id: string
        name: string
        price: number
        interval: "month" | "year"
        features: string[]
      }>
    }
  }
  content: {
    customTraining: boolean
    onboardingFlow: boolean
    privateResources: boolean
    customAbout: string
  }
}

export interface UserCreation {
  id: string
  user_id: string
  user_email: string
  user_name: string
  tool_name: string
  creation_type: string
  content: any
  created_at: string
  tenant_id?: string
}

export interface AnalyticsEvent {
  id: string
  user_id?: string
  session_id: string
  event_type: string
  event_data: any
  page_url: string
  user_agent: string
  ip_address: string
  created_at: string
  tenant_id?: string
}
