// Stub translation service - no API calls, just returns original text

export class TranslationService {
  async translateText(text: string, targetLanguage: string): Promise<string> {
    // Return original text - translation disabled
    return text
  }

  getSupportedLanguages(): string[] {
    return ["en"] // Only English supported
  }

  detectLanguage(text: string): string {
    return "en" // Always return English
  }
}

export const translationService = new TranslationService()
