import Link from "next/link";
import { BedDouble, Sofa, ShieldCheck, Layers } from "lucide-react";
import { categories } from "@/lib/products";

const iconMap = {
  "bed-double": BedDouble,
  sofa: Sofa,
  "shield-check": ShieldCheck,
  layers: Layers,
};

export default function Categories() {
  return (
    <section className="container-app py-14">
      <div className="mb-8 text-center">
        <h2 className="section-title">تسوق حسب القسم</h2>
        <p className="mt-2 text-navy/60">كل اللي يخص نومتك في مكان واحد</p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon as keyof typeof iconMap];
          return (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="card group flex flex-col items-center gap-3 p-6 text-center transition hover:-translate-y-1 hover:border-gold"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-royal-gradient text-gold transition group-hover:scale-110">
                <Icon size={28} />
              </span>
              <p className="font-extrabold text-navy">{cat.name}</p>
              <p className="text-xs text-navy/50">{cat.description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
