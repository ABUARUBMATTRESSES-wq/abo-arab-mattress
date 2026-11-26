import Link from "next/link";
import { ShieldCheck, Truck, RefreshCw, type LucideIcon } from "lucide-react";
import { siteConfig } from "@/lib/config";

const features: { icon: LucideIcon; title: string; desc: string; href?: string }[] = [
  { icon: ShieldCheck, title: "الضمان", desc: "تفاصيل الضمان في صفحة كل منتج", href: "/warranty-policy" },
  {
    icon: Truck,
    title: "الشحن",
    desc: `مجاني للقاهرة والجيزة للطلبات من ${siteConfig.freeShippingThreshold.toLocaleString("ar-EG")} ${siteConfig.currency}`,
    href: "/shipping-policy",
  },
  { icon: RefreshCw, title: "الاستبدال", desc: "حسب سياسة الاستبدال والاسترجاع", href: "/returns-policy" },
];

export default function FeaturesBar() {
  return (
    <section className="border-y border-navy/10 bg-white">
      <div className="container-app grid grid-cols-2 gap-6 py-8 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="flex items-center gap-3 text-right">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy/5 text-navy">
              <f.icon size={22} />
            </span>
            <div>
              <p className="text-sm font-extrabold text-navy">{f.title}</p>
              {f.desc &&
                (f.href ? (
                  <Link
                    href={f.href}
                    className="text-xs font-bold text-navy/70 underline decoration-gold decoration-2 underline-offset-2 hover:text-gold-dark"
                  >
                    {f.desc}
                  </Link>
                ) : (
                  <p className="text-xs text-navy/60">{f.desc}</p>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
