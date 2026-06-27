"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import AuthField from "@/components/auth/AuthField";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <form onSubmit={handleSubmit} className="w-full max-w-md rounded-md border border-border bg-card p-6 shadow-soft">
      <p className="text-sm font-medium text-primary">ورود</p>
      <h1 className="mt-2 text-2xl font-semibold text-foreground">ورود به حساب کاربری</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        برای خرید، مشاهده سفارش‌ها و مدیریت سبد خرید وارد شوید.
      </p>

      <div className="mt-6 space-y-4">
        <AuthField
          label="نام کاربری یا ایمیل"
          value={usernameOrEmail}
          onChange={setUsernameOrEmail}
          placeholder="example@email.com"
          required
        />
        <AuthField label="رمز عبور" value={password} onChange={setPassword} type="password" required />
      </div>

      {error && (
        <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" disabled={submitting} className="mt-6 w-full">
        {submitting ? "در حال ورود..." : "ورود"}
      </Button>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        حساب ندارید؟{" "}
        <Link href="/register" className="font-medium text-primary hover:text-foreground">
          ثبت نام
        </Link>
      </p>
    </form>
  );
}
