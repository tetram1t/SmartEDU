// ============================================
// SmartEDU — Constants
// ============================================

// Белорусская 10-балльная система оценок
export const GRADE_SCALE = {
  MIN: 1,
  MAX: 10,
  LABELS: {
    1: 'Неудовлетворительно',
    2: 'Почти неудовлетворительно',
    3: 'Удовлетворительно',
    4: 'Почти средне',
    5: 'Средне',
    6: 'Почти хорошо',
    7: 'Хорошо',
    8: 'Почти отлично',
    9: 'Отлично',
    10: 'Превосходно',
  } as Record<number, string>,
  COLORS: {
    1: '#ef4444', // red
    2: '#f97316', // orange
    3: '#f59e0b', // amber
    4: '#eab308', // yellow
    5: '#84cc16', // lime
    6: '#22c55e', // green
    7: '#14b8a6', // teal
    8: '#06b6d4', // cyan
    9: '#3b82f6', // blue
    10: '#8b5cf6', // violet
  } as Record<number, string>,
} as const;

// Предметы по умолчанию для белорусских школ
export const DEFAULT_SUBJECTS = [
  'Математика',
  'Алгебра',
  'Геометрия',
  'Русский язык',
  'Русская литература',
  'Белорусский язык',
  'Белорусская литература',
  'Английский язык',
  'Физика',
  'Химия',
  'Биология',
  'История Беларуси',
  'Всемирная история',
  'География',
  'Информатика',
  'Обществоведение',
  'Астрономия',
  'Физическая культура и здоровье',
  'Трудовое обучение',
  'Черчение',
] as const;

// Классы (1-11)
export const GRADE_LEVELS = Array.from({ length: 11 }, (_, i) => i + 1);

// Параллели
export const CLASS_PARALLELS = ['А', 'Б', 'В', 'Г', 'Д'] as const;

// Учебный год
export const getCurrentSchoolYear = (): number => {
  const now = new Date();
  return now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1;
};

// Продолжительность уроков (минут)
export const LESSON_DURATIONS = [30, 35, 40, 45, 60, 80, 90] as const;

// Максимальное количество фото в пакете
export const MAX_BATCH_UPLOAD = 50;

// Поддерживаемые форматы изображений
export const SUPPORTED_IMAGE_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
] as const;

// Максимальный размер файла (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Роли на русском
export const ROLE_LABELS = {
  STUDENT: 'Ученик',
  TEACHER: 'Учитель',
  ADMIN: 'Администратор',
} as const;

// Типы тестов на русском
export const TEST_TYPE_LABELS = {
  QUIZ: 'Тест',
  EXAM: 'Контрольная работа',
  HOMEWORK: 'Домашнее задание',
  PRACTICE: 'Тренировочный',
} as const;

// Типы вопросов на русском
export const QUESTION_TYPE_LABELS = {
  SINGLE_CHOICE: 'Один правильный ответ',
  MULTIPLE_CHOICE: 'Несколько правильных ответов',
  MATCHING: 'Соответствие',
  SHORT_ANSWER: 'Короткий ответ',
  OPEN_ANSWER: 'Открытый ответ',
} as const;

// Сложность на русском
export const DIFFICULTY_LABELS = {
  EASY: 'Лёгкий',
  MEDIUM: 'Средний',
  HARD: 'Сложный',
  MIXED: 'Смешанный',
} as const;

// Статусы работ на русском
export const WORK_STATUS_LABELS = {
  SUBMITTED: 'Сдана',
  PROCESSING: 'Обрабатывается',
  REVIEWED: 'Проверена',
  RETURNED: 'Возвращена',
  GRADED: 'Оценена',
} as const;
