"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PackageCheck, Truck, ClipboardList, Home } from "lucide-react";

// صفحة تتبع الطلب — النسخة الفعلية
// العميل يدخل كود التتبع العشوائي الطويل اللي ظهرله في تأكيد الطلب.
// الرد من الخادم فيه حالة الطلب وملخص المنتجات فقط، بدون أي بيانات شخصية.

type TrackResult = {
  statusLabel: string;
  stepIndex: number;
  steps: string[];
  summary: string;
  city: string;
  createdAt: string;
};

const STEP_ICONS = [ClipboardList, PackageCheck, Truck, Home];

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("ar-EG", { day: "numeric", month: "long" });
}

export default function TrackPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState<"notfound" | "ratelimit" | "network" | null>(null);
  const autoRan = useRef(false);

  // لو الكود جاي في رابط التتبع: نقرأه مرة واحدة، نشيله فورًا من شريط العنوان
  // (عشان ميتسربش لأي سكربت أو مشاركة)، وبعدين نشغّل البحث تلقائيًا.
  useEffect(() => {
    if (autoRan.current) return;
    autoRan.current = true;
    const t = new URLSearchParams(window.location.search).get("token");
    if (t && /^[0-9a-f]{32}$/i.test(t)) {
      window.history.replaceState(null, "", "/track");
      const clean = t.toLowerCase();
      setCode(clean);
      void lookup(clean);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lookup = async (raw?: string) => {
    const token = (raw ?? code).trim().toLowerCase();
    if (!token) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch(`/api/track?token=${encodeURIComponent(token)}`);
      if (res.status === 404) { setError("notfound"); return; }
      if (res.status === 429) { setError("ratelimit"); return; }
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || !data.ok) { setError("network"); return; }
      setResult({
        statusLabel: String(data.statusLabel || ""),
        stepIndex: Number(data.stepIndex) || 0,
        steps: Array.isArray(data.steps) ? data.steps.map(String) : [],
        summary: String(data.summary || ""),
        city: String(data.city || ""),
        createdAt: String(data.createdAt || ""),
      });
    } catch {
      setError("network");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="container-app py-14">
        <div className="mx-auto max-w-2xl">
          <div className="mb-10 text-center">
            <h1 className="section-title">تتبع طلبك</h1>
            <p className="mt-2 text-navy/60">أدخل كود التتبع اللي ظهر لك في تأكيد الطلب عشان تعرف حالة طلبك.</p>
          </div>

          <div className="card flex flex-col gap-3 p-6 sm:flex-row">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && lookup()}
              placeholder="كود التتبع"
              className="w-full rounded-xl border border-navy/15 px-4 py-3 text-navy outline-none focus:border-navy/40"
              dir="ltr"
            />
            <button
              onClick={() => void lookup()}
              disabled={loading}
              className="rounded-xl bg-navy px-8 py-3 font-extrabold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "جاري البحث..." : "تتبع"}
            </button>
          </div>

          {error === "notfound" && (
            <p className="mt-6 rounded-xl bg-red-50 p-4 text-center font-bold text-red-700">الكود ده غير موجود. تأكد من الكود وحاول تاني.</p>
          )}
          {error === "ratelimit" && (
            <p className="mt-6 rounded-xl bg-red-50 p-4 text-center font-bold text-red-700">محاولات كتيرة في وقت قصير. استنى شوية وحاول تاني.</p>
          )}
          {error === "network" && (
            <p className="mt-6 rounded-xl bg-red-50 p-4 text-center font-bold text-red-700">حصلت مشكلة في الاتصال. حاول تاني بعد شوية.</p>
          )}

          {result && (
            <div className="card mt-8 p-6">
              <p className="font-extrabold text-navy">{result.summary}</p>
              <p className="mt-1 text-sm text-navy/60">
                {result.city && <>مدينة التسليم: {result.city}</>}
                {result.city && result.createdAt && " · "}
                {result.createdAt && <>تاريخ الطلب: {formatDate(result.createdAt)}</>}
              </p>
              <ol className="mt-6 space-y-0">
                {result.steps.map((label, i) => {
                  const done = i <= result.stepIndex;
                  const Icon = STEP_ICONS[i] ?? ClipboardList;
                  return (
                    <li key={label} className="relative flex gap-4 pb-6 last:pb-0">
                      {i < result.steps.length - 1 && (
                        <span className={`absolute right-[17px] top-10 h-full w-0.5 ${done && i < result.stepIndex ? "bg-emerald-500" : "bg-navy/10"}`} />
                      )}
                      <span className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${done ? "bg-emerald-500 text-white" : "bg-navy/10 text-navy/40"}`}>
                        <Icon size={18} />
                      </span>
                      <div className="pt-1.5">
                        <p className={`font-extrabold ${done ? "text-navy" : "text-navy/40"}`}>{label}</p>
                        {i === result.stepIndex && result.createdAt && i === 0 && (
                          <p className="text-xs text-navy/50">{formatDate(result.createdAt)}</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
