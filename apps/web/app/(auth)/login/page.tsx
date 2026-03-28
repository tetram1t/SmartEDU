import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LoginForm from "./login-form";

export const metadata = {
  title: "Вход | SmartEDU"
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  
  if (session?.user) {
    if (session.user.role === "ADMIN") redirect("/admin");
    if (session.user.role === "TEACHER") redirect("/teacher");
    if (session.user.role === "STUDENT") redirect("/student");
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 p-4 dark:bg-surface-950">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl dark:bg-surface-900">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white">
            SmartEDU
          </h1>
          <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
            Войдите в свой аккаунт
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
