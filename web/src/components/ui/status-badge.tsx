import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StatusTone = "success" | "warning" | "danger" | "info" | "neutral" | "premium";

const toneClassName: Record<StatusTone, string> = {
  success: "border-emerald-700/20 bg-emerald-700/10 text-emerald-800",
  warning: "border-amber-700/20 bg-amber-600/12 text-amber-800",
  danger: "border-destructive/25 bg-destructive/10 text-destructive",
  info: "border-sky-700/20 bg-sky-700/10 text-sky-800",
  neutral: "border-border bg-background text-muted-foreground",
  premium: "border-primary/25 bg-primary/10 text-primary",
};

type StatusBadgeProps = {
  tone?: StatusTone;
  children: ReactNode;
  className?: string;
};

export function StatusBadge({ tone = "neutral", children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-md border px-2.5 py-1 text-xs font-semibold leading-none",
        toneClassName[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

