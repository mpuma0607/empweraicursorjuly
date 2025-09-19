"use client"

import { useTenantConfig } from "@/contexts/tenant-context"
import { redirect } from "next/navigation"

export default function TermsOfServicePage() {
  const tenantConfig = useTenantConfig()

  // Only show for Empower AI tenant
  if (tenantConfig.id !== "empower-ai") {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service & Express Written Consent</h1>
            <div className="text-lg text-gray-600 mb-2">
              Beggins Enterprises | BE3 Global | Empower AI | Beggins University
            </div>
            <div className="text-sm text-gray-500">
              <div>Effective Date: July 1, 2025</div>
              <div>Last Updated: July 1, 2025</div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction and Entity Structure</h2>
              <p className="text-gray-700 mb-4">
                This Terms of Service ("Agreement") governs your use of all content, tools, services, websites,
                platforms, and communication channels owned and operated by Beggins Enterprises, including its wholly
                owned subsidiaries:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>BE3 Global</li>
                <li>Empower AI (GetEmpowerAI.com)</li>
                <li>Beggins University (BegginsUniversity.com)</li>
              </ul>
              <p className="text-gray-700">
                By accessing or using any of these platforms (collectively, "Services"), you agree to comply with and be
                bound by the terms outlined in this Agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Ownership and Use of Content</h2>
              <p className="text-gray-700 mb-4">
                All materials, tools, software, training resources, data outputs, branding assets, presentations,
                documents, videos, communications, and AI-generated content (collectively, "Content") made available
                across our platforms are the sole and exclusive property of Beggins Enterprises or its subsidiaries,
                whether produced in-house or licensed for use.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Usage Restrictions</h3>
              <p className="text-gray-700 mb-2">You agree and acknowledge:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>
                  Content is for internal business, professional, and training use only by authorized agents or paying
                  members of our platforms.
                </li>
                <li>
                  You may not share, distribute, sell, sublicense, display, publish, or otherwise make available any
                  Content to non-authorized users or the public.
                </li>
                <li>Login credentials are personal and may not be shared or transferred to any third party.</li>
                <li>
                  Unauthorized use, copying, distribution, or disclosure of Content is strictly prohibited and may
                  result in termination of access and legal action.
                </li>
              </ul>

              <p className="text-gray-700 mb-2">Each platform's access terms apply as follows:</p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>
                  <strong>BegginsUniversity.com:</strong> Access limited to agents affiliated with Beggins Enterprises.
                </li>
                <li>
                  <strong>GetEmpowerAI.com:</strong> Access limited to paying members only.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Account Integrity</h2>
              <p className="text-gray-700">
                You agree to maintain the security and confidentiality of your account credentials across all platforms.
                You are solely responsible for all activity that occurs under your account and must immediately notify
                us of any unauthorized use or breach.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Express Written Consent to Communicate</h2>
              <p className="text-gray-700 mb-4">
                By accepting this Agreement, you provide Beggins Enterprises, BE3 Global, Empower AI, and Beggins
                University with express written consent to communicate with you using any current or future
                communication method, including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Telephone calls (including those using auto-dialing or pre-recorded technology),</li>
                <li>SMS or text messaging,</li>
                <li>Email,</li>
                <li>In-app or platform notifications,</li>
                <li>Social media messaging,</li>
                <li>Or other communication platforms.</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Purpose of Communication</h3>
              <p className="text-gray-700 mb-2">Such communications may include, but are not limited to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Training or educational updates</li>
                <li>Product or service announcements</li>
                <li>Marketing or promotional messages</li>
                <li>Feedback or satisfaction surveys</li>
                <li>Membership or account notifications</li>
                <li>Operational or administrative alerts</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Opt-Out and Revocation</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Message and data rates may apply.</li>
                <li>
                  You may opt out of promotional communications at any time using the unsubscribe instructions provided.
                </li>
                <li>
                  You may revoke this consent by submitting a written request to:{" "}
                  <a href="mailto:MikePuma@c21be.com" className="text-blue-600 hover:text-blue-800">
                    MikePuma@c21be.com
                  </a>
                </li>
                <li>
                  Revocation of consent may impact your ability to access or receive important information from our
                  Services.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Privacy Policy</h2>
              <p className="text-gray-700 mb-4">
                We respect and protect the privacy of all users of our Services.
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>
                  We do not sell, rent, or share any personal information, user data, or content provided to us with any
                  third parties for marketing or commercial purposes.
                </li>
                <li>
                  Information collected through our platforms is used solely for the purpose of delivering and improving
                  our Services, maintaining account integrity, providing training or educational content, and
                  communicating with you as outlined in this Agreement.
                </li>
                <li>
                  Access to your information is restricted to authorized personnel within Beggins Enterprises and its
                  subsidiaries who require such access to perform their job functions.
                </li>
                <li>
                  Any data you provide is safeguarded using industry-standard security practices.
                </li>
              </ul>
              <p className="text-gray-700 mb-6">
                By using our Services, you acknowledge and agree that your data will be handled in accordance with this
                Privacy Policy.
              </p>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Google User Data Access</h3>
                <p className="text-gray-700 mb-4">
                  Our Services may request access to certain Google user data in order to provide functionality such as email integration, calendar syncing, and secure account login. We respect your privacy and strictly limit how this information is used.
                </p>

                <h4 className="text-lg font-semibold text-gray-900 mb-3">What Google Data We Access</h4>
                <p className="text-gray-700 mb-3">
                  Depending on the Services you use, we may request the following Google OAuth scopes:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li><strong>userinfo.email</strong> – Access to your primary Google Account email address.</li>
                  <li><strong>userinfo.profile</strong> – Access to your basic profile information (such as name and profile picture) that you have made publicly available.</li>
                  <li><strong>calendar.events</strong> – Permission to view and edit events on your calendars when you choose to integrate your calendar with our Services.</li>
                  <li><strong>calendar.events.readonly</strong> – Permission to view events on your calendars without editing them, used when read-only access is sufficient.</li>
                  <li><strong>gmail.send</strong> – Permission to send email on your behalf when you explicitly use our platform to send messages.</li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-900 mb-3">How We Use This Data</h4>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Your email and profile information are used only for authentication, account creation, and personalization within our Services.</li>
                  <li>Your calendar data is accessed only to provide scheduling features you have opted into (e.g., syncing events, showing availability, creating reminders).</li>
                  <li>Your Gmail send permissions are used only when you request that our platform send an email on your behalf.</li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-900 mb-3">What We Don't Do</h4>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>We do not sell, rent, or share your Google user data with third parties.</li>
                  <li>We do not use your Google data for advertising or marketing purposes.</li>
                  <li>We access your Google data only in real time to provide the requested functionality and do not store calendar event details or email contents beyond what is required for the Service.</li>
                </ul>

                <p className="text-gray-700">
                  You may revoke our access to your Google data at any time by visiting your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Google Account Permissions page</a>.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Termination of Access</h2>
              <p className="text-gray-700">
                We reserve the right to suspend, restrict, or terminate your access to any platform, content, or tools
                at any time without notice for violations of this Agreement, suspected misuse, unauthorized sharing, or
                failure to comply with any platform policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Updates to Terms</h2>
              <p className="text-gray-700">
                We may revise these Terms from time to time. You will be notified of material changes via email or
                platform announcement. Continued use of our Services following any changes constitutes your acceptance
                of the updated Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Information</h2>
              <p className="text-gray-700 mb-2">
                For questions, permission requests, revocation of communication consent, or compliance inquiries:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-700 font-medium">Beggins Enterprises – Compliance Department</p>
                <p className="text-gray-700">
                  📧 Email:{" "}
                  <a href="mailto:MikePuma@c21be.com" className="text-blue-600 hover:text-blue-800">
                    MikePuma@c21be.com
                  </a>
                </p>
              </div>
            </section>

            <div className="border-t pt-6 mt-8">
              <p className="text-gray-700 text-sm">
                By accessing or using any services provided by Beggins Enterprises or its subsidiaries, you affirm that
                you have read, understood, and agreed to be bound by these Terms of Service and that you give express
                written consent as described herein.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
