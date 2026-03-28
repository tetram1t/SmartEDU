"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@smartedu/shared";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (!res?.error) {
        router.refresh();
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError("Произошла ошибка при входе");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="rounded-xl bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <div className="space-y-1">
        <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          className="w-full rounded-xl border border-surface-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-surface-700 dark:bg-surface-800"
          placeholder="ivan@example.com"
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
          Пароль
        </label>
        <input
          {...register("password")}
          type="password"
          className="w-full rounded-xl border border-surface-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-surface-700 dark:bg-surface-800"
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {isLoading ? "Вход..." : "Войти"}
      </button>
    </form>
  );
}
