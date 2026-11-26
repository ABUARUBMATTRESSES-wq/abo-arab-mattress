import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { brands, getConstructionClass, constructionClassLabels, constructionClassesList } from "@/lib/brands";
import { products } from "@/lib/products";

// أبعاد الشعارات الأصلية (لتثبيت المساحة قبل التحميل)
const logoSize: Record<string, { w: number; h: number }> = {
  "/brands/taki.png": { w: 400, h: 135 },
  "/brands/1-forbed.png": { w: 200, h: 136 },
  "/brands/janssen.png": { w: 240, h: 72 },
  "/brands/englander.jpg": { w: 400, h: 209 },
  "/brands/wonderland.png": { w: 382, h: 93 },
};

export default function BrandsSection() {
  const mattresses = products.filter((p) => p.category === "mattresses");
  const types = constructionClassesList
    .map((c) => ({ c, n: mattresses.filter((p) => getConstructionClass(p) === c).length }))
    .filter((t) => t.n > 0);
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
            href={`/brand/${brand.id}`}
            className="card group flex flex-col items-center gap-4 p-5 text-center transition hover:-translate-y-1 hover:border-gold"
          >
            <span className="flex h-20 w-full items-center justify-center">
              <img
                src={brand.logo}
                alt={`شعار ${brand.name}`}
                width={logoSize[brand.logo]?.w}
                height={logoSize[brand.logo]?.h}
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
      <div className="mt-12 text-center">
        <h2 className="section-title">تسوق حسب نوع المرتبة</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {types.map(({ c, n }) => (
            <Link
              key={c}
              href={`/shop?category=mattresses&construction=${c}`}
              className="card px-5 py-3 text-sm font-extrabold text-navy transition hover:-translate-y-1 hover:border-gold"
            >
              {constructionClassLabels[c]} ({n})
            </Link>
          ))}
          <Link href="/accessories" className="card px-5 py-3 text-sm font-extrabold text-navy transition hover:-translate-y-1 hover:border-gold">
            الإكسسوارات
          </Link>
        </div>
      </div>
    </section>
  );
}
