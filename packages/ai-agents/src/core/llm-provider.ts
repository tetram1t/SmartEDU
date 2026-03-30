import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { LanguageModelV1 } from 'ai';

if (!process.env.GEMINI_API_KEY) {
  console.warn("WARNING: GEMINI_API_KEY is not defined in environment variables.");
}

// Initialize the Google Generative AI provider
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

// Using standard model IDs. The SDK should handle the URL construction.
export const fastModel: any = google('models/gemini-1.5-flash') as unknown as LanguageModelV1;
export const smartModel: any = google('models/gemini-1.5-flash') as unknown as LanguageModelV1;
