"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/lib/products";
import { getVariant } from "@/lib/catalog-helpers";
import { buildWhatsappLink } from "@/lib/config";
import CompareTable from "@/components/CompareTable";
import type { Product } from "@/lib/types";

const mattresses = products.filter((p) => p.category === "mattresses");
const widths = Array.from(new Set(mattresses.flatMap((p) => p.sizes.map((s) => s.widthCm ?? 0)).filter(Boolean))).sort((a, b) => a - b);
const lengths = Array.from(new Set(mattresses.flatMap((p) => p.sizes.map((s) => s.lengthCm ?? 0)).filter(Boolean))).sort((a, b) => a - b);
const springOptions = Array.from(new Set(mattresses.map((p) => p.springType).filter(Boolean))) as string[];

const selectClass = "w-full rounded-xl border border-navy/20 bg-white px-3 py-3 text-sm font-bold text-navy";

export default function AdvisorClient() {
  const params = useSearchParams();
  const qw = Number(params.get("w"));
  const ql = Number(params.get("l"));
  const [width, setWidth] = useState<number>(widths.includes(qw) ? qw : 0);
  const [length, setLength] = useState<number>(lengths.includes(ql) ? ql : 0);
  const [spring, setSpring] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [shown, setShown] = useState(12);

  const sizeId = width && length ? `${width}x${length}` : "";
  const results = useMemo(() => {
    if (!sizeId) return [] as { p: Product; opts: { hId: string; hLabel: string; price: number }[] }[];
    return mattresses
      .filter((p) => !spring || p.springType === spring)
      .map((p) => ({
        p,
        opts: p.heights
          .map((h) => ({ hId: h.id, hLabel: h.label, price: getVariant(p, sizeId, h.id)?.price ?? 0 }))
          .filter((o) => o.price > 0),
      }))
      .filter((r) => r.opts.length > 0)
      .sort((a, b) => Math.min(...a.opts.map((o) => o.price)) - Math.min(...b.opts.map((o) => o.price)));
  }, [sizeId, spring]);

  const togglePick = (id: string) =>
    setPicked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 3 ? prev : [...prev, id]));
  const pickedProducts = results.filter((r) => picked.includes(r.p.id)).map((r) => r.p);
  const customMsg = `السلام عليكم، عايز مرتبة بمقاس ${width || "..."} × ${length || "..."} سم وحابب أعرف المتاح.`;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 text-center">
        <h1 className="section-title">مساعد اختيار المرتبة</h1>
        <p className="mt-3 text-navy/70">اختار عرض وطول سريرك، وهنعرض لك الموديلات المتاحة بالمقاس ده بأسعارها الحالية.</p>
        <p className="mt-2 text-sm text-navy/60">
          مش عارف المقاس؟ <Link href="/size-guide" className="font-bold text-[#85691a] underline underline-offset-4">شوف دليل المقاسات</Link>
        </p>
      </div>

      <div className="card grid gap-4 p-5 sm:grid-cols-3">
        <div>
          <label htmlFor="adv-w" className="mb-1 block text-sm font-extrabold text-navy">العرض (سم)</label>
          <select id="adv-w" className={selectClass} value={width} onChange={(e) => { setWidth(Number(e.target.value)); setPicked([]); setShown(12); }}>
            <option value={0}>اختار العرض</option>
            {widths.map((w) => <option key={w} value={w}>{w} سم</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="adv-l" className="mb-1 block text-sm font-extrabold text-navy">الطول (سم)</label>
          <select id="adv-l" className={selectClass} value={length} onChange={(e) => { setLength(Number(e.target.value)); setPicked([]); setShown(12); }}>
            <option value={0}>اختار الطول</option>
            {lengths.map((l) => <option key={l} value={l}>{l} سم</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="adv-s" className="mb-1 block text-sm font-extrabold text-navy">نوع السوست (اختياري)</label>
          <select id="adv-s" className={selectClass} value={spring} onChange={(e) => { setSpring(e.target.value); setPicked([]); setShown(12); }}>
            <option value="">الكل</option>
            {springOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {!sizeId && <p className="mt-8 text-center text-navy/60">اختار العرض والطول لعرض الموديلات.</p>}

      {sizeId && results.length === 0 && (
        <div className="card mt-8 p-6 text-center">
          <p className="font-bold text-navy">مفيش موديل معروض بمقاس {width} × {length} سم حالياً.</p>
          <p className="mt-2 text-sm text-navy/70">بننفّذ مقاسات خاصة حسب الطلب. ابعتلنا المقاس على واتساب.</p>
          <a href={buildWhatsappLink(customMsg)} target="_blank" rel="noreferrer" className="btn-gold mt-4 inline-block">اسأل عن المقاس على واتساب</a>
        </div>
      )}

      {results.length > 0 && (
        <section className="mt-8" aria-live="polite">
          <h2 className="mb-1 text-lg font-extrabold text-navy">{results.length} موديل بمقاس {width} × {length} سم</h2>
          <p className="mb-4 text-sm text-navy/60">مرتبة من الأقل سعراً. اختار لحد ٣ موديلات لمقارنتهم على نفس المقاس.</p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {results.slice(0, Math.max(shown, 12)).map(({ p, opts }) => {
              const brand = p.specs.find((s) => s.label === "الماركة")?.value;
              const checked = picked.includes(p.id);
              return (
                <li key={p.id} className="card flex flex-col p-4">
                  <div className="flex gap-3">
                    <img src={p.images[0]} alt={p.name} loading="lazy" className="h-20 w-20 shrink-0 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <Link href={`/product/${p.slug}?size=${sizeId}`} className="font-extrabold text-navy hover:text-gold-dark">{p.name}</Link>
                      <p className="mt-1 text-xs text-navy/60">{[brand, p.springType].filter(Boolean).join(" · ")}</p>
                    </div>
                  </div>
                  <ul className="mt-3 space-y-1 text-sm">
                    {opts.map((o) => (
                      <li key={o.hId} className="flex items-center justify-between gap-2">
                        <span className="text-navy/70">ارتفاع {o.hLabel}</span>
                        <Link href={`/product/${p.slug}?size=${sizeId}&height=${o.hId}`} className="font-bold text-navy hover:text-gold-dark">
                          {o.price.toLocaleString("ar-EG")} ج.م
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <label className="mt-3 flex items-center gap-2 text-sm font-bold text-navy">
                    <input type="checkbox" checked={checked} disabled={!checked && picked.length >= 3} onChange={() => togglePick(p.id)} className="h-4 w-4" />
                    ضيفه للمقارنة
                  </label>
                </li>
              );
            })}
          </ul>
          {results.length > shown && (
            <div className="mt-6 text-center">
              <button type="button" onClick={() => setShown((n) => n + 12)} className="rounded-xl border border-navy/20 px-6 py-3 text-sm font-bold text-navy hover:border-gold">
                عرض المزيد ({Math.min(12, results.length - shown)} موديل)
              </button>
            </div>
          )}
        </section>
      )}

      {pickedProducts.length >= 2 && (
        <section className="mt-10">
          <h2 className="section-title mb-4">المقارنة على مقاس {width} × {length} سم</h2>
          <CompareTable items={pickedProducts} sizeId={sizeId} />
        </section>
      )}
    </div>
  );
}
