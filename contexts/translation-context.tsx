"use client"

import type React from "react"
import { createContext, useContext } from "react"

interface TranslationContextType {
  translate: (text: string) => string
  currentLanguage: string
  setLanguage: (language: string) => void
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  // Stub implementation - just returns original text
  const translate = (text: string) => text
  const currentLanguage = "en"
  const setLanguage = (language: string) => {
    // Do nothing - translation disabled
  }

  return (
    <TranslationContext.Provider value={{ translate, currentLanguage, setLanguage }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }
  return context
}
