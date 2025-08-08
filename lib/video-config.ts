// Centralized video configuration for the entire site
// This makes it easy to update video links in one place

export interface VideoConfig {
  id: string
  title: string
  description?: string
  category: string
}

export const videoConfig: { [key: string]: VideoConfig } = {
  // AI Hub Videos (Home Page)
  "whos-who-ai": {
    id: "nw-EiAXFxAw",
    title: "Who's Who AI Demo",
    category: "ai-hub"
  },
  "scriptit-ai": {
    id: "GDqP7eQAsPk",
    title: "ScriptIT AI Demo",
    category: "ai-hub"
  },
  "ideahub-ai": {
    id: "silQHa755P8",
    title: "IdeaHub AI Demo",
    category: "ai-hub"
  },
  "roleplay-ai": {
    id: "UHMl9DWcB-U",
    title: "RolePlay AI Demo",
    category: "ai-hub"
  },
  "realdeal-ai": {
    id: "QKsQz_EfBpc",
    title: "RealDeal AI Demo",
    category: "ai-hub"
  },
  "realcoach-ai": {
    id: "Kc51M_x5g1M",
    title: "RealCoach AI Demo",
    category: "ai-hub"
  },
  "realbio-ai": {
    id: "Fodk2XZ7vPs",
    title: "RealBio AI Demo",
    category: "ai-hub"
  },
  "quickcma-ai": {
    id: "R0aHu3p8hgs",
    title: "QuickCMA AI Demo",
    category: "ai-hub"
  },
  "propbot-ai": {
    id: "jn1zDrKUpDk",
    title: "PropBot AI Demo",
    category: "ai-hub"
  },
  "listit-ai": {
    id: "vexraBWRtpk",
    title: "ListIT AI Demo",
    category: "ai-hub"
  },
  "goalscreen-ai": {
    id: "cLSgyoFffUs",
    title: "GoalScreen AI Demo",
    category: "ai-hub"
  },
  "bizplan-ai": {
    id: "xL5lKqLB7KM",
    title: "BizPlan AI Demo",
    category: "ai-hub"
  },
  "action-ai": {
    id: "Uv57em2H8Jc",
    title: "Action AI Demo",
    category: "ai-hub"
  },
  "mymarket-ai": {
    id: "OOZSFrk3jJo",
    title: "MyMarket AI Demo",
    category: "ai-hub"
  },
  "dynamicbrand-ai": {
    id: "lOcBX_AgBAQ",
    title: "DynamicBrand AI Demo",
    category: "marketing-hub"
  },

  // Hero Video (Home Page)
  "hero-demo": {
    id: "cZRDOpKickM",
    title: "Empower AI Platform Demo",
    category: "hero"
  },

  // Training Hub Videos
  "listing-process-intro": {
    id: "BDOnxUdsDco",
    title: "Listing Process Introduction",
    category: "training"
  },
  "listing-process-step1": {
    id: "qLpEbWPlJOc",
    title: "Listing Process Step 1",
    category: "training"
  },
  "listing-process-step2": {
    id: "XY_DIa-Xqi4",
    title: "Listing Process Step 2",
    category: "training"
  },
  "listing-process-step3": {
    id: "Bp-0CmCUMc0",
    title: "Listing Process Step 3",
    category: "training"
  },
  "listing-process-step4": {
    id: "vecmMHVPa4Q",
    title: "Listing Process Step 4",
    category: "training"
  },
  "listing-process-step5": {
    id: "hXy09jVKok4",
    title: "Listing Process Step 5",
    category: "training"
  },
  "listing-process-step6": {
    id: "m33K9pG5oy0",
    title: "Listing Process Step 6",
    category: "training"
  },
  "listing-process-step7": {
    id: "VDClII0Sb70",
    title: "Listing Process Step 7",
    category: "training"
  },
  "listing-process-step8": {
    id: "vZtNCwr7waY",
    title: "Listing Process Step 8",
    category: "training"
  },
  "listing-process-step9": {
    id: "KwQBFP5r0-c",
    title: "Listing Process Step 9",
    category: "training"
  },
  "listing-process-step10": {
    id: "I3ORDxaNftE",
    title: "Listing Process Step 10",
    category: "training"
  },
  "listing-process-step11": {
    id: "1-qu3CpEr_g",
    title: "Listing Process Step 11",
    category: "training"
  },
  "listing-process-step12": {
    id: "vNTsAF9j18c",
    title: "Listing Process Step 12",
    category: "training"
  },
  "listing-process-step13": {
    id: "7PALdrkChBc",
    title: "Listing Process Step 13",
    category: "training"
  },

  // Buyer Process Videos
  "buyer-process-intro": {
    id: "-iZP4tThjtI",
    title: "Buyer Process Introduction",
    category: "training"
  },
  "buyer-prequalification": {
    id: "lB5b8Z_ynTo",
    title: "Buyer Prequalification",
    category: "training"
  },
  "buyer-showing": {
    id: "BSHRhGUybOE",
    title: "Buyer Showing Process",
    category: "training"
  },
  "buyer-negotiation": {
    id: "vsAWQSDDC7Q",
    title: "Buyer Negotiation",
    category: "training"
  },
  "buyer-closing": {
    id: "fTXFHSFBQg8",
    title: "Buyer Closing Process",
    category: "training"
  },
  "buyer-follow-up": {
    id: "oIzLWuyqM_g",
    title: "Buyer Follow Up",
    category: "training"
  },
  "buyer-marketing": {
    id: "5iqtxxpKjnY",
    title: "Buyer Marketing",
    category: "training"
  },
  "buyer-systems": {
    id: "7wiikkaLlSk",
    title: "Buyer Systems",
    category: "training"
  },
  "buyer-advanced": {
    id: "k1QQFu1ViCU",
    title: "Advanced Buyer Strategies",
    category: "training"
  },

  // DISC/VAK Videos
  "disc-intro": {
    id: "f5PQSsmSuVQ",
    title: "DISC Introduction",
    category: "training"
  },
  "disc-dominance": {
    id: "21KjFCB_Gcs",
    title: "DISC Dominance",
    category: "training"
  },
  "disc-influence": {
    id: "_uGbXBP-n10",
    title: "DISC Influence",
    category: "training"
  },
  "disc-steadiness": {
    id: "tB9VTQMnOGg",
    title: "DISC Steadiness",
    category: "training"
  },
  "disc-compliance": {
    id: "ku3wQVFRqZ0",
    title: "DISC Compliance",
    category: "training"
  },
  "vak-learning": {
    id: "KKXihRiifJQ",
    title: "VAK Learning Styles",
    category: "training"
  },

  // DotLoop Training
  "dotloop-basics": {
    id: "rRyL3aHnOtI",
    title: "DotLoop Basics",
    category: "training"
  },

  // Prospecting Videos
  "absentee-owners": {
    id: "OAyGcei-gMo",
    title: "Absentee Owner Prospecting",
    category: "prospecting"
  },
  "fsbo-prospecting": {
    id: "Blhdk_5WzbY",
    title: "FSBO Prospecting",
    category: "prospecting"
  },
  "expired-listings": {
    id: "2-Hj6uGfyic",
    title: "Expired Listings Prospecting",
    category: "prospecting"
  },

  // Marketing Hub
  "beach-project-intro": {
    id: "-3J3_QK8uGU",
    title: "Beach Project Introduction",
    category: "marketing"
  },
  "beach-project-toolkit": {
    id: "8pErLSnF_OA",
    title: "Beach Project Toolkit",
    category: "marketing"
  },

  // Zillow Hub
  "zillow-showcase-1": {
    id: "b5nSSSIXYN0",
    title: "Zillow Showcase 1",
    category: "zillow"
  },
  "zillow-showcase-2": {
    id: "phjpNOyTDeI",
    title: "Zillow Showcase 2",
    category: "zillow"
  },
  "zillow-showcase-3": {
    id: "XYiC3oX51hM",
    title: "Zillow Showcase 3",
    category: "zillow"
  },
  "zillow-showcase-4": {
    id: "GWaQM9yiSIU",
    title: "Zillow Showcase 4",
    category: "zillow"
  },

  // Onboarding
  "agent-profile-setup": {
    id: "CXVfIF75Vs0",
    title: "Agent Profile Setup",
    category: "onboarding"
  },

  // Buyer Broker Agreement
  "buyer-broker-playlist": {
    id: "PLnJRpgqKE8_POy877wg0BVJ-F-Js3TzhS",
    title: "Buyer Broker Agreement Training",
    category: "training"
  }
}

// Helper functions
export function getVideoUrl(key: string, options: { autoplay?: boolean; rel?: boolean; modestbranding?: boolean } = {}): string {
  const video = videoConfig[key]
  if (!video) {
    console.warn(`Video not found for key: ${key}`)
    return ""
  }

  const { autoplay = 0, rel = 0, modestbranding = 1 } = options
  
  // Handle playlist URLs
  if (video.id.startsWith('PL')) {
    return `https://www.youtube.com/embed/videoseries?list=${video.id}&autoplay=${autoplay}&rel=${rel}&modestbranding=${modestbranding}`
  }
  
  return `https://www.youtube.com/embed/${video.id}?autoplay=${autoplay}&rel=${rel}&modestbranding=${modestbranding}`
}

export function getVideoByCategory(category: string): VideoConfig[] {
  return Object.values(videoConfig).filter(video => video.category === category)
}

export function getVideoByTitle(title: string): VideoConfig | undefined {
  return Object.values(videoConfig).find(video => 
    video.title.toLowerCase().includes(title.toLowerCase())
  )
}
