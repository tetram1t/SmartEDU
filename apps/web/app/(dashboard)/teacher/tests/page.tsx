"use client";

import { trpc } from "@/lib/trpc";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileCheck, Calendar } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function TeacherTestsPage() {
  const { data: tests, isLoading } = trpc.teacher.getTests.useQuery();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white">
            Тесты
          </h1>
          <p className="text-surface-500 dark:text-surface-400">
            Сгенерированные искусственным интеллектом контрольные тесты
          </p>
        </div>
        <Button asChild>
          <Link href="/teacher/tests/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Сгенерировать тест
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-surface-500">Загрузка...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tests?.map((test) => (
            <Card key={test.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-start justify-between text-xl line-clamp-2">
                  <span>{test.title}</span>
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{test.subject.name}</Badge>
                  <Badge variant={
                    test.difficulty === "HARD" ? "destructive" : 
                    test.difficulty === "MEDIUM" ? "default" : "secondary"
                  }>
                    {test.difficulty === "EASY" ? "Лёгкий" : test.difficulty === "MEDIUM" ? "Средний" : test.difficulty === "HARD" ? "Сложный" : "Смешанный"}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center border-t border-surface-100 pt-4 dark:border-surface-800">
                <div className="flex items-center text-sm text-surface-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(test.createdAt).toLocaleDateString("ru-RU")}
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/teacher/tests/${test.id}`}>
                    <FileCheck className="h-4 w-4 mr-2" />
                    Просмотр
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
          {(!tests || tests.length === 0) && (
            <div className="col-span-full text-center py-10 border-2 border-dashed rounded-2xl border-surface-200 dark:border-surface-700">
              <p className="text-surface-500 mb-4">У вас еще нет сохраненных тестов.</p>
              <Button variant="outline" asChild>
                <Link href="/teacher/tests/new">Сгенерировать первый тест</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
