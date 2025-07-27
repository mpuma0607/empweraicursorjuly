"use client"

interface TranslatedTextProps {
  text: string
  className?: string
}

export default function TranslatedText({ text, className }: TranslatedTextProps) {
  // Stub implementation - just returns original text
  return <span className={className}>{text}</span>
}
