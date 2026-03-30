"use client";

import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, GraduationCap, BookOpen, Calendar } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function LessonDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: lesson, isLoading } = trpc.teacher.getLessonById.useQuery(id);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold">Урок не найден</h2>
        <Button asChild className="mt-4">
          <Link href="/teacher/lessons">Вернуться к списку</Link>
        </Button>
      </div>
    );
  }

  // Parse the content string back into JSON
  const content = JSON.parse(lesson.content);
  const stages = Array.isArray(content) ? content : (content.stages || []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/teacher/lessons">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white">
            {lesson.title}
          </h1>
          <div className="flex items-center gap-2 mt-1 text-sm text-surface-500">
            <Calendar className="h-3 w-3" />
            {new Date(lesson.createdAt).toLocaleDateString("ru-RU")}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>План проведения урока</CardTitle>
            <CardDescription>
              Подробная структура и активности
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2 pb-4 border-b border-surface-100 dark:border-surface-800">
              <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                <BookOpen className="h-5 w-5" /> Цель урока
              </h3>
              <p className="text-surface-700 dark:text-surface-300 italic">
                {lesson.objective}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg text-primary">Этапы урока</h3>
              {stages.map((stage: any, index: number) => (
                <div key={index} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold border border-primary/20">
                      {index + 1}
                    </div>
                    {index < stages.length - 1 && (
                      <div className="w-0.5 flex-1 bg-surface-100 dark:bg-surface-800 my-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-baseline justify-between mb-1">
                      <h4 className="font-bold text-surface-900 dark:text-white group-hover:text-primary transition-colors">
                        {stage.name}
                      </h4>
                      <Badge variant="outline" className="ml-2 font-mono">
                        {stage.duration} мин
                      </Badge>
                    </div>
                    <p className="text-sm text-surface-600 dark:text-surface-400 mb-2 leading-relaxed">
                      {stage.description}
                    </p>
                    {stage.activities && stage.activities.length > 0 && (
                      <ul className="list-disc list-inside text-xs text-surface-500 space-y-1">
                        {stage.activities.map((act: string, i: number) => (
                          <li key={i}>{act}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {content.homework && (
               <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-400 rounded-r-md">
                 <h4 className="font-bold text-yellow-800 dark:text-yellow-400 text-sm uppercase tracking-wider mb-1">Домашнее задание</h4>
                 <p className="text-sm">{content.homework}</p>
               </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Метаданные</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs text-surface-500 block">Предмет</span>
                <p className="font-medium">{lesson.subject.name}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-surface-500 block">Класс</span>
                <p className="font-medium">{lesson.class?.name || `${lesson.gradeLevel} класс`}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-surface-500 block">Общая длительность</span>
                <div className="flex items-center gap-2 font-medium">
                  <Clock className="h-4 w-4" />
                  {lesson.duration} минут
                </div>
              </div>
              <div className="pt-2">
                <Badge variant="outline" className="w-full justify-center">
                  Уровень: Стандарт
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Button variant="secondary" className="w-full" onClick={() => window.print()}>
            Распечатать план
          </Button>
        </div>
      </div>
    </div>
  );
}
