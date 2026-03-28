import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { LanguageModelV1 } from 'ai';

// Initialize the Google Generative AI provider using the key from env
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

// We distinguish between a fast model (for simple classification/short generations)
// and a smart model (for complex logic, test generation, and OCR grading reasoning).
// 'as unknown as LanguageModelV1' explicitly forces TypeScript to ignore Vercel SDK minor version mismatches.
export const fastModel: any = google('models/gemini-1.5-flash-latest') as unknown as LanguageModelV1;
export const smartModel: any = google('models/gemini-1.5-pro-latest') as unknown as LanguageModelV1;
