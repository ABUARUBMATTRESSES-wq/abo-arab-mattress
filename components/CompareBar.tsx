"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
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
  const barRef = useRef<HTMLDivElement>(null);
  const hasSelection = compareIds.length > 0;
  useEffect(() => {
    if (!hasSelection || !barRef.current) return;
    const root = document.documentElement;
    const updateHeight = () => root.style.setProperty("--compare-bar-height", `${barRef.current?.offsetHeight ?? 0}px`);
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(barRef.current);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--compare-bar-height");
    };
  }, [hasSelection]);
  if (!hasSelection) return null;
  const selected = products.filter((p) => compareIds.includes(p.id));

  return (
    <>
    <div aria-hidden="true" style={{ height: "var(--compare-bar-height, 112px)" }} />
    <div ref={barRef} className="fixed inset-x-0 bottom-0 z-40 border-t border-navy/10 bg-white/95 shadow-luxury backdrop-blur">
      <div className="container-app flex flex-wrap items-center justify-between gap-3 py-3">
        <div className="flex min-w-0 max-w-full items-center gap-2 overflow-x-auto">
          <span className="flex items-center gap-1 whitespace-nowrap font-extrabold text-navy">
            <Scale size={18} className="text-gold-dark" /> المقارنة ({selected.length}/3)
          </span>
          {selected.map((p) => (
            <span
              key={p.id}
              className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-navy/5 px-3 py-1 text-xs font-bold text-navy"
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
    </>
  );
}
