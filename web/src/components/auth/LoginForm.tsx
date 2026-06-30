"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail } from "lucide-react";
import AuthField from "@/components/auth/AuthField";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await login({ usernameOrEmail, password });
      router.push("/");
    } catch (error) {
      setError(error instanceof Error ? error.message : "ورود ناموفق بود.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[420px]">
      <p className="text-sm font-semibold text-primary">ورود</p>
      <h1 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
        خوش برگشتید
      </h1>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        برای مشاهده سفارش‌ها، مدیریت سبد خرید و ادامه خرید از معین آنتیک وارد شوید.
      </p>

      <div className="mt-8 space-y-5">
        <div className="relative">
          <AuthField
            label="نام کاربری یا ایمیل"
            value={usernameOrEmail}
            onChange={setUsernameOrEmail}
            placeholder="example@email.com"
            required
          />
          <Mail className="pointer-events-none absolute bottom-3.5 left-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </div>

        <div className="relative">
          <AuthField
            label="رمز عبور"
            value={password}
            onChange={setPassword}
            type="password"
            required
          />
          <LockKeyhole className="pointer-events-none absolute bottom-3.5 left-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
        <label className="inline-flex cursor-pointer items-center gap-2 text-muted-foreground">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            className="h-4 w-4 rounded border-input text-primary accent-[oklch(var(--primary))]"
          />
          مرا به خاطر بسپار
        </label>
        <span className="font-medium text-primary">فراموشی رمز عبور</span>
      </div>

      {error && (
        <p className="mt-5 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm leading-6 text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" loading={submitting} className="mt-7 w-full">
        ورود
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        حساب ندارید؟{" "}
        <Link href="/register" className="font-semibold text-primary hover:text-foreground">
          ثبت نام
        </Link>
      </p>
    </form>
  );
}
