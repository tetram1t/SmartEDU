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
You are an expert test creator for schools in Belarus (10-point grading system implicitly supported by varying question difficulties).
Your task is to generate a comprehensive test with high-quality questions and accurate answers.
Provide output strictly in JSON. The language must be Russian.
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

Make sure questions are unambiguous and cover the core concepts of the topic.
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
