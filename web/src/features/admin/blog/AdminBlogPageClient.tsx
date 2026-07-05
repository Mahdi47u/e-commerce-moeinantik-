"use client";

import AdminShell from "@/components/admin/AdminShell";
import SiteShell from "@/components/layout/SiteShell";
import { useAuth } from "@/context/AuthContext";
import { isAdminUser } from "@/lib/authRoles";
import { BlogAdminPanel } from "@/features/admin/blog/BlogAdminPanel";

export default function AdminBlogPageClient() {
  const { user, token, loading } = useAuth();

  return (
    <SiteShell>
      <AdminShell
        title="مدیریت بلاگ"
        description="مطالب، دسته‌بندی‌ها، وضعیت انتشار و متای سئو را برای مجله معین آنتیک مدیریت کنید."
      >
        {!loading && !isAdminUser(user) ? (
          <div className="rounded-md border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            برای مدیریت بلاگ باید با نقش مدیر وارد شوید.
          </div>
        ) : (
          <BlogAdminPanel token={token} />
        )}
      </AdminShell>
    </SiteShell>
  );
}
