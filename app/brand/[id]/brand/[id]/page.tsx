import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";
import {
  brands,
  getBrandById,
  getProductBrandId,
  getConstructionClass,
  constructionClassLabels,
  constructionClassesList,
  type BrandId,
} from "@/lib/brands";

export const dynamicParams = false;

export function generateStaticParams() {
  return brands.map((b) => ({ id: b.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const brand = brands.find((b) => b.id === params.id);
  if (!brand) return {};
  return {
    title: `منتجات ${brand.name}`,
    description: `تصفح منتجات ${brand.name} المتاحة في أبو عرب بأسعارها ومقاساتها.`,
    alternates: { canonical: `/brand/${brand.id}` },
  };
}

export default function BrandPage({ params }: { params: { id: string } }) {
  const brand = getBrandById(params.id as BrandId);
  const items = products.filter((p) => getProductBrandId(p.name) === brand.id);
  const mattresses = items.filter((p) => p.category === "mattresses");
  const types = constructionClassesList
    .map((c) => ({ c, n: mattresses.filter((p) => getConstructionClass(p) === c).length }))
    .filter((t) => t.n > 0);

  return (
    <>
      <Header />
      <main className="container-app py-10">
        <div className="mb-8 text-center">
          <img src={brand.logo} alt={`شعار ${brand.name}`} className="mx-auto mb-4 h-16 w-auto max-w-[220px] object-contain" />
          <h1 className="section-title">{brand.name}</h1>
          <p className="mt-2 text-navy/70">{items.length} منتج</p>
        </div>

        {types.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-center text-lg font-extrabold text-navy">تصفح مراتب {brand.name} حسب النوع</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {types.map(({ c, n }) => (
                <Link
                  key={c}
                  href={`/shop?brand=${brand.id}&construction=${c}`}
                  className="rounded-full border border-navy/20 px-4 py-2 text-sm font-bold text-navy transition hover:border-gold"
                >
                  {constructionClassLabels[c]} ({n})
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mb-6 text-center">
          <Link href={`/shop?brand=${brand.id}`} className="btn-gold inline-block">تصفح كل منتجات {brand.name} مع الفلاتر</Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p, i) => (
            <ProductCard key={p.id} product={p} eager={i < 4} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
