"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PackageCheck, Truck, ClipboardList, Home } from "lucide-react";

// ============================================================
// صفحة تتبع الطلب — نسخة معاينة تجريبية ببيانات توضيحية فقط
// النسخة النهائية: كود تتبع عشوائي طويل لكل طلب حقيقي، بدون أي بيانات ثابتة هنا
// ============================================================

type Step = { label: string; done: boolean; date?: string };
type DemoOrder = { code: string; product: string; city: string; steps: Step[] };

const DEMO_ORDERS: DemoOrder[] = [
  {
    code: "DEMO-1001",
    product: "مرتبة وندر لاند إيليت ميموري فوم — 160 × 200",
    city: "القاهرة",
    steps: [
      { label: "تم استلام الطلب", done: true, date: "22 نوفمبر" },
      { label: "جاري التجهيز", done: true, date: "23 نوفمبر" },
      { label: "خرج للشحن", done: false },
      { label: "تم التسليم", done: false },
    ],
  },
  {
    code: "DEMO-1002",
    product: "مرتبة يانسن ألمانى — 90 × 190",
    city: "الجيزة",
    steps: [
      { label: "تم استلام الطلب", done: true, date: "20 نوفمبر" },
      { label: "جاري التجهيز", done: true, date: "20 نوفمبر" },
      { label: "خرج للشحن", done: true, date: "21 نوفمبر" },
      { label: "تم التسليم", done: true, date: "22 نوفمبر" },
    ],
  },
];

const STEP_ICONS = [ClipboardList, PackageCheck, Truck, Home];

export default function TrackPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<DemoOrder | null | "notfound">(null);

  const lookup = () => {
    const found = DEMO_ORDERS.find((o) => o.code === code.trim().toUpperCase());
    setResult(found ?? "notfound");
  };

  return (
    <>
      <Header />
      <main className="container-app py-14">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 rounded-2xl border border-[#85691a]/30 bg-[#85691a]/5 p-4 text-center text-sm font-bold text-[#85691a]">
            صفحة تجريبية للمعاينة فقط — البيانات التالية توضيحية وليست طلبات حقيقية
          </div>
          <div className="mb-10 text-center">
            <h1 className="section-title">تتبع طلبك</h1>
            <p className="mt-2 text-navy/60">أدخل كود التتبع اللي وصلك وقت الطلب عشان تعرف حالة طلبك.</p>
          </div>

          <div className="card flex flex-col gap-3 p-6 sm:flex-row">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookup()}
              placeholder="كود التتبع — جرّب DEMO-1001"
              className="w-full rounded-xl border border-navy/15 px-4 py-3 text-navy outline-none focus:border-navy/40"
              dir="ltr"
            />
            <button onClick={lookup} className="rounded-xl bg-navy px-8 py-3 font-extrabold text-white transition hover:opacity-90">
              تتبع
            </button>
          </div>

          {result === "notfound" && (
            <p className="mt-6 rounded-xl bg-red-50 p-4 text-center font-bold text-red-700">الكود ده غير موجود. تأكد من الكود وحاول تاني.</p>
          )}

          {result && result !== "notfound" && (
            <div className="card mt-8 p-6">
              <p className="font-extrabold text-navy">{result.product}</p>
              <p className="mt-1 text-sm text-navy/60">مدينة التسليم: {result.city}</p>
              <ol className="mt-6 space-y-0">
                {result.steps.map((s, i) => {
                  const Icon = STEP_ICONS[i] ?? ClipboardList;
                  return (
                    <li key={s.label} className="relative flex gap-4 pb-6 last:pb-0">
                      {i < result.steps.length - 1 && (
                        <span className={`absolute right-[17px] top-10 h-full w-0.5 ${s.done ? "bg-emerald-500" : "bg-navy/10"}`} />
                      )}
                      <span className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${s.done ? "bg-emerald-500 text-white" : "bg-navy/10 text-navy/40"}`}>
                        <Icon size={18} />
                      </span>
                      <div className="pt-1.5">
                        <p className={`font-extrabold ${s.done ? "text-navy" : "text-navy/40"}`}>{s.label}</p>
                        {s.date && <p className="text-xs text-navy/50">{s.date}</p>}
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
