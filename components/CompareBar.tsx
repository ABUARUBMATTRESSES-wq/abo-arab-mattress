"use client";

import Link from "next/link";
import { Scale, X } from "lucide-react";
import { products } from "@/lib/products";

export default function CompareBar({
  compareIds,
  onRemove,
  onClear,
}: {
  compareIds: string[];
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  if (compareIds.length === 0) return null;
  const selected = products.filter((p) => compareIds.includes(p.id));

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-navy/10 bg-white/95 shadow-luxury backdrop-blur">
      <div className="container-app flex flex-wrap items-center justify-between gap-3 py-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="flex items-center gap-1 whitespace-nowrap font-extrabold text-navy">
            <Scale size={18} className="text-gold-dark" /> المقارنة ({selected.length}/3)
          </span>
          {selected.map((p) => (
            <span
              key={p.id}
              className="flex items-center gap-1 whitespace-nowrap rounded-full bg-navy/5 px-3 py-1 text-xs font-bold text-navy"
            >
              {p.name}
              <button onClick={() => onRemove(p.id)} aria-label="إزالة">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onClear} className="text-xs font-bold text-navy/50 hover:text-navy">
            مسح الكل
          </button>
          <Link
            href={`/shop?compare=1&ids=${compareIds.join(",")}#compare-table`}
            className={`btn-gold !px-4 !py-2 text-sm ${selected.length < 2 ? "pointer-events-none opacity-40" : ""}`}
          >
            قارن الآن
          </Link>
        </div>
      </div>
    </div>
  );
}
