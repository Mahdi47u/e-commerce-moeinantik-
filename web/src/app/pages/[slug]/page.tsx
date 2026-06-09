"use client";

import Link from "next/link";
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
      <article className="container max-w-4xl py-12">
        {loading && <div className="h-80 animate-pulse rounded-md bg-secondary" />}

        {!loading && error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
            {error}
          </div>
        )}

        {!loading && page && (
          <>
            <p className="text-sm font-medium text-primary">Moein Antik</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-foreground">{page.title}</h1>
            {page.excerpt && <p className="mt-5 text-base leading-8 text-muted-foreground">{page.excerpt}</p>}
            <div className="mt-10 whitespace-pre-line text-base leading-9 text-foreground">{page.content}</div>
            <Button asChild variant="secondary" className="mt-10">
              <Link href="/">بازگشت به صفحه اصلی</Link>
            </Button>
          </>
        )}
      </article>
    </SiteShell>
  );
}
