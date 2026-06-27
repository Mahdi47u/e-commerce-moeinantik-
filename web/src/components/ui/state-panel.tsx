import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, LockKeyhole, PackageSearch, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StateTone = "empty" | "error" | "loading" | "success" | "permission";

const iconByTone = {
  empty: PackageSearch,
  error: AlertCircle,
  loading: RefreshCw,
  success: CheckCircle2,
  permission: LockKeyhole,
};

type StatePanelProps = {
  tone?: StateTone;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  children?: ReactNode;
  className?: string;
};

export function StatePanel({
  tone = "empty",
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  children,
  className,
}: StatePanelProps) {
  const Icon = iconByTone[tone];
  const isLoading = tone === "loading";

  return (
    <section className={cn("rounded-md border border-border bg-card p-6 text-center", className)} aria-live={isLoading ? "polite" : undefined}>
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-md bg-primary/10 text-primary">
        <Icon className={cn("h-6 w-6", isLoading && "animate-spin")} aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-foreground">{title}</h2>
      {description && <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-muted-foreground">{description}</p>}
      {children}
      {actionLabel && actionHref && (
        <Button asChild variant="secondary" className="mt-5">
          <a href={actionHref}>{actionLabel}</a>
        </Button>
      )}
      {actionLabel && onAction && (
        <Button type="button" variant="secondary" className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </section>
  );
}

