"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, ShoppingCart, Presentation, Play, BookOpen, DollarSign, CreditCard } from "lucide-react"
import Image from "next/image"

// Image viewer component for the presentation
const PresentationViewer = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      src: "/images/zillow-showcase-page1.jpeg",
      title: "Zillow Showcase Overview",
      description: "Introduction to Zillow Showcase by Century 21 Beggins",
    },
    {
      src: "/images/zillow-showcase-page2.png",
      title: "Marketing Statistics",
      description: "75% more page views, 68% more saves, 75% more shares",
    },
    {
      src: "/images/zillow-showcase-page3.jpeg",
      title: "The Showcase Impact",
      description: "20% more likely to go pending, sell for 2% more",
    },
    {
      src: "/images/zillow-showcase-page4.png",
      title: "Features Overview",
      description: "3D tours, AI visuals, enhanced exposure, and more",
    },
    {
      src: "/images/zillow-showcase-page5.png",
      title: "The Difference is Clear",
      description: "Visual comparison of regular vs Showcase listings",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="relative bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={slides[currentSlide].src || "/placeholder.svg"}
          alt={slides[currentSlide].title}
          width={800}
          height={600}
          className="w-full h-auto object-contain"
        />
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">{slides[currentSlide].title}</h3>
        <p className="text-gray-600 mb-4">{slides[currentSlide].description}</p>
        <div className="text-sm text-gray-500">
          Slide {currentSlide + 1} of {slides.length}
        </div>
      </div>

      <div className="flex justify-center space-x-2 mb-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
          disabled={currentSlide === 0}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
          disabled={currentSlide === slides.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export default function ZillowShowcasePage() {
  const [activeTab, setActiveTab] = useState("setup")

  const tabs = [
    { id: "setup", label: "How To Set Up", icon: Settings },
    { id: "order", label: "How To Order", icon: ShoppingCart },
    { id: "pitch", label: "How To Pitch", icon: Presentation },
    { id: "use", label: "How To Use", icon: Play },
    { id: "resources", label: "Training & Resources", icon: BookOpen },
  ]

  const scrollToProducts = () => {
    const element = document.getElementById("products-section")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case "setup":
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Setup Instructions:</h3>
              <ol className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-4 mt-0.5 flex-shrink-0">
                    1
                  </span>
                  <span>Check the box on the Listing Deal sheet that says "Zillow Showcase"</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-4 mt-0.5 flex-shrink-0">
                    2
                  </span>
                  <span>
                    Pay for the token by clicking the payment link (Remember, the price is different if you pay up front
                    vs. paying at closing. Look at the deal sheet or the page for details)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-4 mt-0.5 flex-shrink-0">
                    3
                  </span>
                  <span>
                    Once you receive the receipt showing it is paid, add it back into the loop and resubmit it for
                    review. (You will get a message in dotloop saying that the showcase has been set up after)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-4 mt-0.5 flex-shrink-0">
                    4
                  </span>
                  <span>Go to app.showingtimeplus.com and log in (If it is your first time using a token)</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-4 mt-0.5 flex-shrink-0">
                    5
                  </span>
                  <span>
                    Click on your picture in the top right and ensure your profile is set up correctly. This would
                    include a picture, bio (if you do not want the default bio), phone number, etc
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-4 mt-0.5 flex-shrink-0">
                    6
                  </span>
                  <span>Click on your property and choose to use another photographer</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-4 mt-0.5 flex-shrink-0">
                    7
                  </span>
                  <span>
                    If you are using your own Zillow Showcase Certified Photographer, click use another photographer and
                    add their name and email address. (The photographer will then get a link that he will need to get
                    the photos and 3D tour into Zillow). The other option is to use LMS (listing media services) to
                    order your photographs.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-4 mt-0.5 flex-shrink-0">
                    8
                  </span>
                  <span>Wait for photos to get completed and uploaded into the system</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-4 mt-0.5 flex-shrink-0">
                    9
                  </span>
                  <span>
                    (After photos have been uploaded) - Go in and ensure you have the right photos in the carousel and
                    all rooms are represented on the showcase
                  </span>
                </li>
              </ol>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Setup Training Video:</h3>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/b5nSSSIXYN0"
                  title="Zillow Showcase Setup Training"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        )

      case "order":
        return (
          <div className="space-y-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Ordering Training Video:</h3>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/phjpNOyTDeI"
                  title="How To Order Zillow Showcase"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        )

      case "pitch":
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Pitching Training Video:</h3>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/XYiC3oX51hM"
                  title="How To Pitch Zillow Showcase"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        )

      case "use":
        return (
          <div className="space-y-6">
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Usage Training Video:</h3>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/GWaQM9yiSIU"
                  title="How To Use Zillow Showcase"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        )

      case "resources":
        return (
          <div className="space-y-8">
            {/* New Experience Info */}
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">New Experience Features:</h3>
              <p className="text-gray-700 mb-4">
                New experience that includes some exciting new features that we've been asking for:
              </p>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">●</span>
                  <span>
                    <strong>Performance Data:</strong> Dive into the impact of every listing and download report for
                    easy sharing with your sellers.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">●</span>
                  <span>
                    <strong>Streamlined Media Ordering:</strong> A simpler process to make it even easier to order
                    Showcase listing media.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">●</span>
                  <span>
                    <strong>Unified Login:</strong> Spend less time logging into your tools, including dotloop and
                    Listing Media Services and more time for your business.
                  </span>
                </li>
              </ul>

              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
                <h4 className="font-semibold text-yellow-800 mb-2">ACTION REQUIRED (For reporting):</h4>
                <p className="text-yellow-700">
                  If you would like the new, updated reports, you will need to link your MLS to Zillow Showcase.
                </p>
              </div>

              <div className="bg-blue-100 border-l-4 border-blue-500 p-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  ACTION REQUIRED: If you use a Certified Zillow Showcase Photographer:
                </h4>
                <p className="text-blue-700 mb-2">
                  Photographers will need an Aryeo Lite account (FREE). Individual photographers will have to have an
                  Aryeo Lite account (FREE) in lieu of the email link once the launch is live.
                </p>
                <p className="text-blue-700">
                  Photographers can find more information to prep for the change. (Send this information to the
                  photographer so they can get set up)
                </p>
              </div>
            </div>

            {/* Presentation Viewer */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-6">Zillow Showcase Presentation Materials:</h3>
              <PresentationViewer />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Zillow Showcase Training</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
          Master our proven Zillow Showcase system for maximizing listing exposure and performance from start to finish.
        </p>

        {/* Buy Button Above Tabs */}
        <Button
          onClick={scrollToProducts}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Buy A Showcase Listing
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              variant={activeTab === tab.id ? "default" : "outline"}
              className={`flex items-center space-x-2 ${
                activeTab === tab.id
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-white hover:bg-gray-50 text-gray-700"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </Button>
          )
        })}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">{renderContent()}</div>

      {/* Buy Button Below Content */}
      <div className="text-center mb-12">
        <Button
          onClick={scrollToProducts}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Buy A Showcase Listing
        </Button>
      </div>

      {/* Products Section */}
      <div id="products-section" className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Choose Your Zillow Showcase Option</h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Pay Upfront Option */}
          <Card className="border-2 border-green-200 hover:border-green-400 transition-colors">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-700">Zillow Showcase Listing</CardTitle>
              <CardDescription className="text-lg font-semibold">Pay Upfront</CardDescription>
              <div className="text-4xl font-bold text-green-600 mt-4">$225</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Flat rate $225/listing price versus variable price based on home price</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Showcase agents win 20% more listings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>
                    Showcase listings drive 81% more page views, 75% more saves & 79% more shares compared to regular
                    Zillow Listings
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>
                    Showcase listings go pending in the first 14 days nearly 20% more often than non-Showcase listings
                  </span>
                </li>
              </ul>
              <a href="https://buy.stripe.com/5kQ8wQeWU9BObse3rm9ws01" target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white mt-6">Purchase Now - $225</Button>
              </a>
            </CardContent>
          </Card>

          {/* Pay at Closing Option */}
          <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-blue-700">Zillow Showcase Listing</CardTitle>
              <CardDescription className="text-lg font-semibold">Pay At Closing</CardDescription>
              <div className="text-4xl font-bold text-blue-600 mt-4">$1.00</div>
              <div className="text-sm text-gray-600">+ $400 at closing</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700 text-center">
                  With this option you will pay $1.00 now, and will be billed $400 at closing.
                </p>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Same great Showcase features</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Pay minimal upfront cost</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Balance due at closing</span>
                </li>
              </ul>
              <a href="https://buy.stripe.com/5kQfZig0Y15i53Q2ni9ws02" target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-6">Purchase Now - $1.00</Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Master Zillow Showcase?</h2>
        <p className="text-gray-600 mb-6">
          Start with the setup guide and work through each module to become a Zillow Showcase expert.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">75% More Page Views</Badge>
          <Badge className="bg-green-100 text-green-800 border-green-200">68% More Saves</Badge>
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">75% More Shares</Badge>
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">20% Faster Sales</Badge>
        </div>
      </div>
    </div>
  )
}
