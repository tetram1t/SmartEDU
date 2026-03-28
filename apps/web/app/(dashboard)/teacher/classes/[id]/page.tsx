"use client";

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { GradeDisplay } from "@/components/ui/grade-display";

export default function ClassDetailsPage({ params }: { params: { id: string } }) {
  const students = [
    { id: "1", firstName: "Иван", lastName: "Иванов", avgScore: 8.5 },
    { id: "2", firstName: "Анна", lastName: "Петрова", avgScore: 9.2 },
  ];

  const columns = [
    { header: "Ученик", accessor: (row: any) => <div className="font-medium">{row.lastName} {row.firstName}</div> },
    { header: "Средний балл", accessor: (row: any) => <GradeDisplay score={Math.round(row.avgScore)} size="sm" /> },
    { header: "Действия", accessor: () => <Button variant="ghost" size="sm">Оценить работу</Button> }
  ];

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <Link href="/teacher/classes"><ArrowLeft className="h-4 w-4 mr-2" /> Назад к классам</Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white">Список учеников</h1>
        <p className="text-surface-500 dark:text-surface-400">Управление успеваемостью класса</p>
      </div>

      <DataTable columns={columns} data={students} />
    </div>
  );
}
