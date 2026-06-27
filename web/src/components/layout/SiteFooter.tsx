import Link from "next/link";
import { contentNavigation, shopNavigation } from "@/config/siteNavigation";
import { BRAND_LOGO_URL } from "@/lib/brandAssets";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-card">
      <div className="container grid gap-8 py-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <Link href="/" className="inline-flex items-center" aria-label="معین آنتیک">
            <img
              src={BRAND_LOGO_URL}
              alt="معین آنتیک"
              width={180}
              height={109}
              className="h-12 w-auto object-contain dark:brightness-0 dark:invert"
            />
          </Link>
          <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
            گالری معین آنتیک برای انتخاب و خرید قطعات خاص، دکوراتیو و کلکسیونی ساخته شده است.
          </p>
        </div>

        <FooterLinkGroup title="خرید" links={shopNavigation.slice(0, 6)} />
        <FooterLinkGroup title="راهنما" links={contentNavigation} />
      </div>

      <div className="border-t border-border/70">
        <div className="container flex flex-wrap items-center justify-between gap-3 py-4 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Moein Antik</span>
          <span>طراحی شده برای تجربه خرید فارسی و راست چین</span>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <nav aria-label={title}>
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-muted-foreground transition hover:text-primary">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
