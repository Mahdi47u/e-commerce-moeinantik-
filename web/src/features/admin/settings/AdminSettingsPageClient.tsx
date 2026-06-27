"use client";

import { Settings } from "lucide-react";
import AdminPlannedControlPage from "@/features/admin/shared/AdminPlannedControlPage";

export default function AdminSettingsPageClient() {
  return (
    <AdminPlannedControlPage
      title="تنظیمات اپلیکیشن"
      description="تنظیمات عمومی فروشگاه، پرداخت، ارسال، اطلاعات تماس و رفتارهای اصلی اپلیکیشن در این بخش کنترل می‌شوند."
      icon={Settings}
      plannedItems={[
        { title: "هویت فروشگاه", description: "نام فروشگاه، لوگو، شماره تماس، شبکه‌های اجتماعی و آدرس." },
        { title: "تنظیمات خرید", description: "حداقل مبلغ سفارش، هزینه ارسال پیش‌فرض، وضعیت فعال بودن پرداخت آنلاین." },
        { title: "تنظیمات رسانه", description: "تصویر پیش‌فرض محصول، سایزهای پیشنهادی بنر و محدودیت آپلود." },
        { title: "تنظیمات تجربه کاربری", description: "فعال یا غیرفعال کردن wishlist، دیدگاه‌ها، بلاگ و نمایش موجودی." },
      ]}
      backendEndpoints={[
        "GET /api/admin/settings",
        "PUT /api/admin/settings",
        "POST /api/admin/settings/logo",
        "GET /api/settings/public",
      ]}
    />
  );
}
