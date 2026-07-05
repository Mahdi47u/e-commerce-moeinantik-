"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Eye, FolderPlus, Newspaper, Pencil, Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldRoot, SelectField, TextArea, TextInput } from "@/components/ui/field";
import { StatusBadge } from "@/components/ui/status-badge";
import { RichTextEditor } from "@/features/admin/products/RichTextEditor";
import {
  createAdminBlogCategory,
  createAdminBlogPost,
  deleteAdminBlogCategory,
  deleteAdminBlogPost,
  getAdminBlogCategories,
  getAdminBlogPosts,
  updateAdminBlogCategory,
  updateAdminBlogPost,
} from "@/services/blogService";
import type { BlogCategory, BlogCategoryPayload, BlogPost, BlogPostPayload } from "@/types/blog";

const emptyPostForm: BlogPostPayload = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImageUrl: "",
  categoryId: null,
  published: false,
  featured: false,
  seoTitle: "",
  seoDescription: "",
};

const emptyCategoryForm: BlogCategoryPayload = {
  name: "",
  slug: "",
  description: "",
  active: true,
  sortOrder: 0,
};

export function BlogAdminPanel({ token }: { token: string | null }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [postForm, setPostForm] = useState<BlogPostPayload>(emptyPostForm);
  const [categoryForm, setCategoryForm] = useState<BlogCategoryPayload>(emptyCategoryForm);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingPost, setSavingPost] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [error, setError] = useState("");

  const filteredPosts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return posts;
    return posts.filter((post) => [post.title, post.slug, post.excerpt, post.category?.name].filter(Boolean).some((value) => value?.toLowerCase().includes(normalized)));
  }, [posts, query]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    loadBlog();
  }, [token]);

  async function loadBlog() {
    if (!token) return;
    setError("");
    setLoading(true);
    try {
      const [nextPosts, nextCategories] = await Promise.all([getAdminBlogPosts(token), getAdminBlogCategories(token)]);
      setPosts(nextPosts);
      setCategories(nextCategories);
    } catch (error) {
      setError(error instanceof Error ? error.message : "دریافت اطلاعات بلاگ ناموفق بود.");
    } finally {
      setLoading(false);
    }
  }

  function startCreatePost() {
    setSelectedPostId(null);
    setPostForm(emptyPostForm);
  }

  function startEditPost(post: BlogPost) {
    setSelectedPostId(post.id);
    setPostForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      coverImageUrl: post.coverImageUrl || "",
      categoryId: post.category?.id || null,
      published: post.published,
      featured: post.featured,
      seoTitle: post.seoTitle || "",
      seoDescription: post.seoDescription || "",
    });
  }

  function startCreateCategory() {
    setSelectedCategoryId(null);
    setCategoryForm(emptyCategoryForm);
  }

  function startEditCategory(category: BlogCategory) {
    setSelectedCategoryId(category.id);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      active: category.active,
      sortOrder: category.sortOrder || 0,
    });
  }

  async function savePost(event: React.FormEvent) {
    event.preventDefault();
    if (!token) return;
    setSavingPost(true);
    setError("");
    try {
      const payload = normalizePostPayload(postForm);
      if (selectedPostId) {
        await updateAdminBlogPost(token, selectedPostId, payload);
      } else {
        await createAdminBlogPost(token, payload);
      }
      await loadBlog();
      startCreatePost();
    } catch (error) {
      setError(error instanceof Error ? error.message : "ذخیره مطلب ناموفق بود.");
    } finally {
      setSavingPost(false);
    }
  }

  async function saveCategory(event: React.FormEvent) {
    event.preventDefault();
    if (!token) return;
    setSavingCategory(true);
    setError("");
    try {
      const payload = normalizeCategoryPayload(categoryForm);
      if (selectedCategoryId) {
        await updateAdminBlogCategory(token, selectedCategoryId, payload);
      } else {
        await createAdminBlogCategory(token, payload);
      }
      await loadBlog();
      startCreateCategory();
    } catch (error) {
      setError(error instanceof Error ? error.message : "ذخیره دسته‌بندی ناموفق بود.");
    } finally {
      setSavingCategory(false);
    }
  }

  async function removePost(post: BlogPost) {
    if (!token || !window.confirm(`مطلب «${post.title}» حذف شود؟`)) return;
    setError("");
    try {
      await deleteAdminBlogPost(token, post.id);
      await loadBlog();
      if (selectedPostId === post.id) startCreatePost();
    } catch (error) {
      setError(error instanceof Error ? error.message : "حذف مطلب ناموفق بود.");
    }
  }

  async function removeCategory(category: BlogCategory) {
    if (!token || !window.confirm(`دسته «${category.name}» حذف شود؟`)) return;
    setError("");
    try {
      await deleteAdminBlogCategory(token, category.id);
      await loadBlog();
      if (selectedCategoryId === category.id) startCreateCategory();
    } catch (error) {
      setError(error instanceof Error ? error.message : "حذف دسته‌بندی ناموفق بود.");
    }
  }

  if (!token) {
    return <div className="rounded-md border border-border bg-card p-8 text-center text-sm text-muted-foreground">برای مدیریت بلاگ باید وارد حساب مدیر شوید.</div>;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <Stat label="همه مطالب" value={posts.length} />
        <Stat label="منتشر شده" value={posts.filter((post) => post.published).length} />
        <Stat label="دسته‌ها" value={categories.length} />
      </section>

      {error && <ErrorMessage message={error} />}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <TextInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="جستجو در عنوان، اسلاگ یا دسته..." className="max-w-md" />
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={loadBlog} disabled={loading}>
            <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} aria-hidden="true" />
            به‌روزرسانی
          </Button>
          <Button type="button" onClick={startCreatePost}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            مطلب جدید
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_500px]">
        <section className="rounded-md border border-border bg-card">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-foreground">مطالب بلاگ</h2>
              <p className="mt-1 text-xs text-muted-foreground">{formatNumber(filteredPosts.length)} مطلب نمایش داده می‌شود.</p>
            </div>
          </div>

          {loading ? (
            <div className="p-5 text-sm text-muted-foreground">در حال دریافت مطالب...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">مطلبی پیدا نشد.</div>
          ) : (
            filteredPosts.map((post) => (
              <article key={post.id} className="grid gap-3 border-t border-border px-4 py-4 first:border-t-0 md:grid-cols-[1fr_auto] md:items-center">
                <button type="button" onClick={() => startEditPost(post)} className="min-w-0 text-right">
                  <span className="block truncate font-semibold text-foreground">{post.title}</span>
                  <span className="mt-1 block truncate text-xs text-muted-foreground">/blog/{post.slug}</span>
                  <span className="mt-2 flex flex-wrap gap-2">
                    <StatusBadge tone={post.published ? "success" : "warning"}>{post.published ? "منتشر شده" : "پیش‌نویس"}</StatusBadge>
                    {post.featured && <StatusBadge tone="premium">ویژه</StatusBadge>}
                    {post.category && <StatusBadge tone="neutral">{post.category.name}</StatusBadge>}
                  </span>
                </button>
                <div className="flex flex-wrap items-center gap-2">
                  {post.published && (
                    <Button asChild variant="secondary" size="sm">
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        <Eye className="h-4 w-4" aria-hidden="true" />
                        مشاهده
                      </Link>
                    </Button>
                  )}
                  <button type="button" onClick={() => startEditPost(post)} className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground hover:text-primary" aria-label="ویرایش">
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => removePost(post)} className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground hover:text-destructive" aria-label="حذف">
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))
          )}
        </section>

        <div className="space-y-6">
          <form onSubmit={savePost} className="rounded-md border border-border bg-card p-5">
            <div className="mb-5 flex items-start gap-3">
              <Newspaper className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">{selectedPostId ? "ویرایش مطلب" : "مطلب جدید"}</h2>
                <p className="mt-1 text-sm text-muted-foreground">عنوان، محتوا، دسته، تصویر و وضعیت انتشار را کنترل کنید.</p>
              </div>
            </div>

            <div className="grid gap-4">
              <FieldRoot label="عنوان" required>
                <TextInput value={postForm.title} onChange={(event) => setPostForm({ ...postForm, title: event.target.value })} />
              </FieldRoot>
              <FieldRoot label="اسلاگ">
                <TextInput dir="ltr" value={postForm.slug || ""} onChange={(event) => setPostForm({ ...postForm, slug: event.target.value })} placeholder="spring-console-styling" />
              </FieldRoot>
              <FieldRoot label="دسته">
                <SelectField value={postForm.categoryId ? String(postForm.categoryId) : ""} onChange={(event) => setPostForm({ ...postForm, categoryId: event.target.value ? Number(event.target.value) : null })}>
                  <option value="">بدون دسته</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </SelectField>
              </FieldRoot>
              <FieldRoot label="خلاصه">
                <TextArea value={postForm.excerpt || ""} onChange={(event) => setPostForm({ ...postForm, excerpt: event.target.value })} />
              </FieldRoot>
              <FieldRoot label="تصویر کاور">
                <TextInput dir="ltr" value={postForm.coverImageUrl || ""} onChange={(event) => setPostForm({ ...postForm, coverImageUrl: event.target.value })} placeholder="https://..." />
              </FieldRoot>
              <FieldRoot label="متن مطلب" required>
                <RichTextEditor value={postForm.content} onChange={(content) => setPostForm({ ...postForm, content })} minHeight={260} />
              </FieldRoot>
              <div className="grid gap-2 text-sm font-semibold text-foreground sm:grid-cols-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={postForm.published} onChange={(event) => setPostForm({ ...postForm, published: event.target.checked })} />
                  منتشر شود
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={postForm.featured} onChange={(event) => setPostForm({ ...postForm, featured: event.target.checked })} />
                  مطلب ویژه
                </label>
              </div>
              <FieldRoot label="عنوان سئو">
                <TextInput value={postForm.seoTitle || ""} onChange={(event) => setPostForm({ ...postForm, seoTitle: event.target.value })} />
              </FieldRoot>
              <FieldRoot label="توضیح سئو">
                <TextArea value={postForm.seoDescription || ""} onChange={(event) => setPostForm({ ...postForm, seoDescription: event.target.value })} />
              </FieldRoot>
              <Button type="submit" loading={savingPost}>
                <Save className="h-4 w-4" aria-hidden="true" />
                ذخیره مطلب
              </Button>
            </div>
          </form>

          <form onSubmit={saveCategory} className="rounded-md border border-border bg-card p-5">
            <div className="mb-5 flex items-start gap-3">
              <FolderPlus className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">{selectedCategoryId ? "ویرایش دسته" : "دسته جدید"}</h2>
                <p className="mt-1 text-sm text-muted-foreground">دسته‌های مجله را برای فیلتر و نظم مطالب بسازید.</p>
              </div>
            </div>
            <div className="grid gap-4">
              <FieldRoot label="نام دسته" required>
                <TextInput value={categoryForm.name} onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })} />
              </FieldRoot>
              <FieldRoot label="اسلاگ">
                <TextInput dir="ltr" value={categoryForm.slug || ""} onChange={(event) => setCategoryForm({ ...categoryForm, slug: event.target.value })} />
              </FieldRoot>
              <FieldRoot label="توضیح">
                <TextArea value={categoryForm.description || ""} onChange={(event) => setCategoryForm({ ...categoryForm, description: event.target.value })} />
              </FieldRoot>
              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <input type="checkbox" checked={categoryForm.active} onChange={(event) => setCategoryForm({ ...categoryForm, active: event.target.checked })} />
                  فعال
                </label>
                <Button type="button" variant="ghost" onClick={startCreateCategory}>دسته تازه</Button>
              </div>
              <Button type="submit" loading={savingCategory}>
                <Save className="h-4 w-4" aria-hidden="true" />
                ذخیره دسته
              </Button>
            </div>

            {categories.length > 0 && (
              <div className="mt-5 space-y-2 border-t border-border pt-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between gap-3 rounded-md bg-background p-3 text-sm">
                    <button type="button" onClick={() => startEditCategory(category)} className="min-w-0 text-right">
                      <span className="block truncate font-semibold text-foreground">{category.name}</span>
                      <span className="mt-1 block truncate text-xs text-muted-foreground">{category.slug}</span>
                    </button>
                    <button type="button" onClick={() => removeCategory(category)} className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label="حذف دسته">
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground moein-tabular">{formatNumber(value)}</p>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <p className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

function normalizePostPayload(data: BlogPostPayload): BlogPostPayload {
  return {
    ...data,
    slug: data.slug?.trim() || undefined,
    excerpt: data.excerpt?.trim() || undefined,
    coverImageUrl: data.coverImageUrl?.trim() || undefined,
    categoryId: data.categoryId || null,
    seoTitle: data.seoTitle?.trim() || undefined,
    seoDescription: data.seoDescription?.trim() || undefined,
  };
}

function normalizeCategoryPayload(data: BlogCategoryPayload): BlogCategoryPayload {
  return {
    ...data,
    slug: data.slug?.trim() || undefined,
    description: data.description?.trim() || undefined,
    sortOrder: Number(data.sortOrder || 0),
  };
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}
