"use client";

import { SearchCheck } from "lucide-react";
import AdminPlannedControlPage from "@/features/admin/shared/AdminPlannedControlPage";

export default function AdminSeoPageClient() {
  return (
    <AdminPlannedControlPage
      title="کنترل سئو"
      description="این صفحه جای کنترل پلاگین سئوی آینده است: متا، schema، sitemap، robots و گزارش صفحات ناقص."
      icon={SearchCheck}
      plannedItems={[
        { title: "تنظیمات متای پیش‌فرض", description: "عنوان و توضیح پیش‌فرض برای صفحه اصلی، محصولات، دسته‌بندی‌ها و بلاگ." },
        { title: "بازبینی سئوی محتوا", description: "نمایش محصول‌ها و نوشته‌هایی که عنوان یا توضیح سئو ندارند." },
        { title: "Schema و rich result", description: "فعال‌سازی Product schema، Breadcrumb schema و Organization schema." },
        { title: "Sitemap و robots", description: "کنترل آدرس‌های قابل ایندکس و تولید sitemap بعد از انتشار محتوا." },
      ]}
      backendEndpoints={[
        "GET /api/admin/seo/settings",
        "PUT /api/admin/seo/settings",
        "GET /api/admin/seo/audit",
        "POST /api/admin/seo/sitemap/rebuild",
      ]}
    />
  );
}
