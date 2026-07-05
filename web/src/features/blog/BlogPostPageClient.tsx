"use client";

import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import SiteShell from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/button";
import { getBlogPost } from "@/services/blogService";
import type { BlogPost } from "@/types/blog";

export default function BlogPostPageClient() {
  const params = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    getBlogPost(params.slug)
      .then((nextPost) => {
        if (active) setPost(nextPost);
      })
      .catch((error) => {
        if (active) setError(error instanceof Error ? error.message : "دریافت مطلب ناموفق بود.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [params.slug]);

  return (
    <SiteShell>
      <section className="border-b border-border/70 bg-card">
        <div className="container max-w-5xl py-10">
          <Button asChild variant="ghost" className="mb-6 px-0">
            <Link href="/blog">
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              بازگشت به مجله
            </Link>
          </Button>

          {loading && <HeaderSkeleton />}
          {!loading && error && <div className="rounded-md border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">{error}</div>}
          {!loading && post && (
            <>
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
                {post.category && <span className="rounded-md bg-primary/10 px-2 py-1 text-primary">{post.category.name}</span>}
                <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                  {new Intl.NumberFormat("fa-IR").format(post.readingMinutes)} دقیقه مطالعه
                </span>
              </div>
              <h1 className="mt-4 text-3xl font-semibold leading-tight text-foreground sm:text-5xl">{post.title}</h1>
              {post.excerpt && <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">{post.excerpt}</p>}
            </>
          )}
        </div>
      </section>

      <section className="container max-w-5xl py-10">
        {loading && <BodySkeleton />}
        {!loading && post && (
          <article className="overflow-hidden rounded-md border border-border bg-card">
            {post.coverImageUrl && (
              <div className="aspect-[1.9/1] min-h-[260px] overflow-hidden">
                <img src={post.coverImageUrl} alt={post.title} className="h-full w-full object-cover" />
              </div>
            )}
            <div
              className="max-w-none p-6 text-right text-base leading-9 text-foreground sm:p-9 [&_a]:font-semibold [&_a]:text-primary [&_blockquote]:border-r-2 [&_blockquote]:border-primary/40 [&_blockquote]:pr-4 [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:mb-2 [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pr-6 [&_p]:mb-5 [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pr-6"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        )}
      </section>
    </SiteShell>
  );
}

function HeaderSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-5 w-40 animate-pulse rounded bg-secondary" />
      <div className="h-12 w-3/4 animate-pulse rounded bg-secondary" />
      <div className="h-5 w-2/3 animate-pulse rounded bg-secondary" />
    </div>
  );
}

function BodySkeleton() {
  return <div className="h-96 animate-pulse rounded-md bg-secondary" />;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(value));
}
