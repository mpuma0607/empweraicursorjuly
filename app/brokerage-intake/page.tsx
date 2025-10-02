"use client"

import Image from "next/image"

export default function BrokerageIntakePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Empower AI Logo */}
      <div className="mb-8">
        <Image
          src="/images/empower-ai-logo.png"
          alt="Empower AI"
          width={200}
          height={60}
          className="mx-auto"
        />
      </div>

      {/* JotForm Embed */}
      <div className="w-full max-w-4xl">
        <iframe
          id="JotFormIFrame-252743488866070"
          title="Empower AI Intake Form"
          onLoad={() => window.parent.scrollTo(0, 0)}
          allowTransparency={true}
          allow="geolocation; microphone; camera"
          src="https://form.jotform.com/252743488866070"
          frameBorder="0"
          style={{
            minWidth: "100%",
            maxWidth: "100%",
            height: "539px",
            border: "none",
          }}
          scrolling="no"
        />
      </div>
    </div>
  )
}
