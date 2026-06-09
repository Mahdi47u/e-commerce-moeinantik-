"use client";

import Link from "next/link";
import { Suspense } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import SiteShell from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/button";

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<PaymentResultShell />}>
      <PaymentResultContent />
    </Suspense>
  );
}

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const refId = searchParams.get("refId");
  const paid = status === "paid";

  return (
    <SiteShell>
      <section className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <div className="w-full max-w-xl rounded-md border border-border bg-card p-8 text-center shadow-soft">
          {paid ? (
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" aria-hidden="true" />
          ) : (
            <XCircle className="mx-auto h-12 w-12 text-destructive" aria-hidden="true" />
          )}
          <h1 className="mt-5 text-2xl font-semibold text-foreground">
            {paid ? "پرداخت با موفقیت تایید شد" : "پرداخت تایید نشد"}
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {paid
              ? "سفارش شما وارد مرحله پردازش شد."
              : "اگر مبلغی از حساب شما کم شده باشد، طبق روال بانکی بازگشت داده می‌شود."}
          </p>
          {refId && (
            <p className="mt-4 rounded-md border border-border bg-background p-3 text-sm font-medium text-foreground">
              کد پیگیری: {refId}
            </p>
          )}
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild>
              <Link href="/orders">مشاهده سفارش‌ها</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/products">ادامه خرید</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function PaymentResultShell() {
  return (
    <SiteShell>
      <section className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <div className="h-64 w-full max-w-xl animate-pulse rounded-md bg-secondary" />
      </section>
    </SiteShell>
  );
}
