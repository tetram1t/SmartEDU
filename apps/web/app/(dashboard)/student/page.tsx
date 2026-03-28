import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "Дашборд Ученика | SmartEDU",
};

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white">
            Привет, {session?.user.firstName}!
          </h1>
          <p className="text-surface-500 dark:text-surface-400">
            Твоя успеваемость и задания
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Средний балл", value: "8.4", desc: "На 0.2 выше, чем в прошлом месяце" },
          { title: "Задания", value: "3", desc: "Новых заданий" },
          { title: "Тесты", value: "1", desc: "На этой неделе" },
          { title: "Пропуски", value: "0", desc: "В этой четверти" }
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm dark:border-surface-700 dark:bg-surface-900">
            <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400">{stat.title}</h3>
            <div className="mt-2 text-3xl font-bold text-surface-900 dark:text-white">{stat.value}</div>
            <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">{stat.desc}</p>
          </div>
        ))}
      </div>
      
      <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm dark:border-surface-700 dark:bg-surface-900 min-h-[300px]">
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Новые задания</h3>
        <p className="text-sm text-surface-500">У тебя нет невыполненных заданий. Молодец!</p>
      </div>
    </div>
  );
}
