import { ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { siteConfig } from "@/lib/config";

const features = [
  { icon: ShieldCheck, title: "الضمان", desc: "تفاصيل الضمان في صفحة كل منتج" },
  {
    icon: Truck,
    title: "الشحن",
    desc: `مجاني للقاهرة والجيزة للطلبات من ${siteConfig.freeShippingThreshold.toLocaleString("ar-EG")} ${siteConfig.currency}`,
  },
  { icon: RefreshCw, title: "الاستبدال", desc: "حسب سياسة الاستبدال والاسترجاع" },
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
              {f.desc && <p className="text-xs text-navy/60">{f.desc}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
