import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  label?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  align?: "start" | "center";
  size?: "page" | "section" | "compact";
  className?: string;
};

const sizeClassName = {
  page: "text-3xl leading-tight sm:text-4xl",
  section: "text-2xl leading-9 sm:text-3xl",
  compact: "text-xl leading-8",
};

export function SectionHeading({
  label,
  title,
  description,
  actions,
  align = "start",
  size = "section",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-4",
        align === "center" && "justify-center text-center",
        className
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {label && <p className="text-sm font-semibold text-primary">{label}</p>}
        <h2 className={cn("text-balance font-semibold text-foreground", label && "mt-2", sizeClassName[size])}>{title}</h2>
        {description && <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

