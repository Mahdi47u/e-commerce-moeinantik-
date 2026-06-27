import { notFound } from "next/navigation";
import AdminDashboardPageClient from "@/features/admin/dashboard/AdminDashboardPageClient";

export default async function AdminDashboardEditProductPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const parsedProductId = Number(productId);

  if (!Number.isInteger(parsedProductId) || parsedProductId <= 0) {
    notFound();
  }

  return <AdminDashboardPageClient initialTab="products" productEditor={{ mode: "edit", productId: parsedProductId }} />;
}
