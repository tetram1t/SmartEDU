import { generateObject } from 'ai';
import { z } from 'zod';
import { BaseAgent, AgentConfig } from '../core/agent-base';
import { smartModel } from '../core/llm-provider';

export const AnswerMatcherInputSchema = z.object({
  extractedText: z.string().describe("Raw text extracted via OCR from student's work"),
  questionId: z.string(),
  questionText: z.string(),
  correctAnswer: z.any().describe("The answer key"),
  maxPoints: z.number()
});

export type AnswerMatcherInput = z.infer<typeof AnswerMatcherInputSchema>;

export const AnswerMatcherOutputSchema = z.object({
  studentAnswer: z.string().describe("What the AI believes the student wrote based on the extracted text"),
  isCorrect: z.boolean(),
  awardedPoints: z.number(),
  confidence: z.number().min(0).max(1).describe("How confident the AI is in parsing and grading this item"),
  explanation: z.string().describe("Reasoning for points awarded or why it was flagged"),
  needsManualReview: z.boolean().describe("True if OCR text is garbled, unclear, or confidence is low")
});

export type AnswerMatcherOutput = z.infer<typeof AnswerMatcherOutputSchema>;

export class AnswerMatcherAgent extends BaseAgent<AnswerMatcherInput, AnswerMatcherOutput> {
  constructor(config?: Partial<AgentConfig>) {
    super({
      model: config?.model || smartModel,
      systemPrompt: config?.systemPrompt || `
You are an intelligent answer-matching engine for an automated grading system.
Your job is to read raw, sometimes messy OCR output from a student's answer sheet, locate their answer to the specific question, and compare it to the correct key.
Be lenient with minor typos or OCR artifacts, but strict on learning concepts.
Flag for manual review if the extracted text makes no sense.
Output strict JSON matching the schema.
      `
    });
  }

  async execute(input: AnswerMatcherInput): Promise<AnswerMatcherOutput> {
    const prompt = `
Given the following raw OCR text extracted from a student's paper:
"""
${input.extractedText}
"""

Find the answer to this question: "${input.questionText}" (ID: ${input.questionId})
Compare it against the correct answer key: ${JSON.stringify(input.correctAnswer)}

Max points possible: ${input.maxPoints}

Determine how many points to award and if it needs manual teacher review.
    `;

    const { object } = await generateObject({
      model: this.model,
      system: this.systemPrompt,
      prompt,
      schema: AnswerMatcherOutputSchema,
    });

    return object;
  }
}
