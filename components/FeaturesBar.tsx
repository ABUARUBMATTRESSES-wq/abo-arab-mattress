import Link from "next/link";
import { BedDouble, Sofa, ShieldCheck, Layers } from "lucide-react";

const features = [
  { icon: BedDouble, title: "مراتب", desc: "موديلات ومقاسات متنوعة", href: "/shop?category=mattresses" },
  { icon: Sofa, title: "مخدات", desc: "مخدات وخداديات بأشكال مختلفة", href: "/shop?category=pillows" },
  { icon: ShieldCheck, title: "واقي مرتبة", desc: "أنواع ومقاسات مختلفة", href: "/shop?category=protectors" },
  { icon: Layers, title: "طبقات تطرية", desc: "طبقات فوق المرتبة لراحة إضافية", href: "/shop?category=toppers" },
];

export default function FeaturesBar() {
  return (
    <section className="border-y border-navy/10 bg-white">
      <div className="container-app grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
        {features.map((f) => (
          <Link key={f.title} href={f.href} className="flex items-center gap-3 text-right">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy/5 text-navy">
              <f.icon size={22} />
            </span>
            <div>
              <p className="text-sm font-extrabold text-navy">{f.title}</p>
              <p className="text-xs text-navy/60">{f.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
