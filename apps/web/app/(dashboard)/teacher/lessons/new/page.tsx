"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save, Sparkles } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NewLessonPage() {
  const router = useRouter();
  const { data: myClasses } = trpc.teacher.getMyClasses.useQuery();
  
  const generateMutation = trpc.teacher.generateLessonDraft.useMutation();
  const saveMutation = trpc.teacher.saveLesson.useMutation();

  const [formData, setFormData] = useState({
    subjectId: "",
    classId: "",
    topic: "",
    duration: 45,
    objective: "",
    studentLevel: "mixed" as const,
    additionalInstructions: "",
    pdfBase64: ""
  });

  const [draft, setDraft] = useState<any>(null);

  // Derive unique subjects from myClasses
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
    
    // Auto-detect grade if classId is selected
    const selectedClassObj = myClasses?.find(c => c.class.id === formData.classId);
    const grade = selectedClassObj ? selectedClassObj.class.grade : 10; // default to 10 if not selected class

    try {
      const result = await generateMutation.mutateAsync({
        subject: subject!.name,
        grade: grade,
        topic: formData.topic,
        duration: Number(formData.duration),
        objective: formData.objective || undefined,
        studentLevel: formData.studentLevel,
        additionalInstructions: formData.additionalInstructions || undefined,
        pdfBase64: formData.pdfBase64 || undefined
      });
      
      setDraft(result);
      toast.success("План урока успешно сгенерирован!");
    } catch (error: any) {
      toast.error("Ошибка при генерации: " + error.message);
    }
  };

  const handleSave = async () => {
    if (!draft) return;
    
    // We could allow editing the draft state here (e.g. textareas bound to draft.title etc)
    const selectedClassObj = myClasses?.find(c => c.class.id === formData.classId);
    const grade = selectedClassObj ? selectedClassObj.class.grade : 10;
    
    try {
      await saveMutation.mutateAsync({
        title: draft.title,
        objective: draft.objective,
        content: draft.stages, // save stages directly
        gradeLevel: grade,
        duration: Number(formData.duration),
        subjectId: formData.subjectId,
        classId: formData.classId || undefined,
      });
      
      toast.success("План урока сохранен!");
      router.push("/teacher/lessons");
    } catch (error: any) {
      toast.error("Ошибка при сохранении: " + error.message);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/teacher/lessons">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white">
            Создать план урока
          </h1>
          <p className="text-surface-500 dark:text-surface-400">
            Искусственный интеллект поможет составить структуру
          </p>
        </div>
      </div>

      {!draft ? (
        <Card>
          <form onSubmit={handleGenerate}>
            <CardHeader>
              <CardTitle>Параметры урока</CardTitle>
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
                    <option value="">Без привязки</option>
                    {myClasses?.filter(c => c.subject.id === formData.subjectId || !formData.subjectId).map(c => (
                      <option key={c.class.id} value={c.class.id}>
                        {c.class.name} ({c.class.year})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Тема урока *</label>
                <Input 
                  placeholder="Например: Квадратные уравнения" 
                  value={formData.topic}
                  onChange={(e) => setFormData({...formData, topic: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Длительность (минут)</label>
                  <Input 
                    type="number" 
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Уровень подготовки</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-surface-200 bg-white px-3 py-2 text-sm dark:border-surface-800 dark:bg-surface-950"
                    value={formData.studentLevel}
                    onChange={(e) => setFormData({...formData, studentLevel: e.target.value as any})}
                  >
                    <option value="basic">Базовый</option>
                    <option value="mixed">Смешанный (стандарт)</option>
                    <option value="advanced">Углубленный</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Цель урока (опционально)</label>
                <Input 
                  placeholder="Чему должны научиться?" 
                  value={formData.objective}
                  onChange={(e) => setFormData({...formData, objective: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Дополнительные инструкции для ИИ (опционально)</label>
                <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-surface-200 bg-white px-3 py-2 text-sm dark:border-surface-800 dark:bg-surface-950"
                  placeholder="Например: Сделай акцент на историческом контексте открытия..."
                  value={formData.additionalInstructions}
                  onChange={(e) => setFormData({...formData, additionalInstructions: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Теория из учебника (PDF файл, опционально)</label>
                <Input 
                  type="file" 
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                <p className="text-xs text-surface-500">Загрузите параграф, чтобы ИИ опирался строго на материал из учебника.</p>
              </div>

            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={generateMutation.isLoading} className="w-full">
                {generateMutation.isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {generateMutation.isLoading ? "ИИ генерирует урок..." : "Сгенерировать план"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Черновик плана (редактируемый)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">Название урока</label>
                <Input 
                  value={draft.title}
                  onChange={(e) => setDraft({...draft, title: e.target.value})}
                  className="font-semibold"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">Цель урока</label>
                <Input 
                  value={draft.objective}
                  onChange={(e) => setDraft({...draft, objective: e.target.value})}
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-primary">Этапы урока</label>
                {draft.stages.map((stage: any, index: number) => (
                  <Card key={index} className="p-4 shadow-sm border-surface-200 dark:border-surface-800">
                    <div className="flex gap-4 items-start mb-2">
                      <div className="w-20 shrink-0">
                        <Input 
                          type="number" 
                          value={stage.duration} 
                          onChange={(e) => {
                            const newStages = [...draft.stages];
                            newStages[index].duration = Number(e.target.value);
                            setDraft({...draft, stages: newStages});
                          }}
                          className="h-8"
                        />
                        <span className="text-xs text-surface-500 mt-1 block text-center">минут</span>
                      </div>
                      <div className="flex-1 space-y-2">
                        <Input 
                          value={stage.name} 
                          onChange={(e) => {
                            const newStages = [...draft.stages];
                            newStages[index].name = e.target.value;
                            setDraft({...draft, stages: newStages});
                          }}
                          className="font-medium h-8"
                        />
                        <textarea 
                          className="w-full text-sm rounded-md border border-surface-200 p-2 min-h-[60px]"
                          value={stage.description}
                          onChange={(e) => {
                            const newStages = [...draft.stages];
                            newStages[index].description = e.target.value;
                            setDraft({...draft, stages: newStages});
                          }}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">Домашнее задание</label>
                <textarea 
                  className="w-full text-sm rounded-md border border-surface-200 p-2 min-h-[60px]"
                  value={draft.homework}
                  onChange={(e) => setDraft({...draft, homework: e.target.value})}
                />
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
