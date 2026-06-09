"use client";

import Link from "next/link";
import { Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import SiteShell from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function AccountPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <SiteShell contentClassName="container py-12">
        <div className="h-48 animate-pulse rounded-md bg-secondary" />
      </SiteShell>
    );
  }

  if (!user) {
    return (
      <SiteShell contentClassName="container flex items-center justify-center py-12">
        <div className="max-w-md rounded-md border border-border bg-card p-6 text-center shadow-soft">
          <UserRound className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
          <h1 className="mt-4 text-2xl font-semibold text-foreground">ابتدا وارد شوید</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            برای مشاهده حساب کاربری، سفارش ها و سبد خرید باید وارد حساب خود شوید.
          </p>
          <Button asChild className="mt-5">
            <Link href="/login">ورود</Link>
          </Button>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell contentClassName="container py-12">
      <section className="rounded-md border border-border bg-card p-6 shadow-soft">
        <p className="text-sm font-medium text-primary">حساب کاربری</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">{user.username}</h1>
            <p className="mt-2 text-sm text-muted-foreground">اطلاعات پایه حساب شما در معین آنتیک</p>
          </div>
          <Button asChild variant="secondary">
            <Link href="/orders">مشاهده سفارش ها</Link>
          </Button>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <Info icon={<Mail className="h-4 w-4" />} label="ایمیل" value={user.email} />
          <Info icon={<Phone className="h-4 w-4" />} label="شماره تماس" value={user.phone || "ثبت نشده"} />
          <Info icon={<UserRound className="h-4 w-4" />} label="نام" value={user.firstName || "ثبت نشده"} />
          <Info icon={<ShieldCheck className="h-4 w-4" />} label="نقش ها" value={roleLabels(user.roles)} />
        </dl>
      </section>
    </SiteShell>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background/60 p-4">
      <dt className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="mt-2 font-medium text-foreground">{value}</dd>
    </div>
  );
}

function roleLabels(roles: string[]) {
  const labels: Record<string, string> = {
    USER: "کاربر",
    ADMIN: "مدیر",
    SUPERADMIN: "مدیر کل",
  };

  return roles.map((role) => labels[role] || role).join("، ");
}
