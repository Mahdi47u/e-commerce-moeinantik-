import Link from "next/link";
import { ArrowRight } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";
import { BRAND_LOGO_URL } from "@/lib/brandAssets";

type LoginPageClientProps = {
  initialMode?: "login" | "register";
};

export default function LoginPage({ initialMode: _initialMode = "login" }: LoginPageClientProps) {
  return (
    <main className="min-h-screen bg-card text-foreground" dir="rtl">
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <section className="w-full max-w-[500px] rounded-md border border-border bg-background px-8 py-9 shadow-[0_18px_48px_-42px_rgba(33,30,26,0.5)] sm:px-10">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="grid h-10 w-10 place-items-center rounded-md text-foreground transition hover:bg-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="بازگشت به فروشگاه"
            >
              <ArrowRight className="h-6 w-6" aria-hidden="true" />
            </Link>

            <Link href="/" className="inline-flex items-center" aria-label="معین آنتیک">
              <img
                src={BRAND_LOGO_URL}
                alt="معین آنتیک"
                width={945}
                height={573}
                className="h-14 w-auto object-contain dark:brightness-0 dark:invert"
                style={{ width: "auto", maxWidth: "170px" }}
              />
            </Link>
          </div>

          <LoginForm />
        </section>
      </div>
    </main>
  );
}
