import { notFound } from "next/navigation";
import AdminDashboardPageClient, { type AdminDashboardTab } from "@/features/admin/dashboard/AdminDashboardPageClient";

const dashboardTabs: AdminDashboardTab[] = ["orders", "products", "categories", "comments", "blog", "settings", "seo"];

export function generateStaticParams() {
  return dashboardTabs.map((tab) => ({ tab }));
}

export default async function AdminDashboardTabPage({ params }: { params: Promise<{ tab: string }> }) {
  const { tab } = await params;

  if (!dashboardTabs.includes(tab as AdminDashboardTab)) {
    notFound();
  }

  return <AdminDashboardPageClient initialTab={tab as AdminDashboardTab} />;
}
