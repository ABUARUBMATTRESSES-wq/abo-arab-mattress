"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Scale } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CompareBar from "@/components/CompareBar";
import CompareTable from "@/components/CompareTable";
import ShopFilters, { defaultFilters, FilterState } from "@/components/ShopFilters";
import { products } from "@/lib/products";
import { getProductBrandId, BrandId, getConstructionClass, ConstructionClass } from "@/lib/brands";

export default function ShopPageClient() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [compareMode, setCompareMode] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const q = searchParams.get("q");
    const compareParam = searchParams.get("compare");
    const idsParam = searchParams.get("ids");

    if (category) {
      setFilters((prev) => ({ ...prev, category: category as FilterState["category"] }));
    }
    if (brand) {
      setFilters((prev) => ({ ...prev, brand: brand as BrandId }));
    }
    const construction = searchParams.get("construction");
    if (construction) {
      setFilters((prev) => ({ ...prev, construction: construction as ConstructionClass }));
    }
    if (compareParam === "1") setCompareMode(true);
    if (idsParam) setCompareIds(idsParam.split(",").filter(Boolean).slice(0, 3));
    if (q) setSearchTerm(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (filters.category !== "all" && p.category !== filters.category) return false;
      if (filters.brand !== "all" && getProductBrandId(p.name) !== filters.brand) return false;
      if (filters.springType !== "all" && p.springType !== filters.springType) return false;
      if (filters.construction !== "all" && getConstructionClass(p) !== filters.construction) return false;
      if (filters.firmness !== "all" && p.firmness !== filters.firmness) return false;
      if (!p.variantPrices.some((v) =>
        (filters.heightId === "all" || v.heightId === filters.heightId) &&
        (filters.sizeId === "all" || v.sizeId === filters.sizeId)
      )) return false;
      if (searchTerm.trim()) {
        const normalizeArabic = (s: string) =>
          s.replace(/[\u0623\u0625\u0622\u0627]/g, "\u0627").replace(/\u0629/g, "\u0647").replace(/\u0649/g, "\u064A").replace(/[\u064B-\u0652\u0670]/g, "").toLowerCase();
        const term = normalizeArabic(searchTerm.trim());
        const haystack = normalizeArabic([p.name, p.shortDescription, p.springType, ...p.specs.map((s) => s.value)].join(" "));
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }, [filters, searchTerm]);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const compareProducts = products.filter((p) => compareIds.includes(p.id));

  return (
    <>
      <Header />
      <main className="container-app py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="section-title">المتجر</h1>
            <p className="mt-1 text-sm text-navy/60">{filteredProducts.length} منتج متاح</p>
          </div>
          <button
            onClick={() => setCompareMode((v) => !v)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
              compareMode ? "border-gold bg-gold-gradient text-navy" : "border-navy/15 text-navy"
            }`}
          >
            <Scale size={18} /> وضع المقارنة
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <ShopFilters filters={filters} onChange={setFilters} />

          <div>
            {filteredProducts.length === 0 ? (
              <div className="card p-10 text-center text-navy/60">لا توجد منتجات مطابقة لهذه الفلاتر</div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    compareMode={compareMode}
                    isComparing={compareIds.includes(p.id)}
                    onToggleCompare={toggleCompare}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {compareProducts.length >= 2 && (
          <div className="mt-16">
            <h2 className="section-title mb-6">مقارنة الموديلات</h2>
            <CompareTable items={compareProducts} />
          </div>
        )}
      </main>
      <Footer />

      {compareMode && (
        <CompareBar
          compareIds={compareIds}
          onRemove={(id) => setCompareIds((prev) => prev.filter((p) => p !== id))}
          onClear={() => setCompareIds([])}
        />
      )}
    </>
  );
}
