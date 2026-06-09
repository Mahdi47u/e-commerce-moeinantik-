"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import AuthField from "@/components/auth/AuthField";

export default function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await register({ username, email, password, firstName, lastName, phone });
      router.push("/");
    } catch (error) {
      setError(error instanceof Error ? error.message : "ثبت نام ناموفق بود.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl rounded-lg border border-border bg-card p-6 shadow-soft">
      <p className="text-sm font-medium text-primary">ثبت نام</p>
      <h1 className="mt-2 text-2xl font-semibold text-foreground">ساخت حساب کاربری</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        برای خرید از فروشگاه معین آنتیک یک حساب کاربری بسازید.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <AuthField label="نام کاربری" value={username} onChange={setUsername} required />
        <AuthField label="ایمیل" value={email} onChange={setEmail} type="email" required />
        <AuthField label="رمز عبور" value={password} onChange={setPassword} type="password" required />
        <AuthField label="شماره تماس" value={phone} onChange={setPhone} />
        <AuthField label="نام" value={firstName} onChange={setFirstName} />
        <AuthField label="نام خانوادگی" value={lastName} onChange={setLastName} />
      </div>

      {error && (
        <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" disabled={submitting} className="mt-6 w-full">
        {submitting ? "در حال ثبت نام..." : "ثبت نام"}
      </Button>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        حساب دارید؟{" "}
        <Link href="/login" className="font-medium text-primary">
          ورود
        </Link>
      </p>
    </form>
  );
}
