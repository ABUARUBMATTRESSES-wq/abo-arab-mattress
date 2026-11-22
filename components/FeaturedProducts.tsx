import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getFeaturedProducts } from "@/lib/products";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
  const featured = getFeaturedProducts();

  return (
    <section className="bg-paper py-16">
      <div className="container-app">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="section-title">منتجات مميزة وعروض</h2>
            <p className="mt-2 text-navy/60">أكتر المنتجات مبيعاً وتقييماً عند عملائنا</p>
          </div>
          <Link href="/shop" className="hidden items-center gap-1 font-bold text-navy hover:text-gold-dark sm:flex">
            كل المنتجات <ArrowLeft size={18} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <Link href="/shop" className="btn-outline mt-8 flex w-full items-center justify-center gap-2 sm:hidden">
          كل المنتجات <ArrowLeft size={18} />
        </Link>
      </div>
    </section>
  );
}
