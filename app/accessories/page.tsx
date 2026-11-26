import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "الإكسسوارات",
  description: "طبقات التطرية والمخدات وواقي المرتبة من أبو عرب.",
  alternates: { canonical: "/accessories" },
};

const sections = [
  { slug: "toppers", title: "طبقات تطرية" },
  { slug: "pillows", title: "مخدات" },
  { slug: "protectors", title: "واقي مرتبة" },
] as const;

export default function AccessoriesPage() {
  return (
    <>
      <Header />
      <main className="container-app py-10">
        <div className="mb-10 text-center">
          <h1 className="section-title">الإكسسوارات</h1>
        </div>
        {sections.map((s) => {
          const items = products.filter((p) => p.category === s.slug);
          return (
            <section key={s.slug} className="mb-12">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-extrabold text-navy">{s.title} ({items.length})</h2>
                <Link href={`/shop?category=${s.slug}`} className="text-sm font-bold text-[#85691a] underline underline-offset-4">عرض الكل</Link>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                {items.slice(0, 4).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          );
        })}
      </main>
      <Footer />
    </>
  );
}
