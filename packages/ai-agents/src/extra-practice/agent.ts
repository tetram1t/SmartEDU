import { generateObject } from 'ai';
import { z } from 'zod';
import { BaseAgent, AgentConfig } from '../core/agent-base';
import { smartModel } from '../core/llm-provider';

export const ExtraPracticeInputSchema = z.object({
  studentName: z.string(),
  gradeLevel: z.number(),
  subject: z.string(),
  weakTopics: z.array(z.string()),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium')
});

export type ExtraPracticeInput = z.infer<typeof ExtraPracticeInputSchema>;

export const ExtraPracticeOutputSchema = z.object({
  title: z.string().describe("Title of the practice assignment"),
  motivationText: z.string().describe("Encouraging text explaining why these exercises will help"),
  exercises: z.array(z.object({
    instruction: z.string(),
    content: z.string().describe("The exercise text or problem"),
    hints: z.array(z.string()).optional()
  }))
});

export type ExtraPracticeOutput = z.infer<typeof ExtraPracticeOutputSchema>;

export class ExtraPracticeAgent extends BaseAgent<ExtraPracticeInput, ExtraPracticeOutput> {
  constructor(config?: Partial<AgentConfig>) {
    super({
      model: config?.model || smartModel,
      systemPrompt: config?.systemPrompt || `
You are an expert tutor in Belarus generating targeted, customized homework assignments to help students improve in their weak areas.
Output strict JSON matching the schema. The language must be Russian.
      `
    });
  }

  async execute(input: ExtraPracticeInput): Promise<ExtraPracticeOutput> {
    const prompt = `
Generate extra practice for ${input.studentName} in grade ${input.gradeLevel} for the subject ${input.subject}.
They struggled with these topics currently: ${input.weakTopics.join(", ")}.
Design exercises of ${input.difficulty} difficulty to specifically target these weaknesses.
    `;

    const { object } = await generateObject({
      model: this.model,
      system: this.systemPrompt,
      prompt,
      schema: ExtraPracticeOutputSchema,
    });

    return object;
  }
}
