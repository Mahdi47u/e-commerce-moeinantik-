import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SiteShellProps = {
  children: ReactNode;
  contentClassName?: string;
};

export default function SiteShell({ children, contentClassName }: SiteShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className={cn("flex-1 pb-24 md:pb-0", contentClassName)}>{children}</main>
      <SiteFooter />
      <MobileBottomNav />
    </div>
  );
}
