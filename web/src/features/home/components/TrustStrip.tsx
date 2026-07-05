import { BadgeCheck, Clock3, CreditCard, PackageCheck, Truck } from "lucide-react";

const trustItems = [
  {
    icon: <BadgeCheck />,
    title: "ضمانت اصل بودن کالا",
  },
  {
    icon: <PackageCheck />,
    title: "هفت روز ضمانت بازگشت کالا",
  },
  {
    icon: <Clock3 />,
    title: "۷ روز هفته، ۲۴ ساعته",
  },
  {
    icon: <CreditCard />,
    title: "امکان پرداخت در محل",
  },
  {
    icon: <Truck />,
    title: "امکان تحویل اکسپرس",
  },
];

export function TrustStrip() {
  return (
    <section className="moein-home-frame py-7 md:py-9">
      <div className="grid grid-cols-2 gap-x-3 gap-y-7 min-[520px]:grid-cols-3 lg:grid-cols-5" dir="rtl">
        {trustItems.map((item) => (
          <TrustItem key={item.title} icon={item.icon} title={item.title} />
        ))}
      </div>
    </section>
  );
}

function TrustItem({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex min-h-[94px] flex-col items-center justify-start text-center">
      <span className="grid h-12 w-12 place-items-center text-primary [&>svg]:h-10 [&>svg]:w-10 [&>svg]:stroke-[1.8]">
        {icon}
      </span>
      <span className="mt-3 block max-w-[10rem] text-[12px] font-semibold leading-6 text-foreground sm:text-sm">
        {title}
      </span>
    </div>
  );
}
