"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, Users, TrendingUp, Award, CheckCircle, ArrowRight, MapPin, Video } from "lucide-react"
import { submitConsultingInquiry } from "./actions"

const consultingServices = [
  {
    title: "Moxi Works Training",
    description: "Comprehensive training on maximizing your Moxi platform for lead generation and conversion",
    icon: Building,
    color: "bg-blue-500",
    features: ["Platform optimization", "Lead capture strategies", "Workflow automation", "Performance tracking"],
  },
  {
    title: "AI Integration & Training",
    description: "Learn how to leverage AI tools to streamline operations and enhance productivity",
    icon: TrendingUp,
    color: "bg-green-500",
    features: ["AI tool implementation", "Workflow automation", "Content generation", "Lead qualification"],
  },
  {
    title: "Marketing & Lead Generation",
    description: "Proven marketing strategies that generate consistent leads and grow your business",
    icon: Users,
    color: "bg-purple-500",
    features: ["Digital marketing strategies", "Social media optimization", "Content marketing", "Brand development"],
  },
  {
    title: "Sales & Connection Skills",
    description: "Advanced sales training and relationship building techniques that close more deals",
    icon: Award,
    color: "bg-orange-500",
    features: ["Sales script mastery", "Objection handling", "Relationship building", "Closing techniques"],
  },
]

const achievements = [
  { number: "33+", label: "Years in Real Estate" },
  { number: "500+", label: "Agents Across Florida" },
  { number: "$1B+", label: "Annual Sales Volume" },
  { number: "#1", label: "Century 21 in Florida" },
]

export default function BrokerageConsultingPage() {
  const scrollToContactForm = () => {
    const contactForm = document.getElementById("contact-form")
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Building className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">Brokerage Consulting</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Our experience and expertise can help brokers, agents, and brokerage management reach their next level.
            We've been running our real estate brokerage for over 33 years, and we're here to help where we can.
          </p>
        </div>

        {/* Achievements Section */}
        <Card className="mb-16 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="text-2xl text-black text-center">Our Track Record</CardTitle>
            <CardDescription className="text-center max-w-3xl mx-auto">
              We say this not to brag, but to express that we live this business and know how hard it all is. Running
              and growing a real estate business is challenging, and we're here to help.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{achievement.number}</div>
                  <div className="text-sm text-gray-600">{achievement.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-700 max-w-2xl mx-auto">
                As the #1 Century 21 in Florida and consistently one of the top brokerages in the Southeast, we
                understand the challenges you face because we face them too.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Services Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Our Consulting Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've consulted with brokerages all over the US to help improve their skills and grow their business.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {consultingServices.map((service, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center`}>
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-black">{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Delivery Options */}
        <Card className="mb-16 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-black text-center">Flexible Delivery Options</CardTitle>
            <CardDescription className="text-center">
              We can work with your team in the format that works best for your schedule and budget
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-black mb-2">In-Person Consulting</h3>
                <p className="text-gray-600">
                  We'll come to your location for hands-on training and consulting sessions with your team.
                </p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <Video className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-black mb-2">Virtual Webinars</h3>
                <p className="text-gray-600">
                  Interactive online sessions that allow your entire team to participate from anywhere.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Areas of Expertise */}
        <Card className="mb-16 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-black text-center">Areas of Expertise</CardTitle>
            <CardDescription className="text-center">
              Our comprehensive consulting covers all aspects of running a successful real estate business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "Moxi Platform Optimization",
                "AI Tool Integration",
                "Digital Marketing Strategies",
                "Lead Generation Systems",
                "Sales Training & Scripts",
                "Agent Recruiting",
                "Team Building & Leadership",
                "Performance Analytics",
                "Workflow Automation",
                "Brand Development",
                "Social Media Marketing",
                "Customer Relationship Management",
              ].map((expertise, index) => (
                <div key={index} className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  {expertise}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card className="mb-16 border-0 shadow-lg" id="contact-form">
          <CardHeader>
            <CardTitle className="text-2xl text-black text-center">Let's Discuss Your Needs</CardTitle>
            <CardDescription className="text-center">
              Contact us to learn more about how we can help your brokerage reach the next level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={submitConsultingInquiry} className="max-w-2xl mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Brokerage/Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                  Area of Interest
                </label>
                <select
                  id="service"
                  name="service"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select an area of interest</option>
                  <option value="moxi">Moxi Works Training</option>
                  <option value="ai">AI Integration & Training</option>
                  <option value="marketing">Marketing & Lead Generation</option>
                  <option value="sales">Sales & Connection Skills</option>
                  <option value="recruiting">Agent Recruiting</option>
                  <option value="leadership">Leadership & Team Building</option>
                  <option value="comprehensive">Comprehensive Consulting</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="delivery" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Delivery Method
                </label>
                <select
                  id="delivery"
                  name="delivery"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select delivery preference</option>
                  <option value="in-person">In-Person Consulting</option>
                  <option value="webinar">Virtual Webinar</option>
                  <option value="hybrid">Combination of Both</option>
                  <option value="flexible">Flexible - Let's Discuss</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Tell Us About Your Needs *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  placeholder="What challenges are you facing? What areas would you like to improve? How many people would be involved in the training?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
                Send Consulting Inquiry
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white border-0">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Take Your Brokerage to the Next Level?</h2>
            <p className="text-xl mb-8 opacity-90">
              Let's discuss how our proven strategies and expertise can help your team succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" onClick={scrollToContactForm}>
                Schedule a Consultation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
