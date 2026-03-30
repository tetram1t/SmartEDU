"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function NewTestPage() {
  const router = useRouter();
  const { data: myClasses } = trpc.teacher.getMyClasses.useQuery();
  
  const generateMutation = trpc.teacher.generateTestDraft.useMutation();
  const saveMutation = trpc.teacher.saveTest.useMutation();

  const [formData, setFormData] = useState({
    subjectId: "",
    classId: "",
    topic: "",
    difficulty: "MEDIUM" as const,
    questionCount: 5,
    additionalInstructions: "",
    pdfBase64: ""
  });

  const [draft, setDraft] = useState<any>(null);

  const subjects = myClasses ? Array.from(new Map(myClasses.map(c => [c.subject.id, c.subject])).values()) : [];
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1];
      setFormData(prev => ({ ...prev, pdfBase64: base64String }));
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subjectId || !formData.topic) {
      toast.error("Заполните обязательные поля (Предмет и Тема)");
      return;
    }

    const subject = subjects.find(s => s.id === formData.subjectId);
    const selectedClassObj = myClasses?.find(c => c.class.id === formData.classId);
    const grade = selectedClassObj ? selectedClassObj.class.grade : 10;

    const difficultyMap: Record<string, 'easy' | 'medium' | 'hard' | 'mixed'> = {
      EASY: 'easy', MEDIUM: 'medium', HARD: 'hard', MIXED: 'mixed'
    };

    try {
      const result = await generateMutation.mutateAsync({
        subject: subject!.name,
        grade: grade,
        topic: formData.topic,
        difficulty: difficultyMap[formData.difficulty],
        questionCount: Number(formData.questionCount),
        additionalInstructions: formData.additionalInstructions || undefined,
        pdfBase64: formData.pdfBase64 || undefined
      });
      
      setDraft(result);
      toast.success("Тест успешно сгенерирован!");
    } catch (error: any) {
      toast.error("Ошибка при генерации: " + error.message);
    }
  };

  const handleSave = async () => {
    if (!draft) return;
    
    try {
      await saveMutation.mutateAsync({
        title: draft.title,
        description: draft.description,
        difficulty: formData.difficulty as any,
        subjectId: formData.subjectId,
        classId: formData.classId || undefined,
        questions: draft.questions
      });
      
      toast.success("Тест сохранен в базу!");
      router.push("/teacher/tests");
    } catch (error: any) {
      toast.error("Ошибка при сохранении: " + error.message);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/teacher/tests">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white">
            Генерация теста
          </h1>
          <p className="text-surface-500 dark:text-surface-400">
            Искусственный интеллект подберет вопросы и ключи для проверки
          </p>
        </div>
      </div>

      {!draft ? (
        <Card>
          <form onSubmit={handleGenerate}>
            <CardHeader>
              <CardTitle>Параметры теста</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Предмет *</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-surface-200 bg-white px-3 py-2 text-sm dark:border-surface-800 dark:bg-surface-950"
                    value={formData.subjectId}
                    onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
                    required
                  >
                    <option value="">Выберите предмет</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Класс (опционально)</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-surface-200 bg-white px-3 py-2 text-sm dark:border-surface-800 dark:bg-surface-950"
                    value={formData.classId}
                    onChange={(e) => setFormData({...formData, classId: e.target.value})}
                  >
                    <option value="">Без привязки (в банк)</option>
                    {myClasses?.filter(c => c.subject.id === formData.subjectId || !formData.subjectId).map(c => (
                      <option key={c.class.id} value={c.class.id}>
                        {c.class.name} ({c.class.year})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Тема для вопросов *</label>
                <Input 
                  placeholder="Например: Вторая мировая война" 
                  value={formData.topic}
                  onChange={(e) => setFormData({...formData, topic: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Количество вопросов</label>
                  <Input 
                    type="number" 
                    min={1} max={20}
                    value={formData.questionCount}
                    onChange={(e) => setFormData({...formData, questionCount: Number(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Уровень сложности</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-surface-200 bg-white px-3 py-2 text-sm dark:border-surface-800 dark:bg-surface-950"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value as any})}
                  >
                    <option value="EASY">Лёгкий</option>
                    <option value="MEDIUM">Средний</option>
                    <option value="HARD">Сложный</option>
                    <option value="MIXED">Смешанный</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Дополнительные инструкции для ИИ (опционально)</label>
                <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-surface-200 bg-white px-3 py-2 text-sm dark:border-surface-800 dark:bg-surface-950"
                  placeholder="Например: Вопросы только с одним правильным ответом, добавь один бонусный вопрос..."
                  value={formData.additionalInstructions}
                  onChange={(e) => setFormData({...formData, additionalInstructions: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Теория (PDF файл, опционально)</label>
                <Input 
                  type="file" 
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                <p className="text-xs text-surface-500">Загрузите PDF, чтобы ИИ брал факты строго из этого материала.</p>
              </div>

            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={generateMutation.isLoading} className="w-full">
                {generateMutation.isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {generateMutation.isLoading ? "ИИ формулирует вопросы..." : "Сгенерировать тест"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Черновик теста (редактируемый)</CardTitle>
              <CardDescription>{draft.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">Название теста</label>
                <Input 
                  value={draft.title}
                  onChange={(e) => setDraft({...draft, title: e.target.value})}
                  className="font-semibold text-lg"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-primary">Вопросы ({draft.questions.length})</label>
                {draft.questions.map((question: any, qIdx: number) => (
                  <Card key={qIdx} className="p-4 shadow-sm border-surface-200 bg-white dark:bg-surface-950 dark:border-surface-800">
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Badge>{question.points} балл.</Badge>
                        <Badge variant="outline">{question.type}</Badge>
                      </div>
                      
                      <Input 
                        value={question.text} 
                        onChange={(e) => {
                          const newQ = [...draft.questions];
                          newQ[qIdx].text = e.target.value;
                          setDraft({...draft, questions: newQ});
                        }}
                        className="font-medium"
                      />

                      {(question.type === "SINGLE_CHOICE" || question.type === "MULTIPLE_CHOICE") && question.options && (
                        <div className="pl-4 space-y-2 mt-2 border-l-2 border-surface-200 dark:border-surface-800">
                          {question.options.map((opt: string, oIdx: number) => {
                            const isCorrect = Array.isArray(question.correctAnswer) 
                                ? question.correctAnswer.includes(opt) 
                                : question.correctAnswer === opt;
                            return (
                              <div key={oIdx} className="flex gap-2 items-center">
                                {isCorrect && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                {!isCorrect && <div className="w-4 h-4 rounded-full border border-surface-300" />}
                                <Input 
                                  value={opt}
                                  onChange={(e)=>{
                                    const newQ = [...draft.questions];
                                    newQ[qIdx].options[oIdx] = e.target.value;
                                    setDraft({...draft, questions: newQ});
                                  }}
                                  className={`text-sm h-8 ${isCorrect ? 'border-green-200 bg-green-50 dark:bg-green-900/10' : ''}`}
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {question.type === "SHORT_ANSWER" && (
                        <div className="mt-2 space-y-1">
                          <label className="text-xs font-semibold text-green-600">Ключ ответа:</label>
                          <Input 
                            value={question.correctAnswer} 
                            onChange={(e)=>{
                              const newQ = [...draft.questions];
                              newQ[qIdx].correctAnswer = e.target.value;
                              setDraft({...draft, questions: newQ});
                            }}
                            className="text-sm h-8 bg-green-50"
                          />
                        </div>
                      )}
                      
                      <div className="mt-2 pt-2 border-t border-surface-100 dark:border-surface-800 text-sm">
                        <span className="font-semibold text-surface-500 text-xs uppercase">Объяснение ИИ: </span>
                        {question.explanation}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button variant="outline" onClick={() => setDraft(null)} className="flex-1">
                Отменить
              </Button>
              <Button onClick={handleSave} disabled={saveMutation.isLoading} className="flex-1">
                {saveMutation.isLoading ? <Loader2 className="mr-2 animate-spin w-4 h-4" /> : <Save className="mr-2 w-4 h-4" />}
                Сохранить в базу
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
