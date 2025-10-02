import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Brokerage Intake - Empower AI",
  description: "Get started with Empower AI for your brokerage",
}

export default function BrokerageIntakeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
