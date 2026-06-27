"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import SiteShell from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/button";
import { getPage } from "@/services/contentService";
import type { ContentPage } from "@/types/content";

export default function ContentPageRoute() {
  const params = useParams<{ slug: string }>();
  const [page, setPage] = useState<ContentPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");

    getPage(params.slug)
      .then((nextPage) => {
        if (mounted) {
          setPage(nextPage);
        }
      })
      .catch((error) => {
        if (mounted) {
          setError(error instanceof Error ? error.message : "دریافت صفحه ناموفق بود.");
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [params.slug]);

  return (
    <SiteShell>
      <section className="border-b border-border/70 bg-card">
        <div className="container max-w-4xl py-10">
          <Button asChild variant="ghost" className="mb-6 px-0">
            <Link href="/">
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              بازگشت به صفحه اصلی
            </Link>
          </Button>

          {loading && <PageHeaderSkeleton />}

          {!loading && page && (
            <>
              <p className="text-sm font-medium text-primary">Moein Antik</p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-5xl">{page.title}</h1>
              {page.excerpt && <p className="mt-5 text-base leading-8 text-muted-foreground">{page.excerpt}</p>}
            </>
          )}

          {!loading && error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>
      </section>

      <section className="container max-w-4xl py-10">
        {loading && <PageBodySkeleton />}

        {!loading && page && (
          <article className="rounded-md border border-border bg-card p-6 sm:p-8">
            <div className="whitespace-pre-line text-base leading-9 text-foreground">{page.content}</div>
            <div className="mt-10 flex flex-wrap gap-3 border-t border-border pt-6">
              <Button asChild>
                <Link href="/products">مشاهده محصولات</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/">بازگشت به خانه</Link>
              </Button>
            </div>
          </article>
        )}

        {!loading && !page && !error && (
          <div className="rounded-md border border-border bg-card p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground">صفحه پیدا نشد</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
              ممکن است این صفحه هنوز منتشر نشده باشد یا آدرس آن تغییر کرده باشد.
            </p>
            <Button asChild className="mt-6">
              <Link href="/">بازگشت به صفحه اصلی</Link>
            </Button>
          </div>
        )}
      </section>
    </SiteShell>
  );
}

function PageHeaderSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-4 w-28 animate-pulse rounded bg-secondary" />
      <div className="h-12 w-3/4 animate-pulse rounded bg-secondary" />
      <div className="h-5 w-2/3 animate-pulse rounded bg-secondary" />
    </div>
  );
}

function PageBodySkeleton() {
  return (
    <div className="rounded-md border border-border bg-card p-6 sm:p-8">
      <div className="space-y-4">
        <div className="h-4 w-full animate-pulse rounded bg-secondary" />
        <div className="h-4 w-11/12 animate-pulse rounded bg-secondary" />
        <div className="h-4 w-10/12 animate-pulse rounded bg-secondary" />
        <div className="h-4 w-full animate-pulse rounded bg-secondary" />
        <div className="h-4 w-8/12 animate-pulse rounded bg-secondary" />
      </div>
    </div>
  );
}
