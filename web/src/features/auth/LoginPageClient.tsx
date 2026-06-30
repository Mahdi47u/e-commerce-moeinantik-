import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import LoginVisualSlider from "@/features/auth/LoginVisualSlider";
import { BRAND_LOGO_URL } from "@/lib/brandAssets";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background p-4 text-foreground sm:p-6" dir="ltr">
      <div className="grid min-h-[calc(100vh-2rem)] overflow-hidden rounded-md border border-border bg-card shadow-soft sm:min-h-[calc(100vh-3rem)] lg:grid-cols-[minmax(420px,0.9fr)_minmax(0,1.1fr)]">
        <section className="flex min-h-[620px] flex-col px-5 py-6 sm:px-8 lg:px-12" dir="rtl">
          <Link href="/" className="inline-flex w-fit items-center" aria-label="معین آنتیک">
            <img
              src={BRAND_LOGO_URL}
              alt="معین آنتیک"
              width={945}
              height={573}
              className="h-16 w-auto object-contain dark:brightness-0 dark:invert"
              style={{ width: "auto", maxWidth: "168px" }}
            />
          </Link>

          <div className="flex flex-1 items-center justify-center py-10">
            <LoginForm />
          </div>
        </section>

        <LoginVisualSlider />
      </div>
    </main>
  );
}
