"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Palette, Globe, Presentation, Mail, CheckCircle, ArrowRight } from "lucide-react"
import { submitProjectInquiry } from "./actions"

const designServices = [
  {
    title: "Moxi Website Design",
    description: "Complete website design and customization for agents and brokers",
    icon: Globe,
    price: "Starting at $500/site",
    features: ["Custom branding", "Lead capture optimization", "Mobile responsive", "SEO optimization"],
    color: "bg-blue-500",
    samples: [
      "www.c21beggins.com",
      "www.c21tetonvalley.com",
      "mikepumarealestate.com",
      "batrealtor.com",
      "thebeachmakerresort.com",
    ],
  },
  {
    title: "Custom Landing Pages",
    description: "High-converting landing pages for specific campaigns and lead generation",
    icon: Presentation,
    price: "$100/page",
    features: ["Conversion focused", "A/B testing ready", "Fast loading", "Analytics integration"],
    color: "bg-green-500",
  },
  {
    title: "Moxi Presentations",
    description: "Professional presentation templates for listings and buyer consultations",
    icon: Presentation,
    price: "$150/presentation",
    features: ["Brand consistent", "Interactive elements", "Professional templates", "Easy customization"],
    color: "bg-purple-500",
  },
  {
    title: "Email Campaign Development",
    description: "Branded email templates and automated campaign design",
    icon: Mail,
    price: "$150/campaign",
    features: ["Responsive design", "Brand integration", "Automation ready", "Performance tracking"],
    color: "bg-orange-500",
  },
]

export default function MoxiDesignPage() {
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
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Palette className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">Moxi Design Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional design services to help you create stunning Moxi websites, landing pages, presentations, and
            email campaigns that convert leads and grow your business.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {designServices.map((service, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center`}>
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-black">{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </div>
                  </div>
                  <div className="text-xl font-semibold text-gray-700">{service.price}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Button onClick={scrollToContactForm} className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Inquire Here
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Section */}
        <Card className="mb-16 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-black text-center">Our Design Process</CardTitle>
            <CardDescription className="text-center">
              We follow a proven process to ensure your Moxi platform delivers results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  1
                </div>
                <h4 className="font-semibold text-black mb-2">Discovery</h4>
                <p className="text-sm text-gray-600">We learn about your business, goals, and target audience</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  2
                </div>
                <h4 className="font-semibold text-black mb-2">Strategy</h4>
                <p className="text-sm text-gray-600">We develop a custom strategy for your Moxi platform</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  3
                </div>
                <h4 className="font-semibold text-black mb-2">Design</h4>
                <p className="text-sm text-gray-600">We create beautiful, conversion-focused designs</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  4
                </div>
                <h4 className="font-semibold text-black mb-2">Launch</h4>
                <p className="text-sm text-gray-600">We implement, test, and train you on your new platform</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-16 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-black text-center">Our Work Samples</CardTitle>
            <CardDescription className="text-center">Check out some of our recent Moxi website designs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "www.c21beggins.com",
                "www.c21tetonvalley.com",
                "mikepumarealestate.com",
                "batrealtor.com",
                "thebeachmakerresort.com",
              ].map((site, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg text-center">
                  <Globe className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <a
                    href={`https://${site}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {site}
                  </a>
                </div>
              ))}
              <div className="p-4 bg-gray-50 rounded-lg text-center flex items-center justify-center">
                <span className="text-gray-600 italic">More samples available upon request</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-16 border-0 shadow-lg" id="contact-form">
          <CardHeader>
            <CardTitle className="text-2xl text-black text-center">Discuss Your Project</CardTitle>
            <CardDescription className="text-center">
              Have a unique project in mind or questions about our services? Let's talk!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={submitProjectInquiry} className="max-w-2xl mx-auto space-y-6">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                  Service Interested In
                </label>
                <select
                  id="service"
                  name="service"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select a service</option>
                  <option value="website">Moxi Website Design ($500+)</option>
                  <option value="landing">Custom Landing Pages ($100/page)</option>
                  <option value="presentation">Moxi Presentations ($150/presentation)</option>
                  <option value="email">Email Campaign Development ($150/campaign)</option>
                  <option value="custom">Custom Project</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Details *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  placeholder="Tell us about your project, timeline, and any specific requirements..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                ></textarea>
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3">
                Send Project Inquiry
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-br from-green-600 to-teal-600 text-white border-0">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Moxi Platform?</h2>
            <p className="text-xl mb-8 opacity-90">
              Let's discuss how our design services can help you generate more leads and close more deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100" onClick={scrollToContactForm}>
                Schedule Consultation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
