import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "Дашборд Учителя | SmartEDU",
};

export default async function TeacherDashboard() {
  const session = await getServerSession(authOptions);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white">
            Добро пожаловать, {session?.user.firstName}!
          </h1>
          <p className="text-surface-500 dark:text-surface-400">
            Здесь сводка вашей активности на сегодня.
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Placeholder for Stats Cards */}
        {[
          { title: "Классы", value: "3", desc: "Всего классов" },
          { title: "Ученики", value: "72", desc: "Всего учеников" },
          { title: "Работы", value: "14", desc: "Ожидают проверки" },
          { title: "Уроки", value: "5", desc: "Запланировано на неделю" }
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm dark:border-surface-700 dark:bg-surface-900">
            <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400">{stat.title}</h3>
            <div className="mt-2 text-3xl font-bold text-surface-900 dark:text-white">{stat.value}</div>
            <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">{stat.desc}</p>
          </div>
        ))}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm dark:border-surface-700 dark:bg-surface-900 min-h-[300px]">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Ближайшие уроки</h3>
          <p className="text-sm text-surface-500">Нет запланированных уроков</p>
        </div>
        <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm dark:border-surface-700 dark:bg-surface-900 min-h-[300px]">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Ожидают проверки</h3>
          <p className="text-sm text-surface-500">Все работы проверены!</p>
        </div>
      </div>
    </div>
  );
}
