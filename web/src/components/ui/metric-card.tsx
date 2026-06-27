import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  label: string;
  value: string;
  icon?: ReactNode;
  helper?: string;
  tone?: "neutral" | "premium" | "success" | "warning" | "danger";
  className?: string;
};

const toneClassName = {
  neutral: "text-muted-foreground",
  premium: "text-primary",
  success: "text-emerald-800",
  warning: "text-amber-800",
  danger: "text-destructive",
};

export function MetricCard({ label, value, icon, helper, tone = "premium", className }: MetricCardProps) {
  return (
    <article className={cn("rounded-md border border-border bg-card p-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
        {icon && <span className={cn("shrink-0", toneClassName[tone])}>{icon}</span>}
      </div>
      <p className="mt-3 text-xl font-semibold text-foreground moein-tabular">{value}</p>
      {helper && <p className="mt-1 text-xs leading-5 text-muted-foreground">{helper}</p>}
    </article>
  );
}

