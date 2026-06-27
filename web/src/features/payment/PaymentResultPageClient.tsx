"use client";

import Link from "next/link";
import { Suspense } from "react";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
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
  const result = paymentResult(status);

  return (
    <SiteShell>
      <section className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <div className="w-full max-w-xl rounded-md border border-border bg-card p-8 text-center shadow-soft">
          <div className={result.iconClassName}>{result.icon}</div>
          <p className="mt-5 text-sm font-medium text-primary">نتیجه پرداخت</p>
          <h1 className="mt-2 text-2xl font-semibold text-foreground">{result.title}</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">{result.description}</p>

          {refId && (
            <div className="mt-5 rounded-md border border-border bg-background p-4 text-right">
              <p className="text-xs text-muted-foreground">کد پیگیری</p>
              <p className="mt-1 break-all text-sm font-semibold text-foreground">{refId}</p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/orders">مشاهده سفارش ها</Link>
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
        <div className="h-72 w-full max-w-xl animate-pulse rounded-md bg-secondary" />
      </section>
    </SiteShell>
  );
}

function paymentResult(status: string | null) {
  if (status === "paid") {
    return {
      title: "پرداخت با موفقیت تایید شد",
      description: "سفارش شما وارد مرحله پردازش شد. وضعیت سفارش را می توانید از صفحه سفارش ها دنبال کنید.",
      iconClassName: "mx-auto grid h-14 w-14 place-items-center rounded-md bg-secondary text-primary",
      icon: <CheckCircle2 className="h-8 w-8" aria-hidden="true" />,
    };
  }

  if (status === "cancelled") {
    return {
      title: "پرداخت لغو شد",
      description: "پرداخت توسط شما یا درگاه بانکی لغو شد. سفارش همچنان در بخش سفارش ها قابل پیگیری است.",
      iconClassName: "mx-auto grid h-14 w-14 place-items-center rounded-md bg-secondary text-muted-foreground",
      icon: <Clock3 className="h-8 w-8" aria-hidden="true" />,
    };
  }

  return {
    title: "پرداخت تایید نشد",
    description: "اگر مبلغی از حساب شما کم شده باشد، طبق روال بانکی بازگشت داده می شود.",
    iconClassName: "mx-auto grid h-14 w-14 place-items-center rounded-md bg-destructive/10 text-destructive",
    icon: <XCircle className="h-8 w-8" aria-hidden="true" />,
  };
}
