import { generateObject } from 'ai';
import { z } from 'zod';
import { BaseAgent, AgentConfig } from '../core/agent-base';
import { fastModel } from '../core/llm-provider';

export const AnalyticsInputSchema = z.object({
  className: z.string(),
  subject: z.string(),
  testTitle: z.string(),
  averageScore: z.number(),
  maxScore: z.number().default(10),
  scoresArray: z.array(z.number()),
  mostCommonErrors: z.array(z.string()).optional()
});

export type AnalyticsInput = z.infer<typeof AnalyticsInputSchema>;

export const AnalyticsOutputSchema = z.object({
  summary: z.string().describe("Short summary of the class performance"),
  insights: z.array(z.string()).describe("List of data-driven insights (e.g. bimodal distribution, overall poor performance on topic X)"),
  recommendations: z.array(z.string()).describe("Actionable advice for the teacher on what to do next")
});

export type AnalyticsOutput = z.infer<typeof AnalyticsOutputSchema>;

export class AnalyticsAgent extends BaseAgent<AnalyticsInput, AnalyticsOutput> {
  constructor(config?: Partial<AgentConfig>) {
    super({
      model: config?.model || fastModel,
      systemPrompt: config?.systemPrompt || `
You are a data-driven educational analyst in Belarus.
Analyze class performance metrics and provide actionable insights for the teacher.
Output strict JSON matching the schema. The language must be Russian.
      `
    });
  }

  async execute(input: AnalyticsInput): Promise<AnalyticsOutput> {
    const prompt = `
Analyze the performance for class ${input.className} in ${input.subject} on test "${input.testTitle}".
Average score: ${input.averageScore}/${input.maxScore}.
Distribution of scores: ${input.scoresArray.join(", ")}
${input.mostCommonErrors ? `The most common areas where students lost points: ${input.mostCommonErrors.join(", ")}` : ''}

Provide a deep analytical summary and specific recommendations.
    `;

    const { object } = await generateObject({
      model: this.model,
      system: this.systemPrompt,
      prompt,
      schema: AnalyticsOutputSchema,
    });

    return object;
  }
}
