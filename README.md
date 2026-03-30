# 🎓 SmartEDU — Интеллектуальная Платформа для Учителей

**SmartEDU** — это современная экосистема для автоматизации образовательных процессов, созданная специально под стандарты обучения в Беларуси. Платформа использует мощь ИИ-агентов для того, чтобы освободить учителей от рутины и дать им больше времени на общение с учениками.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![tRPC](https://img.shields.io/badge/tRPC-v10-2596be?style=for-the-badge&logo=trpc)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748?style=for-the-badge&logo=prisma)
![Gemini AI](https://img.shields.io/badge/AI-Google_Gemini-orange?style=for-the-badge&logo=google-gemini)

---

## ✨ Основные возможности

### 🤖 ИИ-Агенты (на базе Gemini 1.5/2.0 Flash)
*   **Генератор Планов Уроков**: Создает детализированные планы в формате JSON на русском языке. Учитывает учебники (через PDF), уровень класса и специфические методические требования.
*   **Генератор Тестов**: Создает проверочные работы с вопросами разных уровней когнитивной сложности (Знание, Применение, Анализ). Поддерживает одиночный выбор, множественный выбор и краткие ответы.
*   **Учет Инструкций**: Агенты «слышат» учителя — вы можете попросить составить план в игровой форме или тест повышенной сложности.

### 👩‍🏫 Дашборд Учителя
*   Управление классами и предметами.
*   Библиотека сохраненных уроков и тестов.
*   Быстрый просмотр и редактирование сгенерированного контента.

### 📸 OCR Проверка (В разработке 🚀)
*   Распознавание рукописного и печатного текста с фотографий тетрадей через **Tesseract.js**.
*   Автоматическое сравнение ответов ученика с ключом теста и выставление предварительной оценки.

---

## 🛠 Технологический стек

*   **Frontend**: Next.js 14 (App Router), Tailwind CSS, Shadcn/UI.
*   **Backend**: tRPC (Type-safe API), Next.js Server Actions.
*   **Database**: SQLite + Prisma ORM (быстрое развертывание и надежность).
*   **AI Engine**: Google Generative AI (Gemini API) через Vercel AI SDK.
*   **Monorepo**: Turborepo (разделение на `apps/web` и `packages/*`).

---

## 🚀 Быстрый старт

### 1. Клонирование и установка
```bash
git clone https://github.com/tetram1t/SmartEDU.git
cd SmartEDU
npm install
```

### 2. Настройка окружения
Создайте файл `apps/web/.env`:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
GEMINI_API_KEY="your-google-gemini-key"
USE_MOCK_AI=false
```

### 3. Подготовка базы данных
```bash
npx prisma generate --schema=packages/db/prisma/schema.prisma
npx prisma db push --schema=packages/db/prisma/schema.prisma
```

### 4. Запуск проекта
```bash
npm run dev
```
Откройте [http://localhost:3000](http://localhost:3000) в браузере.

---

## 📂 Структура проекта

*   `apps/web` — Основное веб-приложение.
*   `packages/ai-agents` — Логика ИИ-агентов и системные промпты.
*   `packages/db` — Схема Prisma и клиент базы данных.
*   `packages/shared` — Общие типы и константы.

---

## 🤝 Авторы
Разработку ведут **nadinpetja** и команда SmartEDU. 

---

> **SmartEDU** — учите с удовольствием, а рутину оставьте нам! 💡
