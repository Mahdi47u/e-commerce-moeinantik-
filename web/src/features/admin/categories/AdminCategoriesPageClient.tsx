"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, FolderTree, Pencil, Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import SiteShell from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/button";
import { FieldRoot, SelectField, TextArea, TextInput } from "@/components/ui/field";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAuth } from "@/context/AuthContext";
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
  type CategoryPayload,
} from "@/services/catalogService";
import type { Role } from "@/types/auth";
import type { Category } from "@/types/catalog";

const emptyForm: CategoryPayload = {
  name: "",
  slug: "",
  description: "",
  parentId: null,
  active: true,
  sortOrder: 0,
  seoTitle: "",
  seoDescription: "",
};

export default function AdminCategoriesPageClient() {
  const { user, token, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<CategoryPayload>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const canManage = hasAdminRole(user?.roles || []);
  const flatCategories = useMemo(() => flattenCategories(categories), [categories]);
  const editing = selectedId !== null;

  useEffect(() => {
    if (authLoading) return;
    if (!token || !canManage) {
      setLoading(false);
      return;
    }
    loadCategories();
  }, [authLoading, token, canManage]);

  async function loadCategories() {
    if (!token) return;
    setError("");
    setLoading(true);
    try {
      setCategories(await getAdminCategories(token));
    } catch (error) {
      setError(error instanceof Error ? error.message : "دریافت دسته‌بندی‌ها ناموفق بود.");
    } finally {
      setLoading(false);
    }
  }

  function startCreate() {
    setSelectedId(null);
    setForm(emptyForm);
  }

  function startEdit(category: Category) {
    setSelectedId(category.id);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      parentId: category.parentId || null,
      active: category.active,
      sortOrder: category.sortOrder,
      seoTitle: category.seoTitle || "",
      seoDescription: category.seoDescription || "",
    });
  }

  async function saveCategory(event: React.FormEvent) {
    event.preventDefault();
    if (!token) return;

    setSaving(true);
    setError("");
    try {
      const payload = normalizePayload(form);
      if (editing && selectedId) {
        await updateAdminCategory(token, selectedId, payload);
      } else {
        await createAdminCategory(token, payload);
      }
      await loadCategories();
      startCreate();
    } catch (error) {
      setError(error instanceof Error ? error.message : "ذخیره دسته‌بندی ناموفق بود.");
    } finally {
      setSaving(false);
    }
  }

  async function removeCategory(category: Category) {
    if (!token || !window.confirm(`دسته‌بندی «${category.name}» حذف شود؟`)) return;
    setError("");
    try {
      await deleteAdminCategory(token, category.id);
      await loadCategories();
      if (selectedId === category.id) startCreate();
    } catch (error) {
      setError(error instanceof Error ? error.message : "حذف دسته‌بندی ناموفق بود.");
    }
  }

  return (
    <SiteShell>
      <AdminShell
        title="مدیریت دسته‌بندی‌ها"
        description="ساختار کاتالوگ، ترتیب نمایش، وضعیت فعال و فیلدهای سئوی دسته‌بندی‌ها را کنترل کنید."
        actions={
          <>
            <Button type="button" variant="secondary" onClick={loadCategories} disabled={loading || !canManage}>
              <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} aria-hidden="true" />
              به‌روزرسانی
            </Button>
            <Button type="button" onClick={startCreate}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              دسته جدید
            </Button>
          </>
        }
      >
        {!authLoading && !canManage && <AccessDenied />}
        {error && <ErrorMessage message={error} />}

        {!loading && canManage && (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="overflow-hidden rounded-md border border-border bg-card">
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-semibold text-foreground">دسته‌بندی‌های فعلی</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatNumber(flatCategories.length)} دسته ثبت شده است.</p>
              </div>
              {flatCategories.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">هنوز دسته‌بندی ثبت نشده است.</div>
              ) : (
                flatCategories.map(({ category, depth }) => (
                  <div key={category.id} className="flex items-center justify-between gap-3 border-t border-border px-4 py-3 first:border-t-0">
                    <button type="button" onClick={() => startEdit(category)} className="min-w-0 text-right" style={{ paddingInlineStart: depth * 18 }}>
                      <span className="block truncate text-sm font-semibold text-foreground">{category.name}</span>
                      <span className="mt-1 block truncate text-xs text-muted-foreground">/{category.slug}</span>
                    </button>
                    <div className="flex shrink-0 items-center gap-2">
                      <StatusBadge tone={category.active ? "success" : "neutral"}>{category.active ? "فعال" : "غیرفعال"}</StatusBadge>
                      <button type="button" onClick={() => startEdit(category)} className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground hover:text-primary" aria-label="ویرایش">
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button type="button" onClick={() => removeCategory(category)} className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground hover:text-destructive" aria-label="حذف">
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={saveCategory} className="h-fit rounded-md border border-border bg-card p-5 xl:sticky xl:top-24">
              <div className="mb-5 flex items-start gap-3">
                <FolderTree className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{editing ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">نام، آدرس، والد و سئوی دسته را تنظیم کنید.</p>
                </div>
              </div>

              <div className="grid gap-4">
                <FieldRoot label="نام" required>
                  <TextInput value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                </FieldRoot>
                <FieldRoot label="اسلاگ">
                  <TextInput dir="ltr" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} placeholder="decorative-vases" />
                </FieldRoot>
                <FieldRoot label="دسته والد">
                  <SelectField value={form.parentId ?? ""} onChange={(event) => setForm({ ...form, parentId: event.target.value ? Number(event.target.value) : null })}>
                    <option value="">بدون والد</option>
                    {flatCategories
                      .filter(({ category }) => category.id !== selectedId)
                      .map(({ category, depth }) => (
                        <option key={category.id} value={category.id}>
                          {"—".repeat(depth)} {category.name}
                        </option>
                      ))}
                  </SelectField>
                </FieldRoot>
                <FieldRoot label="ترتیب نمایش">
                  <TextInput type="number" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })} />
                </FieldRoot>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} />
                  فعال باشد
                </label>
                <FieldRoot label="توضیح">
                  <TextArea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
                </FieldRoot>
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

function normalizePayload(data: CategoryPayload): CategoryPayload {
  return {
    ...data,
    slug: data.slug?.trim() || undefined,
    description: data.description?.trim() || undefined,
    seoTitle: data.seoTitle?.trim() || undefined,
    seoDescription: data.seoDescription?.trim() || undefined,
  };
}

function flattenCategories(categories: Category[], depth = 0): Array<{ category: Category; depth: number }> {
  return categories.flatMap((category) => [{ category, depth }, ...flattenCategories(category.children || [], depth + 1)]);
}

function AccessDenied() {
  return <div className="rounded-md border border-border bg-card p-8 text-center text-sm text-muted-foreground">برای مدیریت دسته‌بندی‌ها باید با نقش مدیر وارد شوید.</div>;
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
