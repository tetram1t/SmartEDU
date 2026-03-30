import { router, teacherProcedure } from "../trpc";
import { z } from "zod";
import { LessonPlanInputSchema, LessonPlannerAgent, TestGeneratorInputSchema, TestGeneratorAgent } from "@smartedu/ai-agents";
import { TRPCError } from "@trpc/server";
import { Difficulty, TestType, QuestionType } from "@smartedu/shared";

// PDF Parsing lazy loading
let pdfParse: any = null;

async function getPdfText(base64: string) {
  if (!pdfParse) {
    pdfParse = require("pdf-parse"); // Dynamic import to prevent Edge runtime issues
  }
  const buffer = Buffer.from(base64, "base64");
  const data = await pdfParse(buffer);
  return data.text;
}

export const teacherRouter = router({
  getStats: teacherProcedure.query(async ({ ctx }) => {
    const teacherId = ctx.session.user.id;

    const [classesCount, lessonsCount] = await Promise.all([
      ctx.prisma.teacherSubject.count({ where: { teacherId } }),
      ctx.prisma.lessonPlan.count({ where: { teacherId } }),
    ]);

    return {
      classesCount,
      lessonsCount,
      worksToReview: 0, // Placeholder
    };
  }),
  
  getMyClasses: teacherProcedure.query(async ({ ctx }) => {
    const teacherId = ctx.session.user.id;
    
    const relations = await ctx.prisma.teacherSubject.findMany({
      where: { teacherId },
      include: {
        class: true,
        subject: true
      }
    });

    return relations.map(r => ({
      class: r.class,
      subject: r.subject
    }));
  }),
  
  // Lesson Plans
  getLessons: teacherProcedure.query(async ({ ctx }) => {
    return ctx.prisma.lessonPlan.findMany({
      where: { teacherId: ctx.session.user.id },
      include: { class: true, subject: true, topic: true },
      orderBy: { createdAt: 'desc' }
    });
  }),
  
  generateLessonDraft: teacherProcedure
    .input(LessonPlanInputSchema.extend({ pdfBase64: z.string().optional() }))
    .mutation(async ({ input }) => {
      try {
        if (process.env.USE_MOCK_AI === "true") {
          return {
            title: "Демо-урок: " + input.topic,
            objective: "Изучить базовые понятия " + input.topic,
            stages: [
              { name: "Разминка", duration: 5, description: "Проверка домашнего задания", activities: ["Фронтальный опрос"] },
              { name: "Новый материал", duration: 20, description: "Объяснение темы: " + input.topic, activities: ["Рассказ учителя", "Демонстрация"] },
              { name: "Закрепление", duration: 15, description: "Решение задач по теме", activities: ["Работа у доски"] },
              { name: "Итоги", duration: 5, description: "Рефлексия", activities: ["Ответы на вопросы"] },
            ],
            homework: "Прочитать параграф в учебнике."
          };
        }

        let paragraphText = input.paragraphText;
        if (input.pdfBase64) {
          paragraphText = await getPdfText(input.pdfBase64);
        }
        
        const agent = new LessonPlannerAgent();
        const draft = await agent.execute({
          ...input,
          paragraphText
        });
        return draft;
      } catch (error) {
        console.error("AI GENERATION ERROR [LESSON]:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "AI Generation failed",
        });
      }
    }),
    
  saveLesson: teacherProcedure
    .input(z.object({
      title: z.string(),
      objective: z.string(),
      content: z.any(), // JSON from draft
      gradeLevel: z.number(),
      duration: z.number(),
      subjectId: z.string(),
      classId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.lessonPlan.create({
        data: {
          title: input.title,
          objective: input.objective,
          content: JSON.stringify(input.content),
          gradeLevel: input.gradeLevel,
          duration: input.duration,
          teacherId: ctx.session.user.id,
          subjectId: input.subjectId,
          classId: input.classId,
        }
      });
    }),

  getLessonById: teacherProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const lesson = await ctx.prisma.lessonPlan.findUnique({
        where: { id: input, teacherId: ctx.session.user.id },
        include: { class: true, subject: true, topic: true }
      });
      if (!lesson) throw new TRPCError({ code: "NOT_FOUND" });
      return lesson;
    }),

  // Tests
  getTests: teacherProcedure.query(async ({ ctx }) => {
    return ctx.prisma.test.findMany({
      where: { teacherId: ctx.session.user.id },
      include: { class: true, subject: true },
      orderBy: { createdAt: 'desc' }
    });
  }),
  
  generateTestDraft: teacherProcedure
    .input(TestGeneratorInputSchema.extend({ pdfBase64: z.string().optional() }))
    .mutation(async ({ input }) => {
      try {
        if (process.env.USE_MOCK_AI === "true") {
          return {
            title: "Тест: " + input.topic,
            description: "Проверка знаний по теме: " + input.topic,
            questions: [
              {
                text: `Какое определение наиболее точно описывает '${input.topic}'?`,
                type: "SINGLE_CHOICE",
                options: ["Базовое определение", "Ложное утверждение А", "Ложное утверждение Б", "Не относится к теме"],
                correctAnswer: "Базовое определение",
                points: 2,
                explanation: "Это классическое определение из учебного пособия."
              },
              {
                text: `Выберите характеристики, присущие '${input.topic}':`,
                type: "MULTIPLE_CHOICE",
                options: ["Свойство 1", "Свойство 2", "Противоположное свойство", "Случайный факт"],
                correctAnswer: ["Свойство 1", "Свойство 2"],
                points: 4,
                explanation: "Данные свойства являются ключевыми для этой темы."
              },
              {
                text: `Назовите основной термин, связанный с '${input.topic}':`,
                type: "SHORT_ANSWER",
                options: [],
                correctAnswer: "Термин",
                points: 4,
                explanation: "Этот термин является фундаментальным в рамках данного раздела."
              }
            ]
          };
        }

        let paragraphText = input.paragraphText;
        if (input.pdfBase64) {
          paragraphText = await getPdfText(input.pdfBase64);
        }
        
        const agent = new TestGeneratorAgent();
        const draft = await agent.execute({
          ...input,
          paragraphText
        });
        return draft;
      } catch (error) {
        console.error("AI GENERATION ERROR [TEST]:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "AI Generation failed",
        });
      }
    }),
    
  saveTest: teacherProcedure
    .input(z.object({
      title: z.string(),
      description: z.string().optional(),
      difficulty: z.nativeEnum(Difficulty),
      subjectId: z.string(),
      classId: z.string().optional(),
      questions: z.array(z.object({
        text: z.string(),
        type: z.nativeEnum(QuestionType),
        options: z.any(),
        correctAnswer: z.any(),
        points: z.number(),
        explanation: z.string().optional()
      }))
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.test.create({
          data: {
            title: input.title,
            description: input.description,
            difficulty: input.difficulty,
            type: TestType.QUIZ,
            teacherId: ctx.session.user.id,
            subjectId: input.subjectId,
            classId: input.classId,
            questions: {
              create: input.questions.map((q, idx) => ({
                text: q.text,
                type: q.type,
                options: q.options ? JSON.stringify(q.options) : null,
                correctAnswer: JSON.stringify(q.correctAnswer),
                points: q.points,
                explanation: q.explanation,
                order: idx
              }))
            }
          }
        });
      } catch (error) {
        console.error("SAVE TEST ERROR:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to save test",
        });
      }
    }),

  getTestById: teacherProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const test = await ctx.prisma.test.findUnique({
        where: { id: input, teacherId: ctx.session.user.id },
        include: { 
          class: true, 
          subject: true, 
          questions: {
            orderBy: { order: 'asc' }
          } 
        }
      });
      if (!test) throw new TRPCError({ code: "NOT_FOUND" });
      return test;
    }),
});
