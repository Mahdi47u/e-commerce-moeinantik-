"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, KeyRound, Phone } from "lucide-react";
import AuthField from "@/components/auth/AuthField";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

type OtpStep = "phone" | "code";

export default function LoginForm() {
  const router = useRouter();
  const { requestOtp, verifyOtp } = useAuth();
  const [step, setStep] = useState<OtpStep>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (step === "phone") {
        const response = await requestOtp({ phone });
        setPhone(response.phone);
        setStep("code");
        setMessage(`کد تایید برای ${response.phone} ارسال شد.`);
        return;
      }

      await verifyOtp({ phone, code });
      router.push("/");
    } catch (error) {
      setError(error instanceof Error ? error.message : "درخواست ناموفق بود.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <h1 className="mt-8 text-xl font-semibold leading-8 text-foreground">
        ورود یا ثبت‌نام در معین آنتیک
      </h1>
      <p className="mt-5 text-sm leading-7 text-muted-foreground">
        لطفا شماره موبایل خود را وارد کنید
      </p>

      <div className="mt-7 space-y-4">
        <div className="relative">
          <AuthField
            label="شماره موبایل"
            value={phone}
            onChange={setPhone}
            placeholder="09123456789"
            required
          />
          <Phone className="pointer-events-none absolute bottom-3.5 left-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </div>

        {step === "code" && (
          <div className="relative">
            <AuthField
              label="کد تایید"
              value={code}
              onChange={setCode}
              placeholder="123456"
              required
            />
            <KeyRound className="pointer-events-none absolute bottom-3.5 left-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </div>
        )}
      </div>

      {message && (
        <p className="mt-4 rounded-md border border-primary/25 bg-primary/10 px-3 py-2 text-sm leading-6 text-primary">
          {message}
        </p>
      )}

      {error && (
        <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm leading-6 text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" loading={submitting} className="mt-5 h-12 w-full">
        {step === "phone" ? "ادامه" : "ورود به معین آنتیک"}
      </Button>

      {step === "code" && (
        <button
          type="button"
          onClick={() => {
            setStep("phone");
            setCode("");
            setMessage("");
            setError("");
          }}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 text-sm font-semibold text-primary transition hover:text-foreground"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
          ویرایش شماره موبایل
        </button>
      )}

      <p className="mt-6 text-center text-xs leading-6 text-muted-foreground">
        ورود شما به معنای پذیرش شرایط استفاده و قوانین حریم خصوصی معین آنتیک است.
      </p>
    </form>
  );
}
