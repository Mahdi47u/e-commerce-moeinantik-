"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import SiteShell from "@/components/layout/SiteShell";
import { TextInput } from "@/components/ui/field";
import { getBlogCategories, getBlogPosts } from "@/services/blogService";
import type { BlogCategory, BlogPost } from "@/types/blog";

export default function BlogPageClient() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    Promise.all([
      getBlogCategories(),
      getBlogPosts({ category: selectedCategory || undefined, query: query.trim() || undefined, size: 24 }),
    ])
      .then(([nextCategories, nextPosts]) => {
        if (!active) return;
        setCategories(nextCategories);
        setPosts(nextPosts);
      })
      .catch((error) => {
        if (active) {
          setError(error instanceof Error ? error.message : "دریافت مطالب مجله ناموفق بود.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [selectedCategory, query]);

  const featuredPost = useMemo(() => posts.find((post) => post.featured) || posts[0], [posts]);
  const listPosts = featuredPost ? posts.filter((post) => post.id !== featuredPost.id) : posts;

  return (
    <SiteShell>
      <section className="border-b border-border/70 bg-card">
        <div className="moein-home-frame py-10 md:py-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.55fr)] lg:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                مجله معین آنتیک
              </span>
              <h1 className="mt-5 text-3xl font-semibold leading-tight text-foreground sm:text-5xl">
                ایده ها، راهنماها و روایت های چیدمان
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-muted-foreground sm:text-base">
                مطالبی برای انتخاب دقیق تر، نگهداری بهتر و ساختن خانه ای که قطعات خاص در آن درست دیده شوند.
              </p>
            </div>

            <label className="flex h-12 items-center gap-3 rounded-md border border-border bg-background px-4">
              <Search className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <TextInput
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="جستجو در مجله..."
                className="min-h-0 border-0 bg-transparent px-0 focus:border-0 focus:ring-0"
              />
            </label>
          </div>

          <div className="mt-8 flex gap-2 overflow-x-auto pb-1">
            <FilterButton active={!selectedCategory} onClick={() => setSelectedCategory("")}>
              همه مطالب
            </FilterButton>
            {categories.map((category) => (
              <FilterButton key={category.id} active={selectedCategory === category.slug} onClick={() => setSelectedCategory(category.slug)}>
                {category.name}
              </FilterButton>
            ))}
          </div>
        </div>
      </section>

      <section className="moein-home-frame py-10">
        {loading && <BlogGridSkeleton />}
        {!loading && error && <div className="rounded-md border border-destructive/30 bg-destructive/10 p-5 text-sm text-destructive">{error}</div>}
        {!loading && !error && posts.length === 0 && (
          <div className="rounded-md border border-border bg-card p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground">هنوز مطلبی منتشر نشده</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
              بعد از انتشار اولین نوشته، مجله اینجا نمایش داده می شود.
            </p>
          </div>
        )}

        {!loading && !error && featuredPost && (
          <div className="space-y-8">
            <FeaturedArticle post={featuredPost} />
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {listPosts.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}
      </section>
    </SiteShell>
  );
}

function FeaturedArticle({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group grid overflow-hidden rounded-md border border-border bg-card lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)]">
      <ArticleImage post={post} className="min-h-[260px] lg:min-h-[390px]" />
      <div className="flex flex-col justify-center p-6 sm:p-8">
        <ArticleMeta post={post} />
        <h2 className="mt-4 text-2xl font-semibold leading-10 text-foreground transition group-hover:text-primary sm:text-4xl sm:leading-[1.55]">{post.title}</h2>
        {post.excerpt && <p className="mt-4 line-clamp-3 text-sm leading-8 text-muted-foreground">{post.excerpt}</p>}
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
          خواندن مطلب
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

function ArticleCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group overflow-hidden rounded-md border border-border bg-card transition hover:border-primary/35 hover:shadow-soft">
      <ArticleImage post={post} className="aspect-[1.45/1]" />
      <div className="p-4">
        <ArticleMeta post={post} />
        <h2 className="mt-3 line-clamp-2 text-lg font-semibold leading-8 text-foreground transition group-hover:text-primary">{post.title}</h2>
        {post.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>}
      </div>
    </Link>
  );
}

function ArticleImage({ post, className }: { post: BlogPost; className: string }) {
  if (!post.coverImageUrl) {
    return (
      <div className={`${className} grid place-items-center bg-secondary/70 p-8 text-center`}>
        <span className="text-sm font-semibold text-muted-foreground">{post.title}</span>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <img src={post.coverImageUrl} alt={post.title} className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.035]" />
    </div>
  );
}

function ArticleMeta({ post }: { post: BlogPost }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
      {post.category && <span className="rounded-md bg-primary/10 px-2 py-1 text-primary">{post.category.name}</span>}
      <span>{formatDate(post.publishedAt || post.createdAt)}</span>
      <span>{new Intl.NumberFormat("fa-IR").format(post.readingMinutes)} دقیقه مطالعه</span>
    </div>
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={active ? "h-10 shrink-0 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground" : "h-10 shrink-0 rounded-md border border-border bg-card px-4 text-sm font-semibold text-muted-foreground transition hover:text-primary"}
    >
      {children}
    </button>
  );
}

function BlogGridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="rounded-md border border-border bg-card p-3">
          <div className="aspect-[1.45/1] animate-pulse rounded-md bg-secondary" />
          <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-secondary" />
          <div className="mt-3 h-8 w-full animate-pulse rounded bg-secondary" />
        </div>
      ))}
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(value));
}
