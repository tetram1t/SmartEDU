"use client";

import { trpc } from "@/lib/trpc";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function TeacherClassesPage() {
  const { data: myClasses, isLoading } = trpc.teacher.getMyClasses.useQuery();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white">
          Мои классы
        </h1>
        <p className="text-surface-500 dark:text-surface-400">
          Классы, в которых вы преподаете предметы
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-surface-500">Загрузка...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {myClasses?.map((item, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-xl">
                  {item.class.name}
                  <Badge variant="outline">{item.class.year}</Badge>
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <BookOpen className="h-4 w-4" /> {item.subject.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center border-t border-surface-100 pt-4 dark:border-surface-800">
                <div className="flex items-center text-sm text-surface-500">
                  <Users className="h-4 w-4 mr-2" />
                </div>
                <Button size="sm" asChild>
                  <Link href={`/teacher/classes/${item.class.id}?subjectId=${item.subject.id}`}>
                    Перейти
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
          {(!myClasses || myClasses.length === 0) && (
            <div className="col-span-full text-center py-10 border-2 border-dashed rounded-2xl border-surface-200 dark:border-surface-700">
              <p className="text-surface-500">Вам пока не назначены классы.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
