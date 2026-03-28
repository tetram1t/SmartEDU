import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.gradeAudit.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.ocrResult.deleteMany();
  await prisma.studentWorkImage.deleteMany();
  await prisma.studentWork.deleteMany();
  await prisma.testQuestion.deleteMany();
  await prisma.testVariant.deleteMany();
  await prisma.test.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.lessonPlan.deleteMany();
  await prisma.extraPractice.deleteMany();
  await prisma.textbookParagraph.deleteMany();
  await prisma.textbook.deleteMany();
  await prisma.teacherSubject.deleteMany();
  await prisma.studentClass.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.class.deleteMany();
  await prisma.user.deleteMany();
  await prisma.school.deleteMany();
  await prisma.backgroundJob.deleteMany();

  // --- School ---
  const school = await prisma.school.create({
    data: {
      name: 'Лицей №2 г. Минска',
      address: 'г. Минск, ул. Образцовая, 15',
    },
  });
  console.log('✅ School created');

  // --- Users ---
  const admin = await prisma.user.create({
    data: {
      email: 'admin@smartedu.by',
      passwordHash: hashPassword('admin123'),
      firstName: 'Ирина',
      lastName: 'Козлова',
      patronymic: 'Сергеевна',
      role: 'ADMIN',
      schoolId: school.id,
    },
  });

  const teacher1 = await prisma.user.create({
    data: {
      email: 'teacher@smartedu.by',
      passwordHash: hashPassword('teacher123'),
      firstName: 'Елена',
      lastName: 'Петрова',
      patronymic: 'Викторовна',
      role: 'TEACHER',
      schoolId: school.id,
    },
  });

  const teacher2 = await prisma.user.create({
    data: {
      email: 'teacher2@smartedu.by',
      passwordHash: hashPassword('teacher123'),
      firstName: 'Андрей',
      lastName: 'Сидоров',
      patronymic: 'Николаевич',
      role: 'TEACHER',
      schoolId: school.id,
    },
  });

  const teacher3 = await prisma.user.create({
    data: {
      email: 'teacher3@smartedu.by',
      passwordHash: hashPassword('teacher123'),
      firstName: 'Ольга',
      lastName: 'Кузьменко',
      patronymic: 'Александровна',
      role: 'TEACHER',
      schoolId: school.id,
    },
  });

  console.log('✅ Teachers created');

  // --- Classes ---
  const class10a = await prisma.class.create({
    data: { name: '10А', grade: 10, parallel: 'А', year: 2025, schoolId: school.id },
  });
  const class10b = await prisma.class.create({
    data: { name: '10Б', grade: 10, parallel: 'Б', year: 2025, schoolId: school.id },
  });
  const class11a = await prisma.class.create({
    data: { name: '11А', grade: 11, parallel: 'А', year: 2025, schoolId: school.id },
  });
  console.log('✅ Classes created');

  // --- Subjects ---
  const math = await prisma.subject.create({
    data: { name: 'Математика', schoolId: school.id },
  });
  const physics = await prisma.subject.create({
    data: { name: 'Физика', schoolId: school.id },
  });
  const russian = await prisma.subject.create({
    data: { name: 'Русский язык', schoolId: school.id },
  });
  const history = await prisma.subject.create({
    data: { name: 'История Беларуси', schoolId: school.id },
  });
  const informatics = await prisma.subject.create({
    data: { name: 'Информатика', schoolId: school.id },
  });
  console.log('✅ Subjects created');

  // --- Topics ---
  const topics = await Promise.all([
    prisma.topic.create({ data: { name: 'Квадратные уравнения', order: 1, subjectId: math.id } }),
    prisma.topic.create({ data: { name: 'Тригонометрия', order: 2, subjectId: math.id } }),
    prisma.topic.create({ data: { name: 'Логарифмы', order: 3, subjectId: math.id } }),
    prisma.topic.create({ data: { name: 'Механика', order: 1, subjectId: physics.id } }),
    prisma.topic.create({ data: { name: 'Электричество', order: 2, subjectId: physics.id } }),
    prisma.topic.create({ data: { name: 'Пунктуация', order: 1, subjectId: russian.id } }),
    prisma.topic.create({ data: { name: 'Морфология', order: 2, subjectId: russian.id } }),
  ]);
  console.log('✅ Topics created');

  // --- Teacher-Subject-Class mappings ---
  await prisma.teacherSubject.createMany({
    data: [
      { teacherId: teacher1.id, subjectId: math.id, classId: class10a.id },
      { teacherId: teacher1.id, subjectId: math.id, classId: class10b.id },
      { teacherId: teacher1.id, subjectId: math.id, classId: class11a.id },
      { teacherId: teacher2.id, subjectId: physics.id, classId: class10a.id },
      { teacherId: teacher2.id, subjectId: physics.id, classId: class11a.id },
      { teacherId: teacher2.id, subjectId: informatics.id, classId: class10a.id },
      { teacherId: teacher3.id, subjectId: russian.id, classId: class10a.id },
      { teacherId: teacher3.id, subjectId: russian.id, classId: class10b.id },
      { teacherId: teacher3.id, subjectId: history.id, classId: class11a.id },
    ],
  });
  console.log('✅ Teacher-Subject-Class mappings created');

  // --- Students ---
  const studentNames = [
    { first: 'Алексей', last: 'Иванов', classId: class10a.id },
    { first: 'Мария', last: 'Смирнова', classId: class10a.id },
    { first: 'Даниил', last: 'Козлов', classId: class10a.id },
    { first: 'Анна', last: 'Новикова', classId: class10a.id },
    { first: 'Кирилл', last: 'Морозов', classId: class10a.id },
    { first: 'Екатерина', last: 'Волкова', classId: class10b.id },
    { first: 'Артём', last: 'Лебедев', classId: class10b.id },
    { first: 'Полина', last: 'Соколова', classId: class10b.id },
    { first: 'Максим', last: 'Попов', classId: class10b.id },
    { first: 'Виктория', last: 'Павлова', classId: class10b.id },
    { first: 'Дмитрий', last: 'Николаев', classId: class11a.id },
    { first: 'София', last: 'Фёдорова', classId: class11a.id },
    { first: 'Егор', last: 'Михайлов', classId: class11a.id },
    { first: 'Ульяна', last: 'Гончарова', classId: class11a.id },
    { first: 'Тимофей', last: 'Белов', classId: class11a.id },
  ];

  const students = [];
  for (let i = 0; i < studentNames.length; i++) {
    const s = studentNames[i];
    const student = await prisma.user.create({
      data: {
        email: `student${i + 1}@smartedu.by`,
        passwordHash: hashPassword('student123'),
        firstName: s.first,
        lastName: s.last,
        role: 'STUDENT',
        schoolId: school.id,
      },
    });
    await prisma.studentClass.create({
      data: { studentId: student.id, classId: s.classId },
    });
    students.push(student);
  }
  console.log('✅ Students created');

  // --- Sample Test ---
  const test1 = await prisma.test.create({
    data: {
      title: 'Тест: Квадратные уравнения',
      description: 'Проверочный тест по теме "Квадратные уравнения" для 10 класса',
      type: 'QUIZ',
      difficulty: 'MEDIUM',
      timeLimit: 30,
      teacherId: teacher1.id,
      subjectId: math.id,
      classId: class10a.id,
      topicId: topics[0].id,
      answerKey: JSON.stringify({
        '1': 'B',
        '2': 'C',
        '3': 'A',
        '4': 'D',
        '5': 'B',
      }),
    },
  });

  await prisma.testQuestion.createMany({
    data: [
      {
        text: 'Решите уравнение: x² - 5x + 6 = 0',
        type: 'SINGLE_CHOICE',
        options: JSON.stringify(['x = 1, x = 6', 'x = 2, x = 3', 'x = -2, x = -3', 'x = 1, x = 5']),
        correctAnswer: JSON.stringify('B'),
        points: 2,
        explanation: 'Разложим: (x-2)(x-3) = 0, значит x = 2 или x = 3',
        order: 1,
        testId: test1.id,
      },
      {
        text: 'Дискриминант уравнения x² + 4x + 4 = 0 равен:',
        type: 'SINGLE_CHOICE',
        options: JSON.stringify(['16', '8', '0', '-16']),
        correctAnswer: JSON.stringify('C'),
        points: 1,
        explanation: 'D = b² - 4ac = 16 - 16 = 0',
        order: 2,
        testId: test1.id,
      },
      {
        text: 'Сколько корней имеет уравнение x² + 1 = 0 в действительных числах?',
        type: 'SINGLE_CHOICE',
        options: JSON.stringify(['Нет корней', '1 корень', '2 корня', 'Бесконечно много']),
        correctAnswer: JSON.stringify('A'),
        points: 1,
        explanation: 'D = 0 - 4 = -4 < 0, действительных корней нет',
        order: 3,
        testId: test1.id,
      },
      {
        text: 'Формула корней квадратного уравнения ax² + bx + c = 0:',
        type: 'SINGLE_CHOICE',
        options: JSON.stringify([
          'x = -b / 2a',
          'x = b ± √(b²-4ac) / 2a',
          'x = -b ± √(b²+4ac) / 2a',
          'x = (-b ± √(b²-4ac)) / 2a',
        ]),
        correctAnswer: JSON.stringify('D'),
        points: 2,
        order: 4,
        testId: test1.id,
      },
      {
        text: 'Произведение корней уравнения x² - 7x + 12 = 0 равно:',
        type: 'SINGLE_CHOICE',
        options: JSON.stringify(['7', '12', '-12', '-7']),
        correctAnswer: JSON.stringify('B'),
        points: 1,
        explanation: 'По теореме Виета: x₁·x₂ = c/a = 12',
        order: 5,
        testId: test1.id,
      },
    ],
  });
  console.log('✅ Sample test created');

  // --- Sample Assignment ---
  const assignment1 = await prisma.assignment.create({
    data: {
      title: 'Домашнее задание: Квадратные уравнения',
      description: 'Решить задачи 1-5 из параграфа 12. Показать ход решения.',
      type: 'HOMEWORK',
      dueDate: new Date('2025-10-15'),
      maxScore: 10,
      teacherId: teacher1.id,
      subjectId: math.id,
      classId: class10a.id,
      topicId: topics[0].id,
    },
  });
  console.log('✅ Sample assignment created');

  // --- Sample Student Works with Grades ---
  const scores = [8, 9, 6, 7, 10, 5, 9, 8, 4, 7, 9, 6, 8, 7, 10];
  for (let i = 0; i < 5; i++) {
    const work = await prisma.studentWork.create({
      data: {
        status: 'GRADED',
        studentId: students[i].id,
        testId: test1.id,
      },
    });

    await prisma.grade.create({
      data: {
        score: scores[i],
        maxScore: 10,
        isAutomatic: false,
        isFinal: true,
        workId: work.id,
        gradedById: teacher1.id,
      },
    });

    await prisma.comment.create({
      data: {
        text: getComment(scores[i]),
        type: 'GENERATED',
        workId: work.id,
        authorId: teacher1.id,
      },
    });
  }
  console.log('✅ Sample student works & grades created');

  // --- Sample Lesson Plan ---
  await prisma.lessonPlan.create({
    data: {
      title: 'Квадратные уравнения. Формула дискриминанта.',
      objective: 'Научить учащихся решать квадратные уравнения с помощью формулы дискриминанта',
      duration: 45,
      gradeLevel: 10,
      content: JSON.stringify({
        stages: [
          {
            name: 'Организационный момент',
            duration: 2,
            description: 'Приветствие, проверка готовности к уроку',
            activities: ['Проверка домашнего задания'],
          },
          {
            name: 'Актуализация знаний',
            duration: 5,
            description: 'Повторение понятия квадратного уравнения',
            activities: ['Устный опрос', 'Примеры на доске'],
          },
          {
            name: 'Объяснение нового материала',
            duration: 15,
            description: 'Вывод формулы дискриминанта и формулы корней',
            activities: ['Лекция с примерами', 'Запись формул в тетрадь'],
          },
          {
            name: 'Закрепление',
            duration: 15,
            description: 'Решение задач у доски и самостоятельно',
            activities: ['Решение 3 уравнений у доски', 'Самостоятельная работа (2 уравнения)'],
          },
          {
            name: 'Подведение итогов',
            duration: 5,
            description: 'Обсуждение результатов, ответы на вопросы',
            activities: ['Рефлексия', 'Выставление оценок за активность'],
          },
          {
            name: 'Домашнее задание',
            duration: 3,
            description: 'Параграф 12, задачи 1-5',
            activities: ['Запись домашнего задания'],
          },
        ],
        homework: 'Параграф 12. Задачи 1-5 (решить с подробным объяснением)',
        differentiation: {
          basic: 'Задачи 1-3 (простые квадратные уравнения)',
          advanced: 'Задачи 4-5 + дополнительно: составить своё квадратное уравнение с заданными корнями',
        },
      }),
      teacherId: teacher1.id,
      subjectId: math.id,
      classId: class10a.id,
      topicId: topics[0].id,
    },
  });
  console.log('✅ Sample lesson plan created');

  console.log('\n🎉 Database seeded successfully!\n');
  console.log('📋 Demo accounts:');
  console.log('   Admin:   admin@smartedu.by / admin123');
  console.log('   Teacher: teacher@smartedu.by / teacher123');
  console.log('   Student: student1@smartedu.by / student123');
}

function getComment(score: number): string {
  if (score >= 9) return 'Отличная работа! Все задания выполнены верно. Продолжай в том же духе!';
  if (score >= 7) return 'Хорошая работа! Есть небольшие неточности, но в целом материал усвоен хорошо.';
  if (score >= 5) return 'Удовлетворительный результат. Рекомендую повторить формулу дискриминанта и решить дополнительные примеры.';
  return 'Нужно подтянуть знания по теме. Рекомендую перечитать параграф 12 и обратиться за помощью.';
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
