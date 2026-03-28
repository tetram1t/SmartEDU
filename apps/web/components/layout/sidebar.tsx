"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Users, LayoutDashboard, FileText, Settings, GraduationCap, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Role } from "@smartedu/shared";

interface SidebarProps {
  role: Role;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const getLinks = () => {
    switch (role) {
      case Role.TEACHER:
        return [
          { href: "/teacher", label: "Дашборд", icon: LayoutDashboard },
          { href: "/teacher/classes", label: "Мои классы", icon: Users },
          { href: "/teacher/lessons", label: "Планы уроков", icon: BookOpen },
          { href: "/teacher/tests", label: "Тесты", icon: FileText },
          { href: "/teacher/works", label: "Проверка работ", icon: CheckCircle },
        ];
      case Role.STUDENT:
        return [
          { href: "/student", label: "Дашборд", icon: LayoutDashboard },
          { href: "/student/subjects", label: "Предметы", icon: BookOpen },
          { href: "/student/assignments", label: "Задания", icon: FileText },
          { href: "/student/grades", label: "Оценки", icon: CheckCircle },
        ];
      case Role.ADMIN:
        return [
          { href: "/admin", label: "Дашборд", icon: LayoutDashboard },
          { href: "/admin/school", label: "Школа", icon: GraduationCap },
          { href: "/admin/teachers", label: "Учителя", icon: Users },
          { href: "/admin/classes", label: "Классы", icon: Users },
          { href: "/admin/settings", label: "Настройки", icon: Settings },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-surface-200 bg-white pt-16 transition-transform dark:border-surface-700 dark:bg-surface-900">
      <div className="h-full overflow-y-auto px-3 pb-4">
        <ul className="space-y-2 font-medium mt-4">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "group flex items-center rounded-xl p-2 text-surface-900 hover:bg-surface-100 dark:text-white dark:hover:bg-surface-800",
                    isActive && "bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:hover:bg-primary/30"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-surface-500 transition duration-75 group-hover:text-surface-900 dark:text-surface-400 dark:group-hover:text-white")} />
                  <span className="ml-3">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
