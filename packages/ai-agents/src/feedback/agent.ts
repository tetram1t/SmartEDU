import { generateObject } from 'ai';
import { z } from 'zod';
import { BaseAgent, AgentConfig } from '../core/agent-base';
import { fastModel } from '../core/llm-provider';

export const FeedbackInputSchema = z.object({
  studentName: z.string(),
  score: z.number(),
  maxScore: z.number().default(10),
  workTopic: z.string(),
  errors: z.array(z.string()).optional(),
});

export type FeedbackInput = z.infer<typeof FeedbackInputSchema>;

export const FeedbackOutputSchema = z.object({
  feedbackText: z.string().describe("A personalized, encouraging feedback message in Russian"),
  suggestedFocusAreas: z.array(z.string()).describe("List of topics or concepts the student should review")
});

export type FeedbackOutput = z.infer<typeof FeedbackOutputSchema>;

export class FeedbackAgent extends BaseAgent<FeedbackInput, FeedbackOutput> {
  constructor(config?: Partial<AgentConfig>) {
    super({
      model: config?.model || fastModel,
      systemPrompt: config?.systemPrompt || `
You are an empathetic, constructive, and experienced teacher in Belarus.
Your task is to provide supportive and actionable feedback to a student based on their test performance.
Always output valid JSON. The language must be Russian.
      `
    });
  }

  async execute(input: FeedbackInput): Promise<FeedbackOutput> {
    const prompt = `
Generate feedback for a student with the following context:
- Name: ${input.studentName}
- Score: ${input.score}/${input.maxScore}
- Topic: ${input.workTopic}
${input.errors && input.errors.length > 0 ? `- Errors made in: ${input.errors.join(", ")}` : ''}

Be encouraging for high scores, and supportive/constructive for low scores.
    `;

    const { object } = await generateObject({
      model: this.model,
      system: this.systemPrompt,
      prompt,
      schema: FeedbackOutputSchema,
    });

    return object;
  }
}
