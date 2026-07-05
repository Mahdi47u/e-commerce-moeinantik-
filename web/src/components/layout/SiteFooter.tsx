import Link from "next/link";
import {
  ChevronUp,
  CreditCard,
  Headphones,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  PackageCheck,
  RotateCcw,
  Send,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { BRAND_LOGO_URL } from "@/lib/brandAssets";

const adminPhone = "09155733360";

const serviceItems = [
  { label: "امکان تحویل سریع", icon: Truck },
  { label: "امکان پرداخت امن", icon: CreditCard },
  { label: "۷ روز هفته پاسخگو هستیم", icon: Headphones },
  { label: "هفت روز ضمانت بازگشت", icon: RotateCcw },
  { label: "ضمانت اصالت کالا", icon: ShieldCheck },
];

const moeinLinks = [
  { href: "/blog", label: "مجله معین آنتیک" },
  { href: "/pages/about", label: "درباره گالری" },
  { href: "/pages/contact", label: "تماس با ما" },
  { href: "/pages/terms", label: "قوانین خرید" },
  { href: "/admin/dashboard", label: "ورود مدیر" },
];

const customerLinks = [
  { href: "/pages/contact", label: "پاسخ به پرسش های متداول" },
  { href: "/pages/shipping", label: "رویه ارسال سفارش" },
  { href: "/pages/terms", label: "شرایط استفاده" },
  { href: "/orders", label: "پیگیری سفارش" },
  { href: "/cart", label: "سبد خرید" },
];

const shoppingGuideLinks = [
  { href: "/products", label: "مشاهده محصولات" },
  { href: "/wishlist", label: "علاقه مندی ها" },
  { href: "/pages/shipping", label: "شیوه های پرداخت" },
  { href: "/pages/contact", label: "مشاوره خرید" },
];

const socialLinks = [
  { href: "https://instagram.com", label: "اینستاگرام", icon: Instagram },
  { href: "https://linkedin.com", label: "لینکدین", icon: Linkedin },
  { href: "https://t.me", label: "تلگرام", icon: Send },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-card text-foreground">
      <div className="container py-8 md:py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center" aria-label="معین آنتیک">
              <img
                src={BRAND_LOGO_URL}
                alt="معین آنتیک"
                width={180}
                height={109}
                className="h-14 w-auto object-contain dark:brightness-0 dark:invert"
              />
            </Link>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm leading-7 text-muted-foreground">
              <span>تلفن پشتیبانی {adminPhone}</span>
              <span className="hidden h-4 w-px bg-border md:inline-block" />
              <span>۷ روز هفته، ۲۴ ساعته پاسخگوی شما هستیم</span>
            </div>
          </div>

          <a
            href="#"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-border bg-background px-5 text-sm font-semibold text-muted-foreground transition hover:border-primary/45 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card md:self-start"
          >
            <ChevronUp className="h-4 w-4" aria-hidden="true" />
            بازگشت به بالا
          </a>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 py-10 sm:grid-cols-3 lg:grid-cols-5">
          {serviceItems.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-secondary text-primary">
                <item.icon className="h-7 w-7" strokeWidth={1.8} aria-hidden="true" />
              </div>
              <span className="text-sm font-medium text-foreground">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="grid gap-10 border-t border-border/70 pt-8 md:grid-cols-[1fr_1fr_1fr_minmax(18rem,1.15fr)] lg:gap-14">
          <FooterLinkGroup title="با معین آنتیک" links={moeinLinks} />
          <FooterLinkGroup title="خدمات مشتریان" links={customerLinks} />
          <FooterLinkGroup title="راهنمای خرید از معین آنتیک" links={shoppingGuideLinks} />

          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-foreground">همراه ما باشید</h2>
              <div className="mt-4 flex items-center gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    aria-label={link.label}
                    className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition hover:border-primary/45 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                  >
                    <link.icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            <form className="space-y-3">
              <label htmlFor="footer-email" className="block text-sm font-bold text-foreground">
                با ثبت ایمیل، از جدیدترین محصولات باخبر شوید
              </label>
              <div className="flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <Mail className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <input
                    id="footer-email"
                    type="email"
                    inputMode="email"
                    placeholder="ایمیل شما"
                    className="h-12 w-full rounded-lg border border-input bg-background pr-10 pl-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"
                  />
                </div>
                <button
                  type="submit"
                  className="h-12 shrink-0 rounded-lg bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                >
                  ثبت
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-10 grid gap-4 border-t border-border/70 pt-6 text-sm leading-7 text-muted-foreground md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <p className="max-w-3xl">
            گالری معین آنتیک مرجع انتخاب قطعات خاص دکوراتیو، آنتیک و کلکسیونی برای خانه های ایرانی است.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
              ارسال به سراسر کشور
            </span>
            <span className="inline-flex items-center gap-2">
              <PackageCheck className="h-4 w-4 text-primary" aria-hidden="true" />
              بسته بندی امن
            </span>
          </div>
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
      <h2 className="text-base font-bold text-foreground">{title}</h2>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm leading-6 text-muted-foreground transition hover:text-primary">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
