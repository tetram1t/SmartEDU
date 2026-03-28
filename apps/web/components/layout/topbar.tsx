"use client";

import { LogOut, Bell, Search, Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import { User } from "next-auth";

interface TopBarProps {
  user: User;
}

export function TopBar({ user }: TopBarProps) {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-surface-200 bg-white dark:border-surface-700 dark:bg-surface-900">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <button className="inline-flex items-center rounded-xl p-2 text-sm text-surface-500 hover:bg-surface-100 focus:outline-none focus:ring-2 focus:ring-surface-200 sm:hidden dark:text-surface-400 dark:hover:bg-surface-700 dark:focus:ring-surface-600">
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" />
            </button>
            <a href="/" className="ms-2 flex md:me-24">
              <span className="self-center whitespace-nowrap text-xl font-bold dark:text-white sm:text-2xl">
                Smart<span className="text-primary">EDU</span>
              </span>
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden relative md:block">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Search className="h-4 w-4 text-surface-500 dark:text-surface-400" />
              </div>
              <input type="text" className="block w-full rounded-xl border border-surface-300 bg-surface-50 p-2 ps-10 text-sm focus:border-primary focus:ring-primary dark:border-surface-600 dark:bg-surface-700 dark:text-white dark:placeholder-surface-400" placeholder="Поиск..." />
            </div>
            
            <button className="relative rounded-xl p-2 text-surface-500 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-700 dark:hover:text-white">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-destructive"></span>
            </button>
            
            <div className="flex items-center ms-3 gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold dark:text-surface-50">{user.firstName} {user.lastName}</div>
                <div className="text-xs text-surface-500 dark:text-surface-400">{user.role}</div>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold cursor-pointer">
                {user.firstName[0]}{user.lastName?.[0] || ''}
              </div>
              <button 
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="rounded-xl p-2 text-surface-500 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-700 dark:hover:text-white ml-2"
                title="Выйти"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
