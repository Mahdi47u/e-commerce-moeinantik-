"use client";

import type { LucideIcon } from "lucide-react";
import { AlertCircle, CheckCircle2, Clock3 } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import SiteShell from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";

type PlannedItem = {
  title: string;
  description: string;
  ready?: boolean;
};

type AdminPlannedControlPageProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  plannedItems: PlannedItem[];
  backendEndpoints: string[];
};

export default function AdminPlannedControlPage({
  title,
  description,
  icon: Icon,
  plannedItems,
  backendEndpoints,
}: AdminPlannedControlPageProps) {
  return (
    <SiteShell>
      <AdminShell title={title} description={description}>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="rounded-md border border-border bg-card">
            <div className="flex items-start gap-3 border-b border-border px-5 py-4">
              <Icon className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">کنترل‌های مورد نیاز</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">این صفحه برای طراحی مسیر مدیریت آماده شده است. کنترل‌های وابسته به API بعد از تکمیل backend فعال می‌شوند.</p>
              </div>
            </div>

            <div className="divide-y divide-border">
              {plannedItems.map((item) => (
                <div key={item.title} className="grid gap-3 px-5 py-4 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </div>
                  <StatusBadge tone={item.ready ? "success" : "warning"}>{item.ready ? "آماده" : "نیازمند API"}</StatusBadge>
                </div>
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-md border border-border bg-card p-5 xl:sticky xl:top-24">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">مرحله backend بعدی</h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">برای فعال شدن کامل این صفحه، این endpointها یا معادل آن‌ها باید اضافه شوند.</p>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {backendEndpoints.map((endpoint) => (
                <code key={endpoint} className="block rounded-md border border-border bg-background px-3 py-2 text-left text-xs text-muted-foreground" dir="ltr">
                  {endpoint}
                </code>
              ))}
            </div>

            <div className="mt-5 rounded-md bg-background p-4">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <p className="leading-6">ظاهر صفحه آماده است، اما دکمه‌های ذخیره و حذف بعد از قرارداد API نهایی فعال می‌شوند.</p>
              </div>
            </div>

            <Button type="button" className="mt-5 w-full" disabled>
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              فعال‌سازی بعد از API
            </Button>
          </aside>
        </div>
      </AdminShell>
    </SiteShell>
  );
}
