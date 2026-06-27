"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Eye, FileText, Pencil, Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import SiteShell from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/button";
import { FieldRoot, TextArea, TextInput } from "@/components/ui/field";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAuth } from "@/context/AuthContext";
import {
  createAdminPage,
  deleteAdminPage,
  getAdminPages,
  updateAdminPage,
  type ContentPagePayload,
} from "@/services/contentService";
import type { Role } from "@/types/auth";
import type { ContentPage } from "@/types/content";

const emptyForm: ContentPagePayload = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  published: false,
  seoTitle: "",
  seoDescription: "",
};

export default function AdminBlogPageClient() {
  const { user, token, loading: authLoading } = useAuth();
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<ContentPagePayload>(emptyForm);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const canManage = hasAdminRole(user?.roles || []);
  const editing = selectedId !== null;
  const filteredPages = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return pages;
    return pages.filter((page) => [page.title, page.slug, page.excerpt].filter(Boolean).some((value) => value?.toLowerCase().includes(normalized)));
  }, [pages, query]);

  useEffect(() => {
    if (authLoading) return;
    if (!token || !canManage) {
      setLoading(false);
      return;
    }
    loadPages();
  }, [authLoading, token, canManage]);

  async function loadPages() {
    if (!token) return;
    setError("");
    setLoading(true);
    try {
      setPages(await getAdminPages(token));
    } catch (error) {
      setError(error instanceof Error ? error.message : "دریافت نوشته‌ها ناموفق بود.");
    } finally {
      setLoading(false);
    }
  }

  function startCreate() {
    setSelectedId(null);
    setForm(emptyForm);
  }

  function startEdit(page: ContentPage) {
    setSelectedId(page.id);
    setForm({
      title: page.title,
      slug: page.slug,
      excerpt: page.excerpt || "",
      content: page.content,
      published: page.published,
      seoTitle: page.seoTitle || "",
      seoDescription: page.seoDescription || "",
    });
  }

  async function savePage(event: React.FormEvent) {
    event.preventDefault();
    if (!token) return;
    setSaving(true);
    setError("");
    try {
      const payload = normalizePayload(form);
      if (editing && selectedId) {
        await updateAdminPage(token, selectedId, payload);
      } else {
        await createAdminPage(token, payload);
      }
      await loadPages();
      startCreate();
    } catch (error) {
      setError(error instanceof Error ? error.message : "ذخیره نوشته ناموفق بود.");
    } finally {
      setSaving(false);
    }
  }

  async function removePage(page: ContentPage) {
    if (!token || !window.confirm(`نوشته «${page.title}» حذف شود؟`)) return;
    setError("");
    try {
      await deleteAdminPage(token, page.id);
      await loadPages();
      if (selectedId === page.id) startCreate();
    } catch (error) {
      setError(error instanceof Error ? error.message : "حذف نوشته ناموفق بود.");
    }
  }

  return (
    <SiteShell>
      <AdminShell
        title="مدیریت بلاگ"
        description="در این مرحله نوشته‌های بلاگ با سیستم صفحات محتوایی ذخیره می‌شوند. دسته‌بندی اختصاصی بلاگ در مرحله backend بعدی اضافه می‌شود."
        actions={
          <>
            <Button type="button" variant="secondary" onClick={loadPages} disabled={loading || !canManage}>
              <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} aria-hidden="true" />
              به‌روزرسانی
            </Button>
            <Button type="button" onClick={startCreate}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              نوشته جدید
            </Button>
          </>
        }
      >
        {!authLoading && !canManage && <AccessDenied />}
        {error && <ErrorMessage message={error} />}

        {!loading && canManage && (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_460px]">
            <div className="rounded-md border border-border bg-card">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">نوشته‌ها و صفحات</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatNumber(filteredPages.length)} مورد نمایش داده می‌شود.</p>
                </div>
                <TextInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="جستجو عنوان یا اسلاگ" className="max-w-64" />
              </div>

              {filteredPages.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">نوشته‌ای پیدا نشد.</div>
              ) : (
                filteredPages.map((page) => (
                  <div key={page.id} className="grid gap-3 border-t border-border px-4 py-4 first:border-t-0 md:grid-cols-[1fr_auto] md:items-center">
                    <button type="button" onClick={() => startEdit(page)} className="min-w-0 text-right">
                      <span className="block truncate font-semibold text-foreground">{page.title}</span>
                      <span className="mt-1 block truncate text-xs text-muted-foreground">/pages/{page.slug}</span>
                    </button>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge tone={page.published ? "success" : "warning"}>{page.published ? "منتشر شده" : "پیش‌نویس"}</StatusBadge>
                      <Button asChild variant="secondary" size="sm">
                        <Link href={`/pages/${page.slug}`} target="_blank">
                          <Eye className="h-4 w-4" aria-hidden="true" />
                          مشاهده
                        </Link>
                      </Button>
                      <button type="button" onClick={() => startEdit(page)} className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground hover:text-primary" aria-label="ویرایش">
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button type="button" onClick={() => removePage(page)} className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground hover:text-destructive" aria-label="حذف">
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={savePage} className="h-fit rounded-md border border-border bg-card p-5 xl:sticky xl:top-24">
              <div className="mb-5 flex items-start gap-3">
                <FileText className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{editing ? "ویرایش نوشته" : "نوشته جدید"}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">محتوا، انتشار و متای سئو را کنترل کنید.</p>
                </div>
              </div>

              <div className="grid gap-4">
                <FieldRoot label="عنوان" required>
                  <TextInput value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
                </FieldRoot>
                <FieldRoot label="اسلاگ">
                  <TextInput dir="ltr" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} placeholder="spring-collection-guide" />
                </FieldRoot>
                <FieldRoot label="خلاصه">
                  <TextArea value={form.excerpt} onChange={(event) => setForm({ ...form, excerpt: event.target.value })} />
                </FieldRoot>
                <FieldRoot label="متن نوشته" required>
                  <TextArea className="min-h-52" value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} />
                </FieldRoot>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <input type="checkbox" checked={form.published} onChange={(event) => setForm({ ...form, published: event.target.checked })} />
                  منتشر شود
                </label>
                <FieldRoot label="عنوان سئو">
                  <TextInput value={form.seoTitle} onChange={(event) => setForm({ ...form, seoTitle: event.target.value })} />
                </FieldRoot>
                <FieldRoot label="توضیح سئو">
                  <TextArea value={form.seoDescription} onChange={(event) => setForm({ ...form, seoDescription: event.target.value })} />
                </FieldRoot>
                <Button type="submit" loading={saving}>
                  <Save className="h-4 w-4" aria-hidden="true" />
                  ذخیره
                </Button>
              </div>
            </form>
          </div>
        )}
      </AdminShell>
    </SiteShell>
  );
}

function normalizePayload(data: ContentPagePayload): ContentPagePayload {
  return {
    ...data,
    slug: data.slug?.trim() || undefined,
    excerpt: data.excerpt?.trim() || undefined,
    seoTitle: data.seoTitle?.trim() || undefined,
    seoDescription: data.seoDescription?.trim() || undefined,
  };
}

function AccessDenied() {
  return <div className="rounded-md border border-border bg-card p-8 text-center text-sm text-muted-foreground">برای مدیریت بلاگ باید با نقش مدیر وارد شوید.</div>;
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <p className="mb-6 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

function hasAdminRole(roles: Role[]) {
  return roles.includes("ADMIN") || roles.includes("SUPERADMIN");
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}
