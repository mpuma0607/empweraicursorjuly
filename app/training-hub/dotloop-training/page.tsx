"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  FileText,
  Settings,
  Users,
  PenTool,
  Globe,
  Calendar,
  Plus,
  FileCheck,
  Eye,
  DollarSign,
  UserCheck,
} from "lucide-react"
import Link from "next/link"

const listingLoopSlides = [
  {
    id: 1,
    title: "Starting a Listing Loop",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/listingloop1-sz4aD6AC19ArzH9BUlDSIomnAhxII0.png",
    description: "Steps 1-3: From prepping documents to getting them signed",
  },
  {
    id: 2,
    title: "Pre-Listing Status and Folder Setup",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/listingloop2-7z4D1I3qJIj9jhin9MAMeK7Hjbe4ZX.png",
    description: "Steps 4-5: Choose Pre-Listing status and rename your listing folder",
  },
  {
    id: 3,
    title: "What's in the Listing Loop",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/listingloop3-nBwpefTzFKf9QrytGCUiAPT8Eh5twz.png",
    description: "Overview of Documents, People, and Tasks sections",
  },
  {
    id: 4,
    title: "People and Tasks Overview",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/listingloop4-YPRmyA9Vhfnh6fzWX8K9EVaan4vAgv.png",
    description: "Understanding the people involved and task management in your listing loop",
  },
  {
    id: 5,
    title: "Autofill and Add Details",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/listingloop5-aBrgkdezrxMcLqSrTDU9qKzJdsfGJp.png",
    description: "Using autofill features and adding transaction details",
  },
  {
    id: 6,
    title: "Completing the Documents",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/listingloop6-Elq1rebJtkE5OaJWV2u0J75IaUAoke.png",
    description: "Listing deal sheet, MLS data entry form, and required documentation",
  },
  {
    id: 7,
    title: "Adding Additional Documents",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/listingloop7-X2gHnT0e5w74KUHwLCZ29RyElR7sqi.png",
    description: "How to add addendums, tax records, surveys, and floorplans",
  },
  {
    id: 8,
    title: "Sharing Documents for Signature",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/listingloop9-RiclsuxGTKKeN6kUE747s9OPwDBeyc.png",
    description: "Process for sharing documents and collecting electronic signatures",
  },
  {
    id: 9,
    title: "Submit for Review Process",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/listingloop10-PtI1P0EFC035vztpbLnS94hgVoyULW.png",
    description: "Final submission process and back office notification",
  },
  {
    id: 10,
    title: "Getting Your Listing Online",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/listingloop11-3xHa2ePKn4D11rquNNciPzhUJ2kWSk.png",
    description: "Compliance review, yard signs, photos, and data load-in process",
  },
  {
    id: 11,
    title: "Home Warranty & Thank You Process",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/listingloop12-MdAfcCBVBXd5bPvESQZAEtqkcq0t6I.png",
    description: "Managing home warranty orders and thank you communications",
  },
  {
    id: 12,
    title: "Review Stages Defined",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/listingloop13-9aNQbYBmYh9Rorby1HGeCJxLyKSTpm.png",
    description: "Understanding the different review stages in the dotloop process",
  },
  {
    id: 13,
    title: "Writing Listing Descriptions",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/listingloop14-dsuHIa5Car3MQa0BMt9xjlN6Kk5h7r.png",
    description: "Best practices for creating compelling listing descriptions",
  },
  {
    id: 14,
    title: "Submitting Updates & Changes",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/listingloop15-Dbiov3fj5VLpptAvJN4Yhptm2G20TS.png",
    description: "How to submit open houses, price changes, and status updates",
  },
]

const buyerLoopSlides = [
  {
    id: 1,
    title: "Starting a Contract Loop: Representing the Buyer Side Only",
    image: "/images/buyerloop1.png",
    description: "Steps 1-3: From prepping documents to getting them signed - representing buyer side only",
  },
  {
    id: 2,
    title: "Pre-Offer Status and Contract Folder Setup",
    image: "/images/buyerloop2.png",
    description: "Steps 4-5: Choose Pre-Offer status and rename your contract folder",
  },
  {
    id: 3,
    title: "What's in the Contract Loop",
    image: "/images/buyerloop3.png",
    description: "Overview of Documents, People, and Tasks sections in your contract loop",
  },
  {
    id: 4,
    title: "People and Tasks Management",
    image: "/images/buyerloop4.png",
    description: "Understanding the people involved and task management in your contract loop",
  },
  {
    id: 5,
    title: "Autofill and Add Transaction Details",
    image: "/images/buyerloop5.png",
    description: "Using autofill features and adding detailed transaction information",
  },
  {
    id: 6,
    title: "Completing the Contract Documents",
    image: "/images/buyerloop6.png",
    description: "Contract deal sheet, disclosures, and all required documentation for buyers",
  },
  {
    id: 7,
    title: "Adding Additional Documents and Addendums",
    image: "/images/buyerloop7.png",
    description: "How to add addendums, tax records, and other supporting documents",
  },
  {
    id: 8,
    title: "Sharing Documents for Buyer Signatures",
    image: "/images/buyerloop8.png",
    description: "Process for sharing documents with buyers and collecting electronic signatures",
  },
  {
    id: 9,
    title: "Submit Contract for Review",
    image: "/images/buyerloop9.png",
    description: "Final submission process and back office notification for contract review",
  },
]

const trainingTopics = [
  {
    id: "setup",
    title: "Dotloop Setup",
    icon: Settings,
    description: "Learn how to set up your Dotloop account and configure your workspace for maximum efficiency.",
    content: `
     <h3 class="text-lg font-semibold mb-4">Getting Started with Dotloop Setup</h3>
     
     <div class="mb-6">
       <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-07-12%20085139-lOIONe7IEtqHnmJxFeDlMtIY7MU8JA.png" alt="Dotloop Setup Guide" class="w-full rounded-lg shadow-md" />
     </div>
     
     <div class="mb-6">
       <h4 class="font-medium mb-3">Watch the Complete Setup Tutorial</h4>
       <div class="aspect-video">
         <iframe 
           width="100%" 
           height="100%" 
           src="https://www.youtube.com/embed/rRyL3aHnOtI" 
           title="Dotloop Setup Tutorial" 
           frameborder="0" 
           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
           allowfullscreen
           class="rounded-lg"
         ></iframe>
       </div>
     </div>
     
     <div class="space-y-4">
       <div>
         <h4 class="font-medium mb-2">Account Creation & Configuration</h4>
         <ul class="list-disc pl-6 space-y-1">
           <li>Go to dotloop.com and choose SIGN UP</li>
           <li>Create your account using your @c21be/be3 company email</li>
           <li>Set up your profile with professional information</li>
           <li>Configure notification preferences</li>
           <li>Connect with your brokerage settings</li>
         </ul>
       </div>
       <div>
         <h4 class="font-medium mb-2">Profile Setup</h4>
         <ul class="list-disc pl-6 space-y-1">
           <li>Click on your initials in the upper right corner</li>
           <li>Choose "My Account" from the dropdown</li>
           <li>Complete the Account Settings section</li>
           <li>Complete the Profile Settings</li>
           <li>Change "Default Profile" to your name</li>
         </ul>
       </div>
       <div>
         <h4 class="font-medium mb-2">Mobile App Installation</h4>
         <ul class="list-disc pl-6 space-y-1">
           <li>Download and install Dotloop's mobile app</li>
           <li>Log in with your account credentials</li>
           <li>Enable push notifications for important updates</li>
           <li>Sync your account across all devices</li>
         </ul>
       </div>
       <div>
         <h4 class="font-medium mb-2">Key Features Available</h4>
         <ul class="list-disc pl-6 space-y-1">
           <li>Pre-Built Templates for Listings and Contracts</li>
           <li>Auto-Populating Forms</li>
           <li>Secure e-signing capabilities</li>
           <li>Free Dotloop account for Clients</li>
           <li>Cloud Storage for paperwork, closing statements, inspection reports, etc.</li>
         </ul>
       </div>
     </div>
   `,
    color: "bg-blue-500",
  },
  {
    id: "best-practices",
    title: "Dotloop Best Practices",
    icon: Users,
    description: "Master the essential best practices for using Dotloop effectively in your daily workflow.",
    content: `
     <h3 class="text-lg font-semibold mb-4">Dotloop Best Practices</h3>
     
     <div class="mb-6">
       <h4 class="font-medium mb-3">Best Practices Video Tutorial</h4>
       <div class="aspect-video">
         <iframe 
           width="100%" 
           height="100%" 
           src="https://www.youtube.com/embed/rRyL3aHnOtI" 
           title="Dotloop Best Practices Tutorial" 
           frameborder="0" 
           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
           allowfullscreen
           class="rounded-lg"
         ></iframe>
       </div>
     </div>
     
     <div class="space-y-4">
       <div>
         <h4 class="font-medium mb-2">Organization & Naming Conventions</h4>
         <ul class="list-disc pl-6 space-y-1">
           <li>Use consistent naming for loops and documents</li>
           <li>Create standardized folder structures</li>
           <li>Implement date-based organization systems</li>
           <li>Tag loops with relevant keywords for easy searching</li>
         </ul>
       </div>
       <div>
         <h4 class="font-medium mb-2">Communication Best Practices</h4>
         <ul class="list-disc pl-6 space-y-1">
           <li>Use @mentions to notify specific participants</li>
           <li>Keep all transaction communication within the loop</li>
           <li>Set clear expectations for response times</li>
           <li>Use status updates to keep everyone informed</li>
         </ul>
       </div>
       <div>
         <h4 class="font-medium mb-2">Security & Compliance</h4>
         <ul class="list-disc pl-6 space-y-1">
           <li>Regularly review and update access permissions</li>
           <li>Use secure sharing methods for sensitive documents</li>
           <li>Maintain audit trails for all transactions</li>
           <li>Follow company compliance guidelines</li>
         </ul>
       </div>
     </div>
   `,
    color: "bg-green-500",
  },
  {
    id: "listing-loop",
    title: "Creating A Listing Loop Start To Finish",
    icon: FileText,
    description: "Complete walkthrough of creating and managing a listing loop from initial setup to closing.",
    content: `
     <h3 class="text-lg font-semibold mb-6">Creating A Listing Loop Start To Finish</h3>
     <div class="listing-loop-slideshow">
       <div class="slideshow-container bg-gray-50 rounded-lg p-6">
         <div class="slide-viewer mb-4">
           <img id="current-slide" src="${listingLoopSlides[0].image}" alt="${listingLoopSlides[0].title}" class="w-full h-auto rounded-lg shadow-md" />
         </div>
         
         <div class="slide-info text-center mb-4">
           <h4 id="slide-title" class="text-xl font-semibold mb-2">${listingLoopSlides[0].title}</h4>
           <p id="slide-description" class="text-gray-600">${listingLoopSlides[0].description}</p>
         </div>
         
         <div class="slide-controls flex items-center justify-between mb-4">
           <button id="prev-btn" class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
             <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
             </svg>
             Previous
           </button>
           
           <div class="slide-counter">
             <span id="current-slide-num">1</span> of <span id="total-slides">${listingLoopSlides.length}</span>
           </div>
           
           <button id="next-btn" class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
             Next
             <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
             </svg>
           </button>
         </div>
         
         <div class="slide-thumbnails grid grid-cols-5 gap-2">
           ${listingLoopSlides
             .map(
               (slide, index) => `
             <button class="thumbnail-btn ${index === 0 ? "active" : ""}" data-slide="${index}">
               <img src="${slide.image}" alt="${slide.title}" class="w-full h-16 object-cover rounded border-2 ${index === 0 ? "border-blue-500" : "border-gray-300"} hover:border-blue-400 transition-colors" />
             </button>
           `,
             )
             .join("")}
         </div>
       </div>
     </div>
     
     <script>
       (function() {
         const slides = ${JSON.stringify(listingLoopSlides)};
         let currentSlide = 0;
         
         const currentSlideImg = document.getElementById('current-slide');
         const slideTitle = document.getElementById('slide-title');
         const slideDescription = document.getElementById('slide-description');
         const currentSlideNum = document.getElementById('current-slide-num');
         const prevBtn = document.getElementById('prev-btn');
         const nextBtn = document.getElementById('next-btn');
         const thumbnailBtns = document.querySelectorAll('.thumbnail-btn');
         
         function updateSlide(index) {
           currentSlide = index;
           currentSlideImg.src = slides[index].image;
           currentSlideImg.alt = slides[index].title;
           slideTitle.textContent = slides[index].title;
           slideDescription.textContent = slides[index].description;
           currentSlideNum.textContent = index + 1;
           
           // Update thumbnail active state
           thumbnailBtns.forEach((btn, i) => {
             const img = btn.querySelector('img');
             if (i === index) {
               btn.classList.add('active');
               img.classList.remove('border-gray-300');
               img.classList.add('border-blue-500');
             } else {
               btn.classList.remove('active');
               img.classList.remove('border-blue-500');
               img.classList.add('border-gray-300');
             }
           });
           
           // Update button states
           prevBtn.disabled = index === 0;
           nextBtn.disabled = index === slides.length - 1;
           
           if (prevBtn.disabled) {
             prevBtn.classList.add('opacity-50', 'cursor-not-allowed');
           } else {
             prevBtn.classList.remove('opacity-50', 'cursor-not-allowed');
           }
           
           if (nextBtn.disabled) {
             nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
           } else {
             nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
           }
         }
         
         prevBtn.addEventListener('click', () => {
           if (currentSlide > 0) {
             updateSlide(currentSlide - 1);
           }
         });
         
         nextBtn.addEventListener('click', () => {
           if (currentSlide < slides.length - 1) {
             updateSlide(currentSlide + 1);
           }
         });
         
         thumbnailBtns.forEach((btn, index) => {
           btn.addEventListener('click', () => {
             updateSlide(index);
           });
         });
         
         // Initialize
         updateSlide(0);
       })();
     </script>
     
     <style>
       .listing-loop-slideshow .slide-viewer {
         max-height: 600px;
         overflow: hidden;
       }
       
       .listing-loop-slideshow .slide-controls {
         user-select: none;
       }
       
       .listing-loop-slideshow .thumbnail-btn {
         transition: all 0.2s ease;
       }
       
       .listing-loop-slideshow .thumbnail-btn:hover {
         transform: scale(1.05);
       }
       
       .listing-loop-slideshow .slide-counter {
         font-weight: 500;
         color: #374151;
       }
     </style>
   `,
    color: "bg-purple-500",
  },
  {
    id: "share-signatures",
    title: "How To Share For Signatures",
    icon: PenTool,
    description: "Learn the proper process for sharing documents and collecting electronic signatures.",
    content: `
   <h3 class="text-lg font-semibold mb-4">How To Share For Signatures</h3>
   
   <div class="mb-6">
     <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/listingloop9-1cQukdwVdD3OYvKV2vdV61lHl00rt5.png" alt="Sharing Documents for Signature Guide" class="w-full rounded-lg shadow-md" />
   </div>
   
   <div class="space-y-4">
     <div>
       <h4 class="font-medium mb-2">Step-by-Step Process</h4>
       <ul class="list-disc pl-6 space-y-1">
         <li>From the list of documents, select the documents that require the seller's signature</li>
         <li>Click the <strong>Share</strong> button</li>
         <li>Choose the Sellers and give them the <strong>Can Fill and Sign</strong> signing permission</li>
         <li>Click Share. Let your sellers know you sent them the paperwork to sign</li>
       </ul>
     </div>
     <div>
       <h4 class="font-medium mb-2">Best Practices</h4>
       <ul class="list-disc pl-6 space-y-1">
         <li>Review all documents for completeness and accuracy before sharing</li>
         <li>Set appropriate signing permissions for each party</li>
         <li>Include clear instructions and deadlines in your communication</li>
         <li>Follow up with signers to ensure timely completion</li>
       </ul>
     </div>
   </div>
 `,
    color: "bg-orange-500",
  },
  {
    id: "listing-live",
    title: "How To Get Your Listing Live",
    icon: Globe,
    description: "Step-by-step process for getting your listing active and visible to potential buyers.",
    content: `
   <h3 class="text-lg font-semibold mb-4">How To Get Your Listing Live</h3>
   
   <div class="mb-6">
     <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/listingloop11-BOvFtWzoOBZ3MpZf4nZnsNl11uPR7I.png" alt="Getting Your Listing Online Guide" class="w-full rounded-lg shadow-md" />
   </div>
   
   <div class="mb-6">
     <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/listingloop12-40ZB931YYKjTZS5S32EiLjk0BZ8FLo.png" alt="Listing Live Process Continuation" class="w-full rounded-lg shadow-md" />
   </div>
   
   <div class="space-y-4">
     <div>
       <h4 class="font-medium mb-2">Compliance Review</h4>
       <ul class="list-disc pl-6 space-y-1">
         <li>If a required document is still needed or a signature has been missed, compliance review will notify the agent via dotloop's messenger feature</li>
         <li>Communication using the messenger feature in dotloop keeps all communication within the loop and keeps everyone informed</li>
       </ul>
     </div>
     <div>
       <h4 class="font-medium mb-2">Yard Sign</h4>
       <ul class="list-disc pl-6 space-y-1">
         <li>The coordinators order the yard sign, as applicable, based on the instructions provided on the Listing Deal Sheet</li>
       </ul>
     </div>
     <div>
       <h4 class="font-medium mb-2">Photos</h4>
       <ul class="list-disc pl-6 space-y-1">
         <li>Minimum of 6 photos required</li>
         <li>Email photos to listings@c21be.com or share via Google Drive</li>
         <li>Professional, high-quality photos matter. You'll never get another chance to make a first impression</li>
         <li>Photos can make or break your marketing efforts</li>
       </ul>
     </div>
     <div>
       <h4 class="font-medium mb-2">Data Load-in</h4>
       <ul class="list-disc pl-6 space-y-1">
         <li>The back office loads the listings on multiple platforms including MLS and C21.com</li>
         <li>These websites feed to Zillow, Realtor.com plus 170+ others</li>
       </ul>
     </div>
     <div>
       <h4 class="font-medium mb-2">Home Warranty</h4>
       <ul class="list-disc pl-6 space-y-1">
         <li>If the sellers have opted to purchase home warranty coverage from our preferred partner, Global Home USA, the back office will place the order</li>
         <li>If agents opt to use another home warranty vendor, the agents are responsible for placing the orders themselves</li>
       </ul>
     </div>
     <div>
       <h4 class="font-medium mb-2">Thank You Letter & Live Notification</h4>
       <ul class="list-disc pl-6 space-y-1">
         <li>The back office emails a "Thank You for the Listing" note, along with a copy of the broker-accepted listing agreement, to the seller and the agent</li>
         <li>The back office emails a "Listing is Live" notice, along with a copy of the MLS Detail, to the agent and staff</li>
       </ul>
     </div>
   </div>
 `,
    color: "bg-cyan-500",
  },
  {
    id: "listing-descriptions",
    title: "Writing Listing Descriptions",
    icon: FileText,
    description: "Master the art of writing compelling listing descriptions that attract buyers.",
    content: `
   <h3 class="text-lg font-semibold mb-4">Writing Listing Descriptions</h3>
   
   <div class="mb-6">
     <a href="/ai-hub/listit-ai" target="_blank" class="block hover:opacity-90 transition-opacity">
       <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/listingloop14-N0PLHJMYqnsFGGY06XTjSX3SDsrCaU.png" alt="Writing Listing Descriptions Guide - Click to use ListIt AI tool" class="w-full rounded-lg shadow-md cursor-pointer" />
     </a>
   </div>
   
   <div class="space-y-4">
     <div>
       <h4 class="font-medium mb-2">Key Principles for Effective Listing Descriptions</h4>
       <ul class="list-disc pl-6 space-y-1">
         <li><strong>Brand your listing with a One-Sentence Title</strong> - Find the "WOW" factor</li>
         <li><strong>Point Out the Home's Best Features</strong> - Your notes from your pre-listing preview will be your best description as the sellers know all the best features</li>
         <li><strong>Focus on the Benefits and Not Just the Features</strong> - Instead of telling your audience the listing has a big backyard, tell them how much fun they could have with their family playing touch football in the yard or how much privacy it offers</li>
         <li><strong>Pitch the Benefits of the Location and Neighborhood</strong></li>
         <li><strong>Finish With Caveats That Are Important for the Buyer to Know</strong> - When in doubt, disclose</li>
       </ul>
     </div>
     <div>
       <h4 class="font-medium mb-2">Writing Best Practices</h4>
       <ul class="list-disc pl-6 space-y-1">
         <li><strong>Concise and Precise</strong> - Keep it short and simple and let the photos do the talking</li>
         <li><strong>Use Grammarly</strong> to check for grammar and spelling mistakes. It's not perfect, but Grammarly is free and will find grammar and spelling mistakes you might miss</li>
         <li><strong>Chat GPT</strong> is also an option to help with the listing descriptions</li>
       </ul>
     </div>
     <div>
       <h4 class="font-medium mb-2">Automated Solution</h4>
       <p class="text-gray-600 mb-3">
         To automatically generate your listing description, <a href="/ai-hub/listit-ai" class="text-blue-600 hover:text-blue-800 underline font-medium">click here to use our ListIt AI tool</a>.
       </p>
     </div>
   </div>
 `,
    color: "bg-indigo-500",
  },
  {
    id: "schedule-events",
    title: "How To Schedule Open House, Price change etc.",
    icon: Calendar,
    description: "Learn to schedule and manage listing events, price changes, and important milestones.",
    content: `
   <h3 class="text-lg font-semibold mb-4">How To Schedule Open House, Price Changes, etc.</h3>
   
   <div class="mb-6">
     <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/listingloop15-5CaGowMdo0W8EjolYKAW3jjXglDJ5J.png" alt="Submitting Open Houses, Price Changes and Status Updates Guide" class="w-full rounded-lg shadow-md" />
   </div>
   
   <div class="space-y-4">
     <div>
       <h4 class="font-medium mb-2">LISTINGS@c21be.com</h4>
       <ul class="list-disc pl-6 space-y-1">
         <li>Use this email to communicate with our Listings team for anything related to your listings that cannot be submitted through dotloop</li>
       </ul>
     </div>
     <div>
       <h4 class="font-medium mb-2">Open Houses Requests</h4>
       <ul class="list-disc pl-6 space-y-1">
         <li>Email your open house request to Listings@c21be.com at least 2 days prior to the open house</li>
         <li>Include the property address, date, and time of the open house in your email</li>
       </ul>
     </div>
     <div>
       <h4 class="font-medium mb-2">Price, Status, or Other Changes</h4>
       <ul class="list-disc pl-6 space-y-1">
         <li>Changes to the original listing agreement, such as a change to the listing price or an expiration date, will <strong>require the seller's written authorization</strong></li>
         <li>Signed MLS Listing Status Change Forms or emails directly from the Seller are acceptable for changes to be made</li>
         <li>When additional documents or status changes are added to the file in dotloop, remember to hit the <strong>Submit for Review</strong> button to let the back office know something is needed</li>
       </ul>
     </div>
   </div>
 `,
    color: "bg-pink-500",
  },
  {
    id: "addendums",
    title: "How To Add Addendums",
    icon: Plus,
    description: "Process for creating, adding, and managing contract addendums and amendments.",
    content: `
   <h3 class="text-lg font-semibold mb-4">How To Add Addendums</h3>
   
   <div class="mb-6">
     <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/listingloop7-wPMXX2aIslWvsQtYIQmf4YlV4k3uyZ.png" alt="Adding Additional Documents: Addendums, Tax Records, Surveys, Floorplans Guide" class="w-full rounded-lg shadow-md" />
   </div>
   
   <div class="space-y-4">
     <div>
       <h4 class="font-medium mb-2">Adding Addendums Process</h4>
       <ul class="list-disc pl-6 space-y-1">
         <li>At times, you'll need to add an addendum, like a Pre-1978 Lead-Based Paint Addendum or Homeowners Association Addendum or some other addendum that is specific to your listing and that will be needed when you go to contract</li>
         <li>Go back to your list of documents</li>
         <li>To add an addendum, click <strong>Add Document</strong></li>
         <li>Choose <strong>Templates</strong></li>
         <li>Locate the addendums in either the All Documents folder</li>
         <li>Open the folder, type the name of the addendum you're looking for in the Search Bar, check the box next to the addendum once located, and click Copy</li>
         <li>Auto-Fill and complete the addendums. The coordinators will add the addendums as attachments to the listing in MLS, making it convenient for the buyer's agent to gather the property disclosures and addendums that will be required at time of contract</li>
       </ul>
     </div>
     <div>
       <h4 class="font-medium mb-2">Property Tax Record</h4>
       <ul class="list-disc pl-6 space-y-1">
         <li>This can be found in RealList or in Public Records from MLS or from the county's property appraiser's website. Once located, download and save as a pdf. Click on the Add Document button and choose Browse. Navigate to where the pdf is saved on your computer and add this to your loop. Drag and drop over the Tax Record placeholder in the list of documents</li>
       </ul>
     </div>
     <div>
       <h4 class="font-medium mb-2">Additional Documents</h4>
       <ul class="list-disc pl-6 space-y-1">
         <li>Add the survey, floor plans, list of items included, special features, elevations or anything like this that will help the sale. The coordinators will add these as attachments to the listing in MLS</li>
       </ul>
     </div>
   </div>
 `,
    color: "bg-teal-500",
  },
  {
    id: "contract-review",
    title: "How To Submit Contract For Review",
    icon: FileCheck,
    description: "Proper procedures for submitting contracts for legal and broker review.",
    content: `
   <h3 class="text-lg font-semibold mb-4">How To Submit Contract For Review</h3>
   
   <div class="mb-6">
     <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/listingloop10-pQHk1GeEyi6Po9urpAD3Y2RZtbk06x.png" alt="Submit For Review Guide" class="w-full rounded-lg shadow-md" />
   </div>
   
   <div class="space-y-4">
     <div>
       <h4 class="font-medium mb-2">Submitting For Review</h4>
       <p class="text-gray-600 mb-3">Notifies the Back Office there's a New Listing ready for review</p>
       <ul class="list-disc pl-6 space-y-1">
         <li>Once the documents have been completed and fully executed, the next step is to <strong>Submit the Listing For Review</strong></li>
         <li>Click the Submit For Review button</li>
         <li><strong>Check the box to the left of the Listing Folder name (if not already) and choose Listings@c21be.com. Add a note for the Admins if needed</strong></li>
         <li>Click Submit. The Back Office is notified that there is a new listing ready for review and processing</li>
         <li><strong>Remember to email the property photos to photos@c21be.com</strong></li>
       </ul>
     </div>
   </div>
 `,
    color: "bg-emerald-500",
  },
  {
    id: "review-stages",
    title: "Review Stages Defined",
    icon: Eye,
    description: "Understanding the different review stages and what happens at each step.",
    content: `
   <h3 class="text-lg font-semibold mb-4">Review Stages Defined</h3>
   
   <div class="mb-6">
     <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/listingloop13-36PSG1rJMUU1hGaikapLfWXJvPdv0D.png" alt="Review Stages Defined Guide" class="w-full rounded-lg shadow-md" />
   </div>
   
   <div class="space-y-4">
     <div>
       <h4 class="font-medium mb-2">Initial Review</h4>
       <ul class="list-disc pl-6 space-y-1">
         <li>Notifies the back office of the new listing</li>
         <li>Document completeness verification</li>
         <li>Basic compliance and format checking</li>
         <li>Identification of missing information</li>
       </ul>
     </div>
     <div>
       <h4 class="font-medium mb-2">Compliance Review</h4>
       <ul class="list-disc pl-6 space-y-1">
         <li>Coordinators confirm and verify that the documents are complete</li>
         <li>Legal compliance verification</li>
         <li>Risk assessment and mitigation</li>
       </ul>
     </div>
     <div>
       <h4 class="font-medium mb-2">Returned for Corrections</h4>
       <ul class="list-disc pl-6 space-y-1">
         <li>Something is missing or incomplete. Coordinators use dotloop's messenger to notify the agent of what's needed to complete the file in order to get the listing online</li>
         <li>When communicating via dotloop's messenger, the agents also receive an email notification to their company email</li>
       </ul>
     </div>
     <div>
       <h4 class="font-medium mb-2">Re-Submitted</h4>
       <ul class="list-disc pl-6 space-y-1">
         <li>Originally an incomplete document that now has been completed and submitted for review again</li>
       </ul>
     </div>
     <div>
       <h4 class="font-medium mb-2">Additional Documents Submitted</h4>
       <ul class="list-disc pl-6 space-y-1">
         <li>After the initial submission of the loop, any documents added to the loop thereafter and submitted for review</li>
       </ul>
     </div>
     <div>
       <h4 class="font-medium mb-2">Approved</h4>
       <ul class="list-disc pl-6 space-y-1">
         <li>All documents in the loop are complete</li>
         <li>Final compliance confirmation</li>
         <li>Authorization for transaction progression</li>
       </ul>
     </div>
     <div>
       <h4 class="font-medium mb-2">Not Reviewed</h4>
       <ul class="list-disc pl-6 space-y-1">
         <li>Used by the back office if a listing cancels and the loop needs no further action</li>
       </ul>
     </div>
   </div>
 `,
    color: "bg-violet-500",
  },
  {
    id: "paid-closing",
    title: "How To get Paid At Closing",
    icon: DollarSign,
    description: "Essential steps to ensure proper commission payment and closing coordination.",
    content: `
   <h3 class="text-lg font-semibold mb-4">How To Get Paid At Closing</h3>
   
   <div class="mb-6">
     <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pac1-XY7JnrTEdyP8jhsiVuFuoa0g8a5IXv.png" alt="Setting Up Paid At Closing (Disbursement Authorization) Guide" class="w-full rounded-lg shadow-md" />
   </div>
   
   <div class="mb-6">
     <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pac2-b8B3N02dz59F3ULLjm81IEhsS4Zi7L.png" alt="Paid At Closing Process Steps" class="w-full rounded-lg shadow-md" />
   </div>
   
   <div class="space-y-4">
     <div>
       <h4 class="font-medium mb-2">Setting Up Paid At Closing (Disbursement Authorization)</h4>
       <ul class="list-disc pl-6 space-y-1">
         <li>Use the Paid At Closing form found in dotloop to request to be Paid at Closing</li>
         <li>The completed form will be emailed to the title agent and the agent the day before closing by our Closings Team</li>
         <li>Open your file in dotloop</li>
         <li>Confirm that your documents are in an <strong>Approved</strong> status. If a document is missing or incomplete, complete what's needed and submit to our contracts team for review</li>
         <li>All documents in the file must be <strong>approved</strong> in order for the PAC to be processed</li>
       </ul>
     </div>
     <div>
       <h4 class="font-medium mb-2">Step-by-Step Process</h4>
       <ul class="list-disc pl-6 space-y-1">
         <li>Click <strong>Add Folder</strong></li>
         <li>Click <strong>Add Template</strong></li>
         <li>Click the <strong>All Documents</strong> folder</li>
         <li>In the search bar, type the word <strong>PAID</strong> and hit enter</li>
         <li>Check the box to the left of the <strong>Paid at Closing</strong></li>
         <li>Click <strong>Copy</strong></li>
         <li>Open and <strong>complete</strong> the Paid at Closing form</li>
         <li>Click <strong>Save</strong></li>
         <li>Click the box to the left of the <strong>Paid at Closing folder</strong></li>
         <li>Click <strong>Submit for Review</strong> and choose <strong>PaidAtClosing@c21be.com</strong></li>
         <li>Click <strong>Submit</strong></li>
       </ul>
     </div>
     <div>
       <h4 class="font-medium mb-2">Important Details</h4>
       <ul class="list-disc pl-6 space-y-1">
         <li>Confirm the closing date under the loop name is correct</li>
         <li>When the Paid at Closing is submitted for review, the closings team will be notified that there is a new PAC request</li>
         <li>The closings team will confirm that the file is complete and all documents have been reviewed and approved</li>
         <li>The closings team will check the listing and/or contract deal sheets for referrals, notes, MLS Fees, and Transaction Fees</li>
         <li>The closings team will complete the Paid at Closing form and email the title agent. The agent will be copied in so they know that the request has been completed</li>
         <li><strong>Please note:</strong> Paid at Closing requests are processed 1-2 days prior to closing. Less chance of errors this way</li>
         <li>Questions... email closings@c21be.com</li>
       </ul>
     </div>
   </div>
 `,
    color: "bg-yellow-500",
  },
  {
    id: "buyer-loop",
    title: "Creating A Buyer Loop Start to Finish",
    icon: UserCheck,
    description: "Complete guide to creating and managing buyer loops from consultation to closing.",
    content: `
     <h3 class="text-lg font-semibold mb-6">Creating A Buyer Loop Start to Finish</h3>
     <div class="buyer-loop-slideshow">
       <div class="slideshow-container bg-gray-50 rounded-lg p-6">
         <div class="slide-viewer mb-4">
           <img id="buyer-current-slide" src="${buyerLoopSlides[0].image}" alt="${buyerLoopSlides[0].title}" class="w-full h-auto rounded-lg shadow-md" />
         </div>
         
         <div class="slide-info text-center mb-4">
           <h4 id="buyer-slide-title" class="text-xl font-semibold mb-2">${buyerLoopSlides[0].title}</h4>
           <p id="buyer-slide-description" class="text-gray-600">${buyerLoopSlides[0].description}</p>
         </div>
         
         <div class="slide-controls flex items-center justify-between mb-4">
           <button id="buyer-prev-btn" class="flex items-center px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors">
             <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
             </svg>
             Previous
           </button>
           
           <div class="slide-counter">
             <span id="buyer-current-slide-num">1</span> of <span id="buyer-total-slides">${buyerLoopSlides.length}</span>
           </div>
           
           <button id="buyer-next-btn" class="flex items-center px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors">
             Next
             <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
             </svg>
           </button>
         </div>
         
         <div class="slide-thumbnails grid grid-cols-5 gap-2">
           ${buyerLoopSlides
             .map(
               (slide, index) => `
             <button class="buyer-thumbnail-btn ${index === 0 ? "active" : ""}" data-slide="${index}">
               <img src="${slide.image}" alt="${slide.title}" class="w-full h-16 object-cover rounded border-2 ${index === 0 ? "border-rose-500" : "border-gray-300"} hover:border-rose-400 transition-colors" />
             </button>
           `,
             )
             .join("")}
         </div>
       </div>
     </div>
     
     <script>
       (function() {
         const buyerSlides = ${JSON.stringify(buyerLoopSlides)};
         let currentBuyerSlide = 0;
         
         const currentSlideImg = document.getElementById('buyer-current-slide');
         const slideTitle = document.getElementById('buyer-slide-title');
         const slideDescription = document.getElementById('buyer-slide-description');
         const currentSlideNum = document.getElementById('buyer-current-slide-num');
         const prevBtn = document.getElementById('buyer-prev-btn');
         const nextBtn = document.getElementById('buyer-next-btn');
         const thumbnailBtns = document.querySelectorAll('.buyer-thumbnail-btn');
         
         function updateBuyerSlide(index) {
           currentBuyerSlide = index;
           currentSlideImg.src = buyerSlides[index].image;
           currentSlideImg.alt = buyerSlides[index].title;
           slideTitle.textContent = buyerSlides[index].title;
           slideDescription.textContent = buyerSlides[index].description;
           currentSlideNum.textContent = index + 1;
           
           // Update thumbnail active state
           thumbnailBtns.forEach((btn, i) => {
             const img = btn.querySelector('img');
             if (i === index) {
               btn.classList.add('active');
               img.classList.remove('border-gray-300');
               img.classList.add('border-rose-500');
             } else {
               btn.classList.remove('active');
               img.classList.remove('border-rose-500');
               img.classList.add('border-gray-300');
             }
           });
           
           // Update button states
           prevBtn.disabled = index === 0;
           nextBtn.disabled = index === buyerSlides.length - 1;
           
           if (prevBtn.disabled) {
             prevBtn.classList.add('opacity-50', 'cursor-not-allowed');
           } else {
             prevBtn.classList.remove('opacity-50', 'cursor-not-allowed');
           }
           
           if (nextBtn.disabled) {
             nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
           } else {
             nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
           }
         }
         
         prevBtn.addEventListener('click', () => {
           if (currentBuyerSlide > 0) {
             updateBuyerSlide(currentBuyerSlide - 1);
           }
         });
         
         nextBtn.addEventListener('click', () => {
           if (currentBuyerSlide < buyerSlides.length - 1) {
             updateBuyerSlide(currentBuyerSlide + 1);
           }
         });
         
         thumbnailBtns.forEach((btn, index) => {
           btn.addEventListener('click', () => {
             updateBuyerSlide(index);
           });
         });
         
         // Initialize
         updateBuyerSlide(0);
       })();
     </script>
     
     <style>
       .buyer-loop-slideshow .slide-viewer {
         max-height: 600px;
         overflow: hidden;
       }
       
       .buyer-loop-slideshow .slide-controls {
         user-select: none;
       }
       
       .buyer-loop-slideshow .buyer-thumbnail-btn {
         transition: all 0.2s ease;
       }
       
       .buyer-loop-slideshow .buyer-thumbnail-btn:hover {
         transform: scale(1.05);
       }
       
       .buyer-loop-slideshow .slide-counter {
         font-weight: 500;
         color: #374151;
       }
     </style>
   `,
    color: "bg-rose-500",
  },
]

export default function DotloopTrainingPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/training-hub" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Training Hub
          </Link>
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FileText className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-black mb-4">Dotloop Training</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master Dotloop with comprehensive training on every aspect of the platform, from setup to closing.
            </p>
          </div>
        </div>

        {/* Training Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {trainingTopics.map((topic) => (
            <Dialog key={topic.id}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 group">
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-12 h-12 ${topic.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <topic.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold text-black group-hover:text-blue-600 transition-colors">
                      {topic.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 text-sm leading-relaxed text-center">{topic.description}</p>
                    <div className="mt-4 text-center">
                      <Badge variant="outline" className="text-blue-600 border-blue-200">
                        Click to Learn
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3 text-2xl">
                    <div className={`w-8 h-8 ${topic.color} rounded-lg flex items-center justify-center`}>
                      <topic.icon className="h-4 w-4 text-white" />
                    </div>
                    {topic.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="prose prose-gray max-w-none mt-6" dangerouslySetInnerHTML={{ __html: topic.content }} />
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto border-0 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-black mb-4">Need Additional Help?</h3>
              <p className="text-gray-600 mb-6">
                If you need personalized assistance with Dotloop or have specific questions about your transactions, our
                support team is here to help.
              </p>
              <Link href="/support">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">Contact Support</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
