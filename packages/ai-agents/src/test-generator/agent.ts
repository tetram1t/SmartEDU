import { generateObject } from 'ai';
import { z } from 'zod';
import { BaseAgent, AgentConfig } from '../core/agent-base';
import { smartModel } from '../core/llm-provider';

export const TestGeneratorInputSchema = z.object({
  subject: z.string(),
  grade: z.number(),
  topic: z.string(),
  questionCount: z.number().min(1).max(20).default(5),
  difficulty: z.enum(['easy', 'medium', 'hard', 'mixed']).default('medium'),
  paragraphText: z.string().optional(),
  additionalInstructions: z.string().optional(),
});

export type TestGeneratorInput = z.infer<typeof TestGeneratorInputSchema>;

export const QuestionSchema = z.object({
  text: z.string(),
  type: z.enum(['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'SHORT_ANSWER']),
  options: z.array(z.string()).optional().describe("Provide 4 options if SINGLE_CHOICE or MULTIPLE_CHOICE"),
  correctAnswer: z.any().describe("String for SHORT_ANSWER, exact matching string for SINGLE_CHOICE, array of strings for MULTIPLE_CHOICE"),
  points: z.number().default(1),
  explanation: z.string().describe("Explanation for the correct answer"),
});

export const TestGeneratorOutputSchema = z.object({
  title: z.string(),
  description: z.string(),
  questions: z.array(QuestionSchema)
});

export type TestGeneratorOutput = z.infer<typeof TestGeneratorOutputSchema>;

export class TestGeneratorAgent extends BaseAgent<TestGeneratorInput, TestGeneratorOutput> {
  constructor(config?: Partial<AgentConfig>) {
    super({
      model: config?.model || smartModel,
      systemPrompt: config?.systemPrompt || `
You are an expert test designer (pedagogical measurement specialist) in Belarus.
Your task is to generate high-quality educational tests in Russian.

Guidelines for questions:
1. SINGLE_CHOICE: Exactly one correct answer, 3 plausible distractors.
2. MULTIPLE_CHOICE: 2 or more correct answers, total 4-5 options.
3. SHORT_ANSWER: A single word or short phrase.

Cognitive levels:
- Knowledge: basic facts.
- Application: using concepts in new situations.
- Analysis: breaking down information.

Ensure the "explanation" field for each question is pedagogical and explains why the answer is correct.
Return strictly valid JSON matching the schema.
      `
    });
  }

  async execute(input: TestGeneratorInput): Promise<TestGeneratorOutput> {
    const prompt = `
Generate a test with the following constraints:
- Subject: ${input.subject}
- Grade: ${input.grade}
- Topic: ${input.topic}
- Number of questions: ${input.questionCount}
- Difficulty: ${input.difficulty}
${input.additionalInstructions ? `- Additional Teacher Instructions: ${input.additionalInstructions}\n` : ''}

Make sure questions are unambiguous and cover the core concepts of the topic.
${input.paragraphText ? `\nUse the following textbook content as the source of truth for the questions:\n"""\n${input.paragraphText}\n"""\n` : ''}
    `;

    const { object } = await generateObject({
      model: this.model,
      system: this.systemPrompt,
      prompt,
      schema: TestGeneratorOutputSchema,
    });

    return object;
  }
}
