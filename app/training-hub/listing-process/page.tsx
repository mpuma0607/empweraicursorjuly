"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Home,
  Users,
  Search,
  DollarSign,
  Presentation,
  Target,
  PlayCircle,
  BookOpen,
  FileText,
  ArrowLeft,
  Download,
  Volume2,
  UserCheck,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const listingSteps = [
  {
    id: "practice",
    title: "Practice",
    description: "Master your listing scripts and presentation skills",
    icon: Users,
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    textColor: "text-blue-600",
    borderColor: "border-blue-200",
    bgColor: "bg-blue-50",
  },
  {
    id: "prospect",
    title: "Prospect",
    description: "Identify and connect with potential sellers",
    icon: Search,
    color: "bg-gradient-to-br from-green-500 to-green-600",
    textColor: "text-green-600",
    borderColor: "border-green-200",
    bgColor: "bg-green-50",
  },
  {
    id: "prequal",
    title: "Prequal",
    description: "Prequalify sellers and determine their motivation and timeline",
    icon: UserCheck,
    color: "bg-gradient-to-br from-yellow-500 to-yellow-600",
    textColor: "text-yellow-600",
    borderColor: "border-yellow-200",
    bgColor: "bg-yellow-50",
  },
  {
    id: "preview",
    title: "Preview",
    description: "Conduct thorough property evaluations and market analysis",
    icon: Home,
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
    textColor: "text-purple-600",
    borderColor: "border-purple-200",
    bgColor: "bg-purple-50",
  },
  {
    id: "price",
    title: "Price",
    description: "Determine optimal pricing strategy and market positioning",
    icon: DollarSign,
    color: "bg-gradient-to-br from-orange-500 to-orange-600",
    textColor: "text-orange-600",
    borderColor: "border-orange-200",
    bgColor: "bg-orange-50",
  },
  {
    id: "present",
    title: "Present",
    description: "Deliver compelling listing presentations that win listings",
    icon: Presentation,
    color: "bg-gradient-to-br from-red-500 to-red-600",
    textColor: "text-red-600",
    borderColor: "border-red-200",
    bgColor: "bg-red-50",
  },
  {
    id: "position",
    title: "Position",
    description: "Secure listing agreements and set proper expectations",
    icon: Target,
    color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
    textColor: "text-indigo-600",
    borderColor: "border-indigo-200",
    bgColor: "bg-indigo-50",
  },
]

export default function ListingProcessPage() {
  const getStepContent = (stepId: string) => {
    switch (stepId) {
      case "practice":
        return {
          overview: (
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Internalizing the words is vital so that you can focus on connection and not what to say. The best way
                to accomplish this is by practicing. Watch the video below that provides advice on how to practice and
                download the scripts and practice, practice, practice.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-700 mb-2">Practice Tips:</h4>
                <ul className="list-disc pl-5 space-y-1 text-blue-700">
                  <li>Practice scripts until they become second nature</li>
                  <li>Role play with colleagues to build confidence</li>
                  <li>Record yourself and listen for areas of improvement</li>
                  <li>Focus on tone, pace, and natural delivery</li>
                </ul>
              </div>
            </div>
          ),
          videoLessons: (
            <div className="space-y-6">
              <div className="aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/BDOnxUdsDco"
                  title="Listing Script Practice Techniques"
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-700 mb-2">Key Takeaways:</h4>
                <ul className="list-disc pl-5 space-y-1 text-blue-700">
                  <li>Effective practice techniques for listing scripts</li>
                  <li>How to sound natural while using prepared scripts</li>
                  <li>Building confidence through repetition</li>
                  <li>Adapting scripts to your personal style</li>
                </ul>
              </div>
            </div>
          ),
          scripts: (
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-blue-700">Listing Prequalification Script</h3>
                  <div className="flex space-x-2">
                    <a
                      href="/audio/listing-prequal-script.mp3"
                      download
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <Volume2 className="h-4 w-4 mr-1" />
                      Listen
                    </a>
                    <a href="#" download className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </a>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Listing%20Prequal%20Script-tDiSNvWma5LsFRuKjPGeYapeUHBpqK.png"
                    alt="Listing Prequalification Script"
                    width={800}
                    height={1000}
                    className="w-full object-contain"
                  />
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Listing%20Prequal%20Script%20PG%202-KyWiYjyzjs5YEkZDciL9JcO6KPa4GL.png"
                    alt="Listing Prequalification Script Continued"
                    width={800}
                    height={1000}
                    className="w-full object-contain"
                  />
                </div>
                <audio className="w-full mt-2" controls>
                  <source
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8.%20Listing%20Prequalification%20Script%20-BBJpKEIRghRmYaK6LmlLwcNb2TDn2K.mp3"
                    type="audio/mpeg"
                  />
                  Your browser does not support the audio element.
                </audio>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-blue-700">Listing Presentation Script</h3>
                  <div className="flex space-x-2">
                    <a
                      href="/audio/listing-presentation-script.mp3"
                      download
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <Volume2 className="h-4 w-4 mr-1" />
                      Listen
                    </a>
                    <a href="#" download className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </a>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Listing%20Presentation%20Script-FdNsX7EK2IZrmIaZml3gd7JG4rwBDv.png"
                    alt="Listing Presentation Script"
                    width={800}
                    height={1000}
                    className="w-full object-contain"
                  />
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Listing%20Presentation%20cont-TzKJh7BbR4gwJv29QV3Jv0rDNa7AjC.png"
                    alt="Listing Presentation Script Continued"
                    width={800}
                    height={1000}
                    className="w-full object-contain"
                  />
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Listing%20Presentation%20pg%203-4qRBV4KcfmfrN6AxVbNVTIckqS24UH.png"
                    alt="Listing Presentation Script Page 3"
                    width={800}
                    height={1000}
                    className="w-full object-contain"
                  />
                </div>
                <audio className="w-full mt-2" controls>
                  <source
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9.%20Listing%20Presentation%20Script-gAlQbch7GC14TQkaqdqVKRxfGtRzsM.mp3"
                    type="audio/mpeg"
                  />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          ),
        }
      case "prospect":
        return {
          overview: (
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                This business is simple, not easy. Bottom line; you need to talk to people. WHO you talk to is up to
                you. But you need to pick a lane and focus on it. Become an expert in that niche and follow up, follow
                up, follow up. To dive deeper into some common lanes click the button below.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-700 mb-2">Prospecting Success Principles:</h4>
                <ul className="list-disc pl-5 space-y-1 text-green-700">
                  <li>Choose your niche and become the expert in that area</li>
                  <li>Consistency is key - make prospecting a daily habit</li>
                  <li>Follow up relentlessly - most deals are made in the follow-up</li>
                  <li>Track your activities and measure your results</li>
                  <li>Focus on building relationships, not just making calls</li>
                </ul>
              </div>
            </div>
          ),
          videoLessons: (
            <div className="space-y-6">
              <div className="aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/qLpEbWPlJOc"
                  title="Prospecting Strategies for Listing Success"
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-700 mb-2">Key Takeaways:</h4>
                <ul className="list-disc pl-5 space-y-1 text-green-700">
                  <li>Different prospecting lanes and how to choose your focus</li>
                  <li>Effective follow-up strategies that convert prospects</li>
                  <li>Building expertise in your chosen niche market</li>
                  <li>Time management and prospecting consistency</li>
                  <li>Overcoming common prospecting challenges</li>
                </ul>
              </div>
            </div>
          ),
        }
      case "prequal":
        return {
          overview: (
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                If they can't answer these 3 simple questions, they are not 100% ready. That doesn't mean they are not
                worth spending time with. But, it's important to know what stage they are in and the timeline so that
                you can make strategic business decisions. Here are the three questions:
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-700 mb-3">The 3 Critical Prequalification Questions:</h4>
                <ol className="list-decimal pl-5 space-y-2 text-yellow-700">
                  <li className="font-medium">Do they HAVE to sell?</li>
                  <li className="font-medium">Do they know where they want to move to?</li>
                  <li className="font-medium">Do they have a timeframe that they want to be there?</li>
                </ol>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-700 mb-2">Why These Questions Matter:</h4>
                <ul className="list-disc pl-5 space-y-1 text-yellow-700">
                  <li>Helps you prioritize your time and energy effectively</li>
                  <li>Allows you to make strategic business decisions</li>
                  <li>Identifies the seller's stage in the process</li>
                  <li>Determines appropriate follow-up timeline and strategy</li>
                </ul>
              </div>
            </div>
          ),
          videoLessons: (
            <div className="space-y-6">
              <div className="aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/XY_DIa-Xqi4"
                  title="Seller Prequalification Strategies"
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-700 mb-2">Key Takeaways:</h4>
                <ul className="list-disc pl-5 space-y-1 text-yellow-700">
                  <li>How to ask the right qualifying questions</li>
                  <li>Identifying motivated vs. unmotivated sellers</li>
                  <li>Strategic time management for maximum ROI</li>
                  <li>Building rapport while gathering critical information</li>
                  <li>Setting appropriate expectations based on seller readiness</li>
                </ul>
              </div>
            </div>
          ),
          scripts: (
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-yellow-700">Listing Prequalification Script</h3>
                  <div className="flex space-x-2">
                    <a
                      href="/audio/listing-prequal-script.mp3"
                      download
                      className="flex items-center text-sm text-yellow-600 hover:text-yellow-800"
                    >
                      <Volume2 className="h-4 w-4 mr-1" />
                      Listen
                    </a>
                    <a href="#" download className="flex items-center text-sm text-yellow-600 hover:text-yellow-800">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </a>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Listing%20Prequal%20Script-rStnY43juF771njua7wbXlZd5OdcSh.png"
                    alt="Listing Prequalification Script"
                    width={800}
                    height={1000}
                    className="w-full object-contain"
                  />
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Listing%20Prequal%20Script%20PG%202-9rIFCYVXpLtBpsj9ioa0yo6J7tf5YA.png"
                    alt="Listing Prequalification Script Continued"
                    width={800}
                    height={1000}
                    className="w-full object-contain"
                  />
                </div>
                <audio className="w-full mt-2" controls>
                  <source
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8.%20Listing%20Prequalification%20Script%20-sQ29VVwBgHTtCRbpXPHWuQZaxPBXHF.mp3"
                    type="audio/mpeg"
                  />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          ),
        }
      case "preview":
        return {
          videoLessons: (
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-purple-700">Property Preview Walkthrough</h3>
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/Bp-0CmCUMc0"
                    title="Property Preview Walkthrough"
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-700 mb-2">Key Takeaways:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-purple-700">
                    <li>How to conduct a thorough property evaluation</li>
                    <li>What to look for during the initial property preview</li>
                    <li>Identifying key selling points and potential concerns</li>
                    <li>Gathering essential information for pricing and marketing</li>
                    <li>Effective communication with sellers during the preview</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-purple-700">Competitive Market Analysis</h3>
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/vecmMHVPa4Q"
                    title="Competitive Market Analysis"
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-700 mb-2">Key Takeaways:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-purple-700">
                    <li>Analyzing comparable properties in the market</li>
                    <li>Understanding market trends and conditions</li>
                    <li>Evaluating competition and positioning strategies</li>
                    <li>Preparing data for the pricing conversation</li>
                    <li>Presenting market analysis to sellers effectively</li>
                  </ul>
                </div>
              </div>
            </div>
          ),
          resources: (
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-purple-700">11 Questions to Ask Your Realtor</h3>
                  <div className="flex space-x-2">
                    <a href="#" download className="flex items-center text-sm text-purple-600 hover:text-purple-800">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </a>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-purple-50 p-4 border-b border-gray-200">
                    <p className="text-purple-700 font-medium">
                      Essential questions to differentiate yourself from other agents and demonstrate your expertise
                    </p>
                  </div>
                  <div className="p-4">
                    <Image
                      src="/placeholder.svg?height=1100&width=800&text=11+Questions+to+Ask+Your+Realtor"
                      alt="11 Questions to Ask Your Realtor - Page 1"
                      width={800}
                      height={1100}
                      className="w-full object-contain mb-4"
                    />
                    <Image
                      src="/placeholder.svg?height=1100&width=800&text=11+Questions+to+Ask+Your+Realtor+Page+2"
                      alt="11 Questions to Ask Your Realtor - Page 2"
                      width={800}
                      height={1100}
                      className="w-full object-contain mb-4"
                    />
                    <Image
                      src="/placeholder.svg?height=1100&width=800&text=11+Questions+to+Ask+Your+Realtor+Page+3"
                      alt="11 Questions to Ask Your Realtor - Page 3"
                      width={800}
                      height={1100}
                      className="w-full object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-purple-700">Listing Preview Checklist</h3>
                  <div className="flex space-x-2">
                    <a href="#" download className="flex items-center text-sm text-purple-600 hover:text-purple-800">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </a>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-purple-50 p-4 border-b border-gray-200">
                    <p className="text-purple-700 font-medium">
                      Comprehensive checklist for gathering essential property information during previews
                    </p>
                  </div>
                  <div className="p-4">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Listing%20Preview%20Checklist-oRyfam9VnCNTC8YJ3GDUWflA0QZ6CH.png"
                      alt="Listing Preview Checklist"
                      width={800}
                      height={1100}
                      className="w-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          ),
        }
      case "price":
        return {
          overview: (
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                The client always selects the final price. Our job is simply to provide all the data and information and
                guide them down the path that makes the most sense for them. The lesson below shows you how to do that.
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-700 mb-2">Pricing Strategy Principles:</h4>
                <ul className="list-disc pl-5 space-y-1 text-orange-700">
                  <li>Present comprehensive market data to inform decisions</li>
                  <li>Guide sellers through pricing psychology and market realities</li>
                  <li>Help sellers understand the impact of pricing on marketing strategy</li>
                  <li>Balance seller expectations with market conditions</li>
                  <li>Provide clear recommendations while respecting the seller's final decision</li>
                </ul>
              </div>
            </div>
          ),
          videoLessons: (
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-orange-700">Pricing Strategy Fundamentals</h3>
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/hXy09jVKok4"
                    title="Pricing Strategy Fundamentals"
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-700 mb-2">Key Takeaways:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-orange-700">
                    <li>Understanding pricing psychology and market dynamics</li>
                    <li>Analyzing comparable properties effectively</li>
                    <li>Presenting pricing options to sellers</li>
                    <li>Handling pricing objections with confidence</li>
                    <li>Balancing seller expectations with market realities</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-orange-700">Advanced Pricing Techniques</h3>
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/m33K9pG5oy0"
                    title="Advanced Pricing Techniques"
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-700 mb-2">Key Takeaways:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-orange-700">
                    <li>Strategic pricing for different market conditions</li>
                    <li>Adjusting for property features and condition</li>
                    <li>Creating compelling value propositions</li>
                    <li>Pricing strategies for competitive markets</li>
                    <li>Guiding sellers to make informed pricing decisions</li>
                  </ul>
                </div>
              </div>
            </div>
          ),
        }
      case "present":
        return {
          overview: (
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                At this stage you are ready to give your listing presentation. You have built rapport, set the
                expectations, provided a guide on pricing, and are ready to earn the listing. Here is how to nail the
                listing presentation.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-700 mb-2">Listing Presentation Success Factors:</h4>
                <ul className="list-disc pl-5 space-y-1 text-red-700">
                  <li>Prepare thoroughly and know your material inside and out</li>
                  <li>Focus on the seller's specific needs and concerns</li>
                  <li>Demonstrate your unique value proposition and market expertise</li>
                  <li>Present a clear marketing plan with specific strategies</li>
                  <li>Be confident in your pricing recommendation and ability to deliver results</li>
                  <li>Always ask for the business and be prepared to close</li>
                </ul>
              </div>
            </div>
          ),
          videoLessons: (
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-red-700">Listing Presentation Fundamentals</h3>
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/VDClII0Sb70"
                    title="Listing Presentation Fundamentals"
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-700 mb-2">Key Takeaways:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-red-700">
                    <li>Structure of an effective listing presentation</li>
                    <li>Building credibility and establishing expertise</li>
                    <li>Presenting your marketing plan effectively</li>
                    <li>Handling common seller objections</li>
                    <li>Techniques for closing and securing the listing</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-red-700">Advanced Presentation Strategies</h3>
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/vZtNCwr7waY"
                    title="Advanced Presentation Strategies"
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-700 mb-2">Key Takeaways:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-red-700">
                    <li>Differentiating yourself from competing agents</li>
                    <li>Using visual aids and technology effectively</li>
                    <li>Tailoring your presentation to different seller types</li>
                    <li>Advanced closing techniques for securing listings</li>
                    <li>Following up after the presentation</li>
                  </ul>
                </div>
              </div>
            </div>
          ),
          scripts: (
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-red-700">Listing Presentation Script</h3>
                  <div className="flex space-x-2">
                    <a
                      href="/audio/listing-presentation-script.mp3"
                      download
                      className="flex items-center text-sm text-red-600 hover:text-red-800"
                    >
                      <Volume2 className="h-4 w-4 mr-1" />
                      Listen
                    </a>
                    <a href="#" download className="flex items-center text-sm text-red-600 hover:text-red-800">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </a>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-red-50 p-4 border-b border-gray-200">
                    <p className="text-red-700 font-medium">
                      Complete script for conducting effective listing presentations that win business
                    </p>
                  </div>
                  <div className="p-4">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Listing%20Presentation%20Script-vwW97KBiJJCd9GIdlgmU294L7bgpQ3.png"
                      alt="The Beggins Listing Presentation Script"
                      width={800}
                      height={1100}
                      className="w-full object-contain mb-4"
                    />
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Listing%20Presentation%20cont-jsD6oofLxt0oVl5R0uQRtPMfq2Q4Gu.png"
                      alt="The Beggins Listing Presentation Script Continued"
                      width={800}
                      height={1100}
                      className="w-full object-contain mb-4"
                    />
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Listing%20Presentation%20pg%203-uxNKSDSiOtanTwfr0wDdbMiL6DfKkm.png"
                      alt="The Beggins Listing Presentation Script Final Page"
                      width={800}
                      height={1100}
                      className="w-full object-contain"
                    />
                  </div>
                  <audio className="w-full mt-2" controls>
                    <source
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9.%20Listing%20Presentation%20Script-GRNt7Wqrx0uutwl9PnEp0kxUu4V0Kh.mp3"
                      type="audio/mpeg"
                    />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            </div>
          ),
        }
      case "position":
        return {
          overview: (
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                The final "P" is all about positioning the listing to capture the best deal possible for your clients.
                Here is how positioning works.
              </p>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h4 className="font-semibold text-indigo-700 mb-2">Positioning Strategy Principles:</h4>
                <ul className="list-disc pl-5 space-y-1 text-indigo-700">
                  <li>Set proper expectations with sellers from the beginning</li>
                  <li>Develop a strategic marketing plan that attracts qualified buyers</li>
                  <li>Create a compelling property narrative that highlights key selling points</li>
                  <li>Position the property effectively against competing listings</li>
                  <li>Implement pricing strategies that maximize seller returns</li>
                  <li>Negotiate skillfully to protect your client's interests</li>
                </ul>
              </div>
            </div>
          ),
          videoLessons: (
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-indigo-700">Listing Agreement Essentials</h3>
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/KwQBFP5r0-c"
                    title="Listing Agreement Essentials"
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h4 className="font-semibold text-indigo-700 mb-2">Key Takeaways:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-indigo-700">
                    <li>Understanding the key components of a listing agreement</li>
                    <li>Explaining contract terms clearly to sellers</li>
                    <li>Setting proper expectations for the selling process</li>
                    <li>Addressing common seller concerns about agreements</li>
                    <li>Protecting both your interests and the seller's interests</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-indigo-700">Strategic Marketing Positioning</h3>
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/I3ORDxaNftE"
                    title="Strategic Marketing Positioning"
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h4 className="font-semibold text-indigo-700 mb-2">Key Takeaways:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-indigo-700">
                    <li>Creating a compelling property narrative</li>
                    <li>Developing targeted marketing strategies</li>
                    <li>Positioning against competing properties</li>
                    <li>Leveraging digital marketing channels effectively</li>
                    <li>Measuring marketing effectiveness and adjusting strategies</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-indigo-700">Negotiation Strategies</h3>
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/1-qu3CpEr_g"
                    title="Negotiation Strategies"
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h4 className="font-semibold text-indigo-700 mb-2">Key Takeaways:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-indigo-700">
                    <li>Understanding buyer psychology in negotiations</li>
                    <li>Preparing sellers for the negotiation process</li>
                    <li>Handling multiple offer situations effectively</li>
                    <li>Negotiating beyond just price (terms, contingencies, etc.)</li>
                    <li>Maintaining control of the negotiation process</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-indigo-700">Managing the Closing Process</h3>
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/vNTsAF9j18c"
                    title="Managing the Closing Process"
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h4 className="font-semibold text-indigo-700 mb-2">Key Takeaways:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-indigo-700">
                    <li>Guiding sellers through the closing timeline</li>
                    <li>Managing inspections and appraisal processes</li>
                    <li>Handling contingency removals and potential issues</li>
                    <li>Coordinating with all parties involved in the transaction</li>
                    <li>Ensuring a smooth closing experience for your sellers</li>
                  </ul>
                </div>
              </div>
            </div>
          ),
        }
      default:
        return {
          overview: "Content coming soon...",
          videoLessons: "Training videos coming soon...",
          scripts: "Scripts coming soon...",
          resources: "Resources coming soon...",
        }
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <Link
              href="/training-hub"
              className="flex items-center text-gray-300 hover:text-white transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Training Hub
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Listing Process Training</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Master the complete 7 P's system for winning listings and delivering exceptional results for your sellers.
            </p>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">The 7 P's of Listing Success</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Our proven 7-step system takes you from initial practice through successful closing, ensuring you win more
              listings and deliver exceptional results for every seller.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-gray-200 hover:border-gray-300">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-black mb-2">Listing Process Overview</h3>
                      <p className="text-gray-600">Watch the complete overview of our proven 7 P's listing system</p>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Listing Process Overview</DialogTitle>
                  <DialogDescription className="text-base">
                    A comprehensive approach to winning listings and delivering exceptional seller results
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="aspect-video">
                    <iframe
                      src="https://www.youtube.com/embed/7PALdrkChBc"
                      title="Listing Process Overview"
                      className="w-full h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h4 className="font-bold text-gray-800 mb-3">What You'll Learn:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Complete overview of the 7 P's listing system</li>
                      <li>• How each step builds upon the previous one</li>
                      <li>• Real-world application of the methodology</li>
                      <li>• Key strategies for listing success</li>
                      <li>• Professional techniques that win listings</li>
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* 7 P's Grid */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {listingSteps.map((step, index) => (
              <Dialog key={step.id}>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div
                          className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                        >
                          <step.icon className="h-8 w-8 text-white" />
                        </div>
                        <Badge variant="secondary" className="mb-3">
                          P{index + 1}
                        </Badge>
                        <h3 className={`text-lg font-bold mb-2 ${step.textColor}`}>{step.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center">
                      <div className={`w-10 h-10 ${step.color} rounded-xl flex items-center justify-center mr-3`}>
                        <step.icon className="h-5 w-5 text-white" />
                      </div>
                      P{index + 1} - {step.title}
                    </DialogTitle>
                    <DialogDescription className="text-base">{step.description}</DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue={step.id === "preview" ? "videos" : "overview"} className="w-full">
                    <TabsList
                      className={`grid w-full ${
                        step.id === "practice"
                          ? "grid-cols-3"
                          : step.id === "prospect"
                            ? "grid-cols-2"
                            : step.id === "prequal"
                              ? "grid-cols-3"
                              : step.id === "preview"
                                ? "grid-cols-2"
                                : step.id === "price"
                                  ? "grid-cols-2"
                                  : step.id === "present"
                                    ? "grid-cols-3"
                                    : step.id === "position"
                                      ? "grid-cols-2"
                                      : "grid-cols-4"
                      }`}
                    >
                      {step.id !== "preview" && <TabsTrigger value="overview">Overview</TabsTrigger>}
                      <TabsTrigger value="videos">Video Lessons</TabsTrigger>
                      {step.id !== "prospect" &&
                        step.id !== "preview" &&
                        step.id !== "price" &&
                        step.id !== "position" && <TabsTrigger value="scripts">Scripts</TabsTrigger>}
                      {(step.id !== "practice" &&
                        step.id !== "prospect" &&
                        step.id !== "prequal" &&
                        step.id !== "price" &&
                        step.id !== "present" &&
                        step.id !== "position") ||
                      step.id === "preview" ? (
                        <TabsTrigger value="resources">Resources</TabsTrigger>
                      ) : null}
                    </TabsList>
                    {step.id !== "preview" && (
                      <TabsContent value="overview" className="space-y-4">
                        <div className={`p-6 rounded-lg border-2 ${step.borderColor} ${step.bgColor}`}>
                          <h4 className={`font-bold ${step.textColor} mb-3`}>Overview</h4>
                          {typeof getStepContent(step.id).overview === "string" ? (
                            <p className="text-gray-700 leading-relaxed">{getStepContent(step.id).overview}</p>
                          ) : (
                            getStepContent(step.id).overview
                          )}
                        </div>
                      </TabsContent>
                    )}
                    <TabsContent value="videos" className="space-y-4">
                      {typeof getStepContent(step.id).videoLessons === "string" ? (
                        <div className="flex items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg">
                          <div className="text-center">
                            <PlayCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">{getStepContent(step.id).videoLessons}</p>
                          </div>
                        </div>
                      ) : (
                        getStepContent(step.id).videoLessons
                      )}
                    </TabsContent>
                    {step.id !== "prospect" &&
                      step.id !== "preview" &&
                      step.id !== "price" &&
                      step.id !== "position" && (
                        <TabsContent value="scripts" className="space-y-4">
                          {typeof getStepContent(step.id).scripts === "string" ? (
                            <div className="flex items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg">
                              <div className="text-center">
                                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">{getStepContent(step.id).scripts}</p>
                              </div>
                            </div>
                          ) : (
                            getStepContent(step.id).scripts
                          )}
                        </TabsContent>
                      )}
                    {((step.id !== "practice" &&
                      step.id !== "prospect" &&
                      step.id !== "prequal" &&
                      step.id !== "price" &&
                      step.id !== "present" &&
                      step.id !== "position") ||
                      step.id === "preview") && (
                      <TabsContent value="resources" className="space-y-4">
                        {typeof getStepContent(step.id).resources === "string" ? (
                          <div className="flex items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg">
                            <div className="text-center">
                              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-500">{getStepContent(step.id).resources}</p>
                            </div>
                          </div>
                        ) : (
                          getStepContent(step.id).resources
                        )}
                      </TabsContent>
                    )}
                  </Tabs>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
