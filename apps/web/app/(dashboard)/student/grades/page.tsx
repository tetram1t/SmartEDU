"use client";

import { DataTable } from "@/components/ui/data-table";
import { GradeDisplay } from "@/components/ui/grade-display";
import { Badge } from "@/components/ui/badge";

export default function StudentGradesPage() {
  const grades = [
    { id: "1", subject: "Математика", type: "Контрольная", score: 9, date: "15.05.2024" },
    { id: "2", subject: "Физика", type: "Домашняя работа", score: 8, date: "14.05.2024" },
    { id: "3", subject: "Информатика", type: "Тест", score: 10, date: "12.05.2024" },
  ];

  const columns = [
    { header: "Предмет", accessor: (row: any) => <span className="font-medium">{row.subject}</span> },
    { header: "Тип задания", accessor: (row: any) => <Badge variant="outline">{row.type}</Badge> },
    { header: "Дата", accessor: "date" },
    { header: "Оценка", accessor: (row: any) => <GradeDisplay score={row.score} size="sm" /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white">Мои оценки</h1>
        <p className="text-surface-500 dark:text-surface-400">История полученных оценок по предметам</p>
      </div>

      <DataTable columns={columns} data={grades} />
    </div>
  );
}
