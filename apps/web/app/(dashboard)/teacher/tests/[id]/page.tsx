"use client";

import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, GraduationCap, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function TestDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: test, isLoading } = trpc.teacher.getTestById.useQuery(id);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!test) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold">Тест не найден</h2>
        <Button asChild className="mt-4">
          <Link href="/teacher/tests">Вернуться к списку</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/teacher/tests">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white">
              {test.title}
            </h1>
            <div className="flex items-center gap-2 mt-1 text-sm text-surface-500">
               <Badge variant="outline">{test.subject.name}</Badge>
               <Badge variant="secondary">{test.class?.name || "Банк тестов"}</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">Скачать (.docx)</Button>
            <Button variant="secondary" onClick={() => window.print()}>Печать</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
                <CardTitle className="text-lg">Описание и ключи к тесту</CardTitle>
                <CardDescription>{test.description || "Автоматически сгенерированный тест."}</CardDescription>
            </CardHeader>
        </Card>

        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-surface-100 dark:border-surface-800">
            <h3 className="font-bold text-xl text-surface-900 dark:text-white">Вопросы ({test.questions.length})</h3>
            <div className="flex items-center gap-2 text-sm text-surface-500 font-medium">
                Сложность: <span className="text-primary">{test.difficulty}</span>
            </div>
          </div>

          {test.questions.map((question, qIdx) => {
            const options = question.options ? JSON.parse(question.options) : null;
            const correctAnswer = JSON.parse(question.correctAnswer);

            return (
              <Card key={question.id} className="shadow-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-md bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-xs font-bold">
                        {qIdx + 1}
                      </span>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {question.type}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        {question.points} баллов
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-relaxed">
                    {question.text}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {options && Array.isArray(options) && (
                    <div className="grid gap-2">
                      {options.map((opt: string, oIdx: number) => {
                        const isCorrect = Array.isArray(correctAnswer) 
                            ? correctAnswer.includes(opt) 
                            : correctAnswer === opt;
                        
                        return (
                          <div 
                            key={oIdx} 
                            className={`flex items-center gap-3 p-3 rounded-lg border text-sm transition-colors ${
                              isCorrect 
                                ? "border-green-200 bg-green-50 dark:bg-green-900/10 text-green-900 dark:text-green-300"
                                : "border-surface-100 dark:border-surface-800 bg-white dark:bg-surface-950"
                            }`}
                          >
                            {isCorrect ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                            ) : (
                              <Circle className="h-4 w-4 text-surface-300 shrink-0" />
                            )}
                            <span className="flex-1">{opt}</span>
                            {isCorrect && (
                                <Badge variant="secondary" className="bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 text-[9px] h-4">
                                    Верно
                                </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {!options && (
                      <div className="p-3 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-lg">
                        <span className="text-xs uppercase font-bold text-green-700 dark:text-green-400 block mb-1">Правильный ответ:</span>
                        <p className="font-semibold text-green-900 dark:text-green-200">{correctAnswer}</p>
                      </div>
                  )}

                  {question.explanation && (
                    <div className="flex gap-2 items-start mt-4 p-3 rounded-lg bg-surface-50 dark:bg-surface-900/30 text-surface-600 dark:text-surface-400 text-[13px] italic">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-surface-400" />
                      <p>
                        <span className="font-bold not-italic mr-1">Пояснение:</span>
                        {question.explanation}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
