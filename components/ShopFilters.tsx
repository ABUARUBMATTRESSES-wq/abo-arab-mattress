"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { categories, springTypesList, firmnessList, allHeightsList, allSizesList } from "@/lib/products";
import { CategorySlug, Firmness, SpringType } from "@/lib/types";
import { brands, BrandId, constructionClassesList, constructionClassLabels, ConstructionClass } from "@/lib/brands";

export interface FilterState {
  category: CategorySlug | "all";
  brand: BrandId | "all";
  springType: SpringType | "all";
  construction: ConstructionClass | "all";
  firmness: Firmness | "all";
  heightId: string | "all";
  sizeId: string | "all";
}

export const defaultFilters: FilterState = {
  category: "all",
  brand: "all",
  springType: "all",
  construction: "all",
  firmness: "all",
  heightId: "all",
  sizeId: "all",
};

export default function ShopFilters({
  filters,
  onChange,
  resultCount,
}: {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  resultCount?: number;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const update = (patch: Partial<FilterState>) => onChange({ ...filters, ...patch });

  const content = (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-sm font-extrabold text-navy">القسم</p>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={filters.category === "all"} onClick={() => update({ category: "all" })}>
            الكل
          </FilterChip>
          {categories.map((c) => (
            <FilterChip key={c.slug} active={filters.category === c.slug} onClick={() => update({ category: c.slug })}>
              {c.name}
            </FilterChip>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-extrabold text-navy">الماركة</p>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={filters.brand === "all"} onClick={() => update({ brand: "all" })}>
            كل الماركات
          </FilterChip>
          {brands.map((b) => (
            <FilterChip key={b.id} active={filters.brand === b.id} onClick={() => update({ brand: b.id })}>
              {b.name}
            </FilterChip>
          ))}
        </div>
      </div>

      {springTypesList.length > 0 && (
      <div>
        <p className="mb-2 text-sm font-extrabold text-navy">نوع السوست</p>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={filters.springType === "all"} onClick={() => update({ springType: "all" })}>
            الكل
          </FilterChip>
          {springTypesList.map((s) => (
            <FilterChip key={s} active={filters.springType === s} onClick={() => update({ springType: s })}>
              {s}
            </FilterChip>
          ))}
        </div>
      </div>
      )}

      <div>
        <p className="mb-2 text-sm font-extrabold text-navy">التصنيف حسب التصنيع</p>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={filters.construction === "all"} onClick={() => update({ construction: "all" })}>
            الكل
          </FilterChip>
          {constructionClassesList.map((c) => (
            <FilterChip key={c} active={filters.construction === c} onClick={() => update({ construction: c })}>
              {constructionClassLabels[c]}
            </FilterChip>
          ))}
        </div>
      </div>

      {firmnessList.length > 0 && (

      <div>
        <p className="mb-2 text-sm font-extrabold text-navy">درجة الصلابة</p>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={filters.firmness === "all"} onClick={() => update({ firmness: "all" })}>
            الكل
          </FilterChip>
          {firmnessList.map((f) => (
            <FilterChip key={f} active={filters.firmness === f} onClick={() => update({ firmness: f })}>
              {f}
            </FilterChip>
          ))}
        </div>
      </div>
      )}

      <div>
        <p className="mb-2 text-sm font-extrabold text-navy">الارتفاع</p>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={filters.heightId === "all"} onClick={() => update({ heightId: "all" })}>
            الكل
          </FilterChip>
          {allHeightsList.map((h) => (
            <FilterChip key={h.id} active={filters.heightId === h.id} onClick={() => update({ heightId: h.id })}>
              {h.label}
            </FilterChip>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-extrabold text-navy">المقاس</p>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={filters.sizeId === "all"} onClick={() => update({ sizeId: "all" })}>
            الكل
          </FilterChip>
          {allSizesList.map((s) => (
            <FilterChip key={s.id} active={filters.sizeId === s.id} onClick={() => update({ sizeId: s.id })}>
              {s.label}
            </FilterChip>
          ))}
        </div>
      </div>

      <button
        onClick={() => onChange(defaultFilters)}
        className="rounded-xl border border-navy/15 py-2.5 text-sm font-bold text-navy/70 hover:bg-navy/5"
      >
        إعادة ضبط الفلاتر
      </button>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="btn-outline mb-4 w-full lg:hidden"
      >
        <SlidersHorizontal size={18} /> الفلاتر
      </button>

      <aside className="card hidden h-fit p-5 lg:block">{content}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-navy/40" onClick={() => setMobileOpen(false)} />
          <div className="relative mr-auto flex h-full w-[85%] max-w-sm flex-col overflow-y-auto bg-white p-5 pb-16">
            <div className="sticky top-0 z-10 -mx-5 -mt-5 mb-4 flex items-center justify-between border-b border-navy/10 bg-white px-5 py-4">
              <p className="font-extrabold text-navy">الفلاتر</p>
              <button onClick={() => setMobileOpen(false)} aria-label="إغلاق">
                <X size={22} />
              </button>
            </div>
            {content}
            <div className="sticky bottom-14 -mx-5 mt-5 bg-white px-5 pb-2 pt-3">
              <button onClick={() => setMobileOpen(false)} className="btn-gold w-full">
                عرض النتائج{typeof resultCount === "number" ? ` (${resultCount.toLocaleString("ar-EG")})` : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
        active ? "border-gold bg-gold-gradient text-navy shadow-gold" : "border-navy/15 text-navy/70 hover:border-navy/30"
      }`}
    >
      {children}
    </button>
  );
}
