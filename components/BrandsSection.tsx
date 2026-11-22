import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { brands } from "@/lib/brands";

export default function BrandsSection() {
  return (
    <section className="container-app py-14">
      <div className="mb-8 text-center">
        <h2 className="section-title">تسوق حسب الماركة</h2>
        <p className="mt-2 text-navy/60">اختار ماركتك المفضلة أو تصفح كل الماركات</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/shop?brand=${brand.id}`}
            className="card group flex flex-col items-center gap-4 p-5 text-center transition hover:-translate-y-1 hover:border-gold"
          >
            <span className="flex h-20 w-full items-center justify-center">
              <img
                src={brand.logo}
                alt={`شعار ${brand.name}`}
                className="max-h-16 w-auto max-w-full object-contain transition group-hover:scale-105"
                loading="lazy"
              />
            </span>
            <span className="font-extrabold text-navy">{brand.name}</span>
          </Link>
        ))}
        <Link
          href="/shop"
          className="card group flex flex-col items-center gap-4 p-5 text-center transition hover:-translate-y-1 hover:border-gold"
        >
          <span className="flex h-20 w-full items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-royal-gradient text-gold transition group-hover:scale-110">
              <LayoutGrid size={28} />
            </span>
          </span>
          <span className="font-extrabold text-navy">كل الماركات</span>
        </Link>
      </div>
    </section>
  );
}
