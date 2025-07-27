"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  FileText,
  Home,
  CheckCircle,
  ArrowLeft,
  Building2,
  Building,
  BookOpen,
  Play,
  BookOpenCheck,
  Waves,
  Mail,
  MessageSquare,
} from "lucide-react"

const beachProjects = [
  {
    id: "beachmaker",
    title: "The Beachmaker",
    description: "Complete marketing toolkit for The Beachmaker project",
    icon: Building2,
    color: "bg-gradient-to-br from-blue-500 to-cyan-500",
  },
  {
    id: "capri",
    title: "The Capri",
    description: "Marketing resources and tools for The Capri development",
    icon: Building,
    color: "bg-gradient-to-br from-green-500 to-teal-500",
  },
  {
    id: "johns-pass",
    title: "Johns Pass Retreat",
    description: "Comprehensive marketing materials for Johns Pass Retreat",
    icon: Waves,
    color: "bg-gradient-to-br from-purple-500 to-indigo-500",
  },
  {
    id: "residences",
    title: "The Residences",
    description: "Marketing toolkit for The Residences luxury project",
    icon: Home,
    color: "bg-gradient-to-br from-orange-500 to-red-500",
  },
]

const projectContent = {
  beachmaker: {
    overview: {
      title: "The Beachmaker Project Overview",
      description:
        "The Beachmaker Hotel brings all the imagery, beauty and spirit of your favorite beach town into one experience at Madeira Beach. It's a landing for comfort-seeking sand slingers who want to vacation without feeling like a tourist. As an owner, you get to provide your guest with an experience like no other. All without lifting a finger. The first 65 buyers will be provided membership into The Founders Club. The Founders Club provides members with a variety of perks.",
      features: [
        "Marriott Autograph Collection Hotel",
        "Fully managed condo/hotel",
        "Prime location in Madeira Beach, FL",
        "Luxurious finishes throughout",
      ],
      keyStats: [
        "171 Total Units",
        "10 Residential Units",
        "10% initial deposit due at reservation",
        "15% additional deposit due at ground breaking in Q2 of 2025",
        "Remaining balance due at closing/completion currently expected to be in 2027",
      ],
    },
    resources: [
      {
        title: "Project Website & Presentation",
        type: "Video",
        description: "Project overview videos and presentations",
        embedType: "youtube-videos",
        embeds: ["https://www.youtube.com/embed/-3J3_QK8uGU", "https://www.youtube.com/embed/8pErLSnF_OA"],
      },
      {
        title: "Floor Plans",
        type: "PDF",
        description: "Detailed unit floor plans",
        embedType: "google-drive",
        embeds: ["https://drive.google.com/embeddedfolderview?id=1Q6gCiD7xRHa5M-J1rfJoctOW6Y4F6Hoo#grid"],
      },
      {
        title: "Renderings",
        type: "Images",
        description: "Professional project renderings",
        embedType: "google-drive",
        embeds: ["https://drive.google.com/embeddedfolderview?id=1meZg2J2nKv7VmEsSJ28OK4UhqeFXiTXY#grid"],
      },
      {
        title: "Marketing Material",
        type: "Documents",
        description: "Social posts, email scripts, and text scripts",
        embedType: "beachmaker-marketing-materials",
        embeds: [
          {
            title: "Social Graphics",
            url: "https://drive.google.com/embeddedfolderview?id=1yCB-DMgjxHVNb4uBTEnUzcJkqX-5YU5U#grid",
          },
        ],
        emailScripts: [
          {
            subject: "Introducing Luxury Living at Its Best: Secure Your Beachside Dream!",
            content:
              "Dear [Recipient Name],\n\nDiscover unparalleled luxury at our newly launched, world-class branded hotel. Boasting 129 carefully crafted units - from the exquisite King Suites to the opulent Penthouse Units - our project offers an experience tailored to your definition of indulgence.\n\nKey Highlights:\n🌊 Direct beach access with a unique flyover\n🏋️ State-of-the-art fitness facility\n🎉 Jaw-dropping event space for unforgettable celebrations\n🍽 Steps away from top-tier restaurants and shopping delights\n\nFind your coastal haven today starting at just $700k. Embrace beachside luxury like never before!\n\nWarm Regards,\n[Your Company Name]",
          },
          {
            subject: "Dive into Luxury: Pool Side Cabana Suites Now Available!",
            content:
              "Dear [Recipient Name],\n\nPicture this: A fully furnished, poolside cabana suite with resort pools right at your doorstep. Dive into luxury with our limited edition Pool Side Cabana Suites, starting at $800k.\n\nEnjoy:\n🛎 Fully Managed, Hands-Off Ownership\n🏖 90 days of personal beach memories every year\n🛍 Proximity to elite shopping destinations and gourmet dining\n\nDon't wait; dive into your dream home now!\n\nBest Wishes,\n[Your Company Name]",
          },
          {
            subject: "Elevate Every Event: Unveiling Our Draw-Dropping Event Space!",
            content:
              "Dear [Recipient Name],\n\nDream of hosting events that leave an everlasting impression? Our project introduces an event space perfect for grand celebrations, weddings, and gatherings, all set against a mesmerizing beach backdrop.\n\nAlso, explore:\n🏡 Units ranging from Villa Suites to opulent Penthouse Units\n🌊 Two lavish resort pools and direct beach access\n🛍 Unmatched proximity to top restaurants & shopping avenues\n\nCraft unforgettable memories with us!\n\nWarmly,\n[Your Company Name]",
          },
          {
            subject: "Experience Ultimate Comfort: Every Unit, Fully Furnished!",
            content:
              "Dear [Recipient Name],\n\nWhy wait to decorate when you can move into luxury? Our units come fully furnished, meticulously curated for discerning tastes like yours. From the spacious Villa Suites starting at $1.2mm to the luxurious Penthouses at $3mm, there's a home waiting for you.\n\nAdditionally:\n💪 Enjoy our top-tier fitness facility\n🏊 Revel in two resort pools\n🍴 Steps away from gastronomic delights and shopping\n\nSecure your key to luxury today!\n\nBest Regards,\n[Your Company Name]",
          },
          {
            subject: "Embrace the Penthouse Life: Limited Units, Unlimited Luxury!",
            content:
              "Dear [Recipient Name],\n\nEver dreamt of the penthouse lifestyle? Our limited edition Penthouse Units promise lavish living, starting at $3mm. Revel in 30+ days of sun-soaked memories and exclusive features.\n\nWith:\n🏋 State-of-the-art fitness facility\n🌊 Direct beach access via a unique flyover\n🛍 Proximity to chic shopping and gourmet dining\n\nElevate your living standards. Book your penthouse today!\n\nCheers,\n[Your Company Name]",
          },
        ],
        textScripts: [
          "🌟 Discover luxury at its finest with our world-class branded hotel! Choose from 129 exquisite units, from King Suites to opulent Penthouses. Dive into resort pools & enjoy direct beach access. Find your paradise starting at $700k+. 🏝️ #BeachLuxuryLiving",
          "🏊 Dive into resort life with our Poolside Cabana Suites and two lavish resort pools. Every unit, fully furnished & managed for your ease. Enjoy personal beach days & state-of-the-art amenities. Your coastal dream starts here! 💼 #HandsOffLuxury",
          "🎊 Dreaming of the perfect beachside wedding? Our jaw-dropping event space promises memories to last a lifetime. Stay steps from top restaurants & shopping, in units tailored to your luxury. Book your slice of heaven now! 🛍️ #BeachsideBliss",
          "💪 Elevate your lifestyle with our top-tier fitness facility. Choose from our range of units - Villa Suites to Penthouses, each offering a unique experience. All units come fully furnished with up to 90 days personal use. Commit to luxury today! 🌅 #FitForRoyalty",
          "🌆 Penthouse Views, Direct Beach Access, & More! Our units promise unparalleled luxury, with prices starting from $700k+. Relish in 30+ days of sun-soaked beach memories and redefine your lifestyle. Secure your dream home today! 🌊 #PenthousePerfection",
        ],
      },
    ],
    playlistId: "PLdL-RhpjPdxtNEYygYENtGoYlQjDwcgJK",
  },
  capri: {
    overview: {
      title: "The Capri Project Overview",
      description:
        "NOW COMPLETE WITH CERTIFICATE OF OCCUPANCY IMMINENT! Capri Townhomes – The Ultimate Beachside Investment + Lifestyle Opportunity. Introducing Capri Townhomes, a boutique enclave of just seven stunning 5-bedroom, 4-bath luxury townhome-style condos, each designed to elevate your coastal living experience. With nearly 2,800 square feet of well-thought-out living space, private rooftop decks, oversized 2+ car garages, and a community pool, this exclusive development truly offers it all — and it's just steps away from the pristine sands of Treasure Island and iconic John's Pass Village.",
      features: [
        "MOVE-IN READY — No waiting. No guessing.",
        "ZONED FOR NIGHTLY + WEEKLY RENTALS — VRBO & Airbnb LEGAL",
        "RENTAL PROJECTIONS NEAR $200K ANNUALLY",
        "PET-FRIENDLY — Two pets allowed, no weight limits",
        "ROOFTOP DECKS with GULF VIEWS, wet bars & hot tub reinforcement",
        "FLOOD-ZONE ELEVATED construction with LUXURY FINISHES",
      ],
      keyStats: [
        "3 story units & private rooftop deck",
        "7 luxury units",
        "2 buildings",
        "Starting in the mid $1mm's",
        "$5k to hold, 10% due after document review, 10% due at ground breaking, remaining balance due at closing",
      ],
    },
    resources: [
      {
        title: "Project Website & Presentation",
        type: "Video",
        description: "Project overview videos and presentations",
        embedType: "youtube-videos",
        embeds: ["https://www.youtube.com/embed/-3J3_QK8uGU", "https://www.youtube.com/embed/8pErLSnF_OA"],
      },
      {
        title: "Floor Plans",
        type: "PDF",
        description: "Comprehensive floor plan collection",
        embedType: "google-drive",
        embeds: ["https://drive.google.com/embeddedfolderview?id=1XaPgTOJuSNBKiyDaZktJdQm-yJmsHu34#grid"],
      },
      {
        title: "Renderings",
        type: "Images",
        description: "Lifestyle and location photography",
        embedType: "google-drive",
        embeds: ["https://drive.google.com/embeddedfolderview?id=16bYIQzPHPJ-PsqaOZrtJHNJvsh_XNeMu#grid"],
      },
      {
        title: "Marketing Material",
        type: "Documents",
        description: "Social posts, email scripts, and text scripts",
        embedType: "capri-marketing-materials",
        embeds: [
          {
            title: "Social Posts",
            url: "https://drive.google.com/embeddedfolderview?id=1uuFBZIwAsyG_lwF-4-rddUAd0iXkGl4u#grid",
          },
        ],
        emailScripts: [
          {
            subject: "Dive into Coastal Luxury at Treasure Island 🌊",
            content:
              "Hello [Recipient's Name],\n\nImagine waking up to the serene sounds of the coast, right in the heart of Treasure Island. Our exclusive range of 5-bedroom homes seamlessly blends comfort and utility, perfect for both family living and private offices.\n\nNot only will you have the luxury of zero rental and pet restrictions, but you also have the flexibility to live full-time or turn it into a lucrative vacation rental. With a promising projection of nearly $200k annually in rental income, this could be the investment opportunity you've been waiting for.\n\nWith only 7 luxury units across 2 buildings, availability is limited. Don't miss your chance to secure your coastal dream with just a $5k down payment.\n\nReady to explore more? [Link to Project's Page]\n\nWarm Regards,\n[Your Name]\n[Your Contact Information]",
          },
          {
            subject: "Your Treasure Island Townhome Awaits! 🏠",
            content:
              "Hi [Recipient's Name],\n\nHave you ever dreamt of a home that offers both a peaceful retreat and an entrepreneur's haven? Our 3-story townhomes in Treasure Island are designed just for that! Not to mention, each unit boasts a private rooftop deck - the perfect space for evening relaxation or early morning musings.\n\nStarting in the mid $1mm's, these gems are nestled near the coast, offering an unparalleled living experience. Interested? Let's chat!\n\nBest,\n[Your Name]\n[Your Contact Information]",
          },
          {
            subject: "Pets? Rentals? No Restrictions at Treasure Island! 🐾",
            content:
              "Hello [Recipient's Name],\n\nWe understand how vital it is to have a space that caters to all your needs. That's why our Treasure Island homes come with ZERO restrictions on pets and rentals. Whether you have a furry friend or are looking to capitalize on the booming vacation rental market - we've got you covered.\n\nAct fast and secure your unit with just a $5k down payment. Let's turn your dreams into reality!\n\nCheers,\n[Your Name]\n[Your Contact Information]",
          },
          {
            subject: "A Lucrative Investment Opportunity at Treasure Island 🌴",
            content:
              "Hi [Recipient's Name],\n\nLooking to diversify your investment portfolio? Our Treasure Island properties promise not just a luxurious living experience but also an impressive ROI. With potential annual rental income nearing $200k, these units are a haven for savvy investors like you.\n\nKeen to learn more? Let's connect!\n\nWarmest Regards,\n[Your Name]\n[Your Contact Information]",
          },
          {
            subject: "Limited Edition Coastal Living in Treasure Island ⭐",
            content:
              "Hello [Recipient's Name],\n\nWe're thrilled to introduce our limited edition townhomes in Treasure Island. With only 7 luxury units available across 2 unique buildings, these homes are the epitome of exclusivity and elegance.\n\nDon't miss your chance to be a part of this elite community. Reserve your home now with an initial $5k down payment.\n\nEager to know more? Let's talk!\n\nBest Wishes,\n[Your Name]\n[Your Contact Information]",
          },
        ],
        textScripts: [
          "🏠 Dreaming of coastal living? Discover spacious 5-bedroom homes in Treasure Island. Ideal for both private offices and cozy living. Just $5k to hold! Interested? 🌊",
          "🐾 Pet lover? Our Treasure Island townhomes come with ZERO pet restrictions! Secure yours for just $5k down and enjoy your private rooftop deck. 🌅",
          "💼 Work from home or turn it into a vacation rental hotspot. Your Treasure Island townhome can do both! Expected rental income? Nearly $200k/year. Curious? 🌴",
          "🏖️ Treasure awaits in Treasure Island! Luxurious 3-story townhomes, 7 units, 2 buildings. Dive into luxury starting in the mid $1mm's. Reserve yours now! 🌟",
          "💰 Looking for an investment? Our Treasure Island properties are a gem! With potential earnings of almost $200k in rental income, you'll love the ROI. Secure with just $5k down. Interested? ✨",
        ],
      },
    ],
    playlistId: "PLdL-RhpjPdxsEXEBHk5RhJYwAX8NCNiNY",
  },
  "johns-pass": {
    overview: {
      title: "Johns Pass Retreat Overview",
      description:
        "Preconstruction to be built. You have finally found the ULTIMATE vacation rental property! There is truly nothing that compares to a 9 bedroom, 8 bath double rooftop Johns Pass Retreat home with a private pool and hot tub, on a private marina just steps from 100's of shops, bars, restaurants, watersports, fishing charters, floating tiki tours, dolphin excursions, jet ski rentals, parasailing etc and the beach! You can watch the sunrise from one rooftop terrace and sunset over the gulf of Mexico from the other rooftop terrace. Enjoy the sounds of dolphins and manatees swimming directly behind your home which is inside the very first canal in from the gulf of Mexico which provides for an amazing marine sanctuary. You can just hear the guests laughing as they fish and enjoy their time making memories. These 4 exclusive single family homes are built as fortresses with solid concrete poured floors, all masonry construction with metal stud walls and inside sprinkler protection. You have the flexibility to use your home as a primary residence or it can be a vacation rental with no time limit on rental restrictions so you can do nightly, or weekly rentals … whichever you desire.",
      features: [
        "4,595 sq/ft",
        "9 bedrooms",
        "8.5 bathrooms",
        "Private pool",
        "Private roof deck",
        "Located adjacent to John's Pass",
        "Restaurants, bars & shopping",
        "Jet skis, boat tours & more",
        "Easy access to open water",
      ],
    },
    resources: [
      {
        title: "Project Website & Presentation",
        type: "Video",
        description: "Project overview videos and presentations",
        embedType: "youtube-videos",
        embeds: ["https://www.youtube.com/embed/-3J3_QK8uGU", "https://www.youtube.com/embed/8pErLSnF_OA"],
      },
      {
        title: "Floor Plans",
        type: "PDF",
        description: "Comprehensive site and unit plans",
        embedType: "google-drive",
        embeds: ["https://drive.google.com/embeddedfolderview?id=14H_6SN8BeKDgAentVVXoSW-If8isZSa2#grid"],
      },
      {
        title: "Renderings",
        type: "Images",
        description: "Stunning waterfront photography",
        embedType: "google-drive",
        embeds: ["https://drive.google.com/embeddedfolderview?id=1MPMvtNGzVxMoYwuw51h_twj57f1M9Pl6#grid"],
      },
      {
        title: "Marketing Material",
        type: "Documents",
        description: "Social posts, email scripts, and text scripts",
        embedType: "johns-pass-marketing-materials",
        embeds: [
          {
            title: "Social Graphics",
            url: "https://drive.google.com/embeddedfolderview?id=1AkGuJhC8TJDQ7hWys_XovwjAN_erGmm3#grid",
          },
        ],
        emailScripts: [
          {
            subject: "Experience Paradise: Your Ultimate Vacation Rental Awaits! 🌅",
            content:
              "Hello [Recipient Name],\n\nWe're thrilled to present a once-in-a-lifetime opportunity: a brand new 9-bedroom, 8.5-bathroom retreat, located adjacent to the vibrant John's Pass. Imagine waking up to sunrises from one rooftop and witnessing breathtaking sunsets from another. The gentle sounds of dolphins and manatees nearby are the cherry on top of this picturesque setting.\n\nWhy this property stands out:\nSteps away from 100's of shops, exquisite dining, water sports, and the beach.\nTop-notch construction ensuring safety and durability.\nFlexibility to use as a primary residence or high-return vacation rental.\nPotential annual returns approaching $500k, based on third-party projections.\n\nSeize the opportunity to own a piece of paradise. Reach out to get a closer look today!\n\nBest regards,\n[Your Name]",
          },
          {
            subject: "Uncover a Hidden Investment Gem by the Sea 💎",
            content:
              "Hi [Recipient Name],\n\nAre you searching for an investment that combines luxury with outstanding returns? Look no further. Situated just two blocks from Madeira Beach, our latest 9-bedroom property offers an unparalleled experience. Whether it's the convenience of being adjacent to John's Pass or the allure of a private marina, this home has it all.\n\nKey Highlights:\nPrivate pool and rooftop deck.\nProximity to countless recreational activities: jet skis, boat tours, and more.\nA potential annual revenue of up to $500k.\n\nExplore this unmatched investment opportunity today. Let's connect!\n\nWarm regards,\n[Your Name]",
          },
          {
            subject: "Your Dream Home by the Beach is Calling! 🌊",
            content:
              "Dear [Recipient Name],\n\nWe believe we've found the perfect match for your aspirations. An exquisite 9-bedroom, 8.5-bathroom fortress located next to John's Pass, built with precision, care, and an eye for luxury. With a private pool, rooftop deck, and unparalleled sea views, it's a dream come true.\n\nWhat's more?\nNo HOA or Condo dues.\nPotential for substantial returns if you consider renting.\nEasy access to open water and an array of beachside activities.\n\nDon't let this opportunity slip through your fingers. Reach out for a personalized tour.\n\nSincerely,\n[Your Name]",
          },
          {
            subject: "Unlock the Best of Beach Life and Investment Returns 🏖️",
            content:
              "Hello [Recipient Name],\n\nWe've got an exclusive invitation for you. Dive into the life of a 9-bedroom beachside retreat that promises not just a luxurious lifestyle but also enticing returns. Located adjacently to John's Pass, the property stands as a testament to quality, luxury, and potential.\n\nTop Features:\nPrivate pool and roof deck.\nA bustling marina right at your doorstep.\nPotential rental revenues that can touch $500k annually.\n\nExperience it for yourself. Let's schedule a visit!\n\nBest,\n[Your Name]",
          },
          {
            subject: "Rare Investment Alert: Seaside Property with Stellar Returns 🚨",
            content:
              "Hi [Recipient Name],\n\nRarely does an opportunity combine the best of luxury living with substantial investment returns. Presenting a 9-bedroom masterpiece, nestled right by John's Pass, offering both the tranquility of the beach and the vibrancy of the marina.\n\nWhy consider this?\nExceptional construction standards.\nDiverse options for personal use or rental.\nProximity to a world of activities and conveniences.\n\nInterested in learning more? We'd love to provide a deeper dive.\n\nRegards,\n[Your Name]",
          },
        ],
        textScripts: [
          "Ultimate Beachside Retreat Awaits! 🌅 Discover a 9-bedroom paradise right next to John's Pass. Enjoy sunrise, sunset, and a personal marine sanctuary all in one spot. Dive into more details now! 🐬",
          "Looking for an Investment Gem? 💎 A 9BR/8.5BA fortress, steps away from 100's of shops, the beach, & water adventures. Plus, potential earnings of up to $500k/year. Don't miss out!",
          "Live or Invest by the Sea! 🌊 Dreamed of a home with rooftop views, private pool, and direct access to both fun and relaxation? This 4,595 sq/ft marvel adjacent to John's Pass is your answer. Dive in!",
          "Beach Life with Endless Possibilities! 🏖️ Own a 9-bedroom retreat that doubles as a cash cow. From dolphin sightings to jet ski adventures, it's all at your doorstep. Curious? Let's chat!",
          "Investment Alert! 🚨 Exclusive single-family homes by John's Pass. Solid construction, no HOA dues, potential $500k annual returns. Plus, enjoy the vibrant life of the beachside and marina. Want a closer look?",
        ],
      },
    ],
    playlistId: "PLdL-RhpjPdxvX-ekONA6bGJi8t62HYWv6",
  },
  residences: {
    overview: {
      title: "The Residences Overview",
      description:
        "The Residences consists of 27 luxury condo units that all sit on water. Beautiful harbor views surround the 27 balconies that sit on the backside of the building. Located in the heart of Madeira Beach, Florida, The Residences offers everything you could ask for. You can enjoy relaxing in the onsite pool, go hit the beach just 1 block away, or take in the sunset from the roof top cabanas. With only a handful of units remaining, inquire today.",
      features: [
        "5 floors",
        "27 luxury units w/ harbor views",
        "4 spacious floor plans",
        "30 day rentals or full time living",
        "$5k to hold, 20% due after document review, remaining balance due at closing",
      ],
      keyStats: [
        "Brand new and immediately available for move in",
        "High and dry superior construction (never even lost power)",
        "Flexible closing dates available",
      ],
    },
    resources: [
      {
        title: "Project Website & Presentation",
        type: "Video",
        description: "Project overview videos and presentations",
        embedType: "youtube-videos",
        embeds: ["https://www.youtube.com/embed/-3J3_QK8uGU", "https://www.youtube.com/embed/8pErLSnF_OA"],
      },
      {
        title: "Floor Plans",
        type: "PDF",
        description: "Detailed residence layouts",
        embedType: "google-drive",
        embeds: ["https://drive.google.com/embeddedfolderview?id=1Q7OsApI2G6xxsb0mfiGEjK3HIIYQPQJ-#grid"],
      },
      {
        title: "Renderings",
        type: "Images",
        description: "High-end interior and exterior photos",
        embedType: "google-drive",
        embeds: ["https://drive.google.com/embeddedfolderview?id=11SiNMXVfcSlC5cmqikgJfhqELT8XD0vm#grid"],
      },
      {
        title: "Marketing Material",
        type: "Documents",
        description: "Social posts, email scripts, and text scripts",
        embedType: "residences-marketing-materials",
        embeds: [
          {
            title: "Social Graphics",
            url: "https://drive.google.com/embeddedfolderview?id=1m2VVU1W06_XnLiCUa1RfTrcvCoxjIJF5#grid",
          },
        ],
        emailScripts: [
          {
            subject: "Unlock the Best of Florida Living at The Residences 🌴",
            content:
              "Dear [Recipient Name],\n\nWe're thrilled to introduce The Residences, an unparalleled waterfront living experience located in the heart of Madeira Beach, Florida. These luxury condos provide a daily dose of breathtaking harbor views right from your private balcony.\n\nWhy The Residences?\nExclusive 27-unit building with a touch of luxury.\nA choice of 4 spacious floor plans to cater to your unique taste.\nOnsite pool for relaxation, complemented by the beach that's just a block away.\nStunning sunset views from the rooftop cabanas.\n\nWith limited units available, this is an opportunity you won't want to miss. Reserve yours today with just $5k!\n\nBest regards,\n[Your Name]\n[Contact Information]",
          },
          {
            subject: "Dive into Coastal Elegance at The Residences 🌊",
            content:
              "Hello [Recipient Name],\n\nImagine waking up to the gentle sound of waves and stepping out onto your balcony, greeted by a mesmerizing harbor view. This dream can be your reality at The Residences in Madeira Beach, Florida.\n\nFrom flexible 30-day rentals to full-time living, The Residences offer versatility tailored to your lifestyle.\n\nDon't wait. Dive into the best of coastal luxury and make The Residences your new home.\n\nWarmly,\n[Your Name]\n[Contact Information]",
          },
          {
            subject: "Madeira Beach's Best-Kept Secret: The Residences 🌅",
            content:
              "Dear [Recipient Name],\n\nNestled in the heart of Madeira Beach, The Residences promise an unmatched blend of comfort, luxury, and natural beauty. Every condo offers a slice of paradise with panoramic harbor views.\n\nTake advantage of our easy reservation process: $5k to hold, with flexible payment terms thereafter.\n\nReady to elevate your living experience? Let's make it happen.\n\nCheers,\n[Your Name]\n[Contact Information]",
          },
          {
            subject: "Your Waterfront Oasis Awaits at The Residences 🏝️",
            content:
              "Hi [Recipient Name],\n\nHave you ever dreamt of a home where the horizon meets the sea, and luxury meets comfort? The Residences in Madeira Beach bring that dream to life.\n\nWith only a few units left, seize the opportunity to own a part of this coastal haven.\n\nLooking forward to introducing you to a new horizon.\n\nBest,\n[Your Name]\n[Contact Information]",
          },
          {
            subject: "Secure Your Slice of Paradise in Madeira Beach 🌞",
            content:
              "Dear [Recipient Name],\n\nStep into a world where luxury waterfront living meets the charm of Madeira Beach. At The Residences, each day promises stunning harbor views, beach adventures, and tranquil moments by the pool.\n\nWith limited units available, now is the perfect time to take the plunge. Connect with us today and let's turn your coastal dream into reality.\n\nWarm regards,\n[Your Name]\n[Contact Information]",
          },
        ],
        textScripts: [
          "🌊 Dive into luxury with The Residences at Madeira Beach, FL. Just imagine: a waterfront balcony, daily sunsets from rooftop cabanas, and the beach only a block away. Few units left – let's secure your coastal haven today! 🏖️",
          "Dream of waking up to serene harbor views? 🌅 With 27 luxury condos, The Residences in Madeira Beach offers just that – and it's only a short walk to sandy shores! Limited availability; get in touch to find out more.",
          "Ready to elevate your Florida living experience? 🌴 The Residences boasts 4 spacious floor plans, all surrounded by the beauty of Madeira Beach. Reserve with just $5k and indulge in either 30-day rentals or full-time coastal living.",
          "Step into paradise at Madeira Beach's premium condos – The Residences. Enjoy an onsite pool, nearby beach, and stunning harbor views from your own balcony. 🏝️ Secure your spot now before they're all gone!",
          "Life's better on the water! Discover The Residences: 27 exclusive condos with captivating harbor vistas in the heart of Madeira Beach. Act now; only a handful of units remain. Let's make your Florida dream a reality! 🌞",
        ],
      },
    ],
    playlistId: "PLdL-RhpjPdxt_ARsPa7uxfgcv_GhpPtpm",
  },
}

export default function BeachProjectToolkitsPage() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  const renderResourceModal = (resource: any) => {
    if (resource.embedType === "youtube-videos") {
      return (
        <div className="space-y-6">
          {resource.embeds.map((embed: string, index: number) => (
            <div key={index} className="aspect-video">
              <iframe src={embed} className="w-full h-full rounded-lg" allowFullScreen title={`Video ${index + 1}`} />
            </div>
          ))}
        </div>
      )
    }

    if (resource.embedType === "google-drive") {
      return (
        <div className="h-[600px]">
          <iframe src={resource.embeds[0]} className="w-full h-full rounded-lg" title={resource.title} />
        </div>
      )
    }

    if (
      resource.embedType === "capri-marketing-materials" ||
      resource.embedType === "beachmaker-marketing-materials" ||
      resource.embedType === "johns-pass-marketing-materials" ||
      resource.embedType === "residences-marketing-materials"
    ) {
      return (
        <div className="space-y-8">
          {/* Social Posts/Graphics Section */}
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-3 text-lg">
              {resource.embeds[0].title === "Social Posts" ? "Social Posts" : "Social Graphics"}
            </h4>
            <div className="h-[400px]">
              <iframe
                src={resource.embeds[0].url}
                className="w-full h-full rounded-lg"
                title={resource.embeds[0].title}
              />
            </div>
          </div>

          {/* Scripts Section */}
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-4 text-lg">Scripts</h4>
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Scripts
                </TabsTrigger>
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Text Scripts
                </TabsTrigger>
              </TabsList>
              <TabsContent value="email" className="mt-4">
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  {resource.emailScripts?.map((script: any, index: number) => (
                    <Card key={index} className="p-4">
                      <h5 className="font-semibold text-blue-600 mb-2">{script.subject}</h5>
                      <div className="text-sm text-gray-700 whitespace-pre-line bg-gray-50 p-3 rounded">
                        {script.content}
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="text" className="mt-4">
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {resource.textScripts?.map((script: string, index: number) => (
                    <Card key={index} className="p-4">
                      <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{script}</div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )
    }

    if (resource.embedType === "marketing-materials") {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {resource.embeds.map((item: any, index: number) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-lg">{item.title}</h4>
                <div className="h-[400px]">
                  <iframe src={item.url} className="w-full h-full rounded-lg" title={item.title} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return null
  }

  if (selectedProject) {
    const project = beachProjects.find((p) => p.id === selectedProject)
    const content = projectContent[selectedProject as keyof typeof projectContent]

    return (
      <div className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => setSelectedProject(null)}
            className="mb-6 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Beach Projects
          </Button>

          {/* Header */}
          <div className="text-center mb-12">
            <div className={`w-20 h-20 ${project?.color} rounded-3xl flex items-center justify-center mx-auto mb-6`}>
              {project?.icon && <project.icon className="h-10 w-10 text-white" />}
            </div>
            <h1 className="text-4xl font-bold text-black mb-4">{project?.title}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{project?.description}</p>
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue="overview" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Resources
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Marketing Videos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpenCheck className="h-5 w-5" />
                    {content.overview.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {content.overview.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Key Features</h4>
                      <ul className="space-y-2">
                        {content.overview.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold mb-3">Project Details</h4>
                      {selectedProject === "capri" && content.overview.keyStats ? (
                        <div className="space-y-2 text-sm text-gray-600">
                          {content.overview.keyStats.map((stat, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                              <span className="font-medium">{stat}</span>
                            </div>
                          ))}
                        </div>
                      ) : selectedProject === "beachmaker" && content.overview.keyStats ? (
                        <div className="space-y-2 text-sm text-gray-600">
                          {content.overview.keyStats.map((stat, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                              <span className="font-medium">{stat}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Marketing Materials:</span>
                            <span className="font-medium">{content.resources.length} items</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Video Content:</span>
                            <span className="font-medium">Full Playlist</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Project Status:</span>
                            <Badge variant="secondary">Active</Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {content.resources.map((resource, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        {resource.title}
                      </CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{resource.type}</Badge>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm">View</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{resource.title}</DialogTitle>
                            </DialogHeader>
                            {renderResourceModal(resource)}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="videos" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-red-500" />
                    Marketing Video Playlist
                  </CardTitle>
                  <CardDescription>Complete collection of marketing videos for {project?.title}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/videoseries?list=${content.playlistId}`}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                      title="Marketing Video Playlist"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Waves className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">Beach Project Toolkits</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access comprehensive marketing toolkits for our premium beach development projects. Find brochures, floor
            plans, photos, videos, and sales materials for each development.
          </p>
        </div>

        {/* Project Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {beachProjects.map((project) => (
            <Card
              key={project.id}
              className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2"
              onClick={() => setSelectedProject(project.id)}
            >
              <CardContent className="p-8">
                <div className="text-center">
                  <div
                    className={`w-16 h-16 ${project.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <project.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-3 hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{project.description}</p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    View Toolkit
                    <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
