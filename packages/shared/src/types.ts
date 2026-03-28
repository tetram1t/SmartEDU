// ============================================
// SmartEDU — Core Types
// ============================================

// --- Roles ---
export enum Role {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
}

// --- User ---
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  patronymic?: string;
  role: Role;
  avatarUrl?: string;
  isActive: boolean;
  schoolId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithSchool extends User {
  school: School;
}

// --- School ---
export interface School {
  id: string;
  name: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

// --- Class ---
export interface SchoolClass {
  id: string;
  name: string;
  grade: number;
  parallel?: string;
  year: number;
  schoolId: string;
}

// --- Subject ---
export interface Subject {
  id: string;
  name: string;
  schoolId: string;
}

// --- Topic ---
export interface Topic {
  id: string;
  name: string;
  order: number;
  subjectId: string;
}

// --- Test ---
export enum TestType {
  QUIZ = 'QUIZ',
  EXAM = 'EXAM',
  HOMEWORK = 'HOMEWORK',
  PRACTICE = 'PRACTICE',
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  MIXED = 'MIXED',
}

export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  MATCHING = 'MATCHING',
  SHORT_ANSWER = 'SHORT_ANSWER',
  OPEN_ANSWER = 'OPEN_ANSWER',
}

export interface TestQuestion {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string | string[];
  points: number;
  explanation?: string;
  order: number;
}

export interface Test {
  id: string;
  title: string;
  description?: string;
  type: TestType;
  difficulty: Difficulty;
  timeLimit?: number;
  questions: TestQuestion[];
  teacherId: string;
  subjectId: string;
  classId?: string;
  topicId?: string;
  createdAt: Date;
}

// --- Work & Grading ---
export enum WorkStatus {
  SUBMITTED = 'SUBMITTED',
  PROCESSING = 'PROCESSING',
  REVIEWED = 'REVIEWED',
  RETURNED = 'RETURNED',
  GRADED = 'GRADED',
}

export enum AssignmentType {
  HOMEWORK = 'HOMEWORK',
  CLASSWORK = 'CLASSWORK',
  EXTRA = 'EXTRA',
  SELF_STUDY = 'SELF_STUDY',
}

export enum CommentType {
  MANUAL = 'MANUAL',
  GENERATED = 'GENERATED',
  TEMPLATE = 'TEMPLATE',
}

export interface Grade {
  id: string;
  score: number;
  maxScore: number;
  isAutomatic: boolean;
  isFinal: boolean;
  workId: string;
  gradedById: string;
  createdAt: Date;
}

// --- Lesson Plan ---
export interface LessonPlanStage {
  name: string;
  duration: number;
  description: string;
  activities: string[];
  materials?: string[];
}

export interface LessonPlan {
  id: string;
  title: string;
  objective: string;
  duration: number;
  stages: LessonPlanStage[];
  homework: string;
  differentiation?: {
    basic: string;
    advanced: string;
  };
  teacherId: string;
  subjectId: string;
  classId?: string;
  topicId?: string;
  isTemplate: boolean;
  createdAt: Date;
}

// --- Extra Practice ---
export enum ExtraPracticeType {
  GRADE_IMPROVEMENT = 'GRADE_IMPROVEMENT',
  SELF_STUDY = 'SELF_STUDY',
  WEAK_TOPICS = 'WEAK_TOPICS',
  ENRICHMENT = 'ENRICHMENT',
}

// --- Session / Auth ---
export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  schoolId: string;
}
