"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { getDefaultVariant, getVariant } from "@/lib/catalog-helpers";
import PriceTag from "./PriceTag";

export default function CompareTable({ items, sizeId: forcedSizeId }: { items: Product[]; sizeId?: string }) {
  // Sizes that every compared product really offers, so the same-size comparison never invents a price.
  const commonSizes = items.length === 0 ? [] : items[0].sizes.filter((s) => items.every((p) => p.sizes.some((x) => x.id === s.id)));
  const [pickedSize, setPickedSize] = useState("");
  if (items.length === 0) return null;
  const activeSizeId = forcedSizeId ?? (commonSizes.some((s) => s.id === pickedSize) ? pickedSize : "");
  const activeSize = commonSizes.find((s) => s.id === activeSizeId);

  const rows: { label: string; render: (p: Product) => React.ReactNode }[] = [
    { label: activeSize ? `السعر لمقاس ${activeSize.label}` : "السعر", render: (p) => {
      if (activeSize) {
        const rowsForSize = p.heights
          .map((h) => ({ h, v: getVariant(p, activeSize.id, h.id) }))
          .filter((x) => x.v);
        if (rowsForSize.length === 0) return "غير متاح بهذا المقاس";
        return (
          <ul className="space-y-1">
            {rowsForSize.map(({ h, v }) => (
              <li key={h.id} className="text-xs leading-6 text-navy/70">
                <span className="font-bold text-navy">{h.label}:</span> {v!.price.toLocaleString("ar-EG")} ج.م
              </li>
            ))}
          </ul>
        );
      }
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
  const visibleRows = (hasFirmness ? rows : rows.filter((row) => row.label !== "درجة الصلابة")).filter(
    (row) => !(activeSize && (row.label === "المقاسات المتاحة"))
  );

  return (
    <>
    {forcedSizeId === undefined && commonSizes.length > 0 && (
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label htmlFor="compare-size" className="text-sm font-bold text-navy">قارن على نفس المقاس:</label>
        <select
          id="compare-size"
          value={activeSizeId}
          onChange={(e) => setPickedSize(e.target.value)}
          className="rounded-xl border border-navy/20 bg-white px-3 py-2 text-sm font-bold text-navy"
        >
          <option value="">المقاس الافتراضي لكل موديل</option>
          {commonSizes.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>
    )}
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
    </>
  );
}
