"use client";

import { Product } from "@/lib/types";
import { getDefaultVariant } from "@/lib/products";
import PriceTag from "./PriceTag";

export default function CompareTable({ items }: { items: Product[] }) {
  if (items.length === 0) return null;

  const rows: { label: string; render: (p: Product) => React.ReactNode }[] = [
    { label: "السعر", render: (p) => {
      const v = getDefaultVariant(p);
      if (!v) return "—";
      const size = p.sizes.find(s => s.id === v.sizeId);
      const height = p.heights.find(h => h.id === v.heightId);
      return <div className="space-y-2"><PriceTag price={v.price} originalPrice={v.originalPrice} size="sm" /><p className="text-xs leading-6 text-navy/60">المقاس: {size?.label}، الارتفاع: {height?.label}</p></div>;
    }},
    { label: "نوع السوست", render: (p) => p.springType ?? "—" },
    { label: "درجة الصلابة", render: (p) => p.firmness ?? "—" },
    { label: "الضمان", render: (p) => (p.warrantyYears > 0 ? `${p.warrantyYears} سنوات` : "—") },
    { label: "المقاسات المتاحة", render: (p) => p.sizes.map((s) => s.label).join(" / ") },
    { label: "الارتفاعات المتاحة", render: (p) => p.heights.map((h) => h.label).join(" / ") },
  ];

  // Hide a row that would be empty for every compared product.
  const hasFirmness = items.some((p) => Boolean(p.firmness));
  const visibleRows = hasFirmness ? rows : rows.filter((row) => row.label !== "درجة الصلابة");

  return (
    <div id="compare-table" className="overflow-x-auto rounded-2xl border border-navy/10">
      <table className="w-full min-w-[600px] border-collapse text-sm">
        <thead>
          <tr className="bg-navy text-white">
            <th className="sticky right-0 z-10 bg-navy p-4 text-right font-bold">المواصفات</th>
            {items.map((p) => (
              <th key={p.id} className="p-4 text-right">
                <div className="flex flex-col items-start gap-2">
                  <img src={p.images[0]} alt={p.name} className="h-16 w-16 rounded-lg object-cover" />
                  <span className="font-extrabold">{p.name}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row, idx) => (
            <tr key={row.label} className={idx % 2 === 0 ? "bg-white" : "bg-paper"}>
              <td className="sticky right-0 z-10 bg-inherit p-4 font-bold text-navy/70">{row.label}</td>
              {items.map((p) => (
                <td key={p.id} className="p-4 text-navy">
                  {row.render(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
