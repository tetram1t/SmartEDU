import { z } from 'zod';

// ============================================
// SmartEDU — Zod Validation Schemas
// ============================================

// --- Auth ---
export const loginSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
  firstName: z.string().min(1, 'Введите имя'),
  lastName: z.string().min(1, 'Введите фамилию'),
  patronymic: z.string().optional(),
  role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
  schoolId: z.string().min(1, 'Выберите школу'),
  classId: z.string().optional(), // for students
});
export type RegisterInput = z.infer<typeof registerSchema>;

// --- School ---
export const createSchoolSchema = z.object({
  name: z.string().min(2, 'Минимум 2 символа'),
  address: z.string().optional(),
});
export type CreateSchoolInput = z.infer<typeof createSchoolSchema>;

// --- Class ---
export const createClassSchema = z.object({
  name: z.string().min(1, 'Введите название класса'),
  grade: z.number().int().min(1).max(11),
  parallel: z.string().optional(),
  year: z.number().int().min(2020).max(2030),
});
export type CreateClassInput = z.infer<typeof createClassSchema>;

// --- Subject ---
export const createSubjectSchema = z.object({
  name: z.string().min(1, 'Введите название предмета'),
});
export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;

// --- Topic ---
export const createTopicSchema = z.object({
  name: z.string().min(1, 'Введите название темы'),
  subjectId: z.string().min(1),
  order: z.number().int().min(0).default(0),
});
export type CreateTopicInput = z.infer<typeof createTopicSchema>;

// --- Lesson Plan ---
export const createLessonPlanSchema = z.object({
  subjectId: z.string().min(1, 'Выберите предмет'),
  classId: z.string().optional(),
  topicId: z.string().optional(),
  topic: z.string().min(1, 'Введите тему урока'),
  grade: z.number().int().min(1).max(11),
  duration: z.number().int().min(15).max(90).default(45),
  objective: z.string().optional(),
  paragraphText: z.string().optional(),
  studentLevel: z.enum(['basic', 'advanced', 'mixed']).default('mixed'),
});
export type CreateLessonPlanInput = z.infer<typeof createLessonPlanSchema>;

// --- Test Generation ---
export const generateTestSchema = z.object({
  subjectId: z.string().min(1, 'Выберите предмет'),
  classId: z.string().optional(),
  topicId: z.string().optional(),
  topic: z.string().min(1, 'Введите тему'),
  grade: z.number().int().min(1).max(11),
  questionCount: z.number().int().min(1).max(30).default(10),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'MIXED']).default('MEDIUM'),
  questionTypes: z.array(z.enum([
    'SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'MATCHING', 'SHORT_ANSWER', 'OPEN_ANSWER',
  ])).min(1).default(['SINGLE_CHOICE']),
  variantCount: z.number().int().min(1).max(4).default(1),
  includeAnswerKey: z.boolean().default(true),
});
export type GenerateTestInput = z.infer<typeof generateTestSchema>;

// --- Grade ---
export const gradeSchema = z.object({
  score: z.number().int().min(1).max(10),
  maxScore: z.number().int().default(10),
  isFinal: z.boolean().default(false),
});
export type GradeInput = z.infer<typeof gradeSchema>;

// --- Comment ---
export const commentSchema = z.object({
  text: z.string().min(1, 'Введите комментарий'),
  type: z.enum(['MANUAL', 'GENERATED', 'TEMPLATE']).default('MANUAL'),
});
export type CommentInput = z.infer<typeof commentSchema>;

// --- Assignment ---
export const createAssignmentSchema = z.object({
  title: z.string().min(1, 'Введите название'),
  description: z.string().min(1, 'Введите описание'),
  type: z.enum(['HOMEWORK', 'CLASSWORK', 'EXTRA', 'SELF_STUDY']),
  subjectId: z.string().min(1),
  classId: z.string().min(1),
  topicId: z.string().optional(),
  dueDate: z.string().optional(),
  maxScore: z.number().int().min(1).max(10).default(10),
});
export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;

// --- Feedback Generation ---
export const generateFeedbackSchema = z.object({
  studentName: z.string(),
  subject: z.string(),
  score: z.number(),
  maxScore: z.number(),
  errors: z.array(z.string()).default([]),
  strengths: z.array(z.string()).default([]),
  previousScores: z.array(z.number()).default([]),
});
export type GenerateFeedbackInput = z.infer<typeof generateFeedbackSchema>;
