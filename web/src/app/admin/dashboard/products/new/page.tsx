import AdminDashboardPageClient from "@/features/admin/dashboard/AdminDashboardPageClient";

export default function AdminDashboardNewProductPage() {
  return <AdminDashboardPageClient initialTab="products" productEditor={{ mode: "new" }} />;
}
