import { generateObject } from 'ai';
import { z } from 'zod';
import { BaseAgent, AgentConfig } from '../core/agent-base';
import { smartModel } from '../core/llm-provider';

export const LessonPlanInputSchema = z.object({
  subject: z.string(),
  grade: z.number(),
  topic: z.string(),
  duration: z.number().default(45),
  objective: z.string().optional(),
  studentLevel: z.enum(['basic', 'advanced', 'mixed']).default('mixed'),
  paragraphText: z.string().optional(),
  additionalInstructions: z.string().optional(),
});

export type LessonPlanInput = z.infer<typeof LessonPlanInputSchema>;

export const LessonPlanOutputSchema = z.object({
  title: z.string().describe("The catchy title of the lesson"),
  objective: z.string().describe("Clear, measurable objective for the students"),
  stages: z.array(z.object({
    name: z.string().describe("Name of the lesson stage (e.g., Warm-up, Main concept)"),
    duration: z.number().describe("Duration in minutes"),
    description: z.string(),
    activities: z.array(z.string()).describe("Specific activities for the students"),
  })),
  homework: z.string().describe("Homework assignment description")
});

export type LessonPlanOutput = z.infer<typeof LessonPlanOutputSchema>;

export class LessonPlannerAgent extends BaseAgent<LessonPlanInput, LessonPlanOutput> {
  constructor(config?: Partial<AgentConfig>) {
    super({
      model: config?.model || smartModel,
      systemPrompt: config?.systemPrompt || `
You are an expert educational instructional designer and teacher in Belarus.
Your task is to generate highly structured, engaging, and practical lesson plans.
Always return your output as valid JSON matching the exact schema. 
Ensure the duration of all stages exactly sums up to the total requested lesson duration.
The language of the lesson plan must be Russian.
      `
    });
  }

  async execute(input: LessonPlanInput): Promise<LessonPlanOutput> {
    const prompt = `
Please create a lesson plan with the following constraints:
- Subject: ${input.subject}
- Grade Level: ${input.grade}
- Topic: ${input.topic}
- Duration: ${input.duration} minutes
- Student Level: ${input.studentLevel}
${input.objective ? `- Objective: ${input.objective}` : ''}
${input.additionalInstructions ? `- Additional Teacher Instructions: ${input.additionalInstructions}` : ''}
${input.paragraphText ? `\nHere is the textbook content to base the lesson on:\n"""\n${input.paragraphText}\n"""\n` : ''}
    `;

    const { object } = await generateObject({
      model: this.model,
      system: this.systemPrompt,
      prompt,
      schema: LessonPlanOutputSchema,
    });

    return object;
  }
}
