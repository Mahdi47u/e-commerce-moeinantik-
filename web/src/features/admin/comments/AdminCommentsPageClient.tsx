"use client";

import { MessageSquareText } from "lucide-react";
import AdminPlannedControlPage from "@/features/admin/shared/AdminPlannedControlPage";

export default function AdminCommentsPageClient() {
  return (
    <AdminPlannedControlPage
      title="مدیریت دیدگاه‌ها"
      description="دیدگاه‌های محصولات و بلاگ باید از این صفحه تایید، رد، پاسخ داده یا گزارش شوند."
      icon={MessageSquareText}
      plannedItems={[
        { title: "صف بررسی دیدگاه‌ها", description: "نمایش دیدگاه‌های در انتظار تایید با فیلتر محصول، نوشته، وضعیت و تاریخ." },
        { title: "تایید یا رد دیدگاه", description: "مدیر بتواند دیدگاه را منتشر، رد یا به عنوان اسپم علامت‌گذاری کند." },
        { title: "پاسخ مدیر", description: "امکان ثبت پاسخ رسمی فروشگاه زیر دیدگاه مشتری." },
        { title: "گزارش کیفیت", description: "شمار دیدگاه‌های تایید شده، رد شده و در انتظار بررسی." },
      ]}
      backendEndpoints={[
        "GET /api/admin/comments",
        "PUT /api/admin/comments/{id}/status",
        "POST /api/admin/comments/{id}/reply",
        "DELETE /api/admin/comments/{id}",
      ]}
    />
  );
}
