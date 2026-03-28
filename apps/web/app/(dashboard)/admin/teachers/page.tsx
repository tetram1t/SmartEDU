"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminTeachersPage() {
  const [search, setSearch] = useState("");
  const { data: teachers, isLoading } = trpc.admin.getTeachers.useQuery();

  const filteredTeachers = teachers?.filter(t => 
    `${t.firstName} ${t.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const columns = [
    {
      header: "Имя",
      accessor: (row: any) => <div className="font-medium">{row.firstName} {row.lastName}</div>
    },
    { header: "Email", accessor: "email" },
    {
      header: "Статус",
      accessor: (row: any) => (
        <Badge variant={row.isActive ? "success" : "secondary"}>
          {row.isActive ? "Активен" : "Неактивен"}
        </Badge>
      )
    },
    {
      header: "Действия",
      accessor: (row: any) => (
        <Button variant="ghost" size="sm">Редактировать</Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white">
            Учителя
          </h1>
          <p className="text-surface-500 dark:text-surface-400">
            Управление преподавательским составом
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Добавить учителя
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
          <Input 
            placeholder="Поиск по имени или email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-surface-500">Загрузка...</div>
      ) : (
        <DataTable columns={columns} data={filteredTeachers} />
      )}
    </div>
  );
}
