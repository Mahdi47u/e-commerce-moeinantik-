import { BadgeCheck, RefreshCcw, ShoppingBag, Truck } from "lucide-react";

export function TrustStrip() {
  return (
    <section className="moein-home-frame py-6 md:py-8">
      <div className="grid grid-cols-2 rounded-md border border-border bg-card px-2 py-2 sm:px-4 sm:py-5 lg:grid-cols-4">
        <TrustItem icon={<Truck className="h-7 w-7" />} title="ارسال سریع" text="به سراسر کشور" />
        <TrustItem icon={<ShoppingBag className="h-7 w-7" />} title="بسته‌بندی ویژه" text="بسته‌بندی شکیل و امن" />
        <TrustItem icon={<RefreshCcw className="h-7 w-7" />} title="۷ روز ضمانت بازگشت" text="بازگشت وجه بدون سوال" />
        <TrustItem icon={<BadgeCheck className="h-7 w-7" />} title="ضمانت اصالت کالا" text="کالای باکیفیت و اورجینال" />
      </div>
    </section>
  );
}

function TrustItem({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-center gap-2.5 border-border px-2 py-3 text-right sm:gap-4 sm:px-3 sm:py-4 lg:border-l last:lg:border-l-0">
      <span className="shrink-0 text-primary [&>svg]:h-6 [&>svg]:w-6 sm:[&>svg]:h-7 sm:[&>svg]:w-7">{icon}</span>
      <span>
        <span className="block text-[12px] font-semibold leading-5 text-foreground sm:text-sm">{title}</span>
        <span className="mt-0.5 block text-[11px] leading-5 text-muted-foreground sm:mt-1 sm:text-xs">{text}</span>
      </span>
    </div>
  );
}
