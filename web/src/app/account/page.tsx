"use client";

import Link from "next/link";
import SiteShell from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function AccountPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <SiteShell contentClassName="container py-16 text-muted-foreground">در حال بارگذاری...</SiteShell>;
  }

  if (!user) {
    return (
      <SiteShell contentClassName="container flex items-center justify-center py-12">
        <div className="max-w-md rounded-lg border border-border bg-card p-6 text-center shadow-soft">
          <h1 className="text-2xl font-semibold text-foreground">ابتدا وارد شوید</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            برای مشاهده حساب کاربری باید وارد حساب خود شوید.
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
      <section className="rounded-lg border border-border bg-card p-6 shadow-soft">
        <p className="text-sm font-medium text-primary">حساب کاربری</p>
        <h1 className="mt-2 text-3xl font-semibold text-foreground">{user.username}</h1>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <Info label="ایمیل" value={user.email} />
          <Info label="شماره تماس" value={user.phone || "ثبت نشده"} />
          <Info label="نام" value={user.firstName || "ثبت نشده"} />
          <Info label="نقش ها" value={user.roles.join(", ")} />
        </dl>
      </section>
    </SiteShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background/60 p-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium text-foreground">{value}</dd>
    </div>
  );
}
