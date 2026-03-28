"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";

export default function AdminClassesPage() {
  const [search, setSearch] = useState("");
  const classesData = [
    { id: "1", name: "10А", grade: 10, year: 2024, studentsCount: 25 },
    { id: "2", name: "11Б", grade: 11, year: 2024, studentsCount: 22 },
  ];

  const columns = [
    { header: "Название", accessor: "name" },
    { header: "Параллель", accessor: "grade" },
    { header: "Год", accessor: "year" },
    { header: "Учеников", accessor: "studentsCount" },
    {
      header: "Действия",
      accessor: () => <Button variant="ghost" size="sm">Редактировать</Button>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white">Классы</h1>
          <p className="text-surface-500 dark:text-surface-400">Управление классами школы</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Добавить класс</Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
          <Input placeholder="Поиск по названию..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      <DataTable columns={columns} data={classesData} />
    </div>
  );
}
