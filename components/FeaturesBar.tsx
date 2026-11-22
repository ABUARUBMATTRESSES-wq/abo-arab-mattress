import { ShieldCheck, Truck, Wallet, RefreshCw } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "مراتب", desc: "موديلات ومقاسات متنوعة" },
  { icon: Truck, title: "مخدات وخداديات", desc: "تصفح الاختيارات المتاحة" },
  { icon: Wallet, title: "واقي مرتبة", desc: "تصفح الأنواع والمقاسات" },
  { icon: RefreshCw, title: "طبقات تطرية", desc: "تصفح الموديلات المتاحة" },
];

export default function FeaturesBar() {
  return (
    <section className="border-y border-navy/10 bg-white">
      <div className="container-app grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
        {features.map((f) => (
          <div key={f.title} className="flex items-center gap-3 text-right">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy/5 text-navy">
              <f.icon size={22} />
            </span>
            <div>
              <p className="text-sm font-extrabold text-navy">{f.title}</p>
              <p className="text-xs text-navy/60">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
